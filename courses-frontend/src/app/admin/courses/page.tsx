'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { adminApi } from '@/lib/admin-api';
import { AdminPageHeader } from '@/components/admin/page-header';
import { Button } from '@/components/ui/button';
import { Input, Label, Textarea } from '@/components/ui/input';

type CourseSummary = {
  id: string;
  title: string;
  slug: string;
  description: string;
  level: string;
  published: boolean;
  meetLink: string;
  moduleCount: number;
  lessonCount: number;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function AdminCoursesPage() {
  const [items, setItems] = useState<CourseSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    setLoading(true);
    const res = await adminApi.get<{ items: CourseSummary[] }>('/api/admin/portal/courses');
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
    setCreating(true);
    setError('');
    const fd = new FormData(e.currentTarget);
    const title = String(fd.get('title') || '').trim();
    const slug = String(fd.get('slug') || '').trim() || slugify(title);
    const res = await adminApi.post<{ course: { _id: string } }>('/api/admin/portal/courses', {
      title,
      slug,
      description: String(fd.get('description') || ''),
      level: String(fd.get('level') || 'Beginner'),
      meetLink: String(fd.get('meetLink') || ''),
      published: false,
    });
    setCreating(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    window.location.href = `/admin/courses/${res.data.course._id}`;
  }

  async function togglePublish(id: string, published: boolean) {
    const res = await adminApi.patch<{ course: { published: boolean } }>(`/api/admin/portal/courses/${id}`, {
      published,
    });
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setItems((prev) => prev.map((c) => (c.id === id ? { ...c, published: res.data.course.published } : c)));
  }

  async function removeCourse(id: string) {
    if (!confirm('Delete this course and all its lessons?')) return;
    const res = await adminApi.delete(`/api/admin/portal/courses/${id}`);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setItems((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <>
      <AdminPageHeader
        title="Courses"
        subtitle="Create courses students can enroll in after approval."
        actions={
          <Button type="button" className="h-10" onClick={() => setShowForm((v) => !v)}>
            <Plus className="h-4 w-4" />
            New course
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
              <Label htmlFor="title">Course title</Label>
              <Input id="title" name="title" required placeholder="Google Ads — Live Course" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" name="slug" placeholder="google-ads" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="level">Level</Label>
              <Input id="level" name="level" defaultValue="Beginner" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="meetLink">Default Google Meet link</Label>
              <Input id="meetLink" name="meetLink" placeholder="https://meet.google.com/..." />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" rows={3} />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" disabled={creating} className="h-10">
                {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create course'}
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
            <p className="text-sm font-bold text-ink">No courses yet</p>
            <p className="mt-1 text-xs text-muted">Create your first course to start adding lessons and Meet links.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((course) => (
              <article key={course.id} className="panel flex flex-wrap items-center justify-between gap-3 p-5">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-extrabold text-ink">{course.title}</h2>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                        course.published ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {course.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted">
                    /{course.slug} · {course.moduleCount} modules · {course.lessonCount} lessons
                    {course.meetLink ? ' · Meet link set' : ''}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/admin/courses/${course.id}`}
                    className="inline-flex h-10 items-center rounded-xl bg-brand px-4 text-xs font-bold text-white"
                  >
                    Edit
                  </Link>
                  <Button
                    type="button"
                    variant="outline"
                    className="h-10"
                    onClick={() => void togglePublish(course.id, !course.published)}
                  >
                    {course.published ? 'Unpublish' : 'Publish'}
                  </Button>
                  <button
                    type="button"
                    onClick={() => void removeCourse(course.id)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border text-muted hover:text-red-600"
                    aria-label="Delete course"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
