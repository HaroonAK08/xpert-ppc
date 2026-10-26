import { Router } from 'express';
import rateLimit from 'express-rate-limit';

import { env } from '../config/env';
import { Student } from '../models/Student';
import { AdminUser } from '../models/AdminUser';
import { requireStudent } from '../middleware/auth';
import { ApiError, asyncHandler } from '../middleware/error';
import {
  applicationReviewDecisionSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  studentLoginSchema,
  studentProfileSchema,
  studentSignupSchema,
} from '../validation/portal';
import { sendCourseApplicationEmail, sendPasswordResetEmail } from '../utils/mail';
import { hashPassword, verifyPassword } from '../utils/password';
import {
  cookieOptions,
  signApplicationReviewToken,
  signPasswordResetToken,
  signSession,
  signStudentSession,
  SESSION_COOKIE,
  STUDENT_COOKIE,
  verifyApplicationReviewToken,
  verifyPasswordResetToken,
} from '../utils/jwt';
import { applyStudentDecision, isStudentApproved } from '../utils/studentApplication';
import { consumeCoupon, findValidCoupon, normalizeCouponCode } from '../utils/coupon';

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many requests. Try again later.' },
});

function publicStudent(student: { _id: unknown; email: string; name: string; avatarUrl?: string | null }) {
  return {
    id: String(student._id),
    email: student.email,
    name: student.name,
    avatarUrl: student.avatarUrl || '',
  };
}

function sessionPayload(
  student: { _id: unknown; email: string; name: string; avatarUrl?: string | null },
  token: string
) {
  return {
    ok: true,
    token,
    user: publicStudent(student),
  };
}

router.get(
  '/coupon/:code',
  authLimiter,
  asyncHandler(async (req, res) => {
    const coupon = await findValidCoupon(req.params.code || '');
    if (!coupon) throw new ApiError(404, 'This coupon code is not valid.');
    res.json({
      ok: true,
      code: coupon.code,
      waivesFee: true,
    });
  })
);

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
    const courseSlug = (parsed.data.courseSlug || '').trim().toLowerCase();
    const country = parsed.data.country.trim();
    const couponRaw = parsed.data.couponCode || '';
    const passwordHash = await hashPassword(parsed.data.password);

    let student = await Student.findOne({ email }).select('+passwordHash');
    if (student && isStudentApproved(student)) {
      throw new ApiError(409, 'An account with this email already exists. Please sign in.');
    }

    const previousCoupon = student?.couponCode || '';

    // A resubmitted pending application reusing its own coupon shouldn't consume a second use.
    let couponCode = '';
    if (couponRaw.trim()) {
      const normalized = normalizeCouponCode(couponRaw);
      if (normalized === normalizeCouponCode(previousCoupon)) {
        couponCode = normalized;
      } else {
        const coupon = await consumeCoupon(normalized);
        if (!coupon) throw new ApiError(400, 'This coupon code is not valid or has expired.');
        couponCode = coupon.code;
      }
    }

    if (!student) {
      student = await Student.create({
        email,
        name,
        passwordHash,
        interest,
        courseSlug,
        couponCode,
        country,
        status: 'pending',
        emailVerified: false,
      });
    } else {
      student.name = name;
      student.passwordHash = passwordHash;
      student.interest = interest;
      student.courseSlug = courseSlug;
      student.couponCode = couponCode;
      student.country = country;
      student.status = 'pending';
      student.emailVerified = false;
      await student.save();
    }

    const reviewUrl = `${env.coursesSiteUrl}/courses/application?token=${signApplicationReviewToken(String(student._id))}`;

    try {
      await sendCourseApplicationEmail({
        name: student.name,
        email: student.email,
        country,
        interest,
        reviewUrl,
      });
    } catch (err) {
      console.error('[mail] Failed to send course application:', err);
    }

    res.json({
      ok: true,
      pending: true,
      email,
      couponCode: couponCode || undefined,
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
    const found = await Student.findOne({ email, active: true }).select('+passwordHash');
    const studentOk = found && (await verifyPassword(parsed.data.password, found.passwordHash));

    // The portal and the admin/owner account share one login form. A failed
    // student match falls back to AdminUser so the owner can sign in from the
    // same page instead of needing a separate admin URL.
    if (!studentOk || !found) {
      const admin = await AdminUser.findOne({ email, active: true }).select('+passwordHash');
      if (admin && (await verifyPassword(parsed.data.password, admin.passwordHash))) {
        const token = signSession({
          sub: String(admin._id),
          email: admin.email,
          name: admin.name,
          role: admin.role,
        });

        admin.lastLoginAt = new Date();
        await admin.save();

        res.cookie(SESSION_COOKIE, token, cookieOptions());
        return res.json({
          ok: true,
          admin: true,
          token,
          user: { id: String(admin._id), email: admin.email, name: admin.name, role: admin.role },
        });
      }

      throw new ApiError(401, 'Invalid email or password.');
    }

    const student = found;

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

router.post(
  '/forgot-password',
  authLimiter,
  asyncHandler(async (req, res) => {
    const parsed = forgotPasswordSchema.safeParse(req.body);
    if (!parsed.success) throw new ApiError(400, 'Enter a valid email address.');

    const email = parsed.data.email.toLowerCase();
    const student = await Student.findOne({ email, active: true }).select('+passwordHash');

    if (student) {
      const resetUrl = `${env.coursesSiteUrl}/courses/reset-password?token=${signPasswordResetToken(
        String(student._id),
        student.passwordHash
      )}`;
      try {
        await sendPasswordResetEmail({ to: student.email, name: student.name, resetUrl });
      } catch (err) {
        console.error('[mail] Failed to send password reset:', err);
      }
    }

    // Same response whether or not the account exists, so emails can't be enumerated.
    res.json({
      ok: true,
      message: 'If an account exists for that email, a reset link is on its way.',
    });
  })
);

router.post(
  '/reset-password',
  authLimiter,
  asyncHandler(async (req, res) => {
    const parsed = resetPasswordSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new ApiError(400, 'Enter a valid reset link and a password (min 6 characters).');
    }

    const { token, password } = parsed.data;

    // The token carries no student id we can trust before verification, so every
    // active student's current hash is checked against its fingerprint — same
    // cost as a single lookup once a sid claim is parsed out first.
    const unsafePayload = (() => {
      try {
        return JSON.parse(Buffer.from(token.split('.')[1] || '', 'base64url').toString('utf8'));
      } catch {
        return null;
      }
    })();
    const sid = typeof unsafePayload?.sid === 'string' ? unsafePayload.sid : '';
    if (!sid) throw new ApiError(400, 'This reset link is invalid or expired.');

    const student = await Student.findOne({ _id: sid, active: true }).select('+passwordHash');
    if (!student) throw new ApiError(400, 'This reset link is invalid or expired.');

    const verified = verifyPasswordResetToken(token, student.passwordHash);
    if (!verified || verified.sid !== String(student._id)) {
      throw new ApiError(400, 'This reset link is invalid or expired.');
    }

    student.passwordHash = await hashPassword(password);
    await student.save();

    res.json({ ok: true, message: 'Password updated. You can now sign in.' });
  })
);

// Read-only: renders the confirmation page. Never changes student status, so a
// mail scanner or link-prefetcher that fetches this on page load can't approve
// or reject anyone — only the POST below does that, and only on a button click.
router.get(
  '/application',
  asyncHandler(async (req, res) => {
    const token = typeof req.query.token === 'string' ? req.query.token : '';
    const parsed = verifyApplicationReviewToken(token);
    if (!parsed) throw new ApiError(400, 'This review link is invalid or expired.');

    const student = await Student.findById(parsed.sid);
    if (!student) throw new ApiError(404, 'Application not found.');

    res.json({
      ok: true,
      status: student.status || (student.emailVerified ? 'approved' : 'pending'),
      name: student.name,
      email: student.email,
      country: student.country || '',
      interest: student.interest || '',
    });
  })
);

router.post(
  '/application',
  asyncHandler(async (req, res) => {
    const parsed = applicationReviewDecisionSchema.safeParse(req.body);
    if (!parsed.success) throw new ApiError(400, 'Choose approve or reject.');

    const token = verifyApplicationReviewToken(parsed.data.token);
    if (!token) throw new ApiError(400, 'This review link is invalid or expired.');

    const result = await applyStudentDecision(token.sid, parsed.data.decision, parsed.data.reason);
    if (!result.ok) throw new ApiError(404, result.error);

    res.json({
      ok: true,
      decision: parsed.data.decision,
      already: result.already,
      name: result.name,
      enrolled: result.enrolled,
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
    res.json({ user: publicStudent(student) });
  })
);

router.patch(
  '/profile',
  requireStudent,
  asyncHandler(async (req, res) => {
    const parsed = studentProfileSchema.safeParse(req.body);
    if (!parsed.success) throw new ApiError(400, 'Enter a valid profile photo URL.');

    const student = await Student.findById(req.student!.sub);
    if (!student || !student.active || !isStudentApproved(student)) {
      throw new ApiError(401, 'Session invalid. Please sign in again.');
    }

    student.avatarUrl = parsed.data.avatarUrl;
    await student.save();

    res.json({ ok: true, user: publicStudent(student) });
  })
);

export default router;
