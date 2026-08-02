'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, Plus, Trash2, Upload } from 'lucide-react';

import { Field, Input, Label, Select, Textarea } from '@/components/ui/input';
import { api } from '@/lib/api';

type Lesson = {
  _id: string;
  title: string;
  type: 'video' | 'lecture' | 'assignment' | 'task';
  summary: string;
  body: string;
  videoUrl: string;
  fileUrl: string;
  fileName: string;
  durationMinutes: number;
  order: number;
  published: boolean;
};

type Module = {
  _id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
};

type Course = {
  _id: string;
  title: string;
  slug: string;
  description: string;
  level: string;
  published: boolean;
  modules: Module[];
};

export default function AdminCourseEditorPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function load() {
    const me = await api.get('/api/auth/me');
    if (!me.ok) {
      router.replace('/admin/login');
      return;
    }
    const res = await api.get<{ course: Course }>(`/api/admin/portal/courses/${params.id}`);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setCourse(res.data.course);
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  async function saveMeta(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!course) return;
    setBusy(true);
    setError('');
    const fd = new FormData(e.currentTarget);
    const res = await api.patch<{ course: Course }>(`/api/admin/portal/courses/${course._id}`, {
      title: String(fd.get('title') || ''),
      slug: String(fd.get('slug') || ''),
      description: String(fd.get('description') || ''),
      level: String(fd.get('level') || ''),
      published: fd.get('published') === 'on',
    });
    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setCourse(res.data.course);
  }

  async function addModule(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!course) return;
    const form = e.currentTarget;
    const fd = new FormData(form);
    const res = await api.post<{ course: Course }>(
      `/api/admin/portal/courses/${course._id}/modules`,
      {
        title: String(fd.get('title') || ''),
        description: String(fd.get('description') || ''),
        order: course.modules.length,
      }
    );
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setCourse(res.data.course);
    form.reset();
  }

  async function addLesson(moduleId: string, e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!course) return;
    const form = e.currentTarget;
    const fd = new FormData(form);
    const mod = course.modules.find((m) => m._id === moduleId);
    const res = await api.post<{ course: Course }>(
      `/api/admin/portal/courses/${course._id}/modules/${moduleId}/lessons`,
      {
        title: String(fd.get('title') || ''),
        type: String(fd.get('type') || 'lecture'),
        summary: String(fd.get('summary') || ''),
        body: String(fd.get('body') || ''),
        videoUrl: String(fd.get('videoUrl') || ''),
        fileUrl: String(fd.get('fileUrl') || ''),
        fileName: String(fd.get('fileName') || ''),
        order: mod?.lessons.length ?? 0,
        published: true,
      }
    );
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setCourse(res.data.course);
    form.reset();
  }

  async function uploadFile(file: File) {
    setUploading(true);
    const res = await api.upload<{ url: string; fileName: string }>(
      '/api/admin/portal/upload',
      file
    );
    setUploading(false);
    if (!res.ok) {
      setError(res.error);
      return null;
    }
    return res.data;
  }

  async function deleteModule(moduleId: string) {
    if (!course || !confirm('Delete this module and its lessons?')) return;
    const res = await api.delete<{ course: Course }>(
      `/api/admin/portal/courses/${course._id}/modules/${moduleId}`
    );
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setCourse(res.data.course);
  }

  async function deleteLesson(moduleId: string, lessonId: string) {
    if (!course || !confirm('Delete this lesson?')) return;
    const res = await api.delete<{ course: Course }>(
      `/api/admin/portal/courses/${course._id}/modules/${moduleId}/lessons/${lessonId}`
    );
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setCourse(res.data.course);
  }

  if (!course && !error) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!course) {
    return (
      <section className="bg-background py-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-destructive">{error}</p>
          <Link href="/admin/courses" className="mt-4 inline-block text-primary">
            Back
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-background py-12">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Link href="/admin/courses" className="text-sm text-primary hover:underline">
          ← All courses
        </Link>
        <div className="mt-2 mb-8 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-extrabold text-foreground sm:text-3xl">
            Edit: {course.title}
          </h1>
          <span
            className={
              course.published
                ? 'rounded-full bg-success/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-success'
                : 'rounded-full bg-accent/15 px-3 py-1 text-xs font-bold uppercase tracking-wider text-accent'
            }
          >
            {course.published ? 'Published — students can see it' : 'Draft — students cannot see it'}
          </span>
        </div>

        {!course.published ? (
          <p className="mb-6 rounded-xl border border-accent/40 bg-accent/10 p-4 text-sm text-foreground">
            This course is still a <strong>draft</strong>. Check{' '}
            <strong>Published (visible to students)</strong> below, then click{' '}
            <strong>Save settings</strong>, or students will keep seeing “No published courses”.
          </p>
        ) : null}

        {error ? (
          <p className="mb-6 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </p>
        ) : null}

        <form
          key={`${course._id}-${course.published}`}
          onSubmit={saveMeta}
          className="mb-10 space-y-4 rounded-2xl border border-border bg-card p-5 sm:p-6"
        >
          <h2 className="text-lg font-bold text-foreground">Course settings</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field>
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" defaultValue={course.title} required />
            </Field>
            <Field>
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" name="slug" defaultValue={course.slug} required />
            </Field>
            <Field>
              <Label htmlFor="level">Level</Label>
              <Input id="level" name="level" defaultValue={course.level} />
            </Field>
            <label className="flex items-center gap-2 pt-6 text-sm font-semibold text-foreground">
              <input
                type="checkbox"
                name="published"
                defaultChecked={course.published}
                className="h-4 w-4 rounded border-border"
              />
              Published (visible to students)
            </label>
            <Field className="sm:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                rows={3}
                defaultValue={course.description}
              />
            </Field>
          </div>
          <button
            type="submit"
            disabled={busy}
            className="inline-flex h-10 items-center rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground"
          >
            {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save settings
          </button>
        </form>

        <div className="mb-8 space-y-6">
          {course.modules.map((mod) => (
            <div key={mod._id} className="rounded-2xl border border-border bg-card p-5">
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-foreground">{mod.title}</h3>
                  {mod.description ? (
                    <p className="text-sm text-muted-foreground">{mod.description}</p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => void deleteModule(mod._id)}
                  className="text-muted-foreground hover:text-destructive"
                  aria-label="Delete module"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <ul className="mb-4 space-y-2">
                {mod.lessons.map((lesson) => (
                  <li
                    key={lesson._id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-background px-3 py-2 text-sm"
                  >
                    <span>
                      <span className="mr-2 font-bold uppercase text-primary">{lesson.type}</span>
                      {lesson.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => void deleteLesson(mod._id, lesson._id)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>

              <form
                onSubmit={(e) => void addLesson(mod._id, e)}
                className="space-y-3 rounded-xl border border-dashed border-border p-4"
              >
                <p className="text-sm font-bold text-foreground">Add lesson</p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field>
                    <Label>Title</Label>
                    <Input name="title" required />
                  </Field>
                  <Field>
                    <Label>Type</Label>
                    <Select name="type" defaultValue="lecture">
                      <option value="video">Video</option>
                      <option value="lecture">Lecture</option>
                      <option value="assignment">Assignment</option>
                      <option value="task">Task</option>
                    </Select>
                  </Field>
                  <Field className="sm:col-span-2">
                    <Label>Summary</Label>
                    <Input name="summary" />
                  </Field>
                  <Field className="sm:col-span-2">
                    <Label>Body / instructions</Label>
                    <Textarea name="body" rows={4} />
                  </Field>
                  <Field className="sm:col-span-2">
                    <Label>Video URL (YouTube or uploaded file path)</Label>
                    <Input name="videoUrl" placeholder="https://youtube.com/watch?v=... or /uploads/..." />
                  </Field>
                  <Field>
                    <Label>Attachment URL</Label>
                    <Input name="fileUrl" placeholder="/uploads/..." />
                  </Field>
                  <Field>
                    <Label>Attachment name</Label>
                    <Input name="fileName" />
                  </Field>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-border px-4 text-sm font-semibold text-muted-foreground hover:text-primary">
                    <Upload className="h-4 w-4" />
                    {uploading ? 'Uploading…' : 'Upload file'}
                    <input
                      type="file"
                      className="hidden"
                      disabled={uploading}
                      onChange={(ev) => {
                        const file = ev.target.files?.[0];
                        if (!file) return;
                        void (async () => {
                          const uploaded = await uploadFile(file);
                          if (!uploaded) return;
                          const form = ev.target.closest('form');
                          if (!form) return;
                          const fileUrl = form.elements.namedItem('fileUrl') as HTMLInputElement;
                          const fileName = form.elements.namedItem('fileName') as HTMLInputElement;
                          const videoUrl = form.elements.namedItem('videoUrl') as HTMLInputElement;
                          fileUrl.value = uploaded.url;
                          fileName.value = uploaded.fileName;
                          if (file.type.startsWith('video/')) {
                            videoUrl.value = uploaded.url;
                          }
                        })();
                      }}
                    />
                  </label>
                  <button
                    type="submit"
                    className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground"
                  >
                    <Plus className="h-4 w-4" /> Add lesson
                  </button>
                </div>
              </form>
            </div>
          ))}
        </div>

        <form
          onSubmit={addModule}
          className="space-y-3 rounded-2xl border border-border bg-card p-5"
        >
          <h2 className="text-lg font-bold text-foreground">Add module</h2>
          <Field>
            <Label htmlFor="mod-title">Module title</Label>
            <Input id="mod-title" name="title" required placeholder="Module 1: Foundations" />
          </Field>
          <Field>
            <Label htmlFor="mod-desc">Description</Label>
            <Input id="mod-desc" name="description" />
          </Field>
          <button
            type="submit"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-primary px-4 text-sm font-bold text-primary"
          >
            <Plus className="h-4 w-4" /> Add module
          </button>
        </form>
      </div>
    </section>
  );
}
