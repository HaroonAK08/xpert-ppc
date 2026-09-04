import { Router } from 'express';
import rateLimit from 'express-rate-limit';

import { env } from '../config/env';
import { Student } from '../models/Student';
import { requireStudent } from '../middleware/auth';
import { ApiError, asyncHandler } from '../middleware/error';
import { studentLoginSchema, studentSignupSchema } from '../validation/portal';
import { sendCourseApplicationEmail } from '../utils/mail';
import { hashPassword, verifyPassword } from '../utils/password';
import {
  cookieOptions,
  signApplicationToken,
  signStudentSession,
  STUDENT_COOKIE,
  verifyApplicationToken,
} from '../utils/jwt';
import { applyStudentDecision, isStudentApproved } from '../utils/studentApplication';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many requests. Try again later.' },
});

function sessionPayload(student: { _id: unknown; email: string; name: string }, token: string) {
  return {
    ok: true,
    token,
    user: {
      id: String(student._id),
      email: student.email,
      name: student.name,
    },
  };
}

router.post(
  '/signup',
  authLimiter,
  asyncHandler(async (req, res) => {
    const parsed = studentSignupSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ApiError(
        400,
        'Enter your name, email, country, password (min 6 characters), and what you want to learn.'
      );
    }

    const email = parsed.data.email.toLowerCase();
    const name = parsed.data.name.trim();
    const interest = parsed.data.interest.trim();
    const country = parsed.data.country.trim();
    const passwordHash = await hashPassword(parsed.data.password);

    let student = await Student.findOne({ email }).select('+passwordHash');
    if (student && isStudentApproved(student)) {
      throw new ApiError(409, 'An account with this email already exists. Please sign in.');
    }

    if (!student) {
      student = await Student.create({
        email,
        name,
        passwordHash,
        interest,
        country,
        status: 'pending',
        emailVerified: false,
      });
    } else {
      student.name = name;
      student.passwordHash = passwordHash;
      student.interest = interest;
      student.country = country;
      student.status = 'pending';
      student.emailVerified = false;
      await student.save();
    }

    const acceptUrl = `${env.coursesSiteUrl}/courses/application?token=${signApplicationToken(String(student._id), 'approved')}`;
    const rejectUrl = `${env.coursesSiteUrl}/courses/application?token=${signApplicationToken(String(student._id), 'rejected')}`;

    try {
      await sendCourseApplicationEmail({
        name: student.name,
        email: student.email,
        country,
        interest,
        acceptUrl,
        rejectUrl,
      });
    } catch (err) {
      console.error('[mail] Failed to send course application:', err);
    }

    res.json({
      ok: true,
      pending: true,
      email,
      message:
        'Application received. We’ll email you if you’re accepted. Then you can sign in with this password.',
    });
  })
);

router.post(
  '/login',
  authLimiter,
  asyncHandler(async (req, res) => {
    const parsed = studentLoginSchema.safeParse(req.body);
    if (!parsed.success) throw new ApiError(400, 'Enter a valid email and password.');

    const email = parsed.data.email.toLowerCase();
    const student = await Student.findOne({ email, active: true }).select('+passwordHash');

    if (!student || !(await verifyPassword(parsed.data.password, student.passwordHash))) {
      throw new ApiError(401, 'Invalid email or password.');
    }

    if (student.status === 'rejected') {
      throw new ApiError(403, 'Your application was not approved.');
    }

    if (!isStudentApproved(student)) {
      throw new ApiError(403, 'Your application is still under review. You’ll get an email if you’re accepted.');
    }

    student.lastLoginAt = new Date();
    await student.save();

    const token = signStudentSession({
      sub: String(student._id),
      email: student.email,
      name: student.name,
    });

    res.cookie(STUDENT_COOKIE, token, cookieOptions());
    res.json(sessionPayload(student, token));
  })
);

router.get(
  '/application',
  asyncHandler(async (req, res) => {
    const token = typeof req.query.token === 'string' ? req.query.token : '';
    const parsed = verifyApplicationToken(token);
    if (!parsed) throw new ApiError(400, 'This accept/reject link is invalid or expired.');

    const result = await applyStudentDecision(parsed.sid, parsed.decision);
    if (!result.ok) throw new ApiError(404, result.error);

    res.json({
      ok: true,
      decision: parsed.decision,
      already: result.already,
      name: result.name,
    });
  })
);

router.post('/logout', (_req, res) => {
  res.clearCookie(STUDENT_COOKIE, { ...cookieOptions(), maxAge: undefined });
  res.json({ ok: true });
});

router.get(
  '/me',
  requireStudent,
  asyncHandler(async (req, res) => {
    const student = await Student.findById(req.student!.sub);
    if (!student || !student.active || !isStudentApproved(student)) {
      throw new ApiError(401, 'Session invalid. Please sign in again.');
    }
    res.json({
      user: {
        id: String(student._id),
        email: student.email,
        name: student.name,
      },
    });
  })
);

export default router;
