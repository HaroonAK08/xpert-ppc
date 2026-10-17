'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  BookOpen,
  CalendarDays,
  ClipboardList,
  FileText,
  LayoutDashboard,
  LogOut,
  PlayCircle,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/cn';
import { logoutAdmin } from '@/lib/admin-api';
import { useAdmin } from '@/lib/admin-context';
import { Logo } from '@/components/site/logo';

const NAV = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/admin/applications', label: 'Applications', icon: ClipboardList },
  { href: '/admin/courses', label: 'Courses', icon: BookOpen },
  { href: '/admin/schedule', label: 'Class Schedule', icon: CalendarDays },
  { href: '/admin/recordings', label: 'Recordings', icon: PlayCircle },
  { href: '/admin/resources', label: 'Resources', icon: FileText },
  { href: '/admin/community', label: 'Community', icon: Users },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const admin = useAdmin();

  return (
    <div className="flex min-h-dvh bg-canvas">
      <aside className="relative hidden w-[260px] shrink-0 flex-col overflow-hidden bg-gradient-to-b from-[#0f2347] via-[#12305f] to-[#0a1b3f] text-white lg:flex">
        <div className="relative px-5 py-6">
          <Logo dark href="/admin" />
          <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/55">
            Academy admin
          </p>
        </div>

        <nav className="relative flex-1 space-y-1 px-3">
          {NAV.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-white/75 transition hover:bg-white/10 hover:text-white',
                  active && 'bg-white/15 text-white'
                )}
              >
                <Icon className="h-4 w-4" strokeWidth={1.75} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="relative space-y-3 px-3 py-5">
          {admin ? (
            <div className="rounded-xl bg-white/10 px-3 py-2.5">
              <p className="truncate text-xs font-bold text-white">{admin.name}</p>
              <p className="truncate text-[11px] text-white/60">{admin.email}</p>
            </div>
          ) : null}
          <button
            type="button"
            onClick={async () => {
              await logoutAdmin();
              router.replace('/admin/login');
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-white/75 transition hover:bg-white/10 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
