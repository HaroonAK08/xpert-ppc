'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { adminApi, mediaUrl } from '@/lib/admin-api';
import { useAdminCourses } from '@/hooks/use-admin-courses';
import { AdminPageHeader } from '@/components/admin/page-header';
import { Button } from '@/components/ui/button';
import { Input, Label, Select, Textarea } from '@/components/ui/input';

type Resource = {
  id: string;
  courseId: string;
  courseTitle: string;
  title: string;
  kind: string;
  description: string;
  fileUrl: string;
  published: boolean;
};

export default function AdminResourcesPage() {
  const { courses } = useAdminCourses();
  const [items, setItems] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    setLoading(true);
    const res = await adminApi.get<{ items: Resource[] }>('/api/admin/academy/resources');
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
    setBusy(true);
    setError('');
    const fd = new FormData(e.currentTarget);
    const res = await adminApi.post('/api/admin/academy/resources', {
      courseId: String(fd.get('courseId') || ''),
      title: String(fd.get('title') || ''),
      kind: String(fd.get('kind') || 'notes'),
      description: String(fd.get('description') || ''),
      fileUrl: String(fd.get('fileUrl') || ''),
      published: true,
    });
    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    e.currentTarget.reset();
    setShowForm(false);
    await load();
  }

  async function remove(id: string) {
    if (!confirm('Delete this resource?')) return;
    const res = await adminApi.delete(`/api/admin/academy/resources/${id}`);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setItems((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <>
      <AdminPageHeader
        title="Resources"
        subtitle="Notes, assignments, and downloadable assets for students."
        actions={
          <Button type="button" className="h-10" onClick={() => setShowForm((v) => !v)}>
            <Plus className="h-4 w-4" />
            Add resource
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
            <div className="space-y-1.5">
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
              <Label htmlFor="kind">Type</Label>
              <Select id="kind" name="kind" defaultValue="notes">
                <option value="notes">Lesson notes</option>
                <option value="assignment">Assignment</option>
                <option value="template">Template</option>
                <option value="other">Other</option>
              </Select>
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" required placeholder="Campaign brief template" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="fileUrl">File / link URL</Label>
              <Input id="fileUrl" name="fileUrl" placeholder="https://..." />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" rows={2} />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" disabled={busy} className="h-10">
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save resource'}
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
            <p className="text-sm font-bold text-ink">No resources yet</p>
            <p className="mt-1 text-xs text-muted">Add notes and files students can download after class.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <article key={item.id} className="panel flex flex-wrap items-center justify-between gap-3 p-5">
                <div>
                  <p className="text-base font-extrabold text-ink">{item.title}</p>
                  <p className="mt-1 text-sm text-muted">
                    {item.courseTitle} · {item.kind}
                  </p>
                  {item.fileUrl ? (
                    <a
                      href={mediaUrl(item.fileUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-block text-xs font-bold text-brand hover:underline"
                    >
                      Open file
                    </a>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => void remove(item.id)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border text-muted hover:text-red-600"
                  aria-label="Delete resource"
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
