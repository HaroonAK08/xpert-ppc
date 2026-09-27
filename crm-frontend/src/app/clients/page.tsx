'use client';

import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

import { api, type CrmClient } from '@/lib/api';

export default function ClientsPage() {
  const [clients, setClients] = useState<CrmClient[] | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      const res = await api.get<CrmClient[]>('/api/v1/clients');
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setClients(res.data);
    })();
  }, []);

  return (
    <div className="page">
      <h1 className="page-title mb-2">Clients</h1>
      <p className="mb-8 text-sm text-muted">Accounts that can sign in and see their own leads.</p>

      {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}

      {!clients ? (
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-brand" />
        </div>
      ) : (
        <div className="panel overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-canvas/70 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
              <tr>
                <th className="px-5 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Email</th>
                <th className="px-4 py-3 font-semibold">Leads</th>
                <th className="px-4 py-3 font-semibold">Google Sheet</th>
                <th className="px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client.id} className="border-b border-border last:border-0 hover:bg-canvas/60">
                  <td className="px-5 py-3.5 font-semibold text-ink">{client.name}</td>
                  <td className="px-4 py-3.5 text-muted">{client.email}</td>
                  <td className="px-4 py-3.5 tabular-nums text-muted">{client.leadCount}</td>
                  <td className="px-4 py-3.5 text-muted">
                    {client.sheet?.connected ? client.sheet.spreadsheetTitle : 'Not connected'}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={
                        client.active
                          ? 'inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-100'
                          : 'inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600 ring-1 ring-inset ring-slate-200'
                      }
                    >
                      {client.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {clients.length === 0 ? (
            <p className="p-6 text-center text-sm text-muted">No clients yet.</p>
          ) : null}
        </div>
      )}
    </div>
  );
}
