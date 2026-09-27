export const LEAD_STATUSES = [
  'new',
  'contacted',
  'replied',
  'interested',
  'follow_up',
  'converted',
  'not_interested',
  'closed',
  // Legacy website admin values — still valid in DB
  'qualified',
  'won',
  'lost',
  'spam',
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const CRM_LEAD_STATUSES = [
  'new',
  'contacted',
  'replied',
  'interested',
  'follow_up',
  'converted',
  'not_interested',
  'closed',
] as const;

export type CrmLeadStatus = (typeof CRM_LEAD_STATUSES)[number];

export const LEAD_STATUS_LABELS: Record<CrmLeadStatus, string> = {
  new: 'New',
  contacted: 'Contacted',
  replied: 'Replied',
  interested: 'Interested',
  follow_up: 'Follow-up',
  converted: 'Converted',
  not_interested: 'Not interested',
  closed: 'Closed',
};

/**
 * A separate axis from `status` (which tracks pipeline progress): whether the
 * lead itself is legitimate. A lead can be "converted" and still get marked
 * "spam" later if it turns out to be junk — the two are independent.
 */
export const LEAD_QUALIFICATIONS = ['unreviewed', 'real', 'false_lead', 'spam'] as const;

export type LeadQualification = (typeof LEAD_QUALIFICATIONS)[number];

export const LEAD_QUALIFICATION_LABELS: Record<LeadQualification, string> = {
  unreviewed: 'Unreviewed',
  real: 'Real lead',
  false_lead: 'False lead',
  spam: 'Spam',
};

/** Map legacy website statuses into the CRM set for display/stats. */
export function normalizeLeadStatus(status: string): CrmLeadStatus {
  switch (status) {
    case 'qualified':
      return 'interested';
    case 'won':
      return 'converted';
    case 'lost':
      return 'not_interested';
    case 'spam':
      return 'closed';
    default:
      return (CRM_LEAD_STATUSES as readonly string[]).includes(status)
        ? (status as CrmLeadStatus)
        : 'new';
  }
}

export const LEAD_ACTIVITY_ACTIONS = [
  'lead_created',
  'status_changed',
  'marked_contacted',
  'marked_replied',
  'note_added',
  'note_updated',
  'follow_up_changed',
  'follow_up_completed',
  'follow_up_cancelled',
  'synced_from_sheets',
  'synced_to_sheets',
  'sync_conflict',
  'lead_updated',
  'qualification_changed',
] as const;

export type LeadActivityAction = (typeof LEAD_ACTIVITY_ACTIONS)[number];

export const SHEET_FIELD_KEYS = [
  'name',
  'phone',
  'email',
  'business_name',
  'source',
  'message',
  'status',
  'replied',
  'notes',
  'contacted_at',
  'replied_at',
  'follow_up_at',
  'created_at',
  'updated_at',
  'external_id',
] as const;

export type SheetFieldKey = (typeof SHEET_FIELD_KEYS)[number];

export type ColumnMapping = Partial<Record<SheetFieldKey, string>>;

export type SyncState = 'idle' | 'syncing' | 'success' | 'failed';

/**
 * The fixed set of "standard" Lead fields a form builder can offer, beyond
 * whatever admin-defined custom properties also exist. Name and email are
 * required on every form — the public lead endpoint needs at least one to
 * identify who submitted it.
 */
export const STANDARD_FORM_FIELDS = [
  { key: 'name', label: 'Name', type: 'text', locked: true },
  { key: 'email', label: 'Email', type: 'email', locked: true },
  { key: 'phone', label: 'Phone', type: 'tel', locked: false },
  { key: 'company', label: 'Company', type: 'text', locked: false },
  { key: 'message', label: 'Message', type: 'textarea', locked: false },
] as const;

export type StandardFormFieldKey = (typeof STANDARD_FORM_FIELDS)[number]['key'];
export type FormFieldType = 'text' | 'email' | 'tel' | 'textarea' | 'select';
