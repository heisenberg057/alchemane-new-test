import * as z from "zod";

export const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  message: z.string().min(1).max(5000),
});

export const newsletterSchema = z.object({
  email: z.string().email().max(320),
  turnstileToken: z.string().min(1, "Bot verification required"),
});

export const commentCreateSchema = z.object({
  postId: z.union([z.string(), z.number()]).transform((v) => String(v)),
  authorName: z.string().min(1).max(200),
  authorEmail: z.string().email().max(320),
  authorUrl: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? undefined : v),
    z.string().url().max(2000).optional()
  ),
  content: z.string().min(1).max(10_000),
  turnstileToken: z.string().min(1, "Bot verification required"),
});

export const gdprEmailBodySchema = z.object({
  email: z.string().email().max(320),
  turnstileToken: z.string().min(1, "Bot verification required"),
});

/** POST /api/analytics/pageview */
export const pageviewSchema = z.object({
  path: z.string().min(1).max(4000),
  referrer: z.string().max(4000).optional(),
  userAgent: z.string().max(8000).optional(),
});

/** POST /api/tracking/click — mirrors Express body + Facebook-style keys */
export const adClickSchema = z.object({
  sessionId: z.string().max(200).optional(),
  landingPage: z.string().max(4000).optional(),
  referrer: z.string().max(4000).optional(),
  campaignName: z.string().max(500).optional(),
  adSetName: z.string().max(500).optional(),
  adName: z.string().max(500).optional(),
  campaignSource: z.string().max(500).optional(),
  placement: z.string().max(500).optional(),
  utmSource: z.string().max(500).optional(),
  utmMedium: z.string().max(500).optional(),
  utmCampaign: z.string().max(500).optional(),
  utmTerm: z.string().max(500).optional(),
  utmContent: z.string().max(500).optional(),
  gclid: z.string().max(500).optional(),
  fbclid: z.string().max(500).optional(),
  msclkid: z.string().max(500).optional(),
  ttclid: z.string().max(500).optional(),
  li_fat_id: z.string().max(500).optional(),
});

/** POST /api/tracking/conversion */
export const conversionSchema = z.object({
  sessionId: z.string().min(1).max(200),
  conversionType: z.string().min(1).max(200),
  conversionValue: z.coerce.number().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type CommentCreateInput = z.infer<typeof commentCreateSchema>;
export type GdprEmailInput = z.infer<typeof gdprEmailBodySchema>;
