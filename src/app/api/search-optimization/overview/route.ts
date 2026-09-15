import { NextResponse } from "next/server";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { jsonSuccess } from "@/lib/api/response";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";
import {
  hasEffectivePageMetaDescription,
  hasEffectivePageMetaTitle,
  hasEffectivePostMetaDescription,
  hasEffectivePostMetaTitle,
} from "@/lib/seo/effectiveMeta";

export type ContentScope = "posts" | "pages" | "all";

const POSTS_PUBLISHED = { _status: { equals: "published" as const } };
const PAGES_PUBLISHED = { status: { equals: "PUBLISHED" as const } };

/** 60-second per-scope in-memory cache to avoid a full table-scan on every dashboard load */
type OverviewCache = {
  data: Record<string, unknown>;
  expiresAt: number;
};
const overviewCache: Record<ContentScope, OverviewCache | null> = {
  posts: null,
  pages: null,
  all: null,
};

function postRel(
  post: unknown
): { id: string; title: string; slug: string } | null {
  if (post == null) return null;
  if (typeof post === "object" && "id" in post) {
    const p = post as { id: unknown; title?: unknown; slug?: unknown };
    return {
      id: String(p.id),
      title: typeof p.title === "string" ? p.title : String(p.title ?? ""),
      slug: typeof p.slug === "string" ? p.slug : String(p.slug ?? ""),
    };
  }
  return null;
}

function formatAnalyzedAt(v: unknown): string | null {
  if (v == null) return null;
  if (v instanceof Date) return v.toISOString();
  if (typeof v === "string") return v;
  return null;
}

type PostSeoSummaryRow = {
  id: string;
  title: string;
  slug: string;
  score: number;
  analyzedAt: string | null;
};

async function summarizePostSeoFromPosts(
  payload: Awaited<ReturnType<typeof import("@/lib/api/getPayload").getPayloadSingleton>>
): Promise<{
  analyzedPosts: number;
  averageScore: number;
  postsNeedingAttention: PostSeoSummaryRow[];
  recentAnalyses: PostSeoSummaryRow[];
}> {
  const pageSize = 200;
  let page = 1;
  let analyzedPosts = 0;
  let scoreSum = 0;
  const lowScore: PostSeoSummaryRow[] = [];
  const recent: PostSeoSummaryRow[] = [];

  for (;;) {
    const batch = await payload.find({
      collection: "posts",
      where: POSTS_PUBLISHED,
      limit: pageSize,
      page,
      depth: 0,
      overrideAccess: true,
    });

    for (const raw of batch.docs as Record<string, unknown>[]) {
      const seo = (raw.seoAnalysis ?? null) as Record<string, unknown> | null;
      const score = typeof seo?.seoScore === "number" ? seo.seoScore : null;
      if (score == null || Number.isNaN(score)) continue;

      analyzedPosts += 1;
      scoreSum += score;

      const row: PostSeoSummaryRow = {
        id: String(raw.id ?? ""),
        title: String(raw.title ?? ""),
        slug: String(raw.slug ?? ""),
        score,
        analyzedAt: formatAnalyzedAt(raw.updatedAt ?? raw.createdAt),
      };

      if (score < 50) lowScore.push(row);
      recent.push(row);
    }

    if (!batch.hasNextPage) break;
    page += 1;
  }

  lowScore.sort((a, b) => a.score - b.score);
  recent.sort((a, b) => {
    const aTime = a.analyzedAt ? new Date(a.analyzedAt).getTime() : 0;
    const bTime = b.analyzedAt ? new Date(b.analyzedAt).getTime() : 0;
    return bTime - aTime;
  });

  return {
    analyzedPosts,
    averageScore: analyzedPosts > 0 ? Math.round((scoreSum / analyzedPosts) * 100) / 100 : 0,
    postsNeedingAttention: lowScore.slice(0, 10),
    recentAnalyses: recent.slice(0, 10),
  };
}

/** Count published items for the requested scope */
async function countPublished(
  payload: Awaited<ReturnType<typeof import("@/lib/api/getPayload").getPayloadSingleton>>,
  scope: ContentScope
): Promise<{ posts: number; pages: number }> {
  const [postsRes, pagesRes] = await Promise.all([
    scope !== "pages"
      ? payload.find({ collection: "posts", where: POSTS_PUBLISHED, limit: 1, depth: 0, overrideAccess: true })
      : Promise.resolve({ totalDocs: 0 }),
    scope !== "posts"
      ? payload.find({ collection: "pages", where: PAGES_PUBLISHED, limit: 1, depth: 0, overrideAccess: true })
      : Promise.resolve({ totalDocs: 0 }),
  ]);
  return { posts: postsRes.totalDocs, pages: pagesRes.totalDocs };
}

/** Count published items missing effective SEO title/meta description for a given scope. */
async function countMissingMeta(
  payload: Awaited<ReturnType<typeof import("@/lib/api/getPayload").getPayloadSingleton>>,
  scope: ContentScope
): Promise<{ missingMetaTitle: number; missingMetaDescription: number }> {
  let postsMissingTitle = 0;
  let postsMissingDesc = 0;
  let pagesMissingTitle = 0;
  let pagesMissingDesc = 0;

  if (scope !== "pages") {
    const pageSize = 200;
    let page = 1;
    for (;;) {
      const batch = await payload.find({
        collection: "posts",
        where: POSTS_PUBLISHED,
        limit: pageSize,
        page,
        depth: 0,
        overrideAccess: true,
      });
      for (const doc of batch.docs as Record<string, unknown>[]) {
        if (!hasEffectivePostMetaTitle(doc)) postsMissingTitle += 1;
        if (!hasEffectivePostMetaDescription(doc)) postsMissingDesc += 1;
      }
      if (!batch.hasNextPage) break;
      page += 1;
    }
  }

  if (scope !== "posts") {
    const pageSize = 200;
    let page = 1;
    for (;;) {
      const batch = await payload.find({
        collection: "pages",
        where: PAGES_PUBLISHED,
        limit: pageSize,
        page,
        depth: 0,
        overrideAccess: true,
      });
      for (const doc of batch.docs as Record<string, unknown>[]) {
        if (!hasEffectivePageMetaTitle(doc)) pagesMissingTitle += 1;
        if (!hasEffectivePageMetaDescription(doc)) pagesMissingDesc += 1;
      }
      if (!batch.hasNextPage) break;
      page += 1;
    }
  }

  return {
    missingMetaTitle: postsMissingTitle + pagesMissingTitle,
    missingMetaDescription: postsMissingDesc + pagesMissingDesc,
  };
}

async function handleGET(request: Request) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);

  const url = new URL(request.url);
  const scopeParam = url.searchParams.get("contentType") ?? "posts";
  const scope: ContentScope =
    scopeParam === "pages" ? "pages" : scopeParam === "all" ? "all" : "posts";

  // Serve from cache if still fresh
  const cached = overviewCache[scope];
  if (cached && Date.now() < cached.expiresAt) {
    return NextResponse.json(jsonSuccess(cached.data, "SEO overview"));
  }

  const payload = await getPayloadSingleton();

  const [{ posts: publishedPosts, pages: publishedPages }, missingMeta] = await Promise.all([
    countPublished(payload, scope),
    countMissingMeta(payload, scope),
  ]);
  const publishedTotal = publishedPosts + publishedPages;
  let analyzedPosts = 0;
  let averageScore = 0;
  let postsNeedingAttention: {
    id: string;
    title: string;
    slug: string;
    score: number;
    analyzedAt: string | null;
  }[] = [];
  let recentAnalyses: {
    id: string;
    postTitle: string;
    postSlug: string;
    score: number;
    analyzedAt: string | null;
  }[] = [];

  // Detailed SEO analysis data currently exists only for posts. Non-post scopes
  // are intentionally metadata-only views to avoid mixing page counts with post-only analysis.
  if (scope === "posts") {
    const pageSize = 500;
    let page = 1;
    const distinctPostIds = new Set<string>();
    let scoreSum = 0;
    let analysisDocs = 0;

    for (;;) {
      const batch = await payload.find({
        collection: "seo-analyses",
        limit: pageSize,
        page,
        depth: 0,
        overrideAccess: true,
      });
      for (const doc of batch.docs) {
        analysisDocs += 1;
        const s = doc.score;
        if (typeof s === "number" && !Number.isNaN(s)) {
          scoreSum += s;
        }
        const pid = doc.post;
        const id =
          typeof pid === "object" && pid !== null && "id" in pid
            ? String((pid as { id: unknown }).id)
            : String(pid ?? "");
        if (id) distinctPostIds.add(id);
      }
      if (!batch.hasNextPage) break;
      page += 1;
    }

    analyzedPosts =
      distinctPostIds.size;
    averageScore =
      analysisDocs > 0
        ? Math.round((scoreSum / analysisDocs) * 100) / 100
        : 0;

    const lowScoreRes = await payload.find({
      collection: "seo-analyses",
      where: { score: { less_than: 50 } },
      sort: "score",
      limit: 80,
      depth: 1,
      overrideAccess: true,
    });

    const seenPosts = new Set<string>();

    for (const doc of lowScoreRes.docs) {
      const p = postRel(doc.post);
      if (!p || seenPosts.has(p.id)) continue;
      seenPosts.add(p.id);
      postsNeedingAttention.push({
        id: p.id,
        title: p.title,
        slug: p.slug,
        score: typeof doc.score === "number" ? doc.score : 0,
        analyzedAt: formatAnalyzedAt(doc.analyzedAt),
      });
      if (postsNeedingAttention.length >= 10) break;
    }

    const recentRes = await payload.find({
      collection: "seo-analyses",
      sort: "-analyzedAt",
      limit: 10,
      depth: 1,
      overrideAccess: true,
    });

    recentAnalyses = recentRes.docs.map((doc) => {
      const p = postRel(doc.post);
      return {
        id: String(doc.id),
        postTitle: p?.title ?? "",
        postSlug: p?.slug ?? "",
        score: typeof doc.score === "number" ? doc.score : 0,
        analyzedAt: formatAnalyzedAt(doc.analyzedAt),
      };
    });

    if (analyzedPosts === 0) {
      const fallback = await summarizePostSeoFromPosts(payload);
      analyzedPosts = fallback.analyzedPosts;
      averageScore = fallback.averageScore;
      postsNeedingAttention = fallback.postsNeedingAttention.map((row) => ({
        id: row.id,
        title: row.title,
        slug: row.slug,
        score: row.score,
        analyzedAt: row.analyzedAt,
      }));
      recentAnalyses = fallback.recentAnalyses.map((row) => ({
        id: row.id,
        postTitle: row.title,
        postSlug: row.slug,
        score: row.score,
        analyzedAt: row.analyzedAt,
      }));
    }
  }

  const responseData = {
    scope,
    publishedPosts: publishedTotal,
    publishedPostsBreakdown: { posts: publishedPosts, pages: publishedPages },
    analyzedPosts,
    averageScore,
    postsNeedingAttention,
    recentAnalyses,
    missingMetaTitle: missingMeta.missingMetaTitle,
    missingMetaDescription: missingMeta.missingMetaDescription,
  };

  // Store in per-scope cache for 60 seconds
  overviewCache[scope] = { data: responseData, expiresAt: Date.now() + 60_000 };

  return NextResponse.json(jsonSuccess(responseData, "SEO overview"));
}

export const GET = withErrorHandling(handleGET);
