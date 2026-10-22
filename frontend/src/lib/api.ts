/**
 * Thin client for the Express backend.
 *
 * `credentials: 'include'` is required on every admin call: the session lives
 * in an httpOnly cookie set by the API, which is a different origin in dev.
 */
export const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
).replace(/\/$/, '');

function hostOf(value: string): string {
  try {
    return new URL(value).hostname.replace(/^\[|\]$/g, '').toLowerCase();
  } catch {
    return '';
  }
}

function isDeviceLocal(hostname: string): boolean {
  if (!hostname) return true;
  if (hostname === 'localhost' || hostname === '::1' || hostname.endsWith('.localhost')) return true;
  if (hostname.startsWith('127.')) return true;
  if (hostname.startsWith('10.')) return true;
  if (hostname.startsWith('192.168.')) return true;
  if (hostname.startsWith('169.254.')) return true;
  const parts = hostname.split('.');
  if (parts.length === 4 && parts[0] === '172') {
    const second = Number(parts[1]);
    if (second >= 16 && second <= 31) return true;
  }
  return false;
}

/** Browser calls must not target the visitor's own machine. That is what makes Chrome ask to access apps on the device. */
export function clientApiUrl(): string {
  if (typeof window === 'undefined') return API_URL;
  const apiHost = hostOf(API_URL);
  const pageHost = window.location.hostname.toLowerCase();
  if (!isDeviceLocal(apiHost) || isDeviceLocal(pageHost)) return API_URL;
  const firstParty =
    pageHost === 'xpertppc.com' ||
    pageHost === 'www.xpertppc.com' ||
    pageHost === 'xpertppc.net' ||
    pageHost === 'www.xpertppc.net';
  return firstParty ? window.location.origin : API_URL;
}

export type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string };

async function request<T>(
  path: string,
  init: RequestInit = {},
  opts?: { json?: boolean }
): Promise<ApiResult<T>> {
  const asJson = opts?.json !== false;
  try {
    const headers: HeadersInit = {
      ...(asJson ? { 'Content-Type': 'application/json' } : {}),
      ...(init.headers ?? {}),
    };

    const res = await fetch(`${clientApiUrl()}${path}`, {
      ...init,
      credentials: 'include',
      headers,
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
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PUT', body: JSON.stringify(body ?? {}) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
  upload: async <T>(path: string, file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    return request<T>(path, { method: 'POST', body: fd }, { json: false });
  },
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

export type CrmLead = {
  id: string;
  name: string;
  phone: string;
  email: string;
  businessName: string;
  source: string;
  message: string;
  status: string;
  notes: string;
  replied: boolean;
  followUpAt: string | null;
  createdAt: string;
};

export type StudentUser = { id: string; email: string; name: string };

export type PortalCourseSummary = {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnailUrl: string;
  level: string;
  published: boolean;
  enrolled?: boolean;
  moduleCount: number;
  lessonCount: number;
  updatedAt: string;
};

export type PortalLesson = {
  id: string;
  title: string;
  type: 'video' | 'lecture' | 'assignment' | 'task';
  summary: string;
  body: string;
  videoUrl: string;
  fileUrl: string;
  fileName: string;
  durationMinutes: number;
  order: number;
  completed?: boolean;
  published?: boolean;
};

export type PortalModule = {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: PortalLesson[];
};

export type PortalCourseDetail = {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnailUrl: string;
  level: string;
  modules: PortalModule[];
};

export type HubSession = {
  id: string;
  courseId: string;
  courseTitle: string;
  title: string;
  startsAt: string;
  endsAt?: string | null;
  meetLink: string;
  timezone: string;
  notes: string;
};

export type HubRecording = {
  id: string;
  courseId: string;
  courseTitle: string;
  title: string;
  videoUrl: string;
  durationMinutes: number;
  recordedAt: string | null;
};

export type HubResource = {
  id: string;
  courseId: string;
  courseTitle: string;
  title: string;
  kind: string;
  description: string;
  fileUrl: string;
};

export type StudentHubHome = {
  nextSession: HubSession | null;
  sessions: HubSession[];
  recordings: HubRecording[];
  resources: HubResource[];
  community: {
    whatsappUrl: string;
    youtubeUrl: string;
    linkedinUrl: string;
    instagramUrl: string;
    announcementTitle: string;
    announcementBody: string;
  };
};
