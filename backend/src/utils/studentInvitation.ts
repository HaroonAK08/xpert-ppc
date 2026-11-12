import { createHash, randomBytes } from 'node:crypto';
import { Student, type StudentDoc } from '../models/Student';
import { env } from '../config/env';
import { sendStudentInvitationEmail } from './mail';

export const invitationSelection = '+invitationOnly +invitationTokenHash +invitationExpiresAt +invitationCreatedAt +invitationAcceptedAt +invitationCancelledAt +invitationLastSentAt +invitationDeliveryStatus';
export const ordinaryStudentFilter = { invitationOnly: { $ne: true } };
export function hashInvitationToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}
export function newInvitation() {
  const token = randomBytes(32).toString('hex');
  const now = new Date();
  return { token, fields: {
    invitationTokenHash: hashInvitationToken(token),
    invitationExpiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
    invitationLastSentAt: now,
    invitationDeliveryStatus: 'pending' as const,
  } };
}
export function invitationItem(student: StudentDoc & { _id: unknown }) {
  return {
    id: String(student._id), email: student.email,
    status: student.invitationAcceptedAt ? 'accepted' : student.invitationCancelledAt ? 'cancelled' :
      !student.invitationExpiresAt || student.invitationExpiresAt <= new Date() ? 'expired' : 'pending',
    deliveryStatus: student.invitationDeliveryStatus || 'pending',
    expiresAt: student.invitationExpiresAt, createdAt: student.invitationCreatedAt,
  };
}
export async function deliverInvitation(id: string, email: string, token: string) {
  let sent = false;
  try {
    const url = new URL('/join', env.coursesSiteUrl);
    url.searchParams.set('token', token);
    sent = (await sendStudentInvitationEmail(email, url.toString())).sent;
  } catch {
    // SMTP errors can contain message bodies and URLs. Never log invitation errors.
  }
  await Student.updateOne({ _id: id, invitationOnly: true, invitationTokenHash: hashInvitationToken(token) }, {
    $set: { invitationDeliveryStatus: sent ? 'sent' : 'failed' },
  });
  return sent;
}
export function validInvitation(token: string) {
  return { invitationOnly: true, active: false, status: 'pending', emailVerified: false,
    invitationTokenHash: hashInvitationToken(token), invitationExpiresAt: { $gt: new Date() },
    invitationAcceptedAt: null, invitationCancelledAt: null };
}
