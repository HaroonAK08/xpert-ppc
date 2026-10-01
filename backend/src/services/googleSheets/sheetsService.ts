import crypto from 'crypto';
import { google, type sheets_v4 } from 'googleapis';

import { env } from '../../config/env';
import { Lead } from '../../models/Lead';
import { GoogleSheetConnection } from '../../models/GoogleSheetConnection';
import { recordLeadActivity } from '../../utils/activity';
import { notifyLeadsSynced } from '../../utils/push';
import { normalizeEmail, normalizePhone, isValidEmail } from '../../../../shared/crm/normalize';
import {
  CRM_LEAD_STATUSES,
  normalizeLeadStatus,
  type ColumnMapping,
  type SheetFieldKey,
} from '../../../../shared/crm/constants';
import type { SyncReport } from '../../../../shared/crm/types';

export type SheetRow = Record<string, string>;

function parseServiceAccount() {
  const raw = env.googleServiceAccountJson;
  if (!raw) return null;
  try {
    if (raw.trim().startsWith('{')) return JSON.parse(raw);
    // Path-style: allow base64-encoded JSON
    return JSON.parse(Buffer.from(raw, 'base64').toString('utf8'));
  } catch {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON is not valid JSON or base64 JSON.');
  }
}

export function isGoogleConfigured(): boolean {
  return Boolean(env.googleServiceAccountJson);
}

/**
 * Accepts either a raw spreadsheet ID or a full Google Sheets URL (people
 * paste the share link far more often than the bare ID) and returns just
 * the ID. A URL sent as-is to the Sheets API fails with a misleading
 * "Requested entity was not found" rather than an obviously-bad-input error.
 */
export function extractSpreadsheetId(input: string): string {
  const trimmed = input.trim();
  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : trimmed;
}

export async function getSheetsClient(): Promise<sheets_v4.Sheets> {
  const credentials = parseServiceAccount();
  if (!credentials) {
    throw new Error(
      'Google Sheets is not configured. Set GOOGLE_SERVICE_ACCOUNT_JSON in backend/.env'
    );
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth });
}

export function checksumRow(values: Record<string, string>): string {
  const ordered = Object.keys(values)
    .sort()
    .map((k) => `${k}=${values[k] ?? ''}`)
    .join('|');
  return crypto.createHash('sha256').update(ordered).digest('hex').slice(0, 32);
}

export function invertMapping(mapping: ColumnMapping): Record<string, SheetFieldKey> {
  const inverted: Record<string, SheetFieldKey> = {};
  for (const [field, header] of Object.entries(mapping)) {
    if (header) inverted[header.trim().toLowerCase()] = field as SheetFieldKey;
  }
  return inverted;
}

/** Suggest mapping from common header aliases. */
export function suggestColumnMapping(headers: string[]): ColumnMapping {
  const aliases: Record<SheetFieldKey, string[]> = {
    name: ['name', 'client name', 'full name', 'lead name', 'contact'],
    phone: ['phone', 'mobile', 'cell', 'whatsapp', 'contact number', 'phone number'],
    email: ['email', 'email address', 'e-mail', 'mail'],
    business_name: ['business', 'business name', 'company', 'company name', 'organization'],
    source: ['source', 'lead source', 'origin', 'channel'],
    message: ['message', 'lead message', 'inquiry', 'notes from form', 'comment', 'comments'],
    status: ['status', 'lead status', 'stage'],
    replied: ['replied', 'reply', 'has replied', 'responded'],
    notes: ['notes', 'internal notes', 'crm notes'],
    contacted_at: ['contacted at', 'contacted', 'last contacted', 'contacted on'],
    replied_at: ['replied at', 'replied on', 'last replied'],
    follow_up_at: ['follow up', 'follow-up', 'follow up at', 'followup', 'next follow up'],
    created_at: ['created at', 'created', 'date created', 'submitted at'],
    updated_at: ['updated at', 'updated', 'last updated'],
    external_id: ['external id', 'id', 'lead id', 'row id', 'uid'],
  };

  const mapping: ColumnMapping = {};
  const used = new Set<string>();

  for (const [field, names] of Object.entries(aliases) as Array<[SheetFieldKey, string[]]>) {
    const match = headers.find((h) => {
      const key = h.trim().toLowerCase();
      return names.includes(key) && !used.has(h);
    });
    if (match) {
      mapping[field] = match;
      used.add(match);
    }
  }
  return mapping;
}

function parseBool(raw: string): boolean {
  const v = raw.trim().toLowerCase();
  return ['true', 'yes', 'y', '1', 'replied', 'done'].includes(v);
}

function parseDate(raw: string): Date | null {
  if (!raw?.trim()) return null;
  const d = new Date(raw);
  return Number.isNaN(d.getTime()) ? null : d;
}

function mapRowToLeadFields(row: SheetRow, mapping: ColumnMapping) {
  const get = (field: SheetFieldKey) => {
    const header = mapping[field];
    if (!header) return '';
    return (row[header] ?? row[header.toLowerCase()] ?? '').trim();
  };

  const emailRaw = get('email');
  const phoneRaw = get('phone');
  const statusRaw = get('status');
  const business = get('business_name');

  return {
    name: get('name') || 'Unknown',
    email: emailRaw && isValidEmail(emailRaw) ? normalizeEmail(emailRaw) : emailRaw ? normalizeEmail(emailRaw) : `sheet-row@unknown.local`,
    phone: phoneRaw,
    phoneNormalized: normalizePhone(phoneRaw),
    businessName: business,
    company: business,
    source: get('source') || 'google-sheets',
    message: get('message'),
    status: statusRaw
      ? normalizeLeadStatus(statusRaw.trim().toLowerCase().replace(/\s+/g, '_'))
      : ('new' as const),
    replied: parseBool(get('replied')),
    notes: get('notes'),
    contactedAt: parseDate(get('contacted_at')),
    repliedAt: parseDate(get('replied_at')),
    followUpAt: parseDate(get('follow_up_at')),
    externalId: get('external_id'),
  };
}

function leadToSheetValues(
  lead: {
    name?: string;
    phone?: string;
    email?: string;
    businessName?: string;
    company?: string;
    source?: string;
    message?: string;
    status?: string;
    replied?: boolean;
    notes?: string;
    contactedAt?: Date | null;
    repliedAt?: Date | null;
    followUpAt?: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
    externalId?: string;
  },
  mapping: ColumnMapping,
  headers: string[]
): string[] {
  const fieldValues: Record<SheetFieldKey, string> = {
    name: lead.name || '',
    phone: lead.phone || '',
    email: lead.email || '',
    business_name: lead.businessName || lead.company || '',
    source: lead.source || '',
    message: lead.message || '',
    status: lead.status || '',
    replied: lead.replied ? 'TRUE' : 'FALSE',
    notes: lead.notes || '',
    contacted_at: lead.contactedAt ? new Date(lead.contactedAt).toISOString() : '',
    replied_at: lead.repliedAt ? new Date(lead.repliedAt).toISOString() : '',
    follow_up_at: lead.followUpAt ? new Date(lead.followUpAt).toISOString() : '',
    created_at: lead.createdAt ? new Date(lead.createdAt).toISOString() : '',
    updated_at: lead.updatedAt ? new Date(lead.updatedAt).toISOString() : '',
    external_id: lead.externalId || '',
  };

  return headers.map((header) => {
    const field = (Object.entries(mapping) as Array<[SheetFieldKey, string | undefined]>).find(
      ([, h]) => h === header
    )?.[0];
    return field ? fieldValues[field] ?? '' : '';
  });
}

export async function fetchSheetHeaders(
  spreadsheetId: string,
  worksheetName: string
): Promise<string[]> {
  const sheets = await getSheetsClient();
  const range = `${worksheetName}!1:1`;
  const res = await sheets.spreadsheets.values.get({ spreadsheetId, range });
  return ((res.data.values?.[0] as string[]) || []).map((h) => String(h || '').trim()).filter(Boolean);
}

export async function fetchSheetRows(
  spreadsheetId: string,
  worksheetName: string
): Promise<{ headers: string[]; rows: Array<{ rowNumber: number; data: SheetRow }> }> {
  const sheets = await getSheetsClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: worksheetName,
  });
  const values = (res.data.values || []) as string[][];
  if (values.length === 0) return { headers: [], rows: [] };

  const headers = values[0].map((h) => String(h || '').trim());
  const rows = values.slice(1).map((cols, idx) => {
    const data: SheetRow = {};
    headers.forEach((h, i) => {
      if (h) data[h] = String(cols[i] ?? '');
    });
    return { rowNumber: idx + 2, data };
  });

  return { headers: headers.filter(Boolean), rows };
}

export async function updateSheetRow(
  spreadsheetId: string,
  worksheetName: string,
  rowNumber: number,
  values: string[]
) {
  const sheets = await getSheetsClient();
  const endCol = columnLetter(values.length);
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: `${worksheetName}!A${rowNumber}:${endCol}${rowNumber}`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [values] },
  });
}

function columnLetter(n: number): string {
  let result = '';
  let num = n;
  while (num > 0) {
    const rem = (num - 1) % 26;
    result = String.fromCharCode(65 + rem) + result;
    num = Math.floor((num - 1) / 26);
  }
  return result || 'A';
}

async function findExistingLead(fields: {
  externalId: string;
  email: string;
  phoneNormalized: string;
  sheetRowNumber: number;
  connectionId: string;
}) {
  // Scoped to this sheet's connection so leads from different users/sheets
  // never match each other and get cross-contaminated.
  if (fields.externalId) {
    const byExt = await Lead.findOne({
      externalId: fields.externalId,
      sheetConnectionId: fields.connectionId,
    });
    if (byExt) return byExt;
  }

  const byRow = await Lead.findOne({
    sheetRowNumber: fields.sheetRowNumber,
    sheetConnectionId: fields.connectionId,
    source: 'google-sheets',
  });
  if (byRow) return byRow;

  if (fields.phoneNormalized) {
    const byPhone = await Lead.findOne({
      phoneNormalized: fields.phoneNormalized,
      sheetConnectionId: fields.connectionId,
    });
    if (byPhone) return byPhone;
  }

  if (fields.email && !fields.email.endsWith('@unknown.local')) {
    const byEmail = await Lead.findOne({
      email: fields.email,
      sheetConnectionId: fields.connectionId,
    });
    if (byEmail) return byEmail;
  }

  return null;
}

const OUTBOUND_FIELDS = [
  'status',
  'replied',
  'notes',
  'contactedAt',
  'repliedAt',
  'followUpAt',
] as const;

/**
 * Two-way sync:
 * 1) Pull sheet → create/update leads (skip local-dirty conflicts)
 * 2) Push local-dirty leads → sheet rows
 */
export async function runTwoWaySync(connectionId: string, userId?: string): Promise<SyncReport> {
  const connection = await GoogleSheetConnection.findById(connectionId);
  if (!connection || !connection.connected) {
    throw new Error('Google Sheet is not connected.');
  }

  const startedAt = new Date();
  const report: SyncReport = {
    checked: 0,
    created: 0,
    updated: 0,
    skipped: 0,
    conflicts: 0,
    failed: 0,
    pushed: 0,
    errors: [],
    startedAt: startedAt.toISOString(),
    finishedAt: '',
    state: 'syncing',
  };

  connection.lastSyncState = 'syncing';
  await connection.save();

  console.log('[sheets] sync started', connection.spreadsheetId);

  try {
    const mapping = (connection.columnMapping || {}) as ColumnMapping;
    const { headers, rows } = await fetchSheetRows(
      connection.spreadsheetId,
      connection.worksheetName
    );

    const effectiveMapping =
      Object.values(mapping).some(Boolean) ? mapping : suggestColumnMapping(headers);

    for (const { rowNumber, data } of rows) {
      report.checked += 1;
      try {
        const fields = mapRowToLeadFields(data, effectiveMapping);
        if (!fields.name && !fields.phone && !fields.email) {
          report.skipped += 1;
          continue;
        }

        const sheetCheck = checksumRow(data);
        const existing = await findExistingLead({
          externalId: fields.externalId,
          email: fields.email,
          phoneNormalized: fields.phoneNormalized,
          sheetRowNumber: rowNumber,
          connectionId: String(connection._id),
        });

        if (existing) {
          const localDirty =
            existing.localDirtyAt &&
            (!existing.lastSyncedAt || existing.localDirtyAt > existing.lastSyncedAt);

          if (localDirty && existing.sheetChecksum && existing.sheetChecksum !== sheetCheck) {
            report.conflicts += 1;
            await recordLeadActivity({
              leadId: String(existing._id),
              userId,
              action: 'sync_conflict',
              metadata: { rowNumber, reason: 'local_and_sheet_both_changed' },
            });
            // Keep local CRM fields; refresh checksum awareness only
            existing.sheetChecksum = sheetCheck;
            existing.sheetRowNumber = rowNumber;
            await existing.save();
            continue;
          }

          if (existing.sheetChecksum === sheetCheck && !localDirty) {
            report.skipped += 1;
            existing.lastSyncedAt = new Date();
            existing.sheetRowNumber = rowNumber;
            await existing.save();
            continue;
          }

          if (!localDirty) {
            existing.name = fields.name;
            existing.email = fields.email;
            existing.phone = fields.phone;
            existing.phoneNormalized = fields.phoneNormalized;
            existing.businessName = fields.businessName;
            existing.company = fields.company;
            existing.source = fields.source;
            existing.message = fields.message;
            if ((CRM_LEAD_STATUSES as readonly string[]).includes(fields.status)) {
              existing.status = fields.status;
            }
            existing.replied = fields.replied;
            existing.notes = fields.notes || existing.notes;
            existing.contactedAt = fields.contactedAt;
            existing.repliedAt = fields.repliedAt;
            existing.followUpAt = fields.followUpAt;
            if (fields.externalId) existing.externalId = fields.externalId;
          }

          existing.sheetRowNumber = rowNumber;
          existing.sheetChecksum = sheetCheck;
          existing.lastSyncedAt = new Date();
          existing.sheetConnectionId = connection._id;
          existing.ownerUserId = connection.ownerUserId ?? null;
          await existing.save();
          report.updated += 1;
          await recordLeadActivity({
            leadId: String(existing._id),
            userId,
            action: 'synced_from_sheets',
            metadata: { rowNumber },
          });
        } else {
          const created = await Lead.create({
            ...fields,
            sheetRowNumber: rowNumber,
            sheetChecksum: sheetCheck,
            lastSyncedAt: new Date(),
            source: fields.source || 'google-sheets',
            sheetConnectionId: connection._id,
            ownerUserId: connection.ownerUserId ?? null,
          });
          report.created += 1;
          await recordLeadActivity({
            leadId: String(created._id),
            userId,
            action: 'synced_from_sheets',
            metadata: { rowNumber, created: true },
          });
        }
      } catch (err) {
        report.failed += 1;
        report.errors.push({
          row: rowNumber,
          message: err instanceof Error ? err.message : 'Row import failed',
        });
      }
    }

    // Push local dirty leads that have a sheet row — scoped to this connection
    // only, so a dirty lead from one user's sheet never gets written into
    // another user's spreadsheet.
    const dirtyLeads = await Lead.find({
      localDirtyAt: { $ne: null },
      sheetRowNumber: { $ne: null },
      sheetConnectionId: connection._id,
    }).limit(500);

    for (const lead of dirtyLeads) {
      if (!lead.sheetRowNumber) continue;
      if (lead.lastSyncedAt && lead.localDirtyAt && lead.localDirtyAt <= lead.lastSyncedAt) {
        continue;
      }
      try {
        const values = leadToSheetValues(lead, effectiveMapping, headers);
        await updateSheetRow(
          connection.spreadsheetId,
          connection.worksheetName,
          lead.sheetRowNumber,
          values
        );
        lead.lastSyncedAt = new Date();
        lead.localDirtyAt = null;
        lead.sheetChecksum = checksumRow(
          Object.fromEntries(headers.map((h, i) => [h, values[i] ?? '']))
        );
        await lead.save();
        report.pushed += 1;
        await recordLeadActivity({
          leadId: String(lead._id),
          userId,
          action: 'synced_to_sheets',
          metadata: { rowNumber: lead.sheetRowNumber },
        });
      } catch (err) {
        report.failed += 1;
        report.errors.push({
          row: lead.sheetRowNumber ?? undefined,
          message: err instanceof Error ? err.message : 'Push to sheet failed',
        });
      }
    }

    // Also push outbound-changed leads without waiting for localDirty if marked
    void OUTBOUND_FIELDS;

    report.state = report.failed > 0 && report.created + report.updated + report.pushed === 0
      ? 'failed'
      : 'success';
    report.finishedAt = new Date().toISOString();

    connection.lastSyncedAt = new Date();
    connection.lastSyncState = report.state;
    connection.set('lastSyncReport', {
      checked: report.checked,
      created: report.created,
      updated: report.updated,
      skipped: report.skipped,
      conflicts: report.conflicts,
      failed: report.failed,
      pushed: report.pushed,
      errorItems: report.errors,
      startedAt,
      finishedAt: new Date(),
      state: report.state,
    });
    connection.columnMapping = effectiveMapping;
    await connection.save();

    console.log('[sheets] sync completed', {
      checked: report.checked,
      created: report.created,
      updated: report.updated,
      pushed: report.pushed,
      failed: report.failed,
    });

    void notifyLeadsSynced(report.created);

    return report;
  } catch (err) {
    report.state = 'failed';
    report.finishedAt = new Date().toISOString();
    report.errors.push({
      message: err instanceof Error ? err.message : 'Sync failed',
    });
    connection.lastSyncState = 'failed';
    connection.set('lastSyncReport', {
      checked: report.checked,
      created: report.created,
      updated: report.updated,
      skipped: report.skipped,
      conflicts: report.conflicts,
      failed: report.failed,
      pushed: report.pushed,
      errorItems: report.errors,
      startedAt,
      finishedAt: new Date(),
      state: 'failed' as const,
    });
    await connection.save();
    console.error('[sheets] sync failed', err);
    throw err;
  }
}

/** Mark lead dirty so next sync pushes CRM changes to the sheet. */
export async function markLeadDirty(leadId: string) {
  await Lead.findByIdAndUpdate(leadId, { localDirtyAt: new Date() });
}

/** In-memory sheet for unit tests without Google credentials. */
export class MockSheetsStore {
  headers: string[] = [];
  rows: string[][] = [];

  setTable(headers: string[], rows: string[][]) {
    this.headers = headers;
    this.rows = rows;
  }

  getValues(): string[][] {
    return [this.headers, ...this.rows];
  }

  updateRow(rowNumber: number, values: string[]) {
    const idx = rowNumber - 2;
    if (idx < 0) return;
    while (this.rows.length <= idx) this.rows.push([]);
    this.rows[idx] = values;
  }
}
