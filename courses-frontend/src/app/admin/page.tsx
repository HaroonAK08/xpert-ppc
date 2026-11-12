'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  CalendarDays,
  ChevronRight,
  ClipboardList,
  FileText,
  Loader2,
  Megaphone,
  PlayCircle,
  Ticket,
  Users,
  UserPlus,
} from 'lucide-react';
import { adminApi } from '@/lib/admin-api';
import { AdminPageHeader } from '@/components/admin/page-header';
import { AdminInstall } from '@/components/admin/install';

type Overview = {
  pendingStudents: number;
  courses: number;
  sessions: number;
  recordings: number;
  resources: number;
};

const QUICK_ACTIONS = [
  { href: '/admin/students?invite=1', label: 'Invite student', icon: UserPlus },
  { href: '/admin/applications', label: 'Review applications', icon: ClipboardList },
  { href: '/admin/announcements', label: 'Post announcement', icon: Megaphone },
  { href: '/admin/schedule', label: 'Manage classes', icon: CalendarDays },
  { href: '/admin/recordings', label: 'Upload recording', icon: PlayCircle },
  { href: '/admin/resources', label: 'Upload resource', icon: FileText },
];

const LINKS = [
  { href: '/admin/coupons', label: 'Coupons', description: 'Manage registration fee waiver codes.', icon: Ticket, key: null, suffix: '' },
  {
    href: '/admin/applications',
    label: 'Applications',
    description: 'Approve or reject new student signups after payment verification.',
    icon: ClipboardList,
    key: 'pendingStudents' as const,
    suffix: 'waiting',
  },
  {
    href: '/admin/students',
    label: 'Students',
    description: 'View approved students, profile details, and last login activity.',
    icon: Users,
    key: null,
    suffix: '',
  },
  {
    href: '/admin/announcements',
    label: 'Announcements',
    description: 'Write student announcements, manage message history, and update the weekly class notice.',
    icon: Megaphone,
    key: null,
    suffix: '',
  },
  {
    href: '/admin/courses',
    label: 'Courses',
    description: 'Create courses, modules, lessons, and default Meet links.',
    icon: BookOpen,
    key: 'courses' as const,
    suffix: 'courses',
  },
  {
    href: '/admin/schedule',
    label: 'Class Schedule',
    description: 'Add live class times and Google Meet links for batches.',
    icon: CalendarDays,
    key: 'sessions' as const,
    suffix: 'sessions',
  },
  {
    href: '/admin/recordings',
    label: 'Recordings',
    description: 'Publish class replays for enrolled students.',
    icon: PlayCircle,
    key: 'recordings' as const,
    suffix: 'recordings',
  },
  {
    href: '/admin/resources',
    label: 'Resources',
    description: 'Share notes, assignments, and downloadable assets.',
    icon: FileText,
    key: 'resources' as const,
    suffix: 'resources',
  },
  {
    href: '/admin/community',
    label: 'Community',
    description: 'Set WhatsApp, social links, and dashboard announcements.',
    icon: Users,
    key: null,
    suffix: '',
  },
];

export default function AdminOverviewPage() {
  const [data, setData] = useState<Overview | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    adminApi.get<Overview>('/api/admin/academy/overview').then((res) => {
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setData(res.data);
    });
  }, []);

  return (
    <>
      <AdminPageHeader
        title="Academy overview"
        subtitle="Manage applications, courses, live classes, and student content."
      />
      <main className="space-y-6 px-4 py-6 sm:px-8">
        <section aria-labelledby="quick-actions-heading">
          <h2 id="quick-actions-heading" className="mb-3 text-sm font-bold text-ink">Quick actions</h2>
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
            {QUICK_ACTIONS.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} className="flex min-h-12 items-center gap-3 rounded-xl border border-border bg-white px-4 py-3 text-sm font-semibold text-ink hover:bg-brand-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">
                <Icon className="h-5 w-5 shrink-0 text-muted" aria-hidden="true" />{label}
              </Link>
            ))}
          </div>
        </section>
        <AdminInstall />
        {error ? (
          <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
            {error}
          </p>
        ) : null}

        {!data && !error ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-brand" />
          </div>
        ) : data ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {LINKS.map(({ href, label, description, icon: Icon, key, suffix }) => (
              <Link key={href} href={href} className="panel group flex flex-col p-5 transition hover:shadow-pop">
                <div className="flex items-start justify-between gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-brand">
                    <Icon className="h-5 w-5" />
                  </span>
                  <ChevronRight className="h-4 w-4 text-muted/40 transition group-hover:text-brand" />
                </div>
                <p className="mt-4 text-base font-extrabold text-ink">{label}</p>
                <p className="mt-1 flex-1 text-sm leading-relaxed text-muted">{description}</p>
                {key ? (
                  <p className="mt-4 text-xs font-bold text-brand">
                    {data[key]} {suffix}
                  </p>
                ) : (
                  <p className="mt-4 text-xs font-bold text-brand">{href === '/admin/students' ? 'View students' : href === '/admin/announcements' ? 'Manage announcements' : 'Configure links'}</p>
                )}
              </Link>
            ))}
          </div>
        ) : <button type="button" onClick={() => window.location.reload()} className="rounded-xl border border-border bg-white px-4 py-3 text-sm font-semibold text-ink">Try again</button>}
      </main>
    </>
  );
}
