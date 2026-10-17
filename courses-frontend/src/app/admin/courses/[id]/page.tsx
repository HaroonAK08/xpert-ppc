'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import { adminApi } from '@/lib/admin-api';
import { AdminPageHeader } from '@/components/admin/page-header';
import { Button } from '@/components/ui/button';
import { Input, Label, Select, Textarea } from '@/components/ui/input';

type Lesson = {
  _id: string;
  title: string;
  type: string;
  summary: string;
  videoUrl: string;
  fileUrl: string;
  published: boolean;
};

type Module = {
  _id: string;
  title: string;
  description: string;
  lessons: Lesson[];
};

type Course = {
  _id: string;
  title: string;
  slug: string;
  description: string;
  level: string;
  published: boolean;
  meetLink?: string;
  timezone?: string;
  nextClassAt?: string | null;
  modules: Module[];
};

export default function AdminCourseEditorPage() {
  const params = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function load() {
    const res = await adminApi.get<{ course: Course }>(`/api/admin/portal/courses/${params.id}`);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setCourse(res.data.course);
  }

  useEffect(() => {
    void load();
  }, [params.id]);

  async function saveMeta(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!course) return;
    setBusy(true);
    setError('');
    const fd = new FormData(e.currentTarget);
    const nextClassAt = String(fd.get('nextClassAt') || '').trim();
    const res = await adminApi.patch<{ course: Course }>(`/api/admin/portal/courses/${course._id}`, {
      title: String(fd.get('title') || ''),
      slug: String(fd.get('slug') || ''),
      description: String(fd.get('description') || ''),
      level: String(fd.get('level') || ''),
      meetLink: String(fd.get('meetLink') || ''),
      timezone: String(fd.get('timezone') || 'Asia/Karachi'),
      nextClassAt: nextClassAt || null,
      published: course.published,
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
    const res = await adminApi.post<{ course: Course }>(`/api/admin/portal/courses/${course._id}/modules`, {
      title: String(fd.get('title') || ''),
      description: String(fd.get('description') || ''),
      order: course.modules.length,
    });
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
    const res = await adminApi.post<{ course: Course }>(
      `/api/admin/portal/courses/${course._id}/modules/${moduleId}/lessons`,
      {
        title: String(fd.get('title') || ''),
        type: String(fd.get('type') || 'lecture'),
        summary: String(fd.get('summary') || ''),
        videoUrl: String(fd.get('videoUrl') || ''),
        fileUrl: String(fd.get('fileUrl') || ''),
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

  async function deleteModule(moduleId: string) {
    if (!course || !confirm('Delete this module?')) return;
    const res = await adminApi.delete<{ course: Course }>(
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
    const res = await adminApi.delete<{ course: Course }>(
      `/api/admin/portal/courses/${course._id}/modules/${moduleId}/lessons/${lessonId}`
    );
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setCourse(res.data.course);
  }

  async function setPublished(published: boolean) {
    if (!course) return;
    setBusy(true);
    const res = await adminApi.patch<{ course: Course }>(`/api/admin/portal/courses/${course._id}`, {
      published,
    });
    setBusy(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    setCourse(res.data.course);
  }

  if (!course && !error) {
    return (
      <div className="flex flex-1 items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-brand" />
      </div>
    );
  }

  if (!course) {
    return (
      <main className="px-5 py-10 sm:px-8">
        <p className="text-sm text-red-600">{error}</p>
        <Link href="/admin/courses" className="mt-3 inline-block text-sm font-semibold text-brand">
          Back to courses
        </Link>
      </main>
    );
  }

  const nextLocal = course.nextClassAt
    ? new Date(course.nextClassAt).toISOString().slice(0, 16)
    : '';

  return (
    <>
      <AdminPageHeader
        title={`Edit: ${course.title}`}
        subtitle="Course details, Meet link, modules and lessons"
        actions={
          <>
            <Link href="/admin/courses" className="text-xs font-bold text-brand hover:underline">
              All courses
            </Link>
            <Button
              type="button"
              variant="outline"
              className="h-10"
              disabled={busy}
              onClick={() => void setPublished(!course.published)}
            >
              {course.published ? 'Unpublish' : 'Publish'}
            </Button>
          </>
        }
      />
      <main className="space-y-6 px-5 py-8 sm:px-8">
        {error ? (
          <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
            {error}
          </p>
        ) : null}

        <form onSubmit={saveMeta} className="panel grid gap-3 p-5 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" defaultValue={course.title} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" name="slug" defaultValue={course.slug} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="level">Level</Label>
            <Input id="level" name="level" defaultValue={course.level} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="meetLink">Google Meet link</Label>
            <Input id="meetLink" name="meetLink" defaultValue={course.meetLink || ''} placeholder="https://meet.google.com/..." />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="timezone">Timezone</Label>
            <Input id="timezone" name="timezone" defaultValue={course.timezone || 'Asia/Karachi'} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="nextClassAt">Next class (optional shortcut)</Label>
            <Input id="nextClassAt" name="nextClassAt" type="datetime-local" defaultValue={nextLocal} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" defaultValue={course.description} rows={3} />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" disabled={busy} className="h-10">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save course details'}
            </Button>
          </div>
        </form>

        <section className="panel p-5">
          <h2 className="text-base font-extrabold text-ink">Modules & lessons</h2>
          <form onSubmit={addModule} className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
            <Input name="title" required placeholder="Module title" />
            <Input name="description" placeholder="Short description" />
            <Button type="submit" className="h-11">
              <Plus className="h-4 w-4" /> Add module
            </Button>
          </form>

          <div className="mt-6 space-y-4">
            {course.modules.map((mod) => (
              <div key={mod._id} className="rounded-2xl border border-border/80 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-extrabold text-ink">{mod.title}</p>
                    {mod.description ? <p className="text-xs text-muted">{mod.description}</p> : null}
                  </div>
                  <button
                    type="button"
                    onClick={() => void deleteModule(mod._id)}
                    className="text-muted hover:text-red-600"
                    aria-label="Delete module"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-3 space-y-2">
                  {mod.lessons.map((lesson) => (
                    <div
                      key={lesson._id}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-[#f8fafc] px-3 py-2"
                    >
                      <div>
                        <p className="text-sm font-bold text-ink">{lesson.title}</p>
                        <p className="text-[11px] text-muted">
                          {lesson.type}
                          {lesson.videoUrl ? ' · has video/link' : ''}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => void deleteLesson(mod._id, lesson._id)}
                        className="text-muted hover:text-red-600"
                        aria-label="Delete lesson"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <form onSubmit={(e) => void addLesson(mod._id, e)} className="mt-3 grid gap-2 sm:grid-cols-2">
                  <Input name="title" required placeholder="Lesson title" />
                  <Select name="type" defaultValue="lecture">
                    <option value="lecture">Lecture</option>
                    <option value="video">Video</option>
                    <option value="assignment">Assignment</option>
                    <option value="task">Task</option>
                  </Select>
                  <Input name="videoUrl" placeholder="YouTube / Meet / video URL" className="sm:col-span-2" />
                  <Input name="summary" placeholder="Short summary" className="sm:col-span-2" />
                  <Input name="fileUrl" placeholder="File URL (optional)" className="sm:col-span-2" />
                  <Button type="submit" variant="outline" className="h-10 sm:col-span-2">
                    <Plus className="h-4 w-4" /> Add lesson
                  </Button>
                </form>
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
