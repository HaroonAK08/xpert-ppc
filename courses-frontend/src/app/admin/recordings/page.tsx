'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { FileUpload } from '@/components/admin/file-upload';
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
  const [items, setItems] = useState<Recording[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [sourceMode, setSourceMode] = useState<SourceMode>('link');
  const [videoUrl, setVideoUrl] = useState('');
  const [uploadedUrl, setUploadedUrl] = useState('');

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

  async function onCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy || uploading) return;
    const formElement = e.currentTarget;
    const fd = new FormData(e.currentTarget);
    const finalUrl = (sourceMode === 'upload' ? uploadedUrl : videoUrl).trim();
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
    formElement.reset();
    setVideoUrl('');
    setUploadedUrl('');
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
          <Button type="button" className="min-h-11" disabled={busy || uploading} onClick={() => setShowForm((v) => !v)}>
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
                  disabled={busy || uploading}
                  aria-pressed={sourceMode === 'link'}
                  onClick={() => setSourceMode('link')}
                  className={`min-h-11 rounded-full px-4 py-2 text-sm font-bold ${
                    sourceMode === 'link' ? 'bg-brand text-white' : 'bg-white text-muted ring-1 ring-border'
                  }`}
                >
                  YouTube / link
                </button>
                <button
                  type="button"
                  disabled={busy || uploading}
                  aria-pressed={sourceMode === 'upload'}
                  onClick={() => setSourceMode('upload')}
                  className={`min-h-11 rounded-full px-4 py-2 text-sm font-bold ${
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
                <FileUpload videoOnly disabled={busy} onUploaded={setUploadedUrl} onUploadingChange={setUploading} onSelectionChange={() => setUploadedUrl('')} />
              )}
            </div>

            <div className="sm:col-span-2">
              <Button type="submit" disabled={busy || uploading} className="min-h-11">
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
                  className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border text-muted hover:text-red-600"
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
