/**
 * Thin client for the existing xpertppc-backend API — same backend the
 * marketing site's /admin and the mobile app already use. The session lives
 * in an httpOnly cookie set by the API (a different origin from this app),
 * so every call needs `credentials: 'include'`.
 */
export const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
).replace(/\/$/, '');

export type ApiResult<T> = { ok: true; data: T; meta?: Record<string, unknown> } | { ok: false; error: string };

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

    const body = await res.json().catch(() => null);

    if (!res.ok) {
      const message =
        (body && typeof body === 'object' && 'error' in body
          ? typeof body.error === 'string'
            ? body.error
            : (body.error as { message?: string })?.message
          : null) ?? `Request failed (${res.status}).`;
      return { ok: false, error: message };
    }

    // The CRM v1 API wraps payloads as { data, meta? }; unwrap so callers get T directly.
    if (body && typeof body === 'object' && 'data' in body) {
      return { ok: true, data: body.data as T, meta: body.meta };
    }
    return { ok: true, data: body as T };
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
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body ?? {}) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};

export type CurrentUser = { sub: string; email: string; name: string; role: 'admin' | 'editor' | 'client' };

export type CrmSheetConnection = {
  id: string;
  spreadsheetId: string;
  spreadsheetTitle: string;
  worksheetName: string;
  connected: boolean;
  lastSyncedAt: string | null;
  lastSyncState: 'idle' | 'syncing' | 'success' | 'failed';
};

export type CrmClient = {
  id: string;
  email: string;
  name: string;
  active: boolean;
  createdAt: string;
  lastLoginAt: string | null;
  leadCount: number;
  sheet: CrmSheetConnection | null;
};
