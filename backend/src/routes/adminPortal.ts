import { Router } from 'express';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import { randomBytes } from 'node:crypto';
import { Exam } from '../models/Exam';
import { hashPassword } from '../utils/password';
import { isAcademyMailConfigured } from '../utils/mail';
import { invitationCreateSchema, studentActiveSchema } from '../validation/portal';
import { deliverInvitation, invitationItem, invitationSelection, newInvitation, ordinaryStudentFilter } from '../utils/studentInvitation';

import { PortalCourse } from '../models/PortalCourse';
import { Student } from '../models/Student';
import { Enrollment } from '../models/Enrollment';
import { ExamAttempt } from '../models/ExamAttempt';
import { ClassSession } from '../models/ClassSession';
import { ClassRecording } from '../models/ClassRecording';
import { LearningResource } from '../models/LearningResource';
import { requireAuth, requireRole } from '../middleware/auth';
import { upload, persistUploadedFile } from '../middleware/upload';
import { ApiError, asyncHandler } from '../middleware/error';
import {
  assignCourseSchema,
  portalCourseSchema,
  portalLessonSchema,
  portalModuleSchema,
  studentDecisionSchema,
  adminStudentProfileSchema,
} from '../validation/portal';
import { applyStudentDecision, assignStudentCourse } from '../utils/studentApplication';
import { enrollApprovedStudentsInCourse } from '../utils/courseEnrollment';
import { isStudentProfileComplete } from '../utils/studentProfile';

const router = Router();

router.use(requireAuth, requireRole('admin'));

const invitationLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 30, standardHeaders: 'draft-7', legacyHeaders: false, message: { error: 'Too many invitation requests. Try again later.' } });
function listingQuery(query: Record<string, unknown>) {
  const page = Number(query.page || 1);
  const search = typeof query.search === 'string' ? query.search.trim() : '';
  if (!Number.isInteger(page) || page < 1 || page > 100000 || search.length > 160) throw new ApiError(400, 'Choose a valid page and search.');
  const pattern = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return { page, searchFilter: search ? { $or: [{ email: { $regex: pattern, $options: 'i' } }, { name: { $regex: pattern, $options: 'i' } }] } : {} };
}
router.get('/invitations', asyncHandler(async (req, res) => {
  const { page, searchFilter } = listingQuery(req.query);
  const filter = { invitationCreatedAt: { $exists: true }, ...searchFilter };
  const pageSize = 25;
  const [items, total] = await Promise.all([
    Student.find(filter).select(invitationSelection).sort({ invitationCreatedAt: -1, _id: -1 }).skip((page - 1) * pageSize).limit(pageSize),
    Student.countDocuments(filter),
  ]);
  res.json({ items: items.map(invitationItem), page, pageSize, total });
}));
router.post('/invitations', invitationLimiter, asyncHandler(async (req, res) => {
  const parsed = invitationCreateSchema.safeParse(req.body);
  if (!parsed.success) throw new ApiError(400, 'Enter a valid email address.');
  if (!isAcademyMailConfigured()) throw new ApiError(503, 'Academy email is not configured. No invitation was saved.');
  const { token, fields } = newInvitation();
  let student;
  try {
    student = await Student.create({ email: parsed.data.email, name: 'Invited student',
      passwordHash: await hashPassword(randomBytes(48).toString('hex')), active: false,
      status: 'pending', emailVerified: false, invitationOnly: true, invitationCreatedAt: new Date(), ...fields });
  } catch (error) {
    if ((error as { code?: number }).code === 11000) throw new ApiError(409, 'This email already belongs to an account or invitation.');
    throw error;
  }
  const sent = await deliverInvitation(String(student._id), student.email, token);
  const current = await Student.findById(student._id).select(invitationSelection);
  if (!current) throw new ApiError(409, 'Invitation no longer exists.');
  res.json({ ok: true, invitation: invitationItem(current), ...(sent ? {} : { message: 'Email delivery failed. You can resend this invitation.' }) });
}));
router.post('/invitations/:id/resend', invitationLimiter, asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) throw new ApiError(404, 'Invitation not found.');
  if (!isAcademyMailConfigured()) throw new ApiError(503, 'Academy email is not configured.');
  const { token, fields } = newInvitation();
  const student = await Student.findOneAndUpdate({ _id: req.params.id, invitationOnly: true,
    invitationAcceptedAt: null, invitationLastSentAt: { $lte: new Date(Date.now() - 60000) } }, { $set: { ...fields, invitationCancelledAt: null } }, { new: true }).select(invitationSelection);
  if (!student) throw new ApiError(409, 'Invitation unavailable, cancelled, accepted, or sent less than a minute ago.');
  const sent = await deliverInvitation(String(student._id), student.email, token);
  const current = await Student.findById(student._id).select(invitationSelection);
  if (!current) throw new ApiError(409, 'Invitation no longer exists.');
  res.json({ ok: true, invitation: invitationItem(current), ...(sent ? {} : { message: 'Email delivery failed. You can retry in a minute.' }) });
}));
router.post('/invitations/:id/cancel', asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) throw new ApiError(404, 'Invitation not found.');
  const result = await Student.updateOne({ _id: req.params.id, invitationOnly: true, invitationAcceptedAt: null },
    { $set: { invitationCancelledAt: new Date() }, $unset: { invitationTokenHash: 1 } });
  if (!result.matchedCount) throw new ApiError(409, 'Invitation unavailable or already accepted.');
  res.json({ ok: true });
}));
router.patch('/students/:id/active', asyncHandler(async (req, res) => {
  const parsed = studentActiveSchema.safeParse(req.body);
  if (!parsed.success) throw new ApiError(400, 'Send active as a boolean.');
  if (!mongoose.isValidObjectId(req.params.id)) throw new ApiError(404, 'Student not found.');
  const student = await Student.findOneAndUpdate({
    _id: req.params.id,
    ...ordinaryStudentFilter,
    $or: [{ status: 'approved' }, { emailVerified: true, status: { $ne: 'rejected' } }],
  }, { $set: { active: parsed.data.active } }, { new: true });
  if (!student) throw new ApiError(404, 'Student not found.');
  res.json({ ok: true, active: student.active });
}));
router.get('/students/:id/progress', asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) throw new ApiError(404, 'Student not found.');
  const student = await Student.findOne({ _id: req.params.id, ...ordinaryStudentFilter });
  if (!student) throw new ApiError(404, 'Student not found.');
  const [courses, enrollments, attempts] = await Promise.all([
    PortalCourse.find({ published: true }).sort({ title: 1 }), Enrollment.find({ studentId: student._id }),
    ExamAttempt.find({ studentId: student._id }).sort({ submittedAt: -1 }),
  ]);
  const exams = await Exam.find({ _id: { $in: attempts.map((a) => a.examId) } }).select('title');
  const titles = new Map(exams.map((e) => [String(e._id), e.title]));
  res.json({ student: { id: String(student._id), name: student.name, email: student.email },
    courses: courses.map((course) => {
      const valid = new Set(course.modules.flatMap((m) => m.lessons.filter((l) => l.published).map((l) => String(l._id))));
      const saved = enrollments.find((e) => String(e.courseId) === String(course._id));
      const completedLessons = new Set((saved?.completedLessonIds || []).filter((id) => valid.has(id))).size;
      return { id: String(course._id), title: course.title, completedLessons, totalLessons: valid.size, percent: valid.size ? Math.round(completedLessons / valid.size * 100) : 0 };
    }),
    exams: attempts.map((a) => ({ id: String(a._id), title: titles.get(String(a.examId)) || 'Deleted exam', score: a.score, total: a.total, percent: a.percent, submittedAt: a.submittedAt })),
  });
}));

router.get(
  '/students',
  asyncHandler(async (req, res) => {
    const { page, searchFilter } = listingQuery(req.query);
    const status = req.query.status;
    if (status !== undefined && !['pending', 'approved', 'rejected', 'all'].includes(String(status))) throw new ApiError(400, 'Choose a valid status.');
    const filter = { ...ordinaryStudentFilter, ...searchFilter, ...(status && status !== 'all' ? { status } : {}) };
    // Preserve the original 200-item response for callers that do not opt into pagination.
    const pageSize = req.query.page !== undefined || req.query.search !== undefined || status !== undefined ? 25 : 200;
    const [students, total] = await Promise.all([
      Student.find(filter).sort({ createdAt: -1, _id: -1 }).skip((page - 1) * pageSize).limit(pageSize), Student.countDocuments(filter),
    ]);
    const enrollments = await Enrollment.find({
      studentId: { $in: students.map((s) => s._id) },
    }).select('studentId');
    const enrolledIds = new Set(enrollments.map((e) => String(e.studentId)));

    res.json({
      page, pageSize, total,
      items: students.map((s) => {
        const status = s.status || (s.emailVerified ? 'approved' : 'pending');
        return {
          id: String(s._id),
          name: s.name,
          email: s.email,
          phone: s.phone || '',
          active: s.active,
          interest: s.interest || '',
          country: s.country || '',
          couponCode: s.couponCode || '',
          status,
          needsCourseAssignment: status === 'approved' && !enrolledIds.has(String(s._id)),
          lastLoginAt: s.lastLoginAt,
          createdAt: s.createdAt,
        };
      }),
    });
  })
);

router.get(
  '/students/approved',
  asyncHandler(async (req, res) => {
    const page = Number(req.query.page || 1);
    const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
    const login = req.query.login || 'all';
    if (!Number.isInteger(page) || page < 1 || page > 100000 || search.length > 160 || !['all', 'signed-in', 'never'].includes(String(login))) {
      throw new ApiError(400, 'Choose a valid page, search, and login filter.');
    }
    const filters: Record<string, unknown>[] = [
      ordinaryStudentFilter,
      { $or: [{ status: 'approved' }, { emailVerified: true, status: { $ne: 'rejected' } }] },
    ];
    if (search) {
      const pattern = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filters.push({ $or: [{ name: { $regex: pattern, $options: 'i' } }, { email: { $regex: pattern, $options: 'i' } }] });
    }
    if (login === 'signed-in') filters.push({ lastLoginAt: { $ne: null } });
    if (login === 'never') filters.push({ lastLoginAt: null });
    const filter = { $and: filters };
    const pageSize = 25;
    const [students, total] = await Promise.all([
      Student.find(filter)
        .select('name email phone country avatarUrl courseSlug coursePreference freelancedBefore freelancingExperience workPreference gender active lastLoginAt createdAt interest couponCode')
        .sort({ lastLoginAt: -1, createdAt: -1, _id: -1 })
        .skip((page - 1) * pageSize).limit(pageSize),
      Student.countDocuments(filter),
    ]);
    res.json({
      page, pageSize, total,
      items: students.map((student) => ({
        id: String(student._id),
        name: student.name,
        email: student.email,
        phone: student.phone || '',
        country: student.country || '',
        avatarUrl: student.avatarUrl || '',
        courseSlug: student.courseSlug || '',
        coursePreference: student.coursePreference || '',
        freelancedBefore: student.freelancedBefore ?? null,
        freelancingExperience: student.freelancingExperience || '',
        workPreference: student.workPreference || '',
        gender: student.gender || '',
        active: student.active,
        lastLoginAt: student.lastLoginAt || null,
        createdAt: student.createdAt,
        profileComplete: isStudentProfileComplete(student),
        interest: student.interest || '',
        couponCode: student.couponCode || '',
      })),
    });
  })
);

router.delete(
  '/students/:id',
  asyncHandler(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) throw new ApiError(404, 'Student not found.');

    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) throw new ApiError(404, 'Student not found.');

    await Promise.all([
      Enrollment.deleteMany({ studentId: student._id }),
      ExamAttempt.deleteMany({ studentId: student._id }),
    ]);

    res.json({ ok: true, deletedStudentId: String(student._id) });
  })
);

router.patch(
  '/students/:id/profile',
  asyncHandler(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) throw new ApiError(404, 'Student not found.');

    const parsed = adminStudentProfileSchema.safeParse(req.body);
    if (!parsed.success) throw new ApiError(400, parsed.error.issues[0]?.message || 'Enter valid profile details.');

    const student = await Student.findOne({ _id: req.params.id, ...ordinaryStudentFilter });
    if (!student) throw new ApiError(404, 'Student not found.');

    student.set(parsed.data);
    if (student.freelancedBefore === false) student.freelancingExperience = '';
    await student.save();

    res.json({
      ok: true,
      student: {
        id: String(student._id),
        name: student.name,
        email: student.email,
        phone: student.phone || '',
        country: student.country || '',
        avatarUrl: student.avatarUrl || '',
        courseSlug: student.courseSlug || '',
        coursePreference: student.coursePreference || '',
        freelancedBefore: student.freelancedBefore ?? null,
        freelancingExperience: student.freelancingExperience || '',
        workPreference: student.workPreference || '',
        gender: student.gender || '',
        active: student.active,
        lastLoginAt: student.lastLoginAt || null,
        createdAt: student.createdAt,
        profileComplete: isStudentProfileComplete(student),
        interest: student.interest || '',
        couponCode: student.couponCode || '',
      },
    });
  })
);

router.patch(
  '/students/:id',
  asyncHandler(async (req, res) => {
    const parsed = studentDecisionSchema.safeParse(req.body);
    if (!parsed.success) throw new ApiError(400, 'Send status approved or rejected.');

    const result = await applyStudentDecision(req.params.id, parsed.data.status);
    if (!result.ok) throw new ApiError(404, result.error);

    res.json({
      ok: true,
      already: result.already,
      status: parsed.data.status,
      enrolled: result.enrolled,
    });
  })
);

router.post(
  '/students/:id/assign-course',
  asyncHandler(async (req, res) => {
    const parsed = assignCourseSchema.safeParse(req.body);
    if (!parsed.success) throw new ApiError(400, 'Choose a course to assign.');

    const result = await assignStudentCourse(req.params.id, parsed.data.courseId);
    if (!result.ok) throw new ApiError(404, result.error);

    res.json({ ok: true, courseTitle: result.courseTitle, emailed: result.emailed });
  })
);

router.get(
  '/courses',
  asyncHandler(async (_req, res) => {
    const courses = await PortalCourse.find().sort({ updatedAt: -1 });
    res.json({
      items: courses.map((c) => ({
        id: String(c._id),
        title: c.title,
        slug: c.slug,
        description: c.description,
        thumbnailUrl: c.thumbnailUrl,
        level: c.level,
        published: c.published,
        meetLink: c.meetLink || '',
        timezone: c.timezone || 'Asia/Karachi',
        nextClassAt: c.nextClassAt,
        moduleCount: c.modules.length,
        lessonCount: c.modules.reduce((n, m) => n + m.lessons.length, 0),
        updatedAt: c.updatedAt,
      })),
    });
  })
);

router.post(
  '/courses',
  asyncHandler(async (req, res) => {
    const parsed = portalCourseSchema.safeParse(req.body);
    if (!parsed.success) throw new ApiError(400, 'Invalid course data.');

    const exists = await PortalCourse.findOne({ slug: parsed.data.slug });
    if (exists) throw new ApiError(409, 'A course with this slug already exists.');

    const course = await PortalCourse.create(parsed.data);
    if (course.published) await enrollApprovedStudentsInCourse(String(course._id));
    res.status(201).json({ course });
  })
);

router.get(
  '/courses/:id',
  asyncHandler(async (req, res) => {
    const course = await PortalCourse.findById(req.params.id);
    if (!course) throw new ApiError(404, 'Course not found.');
    res.json({ course });
  })
);

router.patch(
  '/courses/:id',
  asyncHandler(async (req, res) => {
    const parsed = portalCourseSchema.partial().safeParse(req.body);
    if (!parsed.success) throw new ApiError(400, 'Invalid course data.');

    const course = await PortalCourse.findById(req.params.id);
    if (!course) throw new ApiError(404, 'Course not found.');

    if (parsed.data.slug && parsed.data.slug !== course.slug) {
      const clash = await PortalCourse.findOne({ slug: parsed.data.slug });
      if (clash) throw new ApiError(409, 'A course with this slug already exists.');
    }

    const wasPublished = course.published;
    const { nextClassAt, ...rest } = parsed.data;
    Object.assign(course, rest);
    if (nextClassAt !== undefined) {
      course.nextClassAt = nextClassAt ? new Date(nextClassAt) : null;
    }
    await course.save();
    if (!wasPublished && course.published) {
      await enrollApprovedStudentsInCourse(String(course._id));
    }
    res.json({ course });
  })
);

router.delete(
  '/courses/:id',
  asyncHandler(async (req, res) => {
    const course = await PortalCourse.findByIdAndDelete(req.params.id);
    if (!course) throw new ApiError(404, 'Course not found.');
    await Promise.all([
      Enrollment.deleteMany({ courseId: course._id }),
      ClassSession.deleteMany({ courseId: course._id }),
      ClassRecording.deleteMany({ courseId: course._id }),
      LearningResource.deleteMany({ courseId: course._id }),
    ]);
    res.json({ ok: true });
  })
);

router.post(
  '/courses/:id/modules',
  asyncHandler(async (req, res) => {
    const parsed = portalModuleSchema.safeParse(req.body);
    if (!parsed.success) throw new ApiError(400, 'Invalid module data.');

    const course = await PortalCourse.findById(req.params.id);
    if (!course) throw new ApiError(404, 'Course not found.');

    course.modules.push({
      title: parsed.data.title,
      description: parsed.data.description,
      order: parsed.data.order,
      lessons: [],
    });
    await course.save();
    res.status(201).json({ course });
  })
);

router.patch(
  '/courses/:id/modules/:moduleId',
  asyncHandler(async (req, res) => {
    const parsed = portalModuleSchema.partial().safeParse(req.body);
    if (!parsed.success) throw new ApiError(400, 'Invalid module data.');

    const course = await PortalCourse.findById(req.params.id);
    if (!course) throw new ApiError(404, 'Course not found.');

    const mod = course.modules.id(req.params.moduleId);
    if (!mod) throw new ApiError(404, 'Module not found.');

    Object.assign(mod, parsed.data);
    await course.save();
    res.json({ course });
  })
);

router.delete(
  '/courses/:id/modules/:moduleId',
  asyncHandler(async (req, res) => {
    const course = await PortalCourse.findById(req.params.id);
    if (!course) throw new ApiError(404, 'Course not found.');

    const mod = course.modules.id(req.params.moduleId);
    if (!mod) throw new ApiError(404, 'Module not found.');
    mod.deleteOne();
    await course.save();
    res.json({ course });
  })
);

router.post(
  '/courses/:id/modules/:moduleId/lessons',
  asyncHandler(async (req, res) => {
    const parsed = portalLessonSchema.safeParse(req.body);
    if (!parsed.success) throw new ApiError(400, 'Invalid lesson data.');

    const course = await PortalCourse.findById(req.params.id);
    if (!course) throw new ApiError(404, 'Course not found.');

    const mod = course.modules.id(req.params.moduleId);
    if (!mod) throw new ApiError(404, 'Module not found.');

    mod.lessons.push({
      title: parsed.data.title,
      type: parsed.data.type,
      summary: parsed.data.summary,
      body: parsed.data.body,
      videoUrl: parsed.data.videoUrl,
      fileUrl: parsed.data.fileUrl,
      fileName: parsed.data.fileName,
      durationMinutes: parsed.data.durationMinutes,
      order: parsed.data.order,
      published: parsed.data.published,
    });
    await course.save();
    res.status(201).json({ course });
  })
);

router.patch(
  '/courses/:id/modules/:moduleId/lessons/:lessonId',
  asyncHandler(async (req, res) => {
    const parsed = portalLessonSchema.partial().safeParse(req.body);
    if (!parsed.success) throw new ApiError(400, 'Invalid lesson data.');

    const course = await PortalCourse.findById(req.params.id);
    if (!course) throw new ApiError(404, 'Course not found.');

    const mod = course.modules.id(req.params.moduleId);
    if (!mod) throw new ApiError(404, 'Module not found.');

    const lesson = mod.lessons.id(req.params.lessonId);
    if (!lesson) throw new ApiError(404, 'Lesson not found.');

    Object.assign(lesson, parsed.data);
    await course.save();
    res.json({ course });
  })
);

router.delete(
  '/courses/:id/modules/:moduleId/lessons/:lessonId',
  asyncHandler(async (req, res) => {
    const course = await PortalCourse.findById(req.params.id);
    if (!course) throw new ApiError(404, 'Course not found.');

    const mod = course.modules.id(req.params.moduleId);
    if (!mod) throw new ApiError(404, 'Module not found.');

    const lesson = mod.lessons.id(req.params.lessonId);
    if (!lesson) throw new ApiError(404, 'Lesson not found.');
    lesson.deleteOne();
    await course.save();
    res.json({ course });
  })
);

const handleUpload: import('express').RequestHandler = (req, res, next) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  upload.single('file')(req as any, res as any, (err: unknown) => {
    if (err) {
      const message = err instanceof Error ? err.message : 'Upload failed.';
      next(new ApiError(400, message));
      return;
    }
    next();
  });
};

router.post(
  '/upload',
  handleUpload,
  asyncHandler(async (req, res) => {
    if (!req.file) throw new ApiError(400, 'No file uploaded.');
    const url = await persistUploadedFile(req.file);
    res.json({
      ok: true,
      url,
      fileName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
    });
  })
);

export default router;
