'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { CalendarDays, Loader2, Plus, RefreshCw, Trash2, Video } from 'lucide-react';
import { adminApi } from '@/lib/admin-api';
import { useAdminCourses, type AdminCourseOption } from '@/hooks/use-admin-courses';
import { AdminPageHeader } from '@/components/admin/page-header';
import { Button } from '@/components/ui/button';
import { Input, Label, Select, Textarea } from '@/components/ui/input';

type Session = {
  id: string;
  courseId: string;
  courseTitle: string;
  title: string;
  startsAt: string;
  endsAt?: string | null;
  meetLink: string;
  timezone: string;
  notes: string;
  published: boolean;
};

function formatWhen(value: string, timezone: string) {
  try {
    return new Intl.DateTimeFormat('en-PK', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: timezone || 'Asia/Karachi',
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function localDateTime(value: string, timezone: string) {
  try {
    const parts = new Intl.DateTimeFormat('en-CA', { timeZone: timezone || 'Asia/Karachi', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date(value));
    const part = (type: string) => parts.find((item) => item.type === type)?.value;
    const result = `${part('year')}-${part('month')}-${part('day')}T${part('hour')}:${part('minute')}`;
    return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(result) ? result : '';
  } catch {
    return '';
  }
}

// Interpret the entered wall-clock time in the selected zone, not the phone's zone.
function zonedDateTime(value: string, timezone: string) {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) throw new Error('Choose a valid date and time.');
  const wall = Date.parse(`${value}:00Z`);
  let instant = wall;
  for (let attempt = 0; attempt < 4; attempt++) {
    const displayed = Date.parse(`${localDateTime(new Date(instant).toISOString(), timezone)}:00Z`);
    const offset = wall - displayed;
    if (!offset) return new Date(instant);
    instant += offset;
  }
  throw new Error('This time does not exist in the selected timezone (daylight-saving change). Choose another time.');
}

const WEEKLY_CLASSES = [
  { day: 4, dayName: 'Thursday', name: 'Social Media Ads', slug: 'meta-ads', title: 'Social Media Ads — Thursday class' },
  { day: 5, dayName: 'Friday', name: 'Google Ads', slug: 'google-ads', title: 'Google Ads — Friday class' },
];

function karachiDate(value = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Karachi', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(value);
  return `${parts.find((part) => part.type === 'year')!.value}-${parts.find((part) => part.type === 'month')!.value}-${parts.find((part) => part.type === 'day')!.value}`;
}

function nextClassDate(day: number) {
  const today = new Date(`${karachiDate()}T12:00:00Z`);
  let days = (day - today.getUTCDay() + 7) % 7;
  if (days === 0 && new Date(`${karachiDate()}T22:00:00+05:00`) <= new Date()) days = 7;
  today.setUTCDate(today.getUTCDate() + days);
  return today.toISOString().slice(0, 10);
}

function QuickClassCard({ preset, courses, sessions, loading, onSaved }: {
  preset: typeof WEEKLY_CLASSES[number];
  courses: AdminCourseOption[];
  sessions: Session[];
  loading: boolean;
  onSaved: () => Promise<void>;
}) {
  const [courseId, setCourseId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('22:00');
  const [link, setLink] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [editingId, setEditingId] = useState('');
  const existing = sessions.find((session) => session.id === editingId) || sessions.find((session) => session.courseId === courseId && session.title === preset.title && karachiDate(new Date(session.startsAt)) === date);

  useEffect(() => { if (existing) setEditingId(existing.id); }, [existing]);

  useEffect(() => { setDate(nextClassDate(preset.day)); }, [preset.day]);

  useEffect(() => {
    if (courseId) return;
    const matches = courses.filter((course) => course.slug === preset.slug || (preset.day === 4 ? /social media|meta ads|facebook ads/i.test(course.title) : /google ads/i.test(course.title)));
    const course = matches.find((item) => item.slug === preset.slug) || (matches.length === 1 ? matches[0] : null);
    if (course) setCourseId(course.id);
  }, [courses, courseId, preset]);

  useEffect(() => {
    setLink(existing?.meetLink || '');
    setTime(existing ? new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Karachi', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date(existing.startsAt)) : '22:00');
    setError('');
  }, [existing?.id, existing?.meetLink, existing?.startsAt]);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || loading) return;
    setError('');
    setSaved(false);
    let startsAt: Date;
    try { startsAt = zonedDateTime(`${date}T${time}`, 'Asia/Karachi'); }
    catch (err) { setError(err instanceof Error ? err.message : `Choose a valid ${preset.dayName} date and class time.`); return; }
    if (!courseId) { setError('Please select the correct course.'); return; }
    if (new Date(`${date}T12:00:00Z`).getUTCDay() !== preset.day || karachiDate(startsAt) !== date) { setError(`Choose a valid ${preset.dayName} date and class time.`); return; }
    try {
      if (new URL(link.trim()).protocol !== 'https:') throw new Error();
    } catch { setError('Please enter a valid HTTPS meeting link.'); return; }
    setBusy(true);
    try {
      const payload = { courseId, title: preset.title, startsAt: startsAt.toISOString(), meetLink: link.trim(), timezone: 'Asia/Karachi', published: true };
      const res = existing
        ? await adminApi.patch(`/api/admin/academy/sessions/${existing.id}`, payload)
        : await adminApi.post('/api/admin/academy/sessions', payload);
      if (!res.ok) throw new Error(res.error);
      await onSaved();
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save the class. Please try again.');
    } finally { setBusy(false); }
  }

  return (
    <form onSubmit={save} className="panel p-6">
      <div className="flex items-start gap-3"><span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand"><CalendarDays className="h-5 w-5" /></span><div><h3 className="text-lg font-extrabold text-ink">{preset.dayName} class</h3><p className="text-sm text-muted">{preset.name}</p></div></div>
      <p className="mt-4 text-sm font-semibold text-ink">{date ? new Intl.DateTimeFormat('en-PK', { dateStyle: 'full', timeZone: 'Asia/Karachi' }).format(new Date(`${date}T12:00:00+05:00`)) : 'Choose a date'}</p>
      <fieldset disabled={busy || loading} className="mt-4 space-y-4">
        <div className="space-y-1.5"><Label htmlFor={`course-${preset.day}`}>Course</Label><Select id={`course-${preset.day}`} required value={courseId} onChange={(event) => { setCourseId(event.target.value); setSaved(false); }}><option value="" disabled>Select the {preset.name} course</option>{courses.map((course) => <option key={course.id} value={course.id}>{course.title}</option>)}</Select></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5"><Label htmlFor={`date-${preset.day}`}>{preset.dayName} date</Label><Input id={`date-${preset.day}`} type="date" required value={date} onChange={(event) => { setDate(event.target.value); setSaved(false); }} /></div>
          <div className="space-y-1.5"><Label htmlFor={`time-${preset.day}`}>Time (Pakistan)</Label><Input id={`time-${preset.day}`} type="time" required value={time} onChange={(event) => { setTime(event.target.value); setSaved(false); }} /></div>
        </div>
        <div className="space-y-1.5"><Label htmlFor={`link-${preset.day}`}>{preset.dayName} meeting link *</Label><Input id={`link-${preset.day}`} type="url" required maxLength={1000} placeholder="https://meet.google.com/..." value={link} onChange={(event) => { setLink(event.target.value); setSaved(false); }} /></div>
        <p className="text-xs leading-relaxed text-muted">All times are Asia/Karachi (UTC+05:00). {existing ? 'This class is already scheduled. Save to update its link or time.' : 'Date and time are prefilled—confirm the course, paste the link, and save.'}</p>
        <Button type="submit" disabled={!courses.length}>{busy && <Loader2 className="h-4 w-4 animate-spin" />}{existing ? `Update ${preset.dayName} class` : `Save ${preset.dayName} class`}</Button>
      </fieldset>
      {error && <p role="alert" className="mt-4 text-sm text-red-700">{error}</p>}
      {saved && <p role="status" className="mt-4 text-sm font-semibold text-emerald-700">Class saved. Enrolled students can see its date, time, and meeting link.</p>}
    </form>
  );
}

export default function AdminSchedulePage() {
  const { courses, error: coursesError } = useAdminCourses();
  const [items, setItems] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Session | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  async function load() {
    setLoading(true);
    setError('');
    const res = await adminApi.get<{ items: Session[] }>('/api/admin/academy/sessions');
    if (!res.ok) {
      setError(res.error);
      setLoaded(false);
      setLoading(false);
      return;
    }
    setItems(res.data.items);
    setLoaded(true);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  useEffect(() => {
    if (!showForm && !editing) return;
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    formRef.current?.querySelector<HTMLElement>('select, input')?.focus();
  }, [showForm, editing?.id]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    const form = e.currentTarget;
    const fd = new FormData(form);
    const timezone = String(fd.get('timezone') || 'Asia/Karachi');
    let startsAt: Date;
    let endsAt: Date | null = null;
    try {
      startsAt = zonedDateTime(String(fd.get('startsAt') || ''), timezone);
      const endValue = String(fd.get('endsAt') || '');
      endsAt = endValue ? zonedDateTime(endValue, timezone) : null;
    } catch (err) { setError(err instanceof Error ? err.message : 'Choose a valid date and time.'); return; }
    if (endsAt && endsAt <= startsAt) { setError('End time must be after the start time.'); return; }
    setBusy(true);
    setError('');
    const payload = {
      courseId: String(fd.get('courseId') || ''), title: String(fd.get('title') || ''), startsAt: startsAt.toISOString(),
      endsAt: endsAt?.toISOString() || null, meetLink: String(fd.get('meetLink') || ''), timezone, notes: String(fd.get('notes') || ''), published: editing ? editing.published : true,
    };
    const res = editing ? await adminApi.patch(`/api/admin/academy/sessions/${editing.id}`, payload) : await adminApi.post('/api/admin/academy/sessions', payload);
    setBusy(false);
    if (!res.ok) { setError(res.error); return; }
    form.reset();
    setEditing(null);
    setShowForm(false);
    await load();
  }

  async function remove(id: string) {
    if (!confirm('Delete this class session?')) return;
    const res = await adminApi.delete(`/api/admin/academy/sessions/${id}`);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setItems((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <>
      <AdminPageHeader
        title="Class Schedule"
        subtitle="Add live class times and Google Meet links for students."
        actions={
          <>
          <Button type="button" variant="outline" className="min-h-11" disabled={loading} onClick={() => void load()}><RefreshCw className="h-4 w-4" />Refresh</Button>
          <Button type="button" className="min-h-11" onClick={() => { setEditing(null); setShowForm((v) => !v); }}>
            <Plus className="h-4 w-4" />
            Add custom class
          </Button>
          </>
        }
      />
      <main className="px-5 py-8 sm:px-8">
        {error ? (
          <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
            {error}
          </p>
        ) : null}

        {coursesError && <p role="alert" className="mb-4 text-sm text-red-700">{coursesError}</p>}

        {showForm || editing ? (
          <form ref={formRef} key={editing?.id || 'new'} onSubmit={onSubmit} className="panel mb-6 scroll-mt-4 grid gap-3 p-5 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="courseId">Course</Label>
              <Select id="courseId" name="courseId" required defaultValue={editing?.courseId || ''}>
                <option value="" disabled>Select course</option>
                {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
              </Select>
            </div>
            <div className="space-y-1.5"><Label htmlFor="title">Session title</Label><Input id="title" name="title" required defaultValue={editing?.title || ''} placeholder="Live class — Week 1" /></div>
            <div className="space-y-1.5"><Label htmlFor="startsAt">Starts at</Label><Input id="startsAt" name="startsAt" type="datetime-local" required defaultValue={editing ? localDateTime(editing.startsAt, editing.timezone || 'Asia/Karachi') : ''} /></div>
            <div className="space-y-1.5"><Label htmlFor="endsAt">Ends at</Label><Input id="endsAt" name="endsAt" type="datetime-local" defaultValue={editing?.endsAt ? localDateTime(editing.endsAt, editing.timezone || 'Asia/Karachi') : ''} /></div>
            <div className="space-y-1.5"><Label htmlFor="meetLink">Google Meet link</Label><Input id="meetLink" name="meetLink" type="url" defaultValue={editing?.meetLink || ''} placeholder="https://meet.google.com/..." /></div>
            <div className="space-y-1.5"><Label htmlFor="timezone">Timezone</Label><Input id="timezone" name="timezone" required defaultValue={editing?.timezone || 'Asia/Karachi'} placeholder="Asia/Karachi" /></div>
            <div className="space-y-1.5 sm:col-span-2"><Label htmlFor="notes">Notes</Label><Textarea id="notes" name="notes" rows={2} defaultValue={editing?.notes || ''} placeholder="Optional notes for students" /></div>
            <div className="flex flex-wrap gap-2 sm:col-span-2">
              <Button type="submit" disabled={busy} className="min-h-11">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : editing ? 'Save changes' : 'Save class'}</Button>
              <Button type="button" variant="outline" className="min-h-11" disabled={busy} onClick={() => { setEditing(null); setShowForm(false); }}>Cancel</Button>
            </div>
          </form>
        ) : null}

        <section aria-labelledby="weekly-scheduling" className="mb-8 space-y-5">
          <div><h2 id="weekly-scheduling" className="text-2xl font-extrabold tracking-tight text-ink">Thursday & Friday class links</h2><p className="mt-1 text-sm text-muted">Your regular classes, ready to schedule. Review the date and time, then paste each meeting link.</p></div>
          <div className="grid items-start gap-5 xl:grid-cols-2">
            {WEEKLY_CLASSES.map((preset) => <QuickClassCard key={preset.day} preset={preset} courses={courses} sessions={items} loading={loading || !loaded} onSaved={load} />)}
          </div>
        </section>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-brand" />
          </div>
        ) : items.length === 0 ? (
          <div className="panel p-10 text-center">
            <p className="text-sm font-bold text-ink">No classes scheduled</p>
            <p className="mt-1 text-xs text-muted">Add a session with date/time and Meet link for enrolled students.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((session) => (
              <article key={session.id} className="panel flex flex-wrap items-start justify-between gap-3 p-5"><div className="min-w-0">
                  <p className="text-base font-extrabold text-ink">{session.title}</p>
                  <p className="mt-1 text-sm text-muted">{session.courseTitle}</p>
                  <p className="mt-1 text-xs font-semibold text-ink/80">
                    {formatWhen(session.startsAt, session.timezone)} · {session.timezone}
                  </p>
                  {session.meetLink ? (
                    <a
                      href={session.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-brand hover:underline"
                    >
                      <Video className="h-3.5 w-3.5" />
                      Open Meet link
                    </a>
                  ) : (
                    <p className="mt-2 text-xs text-muted">Meet link pending</p>
                  )}
                </div>
                <div className="flex gap-2"><button type="button" onClick={() => { setEditing(session); setShowForm(true); }} className="inline-flex min-h-11 items-center rounded-xl border border-border px-3 text-sm font-bold text-ink">Edit</button><button
                  type="button"
                  onClick={() => void remove(session.id)}
                  className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-border text-muted hover:text-red-600"
                  aria-label="Delete session"
                >
                  <Trash2 className="h-4 w-4" />
                </button></div>
              </article>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
