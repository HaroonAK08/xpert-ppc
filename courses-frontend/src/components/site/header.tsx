'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Logo } from './logo';

const NAV = [
  { href: '/', label: 'Home', match: (p: string) => p === '/' },
  { href: '/courses', label: 'Courses', match: (p: string) => p.startsWith('/courses') },
  { href: '/about', label: 'About Me', match: (p: string) => p === '/about' },
  { href: '/#my-team', label: 'My Team', match: () => false },
  { href: '/login', label: 'Login', match: (p: string) => p === '/login' },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[#edf2f9] bg-white">
      <div className="page flex h-[68px] items-center justify-between gap-4">
        <Logo />

        <div className="hidden items-center gap-8 md:flex">
          <nav className="flex items-center gap-[28px]">
            {NAV.map((item) => {
              const active = item.match(pathname);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    'relative text-[14.5px] font-semibold text-[#1a2744] transition hover:text-[#1a6ef0]',
                    active && 'text-[#1a6ef0]'
                  )}
                >
                  {item.label}
                  {active ? (
                    <span className="absolute -bottom-[9px] left-0 h-[2.5px] w-full rounded-full bg-[#1a6ef0]" />
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <Link
            href="/signup"
            className="inline-flex h-[40px] items-center rounded-[10px] bg-[#1a6ef0] px-[20px] text-[13.5px] font-bold text-white shadow-[0_8px_18px_-8px_rgba(26,110,240,0.65)] transition hover:bg-[#155fd9]"
          >
            Join Now
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e3ebf7] md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-[#edf2f9] bg-white px-5 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm font-semibold text-[#0a1b3f] hover:bg-[#e8f1ff]"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/signup"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex h-11 items-center justify-center rounded-full bg-[#1a6ef0] text-sm font-bold text-white"
            >
              Join Now
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
