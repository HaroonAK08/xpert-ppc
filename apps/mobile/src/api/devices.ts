import { apiRequest } from './client';
import type { ApiSuccess } from '@/types/crm';

export async function registerDevice(token: string, platform: 'ios' | 'android' | 'web') {
  return apiRequest<ApiSuccess<{ registered: boolean }>>('/api/v1/devices', {
    method: 'POST',
    body: { token, platform },
  });
}

export async function unregisterDevice(token: string) {
  return apiRequest<ApiSuccess<{ registered: boolean }>>('/api/v1/devices', {
    method: 'DELETE',
    body: { token },
  });
}
