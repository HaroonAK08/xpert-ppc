'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { Loader2, Megaphone, Send } from 'lucide-react';
import { adminApi } from '@/lib/admin-api';
import { announcementDate, type AnnouncementList, type AnnouncementMessage } from '@/lib/announcements';
import { AdminPageHeader } from '@/components/admin/page-header';
import { Button } from '@/components/ui/button';
import { Input, Label, Textarea } from '@/components/ui/input';

export default function AdminAnnouncementsPage() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [data, setData] = useState<AnnouncementList | null>(null);
  const [page, setPage] = useState(1);
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [busyId, setBusyId] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [weeklyNotice, setWeeklyNotice] = useState<string | null>(null);
  const [savingNotice, setSavingNotice] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    adminApi.get<AnnouncementList>(`/api/admin/academy/announcements?page=${page}`).then((res) => {
      if (!active) return;
      if (!res.ok) setError(res.error);
      else { setData(res.data); setError(''); }
      setLoading(false);
    });
    return () => { active = false; };
  }, [page, refresh]);

  useEffect(() => {
    let active = true;
    adminApi.get<{ settings: { weeklyClassNotice: string } }>('/api/admin/academy/settings').then((res) => {
      if (!active) return;
      if (!res.ok) setError(res.error);
      else setWeeklyNotice(res.data.settings.weeklyClassNotice);
    });
    return () => { active = false; };
  }, []);

  async function publish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError('');
    setStatus('');
    try {
      const res = await adminApi.post('/api/admin/academy/announcements', { title: title.trim(), body: body.trim() });
      if (!res.ok) throw new Error(res.error);
      setTitle('');
      setBody('');
      setPage(1);
      setRefresh((value) => value + 1);
      setStatus('Message published to student Announcements. Open dashboards refresh within one minute.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not publish your message.');
    } finally { setBusy(false); }
  }

  async function setPublished(message: AnnouncementMessage) {
    if (busyId) return;
    setBusyId(message.id);
    setError('');
    setStatus('');
    try {
      const res = await adminApi.patch(`/api/admin/academy/announcements/${message.id}`, { published: !message.published });
      if (!res.ok) throw new Error(res.error);
      setRefresh((value) => value + 1);
      setStatus(message.published ? 'Message archived. It is no longer visible to students.' : 'Message restored to student Announcements.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update the message.');
    } finally { setBusyId(''); }
  }

  async function saveNotice(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (savingNotice || weeklyNotice === null) return;
    setSavingNotice(true);
    setError('');
    setStatus('');
    try {
      const res = await adminApi.patch('/api/admin/academy/settings', { weeklyClassNotice: weeklyNotice.trim() });
      if (!res.ok) throw new Error(res.error);
      setStatus('Weekly class notice saved separately from announcements.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save the weekly notice.');
    } finally { setSavingNotice(false); }
  }

  const pages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;
  return (
    <>
      <AdminPageHeader title="Announcements" subtitle="Write messages for the student Announcements section." actions={<Link href="/admin" className="text-sm font-semibold text-brand">Overview</Link>} />
      <main className="space-y-6 px-5 py-8 sm:px-8">
        <div><h2 className="text-2xl font-extrabold tracking-tight text-ink">Write a new announcement</h2><p className="mt-1 max-w-3xl text-sm text-muted">Each message is a separate post in student Announcements. Earlier messages stay available until you archive them. This does not send email or private messages.</p></div>
        {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
        {status && <p role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">{status}</p>}
        <div className="grid items-start gap-6 xl:grid-cols-[1.2fr_1fr]">
          <form onSubmit={publish} className="panel p-6 sm:p-7">
            <fieldset disabled={busy} className="space-y-5">
              <legend className="mb-4 text-lg font-bold text-ink">New message</legend>
              <div className="space-y-2"><Label htmlFor="message-title">Title *</Label><Input id="message-title" value={title} onChange={(event) => setTitle(event.target.value)} required maxLength={160} placeholder="What is this update about?" /></div>
              <div className="space-y-2"><Label htmlFor="message-body">Message *</Label><Textarea id="message-body" value={body} onChange={(event) => setBody(event.target.value)} required maxLength={4000} rows={7} placeholder="Write your announcement to students…" /><p className="text-xs text-muted">Up to 4,000 characters. Line breaks are preserved.</p></div>
              <Button type="submit" disabled={!title.trim() || !body.trim()}>{busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}Publish message</Button>
            </fieldset>
          </form>
          <section aria-label="Message preview" className="panel p-6 sm:p-7">
            <h3 className="text-lg font-bold text-ink">Message preview</h3>
            <div className="mt-5 rounded-xl border border-border p-5"><Megaphone className="h-5 w-5 text-brand" /><h4 className="mt-3 break-words text-lg font-bold text-ink">{title.trim() || 'Your message title'}</h4><p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-muted">{body.trim() || 'Your message will appear here and in the student Announcements section.'}</p></div>
          </section>
        </div>

        <section aria-labelledby="message-history" className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3"><div><h3 id="message-history" className="text-xl font-extrabold text-ink">Message history</h3><p className="mt-1 text-sm text-muted">Published messages are visible to students. Archived messages are hidden, not deleted.</p></div><Button type="button" variant="outline" disabled={loading} onClick={() => setRefresh((value) => value + 1)}>Refresh</Button></div>
          {loading ? <div role="status" className="flex justify-center gap-2 py-10 text-sm text-muted"><Loader2 className="h-5 w-5 animate-spin" />Loading messages…</div> : data && (data.items.length === 0 ? <div className="panel p-8 text-sm text-muted">No messages yet. Write your first announcement above.</div> : data.items.map((message) => (
            <article key={message.id} className="panel p-6">
              <div className="flex flex-wrap items-start justify-between gap-3"><div className="min-w-0 flex-1"><p className="text-xs text-muted">{announcementDate(message.createdAt)} · {message.published ? 'Published' : 'Archived'}</p><h4 className="mt-2 break-words text-lg font-bold text-ink">{message.title}</h4></div><Button type="button" variant="outline" disabled={!!busyId} onClick={() => void setPublished(message)}>{busyId === message.id && <Loader2 className="h-4 w-4 animate-spin" />}{message.published ? 'Archive' : 'Restore'}</Button></div>
              <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-ink/80">{message.body}</p>
            </article>
          )))}
          {pages > 1 && <div className="flex flex-wrap items-center gap-3"><Button type="button" variant="outline" disabled={loading || page <= 1} onClick={() => setPage((value) => value - 1)}>Previous</Button><span className="text-sm text-muted">Page {page} of {pages}</span><Button type="button" variant="outline" disabled={loading || page >= pages} onClick={() => setPage((value) => value + 1)}>Next</Button></div>}
        </section>

        <form onSubmit={saveNotice} className="panel max-w-3xl space-y-4 p-6">
          <h3 className="text-lg font-bold text-ink">Weekly class schedule notice</h3>
          <p className="text-sm text-muted">Separate from the message history. This stays near the top of the student dashboard.</p>
          <Label htmlFor="weekly-notice">Schedule notice</Label><Textarea id="weekly-notice" value={weeklyNotice ?? ''} onChange={(event) => setWeeklyNotice(event.target.value)} disabled={savingNotice || weeklyNotice === null} maxLength={1000} rows={3} />
          <Button type="submit" variant="outline" disabled={savingNotice || weeklyNotice === null}>{savingNotice && <Loader2 className="h-4 w-4 animate-spin" />}Save schedule notice</Button>
          <p className="text-xs text-muted">The existing batch-start banner remains under <Link href="/admin/community" className="font-semibold text-brand">Community settings</Link>.</p>
        </form>
      </main>
    </>
  );
}
