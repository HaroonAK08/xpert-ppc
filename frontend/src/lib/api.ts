/**
 * Thin client for the Express backend.
 *
 * `credentials: 'include'` is required on every admin call: the session lives
 * in an httpOnly cookie set by the API, which is a different origin in dev.
 */
export const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
).replace(/\/$/, '');

export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string };

async function request<T>(path: string, init: RequestInit = {}): Promise<ApiResult<T>> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      ...init,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(init.headers ?? {}),
      },
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return { ok: false, error: data?.error ?? `Request failed (${res.status}).` };
    }

    return { ok: true, data: data as T };
  } catch {
    return { ok: false, error: 'Cannot reach the server. Please check your connection.' };
  }
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body ?? {}) }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body ?? {}) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};

/* ------------------------------- types --------------------------------- */

export type Lead = {
  id: string;
  _id: string;
  name: string;
  email: string;
  phone: string;
  platform: string;
  message: string;
  source: string;
  sourcePath: string;
  status: string;
  notes: string;
  createdAt: string;
};

export type LeadsResponse = {
  items: Lead[];
  total: number;
  page: number;
  limit: number;
  counts: Record<string, number>;
};

export type AdminUser = { sub: string; email: string; name: string; role: string };
