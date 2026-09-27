import { createHmac, timingSafeEqual } from 'crypto';

import { env } from '../../config/env';

/** Verifies Meta's `X-Hub-Signature-256` header against the exact raw request body. */
export function verifyMetaSignature(rawBody: Buffer, signatureHeader: string | undefined): boolean {
  if (!signatureHeader || !signatureHeader.startsWith('sha256=') || !env.meta.appSecret) {
    return false;
  }

  const expected = createHmac('sha256', env.meta.appSecret).update(rawBody).digest('hex');
  const provided = signatureHeader.slice('sha256='.length);

  const expectedBuf = Buffer.from(expected, 'hex');
  const providedBuf = Buffer.from(provided, 'hex');
  if (expectedBuf.length !== providedBuf.length) return false;

  return timingSafeEqual(expectedBuf, providedBuf);
}
