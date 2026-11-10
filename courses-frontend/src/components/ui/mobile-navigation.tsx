'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, Menu, X } from 'lucide-react';

type NavigationItem = { href: string; label: string };

export function MobileNavigation({ items, home, onLogout }: { items: NavigationItem[]; home: string; onLogout: () => Promise<void> }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  useEffect(() => { setOpen(false); }, [pathname]);
  const active = items.find((item) => item.href === pathname) || [...items].reverse().find((item) => pathname.startsWith(`${item.href}/`));

  return (
    <div className="border-b border-border bg-white lg:hidden">
      <div className="flex h-14 items-center justify-between gap-3 px-4">
        <Link href={home} className="shrink-0 text-xs font-extrabold text-ink sm:text-sm">XpertPPC Academy</Link>
        <button type="button" aria-expanded={open} aria-controls="academy-mobile-navigation" onClick={() => setOpen((value) => !value)} className="flex min-h-11 min-w-0 items-center gap-2 rounded-lg border border-border px-3 text-sm font-semibold text-ink">
          <span className="truncate">{active?.label || 'Menu'}</span>{open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>
      {open && <nav id="academy-mobile-navigation" aria-label="Academy navigation" className="grid gap-1 border-t border-border p-3 sm:grid-cols-2">
        {items.map((item) => <Link key={item.href} href={item.href} aria-current={pathname === item.href ? 'page' : undefined} onClick={() => setOpen(false)} className={`rounded-lg px-3 py-3 text-sm font-semibold ${active?.href === item.href ? 'bg-brand-soft text-brand' : 'text-ink hover:bg-brand-soft'}`}>{item.label}</Link>)}
        <button type="button" disabled={loggingOut} onClick={async () => { setLoggingOut(true); try { await onLogout(); } finally { setLoggingOut(false); } }} className="flex items-center gap-2 rounded-lg px-3 py-3 text-left text-sm font-semibold text-ink"><LogOut className="h-4 w-4" />{loggingOut ? 'Signing out…' : 'Log out'}</button>
      </nav>}
    </div>
  );
}
