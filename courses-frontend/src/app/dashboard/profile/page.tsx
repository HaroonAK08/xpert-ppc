'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Loader2, LogOut, Mail, UserCircle } from 'lucide-react';
import { api } from '@/lib/api';
import { useStudent, useUpdateStudent, logoutStudent } from '@/lib/student-context';
import { DashboardPageHeader } from '@/components/dashboard/page-header';

export default function ProfilePage() {
  const student = useStudent();
  const updateStudent = useUpdateStudent();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<string | null>(null);

  const avatarSrc = preview || student?.avatarUrl || '';

  async function onPick(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file (JPG, PNG, or WebP).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be 10 MB or smaller.');
      return;
    }

    setError('');
    setUploading(true);
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);

    try {
      const body = new FormData();
      body.append('file', file);
      const uploadRes = await fetch('/api/upload-image', { method: 'POST', body });
      const uploadData = (await uploadRes.json()) as { url?: string; error?: string };
      if (!uploadRes.ok || !uploadData.url) {
        throw new Error(uploadData.error || 'Failed to upload photo.');
      }

      const saveRes = await api.patch<{ ok: boolean; user: NonNullable<typeof student> }>(
        '/api/student/auth/profile',
        { avatarUrl: uploadData.url }
      );
      if (!saveRes.ok) throw new Error(saveRes.error);

      updateStudent(saveRes.data.user);
      setPreview(null);
    } catch (err) {
      setPreview(null);
      setError(err instanceof Error ? err.message : 'Could not update profile photo.');
    } finally {
      URL.revokeObjectURL(localUrl);
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <>
      <DashboardPageHeader title="My Profile" />
      <main className="px-5 py-8 sm:px-8">
        <h2 className="text-2xl font-extrabold tracking-tight text-ink">Account details</h2>
        <p className="mt-1 text-sm text-muted">Your student profile for the XpertPPC academy.</p>

        <div className="mt-6 max-w-xl panel p-6">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              {avatarSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarSrc}
                  alt={student?.name ? `${student.name} profile photo` : 'Profile photo'}
                  className="h-20 w-20 rounded-full object-cover ring-2 ring-brand/20"
                />
              ) : (
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-soft text-brand">
                  <UserCircle className="h-11 w-11" strokeWidth={1.5} />
                </span>
              )}
              <button
                type="button"
                disabled={uploading}
                onClick={() => inputRef.current?.click()}
                className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-brand text-white shadow-sm transition hover:bg-brand/90 disabled:opacity-60"
                aria-label="Upload profile photo"
              >
                {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Camera className="h-3.5 w-3.5" />}
              </button>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => void onPick(e.target.files?.[0])}
              />
            </div>
            <div>
              <p className="text-lg font-extrabold text-ink">{student?.name ?? '—'}</p>
              <p className="text-sm text-muted">Student account</p>
              <button
                type="button"
                disabled={uploading}
                onClick={() => inputRef.current?.click()}
                className="mt-2 text-xs font-bold text-brand hover:underline disabled:opacity-60"
              >
                {avatarSrc ? 'Change photo' : 'Add profile photo'}
              </button>
            </div>
          </div>

          {error ? (
            <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
              {error}
            </p>
          ) : null}

          <div className="mt-6 space-y-4 border-t border-border/70 pt-5">
            <div>
              <p className="text-xs font-semibold text-muted">Full name</p>
              <p className="mt-1 text-sm font-bold text-ink">{student?.name ?? '—'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted">Email</p>
              <p className="mt-1 inline-flex items-center gap-2 text-sm font-bold text-ink">
                <Mail className="h-3.5 w-3.5 text-muted" />
                {student?.email ?? '—'}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted">Account ID</p>
              <p className="mt-1 font-mono text-xs text-muted">{student?.id ?? '—'}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={async () => {
              await logoutStudent();
              router.replace('/login');
            }}
            className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-border text-sm font-bold text-ink transition hover:bg-[#f8fafc]"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </main>
    </>
  );
}
