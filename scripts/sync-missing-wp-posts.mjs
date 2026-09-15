/**
 * Sync missing published WordPress posts into Payload via WP REST API.
 *
 * Usage:
 *   node scripts/sync-missing-wp-posts.mjs --dry-run
 *   node scripts/sync-missing-wp-posts.mjs
 *   node scripts/sync-missing-wp-posts.mjs --slugs=slug-a,slug-b
 *
 * Auth: uses PAYLOAD_ADMIN_EMAIL + PAYLOAD_ADMIN_PASSWORD from .env / .env.local
 * WP: public REST (no WP admin password needed for published posts)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import axios from 'axios';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

dotenv.config({ path: path.join(ROOT, '.env') });
dotenv.config({ path: path.join(ROOT, '.env.local') });

const DRY_RUN = process.argv.includes('--dry-run');
const SLUGS_ARG = process.argv.find((a) => a.startsWith('--slugs='));
const ONLY_SLUGS = SLUGS_ARG
  ? new Set(
      SLUGS_ARG.replace('--slugs=', '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    )
  : null;

const WP_BASE = (process.env.WP_URL || 'https://americanhairline.com').replace(/\/$/, '');
const API_URL = process.env.PAYLOAD_URL
  ? `${String(process.env.PAYLOAD_URL).replace(/\/$/, '')}/api`
  : process.env.API_URL || 'http://localhost:3000/api';
const ADMIN_EMAIL =
  process.env.PAYLOAD_ADMIN_EMAIL || process.env.ADMIN_EMAIL || '';
const ADMIN_PASSWORD =
  process.env.PAYLOAD_ADMIN_PASSWORD ||
  process.env.ADMIN_PASSWORD ||
  process.env.ADMIN_MIGRATION_PASSWORD ||
  '';

const CATEGORY_MAP = {
  'Hair Transplants': 'hair-transplant',
  transplant: 'hair-transplant',
  'Hair Systems': 'hair-systems',
  'Hair Replacement Systems': 'hair-systems',
  'Non surgical hair replacement systems': 'hair-systems',
  'Scalp Micropigmentation': 'general-care',
  'Scalp Micro Pigmentation': 'general-care',
  smp: 'general-care',
  'Success Stories': 'success-stories',
  'General Care': 'general-care',
};

function stripHtml(value) {
  return String(value || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function decodeEntities(text) {
  return String(text || '')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;|&#8221;/g, '"');
}

function normalizeMetaDescription(raw, fallbacks = []) {
  let description = String(raw || '').trim();
  if (!description || description === '%%excerpt%%') description = '';
  if (!description) {
    for (const source of fallbacks) {
      const candidate = stripHtml(source);
      if (candidate) {
        description = candidate;
        break;
      }
    }
  }
  if (!description) return '';

  description = description.replace(/\s+/g, ' ').trim();

  // Payload requires 140–160 chars when meta.description is set.
  if (description.length > 160) {
    const hard = description.slice(0, 157).trimEnd();
    const lastSpace = hard.lastIndexOf(' ');
    description = `${(lastSpace > 120 ? hard.slice(0, lastSpace) : hard).trimEnd()}...`;
  }

  if (description.length > 0 && description.length < 140) {
    for (const source of fallbacks) {
      const extra = stripHtml(source);
      if (!extra || description.includes(extra.slice(0, 40))) continue;
      description = `${description} ${extra}`.replace(/\s+/g, ' ').trim();
      if (description.length >= 140) break;
    }
    if (description.length > 160) {
      description = `${description.slice(0, 157).trimEnd()}...`;
    }
    // If still short, omit field rather than fail validation.
    if (description.length < 140) return '';
  }

  return description;
}

function fitMetaTitle(raw, fallbackTitle) {
  let title = decodeEntities(stripHtml(raw || ''));
  title = title
    .replace(/\s*[-|–—]\s*American Hairline\s*$/i, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (!title) title = decodeEntities(stripHtml(fallbackTitle || ''));
  if (!title) return '';

  if (title.length > 60) {
    const hard = title.slice(0, 60).trimEnd();
    const lastSpace = hard.lastIndexOf(' ');
    title = (lastSpace > 40 ? hard.slice(0, lastSpace) : hard).trimEnd();
  }

  // Payload requires 40–60 when meta.title is set; omit if too short.
  if (title.length < 40) return '';
  return title.slice(0, 60);
}

function buildPayload(wpPost) {
  const title = decodeEntities(stripHtml(wpPost.title?.rendered || ''));
  const contentHtml = wpPost.content?.rendered || '';
  const excerptHtml = wpPost.excerpt?.rendered || '';
  const yoast = wpPost.yoast_head_json || {};
  const metaDescription = normalizeMetaDescription(yoast.description, [
    excerptHtml,
    contentHtml,
    title,
  ]);
  const metaTitle = fitMetaTitle(yoast.title, title);

  const meta = {};
  if (metaTitle) meta.title = metaTitle;
  if (metaDescription) meta.description = metaDescription;

  return {
    title,
    slug: wpPost.slug,
    wordpressHtml: contentHtml,
    ...(Object.keys(meta).length ? { meta } : {}),
    _status: 'published',
    publishedDate: new Date(wpPost.date_gmt || wpPost.date).toISOString(),
    category: mapCategory(wpPost),
  };
}

async function fetchAllWpPosts() {
  const posts = [];
  let page = 1;
  let totalPages = 1;
  while (page <= totalPages) {
    const url = `${WP_BASE}/wp-json/wp/v2/posts?per_page=100&page=${page}&status=publish&_embed=1`;
    const res = await axios.get(url, {
      headers: { 'User-Agent': 'AHL-CMS-Sync/1.0' },
      timeout: 120000,
      validateStatus: (s) => s >= 200 && s < 300,
    });
    totalPages = Number(res.headers['x-wp-totalpages'] || 1);
    posts.push(...(res.data || []));
    page += 1;
  }
  return posts;
}

async function loginPayload() {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    throw new Error(
      'Missing Payload admin credentials. Set PAYLOAD_ADMIN_EMAIL and PAYLOAD_ADMIN_PASSWORD (or ADMIN_MIGRATION_PASSWORD) in .env / .env.local'
    );
  }
  const loginRes = await axios.post(`${API_URL}/users/login`, {
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });
  const body = loginRes.data?.data ?? loginRes.data;
  const token = body.token || body.accessToken;
  if (!token) throw new Error('Login succeeded but no token returned');
  return axios.create({
    baseURL: API_URL,
    headers: { Authorization: `Bearer ${token}` },
  });
}

async function getLocalSlugs(api) {
  const slugs = new Set();
  let page = 1;
  let totalPages = 1;
  while (page <= totalPages) {
    const res = await api.get('/posts', {
      params: {
        limit: 100,
        page,
        depth: 0,
        'where[_status][equals]': 'published',
      },
    });
    totalPages = Number(res.data?.totalPages || 1);
    for (const doc of res.data?.docs || []) {
      if (doc.slug) slugs.add(String(doc.slug).toLowerCase());
    }
    page += 1;
  }
  // also include drafts so we don't duplicate
  page = 1;
  totalPages = 1;
  while (page <= totalPages) {
    const res = await api.get('/posts', {
      params: { limit: 100, page, depth: 0 },
    });
    totalPages = Number(res.data?.totalPages || 1);
    for (const doc of res.data?.docs || []) {
      if (doc.slug) slugs.add(String(doc.slug).toLowerCase());
    }
    page += 1;
  }
  return slugs;
}

function mapCategory(wpPost) {
  const terms = wpPost?._embedded?.['wp:term'] || [];
  const cats = [];
  for (const group of terms) {
    for (const t of group || []) {
      if (t?.taxonomy === 'category' && t?.name) cats.push(t.name);
    }
  }
  for (const name of cats) {
    if (CATEGORY_MAP[name]) return CATEGORY_MAP[name];
    if (CATEGORY_MAP[name.toLowerCase()]) return CATEGORY_MAP[name.toLowerCase()];
  }
  return undefined;
}

async function main() {
  console.log('==> Fetching WordPress published posts...');
  const wpPosts = await fetchAllWpPosts();
  console.log(`    WP published: ${wpPosts.length}`);

  console.log('==> Logging into Payload...');
  const api = await loginPayload();
  console.log('    Authenticated');

  console.log('==> Loading existing Payload slugs...');
  const localSlugs = await getLocalSlugs(api);
  console.log(`    Local posts (any status): ${localSlugs.size}`);

  let missing = wpPosts.filter((p) => !localSlugs.has(String(p.slug).toLowerCase()));
  if (ONLY_SLUGS) {
    missing = missing.filter((p) => ONLY_SLUGS.has(p.slug));
  }

  console.log(`==> Missing to import: ${missing.length}`);
  for (const p of missing.slice(0, 10)) {
    console.log(`    - ${p.date.slice(0, 10)}  ${p.slug}`);
  }
  if (missing.length > 10) console.log(`    ... +${missing.length - 10} more`);

  if (DRY_RUN) {
    console.log('\nDry run only — no writes.');
    process.exit(0);
  }

  let ok = 0;
  let fail = 0;
  const failures = [];

  for (const wpPost of missing) {
    const payload = buildPayload(wpPost);
    try {
      console.log(`📤 Creating [${payload.slug}]...`);
      await api.post('/posts', payload);
      ok += 1;
    } catch (err) {
      fail += 1;
      const reason = err.response?.data || err.message;
      failures.push({ slug: payload.slug, reason });
      console.error(`❌ Failed [${payload.slug}]`, reason);
    }
  }

  const report = {
    wpTotal: wpPosts.length,
    localBefore: localSlugs.size,
    missingAttempted: missing.length,
    created: ok,
    failed: fail,
    failures,
    at: new Date().toISOString(),
  };
  const outPath = path.join(ROOT, 'reports', 'sync-missing-wp-posts.json');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2));

  console.log('\n--- Sync Summary ---');
  console.log(`✅ Created: ${ok}`);
  console.log(`❌ Failed:  ${fail}`);
  console.log(`📄 Report:  ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
