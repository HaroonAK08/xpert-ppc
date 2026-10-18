'use client';

import { FormEvent, useEffect, useState } from 'react';
import { Loader2, Plus, RefreshCw, Ticket } from 'lucide-react';
import { adminApi } from '@/lib/admin-api';
import { Button } from '@/components/ui/button';
import { Input, Label } from '@/components/ui/input';
import { AdminPageHeader } from '@/components/admin/page-header';

type Applicant = {
  id: string;
  name: string;
  email: string;
  status: string;
  createdAt: string;
};

type Coupon = {
  id: string;
  code: string;
  active: boolean;
  note: string;
  maxUses: number;
  usedCount: number;
  applicantCount: number;
  applicants: Applicant[];
  createdAt: string;
};

export default function AdminCouponsPage() {
  const [items, setItems] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  async function load() {
    setError('');
    const res = await adminApi.get<{ items: Coupon[] }>('/api/admin/academy/coupons');
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

  async function onCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const code = String(form.get('code') || '').trim();
    const note = String(form.get('note') || '').trim();
    const maxUses = Number(form.get('maxUses') || 0);
    if (!code) {
      setError('Enter a coupon code.');
      return;
    }
    setBusy(true);
    setError('');
    const res = await adminApi.post<{ coupon: Coupon }>('/api/admin/academy/coupons', {
      code,
      note,
      maxUses: Number.isFinite(maxUses) ? maxUses : 0,
      active: true,
    });
    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    e.currentTarget.reset();
    setItems((prev) => [res.data.coupon, ...prev]);
  }

  async function toggleActive(coupon: Coupon) {
    setBusy(true);
    const res = await adminApi.patch<{ coupon: Partial<Coupon> }>(`/api/admin/academy/coupons/${coupon.id}`, {
      active: !coupon.active,
    });
    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setItems((prev) =>
      prev.map((c) => (c.id === coupon.id ? { ...c, active: Boolean(res.data.coupon.active) } : c))
    );
  }

  return (
    <>
      <AdminPageHeader
        title="Coupons"
        subtitle="Create codes that waive the registration fee. Applicants still need approval."
        actions={
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
        }
      />

      <main className="px-5 py-8 sm:px-8">
        <form onSubmit={onCreate} className="panel grid gap-3 p-5 sm:grid-cols-[1fr_1fr_120px_auto]">
          <div>
            <Label htmlFor="code">Coupon code</Label>
            <Input id="code" name="code" placeholder="umer001" className="mt-1.5 uppercase" required />
          </div>
          <div>
            <Label htmlFor="note">Note (optional)</Label>
            <Input id="note" name="note" placeholder="Launch offer" className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="maxUses">Max uses</Label>
            <Input id="maxUses" name="maxUses" type="number" min={0} defaultValue={0} className="mt-1.5" />
            <p className="mt-1 text-[10px] text-muted">0 = unlimited</p>
          </div>
          <div className="flex items-end">
            <Button type="submit" disabled={busy} className="h-11 w-full sm:w-auto">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Create
            </Button>
          </div>
        </form>

        {error ? (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
            {error}
          </p>
        ) : null}

        {loading ? (
          <div className="mt-16 flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-brand" />
          </div>
        ) : items.length === 0 ? (
          <div className="mt-10 panel p-10 text-center">
            <Ticket className="mx-auto h-8 w-8 text-muted" />
            <p className="mt-3 text-sm font-bold text-ink">No coupons yet</p>
            <p className="mt-1 text-xs text-muted">Create a code above to waive registration fees.</p>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {items.map((coupon) => {
              const open = expanded === coupon.id;
              return (
                <article key={coupon.id} className="panel overflow-hidden">
                  <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-base font-extrabold tracking-wide text-ink">{coupon.code}</h2>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                            coupon.active ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {coupon.active ? 'Active' : 'Off'}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-muted">
                        {coupon.applicantCount} applicants · {coupon.usedCount} uses
                        {coupon.maxUses ? ` / ${coupon.maxUses} max` : ' · unlimited'}
                        {coupon.note ? ` · ${coupon.note}` : ''}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="h-10"
                        onClick={() => setExpanded(open ? null : coupon.id)}
                      >
                        {open ? 'Hide applicants' : 'View applicants'}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="h-10"
                        disabled={busy}
                        onClick={() => void toggleActive(coupon)}
                      >
                        {coupon.active ? 'Disable' : 'Enable'}
                      </Button>
                    </div>
                  </div>

                  {open ? (
                    <div className="border-t border-border/70 px-5 py-4">
                      {coupon.applicants.length === 0 ? (
                        <p className="text-sm text-muted">No one has signed up with this coupon yet.</p>
                      ) : (
                        <ul className="space-y-2">
                          {coupon.applicants.map((a) => (
                            <li
                              key={a.id}
                              className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#f8fafc] px-3 py-2.5 text-sm"
                            >
                              <div>
                                <p className="font-bold text-ink">{a.name}</p>
                                <p className="text-xs text-muted">{a.email}</p>
                              </div>
                              <span className="text-[11px] font-bold uppercase text-muted">{a.status}</span>
                            </li>
                          ))}
                        </ul>
                      )}
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
