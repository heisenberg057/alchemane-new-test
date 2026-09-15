import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createHash } from "crypto";
import pg from "pg";
import {
  ensureDir,
  getAppRoot,
  getReportsDir,
  getFilenameFromUrl,
  hasFlag,
  loadScriptEnv,
  parseIntegerFlag,
  parseStringFlag,
  readJsonFile,
  sleep,
  type FeaturedImageAuditReport,
  type FeaturedImageAuditRow,
  type FeaturedImageMigrationReport,
  type MigrationVerification,
  writeJsonReport,
} from "./lib/featured-image-utils.ts";

type PostStateRow = {
  id: number;
  slug: string;
  hero_image_id: number | null;
  meta_image_id: number | null;
};

type DownloadResult = {
  filePath: string;
  filename: string;
  mimeType: string | null;
};

type PreflightSummary = NonNullable<FeaturedImageMigrationReport["preflight"]>;

type PreflightProbeResult = {
  brokenUrls: Set<string>;
};

type ApiAuthResponse = {
  success?: boolean;
  data?: {
    token?: string;
    accessToken?: string;
  };
  token?: string;
  accessToken?: string;
  message?: string;
};

type MediaApiDoc = {
  id: number | string;
  filename?: string;
  mimeType?: string | null;
  doc?: {
    id: number | string;
    filename?: string;
    mimeType?: string | null;
  };
  message?: string;
  errors?: unknown;
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appRoot = getAppRoot(__dirname);
const reportsDir = getReportsDir(appRoot);
const tempDir = path.join(appRoot, "tmp", "featured-image-migration");
const auditReportPath =
  parseStringFlag(process.argv, "audit-report") ??
  path.join(reportsDir, "featured-image-audit.json");
const migrationReportPath = path.join(
  reportsDir,
  "featured-image-migration-report.json",
);
const dryRun = hasFlag(process.argv, "dry-run");
const force = hasFlag(process.argv, "force");
const syncMetaImage = hasFlag(process.argv, "sync-meta-image");
const limit = parseIntegerFlag(process.argv, "limit", null);
const offset = parseIntegerFlag(process.argv, "offset", 0) ?? 0;
const retryDownloads = parseIntegerFlag(process.argv, "retry-downloads", 3) ?? 3;
const batchSize = 20;

loadScriptEnv(appRoot);
ensureDir(reportsDir);
ensureDir(tempDir);

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to run the featured-image migration.");
}
const appUrl = String(
  process.env.PAYLOAD_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    "http://localhost:3000",
).replace(/\/$/, "");
const apiBaseUrl = `${appUrl}/api`;
const adminEmail =
  process.env.PAYLOAD_ADMIN_EMAIL || process.env.ADMIN_EMAIL || "";
const adminPassword =
  process.env.PAYLOAD_ADMIN_PASSWORD ||
  process.env.ADMIN_MIGRATION_PASSWORD ||
  process.env.ADMIN_PASSWORD ||
  "";

if (!adminEmail || !adminPassword) {
  throw new Error(
    "Admin credentials are required. Set PAYLOAD_ADMIN_EMAIL/PAYLOAD_ADMIN_PASSWORD or ADMIN_EMAIL/ADMIN_MIGRATION_PASSWORD.",
  );
}

function normalizeCandidateRows(
  auditReport: FeaturedImageAuditReport,
): FeaturedImageAuditRow[] {
  const allowedStatuses = force
    ? new Set(["ready", "already-linked"])
    : new Set(["ready"]);

  const filtered = auditReport.rows.filter((row) => allowedStatuses.has(row.status));
  return filtered.slice(offset, limit == null ? undefined : offset + limit);
}

function createEmptyReport(candidateRows: number): FeaturedImageMigrationReport {
  const now = new Date().toISOString();
  return {
    generatedAt: now,
    updatedAt: now,
    mode: dryRun ? "dry-run" : "live",
    options: {
      dryRun,
      force,
      limit,
      offset,
      batchSize,
      retryDownloads,
      syncMetaImage,
      sourceAuditReport: auditReportPath,
    },
    preflight: null,
    summary: {
      candidateRows,
      attemptedRows: 0,
      successfulUploads: 0,
      successfulPostLinks: 0,
      duplicateImagesReused: 0,
      skippedAlreadyLinkedPosts: 0,
      skippedMissingUrls: 0,
      skippedFromResume: 0,
      missingLocalPosts: 0,
      brokenWordPressUrls: 0,
      uploadFailures: 0,
      dbUpdateFailures: 0,
    },
    attachmentUrlToPayloadMediaId: {},
    successfulUploads: [],
    successfulPostLinks: [],
    duplicateImagesReused: [],
    skippedAlreadyLinkedPosts: [],
    skippedMissingUrls: [],
    skippedFromResume: [],
    missingLocalPosts: [],
    brokenWordPressUrls: [],
    uploadFailures: [],
    dbUpdateFailures: [],
    verification: null,
  };
}

function loadOrCreateReport(candidateRows: number): FeaturedImageMigrationReport {
  if (dryRun) return createEmptyReport(candidateRows);

  const existing = readJsonFile<FeaturedImageMigrationReport>(migrationReportPath);
  if (!existing) return createEmptyReport(candidateRows);
  if (existing.mode !== "live") return createEmptyReport(candidateRows);

  existing.updatedAt = new Date().toISOString();
  existing.mode = "live";
  existing.options = {
    ...existing.options,
    dryRun,
    force,
    limit,
    offset,
    batchSize,
    retryDownloads,
    syncMetaImage,
    sourceAuditReport: auditReportPath,
  };
  existing.summary.candidateRows = candidateRows;
  return existing;
}

function persistReport(report: FeaturedImageMigrationReport): void {
  report.updatedAt = new Date().toISOString();
  writeJsonReport(migrationReportPath, report);
}

function toReason(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

async function fetchPostState(
  pool: pg.Pool,
  postId: number,
): Promise<PostStateRow | null> {
  const result = await pool.query<PostStateRow>(
    `
      SELECT id, slug, hero_image_id, meta_image_id
      FROM posts
      WHERE id = $1
      LIMIT 1
    `,
    [postId],
  );

  return result.rows[0] ?? null;
}

async function fetchPostStates(
  pool: pg.Pool,
  postIds: number[],
): Promise<Map<number, PostStateRow>> {
  if (!postIds.length) return new Map();

  const result = await pool.query<PostStateRow>(
    `
      SELECT id, slug, hero_image_id, meta_image_id
      FROM posts
      WHERE id = ANY($1::int[])
    `,
    [postIds],
  );

  return new Map(result.rows.map((row) => [row.id, row]));
}

async function probeAttachmentUrl(url: string): Promise<boolean> {
  try {
    const headResponse = await fetch(url, { method: "HEAD", redirect: "follow" });
    if (headResponse.ok) return true;
    if (headResponse.status !== 405 && headResponse.status !== 403) {
      return false;
    }
  } catch {
    // Fall back to a GET probe below.
  }

  try {
    const getResponse = await fetch(url, { method: "GET", redirect: "follow" });
    const ok = getResponse.ok;
    await getResponse.body?.cancel();
    return ok;
  } catch {
    return false;
  }
}

async function runPreflightUrlChecks(rows: FeaturedImageAuditRow[]): Promise<PreflightProbeResult> {
  const uniqueUrls = Array.from(
    new Set(
      rows
        .map((row) => row.wordpressAttachmentUrl)
        .filter((value): value is string => Boolean(value)),
    ),
  );

  const brokenUrls = new Set<string>();

  for (const url of uniqueUrls) {
    const ok = await probeAttachmentUrl(url);
    if (!ok) brokenUrls.add(url);
  }

  return { brokenUrls };
}

function buildPreflightSummary(
  rows: FeaturedImageAuditRow[],
  postStates: Map<number, PostStateRow>,
  urlToMediaId: Map<string, number | string>,
  successfulPostIds: Set<number>,
  brokenUrls: Set<string>,
): PreflightSummary {
  let alreadyLinkedRows = 0;
  let rowsToUpload = 0;
  let rowsToReuse = 0;
  let rowsSkipped = 0;
  let rowsWithMissingLocalPost = 0;

  const seenUrlsToUpload = new Set<string>();

  for (const row of rows) {
    if (row.localPostId == null) {
      rowsWithMissingLocalPost += 1;
      rowsSkipped += 1;
      continue;
    }

    const state = postStates.get(row.localPostId);
    if (!state) {
      rowsWithMissingLocalPost += 1;
      rowsSkipped += 1;
      continue;
    }

    if (successfulPostIds.has(row.localPostId)) {
      rowsSkipped += 1;
      continue;
    }

    if (!row.wordpressAttachmentUrl) {
      rowsSkipped += 1;
      continue;
    }

    if (state.hero_image_id != null && !force) {
      alreadyLinkedRows += 1;
      rowsSkipped += 1;
      continue;
    }

    if (brokenUrls.has(row.wordpressAttachmentUrl)) {
      rowsSkipped += 1;
      continue;
    }

    if (urlToMediaId.has(row.wordpressAttachmentUrl) || seenUrlsToUpload.has(row.wordpressAttachmentUrl)) {
      rowsToReuse += 1;
      continue;
    }

    rowsToUpload += 1;
    seenUrlsToUpload.add(row.wordpressAttachmentUrl);
  }

  return {
    totalRowsSelected: rows.length,
    alreadyLinkedRows,
    rowsToUpload,
    rowsToReuse,
    rowsSkipped,
    rowsWithBrokenAttachmentUrl: brokenUrls.size,
    rowsWithMissingLocalPost,
  };
}

function logPreflightSummary(summary: PreflightSummary): void {
  console.log("Pre-flight summary:");
  console.log(`- total rows selected: ${summary.totalRowsSelected}`);
  console.log(`- already linked rows: ${summary.alreadyLinkedRows}`);
  console.log(`- rows to upload: ${summary.rowsToUpload}`);
  console.log(`- rows to reuse: ${summary.rowsToReuse}`);
  console.log(`- rows skipped: ${summary.rowsSkipped}`);
  console.log(`- rows with broken attachment URL: ${summary.rowsWithBrokenAttachmentUrl}`);
  console.log(`- rows with missing local post: ${summary.rowsWithMissingLocalPost}`);
}

function logProcessedRow(details: {
  localPostId: number | null;
  slug: string | null;
  attachmentUrl: string | null;
  mediaAction: string;
  payloadMediaId: number | string | null;
  heroImageUpdated: boolean;
  metaImageUpdated: boolean;
  note?: string;
}): void {
  const parts = [
    `[ROW] postId=${details.localPostId ?? "n/a"}`,
    `slug=${details.slug ?? "n/a"}`,
    `attachmentUrl=${details.attachmentUrl ?? "n/a"}`,
    `media=${details.mediaAction}`,
    `payloadMediaId=${details.payloadMediaId ?? "n/a"}`,
    `heroImageUpdated=${details.heroImageUpdated ? "yes" : "no"}`,
    `metaImageUpdated=${details.metaImageUpdated ? "yes" : "no"}`,
  ];

  if (details.note) parts.push(`note=${details.note}`);
  console.log(parts.join(" "));
}

async function downloadWithRetries(
  sourceUrl: string,
  localPostId: number,
): Promise<DownloadResult> {
  let lastError: unknown = null;

  for (let attempt = 1; attempt <= retryDownloads; attempt++) {
    try {
      const response = await fetch(sourceUrl);
      if (!response.ok) {
        throw new Error(`Download failed with HTTP ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const contentType = response.headers.get("content-type");
      const filename = getFilenameFromUrl(sourceUrl, contentType);
      const urlHash = createHash("sha1").update(sourceUrl).digest("hex").slice(0, 12);
      const localFilename = `${String(localPostId).padStart(6, "0")}-${urlHash}-${filename}`;
      const filePath = path.join(tempDir, localFilename);

      fs.writeFileSync(filePath, Buffer.from(arrayBuffer));

      return {
        filePath,
        filename,
        mimeType: contentType,
      };
    } catch (error) {
      lastError = error;
      if (attempt < retryDownloads) {
        await sleep(500 * attempt);
      }
    }
  }

  throw lastError ?? new Error(`Download failed for ${sourceUrl}`);
}

async function getAdminToken(): Promise<string> {
  const response = await fetch(`${apiBaseUrl}/users/login`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      email: adminEmail,
      password: adminPassword,
    }),
  });

  const json = (await response.json()) as ApiAuthResponse;
  const token =
    json.data?.token ||
    json.data?.accessToken ||
    json.token ||
    json.accessToken;

  if (!response.ok || !token) {
    throw new Error(
      `Admin login failed (${response.status}): ${json.message || "missing token"}`,
    );
  }

  return token;
}

async function createMediaRecord(
  token: string,
  row: FeaturedImageAuditRow,
  download: DownloadResult,
) {
  const title = row.wordpressPostTitle || download.filename;
  const alt = row.wordpressPostTitle || download.filename;
  const fileBuffer = fs.readFileSync(download.filePath);
  const contentType = download.mimeType || "application/octet-stream";
  const formData = new FormData();
  formData.append(
    "_payload",
    JSON.stringify({
      alt,
      title,
      description: `Imported from WordPress featured image: ${row.wordpressAttachmentUrl}`,
    }),
  );
  formData.append(
    "file",
    new File([fileBuffer], download.filename, { type: contentType }),
  );

  const response = await fetch(`${apiBaseUrl}/media`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  const created = (await response.json()) as MediaApiDoc;
  const doc = created.doc ?? created;

  if (!response.ok || doc.id == null) {
    throw new Error(
      `Media upload failed (${response.status}): ${created.message || "missing media id"}`,
    );
  }

  return {
    id: doc.id,
    title,
    alt,
    filename: String(doc.filename ?? download.filename),
    mimeType:
      typeof doc.mimeType === "string"
        ? String(doc.mimeType)
        : download.mimeType,
  };
}

async function updatePostHeroImage(
  token: string,
  row: FeaturedImageAuditRow,
  mediaId: number | string,
): Promise<void> {
  const data = syncMetaImage
    ? { heroImage: mediaId, meta: { image: mediaId } }
    : { heroImage: mediaId };
  const response = await fetch(`${apiBaseUrl}/posts/${row.localPostId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Post update failed (${response.status}): ${text}`);
  }
}

async function runVerification(
  pool: pg.Pool,
  report: FeaturedImageMigrationReport,
): Promise<MigrationVerification> {
  const verification: MigrationVerification = {
    checkedAt: new Date().toISOString(),
    postsStillMissingHeroImage: null,
    totalMediaRecords: null,
    mediaRecordsCreatedThisRun: report.successfulUploads.length,
    sampleUpdatedPosts: [],
    sampleApiOutput: null,
    sampleMetaImagePosts: [],
    sampleReusedImageMappings: report.duplicateImagesReused.slice(0, 5).map((row) => ({
      attachmentUrl: row.attachmentUrl,
      payloadMediaId: row.payloadMediaId,
      localPostId: row.localPostId,
      localSlug: row.localSlug,
    })),
  };

  const missingResult = await pool.query<{ total: string }>(
    `
      SELECT count(*)::text AS total
      FROM posts
      WHERE _status = 'published' AND hero_image_id IS NULL
    `,
  );
  verification.postsStillMissingHeroImage = Number.parseInt(
    missingResult.rows[0]?.total ?? "0",
    10,
  );

  const mediaResult = await pool.query<{ total: string }>(
    `SELECT count(*)::text AS total FROM media`,
  );
  verification.totalMediaRecords = Number.parseInt(
    mediaResult.rows[0]?.total ?? "0",
    10,
  );

  const sampleIds = Array.from(
    new Set(report.successfulPostLinks.map((row) => row.localPostId)),
  ).slice(0, 10);

  if (sampleIds.length) {
    const sampleResult = await pool.query<{
      id: number;
      slug: string;
      hero_image_id: number | null;
      meta_image_id: number | null;
    }>(
      `
        SELECT id, slug, hero_image_id, meta_image_id
        FROM posts
        WHERE id = ANY($1::int[])
        ORDER BY id ASC
      `,
      [sampleIds],
    );

    verification.sampleUpdatedPosts = sampleResult.rows.map((row) => ({
      id: row.id,
      slug: row.slug,
      heroImageId: row.hero_image_id,
      metaImageId: row.meta_image_id,
    }));

    const metaImageResult = await pool.query<{
      id: number;
      slug: string;
      hero_image_id: number | null;
      meta_image_id: number | null;
    }>(
      `
        SELECT id, slug, hero_image_id, meta_image_id
        FROM posts
        WHERE id = ANY($1::int[]) AND meta_image_id IS NOT NULL
        ORDER BY id ASC
        LIMIT 5
      `,
      [sampleIds],
    );

    verification.sampleMetaImagePosts = metaImageResult.rows.map((row) => ({
      id: row.id,
      slug: row.slug,
      heroImageId: row.hero_image_id,
      metaImageId: row.meta_image_id,
    }));

    const sampleSlug = verification.sampleUpdatedPosts[0]?.slug ?? null;
    if (sampleSlug) {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
        const response = await fetch(
          `${baseUrl.replace(/\/$/, "")}/api/posts/slug/${sampleSlug}`,
        );
        const payloadJson = (await response.json()) as {
          data?: {
            post?: {
              featuredImage?: string | null;
              heroImage?: { url?: string | null } | null;
            };
          };
        };
        verification.sampleApiOutput = {
          slug: sampleSlug,
          status: response.status,
          featuredImage: payloadJson.data?.post?.featuredImage ?? null,
          heroImageUrl: payloadJson.data?.post?.heroImage?.url ?? null,
        };
      } catch (error) {
        verification.sampleApiOutput = {
          slug: sampleSlug,
          error: `API verification failed: ${toReason(error)}`,
        };
      }
    }
  }

  return verification;
}

async function main(): Promise<void> {
  const auditReport = readJsonFile<FeaturedImageAuditReport>(auditReportPath);
  if (!auditReport) {
    throw new Error(
      `Audit report not found at ${auditReportPath}. Run scripts/audit-wordpress-featured-images.ts first.`,
    );
  }

  const candidateRows = normalizeCandidateRows(auditReport);
  const report = loadOrCreateReport(candidateRows.length);
  const pool = new pg.Pool({ connectionString: databaseUrl });
  const successfulPostIds = new Set(
    report.successfulPostLinks.map((row) => row.localPostId),
  );
  const urlToMediaId = new Map<string, number | string>(
    Object.entries(report.attachmentUrlToPayloadMediaId),
  );
  const postStates = await fetchPostStates(
    pool,
    candidateRows
      .map((row) => row.localPostId)
      .filter((value): value is number => value != null),
  );
  const preflightProbe = await runPreflightUrlChecks(candidateRows);
  report.preflight = buildPreflightSummary(
    candidateRows,
    postStates,
    urlToMediaId,
    successfulPostIds,
    preflightProbe.brokenUrls,
  );

  let adminToken: string | null = null;
  if (!dryRun && candidateRows.length) {
    adminToken = await getAdminToken();
  }

  console.log("Starting featured-image migration...");
  console.log(`Mode: ${dryRun ? "dry-run" : "live"}`);
  console.log(`Audit report: ${auditReportPath}`);
  console.log(`Migration report: ${migrationReportPath}`);
  console.log(`Candidates: ${candidateRows.length}`);
  logPreflightSummary(report.preflight);
  persistReport(report);

  try {
    for (let start = 0; start < candidateRows.length; start += batchSize) {
      const batch = candidateRows.slice(start, start + batchSize);
      console.log(
        `Processing batch ${Math.floor(start / batchSize) + 1} (${batch.length} rows)...`,
      );

      for (const row of batch) {
        report.summary.attemptedRows += 1;

        if (row.localPostId == null) {
          report.missingLocalPosts.push({
            localPostId: null,
            localSlug: row.localSlug,
            attachmentUrl: row.wordpressAttachmentUrl,
            reason: "Audit row has no matching local post ID",
            skippedAt: new Date().toISOString(),
          });
          report.summary.missingLocalPosts += 1;
          logProcessedRow({
            localPostId: null,
            slug: row.localSlug,
            attachmentUrl: row.wordpressAttachmentUrl,
            mediaAction: "skipped",
            payloadMediaId: null,
            heroImageUpdated: false,
            metaImageUpdated: false,
            note: "missing local post id",
          });
          persistReport(report);
          continue;
        }

        if (successfulPostIds.has(row.localPostId)) {
          report.skippedFromResume.push({
            localPostId: row.localPostId,
            localSlug: row.localSlug,
            attachmentUrl: row.wordpressAttachmentUrl,
            reason: "Post was already linked in a previous run",
            skippedAt: new Date().toISOString(),
          });
          report.summary.skippedFromResume += 1;
          logProcessedRow({
            localPostId: row.localPostId,
            slug: row.localSlug,
            attachmentUrl: row.wordpressAttachmentUrl,
            mediaAction: "skipped",
            payloadMediaId: null,
            heroImageUpdated: false,
            metaImageUpdated: false,
            note: "resume skip",
          });
          persistReport(report);
          continue;
        }

        if (!row.wordpressAttachmentUrl) {
          report.skippedMissingUrls.push({
            localPostId: row.localPostId,
            localSlug: row.localSlug,
            attachmentUrl: null,
            reason: "WordPress attachment URL is missing",
            skippedAt: new Date().toISOString(),
          });
          report.summary.skippedMissingUrls += 1;
          logProcessedRow({
            localPostId: row.localPostId,
            slug: row.localSlug,
            attachmentUrl: null,
            mediaAction: "skipped",
            payloadMediaId: null,
            heroImageUpdated: false,
            metaImageUpdated: false,
            note: "missing attachment url",
          });
          persistReport(report);
          continue;
        }

        const currentPost =
          postStates.get(row.localPostId) ?? (await fetchPostState(pool, row.localPostId));
        if (!currentPost) {
          report.missingLocalPosts.push({
            localPostId: row.localPostId,
            localSlug: row.localSlug,
            attachmentUrl: row.wordpressAttachmentUrl,
            reason: "Local post no longer exists",
            skippedAt: new Date().toISOString(),
          });
          report.summary.missingLocalPosts += 1;
          logProcessedRow({
            localPostId: row.localPostId,
            slug: row.localSlug,
            attachmentUrl: row.wordpressAttachmentUrl,
            mediaAction: "skipped",
            payloadMediaId: null,
            heroImageUpdated: false,
            metaImageUpdated: false,
            note: "local post missing",
          });
          persistReport(report);
          continue;
        }

        if (currentPost.hero_image_id != null && !force) {
          report.skippedAlreadyLinkedPosts.push({
            localPostId: row.localPostId,
            localSlug: currentPost.slug,
            attachmentUrl: row.wordpressAttachmentUrl,
            reason: `Post already has heroImage ${currentPost.hero_image_id}`,
            skippedAt: new Date().toISOString(),
          });
          report.summary.skippedAlreadyLinkedPosts += 1;
          logProcessedRow({
            localPostId: row.localPostId,
            slug: currentPost.slug,
            attachmentUrl: row.wordpressAttachmentUrl,
            mediaAction: "skipped",
            payloadMediaId: currentPost.hero_image_id,
            heroImageUpdated: false,
            metaImageUpdated: false,
            note: "heroImage already linked",
          });
          persistReport(report);
          continue;
        }

        if (preflightProbe.brokenUrls.has(row.wordpressAttachmentUrl)) {
          report.brokenWordPressUrls.push({
            localPostId: row.localPostId,
            localSlug: currentPost.slug,
            attachmentUrl: row.wordpressAttachmentUrl,
            reason: "Pre-flight URL probe failed",
            failedAt: new Date().toISOString(),
          });
          report.summary.brokenWordPressUrls += 1;
          logProcessedRow({
            localPostId: row.localPostId,
            slug: currentPost.slug,
            attachmentUrl: row.wordpressAttachmentUrl,
            mediaAction: "skipped",
            payloadMediaId: null,
            heroImageUpdated: false,
            metaImageUpdated: false,
            note: "broken attachment url",
          });
          persistReport(report);
          continue;
        }

        if (dryRun) {
          logProcessedRow({
            localPostId: row.localPostId,
            slug: currentPost.slug,
            attachmentUrl: row.wordpressAttachmentUrl,
            mediaAction: urlToMediaId.has(row.wordpressAttachmentUrl) ? "reused-dry-run" : "new-upload-dry-run",
            payloadMediaId: urlToMediaId.get(row.wordpressAttachmentUrl) ?? null,
            heroImageUpdated: true,
            metaImageUpdated: syncMetaImage,
            note: "dry-run only",
          });
          persistReport(report);
          continue;
        }

        let mediaId = urlToMediaId.get(row.wordpressAttachmentUrl);
        let mediaAction = mediaId ? "reused-existing-map" : "new-upload";
        if (!mediaId) {
          let download: DownloadResult;
          try {
            download = await downloadWithRetries(
              row.wordpressAttachmentUrl,
              row.localPostId,
            );
          } catch (error) {
            report.brokenWordPressUrls.push({
              localPostId: row.localPostId,
              localSlug: currentPost.slug,
              attachmentUrl: row.wordpressAttachmentUrl,
              reason: toReason(error),
              failedAt: new Date().toISOString(),
            });
            report.summary.brokenWordPressUrls += 1;
            logProcessedRow({
              localPostId: row.localPostId,
              slug: currentPost.slug,
              attachmentUrl: row.wordpressAttachmentUrl,
              mediaAction: "download-failed",
              payloadMediaId: null,
              heroImageUpdated: false,
              metaImageUpdated: false,
              note: toReason(error),
            });
            persistReport(report);
            continue;
          }

          try {
            const created = await createMediaRecord(adminToken!, row, download);
            mediaId = created.id;
            urlToMediaId.set(row.wordpressAttachmentUrl, created.id);
            report.attachmentUrlToPayloadMediaId[row.wordpressAttachmentUrl] = created.id;
            report.successfulUploads.push({
              attachmentUrl: row.wordpressAttachmentUrl,
              payloadMediaId: created.id,
              filename: created.filename,
              mimeType: created.mimeType,
              title: created.title,
              alt: created.alt,
              createdAt: new Date().toISOString(),
            });
            report.summary.successfulUploads += 1;
            mediaAction = "uploaded-new";
          } catch (error) {
            report.uploadFailures.push({
              localPostId: row.localPostId,
              localSlug: currentPost.slug,
              attachmentUrl: row.wordpressAttachmentUrl,
              reason: toReason(error),
              failedAt: new Date().toISOString(),
            });
            report.summary.uploadFailures += 1;
            logProcessedRow({
              localPostId: row.localPostId,
              slug: currentPost.slug,
              attachmentUrl: row.wordpressAttachmentUrl,
              mediaAction: "upload-failed",
              payloadMediaId: null,
              heroImageUpdated: false,
              metaImageUpdated: false,
              note: toReason(error),
            });
            persistReport(report);
            continue;
          }
        } else {
          report.duplicateImagesReused.push({
            attachmentUrl: row.wordpressAttachmentUrl,
            payloadMediaId: mediaId,
            localPostId: row.localPostId,
            localSlug: currentPost.slug,
            reusedAt: new Date().toISOString(),
          });
          report.summary.duplicateImagesReused += 1;
          mediaAction = "reused";
        }

        try {
          await updatePostHeroImage(adminToken!, row, mediaId);
          report.successfulPostLinks.push({
            localPostId: row.localPostId,
            localSlug: currentPost.slug,
            payloadMediaId: mediaId,
            attachmentUrl: row.wordpressAttachmentUrl,
            syncedMetaImage: syncMetaImage,
            linkedAt: new Date().toISOString(),
          });
          report.summary.successfulPostLinks += 1;
          successfulPostIds.add(row.localPostId);
          postStates.set(row.localPostId, {
            ...currentPost,
            hero_image_id: Number(mediaId),
            meta_image_id: syncMetaImage ? Number(mediaId) : currentPost.meta_image_id,
          });
          logProcessedRow({
            localPostId: row.localPostId,
            slug: currentPost.slug,
            attachmentUrl: row.wordpressAttachmentUrl,
            mediaAction,
            payloadMediaId: mediaId,
            heroImageUpdated: true,
            metaImageUpdated: syncMetaImage,
          });
        } catch (error) {
          report.dbUpdateFailures.push({
            localPostId: row.localPostId,
            localSlug: currentPost.slug,
            attachmentUrl: row.wordpressAttachmentUrl,
            reason: toReason(error),
            failedAt: new Date().toISOString(),
          });
          report.summary.dbUpdateFailures += 1;
          logProcessedRow({
            localPostId: row.localPostId,
            slug: currentPost.slug,
            attachmentUrl: row.wordpressAttachmentUrl,
            mediaAction,
            payloadMediaId: mediaId,
            heroImageUpdated: false,
            metaImageUpdated: false,
            note: `db update failed: ${toReason(error)}`,
          });
        }

        persistReport(report);
      }
    }

    report.verification = await runVerification(pool, report);
    persistReport(report);
  } finally {
    await pool.end();
  }

  console.log("Featured-image migration finished.");
  console.log(`Successful uploads: ${report.summary.successfulUploads}`);
  console.log(`Successful post links: ${report.summary.successfulPostLinks}`);
  console.log(`Broken WordPress URLs: ${report.summary.brokenWordPressUrls}`);
  console.log(`Upload failures: ${report.summary.uploadFailures}`);
  console.log(`DB update failures: ${report.summary.dbUpdateFailures}`);
  if (report.verification) {
    console.log("Final verification:");
    console.log(`- total posts still missing heroImage: ${report.verification.postsStillMissingHeroImage}`);
    console.log(`- total media records: ${report.verification.totalMediaRecords}`);
    console.log(`- total media created in this run: ${report.verification.mediaRecordsCreatedThisRun}`);
    console.log(`- sample 10 updated posts with heroImage: ${JSON.stringify(report.verification.sampleUpdatedPosts)}`);
    console.log(`- sample 5 posts with meta.image populated: ${JSON.stringify(report.verification.sampleMetaImagePosts)}`);
    console.log(`- sample 5 reused image mappings: ${JSON.stringify(report.verification.sampleReusedImageMappings)}`);
  }
  console.log(`Report written to ${migrationReportPath}`);
}

main().catch((error) => {
  console.error("Featured-image migration failed.");
  console.error(error);
  process.exit(1);
});
