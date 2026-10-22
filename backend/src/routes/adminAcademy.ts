import { Router } from 'express';

import { PortalCourse } from '../models/PortalCourse';
import { ClassSession } from '../models/ClassSession';
import { ClassRecording } from '../models/ClassRecording';
import { LearningResource } from '../models/LearningResource';
import { getAcademySettings } from '../models/AcademySettings';
import { Coupon } from '../models/Coupon';
import { Student } from '../models/Student';
import { requireAuth, requireRole } from '../middleware/auth';
import { ApiError, asyncHandler } from '../middleware/error';
import {
  academySettingsSchema,
  classRecordingSchema,
  classSessionSchema,
  couponCreateSchema,
  couponUpdateSchema,
  learningResourceSchema,
} from '../validation/portal';
import { normalizeCouponCode } from '../utils/coupon';

const router = Router();

router.use(requireAuth, requireRole('admin'));

async function courseTitleMap(ids: string[]) {
  const courses = await PortalCourse.find({ _id: { $in: ids } }).select('title slug');
  return new Map(courses.map((c) => [String(c._id), { title: c.title, slug: c.slug }]));
}

router.get(
  '/overview',
  asyncHandler(async (_req, res) => {
    const [pendingStudents, courses, sessions, recordings, resources] = await Promise.all([
      import('../models/Student').then(({ Student }) => Student.countDocuments({ status: 'pending' })),
      PortalCourse.countDocuments(),
      ClassSession.countDocuments({ published: true }),
      ClassRecording.countDocuments({ published: true }),
      LearningResource.countDocuments({ published: true }),
    ]);
    res.json({
      pendingStudents,
      courses,
      sessions,
      recordings,
      resources,
    });
  })
);

router.get(
  '/sessions',
  asyncHandler(async (_req, res) => {
    const items = await ClassSession.find().sort({ startsAt: 1 }).limit(200);
    const map = await courseTitleMap(items.map((i) => String(i.courseId)));
    res.json({
      items: items.map((s) => ({
        id: String(s._id),
        courseId: String(s.courseId),
        courseTitle: map.get(String(s.courseId))?.title || '',
        title: s.title,
        startsAt: s.startsAt,
        endsAt: s.endsAt,
        meetLink: s.meetLink || '',
        timezone: s.timezone || 'Asia/Karachi',
        notes: s.notes || '',
        published: s.published,
        createdAt: s.createdAt,
      })),
    });
  })
);

router.post(
  '/sessions',
  asyncHandler(async (req, res) => {
    const parsed = classSessionSchema.safeParse(req.body);
    if (!parsed.success) throw new ApiError(400, 'Invalid session data.');

    const course = await PortalCourse.findById(parsed.data.courseId);
    if (!course) throw new ApiError(404, 'Course not found.');

    const startsAt = new Date(parsed.data.startsAt);
    if (Number.isNaN(startsAt.getTime())) throw new ApiError(400, 'Invalid start time.');

    const endsAt = parsed.data.endsAt ? new Date(parsed.data.endsAt) : null;
    const session = await ClassSession.create({
      courseId: course._id,
      title: parsed.data.title,
      startsAt,
      endsAt: endsAt && !Number.isNaN(endsAt.getTime()) ? endsAt : null,
      meetLink: parsed.data.meetLink,
      timezone: parsed.data.timezone,
      notes: parsed.data.notes,
      published: parsed.data.published,
    });

    if (!course.nextClassAt || startsAt < course.nextClassAt || course.nextClassAt < new Date()) {
      course.nextClassAt = startsAt;
      if (parsed.data.meetLink) course.meetLink = parsed.data.meetLink;
      if (parsed.data.timezone) course.timezone = parsed.data.timezone;
      await course.save();
    }

    res.status(201).json({
      item: {
        id: String(session._id),
        courseId: String(session.courseId),
        title: session.title,
        startsAt: session.startsAt,
        endsAt: session.endsAt,
        meetLink: session.meetLink,
        timezone: session.timezone,
        notes: session.notes,
        published: session.published,
      },
    });
  })
);

router.patch(
  '/sessions/:id',
  asyncHandler(async (req, res) => {
    const parsed = classSessionSchema.partial().safeParse(req.body);
    if (!parsed.success) throw new ApiError(400, 'Invalid session data.');

    const session = await ClassSession.findById(req.params.id);
    if (!session) throw new ApiError(404, 'Session not found.');

    if (parsed.data.courseId) {
      const course = await PortalCourse.findById(parsed.data.courseId);
      if (!course) throw new ApiError(404, 'Course not found.');
      session.courseId = course._id;
    }
    if (parsed.data.title !== undefined) session.title = parsed.data.title;
    if (parsed.data.startsAt) {
      const startsAt = new Date(parsed.data.startsAt);
      if (Number.isNaN(startsAt.getTime())) throw new ApiError(400, 'Invalid start time.');
      session.startsAt = startsAt;
    }
    if (parsed.data.endsAt !== undefined) {
      session.endsAt = parsed.data.endsAt ? new Date(parsed.data.endsAt) : null;
    }
    if (parsed.data.meetLink !== undefined) session.meetLink = parsed.data.meetLink;
    if (parsed.data.timezone !== undefined) session.timezone = parsed.data.timezone;
    if (parsed.data.notes !== undefined) session.notes = parsed.data.notes;
    if (parsed.data.published !== undefined) session.published = parsed.data.published;

    await session.save();
    res.json({
      item: {
        id: String(session._id),
        courseId: String(session.courseId),
        title: session.title,
        startsAt: session.startsAt,
        endsAt: session.endsAt,
        meetLink: session.meetLink,
        timezone: session.timezone,
        notes: session.notes,
        published: session.published,
      },
    });
  })
);

router.delete(
  '/sessions/:id',
  asyncHandler(async (req, res) => {
    const session = await ClassSession.findByIdAndDelete(req.params.id);
    if (!session) throw new ApiError(404, 'Session not found.');
    res.json({ ok: true });
  })
);

router.get(
  '/recordings',
  asyncHandler(async (_req, res) => {
    const items = await ClassRecording.find().sort({ createdAt: -1 }).limit(200);
    const map = await courseTitleMap(items.map((i) => String(i.courseId)));
    res.json({
      items: items.map((r) => ({
        id: String(r._id),
        courseId: String(r.courseId),
        courseTitle: map.get(String(r.courseId))?.title || '',
        title: r.title,
        videoUrl: r.videoUrl,
        durationMinutes: r.durationMinutes || 0,
        recordedAt: r.recordedAt,
        published: r.published,
        createdAt: r.createdAt,
      })),
    });
  })
);

router.post(
  '/recordings',
  asyncHandler(async (req, res) => {
    const parsed = classRecordingSchema.safeParse(req.body);
    if (!parsed.success) throw new ApiError(400, 'Invalid recording data.');

    const course = await PortalCourse.findById(parsed.data.courseId);
    if (!course) throw new ApiError(404, 'Course not found.');

    const item = await ClassRecording.create({
      courseId: course._id,
      title: parsed.data.title,
      videoUrl: parsed.data.videoUrl,
      durationMinutes: parsed.data.durationMinutes,
      recordedAt: parsed.data.recordedAt ? new Date(parsed.data.recordedAt) : null,
      published: parsed.data.published,
    });

    res.status(201).json({
      item: {
        id: String(item._id),
        courseId: String(item.courseId),
        title: item.title,
        videoUrl: item.videoUrl,
        durationMinutes: item.durationMinutes,
        recordedAt: item.recordedAt,
        published: item.published,
      },
    });
  })
);

router.patch(
  '/recordings/:id',
  asyncHandler(async (req, res) => {
    const parsed = classRecordingSchema.partial().safeParse(req.body);
    if (!parsed.success) throw new ApiError(400, 'Invalid recording data.');

    const item = await ClassRecording.findById(req.params.id);
    if (!item) throw new ApiError(404, 'Recording not found.');

    if (parsed.data.courseId) {
      const course = await PortalCourse.findById(parsed.data.courseId);
      if (!course) throw new ApiError(404, 'Course not found.');
      item.courseId = course._id;
    }
    if (parsed.data.title !== undefined) item.title = parsed.data.title;
    if (parsed.data.videoUrl !== undefined) item.videoUrl = parsed.data.videoUrl;
    if (parsed.data.durationMinutes !== undefined) item.durationMinutes = parsed.data.durationMinutes;
    if (parsed.data.recordedAt !== undefined) {
      item.recordedAt = parsed.data.recordedAt ? new Date(parsed.data.recordedAt) : null;
    }
    if (parsed.data.published !== undefined) item.published = parsed.data.published;

    await item.save();
    res.json({
      item: {
        id: String(item._id),
        courseId: String(item.courseId),
        title: item.title,
        videoUrl: item.videoUrl,
        durationMinutes: item.durationMinutes,
        recordedAt: item.recordedAt,
        published: item.published,
      },
    });
  })
);

router.delete(
  '/recordings/:id',
  asyncHandler(async (req, res) => {
    const item = await ClassRecording.findByIdAndDelete(req.params.id);
    if (!item) throw new ApiError(404, 'Recording not found.');
    res.json({ ok: true });
  })
);

router.get(
  '/resources',
  asyncHandler(async (_req, res) => {
    const items = await LearningResource.find().sort({ createdAt: -1 }).limit(200);
    const map = await courseTitleMap(items.map((i) => String(i.courseId)));
    res.json({
      items: items.map((r) => ({
        id: String(r._id),
        courseId: String(r.courseId),
        courseTitle: map.get(String(r.courseId))?.title || '',
        title: r.title,
        kind: r.kind,
        description: r.description || '',
        fileUrl: r.fileUrl || '',
        published: r.published,
        createdAt: r.createdAt,
      })),
    });
  })
);

router.post(
  '/resources',
  asyncHandler(async (req, res) => {
    const parsed = learningResourceSchema.safeParse(req.body);
    if (!parsed.success) throw new ApiError(400, 'Invalid resource data.');

    const course = await PortalCourse.findById(parsed.data.courseId);
    if (!course) throw new ApiError(404, 'Course not found.');

    const item = await LearningResource.create({
      courseId: course._id,
      title: parsed.data.title,
      kind: parsed.data.kind,
      description: parsed.data.description,
      fileUrl: parsed.data.fileUrl,
      published: parsed.data.published,
    });

    res.status(201).json({
      item: {
        id: String(item._id),
        courseId: String(item.courseId),
        title: item.title,
        kind: item.kind,
        description: item.description,
        fileUrl: item.fileUrl,
        published: item.published,
      },
    });
  })
);

router.patch(
  '/resources/:id',
  asyncHandler(async (req, res) => {
    const parsed = learningResourceSchema.partial().safeParse(req.body);
    if (!parsed.success) throw new ApiError(400, 'Invalid resource data.');

    const item = await LearningResource.findById(req.params.id);
    if (!item) throw new ApiError(404, 'Resource not found.');

    if (parsed.data.courseId) {
      const course = await PortalCourse.findById(parsed.data.courseId);
      if (!course) throw new ApiError(404, 'Course not found.');
      item.courseId = course._id;
    }
    if (parsed.data.title !== undefined) item.title = parsed.data.title;
    if (parsed.data.kind !== undefined) item.kind = parsed.data.kind;
    if (parsed.data.description !== undefined) item.description = parsed.data.description;
    if (parsed.data.fileUrl !== undefined) item.fileUrl = parsed.data.fileUrl;
    if (parsed.data.published !== undefined) item.published = parsed.data.published;

    await item.save();
    res.json({
      item: {
        id: String(item._id),
        courseId: String(item.courseId),
        title: item.title,
        kind: item.kind,
        description: item.description,
        fileUrl: item.fileUrl,
        published: item.published,
      },
    });
  })
);

router.delete(
  '/resources/:id',
  asyncHandler(async (req, res) => {
    const item = await LearningResource.findByIdAndDelete(req.params.id);
    if (!item) throw new ApiError(404, 'Resource not found.');
    res.json({ ok: true });
  })
);

router.get(
  '/coupons',
  asyncHandler(async (_req, res) => {
    const coupons = await Coupon.find().sort({ createdAt: -1 }).limit(200);
    const codes = coupons.map((c) => c.code);
    const students = await Student.find({ couponCode: { $in: codes } })
      .select('name email status couponCode createdAt')
      .sort({ createdAt: -1 })
      .limit(500);

    const byCode = new Map<string, typeof students>();
    for (const s of students) {
      const code = s.couponCode || '';
      if (!byCode.has(code)) byCode.set(code, []);
      byCode.get(code)!.push(s);
    }

    res.json({
      items: coupons.map((c) => {
        const applicants = byCode.get(c.code) || [];
        return {
          id: String(c._id),
          code: c.code,
          active: c.active,
          note: c.note || '',
          maxUses: c.maxUses || 0,
          usedCount: c.usedCount || 0,
          applicantCount: applicants.length,
          applicants: applicants.map((s) => ({
            id: String(s._id),
            name: s.name,
            email: s.email,
            status: s.status,
            createdAt: s.createdAt,
          })),
          createdAt: c.createdAt,
        };
      }),
    });
  })
);

router.post(
  '/coupons',
  asyncHandler(async (req, res) => {
    const parsed = couponCreateSchema.safeParse(req.body);
    if (!parsed.success) throw new ApiError(400, 'Enter a valid coupon code.');

    const code = normalizeCouponCode(parsed.data.code);
    const existing = await Coupon.findOne({ code });
    if (existing) throw new ApiError(409, 'That coupon code already exists.');

    const coupon = await Coupon.create({
      code,
      note: parsed.data.note || '',
      maxUses: parsed.data.maxUses || 0,
      active: parsed.data.active ?? true,
    });

    res.status(201).json({
      coupon: {
        id: String(coupon._id),
        code: coupon.code,
        active: coupon.active,
        note: coupon.note || '',
        maxUses: coupon.maxUses || 0,
        usedCount: coupon.usedCount || 0,
        applicantCount: 0,
        applicants: [],
        createdAt: coupon.createdAt,
      },
    });
  })
);

router.patch(
  '/coupons/:id',
  asyncHandler(async (req, res) => {
    const parsed = couponUpdateSchema.safeParse(req.body);
    if (!parsed.success) throw new ApiError(400, 'Invalid coupon update.');

    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) throw new ApiError(404, 'Coupon not found.');

    if (parsed.data.note !== undefined) coupon.note = parsed.data.note;
    if (parsed.data.maxUses !== undefined) coupon.maxUses = parsed.data.maxUses;
    if (parsed.data.active !== undefined) coupon.active = parsed.data.active;
    await coupon.save();

    res.json({
      coupon: {
        id: String(coupon._id),
        code: coupon.code,
        active: coupon.active,
        note: coupon.note || '',
        maxUses: coupon.maxUses || 0,
        usedCount: coupon.usedCount || 0,
      },
    });
  })
);

router.delete(
  '/coupons/:id',
  asyncHandler(async (req, res) => {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) throw new ApiError(404, 'Coupon not found.');
    res.json({ ok: true });
  })
);

router.get(
  '/settings',
  asyncHandler(async (_req, res) => {
    const settings = await getAcademySettings();
    res.json({
      settings: {
        whatsappUrl: settings.whatsappUrl || '',
        youtubeUrl: settings.youtubeUrl || '',
        linkedinUrl: settings.linkedinUrl || '',
        instagramUrl: settings.instagramUrl || '',
        announcementTitle: settings.announcementTitle || '',
        announcementBody: settings.announcementBody || '',
      },
    });
  })
);

router.patch(
  '/settings',
  asyncHandler(async (req, res) => {
    const parsed = academySettingsSchema.safeParse(req.body);
    if (!parsed.success) throw new ApiError(400, 'Invalid settings.');

    const settings = await getAcademySettings();
    Object.assign(settings, parsed.data);
    await settings.save();

    res.json({
      settings: {
        whatsappUrl: settings.whatsappUrl || '',
        youtubeUrl: settings.youtubeUrl || '',
        linkedinUrl: settings.linkedinUrl || '',
        instagramUrl: settings.instagramUrl || '',
        announcementTitle: settings.announcementTitle || '',
        announcementBody: settings.announcementBody || '',
      },
    });
  })
);

export default router;
