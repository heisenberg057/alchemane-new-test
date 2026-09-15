import { getPayloadSingleton } from "@/lib/api/getPayload";
import { logger } from "@/lib/logger";
import {
  generateCompletion,
  generateJSON,
  testCitation as openRouterTestCitation,
} from "@/lib/services/openrouter.service";

export type AiOptimizationResult = {
  success: boolean;
  score?: number;
  faqs?: unknown;
  directAnswers?: unknown;
  takeaways?: unknown;
  conversational?: unknown;
  error?: string;
};

export type CitationResult = {
  cited: boolean;
  confidence: number;
  response: string;
  context: string | null;
  model?: string;
};

async function getAiModel(): Promise<string> {
  const payload = await getPayloadSingleton();
  const r = await payload.find({
    collection: "settings",
    where: { key: { equals: "ai_seo_model" } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });
  const v = r.docs[0]?.value;
  return typeof v === "string" && v.trim() ? v.trim() : "gemini-flash";
}

function stripHtml(html: string): string {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, " ");
}

function parseBlocksData(blocksData: unknown): string {
  if (!blocksData) return "";
  try {
    const data =
      typeof blocksData === "string" ? JSON.parse(blocksData) : blocksData;
    if (!data?.blocks || !Array.isArray(data.blocks)) return "";
    return data.blocks
      .map((block: { type: string; data: Record<string, unknown> }) => {
        switch (block.type) {
          case "paragraph":
          case "header":
          case "quote":
            return stripHtml(String(block.data?.text || ""));
          case "list":
            return ((block.data?.items as string[]) || [])
              .map((item) => stripHtml(item))
              .join(" ");
          default:
            return "";
        }
      })
      .join("\n\n");
  } catch {
    return "";
  }
}

function generateFAQSchema(faqs: { question: string; answer: string }[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

function calculateAiScore(metrics: {
  hasFaqs: boolean;
  hasDirectAnswers: boolean;
  hasTakeaways: boolean;
  conversationalScore: number;
  wordCount: number;
  hasSchema: boolean;
}): number {
  let score = 0;
  if (metrics.hasFaqs) score += 20;
  if (metrics.hasDirectAnswers) score += 20;
  if (metrics.hasTakeaways) score += 15;
  if (metrics.hasSchema) score += 15;
  score += metrics.conversationalScore * 20;
  score += Math.min(metrics.wordCount / 100, 10);
  return Math.min(Math.round(score), 100);
}

async function generateFAQs(
  content: string,
  title: string,
  keywords: string | undefined,
  count = 5,
  model: string
) {
  const prompt = `You are an SEO expert. Analyze this article and generate ${count} relevant FAQ pairs.

Article Title: ${title}
Target Keywords: ${keywords || "N/A"}

Article Content:
${stripHtml(content)}

Respond with JSON ONLY in this format:
{"faqs":[{"question":"...?","answer":"...","keywords":["a","b"]}]}`;

  return generateJSON(prompt, model);
}

async function extractDirectAnswers(
  content: string,
  title: string,
  model: string
) {
  const prompt = `Analyze this article and extract direct quotable Q&A pairs.

Article Title: ${title}
Content:
${stripHtml(content)}

Respond with JSON ONLY: {"answers":[{"question":"...","answer":"...","confidence":0.9}]}`;

  return generateJSON(prompt, model);
}

async function generateKeyTakeaways(
  content: string,
  title: string,
  model: string
) {
  const prompt = `Summarize into 5 key takeaways (citation-worthy).

Title: ${title}
Content:
${stripHtml(content)}

Respond with JSON ONLY: {"takeaways":["...","..."]}`;

  return generateJSON(prompt, model);
}

async function analyzeConversationalOptimization(
  content: string,
  title: string,
  model: string
) {
  const prompt = `Analyze conversational/voice search optimization.

Title: ${title}
Content:
${stripHtml(content)}

Respond with JSON ONLY:
{"conversationalScore":0.75,"questionHeadings":3,"directAnswers":5,"averageSentenceLength":16,"suggestions":["..."]}`;

  return generateJSON(prompt, model);
}

export async function optimizePostWithAI(
  postId: string
): Promise<AiOptimizationResult> {
  try {
    const payload = await getPayloadSingleton();
    const post = (await payload.findByID({
      collection: "posts",
      id: postId,
      depth: 0,
      overrideAccess: true,
    })) as Record<string, unknown> | null;

    if (!post?.id) {
      return { success: false, error: "Post not found" };
    }

    const model = await getAiModel();
    const meta = post.meta as { keywords?: string } | undefined;
    const contentToAnalyze =
      parseBlocksData(post.content) ||
      stripHtml(JSON.stringify(post.content || "")) ||
      stripHtml(String(post.wordpressHtml || ""));

    const title = String(post.title || "");

    const faqResult = await generateFAQs(
      contentToAnalyze,
      title,
      meta?.keywords,
      5,
      model
    );
    const answersResult = await extractDirectAnswers(
      contentToAnalyze,
      title,
      model
    );
    const takeawaysResult = await generateKeyTakeaways(
      contentToAnalyze,
      title,
      model
    );
    const conversationalResult = await analyzeConversationalOptimization(
      contentToAnalyze,
      title,
      model
    );

    const faqs =
      faqResult.success &&
      (faqResult.data as { faqs?: unknown })?.faqs != null
        ? (faqResult.data as { faqs: unknown }).faqs
        : null;
    const directAnswers =
      answersResult.success &&
      (answersResult.data as { answers?: unknown })?.answers != null
        ? (answersResult.data as { answers: unknown }).answers
        : null;
    const takeaways =
      takeawaysResult.success &&
      (takeawaysResult.data as { takeaways?: unknown })?.takeaways != null
        ? (takeawaysResult.data as { takeaways: unknown }).takeaways
        : null;
    const conversational =
      conversationalResult.success && conversationalResult.data
        ? conversationalResult.data
        : null;

    const faqSchema =
      faqResult.success && Array.isArray(faqs)
        ? generateFAQSchema(
            (faqs as { question: string; answer: string }[]).filter(
              (f) => f?.question && f?.answer
            )
          )
        : null;

    const metricsWordCount = Number(
      (post.metrics as { wordCount?: number } | undefined)?.wordCount || 0
    );
    const structuredData = post.structuredData as
      | { customSchema?: unknown }
      | undefined;

    const convObj = conversational as
      | { conversationalScore?: number }
      | null
      | undefined;
    const convScore =
      typeof convObj?.conversationalScore === "number"
        ? convObj.conversationalScore
        : 0;

    const score = calculateAiScore({
      hasFaqs: Boolean(faqs),
      hasDirectAnswers: Boolean(directAnswers),
      hasTakeaways: Boolean(takeaways),
      conversationalScore: convScore,
      wordCount: metricsWordCount,
      hasSchema: Boolean(structuredData?.customSchema) || Boolean(faqSchema),
    });

    await payload.update({
      collection: "posts",
      id: postId,
      data: {
        aiOptimization: {
          score,
          faqs: faqs ?? undefined,
          directAnswers: directAnswers ?? undefined,
          keyTakeaways: takeaways ?? undefined,
          conversationalAnalysis: conversational ?? undefined,
          faqSchema: faqSchema ?? undefined,
          lastOptimizedAt: new Date().toISOString(),
        },
      },
      overrideAccess: true,
    });

    logger.info("AI optimization complete", { postId, score });

    return {
      success: true,
      score,
      faqs: faqs ?? undefined,
      directAnswers: directAnswers ?? undefined,
      takeaways: takeaways ?? undefined,
      conversational: conversational ?? undefined,
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { success: false, error: msg };
  }
}

export async function testAiCitation(
  postId: string,
  query: string
): Promise<CitationResult> {
  const payload = await getPayloadSingleton();
  const post = (await payload.findByID({
    collection: "posts",
    id: postId,
    depth: 0,
    overrideAccess: true,
  })) as Record<string, unknown> | null;

  if (!post) {
    throw new Error("Post not found");
  }

  const snippetParts: string[] = [`Title: ${post.title}\n`];
  const takeaways = (post.aiOptimization as { keyTakeaways?: unknown } | undefined)
    ?.keyTakeaways;
  if (Array.isArray(takeaways)) {
    snippetParts.push("Key points:\n" + takeaways.map(String).join("\n"));
  }
  snippetParts.push(
    parseBlocksData(post.content).slice(0, 2000) ||
      stripHtml(String(post.wordpressHtml || "")).slice(0, 2000)
  );
  const snippet = snippetParts.join("\n");

  const model = await getAiModel();
  const result = await openRouterTestCitation(query, snippet, model);

  if (!result.success) {
    throw new Error(
      "error" in result ? result.error : "Citation test failed"
    );
  }

  await payload.create({
    collection: "ai-citation-tests",
    data: {
      post: Number(postId),
      query,
      aiModel: result.model || model,
      cited: result.cited,
      position: result.cited ? 1 : undefined,
      context: result.context || "",
      response: result.response,
      testedAt: new Date().toISOString(),
    },
    overrideAccess: true,
  });

  return {
    cited: result.cited,
    confidence: result.confidence,
    response: result.response,
    context: result.context,
    model: result.model,
  };
}

export async function generateMetaDescription(content: string): Promise<string> {
  const excerpt = stripHtml(content).slice(0, 1200);
  const title = excerpt.split("\n")[0]?.slice(0, 120) || "Article";
  const prompt = `Generate an SEO-optimized meta description for this article.

Title: ${title}

Content:
${excerpt}...

Requirements:
- Exactly 150-160 characters
- Compelling and accurate
- Active voice

Respond with ONLY the meta description, no explanation.`;

  const result = await generateCompletion(prompt, "gpt-4-turbo", {
    temperature: 0.7,
    maxTokens: 100,
  });
  if (!result.success) {
    throw new Error("Failed to generate meta description");
  }
  return result.content.trim();
}

/** Batch-optimize published posts (admin/cron). Caps at 50 per call to avoid timeouts. */
export async function optimizeAllPublishedPosts(): Promise<{
  processed: number;
  failed: number;
  errors: string[];
}> {
  const payload = await getPayloadSingleton();
  const res = await payload.find({
    collection: "posts",
    where: { _status: { equals: "published" } },
    limit: 50,
    depth: 0,
    overrideAccess: true,
  });

  let processed = 0;
  let failed = 0;
  const errors: string[] = [];

  for (const doc of res.docs) {
    const id = doc.id;
    try {
      const r = await optimizePostWithAI(String(id));
      if (r.success) processed++;
      else {
        failed++;
        if (r.error) errors.push(`${id}: ${r.error}`);
      }
    } catch (e) {
      failed++;
      errors.push(`${id}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  return { processed, failed, errors };
}

export async function generateSeoTitle(
  content: string,
  keyword: string
): Promise<string> {
  const excerpt = stripHtml(content).slice(0, 800);
  const prompt = `Generate 3 SEO-optimized title variations.

Keywords: ${keyword}

Content summary:
${excerpt}...

Rules: 50-60 chars each, include keyword naturally.

Respond with JSON ONLY: {"titles":["...","...","..."]}`;

  const result = await generateJSON(prompt, "gpt-4-turbo");
  if (!result.success) {
    throw new Error("Failed to generate title");
  }
  const titles = (result.data as { titles?: string[] })?.titles;
  if (titles?.[0]) return titles[0];
  throw new Error("No titles in response");
}
