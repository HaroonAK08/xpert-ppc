import { z } from 'zod';

export const studentSignupSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(160),
  password: z.string().min(6).max(100),
  country: z.string().trim().min(2).max(80),
  interest: z.string().trim().min(8).max(500),
});

export const studentDecisionSchema = z.object({
  status: z.enum(['approved', 'rejected']),
});

export const studentLoginSchema = z.object({
  email: z.string().trim().email().max(160),
  password: z.string().min(1).max(100),
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
