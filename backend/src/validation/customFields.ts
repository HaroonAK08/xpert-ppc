import { z } from 'zod';

const KEY_RE = /^[a-z][a-z0-9_]{1,49}$/;

export const customFieldCreateSchema = z.object({
  key: z.string().trim().toLowerCase().regex(KEY_RE, 'Use lowercase letters, numbers, and underscores only.'),
  label: z.string().trim().min(1).max(80),
  type: z.enum(['text', 'number', 'date', 'select']),
  options: z.array(z.string().trim().min(1).max(120)).max(50).optional().default([]),
});

export const customFieldUpdateSchema = z.object({
  label: z.string().trim().min(1).max(80).optional(),
  options: z.array(z.string().trim().min(1).max(120)).max(50).optional(),
  order: z.number().int().optional(),
});

// A lead's custom field values — loosely typed here; each value is checked
// against its definition's `type` in the route, not by this shape alone.
export const leadCustomFieldValuesSchema = z.record(z.string(), z.union([z.string(), z.number(), z.null()]));
