'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Plus, Search, Trash2, X } from 'lucide-react';

import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input, Select, Textarea } from '@/components/ui/input';
import { PageHeader } from '@/components/ui/page-header';
import { useCurrentUser } from '@/lib/user-context';
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
  const user = useCurrentUser();
  const isTeamUser = user.role === 'client';
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
  const [showCreate, setShowCreate] = useState(false);
  const [saving, setSaving] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: '',
    email: '',
    phone: '',
    businessName: '',
    source: 'manual',
    message: '',
  });
  const [listVersion, setListVersion] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  useEffect(() => {
    if (isTeamUser) return;
    api.get<Array<{ id: string; name: string }>>('/api/v1/forms').then((res) => {
      if (res.ok) setForms(res.data.map((f) => ({ id: f.id, name: f.name })));
    });
  }, [isTeamUser]);

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
  }, [listVersion]);

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
  }, [status, section, formId, search, page, listVersion]);

  async function createLead() {
    if (!createForm.name.trim()) {
      setError('Name is required.');
      return;
    }
    setSaving(true);
    setError('');
    const res = await api.post<CrmLead>('/api/v1/leads', {
      name: createForm.name.trim(),
      email: createForm.email.trim(),
      phone: createForm.phone.trim(),
      businessName: createForm.businessName.trim(),
      source: createForm.source.trim() || 'manual',
      message: createForm.message.trim(),
    });
    setSaving(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setShowCreate(false);
    setCreateForm({ name: '', email: '', phone: '', businessName: '', source: 'manual', message: '' });
    setPage(1);
    setSection('all');
    setStatus('');
    setFormId('');
    setSearch('');
    setListVersion((v) => v + 1);
    router.replace('/leads');
  }

  async function deleteLead(lead: CrmLead, e: React.MouseEvent) {
    e.stopPropagation();
    if (!window.confirm(`Delete “${lead.name}”? This can’t be undone.`)) return;
    setDeletingId(lead.id);
    setError('');
    const res = await api.delete(`/api/v1/leads/${lead.id}`);
    setDeletingId(null);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setListVersion((v) => v + 1);
  }

  async function patchLead(leadId: string, patch: { status?: string; qualification?: string }) {
    setUpdatingId(leadId);
    setError('');
    const res = await api.patch<CrmLead>(`/api/v1/leads/${leadId}`, patch);
    setUpdatingId(null);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setItems((prev) =>
      prev
        ? prev.map((l) =>
            l.id === leadId
              ? {
                  ...l,
                  ...(patch.status !== undefined ? { status: res.data.status } : {}),
                  ...(patch.qualification !== undefined
                    ? { qualification: res.data.qualification }
                    : {}),
                }
              : l
          )
        : prev
    );
    if (patch.qualification) setListVersion((v) => v + 1);
  }

  return (
    <div className="page">
      <PageHeader
        title="Leads"
        description={
          meta
            ? `${meta.total.toLocaleString()} in this view`
            : isTeamUser
              ? 'Leads you add — form and main-team leads stay separate.'
              : 'Main pipeline leads from forms, ads, and your team.'
        }
      >
        <Button size="sm" onClick={() => setShowCreate(true)}>
          <Plus className="h-3.5 w-3.5" /> Add lead
        </Button>
      </PageHeader>
      {showCreate ? (
        <div className="panel mb-4 p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-ink">New lead</p>
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="rounded-lg p-1 text-muted hover:bg-canvas hover:text-ink"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <Input
              value={createForm.name}
              onChange={(e) => setCreateForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="Full name *"
              className="bg-canvas"
            />
            <Input
              type="email"
              value={createForm.email}
              onChange={(e) => setCreateForm((p) => ({ ...p, email: e.target.value }))}
              placeholder="Email"
              className="bg-canvas"
            />
            <Input
              value={createForm.phone}
              onChange={(e) => setCreateForm((p) => ({ ...p, phone: e.target.value }))}
              placeholder="Phone"
              className="bg-canvas"
            />
            <Input
              value={createForm.businessName}
              onChange={(e) => setCreateForm((p) => ({ ...p, businessName: e.target.value }))}
              placeholder="Company"
              className="bg-canvas"
            />
            <Textarea
              value={createForm.message}
              onChange={(e) => setCreateForm((p) => ({ ...p, message: e.target.value }))}
              placeholder="Notes / message"
              rows={3}
              className="bg-canvas sm:col-span-2"
            />
          </div>
          <div className="mt-3 flex gap-2">
            <Button disabled={saving || !createForm.name.trim()} onClick={() => void createLead()}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Save lead
            </Button>
            <Button variant="outline" disabled={saving} onClick={() => setShowCreate(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : null}
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
                <th className="w-12 px-3 py-3 font-semibold">
                  <span className="sr-only">Actions</span>
                </th>
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
                  <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                    <Select
                      value={lead.status}
                      disabled={updatingId === lead.id}
                      onChange={(e) => void patchLead(lead.id, { status: e.target.value })}
                      className="min-w-[8.5rem] py-1.5 text-xs shadow-none"
                    >
                      {CRM_LEAD_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {LEAD_STATUS_LABELS[s]}
                        </option>
                      ))}
                    </Select>
                  </td>
                  <td className="px-4 py-3.5" onClick={(e) => e.stopPropagation()}>
                    <Select
                      value={lead.qualification}
                      disabled={updatingId === lead.id}
                      onChange={(e) => void patchLead(lead.id, { qualification: e.target.value })}
                      className="min-w-[8.5rem] py-1.5 text-xs shadow-none"
                    >
                      {LEAD_QUALIFICATIONS.map((q) => (
                        <option key={q} value={q}>
                          {LEAD_QUALIFICATION_LABELS[q]}
                        </option>
                      ))}
                    </Select>
                  </td>
                  <td className="px-5 py-3.5 tabular-nums text-muted">
                    {new Date(lead.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                  <td className="px-3 py-3.5">
                    <button
                      type="button"
                      disabled={deletingId === lead.id}
                      onClick={(e) => void deleteLead(lead, e)}
                      className="rounded-lg p-1.5 text-muted transition-colors hover:bg-surface hover:text-red-600 disabled:opacity-50"
                      aria-label={`Delete ${lead.name}`}
                      title="Delete lead"
                    >
                      {deletingId === lead.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
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
