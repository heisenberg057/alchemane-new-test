import { blocksToPlainText, stripHtmlToText } from "@/lib/utils/blocksToPlainText";

type Recordish = Record<string, unknown>;

function asRecord(value: unknown): Recordish | null {
  if (value == null || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }
  return value as Recordish;
}

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function truncateForMetaDescription(value: string, max = 160): string {
  const clean = normalizeWhitespace(value);
  if (!clean) return "";
  if (clean.length <= max) return clean;

  const hard = clean.slice(0, max - 3).trimEnd();
  const lastSpace = hard.lastIndexOf(" ");
  const soft = lastSpace >= 120 ? hard.slice(0, lastSpace) : hard;
  return `${soft.trimEnd()}...`;
}

function extractTextFromBlocksData(blocksData: unknown): string {
  if (blocksData == null) return "";

  try {
    const parsed =
      typeof blocksData === "string" ? JSON.parse(blocksData) : blocksData;
    const arr = Array.isArray(parsed)
      ? parsed
      : asRecord(parsed)?.blocks;

    if (Array.isArray(arr)) {
      return normalizeWhitespace(blocksToPlainText(arr as never[]));
    }
  } catch {
    return "";
  }

  return "";
}

function rawPostDescription(post: Recordish): string {
  const meta = asRecord(post.meta);
  const explicit =
    typeof meta?.description === "string"
      ? meta.description
      : typeof post.metaDescription === "string"
        ? post.metaDescription
        : "";

  if (normalizeWhitespace(explicit)) {
    return normalizeWhitespace(explicit);
  }

  const fromBlocks = extractTextFromBlocksData(post.blocksData);
  if (fromBlocks) return fromBlocks;

  if (typeof post.wordpressHtml === "string") {
    const stripped = stripHtmlToText(post.wordpressHtml);
    if (stripped) return stripped;
  }

  if (typeof post.content === "string") {
    const stripped = stripHtmlToText(post.content);
    if (stripped) return stripped;
  }

  return "";
}

export function getEffectivePostMetaTitle(post: Recordish): string {
  const meta = asRecord(post.meta);
  const explicit =
    typeof meta?.title === "string"
      ? meta.title
      : typeof post.metaTitle === "string"
        ? post.metaTitle
        : "";

  const pageTitle = normalizeWhitespace(String(post.title ?? ""));
  const explicitClean = normalizeWhitespace(explicit);

  if (explicitClean) {
    // Prefer the full post title when CMS meta.title is a truncated prefix
    // (common WordPress import artifact ending mid-word).
    const explicitBase = explicitClean.replace(/\s*\.\.\.$/, "");
    if (
      pageTitle &&
      pageTitle.length > explicitBase.length + 2 &&
      pageTitle.toLowerCase().startsWith(explicitBase.toLowerCase())
    ) {
      return pageTitle;
    }
    return explicitClean;
  }

  return pageTitle;
}

export function getEffectivePostMetaDescription(post: Recordish): string {
  return truncateForMetaDescription(rawPostDescription(post));
}

export function hasEffectivePostMetaTitle(post: Recordish): boolean {
  return getEffectivePostMetaTitle(post).length > 0;
}

export function hasEffectivePostMetaDescription(post: Recordish): boolean {
  return getEffectivePostMetaDescription(post).length > 0;
}

export function hasEffectivePageMetaTitle(page: Recordish): boolean {
  const explicit = normalizeWhitespace(String(page.seoTitle ?? ""));
  if (explicit) return true;
  return normalizeWhitespace(String(page.title ?? "")).length > 0;
}

export function hasEffectivePageMetaDescription(page: Recordish): boolean {
  return normalizeWhitespace(String(page.metaDescription ?? "")).length > 0;
}
