'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { adminApi } from '@/lib/admin-api';
import { Button } from '@/components/ui/button';
import { Input, Label } from '@/components/ui/input';
import { StudentDialog } from './student-dialog';

type Invitation = {
  id: string; email: string; status: 'pending' | 'expired' | 'cancelled' | 'accepted';
  deliveryStatus: 'sent' | 'failed' | 'pending'; expiresAt: string; createdAt: string;
};
type InvitationList = { items: Invitation[]; total: number; page: number; pageSize: number };
type InviteResult = { ok: true; invitation: Invitation; message?: string };
const endpoint = '/api/admin/portal/invitations';
function date(value: string) {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? 'Not available' : parsed.toLocaleDateString();
}
function deliveryMessage(result: InviteResult) {
  return result.invitation.deliveryStatus === 'failed'
    ? 'Invitation saved, but the email could not be sent. Use Resend to retry.'
    : result.invitation.deliveryStatus === 'pending'
      ? 'Invitation saved. Email delivery is pending; it has not been confirmed sent.'
      : 'Invitation email sent. The recipient can use the link to join.';
}

export function StudentInvitations() {
  const [data, setData] = useState<InvitationList | null>(null);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [inviteError, setInviteError] = useState('');
  const [sending, setSending] = useState(false);
  const [busyId, setBusyId] = useState('');
  const [cancel, setCancel] = useState<Invitation | null>(null);
  const [cancelError, setCancelError] = useState('');
  const actionLock = useRef(false);
  const sendLock = useRef(false);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get('invite') === '1') {
      setOpen(true);
      window.history.replaceState(window.history.state, '', window.location.pathname + window.location.hash);
    }
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true); setError('');
    adminApi.get<InvitationList>(`${endpoint}?${new URLSearchParams({ page: String(page), search })}`).then((result) => {
      if (!active) return;
      if (!result.ok) setError(result.error);
      else if (!result.data.items.length && result.data.total > 0 && page > 1) setPage(Math.ceil(result.data.total / result.data.pageSize));
      else setData(result.data);
      setLoading(false);
    });
    return () => { active = false; };
  }, [page, search, refresh]);

  async function invite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sendLock.current) return;
    sendLock.current = true; setSending(true); setInviteError('');
    const result = await adminApi.post<InviteResult>(endpoint, { email: email.trim() });
    sendLock.current = false; setSending(false);
    if (!result.ok) { setInviteError(result.error); return; }
    setNotice(deliveryMessage(result.data)); setOpen(false); setEmail('');
    setPage(1); setRefresh((value) => value + 1);
  }
  async function act(item: Invitation, action: 'resend' | 'cancel') {
    if (actionLock.current) return;
    actionLock.current = true; setBusyId(item.id); setError(''); setNotice(''); setCancelError('');
    const result = await adminApi.post<InviteResult | { ok: true }>(`${endpoint}/${encodeURIComponent(item.id)}/${action}`);
    actionLock.current = false; setBusyId('');
    if (!result.ok) {
      if (action === 'cancel') setCancelError(result.error); else setError(result.error);
      return;
    }
    setCancel(null);
    setNotice(action === 'cancel' ? 'Invitation cancelled. Its link no longer works.' : 'invitation' in result.data ? deliveryMessage(result.data) : 'Invitation updated.');
    setRefresh((value) => value + 1);
  }
  const pages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;
  return (
    <section id="invitations" aria-labelledby="invitations-title" className="space-y-4 border-t border-border pt-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div><h2 id="invitations-title" className="text-xl font-extrabold text-ink">Invitations</h2><p className="mt-1 text-sm text-muted">Invite by email. Recipients only need their name, phone number and a password.</p></div>
        <Button type="button" className="min-h-11" onClick={() => { setInviteError(''); setOpen(true); }}>Invite Student</Button>
      </div>
      <form className="flex flex-wrap items-end gap-3" onSubmit={(event) => { event.preventDefault(); setPage(1); setSearch(searchInput.trim()); setRefresh((value) => value + 1); }}>
        <div className="min-w-0 flex-1 space-y-2"><Label htmlFor="invite-search">Search invitations</Label><Input id="invite-search" type="search" maxLength={160} placeholder="Email address" value={searchInput} onChange={(event) => setSearchInput(event.target.value)} /></div>
        <Button type="submit" variant="outline" className="min-h-11" disabled={loading}>Search</Button>
        <Button type="button" variant="outline" className="min-h-11" disabled={loading || !!busyId} onClick={() => setRefresh((value) => value + 1)}>Refresh invitations</Button>
      </form>
      {notice && <p role="status" className="rounded-xl border border-border bg-white p-4 text-sm text-ink">{notice}</p>}
      {error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">{error}</p>}
      {loading ? <p role="status" className="py-6 text-sm text-muted">Loading invitations…</p> : !error && data && <>
        {!data.items.length ? <p className="panel p-5 text-sm text-muted">No invitations found.</p> : data.items.map((item) => (
          <article key={item.id} className="panel flex flex-wrap items-start justify-between gap-4 p-5">
            <div className="min-w-0 max-w-full"><h3 className="break-all font-bold text-ink">{item.email}</h3>
              <p className="mt-2 text-sm capitalize text-ink">{item.status} · Email {item.deliveryStatus === 'sent' ? 'sent' : item.deliveryStatus === 'failed' ? 'failed — retry sending' : 'pending'}</p>
              <p className="mt-1 text-xs text-muted">Created {date(item.createdAt)} · Expires {date(item.expiresAt)}</p>
            </div>
            {item.status !== 'accepted' && <div className="flex flex-wrap gap-2">
              <Button type="button" className="min-h-11" variant="outline" disabled={!!busyId} onClick={() => void act(item, 'resend')}>{busyId === item.id ? 'Working…' : item.status === 'cancelled' ? 'Send new invitation' : 'Resend'}</Button>
              {item.status !== 'cancelled' && <Button type="button" className="min-h-11" variant="outline" disabled={!!busyId} onClick={() => { setCancelError(''); setCancel(item); }}>Cancel invitation</Button>}
            </div>}
          </article>
        ))}
        <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-muted">{data.total} invitations · Page {page} of {pages}</p><div className="flex gap-2"><Button type="button" className="min-h-11" variant="outline" disabled={page <= 1 || !!busyId} onClick={() => setPage((value) => value - 1)}>Previous</Button><Button type="button" className="min-h-11" variant="outline" disabled={page >= pages || !!busyId} onClick={() => setPage((value) => value + 1)}>Next</Button></div></div>
      </>}
      {open && <StudentDialog title="Invite Student" busy={sending} onClose={() => setOpen(false)}>
        <p className="text-sm text-muted">Send a secure, seven-day invitation link. Existing accounts cannot be invited again.</p>
        <form onSubmit={invite} className="mt-5 space-y-4"><div className="space-y-2"><Label htmlFor="invite-email">Email address</Label><Input id="invite-email" type="email" required maxLength={254} autoComplete="email" value={email} disabled={sending} onChange={(event) => setEmail(event.target.value)} /></div>
          {inviteError && <p role="alert" className="text-sm text-red-700">{inviteError}</p>}
          <div className="flex flex-wrap justify-end gap-2"><Button type="button" className="min-h-11" variant="outline" disabled={sending} onClick={() => setOpen(false)}>Cancel</Button><Button type="submit" className="min-h-11" disabled={sending}>{sending ? 'Sending…' : 'Send invitation'}</Button></div>
        </form>
      </StudentDialog>}
      {cancel && <StudentDialog title="Cancel invitation?" busy={!!busyId} onClose={() => setCancel(null)}><p className="break-words text-sm text-muted">Revoke the link for {cancel.email}? This does not delete a student account.</p>{cancelError && <p role="alert" className="mt-3 text-sm text-red-700">{cancelError}</p>}<div className="mt-5 flex flex-wrap justify-end gap-2"><Button type="button" className="min-h-11" variant="outline" disabled={!!busyId} onClick={() => setCancel(null)}>Keep invitation</Button><Button type="button" className="min-h-11" disabled={!!busyId} onClick={() => void act(cancel, 'cancel')}>{busyId ? 'Cancelling…' : 'Cancel invitation'}</Button></div></StudentDialog>}
    </section>
  );
}
