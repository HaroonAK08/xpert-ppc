import jwt, { type SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';

export const SESSION_COOKIE = 'xppc_admin';
export const STUDENT_COOKIE = 'xppc_student';

export type SessionPayload = {
  sub: string;
  email: string;
  name: string;
  role: string;
};

export type StudentSessionPayload = {
  sub: string;
  email: string;
  name: string;
  kind: 'student';
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

export function signStudentSession(payload: Omit<StudentSessionPayload, 'kind'>): string {
  return jwt.sign({ ...payload, kind: 'student' }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  } as SignOptions);
}

export function verifyStudentSession(token: string): StudentSessionPayload | null {
  try {
    const payload = jwt.verify(token, env.jwtSecret) as StudentSessionPayload;
    if (payload.kind !== 'student') return null;
    return payload;
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
