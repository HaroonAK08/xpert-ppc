import { Router } from 'express';

import { PortalCourse } from '../models/PortalCourse';
import { Student } from '../models/Student';
import { Enrollment } from '../models/Enrollment';
import { requireAuth } from '../middleware/auth';
import { upload, publicUploadPath } from '../middleware/upload';
import { ApiError, asyncHandler } from '../middleware/error';
import {
  portalCourseSchema,
  portalLessonSchema,
  portalModuleSchema,
  studentDecisionSchema,
} from '../validation/portal';
import { applyStudentDecision } from '../utils/studentApplication';

const router = Router();

router.use(requireAuth);

router.get(
  '/students',
  asyncHandler(async (_req, res) => {
    const students = await Student.find().sort({ createdAt: -1 }).limit(200);
    res.json({
      items: students.map((s) => ({
        id: String(s._id),
        name: s.name,
        email: s.email,
        interest: s.interest || '',
        country: s.country || '',
        status: s.status || (s.emailVerified ? 'approved' : 'pending'),
        lastLoginAt: s.lastLoginAt,
        createdAt: s.createdAt,
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
    });
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

    Object.assign(course, parsed.data);
    await course.save();
    res.json({ course });
  })
);

router.delete(
  '/courses/:id',
  asyncHandler(async (req, res) => {
    const course = await PortalCourse.findByIdAndDelete(req.params.id);
    if (!course) throw new ApiError(404, 'Course not found.');
    await Enrollment.deleteMany({ courseId: course._id });
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
    res.json({
      ok: true,
      url: publicUploadPath(req.file.filename),
      fileName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
    });
  })
);

export default router;
