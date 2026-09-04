import { Student } from '../models/Student';
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

  return { ok: true, already, name: student.name, email: student.email };
}
