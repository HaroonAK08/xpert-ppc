import { NextResponse } from 'next/server';
import { assertValidImageUpload, uploadImage } from '@/lib/uploadImage';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Expected multipart field `file`' }, { status: 400 });
    }

    assertValidImageUpload(file);
    const url = await uploadImage(file, file.name);
    return NextResponse.json({ url });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Upload failed';
    const status =
      message.includes('not configured') ? 503 : message.includes('Only image') || message.includes('10 MB') ? 400 : 502;
    return NextResponse.json({ error: message }, { status });
  }
}
