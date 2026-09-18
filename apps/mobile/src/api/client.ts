import { useAuthStore } from '@/store/auth';
import type { ApiErrorBody } from '@/types/crm';

const API_URL = (process.env.EXPO_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');

export class ApiClientError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
  auth?: boolean;
  signal?: AbortSignal;
  timeoutMs?: number;
};

async function parseJson(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { error: text };
  }
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, auth = true, signal, timeoutMs = 25000 } = options;
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };

  if (auth) {
    const token = useAuthStore.getState().token;
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const onAbort = () => controller.abort();
  signal?.addEventListener('abort', onAbort);

  try {
    const res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });

    const json = await parseJson(res);

    if (!res.ok) {
      const errBody = json as ApiErrorBody | { error?: string };
      if (errBody && typeof errBody === 'object' && 'error' in errBody) {
        if (typeof errBody.error === 'string') {
          throw new ApiClientError(errBody.error, res.status);
        }
        const structured = errBody as ApiErrorBody;
        throw new ApiClientError(
          structured.error?.message || 'Request failed',
          res.status,
          structured.error?.code,
          structured.error?.details
        );
      }
      throw new ApiClientError('Request failed', res.status);
    }

    return json as T;
  } catch (err) {
    if (err instanceof ApiClientError) throw err;
    if (err instanceof Error && err.name === 'AbortError') {
      throw new ApiClientError('Request timed out or was cancelled.', 408, 'TIMEOUT');
    }
    throw new ApiClientError(
      'Network unavailable. Check your connection and try again.',
      0,
      'NETWORK'
    );
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener('abort', onAbort);
  }
}

export { API_URL };
