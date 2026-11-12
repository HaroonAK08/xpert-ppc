'use client';

import { useEffect, useState } from 'react';
import { adminApi } from '@/lib/admin-api';
import { Button } from '@/components/ui/button';
import { StudentDialog } from './student-dialog';

type Progress = {
  student: { id: string; name: string; email: string };
  courses: { id: string; title: string; completedLessons: number; totalLessons: number; percent: number }[];
  exams: { id: string; title: string; score: number; total: number; percent: number; submittedAt: string }[];
};
export function StudentProgress({ student, onClose }: { student: { id: string; name: string }; onClose: () => void }) {
  const [data, setData] = useState<Progress | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true); setError('');
    adminApi.get<Progress>(`/api/admin/portal/students/${encodeURIComponent(student.id)}/progress`).then((result) => {
      if (!active) return;
      if (!result.ok) setError(result.error); else setData(result.data);
      setLoading(false);
    });
    return () => { active = false; };
  }, [student.id, refresh]);
  return <StudentDialog title="Student progress" wide onClose={onClose}>
    <p className="break-words text-sm text-muted">Learning progress for {student.name}. Lesson completion is not a measure of attendance or watch time.</p>
    {loading ? <p role="status" className="py-6 text-sm text-muted">Loading progress…</p> : error ? <div className="mt-5 space-y-3"><p role="alert" className="text-sm text-red-700">{error}</p><Button type="button" className="min-h-11" variant="outline" onClick={() => setRefresh((value) => value + 1)}>Retry</Button></div> : data && <div className="mt-6 space-y-6">
      <section aria-labelledby="course-progress-title"><h3 id="course-progress-title" className="font-bold text-ink">Published courses</h3>
        {!data.courses.length ? <p className="mt-2 text-sm text-muted">No published courses to show.</p> : <ul className="mt-3 space-y-3">{data.courses.map((course) => <li key={course.id} className="rounded-xl border border-border p-4"><h4 className="break-words text-sm font-bold text-ink">{course.title}</h4><p className="mt-1 text-sm text-muted">Lessons completed: {course.completedLessons} of {course.totalLessons} · {course.percent}% complete</p></li>)}</ul>}
      </section>
      <section aria-labelledby="quiz-progress-title"><h3 id="quiz-progress-title" className="font-bold text-ink">Quiz results</h3><p className="mt-1 text-xs text-muted">Quiz attempts are student-wide, not linked to individual courses.</p>
        {!data.exams.length ? <p className="mt-2 text-sm text-muted">No submitted quiz attempts.</p> : <ul className="mt-3 space-y-3">{data.exams.map((exam, index) => <li key={`${exam.id}-${index}`} className="rounded-xl border border-border p-4"><h4 className="break-words text-sm font-bold text-ink">{exam.title}</h4><p className="mt-1 text-sm text-muted">Score: {exam.score} of {exam.total} · {exam.percent}%</p><p className="mt-1 text-xs text-muted">Submitted {new Date(exam.submittedAt).toLocaleString()}</p></li>)}</ul>}
      </section>
    </div>}
  </StudentDialog>;
}
