import { NextResponse } from "next/server";
import { BadRequestError } from "@/lib/api/errors";
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

/** Hard upper limit on IDs per request to prevent abuse / runaway queries */
const MAX_BATCH_SIZE = 100;

/**
 * Pre-compute a map of { mediaId → usageCount } for all requested IDs in a
 * single pass over each collection. O(collections) not O(ids × collections).
 */
async function buildUsageMap(
  payload: ReturnType<typeof getPayloadSingleton> extends Promise<infer T> ? T : never,
  requestedIds: Set<string>,
  idToUrl: Map<string, string>
): Promise<Map<string, number>> {
  const usageCount = new Map<string, number>();

  // ── Posts: heroImage (relationship) ───────────────────────────────────────
  const heroPosts = await fetchAll<Record<string, unknown>>(payload, "posts", {
    where: { heroImage: { in: Array.from(requestedIds) } },
    depth: 0,
  });
  for (const p of heroPosts) {
    const ref = p.heroImage;
    const refId = ref && typeof ref === "object" && "id" in (ref as object)
      ? String((ref as { id: string | number }).id)
      : String(ref);
    if (requestedIds.has(refId)) {
      usageCount.set(refId, (usageCount.get(refId) ?? 0) + 1);
    }
  }

  // ── Posts: meta.image (relationship) ──────────────────────────────────────
  const metaPosts = await fetchAll<Record<string, unknown>>(payload, "posts", {
    where: { "meta.image": { in: Array.from(requestedIds) } },
    depth: 0,
  });
  for (const p of metaPosts) {
    const ref = (p.meta as { image?: unknown } | undefined)?.image;
    const refId = ref && typeof ref === "object" && "id" in (ref as object)
      ? String((ref as { id: string | number }).id)
      : String(ref ?? "");
    if (requestedIds.has(refId)) {
      usageCount.set(refId, (usageCount.get(refId) ?? 0) + 1);
    }
  }

  // ── Posts: free-text body fields (blocksData, wordpressHtml, content) ─────
  // Fetch all posts once and scan their body text for any of the requested media URLs.
  const allPosts = await fetchAll<Record<string, unknown>>(payload, "posts", { depth: 0 });
  const idToUrlEntries = Array.from(idToUrl.entries());

  for (const p of allPosts) {
    const freeText = postFreeText(p);
    if (!freeText) continue;
    for (const [mediaId, relUrl] of idToUrlEntries) {
      if (!relUrl) continue;
      const variants = mediaUrlVariants(relUrl, APP_URL, R2_PUBLIC_URL);
      if (textContainsMediaUrl(freeText, variants)) {
        usageCount.set(mediaId, (usageCount.get(mediaId) ?? 0) + 1);
      }
    }
  }

  // ── Products: images[].image ──────────────────────────────────────────────
  const allProducts = await fetchAll<Record<string, unknown>>(payload, "products", { depth: 1 });
  for (const prod of allProducts) {
    const images = (prod.images as Array<{ image?: { id?: string | number } | string | number }>) ?? [];
    const seen = new Set<string>();
    for (const img of images) {
      if (!img.image) continue;
      const refId = typeof img.image === "object" && img.image !== null && "id" in img.image
        ? String((img.image as { id: string | number }).id)
        : String(img.image);
      if (requestedIds.has(refId) && !seen.has(refId)) {
        seen.add(refId);
        usageCount.set(refId, (usageCount.get(refId) ?? 0) + 1);
      }
    }
  }

  // ── Pages: URL fields + blocksData + content ──────────────────────────────
  const allPages = await fetchAll<Record<string, unknown>>(payload, "pages", { depth: 0 });

  // Build lookup: normalized relative URL → media id
  const urlToId = new Map<string, string>();
  Array.from(idToUrl.entries()).forEach(([mediaId, relUrl]) => {
    if (relUrl) urlToId.set(relUrl, mediaId);
  });

  for (const pg of allPages) {
    const seenOnPage = new Set<string>();

    const checkUrlField = (value: unknown) => {
      if (!value) return;
      const norm = normalizeMediaUrl(String(value));
      const mediaId = urlToId.get(norm);
      if (mediaId && !seenOnPage.has(mediaId)) {
        seenOnPage.add(mediaId);
        usageCount.set(mediaId, (usageCount.get(mediaId) ?? 0) + 1);
      }
    };

    checkUrlField(pg.featuredImage);
    checkUrlField(pg.ogImage);
    checkUrlField(pg.twitterImage);

    // Free-text scan: blocksData, content, customHeadScripts, customFooterScripts
    const pageText = pageFreeText(pg);
    for (const [mediaId, relUrl] of idToUrlEntries) {
      if (!relUrl || seenOnPage.has(mediaId)) continue;
      const variants = mediaUrlVariants(relUrl, APP_URL, R2_PUBLIC_URL);
      if (textContainsMediaUrl(pageText, variants)) {
        seenOnPage.add(mediaId);
        usageCount.set(mediaId, (usageCount.get(mediaId) ?? 0) + 1);
      }
    }
  }

  return usageCount;
}

async function handlePOST(request: Request) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN", "EDITOR"]);

  let body: { ids?: (string | number)[] };
  try {
    body = (await request.json()) as { ids?: (string | number)[] };
  } catch {
    throw new BadRequestError("Invalid JSON");
  }

  const ids = Array.isArray(body.ids) ? body.ids : [];
  if (ids.length === 0) throw new BadRequestError("ids array required");
  if (ids.length > MAX_BATCH_SIZE) {
    throw new BadRequestError(
      `Batch size exceeds maximum of ${MAX_BATCH_SIZE}. Split into smaller requests.`
    );
  }

  const payload = await getPayloadSingleton();

  // Fetch all requested media docs in parallel to get their URLs
  const mediaDocs = await Promise.all(
    ids.map((id) =>
      payload.findByID({ collection: "media", id, depth: 0, overrideAccess: true }).catch(() => null)
    )
  );

  // Build id → normalized relative URL map
  const idToUrl = new Map<string, string>();
  for (let i = 0; i < ids.length; i++) {
    const doc = mediaDocs[i];
    const rawUrl = doc ? String((doc as { url?: string }).url ?? "") : "";
    idToUrl.set(String(ids[i]), normalizeMediaUrl(rawUrl));
  }

  const requestedIds = new Set(ids.map(String));

  // Pre-compute usage for all IDs in a single pass over each collection
  const usageMap = await buildUsageMap(payload, requestedIds, idToUrl);

  let deletedCount = 0;
  const failedIds: (string | number)[] = [];
  const blockedIds: { id: string | number; reason: string }[] = [];

  for (const id of ids) {
    const count = usageMap.get(String(id)) ?? 0;
    if (count > 0) {
      blockedIds.push({
        id,
        reason: `Used in ${count} place${count !== 1 ? "s" : ""}`,
      });
      continue;
    }
    try {
      await payload.delete({ collection: "media", id, overrideAccess: true });
      deletedCount++;
    } catch {
      failedIds.push(id);
    }
  }

  return NextResponse.json(jsonSuccess({ deletedCount, failedIds, blockedIds }));
}

export const POST = withErrorHandling(handlePOST);
