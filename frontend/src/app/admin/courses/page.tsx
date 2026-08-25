'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Check, Loader2, Pencil, Plus, Trash2 } from 'lucide-react';

import { Field, Input, Label, Textarea } from '@/components/ui/input';
import { api, type PortalCourseSummary } from '@/lib/api';

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export default function AdminCoursesPage() {
  const router = useRouter();
  const [items, setItems] = useState<PortalCourseSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);

  async function load() {
    setLoading(true);
    const me = await api.get('/api/auth/me');
    if (!me.ok) {
      router.replace('/admin/login');
      return;
    }
    const res = await api.get<{ items: PortalCourseSummary[] }>('/api/admin/portal/courses');
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onCreate(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCreating(true);
    setError('');
    const fd = new FormData(e.currentTarget);
    const title = String(fd.get('title') || '');
    const slug = String(fd.get('slug') || '') || slugify(title);
    const res = await api.post<{ course: { _id: string } }>('/api/admin/portal/courses', {
      title,
      slug,
      description: String(fd.get('description') || ''),
      level: String(fd.get('level') || 'Beginner'),
      published: false,
    });
    setCreating(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    router.push(`/admin/courses/${res.data.course._id}`);
  }

  async function removeCourse(id: string) {
    if (!confirm('Delete this course and all its lessons?')) return;
    const res = await api.delete(`/api/admin/portal/courses/${id}`);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setItems((prev) => prev.filter((c) => c.id !== id));
  }

  async function togglePublish(id: string, published: boolean) {
    const res = await api.patch<{ course: { published: boolean } }>(
      `/api/admin/portal/courses/${id}`,
      { published }
    );
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setItems((prev) =>
      prev.map((c) => (c.id === id ? { ...c, published: res.data.course.published } : c))
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <section className="bg-background py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap gap-4 text-sm text-primary">
              <Link href="/admin" className="hover:underline">
                ← Leads
              </Link>
              <Link href="/admin/students" className="hover:underline">
                Applications
              </Link>
            </div>
            <h1 className="mt-2 text-2xl font-extrabold text-foreground sm:text-3xl">
              Course manager
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Upload videos, lectures, assignments, and tasks for enrolled students.
            </p>
          </div>
        </div>

        {error ? (
          <p className="mb-6 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <form
          onSubmit={onCreate}
          className="mb-10 grid grid-cols-1 gap-4 rounded-2xl border border-border bg-card p-5 sm:grid-cols-2 sm:p-6"
        >
          <Field>
            <Label htmlFor="title">Course title</Label>
            <Input id="title" name="title" required placeholder="Google Ads Mastery" />
          </Field>
          <Field>
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" name="slug" placeholder="google-ads-mastery" />
          </Field>
          <Field>
            <Label htmlFor="level">Level</Label>
            <Input id="level" name="level" defaultValue="Beginner" />
          </Field>
          <Field className="sm:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" rows={3} />
          </Field>
          <button
            type="submit"
            disabled={creating}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground sm:col-span-2 sm:w-fit"
          >
            {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Create course
          </button>
        </form>

        <div className="space-y-3">
          {items.map((c) => (
            <div
              key={c.id}
              className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-bold text-foreground">{c.title}</h2>
                  <span
                    className={
                      c.published
                        ? 'rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-bold uppercase text-success'
                        : 'rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase text-muted-foreground'
                    }
                  >
                    {c.published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  /{c.slug} · {c.moduleCount} modules · {c.lessonCount} lessons
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/admin/courses/${c.id}`}
                  className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-border px-4 text-sm font-semibold hover:text-primary"
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit
                </Link>
                {c.published ? (
                  <button
                    type="button"
                    onClick={() => void togglePublish(c.id, false)}
                    className="inline-flex h-10 items-center rounded-xl border border-border px-4 text-sm font-semibold"
                  >
                    Unpublish
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => void togglePublish(c.id, true)}
                    className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground"
                  >
                    <Check className="h-3.5 w-3.5" /> Publish
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => void removeCourse(c.id)}
                  className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-destructive/40 px-4 text-sm font-semibold text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-3.5 w-3.5" /> Delete
                </button>
              </div>
            </div>
          ))}
          {!items.length ? (
            <p className="text-sm text-muted-foreground">No courses yet. Create your first one above.</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
