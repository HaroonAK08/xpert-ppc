import { apiRequest } from './client';
import type { ApiSuccess, ColumnMapping, GoogleSheetConnection, SyncReport } from '@/types/crm';

export async function fetchSheetConnection() {
  return apiRequest<
    ApiSuccess<{ configured: boolean; connection: GoogleSheetConnection | null }>
  >('/api/v1/integrations/google-sheets');
}

export async function fetchSyncStatus() {
  return apiRequest<
    ApiSuccess<{
      configured: boolean;
      connected: boolean;
      lastSyncedAt: string | null;
      lastSyncState: string;
      lastSyncReport: SyncReport | null;
      spreadsheetId: string | null;
      worksheetName: string | null;
      spreadsheetTitle: string | null;
    }>
  >('/api/v1/integrations/google-sheets/status');
}

export async function connectSheet(body: {
  spreadsheetId: string;
  worksheetName?: string;
  spreadsheetTitle?: string;
  columnMapping?: ColumnMapping;
}) {
  return apiRequest<
    ApiSuccess<{
      connection: GoogleSheetConnection;
      headers: string[];
      suggestedMapping: ColumnMapping;
    }>
  >('/api/v1/integrations/google-sheets/connect', { method: 'POST', body });
}

export async function syncSheet() {
  return apiRequest<
    ApiSuccess<{ report: SyncReport; connection: GoogleSheetConnection | null }>
  >('/api/v1/integrations/google-sheets/sync', { method: 'POST', timeoutMs: 120000 });
}

export async function disconnectSheet() {
  return apiRequest<ApiSuccess<{ disconnected: boolean }>>(
    '/api/v1/integrations/google-sheets/disconnect',
    { method: 'DELETE' }
  );
}

export async function updateSheetMapping(body: {
  worksheetName?: string;
  columnMapping?: ColumnMapping;
  spreadsheetTitle?: string;
}) {
  return apiRequest<ApiSuccess<GoogleSheetConnection>>(
    '/api/v1/integrations/google-sheets/mapping',
    { method: 'PATCH', body }
  );
}
