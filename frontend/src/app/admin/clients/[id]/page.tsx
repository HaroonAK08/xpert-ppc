'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import { Select } from '@/components/ui/input';
import { useAdminUser } from '@/components/admin/admin-context';
import { api, type CrmClient, type CrmLead } from '@/lib/api';
import { cn } from '@/lib/utils';

const STATUSES = [
  'new',
  'contacted',
  'replied',
  'interested',
  'follow_up',
  'converted',
  'not_interested',
  'closed',
] as const;

const statusStyles: Record<string, string> = {
  new: 'bg-primary/15 text-primary',
  contacted: 'bg-accent/15 text-accent',
  replied: 'bg-success/15 text-success',
  interested: 'bg-success/20 text-success',
  follow_up: 'bg-accent/20 text-accent',
  converted: 'bg-success/25 text-success',
  not_interested: 'bg-muted text-muted-foreground',
  closed: 'bg-muted text-muted-foreground',
};

export default function ClientLeadsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const me = useAdminUser();
  const [client, setClient] = useState<CrmClient | null>(null);
  const [leads, setLeads] = useState<CrmLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');

    const [clientsRes, leadsRes] = await Promise.all([
      api.get<{ data: CrmClient[] }>('/api/v1/clients'),
      api.get<{ data: CrmLead[] }>(`/api/v1/clients/${params.id}/leads`),
    ]);

    if (!clientsRes.ok) {
      setError(clientsRes.error);
      setLoading(false);
      return;
    }
    const found = clientsRes.data.data.find((c) => c.id === params.id) || null;
    if (!found) {
      setError('Client not found.');
      setLoading(false);
      return;
    }
    setClient(found);

    if (!leadsRes.ok) {
      setError(leadsRes.error);
      setLoading(false);
      return;
    }
    setLeads(leadsRes.data.data);
    setLoading(false);
  }, [params.id]);

  useEffect(() => {
    if (me.role !== 'admin') {
      router.replace('/admin');
      return;
    }
    void load();
  }, [me.role, router, load]);

  async function updateStatus(id: string, status: string) {
    await api.patch(`/api/v1/leads/${id}`, { status });
    void load();
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <section className="bg-background py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-background py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Client
        </p>
        <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">{client?.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{client?.email}</p>
        <p className="mt-3 text-sm text-muted-foreground">
          {client?.sheet
            ? `Sheet: ${client.sheet.spreadsheetTitle || client.sheet.spreadsheetId} · last synced ${
                client.sheet.lastSyncedAt
                  ? new Date(client.sheet.lastSyncedAt).toLocaleString()
                  : 'never'
              }`
            : 'No sheet connected yet — leads will appear here once one is assigned.'}
        </p>

        <div className="mt-8">
          {leads.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-10 text-center">
              <p className="text-sm text-muted-foreground">
                No leads for this client yet.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-border">
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead className="bg-card">
                  <tr>
                    {['Received', 'Name', 'Contact', 'Business', 'Status'].map((h) => (
                      <th
                        key={h}
                        scope="col"
                        className="px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-muted-foreground"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {leads.map((l) => (
                    <tr key={l.id} className="border-t border-border align-top">
                      <td className="whitespace-nowrap px-4 py-4 text-xs text-muted-foreground">
                        {new Date(l.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="px-4 py-4 font-semibold text-foreground">{l.name}</td>
                      <td className="px-4 py-4 text-xs">
                        <a
                          href={`mailto:${l.email}`}
                          className="block text-muted-foreground hover:text-primary"
                        >
                          {l.email}
                        </a>
                        {l.phone ? (
                          <a
                            href={`tel:${l.phone}`}
                            className="block text-muted-foreground hover:text-primary"
                          >
                            {l.phone}
                          </a>
                        ) : null}
                      </td>
                      <td className="px-4 py-4 text-xs text-muted-foreground">
                        {l.businessName || '—'}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={cn(
                            'mb-2 inline-block rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider',
                            statusStyles[l.status] ?? statusStyles.new
                          )}
                        >
                          {l.status}
                        </span>
                        <Select
                          aria-label={`Change status for ${l.name}`}
                          value={l.status}
                          onChange={(e) => void updateStatus(l.id, e.target.value)}
                          className="w-36"
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </Select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
