import { Router } from 'express';
import rateLimit from 'express-rate-limit';

import { env } from '../config/env';
import { Student } from '../models/Student';
import { OtpChallenge } from '../models/OtpChallenge';
import { requireStudent } from '../middleware/auth';
import { ApiError, asyncHandler } from '../middleware/error';
import {
  studentLoginSchema,
  studentSignupSchema,
  studentVerifySchema,
} from '../validation/portal';
import { generateOtpCode, hashOtp, verifyOtpHash } from '../utils/otp';
import { sendOtpEmail } from '../utils/mail';
import { hashPassword, verifyPassword } from '../utils/password';
import {
  cookieOptions,
  signStudentSession,
  STUDENT_COOKIE,
} from '../utils/jwt';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many requests. Try again later.' },
});

const verifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many verification attempts. Try again later.' },
});

function sessionResponse(student: { _id: unknown; email: string; name: string }, token: string) {
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

async function issueOtp(opts: {
  email: string;
  name: string;
  purpose: 'signup' | 'login';
}) {
  const code = generateOtpCode();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await OtpChallenge.deleteMany({ email: opts.email, purpose: opts.purpose });
  await OtpChallenge.create({
    email: opts.email,
    purpose: opts.purpose,
    codeHash: hashOtp(code, opts.email),
    expiresAt,
  });

  const mail = await sendOtpEmail({
    to: opts.email,
    name: opts.name,
    code,
    purpose: opts.purpose,
  });

  return {
    emailed: mail.sent,
    previewCode: !mail.sent && !env.isProd ? code : undefined,
  };
}

router.post(
  '/signup',
  authLimiter,
  asyncHandler(async (req, res) => {
    const parsed = studentSignupSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ApiError(400, 'Enter a valid name, email, and password (min 6 characters).');
    }

    const email = parsed.data.email.toLowerCase();
    const name = parsed.data.name.trim();
    const passwordHash = await hashPassword(parsed.data.password);

    let student = await Student.findOne({ email }).select('+passwordHash');
    if (student?.emailVerified) {
      throw new ApiError(409, 'An account with this email already exists. Please sign in.');
    }

    if (!student) {
      student = await Student.create({
        email,
        name,
        passwordHash,
        emailVerified: false,
      });
    } else {
      student.name = name;
      student.passwordHash = passwordHash;
      await student.save();
    }

    const otp = await issueOtp({ email, name: student.name, purpose: 'signup' });
    res.json({
      ok: true,
      email,
      purpose: 'signup',
      emailed: otp.emailed,
      message: otp.emailed
        ? 'Verification code sent to your email.'
        : 'Email is not configured on the server. Use the preview code shown on the next screen.',
      ...(otp.previewCode ? { previewCode: otp.previewCode } : {}),
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

    if (
      !student ||
      !student.emailVerified ||
      !(await verifyPassword(parsed.data.password, student.passwordHash))
    ) {
      throw new ApiError(401, 'Invalid email or password.');
    }

    student.lastLoginAt = new Date();
    await student.save();

    const token = signStudentSession({
      sub: String(student._id),
      email: student.email,
      name: student.name,
    });

    res.cookie(STUDENT_COOKIE, token, cookieOptions());
    res.json(sessionResponse(student, token));
  })
);

router.post(
  '/verify-otp',
  verifyLimiter,
  asyncHandler(async (req, res) => {
    const parsed = studentVerifySchema.safeParse(req.body);
    if (!parsed.success) throw new ApiError(400, 'Enter a valid 6-digit code.');

    const email = parsed.data.email.toLowerCase();
    const { code, purpose } = parsed.data;

    const challenge = await OtpChallenge.findOne({
      email,
      purpose,
      consumedAt: null,
    }).sort({ createdAt: -1 });

    if (!challenge || challenge.expiresAt.getTime() < Date.now()) {
      throw new ApiError(400, 'Code expired. Request a new one.');
    }

    if (challenge.attempts >= 5) {
      throw new ApiError(429, 'Too many incorrect attempts. Request a new code.');
    }

    if (!verifyOtpHash(code, email, challenge.codeHash)) {
      challenge.attempts += 1;
      await challenge.save();
      throw new ApiError(400, 'Incorrect code. Please try again.');
    }

    challenge.consumedAt = new Date();
    await challenge.save();

    const student = await Student.findOne({ email, active: true });
    if (!student) throw new ApiError(404, 'Account not found.');

    if (purpose === 'signup') {
      student.emailVerified = true;
    } else if (!student.emailVerified) {
      throw new ApiError(403, 'Email is not verified. Please sign up again.');
    }

    student.lastLoginAt = new Date();
    await student.save();

    const token = signStudentSession({
      sub: String(student._id),
      email: student.email,
      name: student.name,
    });

    res.cookie(STUDENT_COOKIE, token, cookieOptions());
    res.json(sessionResponse(student, token));
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
    if (!student || !student.active || !student.emailVerified) {
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
