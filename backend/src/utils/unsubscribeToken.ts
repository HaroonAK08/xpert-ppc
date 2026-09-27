import { createHmac, timingSafeEqual } from 'crypto';

import { env } from '../config/env';

/** No expiry by design — an unsubscribe link must keep working for as long as the email sits in an inbox. */
export function signUnsubscribeToken(leadId: string): string {
  return createHmac('sha256', env.jwtSecret).update(leadId).digest('hex');
}

export function verifyUnsubscribeToken(leadId: string, token: string): boolean {
  const expected = Buffer.from(signUnsubscribeToken(leadId), 'hex');
  const provided = Buffer.from(String(token || ''), 'hex');
  if (expected.length !== provided.length) return false;
  return timingSafeEqual(expected, provided);
}
