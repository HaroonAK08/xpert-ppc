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

export type AdminApiResult<T> = { ok: true; data: T } | { ok: false; error: string; status?: number };

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
      signal: init.signal ?? AbortSignal.timeout(opts.json === false ? 120_000 : 20_000),
      headers,
    });

    const body = await res.json().catch(() => null);

    if (!res.ok) {
      if (res.status === 401 && !path.endsWith('/login')) {
        setAdminToken(null);
        if (typeof window !== 'undefined') window.dispatchEvent(new Event('academy:admin-expired'));
      }
      const message =
        (body && typeof body === 'object' && 'error' in body
          ? typeof body.error === 'string'
            ? body.error
            : (body.error as { message?: string })?.message
          : null) ?? `Request failed (${res.status}).`;
      return { ok: false, error: message, status: res.status };
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

export type AdminUploadOptions = {
  onProgress?: (percent: number | null) => void;
  signal?: AbortSignal;
};

function upload<T>(path: string, file: File, options: AdminUploadOptions = {}): Promise<AdminApiResult<T>> {
  return new Promise((resolve) => {
    if (options.signal?.aborted) {
      resolve({ ok: false, error: 'Upload cancelled. A file already received by the server may remain there.' });
      return;
    }
    const xhr = new XMLHttpRequest();
    const abort = () => xhr.abort();
    const finish = (result: AdminApiResult<T>) => {
      options.signal?.removeEventListener('abort', abort);
      resolve(result);
    };
    xhr.open('POST', `${API_URL}${path}`);
    xhr.withCredentials = true;
    xhr.timeout = 30 * 60 * 1000;
    const token = getAdminToken();
    if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.upload.onprogress = (event) => options.onProgress?.(event.lengthComputable ? Math.min(100, Math.round(event.loaded / event.total * 100)) : null);
    xhr.onload = () => {
      let body: any = null;
      try { body = JSON.parse(xhr.responseText); } catch { /* handled below */ }
      if (xhr.status < 200 || xhr.status >= 300) {
        if (xhr.status === 401 && !path.endsWith('/login')) {
          setAdminToken(null);
          window.dispatchEvent(new Event('academy:admin-expired'));
        }
        const message = typeof body?.error === 'string' ? body.error : body?.error?.message;
        finish({ ok: false, error: message || (xhr.status === 413 ? 'File exceeds the server upload limit (200 MiB).' : `Upload failed (${xhr.status}).`), status: xhr.status });
      } else if (!body) {
        finish({ ok: false, error: 'The server returned an invalid upload response. Check the file before retrying.' });
      } else {
        finish({ ok: true, data: body as T });
      }
    };
    xhr.onerror = () => finish({ ok: false, error: 'Upload connection lost. Check your connection before retrying; the server may have received the file.' });
    xhr.ontimeout = () => finish({ ok: false, error: 'Upload timed out after 30 minutes. The server may have received the file; retry only when ready.' });
    xhr.onabort = () => finish({ ok: false, error: 'Upload cancelled. A file already received by the server may remain there.' });
    options.signal?.addEventListener('abort', abort, { once: true });
    const fd = new FormData();
    fd.append('file', file);
    xhr.send(fd);
  });
}

export const adminApi = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body ?? {}) }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body ?? {}) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
  upload,
};

export async function logoutAdmin() {
  await request('/api/auth/logout', { method: 'POST', body: '{}', signal: AbortSignal.timeout(5_000) });
  setAdminToken(null);
}
