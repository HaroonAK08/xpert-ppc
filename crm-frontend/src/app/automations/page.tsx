'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, Reorder, motion } from 'framer-motion';
import {
  ChevronDown,
  ChevronRight,
  Filter,
  GripVertical,
  Loader2,
  Mail,
  Pencil,
  Plus,
  Send,
  StickyNote,
  Tag,
  Trash2,
  UserPlus,
  X,
  Zap,
} from 'lucide-react';

import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CRM_LEAD_STATUSES, LEAD_STATUS_LABELS } from '@shared/crm/constants';

type Trigger = 'lead_created' | 'status_changed';
type ActionType = 'set_status' | 'assign_to' | 'add_note' | 'enroll_in_sequence' | 'send_email';

type Rule = {
  id: string;
  name: string;
  trigger: Trigger;
  fromStatus: string;
  toStatus: string;
  conditions: { field: 'source' | 'platform' | 'sourcePath'; value: string }[];
  actions: {
    type: ActionType;
    status?: string;
    userId?: string;
    text?: string;
    sequenceId?: string;
    subject?: string;
    body?: string;
  }[];
  enabled: boolean;
};

type TeamMember = { id: string; name: string; email: string };
type Sequence = { id: string; name: string };
type BuilderAction = {
  id: string;
  type: ActionType;
  status: string;
  userId: string;
  text: string;
  sequenceId: string;
  subject: string;
  body: string;
};

type BuilderState = {
  name: string;
  trigger: Trigger;
  fromStatus: string;
  toStatus: string;
  hasCondition: boolean;
  conditionField: 'source' | 'platform' | 'sourcePath';
  conditionValue: string;
  actions: BuilderAction[];
};

const ACTION_META: Record<ActionType, { label: string; icon: typeof Tag }> = {
  set_status: { label: 'Set status', icon: Tag },
  assign_to: { label: 'Assign to', icon: UserPlus },
  add_note: { label: 'Add a note', icon: StickyNote },
  enroll_in_sequence: { label: 'Enroll in sequence', icon: Mail },
  send_email: { label: 'Send email', icon: Send },
};

const COLORS = {
  trigger: 'bg-blue-100 text-blue-600',
  condition: 'bg-amber-100 text-amber-600',
  action: 'bg-emerald-100 text-emerald-700',
};

const CONDITION_FIELD_LABELS: Record<'source' | 'platform' | 'sourcePath', string> = {
  source: 'source',
  platform: 'platform',
  sourcePath: 'page',
};

const fieldClass =
  'w-full appearance-none rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink outline-none transition-shadow focus:border-brand focus:ring-2 focus:ring-brand/20';

function newAction(partial?: Partial<BuilderAction>): BuilderAction {
  return {
    id: Math.random().toString(36).slice(2),
    type: 'set_status',
    status: CRM_LEAD_STATUSES[0],
    userId: '',
    text: '',
    sequenceId: '',
    subject: '',
    body: '',
    ...partial,
  };
}

function emptyBuilder(): BuilderState {
  return {
    name: '',
    trigger: 'lead_created',
    fromStatus: '',
    toStatus: '',
    hasCondition: false,
    conditionField: 'source',
    conditionValue: '',
    actions: [newAction()],
  };
}

function ruleToBuilder(rule: Rule): BuilderState {
  const condition = rule.conditions[0];
  return {
    name: rule.name,
    trigger: rule.trigger,
    fromStatus: rule.fromStatus || '',
    toStatus: rule.toStatus || '',
    hasCondition: Boolean(condition),
    conditionField: condition?.field || 'source',
    conditionValue: condition?.value || '',
    actions: rule.actions.length
      ? rule.actions.map((a) =>
          newAction({
            type: a.type,
            status: a.status || CRM_LEAD_STATUSES[0],
            userId: a.userId || '',
            text: a.text || '',
            sequenceId: a.sequenceId || '',
            subject: a.subject || '',
            body: a.body || '',
          })
        )
      : [newAction()],
  };
}

function builderPayload(state: BuilderState) {
  return {
    name: state.name.trim(),
    trigger: state.trigger,
    fromStatus: state.trigger === 'status_changed' ? state.fromStatus : '',
    toStatus: state.trigger === 'status_changed' ? state.toStatus : '',
    conditions:
      state.hasCondition && state.conditionValue
        ? [{ field: state.conditionField, value: state.conditionValue }]
        : [],
    actions: state.actions.map((a) =>
      a.type === 'set_status'
        ? { type: 'set_status' as const, status: a.status }
        : a.type === 'assign_to'
          ? { type: 'assign_to' as const, userId: a.userId }
          : a.type === 'add_note'
            ? { type: 'add_note' as const, text: a.text }
            : a.type === 'enroll_in_sequence'
              ? { type: 'enroll_in_sequence' as const, sequenceId: a.sequenceId }
              : { type: 'send_email' as const, subject: a.subject, body: a.body }
    ),
  };
}

function Switch({
  checked,
  onChange,
  disabled,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
  label?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label ?? (checked ? 'Enabled' : 'Disabled')}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/15 disabled:cursor-not-allowed disabled:opacity-40 ${
        checked ? 'bg-brand' : 'bg-slate-300'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm ring-1 ring-black/5 transition-transform duration-200 ease-out ${
          checked ? 'translate-x-[1.375rem]' : 'translate-x-0.5'
        }`}
      />
    </button>
  );
}

function FieldSelect({
  className = '',
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select {...props} className={`${fieldClass} pr-8 ${className}`}>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
    </div>
  );
}

function Connector() {
  return (
    <div className="relative flex justify-center py-1.5">
      <span className="absolute top-0 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-border" />
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.2 }}
        style={{ transformOrigin: 'top' }}
        className="h-5 w-0.5 bg-gradient-to-b from-border to-border/40"
      />
      <span className="absolute bottom-0 h-1.5 w-1.5 translate-y-1/2 rounded-full bg-border" />
    </div>
  );
}

function StepCard({
  color,
  icon: Icon,
  title,
  onRemove,
  children,
}: {
  color: string;
  icon: typeof Tag;
  title: string;
  onRemove?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-canvas p-3.5 shadow-sm transition-shadow hover:shadow-panel">
      <div className="mb-2.5 flex items-center gap-2">
        <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg ${color}`}>
          <Icon className="h-3.5 w-3.5" />
        </span>
        <p className="flex-1 text-[11px] font-bold uppercase tracking-wide text-muted">{title}</p>
        {onRemove ? (
          <button type="button" onClick={onRemove} className="text-muted transition-colors hover:text-red-600">
            <X className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </div>
      {children}
    </div>
  );
}

function Chip({ color, icon: Icon, children }: { color: string; icon: typeof Tag; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold ${color}`}>
      <Icon className="h-3 w-3" />
      {children}
    </span>
  );
}

function RuleFlow({
  rule,
  teamName,
  sequenceName,
}: {
  rule: Rule;
  teamName: (id: string) => string;
  sequenceName: (id: string) => string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <Chip color={COLORS.trigger} icon={Zap}>
        {rule.trigger === 'lead_created'
          ? 'Lead created'
          : `Status → ${rule.toStatus ? LEAD_STATUS_LABELS[rule.toStatus as keyof typeof LEAD_STATUS_LABELS] || rule.toStatus : 'anything'}`}
      </Chip>
      {rule.conditions.length ? (
        <>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted" />
          <Chip color={COLORS.condition} icon={Filter}>
            {CONDITION_FIELD_LABELS[rule.conditions[0].field]} = {rule.conditions[0].value}
          </Chip>
        </>
      ) : null}
      {rule.actions.map((a, i) => {
        const meta = ACTION_META[a.type];
        return (
          <span key={i} className="flex items-center gap-1.5">
            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted" />
            <Chip color={COLORS.action} icon={meta.icon}>
              {a.type === 'set_status'
                ? `Set status: ${a.status}`
                : a.type === 'assign_to'
                  ? `Assign: ${teamName(a.userId || '')}`
                  : a.type === 'add_note'
                    ? 'Add note'
                    : a.type === 'enroll_in_sequence'
                      ? `Enroll: ${sequenceName(a.sequenceId || '')}`
                      : `Email: ${a.subject || '(no subject)'}`}
            </Chip>
          </span>
        );
      })}
    </div>
  );
}

function RuleBuilder({
  state,
  onChange,
  team,
  sequences,
  sourceValues,
  platformValues,
  sourcePathValues,
  datalistId,
}: {
  state: BuilderState;
  onChange: (next: BuilderState | ((prev: BuilderState) => BuilderState)) => void;
  team: TeamMember[];
  sequences: Sequence[];
  sourceValues: string[];
  platformValues: string[];
  sourcePathValues: string[];
  datalistId: string;
}) {
  function patch(partial: Partial<BuilderState>) {
    onChange((prev) => ({ ...prev, ...partial }));
  }

  function updateAction(id: string, actionPatch: Partial<BuilderAction>) {
    onChange((prev) => ({
      ...prev,
      actions: prev.actions.map((a) => (a.id === id ? { ...a, ...actionPatch } : a)),
    }));
  }

  function removeAction(id: string) {
    onChange((prev) => ({
      ...prev,
      actions: prev.actions.length > 1 ? prev.actions.filter((a) => a.id !== id) : prev.actions,
    }));
  }

  return (
    <div className="mx-auto max-w-xl">
      <Input
        value={state.name}
        onChange={(e) => patch({ name: e.target.value })}
        placeholder="Rule name, e.g. Auto-assign Meta leads"
        className="mb-4 bg-canvas"
      />

      <StepCard color={COLORS.trigger} icon={Zap} title="Trigger">
        <div className="grid gap-2 sm:grid-cols-2">
          <FieldSelect
            value={state.trigger}
            onChange={(e) => patch({ trigger: e.target.value as Trigger })}
          >
            <option value="lead_created">When a lead is created</option>
            <option value="status_changed">When status changes</option>
          </FieldSelect>
          {state.trigger === 'status_changed' ? (
            <FieldSelect value={state.toStatus} onChange={(e) => patch({ toStatus: e.target.value })}>
              <option value="">To any status</option>
              {CRM_LEAD_STATUSES.map((s) => (
                <option key={s} value={s}>
                  To {LEAD_STATUS_LABELS[s]}
                </option>
              ))}
            </FieldSelect>
          ) : null}
        </div>
        {state.trigger === 'status_changed' ? (
          <div className="mt-2">
            <FieldSelect value={state.fromStatus} onChange={(e) => patch({ fromStatus: e.target.value })}>
              <option value="">From any status</option>
              {CRM_LEAD_STATUSES.map((s) => (
                <option key={s} value={s}>
                  From {LEAD_STATUS_LABELS[s]}
                </option>
              ))}
            </FieldSelect>
          </div>
        ) : null}
      </StepCard>

      <Connector />

      {state.hasCondition ? (
        <>
          <StepCard
            color={COLORS.condition}
            icon={Filter}
            title="Condition"
            onRemove={() => patch({ hasCondition: false, conditionValue: '' })}
          >
            <div className="grid grid-cols-2 gap-2">
              <FieldSelect
                value={state.conditionField}
                onChange={(e) =>
                  patch({ conditionField: e.target.value as 'source' | 'platform' | 'sourcePath' })
                }
              >
                <option value="source">If source equals…</option>
                <option value="platform">If platform equals…</option>
                <option value="sourcePath">If page equals…</option>
              </FieldSelect>
              <input
                value={state.conditionValue}
                onChange={(e) => patch({ conditionValue: e.target.value })}
                placeholder={
                  state.conditionField === 'sourcePath' ? 'e.g. /lp/dermatologist' : 'e.g. meta_ads'
                }
                list={datalistId}
                className={fieldClass}
              />
              <datalist id={datalistId}>
                {(state.conditionField === 'source'
                  ? sourceValues
                  : state.conditionField === 'platform'
                    ? platformValues
                    : sourcePathValues
                ).map((v) => (
                  <option key={v} value={v} />
                ))}
              </datalist>
            </div>
          </StepCard>
          <Connector />
        </>
      ) : (
        <button
          type="button"
          onClick={() => patch({ hasCondition: true })}
          className="mb-1 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-border py-2.5 text-xs font-semibold text-muted transition-colors hover:border-amber-300 hover:bg-amber-50/50 hover:text-amber-600"
        >
          <Plus className="h-3.5 w-3.5" /> Add a condition
        </button>
      )}

      {state.hasCondition ? null : <Connector />}

      <Reorder.Group
        axis="y"
        values={state.actions}
        onReorder={(actions) => patch({ actions })}
        className="space-y-0"
      >
        <AnimatePresence initial={false}>
          {state.actions.map((a, i) => {
            const meta = ACTION_META[a.type];
            return (
              <Reorder.Item key={a.id} value={a} as="div">
                {i > 0 ? <Connector /> : null}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <StepCard
                    color={COLORS.action}
                    icon={meta.icon}
                    title={`Action ${state.actions.length > 1 ? i + 1 : ''}`}
                    onRemove={state.actions.length > 1 ? () => removeAction(a.id) : undefined}
                  >
                    <div className="flex items-start gap-2">
                      {state.actions.length > 1 ? (
                        <GripVertical className="mt-2.5 h-3.5 w-3.5 shrink-0 cursor-grab text-muted active:cursor-grabbing" />
                      ) : null}
                      <div className="grid flex-1 gap-2 sm:grid-cols-2">
                        <FieldSelect
                          value={a.type}
                          onChange={(e) => updateAction(a.id, { type: e.target.value as ActionType })}
                        >
                          <option value="set_status">Set status</option>
                          <option value="assign_to">Assign to</option>
                          <option value="add_note">Add a note</option>
                          <option value="enroll_in_sequence">Enroll in sequence</option>
                          <option value="send_email">Send email</option>
                        </FieldSelect>

                        {a.type === 'set_status' ? (
                          <FieldSelect
                            value={a.status}
                            onChange={(e) => updateAction(a.id, { status: e.target.value })}
                          >
                            {CRM_LEAD_STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {LEAD_STATUS_LABELS[s]}
                              </option>
                            ))}
                          </FieldSelect>
                        ) : a.type === 'assign_to' ? (
                          <FieldSelect
                            value={a.userId}
                            onChange={(e) => updateAction(a.id, { userId: e.target.value })}
                          >
                            <option value="">Select a team member</option>
                            {team.map((m) => (
                              <option key={m.id} value={m.id}>
                                {m.name}
                              </option>
                            ))}
                          </FieldSelect>
                        ) : a.type === 'add_note' ? (
                          <input
                            value={a.text}
                            onChange={(e) => updateAction(a.id, { text: e.target.value })}
                            placeholder="Note text"
                            className={fieldClass}
                          />
                        ) : a.type === 'enroll_in_sequence' ? (
                          <FieldSelect
                            value={a.sequenceId}
                            onChange={(e) => updateAction(a.id, { sequenceId: e.target.value })}
                          >
                            <option value="">Select a sequence</option>
                            {sequences.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.name}
                              </option>
                            ))}
                          </FieldSelect>
                        ) : (
                          <input
                            value={a.subject}
                            onChange={(e) => updateAction(a.id, { subject: e.target.value })}
                            placeholder="Subject, e.g. Thanks for reaching out"
                            className={fieldClass}
                          />
                        )}

                        {a.type === 'send_email' ? (
                          <textarea
                            value={a.body}
                            onChange={(e) => updateAction(a.id, { body: e.target.value })}
                            placeholder="Email body — use {{name}} to insert the lead's name"
                            rows={3}
                            className={`${fieldClass} sm:col-span-2`}
                          />
                        ) : null}
                      </div>
                    </div>
                  </StepCard>
                </motion.div>
              </Reorder.Item>
            );
          })}
        </AnimatePresence>
      </Reorder.Group>

      <button
        type="button"
        onClick={() => onChange((prev) => ({ ...prev, actions: [...prev.actions, newAction()] }))}
        className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-border py-2.5 text-xs font-semibold text-muted transition-colors hover:border-emerald-300 hover:bg-emerald-50/50 hover:text-emerald-600"
      >
        <Plus className="h-3.5 w-3.5" /> Add another action
      </button>
    </div>
  );
}

export default function AutomationsSettingsPage() {
  const [rules, setRules] = useState<Rule[] | null>(null);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [sequences, setSequences] = useState<Sequence[]>([]);
  const [sourceValues, setSourceValues] = useState<string[]>([]);
  const [platformValues, setPlatformValues] = useState<string[]>([]);
  const [sourcePathValues, setSourcePathValues] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const [createState, setCreateState] = useState<BuilderState>(emptyBuilder);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editState, setEditState] = useState<BuilderState>(emptyBuilder);

  function teamName(id: string) {
    return team.find((m) => m.id === id)?.name || 'a team member';
  }

  function sequenceName(id: string) {
    return sequences.find((s) => s.id === id)?.name || 'a sequence';
  }

  async function load() {
    const [rulesRes, teamRes, sequencesRes, sourceRes, platformRes, sourcePathRes] = await Promise.all([
      api.get<Rule[]>('/api/v1/automations'),
      api.get<TeamMember[]>('/api/v1/team'),
      api.get<Sequence[]>('/api/v1/sequences'),
      api.get<string[]>('/api/v1/automations/field-values?field=source'),
      api.get<string[]>('/api/v1/automations/field-values?field=platform'),
      api.get<string[]>('/api/v1/automations/field-values?field=sourcePath'),
    ]);
    if (rulesRes.ok) setRules(rulesRes.data);
    else setError(rulesRes.error);
    if (teamRes.ok) setTeam(teamRes.data);
    if (sequencesRes.ok) setSequences(sequencesRes.data);
    if (sourceRes.ok) setSourceValues(sourceRes.data);
    if (platformRes.ok) setPlatformValues(platformRes.data);
    if (sourcePathRes.ok) setSourcePathValues(sourcePathRes.data);
  }

  useEffect(() => {
    load();
  }, []);

  function openRule(rule: Rule) {
    if (editingId === rule.id) {
      setEditingId(null);
      return;
    }
    setEditingId(rule.id);
    setEditState(ruleToBuilder(rule));
    setError('');
  }

  async function create() {
    if (!createState.name.trim()) return;
    setSaving(true);
    setError('');

    const res = await api.post('/api/v1/automations', builderPayload(createState));

    setSaving(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setCreateState(emptyBuilder());
    load();
  }

  async function saveEdit() {
    if (!editingId || !editState.name.trim()) return;
    setSaving(true);
    setError('');

    const res = await api.patch(`/api/v1/automations/${editingId}`, builderPayload(editState));

    setSaving(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setEditingId(null);
    load();
  }

  async function toggle(rule: Rule) {
    setSaving(true);
    await api.patch(`/api/v1/automations/${rule.id}`, { enabled: !rule.enabled });
    await load();
    setSaving(false);
  }

  async function remove(id: string) {
    setSaving(true);
    if (editingId === id) setEditingId(null);
    await api.delete(`/api/v1/automations/${id}`);
    await load();
    setSaving(false);
  }

  if (error && !rules) {
    return <div className="page text-sm font-medium text-red-600">{error}</div>;
  }

  if (!rules) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-brand" />
      </div>
    );
  }

  return (
    <div className="page">
      <h1 className="page-title mb-2">Automations</h1>
      <p className="mb-8 text-sm text-muted">Rules that run when a lead is created or its status changes.</p>

      <div className="mb-6 rounded-2xl border border-border bg-surface p-6">
        <p className="mb-1 text-sm font-semibold text-ink">Automation rules</p>
        <p className="mb-4 text-sm text-muted">
          Click a rule to open it and edit the trigger, conditions, and actions.
        </p>

        <div className="space-y-2">
          {rules.map((rule) => {
            const open = editingId === rule.id;
            return (
              <div
                key={rule.id}
                className={`rounded-xl bg-canvas transition-shadow ${
                  open ? 'ring-2 ring-brand/25 shadow-sm' : 'hover:shadow-sm'
                }`}
              >
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => openRule(rule)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openRule(rule);
                    }
                  }}
                  className="cursor-pointer p-3.5"
                >
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold text-ink">{rule.name}</p>
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-muted">
                          {open ? (
                            <>
                              <ChevronDown className="h-3.5 w-3.5" /> Editing
                            </>
                          ) : (
                            <>
                              <Pencil className="h-3 w-3" /> Click to edit
                            </>
                          )}
                        </span>
                      </div>
                      <p className="text-[11px] font-medium text-muted">
                        {rule.enabled ? 'On — rule will run' : 'Off — rule is paused'}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2.5" onClick={(e) => e.stopPropagation()}>
                      <Switch
                        checked={rule.enabled}
                        disabled={saving}
                        onChange={() => toggle(rule)}
                        label={rule.enabled ? `Disable ${rule.name}` : `Enable ${rule.name}`}
                      />
                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => remove(rule.id)}
                        className="rounded-lg p-1.5 text-muted transition-colors hover:bg-surface hover:text-red-600"
                        aria-label={`Delete ${rule.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  {!open ? (
                    <RuleFlow rule={rule} teamName={teamName} sequenceName={sequenceName} />
                  ) : null}
                </div>

                <AnimatePresence initial={false}>
                  {open ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-border px-3.5 pb-4 pt-3">
                        <RuleBuilder
                          state={editState}
                          onChange={setEditState}
                          team={team}
                          sequences={sequences}
                          sourceValues={sourceValues}
                          platformValues={platformValues}
                          sourcePathValues={sourcePathValues}
                          datalistId={`edit-condition-${rule.id}`}
                        />
                        <div className="mt-4 flex flex-wrap gap-2">
                          <Button disabled={saving || !editState.name.trim()} onClick={() => void saveEdit()}>
                            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                            Save changes
                          </Button>
                          <Button
                            variant="outline"
                            disabled={saving}
                            onClick={() => setEditingId(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
          {rules.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border p-4 text-center text-sm text-muted">
              No automation rules yet — build one below.
            </p>
          ) : null}
        </div>
      </div>

      {error ? <p className="mb-4 text-sm font-medium text-red-600">{error}</p> : null}

      <div className="rounded-2xl border border-border bg-surface p-6">
        <p className="mb-4 text-xs font-bold uppercase tracking-wide text-muted">New rule</p>
        <RuleBuilder
          state={createState}
          onChange={setCreateState}
          team={team}
          sequences={sequences}
          sourceValues={sourceValues}
          platformValues={platformValues}
          sourcePathValues={sourcePathValues}
          datalistId="create-condition-options"
        />
        <Button
          disabled={saving || !createState.name.trim()}
          onClick={() => void create()}
          className="mt-5"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Create rule
        </Button>
      </div>
    </div>
  );
}
