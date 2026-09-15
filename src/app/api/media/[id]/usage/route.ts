import { NextResponse } from "next/server";
import { NotFoundError } from "@/lib/api/errors";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { jsonSuccess } from "@/lib/api/response";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";
import {
  fetchAll,
  normalizeMediaUrl,
  mediaUrlVariants,
  textContainsMediaUrl,
  postFreeText,
  pageFreeText,
} from "@/lib/api/payloadUtils";

type UsagePost = { id: string | number; title: string; slug: string; field: string };
type UsageProduct = { id: string | number; name: string; slug: string };
type UsagePage = { id: string | number; title: string; slug: string; field: string };

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "";
const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL ?? "";

async function handleGET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN", "EDITOR"]);
  const { id } = await context.params;
  const payload = await getPayloadSingleton();

  const found = await payload.findByID({
    collection: "media",
    id,
    depth: 0,
    overrideAccess: true,
  });
  if (!found) {
    throw new NotFoundError("Media not found");
  }

  const rawMediaUrl = String((found as { url?: string }).url ?? "");
  const relativeMediaUrl = normalizeMediaUrl(rawMediaUrl);
  // Build all URL forms that this media item may appear as in free-text content.
  const urlVariants = mediaUrlVariants(relativeMediaUrl, APP_URL, R2_PUBLIC_URL);

  const posts: UsagePost[] = [];
  const products: UsageProduct[] = [];
  const pages: UsagePage[] = [];
  const seenPostIds = new Set<string>();
  const seenPageIds = new Set<string>();

  // ── 1. posts.heroImage (relationship field — query by ID) ─────────────────
  const heroResults = await fetchAll<Record<string, unknown>>(payload, "posts", {
    where: { heroImage: { equals: id } },
    depth: 0,
  });
  for (const p of heroResults) {
    const pid = String(p.id);
    if (!seenPostIds.has(pid)) {
      seenPostIds.add(pid);
      posts.push({
        id: p.id as string | number,
        title: String((p.title as string | undefined) || "Untitled"),
        slug: String((p.slug as string | undefined) || ""),
        field: "heroImage",
      });
    }
  }

  // ── 2. posts.meta.image (relationship field — query by ID) ────────────────
  const metaImageResults = await fetchAll<Record<string, unknown>>(payload, "posts", {
    where: { "meta.image": { equals: id } },
    depth: 0,
  });
  for (const p of metaImageResults) {
    const pid = String(p.id);
    if (!seenPostIds.has(pid)) {
      seenPostIds.add(pid);
      posts.push({
        id: p.id as string | number,
        title: String((p.title as string | undefined) || "Untitled"),
        slug: String((p.slug as string | undefined) || ""),
        field: "meta.image",
      });
    } else {
      const existing = posts.find((x) => String(x.id) === pid);
      if (existing && !existing.field.includes("meta.image")) {
        existing.field = existing.field + ", meta.image";
      }
    }
  }

  // ── 3. posts free-text fields: blocksData / wordpressHtml / content ────────
  // Fetch all posts (depth:0 to get raw Lexical JSON for content) and scan their
  // free-text fields for any URL variant of this media item.
  if (relativeMediaUrl) {
    const allPosts = await fetchAll<Record<string, unknown>>(payload, "posts", { depth: 0 });
    for (const p of allPosts) {
      const pid = String(p.id);
      if (seenPostIds.has(pid)) continue; // already found via relationship fields

      const freeText = postFreeText(p);
      if (!textContainsMediaUrl(freeText, urlVariants)) continue;

      // Identify which specific field(s) contain the URL
      const matchedFields: string[] = [];
      if (p.blocksData && textContainsMediaUrl(String(p.blocksData), urlVariants)) {
        matchedFields.push("blocksData");
      }
      if (p.wordpressHtml && textContainsMediaUrl(String(p.wordpressHtml), urlVariants)) {
        matchedFields.push("wordpressHtml");
      }
      if (p.content != null) {
        const contentStr = typeof p.content === "string" ? p.content : JSON.stringify(p.content);
        if (textContainsMediaUrl(contentStr, urlVariants)) matchedFields.push("content");
      }

      if (matchedFields.length > 0) {
        seenPostIds.add(pid);
        posts.push({
          id: p.id as string | number,
          title: String((p.title as string | undefined) || "Untitled"),
          slug: String((p.slug as string | undefined) || ""),
          field: matchedFields.join(", "),
        });
      }
    }
  }

  // ── 4. products.images[].image (relationship array) ───────────────────────
  const allProducts = await fetchAll<Record<string, unknown>>(payload, "products", { depth: 1 });
  for (const prod of allProducts) {
    const images = (prod.images as Array<{ image?: { id?: string | number } | string | number }>) ?? [];
    const usedHere = images.some((img) => {
      if (!img.image) return false;
      if (typeof img.image === "object" && img.image !== null && "id" in img.image) {
        return String(img.image.id) === String(id);
      }
      return String(img.image) === String(id);
    });
    if (usedHere) {
      products.push({
        id: prod.id as string | number,
        name: String((prod.name as string | undefined) || "Unnamed"),
        slug: String((prod.slug as string | undefined) || ""),
      });
    }
  }

  // ── 5. pages — URL fields + all free-text fields (incl. script injections) ─
  if (relativeMediaUrl) {
    const allPages = await fetchAll<Record<string, unknown>>(payload, "pages", { depth: 0 });

    for (const pg of allPages) {
      const pgid = String(pg.id);
      if (seenPageIds.has(pgid)) continue;

      const matchedFields: string[] = [];

      if (pg.featuredImage && normalizeMediaUrl(String(pg.featuredImage)) === relativeMediaUrl) {
        matchedFields.push("featuredImage");
      }
      if (pg.ogImage && normalizeMediaUrl(String(pg.ogImage)) === relativeMediaUrl) {
        matchedFields.push("ogImage");
      }
      if (pg.twitterImage && normalizeMediaUrl(String(pg.twitterImage)) === relativeMediaUrl) {
        matchedFields.push("twitterImage");
      }
      if (textContainsMediaUrl(String(pg.blocksData ?? ""), urlVariants)) {
        matchedFields.push("blocksData");
      }
      if (textContainsMediaUrl(String(pg.content ?? ""), urlVariants)) {
        matchedFields.push("content");
      }
      if (textContainsMediaUrl(String(pg.customHeadScripts ?? ""), urlVariants)) {
        matchedFields.push("customHeadScripts");
      }
      if (textContainsMediaUrl(String(pg.customFooterScripts ?? ""), urlVariants)) {
        matchedFields.push("customFooterScripts");
      }

      if (matchedFields.length > 0) {
        seenPageIds.add(pgid);
        pages.push({
          id: pg.id as string | number,
          title: String((pg.title as string | undefined) || "Untitled"),
          slug: String((pg.slug as string | undefined) || ""),
          field: matchedFields.join(", "),
        });
      }
    }
  }

  const totalCount = posts.length + products.length + pages.length;

  return NextResponse.json(jsonSuccess({ posts, products, pages, totalCount }));
}

export const GET = withErrorHandling(handleGET);
