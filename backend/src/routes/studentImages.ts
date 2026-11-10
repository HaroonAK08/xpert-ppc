import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import multer from 'multer';
import path from 'path';
import { randomBytes } from 'crypto';
import { open, unlink } from 'fs/promises';
import { UPLOAD_DIR, persistUploadedFile } from '../middleware/upload';

const router = Router();
const MAX_BYTES = 10 * 1024 * 1024;
const types = new Set(['image/jpeg', 'image/png', 'image/webp']);
const receiveImage = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_BYTES, files: 1, fields: 0, parts: 1 },
  fileFilter: (_req, file, cb) => {
    if (!types.has(file.mimetype)) return cb(new Error('Invalid image type'));
    cb(null, true);
  },
}).single('file');

function imageType(buffer: Buffer): { mime: string; ext: string } | null {
  if (buffer.length >= 3 && buffer.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))) {
    return { mime: 'image/jpeg', ext: '.jpg' };
  }
  if (buffer.length >= 8 && buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
    return { mime: 'image/png', ext: '.png' };
  }
  if (buffer.length >= 12 && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') {
    return { mime: 'image/webp', ext: '.webp' };
  }
  return null;
}

// Signup happens before login. Keep this separate from the admin file uploader.
router.post(
  '/',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 60,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { error: 'Too many image uploads. Please try again in a few minutes.' },
  }),
  (req, res) => {
    receiveImage(req, res, (err: unknown) => {
      if (err) {
        const status = err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
        res.status(status).json({ error: status === 413 ? 'Image must be 10 MB or smaller.' : 'Please upload one JPG, PNG, or WebP image.' });
        return;
      }
      void (async () => {
        const file = req.file;
        const detected = file && imageType(file.buffer);
        if (!file || !detected || detected.mime !== file.mimetype) {
          res.status(400).json({ error: 'Please upload a valid JPG, PNG, or WebP image.' });
          return;
        }
        const filename = `${randomBytes(24).toString('hex')}${detected.ext}`;
        const localPath = path.join(UPLOAD_DIR, filename);
        let written = false;
        try {
          const handle = await open(localPath, 'wx', 0o600);
          written = true;
          try {
            await handle.writeFile(file.buffer);
          } finally {
            await handle.close();
          }
          const url = await persistUploadedFile({ ...file, filename, path: localPath });
          res.status(201).json({ url });
        } catch (error) {
          if (written) await unlink(localPath).catch(() => undefined);
          console.error('Student image storage failed', error);
          res.status(503).json({ error: 'Image storage is unavailable. Please try again shortly.' });
        }
      })().catch((error) => {
        console.error('Student image upload failed', error);
        if (!res.headersSent) res.status(500).json({ error: 'Image upload failed. Please try again.' });
      });
    });
  }
);

export default router;
