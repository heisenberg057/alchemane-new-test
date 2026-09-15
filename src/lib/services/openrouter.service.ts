/**
 * OpenRouter chat/completions — behavior aligned with backend openrouter.service.js
 */

import { getEnv } from "@/lib/env";
import { logger } from "@/lib/logger";

const API_BASE = "https://openrouter.ai/api/v1";

const MODELS: Record<string, string> = {
  "claude-3-sonnet": "anthropic/claude-3.5-sonnet",
  "gpt-4o": "openai/gpt-4o-mini",
  "perplexity-deep": "anthropic/claude-3.5-sonnet:online",
  "grok-fast": "x-ai/grok-4.1-fast",
  "gemini-flash": "google/gemini-2.0-flash-exp:free",
  "step-flash": "stepfun/step-3.5-flash",
  liquid: "liquid/lfm2-8b-a1b",
  "claude-sonnet-4.5": "anthropic/claude-sonnet-4.5",
  "gemini-pro": "google/gemini-2.0-pro-exp-02-05:free",
  "gemini-flash-lite": "google/gemini-2.0-flash-lite-preview-02-05:free",
};

function headers(): Record<string, string> {
  let apiKey: string | undefined;
  try {
    apiKey = getEnv().OPENROUTER_API_KEY;
  } catch {
    apiKey = process.env.OPENROUTER_API_KEY;
  }
  const referer =
    process.env.NEXT_PUBLIC_APP_URL || "https://americanhairline.com";
  const h: Record<string, string> = {
    "Content-Type": "application/json",
    "HTTP-Referer": referer,
    "X-Title": "AmericanHairline SEO Optimizer",
  };
  if (apiKey) {
    h.Authorization = `Bearer ${apiKey}`;
  }
  return h;
}

function generateMockResponse(prompt: string): {
  success: true;
  content: string;
  model: string;
  usage: { total_tokens: number };
} {
  const isJson = prompt.includes("Respond with JSON ONLY");
  if (isJson) {
    if (prompt.includes("FAQ pairs")) {
      return {
        success: true,
        content: JSON.stringify({
          faqs: [
            {
              question: "What is the main benefit of this treatment?",
              answer:
                "The main benefit is natural-looking results with minimal downtime.",
              keywords: ["benefit", "results"],
            },
            {
              question: "How long does recovery take?",
              answer: "Most patients resume normal activities within a few days.",
              keywords: ["recovery"],
            },
          ],
        }),
        model: "mock-model",
        usage: { total_tokens: 0 },
      };
    }
    if (prompt.includes("direct, quotable answers")) {
      return {
        success: true,
        content: JSON.stringify({
          answers: [
            {
              question: "What is hair restoration?",
              answer: "Hair restoration includes surgical and non-surgical options.",
              confidence: 0.95,
            },
          ],
        }),
        model: "mock-model",
        usage: { total_tokens: 0 },
      };
    }
    if (prompt.includes("key takeaways")) {
      return {
        success: true,
        content: JSON.stringify({
          takeaways: [
            "Modern hair systems are highly natural-looking.",
            "Consultation helps match the right approach.",
          ],
        }),
        model: "mock-model",
        usage: { total_tokens: 0 },
      };
    }
    if (prompt.includes("conversational/voice search optimization")) {
      return {
        success: true,
        content: JSON.stringify({
          conversationalScore: 0.85,
          questionHeadings: 3,
          directAnswers: 4,
          averageSentenceLength: 16,
          suggestions: [
            "Add question-style H2s where they fit the content.",
            "Use shorter paragraphs for skimmability.",
          ],
        }),
        model: "mock-model",
        usage: { total_tokens: 0 },
      };
    }
    if (prompt.includes("Generate 3 SEO-optimized title variations")) {
      return {
        success: true,
        content: JSON.stringify({
          titles: [
            "Hair Restoration Guide: What to Know in 2026",
            "5 Facts About Hair Transplants and Systems",
            "Choosing the Right Hair Loss Solution",
          ],
        }),
        model: "mock-model",
        usage: { total_tokens: 0 },
      };
    }
  }
  return {
    success: true,
    content:
      "Mock OpenRouter response — set OPENROUTER_API_KEY for live AI output.",
    model: "mock-model",
    usage: { total_tokens: 0 },
  };
}

export async function generateCompletion(
  prompt: string,
  model = "claude-3-sonnet",
  options: {
    temperature?: number;
    maxTokens?: number;
    online?: boolean;
    isFallback?: boolean;
  } = {}
): Promise<
  | { success: true; content: string; model: string; usage?: { total_tokens?: number } }
  | { success: false; error: string }
> {
  let apiKey: string | undefined;
  try {
    apiKey = getEnv().OPENROUTER_API_KEY;
  } catch {
    apiKey = process.env.OPENROUTER_API_KEY;
  }
  if (!apiKey || apiKey.includes("placeholder")) {
    if (process.env.NODE_ENV === "test") {
      return generateMockResponse(prompt);
    }
    logger.error("OpenRouter API key not configured");
    return { success: false, error: "OpenRouter API key not configured. Set OPENROUTER_API_KEY in environment variables." };
  }

  const isOnline = model.includes(":online") || options.online;
  const modelId = isOnline
    ? model.replace(":online", "")
    : MODELS[model] || model;

  const plugins = isOnline ? [{ id: "web", max_results: 5 }] : undefined;

  const body = {
    model: modelId,
    messages: [{ role: "user", content: prompt }],
    plugins,
    temperature: options.temperature ?? 0.7,
    max_tokens: options.maxTokens ?? 2000,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  };

  try {
    logger.info("OpenRouter request", { model: modelId, online: !!isOnline });
    const res = await fetch(`${API_BASE}/chat/completions`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(body),
    });
    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
      model?: string;
      usage?: { total_tokens?: number };
      error?: { message?: string };
    };

    if (!res.ok) {
      throw new Error(data.error?.message || res.statusText);
    }

    const content = data.choices?.[0]?.message?.content ?? "";
    return {
      success: true,
      content,
      model: data.model || modelId,
      usage: data.usage,
    };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    logger.error("OpenRouter error", { model, error: msg });
    if (model !== "gpt-4o" && !options.isFallback) {
      logger.warn("Falling back to gpt-4o");
      return generateCompletion(prompt, "gpt-4o", {
        ...options,
        isFallback: true,
      });
    }
    return { success: false, error: msg };
  }
}

export async function generateJSON(
  prompt: string,
  model = "gpt-4-turbo",
  schema: unknown = null
): Promise<
  | { success: true; data: unknown; usage?: { total_tokens?: number } }
  | { success: false; error: string; raw?: string }
> {
  const systemPrompt = schema
    ? `You are a helpful assistant that responds ONLY with valid JSON matching this schema: ${JSON.stringify(
        schema
      )}`
    : "You are a helpful assistant that responds ONLY with valid JSON. No markdown, no explanation, just JSON.";

  const fullPrompt = `${systemPrompt}\n\n${prompt}`;
  const result = await generateCompletion(fullPrompt, model, {
    temperature: 0.3,
  });

  if (!result.success) {
    return result;
  }

  try {
    let jsonString = result.content.trim();
    jsonString = jsonString.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    const parsed = JSON.parse(jsonString);
    return { success: true, data: parsed, usage: result.usage };
  } catch {
    return {
      success: false,
      error: "Failed to parse JSON response",
      raw: result.content,
    };
  }
}

export async function testCitation(
  query: string,
  contentSnippet: string,
  model = "gpt-4-turbo"
): Promise<
  | {
      success: true;
      query: string;
      response: string;
      cited: boolean;
      confidence: number;
      context: string | null;
      model?: string;
    }
  | { success: false; error: string }
> {
  const prompt = `Answer this question using your knowledge: "${query}"

Context to consider (if relevant and accurate):
${contentSnippet}

Provide a comprehensive answer. If you use information from the context, indicate that clearly.`;

  const result = await generateCompletion(prompt, model, {
    temperature: 0.5,
    maxTokens: 1000,
  });

  if (!result.success) {
    return result;
  }

  const cited = detectCitation(result.content.toLowerCase(), contentSnippet);
  return {
    success: true,
    query,
    response: result.content,
    cited: cited.wasCited,
    confidence: cited.confidence,
    context: cited.context,
    model: result.model,
  };
}

function detectCitation(
  response: string,
  originalContent: string
): {
  wasCited: boolean;
  confidence: number;
  context: string | null;
} {
  const originalLower = originalContent.toLowerCase();
  const phrases = extractKeyPhrases(originalLower);
  let matchCount = 0;
  const matches: string[] = [];
  for (const phrase of phrases) {
    if (response.includes(phrase)) {
      matchCount++;
      matches.push(phrase);
    }
  }
  const confidence =
    phrases.length > 0 ? Math.min(matchCount / phrases.length, 1) : 0;
  const wasCited = confidence > 0.3;
  let context: string | null = null;
  if (matches.length > 0) {
    const idx = response.indexOf(matches[0]!);
    const start = Math.max(0, idx - 50);
    const end = Math.min(response.length, idx + matches[0]!.length + 50);
    context = "..." + response.substring(start, end) + "...";
  }
  return { wasCited, confidence, context };
}

function extractKeyPhrases(text: string): string[] {
  const words = text.replace(/[^\w\s]/g, " ").split(/\s+/);
  const phrases: string[] = [];
  for (let i = 0; i <= words.length - 5; i++) {
    const phrase = words.slice(i, i + 5).join(" ");
    if (phrase.length > 20) {
      phrases.push(phrase);
    }
  }
  return phrases.filter((_, index) => index % 3 === 0);
}
