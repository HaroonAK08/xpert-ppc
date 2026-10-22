'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, Loader2 } from 'lucide-react';

import { api } from '@/lib/api';

type Applicant = {
  id: string;
  name: string;
  email: string;
  country: string;
  interest: string;
  status: 'pending' | 'approved' | 'rejected';
  needsCourseAssignment: boolean;
  createdAt: string;
};

type CourseOption = {
  id: string;
  title: string;
  published: boolean;
};

export default function AdminStudentsPage() {
  const router = useRouter();
  const [items, setItems] = useState<Applicant[]>([]);
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [assignChoice, setAssignChoice] = useState<Record<string, string>>({});
  const [assignNotice, setAssignNotice] = useState<Record<string, string>>({});

  async function load() {
    const me = await api.get('/api/auth/me');
    if (!me.ok) {
      router.replace('/admin/login');
      return;
    }
    const [studentsRes, coursesRes] = await Promise.all([
      api.get<{ items: Applicant[] }>('/api/admin/portal/students'),
      api.get<{ items: CourseOption[] }>('/api/admin/portal/courses'),
    ]);
    if (!studentsRes.ok) {
      setError(studentsRes.error);
      setLoading(false);
      return;
    }
    setItems(studentsRes.data.items);
    if (coursesRes.ok) setCourses(coursesRes.data.items.filter((c) => c.published));
    setLoading(false);
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function decide(id: string, status: 'approved' | 'rejected') {
    setBusyId(id);
    const res = await api.patch<{ enrolled: boolean }>(`/api/admin/portal/students/${id}`, {
      status,
    });
    setBusyId(null);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setItems((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status, needsCourseAssignment: status === 'approved' && !res.data.enrolled }
          : s
      )
    );
  }

  async function assignCourse(id: string) {
    const courseId = assignChoice[id];
    if (!courseId) return;

    setBusyId(id);
    const res = await api.post<{ courseTitle: string; emailed: boolean }>(
      `/api/admin/portal/students/${id}/assign-course`,
      { courseId }
    );
    setBusyId(null);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setItems((prev) => prev.map((s) => (s.id === id ? { ...s, needsCourseAssignment: false } : s)));
    setAssignNotice((prev) => ({
      ...prev,
      [id]: res.data.emailed
        ? `Assigned to ${res.data.courseTitle} — student emailed.`
        : `Assigned to ${res.data.courseTitle}.`,
    }));
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const pending = items.filter((s) => s.status === 'pending');
  const others = items.filter((s) => s.status !== 'pending');

  return (
    <section className="bg-background py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-extrabold sm:text-3xl">Course applications</h1>
        <p className="mb-8 mt-1 text-sm text-muted-foreground">
          Accept someone so they can sign in with the password they chose.
        </p>

        {error ? (
          <p className="mb-6 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">
          Waiting ({pending.length})
        </h2>
        <div className="mb-10 space-y-3">
          {pending.length === 0 ? (
            <p className="text-sm text-muted-foreground">No pending applications.</p>
          ) : (
            pending.map((s) => (
              <article key={s.id} className="rounded-2xl border border-border bg-card p-5">
                <p className="font-bold">{s.name}</p>
                <p className="text-sm text-muted-foreground">
                  {s.email}
                  {s.country ? ` · ${s.country}` : ''}
                </p>
                {s.interest ? (
                  <p className="mt-2 text-sm text-foreground/90">{s.interest}</p>
                ) : null}
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    disabled={busyId === s.id}
                    onClick={() => void decide(s.id, 'approved')}
                    className="inline-flex h-10 items-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:opacity-60"
                  >
                    Accept
                  </button>
                  <button
                    type="button"
                    disabled={busyId === s.id}
                    onClick={() => void decide(s.id, 'rejected')}
                    className="inline-flex h-10 items-center rounded-xl border border-border px-4 text-sm font-semibold"
                  >
                    Reject
                  </button>
                </div>
              </article>
            ))
          )}
        </div>

        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">
          Reviewed ({others.length})
        </h2>
        <div className="space-y-3">
          {others.map((s) => (
            <article key={s.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-bold">{s.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {s.email}
                    {s.country ? ` · ${s.country}` : ''}
                  </p>
                </div>
                <span className="text-xs font-bold uppercase text-muted-foreground">
                  {s.status}
                </span>
              </div>
              {s.interest ? <p className="mt-2 text-sm text-foreground/90">{s.interest}</p> : null}

              {s.needsCourseAssignment ? (
                <div className="mt-4 rounded-xl border border-amber-400/40 bg-amber-400/10 p-4">
                  <p className="flex items-center gap-2 text-sm font-semibold text-amber-700">
                    <AlertTriangle className="h-4 w-4" />
                    No course matched automatically — assign one so they can sign in.
                  </p>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <select
                      value={assignChoice[s.id] || ''}
                      onChange={(e) =>
                        setAssignChoice((prev) => ({ ...prev, [s.id]: e.target.value }))
                      }
                      className="h-10 rounded-xl border border-border bg-background px-3 text-sm"
                    >
                      <option value="" disabled>
                        Choose a course…
                      </option>
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      disabled={busyId === s.id || !assignChoice[s.id]}
                      onClick={() => void assignCourse(s.id)}
                      className="inline-flex h-10 items-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:opacity-60"
                    >
                      Assign
                    </button>
                  </div>
                </div>
              ) : null}

              {assignNotice[s.id] ? (
                <p className="mt-3 text-xs font-semibold text-emerald-600">{assignNotice[s.id]}</p>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
