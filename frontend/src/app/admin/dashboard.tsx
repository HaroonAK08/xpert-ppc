'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, LogOut, RefreshCw, Trash2 } from 'lucide-react';

import { Select } from '@/components/ui/input';
import { api, type AdminUser, type Lead, type LeadsResponse } from '@/lib/api';
import { cn } from '@/lib/utils';

const STATUSES = ['new', 'contacted', 'qualified', 'won', 'lost', 'spam'] as const;

const statusStyles: Record<string, string> = {
  new: 'bg-primary/15 text-primary',
  contacted: 'bg-accent/15 text-accent',
  qualified: 'bg-success/15 text-success',
  won: 'bg-success/25 text-success',
  lost: 'bg-destructive/15 text-destructive',
  spam: 'bg-muted text-muted-foreground',
};

export function AdminDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [data, setData] = useState<LeadsResponse | null>(null);
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(
    async (status: string) => {
      setLoading(true);
      setError('');

      const me = await api.get<{ user: AdminUser }>('/api/auth/me');
      if (!me.ok) {
        router.replace('/admin/login');
        return;
      }
      setUser(me.data.user);

      const query = status === 'all' ? '' : `?status=${encodeURIComponent(status)}`;
      const res = await api.get<LeadsResponse>(`/api/leads${query}`);

      if (!res.ok) {
        setError(res.error);
        setLoading(false);
        return;
      }

      setData(res.data);
      setLoading(false);
    },
    [router]
  );

  useEffect(() => {
    void load(filter);
  }, [load, filter]);

  async function updateStatus(id: string, status: string) {
    await api.patch(`/api/leads/${id}`, { status });
    void load(filter);
  }

  async function remove(id: string) {
    if (!confirm('Delete this lead permanently? This cannot be undone.')) return;
    await api.delete(`/api/leads/${id}`);
    void load(filter);
  }

  async function logout() {
    await api.post('/api/auth/logout');
    router.replace('/admin/login');
  }

  if (loading && !data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const counts = data?.counts ?? {};
  const statCards = [
    { label: 'Total leads', value: data?.total ?? 0 },
    { label: 'New', value: counts.new ?? 0 },
    { label: 'Contacted', value: counts.contacted ?? 0 },
    { label: 'Qualified', value: counts.qualified ?? 0 },
    { label: 'Won', value: counts.won ?? 0 },
  ];

  return (
    <section className="bg-background py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">Leads</h1>
            {user ? (
              <p className="mt-1 text-sm text-muted-foreground">Signed in as {user.email}</p>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/admin/courses"
              className="inline-flex h-10 items-center justify-center rounded-xl border border-border px-4 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
            >
              Courses
            </Link>
            <button
              type="button"
              onClick={() => void load(filter)}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
            >
              <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} /> Refresh
            </button>
            <button
              type="button"
              onClick={logout}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border px-4 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
            >
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>

        {error ? (
          <p className="mb-6 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <dl className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {statCards.map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-card p-5">
              <dd className="text-2xl font-extrabold text-primary">{s.value}</dd>
              <dt className="mt-1 text-[10px] font-bold uppercase tracking-wide text-muted-foreground sm:text-[11px] sm:tracking-widest">
                {s.label}
              </dt>
            </div>
          ))}
        </dl>

        <div className="mb-6 flex flex-wrap items-center gap-3">
          <label htmlFor="status-filter" className="text-sm font-semibold text-muted-foreground">
            Filter
          </label>
          <Select
            id="status-filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full sm:w-48"
          >
            <option value="all">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
          <span className="text-sm text-muted-foreground">{data?.items.length ?? 0} shown</span>
        </div>

        {!data?.items.length ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center">
            <p className="text-sm text-muted-foreground">No leads match this filter yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-card">
                <tr>
                  {['Received', 'Name', 'Contact', 'Platform', 'Source', 'Status', ''].map((h) => (
                    <th
                      key={h}
                      scope="col"
                      className="px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-muted-foreground"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.items.map((l: Lead) => (
                  <tr key={l.id} className="border-t border-border align-top">
                    <td className="whitespace-nowrap px-4 py-4 text-xs text-muted-foreground">
                      {new Date(l.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => setExpanded(expanded === l.id ? null : l.id)}
                        className="text-left font-semibold text-foreground hover:text-primary"
                      >
                        {l.name}
                      </button>
                      {expanded === l.id && l.message ? (
                        <p className="mt-2 max-w-md whitespace-pre-wrap text-xs text-muted-foreground">
                          {l.message}
                        </p>
                      ) : null}
                      {expanded === l.id && l.sourcePath ? (
                        <p className="mt-2 text-xs text-muted-foreground">From: {l.sourcePath}</p>
                      ) : null}
                    </td>
                    <td className="px-4 py-4 text-xs">
                      <a
                        href={`mailto:${l.email}`}
                        className="block text-muted-foreground hover:text-primary"
                      >
                        {l.email}
                      </a>
                      {l.phone ? (
                        <a
                          href={`tel:${l.phone}`}
                          className="block text-muted-foreground hover:text-primary"
                        >
                          {l.phone}
                        </a>
                      ) : null}
                    </td>
                    <td className="px-4 py-4 text-xs text-muted-foreground">{l.platform}</td>
                    <td className="px-4 py-4 text-xs text-muted-foreground">{l.source}</td>
                    <td className="px-4 py-4">
                      <span
                        className={cn(
                          'mb-2 inline-block rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider',
                          statusStyles[l.status] ?? statusStyles.new
                        )}
                      >
                        {l.status}
                      </span>
                      <Select
                        aria-label={`Change status for ${l.name}`}
                        value={l.status}
                        onChange={(e) => void updateStatus(l.id, e.target.value)}
                        className="w-36"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </Select>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => void remove(l.id)}
                        aria-label={`Delete lead from ${l.name}`}
                        className="text-muted-foreground transition-colors hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
