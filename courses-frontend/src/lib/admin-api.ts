/**
 * Admin API client for the academy ops panel.
 * Separate token from student auth so both sessions can coexist in one browser.
 */
export const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');

const TOKEN_KEY = 'xpertppc-courses-admin-token';

export function getAdminToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAdminToken(token: string | null) {
  try {
    if (!token) localStorage.removeItem(TOKEN_KEY);
    else localStorage.setItem(TOKEN_KEY, token);
  } catch {
    /* ignore */
  }
}

export type AdminApiResult<T> = { ok: true; data: T } | { ok: false; error: string };

export type AdminUser = {
  sub?: string;
  id?: string;
  email: string;
  name: string;
  role: string;
};

async function request<T>(
  path: string,
  init: RequestInit = {},
  opts: { json?: boolean } = { json: true }
): Promise<AdminApiResult<T>> {
  try {
    const headers: Record<string, string> = {
      ...(init.headers as Record<string, string> | undefined),
    };
    if (opts.json !== false && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }
    const token = typeof window !== 'undefined' ? getAdminToken() : null;
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${API_URL}${path}`, {
      ...init,
      credentials: 'include',
      headers,
    });

    const body = await res.json().catch(() => null);

    if (!res.ok) {
      if (res.status === 401) setAdminToken(null);
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

export function mediaUrl(pathOrUrl: string) {
  if (!pathOrUrl) return '';
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${API_URL}${pathOrUrl.startsWith('/') ? '' : '/'}${pathOrUrl}`;
}

export const adminApi = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body ?? {}) }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body ?? {}) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
  upload: async <T>(path: string, file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    return request<T>(path, { method: 'POST', body: fd }, { json: false });
  },
};

export async function logoutAdmin() {
  await adminApi.post('/api/auth/logout');
  setAdminToken(null);
}
