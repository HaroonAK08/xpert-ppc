'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { CheckCircle2, Circle, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';

type Lesson = { id: string; title: string; type: string; summary: string; durationMinutes: number; completed: boolean };
type ModuleData = { id: string; title: string; description: string; lessons: Lesson[] };
type CourseDetail = { id: string; title: string; description: string; modules: ModuleData[] };

export default function EnrolledCoursePage() {
  const params = useParams<{ slug: string }>();
  const [data, setData] = useState<{ course: CourseDetail } | 'error' | null>(null);

  useEffect(() => {
    api.get<{ course: CourseDetail }>(`/api/student/courses/${params.slug}`).then((res) => {
      setData(res.ok ? res.data : 'error');
    });
  }, [params.slug]);

  async function toggleComplete(lessonId: string) {
    if (data === null || data === 'error') return;
    const res = await api.post<{ ok: boolean }>(`/api/student/courses/${data.course.id}/lessons/${lessonId}/complete`);
    if (!res.ok) return;
    setData({
      course: {
        ...data.course,
        modules: data.course.modules.map((m) => ({
          ...m,
          lessons: m.lessons.map((l) => (l.id === lessonId ? { ...l, completed: true } : l)),
        })),
      },
    });
  }

  return (
    <>
      <header className="flex h-[68px] items-center gap-3 border-b border-border bg-white px-5 sm:px-8">
        <Link
          href="/dashboard/courses"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border"
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
        <h1 className="text-lg font-extrabold tracking-tight text-ink">
          {data && data !== 'error' ? data.course.title : 'Course'}
        </h1>
      </header>

      <main className="px-5 py-8 sm:px-8">
        {data === null ? (
          <p className="text-sm text-muted">Loading…</p>
        ) : data === 'error' ? (
          <p className="text-sm text-muted">You don&apos;t have access to this course.</p>
        ) : (
          <div className="space-y-4">
            {data.course.description ? <p className="text-sm text-muted">{data.course.description}</p> : null}
            {data.course.modules.map((module) => (
              <div key={module.id} className="panel p-5">
                <h2 className="text-base font-extrabold text-ink">{module.title}</h2>
                {module.description ? <p className="mt-1 text-sm text-muted">{module.description}</p> : null}
                <div className="mt-4 space-y-2">
                  {module.lessons.map((lesson) => (
                    <button
                      key={lesson.id}
                      type="button"
                      onClick={() => toggleComplete(lesson.id)}
                      className="flex w-full items-center justify-between gap-3 rounded-xl border border-border px-4 py-3 text-left transition hover:border-brand/40"
                    >
                      <span className="flex items-center gap-3">
                        {lesson.completed ? (
                          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        ) : (
                          <Circle className="h-5 w-5 text-border" />
                        )}
                        <span>
                          <span className="block text-sm font-semibold text-ink">{lesson.title}</span>
                          <span className="text-xs text-muted">
                            {lesson.type}
                            {lesson.durationMinutes ? ` · ${lesson.durationMinutes} min` : ''}
                          </span>
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
