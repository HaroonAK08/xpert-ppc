import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';

import { env } from '../../config/env';

const ALGO = 'aes-256-gcm';
let cachedKey: Buffer | null = null;

function getKey(): Buffer {
  if (cachedKey) return cachedKey;
  if (!env.meta.tokenEncryptionKey) {
    throw new Error('META_TOKEN_ENCRYPTION_KEY is not configured.');
  }
  cachedKey = scryptSync(env.meta.tokenEncryptionKey, 'xpertppc-meta-token', 32);
  return cachedKey;
}

/** Encrypts a Meta access token for storage. Format: iv:authTag:ciphertext (all hex). */
export function encryptToken(plain: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGO, getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv.toString('hex'), tag.toString('hex'), encrypted.toString('hex')].join(':');
}

export function decryptToken(stored: string): string {
  const [ivHex, tagHex, dataHex] = (stored || '').split(':');
  if (!ivHex || !tagHex || !dataHex) {
    throw new Error('Malformed encrypted Meta token.');
  }
  const decipher = createDecipheriv(ALGO, getKey(), Buffer.from(ivHex, 'hex'));
  decipher.setAuthTag(Buffer.from(tagHex, 'hex'));
  return Buffer.concat([
    decipher.update(Buffer.from(dataHex, 'hex')),
    decipher.final(),
  ]).toString('utf8');
}
