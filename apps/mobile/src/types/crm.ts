export type {
  ApiErrorBody,
  ApiSuccess,
  CrmLead,
  CrmUser,
  DashboardPayload,
  DashboardStats,
  GoogleSheetConnection,
  LeadActivity,
  LeadNote,
  PaginatedMeta,
  SyncReport,
} from '../../../../shared/crm/types';

export type {
  CrmLeadStatus,
  ColumnMapping,
  LeadActivityAction,
  SyncState,
} from '../../../../shared/crm/constants';

export {
  CRM_LEAD_STATUSES,
  LEAD_STATUS_LABELS,
  normalizeLeadStatus,
} from '../../../../shared/crm/constants';

export { normalizePhone, normalizeEmail, whatsappDigits } from '../../../../shared/crm/normalize';
