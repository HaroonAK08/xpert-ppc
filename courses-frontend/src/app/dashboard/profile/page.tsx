'use client';

import { useRef, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Loader2, LogOut, Mail, UserCircle } from 'lucide-react';
import { api } from '@/lib/api';
import { useStudent, useUpdateStudent, logoutStudent } from '@/lib/student-context';
import { DashboardPageHeader } from '@/components/dashboard/page-header';
import { Button } from '@/components/ui/button';
import { Label, Select, Textarea } from '@/components/ui/input';
import { DESIGN_COURSES } from '@/data/catalog';

export default function ProfilePage() {
  const student = useStudent();
  const updateStudent = useUpdateStudent();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [photoSaved, setPhotoSaved] = useState(false);
  const [coursePreference, setCoursePreference] = useState(student?.coursePreference || '');
  const [freelancedBefore, setFreelancedBefore] = useState(student?.freelancedBefore == null ? '' : student.freelancedBefore ? 'yes' : 'no');
  const [experience, setExperience] = useState(student?.freelancingExperience || '');
  const [workPreference, setWorkPreference] = useState(student?.workPreference || '');
  const [gender, setGender] = useState(student?.gender || '');
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const incomplete = student?.profileComplete === false;
  const busy = uploading || saving;

  const avatarSrc = preview || student?.avatarUrl || '';

  function validateStep(current: number): string {
    if (current === 1 && !DESIGN_COURSES.some((course) => course.slug === coursePreference)) return 'Please choose your preferred course.';
    if (current === 2) {
      if (!freelancedBefore) return 'Please tell us whether you have freelanced online before.';
      if (freelancedBefore === 'yes' && experience.trim().length < 10) return 'Please describe the platforms you have used and your work (at least 10 characters).';
    }
    if (current === 3) {
      if (!workPreference) return 'Please choose full-time or part-time.';
      if (!gender) return 'Please select your gender.';
      if (gender === 'male' && !student?.avatarUrl) return 'Please add a profile photo to complete your profile.';
    }
    return '';
  }

  function nextStep() {
    const message = validateStep(step);
    setError(message);
    if (!message) setStep((current) => current + 1);
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    if (incomplete && step < 3) {
      nextStep();
      return;
    }
    for (let current = 1; current <= 3; current++) {
      const message = validateStep(current);
      if (message) {
        setStep(current);
        setError(message);
        return;
      }
    }
    setError('');
    setSaved(false);
    setSaving(true);
    try {
      const res = await api.patch<{ user: NonNullable<typeof student> }>('/api/student/auth/profile', {
        coursePreference,
        freelancedBefore: freelancedBefore === 'yes',
        freelancingExperience: freelancedBefore === 'yes' ? experience.trim() : '',
        workPreference,
        gender,
        completeProfile: true,
      });
      if (!res.ok) throw new Error(res.error);
      updateStudent(res.data.user);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save your profile. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function onPick(file: File | undefined) {
    if (!file || busy) return;
    setPhotoSaved(false);
    if (file.size === 0) {
      setError('This image is empty. Please choose another photo.');
      if (inputRef.current) inputRef.current.value = '';
      return;
    }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
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
      const uploadRes = await fetch('/api/upload-image', { method: 'POST', body, signal: AbortSignal.timeout(45_000) });
      const uploadData = (await uploadRes.json().catch(() => null)) as { url?: string; error?: string } | null;
      if (!uploadRes.ok || !uploadData?.url) {
        throw new Error(uploadData?.error || 'Failed to upload photo. Please try again.');
      }

      const saveRes = await api.patch<{ ok: boolean; user: NonNullable<typeof student> }>(
        '/api/student/auth/profile',
        { avatarUrl: uploadData.url }
      );
      if (!saveRes.ok) throw new Error(saveRes.error);

      updateStudent(saveRes.data.user);
      setPhotoSaved(true);
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
        <h2 className="text-2xl font-extrabold tracking-tight text-ink">{incomplete ? 'Complete your profile' : 'Your profile'}</h2>
        <p className="mt-1 text-sm text-muted">{incomplete ? 'Complete your profile here whenever you are ready. You can continue using the dashboard without answering these questions.' : 'Keep your course preferences and freelancing goals up to date.'}</p>

        <div className="mt-6 max-w-5xl space-y-6">
          <section aria-label="Student profile" className="panel p-6 sm:p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-7">
            <div className="relative w-fit shrink-0 self-start">
              {avatarSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarSrc}
                  alt={student?.name ? `${student.name} profile photo` : 'Profile photo'}
                  className="h-28 w-28 rounded-full object-cover ring-2 ring-brand/20 sm:h-32 sm:w-32"
                />
              ) : (
                <span className="flex h-28 w-28 items-center justify-center rounded-full bg-brand-soft text-brand sm:h-32 sm:w-32">
                  <UserCircle className="h-16 w-16" strokeWidth={1.5} />
                </span>
              )}
              <button
                type="button"
                disabled={busy}
                onClick={() => inputRef.current?.click()}
                className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-brand text-white transition hover:bg-brand/90 disabled:opacity-60"
                aria-label="Upload profile photo"
              >
                {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Camera className="h-3.5 w-3.5" />}
              </button>
              <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => void onPick(e.target.files?.[0])}
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Student profile</p>
              <h3 className="mt-1 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">{student?.name ?? '—'}</h3>
              <p className="mt-2 flex items-center gap-2 break-all text-sm text-muted">
                <Mail className="h-4 w-4 shrink-0" />
                {student?.email ?? '—'}
              </p>
              <button
                type="button"
                disabled={busy}
                onClick={() => inputRef.current?.click()}
                className="mt-4 inline-flex h-11 items-center gap-2 rounded-xl border border-border px-4 text-sm font-semibold text-brand transition hover:bg-brand-soft disabled:opacity-60"
              >
                {avatarSrc ? 'Change photo' : 'Add profile photo'}
              </button>
            </div>
          </div>

          <p className="mt-6 border-t border-border pt-4 text-sm leading-relaxed text-muted">A profile photo is required for men and optional for women. JPG, PNG, or WebP, up to 10 MB.</p>
          {photoSaved && <p role="status" className="mt-3 text-sm font-semibold text-emerald-700">Profile photo saved. You do not need to complete the questionnaire to upload a photo.</p>}
          </section>

          <section aria-label="Profile preferences" className="panel p-6 sm:p-8">
          <h3 className="text-xl font-bold text-ink">{incomplete ? 'Tell us about yourself' : 'Your learning preferences'}</h3>
          <p className="mt-1 text-sm text-muted">Help us understand your experience and goals.</p>

          {error ? (
            <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700">
              {error}
            </p>
          ) : null}

          {saved && <p role="status" className="mt-4 text-sm font-semibold text-green-700">Your profile has been saved.</p>}

          <form onSubmit={saveProfile} className="mt-6 space-y-5 border-t border-border pt-5">
            {incomplete && (
              <div aria-label={`Step ${step} of 3`}>
                <p className="text-xs font-semibold text-muted">Step {step} of 3 · All questions are required</p>
                <div className="mt-2 flex gap-2" aria-hidden="true">
                  {[1, 2, 3].map((item) => <span key={item} className={`h-1 flex-1 rounded-full ${item <= step ? 'bg-brand' : 'bg-border'}`} />)}
                </div>
              </div>
            )}

            {(!incomplete || step === 1) && (
              <div className="space-y-2">
                <Label htmlFor="coursePreference">Which course would you like to take? *</Label>
                <Select id="coursePreference" value={coursePreference} disabled={busy} onChange={(event) => { setCoursePreference(event.target.value); setSaved(false); }} required>
                  <option value="" disabled>Select a course</option>
                  {DESIGN_COURSES.map((course) => <option key={course.slug} value={course.slug}>{course.shortName}</option>)}
                </Select>
                <p className="text-xs text-muted">This records your preference; it does not change your course enrollment.</p>
              </div>
            )}

            {(!incomplete || step === 2) && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="freelancedBefore">Have you freelanced online before? *</Label>
                  <Select id="freelancedBefore" value={freelancedBefore} disabled={busy} onChange={(event) => { setFreelancedBefore(event.target.value); setSaved(false); }} required>
                    <option value="" disabled>Select an answer</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </Select>
                </div>
                {freelancedBefore === 'yes' && (
                  <div className="space-y-2">
                    <Label htmlFor="experience">Which platforms have you used—for example, Upwork or Fiverr—and what work have you done? *</Label>
                    <Textarea id="experience" value={experience} disabled={busy} onChange={(event) => { setExperience(event.target.value); setSaved(false); }} minLength={10} maxLength={2000} required placeholder="Tell us about the platforms you used and the services you offered." />
                  </div>
                )}
              </div>
            )}

            {(!incomplete || step === 3) && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="workPreference">Do you plan to freelance full-time or part-time? *</Label>
                  <Select id="workPreference" value={workPreference} disabled={busy} onChange={(event) => { setWorkPreference(event.target.value); setSaved(false); }} required>
                    <option value="" disabled>Select your preference</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender *</Label>
                  <Select id="gender" value={gender} disabled={busy} onChange={(event) => { setGender(event.target.value); setSaved(false); }} required>
                    <option value="" disabled>Select your gender</option>
                    <option value="male">Man</option>
                    <option value="female">Woman</option>
                  </Select>
                  <p className="text-xs text-muted">We use this answer to apply the profile-photo requirement.</p>
                </div>
                {gender === 'male' && !student?.avatarUrl && (
                  <button type="button" disabled={busy} onClick={() => inputRef.current?.click()} className="text-sm font-semibold text-brand underline">Add your required profile photo</button>
                )}
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              {incomplete && step > 1 && <Button type="button" variant="outline" disabled={busy} onClick={() => { setStep((current) => current - 1); setError(''); }}>Back</Button>}
              {incomplete && step < 3 ? (
                <Button key="next" type="submit" disabled={busy}>Continue</Button>
              ) : (
                <Button key="save" type="submit" disabled={busy}>{saving && <Loader2 className="h-4 w-4 animate-spin" />}{incomplete ? 'Complete profile' : 'Save changes'}</Button>
              )}
            </div>
          </form>

          <div className="mt-6 border-t border-border/70 pt-5">
            <p className="text-xs font-semibold text-muted">Account ID</p>
            <p className="mt-1 break-all font-mono text-xs text-muted">{student?.id ?? '—'}</p>
          </div>

          <button
            type="button"
            disabled={busy}
            onClick={async () => {
              await logoutStudent();
              router.replace('/login');
            }}
            className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-border text-sm font-bold text-ink transition hover:bg-[#f8fafc]"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
          </section>
        </div>
      </main>
    </>
  );
}
