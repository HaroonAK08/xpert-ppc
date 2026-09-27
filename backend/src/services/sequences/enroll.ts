import { EmailSequence } from '../../models/EmailSequence';
import { SequenceEnrollment, type SequenceEnrollmentDoc } from '../../models/SequenceEnrollment';
import { Lead } from '../../models/Lead';

export type EnrollResult =
  | { ok: true; enrollment: SequenceEnrollmentDoc & { _id: unknown } }
  | { ok: false; reason: 'sequence_not_found' | 'lead_not_found' | 'no_steps' };

/** Shared by the manual "enroll" endpoint and the `enroll_in_sequence` automation action. */
export async function enrollLeadInSequence(sequenceId: string, leadId: string): Promise<EnrollResult> {
  const [sequence, lead] = await Promise.all([EmailSequence.findById(sequenceId), Lead.findById(leadId)]);
  if (!sequence) return { ok: false, reason: 'sequence_not_found' };
  if (!lead) return { ok: false, reason: 'lead_not_found' };
  if (!sequence.steps.length) return { ok: false, reason: 'no_steps' };

  const nextSendAt = new Date(Date.now() + sequence.steps[0].delayHours * 3_600_000);

  const enrollment = await SequenceEnrollment.findOneAndUpdate(
    { sequence: sequence._id, lead: lead._id },
    { currentStep: 0, status: 'active', nextSendAt, lastSentAt: null },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return { ok: true, enrollment: enrollment.toObject() };
}
