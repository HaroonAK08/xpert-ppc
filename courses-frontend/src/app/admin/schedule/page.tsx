'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { Loader2, Plus, Trash2, Video } from 'lucide-react';
import { adminApi } from '@/lib/admin-api';
import { useAdminCourses } from '@/hooks/use-admin-courses';
import { AdminPageHeader } from '@/components/admin/page-header';
import { Button } from '@/components/ui/button';
import { Input, Label, Select, Textarea } from '@/components/ui/input';

type Session = {
  id: string;
  courseId: string;
  courseTitle: string;
  title: string;
  startsAt: string;
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

export default function AdminSchedulePage() {
  const { courses } = useAdminCourses();
  const [items, setItems] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    setLoading(true);
    const res = await adminApi.get<{ items: Session[] }>('/api/admin/academy/sessions');
    if (!res.ok) {
      setError(res.error);
      setLoading(false);
      return;
    }
    setItems(res.data.items);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  async function onCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError('');
    const fd = new FormData(e.currentTarget);
    const startsLocal = String(fd.get('startsAt') || '');
    const res = await adminApi.post<{ item: Session }>('/api/admin/academy/sessions', {
      courseId: String(fd.get('courseId') || ''),
      title: String(fd.get('title') || ''),
      startsAt: new Date(startsLocal).toISOString(),
      meetLink: String(fd.get('meetLink') || ''),
      timezone: String(fd.get('timezone') || 'Asia/Karachi'),
      notes: String(fd.get('notes') || ''),
      published: true,
    });
    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    e.currentTarget.reset();
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
          <Button type="button" className="h-10" onClick={() => setShowForm((v) => !v)}>
            <Plus className="h-4 w-4" />
            Add class
          </Button>
        }
      />
      <main className="px-5 py-8 sm:px-8">
        {error ? (
          <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
            {error}
          </p>
        ) : null}

        {showForm ? (
          <form onSubmit={onCreate} className="panel mb-6 grid gap-3 p-5 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="courseId">Course</Label>
              <Select id="courseId" name="courseId" required defaultValue="">
                <option value="" disabled>
                  Select course
                </option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="title">Session title</Label>
              <Input id="title" name="title" required placeholder="Live class — Week 1" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="startsAt">Starts at</Label>
              <Input id="startsAt" name="startsAt" type="datetime-local" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="meetLink">Google Meet link</Label>
              <Input id="meetLink" name="meetLink" placeholder="https://meet.google.com/..." />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="timezone">Timezone</Label>
              <Input id="timezone" name="timezone" defaultValue="Asia/Karachi" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" name="notes" rows={2} placeholder="Optional notes for students" />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" disabled={busy} className="h-10">
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save class'}
              </Button>
            </div>
          </form>
        ) : null}

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
              <article key={session.id} className="panel flex flex-wrap items-start justify-between gap-3 p-5">
                <div>
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
                <button
                  type="button"
                  onClick={() => void remove(session.id)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border text-muted hover:text-red-600"
                  aria-label="Delete session"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </article>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
