import type { ReviewedQuestion } from '@/lib/exams';

export function optionLabel(options: string[], index: number | null | undefined) {
  if (typeof index !== 'number' || !Number.isInteger(index) || index < 0 || index >= options.length) {
    return 'Not recorded';
  }
  return options[index];
}

export function ExamReview({ questions }: { questions: ReviewedQuestion[] }) {
  if (!questions.length) {
    return <p className="text-sm text-muted">No questions were recorded for this attempt.</p>;
  }

  return (
    <ol className="space-y-4">
      {questions.map((question, index) => {
        const status = question.correct ? 'Correct' : 'Incorrect';
        return (
          <li key={question.id || index} className="rounded-xl border border-border p-4">
            <p className="text-sm font-extrabold leading-6 text-ink">
              {index + 1}. {question.prompt}
            </p>
            <p className="mt-3 text-sm font-bold text-ink">
              <span className={question.correct ? 'text-emerald-700' : 'text-red-700'}>{status}</span>
              <span className="sr-only">. </span>
            </p>
            <p className="mt-2 text-sm leading-6 text-ink [overflow-wrap:anywhere]">
              <span className="font-bold">Your answer: </span>
              {optionLabel(question.options, question.selectedIndex)}
            </p>
            <p className="mt-1 text-sm leading-6 text-ink [overflow-wrap:anywhere]">
              <span className="font-bold">Correct answer: </span>
              {optionLabel(question.options, question.correctIndex)}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
