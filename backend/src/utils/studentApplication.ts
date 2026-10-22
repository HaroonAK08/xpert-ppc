import { Student } from '../models/Student';
import { PortalCourse } from '../models/PortalCourse';
import { Enrollment } from '../models/Enrollment';
import { sendApplicationDecisionEmail } from './mail';
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

export async function enrollStudentInAppliedCourse(studentId: string) {
  const student = await Student.findById(studentId);
  if (!student) return;

  const course = await resolveAppliedCourse(student);
  if (!course) return;

  await Enrollment.findOneAndUpdate(
    { studentId: student._id, courseId: course._id },
    { $setOnInsert: { studentId: student._id, courseId: course._id, completedLessonIds: [] } },
    { upsert: true, new: true }
  );
}

export async function applyStudentDecision(
  studentId: string,
  decision: ApplicationDecision
): Promise<{ ok: true; already: boolean; name: string; email: string } | { ok: false; error: string }> {
  const student = await Student.findById(studentId);
  if (!student) return { ok: false, error: 'Application not found.' };

  const already =
    (decision === 'approved' && student.status === 'approved') ||
    (decision === 'rejected' && student.status === 'rejected');

  if (!already) {
    student.status = decision;
    student.emailVerified = decision === 'approved';
    await student.save();

    if (decision === 'approved') {
      try {
        await enrollStudentInAppliedCourse(String(student._id));
      } catch (err) {
        console.error('[academy] Failed to enroll approved student:', err);
      }
    }

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
  } else if (decision === 'approved') {
    try {
      await enrollStudentInAppliedCourse(String(student._id));
    } catch (err) {
      console.error('[academy] Failed to enroll approved student:', err);
    }
  }

  return { ok: true, already, name: student.name, email: student.email };
}
