'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Loader2, Plus, Trash2, Upload } from 'lucide-react';
import { adminApi, mediaUrl } from '@/lib/admin-api';
import { useAdminCourses } from '@/hooks/use-admin-courses';
import { AdminPageHeader } from '@/components/admin/page-header';
import { Button } from '@/components/ui/button';
import { Input, Label, Select } from '@/components/ui/input';

type Recording = {
  id: string;
  courseId: string;
  courseTitle: string;
  title: string;
  videoUrl: string;
  durationMinutes: number;
  published: boolean;
};

type SourceMode = 'link' | 'upload';

export default function AdminRecordingsPage() {
  const { courses } = useAdminCourses();
  const fileRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<Recording[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [sourceMode, setSourceMode] = useState<SourceMode>('link');
  const [videoUrl, setVideoUrl] = useState('');
  const [uploadedName, setUploadedName] = useState('');

  async function load() {
    setLoading(true);
    const res = await adminApi.get<{ items: Recording[] }>('/api/admin/academy/recordings');
    if (!res.ok) {
      setError(res.error);
      setLoading(false);
      return;
    }
    setItems(res.data.items);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  async function onUploadFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith('video/')) {
      setError('Please upload a video file (MP4, WebM, or MOV).');
      return;
    }
    if (file.size > 200 * 1024 * 1024) {
      setError('Video must be 200 MB or smaller.');
      return;
    }

    setUploading(true);
    setError('');
    const res = await adminApi.upload<{ ok: boolean; url: string; fileName: string }>(
      '/api/admin/portal/upload',
      file
    );
    setUploading(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setVideoUrl(res.data.url);
    setUploadedName(res.data.fileName || file.name);
    setSourceMode('upload');
  }

  async function onCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const finalUrl = videoUrl.trim() || String(fd.get('videoUrl') || '').trim();
    if (!finalUrl) {
      setError('Add a YouTube/video link or upload a video file.');
      return;
    }

    setBusy(true);
    setError('');
    const res = await adminApi.post('/api/admin/academy/recordings', {
      courseId: String(fd.get('courseId') || ''),
      title: String(fd.get('title') || ''),
      videoUrl: finalUrl,
      durationMinutes: Number(fd.get('durationMinutes') || 0),
      published: true,
    });
    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    e.currentTarget.reset();
    setVideoUrl('');
    setUploadedName('');
    setSourceMode('link');
    setShowForm(false);
    await load();
  }

  async function remove(id: string) {
    if (!confirm('Delete this recording?')) return;
    const res = await adminApi.delete(`/api/admin/academy/recordings/${id}`);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setItems((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <>
      <AdminPageHeader
        title="Recordings"
        subtitle="Publish class replays for enrolled students."
        actions={
          <Button type="button" className="h-10" onClick={() => setShowForm((v) => !v)}>
            <Plus className="h-4 w-4" />
            Add recording
          </Button>
        }
      />
      <main className="px-5 py-8 sm:px-8">
        {error ? (
          <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
            {error}
          </p>
        ) : null}

        {showForm ? (
          <form onSubmit={onCreate} className="panel mb-6 grid gap-3 p-5 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="courseId">Course</Label>
              <Select id="courseId" name="courseId" required defaultValue="">
                <option value="" disabled>
                  Select course
                </option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" required placeholder="Week 1 replay" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="durationMinutes">Duration (minutes)</Label>
              <Input id="durationMinutes" name="durationMinutes" type="number" min={0} defaultValue={0} />
            </div>

            <div className="space-y-3 sm:col-span-2">
              <p className="text-xs font-semibold text-muted">Video source</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setSourceMode('link')}
                  className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                    sourceMode === 'link' ? 'bg-brand text-white' : 'bg-white text-muted ring-1 ring-border'
                  }`}
                >
                  YouTube / link
                </button>
                <button
                  type="button"
                  onClick={() => setSourceMode('upload')}
                  className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                    sourceMode === 'upload' ? 'bg-brand text-white' : 'bg-white text-muted ring-1 ring-border'
                  }`}
                >
                  Upload video
                </button>
              </div>

              {sourceMode === 'link' ? (
                <div className="space-y-1.5">
                  <Label htmlFor="videoUrl">Video URL</Label>
                  <Input
                    id="videoUrl"
                    name="videoUrl"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="https://youtube.com/..."
                  />
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-border bg-[#f8fafc] p-4">
                  <input
                    ref={fileRef}
                    type="file"
                    accept="video/mp4,video/webm,video/quicktime"
                    className="hidden"
                    onChange={(e) => void onUploadFile(e.target.files?.[0])}
                  />
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-ink">
                        {uploadedName || 'Upload MP4, WebM, or MOV'}
                      </p>
                      <p className="mt-0.5 text-xs text-muted">Max 200 MB. Students can watch it from Recordings.</p>
                      {videoUrl ? (
                        <p className="mt-1 break-all text-[11px] font-semibold text-brand">{videoUrl}</p>
                      ) : null}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-10"
                      disabled={uploading}
                      onClick={() => fileRef.current?.click()}
                    >
                      {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      {uploadedName ? 'Replace file' : 'Choose file'}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div className="sm:col-span-2">
              <Button type="submit" disabled={busy || uploading} className="h-10">
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save recording'}
              </Button>
            </div>
          </form>
        ) : null}

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-brand" />
          </div>
        ) : items.length === 0 ? (
          <div className="panel p-10 text-center">
            <p className="text-sm font-bold text-ink">No recordings yet</p>
            <p className="mt-1 text-xs text-muted">Add a YouTube link or upload a video after each live class.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <article key={item.id} className="panel flex flex-wrap items-center justify-between gap-3 p-5">
                <div>
                  <p className="text-base font-extrabold text-ink">{item.title}</p>
                  <p className="mt-1 text-sm text-muted">{item.courseTitle}</p>
                  <a
                    href={mediaUrl(item.videoUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block text-xs font-bold text-brand hover:underline"
                  >
                    Open video
                  </a>
                </div>
                <button
                  type="button"
                  onClick={() => void remove(item.id)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border text-muted hover:text-red-600"
                  aria-label="Delete recording"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </article>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
