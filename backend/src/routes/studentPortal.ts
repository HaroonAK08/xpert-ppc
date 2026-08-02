import { Router } from 'express';

import { PortalCourse } from '../models/PortalCourse';
import { Enrollment } from '../models/Enrollment';
import { requireStudent } from '../middleware/auth';
import { ApiError, asyncHandler } from '../middleware/error';

const router = Router();

function serializeCourse(course: InstanceType<typeof PortalCourse>, enrolled: boolean) {
  return {
    id: String(course._id),
    title: course.title,
    slug: course.slug,
    description: course.description,
    thumbnailUrl: course.thumbnailUrl,
    level: course.level,
    published: course.published,
    enrolled,
    moduleCount: course.modules.length,
    lessonCount: course.modules.reduce((n, m) => n + m.lessons.length, 0),
    updatedAt: course.updatedAt,
  };
}

router.get(
  '/',
  requireStudent,
  asyncHandler(async (req, res) => {
    const courses = await PortalCourse.find({ published: true }).sort({ title: 1 });
    const enrollments = await Enrollment.find({ studentId: req.student!.sub }).select('courseId');
    const enrolledIds = new Set(enrollments.map((e) => String(e.courseId)));

    res.json({
      items: courses.map((c) => serializeCourse(c, enrolledIds.has(String(c._id)))),
    });
  })
);

router.post(
  '/:courseId/enroll',
  requireStudent,
  asyncHandler(async (req, res) => {
    const course = await PortalCourse.findOne({
      _id: req.params.courseId,
      published: true,
    });
    if (!course) throw new ApiError(404, 'Course not found.');

    await Enrollment.findOneAndUpdate(
      { studentId: req.student!.sub, courseId: course._id },
      { $setOnInsert: { completedLessonIds: [] } },
      { upsert: true, new: true }
    );

    res.json({ ok: true });
  })
);

router.get(
  '/:slug',
  requireStudent,
  asyncHandler(async (req, res) => {
    const course = await PortalCourse.findOne({
      slug: req.params.slug,
      published: true,
    });
    if (!course) throw new ApiError(404, 'Course not found.');

    const enrollment = await Enrollment.findOne({
      studentId: req.student!.sub,
      courseId: course._id,
    });

    if (!enrollment) {
      throw new ApiError(403, 'Enroll in this course to view lessons.');
    }

    res.json({
      course: {
        id: String(course._id),
        title: course.title,
        slug: course.slug,
        description: course.description,
        thumbnailUrl: course.thumbnailUrl,
        level: course.level,
        modules: course.modules
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((m) => ({
            id: String(m._id),
            title: m.title,
            description: m.description,
            order: m.order,
            lessons: m.lessons
              .filter((l) => l.published)
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((l) => ({
                id: String(l._id),
                title: l.title,
                type: l.type,
                summary: l.summary,
                body: l.body,
                videoUrl: l.videoUrl,
                fileUrl: l.fileUrl,
                fileName: l.fileName,
                durationMinutes: l.durationMinutes,
                order: l.order,
                completed: enrollment.completedLessonIds.includes(String(l._id)),
              })),
          })),
      },
      completedLessonIds: enrollment.completedLessonIds,
    });
  })
);

router.post(
  '/:courseId/lessons/:lessonId/complete',
  requireStudent,
  asyncHandler(async (req, res) => {
    const enrollment = await Enrollment.findOne({
      studentId: req.student!.sub,
      courseId: req.params.courseId,
    });
    if (!enrollment) throw new ApiError(403, 'Not enrolled in this course.');

    const lessonId = req.params.lessonId;
    if (!enrollment.completedLessonIds.includes(lessonId)) {
      enrollment.completedLessonIds.push(lessonId);
      await enrollment.save();
    }

    res.json({ ok: true, completedLessonIds: enrollment.completedLessonIds });
  })
);

export default router;
