'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  Calendar,
  FileText,
  Loader2,
  LogOut,
  Megaphone,
  PlayCircle,
  Video,
} from 'lucide-react';

import { useStudentSession } from '@/components/courses/auth-forms';
import { api, type HubSession, type PortalCourseSummary, type StudentHubHome } from '@/lib/api';

function formatSessionTime(session: HubSession) {
  const date = new Date(session.startsAt);
  if (Number.isNaN(date.getTime())) return session.startsAt;
  const formatted = date.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
  return session.timezone ? `${formatted} (${session.timezone})` : formatted;
}

function LiveLectureHub() {
  const [hub, setHub] = useState<StudentHubHome | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    void (async () => {
      const res = await api.get<StudentHubHome>('/api/student/hub/home');
      if (!res.ok) {
        setError(res.error);
        setLoading(false);
        return;
      }
      setHub(res.data);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="mb-10 flex min-h-[20vh] items-center justify-center rounded-2xl border border-border bg-card">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <p className="mb-10 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
        {error}
      </p>
    );
  }

  if (!hub) return null;

  const { nextSession, sessions, recordings, resources, community } = hub;
  const upcoming = nextSession ? sessions.filter((s) => s.id !== nextSession.id) : sessions;

  return (
    <div className="mb-10 space-y-6">
      {community.announcementTitle || community.announcementBody ? (
        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5">
          <p className="mb-1 flex items-center gap-2 text-sm font-bold text-primary">
            <Megaphone className="h-4 w-4" />
            {community.announcementTitle || 'Announcement'}
          </p>
          {community.announcementBody ? (
            <p className="text-sm text-foreground/90">{community.announcementBody}</p>
          ) : null}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">
            <Video className="h-4 w-4" /> Next live lecture
          </p>
          {nextSession ? (
            <div>
              <p className="font-bold text-foreground">{nextSession.title}</p>
              <p className="text-sm text-muted-foreground">{nextSession.courseTitle}</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {formatSessionTime(nextSession)}
              </p>
              {nextSession.notes ? (
                <p className="mt-2 text-sm text-foreground/90">{nextSession.notes}</p>
              ) : null}
              {nextSession.meetLink ? (
                <a
                  href={nextSession.meetLink}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Join session
                </a>
              ) : null}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No live lecture scheduled yet.</p>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">
            <Calendar className="h-4 w-4" /> Upcoming sessions
          </p>
          {upcoming.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nothing else on the schedule.</p>
          ) : (
            <ul className="space-y-3">
              {upcoming.map((s) => (
                <li key={s.id} className="text-sm">
                  <p className="font-semibold text-foreground">{s.title}</p>
                  <p className="text-muted-foreground">
                    {s.courseTitle} · {formatSessionTime(s)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">
            <PlayCircle className="h-4 w-4" /> Recordings
          </p>
          {recordings.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recordings yet.</p>
          ) : (
            <ul className="space-y-3">
              {recordings.map((r) => (
                <li key={r.id} className="text-sm">
                  <a
                    href={r.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-primary hover:underline"
                  >
                    {r.title}
                  </a>
                  <p className="text-muted-foreground">
                    {r.courseTitle}
                    {r.durationMinutes ? ` · ${r.durationMinutes} min` : ''}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <p className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-muted-foreground">
            <FileText className="h-4 w-4" /> Resources
          </p>
          {resources.length === 0 ? (
            <p className="text-sm text-muted-foreground">No resources yet.</p>
          ) : (
            <ul className="space-y-3">
              {resources.map((r) => (
                <li key={r.id} className="text-sm">
                  {r.fileUrl ? (
                    <a
                      href={r.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-primary hover:underline"
                    >
                      {r.title}
                    </a>
                  ) : (
                    <p className="font-semibold text-foreground">{r.title}</p>
                  )}
                  <p className="text-muted-foreground">
                    {r.courseTitle} · {r.kind}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

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
            <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">Dashboard</h1>
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

        <LiveLectureHub />

        <h2 className="mb-4 text-xl font-extrabold text-foreground">My courses</h2>

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
