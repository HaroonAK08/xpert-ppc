import { z } from 'zod';
import { PROFILE_COURSES } from '../utils/studentProfile';

export const studentSignupSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(160),
  password: z.string().min(6).max(100),
  country: z.string().trim().min(2).max(80),
  interest: z.string().trim().min(8).max(4000),
  courseSlug: z.string().trim().min(1).max(120).optional().default(''),
  couponCode: z.string().trim().max(40).optional().default(''),
});

export const couponCreateSchema = z.object({
  code: z
    .string()
    .trim()
    .min(3)
    .max(40)
    .regex(/^[a-zA-Z0-9_-]+$/, 'Use letters, numbers, hyphens, or underscores only.'),
  note: z.string().trim().max(200).optional().default(''),
  maxUses: z.number().int().min(0).optional().default(0),
  active: z.boolean().optional().default(true),
});

export const couponUpdateSchema = z.object({
  note: z.string().trim().max(200).optional(),
  maxUses: z.number().int().min(0).optional(),
  active: z.boolean().optional(),
});

export const studentDecisionSchema = z.object({
  status: z.enum(['approved', 'rejected']),
});

export const applicationReviewDecisionSchema = z.object({
  token: z.string().trim().min(1),
  decision: z.enum(['approved', 'rejected']),
  reason: z.string().trim().max(500).optional().default(''),
});

export const assignCourseSchema = z.object({
  courseId: z.string().trim().min(1),
});

export const studentLoginSchema = z.object({
  email: z.string().trim().email().max(160),
  password: z.string().min(1).max(100),
});

export const studentProfileSchema = z.object({
  avatarUrl: z
    .string()
    .trim()
    .max(1000)
    .refine((v) => v === '' || /^https?:\/\//i.test(v), 'Enter a valid image URL.')
    .optional(),
  coursePreference: z.enum(PROFILE_COURSES).optional(),
  freelancedBefore: z.boolean().optional(),
  freelancingExperience: z.string().trim().max(2000).optional(),
  workPreference: z.enum(['full-time', 'part-time']).optional(),
  gender: z.enum(['male', 'female']).optional(),
  completeProfile: z.boolean().optional(),
});

export const adminStudentProfileSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  country: z.string().trim().min(2).max(80).optional(),
  interest: z.string().trim().max(4000).optional(),
  avatarUrl: z
    .string()
    .trim()
    .max(1000)
    .refine((v) => v === '' || /^https?:\/\//i.test(v), 'Enter a valid image URL.')
    .optional(),
  coursePreference: z.union([z.enum(PROFILE_COURSES), z.literal('')]).optional(),
  freelancedBefore: z.boolean().nullable().optional(),
  freelancingExperience: z.string().trim().max(2000).optional(),
  workPreference: z.union([z.enum(['full-time', 'part-time']), z.literal('')]).optional(),
  gender: z.union([z.enum(['male', 'female']), z.literal('')]).optional(),
}).strict().superRefine((value, ctx) => {
  if (Object.keys(value).length === 0) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Add at least one profile change.' });
  }
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email().max(160),
});

export const resetPasswordSchema = z.object({
  token: z.string().trim().min(1),
  password: z.string().min(6).max(100),
});

export const studentVerifySchema = z.object({
  email: z.string().trim().email().max(160),
  code: z.string().trim().regex(/^\d{6}$/),
  purpose: z.enum(['signup', 'login']),
});

export const portalCourseSchema = z.object({
  title: z.string().trim().min(2).max(160),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  description: z.string().trim().max(4000).optional().default(''),
  thumbnailUrl: z.string().trim().max(500).optional().default(''),
  level: z.string().trim().max(60).optional().default('Beginner'),
  published: z.boolean().optional().default(false),
  meetLink: z.string().trim().max(1000).optional().default(''),
  timezone: z.string().trim().max(80).optional().default('Asia/Karachi'),
  nextClassAt: z.union([z.string(), z.null()]).optional().nullable(),
});

export const classSessionSchema = z.object({
  courseId: z.string().trim().min(1),
  title: z.string().trim().min(2).max(160),
  startsAt: z.string().min(1),
  endsAt: z.string().optional().nullable(),
  meetLink: z.string().trim().max(1000).refine((value) => {
    if (!value) return true;
    try { return ['http:', 'https:'].includes(new URL(value).protocol); } catch { return false; }
  }, 'Enter a valid HTTP or HTTPS meeting link.').optional().default(''),
  timezone: z.string().trim().max(80).optional().default('Asia/Karachi'),
  notes: z.string().trim().max(2000).optional().default(''),
  published: z.boolean().optional().default(true),
});

export const classRecordingSchema = z.object({
  courseId: z.string().trim().min(1),
  title: z.string().trim().min(2).max(160),
  videoUrl: z.string().trim().min(4).max(1000),
  durationMinutes: z.number().int().min(0).optional().default(0),
  recordedAt: z.string().optional().nullable(),
  published: z.boolean().optional().default(true),
});

export const learningResourceSchema = z.object({
  courseId: z.string().trim().min(1),
  title: z.string().trim().min(2).max(160),
  kind: z.enum(['notes', 'assignment', 'template', 'other']).optional().default('notes'),
  description: z.string().trim().max(2000).optional().default(''),
  fileUrl: z.string().trim().max(1000).optional().default(''),
  published: z.boolean().optional().default(true),
});

export const academySettingsSchema = z.object({
  whatsappUrl: z.string().trim().max(1000).optional(),
  youtubeUrl: z.string().trim().max(1000).optional(),
  linkedinUrl: z.string().trim().max(1000).optional(),
  instagramUrl: z.string().trim().max(1000).optional(),
  announcementTitle: z.string().trim().max(160).optional(),
  announcementBody: z.string().trim().max(2000).optional(),
  weeklyClassNotice: z.string().trim().max(1000).optional(),
});

export const examQuestionSchema = z.object({
  prompt: z.string().trim().min(1).max(500),
  options: z.array(z.string().trim().min(1).max(300)).min(2).max(6),
  correctIndex: z.number().int().min(0).max(5),
}).superRefine((question, ctx) => {
  if (question.correctIndex >= question.options.length) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Choose a valid correct answer.' });
  }
});

export const examSchema = z.object({
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().max(2000).optional().default(''),
  questions: z.array(examQuestionSchema).min(1).max(50),
  published: z.boolean().optional().default(false),
});

export const examUpdateSchema = examSchema.partial();

export const examSubmitSchema = z.object({
  answers: z.array(z.number().int().min(0).max(5)).min(1).max(50),
});


export const portalModuleSchema = z.object({
  title: z.string().trim().min(2).max(160),
  description: z.string().trim().max(1000).optional().default(''),
  order: z.number().int().min(0).optional().default(0),
});

export const portalLessonSchema = z.object({
  title: z.string().trim().min(2).max(160),
  type: z.enum(['video', 'lecture', 'assignment', 'task']),
  summary: z.string().trim().max(500).optional().default(''),
  body: z.string().max(20000).optional().default(''),
  videoUrl: z.string().trim().max(1000).optional().default(''),
  fileUrl: z.string().trim().max(1000).optional().default(''),
  fileName: z.string().trim().max(260).optional().default(''),
  durationMinutes: z.number().int().min(0).optional().default(0),
  order: z.number().int().min(0).optional().default(0),
  published: z.boolean().optional().default(true),
});
