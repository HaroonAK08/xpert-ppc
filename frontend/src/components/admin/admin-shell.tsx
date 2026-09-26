'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BookOpen, ClipboardList, Inbox, Loader2, LogOut, Users } from 'lucide-react';

import { api, type AdminUser } from '@/lib/api';
import { cn } from '@/lib/utils';
import { AdminUserContext } from './admin-context';

type NavItem = {
  href: string;
  label: string;
  icon: typeof Inbox;
  adminOnly?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { href: '/admin', label: 'Website leads', icon: Inbox },
  { href: '/admin/clients', label: 'Clients', icon: Users, adminOnly: true },
  { href: '/admin/students', label: 'Applications', icon: ClipboardList },
  { href: '/admin/courses', label: 'Courses', icon: BookOpen },
];

function isNavActive(pathname: string, href: string) {
  if (href === '/admin') return pathname === '/admin';
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname() || '';
  const isLoginRoute = pathname === '/admin/login';
  const [user, setUser] = useState<AdminUser | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // /admin/login isn't a real page — it just redirects to /courses/login.
    // Running the auth check here would try to bounce back to this same
    // route on a 401, which is a no-op, leaving the page stuck "checking"
    // forever instead of letting that redirect happen.
    if (isLoginRoute) return;

    let active = true;
    (async () => {
      const res = await api.get<{ user: AdminUser }>('/api/auth/me');
      if (!active) return;
      if (!res.ok) {
        router.replace('/admin/login');
        return;
      }
      setUser(res.data.user);
      setChecking(false);
    })();
    return () => {
      active = false;
    };
  }, [router, isLoginRoute]);

  if (isLoginRoute) {
    return <>{children}</>;
  }

  async function signOut() {
    await api.post('/api/auth/logout');
    router.replace('/admin/login');
  }

  if (checking || !user) {
    return (
      <div className="lp-light flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const items = NAV_ITEMS.filter((item) => !item.adminOnly || user.role === 'admin');

  return (
    <AdminUserContext.Provider value={user}>
      <div className="lp-light flex min-h-screen">
        <aside className="flex w-64 shrink-0 flex-col border-r border-border bg-white">
          <div className="px-6 py-6">
            <p className="text-lg font-extrabold tracking-tight text-foreground">XpertPPC</p>
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
              Admin panel
            </p>
          </div>

          <nav className="flex-1 space-y-1 px-3">
            {items.map((item) => {
              const active = isNavActive(pathname, item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors',
                    active
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-border p-4">
            <p className="truncate text-sm font-semibold text-foreground">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            <button
              type="button"
              onClick={() => void signOut()}
              className="mt-3 flex w-full items-center gap-2 rounded-xl border border-border px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:border-destructive/40 hover:text-destructive"
            >
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </div>
        </aside>

        <div className="min-w-0 flex-1 overflow-y-auto bg-muted/40">{children}</div>
      </div>
    </AdminUserContext.Provider>
  );
}
