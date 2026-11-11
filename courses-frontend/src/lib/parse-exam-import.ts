export type ImportedQuestion = {
  prompt: string;
  options: [string, string, string, string];
  correctIndex: number;
};

export type ImportIssue = { question?: number; message: string };
export type ParsedExamImport = {
  title: string;
  questions: ImportedQuestion[];
  errors: ImportIssue[];
  warnings: ImportIssue[];
};

const questionMarker = /^Q\s*\d+\s*[.):]\s*(.*)$/i;
const optionMarker = /^([A-D])\s*[).:]\s*(.*)$/i;
const answerMarker = /^correct\s+answer\s*:\s*([A-D])\b(?:\s*[).:]?\s*(.*))?$/i;

export function parseExamImport(input: string): ParsedExamImport {
  const lines = input.replace(/^﻿/, "").replace(/\r\n?/g, "\n").split("\n");
  const errors: ImportIssue[] = [];
  const warnings: ImportIssue[] = [];
  const firstQuestion = lines.findIndex((line) =>
    questionMarker.test(line.trim()),
  );
  if (firstQuestion < 0)
    return {
      title: "",
      questions: [],
      errors: [
        { message: "No Q1, Q2, or similar question blocks were found." },
      ],
      warnings,
    };

  const beforeQuestions = lines
    .slice(0, firstQuestion)
    .map((line) => line.trim())
    .filter(Boolean);
  const titleLine = beforeQuestions.find((line) => /^title\s*:/i.test(line));
  const title = titleLine
    ? titleLine.replace(/^title\s*:/i, "").trim()
    : beforeQuestions[0] || "";
  if (!title)
    errors.push({ message: "Add a title before the first question." });
  if (title.length > 160)
    errors.push({ message: "The title must be 160 characters or fewer." });
  if (beforeQuestions.length > 1)
    warnings.push({ message: "Ignored extra text before the first question." });

  const blocks: string[][] = [];
  let current: string[] = [];
  for (const line of lines.slice(firstQuestion)) {
    if (questionMarker.test(line.trim())) {
      if (current.length) blocks.push(current);
      current = [];
    }
    current.push(line);
  }
  if (current.length) blocks.push(current);
  if (blocks.length > 50)
    errors.push({ message: "A quiz can contain at most 50 questions." });

  const questions: ImportedQuestion[] = [];
  blocks.slice(0, 50).forEach((block, blockIndex) => {
    const number = blockIndex + 1;
    const marker = block[0].trim().match(questionMarker);
    const promptLines: string[] = [];
    const options: string[] = ["", "", "", ""];
    const seen = new Set<number>();
    let answerIndex: number | null = null;
    let answerText = "";
    let optionsStarted = false;
    for (const rawLine of [marker?.[1] || "", ...block.slice(1)]) {
      const line = rawLine.trim();
      if (!line) continue;
      const option = line.match(optionMarker);
      const answer = line.match(answerMarker);
      if (answer) {
        answerIndex = answer[1].toUpperCase().charCodeAt(0) - 65;
        answerText = (answer[2] || "").trim();
        continue;
      }
      if (option) {
        const index = option[1].toUpperCase().charCodeAt(0) - 65;
        if (seen.has(index))
          errors.push({
            question: number,
            message: `Option ${option[1].toUpperCase()} is repeated.`,
          });
        seen.add(index);
        options[index] = option[2].trim();
        optionsStarted = true;
        continue;
      }
      if (optionsStarted)
        warnings.push({
          question: number,
          message: `Ignored unrecognized line: “${line}”.`,
        });
      else promptLines.push(line);
    }
    const prompt = promptLines.join(" ").replace(/\s+/g, " ").trim();
    if (!prompt)
      errors.push({ question: number, message: "Question text is missing." });
    if (prompt.length > 500)
      errors.push({
        question: number,
        message: "Question text must be 500 characters or fewer.",
      });
    options.forEach((option, index) => {
      if (!option)
        errors.push({
          question: number,
          message: `Option ${String.fromCharCode(65 + index)} is missing.`,
        });
      if (option.length > 300)
        errors.push({
          question: number,
          message: `Option ${String.fromCharCode(65 + index)} must be 300 characters or fewer.`,
        });
    });
    if (answerIndex === null)
      errors.push({ question: number, message: "Correct Answer is missing." });
    else if (
      answerText &&
      answerText.toLowerCase() !== options[answerIndex].toLowerCase()
    )
      warnings.push({
        question: number,
        message:
          "Correct Answer text differs from the selected option; the answer letter was used.",
      });
    questions.push({
      prompt,
      options: options as [string, string, string, string],
      correctIndex: answerIndex ?? 0,
    });
  });
  return {
    title: title.trim(),
    questions: errors.length ? [] : questions,
    errors,
    warnings,
  };
}
