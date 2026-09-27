import { env } from '../../config/env';
import { EmailSequence } from '../../models/EmailSequence';
import { SequenceEnrollment, type SequenceEnrollmentDoc } from '../../models/SequenceEnrollment';
import { Lead } from '../../models/Lead';
import { recordLeadActivity } from '../../utils/activity';
import { isMailConfigured, sendSequenceStepEmail } from '../../utils/mail';
import { signUnsubscribeToken } from '../../utils/unsubscribeToken';

let running = false;

async function processEnrollment(enrollment: SequenceEnrollmentDoc & { _id: unknown; save(): Promise<unknown> }) {
  const [sequence, lead] = await Promise.all([
    EmailSequence.findById(enrollment.sequence),
    Lead.findById(enrollment.lead),
  ]);

  if (!sequence || !sequence.enabled || !lead) {
    enrollment.status = 'stopped';
    await enrollment.save();
    return;
  }

  if (lead.emailOptOut || !lead.email || lead.email.includes('@placeholder.local')) {
    enrollment.status = 'stopped';
    await enrollment.save();
    return;
  }

  const step = sequence.steps[enrollment.currentStep];
  if (!step) {
    enrollment.status = 'completed';
    await enrollment.save();
    return;
  }

  const leadId = String(lead._id);
  const unsubscribeUrl = `${env.apiPublicUrl}/api/sequences/unsubscribe/${leadId}?token=${signUnsubscribeToken(leadId)}`;

  await sendSequenceStepEmail({
    to: lead.email,
    name: lead.name,
    subject: step.subject,
    body: step.body,
    unsubscribeUrl,
  });

  await recordLeadActivity({
    leadId,
    action: 'lead_updated',
    metadata: { via: 'sequence', sequenceId: String(sequence._id), step: enrollment.currentStep },
  });

  const nextStep = sequence.steps[enrollment.currentStep + 1];
  enrollment.lastSentAt = new Date();
  if (nextStep) {
    enrollment.currentStep += 1;
    enrollment.nextSendAt = new Date(Date.now() + nextStep.delayHours * 3_600_000);
  } else {
    enrollment.status = 'completed';
  }
  await enrollment.save();
}

async function runDueEnrollments() {
  if (running) return;
  running = true;
  try {
    const due = await SequenceEnrollment.find({ status: 'active', nextSendAt: { $lte: new Date() } }).limit(50);
    for (const enrollment of due) {
      try {
        await processEnrollment(enrollment);
      } catch (err) {
        console.error('[sequences] failed to process enrollment', String(enrollment._id), err);
      }
    }
  } catch (err) {
    console.error('[sequences] scheduled run failed:', err);
  } finally {
    running = false;
  }
}

export function startSequenceScheduler(): void {
  if (!isMailConfigured() || env.sequenceCheckIntervalMs <= 0) {
    console.log('[sequences] scheduler disabled');
    return;
  }
  console.log(`[sequences] checking due steps every ${Math.round(env.sequenceCheckIntervalMs / 1000)}s`);
  setInterval(() => void runDueEnrollments(), env.sequenceCheckIntervalMs).unref();
}
