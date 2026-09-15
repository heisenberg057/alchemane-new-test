import { NextResponse } from "next/server";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { jsonSuccess } from "@/lib/api/response";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";
import { fetchAll, normalizeMediaUrl, mediaUrlVariants, textContainsMediaUrl, postFreeText, pageFreeText } from "@/lib/api/payloadUtils";

/**
 * Returns media items not referenced in any scanned location:
 *   - posts.heroImage
 *   - posts.meta.image
 *   - posts.blocksData / wordpressHtml / content (free-text / Lexical JSON)
 *   - products.images[].image
 *   - pages.featuredImage / ogImage / twitterImage (URL string fields)
 *   - pages.blocksData / content / customHeadScripts / customFooterScripts (text scan)
 *
 * URL normalization: relative, APP_URL-absolute, and R2-absolute forms are all detected.
 * Scan is capped at 5,000 total media items. If exceeded, `truncated: true`
 * is set in the response and the note explains the limitation.
 */

const MEDIA_SCAN_CAP = 5_000;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "";
const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL ?? "";

async function handleGET(request: Request) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN", "EDITOR"]);
  const payload = await getPayloadSingleton();

  // Keys in this Set are normalized relative URLs (e.g. "/media/file.jpg")
  // and also raw media IDs (as strings) for reference-type fields.
  const usedUrls = new Set<string>();  // normalized relative URLs from page URL fields
  const usedIds = new Set<string>();   // media IDs referenced by posts/products

  // ── 1. Posts: heroImage + meta.image + free-text body fields ─────────────
  // Fetch all posts once — reuse for both relationship fields and free-text scan.
  const posts = await fetchAll<Record<string, unknown>>(payload, "posts", { depth: 0 });

  // Collect all post free-text into a single string for per-media substring scan
  const allPostText = posts.map((p) => postFreeText(p)).join("\n");

  for (const p of posts) {
    const heroImage = p.heroImage;
    if (heroImage != null) {
      if (typeof heroImage === "object" && "id" in (heroImage as object)) {
        usedIds.add(String((heroImage as { id: string | number }).id));
      } else {
        usedIds.add(String(heroImage));
      }
    }
    const metaImage = (p.meta as { image?: unknown } | undefined)?.image;
    if (metaImage != null) {
      if (typeof metaImage === "object" && "id" in (metaImage as object)) {
        usedIds.add(String((metaImage as { id: string | number }).id));
      } else {
        usedIds.add(String(metaImage));
      }
    }
  }

  // ── 2. Products: images[].image ───────────────────────────────────────────
  const products = await fetchAll<Record<string, unknown>>(payload, "products", { depth: 1 });
  for (const prod of products) {
    const images = (prod.images as Array<{ image?: unknown }>) ?? [];
    for (const img of images) {
      const imgRef = img.image;
      if (imgRef == null) continue;
      if (typeof imgRef === "object" && "id" in (imgRef as object)) {
        usedIds.add(String((imgRef as { id: string | number }).id));
      } else {
        usedIds.add(String(imgRef));
      }
    }
  }

  // ── 3. Pages: URL fields + blocksData + content ───────────────────────────
  // We collect all used normalized relative URLs, and then for block content we
  // defer the scan to the media filtering step (to avoid re-fetching pages).
  const allPages = await fetchAll<Record<string, unknown>>(payload, "pages", { depth: 0 });

  for (const pg of allPages) {
    if (pg.featuredImage) usedUrls.add(normalizeMediaUrl(String(pg.featuredImage)));
    if (pg.ogImage) usedUrls.add(normalizeMediaUrl(String(pg.ogImage)));
    if (pg.twitterImage) usedUrls.add(normalizeMediaUrl(String(pg.twitterImage)));
  }

  // Concatenate all page free-text (incl. script injection fields) for per-media substring scan
  const allPageText = allPages.map((pg) => pageFreeText(pg)).join("\n");

  // ── 4. Fetch media up to cap ──────────────────────────────────────────────
  const firstPage = await payload.find({
    collection: "media",
    limit: MEDIA_SCAN_CAP,
    page: 1,
    sort: "-createdAt",
    depth: 0,
    overrideAccess: true,
  });

  const truncated = firstPage.totalDocs > MEDIA_SCAN_CAP;

  const unused = firstPage.docs.filter((m) => {
    const mediaId = String(m.id);

    // Check ID-based references (posts / products)
    if (usedIds.has(mediaId)) return false;

    // Check URL-based references (page URL fields)
    const rawUrl = String((m as { url?: string }).url ?? "");
    const relUrl = normalizeMediaUrl(rawUrl);
    if (relUrl && usedUrls.has(relUrl)) return false;

    // Check block/content text references (relative, APP_URL, and R2 URL forms)
    if (relUrl) {
      const variants = mediaUrlVariants(relUrl, APP_URL, R2_PUBLIC_URL);
      if (textContainsMediaUrl(allPostText, variants)) return false;
      if (textContainsMediaUrl(allPageText, variants)) return false;
    }

    return true;
  });

  return NextResponse.json(
    jsonSuccess({
      media: unused,
      truncated,
      scannedFields: [
        "posts.heroImage",
        "posts.meta.image",
        "posts.blocksData (text scan)",
        "posts.wordpressHtml (text scan)",
        "posts.content (text scan)",
        "products.images[].image",
        "pages.featuredImage",
        "pages.ogImage",
        "pages.twitterImage",
        "pages.blocksData (text scan)",
        "pages.content (text scan)",
        "pages.customHeadScripts (text scan)",
        "pages.customFooterScripts (text scan)",
      ],
      note: truncated
        ? `Media library exceeds ${MEDIA_SCAN_CAP} items — only the first ${MEDIA_SCAN_CAP} were scanned. Verify before bulk-deleting.`
        : "All known reference locations are scanned. Verify before bulk-deleting.",
      meta: {
        total: unused.length,
        page: 1,
        limit: unused.length,
        pages: 1,
      },
    })
  );
}

export const GET = withErrorHandling(handleGET);
