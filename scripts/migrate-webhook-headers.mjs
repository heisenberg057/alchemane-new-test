/**
 * One-time migration: encrypt any plaintext webhook headers at rest.
 *
 * Background
 * ----------
 * The Webhooks collection gained AES-256-GCM header encryption in April 2026.
 * Records created before that change store headers as a raw JSON string.
 * This script reads every webhook row, skips those already encrypted
 * (format: { __encrypted: true, data: "..." }), encrypts the rest, and
 * writes the ciphertext back directly via PostgreSQL.
 *
 * This bypasses Payload's runtime (no dev server needed) so it can be run
 * as a one-off maintenance task before or after deployment.
 *
 * Usage
 * -----
 *   node scripts/migrate-webhook-headers.mjs [--dry-run]
 *
 *   --dry-run   Print what would change without writing anything.
 *
 * Environment
 * -----------
 *   DATABASE_URL   Required — PostgreSQL connection string.
 *   PAYLOAD_SECRET Required — same value used by the running app.
 */

import crypto from "crypto";
import path from "path";
import { fileURLToPath } from "url";
import { readFileSync } from "fs";
import pg from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Load .env.local ───────────────────────────────────────────────────────────

function loadEnvLocal() {
  const envPath = path.join(__dirname, "../.env.local");
  try {
    const text = readFileSync(envPath, "utf8");
    for (const line of text.split("\n")) {
      const m = line.match(/^([^#=\s][^=]*)=(.*)$/);
      if (m && !process.env[m[1].trim()]) {
        process.env[m[1].trim()] = m[2].trim();
      }
    }
  } catch { /* .env.local may not exist in CI */ }
}
loadEnvLocal();

// ── Config ────────────────────────────────────────────────────────────────────

const DRY_RUN = process.argv.includes("--dry-run");
const DATABASE_URL = process.env.DATABASE_URL;
const SECRET = process.env.PAYLOAD_SECRET;

if (!DATABASE_URL) {
  console.error("ERROR: DATABASE_URL is not set. Aborting.");
  process.exit(1);
}

if (!SECRET) {
  console.error("ERROR: PAYLOAD_SECRET is not set. Aborting.");
  process.exit(1);
}

// ── Encryption (mirrors src/lib/security/headerEncryption.ts) ─────────────────

const ALGO = "aes-256-gcm";
const IV_LEN = 12; // bytes

/** Derive a 256-bit key from PAYLOAD_SECRET (same as the app). */
function deriveKey(secret) {
  return crypto.createHash("sha256").update(secret).digest();
}

const KEY = deriveKey(SECRET);

/**
 * Encrypts a plain-object headers map to the `{ __encrypted, data }` envelope.
 * Returns the input unchanged if it is already in that format.
 */
function encryptHeaders(headers) {
  if (!headers || typeof headers !== "object" || Array.isArray(headers)) {
    return {};
  }
  if (headers.__encrypted === true) return headers;

  const plaintext = Buffer.from(JSON.stringify(headers));
  const iv = crypto.randomBytes(IV_LEN);
  const cipher = crypto.createCipheriv(ALGO, KEY, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const authTag = cipher.getAuthTag();

  const packed = Buffer.concat([iv, authTag, ciphertext]);
  return { __encrypted: true, data: packed.toString("base64") };
}

// ── Database ──────────────────────────────────────────────────────────────────

const pool = new pg.Pool({ connectionString: DATABASE_URL });

const { rows } = await pool.query("SELECT id, name, headers FROM webhooks");

if (rows.length === 0) {
  console.log("No webhook records found — nothing to migrate.");
  await pool.end();
  process.exit(0);
}

console.log(`Found ${rows.length} webhook record(s).`);
if (DRY_RUN) console.log("DRY RUN — no changes will be written.\n");

let migrated = 0;
let skipped = 0;
let failed = 0;

for (const row of rows) {
  let parsed;
  try {
    parsed = row.headers ? JSON.parse(row.headers) : null;
  } catch {
    console.warn(`  [SKIP] id=${row.id} name="${row.name}" — headers is not valid JSON`);
    failed++;
    continue;
  }

  if (!parsed || Object.keys(parsed).length === 0) {
    console.log(`  [SKIP] id=${row.id} name="${row.name}" — no headers to encrypt`);
    skipped++;
    continue;
  }

  if (parsed.__encrypted === true) {
    console.log(`  [SKIP] id=${row.id} name="${row.name}" — already encrypted`);
    skipped++;
    continue;
  }

  const encrypted = encryptHeaders(parsed);

  if (DRY_RUN) {
    console.log(
      `  [DRY]  id=${row.id} name="${row.name}" — would encrypt ${Object.keys(parsed).length} header key(s): ${Object.keys(parsed).join(", ")}`
    );
    migrated++;
    continue;
  }

  try {
    await pool.query(
      "UPDATE webhooks SET headers = $1 WHERE id = $2",
      [JSON.stringify(encrypted), row.id]
    );
    console.log(
      `  [DONE] id=${row.id} name="${row.name}" — encrypted ${Object.keys(parsed).length} header key(s): ${Object.keys(parsed).join(", ")}`
    );
    migrated++;
  } catch (err) {
    console.error(`  [FAIL] id=${row.id} name="${row.name}" — ${err.message}`);
    failed++;
  }
}

await pool.end();

console.log(
  `\nDone. migrated=${migrated}  skipped=${skipped}  failed=${failed}`
);
if (DRY_RUN && migrated > 0) {
  console.log("Re-run without --dry-run to apply changes.");
}
if (failed > 0) {
  process.exit(1);
}
