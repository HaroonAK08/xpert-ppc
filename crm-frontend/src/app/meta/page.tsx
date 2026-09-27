'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';

type MetaStatus = {
  configured: boolean;
  connected: boolean;
  pageId: string | null;
  pageName: string | null;
  forms: { id: string; name: string }[];
  pendingPages: { id: string; name: string }[];
  lastLeadAt: string | null;
  lastError: string;
};

function MetaSettingsInner() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<MetaStatus | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function load() {
    const res = await api.get<MetaStatus>('/api/v1/integrations/meta/status');
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setStatus(res.data);
  }

  useEffect(() => {
    const paramError = searchParams.get('meta_error');
    if (paramError) setError(paramError);
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function connect() {
    setBusy(true);
    setError('');
    const res = await api.get<{ url: string }>('/api/v1/integrations/meta/oauth-url');
    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    window.location.href = res.data.url;
  }

  async function selectPage(pageId: string) {
    setBusy(true);
    setError('');
    const res = await api.post<MetaStatus>('/api/v1/integrations/meta/select-page', { pageId });
    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setStatus(res.data);
  }

  async function refreshForms() {
    setBusy(true);
    const res = await api.post<MetaStatus>('/api/v1/integrations/meta/forms/refresh');
    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setStatus(res.data);
  }

  async function disconnect() {
    setBusy(true);
    await api.delete('/api/v1/integrations/meta/disconnect');
    setBusy(false);
    load();
  }

  if (!status) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-brand" />
      </div>
    );
  }

  if (!status.configured) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-6">
        <p className="text-sm font-semibold text-ink">Meta integration isn&apos;t configured yet.</p>
        <p className="mt-1 text-sm text-muted">
          Set <code className="rounded bg-canvas px-1.5 py-0.5">META_APP_ID</code>,{' '}
          <code className="rounded bg-canvas px-1.5 py-0.5">META_APP_SECRET</code>,{' '}
          <code className="rounded bg-canvas px-1.5 py-0.5">META_WEBHOOK_VERIFY_TOKEN</code>,{' '}
          <code className="rounded bg-canvas px-1.5 py-0.5">META_OAUTH_REDIRECT_URI</code> and{' '}
          <code className="rounded bg-canvas px-1.5 py-0.5">META_TOKEN_ENCRYPTION_KEY</code> on the
          backend, then reload this page.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </p>
      ) : null}

      {status.connected ? (
        <div className="rounded-2xl border border-border bg-surface p-6">
          <p className="text-sm font-semibold text-ink">Connected to {status.pageName}</p>
          <p className="mt-1 text-xs text-muted">
            {status.lastLeadAt
              ? `Last lead received ${new Date(status.lastLeadAt).toLocaleString()}`
              : 'No leads received yet.'}
          </p>

          <div className="mt-4">
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-muted">Lead forms</p>
            <ul className="space-y-1">
              {status.forms.map((form) => (
                <li key={form.id} className="text-sm text-ink">
                  {form.name}
                </li>
              ))}
              {status.forms.length === 0 ? (
                <li className="text-sm text-muted">No forms found on this Page yet.</li>
              ) : null}
            </ul>
          </div>

          <div className="mt-5 flex gap-2">
            <Button variant="outline" size="sm" disabled={busy} onClick={refreshForms}>
              Refresh forms
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={busy}
              onClick={disconnect}
              className="border-red-200 text-red-600 hover:border-red-300 hover:text-red-700 hover:bg-red-50"
            >
              Disconnect
            </Button>
          </div>
        </div>
      ) : status.pendingPages.length > 0 ? (
        <div className="rounded-2xl border border-border bg-surface p-6">
          <p className="mb-3 text-sm font-semibold text-ink">Choose which Page to connect</p>
          <ul className="space-y-2">
            {status.pendingPages.map((page) => (
              <li key={page.id} className="flex items-center justify-between rounded-xl bg-canvas px-4 py-3">
                <span className="text-sm font-medium text-ink">{page.name}</span>
                <Button size="sm" disabled={busy} onClick={() => selectPage(page.id)}>
                  Select
                </Button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-surface p-6">
          <p className="text-sm font-semibold text-ink">No Facebook Page connected</p>
          <p className="mt-1 mb-4 text-sm text-muted">
            Connect a Facebook Page to automatically import leads from its Instant Forms.
          </p>
          <Button disabled={busy} onClick={connect}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Connect Meta'}
          </Button>
        </div>
      )}
    </div>
  );
}

export default function MetaSettingsPage() {
  return (
    <div className="page">
      <h1 className="page-title mb-2">Meta Lead Ads</h1>
      <p className="mb-8 text-sm text-muted">Import Instant Form submissions from a connected Facebook Page.</p>
      <Suspense fallback={null}>
        <MetaSettingsInner />
      </Suspense>
    </div>
  );
}
