'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookOpen, Loader2, LogOut } from 'lucide-react';

import { useStudentSession } from '@/components/courses/auth-forms';
import { api, type PortalCourseSummary } from '@/lib/api';

export default function CoursesDashboardPage() {
  const router = useRouter();
  const { user, loading } = useStudentSession();
  const [courses, setCourses] = useState<PortalCourseSummary[]>([]);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/courses/login');
      return;
    }

    void (async () => {
      const res = await api.get<{ items: PortalCourseSummary[] }>('/api/student/courses');
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setCourses(res.data.items);
    })();
  }, [loading, user, router]);

  async function enroll(course: PortalCourseSummary) {
    setBusyId(course.id);
    const res = await api.post(`/api/student/courses/${course.id}/enroll`);
    setBusyId(null);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    router.push(`/courses/learn/${course.slug}`);
  }

  async function logout() {
    await api.post('/api/student/auth/logout');
    router.replace('/courses');
  }

  if (loading || !user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <section className="bg-background py-12 sm:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">My courses</h1>
            <p className="mt-1 text-sm text-muted-foreground">Signed in as {user.email}</p>
          </div>
          <button
            type="button"
            onClick={() => void logout()}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-border px-4 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>

        {error ? (
          <p className="mb-6 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </p>
        ) : null}

        {!courses.length ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center">
            <BookOpen className="mx-auto mb-4 h-10 w-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              No published courses yet. Check back soon, or ask your instructor to publish one.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((c) => (
              <article
                key={c.id}
                className="flex flex-col rounded-2xl border border-border bg-card p-5"
              >
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-primary">
                  {c.level}
                </p>
                <h2 className="mb-2 text-xl font-bold text-foreground">{c.title}</h2>
                <p className="mb-6 flex-1 text-sm text-muted-foreground">
                  {c.description || 'Course content available after enrollment.'}
                </p>
                <p className="mb-4 text-xs text-muted-foreground">
                  {c.moduleCount} modules · {c.lessonCount} lessons
                </p>
                {c.enrolled ? (
                  <Link
                    href={`/courses/learn/${c.slug}`}
                    className="inline-flex h-11 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    Continue learning
                  </Link>
                ) : (
                  <button
                    type="button"
                    disabled={busyId === c.id}
                    onClick={() => void enroll(c)}
                    className="inline-flex h-11 items-center justify-center rounded-xl border border-primary text-sm font-bold text-primary transition-colors hover:bg-primary hover:text-primary-foreground disabled:opacity-60"
                  >
                    {busyId === c.id ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Enroll'}
                  </button>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
