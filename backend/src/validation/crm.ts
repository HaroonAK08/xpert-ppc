import { z } from 'zod';
import { CRM_LEAD_STATUSES, SHEET_FIELD_KEYS } from '../../../shared/crm/constants';

export const crmLeadCreateSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(200).optional().or(z.literal('')),
  phone: z.string().trim().max(40).optional().default(''),
  businessName: z.string().trim().max(160).optional().default(''),
  company: z.string().trim().max(160).optional().default(''),
  source: z.string().trim().max(120).optional().default('other'),
  message: z.string().trim().max(4000).optional().default(''),
  status: z.enum(CRM_LEAD_STATUSES).optional().default('new'),
  notes: z.string().trim().max(8000).optional().default(''),
  replied: z.boolean().optional().default(false),
  followUpAt: z.string().datetime().nullable().optional(),
  externalId: z.string().trim().max(200).optional().default(''),
});

export const crmLeadUpdateSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  email: z.string().trim().email().max(200).optional().or(z.literal('')),
  phone: z.string().trim().max(40).optional(),
  businessName: z.string().trim().max(160).optional(),
  company: z.string().trim().max(160).optional(),
  source: z.string().trim().max(120).optional(),
  message: z.string().trim().max(4000).optional(),
  status: z.enum(CRM_LEAD_STATUSES).optional(),
  notes: z.string().trim().max(8000).optional(),
  replied: z.boolean().optional(),
  contactedAt: z.string().datetime().nullable().optional(),
  repliedAt: z.string().datetime().nullable().optional(),
  followUpAt: z.string().datetime().nullable().optional(),
  externalId: z.string().trim().max(200).optional(),
});

export const noteCreateSchema = z.object({
  text: z.string().trim().min(1).max(4000),
});

export const contactActionSchema = z.object({
  note: z.string().trim().max(4000).optional(),
  status: z.enum(CRM_LEAD_STATUSES).optional(),
});

export const replyActionSchema = z.object({
  note: z.string().trim().max(4000).optional(),
  channel: z.enum(['email', 'whatsapp', 'phone', 'other']).optional(),
});

export const followUpSchema = z.object({
  followUpAt: z.string().datetime().nullable(),
  note: z.string().trim().max(4000).optional(),
});

const mappingShape = Object.fromEntries(
  SHEET_FIELD_KEYS.map((k) => [k, z.string().optional()])
) as Record<(typeof SHEET_FIELD_KEYS)[number], z.ZodOptional<z.ZodString>>;

export const sheetConnectSchema = z.object({
  spreadsheetId: z.string().trim().min(5).max(200),
  worksheetName: z.string().trim().min(1).max(120).optional().default('Sheet1'),
  spreadsheetTitle: z.string().trim().max(300).optional().default(''),
  columnMapping: z.object(mappingShape).optional().default({}),
});

export const sheetMappingSchema = z.object({
  worksheetName: z.string().trim().min(1).max(120).optional(),
  columnMapping: z.object(mappingShape).optional(),
  spreadsheetTitle: z.string().trim().max(300).optional(),
});

export const userCreateSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(200),
  name: z.string().trim().min(1).max(120),
  password: z.string().min(8).max(200),
});

export const userUpdateSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  active: z.boolean().optional(),
  password: z.string().min(8).max(200).optional(),
});
