import { Router } from 'express';

import { PortalCourse } from '../models/PortalCourse';
import { Enrollment } from '../models/Enrollment';
import { Announcement, serializeAnnouncement } from '../models/Announcement';
import { ClassSession } from '../models/ClassSession';
import { ClassRecording } from '../models/ClassRecording';
import { LearningResource } from '../models/LearningResource';
import { getAcademySettings } from '../models/AcademySettings';
import { requireApprovedStudent } from '../middleware/auth';
import { asyncHandler } from '../middleware/error';

const router = Router();

router.use(requireApprovedStudent);

async function enrolledCourseIds(studentId: string) {
  const enrollments = await Enrollment.find({ studentId }).select('courseId');
  return enrollments.map((e) => e.courseId);
}

router.get(
  '/home',
  asyncHandler(async (req, res) => {
    const courseIds = await enrolledCourseIds(req.student!.sub);
    const now = new Date();

    const [nextSession, sessions, recordings, resources, settings, courses, announcements] = await Promise.all([
      ClassSession.findOne({
        published: true,
        startsAt: { $gte: now },
      }).sort({ startsAt: 1 }),
      ClassSession.find({
        published: true,
        startsAt: { $gte: now },
      })
        .sort({ startsAt: 1 })
        .limit(30),
      ClassRecording.find({
        courseId: { $in: courseIds },
        published: true,
      })
        .sort({ createdAt: -1 })
        .limit(50),
      LearningResource.find({
        courseId: { $in: courseIds },
        published: true,
      })
        .sort({ createdAt: -1 })
        .limit(50),
      getAcademySettings(),
      PortalCourse.find({ _id: { $in: courseIds } }).select('title slug meetLink timezone nextClassAt'),
      Announcement.find({ published: true }).sort({ createdAt: -1, _id: -1 }).limit(3),
    ]);

    const courseMap = new Map(courses.map((c) => [String(c._id), c]));
    const missingCourseIds = [...new Set(
      [nextSession, ...sessions]
        .filter((session): session is NonNullable<typeof session> => Boolean(session))
        .map((session) => String(session.courseId))
        .filter((id) => !courseMap.has(id)),
    )];
    if (missingCourseIds.length) {
      const sessionCourses = await PortalCourse.find({ _id: { $in: missingCourseIds } }).select('title');
      for (const course of sessionCourses) courseMap.set(String(course._id), course);
    }

    res.json({
      announcements: announcements.map(serializeAnnouncement),
      nextSession: nextSession
        ? {
            id: String(nextSession._id),
            courseId: String(nextSession.courseId),
            courseTitle: courseMap.get(String(nextSession.courseId))?.title || '',
            title: nextSession.title,
            startsAt: nextSession.startsAt,
            meetLink: nextSession.meetLink || '',
            timezone: nextSession.timezone || 'Asia/Karachi',
            notes: nextSession.notes || '',
          }
        : null,
      sessions: sessions.map((s) => ({
        id: String(s._id),
        courseId: String(s.courseId),
        courseTitle: courseMap.get(String(s.courseId))?.title || '',
        title: s.title,
        startsAt: s.startsAt,
        endsAt: s.endsAt,
        meetLink: s.meetLink || '',
        timezone: s.timezone || 'Asia/Karachi',
        notes: s.notes || '',
      })),
      recordings: recordings.map((r) => ({
        id: String(r._id),
        courseId: String(r.courseId),
        courseTitle: courseMap.get(String(r.courseId))?.title || '',
        title: r.title,
        videoUrl: r.videoUrl,
        durationMinutes: r.durationMinutes || 0,
        recordedAt: r.recordedAt,
      })),
      resources: resources.map((r) => ({
        id: String(r._id),
        courseId: String(r.courseId),
        courseTitle: courseMap.get(String(r.courseId))?.title || '',
        title: r.title,
        kind: r.kind,
        description: r.description || '',
        fileUrl: r.fileUrl || '',
      })),
      community: {
        whatsappUrl: settings.whatsappUrl || '',
        youtubeUrl: settings.youtubeUrl || '',
        linkedinUrl: settings.linkedinUrl || '',
        instagramUrl: settings.instagramUrl || '',
        announcementTitle: settings.announcementTitle || '',
        announcementBody: settings.announcementBody || '',
        weeklyClassNotice: settings.weeklyClassNotice || '',
      },
    });
  })
);

export default router;
