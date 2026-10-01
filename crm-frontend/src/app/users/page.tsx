'use client';

import { useEffect, useState } from 'react';
import { Eye, EyeOff, Loader2, Plus, Trash2 } from 'lucide-react';

import { api, type ClientField, type CrmClient } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function UsersPage() {
  const [users, setUsers] = useState<CrmClient[] | null>(null);
  const [fields, setFields] = useState<ClientField[]>([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(true);
  const [fieldId, setFieldId] = useState('');
  const [newFieldName, setNewFieldName] = useState('');
  const [resetPassword, setResetPassword] = useState<Record<string, string>>({});
  const [showReset, setShowReset] = useState<Record<string, boolean>>({});
  const [createdPasswordHint, setCreatedPasswordHint] = useState<{ email: string; password: string } | null>(
    null
  );

  async function load() {
    const [usersRes, fieldsRes] = await Promise.all([
      api.get<CrmClient[]>('/api/v1/clients'),
      api.get<ClientField[]>('/api/v1/client-fields'),
    ]);
    if (!usersRes.ok) {
      setError(usersRes.error);
      return;
    }
    setUsers(usersRes.data);
    if (fieldsRes.ok) setFields(fieldsRes.data);
  }

  useEffect(() => {
    void load();
  }, []);

  async function createField() {
    if (!newFieldName.trim()) return;
    setSaving(true);
    setError('');
    const res = await api.post<ClientField>('/api/v1/client-fields', { name: newFieldName.trim() });
    setSaving(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setNewFieldName('');
    setFieldId(res.data.id);
    await load();
  }

  async function deleteField(field: ClientField) {
    if (!window.confirm(`Delete company/field “${field.name}”?`)) return;
    setSaving(true);
    setError('');
    const res = await api.delete(`/api/v1/client-fields/${field.id}`);
    setSaving(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    if (fieldId === field.id) setFieldId('');
    await load();
  }

  async function createUser() {
    if (!name.trim() || !email.trim() || password.length < 8) {
      setError('Name, email, and a password of at least 8 characters are required.');
      return;
    }
    if (!fieldId) {
      setError('Pick or create a company/field for this user.');
      return;
    }
    setSaving(true);
    setError('');
    const plainPassword = password;
    const res = await api.post('/api/v1/clients', {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: plainPassword,
      fieldId,
    });
    setSaving(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setCreatedPasswordHint({ email: email.trim().toLowerCase(), password: plainPassword });
    setName('');
    setEmail('');
    setPassword('');
    await load();
  }

  async function toggleActive(user: CrmClient) {
    setSaving(true);
    setError('');
    const res = await api.patch(`/api/v1/clients/${user.id}`, { active: !user.active });
    setSaving(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    await load();
  }

  async function changeField(user: CrmClient, nextFieldId: string) {
    setSaving(true);
    setError('');
    const res = await api.patch(`/api/v1/clients/${user.id}`, {
      fieldId: nextFieldId || null,
    });
    setSaving(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    await load();
  }

  async function changePassword(userId: string) {
    const next = (resetPassword[userId] || '').trim();
    if (next.length < 8) {
      setError('New password must be at least 8 characters.');
      return;
    }
    setSaving(true);
    setError('');
    const res = await api.patch(`/api/v1/clients/${userId}`, { password: next });
    setSaving(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setResetPassword((prev) => ({ ...prev, [userId]: '' }));
    await load();
  }

  async function removeUser(user: CrmClient) {
    if (!window.confirm(`Deactivate ${user.name}? They won’t be able to sign in.`)) return;
    setSaving(true);
    setError('');
    const res = await api.delete(`/api/v1/clients/${user.id}`);
    setSaving(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    await load();
  }

  return (
    <div className="page">
      <h1 className="page-title mb-2">Users</h1>
      <p className="mb-8 text-sm text-muted">
        Separate company/field teams. Users only see leads for their company — not your form, Meta,
        or main pipeline leads.
      </p>

      {error ? <p className="mb-4 text-sm font-medium text-red-600">{error}</p> : null}

      {createdPasswordHint ? (
        <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          <p className="font-semibold">User created — share these login details now:</p>
          <p className="mt-1 font-mono text-xs">
            {createdPasswordHint.email} · {createdPasswordHint.password}
          </p>
          <p className="mt-1 text-xs text-emerald-800/80">
            Passwords are hashed after save and can’t be shown again later.
          </p>
          <button
            type="button"
            className="mt-2 text-xs font-semibold text-emerald-800 underline"
            onClick={() => setCreatedPasswordHint(null)}
          >
            Dismiss
          </button>
        </div>
      ) : null}

      <div className="mb-6 rounded-2xl border border-border bg-surface p-5">
        <p className="mb-3 text-xs font-bold uppercase tracking-wide text-muted">Companies / fields</p>
        <div className="mb-3 flex flex-wrap gap-2">
          {fields.map((f) => (
            <span
              key={f.id}
              className="inline-flex items-center gap-1.5 rounded-full bg-canvas px-2.5 py-1 text-xs font-semibold text-ink ring-1 ring-border"
            >
              {f.name}
              <span className="text-muted">({f.userCount})</span>
              <button
                type="button"
                disabled={saving}
                onClick={() => void deleteField(f)}
                className="text-muted hover:text-red-600"
                aria-label={`Delete ${f.name}`}
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </span>
          ))}
          {fields.length === 0 ? (
            <span className="text-xs text-muted">No companies yet — add one below.</span>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <Input
            value={newFieldName}
            onChange={(e) => setNewFieldName(e.target.value)}
            placeholder="New company/field name, e.g. Agency North"
            className="max-w-sm bg-canvas"
          />
          <Button
            variant="outline"
            disabled={saving || !newFieldName.trim()}
            onClick={() => void createField()}
          >
            <Plus className="h-4 w-4" /> Add company
          </Button>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-border bg-surface p-5">
        <p className="mb-3 text-xs font-bold uppercase tracking-wide text-muted">Add user</p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            className="bg-canvas"
          />
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="bg-canvas"
          />
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password (min 8)"
              className="bg-canvas pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted hover:text-ink"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <select
            value={fieldId}
            onChange={(e) => setFieldId(e.target.value)}
            className="w-full rounded-lg border border-border bg-canvas px-3.5 py-2 text-sm text-ink outline-none focus:border-brand focus:ring-4 focus:ring-brand/10"
          >
            <option value="">Select company/field…</option>
            {fields.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
          <Button
            disabled={saving || !name.trim() || !email.trim() || password.length < 8 || !fieldId}
            onClick={() => void createUser()}
            className="sm:col-span-2 lg:col-span-1"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Add user
          </Button>
        </div>
      </div>

      {!users ? (
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-brand" />
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <div key={user.id} className="rounded-2xl border border-border bg-surface p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
                  <p className="truncate text-xs text-muted">{user.email}</p>
                  <p className="mt-1 text-[11px] text-muted">
                    {user.fieldName ? (
                      <span className="font-semibold text-ink">{user.fieldName}</span>
                    ) : (
                      <span className="text-amber-700">No company assigned</span>
                    )}
                    {' · '}
                    {user.leadCount} lead{user.leadCount === 1 ? '' : 's'}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={
                      user.active
                        ? 'rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 ring-1 ring-emerald-100'
                        : 'rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200'
                    }
                  >
                    {user.active ? 'Active' : 'Inactive'}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={saving}
                    onClick={() => void toggleActive(user)}
                  >
                    {user.active ? 'Disable' : 'Enable'}
                  </Button>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => void removeUser(user)}
                    className="rounded-lg p-1.5 text-muted transition-colors hover:bg-canvas hover:text-red-600"
                    aria-label={`Deactivate ${user.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-3">
                <select
                  value={user.fieldId || ''}
                  disabled={saving}
                  onChange={(e) => void changeField(user, e.target.value)}
                  className="rounded-lg border border-border bg-canvas px-2.5 py-1.5 text-xs text-ink outline-none focus:border-brand"
                >
                  <option value="">No company</option>
                  {fields.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
                <div className="relative">
                  <Input
                    type={showReset[user.id] ? 'text' : 'password'}
                    value={resetPassword[user.id] || ''}
                    onChange={(e) =>
                      setResetPassword((prev) => ({ ...prev, [user.id]: e.target.value }))
                    }
                    placeholder="New password"
                    className="max-w-xs bg-canvas pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowReset((prev) => ({ ...prev, [user.id]: !prev[user.id] }))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted hover:text-ink"
                    aria-label="Toggle password visibility"
                  >
                    {showReset[user.id] ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={saving || (resetPassword[user.id] || '').length < 8}
                  onClick={() => void changePassword(user.id)}
                >
                  Reset password
                </Button>
              </div>
            </div>
          ))}
          {users.length === 0 ? (
            <p className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted">
              No users yet — create a company/field first, then add a user to it.
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}
