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
