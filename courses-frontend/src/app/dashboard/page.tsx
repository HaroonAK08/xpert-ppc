'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  CalendarDays,
  Monitor,
  ChevronRight,
  Megaphone,
  FileText,
  PlayCircle,
  CheckSquare,
  Video,
  Globe2,
  Youtube,
  Linkedin,
  Instagram,
} from 'lucide-react';
import { api } from '@/lib/api';
import { SOCIAL_LINKS } from '@/lib/socials';
import { fetchStudentHub, type HubSession, type HubCommunity } from '@/lib/student-hub';
import { useStudent } from '@/lib/student-context';
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

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

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

export default function DashboardPage() {
  const student = useStudent();
  const [courses, setCourses] = useState<PortalCourseSummary[] | null>(null);
  const [nextSession, setNextSession] = useState<HubSession | null>(null);
  const [community, setCommunity] = useState<HubCommunity | null>(null);

  useEffect(() => {
    api.get<{ items: PortalCourseSummary[] }>('/api/student/courses').then((res) => {
      if (res.ok) setCourses(res.data.items);
      else setCourses([]);
    });
    fetchStudentHub().then((res) => {
      if (!res.ok) return;
      setNextSession(res.data.nextSession);
      setCommunity(res.data.community);
    });
  }, []);

  const enrolled = (courses ?? []).filter((c) => c.enrolled);
  const nextCourse = enrolled[0] ?? null;

  return (
    <>
      <DashboardPageHeader title="Student Dashboard" />

      <main className="px-5 py-8 sm:px-8">
        <h2 className="text-2xl font-extrabold tracking-tight text-ink sm:text-[1.75rem]">
          Welcome{student ? `, ${student.name.split(' ')[0]}` : ''} to your learning space
        </h2>
        <p className="mt-1 text-sm text-muted">Your classes, resources and community in one place.</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <StatCard href="/dashboard/courses" icon={BookOpen} title="My Courses" value={`${enrolled.length} enrolled`} />
          <StatCard
            href="/dashboard/schedule"
            icon={CalendarDays}
            title="Next Class"
            value={
              nextSession
                ? formatWhen(nextSession.startsAt, nextSession.timezone)
                : 'To be announced'
            }
          />
          <StatCard href="/dashboard/schedule" icon={Monitor} title="Learning Mode" value="Live online" />
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1.45fr_1fr]">
          <div className="panel p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-ink">Next Class</h3>
              {nextSession || nextCourse ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-600">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500" /> Live class
                </span>
              ) : null}
            </div>

            {nextSession ? (
              <div className="mt-5">
                <div className="flex items-start gap-4">
                  <span className="flex h-[68px] w-[68px] shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                    <Megaphone className="h-8 w-8" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-lg font-bold text-ink">{nextSession.title}</p>
                    <p className="mt-0.5 text-sm text-muted">{nextSession.courseTitle}</p>
                    <p className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-semibold text-ink/80">
                      <CalendarDays className="h-3.5 w-3.5 text-brand" />
                      {formatWhen(nextSession.startsAt, nextSession.timezone)}
                    </p>
                  </div>
                </div>

                {nextSession.meetLink ? (
                  <a
                    href={nextSession.meetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand text-sm font-semibold text-white"
                  >
                    <Video className="h-4 w-4" />
                    Join Google Meet
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#eef2f8] text-sm font-semibold text-muted"
                  >
                    <Video className="h-4 w-4" />
                    Google Meet link pending
                  </button>
                )}

                <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted">
                  <Globe2 className="h-3.5 w-3.5" />
                  Time zone: {nextSession.timezone}
                </p>
              </div>
            ) : nextCourse ? (
              <div className="mt-5">
                <div className="flex items-start gap-4">
                  <span className="flex h-[68px] w-[68px] shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                    <Megaphone className="h-8 w-8" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-lg font-bold text-ink">{nextCourse.title}</p>
                    <p className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-semibold text-ink/80">
                      <CalendarDays className="h-3.5 w-3.5 text-brand" />
                      Schedule to be announced
                    </p>
                    <p className="mt-0.5 text-xs text-muted">Your class time will appear here once confirmed.</p>
                  </div>
                </div>
                <button
                  type="button"
                  disabled
                  className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#eef2f8] text-sm font-semibold text-muted"
                >
                  <Video className="h-4 w-4" />
                  Google Meet link pending
                </button>
              </div>
            ) : (
              <div className="mt-4 text-sm text-muted">
                No classes yet.{' '}
                <Link href="/courses" className="font-semibold text-brand">
                  Enroll in a course
                </Link>{' '}
                to get started.
              </div>
            )}
          </div>

          <div className="panel p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-ink">Class Schedule</h3>
              <Link href="/dashboard/schedule" className="text-xs font-semibold text-brand">
                View all
              </Link>
            </div>
            <div className="mt-5 grid grid-cols-7 gap-1 text-center">
              {DAYS.map((day) => (
                <div key={day} className="flex flex-col items-center gap-2">
                  <p className="text-[11px] font-semibold text-muted">{day}</p>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f1f5f9] text-xs text-muted/50">
                    —
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-col items-center gap-2 text-center">
              <CalendarDays className="h-12 w-12 text-border" strokeWidth={1.25} />
              <p className="text-xs text-muted">Your next session will appear here.</p>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1.45fr_1fr]">
          <div className="space-y-5">
            <div className="panel p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-ink">My Courses</h3>
                <Link href="/dashboard/courses" className="text-xs font-semibold text-brand">
                  View all
                </Link>
              </div>
              {courses === null ? (
                <p className="mt-4 text-sm text-muted">Loading…</p>
              ) : enrolled.length === 0 ? (
                <p className="mt-4 text-sm text-muted">You haven&apos;t enrolled in a course yet.</p>
              ) : (
                <div className="mt-4 space-y-3">
                  {enrolled.map((course) => (
                    <div
                      key={course.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/80 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-soft text-brand">
                          <Megaphone className="h-5 w-5" />
                        </span>
                        <div>
                          <p className="text-sm font-bold text-ink">{course.title}</p>
                          <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700">
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

            <div className="panel p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-ink">Learning Resources</h3>
                <Link href="/dashboard/resources" className="text-xs font-semibold text-brand">
                  View all
                </Link>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {[
                  {
                    href: '/dashboard/recordings',
                    icon: PlayCircle,
                    title: 'Class recordings',
                    tone: 'bg-violet-50 text-violet-600',
                  },
                  {
                    href: '/dashboard/resources',
                    icon: FileText,
                    title: 'Lesson notes',
                    tone: 'bg-brand-soft text-brand',
                  },
                  {
                    href: '/dashboard/resources',
                    icon: CheckSquare,
                    title: 'Assignments',
                    tone: 'bg-amber-50 text-amber-600',
                  },
                ].map(({ href, icon: Icon, title, tone }) => (
                  <Link
                    key={title}
                    href={href}
                    className="flex items-center gap-3 rounded-2xl border border-border/80 p-3.5 transition hover:border-brand/30"
                  >
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${tone}`}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-ink">{title}</p>
                      <p className="text-[11px] text-muted">Available after your class</p>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted/50" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="panel p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-extrabold text-ink">Stay connected</h3>
                <Link href="/dashboard/community" className="text-xs font-semibold text-brand">
                  View all
                </Link>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#25D366]/15 text-[#25D366]">
                  <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current" aria-hidden>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </span>
                <div>
                  <p className="text-sm font-bold text-ink">WhatsApp Community</p>
                </div>
              </div>
              <Link
                href="/dashboard/community"
                className="mt-4 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-brand text-xs font-bold text-white"
              >
                View Community
                <ChevronRight className="h-3.5 w-3.5" />
              </Link>
              <p className="mt-2 text-center text-[11px] text-muted">Community link coming soon.</p>
            </div>

            <div className="panel p-6">
              <h3 className="text-base font-extrabold text-ink">Announcements</h3>
              <div className="mt-4 flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
                  <Megaphone className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm font-bold text-ink">
                    {community?.announcementTitle || 'Welcome to the academy'}
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted">
                    {community?.announcementBody ||
                      'Check this dashboard for your batch schedule and learning resources.'}
                  </p>
                </div>
              </div>
              <div className="mt-5 flex items-center justify-end gap-2">
                <a
                  href={community?.youtubeUrl || SOCIAL_LINKS.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF0000] text-white"
                >
                  <Youtube className="h-3.5 w-3.5" />
                </a>
                <a
                  href={community?.linkedinUrl || SOCIAL_LINKS.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0A66C2] text-white"
                >
                  <Linkedin className="h-3.5 w-3.5" />
                </a>
                <a href="#" aria-label="Instagram" className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white">
                  <Instagram className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 panel p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-ink">My Profile</h3>
            <Link href="/dashboard/profile" className="text-xs font-semibold text-brand">
              View profile
            </Link>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold text-muted">Name</p>
              <p className="text-sm font-bold text-ink">{student?.name ?? '—'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted">Email</p>
              <p className="text-sm font-bold text-ink">{student?.email ?? '—'}</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

function StatCard({
  href,
  icon: Icon,
  title,
  value,
}: {
  href: string;
  icon: typeof BookOpen;
  title: string;
  value: string;
}) {
  return (
    <Link href={href} className="panel flex items-center gap-4 p-4 transition hover:shadow-pop">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-ink">{title}</p>
        <p className="text-sm text-muted">{value}</p>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-muted/40" />
    </Link>
  );
}
