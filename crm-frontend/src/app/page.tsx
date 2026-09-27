'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BadgeCheck,
  CalendarClock,
  Flame,
  Loader2,
  Phone,
  Sparkles,
  Users,
  type LucideIcon,
} from 'lucide-react';

import { api } from '@/lib/api';
import { StatusBadge } from '@/components/status-badge';
import { PageHeader } from '@/components/ui/page-header';
import { useCurrentUser } from '@/lib/user-context';
import { initials } from '@/lib/utils';
import type { DashboardPayload } from '@shared/crm/types';

const STAT_CARDS: Array<{
  key: keyof DashboardPayload['stats'];
  label: string;
  icon: LucideIcon;
  chip: string;
}> = [
  { key: 'total', label: 'Total leads', icon: Users, chip: 'bg-ink text-white' },
  { key: 'new', label: 'New', icon: Sparkles, chip: 'bg-sky-100 text-sky-700' },
  { key: 'contacted', label: 'Contacted', icon: Phone, chip: 'bg-indigo-100 text-indigo-700' },
  { key: 'interested', label: 'Interested', icon: Flame, chip: 'bg-amber-100 text-amber-800' },
  { key: 'followUpsDue', label: 'Follow-ups due', icon: CalendarClock, chip: 'bg-orange-100 text-orange-800' },
  { key: 'converted', label: 'Converted', icon: BadgeCheck, chip: 'bg-emerald-100 text-emerald-700' },
];

export default function DashboardPage() {
  const user = useCurrentUser();
  const [data, setData] = useState<DashboardPayload | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      const res = await api.get<DashboardPayload>('/api/v1/dashboard');
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setData(res.data);
    })();
  }, []);

  if (error) {
    return <div className="page text-sm font-medium text-red-600">{error}</div>;
  }

  if (!data) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-brand" />
      </div>
    );
  }

  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="page">
      <PageHeader
        title={user.role === 'client' ? `Welcome back, ${user.name.split(' ')[0]}` : 'Dashboard'}
        description={
          user.role === 'client'
            ? 'Here is how your leads are moving through the pipeline.'
            : `${today} · pipeline health across every lead source.`
        }
      />

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-6">
        {STAT_CARDS.map((card) => {
          const Icon = card.icon;
          const value = data.stats[card.key] ?? 0;
          return (
            <div key={card.key} className="panel p-4">
              <div className={`mb-3 flex h-8 w-8 items-center justify-center rounded-lg ${card.chip}`}>
                <Icon className="h-4 w-4" />
              </div>
              <p className="text-2xl font-semibold tracking-tight text-ink tabular-nums">{value}</p>
              <p className="mt-1 text-xs font-medium text-muted">{card.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="panel p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ink">Recent leads</h2>
            <Link href="/leads" className="text-xs font-semibold text-brand hover:underline">
              View all
            </Link>
          </div>
          <ul className="divide-y divide-border">
            {data.recentLeads.map((lead) => (
              <li key={lead.id}>
                <Link href={`/leads/${lead.id}`} className="-mx-2 flex items-center gap-3 rounded-xl px-2 py-3 hover:bg-canvas">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-canvas text-xs font-semibold text-ink">
                    {initials(lead.name)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink">{lead.name}</p>
                    <p className="truncate text-xs text-muted">{lead.email || lead.phone || 'No contact'}</p>
                  </div>
                  <StatusBadge status={lead.status} />
                </Link>
              </li>
            ))}
            {data.recentLeads.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted">No leads yet. New inquiries will show up here.</p>
            ) : null}
          </ul>
        </section>

        <section className="panel p-5">
          <h2 className="mb-4 text-sm font-semibold text-ink">Follow-ups due today</h2>
          <ul className="divide-y divide-border">
            {data.followUpsToday.map((lead) => (
              <li key={lead.id}>
                <Link href={`/leads/${lead.id}`} className="-mx-2 flex items-center gap-3 rounded-xl px-2 py-3 hover:bg-canvas">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-700">
                    <CalendarClock className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-ink">{lead.name}</p>
                    <p className="truncate text-xs text-muted">{lead.email || lead.phone || 'No contact'}</p>
                  </div>
                  <span className="shrink-0 text-xs font-medium tabular-nums text-muted">
                    {lead.followUpAt
                      ? new Date(lead.followUpAt).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
                      : ''}
                  </span>
                </Link>
              </li>
            ))}
            {data.followUpsToday.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted">Nothing due today. The queue is clear.</p>
            ) : null}
          </ul>
        </section>
      </div>
    </div>
  );
}
