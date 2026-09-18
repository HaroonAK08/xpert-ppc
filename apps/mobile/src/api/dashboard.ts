import { apiRequest } from './client';
import type { ApiSuccess, DashboardPayload } from '@/types/crm';

export async function fetchDashboard() {
  return apiRequest<ApiSuccess<DashboardPayload>>('/api/v1/dashboard');
}
