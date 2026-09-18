import type { LeadDoc } from '../models/Lead';
import type { LeadNoteDoc } from '../models/LeadNote';
import type { LeadActivityDoc } from '../models/LeadActivity';
import type { GoogleSheetConnectionDoc } from '../models/GoogleSheetConnection';
import { normalizeLeadStatus } from '../../../shared/crm/constants';
import type { CrmLead, LeadNote, LeadActivity, GoogleSheetConnection } from '../../../shared/crm/types';

type LeanLead = LeadDoc & { _id: { toString(): string }; createdAt?: Date; updatedAt?: Date };

export function serializeLead(doc: LeanLead | Record<string, unknown>): CrmLead {
  const l = doc as LeanLead;
  const id = String(l._id);
  const businessName = String(l.businessName || l.company || '');

  return {
    id,
    externalId: String(l.externalId || ''),
    name: String(l.name || ''),
    phone: String(l.phone || ''),
    phoneNormalized: String(l.phoneNormalized || ''),
    email: String(l.email || ''),
    businessName,
    source: String(l.source || ''),
    message: String(l.message || ''),
    status: normalizeLeadStatus(String(l.status || 'new')),
    notes: String(l.notes || ''),
    replied: Boolean(l.replied),
    contactedAt: l.contactedAt ? new Date(l.contactedAt).toISOString() : null,
    repliedAt: l.repliedAt ? new Date(l.repliedAt).toISOString() : null,
    followUpAt: l.followUpAt ? new Date(l.followUpAt).toISOString() : null,
    createdAt: l.createdAt ? new Date(l.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: l.updatedAt ? new Date(l.updatedAt).toISOString() : new Date().toISOString(),
    lastSyncedAt: l.lastSyncedAt ? new Date(l.lastSyncedAt).toISOString() : null,
    sheetRowNumber: typeof l.sheetRowNumber === 'number' ? l.sheetRowNumber : null,
    sheetChecksum: l.sheetChecksum ? String(l.sheetChecksum) : null,
    website: String(l.website || ''),
    platform: String(l.platform || 'Other'),
    monthlyBudget: String(l.monthlyBudget || ''),
  };
}

export function serializeNote(
  doc: (LeadNoteDoc & { _id: { toString(): string }; createdAt?: Date; updatedAt?: Date }) | Record<string, unknown>
): LeadNote {
  const n = doc as LeadNoteDoc & { _id: { toString(): string }; createdAt?: Date; updatedAt?: Date };
  return {
    id: String(n._id),
    leadId: String(n.lead),
    authorId: String(n.author),
    authorName: String(n.authorName || ''),
    text: String(n.text || ''),
    createdAt: n.createdAt ? new Date(n.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: n.updatedAt ? new Date(n.updatedAt).toISOString() : new Date().toISOString(),
  };
}

export function serializeActivity(
  doc:
    | (LeadActivityDoc & { _id: { toString(): string }; createdAt?: Date })
    | Record<string, unknown>
): LeadActivity {
  const a = doc as LeadActivityDoc & { _id: { toString(): string }; createdAt?: Date };
  return {
    id: String(a._id),
    leadId: String(a.lead),
    userId: a.user ? String(a.user) : null,
    userName: a.userName ? String(a.userName) : null,
    action: a.action as LeadActivity['action'],
    metadata: (a.metadata as Record<string, unknown>) || {},
    createdAt: a.createdAt ? new Date(a.createdAt).toISOString() : new Date().toISOString(),
  };
}

export function serializeSheetConnection(
  doc:
    | (GoogleSheetConnectionDoc & { _id: { toString(): string }; createdAt?: Date; updatedAt?: Date })
    | Record<string, unknown>
): GoogleSheetConnection {
  const c = doc as GoogleSheetConnectionDoc & {
    _id: { toString(): string };
    createdAt?: Date;
    updatedAt?: Date;
  };
  const report = c.lastSyncReport
    ? {
        checked: c.lastSyncReport.checked ?? 0,
        created: c.lastSyncReport.created ?? 0,
        updated: c.lastSyncReport.updated ?? 0,
        skipped: c.lastSyncReport.skipped ?? 0,
        conflicts: c.lastSyncReport.conflicts ?? 0,
        failed: c.lastSyncReport.failed ?? 0,
        pushed: c.lastSyncReport.pushed ?? 0,
        errors: ((c.lastSyncReport as { errorItems?: Array<{ row?: number; message: string }>; errors?: Array<{ row?: number; message: string }> }).errorItems
          || (c.lastSyncReport as { errors?: Array<{ row?: number; message: string }> }).errors
          || []).map((e) => ({
          row: e.row ?? undefined,
          message: e.message,
        })),
        startedAt: c.lastSyncReport.startedAt
          ? new Date(c.lastSyncReport.startedAt).toISOString()
          : '',
        finishedAt: c.lastSyncReport.finishedAt
          ? new Date(c.lastSyncReport.finishedAt).toISOString()
          : '',
        state: (c.lastSyncReport.state || 'idle') as GoogleSheetConnection['lastSyncState'],
      }
    : null;

  return {
    id: String(c._id),
    spreadsheetId: String(c.spreadsheetId || ''),
    spreadsheetTitle: String(c.spreadsheetTitle || ''),
    worksheetName: String(c.worksheetName || ''),
    columnMapping: (c.columnMapping || {}) as GoogleSheetConnection['columnMapping'],
    connected: Boolean(c.connected),
    lastSyncedAt: c.lastSyncedAt ? new Date(c.lastSyncedAt).toISOString() : null,
    lastSyncState: (c.lastSyncState || 'idle') as GoogleSheetConnection['lastSyncState'],
    lastSyncReport: report,
    createdAt: c.createdAt ? new Date(c.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: c.updatedAt ? new Date(c.updatedAt).toISOString() : new Date().toISOString(),
  };
}

export function ok<T>(data: T, meta?: Record<string, unknown>) {
  return meta ? { data, meta } : { data };
}

export function fail(code: string, message: string, details?: unknown) {
  return { error: { code, message, ...(details !== undefined ? { details } : {}) } };
}
