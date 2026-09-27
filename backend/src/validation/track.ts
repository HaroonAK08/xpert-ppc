import { z } from 'zod';

export const trackPageViewSchema = z.object({
  visitorId: z.string().trim().min(8).max(100),
  url: z.string().trim().max(500).optional().default(''),
  referrer: z.string().trim().max(500).optional().default(''),
  utm: z
    .object({
      source: z.string().max(120).optional().default(''),
      medium: z.string().max(120).optional().default(''),
      campaign: z.string().max(160).optional().default(''),
      term: z.string().max(160).optional().default(''),
      content: z.string().max(160).optional().default(''),
    })
    .optional(),
});

export type TrackPageViewInput = z.infer<typeof trackPageViewSchema>;
