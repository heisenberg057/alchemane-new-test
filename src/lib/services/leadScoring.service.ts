import { getPayloadSingleton } from "@/lib/api/getPayload";
import { logger } from "@/lib/logger";
export type LeadScore = Record<string, unknown>;

/** Payload form submission shape used for scoring (legacy fields optional). */
export type FormSubmissionForScore = {
  id: string | number;
  type?: string | null;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  message?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  timeOnSite?: number | null;
  pagesBefore?: number | null;
  scrollDepth?: number | null;
  isMultiStep?: boolean | null;
  completedSteps?: string | null;
  calculatorUsed?: boolean | null;
  campaignSource?: string | null;
};

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

function calculateBehaviorScore(sub: FormSubmissionForScore): number {
  let score = 0;
  const t = sub.timeOnSite ?? 0;
  if (t > 300) score += 10;
  else if (t > 180) score += 7;
  else if (t > 60) score += 5;
  else if (t > 0) score += 2;

  const p = sub.pagesBefore ?? 0;
  if (p >= 5) score += 10;
  else if (p >= 3) score += 7;
  else if (p >= 2) score += 5;
  else if (p > 0) score += 2;

  const sd = sub.scrollDepth ?? 0;
  if (sd > 0.75) score += 5;
  else if (sd > 0.5) score += 3;
  else if (sd > 0) score += 1;

  return Math.min(score, 30);
}

function calculateIntentScore(sub: FormSubmissionForScore): number {
  let score = 10;
  if (sub.isMultiStep && sub.completedSteps) {
    score += 5;
  }
  if (sub.calculatorUsed) {
    score += 10;
  }
  const msg = (sub.message || "").toLowerCase();
  if (["urgent", "asap", "today"].some((k) => msg.includes(k))) {
    score += 3;
  }
  if (["book", "schedule", "appointment"].some((k) => msg.includes(k))) {
    score += 2;
  }

  const t = (sub.type || "").toLowerCase();
  if (t === "consultation") score += 5;
  if (t === "contact") score += 2;

  return Math.min(score, 30);
}

function isDisposableEmail(email: string): boolean {
  const domains = ["tempmail.com", "mailinator.com", "10minutemail.com"];
  return domains.some((d) => email.endsWith(d));
}

function calculateQualityScore(sub: FormSubmissionForScore): number {
  let score = 0;
  const email = (sub.email || "").trim();
  if (email.includes("@")) {
    score += 5;
    if (!isDisposableEmail(email.toLowerCase())) score += 2;
  }
  const phone = (sub.phone || "").trim();
  if (phone.length >= 10) score += 5;
  const name = (sub.name || "").trim();
  if (name.includes(" ")) score += 3;
  const msg = (sub.message || "").toLowerCase();
  if (["price", "cost", "budget"].some((k) => msg.includes(k))) score += 5;
  return Math.min(score, 20);
}

function calculateSourceScore(sub: FormSubmissionForScore): number {
  let score = 0;
  const source = (sub.campaignSource || sub.utmSource || "").toLowerCase();
  const medium = (sub.utmMedium || "").toLowerCase();
  if (
    source.includes("google") ||
    source.includes("facebook") ||
    medium === "cpc" ||
    medium === "paid"
  ) {
    score += 10;
  } else if (!source && !sub.utmSource) {
    score += 5;
  }
  return Math.min(score, 20);
}

function generateFactors(
  sub: FormSubmissionForScore,
  scores: {
    behaviorScore: number;
    intentScore: number;
    qualityScore: number;
    sourceScore: number;
  }
): Record<string, unknown> {
  return {
    scores,
    formType: sub.type,
    hasPhone: Boolean(sub.phone?.trim?.()),
    messageLength: (sub.message || "").length,
  };
}

async function upsertLeadScore(
  payload: Awaited<ReturnType<typeof getPayloadSingleton>>,
  sub: FormSubmissionForScore
): Promise<LeadScore> {
  const formSubmissionId = String(sub.id);
  const normalizedFormSubmissionId = isNaN(Number(formSubmissionId))
    ? formSubmissionId
    : Number(formSubmissionId);
  try {
    const behaviorScore = calculateBehaviorScore(sub);
    const intentScore = calculateIntentScore(sub);
    const qualityScore = calculateQualityScore(sub);
    const sourceScore = calculateSourceScore(sub);
    const totalScore = clamp(
      behaviorScore + intentScore + qualityScore + sourceScore,
      0,
      100
    );

    let category = "cold";
    let priority = 3;
    if (totalScore >= 80) {
      category = "hot";
      priority = 1;
    } else if (totalScore >= 50) {
      category = "warm";
      priority = 2;
    }

    const factors = generateFactors(sub, {
      behaviorScore,
      intentScore,
      qualityScore,
      sourceScore,
    });

    const data = {
      formSubmission: normalizedFormSubmissionId,
      behaviorScore,
      intentScore,
      qualityScore,
      sourceScore,
      totalScore,
      category,
      priority,
      factors,
      calculatedAt: new Date().toISOString(),
    };

    console.log(`[SCORING] Saving lead score for submission ${formSubmissionId}`, data);

    const existing = await payload.find({
      collection: "lead-scores",
      where: { formSubmission: { equals: normalizedFormSubmissionId } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    });

    let doc: Record<string, unknown>;
    if (existing.docs[0]) {
      doc = (await payload.update({
        collection: "lead-scores",
        id: existing.docs[0].id,
        data,
        overrideAccess: true,
      })) as Record<string, unknown>;
    } else {
      doc = (await payload.create({
        collection: "lead-scores",
        data,
        overrideAccess: true,
      })) as Record<string, unknown>;
    }

    logger.info("Lead scored", {
      formSubmissionId,
      totalScore,
      category,
    });

    return doc;
  } catch (err: any) {
    console.error(`[SCORING] Failed to score ${formSubmissionId}:`, err);
    throw err;
  }
}

export async function scoreLeadFromSubmission(
  formSubmissionId: string
): Promise<LeadScore> {
  const payload = await getPayloadSingleton();
  const sub = (await payload.findByID({
    collection: "form-submissions",
    id: formSubmissionId,
    depth: 0,
    overrideAccess: true,
  })) as FormSubmissionForScore | null;

  if (!sub?.id) {
    console.error(`[SCORING] Submission ${formSubmissionId} not found`);
    throw new Error("Form submission not found");
  }

  return upsertLeadScore(payload, sub);
}

export async function scoreLeadFromSubmissionDoc(
  submission: FormSubmissionForScore
): Promise<LeadScore> {
  const payload = await getPayloadSingleton();
  if (!submission?.id) {
    throw new Error("Form submission document is missing an id");
  }
  return upsertLeadScore(payload, submission);
}

export async function bulkScoreAllLeads(): Promise<{
  scored: number;
  failed: number;
}> {
  const payload = await getPayloadSingleton();
  const existingScores = await payload.find({
    collection: "lead-scores",
    limit: 10_000,
    depth: 0,
    overrideAccess: true,
  });
  const already = new Set(
    existingScores.docs.map((d) => String(d.formSubmission))
  );

  let page = 1;
  let scored = 0;
  let failed = 0;

  for (;;) {
    const batch = await payload.find({
      collection: "form-submissions",
      limit: 80,
      page,
      depth: 0,
      overrideAccess: true,
    });
    if (!batch.docs.length) break;

    for (const doc of batch.docs) {
      if (already.has(String(doc.id))) continue;
      try {
        await scoreLeadFromSubmission(String(doc.id));
        scored++;
      } catch {
        failed++;
      }
    }

    if (!batch.hasNextPage) break;
    page++;
  }

  return { scored, failed };
}

export async function getHotLeads(
  threshold = 80,
  limit = 50
): Promise<LeadScore[]> {
  await ensureLeadScoresSynchronized();
  const payload = await getPayloadSingleton();
  const res = await payload.find({
    collection: "lead-scores",
    where: { totalScore: { greater_than_equal: threshold } },
    sort: "-totalScore",
    limit: Math.min(limit, 100),
    depth: 1,
    overrideAccess: true,
  });
  return res.docs as LeadScore[];
}

/** Admin list: mapped rows + pagination; `id` is always form-submission id for status PATCH. */
export async function getHotLeadsForAdmin(options: {
  threshold?: number;
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}): Promise<{
  leads: Record<string, unknown>[];
  meta: { total: number; pages: number; page: number; limit: number };
}> {
  const threshold = options.threshold ?? 60;
  const page = Math.max(1, options.page ?? 1);
  const limit = Math.min(100, options.limit ?? 20);
  const search = (options.search || "").trim().toLowerCase();
  const statusFilter = (options.status || "").trim();

  await ensureLeadScoresSynchronized();
  const payload = await getPayloadSingleton();
  const res = await payload.find({
    collection: "lead-scores",
    where: { totalScore: { greater_than_equal: threshold } },
    sort: "-totalScore",
    limit: 2000,
    depth: 2,
    overrideAccess: true,
  });

  const rows: Record<string, unknown>[] = [];
  for (const doc of res.docs as Record<string, unknown>[]) {
    const sub = doc.formSubmission as
      | Record<string, unknown>
      | string
      | number
      | null
      | undefined;
    const submission =
      sub && typeof sub === "object"
        ? (sub as Record<string, unknown>)
        : null;
    const subId =
      submission?.id != null
        ? submission.id
        : doc.formSubmission;
    if (subId == null) continue;

    const leadStatus =
      (submission?.status as string) || "NEW";
    if (statusFilter && leadStatus !== statusFilter) continue;

    const name = String(submission?.name || "").trim();
    const email = String(submission?.email || "").trim();
    if (search) {
      const hay = `${name} ${email}`.toLowerCase();
      if (!hay.includes(search)) continue;
    }

    const totalScore = Number(doc.totalScore ?? 0);
    let factors = doc.factors as Record<string, unknown> | string | undefined;
    if (typeof factors === "string") {
      try {
        factors = JSON.parse(factors) as Record<string, unknown>;
      } catch {
        factors = undefined;
      }
    }
    const scores = factors?.scores as
      | Record<string, number>
      | undefined;
    const scoreBreakdown = scores
      ? [
          { reason: "Behavior", points: scores.behaviorScore ?? 0 },
          { reason: "Intent", points: scores.intentScore ?? 0 },
          { reason: "Quality", points: scores.qualityScore ?? 0 },
          { reason: "Source", points: scores.sourceScore ?? 0 },
        ]
      : [];

    rows.push({
      id: subId,
      scoreId: doc.id,
      score: totalScore,
      status: leadStatus,
      name: name || "Unknown",
      email: email || "-",
      user: { name, email },
      metaData: {
        name,
        email,
        phone: submission?.phone,
        source: submission?.utmSource || submission?.utmCampaign || "Direct",
        utmSource: submission?.utmSource,
        utmMedium: submission?.utmMedium,
        utmCampaign: submission?.utmCampaign,
        campaignName: submission?.campaignName,
        adSetName: submission?.adSetName,
        adName: submission?.adName,
        placement: submission?.placement,
        location: submission?.city || 
          (String(submission?.message || "").match(/Inquiry from (.*)/)?.[1]?.trim()) || 
          "-",
      },
      createdAt: doc.createdAt || doc.calculatedAt,
      updatedAt: doc.updatedAt || doc.calculatedAt,
      scoreBreakdown,
      category: doc.category,
      // Compatibility for Leads/Scoring page
      leadScore: totalScore,
      leadCategory: doc.category,
      data: JSON.stringify({
        name,
        email,
        phone: submission?.phone,
      }),
    });
  }

  const total = rows.length;
  const pages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const leads = rows.slice(start, start + limit);

  return {
    leads,
    meta: { total, pages, page, limit },
  };
}

async function ensureLeadScoresSynchronized(): Promise<void> {
  const payload = await getPayloadSingleton();
  const [leadScores, submissions] = await Promise.all([
    payload.find({
      collection: "lead-scores",
      limit: 1,
      depth: 0,
      overrideAccess: true,
    }),
    payload.find({
      collection: "form-submissions",
      limit: 1,
      depth: 0,
      overrideAccess: true,
    }),
  ]);

  if (submissions.totalDocs === 0) return;
  if (leadScores.totalDocs >= submissions.totalDocs) return;

  await bulkScoreAllLeads();
}

/** Fire-and-forget scoring from hooks (errors logged only). */
export function scheduleScoreLeadFromSubmission(
  formSubmissionId: string | number
): void {
  void (async () => {
    try {
      await scoreLeadFromSubmission(String(formSubmissionId));
    } catch (e) {
      logger.error("scheduleScoreLeadFromSubmission failed", {
        error: e instanceof Error ? e.message : String(e),
      });
    }
  })();
}

export function scheduleScoreLeadFromSubmissionDoc(
  submission: FormSubmissionForScore
): void {
  void (async () => {
    try {
      await scoreLeadFromSubmissionDoc(submission);
    } catch (e) {
      logger.error("scheduleScoreLeadFromSubmissionDoc failed", {
        error: e instanceof Error ? e.message : String(e),
      });
    }
  })();
}

/** Fire-and-forget webhooks from hooks. Sends all form fields so services like Pabbly receive complete lead data. */
export function scheduleDispatchFormSubmitted(doc: Record<string, unknown>): void {
  void (async () => {
    try {
      const { dispatchWebhook } = await import("@/lib/services/webhook.service");
      await dispatchWebhook("form.submitted", {
        // Core lead fields
        id: String(doc.id),
        type: doc.type,
        name: doc.name,
        email: doc.email,
        phone: doc.phone,
        subject: doc.subject,
        message: doc.message,
        city: doc.city,
        confirmPhone: doc.confirmPhone,
        preferredTime: doc.preferredTime,
        consultationMode: doc.consultationMode,
        funnelSlug: doc.funnelSlug,
        sourceUrl: doc.sourceUrl,
        // UTM tracking
        utmSource: doc.utmSource,
        utmMedium: doc.utmMedium,
        utmCampaign: doc.utmCampaign,
        utmContent: doc.utmContent,
        utmTerm: doc.utmTerm,
        // Ad tracking
        campaignName: doc.campaignName,
        adSetName: doc.adSetName,
        adName: doc.adName,
        campaignSource: doc.campaignSource,
        placement: doc.placement,
        // Click IDs
        gclid: doc.gclid,
        fbclid: doc.fbclid,
        msclkid: doc.msclkid,
        ttclid: doc.ttclid,
        liFatId: doc.liFatId,
        // Behavioral data
        timeOnSite: doc.timeOnSite,
        pagesBefore: doc.pagesBefore,
        scrollDepth: doc.scrollDepth,
        // Submission metadata
        submittedAt: doc.createdAt,
      });
    } catch (e) {
      logger.error("dispatchWebhook failed", {
        error: e instanceof Error ? e.message : String(e),
      });
    }
  })();
}
