import { createHash, randomInt, timingSafeEqual } from 'crypto';

export function generateOtpCode(): string {
  return String(randomInt(100000, 999999));
}

export function hashOtp(code: string, email: string): string {
  return createHash('sha256').update(`${email.toLowerCase()}:${code}`).digest('hex');
}

export function verifyOtpHash(code: string, email: string, storedHash: string): boolean {
  const computed = Buffer.from(hashOtp(code, email), 'hex');
  const expected = Buffer.from(storedHash, 'hex');
  if (computed.length !== expected.length) return false;
  return timingSafeEqual(computed, expected);
}
