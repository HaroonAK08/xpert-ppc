import { apiRequest } from './client';
import type { ApiSuccess, CrmLead, LeadActivity, LeadNote, PaginatedMeta } from '@/types/crm';
import type { CrmLeadStatus } from '@/types/crm';

export type LeadListParams = {
  page?: number;
  page_size?: number;
  search?: string;
  status?: string;
  replied?: 'true' | 'false';
  follow_up?: 'due' | 'upcoming' | 'set';
  source?: string;
  sort?: 'newest' | 'oldest' | 'updated' | 'follow_up';
  created_from?: string;
  created_to?: string;
};

function toQuery(params: LeadListParams): string {
  const q = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '') q.set(k, String(v));
  });
  const s = q.toString();
  return s ? `?${s}` : '';
}

export async function fetchLeads(params: LeadListParams = {}) {
  return apiRequest<ApiSuccess<CrmLead[]> & { meta: PaginatedMeta }>(
    `/api/v1/leads${toQuery(params)}`
  );
}

export async function fetchLead(id: string) {
  return apiRequest<
    ApiSuccess<{ lead: CrmLead; notes: LeadNote[]; activity: LeadActivity[] }>
  >(`/api/v1/leads/${id}`);
}

export async function createLead(body: Partial<CrmLead> & { name: string }) {
  return apiRequest<ApiSuccess<CrmLead>>('/api/v1/leads', { method: 'POST', body });
}

export async function updateLead(
  id: string,
  body: Partial<{
    name: string;
    email: string;
    phone: string;
    businessName: string;
    source: string;
    message: string;
    status: CrmLeadStatus;
    notes: string;
    replied: boolean;
    followUpAt: string | null;
  }>
) {
  return apiRequest<ApiSuccess<CrmLead>>(`/api/v1/leads/${id}`, { method: 'PATCH', body });
}

export async function markContacted(id: string, note?: string, status?: CrmLeadStatus) {
  return apiRequest<ApiSuccess<CrmLead>>(`/api/v1/leads/${id}/contact`, {
    method: 'POST',
    body: { note, status },
  });
}

export async function markReplied(
  id: string,
  note?: string,
  channel?: 'email' | 'whatsapp' | 'phone' | 'other'
) {
  return apiRequest<ApiSuccess<CrmLead>>(`/api/v1/leads/${id}/reply`, {
    method: 'POST',
    body: { note, channel },
  });
}

export async function addNote(id: string, text: string) {
  return apiRequest<ApiSuccess<LeadNote>>(`/api/v1/leads/${id}/notes`, {
    method: 'POST',
    body: { text },
  });
}

export async function setFollowUp(id: string, followUpAt: string | null, note?: string) {
  return apiRequest<ApiSuccess<CrmLead>>(`/api/v1/leads/${id}/follow-up`, {
    method: 'POST',
    body: { followUpAt, note },
  });
}

export async function completeFollowUp(id: string) {
  return apiRequest<ApiSuccess<CrmLead>>(`/api/v1/leads/${id}/follow-up/complete`, {
    method: 'POST',
  });
}

export async function queueLeadSync(id: string) {
  return apiRequest<ApiSuccess<{ queued: boolean; lead: CrmLead }>>(`/api/v1/leads/${id}/sync`, {
    method: 'POST',
  });
}
