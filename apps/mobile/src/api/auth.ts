import { apiRequest } from './client';
import type { ApiSuccess, CrmUser } from '@/types/crm';

export async function login(email: string, password: string) {
  const res = await apiRequest<{
    ok: boolean;
    token: string;
    user: CrmUser;
  }>('/api/auth/login', {
    method: 'POST',
    body: { email, password },
    auth: false,
  });
  return res;
}

export async function fetchMe() {
  return apiRequest<{ user: CrmUser }>('/api/auth/me');
}

export async function logout() {
  try {
    await apiRequest('/api/auth/logout', { method: 'POST' });
  } catch {
    // Ignore — local session clear still happens
  }
}
