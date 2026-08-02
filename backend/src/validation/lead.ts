import { z } from 'zod';

export const PLATFORMS = [
  'Google Ads',
  'Meta Ads',
  'TikTok Ads',
  'Amazon Ads',
  'LinkedIn Ads',
  'Microsoft Ads',
  'SEO',
  'Other',
] as const;

export const LEAD_SOURCES = [
  'hero-audit',
  'contact-page',
  'service-page',
  'academy',
  'industry',
  'footer',
  'other',
] as const;

export const LEAD_STATUSES = [
  'new',
  'contacted',
  'qualified',
  'won',
  'lost',
  'spam',
] as const;

export const createLeadSchema = z.object({
  name: z.string().trim().min(2, 'Please enter your full name').max(120),
  email: z.string().trim().email('Please enter a valid email').max(200),
  phone: z.string().trim().max(40).optional().default(''),
  company: z.string().trim().max(160).optional().default(''),
  website: z.string().trim().max(300).optional().default(''),
  platform: z.enum(PLATFORMS).optional().default('Other'),
  monthlyBudget: z.string().trim().max(60).optional().default(''),
  message: z.string().trim().max(4000).optional().default(''),
  source: z.enum(LEAD_SOURCES).optional().default('other'),
  sourcePath: z.string().trim().max(300).optional().default(''),
  utm: z
    .object({
      source: z.string().max(120).optional().default(''),
      medium: z.string().max(120).optional().default(''),
      campaign: z.string().max(160).optional().default(''),
      term: z.string().max(160).optional().default(''),
      content: z.string().max(160).optional().default(''),
    })
    .optional(),
  // Honeypot — real users never fill this in.
  companyWebsite: z.string().max(0).optional().default(''),
});

export const updateLeadSchema = z.object({
  status: z.enum(LEAD_STATUSES).optional(),
  notes: z.string().max(4000).optional(),
});

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export type CreateLeadInput = z.infer<typeof createLeadSchema>;
