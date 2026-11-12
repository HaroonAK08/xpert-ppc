import { Student } from '../models/Student';
import { PortalCourse } from '../models/PortalCourse';
import { Enrollment } from '../models/Enrollment';
import { sendApplicationDecisionEmail } from './mail';
import { refundCoupon } from './coupon';
import { env } from '../config/env';
import type { ApplicationDecision } from './jwt';
import { enrollStudentInPublishedCourses } from './courseEnrollment';
import { ordinaryStudentFilter } from './studentInvitation';

export function isStudentApproved(student: {
  status?: string;
  emailVerified?: boolean;
}): boolean {
  if (student.status === 'rejected') return false;
  if (student.status === 'approved') return true;
  return Boolean(student.emailVerified);
}

/** Admin can still assign a published course explicitly. */
export async function assignStudentCourse(
  studentId: string,
  courseId: string
): Promise<{ ok: true; courseTitle: string; emailed: boolean } | { ok: false; error: string }> {
  const student = await Student.findOne({ _id: studentId, ...ordinaryStudentFilter });
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
  const student = await Student.findOne({ _id: studentId, ...ordinaryStudentFilter });
  if (!student) return { ok: false, error: 'Application not found.' };

  const already =
    (decision === 'approved' && student.status === 'approved') ||
    (decision === 'rejected' && student.status === 'rejected');

  let enrolled = false;

  if (!already) {
    const changed = await Student.findOneAndUpdate({ _id: student._id, ...ordinaryStudentFilter, status: { $ne: decision } },
      { $set: { status: decision, emailVerified: decision === 'approved' } }, { new: true });
    if (!changed && student.status !== decision) return { ok: false, error: 'Application not found.' };
    if (changed && decision === 'approved') {
      try {
        enrolled = await enrollStudentInPublishedCourses(String(student._id));
      } catch (err) {
        console.error('[academy] Failed to enroll approved student:', err);
      }

      // Send the approval email once the student has published courses to access.
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
    } else if (changed && decision === 'rejected') {
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
      enrolled = await enrollStudentInPublishedCourses(String(student._id));
    } catch (err) {
      console.error('[academy] Failed to enroll approved student:', err);
    }
  }

  return { ok: true, already, name: student.name, email: student.email, enrolled };
}
