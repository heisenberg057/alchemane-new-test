/**
 * Read Yoast SEO fields from a WordPress WXRF export and PATCH Payload posts
 * by matching wp:post_name to post slug.
 *
 * Requires: dev server + Postgres, ADMIN_EMAIL + ADMIN_MIGRATION_PASSWORD in .env.local
 *
 * Usage:
 *   npm run import-wp-seo
 *
 * Optional:
 *   WP_POSTS_XML_PATH=/absolute/path/to/POSTS.xml
 *   PAYLOAD_URL=http://localhost:3000
 */

const fs = require("fs");
const path = require("path");
const axios = require("axios");
const dotenv = require("dotenv");
const { XMLParser } = require("fast-xml-parser");

dotenv.config({ path: path.join(__dirname, "../.env.local") });
dotenv.config({ path: path.join(__dirname, "../.env") });

const BASE =
  process.env.PAYLOAD_URL?.replace(/\/$/, "") || "http://localhost:3000";
const API = `${BASE}/api`;
const XML_PATH =
  process.env.WP_POSTS_XML_PATH ||
  path.join(__dirname, "../../SEO WordPress/POSTS.xml");

const ADMIN_EMAIL = (
  process.env.PAYLOAD_ADMIN_EMAIL ||
  process.env.ADMIN_EMAIL ||
  ""
).trim();
const ADMIN_PASSWORD =
  process.env.PAYLOAD_ADMIN_PASSWORD ||
  process.env.ADMIN_MIGRATION_PASSWORD ||
  process.env.ADMIN_PASSWORD;

const delay = (ms) => new Promise((r) => setTimeout(r, ms));

/** Must match src/collections/Posts.ts — group `meta`, fields `title` & `description`. */
const META_TITLE_MIN = 40;
const META_TITLE_MAX = 60;
const META_DESC_MIN = 140;
const META_DESC_MAX = 160;

/**
 * Values for PATCH body: { meta: { title?, description?, keywords? } }
 * (`meta` = group name; nested keys are field `name`s from Posts.ts.)
 */
function payloadMetaTitleFromSource(raw) {
  if (!isUsableMetaTitle(raw)) return undefined;
  let s = String(raw).trim();
  if (s.length > META_TITLE_MAX) s = s.slice(0, META_TITLE_MAX);
  if (s.length < META_TITLE_MIN) return undefined;
  return s;
}

function payloadMetaDescriptionFromSource(raw) {
  if (!isUsableMetaDescription(raw)) return undefined;
  let s = String(raw).trim();
  if (s.length > META_DESC_MAX) s = s.slice(0, META_DESC_MAX);
  if (s.length < META_DESC_MIN) return undefined;
  return s;
}

function stripHtml(value) {
  return String(value || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function fallbackMetaDescription(...sources) {
  let text = "";
  for (const source of sources) {
    const candidate = stripHtml(source);
    if (candidate) {
      text = candidate;
      break;
    }
  }

  if (!text) return undefined;
  if (text.length > META_DESC_MAX) {
    text = `${text.slice(0, META_DESC_MAX - 3).trimEnd()}...`;
  }
  if (text.length < META_DESC_MIN) return undefined;
  return text;
}

function normalizeText(v) {
  if (v == null) return "";
  if (typeof v === "object" && v !== null && "#text" in v) {
    return String(v["#text"]).trim();
  }
  return String(v).trim();
}

/** Walk wp:postmeta entries and return meta_value for the given key. */
function getMetaValue(item, key) {
  const raw = item["wp:postmeta"];
  const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
  for (const m of list) {
    const mk = m["wp:meta_key"];
    const metaKey =
      typeof mk === "object" && mk != null && "#text" in mk
        ? mk["#text"]
        : mk;
    if (String(metaKey) !== key) continue;
    const mv = m["wp:meta_value"];
    if (typeof mv === "object" && mv != null && "#text" in mv) {
      return mv["#text"];
    }
    return mv ?? "";
  }
  return undefined;
}

function isUsableMetaDescription(s) {
  if (s == null) return false;
  const t = String(s).trim();
  if (!t) return false;
  if (t === "%%excerpt%%") return false;
  if (t.includes("%%")) return false;
  return true;
}

function isUsableMetaTitle(s) {
  if (s == null) return false;
  const t = String(s).trim();
  if (!t) return false;
  if (t.includes("%%")) return false;
  return true;
}

function isUsableFocusKw(s) {
  if (s == null) return false;
  return String(s).trim().length > 0;
}

async function login() {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error(
      "Set ADMIN_EMAIL and ADMIN_MIGRATION_PASSWORD in .env.local (same as migrate-data)."
    );
  }
  const { data } = await axios.post(
    `${API}/users/login`,
    { email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
    { timeout: 60_000 }
  );
  const inner = data?.data ?? data;
  const token = inner?.token || inner?.accessToken;
  if (!token) {
    throw new Error(`Login failed: ${JSON.stringify(data)}`);
  }
  return token;
}

async function main() {
  if (!fs.existsSync(XML_PATH)) {
    console.error(`XML file not found: ${XML_PATH}`);
    process.exit(1);
  }

  console.log(`Reading: ${XML_PATH}`);
  console.log(`API: ${API}\n`);

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

  const xmlContent = fs.readFileSync(XML_PATH, "utf-8");
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
  });
  const jsonObj = parser.parse(xmlContent);
  const rawItems = jsonObj.rss?.channel?.item;
  const items = Array.isArray(rawItems)
    ? rawItems
    : rawItems
      ? [rawItems]
      : [];

  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for (const item of items) {
    const postType = normalizeText(item["wp:post_type"]);
    if (postType !== "post") continue;

    const slug = normalizeText(item["wp:post_name"]);
    const title = normalizeText(item.title);
      const metadescRaw = getMetaValue(item, "_yoast_wpseo_metadesc");
      const focuskwRaw = getMetaValue(item, "_yoast_wpseo_focuskw");
      const excerptRaw = item["excerpt:encoded"];
      const contentRaw = item["content:encoded"];

      const metaTitle = payloadMetaTitleFromSource(title);
      const metaDescription =
        payloadMetaDescriptionFromSource(metadescRaw) ||
        fallbackMetaDescription(excerptRaw, contentRaw);
    const kwOk = isUsableFocusKw(focuskwRaw);

    if (!slug) {
      skipped += 1;
      await delay(100);
      continue;
    }

    if (!metaTitle && !metaDescription && !kwOk) {
      skipped += 1;
      await delay(100);
      continue;
    }

    const findRes = await client.get("/posts", {
      params: {
        "where[slug][equals]": slug,
        limit: 1,
        depth: 0,
      },
    });

    if (findRes.status !== 200) {
      console.error(
        `[import-wp-seo] GET posts failed for slug=${slug}`,
        findRes.status,
        findRes.data
      );
      failed += 1;
      await delay(100);
      continue;
    }

    const doc = findRes.data?.docs?.[0];
    if (!doc) {
      skipped += 1;
      await delay(100);
      continue;
    }

    const id = doc.id;
    /** @type {Record<string, string>} */
    const meta = {};
    if (metaTitle) meta.title = metaTitle;
    if (metaDescription) meta.description = metaDescription;
    if (kwOk) meta.keywords = String(focuskwRaw).trim();

    if (Object.keys(meta).length === 0) {
      skipped += 1;
      await delay(100);
      continue;
    }

    const patchRes = await client.patch(`/posts/${id}`, { meta });

    if (patchRes.status >= 200 && patchRes.status < 300) {
      updated += 1;
      console.log(
        `Updated post: ${slug} — title: ${metaTitle ? "yes" : "no"}, desc: ${metaDescription ? "yes" : "no"}`
      );
    } else {
      failed += 1;
      console.error(
        `[import-wp-seo] PATCH failed slug=${slug} id=${id}`,
        patchRes.status,
        patchRes.data
      );
    }

    await delay(100);
  }

  console.log(
    `\nDone: ${updated} posts updated, ${skipped} skipped (no SEO data), ${failed} failed`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
