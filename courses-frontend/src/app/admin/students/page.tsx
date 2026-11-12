'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import Link from 'next/link';
import { Camera, Loader2, Pencil, RefreshCw, Trash2, UserCircle, X } from 'lucide-react';
import { adminApi } from '@/lib/admin-api';
import { parseApplicationInterest } from '@/lib/parse-application';
import { DESIGN_COURSES } from '@/data/catalog';
import { AdminPageHeader } from '@/components/admin/page-header';
import { Button } from '@/components/ui/button';
import { Input, Label, Select, Textarea } from '@/components/ui/input';

type Student = {
  id: string;
  name: string;
  email: string;
  country: string;
  avatarUrl: string;
  courseSlug: string;
  coursePreference: string;
  freelancedBefore: boolean | null;
  freelancingExperience: string;
  workPreference: string;
  gender: string;
  active: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  profileComplete: boolean;
  interest: string;
  couponCode: string;
};
type StudentList = { items: Student[]; total: number; page: number; pageSize: number };
type EditValues = Pick<Student, 'name' | 'country' | 'interest' | 'avatarUrl' | 'coursePreference' | 'freelancedBefore' | 'freelancingExperience' | 'workPreference' | 'gender'>;

function formatDate(value: string | null) {
  if (!value) return 'Never signed in';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Not available';
  return new Intl.DateTimeFormat('en-PK', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

function courseName(slug: string) {
  return DESIGN_COURSES.find((course) => course.slug === slug)?.shortName || slug || 'Not answered';
}

export default function AdminStudentsPage() {
  const [data, setData] = useState<StudentList | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [login, setLogin] = useState('all');
  const [page, setPage] = useState(1);
  const [refresh, setRefresh] = useState(0);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState<Student | null>(null);
  const [editValues, setEditValues] = useState<EditValues | null>(null);
  const [editError, setEditError] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    const query = new URLSearchParams({ page: String(page), search, login });
    adminApi.get<StudentList>(`/api/admin/portal/students/approved?${query}`).then((res) => {
      if (!active) return;
      if (!res.ok) setError(res.error);
      else if (res.data.total > 0 && res.data.items.length === 0 && page > 1) {
        setPage(Math.ceil(res.data.total / res.data.pageSize));
      } else setData(res.data);
      setLoading(false);
    });
    return () => { active = false; };
  }, [page, search, login, refresh]);

  function searchStudents(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
    setRefresh((value) => value + 1);
  }

  async function deleteStudent() {
    if (!studentToDelete || deleting) return;
    setDeleting(true);
    setError('');
    const result = await adminApi.delete<{ deletedStudentId: string }>(`/api/admin/portal/students/${studentToDelete.id}`);
    if (!result.ok) {
      setError(result.error);
    } else {
      if (data?.items.length === 1 && page > 1) setPage((value) => value - 1);
      setStudentToDelete(null);
      setRefresh((value) => value + 1);
    }
    setDeleting(false);
  }

  function openEditor(student: Student) {
    setStudentToEdit(student);
    setEditValues({
      name: student.name,
      country: student.country,
      interest: student.interest,
      avatarUrl: student.avatarUrl,
      coursePreference: student.coursePreference,
      freelancedBefore: student.freelancedBefore,
      freelancingExperience: student.freelancingExperience,
      workPreference: student.workPreference,
      gender: student.gender,
    });
    setEditError('');
  }

  function closeEditor() {
    if (savingEdit || uploadingPhoto) return;
    setStudentToEdit(null);
    setEditValues(null);
    setEditError('');
  }

  async function uploadProfilePhoto(file: File | undefined) {
    if (!file || !editValues || savingEdit || uploadingPhoto) return;
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setEditError('Please choose a JPG, PNG, or WebP image.');
      return;
    }
    if (file.size === 0 || file.size > 10 * 1024 * 1024) {
      setEditError('Profile photos must be smaller than 10 MB.');
      return;
    }
    setEditError('');
    setUploadingPhoto(true);
    const result = await adminApi.upload<{ url: string }>('/api/admin/portal/upload', file);
    if (!result.ok) setEditError(result.error);
    else setEditValues((current) => current ? { ...current, avatarUrl: result.data.url } : current);
    setUploadingPhoto(false);
    if (photoInputRef.current) photoInputRef.current.value = '';
  }

  async function saveEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!studentToEdit || !editValues || savingEdit || uploadingPhoto) return;
    setSavingEdit(true);
    setEditError('');
    const payload = {
      ...editValues,
      freelancingExperience: editValues.freelancedBefore === false ? '' : editValues.freelancingExperience,
    };
    const result = await adminApi.patch<{ student: Student }>(`/api/admin/portal/students/${studentToEdit.id}/profile`, payload);
    if (!result.ok) {
      setEditError(result.error);
    } else {
      setData((current) => current ? { ...current, items: current.items.map((item) => item.id === result.data.student.id ? result.data.student : item) } : current);
      setStudentToEdit(null);
      setEditValues(null);
      setEditError('');
    }
    setSavingEdit(false);
  }

  const pages = data ? Math.max(1, Math.ceil(data.total / data.pageSize)) : 1;

  return (
    <>
      <AdminPageHeader title="Students" subtitle="Approved students, profile details, and login history." actions={
        <>
          <Link href="/admin" className="text-sm font-semibold text-brand">Overview</Link>
          <Button type="button" variant="outline" disabled={loading} onClick={() => setRefresh((value) => value + 1)}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />Refresh
          </Button>
        </>
      } />
      <main className="space-y-6 px-5 py-8 sm:px-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight text-ink">Approved students</h2>
            <p className="mt-1 max-w-2xl text-sm text-muted">See who has signed in and review their saved profile. Last login does not mean a student is currently online.</p>
          </div>
          <Link href="/admin/applications" className="text-sm font-semibold text-brand">Review pending applications</Link>
        </div>

        <form onSubmit={searchStudents} className="panel flex flex-col gap-4 p-5 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-2">
            <Label htmlFor="student-search">Search students</Label>
            <Input id="student-search" type="search" placeholder="Name or email address" maxLength={160} value={searchInput} onChange={(event) => setSearchInput(event.target.value)} />
          </div>
          <div className="space-y-2 sm:w-52">
            <Label htmlFor="login-filter">Login activity</Label>
            <Select id="login-filter" value={login} onChange={(event) => { setLogin(event.target.value); setPage(1); }}>
              <option value="all">All approved students</option>
              <option value="signed-in">Has signed in</option>
              <option value="never">Never signed in</option>
            </Select>
          </div>
          <Button type="submit" disabled={loading}>Search</Button>
        </form>

        {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
        {loading ? (
          <div role="status" className="flex items-center justify-center gap-2 py-16 text-sm text-muted"><Loader2 className="h-5 w-5 animate-spin" />Loading students…</div>
        ) : !error && data && (
          <>
            <p className="text-sm text-muted">{data.total} {data.total === 1 ? 'student' : 'students'} found</p>
            {data.items.length === 0 ? (
              <div className="panel p-10 text-center">
                <h3 className="font-bold text-ink">No students found</h3>
                <p className="mt-2 text-sm text-muted">Try a different search or login filter. Pending applications appear under Applications.</p>
              </div>
            ) : data.items.map((student) => {
              const application = parseApplicationInterest(student.interest);
              return (
                <article key={student.id} className="panel overflow-hidden">
                  <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between sm:p-6">
                    <div className="flex min-w-0 items-center gap-4">
                      {student.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={student.avatarUrl} alt={`${student.name} profile photo`} className="h-16 w-16 shrink-0 rounded-full object-cover" />
                      ) : <UserCircle className="h-16 w-16 shrink-0 rounded-full bg-brand-soft p-3 text-brand" strokeWidth={1.5} />}
                      <div className="min-w-0">
                        <h3 className="text-lg font-extrabold text-ink">{student.name}</h3>
                        <p className="break-all text-sm text-muted">{student.email}</p>
                        <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold">
                          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">Approved</span>
                          <span className={`rounded-full px-2.5 py-1 ${student.profileComplete ? 'bg-brand-soft text-brand' : 'bg-amber-50 text-amber-700'}`}>{student.profileComplete ? 'Profile complete' : 'Profile incomplete'}</span>
                          {!student.active && <span className="rounded-full bg-red-50 px-2.5 py-1 text-red-700">Account inactive</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-start gap-2 text-sm">
                      <div className="mr-2">
                        <p className="text-xs font-semibold text-muted">Last login</p>
                        <p className="mt-1 font-semibold text-ink">{formatDate(student.lastLoginAt)}</p>
                      </div>
                      <Button type="button" variant="outline" onClick={() => openEditor(student)}>
                        <Pencil className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="text-red-600 hover:border-red-200 hover:text-red-700"
                        onClick={() => setStudentToDelete(student)}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                  <details className="border-t border-border/70">
                    <summary className="cursor-pointer px-5 py-4 text-sm font-bold text-brand focus-visible:outline-brand sm:px-6">View student details</summary>
                    <dl className="grid gap-5 px-5 pb-6 sm:grid-cols-2 sm:px-6 lg:grid-cols-3">
                      <Detail label="Course preference" value={courseName(student.coursePreference)} />
                      <Detail label="Applied course" value={student.courseSlug ? courseName(student.courseSlug) : application.course} />
                      <Detail label="Freelanced online before" value={student.freelancedBefore == null ? 'Not answered' : student.freelancedBefore ? 'Yes' : 'No'} />
                      <Detail label="Freelancing commitment" value={student.workPreference === 'full-time' ? 'Full-time' : student.workPreference === 'part-time' ? 'Part-time' : 'Not answered'} />
                      <Detail label="Gender" value={student.gender === 'male' ? 'Man' : student.gender === 'female' ? 'Woman' : 'Not answered'} />
                      <Detail label="Country" value={student.country} />
                      <Detail label="WhatsApp" value={application.whatsapp} />
                      <Detail label="Timezone" value={application.timezone} />
                      <Detail label="Joined" value={formatDate(student.createdAt)} />
                      <Detail label="Account status" value={student.active ? 'Active' : 'Inactive'} />
                      <Detail label="Coupon" value={student.couponCode || application.coupon} />
                      <Detail label="Account ID" value={student.id} />
                      <div className="sm:col-span-2 lg:col-span-3">
                        <Detail label="Platforms and freelancing experience" value={student.freelancedBefore === false ? 'No previous online freelancing experience.' : student.freelancingExperience} />
                      </div>
                    </dl>
                  </details>
                </article>
              );
            })}
            {data.total > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-muted">Page {page} of {pages}</p>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" disabled={page <= 1} onClick={() => setPage((value) => value - 1)}>Previous</Button>
                  <Button type="button" variant="outline" disabled={page >= pages} onClick={() => setPage((value) => value + 1)}>Next</Button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
      {studentToEdit && editValues ? (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/50 p-5" role="presentation">
          <div role="dialog" aria-modal="true" aria-labelledby="edit-student-title" className="mx-auto my-8 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="edit-student-title" className="text-xl font-extrabold text-ink">Edit student profile</h2>
                <p className="mt-1 text-sm text-muted">Changes save directly to the student account without sending a notification.</p>
              </div>
              <button type="button" aria-label="Close editor" onClick={closeEditor} disabled={savingEdit || uploadingPhoto} className="rounded-lg p-2 text-muted hover:bg-slate-100 disabled:opacity-50"><X className="h-5 w-5" /></button>
            </div>
            {editError && <p role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{editError}</p>}
            <form onSubmit={saveEdit} className="mt-6 space-y-5">
              <div className="flex items-center gap-4">
                {editValues.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={editValues.avatarUrl} alt="Student profile" className="h-20 w-20 rounded-full object-cover" />
                ) : <UserCircle className="h-20 w-20 rounded-full bg-brand-soft p-3 text-brand" strokeWidth={1.5} />}
                <div className="space-y-2">
                  <input ref={photoInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(event) => void uploadProfilePhoto(event.target.files?.[0])} />
                  <div className="flex flex-wrap gap-2">
                    <Button type="button" variant="outline" disabled={savingEdit || uploadingPhoto} onClick={() => photoInputRef.current?.click()}><Camera className="h-4 w-4" />{uploadingPhoto ? 'Uploading…' : 'Change photo'}</Button>
                    {editValues.avatarUrl && <Button type="button" variant="outline" disabled={savingEdit || uploadingPhoto} onClick={() => setEditValues((current) => current ? { ...current, avatarUrl: '' } : current)}>Remove</Button>}
                  </div>
                  <p className="text-xs text-muted">JPG, PNG, or WebP up to 10 MB.</p>
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2"><Label htmlFor="edit-name">Name</Label><Input id="edit-name" required minLength={2} maxLength={80} value={editValues.name} disabled={savingEdit || uploadingPhoto} onChange={(event) => setEditValues((current) => current ? { ...current, name: event.target.value } : current)} /></div>
                <div className="space-y-2"><Label htmlFor="edit-country">Country</Label><Input id="edit-country" minLength={2} maxLength={80} value={editValues.country} disabled={savingEdit || uploadingPhoto} onChange={(event) => setEditValues((current) => current ? { ...current, country: event.target.value } : current)} /></div>
                <div className="space-y-2"><Label htmlFor="edit-course">Course preference</Label><Select id="edit-course" value={editValues.coursePreference} disabled={savingEdit || uploadingPhoto} onChange={(event) => setEditValues((current) => current ? { ...current, coursePreference: event.target.value } : current)}><option value="">Not answered</option>{DESIGN_COURSES.map((course) => <option key={course.slug} value={course.slug}>{course.shortName}</option>)}</Select></div>
                <div className="space-y-2"><Label htmlFor="edit-freelanced">Freelanced online before</Label><Select id="edit-freelanced" value={editValues.freelancedBefore == null ? '' : editValues.freelancedBefore ? 'yes' : 'no'} disabled={savingEdit || uploadingPhoto} onChange={(event) => setEditValues((current) => current ? { ...current, freelancedBefore: event.target.value === '' ? null : event.target.value === 'yes', freelancingExperience: event.target.value === 'no' ? '' : current.freelancingExperience } : current)}><option value="">Not answered</option><option value="yes">Yes</option><option value="no">No</option></Select></div>
                <div className="space-y-2"><Label htmlFor="edit-work">Work preference</Label><Select id="edit-work" value={editValues.workPreference} disabled={savingEdit || uploadingPhoto} onChange={(event) => setEditValues((current) => current ? { ...current, workPreference: event.target.value } : current)}><option value="">Not answered</option><option value="full-time">Full-time</option><option value="part-time">Part-time</option></Select></div>
                <div className="space-y-2"><Label htmlFor="edit-gender">Gender</Label><Select id="edit-gender" value={editValues.gender} disabled={savingEdit || uploadingPhoto} onChange={(event) => setEditValues((current) => current ? { ...current, gender: event.target.value } : current)}><option value="">Not answered</option><option value="male">Man</option><option value="female">Woman</option></Select></div>
              </div>
              <div className="space-y-2"><Label htmlFor="edit-interest">Application interest</Label><Textarea id="edit-interest" maxLength={4000} value={editValues.interest} disabled={savingEdit || uploadingPhoto} onChange={(event) => setEditValues((current) => current ? { ...current, interest: event.target.value } : current)} /></div>
              {editValues.freelancedBefore !== false && <div className="space-y-2"><Label htmlFor="edit-experience">Freelancing experience</Label><Textarea id="edit-experience" maxLength={2000} value={editValues.freelancingExperience} disabled={savingEdit || uploadingPhoto} onChange={(event) => setEditValues((current) => current ? { ...current, freelancingExperience: event.target.value } : current)} /></div>}
              <div className="flex justify-end gap-3 border-t border-border/70 pt-5"><Button type="button" variant="outline" disabled={savingEdit || uploadingPhoto} onClick={closeEditor}>Cancel</Button><Button type="submit" disabled={savingEdit || uploadingPhoto}>{savingEdit && <Loader2 className="h-4 w-4 animate-spin" />}{savingEdit ? 'Saving…' : 'Save changes'}</Button></div>
            </form>
          </div>
        </div>
      ) : null}
      {studentToDelete ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-5" role="presentation">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-student-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >
            <h2 id="delete-student-title" className="text-xl font-extrabold text-ink">Delete student?</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              This permanently deletes <strong className="text-ink">{studentToDelete.name}</strong> ({studentToDelete.email}) and removes their enrollments and quiz attempts. This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button type="button" variant="outline" disabled={deleting} onClick={() => setStudentToDelete(null)}>
                Cancel
              </Button>
              <Button type="button" className="bg-red-600 hover:bg-red-700" disabled={deleting} onClick={deleteStudent}>
                {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                {deleting ? 'Deleting…' : 'Delete student'}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function Detail({ label, value }: { label: string; value?: string }) {
  return <div><dt className="text-xs font-semibold text-muted">{label}</dt><dd className="mt-1 whitespace-pre-wrap break-words text-sm font-semibold text-ink">{value || 'Not provided'}</dd></div>;
}
