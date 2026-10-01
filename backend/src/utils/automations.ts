import { AutomationRule, type AutomationRuleDoc } from '../models/AutomationRule';
import { Lead } from '../models/Lead';
import { LeadNote } from '../models/LeadNote';
import { recordLeadActivity } from './activity';
import { enrollLeadInSequence } from '../services/sequences/enroll';
import { sendSequenceStepEmail } from './mail';
import { signUnsubscribeToken } from './unsubscribeToken';
import { env } from '../config/env';

type LeadLean = {
  _id: unknown;
  source?: string;
  platform?: string;
  status?: string;
  sourcePath?: string;
  fieldId?: unknown;
};

function matchesConditions(lead: LeadLean, conditions: AutomationRuleDoc['conditions']): boolean {
  return conditions.every((c) => {
    const fieldValue =
      c.field === 'source' ? lead.source : c.field === 'platform' ? lead.platform : lead.sourcePath;
    return String(fieldValue || '').toLowerCase() === c.value.toLowerCase();
  });
}

function ruleFieldMatch(lead: LeadLean) {
  // Admin rules (fieldId null) only run on main-pool leads; company rules only on that company.
  return { fieldId: lead.fieldId ?? null };
}

async function applyActions(leadId: string, actions: AutomationRuleDoc['actions']): Promise<void> {
  for (const action of actions) {
    try {
      if (action.type === 'set_status' && action.status) {
        await Lead.findByIdAndUpdate(leadId, { status: action.status });
        await recordLeadActivity({
          leadId,
          action: 'status_changed',
          metadata: { via: 'automation', to: action.status },
        });
      } else if (action.type === 'assign_to' && action.userId) {
        await Lead.findByIdAndUpdate(leadId, { ownerUserId: action.userId });
        await recordLeadActivity({
          leadId,
          action: 'lead_updated',
          metadata: { via: 'automation', assignedTo: String(action.userId) },
        });
      } else if (action.type === 'add_note' && action.text) {
        await LeadNote.create({ lead: leadId, author: null, authorName: 'Automation', text: action.text });
        await recordLeadActivity({ leadId, action: 'note_added', metadata: { via: 'automation' } });
      } else if (action.type === 'enroll_in_sequence' && action.sequenceId) {
        const result = await enrollLeadInSequence(String(action.sequenceId), leadId);
        if (result.ok) {
          await recordLeadActivity({
            leadId,
            action: 'lead_updated',
            metadata: { via: 'automation', enrolledInSequence: String(action.sequenceId) },
          });
        }
      } else if (action.type === 'send_email' && action.subject && action.body) {
        const lead = await Lead.findById(leadId);
        if (
          lead &&
          !lead.emailOptOut &&
          lead.email &&
          !lead.email.includes('@placeholder.local') &&
          !lead.email.includes('@unknown.local')
        ) {
          const unsubscribeUrl = `${env.apiPublicUrl}/api/sequences/unsubscribe/${leadId}?token=${signUnsubscribeToken(leadId)}`;
          const result = await sendSequenceStepEmail({
            to: lead.email,
            name: lead.name,
            subject: action.subject,
            body: action.body,
            unsubscribeUrl,
          });
          if (result.sent) {
            await recordLeadActivity({ leadId, action: 'lead_updated', metadata: { via: 'automation', emailSent: true } });
          }
        }
      }
    } catch (err) {
      console.error('[automation] action failed', action.type, err);
    }
  }
}

/** Runs every enabled `lead_created` rule whose conditions match this lead. */
export async function runLeadCreatedAutomations(lead: LeadLean & { _id: { toString(): string } }): Promise<void> {
  const rules = await AutomationRule.find({
    trigger: 'lead_created',
    enabled: true,
    ...ruleFieldMatch(lead),
  })
    .sort({ order: 1 })
    .lean();
  for (const rule of rules) {
    if (!matchesConditions(lead, rule.conditions)) continue;
    await applyActions(String(lead._id), rule.actions);
  }
}

/** Runs every enabled `status_changed` rule whose from/to and conditions match. */
export async function runStatusChangedAutomations(
  lead: LeadLean & { _id: { toString(): string } },
  fromStatus: string,
  toStatus: string
): Promise<void> {
  const rules = await AutomationRule.find({
    trigger: 'status_changed',
    enabled: true,
    ...ruleFieldMatch(lead),
  })
    .sort({ order: 1 })
    .lean();
  for (const rule of rules) {
    if (rule.fromStatus && rule.fromStatus !== fromStatus) continue;
    if (rule.toStatus && rule.toStatus !== toStatus) continue;
    if (!matchesConditions(lead, rule.conditions)) continue;
    await applyActions(String(lead._id), rule.actions);
  }
}
