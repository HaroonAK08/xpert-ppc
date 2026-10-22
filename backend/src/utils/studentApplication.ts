import { Student } from '../models/Student';
import { PortalCourse } from '../models/PortalCourse';
import { Enrollment } from '../models/Enrollment';
import { sendApplicationDecisionEmail } from './mail';
import { refundCoupon } from './coupon';
import { env } from '../config/env';
import type { ApplicationDecision } from './jwt';

export function isStudentApproved(student: {
  status?: string;
  emailVerified?: boolean;
}): boolean {
  if (student.status === 'rejected') return false;
  if (student.status === 'approved') return true;
  return Boolean(student.emailVerified);
}

async function resolveAppliedCourse(student: {
  courseSlug?: string | null;
  interest?: string | null;
}) {
  const slug = (student.courseSlug || '').trim().toLowerCase();
  if (slug) {
    const bySlug = await PortalCourse.findOne({ slug, published: true });
    if (bySlug) return bySlug;
  }

  const interest = student.interest || '';
  const titleMatch = interest.match(/Course:\s*(.+?)\s*(?:\.|$)/i);
  const title = titleMatch?.[1]?.trim();
  if (!title) return null;

  const normalized = title.replace(/\s*[—–-]\s*Live Course$/i, '').trim();
  const byTitle =
    (await PortalCourse.findOne({ title: new RegExp(`^${escapeRegex(normalized)}$`, 'i'), published: true })) ||
    (await PortalCourse.findOne({ title: new RegExp(escapeRegex(normalized), 'i'), published: true }));
  return byTitle;
}

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function enrollStudentInAppliedCourse(
  studentId: string
): Promise<{ enrolled: boolean; courseTitle?: string }> {
  const student = await Student.findById(studentId);
  if (!student) return { enrolled: false };

  const course = await resolveAppliedCourse(student);
  if (!course) return { enrolled: false };

  await Enrollment.findOneAndUpdate(
    { studentId: student._id, courseId: course._id },
    { $setOnInsert: { studentId: student._id, courseId: course._id, completedLessonIds: [] } },
    { upsert: true, new: true }
  );

  return { enrolled: true, courseTitle: course.title };
}

/** Admin picks a course by hand when auto-enroll couldn't match one on approval. */
export async function assignStudentCourse(
  studentId: string,
  courseId: string
): Promise<{ ok: true; courseTitle: string; emailed: boolean } | { ok: false; error: string }> {
  const student = await Student.findById(studentId);
  if (!student) return { ok: false, error: 'Student not found.' };

  const course = await PortalCourse.findOne({ _id: courseId, published: true });
  if (!course) return { ok: false, error: 'Course not found.' };

  const hadEnrollment = (await Enrollment.countDocuments({ studentId: student._id })) > 0;

  await Enrollment.findOneAndUpdate(
    { studentId: student._id, courseId: course._id },
    { $setOnInsert: { studentId: student._id, courseId: course._id, completedLessonIds: [] } },
    { upsert: true, new: true }
  );

  // This is the first time the student actually has somewhere to sign in to — tell them now.
  let emailed = false;
  if (student.status === 'approved' && !hadEnrollment) {
    try {
      await sendApplicationDecisionEmail({
        to: student.email,
        name: student.name,
        decision: 'approved',
        loginUrl: `${env.coursesSiteUrl}/courses/login`,
      });
      emailed = true;
    } catch (err) {
      console.error('[mail] Failed to email student about course assignment:', err);
    }
  }

  return { ok: true, courseTitle: course.title, emailed };
}

export async function applyStudentDecision(
  studentId: string,
  decision: ApplicationDecision,
  reason?: string
): Promise<
  | { ok: true; already: boolean; name: string; email: string; enrolled: boolean }
  | { ok: false; error: string }
> {
  const student = await Student.findById(studentId);
  if (!student) return { ok: false, error: 'Application not found.' };

  const already =
    (decision === 'approved' && student.status === 'approved') ||
    (decision === 'rejected' && student.status === 'rejected');

  let enrolled = false;

  if (!already) {
    student.status = decision;
    student.emailVerified = decision === 'approved';
    await student.save();

    if (decision === 'approved') {
      try {
        enrolled = (await enrollStudentInAppliedCourse(String(student._id))).enrolled;
      } catch (err) {
        console.error('[academy] Failed to enroll approved student:', err);
      }

      // Don't tell the student they're in if nothing matched — the admin still needs
      // to assign a course by hand on /admin/students, which sends this email itself.
      if (enrolled) {
        try {
          await sendApplicationDecisionEmail({
            to: student.email,
            name: student.name,
            decision,
            loginUrl: `${env.coursesSiteUrl}/courses/login`,
          });
        } catch (err) {
          console.error('[mail] Failed to email student about application:', err);
        }
      }
    } else {
      if (student.couponCode) {
        try {
          await refundCoupon(student.couponCode);
        } catch (err) {
          console.error('[academy] Failed to refund coupon on rejection:', err);
        }
      }
      try {
        await sendApplicationDecisionEmail({
          to: student.email,
          name: student.name,
          decision,
          loginUrl: `${env.coursesSiteUrl}/courses/login`,
          reason,
        });
      } catch (err) {
        console.error('[mail] Failed to email student about application:', err);
      }
    }
  } else if (decision === 'approved') {
    try {
      enrolled = (await enrollStudentInAppliedCourse(String(student._id))).enrolled;
    } catch (err) {
      console.error('[academy] Failed to enroll approved student:', err);
    }
  }

  return { ok: true, already, name: student.name, email: student.email, enrolled };
}
