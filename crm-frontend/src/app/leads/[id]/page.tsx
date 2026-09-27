'use client';

import { useEffect, useState, use as usePromise } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Phone, Send, Trash2 } from 'lucide-react';

import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input, Select } from '@/components/ui/input';
import { initials } from '@/lib/utils';
import {
  CRM_LEAD_STATUSES,
  LEAD_STATUS_LABELS,
  LEAD_QUALIFICATIONS,
  LEAD_QUALIFICATION_LABELS,
} from '@shared/crm/constants';
import type { Contact, ContactActivity, CrmLead, LeadActivity, LeadNote } from '@shared/crm/types';

const MARKETING_SITE_URL = (
  process.env.NEXT_PUBLIC_MARKETING_SITE_URL || 'http://localhost:3000'
).replace(/\/$/, '');

type LeadDetail = {
  lead: CrmLead;
  notes: LeadNote[];
  activity: LeadActivity[];
  contact: Contact | null;
  contactActivity: ContactActivity[];
  form: { id: string; name: string } | null;
};

type CustomFieldDefinition = {
  id: string;
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select';
  options: string[];
};

type Sequence = { id: string; name: string; enabled: boolean };

type Enrollment = {
  id: string;
  sequenceId: string;
  sequenceName: string;
  currentStep: number;
  status: 'active' | 'completed' | 'stopped';
  nextSendAt: string | null;
};

const ACTIVITY_LABELS: Record<string, string> = {
  lead_created: 'Lead created',
  status_changed: 'Status changed',
  marked_contacted: 'Marked contacted',
  marked_replied: 'Marked replied',
  note_added: 'Note added',
  note_updated: 'Note updated',
  follow_up_changed: 'Follow-up scheduled',
  follow_up_completed: 'Follow-up completed',
  follow_up_cancelled: 'Follow-up cancelled',
  synced_from_sheets: 'Synced from Google Sheets',
  synced_to_sheets: 'Synced to Google Sheets',
  sync_conflict: 'Sync conflict',
  lead_updated: 'Lead updated',
  qualification_changed: 'Lead quality updated',
};

export default function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = usePromise(params);
  const router = useRouter();
  const [detail, setDetail] = useState<LeadDetail | null>(null);
  const [fieldDefs, setFieldDefs] = useState<CustomFieldDefinition[]>([]);
  const [sequences, setSequences] = useState<Sequence[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [selectedSequence, setSelectedSequence] = useState('');
  const [error, setError] = useState('');
  const [noteText, setNoteText] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    const res = await api.get<LeadDetail>(`/api/v1/leads/${id}`);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setDetail(res.data);
  }

  async function loadEnrollments() {
    const res = await api.get<Enrollment[]>(`/api/v1/sequences/enrollments/${id}`);
    if (res.ok) setEnrollments(res.data);
  }

  useEffect(() => {
    load();
    loadEnrollments();
    api.get<CustomFieldDefinition[]>('/api/v1/custom-fields').then((res) => {
      if (res.ok) setFieldDefs(res.data);
    });
    api.get<Sequence[]>('/api/v1/sequences').then((res) => {
      if (res.ok) setSequences(res.data.filter((s) => s.enabled));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function enroll() {
    if (!selectedSequence) return;
    setSaving(true);
    await api.post(`/api/v1/sequences/${selectedSequence}/enroll`, { leadId: id });
    await loadEnrollments();
    setSaving(false);
  }

  async function stopEnrollment(enrollmentId: string) {
    setSaving(true);
    await api.post(`/api/v1/sequences/enrollments/${enrollmentId}/stop`);
    await loadEnrollments();
    setSaving(false);
  }

  async function saveCustomField(key: string, value: string) {
    setSaving(true);
    await api.patch(`/api/v1/leads/${id}`, { customFields: { [key]: value } });
    await load();
    setSaving(false);
  }

  async function changeStatus(nextStatus: string) {
    setSaving(true);
    await api.patch(`/api/v1/leads/${id}`, { status: nextStatus });
    await load();
    setSaving(false);
  }

  async function changeQualification(next: string) {
    setSaving(true);
    await api.patch(`/api/v1/leads/${id}`, { qualification: next });
    await load();
    setSaving(false);
  }

  async function markContacted() {
    setSaving(true);
    await api.post(`/api/v1/leads/${id}/contact`, {});
    await load();
    setSaving(false);
  }

  async function markReplied() {
    setSaving(true);
    await api.post(`/api/v1/leads/${id}/reply`, {});
    await load();
    setSaving(false);
  }

  async function addNote() {
    if (!noteText.trim()) return;
    setSaving(true);
    await api.post(`/api/v1/leads/${id}/notes`, { text: noteText.trim() });
    setNoteText('');
    await load();
    setSaving(false);
  }

  async function deleteLead() {
    const name = detail?.lead.name || 'this lead';
    if (!window.confirm(`Delete “${name}”? This removes the lead, notes, and sequence enrollments. This can’t be undone.`)) {
      return;
    }
    setDeleting(true);
    setError('');
    const res = await api.delete(`/api/v1/leads/${id}`);
    if (!res.ok) {
      setError(res.error);
      setDeleting(false);
      return;
    }
    router.push('/leads');
  }

  if (error) {
    return <div className="page text-sm font-medium text-red-600">{error}</div>;
  }

  if (!detail) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-brand" />
      </div>
    );
  }

  const { lead, notes, activity, contact, contactActivity, form } = detail;

  return (
    <div className="page">
      <Link
        href="/leads"
        className="mb-5 inline-flex items-center gap-1.5 text-xs font-semibold text-muted hover:text-ink"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to leads
      </Link>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-1">
          <section className="panel p-5">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink text-sm font-semibold text-white">
                {initials(lead.name)}
              </span>
              <div className="min-w-0">
                <h1 className="truncate text-lg font-semibold tracking-tight text-ink">{lead.name}</h1>
                <p className="text-sm text-muted">{lead.businessName || 'No company'}</p>
              </div>
            </div>

            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Email</dt>
                <dd className="min-w-0 truncate text-right font-medium text-ink">{lead.email || '—'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Phone</dt>
                <dd className="font-medium text-ink">{lead.phone || '—'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Source</dt>
                <dd className="font-medium text-ink">{lead.source || '—'}</dd>
              </div>
              {lead.sourcePath ? (
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Page</dt>
                  <dd className="min-w-0 truncate text-right font-medium text-ink">
                    <a
                      href={`${MARKETING_SITE_URL}${lead.sourcePath}`}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-brand hover:underline"
                      title={lead.sourcePath}
                    >
                      {lead.sourcePath}
                    </a>
                  </dd>
                </div>
              ) : null}
              {form || lead.formName || lead.formId ? (
                <div className="flex justify-between gap-4">
                  <dt className="text-muted">Form</dt>
                  <dd className="min-w-0 text-right font-medium text-ink">
                    {form ? (
                      <Link href={`/forms/${form.id}`} className="hover:text-brand hover:underline">
                        {form.name}
                      </Link>
                    ) : (
                      <span>{lead.formName || 'Unknown form'}</span>
                    )}
                    {lead.formTags?.length ? (
                      <div className="mt-1 flex flex-wrap justify-end gap-1">
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
                      <p className="mt-0.5 truncate font-mono text-[10px] font-normal text-muted" title={lead.formId}>
                        ID {lead.formId}
                      </p>
                    ) : null}
                  </dd>
                </div>
              ) : null}
              <div className="flex justify-between">
                <dt className="text-muted">Platform</dt>
                <dd className="font-medium text-ink">{lead.platform || '—'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Budget</dt>
                <dd className="font-medium text-ink">{lead.monthlyBudget || '—'}</dd>
              </div>
            </dl>

            {lead.message ? (
              <p className="mt-4 rounded-xl border border-border bg-canvas p-3 text-sm leading-relaxed text-ink">
                {lead.message}
              </p>
            ) : null}

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted">Status</label>
                <Select
                  value={lead.status}
                  disabled={saving}
                  onChange={(e) => changeStatus(e.target.value)}
                  className="bg-canvas"
                >
                  {CRM_LEAD_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {LEAD_STATUS_LABELS[s]}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted">Lead quality</label>
                <Select
                  value={lead.qualification}
                  disabled={saving}
                  onChange={(e) => changeQualification(e.target.value)}
                  className="bg-canvas"
                >
                  {LEAD_QUALIFICATIONS.map((q) => (
                    <option key={q} value={q}>
                      {LEAD_QUALIFICATION_LABELS[q]}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Button variant="outline" size="sm" disabled={saving || deleting} onClick={markContacted} className="flex-1">
                <Phone className="h-3.5 w-3.5" /> Contacted
              </Button>
              <Button variant="outline" size="sm" disabled={saving || deleting} onClick={markReplied} className="flex-1">
                <Send className="h-3.5 w-3.5" /> Replied
              </Button>
            </div>

            <Button
              variant="danger"
              size="sm"
              disabled={saving || deleting}
              onClick={() => void deleteLead()}
              className="mt-3 w-full"
            >
              {deleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
              Delete lead
            </Button>
          </section>

          {fieldDefs.length > 0 ? (
            <section className="panel p-5">
              <h2 className="mb-3 text-sm font-semibold text-ink">Custom properties</h2>
              <div className="space-y-3">
                {fieldDefs.map((def) => (
                  <div key={def.id} className="space-y-1">
                    <label className="text-xs font-semibold text-muted">{def.label}</label>
                    {def.type === 'select' ? (
                      <Select
                        defaultValue={String(lead.customFields[def.key] ?? '')}
                        disabled={saving}
                        onChange={(e) => saveCustomField(def.key, e.target.value)}
                        className="bg-canvas"
                      >
                        <option value="">—</option>
                        {def.options.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </Select>
                    ) : (
                      <Input
                        type={def.type === 'number' ? 'number' : def.type === 'date' ? 'date' : 'text'}
                        defaultValue={String(lead.customFields[def.key] ?? '')}
                        disabled={saving}
                        onBlur={(e) => saveCustomField(def.key, e.target.value)}
                        className="bg-canvas"
                      />
                    )}
                  </div>
                ))}
              </div>
            </section>
          ) : null}
        </div>

        <div className="space-y-5 lg:col-span-2">
          <section className="panel p-5">
            <h2 className="mb-3 text-sm font-semibold text-ink">Notes</h2>
            <div className="mb-3 flex gap-2">
              <Input
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') addNote();
                }}
                placeholder="Add a note…"
                className="flex-1 bg-canvas"
              />
              <Button onClick={addNote} disabled={saving || !noteText.trim()}>
                Add
              </Button>
            </div>
            <ul className="space-y-3">
              {notes.map((note) => (
                <li key={note.id} className="rounded-xl border border-border bg-canvas p-3">
                  <p className="text-sm text-ink">{note.text}</p>
                  <p className="mt-1 text-[11px] font-semibold text-muted">
                    {note.authorName} · {new Date(note.createdAt).toLocaleString()}
                  </p>
                </li>
              ))}
              {notes.length === 0 ? <p className="text-sm text-muted">No notes yet.</p> : null}
            </ul>
          </section>

          <section className="panel p-5">
            <h2 className="mb-3 text-sm font-semibold text-ink">Email sequences</h2>
            <div className="mb-3 flex gap-2">
              <Select
                value={selectedSequence}
                onChange={(e) => setSelectedSequence(e.target.value)}
                className="flex-1 bg-canvas"
              >
                <option value="">Select a sequence…</option>
                {sequences.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </Select>
              <Button disabled={saving || !selectedSequence} onClick={enroll}>
                Enroll
              </Button>
            </div>
            <ul className="space-y-2">
              {enrollments.map((e) => (
                <li
                  key={e.id}
                  className="flex items-center justify-between rounded-xl border border-border bg-canvas px-3 py-2.5 text-sm"
                >
                  <div>
                    <span className="font-medium text-ink">{e.sequenceName}</span>
                    <span className="ml-2 text-xs text-muted">
                      step {e.currentStep + 1} · {e.status}
                    </span>
                  </div>
                  {e.status === 'active' ? (
                    <button
                      type="button"
                      onClick={() => stopEnrollment(e.id)}
                      className="text-xs font-semibold text-muted hover:text-red-600"
                    >
                      Stop
                    </button>
                  ) : null}
                </li>
              ))}
              {enrollments.length === 0 ? (
                <p className="text-sm text-muted">Not enrolled in any sequence.</p>
              ) : null}
            </ul>
          </section>

          <section className="panel p-5">
            <h2 className="mb-4 text-sm font-semibold text-ink">Activity</h2>
            <ul>
              {activity.map((item, index) => (
                <li key={item.id} className="relative flex gap-3 pb-4 last:pb-0">
                  {index < activity.length - 1 ? (
                    <span className="absolute left-[5px] top-3 h-full w-px bg-border" />
                  ) : null}
                  <span className="relative mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-brand ring-4 ring-brand/15" />
                  <div className="flex min-w-0 flex-1 items-start justify-between gap-3">
                    <p className="text-sm text-ink">
                      {ACTIVITY_LABELS[item.action] ?? item.action}
                      {item.userName ? <span className="text-muted"> · {item.userName}</span> : null}
                    </p>
                    <span className="shrink-0 text-xs tabular-nums text-muted">
                      {new Date(item.createdAt).toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </li>
              ))}
              {activity.length === 0 ? <p className="text-sm text-muted">No activity yet.</p> : null}
            </ul>
          </section>

          {contact ? (
            <section className="panel p-5">
              <h2 className="mb-1 text-sm font-semibold text-ink">Visitor activity</h2>
              <p className="mb-3 text-xs text-muted">
                What this person did on the site before they became a lead — first seen{' '}
                {new Date(contact.firstSeenAt).toLocaleDateString()}.
              </p>
              <ul className="space-y-2">
                {contactActivity.map((item) => (
                  <li key={item.id} className="flex items-start justify-between text-sm">
                    <span className="min-w-0 truncate text-ink" title={item.url}>
                      {item.url || '—'}
                    </span>
                    <span className="ml-3 shrink-0 text-xs text-muted">
                      {new Date(item.createdAt).toLocaleString()}
                    </span>
                  </li>
                ))}
                {contactActivity.length === 0 ? (
                  <p className="text-sm text-muted">No page views recorded.</p>
                ) : null}
              </ul>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}
