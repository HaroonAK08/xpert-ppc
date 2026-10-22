import { createHash } from 'crypto';
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

export type ApplicationDecision = 'approved' | 'rejected';

type ApplicationTokenPayload = {
  typ: 'student-app';
  sid: string;
  decision: ApplicationDecision;
};

export function signApplicationToken(studentId: string, decision: ApplicationDecision): string {
  return jwt.sign(
    { typ: 'student-app', sid: studentId, decision } satisfies ApplicationTokenPayload,
    env.jwtSecret,
    { expiresIn: '14d' }
  );
}

export function verifyApplicationToken(
  token: string
): { sid: string; decision: ApplicationDecision } | null {
  try {
    const payload = jwt.verify(token, env.jwtSecret) as ApplicationTokenPayload;
    if (payload.typ !== 'student-app' || !payload.sid) return null;
    if (payload.decision !== 'approved' && payload.decision !== 'rejected') return null;
    return { sid: payload.sid, decision: payload.decision };
  } catch {
    return null;
  }
}

type PasswordResetTokenPayload = {
  typ: 'student-reset';
  sid: string;
  /** Fingerprint of the password hash at issue time — changing the password invalidates the token. */
  phv: string;
};

function passwordHashFingerprint(passwordHash: string): string {
  return createHash('sha256').update(passwordHash).digest('hex').slice(0, 16);
}

export function signPasswordResetToken(studentId: string, currentPasswordHash: string): string {
  return jwt.sign(
    {
      typ: 'student-reset',
      sid: studentId,
      phv: passwordHashFingerprint(currentPasswordHash),
    } satisfies PasswordResetTokenPayload,
    env.jwtSecret,
    { expiresIn: '1h' }
  );
}

export function verifyPasswordResetToken(
  token: string,
  currentPasswordHash: string
): { sid: string } | null {
  try {
    const payload = jwt.verify(token, env.jwtSecret) as PasswordResetTokenPayload;
    if (payload.typ !== 'student-reset' || !payload.sid) return null;
    if (payload.phv !== passwordHashFingerprint(currentPasswordHash)) return null;
    return { sid: payload.sid };
  } catch {
    return null;
  }
}
