'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  CalendarDays,
  PlayCircle,
  FileText,
  Users,
  UserCircle,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { logoutStudent } from '@/lib/student-context';
import { Logo } from '@/components/site/logo';

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, match: (p: string) => p === '/dashboard' },
  {
    href: '/dashboard/courses',
    label: 'My Courses',
    icon: BookOpen,
    match: (p: string) => p === '/dashboard/courses' || p.startsWith('/dashboard/courses/'),
  },
  {
    href: '/dashboard/schedule',
    label: 'Class Schedule',
    icon: CalendarDays,
    match: (p: string) => p.startsWith('/dashboard/schedule'),
  },
  {
    href: '/dashboard/recordings',
    label: 'Recordings',
    icon: PlayCircle,
    match: (p: string) => p.startsWith('/dashboard/recordings'),
  },
  {
    href: '/dashboard/resources',
    label: 'Resources',
    icon: FileText,
    match: (p: string) => p.startsWith('/dashboard/resources'),
  },
  {
    href: '/dashboard/community',
    label: 'Community',
    icon: Users,
    match: (p: string) => p.startsWith('/dashboard/community'),
  },
  {
    href: '/dashboard/profile',
    label: 'My Profile',
    icon: UserCircle,
    match: (p: string) => p.startsWith('/dashboard/profile'),
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="relative hidden w-[260px] shrink-0 flex-col overflow-hidden bg-gradient-to-b from-[#1a6ef0] via-[#1454c9] to-[#0a2d7a] text-white lg:flex">
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-56 opacity-40"
        style={{
          background:
            'radial-gradient(ellipse 90% 70% at 20% 100%, rgba(255,255,255,0.22), transparent), radial-gradient(ellipse 70% 50% at 90% 85%, rgba(140,200,255,0.35), transparent)',
        }}
      />

      <div className="relative px-5 py-6">
        <Logo dark href="/dashboard" />
      </div>

      <nav className="relative flex-1 space-y-1 px-3">
        {NAV.map(({ href, label, icon: Icon, match }) => {
          const active = match(pathname);
          return (
            <Link
              key={label}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white',
                active && 'bg-white/18 text-white'
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={1.75} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="relative px-3 py-5">
        <button
          type="button"
          onClick={async () => {
            await logoutStudent();
            router.replace('/login');
          }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </div>
    </aside>
  );
}
