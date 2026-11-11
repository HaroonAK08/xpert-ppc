import { Router } from 'express';
import { isValidObjectId } from 'mongoose';

import { Exam } from '../models/Exam';
import { ExamAttempt } from '../models/ExamAttempt';
import { Student } from '../models/Student';
import { requireAuth, requireApprovedStudent, requireRole } from '../middleware/auth';
import { ApiError, asyncHandler } from '../middleware/error';
import { examSchema, examSubmitSchema, examUpdateSchema } from '../validation/portal';

export const adminExamsRouter = Router();
export const studentExamsRouter = Router();
adminExamsRouter.use(requireAuth, requireRole('admin'));
studentExamsRouter.use(requireApprovedStudent);

function validId(id: string) {
  if (!isValidObjectId(id)) throw new ApiError(400, 'Choose a valid exam.');
}

function serializeExam(exam: InstanceType<typeof Exam>, includeAnswers: boolean) {
  return {
    id: String(exam._id),
    title: exam.title,
    description: exam.description || '',
    published: exam.published,
    createdAt: exam.createdAt,
    questions: exam.questions.map((question) => ({
      id: String(question._id),
      prompt: question.prompt,
      options: question.options,
      ...(includeAnswers ? { correctIndex: question.correctIndex } : {}),
    })),
  };
}

function serializeAttempt(attempt: InstanceType<typeof ExamAttempt>) {
  return {
    id: String(attempt._id),
    studentId: String(attempt.studentId),
    studentName: attempt.studentName,
    studentEmail: attempt.studentEmail,
    score: attempt.score,
    total: attempt.total,
    percent: attempt.percent,
    answers: attempt.answers,
    submittedAt: attempt.submittedAt,
  };
}

adminExamsRouter.get('/', asyncHandler(async (req, res) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const pageSize = 20;
  const [exams, total] = await Promise.all([
    Exam.find().sort({ createdAt: -1, _id: -1 }).skip((page - 1) * pageSize).limit(pageSize),
    Exam.countDocuments(),
  ]);
  const counts = await ExamAttempt.aggregate<{ _id: string; count: number }>([
    { $match: { examId: { $in: exams.map((exam) => exam._id) } } },
    { $group: { _id: '$examId', count: { $sum: 1 } } },
  ]);
  const countMap = new Map(counts.map((item) => [String(item._id), item.count]));
  res.json({
    items: exams.map((exam) => ({ ...serializeExam(exam, true), attemptCount: countMap.get(String(exam._id)) || 0 })),
    total,
    page,
    pageSize,
  });
}));

adminExamsRouter.post('/', asyncHandler(async (req, res) => {
  const parsed = examSchema.safeParse(req.body);
  if (!parsed.success) throw new ApiError(400, 'Add a title and at least one valid question.');
  const exam = await Exam.create(parsed.data);
  res.status(201).json({ item: serializeExam(exam, true) });
}));

adminExamsRouter.get('/:id', asyncHandler(async (req, res) => {
  validId(req.params.id);
  const exam = await Exam.findById(req.params.id);
  if (!exam) throw new ApiError(404, 'Exam not found.');
  res.json({ item: serializeExam(exam, true) });
}));

adminExamsRouter.patch('/:id', asyncHandler(async (req, res) => {
  validId(req.params.id);
  const parsed = examUpdateSchema.safeParse(req.body);
  if (!parsed.success) throw new ApiError(400, 'Invalid exam data.');
  const exam = await Exam.findById(req.params.id);
  if (!exam) throw new ApiError(404, 'Exam not found.');
  if (parsed.data.questions && await ExamAttempt.exists({ examId: exam._id })) {
    throw new ApiError(409, 'This exam already has attempts, so its questions cannot be changed.');
  }
  Object.assign(exam, parsed.data);
  await exam.save();
  res.json({ item: serializeExam(exam, true) });
}));

adminExamsRouter.delete('/:id', asyncHandler(async (req, res) => {
  validId(req.params.id);
  const exam = await Exam.findById(req.params.id);
  if (!exam) throw new ApiError(404, 'Exam not found.');
  if (await ExamAttempt.exists({ examId: exam._id })) {
    throw new ApiError(409, 'This exam has attempts and cannot be deleted.');
  }
  await exam.deleteOne();
  res.json({ ok: true });
}));

adminExamsRouter.get('/:id/attempts', asyncHandler(async (req, res) => {
  validId(req.params.id);
  if (!await Exam.exists({ _id: req.params.id })) throw new ApiError(404, 'Exam not found.');
  const page = Math.max(1, Number(req.query.page) || 1);
  const pageSize = 20;
  const [attempts, total] = await Promise.all([
    ExamAttempt.find({ examId: req.params.id }).sort({ submittedAt: -1, _id: -1 }).skip((page - 1) * pageSize).limit(pageSize),
    ExamAttempt.countDocuments({ examId: req.params.id }),
  ]);
  res.json({ items: attempts.map(serializeAttempt), total, page, pageSize });
}));

studentExamsRouter.get('/', asyncHandler(async (req, res) => {
  const exams = await Exam.find({ published: true }).sort({ createdAt: -1, _id: -1 }).limit(100);
  const attempts = await ExamAttempt.find({
    studentId: req.student!.sub,
    examId: { $in: exams.map((exam) => exam._id) },
  });
  const attemptMap = new Map(attempts.map((attempt) => [String(attempt.examId), attempt]));
  res.json({ items: exams.map((exam) => {
    const attempt = attemptMap.get(String(exam._id));
    return {
      id: String(exam._id), title: exam.title, description: exam.description || '',
      questionCount: exam.questions.length, createdAt: exam.createdAt,
      attempted: Boolean(attempt), score: attempt?.score ?? null, total: attempt?.total ?? null,
      percent: attempt?.percent ?? null, submittedAt: attempt?.submittedAt ?? null,
    };
  }) });
}));

studentExamsRouter.get('/:id', asyncHandler(async (req, res) => {
  validId(req.params.id);
  const exam = await Exam.findOne({ _id: req.params.id, published: true });
  if (!exam) throw new ApiError(404, 'Exam not found.');
  const attempt = await ExamAttempt.findOne({ examId: exam._id, studentId: req.student!.sub });
  res.json({
    exam: serializeExam(exam, false),
    attempt: attempt ? {
      score: attempt.score, total: attempt.total, percent: attempt.percent,
      answers: attempt.answers, submittedAt: attempt.submittedAt,
    } : null,
  });
}));

studentExamsRouter.post('/:id/submit', asyncHandler(async (req, res) => {
  validId(req.params.id);
  const parsed = examSubmitSchema.safeParse(req.body);
  if (!parsed.success) throw new ApiError(400, 'Submit one answer for every question.');
  const exam = await Exam.findOne({ _id: req.params.id, published: true });
  if (!exam) throw new ApiError(404, 'Exam not found.');
  if (parsed.data.answers.length !== exam.questions.length) {
    throw new ApiError(400, 'Submit one answer for every question.');
  }
  const student = await Student.findById(req.student!.sub);
  if (!student) throw new ApiError(401, 'Student account not found.');
  const score = parsed.data.answers.reduce((total, answer, index) =>
    total + (answer === exam.questions[index].correctIndex ? 1 : 0), 0);
  try {
    const attempt = await ExamAttempt.create({
      examId: exam._id,
      studentId: student._id,
      studentName: student.name,
      studentEmail: student.email,
      answers: parsed.data.answers,
      score,
      total: exam.questions.length,
      percent: Math.round((score / exam.questions.length) * 100),
      submittedAt: new Date(),
    });
    res.status(201).json({ attempt: {
      score: attempt.score, total: attempt.total, percent: attempt.percent, submittedAt: attempt.submittedAt,
    } });
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      throw new ApiError(409, 'You have already submitted this exam.');
    }
    throw error;
  }
}));
