import { createHmac, timingSafeEqual } from 'crypto';

import { env } from '../../config/env';

const TTL_MS = 10 * 60 * 1000;

function sign(payload: string): string {
  return createHmac('sha256', env.jwtSecret).update(payload).digest('hex');
}

/** Signs the admin's id into the OAuth `state` param — Meta's redirect is cross-site, so we can't rely on the session cookie. */
export function createOAuthState(adminId: string): string {
  const payload = Buffer.from(JSON.stringify({ sub: adminId, exp: Date.now() + TTL_MS })).toString(
    'base64url'
  );
  return `${payload}.${sign(payload)}`;
}

/** Returns the admin id the state was signed for, or null if missing/expired/tampered. */
export function verifyOAuthState(state: string): string | null {
  const [payload, signature] = (state || '').split('.');
  if (!payload || !signature) return null;

  const expected = Buffer.from(sign(payload), 'hex');
  const provided = Buffer.from(signature, 'hex');
  if (expected.length !== provided.length || !timingSafeEqual(expected, provided)) return null;

  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as {
      sub: string;
      exp: number;
    };
    if (!data.sub || Date.now() > data.exp) return null;
    return data.sub;
  } catch {
    return null;
  }
}
