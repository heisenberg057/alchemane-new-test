/**
 * Fill missing SEO fields on Payload Pages from WordPress SEO exports (CSV + JSON-LD).
 *
 * Reads:
 *   ../../SEO WordPress/meta_description_all.csv
 *   ../../SEO WordPress/canonicals_all.csv
 *   ../../SEO WordPress/WordPress JSON-LD/*.json
 *
 * Requires: npm run dev (or API reachable), ADMIN_EMAIL + ADMIN_MIGRATION_PASSWORD in .env.local
 *
 *   npm run import-wp-pages-seo
 *
 * Optional:
 *   PAYLOAD_URL=http://localhost:3000
 */

const fs = require("fs");
const path = require("path");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "../.env.local") });
dotenv.config({ path: path.join(__dirname, "../.env") });

const BASE = process.env.PAYLOAD_URL?.replace(/\/$/, "") || "http://localhost:3000";
const API = `${BASE}/api`;

const META_CSV = path.join(
  __dirname,
  "../../SEO WordPress/meta_description_all.csv"
);
const CANONICAL_CSV = path.join(
  __dirname,
  "../../SEO WordPress/canonicals_all.csv"
);
const JSONLD_DIR = path.join(
  __dirname,
  "../../SEO WordPress/WordPress JSON-LD"
);

const ADMIN_EMAIL = process.env.ADMIN_EMAIL?.trim();
const ADMIN_PASSWORD = process.env.ADMIN_MIGRATION_PASSWORD;

const META_MIN_LEN = 50;
const DELAY_MS = 100;

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

/** Parse one CSV line with quoted fields (RFC-style). */
function parseCsvLine(line) {
  const out = [];
  let cur = "";
  let i = 0;
  let inQuotes = false;
  while (i < line.length) {
    const c = line[i];
    if (c === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i += 2;
        continue;
      }
      inQuotes = !inQuotes;
      i++;
      continue;
    }
    if (c === "," && !inQuotes) {
      out.push(cur);
      cur = "";
      i++;
      continue;
    }
    cur += c;
    i++;
  }
  out.push(cur);
  return out;
}

function parseCsvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error("File not found:", filePath);
    return { headers: [], rows: [] };
  }
  const raw = fs.readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");
  const lines = raw.split(/\r?\n/).filter((l) => l.length > 0);
  if (lines.length === 0) return { headers: [], rows: [] };
  const headers = parseCsvLine(lines[0]).map((h) => h.trim());
  const rows = [];
  for (let li = 1; li < lines.length; li++) {
    const cells = parseCsvLine(lines[li]);
    const row = {};
    headers.forEach((h, idx) => {
      row[h] = cells[idx] != null ? cells[idx] : "";
    });
    rows.push(row);
  }
  return { headers, rows };
}

function normalizeAddress(addr) {
  try {
    const u = new URL(String(addr).trim());
    const pathname = u.pathname.replace(/\/$/, "") || "/";
    return `${u.origin}${pathname}`;
  } catch {
    return String(addr).trim();
  }
}

/** pathname without trailing slash; "/" → home */
function urlToSlug(address) {
  try {
    const u = new URL(String(address).trim());
    let p = u.pathname.replace(/\/$/, "") || "";
    if (!p || p === "/") return "home";
    return p.replace(/^\//, "");
  } catch {
    return null;
  }
}

function isEmpty(v) {
  if (v == null) return true;
  if (typeof v === "string") return v.trim() === "";
  return false;
}

function readSchemaJsonForSlug(slug) {
  if (!slug || !fs.existsSync(JSONLD_DIR)) return null;
  const candidates = [
    path.join(JSONLD_DIR, `${slug} schema.json`),
    path.join(JSONLD_DIR, `${slug.split("/").pop()} schema.json`),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) {
      try {
        const raw = fs.readFileSync(p, "utf8");
        return JSON.parse(raw);
      } catch (e) {
        console.warn("Invalid JSON:", p, e.message);
        return null;
      }
    }
  }
  return null;
}

async function login() {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error(
      "Set ADMIN_EMAIL and ADMIN_MIGRATION_PASSWORD in .env.local"
    );
  }
  const { data } = await axios.post(
    `${API}/users/login`,
    { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
    { timeout: 60_000, validateStatus: () => true }
  );
  if (data?.success === false || data?.message === "Invalid credentials") {
    throw new Error(`Login failed: ${JSON.stringify(data)}`);
  }
  const inner = data?.data ?? data;
  const token = inner?.token || inner?.accessToken;
  if (!token) {
    throw new Error(`Login failed: ${JSON.stringify(data)}`);
  }
  return token;
}

async function main() {
  console.log(`API: ${API}\n`);

  const metaParsed = parseCsvFile(META_CSV);
  const canonParsed = parseCsvFile(CANONICAL_CSV);

  const metaByUrl = new Map();
  for (const row of metaParsed.rows) {
    const addr = row["Address"];
    if (!addr) continue;
    metaByUrl.set(normalizeAddress(addr), row);
  }

  const canonByUrl = new Map();
  for (const row of canonParsed.rows) {
    const addr = row["Address"];
    if (!addr) continue;
    canonByUrl.set(normalizeAddress(addr), row);
  }

  const allUrls = new Set([...metaByUrl.keys(), ...canonByUrl.keys()]);

  const token = await login();
  const client = axios.create({
    baseURL: API,
    timeout: 120_000,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    validateStatus: () => true,
  });

  let updated = 0;
  let skippedComplete = 0;
  let skippedNoop = 0;
  let failed = 0;

  for (const urlKey of allUrls) {
    const slug = urlToSlug(urlKey);
    if (!slug) {
      failed++;
      await delay(DELAY_MS);
      continue;
    }

    const metaRow = metaByUrl.get(urlKey);
    const canonRow = canonByUrl.get(urlKey);

    const rawMetaDesc =
      metaRow?.["Meta Description 1"] != null
        ? String(metaRow["Meta Description 1"]).trim()
        : "";
    const usableMeta =
      rawMetaDesc.length >= META_MIN_LEN ? rawMetaDesc : "";

    const rawCanon =
      canonRow?.["Canonical Link Element 1"] != null
        ? String(canonRow["Canonical Link Element 1"]).trim()
        : "";

    let schemaArray = readSchemaJsonForSlug(slug);

    const findRes = await client.get("/pages", {
      params: {
        "where[slug][equals]": slug,
        limit: 1,
        depth: 0,
      },
    });

    if (findRes.status !== 200) {
      console.warn(`GET pages failed [${slug}]:`, findRes.status, findRes.data);
      failed++;
      await delay(DELAY_MS);
      continue;
    }

    const doc = findRes.data?.docs?.[0];
    if (!doc?.id) {
      console.warn("No page for slug:", slug);
      failed++;
      await delay(DELAY_MS);
      continue;
    }

    const hasMeta = !isEmpty(doc.metaDescription);
    const hasCanon = !isEmpty(doc.canonicalUrl);
    const hasSchema = !isEmpty(doc.customSchema);

    if (hasMeta && hasCanon && hasSchema) {
      skippedComplete++;
      await delay(DELAY_MS);
      continue;
    }

    const patch = {};

    if (!hasMeta && usableMeta) {
      patch.metaDescription = usableMeta;
    }

    if (!hasCanon && rawCanon) {
      patch.canonicalUrl = rawCanon;
    }

    if (!hasSchema && schemaArray != null) {
      patch.customSchema = JSON.stringify(schemaArray);
      patch.enableSchema = true;
    }

    if (Object.keys(patch).length === 0) {
      skippedNoop++;
      await delay(DELAY_MS);
      continue;
    }

    const patchRes = await client.patch(`/pages/${doc.id}`, patch);

    if (patchRes.status >= 200 && patchRes.status < 300) {
      updated++;
      const d = patch.metaDescription ? "yes" : "no";
      const c = patch.canonicalUrl ? "yes" : "no";
      const s = patch.customSchema ? "yes" : "no";
      console.log(
        `Updated page: ${slug} — desc: ${d}, canonical: ${c}, schema: ${s}`
      );
    } else {
      console.warn(`PATCH failed [${slug}]:`, patchRes.status, patchRes.data);
      failed++;
    }

    await delay(DELAY_MS);
  }

  console.log(
    `\nDone: ${updated} updated, ${skippedComplete} skipped (already complete), ${failed} failed`
  );
  if (skippedNoop > 0) {
    console.log(`Skipped (nothing to apply from export): ${skippedNoop}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
