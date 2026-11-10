import { Router } from 'express';
import { isValidObjectId } from 'mongoose';
import { z } from 'zod';
import { Announcement, serializeAnnouncement } from '../models/Announcement';
import { requireAuth, requireRole, requireApprovedStudent } from '../middleware/auth';
import { ApiError, asyncHandler } from '../middleware/error';

export const adminAnnouncementsRouter = Router();
export const studentAnnouncementsRouter = Router();
adminAnnouncementsRouter.use(requireAuth, requireRole('admin'));
studentAnnouncementsRouter.use(requireApprovedStudent);

const messageSchema = z.object({
  title: z.string().trim().min(1).max(160),
  body: z.string().trim().min(1).max(4000),
});
const visibilitySchema = z.object({ published: z.boolean() });

function listMessages(studentOnly: boolean) {
  return asyncHandler(async (req, res) => {
    const page = Number(req.query.page || 1);
    if (!Number.isInteger(page) || page < 1 || page > 100000) throw new ApiError(400, 'Choose a valid page.');
    const filter = studentOnly ? { published: true } : {};
    const pageSize = 20;
    const [items, total] = await Promise.all([
      Announcement.find(filter).sort({ createdAt: -1, _id: -1 }).skip((page - 1) * pageSize).limit(pageSize),
      Announcement.countDocuments(filter),
    ]);
    res.json({ items: items.map(serializeAnnouncement), total, page, pageSize });
  });
}

adminAnnouncementsRouter.get('/', listMessages(false));
studentAnnouncementsRouter.get('/', listMessages(true));
adminAnnouncementsRouter.post('/', asyncHandler(async (req, res) => {
  const parsed = messageSchema.safeParse(req.body);
  if (!parsed.success) throw new ApiError(400, 'Enter a title (up to 160 characters) and message (up to 4,000 characters).');
  const item = await Announcement.create(parsed.data);
  res.status(201).json({ item: serializeAnnouncement(item) });
}));
adminAnnouncementsRouter.patch('/:id', asyncHandler(async (req, res) => {
  const parsed = visibilitySchema.safeParse(req.body);
  if (!isValidObjectId(req.params.id) || !parsed.success) throw new ApiError(400, 'Choose a valid message and visibility.');
  const item = await Announcement.findByIdAndUpdate(req.params.id, { $set: { published: parsed.data.published } }, { new: true, runValidators: true });
  if (!item) throw new ApiError(404, 'Announcement not found.');
  res.json({ item: serializeAnnouncement(item) });
}));
