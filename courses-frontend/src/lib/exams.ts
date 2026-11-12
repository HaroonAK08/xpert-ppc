export type ExamListItem = {
  id: string;
  title: string;
  description: string;
  published?: boolean;
  questionCount: number;
  attemptCount?: number;
  attempted?: boolean;
  score?: number | null;
  total?: number | null;
  percent?: number | null;
  submittedAt?: string | null;
  createdAt: string;
};

export type ExamQuestion = { id: string; prompt: string; options: string[] };
export type ExamDetail = ExamListItem & { questions: ExamQuestion[] };
export type ExamAttempt = { score: number; total: number; percent: number; submittedAt: string };
/** Returned only after a student submits, or on the admin results endpoint. Never present on an unsubmitted exam. */
export type ReviewedQuestion = {
  id: string;
  prompt: string;
  options: string[];
  selectedIndex: number | null;
  correctIndex: number | null;
  correct: boolean;
};
export type ReviewedAttempt = ExamAttempt & { questions?: ReviewedQuestion[] };
export type AdminExamAttempt = ReviewedAttempt & {
  id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
};
export type AdminAttemptList = { items: AdminExamAttempt[]; total: number; page: number; pageSize: number };
