import * as cheerio from "cheerio";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { getEnv } from "@/lib/env";
import { httpGet } from "@/lib/http/client";
import { logger } from "@/lib/logger";

export type SeoAnalysis = Record<string, unknown>;

export type DraftAnalysis = {
  scores: Record<string, unknown>;
  keywords: unknown;
  suggestions: unknown[];
};

type LighthouseScores = {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
};

function postPublicUrl(slug: string): string {
  let base = "http://localhost:3000";
  try {
    base = (getEnv().NEXT_PUBLIC_APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
  } catch {
    base =
      process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ||
      (process.env.VERCEL_URL?.startsWith("http")
        ? process.env.VERCEL_URL.replace(/\/$/, "")
        : process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`
          : "http://localhost:3000");
  }
  return `${base}/blog/${slug}`;
}

function extractHtmlFromPost(post: Record<string, unknown>): string {
  const wp = post.wordpressHtml;
  if (typeof wp === "string" && wp.length > 0) {
    return wp;
  }
  const content = post.content;
  if (typeof content === "string") return content;
  return `<div>${JSON.stringify(content ?? "")}</div>`;
}

function extractPlainText(htmlOrRich: string): string {
  if (!htmlOrRich) return "";
  try {
    const $ = cheerio.load(htmlOrRich);
    return $.text();
  } catch {
    return htmlOrRich.replace(/<[^>]*>/g, " ");
  }
}

async function runLighthouse(
  url: string
): Promise<
  | {
      success: true;
      scores: LighthouseScores;
      metrics: Record<string, string>;
      issues: { severity: string; message: string }[];
    }
  | { success: false; error: string }
> {
  let apiKey: string | undefined;
  try {
    apiKey = getEnv().GOOGLE_PAGESPEED_API_KEY;
  } catch {
    apiKey = process.env.GOOGLE_PAGESPEED_API_KEY;
  }

  if (url.includes("localhost")) {
    return { success: false, error: "Lighthouse skipped: localhost URL cannot be audited" };
  }
  if (!apiKey) {
    return { success: false, error: "Lighthouse skipped: GOOGLE_PAGESPEED_API_KEY not configured" };
  }

  try {
    const base = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";
    const categories = ["performance", "accessibility", "best-practices", "seo"];
    const params = new URLSearchParams({ url, strategy: "mobile" });
    for (const c of categories) {
      params.append("category", c);
    }
    params.set("key", apiKey);

    const res = await httpGet(`${base}?${params.toString()}`, {
      timeoutMs: 60_000,
    });
    if (!res.ok) {
      return { success: false, error: await res.text() };
    }
    const body = (await res.json()) as {
      lighthouseResult?: {
        categories: Record<string, { score: number | null }>;
        audits: Record<string, { displayValue?: string }>;
      };
    };
    const data = body.lighthouseResult;
    if (!data?.categories) {
      return { success: false, error: "Invalid PageSpeed response" };
    }
    const scores: LighthouseScores = {
      performance: Math.round((data.categories.performance?.score ?? 0) * 100),
      accessibility: Math.round(
        (data.categories.accessibility?.score ?? 0) * 100
      ),
      bestPractices: Math.round(
        (data.categories["best-practices"]?.score ?? 0) * 100
      ),
      seo: Math.round((data.categories.seo?.score ?? 0) * 100),
    };
    const audits = data.audits;
    const metrics = {
      lcp: audits?.["largest-contentful-paint"]?.displayValue ?? "",
      cls: audits?.["cumulative-layout-shift"]?.displayValue ?? "",
      fid: audits?.["max-potential-fid"]?.displayValue ?? "",
      tti: audits?.interactive?.displayValue ?? "",
    };
    return { success: true, scores, metrics, issues: [] };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    logger.warn("Lighthouse failed", { error: msg });
    return { success: false, error: `Lighthouse API error: ${msg}` };
  }
}

function parseLighthouseIssues(scores: LighthouseScores): {
  issues: Record<string, unknown>[];
  recommendations: Record<string, unknown>[];
} {
  const issues: Record<string, unknown>[] = [];
  const recommendations: Record<string, unknown>[] = [];
  if (scores.performance < 90) {
    issues.push({
      type: "performance",
      severity: scores.performance < 50 ? "critical" : "medium",
      message: `Page speed is low (${scores.performance}/100).`,
    });
    recommendations.push({
      type: "performance",
      action: "Optimize images and JS delivery.",
      priority: "high",
    });
  }
  if (scores.accessibility < 90) {
    issues.push({
      type: "accessibility",
      severity: "medium",
      message: `Accessibility score is low (${scores.accessibility}/100).`,
    });
  }
  if (scores.seo < 90) {
    issues.push({
      type: "technical_seo",
      severity: "medium",
      message: `Technical SEO score is low (${scores.seo}/100).`,
    });
  }
  return { issues, recommendations };
}

function calculateReadability(content: string): number {
  if (!content) return 0;
  const text = content.replace(/<[^>]*>/g, " ").trim();
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const sentenceCount = sentences.length || 1;
  const words = text.split(/\s+/);
  const wordCount = words.length || 1;
  const syllableCount = words.reduce(
    (count, word) => count + countSyllables(word || ""),
    0
  );
  const score =
    206.835 -
    1.015 * (wordCount / sentenceCount) -
    84.6 * (syllableCount / wordCount);
  return Math.max(0, Math.min(100, score));
}

function countSyllables(word: string): number {
  let w = word.toLowerCase();
  if (w.length <= 3) return 1;
  w = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "");
  w = w.replace(/^y/, "");
  const syllables = w.match(/[aeiouy]{1,2}/g);
  return syllables ? syllables.length : 1;
}

function analyzeKeywordDensity(
  content: string,
  keywords: string | undefined
): Record<string, unknown> | null {
  if (!keywords || !content) return null;
  const text = content.replace(/<[^>]*>/g, " ").toLowerCase();
  const words = text.split(/\s+/);
  const total = words.length || 1;
  const list = keywords.split(",").map((k) => k.trim().toLowerCase());
  const densities: Record<string, unknown> = {};
  for (const keyword of list) {
    if (!keyword) continue;
    const count = (text.match(new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g")) || [])
      .length;
    const density = Number(((count / total) * 100).toFixed(2));
    densities[keyword] = {
      count,
      density,
      optimal: density >= 1 && density <= 3,
    };
  }
  return densities;
}

function isOptimalLength(text: string | undefined, min: number, max: number): boolean {
  if (!text) return false;
  const len = text.length;
  return len >= min && len <= max;
}

function localAnalysis(
  post: Record<string, unknown>,
  htmlContent: string,
  textContent: string
): {
  issues: Record<string, unknown>[];
  recommendations: Record<string, unknown>[];
  wordCount: number;
  readabilityScore: number;
  keywordDensity: Record<string, unknown> | null;
  titleTag: Record<string, unknown>;
  metaDescription: Record<string, unknown>;
} {
  const issues: Record<string, unknown>[] = [];
  const recommendations: Record<string, unknown>[] = [];
  const $ = cheerio.load(htmlContent);
  const cleanText = textContent.trim();
  const wordCount = cleanText ? cleanText.split(/\s+/).length : 0;

  if (wordCount < 300) {
    issues.push({
      type: "content_length",
      severity: "high",
      message: `Content is too short (${wordCount} words).`,
    });
    recommendations.push({
      type: "content_length",
      action: "Expand content to at least 300 words.",
      priority: "high",
    });
  }

  const h1Count = $("h1").length;
  if (h1Count > 0) {
    issues.push({
      type: "structure",
      severity: "medium",
      message: "Content contains H1 tags; title should be the only H1.",
    });
  }
  const h2Count = $("h2").length;
  if (h2Count === 0 && wordCount > 300) {
    issues.push({
      type: "structure",
      severity: "medium",
      message: "No H2 subheadings found.",
    });
  }

  const metaGroup = post.meta as
    | { title?: string; description?: string; keywords?: string }
    | undefined;
  const metaTitle = metaGroup?.title;
  const metaDesc = metaGroup?.description;
  const metaKw = metaGroup?.keywords;
  const titleStr = (post.title as string) || "";

  const titleTag = {
    value: metaTitle || titleStr,
    length: (metaTitle || titleStr).length,
    optimal: isOptimalLength(metaTitle || titleStr, 50, 60),
  };
  if (!titleTag.optimal) {
    issues.push({
      type: "title",
      severity: "high",
      message: `Title length (${titleTag.length}) is not optimal (50-60).`,
    });
  }

  const metaDescription = {
    value: metaDesc || "",
    length: (metaDesc || "").length,
    optimal: isOptimalLength(metaDesc, 150, 160),
  };
  if (!metaDescription.optimal) {
    issues.push({
      type: "meta_description",
      severity: "high",
      message:
        metaDescription.length === 0
          ? "Missing meta description."
          : `Meta description length (${metaDescription.length}) not optimal.`,
    });
  }

  const readabilityScore = calculateReadability(cleanText);
  if (readabilityScore < 60) {
    issues.push({
      type: "readability",
      severity: "medium",
      message: "Content is difficult to read.",
      current: readabilityScore,
    });
  }

  const keywordDensity = analyzeKeywordDensity(
    cleanText,
    metaKw || undefined
  );

  return {
    issues,
    recommendations,
    wordCount,
    readabilityScore,
    keywordDensity,
    titleTag,
    metaDescription,
  };
}

function calculateScore(
  lighthouse: { scores: LighthouseScores } | null,
  local: ReturnType<typeof localAnalysis>
): number {
  let score = 100;
  const deductions: Record<string, number> = {
    critical: 20,
    high: 10,
    medium: 5,
    low: 2,
  };
  const lhIssues = lighthouse
    ? parseLighthouseIssues(lighthouse.scores).issues
    : [];
  const all = [...lhIssues, ...local.issues];
  for (const issue of all) {
    const sev = String(issue.severity || "medium");
    score -= deductions[sev] ?? 5;
  }
  if (lighthouse && lighthouse.scores.performance > 90) score += 5;
  if (lighthouse && lighthouse.scores.seo > 90) score += 5;
  if (local.wordCount > 1000) score += 5;
  if (local.readabilityScore > 70) score += 5;
  return Math.max(0, Math.min(100, score));
}

export async function analyzePost(postId: string): Promise<SeoAnalysis> {
  const payload = await getPayloadSingleton();
  const post = (await payload.findByID({
    collection: "posts",
    id: postId,
    depth: 1,
    overrideAccess: true,
  })) as Record<string, unknown> | null;

  if (!post?.id) {
    throw new Error("Post not found");
  }

  const slug = String(post.slug || postId);
  const url = postPublicUrl(slug);
  const htmlContent = extractHtmlFromPost(post);
  const textContent = extractPlainText(htmlContent);

  const lh = await runLighthouse(url);
  const lhScores = lh.success ? lh.scores : null;
  const lhParsed = lhScores ? parseLighthouseIssues(lhScores) : { issues: [], recommendations: [] };

  const local = localAnalysis(post, htmlContent, textContent);
  const combinedIssues = [...lhParsed.issues, ...local.issues];
  const combinedRecs = [...lhParsed.recommendations, ...local.recommendations];

  const screpyData = lh.success
    ? {
        scores: lh.scores,
        metrics: lh.metrics,
        source: "lighthouse",
      }
    : null;

  const score = calculateScore(lhScores ? { scores: lhScores } : null, local);

  // Parse real structural data from HTML
  const $html = cheerio.load(htmlContent);
  const headings = $html("h1,h2,h3,h4,h5,h6")
    .map((_, el) => ({ tag: $html(el).prop("tagName")?.toLowerCase() ?? "", text: $html(el).text().trim() }))
    .get();
  const images = $html("img")
    .map((_, el) => {
      const src = $html(el).attr("src") ?? "";
      const alt = $html(el).attr("alt") ?? "";
      return { src, alt, hasAlt: alt.length > 0 };
    })
    .get();
  const internalLinks = $html('a[href^="/"]').length;
  const externalLinks = $html('a[href^="http"]').length;

  // If Lighthouse was skipped/failed, add an informational issue so the admin knows
  if (!lh.success) {
    combinedIssues.push({
      type: "lighthouse_unavailable",
      severity: "info",
      message: lh.error,
    });
  }

  const analysisData = {
    post: Number(postId),
    url,
    screpyReportId: lh.success ? "lighthouse" : null,
    screpyScore: lhScores?.seo ?? null,
    screpyData,
    lighthouseSimulated: false,
    score,
    issues: combinedIssues,
    recommendations: combinedRecs,
    pageSpeed: lhScores?.performance ?? null,
    mobileScore: lhScores?.accessibility ?? null,
    titleTag: local.titleTag,
    metaDescription: local.metaDescription,
    headings,
    images,
    internalLinks,
    externalLinks,
    wordCount: local.wordCount,
    readability: local.readabilityScore,
    keywordUsage: local.keywordDensity,
    schemaTypes: [],
    analyzedAt: new Date().toISOString(),
  };

  const existing = await payload.find({
    collection: "seo-analyses",
    where: { post: { equals: Number(postId) } },
    sort: "-analyzedAt",
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });

  const doc = existing.docs[0]
    ? await payload.update({
        collection: "seo-analyses",
        id: existing.docs[0].id,
        data: analysisData as never,
        overrideAccess: true,
      })
    : await payload.create({
        collection: "seo-analyses",
        data: analysisData as never,
        overrideAccess: true,
      });

  await payload.update({
    collection: "posts",
    id: postId,
    data: {
      seoAnalysis: {
        seoScore: score,
        seoFeedback: `SEO analysis complete. Score ${score}. Issues: ${combinedIssues.length}.`,
        focusKeyword: (post.meta as { keywords?: string } | undefined)
          ?.keywords,
      },
    },
    overrideAccess: true,
  });

  return doc as SeoAnalysis;
}

export async function analyzeAllPosts(): Promise<{
  analyzed: number;
  failed: number;
}> {
  const payload = await getPayloadSingleton();
  let page = 1;
  let analyzed = 0;
  let failed = 0;

  for (;;) {
    const batch = await payload.find({
      collection: "posts",
      where: { _status: { equals: "published" } },
      limit: 20,
      page,
      depth: 0,
      overrideAccess: true,
    });
    if (!batch.docs.length) break;
    for (const p of batch.docs) {
      try {
        await analyzePost(String(p.id));
        analyzed++;
        await new Promise((r) => setTimeout(r, 1500));
      } catch {
        failed++;
      }
    }
    if (!batch.hasNextPage) break;
    page++;
  }

  return { analyzed, failed };
}

export async function analyzeDraft(
  content: string,
  title: string,
  focusKeyword: string
): Promise<DraftAnalysis> {
  const textContent = extractPlainText(content);
  const wordCount = textContent.trim().split(/\s+/).filter(Boolean).length;
  const readabilityScore = calculateReadability(textContent);
  const keywordDensity = analyzeKeywordDensity(
    textContent,
    focusKeyword || undefined
  );

  const scores = {
    wordCount: {
      value: wordCount,
      status:
        wordCount >= 300 ? "good" : wordCount >= 150 ? "fair" : "poor",
      message:
        wordCount < 300
          ? `Add ${300 - wordCount} more words (minimum 300)`
          : "Word count is good",
    },
    readability: {
      value: Math.round(readabilityScore),
      status:
        readabilityScore >= 60
          ? "good"
          : readabilityScore >= 40
            ? "fair"
            : "poor",
      message:
        readabilityScore < 60
          ? "Use simpler words and shorter sentences"
          : "Readability is good",
    },
    titleLength: {
      value: title.length,
      status:
        title.length >= 50 && title.length <= 60 ? "good" : "fair",
      message:
        title.length < 50
          ? "Title too short (aim 50-60 chars)"
          : title.length > 60
            ? "Title too long"
            : "Title length is optimal",
    },
  };

  const suggestions: unknown[] = [];
  if (wordCount < 300) {
    suggestions.push({
      type: "content",
      priority: "high",
      message: "Expand content to at least 300 words",
    });
  }

  return { scores, keywords: keywordDensity, suggestions };
}
