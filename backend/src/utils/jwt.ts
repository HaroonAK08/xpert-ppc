import jwt, { type SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';

export const SESSION_COOKIE = 'xppc_admin';

export type SessionPayload = {
  sub: string;
  email: string;
  name: string;
  role: string;
};

export function signSession(payload: SessionPayload): string {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  } as SignOptions);
}

export function verifySession(token: string): SessionPayload | null {
  try {
    return jwt.verify(token, env.jwtSecret) as SessionPayload;
  } catch {
    return null;
  }
}

/**
 * Cross-site cookies (frontend and API on different origins) require
 * SameSite=None, which browsers only accept alongside Secure.
 */
export function cookieOptions() {
  return {
    httpOnly: true,
    secure: env.isProd,
    sameSite: env.isProd ? ('none' as const) : ('lax' as const),
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    ...(env.cookieDomain ? { domain: env.cookieDomain } : {}),
  };
}
