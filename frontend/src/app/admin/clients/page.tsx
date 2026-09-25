'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import { Input, Field, Label } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAdminUser } from '@/components/admin/admin-context';
import { api, type CrmClient } from '@/lib/api';

/** Accept a pasted full share link as well as a bare spreadsheet ID. */
function extractSpreadsheetId(input: string): string {
  const trimmed = input.trim();
  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : trimmed;
}

export default function ClientsPage() {
  const router = useRouter();
  const me = useAdminUser();
  const [clients, setClients] = useState<CrmClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  const [sheetFormFor, setSheetFormFor] = useState<string | null>(null);
  const [sheetId, setSheetId] = useState('');
  const [sheetWorksheet, setSheetWorksheet] = useState('Sheet1');
  const [sheetTitle, setSheetTitle] = useState('');
  const [sheetBusy, setSheetBusy] = useState(false);
  const [sheetError, setSheetError] = useState('');

  const [resetFormFor, setResetFormFor] = useState<string | null>(null);
  const [resetPassword, setResetPassword] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');

    const res = await api.get<{ data: CrmClient[] }>('/api/v1/clients');
    if (!res.ok) {
      setError(res.error);
      setLoading(false);
      return;
    }
    setClients(res.data.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (me.role !== 'admin') {
      router.replace('/admin');
      return;
    }
    void load();
  }, [me.role, router, load]);

  async function createClient() {
    setCreateError('');
    if (!newEmail.trim() || !newName.trim() || newPassword.length < 8) {
      setCreateError('Email, name, and a password of at least 8 characters are required.');
      return;
    }
    setCreating(true);
    const res = await api.post('/api/v1/clients', {
      email: newEmail.trim(),
      name: newName.trim(),
      password: newPassword,
    });
    setCreating(false);
    if (!res.ok) {
      setCreateError(res.error);
      return;
    }
    setNewEmail('');
    setNewName('');
    setNewPassword('');
    void load();
  }

  async function toggleActive(client: CrmClient) {
    setBusyId(client.id);
    await api.patch(`/api/v1/clients/${client.id}`, { active: !client.active });
    setBusyId(null);
    void load();
  }

  async function submitReset(clientId: string) {
    if (resetPassword.length < 8) return;
    setBusyId(clientId);
    const res = await api.patch(`/api/v1/clients/${clientId}`, { password: resetPassword });
    setBusyId(null);
    if (res.ok) {
      setResetFormFor(null);
      setResetPassword('');
    }
  }

  function openSheetForm(client: CrmClient) {
    setSheetFormFor(client.id);
    setSheetId(client.sheet?.spreadsheetId || '');
    setSheetWorksheet(client.sheet?.worksheetName || 'Sheet1');
    setSheetTitle(client.sheet?.spreadsheetTitle || '');
    setSheetError('');
  }

  async function submitSheet(clientId: string) {
    setSheetError('');
    if (!sheetId.trim()) {
      setSheetError('Spreadsheet ID is required.');
      return;
    }
    setSheetBusy(true);
    const res = await api.put(`/api/v1/clients/${clientId}/sheet`, {
      spreadsheetId: sheetId.trim(),
      worksheetName: sheetWorksheet.trim() || 'Sheet1',
      spreadsheetTitle: sheetTitle.trim(),
    });
    setSheetBusy(false);
    if (!res.ok) {
      setSheetError(res.error);
      return;
    }
    setSheetFormFor(null);
    void load();
  }

  async function syncSheet(clientId: string) {
    setBusyId(clientId);
    await api.post(`/api/v1/clients/${clientId}/sheet/sync`);
    setBusyId(null);
    void load();
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <section className="bg-background py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-extrabold sm:text-3xl">Clients</h1>
        <p className="mb-8 mt-1 text-sm text-muted-foreground">
          Create a login for each client and connect their own Google Sheet. They&apos;ll only
          see leads from their own sheet, in their own section — {me.email} sees everyone&apos;s.
        </p>

        {error ? (
          <p className="mb-6 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <article className="mb-10 rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-muted-foreground">
            Add client
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field>
              <Label htmlFor="new-email">Email</Label>
              <Input
                id="new-email"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="client@example.com"
              />
            </Field>
            <Field>
              <Label htmlFor="new-name">Name</Label>
              <Input
                id="new-name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Full name"
              />
            </Field>
            <Field>
              <Label htmlFor="new-password">Password</Label>
              <Input
                id="new-password"
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 8 characters"
              />
            </Field>
          </div>
          {createError ? <p className="mt-3 text-sm text-destructive">{createError}</p> : null}
          <Button className="mt-4" disabled={creating} onClick={() => void createClient()}>
            {creating ? 'Creating…' : 'Create client'}
          </Button>
          <p className="mt-3 text-xs text-muted-foreground">
            Share this email and password with them directly — there&apos;s no self-signup.
          </p>
        </article>

        <div className="space-y-4">
          {clients.length === 0 ? (
            <p className="text-sm text-muted-foreground">No clients yet.</p>
          ) : (
            clients.map((client) => (
              <article key={client.id} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-bold">
                      {client.name}{' '}
                      <span
                        className={
                          client.active
                            ? 'ml-2 rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-bold uppercase text-success'
                            : 'ml-2 rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase text-muted-foreground'
                        }
                      >
                        {client.active ? 'Active' : 'Deactivated'}
                      </span>
                    </p>
                    <p className="text-sm text-muted-foreground">{client.email}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {client.leadCount} lead{client.leadCount === 1 ? '' : 's'} ·{' '}
                      {client.sheet
                        ? `Sheet: ${client.sheet.spreadsheetTitle || client.sheet.spreadsheetId} (${client.sheet.lastSyncState})`
                        : 'No sheet connected'}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/admin/clients/${client.id}`}
                      className="inline-flex h-9 items-center justify-center rounded-xl border border-border px-4 text-xs font-semibold text-primary hover:bg-primary/5"
                    >
                      View leads
                    </Link>
                    <Button variant="outline" size="sm" onClick={() => openSheetForm(client)}>
                      {client.sheet ? 'Update sheet' : 'Assign sheet'}
                    </Button>
                    {client.sheet ? (
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={busyId === client.id}
                        onClick={() => void syncSheet(client.id)}
                      >
                        Sync now
                      </Button>
                    ) : null}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setResetFormFor(resetFormFor === client.id ? null : client.id)
                      }
                    >
                      Reset password
                    </Button>
                    <Button
                      variant={client.active ? 'outline' : 'default'}
                      size="sm"
                      disabled={busyId === client.id}
                      onClick={() => void toggleActive(client)}
                    >
                      {client.active ? 'Deactivate' : 'Activate'}
                    </Button>
                  </div>
                </div>

                {resetFormFor === client.id ? (
                  <div className="mt-4 flex flex-wrap items-end gap-3 border-t border-border pt-4">
                    <Field className="flex-1 min-w-[200px]">
                      <Label htmlFor={`reset-${client.id}`}>New password</Label>
                      <Input
                        id={`reset-${client.id}`}
                        value={resetPassword}
                        onChange={(e) => setResetPassword(e.target.value)}
                        placeholder="Min 8 characters"
                      />
                    </Field>
                    <Button
                      size="sm"
                      disabled={busyId === client.id || resetPassword.length < 8}
                      onClick={() => void submitReset(client.id)}
                    >
                      Save
                    </Button>
                  </div>
                ) : null}

                {sheetFormFor === client.id ? (
                  <div className="mt-4 grid gap-3 border-t border-border pt-4 sm:grid-cols-3">
                    <Field>
                      <Label htmlFor={`sheet-id-${client.id}`}>Spreadsheet ID or share link</Label>
                      <Input
                        id={`sheet-id-${client.id}`}
                        value={sheetId}
                        onChange={(e) => setSheetId(extractSpreadsheetId(e.target.value))}
                        placeholder="Paste the full Google Sheets URL or just the ID"
                      />
                    </Field>
                    <Field>
                      <Label htmlFor={`sheet-tab-${client.id}`}>Worksheet / tab</Label>
                      <Input
                        id={`sheet-tab-${client.id}`}
                        value={sheetWorksheet}
                        onChange={(e) => setSheetWorksheet(e.target.value)}
                      />
                    </Field>
                    <Field>
                      <Label htmlFor={`sheet-title-${client.id}`}>Display title (optional)</Label>
                      <Input
                        id={`sheet-title-${client.id}`}
                        value={sheetTitle}
                        onChange={(e) => setSheetTitle(e.target.value)}
                      />
                    </Field>
                    <div className="sm:col-span-3">
                      {sheetError ? (
                        <p className="mb-2 text-sm text-destructive">{sheetError}</p>
                      ) : null}
                      <p className="mb-3 text-xs text-muted-foreground">
                        Share the spreadsheet with the backend&apos;s Google service account
                        (Editor access) before connecting.
                      </p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          disabled={sheetBusy}
                          onClick={() => void submitSheet(client.id)}
                        >
                          {sheetBusy ? 'Connecting…' : 'Save sheet'}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setSheetFormFor(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : null}
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
