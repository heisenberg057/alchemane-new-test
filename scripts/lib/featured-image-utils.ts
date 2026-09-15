import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { XMLParser } from "fast-xml-parser";

export type AuditStatus =
  | "ready"
  | "already-linked"
  | "missing-post"
  | "missing-attachment";

export type MigrationMode = "dry-run" | "live";

export interface WordPressFeaturedImageRecord {
  wordpressPostTitle: string;
  wordpressPostSlug: string;
  wordpressPostId: string;
  wordpressThumbnailId: string | null;
  wordpressAttachmentUrl: string | null;
}

export interface LocalPostRecord {
  localPostId: number;
  localSlug: string;
  existingHeroImage: number | null;
}

export interface FeaturedImageAuditRow extends WordPressFeaturedImageRecord {
  localPostId: number | null;
  localSlug: string | null;
  existingHeroImage: number | null;
  status: AuditStatus;
}

export interface FeaturedImageAuditReport {
  generatedAt: string;
  sourceXmlPath: string;
  localDatabaseUrlMasked: string;
  summary: {
    totalWordPressPosts: number;
    matchedLocalPosts: number;
    ready: number;
    alreadyLinked: number;
    missingPost: number;
    missingAttachment: number;
  };
  rows: FeaturedImageAuditRow[];
}

export interface MigrationReportUpload {
  attachmentUrl: string;
  payloadMediaId: number | string;
  filename: string;
  mimeType: string | null;
  title: string;
  alt: string;
  createdAt: string;
}

export interface MigrationReportLink {
  localPostId: number;
  localSlug: string;
  payloadMediaId: number | string;
  attachmentUrl: string;
  syncedMetaImage: boolean;
  linkedAt: string;
}

export interface MigrationReportSkipped {
  localPostId: number | null;
  localSlug: string | null;
  attachmentUrl: string | null;
  reason: string;
  skippedAt: string;
}

export interface MigrationReportFailure {
  localPostId: number | null;
  localSlug: string | null;
  attachmentUrl: string | null;
  reason: string;
  failedAt: string;
}

export interface MigrationVerification {
  checkedAt: string;
  postsStillMissingHeroImage: number | null;
  totalMediaRecords: number | null;
  mediaRecordsCreatedThisRun: number;
  sampleUpdatedPosts: Array<{
    id: number;
    slug: string;
    heroImageId: number | null;
    metaImageId: number | null;
  }>;
  sampleApiOutput:
    | {
        slug: string;
        status: number;
        featuredImage: string | null;
        heroImageUrl: string | null;
      }
    | {
        slug: string | null;
        error: string;
      }
    | null;
  sampleMetaImagePosts: Array<{
    id: number;
    slug: string;
    heroImageId: number | null;
    metaImageId: number | null;
  }>;
  sampleReusedImageMappings: Array<{
    attachmentUrl: string;
    payloadMediaId: number | string;
    localPostId: number;
    localSlug: string;
  }>;
}

export interface FeaturedImageMigrationReport {
  generatedAt: string;
  updatedAt: string;
  mode: MigrationMode;
  options: {
    dryRun: boolean;
    force: boolean;
    limit: number | null;
    offset: number;
    batchSize: number;
    retryDownloads: number;
    syncMetaImage: boolean;
    sourceAuditReport: string;
  };
  preflight: {
    totalRowsSelected: number;
    alreadyLinkedRows: number;
    rowsToUpload: number;
    rowsToReuse: number;
    rowsSkipped: number;
    rowsWithBrokenAttachmentUrl: number;
    rowsWithMissingLocalPost: number;
  } | null;
  summary: {
    candidateRows: number;
    attemptedRows: number;
    successfulUploads: number;
    successfulPostLinks: number;
    duplicateImagesReused: number;
    skippedAlreadyLinkedPosts: number;
    skippedMissingUrls: number;
    skippedFromResume: number;
    missingLocalPosts: number;
    brokenWordPressUrls: number;
    uploadFailures: number;
    dbUpdateFailures: number;
  };
  attachmentUrlToPayloadMediaId: Record<string, number | string>;
  successfulUploads: MigrationReportUpload[];
  successfulPostLinks: MigrationReportLink[];
  duplicateImagesReused: Array<{
    attachmentUrl: string;
    payloadMediaId: number | string;
    localPostId: number;
    localSlug: string;
    reusedAt: string;
  }>;
  skippedAlreadyLinkedPosts: MigrationReportSkipped[];
  skippedMissingUrls: MigrationReportSkipped[];
  skippedFromResume: MigrationReportSkipped[];
  missingLocalPosts: MigrationReportSkipped[];
  brokenWordPressUrls: MigrationReportFailure[];
  uploadFailures: MigrationReportFailure[];
  dbUpdateFailures: MigrationReportFailure[];
  verification: MigrationVerification | null;
}

export function getAppRoot(currentDir: string): string {
  return path.resolve(currentDir, "..");
}

export function getWorkspaceRoot(appRoot: string): string {
  return path.resolve(appRoot, "..");
}

export function getReportsDir(appRoot: string): string {
  return path.join(appRoot, "reports");
}

export function ensureDir(dirPath: string): void {
  fs.mkdirSync(dirPath, { recursive: true });
}

export function loadScriptEnv(appRoot: string): void {
  const candidates = [
    path.join(appRoot, ".env.local"),
    path.join(appRoot, ".env"),
  ];

  for (const envPath of candidates) {
    if (!fs.existsSync(envPath)) continue;
    dotenv.config({ path: envPath, override: false });
  }
}

export function maskConnectionString(value: string): string {
  return value.replace(/:\/\/([^:]+):([^@]+)@/, "://$1:***@");
}

export function normalizeSlug(value: string | null | undefined): string {
  return String(value ?? "")
    .trim()
    .replace(/^\/+|\/+$/g, "")
    .toLowerCase();
}

export function normalizeUrl(value: string | null | undefined): string {
  return String(value ?? "").trim();
}

export function extractText(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (value && typeof value === "object" && "#text" in value) {
    return String((value as { "#text"?: unknown })["#text"] ?? "").trim();
  }
  return String(value ?? "").trim();
}

function buildAttachmentMap(items: any[]): Record<string, string> {
  const attachmentMap: Record<string, string> = {};

  for (const item of items) {
    if (item["wp:post_type"] !== "attachment") continue;
    const attachmentId = String(item["wp:post_id"] ?? "").trim();
    const attachmentUrl = normalizeUrl(item["wp:attachment_url"]);
    if (!attachmentId || !attachmentUrl) continue;
    attachmentMap[attachmentId] = attachmentUrl;
  }

  return attachmentMap;
}

export function parseWordPressFeaturedImageRecords(
  xmlPath: string,
): WordPressFeaturedImageRecord[] {
  if (!fs.existsSync(xmlPath)) {
    throw new Error(`WordPress XML not found at ${xmlPath}`);
  }

  const xml = fs.readFileSync(xmlPath, "utf8");
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
  });
  const parsed = parser.parse(xml);
  const rawItems = parsed.rss?.channel?.item ?? [];
  const items = Array.isArray(rawItems) ? rawItems : [rawItems];
  const attachmentMap = buildAttachmentMap(items);

  return items
    .filter(
      (item) =>
        item["wp:post_type"] === "post" && item["wp:status"] === "publish",
    )
    .map((item) => {
      const postMetaRaw = item["wp:postmeta"];
      const postMeta = Array.isArray(postMetaRaw)
        ? postMetaRaw
        : postMetaRaw
          ? [postMetaRaw]
          : [];

      const thumbnailId =
        postMeta.find((meta) => meta?.["wp:meta_key"] === "_thumbnail_id")?.[
          "wp:meta_value"
        ] ?? null;

      const normalizedThumbnailId = thumbnailId
        ? String(thumbnailId).trim()
        : null;

      return {
        wordpressPostTitle: extractText(item.title),
        wordpressPostSlug: normalizeSlug(item["wp:post_name"]),
        wordpressPostId: String(item["wp:post_id"] ?? "").trim(),
        wordpressThumbnailId: normalizedThumbnailId,
        wordpressAttachmentUrl: normalizedThumbnailId
          ? attachmentMap[normalizedThumbnailId] ?? null
          : null,
      };
    });
}

export function buildAuditRows(
  wordpressRecords: WordPressFeaturedImageRecord[],
  localPosts: LocalPostRecord[],
): FeaturedImageAuditRow[] {
  const localBySlug = new Map<string, LocalPostRecord>();
  for (const localPost of localPosts) {
    localBySlug.set(normalizeSlug(localPost.localSlug), localPost);
  }

  return wordpressRecords.map((record) => {
    const localPost = localBySlug.get(normalizeSlug(record.wordpressPostSlug));

    if (!localPost) {
      return {
        ...record,
        localPostId: null,
        localSlug: null,
        existingHeroImage: null,
        status: "missing-post",
      };
    }

    if (localPost.existingHeroImage != null) {
      return {
        ...record,
        localPostId: localPost.localPostId,
        localSlug: localPost.localSlug,
        existingHeroImage: localPost.existingHeroImage,
        status: "already-linked",
      };
    }

    if (!record.wordpressAttachmentUrl) {
      return {
        ...record,
        localPostId: localPost.localPostId,
        localSlug: localPost.localSlug,
        existingHeroImage: localPost.existingHeroImage,
        status: "missing-attachment",
      };
    }

    return {
      ...record,
      localPostId: localPost.localPostId,
      localSlug: localPost.localSlug,
      existingHeroImage: localPost.existingHeroImage,
      status: "ready",
    };
  });
}

export function buildAuditSummary(rows: FeaturedImageAuditRow[]) {
  return {
    totalWordPressPosts: rows.length,
    matchedLocalPosts: rows.filter((row) => row.localPostId != null).length,
    ready: rows.filter((row) => row.status === "ready").length,
    alreadyLinked: rows.filter((row) => row.status === "already-linked").length,
    missingPost: rows.filter((row) => row.status === "missing-post").length,
    missingAttachment: rows.filter((row) => row.status === "missing-attachment")
      .length,
  };
}

export function writeJsonReport<T>(filePath: string, data: T): void {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

export function writeCsvReport(
  filePath: string,
  rows: Array<Record<string, unknown>>,
): void {
  ensureDir(path.dirname(filePath));
  if (!rows.length) {
    fs.writeFileSync(filePath, "", "utf8");
    return;
  }

  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(","),
    ...rows.map((row) =>
      headers
        .map((header) => escapeCsvValue(row[header]))
        .join(","),
    ),
  ].join("\n");

  fs.writeFileSync(filePath, `${csv}\n`, "utf8");
}

function escapeCsvValue(value: unknown): string {
  const normalized =
    value == null ? "" : typeof value === "string" ? value : JSON.stringify(value);
  if (/[",\n]/.test(normalized)) {
    return `"${normalized.replace(/"/g, '""')}"`;
  }
  return normalized;
}

export function readJsonFile<T>(filePath: string): T | null {
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

export function parseStringFlag(argv: string[], name: string): string | null {
  const inline = argv.find((arg) => arg.startsWith(`--${name}=`));
  if (inline) return inline.slice(name.length + 3);

  const index = argv.indexOf(`--${name}`);
  if (index === -1) return null;
  return argv[index + 1] ?? null;
}

export function parseIntegerFlag(
  argv: string[],
  name: string,
  defaultValue: number | null,
): number | null {
  const rawValue = parseStringFlag(argv, name);
  if (rawValue == null) return defaultValue;
  const parsed = Number.parseInt(rawValue, 10);
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error(`--${name} must be a non-negative integer`);
  }
  return parsed;
}

export function hasFlag(argv: string[], name: string): boolean {
  return argv.includes(`--${name}`) || argv.some((arg) => arg === `--${name}`);
}

export function sanitizeFileComponent(value: string): string {
  return value.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/-+/g, "-");
}

export function guessExtensionFromContentType(
  contentType: string | null,
): string | null {
  if (!contentType) return null;
  const type = contentType.split(";")[0].trim().toLowerCase();

  const mapping: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
    "image/svg+xml": ".svg",
    "image/avif": ".avif",
  };

  return mapping[type] ?? null;
}

export function getFilenameFromUrl(
  sourceUrl: string,
  contentType: string | null,
): string {
  const url = new URL(sourceUrl);
  const rawName = decodeURIComponent(path.basename(url.pathname) || "wordpress-image");
  const parsed = path.parse(rawName);
  const safeBaseName = sanitizeFileComponent(parsed.name || "wordpress-image");
  const normalizedExtension = parsed.ext ? parsed.ext.toLowerCase() : "";

  if (normalizedExtension) return `${safeBaseName}${normalizedExtension}`;

  const guessedExtension = guessExtensionFromContentType(contentType) ?? ".bin";
  return `${safeBaseName}${guessedExtension.toLowerCase()}`;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
