/**
 * reprocess-wp-posts-from-html.ts
 *
 * Phase 3 migration: reprocess all imported posts from original
 * `wordpress_html` → normalized canonical `blocks_data`.
 *
 * Uses the canonical wordpressToBlocks transformer (src/lib/blog/wordpressToBlocks.ts)
 * via tsx. Writes directly to PostgreSQL (DATABASE_URL).
 *
 * Usage:
 *   npm run reprocess-wp-posts:dry     (dry run — no DB writes)
 *   npm run reprocess-wp-posts         (live run — writes blocks_data)
 *
 *   Or directly:
 *   npx tsx scripts/reprocess-wp-posts-from-html.ts --dry
 *   npx tsx scripts/reprocess-wp-posts-from-html.ts
 *
 * Flags:
 *   --dry          Print what would be written, touch nothing in DB
 *   --post <slug>  Process only a single post (for targeted testing)
 *   --force        Reprocess even posts that already have canonical blocks_data
 *
 * Safety guarantees:
 *   - Creates a backup table `posts_migration_backup_<runId>` BEFORE any writes.
 *   - Only writes `blocks_data` and `ai_optimization_faq_schema`. Never touches
 *     wordpress_html, slug, title, meta_*, seo_analysis_*, canonical_url, etc.
 *   - Skips a post if the transformer returns 0 blocks or no heading/text blocks.
 *   - All skipped/failed posts are recorded in the JSON report.
 *   - Produces a machine-readable JSON report: migration-report.json
 *   - Also syncs to _posts_v so Payload's draft versioning system serves
 *     blocksData correctly to authenticated admin users.
 */

import pg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { readFileSync } from 'fs';

// ─── Bootstrap ────────────────────────────────────────────────────────────────

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPORT_PATH = path.join(__dirname, '../migration-report.json');

const IS_DRY   = process.argv.includes('--dry');
const IS_FORCE = process.argv.includes('--force');
const SINGLE_POST = (() => {
  const idx = process.argv.indexOf('--post');
  return idx !== -1 ? process.argv[idx + 1] : null;
})();

// Generate a short run id used to name the backup table and tag the report
const RUN_ID = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const BACKUP_TABLE = `posts_migration_backup_${RUN_ID.replace(/-/g, '_')}`;

// ─── Load .env.local ──────────────────────────────────────────────────────────

function loadEnvLocal() {
  const envPath = path.join(__dirname, '../.env.local');
  try {
    const text = readFileSync(envPath, 'utf8');
    for (const line of text.split('\n')) {
      const m = line.match(/^([^#=\s][^=]*)=(.*)$/);
      if (m && !process.env[m[1].trim()]) {
        process.env[m[1].trim()] = m[2].trim();
      }
    }
  } catch { /* .env.local may not exist in CI */ }
}
loadEnvLocal();

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL is not set. Cannot connect to PostgreSQL.');
  process.exit(1);
}

// ─── Import canonical transformer ─────────────────────────────────────────────
// Run via `npx tsx` so TypeScript imports resolve without a build step.
import { wordpressToBlocks } from '../src/lib/blog/wordpressToBlocks.ts';

// ─── DB setup ─────────────────────────────────────────────────────────────────

const pool = new pg.Pool({ connectionString: DATABASE_URL });

// ─── Build post query ─────────────────────────────────────────────────────────

let postsQueryText: string;
const postsQueryParams: string[] = [];

if (SINGLE_POST) {
  postsQueryText = `
    SELECT id, slug, title, wordpress_html, blocks_data, content
    FROM posts
    WHERE slug = $1 AND wordpress_html IS NOT NULL AND wordpress_html != ''
  `;
  postsQueryParams.push(SINGLE_POST);
} else {
  // Default and --force: reprocess all posts that have wordpress_html.
  // Without --force, posts with canonical { version: 1 } blocks_data are also
  // reprocessed to pick up any transformer improvements since the last run.
  postsQueryText = `
    SELECT id, slug, title, wordpress_html, blocks_data, content
    FROM posts
    WHERE wordpress_html IS NOT NULL AND wordpress_html != ''
    ORDER BY id ASC
  `;
}

const postsResult = await pool.query(postsQueryText, postsQueryParams);
const posts = postsResult.rows;

// ─── Header ───────────────────────────────────────────────────────────────────

console.log('');
console.log('══════════════════════════════════════════════════════════════');
console.log('  WordPress HTML → Canonical Blocks Migration  (PostgreSQL)');
console.log('══════════════════════════════════════════════════════════════');
console.log(`  Run ID   : ${RUN_ID}`);
console.log(`  Mode     : ${IS_DRY ? 'DRY RUN — no DB writes' : 'LIVE WRITE'}`);
console.log(`  Target   : ${SINGLE_POST ? `single post "${SINGLE_POST}"` : `all ${posts.length} posts`}`);
console.log(`  Force    : ${IS_FORCE ? 'yes (reprocess all)' : 'no'}`);
console.log(`  DB       : ${DATABASE_URL.replace(/:[^:@]+@/, ':***@')}`);
if (!IS_DRY) {
  console.log(`  Backup   : ${BACKUP_TABLE}`);
}
console.log('══════════════════════════════════════════════════════════════');
console.log('');

if (posts.length === 0) {
  console.log('  Nothing to process — no matching posts found.');
  await pool.end();
  process.exit(0);
}

// ─── Create backup table (live runs only) ────────────────────────────────────

if (!IS_DRY) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS "${BACKUP_TABLE}" (
      id               INTEGER NOT NULL,
      slug             TEXT,
      title            TEXT,
      wordpress_html   TEXT,
      old_blocks_data  TEXT,
      old_content      TEXT,
      backed_up_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);

  // Bulk-insert all post backups inside a single transaction before touching anything
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const row of posts) {
      await client.query(
        `INSERT INTO "${BACKUP_TABLE}" (id, slug, title, wordpress_html, old_blocks_data, old_content)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [row.id, row.slug, row.title, row.wordpress_html, row.blocks_data ?? null, row.content ?? null]
      );
    }
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('ERROR: Backup failed — aborting.', err);
    await pool.end();
    process.exit(1);
  } finally {
    client.release();
  }

  console.log(`  Backup created: ${BACKUP_TABLE} (${posts.length} rows)\n`);
}

// ─── Per-post processing ──────────────────────────────────────────────────────

const reportRows: unknown[] = [];
let successCount = 0;
let skippedCount = 0;
let failedCount  = 0;
let totalWarnings = 0;
let totalTocRemoved = 0;

for (let i = 0; i < posts.length; i++) {
  const post = posts[i];
  const label = `[${String(i + 1).padStart(3, ' ')}/${posts.length}]`;
  const shortSlug = (post.slug || String(post.id)).slice(0, 55);

  // Count blocks in existing blocks_data for before/after comparison
  let blocksBefore = 0;
  try {
    const existing = post.blocks_data ? JSON.parse(post.blocks_data) : null;
    if (existing) {
      blocksBefore = Array.isArray(existing) ? existing.length : (existing.blocks?.length ?? 0);
    }
  } catch { /* malformed — 0 is fine */ }

  let result;
  try {
    result = wordpressToBlocks(post.wordpress_html);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.log(`  ${label} FAIL  ${shortSlug}`);
    console.log(`         Error: ${msg}`);
    failedCount++;
    reportRows.push({
      id: post.id, slug: post.slug, status: 'failed',
      blocksBefore, blocksAfter: 0, warnings: 0, tocRemoved: 0,
      reason: `transformer threw: ${msg}`,
    });
    continue;
  }

  const { blocks, faqData, warnings, stats } = result;
  totalWarnings  += warnings.length;
  totalTocRemoved += stats.tocTablesRemoved;

  // ── Safety check: must have substantive content ──────────────────────────
  const hasHeadingOrText = blocks.some((b: { type: string }) => b.type === 'heading' || b.type === 'text');
  if (blocks.length === 0 || !hasHeadingOrText) {
    const reason = blocks.length === 0
      ? 'transformer returned 0 blocks'
      : 'no heading or text block in output';
    console.log(`  ${label} SKIP  ${shortSlug}`);
    console.log(`         Reason: ${reason}`);
    skippedCount++;
    reportRows.push({
      id: post.id, slug: post.slug, status: 'skipped',
      blocksBefore, blocksAfter: blocks.length, warnings: warnings.length,
      tocRemoved: stats.tocTablesRemoved, reason,
    });
    continue;
  }

  // ── Build canonical payload ───────────────────────────────────────────────
  const canonicalPayload = JSON.stringify({
    version: 1,
    source: 'wordpress-import',
    blocks,
  });

  // ── Log per-post result ───────────────────────────────────────────────────
  const warningCodes = warnings.map((w: { code: string }) => w.code);
  const uniqueWarnCodes = [...new Set(warningCodes)];
  const delta = blocks.length - blocksBefore;
  const deltaStr = delta >= 0 ? `+${delta}` : `${delta}`;
  const faqLine = faqData.length > 0 ? `  faq_pairs: ${faqData.length}` : '';

  if (IS_DRY) {
    console.log(`  ${label} DRY   ${shortSlug}`);
    console.log(`         blocks: ${blocksBefore} → ${blocks.length} (${deltaStr})  toc_removed: ${stats.tocTablesRemoved}  warnings: ${warnings.length}${faqLine}`);
    if (uniqueWarnCodes.length) {
      console.log(`         warn codes: ${(uniqueWarnCodes as string[]).join(', ')}`);
    }
  } else {
    const faqSchemaPayload = faqData.length > 0 ? JSON.stringify(faqData) : null;

    // Write to posts table
    await pool.query(
      `UPDATE posts SET blocks_data = $1, ai_optimization_faq_schema = $2 WHERE id = $3`,
      [canonicalPayload, faqSchemaPayload, post.id]
    );

    // Sync to _posts_v so Payload's draft versioning system serves blocksData
    // to authenticated admin users (Payload reads from _posts_v for drafts-enabled collections)
    await pool.query(
      `UPDATE _posts_v SET version_blocks_data = $1, version_ai_optimization_faq_schema = $2 WHERE parent_id = $3`,
      [canonicalPayload, faqSchemaPayload, post.id]
    );

    console.log(`  ${label} OK    ${shortSlug}`);
    console.log(`         blocks: ${blocksBefore} → ${blocks.length} (${deltaStr})  toc_removed: ${stats.tocTablesRemoved}  warnings: ${warnings.length}${faqLine}`);
    if (uniqueWarnCodes.length) {
      console.log(`         warn codes: ${(uniqueWarnCodes as string[]).join(', ')}`);
    }
  }

  successCount++;
  reportRows.push({
    id: post.id,
    slug: post.slug,
    title: post.title,
    status: IS_DRY ? 'dry-ok' : 'ok',
    blocksBefore,
    blocksAfter: blocks.length,
    tocRemoved: stats.tocTablesRemoved,
    faqPairs: faqData.length,
    ...(faqData.length > 0 ? { faqData } : {}),
    warnings: warnings.length,
    warningCodes: uniqueWarnCodes,
    warningDetails: warnings.map((w: { code: string; message: string; context?: string }) => ({
      code: w.code, message: w.message, context: w.context?.slice(0, 80),
    })),
    stats,
  });
}

// ─── Summary ──────────────────────────────────────────────────────────────────

console.log('');
console.log('══════════════════════════════════════════════════════════════');
console.log('  Migration Summary');
console.log('══════════════════════════════════════════════════════════════');
console.log(`  Total posts    : ${posts.length}`);
console.log(`  Successful     : ${successCount}`);
if (skippedCount > 0) console.log(`  Skipped        : ${skippedCount}  (safety check failed — not written)`);
if (failedCount  > 0) console.log(`  Failed         : ${failedCount}  (transformer error)`);
console.log(`  Total warnings : ${totalWarnings}`);
console.log(`  TOC removed    : ${totalTocRemoved}`);
if (!IS_DRY) {
  console.log(`  Backup table   : ${BACKUP_TABLE}`);
  console.log(`  Report file    : migration-report.json`);
}
console.log('══════════════════════════════════════════════════════════════');
console.log('');

if (IS_DRY) {
  console.log('  DRY RUN — no changes written to database.');
  console.log('  Run without --dry to apply the migration.');
  console.log('');
}

// ─── Write JSON report ────────────────────────────────────────────────────────

const report = {
  runId: RUN_ID,
  mode: IS_DRY ? 'dry' : 'live',
  timestamp: new Date().toISOString(),
  database: 'postgresql',
  backupTable: IS_DRY ? null : BACKUP_TABLE,
  summary: {
    total: posts.length,
    successful: successCount,
    skipped: skippedCount,
    failed: failedCount,
    totalWarnings,
    totalTocRemoved,
  },
  posts: reportRows,
};

try {
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2), 'utf8');
  console.log(`  Report saved → migration-report.json`);
} catch (err) {
  console.warn('  Warning: could not write migration-report.json:', (err as Error).message);
}

console.log('');
await pool.end();
