'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Loader2, Megaphone, RefreshCw } from 'lucide-react';
import { api } from '@/lib/api';
import { announcementDate, type AnnouncementList } from '@/lib/announcements';
import { DashboardPageHeader } from '@/components/dashboard/page-header';
import { Button } from '@/components/ui/button';

export default function StudentAnnouncementsPage() {
  const [data, setData] = useState<AnnouncementList | null>(null);
  const [page, setPage] = useState(1);
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const scrolledMessage = useRef('');

  useEffect(() => {
    let active = true;
    let pending = false;
    async function load() {
      if (pending || document.visibilityState === 'hidden') return;
      pending = true;
      const res = await api.get<AnnouncementList>(`/api/student/announcements?page=${page}`);
      pending = false;
      if (!active) return;
      if (!res.ok) setError(res.error);
      else {
        setData(res.data);
        setError('');
        if (!res.data.items.length && page > 1) setPage(Math.max(1, Math.ceil(res.data.total / res.data.pageSize)));
      }
      setLoading(false);
    }
    setLoading(true);
    void load();
    const timer = window.setInterval(() => { void load(); }, 60_000);
    window.addEventListener('focus', load);
    document.addEventListener('visibilitychange', load);
    return () => {
      active = false;
      window.clearInterval(timer);
      window.removeEventListener('focus', load);
      document.removeEventListener('visibilitychange', load);
    };
  }, [page, refresh]);

  useEffect(() => {
    if (!loading && data) {
      const id = window.location.hash.slice(1);
      if (id && scrolledMessage.current !== id) {
        const message = document.getElementById(id);
        if (message) {
          message.scrollIntoView({ block: 'start' });
          scrolledMessage.current = id;
        }
      }
    }
  }, [loading, data]);

  const pages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;
  return (
    <>
      <DashboardPageHeader title="Announcements" />
      <main className="space-y-6 px-5 py-8 sm:px-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div><h2 className="text-2xl font-extrabold tracking-tight text-ink">Academy announcements</h2><p className="mt-1 text-sm text-muted">Messages and updates from your academy, newest first.</p></div>
          <Button type="button" variant="outline" disabled={loading} onClick={() => setRefresh((value) => value + 1)}><RefreshCw className="h-4 w-4" />Refresh</Button>
        </div>
        {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
        {loading ? <div role="status" className="flex items-center justify-center gap-2 py-12 text-sm text-muted"><Loader2 className="h-5 w-5 animate-spin" />Loading messages…</div> : !error && data && (
          <>
            {data.items.length === 0 ? <div className="panel p-10 text-center"><Megaphone className="mx-auto h-8 w-8 text-brand" /><h3 className="mt-4 font-bold text-ink">No announcements yet</h3><p className="mt-2 text-sm text-muted">Messages from your academy will appear here.</p></div> : data.items.map((message) => (
              <article key={message.id} id={`message-${message.id}`} className="panel max-w-5xl scroll-mt-5 p-6 sm:p-8">
                <p className="text-xs font-semibold text-muted">Academy message · {announcementDate(message.createdAt)}</p>
                <h3 className="mt-2 break-words text-xl font-extrabold text-ink">{message.title}</h3>
                <p className="mt-4 whitespace-pre-wrap break-words text-sm leading-7 text-ink/85 sm:text-base">{message.body}</p>
              </article>
            ))}
            {pages > 1 && <div className="flex flex-wrap items-center gap-3"><Button variant="outline" type="button" disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>Previous</Button><span className="text-sm text-muted">Page {page} of {pages}</span><Button variant="outline" type="button" disabled={page >= pages} onClick={() => setPage((value) => value + 1)}>Next</Button></div>}
          </>
        )}
        <Link href="/dashboard" className="inline-block text-sm font-semibold text-brand">← Back to dashboard</Link>
      </main>
    </>
  );
}
