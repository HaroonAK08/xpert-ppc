/**
 * Thin client for the existing xpertppc-backend student API — same backend
 * the marketing site's embedded course portal and the CRM already use.
 *
 * Auth: this app runs on a different origin than the API, and cross-site
 * cookies are blocked on many mobile browsers, so we keep the JWT from
 * /api/student/auth/login|signup and send it as Bearer — same pattern as
 * crm-frontend. Cookies still work where the browser allows them.
 */
export const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');

const TOKEN_KEY = 'xpertppc-courses-token';

export function getAuthToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAuthToken(token: string | null) {
  try {
    if (!token) localStorage.removeItem(TOKEN_KEY);
    else localStorage.setItem(TOKEN_KEY, token);
  } catch {
    /* ignore quota / private mode */
  }
}

export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string };

async function request<T>(path: string, init: RequestInit = {}): Promise<ApiResult<T>> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(init.headers as Record<string, string> | undefined),
    };
    const token = typeof window !== 'undefined' ? getAuthToken() : null;
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${API_URL}${path}`, {
      ...init,
      credentials: 'include',
      headers,
    });

    const body = await res.json().catch(() => null);

    if (!res.ok) {
      if (res.status === 401) setAuthToken(null);
      const message =
        (body && typeof body === 'object' && 'error' in body
          ? typeof body.error === 'string'
            ? body.error
            : (body.error as { message?: string })?.message
          : null) ?? `Request failed (${res.status}).`;
      return { ok: false, error: message };
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
};

export type CurrentStudent = { id: string; email: string; name: string; avatarUrl?: string };
