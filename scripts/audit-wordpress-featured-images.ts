import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";
import {
  buildAuditRows,
  buildAuditSummary,
  getAppRoot,
  getReportsDir,
  getWorkspaceRoot,
  loadScriptEnv,
  maskConnectionString,
  parseStringFlag,
  parseWordPressFeaturedImageRecords,
  type FeaturedImageAuditReport,
  type FeaturedImageAuditRow,
  writeCsvReport,
  writeJsonReport,
} from "./lib/featured-image-utils.ts";

type LocalPostRow = {
  id: number;
  slug: string;
  hero_image_id: number | null;
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appRoot = getAppRoot(__dirname);
const workspaceRoot = getWorkspaceRoot(appRoot);
const reportsDir = getReportsDir(appRoot);
const xmlPath =
  parseStringFlag(process.argv, "xml") ??
  path.join(workspaceRoot, "SEO WordPress", "POSTS.xml");
const jsonReportPath = path.join(reportsDir, "featured-image-audit.json");
const csvReportPath = path.join(reportsDir, "featured-image-audit.csv");

loadScriptEnv(appRoot);

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to audit local Payload posts.");
}
const requiredDatabaseUrl = databaseUrl;

async function fetchLocalPosts(): Promise<
  Array<{ localPostId: number; localSlug: string; existingHeroImage: number | null }>
> {
  const pool = new pg.Pool({ connectionString: requiredDatabaseUrl });

  try {
    const result = await pool.query<LocalPostRow>(
      `
        SELECT id, slug, hero_image_id
        FROM posts
        ORDER BY id ASC
      `,
    );

    return result.rows.map((row) => ({
      localPostId: row.id,
      localSlug: row.slug,
      existingHeroImage: row.hero_image_id,
    }));
  } finally {
    await pool.end();
  }
}

function buildCsvRows(rows: FeaturedImageAuditRow[]) {
  return rows.map((row) => ({
    local_post_id: row.localPostId,
    local_slug: row.localSlug,
    existing_hero_image: row.existingHeroImage,
    wordpress_post_id: row.wordpressPostId,
    wordpress_post_slug: row.wordpressPostSlug,
    wordpress_post_title: row.wordpressPostTitle,
    wordpress_thumbnail_id: row.wordpressThumbnailId,
    wordpress_attachment_url: row.wordpressAttachmentUrl,
    status: row.status,
  }));
}

async function main(): Promise<void> {
  console.log("Starting featured-image audit...");
  console.log(`WordPress XML: ${xmlPath}`);

  const wordpressRecords = parseWordPressFeaturedImageRecords(xmlPath);
  const localPosts = await fetchLocalPosts();
  const rows = buildAuditRows(wordpressRecords, localPosts);
  const summary = buildAuditSummary(rows);

  const report: FeaturedImageAuditReport = {
    generatedAt: new Date().toISOString(),
    sourceXmlPath: xmlPath,
    localDatabaseUrlMasked: maskConnectionString(requiredDatabaseUrl),
    summary,
    rows,
  };

  writeJsonReport(jsonReportPath, report);
  writeCsvReport(csvReportPath, buildCsvRows(rows));

  console.log("Featured-image audit complete.");
  console.log(`Rows analyzed: ${summary.totalWordPressPosts}`);
  console.log(`Ready: ${summary.ready}`);
  console.log(`Already linked: ${summary.alreadyLinked}`);
  console.log(`Missing post: ${summary.missingPost}`);
  console.log(`Missing attachment: ${summary.missingAttachment}`);
  console.log(`JSON report: ${jsonReportPath}`);
  console.log(`CSV report: ${csvReportPath}`);
}

main().catch((error) => {
  console.error("Featured-image audit failed.");
  console.error(error);
  process.exit(1);
});
