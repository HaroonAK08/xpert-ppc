'use client';

import { useEffect, useState } from 'react';
import { Loader2, Plus, Trash2 } from 'lucide-react';

type Step = { delayHours: number; subject: string; body: string };

type Sequence = {
  id: string;
  name: string;
  steps: Step[];
  enabled: boolean;
};

import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';

const EMPTY_STEP: Step = { delayHours: 0, subject: '', body: '' };

export default function SequencesSettingsPage() {
  const [sequences, setSequences] = useState<Sequence[] | null>(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState('');
  const [steps, setSteps] = useState<Step[]>([{ ...EMPTY_STEP }]);

  async function load() {
    const res = await api.get<Sequence[]>('/api/v1/sequences');
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setSequences(res.data);
  }

  useEffect(() => {
    load();
  }, []);

  function updateStep(i: number, patch: Partial<Step>) {
    setSteps((prev) => prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  }

  async function create() {
    if (!name.trim() || steps.some((s) => !s.subject.trim() || !s.body.trim())) return;
    setSaving(true);
    setError('');
    const res = await api.post('/api/v1/sequences', { name: name.trim(), steps });
    setSaving(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setName('');
    setSteps([{ ...EMPTY_STEP }]);
    load();
  }

  async function toggle(seq: Sequence) {
    setSaving(true);
    await api.patch(`/api/v1/sequences/${seq.id}`, { enabled: !seq.enabled });
    await load();
    setSaving(false);
  }

  async function remove(id: string) {
    setSaving(true);
    await api.delete(`/api/v1/sequences/${id}`);
    await load();
    setSaving(false);
  }

  if (!sequences) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-brand" />
      </div>
    );
  }

  return (
    <div className="page">
      <h1 className="page-title mb-2">Email sequences</h1>
      <p className="mb-8 text-sm text-muted">Timed emails that start once a lead is enrolled.</p>
      <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-surface p-6">
        <p className="mb-1 text-sm font-semibold text-ink">Email sequences</p>
        <p className="mb-4 text-sm text-muted">
          A series of timed emails sent automatically once a lead is enrolled (from the lead
          detail page). Use <code className="rounded bg-canvas px-1">{'{{name}}'}</code> in a
          subject or body to insert the lead&apos;s name. Every email includes an unsubscribe link.
        </p>

        <ul className="mb-5 space-y-2">
          {sequences.map((seq) => (
            <li key={seq.id} className="rounded-xl bg-canvas px-4 py-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-ink">{seq.name}</p>
                  <p className="text-xs text-muted">
                    {seq.steps.length} step{seq.steps.length === 1 ? '' : 's'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => toggle(seq)}
                    className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                      seq.enabled ? 'bg-green-100 text-green-700' : 'bg-surface text-muted'
                    }`}
                  >
                    {seq.enabled ? 'Enabled' : 'Disabled'}
                  </button>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => remove(seq.id)}
                    className="text-muted hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
          {sequences.length === 0 ? <p className="text-sm text-muted">No sequences yet.</p> : null}
        </ul>

        {error ? <p className="mb-3 text-sm font-medium text-red-600">{error}</p> : null}

        <div className="space-y-3 border-t border-border pt-4">
          <p className="text-xs font-bold uppercase tracking-wide text-muted">New sequence</p>

          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Sequence name, e.g. New lead follow-up"
            className="bg-canvas"
          />

          {steps.map((step, i) => (
            <div key={i} className="space-y-2 rounded-xl border border-border p-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-muted">Step {i + 1}</p>
                {steps.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => setSteps((prev) => prev.filter((_, idx) => idx !== i))}
                    className="text-xs text-muted hover:text-red-600"
                  >
                    Remove
                  </button>
                ) : null}
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted">Send after</span>
                <Input
                  type="number"
                  min={0}
                  value={step.delayHours}
                  onChange={(e) => updateStep(i, { delayHours: Number(e.target.value) })}
                  className="w-20 bg-canvas"
                />
                <span className="text-muted">hours</span>
              </div>
              <Input
                value={step.subject}
                onChange={(e) => updateStep(i, { subject: e.target.value })}
                placeholder="Subject"
                className="bg-canvas"
              />
              <Textarea
                value={step.body}
                onChange={(e) => updateStep(i, { body: e.target.value })}
                placeholder="Email body"
                rows={3}
                className="bg-canvas"
              />
            </div>
          ))}

          <button
            type="button"
            onClick={() => setSteps((prev) => [...prev, { ...EMPTY_STEP }])}
            className="text-xs font-semibold text-brand"
          >
            + Add another step
          </button>

          <div>
            <Button disabled={saving || !name.trim()} onClick={create}>
              <Plus className="h-4 w-4" /> Create sequence
            </Button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
