'use client';

import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Check, Loader2, Pencil, Plus, Trash2, Upload } from 'lucide-react';

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
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const [editingLessonKey, setEditingLessonKey] = useState<string | null>(null);
  const [notice, setNotice] = useState('');

  function lessonTypeFromFields(type: string, videoUrl: string) {
    const url = videoUrl.toLowerCase();
    const looksLikeVideo =
      url.includes('youtube.com') ||
      url.includes('youtu.be') ||
      url.includes('/uploads/') &&
        (url.endsWith('.mp4') || url.endsWith('.webm') || url.endsWith('.mov'));
    if (looksLikeVideo && type === 'lecture') return 'video';
    return type;
  }

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
      published: course.published,
    });
    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setCourse(res.data.course);
  }

  async function setPublished(published: boolean) {
    if (!course) return;
    setBusy(true);
    setError('');
    const res = await api.patch<{ course: Course }>(`/api/admin/portal/courses/${course._id}`, {
      published,
    });
    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setCourse(res.data.course);
  }

  async function deleteCourse() {
    if (!course || !confirm('Delete this course and all its modules/lessons?')) return;
    setBusy(true);
    const res = await api.delete(`/api/admin/portal/courses/${course._id}`);
    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    router.push('/admin/courses');
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

  async function saveModule(moduleId: string, e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!course) return;
    const fd = new FormData(e.currentTarget);
    const res = await api.patch<{ course: Course }>(
      `/api/admin/portal/courses/${course._id}/modules/${moduleId}`,
      {
        title: String(fd.get('title') || ''),
        description: String(fd.get('description') || ''),
      }
    );
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setCourse(res.data.course);
    setEditingModuleId(null);
  }

  async function addLesson(moduleId: string, e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!course) return;
    const form = e.currentTarget;
    const fd = new FormData(form);
    const mod = course.modules.find((m) => m._id === moduleId);
    const title = String(fd.get('title') || '').trim();
    const videoUrl = String(fd.get('videoUrl') || '').trim();
    const type = lessonTypeFromFields(String(fd.get('type') || 'lecture'), videoUrl);

    if (title.length < 2) {
      setError('Lesson title must be at least 2 characters.');
      return;
    }

    setBusy(true);
    setError('');
    setNotice('');
    const res = await api.post<{ course: Course }>(
      `/api/admin/portal/courses/${course._id}/modules/${moduleId}/lessons`,
      {
        title,
        type,
        summary: String(fd.get('summary') || ''),
        body: String(fd.get('body') || ''),
        videoUrl,
        fileUrl: String(fd.get('fileUrl') || ''),
        fileName: String(fd.get('fileName') || ''),
        order: mod?.lessons.length ?? 0,
        published: true,
      }
    );
    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setCourse(res.data.course);
    setNotice(
      course.published
        ? `Lesson “${title}” published — students can see it now.`
        : `Lesson “${title}” saved. Click Publish at the bottom to make the course visible to students.`
    );
    form.reset();
  }

  async function setLessonPublished(moduleId: string, lessonId: string, published: boolean) {
    if (!course) return;
    setBusy(true);
    setError('');
    const res = await api.patch<{ course: Course }>(
      `/api/admin/portal/courses/${course._id}/modules/${moduleId}/lessons/${lessonId}`,
      { published }
    );
    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setCourse(res.data.course);
    setNotice(published ? 'Lesson published for students.' : 'Lesson unpublished (hidden from students).');
  }

  async function saveLesson(moduleId: string, lessonId: string, e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!course) return;
    const fd = new FormData(e.currentTarget);
    const res = await api.patch<{ course: Course }>(
      `/api/admin/portal/courses/${course._id}/modules/${moduleId}/lessons/${lessonId}`,
      {
        title: String(fd.get('title') || ''),
        type: String(fd.get('type') || 'lecture'),
        summary: String(fd.get('summary') || ''),
        body: String(fd.get('body') || ''),
        videoUrl: String(fd.get('videoUrl') || ''),
        fileUrl: String(fd.get('fileUrl') || ''),
        fileName: String(fd.get('fileName') || ''),
      }
    );
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setCourse(res.data.course);
    setEditingLessonKey(null);
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
    if (editingModuleId === moduleId) setEditingModuleId(null);
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
    if (editingLessonKey === `${moduleId}:${lessonId}`) setEditingLessonKey(null);
  }

  function bindUpload(ev: ChangeEvent<HTMLInputElement>) {
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
    <section className="bg-background py-12 pb-28">
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
            This course is still a <strong>draft</strong>. Use the <strong>Publish</strong> button at
            the bottom when you are ready, or students will keep seeing “No published courses”.
          </p>
        ) : null}

        {error ? (
          <p className="mb-6 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </p>
        ) : null}

        {notice ? (
          <p className="mb-6 rounded-xl border border-success/40 bg-success/10 p-4 text-sm text-foreground">
            {notice}
          </p>
        ) : null}

        <p className="mb-6 rounded-xl border border-border bg-muted/20 p-4 text-sm text-muted-foreground">
          <strong className="text-foreground">Lessons:</strong> click{' '}
          <strong className="text-foreground">Publish lesson</strong> under each module to save &amp; go
          live. <strong className="text-foreground">Course Publish</strong> (bottom bar) only controls
          whether the whole course is visible.
        </p>

        <form
          key={`${course._id}-meta`}
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
              {editingModuleId === mod._id ? (
                <form onSubmit={(e) => void saveModule(mod._id, e)} className="mb-4 space-y-3">
                  <Field>
                    <Label>Module title</Label>
                    <Input name="title" defaultValue={mod.title} required />
                  </Field>
                  <Field>
                    <Label>Description (optional)</Label>
                    <Textarea name="description" rows={2} defaultValue={mod.description} />
                  </Field>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="submit"
                      className="inline-flex h-9 items-center rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground"
                    >
                      Save module
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingModuleId(null)}
                      className="inline-flex h-9 items-center rounded-xl border border-border px-4 text-sm font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{mod.title}</h3>
                    {mod.description ? (
                      <p className="text-sm text-muted-foreground">{mod.description}</p>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingModuleId(mod._id)}
                      className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border px-3 text-sm font-semibold hover:text-primary"
                    >
                      <Pencil className="h-3.5 w-3.5" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => void deleteModule(mod._id)}
                      className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border px-3 text-sm font-semibold text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  </div>
                </div>
              )}

              {!mod.lessons.length ? (
                <p className="mb-4 rounded-xl border border-dashed border-border px-3 py-3 text-sm text-muted-foreground">
                  No lessons in this module yet. Fill the form below and click{' '}
                  <strong className="text-foreground">Publish lesson</strong>.
                </p>
              ) : null}

              <ul className="mb-4 space-y-2">
                {mod.lessons.map((lesson) => {
                  const lessonKey = `${mod._id}:${lesson._id}`;
                  if (editingLessonKey === lessonKey) {
                    return (
                      <li
                        key={lesson._id}
                        className="rounded-xl border border-primary/30 bg-background p-4"
                      >
                        <form
                          onSubmit={(e) => void saveLesson(mod._id, lesson._id, e)}
                          className="space-y-3"
                        >
                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <Field>
                              <Label>Title</Label>
                              <Input name="title" defaultValue={lesson.title} required />
                            </Field>
                            <Field>
                              <Label>Type</Label>
                              <Select name="type" defaultValue={lesson.type}>
                                <option value="video">Video</option>
                                <option value="lecture">Lecture</option>
                                <option value="assignment">Assignment</option>
                                <option value="task">Task</option>
                              </Select>
                            </Field>
                            <Field className="sm:col-span-2">
                              <Label>Summary</Label>
                              <Input name="summary" defaultValue={lesson.summary} />
                            </Field>
                            <Field className="sm:col-span-2">
                              <Label>Body / instructions</Label>
                              <Textarea name="body" rows={4} defaultValue={lesson.body} />
                            </Field>
                            <Field className="sm:col-span-2">
                              <Label>Video URL</Label>
                              <Input name="videoUrl" defaultValue={lesson.videoUrl} />
                            </Field>
                            <Field>
                              <Label>Attachment URL</Label>
                              <Input name="fileUrl" defaultValue={lesson.fileUrl} />
                            </Field>
                            <Field>
                              <Label>Attachment name</Label>
                              <Input name="fileName" defaultValue={lesson.fileName} />
                            </Field>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <label className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-xl border border-border px-3 text-sm font-semibold text-muted-foreground">
                              <Upload className="h-3.5 w-3.5" />
                              {uploading ? 'Uploading…' : 'Upload file'}
                              <input
                                type="file"
                                className="hidden"
                                disabled={uploading}
                                onChange={bindUpload}
                              />
                            </label>
                            <button
                              type="submit"
                              className="inline-flex h-9 items-center rounded-xl bg-primary px-4 text-sm font-bold text-primary-foreground"
                            >
                              Save lesson
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingLessonKey(null)}
                              className="inline-flex h-9 items-center rounded-xl border border-border px-4 text-sm font-semibold"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </li>
                    );
                  }

                  return (
                    <li
                      key={lesson._id}
                      className="flex flex-col gap-2 rounded-xl border border-border/60 bg-background px-3 py-2 text-sm sm:flex-row sm:items-center sm:justify-between"
                    >
                      <span className="flex min-w-0 flex-wrap items-center gap-2">
                        <span className="font-bold uppercase text-primary">{lesson.type}</span>
                        <span className="truncate">{lesson.title}</span>
                        <span
                          className={
                            lesson.published
                              ? 'rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-bold uppercase text-success'
                              : 'rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase text-muted-foreground'
                          }
                        >
                          {lesson.published ? 'Published' : 'Draft'}
                        </span>
                      </span>
                      <div className="flex flex-wrap items-center gap-2">
                        {lesson.published ? (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => void setLessonPublished(mod._id, lesson._id, false)}
                            className="inline-flex h-8 items-center rounded-lg border border-border px-2.5 text-xs font-semibold"
                          >
                            Unpublish
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => void setLessonPublished(mod._id, lesson._id, true)}
                            className="inline-flex h-8 items-center gap-1 rounded-lg bg-primary px-2.5 text-xs font-bold text-primary-foreground"
                          >
                            <Check className="h-3 w-3" /> Publish
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setEditingLessonKey(lessonKey)}
                          className="inline-flex h-8 items-center gap-1 rounded-lg border border-border px-2.5 text-xs font-semibold hover:text-primary"
                        >
                          <Pencil className="h-3 w-3" /> Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => void deleteLesson(mod._id, lesson._id)}
                          className="inline-flex h-8 items-center gap-1 rounded-lg border border-border px-2.5 text-xs font-semibold text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" /> Delete
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <form
                onSubmit={(e) => void addLesson(mod._id, e)}
                className="space-y-3 rounded-xl border border-dashed border-primary/40 bg-primary/5 p-4"
              >
                <p className="text-sm font-bold text-foreground">New lesson</p>
                <p className="text-xs text-muted-foreground">
                  Fill the fields, then click <strong className="text-foreground">Publish lesson</strong>{' '}
                  to save it for students.
                </p>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <Field>
                    <Label>Title</Label>
                    <Input name="title" required minLength={2} placeholder="Lesson title" />
                  </Field>
                  <Field>
                    <Label>Type</Label>
                    <Select name="type" defaultValue="video">
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
                      onChange={bindUpload}
                    />
                  </label>
                  <button
                    type="submit"
                    disabled={busy}
                    className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground disabled:opacity-60"
                  >
                    {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                    Publish lesson
                  </button>
                </div>
              </form>
            </div>
          ))}
        </div>

        <form
          onSubmit={addModule}
          className="mb-8 space-y-3 rounded-2xl border border-border bg-card p-5"
        >
          <h2 className="text-lg font-bold text-foreground">Add module</h2>
          <Field>
            <Label htmlFor="mod-title">Module title</Label>
            <Input id="mod-title" name="title" required placeholder="Module 1: Foundations" />
          </Field>
          <Field>
            <Label htmlFor="mod-desc">Description (optional)</Label>
            <Textarea id="mod-desc" name="description" rows={2} placeholder="Optional short summary" />
          </Field>
          <button
            type="submit"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-primary px-4 text-sm font-bold text-primary"
          >
            <Plus className="h-4 w-4" /> Add module
          </button>
        </form>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur">
        <div className="container mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
          <p className="text-sm text-muted-foreground">
            {course.published
              ? 'Live for students'
              : 'Draft — click Publish when ready'}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => void deleteCourse()}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-destructive/40 px-4 text-sm font-bold text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" /> Delete course
            </button>
            {course.published ? (
              <button
                type="button"
                disabled={busy}
                onClick={() => void setPublished(false)}
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-border px-4 text-sm font-bold"
              >
                Unpublish
              </button>
            ) : (
              <button
                type="button"
                disabled={busy}
                onClick={() => void setPublished(true)}
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground"
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                Publish
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
