'use client';

import { useEffect, useState } from 'react';
import { Check, Loader2, RefreshCw, X } from 'lucide-react';
import { adminApi } from '@/lib/admin-api';
import { parseApplicationInterest } from '@/lib/parse-application';
import { Button } from '@/components/ui/button';

type Applicant = {
  id: string;
  name: string;
  email: string;
  country: string;
  interest: string;
  couponCode?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
};

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat('en-PK', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export default function AdminApplicationsPage() {
  const [items, setItems] = useState<Applicant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);
  const [filter, setFilter] = useState<'pending' | 'all'>('pending');

  async function load() {
    setError('');
    const res = await adminApi.get<{ items: Applicant[] }>('/api/admin/portal/students');
    if (!res.ok) {
      setError(res.error);
      setLoading(false);
      return;
    }
    setItems(res.data.items);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  async function decide(id: string, status: 'approved' | 'rejected') {
    setBusyId(id);
    setError('');
    const res = await adminApi.patch(`/api/admin/portal/students/${id}`, { status });
    setBusyId(null);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setItems((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
  }

  const pending = items.filter((s) => s.status === 'pending');
  const visible = filter === 'pending' ? pending : items;

  return (
    <>
      <header className="flex h-[72px] items-center justify-between gap-4 border-b border-border/70 bg-white px-5 sm:px-8">
        <div>
          <h1 className="text-lg font-extrabold tracking-tight text-ink">Applications</h1>
          <p className="text-xs text-muted">
            {pending.length} waiting for verification
            {items.length ? ` · ${items.length} total` : ''}
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setLoading(true);
            void load();
          }}
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-border px-3 text-xs font-bold text-ink hover:bg-[#f8fafc]"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </header>

      <main className="px-5 py-8 sm:px-8">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setFilter('pending')}
            className={`rounded-full px-3 py-1.5 text-xs font-bold ${
              filter === 'pending' ? 'bg-brand text-white' : 'bg-white text-muted ring-1 ring-border'
            }`}
          >
            Waiting ({pending.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`rounded-full px-3 py-1.5 text-xs font-bold ${
              filter === 'all' ? 'bg-brand text-white' : 'bg-white text-muted ring-1 ring-border'
            }`}
          >
            All ({items.length})
          </button>
        </div>

        <p className="mt-4 max-w-2xl text-sm text-muted">
          New signups stay pending until you verify payment (or review coupon applications). After you
          approve, they can sign in with the password they chose.
        </p>

        {error ? (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
            {error}
          </p>
        ) : null}

        {loading ? (
          <div className="mt-16 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-brand" />
          </div>
        ) : visible.length === 0 ? (
          <div className="mt-10 panel p-10 text-center">
            <p className="text-sm font-bold text-ink">
              {filter === 'pending' ? 'No pending applications' : 'No applications yet'}
            </p>
            <p className="mt-1 text-xs text-muted">New student signups will show up here for review.</p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {visible.map((applicant) => {
              const details = parseApplicationInterest(applicant.interest);
              const busy = busyId === applicant.id;
              return (
                <article key={applicant.id} className="panel overflow-hidden">
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/70 px-5 py-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-base font-extrabold text-ink">{applicant.name}</h2>
                        <StatusBadge status={applicant.status} />
                        {applicant.couponCode ? (
                          <span className="rounded-full bg-[#eef5ff] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand">
                            Coupon {applicant.couponCode}
                          </span>
                        ) : null}
                      </div>
                      <p className="mt-1 text-sm text-muted">
                        {applicant.email}
                        {applicant.country ? ` · ${applicant.country}` : ''}
                      </p>
                      <p className="mt-0.5 text-[11px] text-muted">Applied {formatDate(applicant.createdAt)}</p>
                    </div>
                    {applicant.status === 'pending' ? (
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          disabled={busy}
                          onClick={() => void decide(applicant.id, 'approved')}
                          className="h-10 bg-emerald-600 hover:bg-emerald-600/90"
                        >
                          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                          Approve
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          disabled={busy}
                          onClick={() => void decide(applicant.id, 'rejected')}
                          className="h-10"
                        >
                          <X className="h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    ) : null}
                  </div>

                  <div className="grid gap-5 px-5 py-5 lg:grid-cols-[1.2fr_0.8fr]">
                    <dl className="grid gap-3 sm:grid-cols-2">
                      <Detail label="Course" value={details.course || '—'} />
                      <Detail label="Experience" value={details.experience || '—'} />
                      <Detail label="WhatsApp" value={details.whatsapp || '—'} />
                      <Detail label="Timezone" value={details.timezone || '—'} />
                      <Detail label="Registration fee" value={details.fee || '—'} />
                      <Detail
                        label="Coupon"
                        value={applicant.couponCode || details.coupon || '—'}
                      />
                      <Detail label="Transaction ID" value={details.transactionId || '—'} />
                    </dl>

                    <div>
                      <p className="text-xs font-semibold text-muted">Payment receipt</p>
                      {applicant.couponCode || details.coupon ? (
                        <p className="mt-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-8 text-center text-xs font-semibold text-emerald-700">
                          Fee waived with coupon {applicant.couponCode || details.coupon}. No receipt required.
                        </p>
                      ) : details.receiptUrl ? (
                        <a
                          href={details.receiptUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 block overflow-hidden rounded-xl border border-border bg-[#f8fafc]"
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={details.receiptUrl}
                            alt={`Receipt for ${applicant.name}`}
                            className="max-h-56 w-full object-contain"
                          />
                          <span className="block px-3 py-2 text-center text-[11px] font-semibold text-brand">
                            Open full image
                          </span>
                        </a>
                      ) : (
                        <p className="mt-2 rounded-xl border border-dashed border-border px-3 py-8 text-center text-xs text-muted">
                          No receipt image in this application.
                        </p>
                      )}
                    </div>
                  </div>

                  {!details.course && applicant.interest ? (
                    <div className="border-t border-border/70 px-5 py-4">
                      <p className="text-xs font-semibold text-muted">Application notes</p>
                      <p className="mt-1 whitespace-pre-wrap text-sm text-ink/90">{applicant.interest}</p>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold text-muted">{label}</dt>
      <dd className="mt-0.5 text-sm font-bold text-ink">{value}</dd>
    </div>
  );
}

function StatusBadge({ status }: { status: Applicant['status'] }) {
  const styles =
    status === 'pending'
      ? 'bg-amber-50 text-amber-700'
      : status === 'approved'
        ? 'bg-emerald-50 text-emerald-700'
        : 'bg-red-50 text-red-700';
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${styles}`}>
      {status}
    </span>
  );
}
