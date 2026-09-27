import { z } from 'zod';

const stepSchema = z.object({
  delayHours: z.number().min(0).max(24 * 90),
  subject: z.string().trim().min(1).max(200),
  body: z.string().trim().min(1).max(20000),
});

export const sequenceCreateSchema = z.object({
  name: z.string().trim().min(1).max(120),
  steps: z.array(stepSchema).min(1).max(20),
  enabled: z.boolean().optional().default(true),
});

export const sequenceUpdateSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  steps: z.array(stepSchema).min(1).max(20).optional(),
  enabled: z.boolean().optional(),
});

export const enrollSchema = z.object({
  leadId: z.string().trim().min(1),
});
