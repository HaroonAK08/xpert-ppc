import { z } from 'zod';

const conditionSchema = z.object({
  field: z.enum(['source', 'platform', 'sourcePath']),
  value: z.string().trim().min(1).max(120),
});

const actionSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('set_status'), status: z.string().trim().min(1) }),
  z.object({ type: z.literal('assign_to'), userId: z.string().trim().min(1) }),
  z.object({ type: z.literal('add_note'), text: z.string().trim().min(1).max(2000) }),
  z.object({ type: z.literal('enroll_in_sequence'), sequenceId: z.string().trim().min(1) }),
  z.object({
    type: z.literal('send_email'),
    subject: z.string().trim().min(1).max(200),
    body: z.string().trim().min(1).max(20000),
  }),
]);

export const automationCreateSchema = z.object({
  name: z.string().trim().min(1).max(120),
  trigger: z.enum(['lead_created', 'status_changed']),
  fromStatus: z.string().trim().optional().default(''),
  toStatus: z.string().trim().optional().default(''),
  conditions: z.array(conditionSchema).max(10).optional().default([]),
  actions: z.array(actionSchema).min(1).max(10),
  enabled: z.boolean().optional().default(true),
});

export const automationUpdateSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  trigger: z.enum(['lead_created', 'status_changed']).optional(),
  fromStatus: z.string().trim().optional(),
  toStatus: z.string().trim().optional(),
  conditions: z.array(conditionSchema).max(10).optional(),
  actions: z.array(actionSchema).min(1).max(10).optional(),
  enabled: z.boolean().optional(),
  order: z.number().int().optional(),
});
