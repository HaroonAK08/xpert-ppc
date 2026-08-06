'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  CheckCircle2,
  ClipboardList,
  FileText,
  Loader2,
  PlayCircle,
  Video,
} from 'lucide-react';

import { useStudentSession } from '@/components/courses/auth-forms';
import { API_URL, api, type PortalCourseDetail, type PortalLesson } from '@/lib/api';
import { cn } from '@/lib/utils';

function mediaUrl(url: string) {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${API_URL}${url}`;
}

function youtubeEmbed(url: string) {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtu.be')) {
      return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    }
    if (u.hostname.includes('youtube.com')) {
      const id = u.searchParams.get('v');
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
  } catch {
    return '';
  }
  return '';
}

function LessonIcon({ type }: { type: PortalLesson['type'] }) {
  if (type === 'video') return <Video className="h-4 w-4" />;
  if (type === 'assignment') return <ClipboardList className="h-4 w-4" />;
  if (type === 'task') return <CheckCircle2 className="h-4 w-4" />;
  return <FileText className="h-4 w-4" />;
}

export default function CourseLearnPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const { user, loading } = useStudentSession();
  const [course, setCourse] = useState<PortalCourseDetail | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace('/courses/login');
      return;
    }

    void (async () => {
      const res = await api.get<{ course: PortalCourseDetail }>(
        `/api/student/courses/${params.slug}`
      );
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setCourse(res.data.course);
      const first = res.data.course.modules.flatMap((m) => m.lessons)[0];
      setActiveId(first?.id ?? null);
    })();
  }, [loading, user, router, params.slug]);

  const activeLesson = useMemo(() => {
    if (!course || !activeId) return null;
    for (const mod of course.modules) {
      const found = mod.lessons.find((l) => l.id === activeId);
      if (found) return found;
    }
    return null;
  }, [course, activeId]);

  async function markComplete() {
    if (!course || !activeLesson) return;
    setMarking(true);
    const res = await api.post(
      `/api/student/courses/${course.id}/lessons/${activeLesson.id}/complete`
    );
    setMarking(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setCourse((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        modules: prev.modules.map((m) => ({
          ...m,
          lessons: m.lessons.map((l) =>
            l.id === activeLesson.id ? { ...l, completed: true } : l
          ),
        })),
      };
    });
  }

  if (loading || (!course && !error)) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error && !course) {
    return (
      <section className="bg-background py-16">
        <div className="container mx-auto max-w-lg px-4 text-center">
          <p className="mb-6 text-destructive">{error}</p>
          <Link href="/courses/dashboard" className="text-primary hover:underline">
            Back to dashboard
          </Link>
        </div>
      </section>
    );
  }

  if (!course) return null;

  const yt = activeLesson?.videoUrl ? youtubeEmbed(activeLesson.videoUrl) : '';

  return (
    <section className="bg-background py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <Link href="/courses/dashboard" className="text-sm text-primary hover:underline">
              ← My courses
            </Link>
            <h1 className="mt-2 text-2xl font-extrabold text-foreground sm:text-3xl">
              {course.title}
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <div className="space-y-4 rounded-2xl border border-border bg-card p-4">
              {course.modules.map((mod) => (
                <div key={mod.id}>
                  <h2 className="mb-2 text-sm font-bold uppercase tracking-wider text-primary">
                    {mod.title}
                  </h2>
                  <ul className="space-y-1">
                    {!mod.lessons.length ? (
                      <li className="rounded-lg px-3 py-2 text-sm text-muted-foreground">
                        No lessons yet
                      </li>
                    ) : null}
                    {mod.lessons.map((lesson) => (
                      <li key={lesson.id}>
                        <button
                          type="button"
                          onClick={() => setActiveId(lesson.id)}
                          className={cn(
                            'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors',
                            activeId === lesson.id
                              ? 'bg-primary/15 text-foreground'
                              : 'text-muted-foreground hover:bg-muted/40 hover:text-foreground'
                          )}
                        >
                          <LessonIcon type={lesson.type} />
                          <span className="min-w-0 flex-1 truncate">{lesson.title}</span>
                          {lesson.completed ? (
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                          ) : null}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </aside>

          <div className="lg:col-span-8">
            {!activeLesson ? (
              <p className="text-muted-foreground">Select a lesson to begin.</p>
            ) : (
              <div className="rounded-2xl border border-border bg-card p-5 sm:p-8">
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-primary">
                  {activeLesson.type}
                </p>
                <h2 className="mb-4 text-2xl font-bold text-foreground">{activeLesson.title}</h2>
                {activeLesson.summary ? (
                  <p className="mb-6 text-muted-foreground">{activeLesson.summary}</p>
                ) : null}

                {activeLesson.videoUrl || activeLesson.type === 'video' ? (
                  <div className="mb-6 overflow-hidden rounded-xl border border-border bg-background">
                    {yt ? (
                      <iframe
                        title={activeLesson.title}
                        src={yt}
                        className="aspect-video w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : activeLesson.videoUrl ? (
                      <video
                        controls
                        className="aspect-video w-full"
                        src={mediaUrl(activeLesson.videoUrl)}
                      />
                    ) : (
                      <div className="flex aspect-video items-center justify-center text-muted-foreground">
                        <PlayCircle className="mr-2 h-6 w-6" /> No video attached yet
                      </div>
                    )}
                  </div>
                ) : null}

                {activeLesson.body ? (
                  <div className="mb-6 whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                    {activeLesson.body}
                  </div>
                ) : null}

                {activeLesson.fileUrl ? (
                  <a
                    href={mediaUrl(activeLesson.fileUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mb-6 inline-flex items-center gap-2 rounded-xl border border-primary/40 px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/10"
                  >
                    Download {activeLesson.fileName || 'attachment'}
                  </a>
                ) : null}

                <button
                  type="button"
                  disabled={marking || activeLesson.completed}
                  onClick={() => void markComplete()}
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
                >
                  {marking ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {activeLesson.completed ? 'Completed' : 'Mark as complete'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
