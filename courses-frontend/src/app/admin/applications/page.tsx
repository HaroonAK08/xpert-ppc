'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Check, Loader2, RefreshCw, X } from 'lucide-react';
import { adminApi } from '@/lib/admin-api';
import { parseApplicationInterest } from '@/lib/parse-application';
import { Button } from '@/components/ui/button';
import { Input, Label } from '@/components/ui/input';

type Applicant = { id: string; name: string; email: string; country: string; interest: string; couponCode?: string; status: 'pending' | 'approved' | 'rejected'; createdAt: string };
type ApplicationList = { items: Applicant[]; page?: number; pageSize?: number; total?: number };
function formatDate(value: string) { try { return new Intl.DateTimeFormat('en-PK', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value)); } catch { return value; } }

export default function AdminApplicationsPage() {
  const [items, setItems] = useState<Applicant[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState('');
  const [filter, setFilter] = useState<'pending' | 'all'>('pending');
  const decisionLock = useRef(false);

  useEffect(() => {
    let active = true;
    setLoading(true); setError('');
    const query = new URLSearchParams({ page: String(page), search });
    if (filter === 'pending') query.set('status', 'pending');
    adminApi.get<ApplicationList>(`/api/admin/portal/students?${query}`).then((result) => {
      if (!active) return;
      if (!result.ok) setError(result.error);
      else {
        const nextTotal = result.data.total ?? result.data.items.length;
        const nextSize = result.data.pageSize ?? Math.max(result.data.items.length, 1);
        if (!result.data.items.length && nextTotal > 0 && page > 1) setPage(Math.ceil(nextTotal / nextSize));
        else { setItems(result.data.items); setTotal(nextTotal); setPageSize(nextSize); }
      }
      setLoading(false);
    });
    return () => { active = false; };
  }, [page, search, filter, refresh]);

  async function decide(id: string, status: 'approved' | 'rejected') {
    if (decisionLock.current) return;
    decisionLock.current = true;
    setBusyId(id); setError('');
    const result = await adminApi.patch(`/api/admin/portal/students/${encodeURIComponent(id)}`, { status });
    decisionLock.current = false;
    setBusyId('');
    if (!result.ok) { setError(result.error); return; }
    setRefresh((value) => value + 1);
  }
  function submitSearch(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setPage(1); setSearch(searchInput.trim()); setRefresh((value) => value + 1); }
  const pages = Math.max(1, Math.ceil(total / pageSize));
  return <>
    <header className="flex min-h-[72px] flex-wrap items-center justify-between gap-4 border-b border-border/70 bg-white px-5 py-4 sm:px-8">
      <div><h1 className="text-lg font-extrabold text-ink">Applications</h1><p className="text-xs text-muted">{total} matching applications</p></div>
      <button type="button" onClick={() => setRefresh((value) => value + 1)} className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-border px-3 text-xs font-bold text-ink"><RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />Refresh</button>
    </header>
    <main className="px-5 py-8 sm:px-8">
      <form onSubmit={submitSearch} className="flex flex-wrap items-end gap-3"><div className="min-w-0 flex-1 space-y-2"><Label htmlFor="application-search">Search applications</Label><Input id="application-search" type="search" maxLength={160} placeholder="Name or email address" value={searchInput} onChange={(event) => setSearchInput(event.target.value)} /></div><Button type="submit" variant="outline" className="min-h-11" disabled={loading}>Search</Button></form>
      <div className="mt-4 flex flex-wrap gap-2"><button type="button" className={`min-h-11 rounded-full px-4 text-xs font-bold ${filter === 'pending' ? 'bg-brand text-white' : 'bg-white text-muted ring-1 ring-border'}`} onClick={() => { setPage(1); setFilter('pending'); }}>Waiting</button><button type="button" className={`min-h-11 rounded-full px-4 text-xs font-bold ${filter === 'all' ? 'bg-brand text-white' : 'bg-white text-muted ring-1 ring-border'}`} onClick={() => { setPage(1); setFilter('all'); }}>All applications</button></div>
      <p className="mt-4 max-w-2xl text-sm text-muted">New signups stay pending until payment or coupon review. Approving lets them sign in with their chosen password. Invitations are managed separately.</p>
      {error && <p role="alert" className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}
      {loading ? <div role="status" className="mt-16 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-brand" /></div> : !items.length ? <div className="panel mt-10 p-10 text-center"><p className="font-bold text-ink">No applications found</p><p className="mt-1 text-xs text-muted">Try another search or filter.</p></div> : <div className="mt-6 space-y-4">{items.map((applicant) => {
        const details = parseApplicationInterest(applicant.interest); const busy = busyId === applicant.id;
        return <article key={applicant.id} className="panel overflow-hidden"><div className="flex flex-wrap items-start justify-between gap-3 border-b border-border/70 px-5 py-4"><div className="min-w-0 max-w-full"><div className="flex flex-wrap items-center gap-2"><h2 className="text-base font-extrabold text-ink">{applicant.name}</h2><StatusBadge status={applicant.status} />{applicant.couponCode && <span className="rounded-full bg-[#eef5ff] px-2 py-0.5 text-[10px] font-bold uppercase text-brand">Coupon {applicant.couponCode}</span>}</div><p className="mt-1 text-sm text-muted [overflow-wrap:anywhere]">{applicant.email}{applicant.country ? ` · ${applicant.country}` : ''}</p><p className="mt-0.5 text-[11px] text-muted">Applied {formatDate(applicant.createdAt)}</p></div>{applicant.status === 'pending' && <div className="flex flex-wrap gap-2"><Button type="button" disabled={!!busyId} onClick={() => void decide(applicant.id, 'approved')} className="min-h-11 bg-emerald-600 hover:bg-emerald-600/90">{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}Approve</Button><Button type="button" variant="outline" disabled={!!busyId} onClick={() => void decide(applicant.id, 'rejected')} className="min-h-11"><X className="h-4 w-4" />Reject</Button></div>}</div>
          <div className="grid gap-5 px-5 py-5 lg:grid-cols-[1.2fr_0.8fr]"><dl className="grid gap-3 sm:grid-cols-2"><Detail label="Course" value={details.course || '—'} /><Detail label="Experience" value={details.experience || '—'} /><Detail label="WhatsApp" value={details.whatsapp || '—'} /><Detail label="Timezone" value={details.timezone || '—'} /><Detail label="Registration fee" value={details.fee || '—'} /><Detail label="Coupon" value={applicant.couponCode || details.coupon || '—'} /><Detail label="Transaction ID" value={details.transactionId || '—'} /></dl><div><p className="text-xs font-semibold text-muted">Payment receipt</p>{applicant.couponCode || details.coupon ? <p className="mt-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-8 text-center text-xs font-semibold text-emerald-700">Fee waived with coupon {applicant.couponCode || details.coupon}. No receipt required.</p> : details.receiptUrl ? <a href={details.receiptUrl} target="_blank" rel="noopener noreferrer" className="mt-2 block overflow-hidden rounded-xl border border-border bg-[#f8fafc]"><img src={details.receiptUrl} alt={`Receipt for ${applicant.name}`} className="max-h-56 w-full object-contain" /><span className="block px-3 py-2 text-center text-[11px] font-semibold text-brand">Open full image</span></a> : <p className="mt-2 rounded-xl border border-dashed border-border px-3 py-8 text-center text-xs text-muted">No receipt image in this application.</p>}</div></div>
          {!details.course && applicant.interest && <div className="border-t border-border/70 px-5 py-4"><p className="text-xs font-semibold text-muted">Application notes</p><p className="mt-1 whitespace-pre-wrap text-sm text-ink/90">{applicant.interest}</p></div>}
        </article>;
      })}</div>}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-muted">Page {page} of {pages}</p><div className="flex gap-2"><Button type="button" variant="outline" className="min-h-11" disabled={page <= 1 || loading} onClick={() => setPage((value) => value - 1)}>Previous</Button><Button type="button" variant="outline" className="min-h-11" disabled={page >= pages || loading} onClick={() => setPage((value) => value + 1)}>Next</Button></div></div>
    </main>
  </>;
}
function Detail({ label, value }: { label: string; value: string }) { return <div><dt className="text-xs font-semibold text-muted">{label}</dt><dd className="mt-0.5 text-sm font-bold text-ink [overflow-wrap:anywhere]">{value}</dd></div>; }
function StatusBadge({ status }: { status: Applicant['status'] }) { const styles = status === 'pending' ? 'bg-amber-50 text-amber-700' : status === 'approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'; return <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${styles}`}>{status}</span>; }
