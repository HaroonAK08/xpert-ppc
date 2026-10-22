'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Pencil, Plus, Trash2, X } from 'lucide-react';

import { Field, Input, Label, Select, Textarea } from '@/components/ui/input';
import { api } from '@/lib/api';

type CourseOption = { id: string; title: string };

type SessionItem = {
  id: string;
  courseId: string;
  courseTitle: string;
  title: string;
  startsAt: string;
  endsAt: string | null;
  meetLink: string;
  timezone: string;
  notes: string;
  published: boolean;
};

type RecordingItem = {
  id: string;
  courseId: string;
  courseTitle: string;
  title: string;
  videoUrl: string;
  durationMinutes: number;
  recordedAt: string | null;
  published: boolean;
};

type ResourceItem = {
  id: string;
  courseId: string;
  courseTitle: string;
  title: string;
  kind: string;
  description: string;
  fileUrl: string;
  published: boolean;
};

type CouponItem = {
  id: string;
  code: string;
  active: boolean;
  note: string;
  maxUses: number;
  usedCount: number;
  applicantCount: number;
};

type Settings = {
  whatsappUrl: string;
  youtubeUrl: string;
  linkedinUrl: string;
  instagramUrl: string;
  announcementTitle: string;
  announcementBody: string;
};

const TABS = [
  { key: 'sessions', label: 'Live sessions' },
  { key: 'recordings', label: 'Recordings' },
  { key: 'resources', label: 'Resources' },
  { key: 'coupons', label: 'Coupons' },
  { key: 'settings', label: 'Announcement & settings' },
] as const;
type Tab = (typeof TABS)[number]['key'];

function toDatetimeLocal(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(
    d.getMinutes()
  )}`;
}

function toDateInput(iso: string | null) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
}

const inputCls = 'h-10 rounded-xl border border-border bg-background px-3 text-sm';

export default function AdminAcademyPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('sessions');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [recordings, setRecordings] = useState<RecordingItem[]>([]);
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [coupons, setCoupons] = useState<CouponItem[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);

  async function load() {
    setLoading(true);
    const me = await api.get('/api/auth/me');
    if (!me.ok) {
      router.replace('/admin/login');
      return;
    }

    const [coursesRes, sessionsRes, recordingsRes, resourcesRes, couponsRes, settingsRes] =
      await Promise.all([
        api.get<{ items: CourseOption[] }>('/api/admin/portal/courses'),
        api.get<{ items: SessionItem[] }>('/api/admin/academy/sessions'),
        api.get<{ items: RecordingItem[] }>('/api/admin/academy/recordings'),
        api.get<{ items: ResourceItem[] }>('/api/admin/academy/resources'),
        api.get<{ items: CouponItem[] }>('/api/admin/academy/coupons'),
        api.get<{ settings: Settings }>('/api/admin/academy/settings'),
      ]);

    if (coursesRes.ok) setCourses(coursesRes.data.items);
    if (sessionsRes.ok) setSessions(sessionsRes.data.items);
    if (recordingsRes.ok) setRecordings(recordingsRes.data.items);
    if (resourcesRes.ok) setResources(resourcesRes.data.items);
    if (couponsRes.ok) setCoupons(couponsRes.data.items);
    if (settingsRes.ok) setSettings(settingsRes.data.settings);

    const firstFailed = [coursesRes, sessionsRes, recordingsRes, resourcesRes, couponsRes, settingsRes].find(
      (r) => !r.ok
    );
    if (firstFailed && !firstFailed.ok) setError(firstFailed.error);

    setLoading(false);
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <section className="bg-background py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">Academy</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Live sessions, recordings, resources, coupons, and the student dashboard announcement.
        </p>

        {error ? (
          <p className="mb-6 mt-6 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <div className="mb-8 mt-6 flex flex-wrap gap-2 border-b border-border">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={
                tab === t.key
                  ? 'border-b-2 border-primary px-3 pb-3 text-sm font-bold text-primary'
                  : 'border-b-2 border-transparent px-3 pb-3 text-sm font-semibold text-muted-foreground hover:text-foreground'
              }
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'sessions' ? (
          <SessionsTab courses={courses} items={sessions} setItems={setSessions} setError={setError} />
        ) : null}
        {tab === 'recordings' ? (
          <RecordingsTab courses={courses} items={recordings} setItems={setRecordings} setError={setError} />
        ) : null}
        {tab === 'resources' ? (
          <ResourcesTab courses={courses} items={resources} setItems={setResources} setError={setError} />
        ) : null}
        {tab === 'coupons' ? (
          <CouponsTab items={coupons} setItems={setCoupons} setError={setError} />
        ) : null}
        {tab === 'settings' ? (
          <SettingsTab settings={settings} setSettings={setSettings} setError={setError} />
        ) : null}
      </div>
    </section>
  );
}

const emptySession = {
  courseId: '',
  title: '',
  startsAt: '',
  endsAt: '',
  meetLink: '',
  timezone: 'Asia/Karachi',
  notes: '',
  published: true,
};

function SessionsTab({
  courses,
  items,
  setItems,
  setError,
}: {
  courses: CourseOption[];
  items: SessionItem[];
  setItems: React.Dispatch<React.SetStateAction<SessionItem[]>>;
  setError: (msg: string) => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptySession);
  const [busy, setBusy] = useState(false);

  function startEdit(item: SessionItem) {
    setEditingId(item.id);
    setForm({
      courseId: item.courseId,
      title: item.title,
      startsAt: toDatetimeLocal(item.startsAt),
      endsAt: item.endsAt ? toDatetimeLocal(item.endsAt) : '',
      meetLink: item.meetLink,
      timezone: item.timezone || 'Asia/Karachi',
      notes: item.notes,
      published: item.published,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptySession);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.courseId || !form.title || !form.startsAt) return;
    setBusy(true);
    setError('');

    const body = {
      courseId: form.courseId,
      title: form.title,
      startsAt: new Date(form.startsAt).toISOString(),
      endsAt: form.endsAt ? new Date(form.endsAt).toISOString() : null,
      meetLink: form.meetLink,
      timezone: form.timezone,
      notes: form.notes,
      published: form.published,
    };

    const res = editingId
      ? await api.patch<{ item: SessionItem }>(`/api/admin/academy/sessions/${editingId}`, body)
      : await api.post<{ item: SessionItem }>('/api/admin/academy/sessions', body);

    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }

    const courseTitle = courses.find((c) => c.id === res.data.item.courseId)?.title || '';
    const saved = { ...res.data.item, courseTitle };
    setItems((prev) =>
      editingId ? prev.map((s) => (s.id === editingId ? saved : s)) : [saved, ...prev]
    );
    cancelEdit();
  }

  async function remove(id: string) {
    if (!confirm('Delete this session?')) return;
    const res = await api.delete(`/api/admin/academy/sessions/${id}`);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setItems((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div>
      <form
        onSubmit={onSubmit}
        className="mb-8 grid grid-cols-1 gap-4 rounded-2xl border border-border bg-card p-5 sm:grid-cols-2"
      >
        <Field>
          <Label htmlFor="session-course">Course</Label>
          <Select
            id="session-course"
            value={form.courseId}
            onChange={(e) => setForm((f) => ({ ...f, courseId: e.target.value }))}
            required
          >
            <option value="" disabled>
              Choose a course…
            </option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </Select>
        </Field>
        <Field>
          <Label htmlFor="session-title">Title</Label>
          <Input
            id="session-title"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            required
          />
        </Field>
        <Field>
          <Label htmlFor="session-starts">Starts at</Label>
          <input
            id="session-starts"
            type="datetime-local"
            value={form.startsAt}
            onChange={(e) => setForm((f) => ({ ...f, startsAt: e.target.value }))}
            required
            className={inputCls}
          />
        </Field>
        <Field>
          <Label htmlFor="session-ends">Ends at (optional)</Label>
          <input
            id="session-ends"
            type="datetime-local"
            value={form.endsAt}
            onChange={(e) => setForm((f) => ({ ...f, endsAt: e.target.value }))}
            className={inputCls}
          />
        </Field>
        <Field>
          <Label htmlFor="session-link">Meet link</Label>
          <Input
            id="session-link"
            value={form.meetLink}
            onChange={(e) => setForm((f) => ({ ...f, meetLink: e.target.value }))}
            placeholder="https://meet.google.com/…"
          />
        </Field>
        <Field>
          <Label htmlFor="session-tz">Timezone</Label>
          <Input
            id="session-tz"
            value={form.timezone}
            onChange={(e) => setForm((f) => ({ ...f, timezone: e.target.value }))}
          />
        </Field>
        <Field className="sm:col-span-2">
          <Label htmlFor="session-notes">Notes</Label>
          <Textarea
            id="session-notes"
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            rows={2}
          />
        </Field>
        <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
          />
          Published (visible to enrolled students)
        </label>
        <div className="flex gap-2 sm:col-span-2">
          <button
            type="submit"
            disabled={busy}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            {editingId ? 'Save changes' : 'Add session'}
          </button>
          {editingId ? (
            <button
              type="button"
              onClick={cancelEdit}
              className="inline-flex h-11 items-center gap-1.5 rounded-xl border border-border px-4 text-sm font-semibold"
            >
              <X className="h-3.5 w-3.5" /> Cancel
            </button>
          ) : null}
        </div>
      </form>

      <div className="space-y-3">
        {items.map((s) => (
          <div
            key={s.id}
            className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold text-foreground">{s.title}</h3>
                <span
                  className={
                    s.published
                      ? 'rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-bold uppercase text-success'
                      : 'rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase text-muted-foreground'
                  }
                >
                  {s.published ? 'Published' : 'Draft'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {s.courseTitle} · {new Date(s.startsAt).toLocaleString()} ({s.timezone})
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => startEdit(s)}
                className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border px-3 text-xs font-semibold hover:text-primary"
              >
                <Pencil className="h-3.5 w-3.5" /> Edit
              </button>
              <button
                type="button"
                onClick={() => void remove(s.id)}
                className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-destructive/40 px-3 text-xs font-semibold text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          </div>
        ))}
        {!items.length ? <p className="text-sm text-muted-foreground">No sessions yet.</p> : null}
      </div>
    </div>
  );
}

const emptyRecording = {
  courseId: '',
  title: '',
  videoUrl: '',
  durationMinutes: 0,
  recordedAt: '',
  published: true,
};

function RecordingsTab({
  courses,
  items,
  setItems,
  setError,
}: {
  courses: CourseOption[];
  items: RecordingItem[];
  setItems: React.Dispatch<React.SetStateAction<RecordingItem[]>>;
  setError: (msg: string) => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyRecording);
  const [busy, setBusy] = useState(false);

  function startEdit(item: RecordingItem) {
    setEditingId(item.id);
    setForm({
      courseId: item.courseId,
      title: item.title,
      videoUrl: item.videoUrl,
      durationMinutes: item.durationMinutes,
      recordedAt: toDateInput(item.recordedAt),
      published: item.published,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyRecording);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.courseId || !form.title || !form.videoUrl) return;
    setBusy(true);
    setError('');

    const body = {
      courseId: form.courseId,
      title: form.title,
      videoUrl: form.videoUrl,
      durationMinutes: Number(form.durationMinutes) || 0,
      recordedAt: form.recordedAt ? new Date(form.recordedAt).toISOString() : null,
      published: form.published,
    };

    const res = editingId
      ? await api.patch<{ item: RecordingItem }>(`/api/admin/academy/recordings/${editingId}`, body)
      : await api.post<{ item: RecordingItem }>('/api/admin/academy/recordings', body);

    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }

    const courseTitle = courses.find((c) => c.id === res.data.item.courseId)?.title || '';
    const saved = { ...res.data.item, courseTitle };
    setItems((prev) =>
      editingId ? prev.map((r) => (r.id === editingId ? saved : r)) : [saved, ...prev]
    );
    cancelEdit();
  }

  async function remove(id: string) {
    if (!confirm('Delete this recording?')) return;
    const res = await api.delete(`/api/admin/academy/recordings/${id}`);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setItems((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div>
      <form
        onSubmit={onSubmit}
        className="mb-8 grid grid-cols-1 gap-4 rounded-2xl border border-border bg-card p-5 sm:grid-cols-2"
      >
        <Field>
          <Label htmlFor="rec-course">Course</Label>
          <Select
            id="rec-course"
            value={form.courseId}
            onChange={(e) => setForm((f) => ({ ...f, courseId: e.target.value }))}
            required
          >
            <option value="" disabled>
              Choose a course…
            </option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </Select>
        </Field>
        <Field>
          <Label htmlFor="rec-title">Title</Label>
          <Input
            id="rec-title"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            required
          />
        </Field>
        <Field className="sm:col-span-2">
          <Label htmlFor="rec-url">Video URL</Label>
          <Input
            id="rec-url"
            value={form.videoUrl}
            onChange={(e) => setForm((f) => ({ ...f, videoUrl: e.target.value }))}
            placeholder="https://…"
            required
          />
        </Field>
        <Field>
          <Label htmlFor="rec-duration">Duration (minutes)</Label>
          <Input
            id="rec-duration"
            type="number"
            min={0}
            value={form.durationMinutes}
            onChange={(e) => setForm((f) => ({ ...f, durationMinutes: Number(e.target.value) }))}
          />
        </Field>
        <Field>
          <Label htmlFor="rec-date">Recorded on</Label>
          <input
            id="rec-date"
            type="date"
            value={form.recordedAt}
            onChange={(e) => setForm((f) => ({ ...f, recordedAt: e.target.value }))}
            className={inputCls}
          />
        </Field>
        <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
          />
          Published (visible to enrolled students)
        </label>
        <div className="flex gap-2 sm:col-span-2">
          <button
            type="submit"
            disabled={busy}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            {editingId ? 'Save changes' : 'Add recording'}
          </button>
          {editingId ? (
            <button
              type="button"
              onClick={cancelEdit}
              className="inline-flex h-11 items-center gap-1.5 rounded-xl border border-border px-4 text-sm font-semibold"
            >
              <X className="h-3.5 w-3.5" /> Cancel
            </button>
          ) : null}
        </div>
      </form>

      <div className="space-y-3">
        {items.map((r) => (
          <div
            key={r.id}
            className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold text-foreground">{r.title}</h3>
                <span
                  className={
                    r.published
                      ? 'rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-bold uppercase text-success'
                      : 'rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase text-muted-foreground'
                  }
                >
                  {r.published ? 'Published' : 'Draft'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {r.courseTitle}
                {r.durationMinutes ? ` · ${r.durationMinutes} min` : ''}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => startEdit(r)}
                className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border px-3 text-xs font-semibold hover:text-primary"
              >
                <Pencil className="h-3.5 w-3.5" /> Edit
              </button>
              <button
                type="button"
                onClick={() => void remove(r.id)}
                className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-destructive/40 px-3 text-xs font-semibold text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          </div>
        ))}
        {!items.length ? <p className="text-sm text-muted-foreground">No recordings yet.</p> : null}
      </div>
    </div>
  );
}

const emptyResource = {
  courseId: '',
  title: '',
  kind: 'notes' as const,
  description: '',
  fileUrl: '',
  published: true,
};

function ResourcesTab({
  courses,
  items,
  setItems,
  setError,
}: {
  courses: CourseOption[];
  items: ResourceItem[];
  setItems: React.Dispatch<React.SetStateAction<ResourceItem[]>>;
  setError: (msg: string) => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<typeof emptyResource>(emptyResource);
  const [busy, setBusy] = useState(false);

  function startEdit(item: ResourceItem) {
    setEditingId(item.id);
    setForm({
      courseId: item.courseId,
      title: item.title,
      kind: item.kind as typeof emptyResource.kind,
      description: item.description,
      fileUrl: item.fileUrl,
      published: item.published,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyResource);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.courseId || !form.title) return;
    setBusy(true);
    setError('');

    const body = {
      courseId: form.courseId,
      title: form.title,
      kind: form.kind,
      description: form.description,
      fileUrl: form.fileUrl,
      published: form.published,
    };

    const res = editingId
      ? await api.patch<{ item: ResourceItem }>(`/api/admin/academy/resources/${editingId}`, body)
      : await api.post<{ item: ResourceItem }>('/api/admin/academy/resources', body);

    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }

    const courseTitle = courses.find((c) => c.id === res.data.item.courseId)?.title || '';
    const saved = { ...res.data.item, courseTitle };
    setItems((prev) =>
      editingId ? prev.map((r) => (r.id === editingId ? saved : r)) : [saved, ...prev]
    );
    cancelEdit();
  }

  async function remove(id: string) {
    if (!confirm('Delete this resource?')) return;
    const res = await api.delete(`/api/admin/academy/resources/${id}`);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setItems((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div>
      <form
        onSubmit={onSubmit}
        className="mb-8 grid grid-cols-1 gap-4 rounded-2xl border border-border bg-card p-5 sm:grid-cols-2"
      >
        <Field>
          <Label htmlFor="res-course">Course</Label>
          <Select
            id="res-course"
            value={form.courseId}
            onChange={(e) => setForm((f) => ({ ...f, courseId: e.target.value }))}
            required
          >
            <option value="" disabled>
              Choose a course…
            </option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </Select>
        </Field>
        <Field>
          <Label htmlFor="res-title">Title</Label>
          <Input
            id="res-title"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            required
          />
        </Field>
        <Field>
          <Label htmlFor="res-kind">Kind</Label>
          <Select
            id="res-kind"
            value={form.kind}
            onChange={(e) =>
              setForm((f) => ({ ...f, kind: e.target.value as typeof emptyResource.kind }))
            }
          >
            <option value="notes">Notes</option>
            <option value="assignment">Assignment</option>
            <option value="template">Template</option>
            <option value="other">Other</option>
          </Select>
        </Field>
        <Field>
          <Label htmlFor="res-url">File URL</Label>
          <Input
            id="res-url"
            value={form.fileUrl}
            onChange={(e) => setForm((f) => ({ ...f, fileUrl: e.target.value }))}
            placeholder="https://…"
          />
        </Field>
        <Field className="sm:col-span-2">
          <Label htmlFor="res-desc">Description</Label>
          <Textarea
            id="res-desc"
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            rows={2}
          />
        </Field>
        <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
          />
          Published (visible to enrolled students)
        </label>
        <div className="flex gap-2 sm:col-span-2">
          <button
            type="submit"
            disabled={busy}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground disabled:opacity-60"
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            {editingId ? 'Save changes' : 'Add resource'}
          </button>
          {editingId ? (
            <button
              type="button"
              onClick={cancelEdit}
              className="inline-flex h-11 items-center gap-1.5 rounded-xl border border-border px-4 text-sm font-semibold"
            >
              <X className="h-3.5 w-3.5" /> Cancel
            </button>
          ) : null}
        </div>
      </form>

      <div className="space-y-3">
        {items.map((r) => (
          <div
            key={r.id}
            className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold text-foreground">{r.title}</h3>
                <span
                  className={
                    r.published
                      ? 'rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-bold uppercase text-success'
                      : 'rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase text-muted-foreground'
                  }
                >
                  {r.published ? 'Published' : 'Draft'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {r.courseTitle} · {r.kind}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => startEdit(r)}
                className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border px-3 text-xs font-semibold hover:text-primary"
              >
                <Pencil className="h-3.5 w-3.5" /> Edit
              </button>
              <button
                type="button"
                onClick={() => void remove(r.id)}
                className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-destructive/40 px-3 text-xs font-semibold text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          </div>
        ))}
        {!items.length ? <p className="text-sm text-muted-foreground">No resources yet.</p> : null}
      </div>
    </div>
  );
}

const emptyCoupon = { code: '', note: '', maxUses: 0, active: true };

function CouponsTab({
  items,
  setItems,
  setError,
}: {
  items: CouponItem[];
  setItems: React.Dispatch<React.SetStateAction<CouponItem[]>>;
  setError: (msg: string) => void;
}) {
  const [form, setForm] = useState(emptyCoupon);
  const [busy, setBusy] = useState(false);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    if (!form.code.trim()) return;
    setBusy(true);
    setError('');

    const res = await api.post<{ coupon: CouponItem }>('/api/admin/academy/coupons', {
      code: form.code,
      note: form.note,
      maxUses: Number(form.maxUses) || 0,
      active: form.active,
    });

    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setItems((prev) => [res.data.coupon, ...prev]);
    setForm(emptyCoupon);
  }

  async function toggleActive(id: string, active: boolean) {
    const res = await api.patch<{ coupon: CouponItem }>(`/api/admin/academy/coupons/${id}`, {
      active,
    });
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setItems((prev) => prev.map((c) => (c.id === id ? { ...c, active: res.data.coupon.active } : c)));
  }

  async function remove(id: string) {
    if (!confirm('Delete this coupon?')) return;
    const res = await api.delete(`/api/admin/academy/coupons/${id}`);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setItems((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div>
      <form
        onSubmit={onCreate}
        className="mb-8 grid grid-cols-1 gap-4 rounded-2xl border border-border bg-card p-5 sm:grid-cols-2"
      >
        <Field>
          <Label htmlFor="coupon-code">Code</Label>
          <Input
            id="coupon-code"
            value={form.code}
            onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
            placeholder="LAUNCH50"
            required
          />
        </Field>
        <Field>
          <Label htmlFor="coupon-max">Max uses (0 = unlimited)</Label>
          <Input
            id="coupon-max"
            type="number"
            min={0}
            value={form.maxUses}
            onChange={(e) => setForm((f) => ({ ...f, maxUses: Number(e.target.value) }))}
          />
        </Field>
        <Field className="sm:col-span-2">
          <Label htmlFor="coupon-note">Note</Label>
          <Input
            id="coupon-note"
            value={form.note}
            onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
          />
        </Field>
        <button
          type="submit"
          disabled={busy}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground sm:col-span-2 sm:w-fit disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Create coupon
        </button>
      </form>

      <div className="space-y-3">
        {items.map((c) => (
          <div
            key={c.id}
            className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold text-foreground">{c.code}</h3>
                <span
                  className={
                    c.active
                      ? 'rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-bold uppercase text-success'
                      : 'rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase text-muted-foreground'
                  }
                >
                  {c.active ? 'Active' : 'Disabled'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                {c.usedCount} used{c.maxUses ? ` / ${c.maxUses} max` : ' (unlimited)'} ·{' '}
                {c.applicantCount} applicant{c.applicantCount === 1 ? '' : 's'}
                {c.note ? ` · ${c.note}` : ''}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => void toggleActive(c.id, !c.active)}
                className="inline-flex h-9 items-center rounded-xl border border-border px-3 text-xs font-semibold hover:text-primary"
              >
                {c.active ? 'Disable' : 'Enable'}
              </button>
              <button
                type="button"
                onClick={() => void remove(c.id)}
                className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-destructive/40 px-3 text-xs font-semibold text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          </div>
        ))}
        {!items.length ? <p className="text-sm text-muted-foreground">No coupons yet.</p> : null}
      </div>
    </div>
  );
}

function SettingsTab({
  settings,
  setSettings,
  setError,
}: {
  settings: Settings | null;
  setSettings: (s: Settings) => void;
  setError: (msg: string) => void;
}) {
  const [form, setForm] = useState<Settings>(
    settings || {
      whatsappUrl: '',
      youtubeUrl: '',
      linkedinUrl: '',
      instagramUrl: '',
      announcementTitle: '',
      announcementBody: '',
    }
  );
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (settings) setForm(settings);
  }, [settings]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    setSaved(false);

    const res = await api.patch<{ settings: Settings }>('/api/admin/academy/settings', form);
    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setSettings(res.data.settings);
    setSaved(true);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid grid-cols-1 gap-4 rounded-2xl border border-border bg-card p-5 sm:grid-cols-2 sm:p-6"
    >
      <Field className="sm:col-span-2">
        <Label htmlFor="ann-title">Announcement title</Label>
        <Input
          id="ann-title"
          value={form.announcementTitle}
          onChange={(e) => setForm((f) => ({ ...f, announcementTitle: e.target.value }))}
          placeholder="New cohort starts Monday"
        />
      </Field>
      <Field className="sm:col-span-2">
        <Label htmlFor="ann-body">Announcement body</Label>
        <Textarea
          id="ann-body"
          value={form.announcementBody}
          onChange={(e) => setForm((f) => ({ ...f, announcementBody: e.target.value }))}
          rows={3}
        />
      </Field>
      <Field>
        <Label htmlFor="whatsapp">WhatsApp URL</Label>
        <Input
          id="whatsapp"
          value={form.whatsappUrl}
          onChange={(e) => setForm((f) => ({ ...f, whatsappUrl: e.target.value }))}
        />
      </Field>
      <Field>
        <Label htmlFor="youtube">YouTube URL</Label>
        <Input
          id="youtube"
          value={form.youtubeUrl}
          onChange={(e) => setForm((f) => ({ ...f, youtubeUrl: e.target.value }))}
        />
      </Field>
      <Field>
        <Label htmlFor="linkedin">LinkedIn URL</Label>
        <Input
          id="linkedin"
          value={form.linkedinUrl}
          onChange={(e) => setForm((f) => ({ ...f, linkedinUrl: e.target.value }))}
        />
      </Field>
      <Field>
        <Label htmlFor="instagram">Instagram URL</Label>
        <Input
          id="instagram"
          value={form.instagramUrl}
          onChange={(e) => setForm((f) => ({ ...f, instagramUrl: e.target.value }))}
        />
      </Field>
      <div className="flex items-center gap-3 sm:col-span-2">
        <button
          type="submit"
          disabled={busy}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Save settings
        </button>
        {saved ? <span className="text-sm font-semibold text-success">Saved.</span> : null}
      </div>
    </form>
  );
}
