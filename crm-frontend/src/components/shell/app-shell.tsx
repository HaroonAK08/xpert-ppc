'use client';

import { useEffect, useState, useTransition } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  BarChart3,
  Code2,
  Facebook,
  LayoutDashboard,
  ListChecks,
  Loader2,
  LogOut,
  Mail,
  Menu,
  SlidersHorizontal,
  Users,
  Workflow,
  X,
} from 'lucide-react';

import { api } from '@/lib/api';
import type { CurrentUser } from '@/lib/api';
import { BrandLogo } from '@/components/brand-logo';
import { NavProgress } from '@/components/nav-progress';
import { CurrentUserContext } from '@/lib/user-context';
import { cn, initials } from '@/lib/utils';

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  adminOnly?: boolean;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Pipeline',
    items: [
      { href: '/', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/leads', label: 'Leads', icon: ListChecks },
      { href: '/reports', label: 'Reports', icon: BarChart3 },
      { href: '/users', label: 'Users', icon: Users, adminOnly: true },
    ],
  },
  {
    label: 'Outreach',
    items: [
      { href: '/automations', label: 'Automations', icon: Workflow },
      { href: '/sequences', label: 'Sequences', icon: Mail, adminOnly: true },
    ],
  },
  {
    label: 'Setup',
    items: [
      { href: '/properties', label: 'Properties', icon: SlidersHorizontal, adminOnly: true },
      { href: '/meta', label: 'Meta Lead Ads', icon: Facebook, adminOnly: true },
      { href: '/forms', label: 'Form builder', icon: Code2 },
    ],
  },
];

const USER_CACHE_KEY = 'xpertppc-crm-user';

function isNavActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

function readCachedUser(): CurrentUser | null {
  try {
    const raw = sessionStorage.getItem(USER_CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CurrentUser;
  } catch {
    return null;
  }
}

function writeCachedUser(user: CurrentUser | null) {
  try {
    if (!user) sessionStorage.removeItem(USER_CACHE_KEY);
    else sessionStorage.setItem(USER_CACHE_KEY, JSON.stringify(user));
  } catch {
    /* ignore quota / private mode */
  }
}

function Sidebar({
  user,
  pathname,
  pendingHref,
  onNavigate,
  onSignOut,
}: {
  user: CurrentUser;
  pathname: string;
  pendingHref: string | null;
  onNavigate: (href: string) => void;
  onSignOut: () => void;
}) {
  const groups = NAV_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => !item.adminOnly || user.role === 'admin'),
  })).filter((group) => group.items.length > 0);

  const highlight = pendingHref || pathname;

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-sidebar text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_at_top,rgba(29,111,242,0.28),transparent_70%)]" />

      <div className="relative px-5 pb-2 pt-6">
        <BrandLogo size={40} dark href="/" />
      </div>

      <nav className="relative mt-4 flex-1 space-y-6 overflow-y-auto px-3 pb-4">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="mb-1.5 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/35">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = isNavActive(highlight, item.href);
                const Icon = item.icon;
                return (
                  <button
                    key={item.href}
                    type="button"
                    onClick={() => onNavigate(item.href)}
                    onMouseEnter={() => {
                      /* prefetch is handled in shell; hover keeps intent warm */
                    }}
                    className={cn(
                      'relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors',
                      active
                        ? 'bg-brand/20 text-white'
                        : 'text-white/60 hover:bg-white/5 hover:text-white'
                    )}
                  >
                    {active ? (
                      <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-brand" />
                    ) : null}
                    <Icon className={cn('h-4 w-4 shrink-0', active && 'text-brand')} />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="relative border-t border-white/10 p-3">
        {user.role === 'client' ? (
          <p className="mb-2 rounded-lg bg-white/5 px-2.5 py-1.5 text-[11px] font-medium text-white/55">
            Company workspace — forms &amp; leads stay in your field
          </p>
        ) : null}
        <div className="flex items-center gap-3 rounded-xl px-2 py-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand/25 text-xs font-semibold text-white ring-1 ring-brand/40">
            {initials(user.name)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{user.name}</p>
            <p className="truncate text-xs text-white/45">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={onSignOut}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white/50 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname() || '';
  const isLoginRoute = pathname === '/login';
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [checking, setChecking] = useState(true);
  const [navOpen, setNavOpen] = useState(false);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (isLoginRoute) {
      setChecking(false);
      return;
    }

    const cached = readCachedUser();
    if (cached) {
      setUser(cached);
      setChecking(false);
    }

    let active = true;
    (async () => {
      const res = await api.get<{ user: CurrentUser }>('/api/auth/me');
      if (!active) return;
      if (!res.ok) {
        writeCachedUser(null);
        setUser(null);
        router.replace('/login');
        return;
      }
      writeCachedUser(res.data.user);
      setUser(res.data.user);
      setChecking(false);
    })();
    return () => {
      active = false;
    };
  }, [router, isLoginRoute]);

  // Warm every reachable route once the user is known.
  useEffect(() => {
    if (!user) return;
    for (const group of NAV_GROUPS) {
      for (const item of group.items) {
        if (item.adminOnly && user.role !== 'admin') continue;
        router.prefetch(item.href);
      }
    }
  }, [router, user]);

  useEffect(() => {
    setPendingHref(null);
    setNavOpen(false);
  }, [pathname]);

  function navigate(href: string) {
    if (href === pathname) {
      setNavOpen(false);
      return;
    }
    setPendingHref(href);
    setNavOpen(false);
    startTransition(() => {
      router.push(href);
    });
  }

  if (isLoginRoute) {
    return <>{children}</>;
  }

  async function signOut() {
    writeCachedUser(null);
    await api.post('/api/auth/logout');
    router.replace('/login');
  }

  if ((checking && !user) || !user) {
    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center gap-4 overflow-hidden bg-sidebar">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(29,111,242,0.28),transparent_55%)]" />
        <BrandLogo size={56} showWordmark={false} href={null} />
        <Loader2 className="relative h-4 w-4 animate-spin text-brand" />
      </div>
    );
  }

  return (
    <CurrentUserContext.Provider value={user}>
      <NavProgress active={isPending || pendingHref !== null} />
      <div className="flex min-h-screen bg-transparent">
        <aside className="sticky top-0 hidden h-screen w-[248px] shrink-0 lg:block">
          <Sidebar
            user={user}
            pathname={pathname}
            pendingHref={pendingHref}
            onNavigate={navigate}
            onSignOut={() => void signOut()}
          />
        </aside>

        {navOpen ? (
          <div className="fixed inset-0 z-40 lg:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-ink/50"
              aria-label="Close menu"
              onClick={() => setNavOpen(false)}
            />
            <aside className="relative h-full w-[248px] shadow-pop">
              <button
                type="button"
                onClick={() => setNavOpen(false)}
                className="absolute right-3 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white"
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </button>
              <Sidebar
                user={user}
                pathname={pathname}
                pendingHref={pendingHref}
                onNavigate={navigate}
                onSignOut={() => void signOut()}
              />
            </aside>
          </div>
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border/80 bg-canvas/85 px-4 py-3 backdrop-blur lg:hidden">
            <button
              type="button"
              onClick={() => setNavOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-ink shadow-sm"
              aria-label="Open menu"
            >
              <Menu className="h-4 w-4" />
            </button>
            <BrandLogo size={28} href="/" />
          </header>
          <div
            className={cn(
              'min-w-0 flex-1 transition-opacity duration-150',
              isPending || pendingHref ? 'opacity-70' : 'opacity-100'
            )}
          >
            {children}
          </div>
        </div>
      </div>
    </CurrentUserContext.Provider>
  );
}
