'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Search } from 'lucide-react';

import { api } from '@/lib/api';
import { StatusBadge } from '@/components/status-badge';
import { QualificationBadge } from '@/components/qualification-badge';
import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { cn, initials } from '@/lib/utils';
import {
  CRM_LEAD_STATUSES,
  LEAD_STATUS_LABELS,
  LEAD_QUALIFICATIONS,
  LEAD_QUALIFICATION_LABELS,
} from '@shared/crm/constants';
import type { CrmLead, PaginatedMeta } from '@shared/crm/types';

const PAGE_SIZE = 30;

const SECTIONS = ['all', ...LEAD_QUALIFICATIONS] as const;
type Section = (typeof SECTIONS)[number];

const SECTION_LABELS: Record<Section, string> = {
  all: 'All leads',
  ...LEAD_QUALIFICATION_LABELS,
};

export default function LeadsPage() {
  const router = useRouter();
  const [items, setItems] = useState<CrmLead[] | null>(null);
  const [meta, setMeta] = useState<PaginatedMeta | null>(null);
  const [sectionCounts, setSectionCounts] = useState<Record<Section, number> | null>(null);
  const [error, setError] = useState('');
  const [section, setSection] = useState<Section>('all');
  const [status, setStatus] = useState('');
  const [formId, setFormId] = useState('');
  const [forms, setForms] = useState<Array<{ id: string; name: string }>>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    api.get<Array<{ id: string; name: string }>>('/api/v1/forms').then((res) => {
      if (res.ok) setForms(res.data.map((f) => ({ id: f.id, name: f.name })));
    });
  }, []);

  // Counts per quality section, independent of the current filters/search —
  // this is what makes the section tabs a stable "where do leads live" view.
  useEffect(() => {
    let active = true;
    (async () => {
      const results = await Promise.all(
        SECTIONS.map((s) =>
          api.get<CrmLead[]>(
            `/api/v1/leads?page_size=1${s === 'all' ? '' : `&qualification=${s}`}`
          )
        )
      );
      if (!active) return;
      const counts = {} as Record<Section, number>;
      SECTIONS.forEach((s, i) => {
        const res = results[i];
        counts[s] = res.ok ? ((res.meta as PaginatedMeta)?.total ?? 0) : 0;
      });
      setSectionCounts(counts);
    })();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      const params = new URLSearchParams({ page: String(page), page_size: String(PAGE_SIZE) });
      if (status) params.set('status', status);
      if (section !== 'all') params.set('qualification', section);
      if (formId) params.set('form_id', formId);
      if (search.trim()) params.set('search', search.trim());

      const res = await api.get<CrmLead[]>(`/api/v1/leads?${params.toString()}`);
      if (!active) return;
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setError('');
      setItems(res.data);
      setMeta((res.meta as PaginatedMeta) ?? null);
    })();
    return () => {
      active = false;
    };
  }, [status, section, formId, search, page]);

  return (
    <div className="page">
      <PageHeader
        title="Leads"
        description={meta ? `${meta.total.toLocaleString()} in this view` : 'Everyone who asked to talk.'}
      />

      <div className="mb-4 flex flex-wrap gap-2">
        {SECTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => {
              setPage(1);
              setSection(s);
            }}
            className={cn(
              'flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors',
              section === s
                ? 'border-brand bg-brand/10 text-brand'
                : 'border-border bg-surface text-muted hover:text-ink'
            )}
          >
            {SECTION_LABELS[s]}
            <span
              className={cn(
                'rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums',
                section === s ? 'bg-brand/15 text-brand' : 'bg-canvas text-muted'
              )}
            >
              {sectionCounts ? sectionCounts[s].toLocaleString() : '—'}
            </span>
          </button>
        ))}
      </div>

      <div className="panel mb-4 flex flex-wrap items-center gap-3 p-3">
        <div className="relative min-w-[16rem] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            placeholder="Search name, email, phone…"
            className="pl-9 shadow-none"
          />
        </div>

        <Select
          value={status}
          onChange={(e) => {
            setPage(1);
            setStatus(e.target.value);
          }}
          className="w-auto shadow-none"
        >
          <option value="">All statuses</option>
          {CRM_LEAD_STATUSES.map((s) => (
            <option key={s} value={s}>
              {LEAD_STATUS_LABELS[s]}
            </option>
          ))}
        </Select>

        {forms.length > 0 ? (
          <Select
            value={formId}
            onChange={(e) => {
              setPage(1);
              setFormId(e.target.value);
            }}
            className="w-auto max-w-[14rem] shadow-none"
          >
            <option value="">All forms</option>
            {forms.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </Select>
        ) : null}
      </div>

      {error ? <p className="mb-4 text-sm font-medium text-red-600">{error}</p> : null}

      <div className="panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-border bg-canvas/70 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
              <tr>
                <th className="px-5 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Contact</th>
                <th className="px-4 py-3 font-semibold">Source</th>
                <th className="px-4 py-3 font-semibold">Form</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Quality</th>
                <th className="px-5 py-3 font-semibold">Created</th>
              </tr>
            </thead>
            <tbody>
              {items?.map((lead) => (
                <tr
                  key={lead.id}
                  onClick={() => router.push(`/leads/${lead.id}`)}
                  className="cursor-pointer border-b border-border last:border-0 hover:bg-canvas/60"
                >
                  <td className="px-5 py-3.5">
                    <span className="flex items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-canvas text-[11px] font-semibold text-ink">
                        {initials(lead.name)}
                      </span>
                      <span className="font-semibold text-ink">{lead.name}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-muted">{lead.email || lead.phone || '—'}</td>
                  <td className="px-4 py-3.5">
                    <span className="rounded-md bg-canvas px-2 py-1 text-xs font-medium text-ink">
                      {lead.source || '—'}
                    </span>
                    {lead.sourcePath ? (
                      <p className="mt-1 truncate text-[11px] text-muted" title={lead.sourcePath}>
                        {lead.sourcePath}
                      </p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3.5">
                    {lead.formName || lead.formId ? (
                      <div>
                        <p className="text-xs font-semibold text-ink">{lead.formName || 'Form'}</p>
                        {lead.formTags?.length ? (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {lead.formTags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-full bg-brand-soft px-1.5 py-0.5 text-[10px] font-semibold text-brand"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        ) : null}
                        {lead.formId ? (
                          <p className="mt-0.5 max-w-[9rem] truncate font-mono text-[10px] text-muted" title={lead.formId}>
                            {lead.formId}
                          </p>
                        ) : null}
                      </div>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={lead.status} />
                  </td>
                  <td className="px-4 py-3.5">
                    <QualificationBadge qualification={lead.qualification} />
                  </td>
                  <td className="px-5 py-3.5 tabular-nums text-muted">
                    {new Date(lead.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {items && items.length === 0 ? (
          <p className="p-10 text-center text-sm text-muted">No leads match these filters.</p>
        ) : null}

        {!items ? (
          <div className="flex justify-center p-10">
            <Loader2 className="h-5 w-5 animate-spin text-brand" />
          </div>
        ) : null}
      </div>

      {meta && meta.totalPages > 1 ? (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs text-muted">
            Page {meta.page} of {meta.totalPages}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= meta.totalPages}
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
