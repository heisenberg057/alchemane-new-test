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

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "";
const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_R2_PUBLIC_URL ?? "";

async function handleDELETE(
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
  const urlVariants = mediaUrlVariants(relativeMediaUrl, APP_URL, R2_PUBLIC_URL);

  // ── Check relationship fields in parallel ──────────────────────────────────
  const [heroResults, metaResults] = await Promise.all([
    payload.find({
      collection: "posts",
      where: { heroImage: { equals: id } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    }),
    payload.find({
      collection: "posts",
      where: { "meta.image": { equals: id } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    }),
  ]);

  // ── Check post free-text body fields ──────────────────────────────────────
  // Only scan if there are URL variants to search for (i.e. we have a real URL)
  let usedInPostBody = false;
  if (relativeMediaUrl && heroResults.docs.length === 0 && metaResults.docs.length === 0) {
    // Only do the expensive full-scan if relationship lookups came up empty
    const allPosts = await fetchAll<Record<string, unknown>>(payload, "posts", { depth: 0 });
    usedInPostBody = allPosts.some((p) => textContainsMediaUrl(postFreeText(p), urlVariants));
  }

  // ── Check products ─────────────────────────────────────────────────────────
  const allProducts = await fetchAll<Record<string, unknown>>(payload, "products", { depth: 1 });
  const usedInProduct = allProducts.some((prod) => {
    const images = (prod.images as Array<{ image?: { id?: string | number } | string | number }>) ?? [];
    return images.some((img) => {
      if (!img.image) return false;
      if (typeof img.image === "object" && img.image !== null && "id" in img.image) {
        return String(img.image.id) === String(id);
      }
      return String(img.image) === String(id);
    });
  });

  // ── Check pages (URL fields + all free-text incl. script injections) ────────
  let usedInPages = false;
  if (relativeMediaUrl) {
    const allPages = await fetchAll<Record<string, unknown>>(payload, "pages", { depth: 0 });
    usedInPages = allPages.some((pg) => {
      if (pg.featuredImage && normalizeMediaUrl(String(pg.featuredImage)) === relativeMediaUrl) return true;
      if (pg.ogImage && normalizeMediaUrl(String(pg.ogImage)) === relativeMediaUrl) return true;
      if (pg.twitterImage && normalizeMediaUrl(String(pg.twitterImage)) === relativeMediaUrl) return true;
      if (textContainsMediaUrl(pageFreeText(pg), urlVariants)) return true;
      return false;
    });
  }

  const postCount = heroResults.docs.length + metaResults.docs.length;
  const totalUsages =
    postCount +
    (usedInPostBody ? 1 : 0) +
    (usedInProduct ? 1 : 0) +
    (usedInPages ? 1 : 0);

  if (totalUsages > 0) {
    const parts: string[] = [];
    if (postCount > 0) parts.push(`${postCount} post${postCount !== 1 ? "s" : ""} (relationship fields)`);
    if (usedInPostBody) parts.push("1 or more posts (body content)");
    if (usedInProduct) parts.push("1 or more products");
    if (usedInPages) parts.push("1 or more pages");
    return NextResponse.json(
      {
        error: "Image is in use",
        message: `Cannot delete: this image is referenced in ${parts.join(", ")}. Remove those references first.`,
        usageCount: totalUsages,
      },
      { status: 409 }
    );
  }

  await payload.delete({ collection: "media", id, overrideAccess: true });

  return NextResponse.json(jsonSuccess({ id, deleted: true }));
}

export const DELETE = withErrorHandling(handleDELETE);
