import { LeadActivity } from '../models/LeadActivity';
import type { LeadActivityAction } from '../../../shared/crm/constants';

export async function recordLeadActivity(input: {
  leadId: string;
  userId?: string | null;
  userName?: string | null;
  action: LeadActivityAction;
  metadata?: Record<string, unknown>;
}) {
  try {
    await LeadActivity.create({
      lead: input.leadId,
      user: input.userId || null,
      userName: input.userName || null,
      action: input.action,
      metadata: input.metadata || {},
    });
  } catch (err) {
    console.error('[activity] failed to record', input.action, err);
  }
}
