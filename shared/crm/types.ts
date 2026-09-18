import type {
  ColumnMapping,
  CrmLeadStatus,
  LeadActivityAction,
  SyncState,
} from './constants';

export type ApiErrorBody = {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export type ApiSuccess<T> = {
  data: T;
  meta?: Record<string, unknown>;
};

export type PaginatedMeta = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type CrmUser = {
  id: string;
  email: string;
  name: string;
  role: string;
};

export type LeadNote = {
  id: string;
  leadId: string;
  authorId: string;
  authorName: string;
  text: string;
  createdAt: string;
  updatedAt: string;
};

export type LeadActivity = {
  id: string;
  leadId: string;
  userId: string | null;
  userName: string | null;
  action: LeadActivityAction;
  metadata: Record<string, unknown>;
  createdAt: string;
};

export type CrmLead = {
  id: string;
  externalId: string;
  name: string;
  phone: string;
  phoneNormalized: string;
  email: string;
  businessName: string;
  source: string;
  message: string;
  status: CrmLeadStatus;
  notes: string;
  replied: boolean;
  contactedAt: string | null;
  repliedAt: string | null;
  followUpAt: string | null;
  createdAt: string;
  updatedAt: string;
  lastSyncedAt: string | null;
  sheetRowNumber: number | null;
  sheetChecksum: string | null;
  website: string;
  platform: string;
  monthlyBudget: string;
};

export type DashboardStats = {
  total: number;
  new: number;
  contacted: number;
  replied: number;
  interested: number;
  followUp: number;
  followUpsDue: number;
  followUpsToday: number;
  converted: number;
  notInterested: number;
  closed: number;
  lastSyncedAt: string | null;
};

export type DashboardPayload = {
  stats: DashboardStats;
  recentLeads: CrmLead[];
  followUpsToday: CrmLead[];
  recentActivity: LeadActivity[];
};

export type GoogleSheetConnection = {
  id: string;
  spreadsheetId: string;
  spreadsheetTitle: string;
  worksheetName: string;
  columnMapping: ColumnMapping;
  connected: boolean;
  lastSyncedAt: string | null;
  lastSyncState: SyncState;
  lastSyncReport: SyncReport | null;
  createdAt: string;
  updatedAt: string;
};

export type SyncReport = {
  checked: number;
  created: number;
  updated: number;
  skipped: number;
  conflicts: number;
  failed: number;
  pushed: number;
  errors: Array<{ row?: number; message: string }>;
  startedAt: string;
  finishedAt: string;
  state: SyncState;
};
