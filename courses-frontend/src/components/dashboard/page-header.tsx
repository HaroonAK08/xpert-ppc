'use client';

import Link from 'next/link';
import { Search, User } from 'lucide-react';
import { useStudent } from '@/lib/student-context';

export function DashboardPageHeader({ title }: { title: string }) {
  const student = useStudent();
  const avatarUrl = student?.avatarUrl;

  return (
    <header className="flex h-[72px] items-center gap-4 border-b border-border/70 bg-white px-5 sm:px-8">
      <h1 className="shrink-0 text-lg font-extrabold tracking-tight text-ink">{title}</h1>
      <div className="mx-auto hidden max-w-md flex-1 items-center gap-2 rounded-full border border-border bg-[#f8fafc] px-4 py-2.5 sm:flex">
        <Search className="h-4 w-4 text-muted" />
        <span className="text-sm text-muted">Search courses, resources or topics…</span>
      </div>
      <Link
        href="/dashboard/profile"
        className="ml-auto flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[#e8edf5] text-muted"
        aria-label="My profile"
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <User className="h-5 w-5" />
        )}
      </Link>
    </header>
  );
}
