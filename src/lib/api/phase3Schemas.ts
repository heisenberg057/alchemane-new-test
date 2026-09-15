import * as z from "zod";

export const contactFormSchema = z
  .object({
    name: z.string().min(2).max(200),
    email: z.union([z.string().email(), z.literal("")]).optional(),
    phone: z.union([z.string().max(40), z.literal("")]).optional(),
    formType: z
      .enum(["contact", "consultation", "callback", "newsletter", "comment"])
      .optional(),
    subject: z.string().max(200).optional(),
    message: z.string().min(5).max(5000),
    city: z.string().max(200).optional(),
    confirmPhone: z.string().max(40).optional(),
    preferredTime: z.string().max(100).optional(),
    consultationMode: z.string().max(200).optional(),
    funnelSlug: z.string().max(100).optional(),
    honeypot: z.string().optional(),
    turnstileToken: z.string().min(1, "Bot verification required"),
    sessionId: z.string().max(200).optional(),
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
    timeOnSite: z.coerce.number().optional(),
    pagesBefore: z.coerce.number().optional(),
    scrollDepth: z.coerce.number().optional(),
  })
  .passthrough();

export const newsletterFormSchema = z.object({
  email: z.string().email(),
  honeypot: z.string().optional(),
  turnstileToken: z.string().min(1, "Bot verification required"),
});

export const calculatorCostSchema = z
  .object({
    graftsNeeded: z.coerce.number().optional(),
    severity: z.enum(["mild", "moderate", "severe"]).optional(),
    hairLossType: z.string().max(100).optional(),
    coverageArea: z.string().max(200).optional(),
    systemType: z.string().max(100).optional(),
    technique: z.string().max(20).optional(),
    location: z.string().max(20).optional(),
    sessionId: z.string().max(200).optional(),
  })
  .passthrough();

export const estimateGraftsRequestSchema = z
  .object({
    description: z.string().max(20_000).optional(),
    hairLossStage: z.string().max(100).optional(),
    area: z.string().max(200).optional(),
    photoUrl: z.union([z.string().url(), z.literal("")]).optional(),
  })
  .refine(
    (d) =>
      Boolean(
        (d.description && d.description.length > 0) ||
          d.hairLossStage ||
          d.area
      ),
    { message: "Provide description and/or hair loss stage and area" }
  );

export const calculatorSaveSchema = z.object({
  sessionId: z.string().min(1).max(200),
  type: z.string().min(1).max(100),
  inputs: z.record(z.string(), z.unknown()),
  results: z.record(z.string(), z.unknown()),
  leadCaptured: z.boolean().optional(),
});

export const conversionTrackEventSchema = z
  .object({
    sessionId: z.string().min(1).max(200),
    eventType: z.string().min(1).max(200),
    page: z.string().max(4000).optional(),
    eventData: z.unknown().optional(),
    formType: z.string().max(100).optional(),
    abTestVariant: z.string().max(200).optional(),
  })
  .passthrough();

export const exitIntentTrackSchema = z
  .object({
    sessionId: z.string().min(1).max(200),
    page: z.string().min(1).max(4000),
    timeOnPage: z.coerce.number(),
    scrollDepth: z.coerce.number(),
    popupType: z.string().max(100),
    popupContent: z.string().max(2000).optional(),
    action: z.string().max(100),
    emailCaptured: z.string().max(320).optional(),
    device: z.string().max(100).optional(),
    referrer: z.string().max(4000).optional(),
  })
  .passthrough();

export const formAbandonmentSchema = z
  .object({
    sessionId: z.string().min(1).max(200),
    formType: z.string().min(1).max(100),
    currentStep: z.coerce.number().optional(),
    completedSteps: z.coerce.number().optional(),
    email: z.string().email().optional(),
    name: z.string().max(200).optional(),
    phone: z.string().max(40).optional(),
    lastField: z.string().max(200).optional(),
    timeSpent: z.coerce.number().optional(),
    device: z.string().max(100).optional(),
    browser: z.string().max(100).optional(),
    country: z.string().max(100).optional(),
    city: z.string().max(100).optional(),
    campaignName: z.string().max(500).optional(),
    adSetName: z.string().max(500).optional(),
    utmSource: z.string().max(500).optional(),
    utmMedium: z.string().max(500).optional(),
  })
  .passthrough();

export const behavioralTriggerSchema = z
  .object({
    sessionId: z.string().min(1).max(200),
    triggerType: z.string().min(1).max(100),
    triggerValue: z.coerce.number(),
    actionType: z.string().min(1).max(100),
    actionContent: z.string().max(2000).optional(),
    converted: z.boolean().optional(),
    page: z.string().min(1).max(4000),
    device: z.string().max(100).optional(),
  })
  .passthrough();

export const leadOptConversionEventSchema = z
  .object({
    sessionId: z.string().min(1).max(200),
    eventType: z.string().min(1).max(200),
    eventData: z.unknown().optional(),
    page: z.string().min(1).max(4000),
    formType: z.string().max(100).optional(),
    abTestVariant: z.string().max(200).optional(),
  })
  .passthrough();

export const seoIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const keywordParamSchema = z.object({
  keyword: z.string().min(1).max(500),
});

/** Admin keyword track / internal link POST bodies — permissive */
export const keywordTrackSchema = z.record(z.string(), z.unknown());
export const internalLinkCreateSchema = z
  .object({
    fromPost: z.coerce.number().int().positive(),
    toPost: z.coerce.number().int().positive(),
    anchorText: z.string().min(1).max(500),
    position: z.number().optional(),
    relevanceScore: z.number().optional(),
  })
  .passthrough();
export const analyzeDraftSchema = z.record(z.string(), z.unknown());
/** Optional AI tuning flags from the client (all keys optional). */
export const aiOptimizeBodySchema = z.record(z.string(), z.unknown());

const eventsField = z.union([
  z.array(z.string()),
  z.string(),
  z.record(z.string(), z.unknown()),
]);

export const webhookCreateSchema = z
  .object({
    name: z.string().min(1).max(200),
    url: z.string().url(),
    method: z.string().max(10).optional(),
    events: eventsField.optional(),
    headers: z.record(z.string(), z.unknown()).optional(),
    payload: z.unknown().optional(),
    isActive: z.boolean().optional(),
    retryAttempts: z.number().optional(),
    retryDelay: z.number().optional(),
    timeout: z.number().optional(),
  })
  .passthrough();

export const webhookUpdateSchema = webhookCreateSchema.partial();

export const triggerRulesBodySchema = z
  .object({
    timeOnPage: z.number().optional(),
    scrollDepth: z.number().optional(),
    pageViews: z.number().optional(),
  })
  .passthrough();
