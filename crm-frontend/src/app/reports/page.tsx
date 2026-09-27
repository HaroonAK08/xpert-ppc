'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

import { api } from '@/lib/api';
import { BarChart } from '@/components/charts/bar-chart';
import { LineChart } from '@/components/charts/line-chart';
import { PageHeader } from '@/components/ui/page-header';

type Overview = {
  totalLeads: number;
  conversionRate: number;
  avgTimeToContactHours: number | null;
  funnel: { status: string; label: string; count: number }[];
  bySource: { source: string; count: number }[];
  byForm: { formId: string; name: string; count: number }[];
  leadsOverTime: { date: string; count: number }[];
  teamPerformance: { userId: string; name: string; total: number; converted: number }[];
};

export default function ReportsPage() {
  const [data, setData] = useState<Overview | null>(null);
  const [error, setError] = useState('');
  const [days, setDays] = useState(30);

  useEffect(() => {
    setData(null);
    api.get<Overview>(`/api/v1/reports/overview?days=${days}`).then((res) => {
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setData(res.data);
    });
  }, [days]);

  if (error) return <div className="page text-sm font-medium text-red-600">{error}</div>;

  if (!data) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-brand" />
      </div>
    );
  }

  return (
    <div className="page">
      <PageHeader title="Reports" description="Pipeline performance across every lead.">
        <div className="flex gap-1 rounded-xl border border-border bg-surface p-1 shadow-sm">
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDays(d)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                days === d ? 'bg-ink text-white' : 'text-muted hover:text-ink'
              }`}
            >
              {d} days
            </button>
          ))}
        </div>
      </PageHeader>

      <div className="mb-5 grid gap-3 sm:grid-cols-3">
        <div className="panel p-5">
          <p className="text-xs font-medium text-muted">Total leads</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-ink tabular-nums">{data.totalLeads}</p>
        </div>
        <div className="panel p-5">
          <p className="text-xs font-medium text-muted">Conversion rate</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-ink tabular-nums">{data.conversionRate}%</p>
        </div>
        <div className="panel p-5">
          <p className="text-xs font-medium text-muted">Avg. time to first contact</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-ink tabular-nums">
            {data.avgTimeToContactHours !== null ? `${data.avgTimeToContactHours}h` : '—'}
          </p>
        </div>
      </div>

      <div className="panel mb-5 p-5">
        <h2 className="mb-4 text-sm font-semibold text-ink">Leads over time</h2>
        <LineChart data={data.leadsOverTime} color="#1d6ff2" />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="panel p-5">
          <h2 className="mb-4 text-sm font-semibold text-ink">Pipeline by stage</h2>
          <BarChart data={data.funnel.map((f) => ({ label: f.label, value: f.count }))} color="#0b1f4d" />
        </section>

        <section className="panel p-5">
          <h2 className="mb-4 text-sm font-semibold text-ink">Leads by source</h2>
          <BarChart data={data.bySource.map((s) => ({ label: s.source, value: s.count }))} color="#1d6ff2" />
        </section>

        {data.byForm.length > 0 ? (
          <section className="panel p-5">
            <h2 className="mb-4 text-sm font-semibold text-ink">Leads by form</h2>
            <BarChart data={data.byForm.map((f) => ({ label: f.name, value: f.count }))} color="#1d6ff2" />
          </section>
        ) : null}
      </div>

      {data.teamPerformance.length > 0 ? (
        <section className="panel mt-5 p-5">
          <h2 className="mb-4 text-sm font-semibold text-ink">Team performance</h2>
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border text-xs font-bold uppercase tracking-wide text-muted">
              <tr>
                <th className="pb-2">Team member</th>
                <th className="pb-2 text-right">Total leads</th>
                <th className="pb-2 text-right">Converted</th>
                <th className="pb-2 text-right">Rate</th>
              </tr>
            </thead>
            <tbody>
              {data.teamPerformance.map((row) => (
                <tr key={row.userId} className="border-b border-border last:border-0">
                  <td className="py-2 font-medium text-ink">{row.name}</td>
                  <td className="py-2 text-right tabular-nums text-ink">{row.total}</td>
                  <td className="py-2 text-right tabular-nums text-ink">{row.converted}</td>
                  <td className="py-2 text-right tabular-nums text-muted">
                    {row.total ? Math.round((row.converted / row.total) * 100) : 0}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : null}
    </div>
  );
}
