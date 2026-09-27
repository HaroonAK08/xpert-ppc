import { z } from 'zod';

const fieldSchema = z.object({
  key: z.string().trim().min(1).max(60),
  standard: z.boolean(),
  required: z.boolean().optional().default(false),
  label: z.string().trim().max(80).optional().default(''),
  placeholder: z.string().trim().max(120).optional().default(''),
});

const colorSchema = z.string().trim().regex(/^#[0-9a-fA-F]{6}$/, 'Use a hex color like #2563eb.');
const fontSizeSchema = z.enum(['sm', 'md', 'lg']);

const tagSchema = z
  .string()
  .trim()
  .min(1)
  .max(40)
  .transform((s) => s.replace(/\s+/g, ' '));

export const formCreateSchema = z.object({
  name: z.string().trim().min(1).max(120),
  description: z.string().trim().max(200).optional().default(''),
  badgeText: z.string().trim().max(30).optional().default('Contact'),
  fields: z.array(fieldSchema).min(1).max(30),
  submitLabel: z.string().trim().min(1).max(40).optional().default('Send'),
  buttonColor: colorSchema.optional().default('#2563eb'),
  backgroundColor: colorSchema.optional().default('#ffffff'),
  textColor: colorSchema.optional().default('#0f172a'),
  cornerRadius: z.number().min(0).max(24).optional().default(8),
  spacing: z.number().min(8).max(32).optional().default(16),
  fontSize: fontSizeSchema.optional().default('md'),
  successMessage: z
    .string()
    .trim()
    .max(240)
    .optional()
    .default("Thank you — we've got it."),
  successRedirectUrl: z.string().trim().max(500).optional().default(''),
  tags: z.array(tagSchema).max(12).optional().default([]),
  enabled: z.boolean().optional().default(true),
});

export const formUpdateSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  description: z.string().trim().max(200).optional(),
  badgeText: z.string().trim().max(30).optional(),
  fields: z.array(fieldSchema).min(1).max(30).optional(),
  submitLabel: z.string().trim().min(1).max(40).optional(),
  buttonColor: colorSchema.optional(),
  backgroundColor: colorSchema.optional(),
  textColor: colorSchema.optional(),
  cornerRadius: z.number().min(0).max(24).optional(),
  spacing: z.number().min(8).max(32).optional(),
  fontSize: fontSizeSchema.optional(),
  successMessage: z.string().trim().max(240).optional(),
  successRedirectUrl: z.string().trim().max(500).optional(),
  tags: z.array(tagSchema).max(12).optional(),
  enabled: z.boolean().optional(),
});

/** Every form must collect a name and an email — the public lead endpoint needs at least one to identify the submitter. */
export function hasRequiredIdentityFields(fields: { key: string; standard: boolean }[]): boolean {
  return ['name', 'email'].every((k) => fields.some((f) => f.standard && f.key === k));
}
