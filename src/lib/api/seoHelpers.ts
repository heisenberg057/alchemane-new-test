const STUB_ISSUES = [
  {
    severity: "info",
    code: "stub",
    message: "Heuristic analysis only — connect Screpy or another SEO provider for real audits.",
  },
];

const STUB_RECOMMENDATIONS = [
  {
    text: "Add a clear focus keyword in the title and H1.",
    priority: "medium",
  },
  {
    text: "Improve internal linking to related posts.",
    priority: "low",
  },
];

export function postPublicPath(slug: string): string {
  const base = (process.env.NEXT_PUBLIC_APP_URL ?? "").replace(/\/$/, "");
  return `${base}/blog/${slug}`;
}

export function buildStubSeoAnalysisPayload(input: {
  postId: number;
  slug: string;
  title?: string | null;
  wordCount?: number | null;
}): Record<string, unknown> {
  const wc = input.wordCount ?? 0;
  const score = Math.min(55 + Math.min(25, Math.floor(wc / 80)), 94);
  return {
    post: input.postId,
    url: postPublicPath(input.slug),
    score,
    issues: STUB_ISSUES,
    recommendations: STUB_RECOMMENDATIONS,
    pageSpeed: null,
    mobileScore: null,
    sslEnabled: true,
    robotsTxt: true,
    sitemap: true,
    titleTag: {
      text: input.title ?? input.slug,
      length: (input.title ?? input.slug).length,
    },
    metaDescription: { ok: false, note: "stub" },
    headings: [],
    images: [],
    internalLinks: 0,
    externalLinks: 0,
    wordCount: wc,
    readability: 70,
    keywordUsage: {},
    schemaTypes: ["Article"],
    schemaValid: true,
    analyzedAt: new Date().toISOString(),
  };
}

export function buildArticleJsonLd(input: {
  slug: string;
  title?: string | null;
  description?: string | null;
}): Record<string, unknown> {
  const url = postPublicPath(input.slug);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title ?? input.slug,
    description: input.description ?? "",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
  };
}
