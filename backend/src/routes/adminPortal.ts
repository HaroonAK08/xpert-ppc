import { Router } from 'express';

import { PortalCourse } from '../models/PortalCourse';
import { Student } from '../models/Student';
import { Enrollment } from '../models/Enrollment';
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
} from '../validation/portal';
import { applyStudentDecision, assignStudentCourse } from '../utils/studentApplication';
import { isStudentProfileComplete } from '../utils/studentProfile';

const router = Router();

router.use(requireAuth, requireRole('admin'));

router.get(
  '/students',
  asyncHandler(async (_req, res) => {
    const students = await Student.find().sort({ createdAt: -1 }).limit(200);
    const enrollments = await Enrollment.find({
      studentId: { $in: students.map((s) => s._id) },
    }).select('studentId');
    const enrolledIds = new Set(enrollments.map((e) => String(e.studentId)));

    res.json({
      items: students.map((s) => {
        const status = s.status || (s.emailVerified ? 'approved' : 'pending');
        return {
          id: String(s._id),
          name: s.name,
          email: s.email,
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
        .select('name email country avatarUrl courseSlug coursePreference freelancedBefore freelancingExperience workPreference gender active lastLoginAt createdAt interest couponCode')
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

    const { nextClassAt, ...rest } = parsed.data;
    Object.assign(course, rest);
    if (nextClassAt !== undefined) {
      course.nextClassAt = nextClassAt ? new Date(nextClassAt) : null;
    }
    await course.save();
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
