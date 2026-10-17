const MAX_BYTES = 10 * 1024 * 1024;

export async function uploadImage(file: File | Blob, filename?: string): Promise<string> {
  const host = process.env.SEARCHATLAS_CA_HOST;
  const token = process.env.SEARCHATLAS_TOKEN;

  if (!host || !token) {
    throw new Error('Image upload is not configured');
  }

  const form = new FormData();
  form.append('image', file, filename ?? (file instanceof File ? file.name : 'image.png'));

  const res = await fetch(`${host.replace(/\/$/, '')}/api/files/upload-image`, {
    method: 'POST',
    headers: {
      Authorization: token.startsWith('Bearer ') ? token : `Bearer ${token}`,
    },
    body: form,
  });

  if (!res.ok) {
    throw new Error(`Image upload failed (${res.status}): ${await res.text()}`);
  }

  const data = (await res.json()) as { image?: string };
  if (!data?.image) {
    throw new Error('Upload response had no `image` URL');
  }

  return data.image;
}

export function assertValidImageUpload(file: File | Blob, filenameHint?: string) {
  const type = file instanceof File ? file.type : (file as Blob).type;
  if (!type || !type.startsWith('image/')) {
    throw new Error('Only image files are allowed');
  }
  if (typeof file.size === 'number' && file.size > MAX_BYTES) {
    throw new Error('Image must be 10 MB or smaller');
  }
  if (file instanceof File && filenameHint === undefined && !file.name) {
    throw new Error('Missing file name');
  }
}

export const UPLOAD_MAX_BYTES = MAX_BYTES;
