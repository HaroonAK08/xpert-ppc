import { Router } from 'express';
import rateLimit from 'express-rate-limit';

import { AdminUser } from '../models/AdminUser';
import { verifyPassword } from '../utils/password';
import { cookieOptions, signSession, SESSION_COOKIE } from '../utils/jwt';
import { requireAuth } from '../middleware/auth';
import { ApiError, asyncHandler } from '../middleware/error';
import { loginSchema } from '../validation/lead';

const router = Router();

/** Brute-force guard: 10 attempts per 15 minutes per IP (much looser in local dev). */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: process.env.NODE_ENV === 'production' ? 10 : 200,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Try again later.' },
  skip: () => process.env.NODE_ENV !== 'production' && process.env.DISABLE_LOGIN_RATE_LIMIT === '1',
});

router.post(
  '/login',
  loginLimiter,
  asyncHandler(async (req, res) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) throw new ApiError(400, 'Invalid email or password.');

    const user = await AdminUser.findOne({
      email: parsed.data.email.toLowerCase(),
      active: true,
    }).select('+passwordHash');

    // Same message either way so responses can't be used to enumerate accounts.
    if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
      throw new ApiError(401, 'Invalid email or password.');
    }

    const token = signSession({
      sub: String(user._id),
      email: user.email,
      name: user.name,
      role: user.role,
    });

    user.lastLoginAt = new Date();
    await user.save();

    res.cookie(SESSION_COOKIE, token, cookieOptions());
    res.json({
      ok: true,
      token,
      user: { id: String(user._id), email: user.email, name: user.name, role: user.role },
    });
  })
);

router.post('/logout', (_req, res) => {
  res.clearCookie(SESSION_COOKIE, { ...cookieOptions(), maxAge: undefined });
  res.json({ ok: true });
});

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.admin });
});

export default router;
