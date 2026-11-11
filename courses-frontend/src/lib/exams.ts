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

export type ExamQuestion = { id: string; prompt: string; options: string[]; correctIndex?: number };
export type ExamDetail = ExamListItem & { questions: ExamQuestion[] };
export type ExamAttempt = { score: number; total: number; percent: number; submittedAt: string; answers?: number[] };
