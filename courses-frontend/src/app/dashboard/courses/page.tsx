'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, ChevronRight, Megaphone } from 'lucide-react';
import { api } from '@/lib/api';
import { DashboardPageHeader } from '@/components/dashboard/page-header';

type PortalCourseSummary = {
  id: string;
  title: string;
  slug: string;
  description: string;
  level: string;
  enrolled: boolean;
  moduleCount: number;
  lessonCount: number;
};

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<PortalCourseSummary[] | null>(null);

  useEffect(() => {
    api.get<{ items: PortalCourseSummary[] }>('/api/student/courses').then((res) => {
      setCourses(res.ok ? res.data.items : []);
    });
  }, []);

  const enrolled = (courses ?? []).filter((c) => c.enrolled);

  return (
    <>
      <DashboardPageHeader title="My Courses" />
      <main className="px-5 py-8 sm:px-8">
        <h2 className="text-2xl font-extrabold tracking-tight text-ink">Your enrolled courses</h2>
        <p className="mt-1 text-sm text-muted">Open a course to follow lessons and track progress.</p>

        <div className="mt-6 panel p-6">
          {courses === null ? (
            <p className="text-sm text-muted">Loading…</p>
          ) : enrolled.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                <BookOpen className="h-7 w-7" />
              </span>
              <p className="text-sm font-bold text-ink">No enrollments yet</p>
              <p className="max-w-sm text-sm text-muted">
                Browse the academy catalog and enroll to see your courses here.
              </p>
              <Link
                href="/courses"
                className="mt-2 inline-flex h-10 items-center gap-1 rounded-xl bg-brand px-4 text-xs font-bold text-white"
              >
                Browse courses <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {enrolled.map((course) => (
                <div
                  key={course.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/80 p-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
                      <Megaphone className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-ink">{course.title}</p>
                      <p className="mt-0.5 text-xs text-muted">
                        {course.moduleCount} modules · {course.lessonCount} lessons
                        {course.level ? ` · ${course.level}` : ''}
                      </p>
                      <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
                        ✓ Enrolled
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/dashboard/courses/${course.slug}`}
                    className="inline-flex h-10 items-center gap-1 rounded-xl bg-brand px-4 text-xs font-bold text-white shadow-sm"
                  >
                    View Course <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
