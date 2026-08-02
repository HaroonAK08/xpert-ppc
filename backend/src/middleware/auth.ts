import type { NextFunction, Request, Response } from 'express';
import { SESSION_COOKIE, verifySession, type SessionPayload } from '../utils/jwt';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      admin?: SessionPayload;
    }
  }
}

/** Accepts the session cookie or an `Authorization: Bearer <token>` header. */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const bearer = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.slice(7)
    : undefined;
  const token = req.cookies?.[SESSION_COOKIE] ?? bearer;

  if (!token) {
    return res.status(401).json({ error: 'Authentication required.' });
  }

  const session = verifySession(token);
  if (!session) {
    return res.status(401).json({ error: 'Session expired. Please sign in again.' });
  }

  req.admin = session;
  next();
}

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.admin || !roles.includes(req.admin.role)) {
      return res.status(403).json({ error: 'Insufficient permissions.' });
    }
    next();
  };
}
