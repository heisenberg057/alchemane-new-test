/**
 * Upserts Payload Pages for every legacy marketing route (see src/config/legacy-marketing-page-slugs.ts).
 * Pulls title, meta, canonical from src/config/legacy-seo-map.ts when present.
 *
 *   cd AmericanHairline-Unified && npm run sync-legacy-pages
 *
 * Requires: PAYLOAD_URL, PAYLOAD_ADMIN_EMAIL, PAYLOAD_ADMIN_PASSWORD (from .env)
 */
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const BASE = process.env.PAYLOAD_URL || 'http://127.0.0.1:3000';
const API = `${String(BASE).replace(/\/$/, '')}/api`;
const email = process.env.PAYLOAD_ADMIN_EMAIL;
const password = process.env.PAYLOAD_ADMIN_PASSWORD;

const SLUGS_FILE = path.join(__dirname, '../src/config/legacy-marketing-page-slugs.ts');
const SEO_MAP_FILE = path.join(__dirname, '../src/config/legacy-seo-map.ts');

function readSlugs() {
  const raw = fs.readFileSync(SLUGS_FILE, 'utf8');
  const m = raw.match(/LEGACY_MARKETING_PAGE_SLUGS = \[([\s\S]*?)\]\s*as const/);
  if (!m) throw new Error('Could not parse LEGACY_MARKETING_PAGE_SLUGS from legacy-marketing-page-slugs.ts');
  const slugs = [];
  const re = /'([^']+)'/g;
  let x;
  while ((x = re.exec(m[1]))) slugs.push(x[1]);
  return slugs;
}

/** Extract `{ ... }` for a path key; string-aware so `}` inside descriptions does not break. */
function extractJsonObjectForPath(fileContent, urlPath) {
  const needle = `  "${urlPath}":`;
  const i = fileContent.indexOf(needle);
  if (i === -1) return null;
  let j = i + needle.length;
  while (j < fileContent.length && /\s/.test(fileContent[j])) j++;
  if (fileContent[j] !== '{') return null;
  let depth = 0;
  let inStr = false;
  let esc = false;
  const start = j;
  for (; j < fileContent.length; j++) {
    const c = fileContent[j];
    if (inStr) {
      if (esc) {
        esc = false;
        continue;
      }
      if (c === '\\') {
        esc = true;
        continue;
      }
      if (c === '"') inStr = false;
      continue;
    }
    if (c === '"') {
      inStr = true;
      continue;
    }
    if (c === '{') depth++;
    else if (c === '}') {
      depth--;
      if (depth === 0) return fileContent.slice(start, j + 1);
    }
  }
  return null;
}

function lookupSeo(seoMapContent, urlPath) {
  const raw = extractJsonObjectForPath(seoMapContent, urlPath);
  if (!raw) return null;
  try {
    const o = JSON.parse(raw);
    if (o.title && o.description !== undefined) {
      return {
        title: o.title,
        description: o.description,
        canonical: o.canonical || '',
      };
    }
  } catch {
    // ignore
  }
  return null;
}

function humanTitle(slug) {
  const last = slug.split('/').pop() || slug;
  return last
    .split('-')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

function buildPayload(slug, seo) {
  const title = seo?.title || humanTitle(slug);
  const metaDescription = seo?.description || '';
  const canonicalUrl = seo?.canonical || '';
  return {
    title,
    slug,
    status: 'PUBLISHED',
    seoTitle: title.slice(0, 300),
    metaDescription: metaDescription.slice(0, 2000),
    canonicalUrl: canonicalUrl || undefined,
    focusKeyword: '',
    isIndexable: true,
    isFollowable: true,
    enableSchema: true,
    headerStyle: 'default',
    footerStyle: 'default',
    showSidebar: false,
    content: '',
    blocksData: JSON.stringify({ blocks: [] }),
  };
}

async function main() {
  if (!email || !password) {
    console.error('Set PAYLOAD_ADMIN_EMAIL and PAYLOAD_ADMIN_PASSWORD in .env');
    process.exit(1);
  }

  const slugs = readSlugs();
  const seoMapContent = fs.readFileSync(SEO_MAP_FILE, 'utf8');

  const { data: login } = await axios.post(`${API}/users/login`, { email, password });
  const loginBody = login.data ?? login;
  const token = loginBody.token || loginBody.accessToken;
  if (!token) {
    console.error('Login failed', login);
    process.exit(1);
  }
  const authHeaders = { Authorization: `Bearer ${token}` };

  const { data: list } = await axios.get(`${API}/pages`, {
    params: { limit: 500, depth: 0 },
    headers: authHeaders,
  });
  const bySlug = new Map((list.docs || []).map((d) => [d.slug, d]));

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const slug of slugs) {
    const urlPath = `/${slug}`;
    const seo = lookupSeo(seoMapContent, urlPath);
    const body = buildPayload(slug, seo);
    const existing = bySlug.get(slug);

    try {
      if (existing?.id) {
        await axios.patch(`${API}/pages/${existing.id}`, body, { headers: authHeaders });
        updated++;
        console.log('Updated:', slug);
      } else {
        await axios.post(`${API}/pages`, body, { headers: authHeaders });
        created++;
        console.log('Created:', slug);
      }
    } catch (err) {
      console.error(`Failed [${slug}]:`, err.response?.data || err.message);
      skipped++;
    }
  }

  console.log(`\nDone. Created: ${created}, updated: ${updated}, failed: ${skipped}, total routes: ${slugs.length}`);
}

main().catch((e) => {
  console.error(e.response?.data || e);
  process.exit(1);
});
