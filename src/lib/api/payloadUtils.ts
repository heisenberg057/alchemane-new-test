import type { Payload, Where } from "payload";

/**
 * Fetch all documents from a Payload collection using paginated requests.
 * Avoids silent truncation from hard-coded limit values.
 */
export async function fetchAll<T>(
  payload: Payload,
  collection: string,
  {
    where,
    depth = 0,
    pageSize = 200,
  }: {
    where?: Where;
    depth?: number;
    pageSize?: number;
  } = {}
): Promise<T[]> {
  const results: T[] = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const res = await payload.find({
      collection,
      where,
      limit: pageSize,
      page,
      depth,
      overrideAccess: true,
    });
    results.push(...(res.docs as T[]));
    hasMore = res.hasNextPage ?? false;
    page++;
  }

  return results;
}

/**
 * Normalize a media URL to its relative path form for consistent comparison.
 * Strips the origin (scheme + host) from absolute URLs so that
 * https://cdn.example.com/media/file.jpg → /media/file.jpg
 * /media/file.jpg → /media/file.jpg (unchanged)
 */
export function normalizeMediaUrl(url: string): string {
  if (!url) return "";
  try {
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return new URL(url).pathname;
    }
  } catch {
    // Fall through
  }
  return url;
}

/**
 * Build the full set of URL forms that a given media file can appear as in
 * free-text content (HTML, JSON blobs, etc.).
 *
 * Includes:
 *  - The relative path form (/media/file.jpg)
 *  - Absolute form using NEXT_PUBLIC_APP_URL (the web-server host)
 *  - Absolute form using NEXT_PUBLIC_R2_PUBLIC_URL (the R2/CDN host used in production)
 *
 * The R2 URL format from payload.config.ts is:
 *   `${NEXT_PUBLIC_R2_PUBLIC_URL}/${prefix}/${filename}`
 * Because we only have the final relative URL (not the prefix), we match
 * against the R2 base + the full pathname as a substring, which catches it.
 */
export function mediaUrlVariants(relativeUrl: string, appUrl?: string, r2PublicUrl?: string): string[] {
  if (!relativeUrl) return [];
  const variants = [relativeUrl];

  if (appUrl) {
    const base = appUrl.replace(/\/$/, "");
    variants.push(`${base}${relativeUrl}`);
  }

  if (r2PublicUrl) {
    const r2Base = r2PublicUrl.replace(/\/$/, "");
    // R2 URLs are of the form: {r2Base}/{prefix}/{filename}
    // The relative URL is /media/{filename}. Strip the leading /media/ prefix
    // to get just the filename for matching (since R2 may have its own prefix).
    // We also add the full r2Base + relativeUrl form as a fallback.
    variants.push(`${r2Base}${relativeUrl}`);
    // If the relative URL starts with /media/, also try matching the filename portion
    // against the R2 base (covers prefix-aware storage paths).
    const withoutLeadingSlash = relativeUrl.replace(/^\//, "");
    variants.push(`${r2Base}/${withoutLeadingSlash}`);
  }

  // Deduplicate
  return Array.from(new Set(variants));
}

/**
 * Scan a freeform string (HTML content, JSON blob, etc.) for occurrences of
 * any of the provided URL variants. Returns true if any variant appears.
 */
export function textContainsMediaUrl(text: string, urlVariants: string[]): boolean {
  if (!text) return false;
  return urlVariants.some((v) => v && text.includes(v));
}

/**
 * Extract the text content of all free-text fields from a posts document that
 * can contain embedded image URLs. Returns a single concatenated string suitable
 * for substring scanning.
 *
 * Fields scanned:
 *  - blocksData: JSON textarea from the Visual Builder
 *  - wordpressHtml: raw HTML from WordPress import
 *  - content: Lexical richText (serialised as JSON string at depth:0)
 */
export function postFreeText(post: Record<string, unknown>): string {
  const parts: string[] = [];

  if (post.blocksData) parts.push(String(post.blocksData));
  if (post.wordpressHtml) parts.push(String(post.wordpressHtml));

  // content is a richText field — at depth:0 Payload returns the raw Lexical JSON object.
  // Stringify it so substring search works across both node text and embedded image src values.
  if (post.content != null) {
    parts.push(typeof post.content === "string" ? post.content : JSON.stringify(post.content));
  }

  return parts.join("\n");
}

/**
 * Extract all free-text from a pages document that can contain embedded image URLs.
 * Includes the script injection fields rendered live on public pages.
 *
 * Fields scanned:
 *  - blocksData: Visual Builder JSON blob
 *  - content: HTML textarea
 *  - customHeadScripts: arbitrary HTML injected in <head> (rendered live)
 *  - customFooterScripts: arbitrary HTML injected before </body> (rendered live)
 */
export function pageFreeText(page: Record<string, unknown>): string {
  const parts: string[] = [];

  if (page.blocksData) parts.push(String(page.blocksData));
  if (page.content) parts.push(String(page.content));
  if (page.customHeadScripts) parts.push(String(page.customHeadScripts));
  if (page.customFooterScripts) parts.push(String(page.customFooterScripts));

  return parts.join("\n");
}
