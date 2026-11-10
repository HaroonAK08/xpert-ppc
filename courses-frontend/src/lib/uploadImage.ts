const MAX_BYTES = 10 * 1024 * 1024;
const IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export async function uploadImage(file: File | Blob, filename?: string): Promise<string> {
  assertValidImageUpload(file);
  const host = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');
  const form = new FormData();
  form.append('file', file, filename ?? (file instanceof File ? file.name : 'image.png'));

  let res: Response;
  try {
    res = await fetch(`${host}/api/student/images`, {
      method: 'POST',
      body: form,
      signal: AbortSignal.timeout(30_000),
    });
  } catch {
    throw new Error('Image upload service is unavailable. Please try again shortly.');
  }

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    if (res.status === 413) throw new Error('Image must be 10 MB or smaller');
    if (res.status === 400) throw new Error('Please choose a valid JPG, PNG, or WebP image.');
    if (res.status === 429) throw new Error('Too many image uploads. Please wait a few minutes and try again.');
    throw new Error('Image upload failed. Please try again shortly.');
  }
  if (typeof data?.url !== 'string' || !/^https?:\/\//.test(data.url)) {
    throw new Error('Image upload failed. Please try again shortly.');
  }
  return data.url;
}

export function assertValidImageUpload(file: File | Blob, filenameHint?: string) {
  if (!IMAGE_TYPES.has(file.type)) {
    throw new Error('Only image files in JPG, PNG, or WebP format are allowed');
  }
  if (file.size === 0) throw new Error('Only image files with content are allowed');
  if (file.size > MAX_BYTES) {
    throw new Error('Image must be 10 MB or smaller');
  }
  if (file instanceof File && filenameHint === undefined && !file.name) {
    throw new Error('Missing file name');
  }
}

export const UPLOAD_MAX_BYTES = MAX_BYTES;
