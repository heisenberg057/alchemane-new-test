/**
 * Attach featured images for specific post slugs from live WP REST → Payload/R2.
 *
 * Usage:
 *   node scripts/sync-wp-featured-images-by-slug.mjs --slugs=a,b,c
 *   node scripts/sync-wp-featured-images-by-slug.mjs --dry-run --slugs=a,b
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
const SLUGS = SLUGS_ARG
  ? SLUGS_ARG.replace('--slugs=', '')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  : [];

if (!SLUGS.length) {
  console.error('Provide --slugs=slug1,slug2,...');
  process.exit(1);
}

const WP_BASE = (process.env.WP_URL || 'https://americanhairline.com').replace(/\/$/, '');
const API_URL = process.env.PAYLOAD_URL
  ? `${String(process.env.PAYLOAD_URL).replace(/\/$/, '')}/api`
  : 'http://localhost:3000/api';
const ADMIN_EMAIL = process.env.PAYLOAD_ADMIN_EMAIL || process.env.ADMIN_EMAIL || '';
const ADMIN_PASSWORD =
  process.env.PAYLOAD_ADMIN_PASSWORD ||
  process.env.ADMIN_PASSWORD ||
  process.env.ADMIN_MIGRATION_PASSWORD ||
  '';

const tmpDir = path.join(ROOT, 'tmp', 'wp-featured-sync');
fs.mkdirSync(tmpDir, { recursive: true });

function filenameFromUrl(url) {
  try {
    const u = new URL(url);
    const base = path.basename(u.pathname) || 'image.jpg';
    return base.split('?')[0] || 'image.jpg';
  } catch {
    return 'image.jpg';
  }
}

async function login() {
  const res = await axios.post(`${API_URL}/users/login`, {
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });
  const body = res.data?.data ?? res.data;
  const token = body.token || body.accessToken;
  if (!token) throw new Error('No token from Payload login');
  return token;
}

async function fetchWpPost(slug) {
  const url = `${WP_BASE}/wp-json/wp/v2/posts?slug=${encodeURIComponent(slug)}&_embed=1`;
  const res = await axios.get(url, {
    headers: { 'User-Agent': 'AHL-Featured-Sync/1.0' },
    timeout: 60000,
  });
  return res.data?.[0] || null;
}

function featuredUrlFromWp(post) {
  const media = post?._embedded?.['wp:featuredmedia']?.[0];
  if (!media) return null;
  return (
    media.source_url ||
    media.media_details?.sizes?.full?.source_url ||
    media.guid?.rendered ||
    null
  );
}

async function findLocalPost(token, slug) {
  const res = await axios.get(`${API_URL}/posts`, {
    headers: { Authorization: `Bearer ${token}` },
    params: {
      limit: 1,
      depth: 0,
      'where[slug][equals]': slug,
    },
  });
  return res.data?.docs?.[0] || null;
}

async function downloadToTemp(url) {
  const res = await axios.get(url, {
    responseType: 'arraybuffer',
    headers: { 'User-Agent': 'AHL-Featured-Sync/1.0' },
    timeout: 120000,
  });
  const filename = filenameFromUrl(url);
  const filePath = path.join(tmpDir, `${Date.now()}-${filename}`);
  fs.writeFileSync(filePath, Buffer.from(res.data));
  const mimeType = res.headers['content-type'] || 'application/octet-stream';
  return { filePath, filename, mimeType };
}

async function uploadMedia(token, file, title) {
  const buf = fs.readFileSync(file.filePath);
  const form = new FormData();
  form.append(
    '_payload',
    JSON.stringify({
      alt: title,
      title,
      description: `Imported from WordPress featured image`,
    })
  );
  form.append('file', new File([buf], file.filename, { type: file.mimeType }));

  const res = await fetch(`${API_URL}/media`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  const json = await res.json();
  const doc = json.doc ?? json;
  if (!res.ok || doc.id == null) {
    throw new Error(`Media upload failed (${res.status}): ${JSON.stringify(json)}`);
  }
  return doc;
}

async function linkHero(token, postId, mediaId) {
  const res = await axios.patch(
    `${API_URL}/posts/${postId}`,
    { heroImage: mediaId, meta: { image: mediaId } },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
  return res.data;
}

async function main() {
  console.log(`Slugs: ${SLUGS.length}`);
  console.log(`Mode: ${DRY_RUN ? 'dry-run' : 'live'}`);
  const token = await login();
  console.log('Authenticated');

  let ok = 0;
  let skip = 0;
  let fail = 0;
  const results = [];

  for (const slug of SLUGS) {
    try {
      const local = await findLocalPost(token, slug);
      if (!local) {
        console.log(`⏭  ${slug} — local post not found`);
        skip += 1;
        results.push({ slug, status: 'missing-local' });
        continue;
      }
      if (local.heroImage) {
        console.log(`⏭  ${slug} — already has heroImage ${local.heroImage}`);
        skip += 1;
        results.push({ slug, status: 'already-linked', heroImage: local.heroImage });
        continue;
      }

      const wp = await fetchWpPost(slug);
      if (!wp) {
        console.log(`❌ ${slug} — not found on WordPress`);
        fail += 1;
        results.push({ slug, status: 'missing-wp' });
        continue;
      }
      const imageUrl = featuredUrlFromWp(wp);
      if (!imageUrl) {
        console.log(`❌ ${slug} — WP has no featured media`);
        fail += 1;
        results.push({ slug, status: 'missing-wp-image' });
        continue;
      }

      console.log(`📥 ${slug}`);
      console.log(`   ${imageUrl}`);
      if (DRY_RUN) {
        ok += 1;
        results.push({ slug, status: 'dry-run', imageUrl });
        continue;
      }

      const file = await downloadToTemp(imageUrl);
      const media = await uploadMedia(token, file, local.title || slug);
      await linkHero(token, local.id, media.id);
      try {
        fs.unlinkSync(file.filePath);
      } catch {}

      console.log(`✅ ${slug} → media ${media.id}`);
      ok += 1;
      results.push({
        slug,
        status: 'linked',
        mediaId: media.id,
        url: media.url || null,
        imageUrl,
      });
    } catch (err) {
      fail += 1;
      const reason = err.response?.data || err.message;
      console.error(`❌ ${slug}`, reason);
      results.push({ slug, status: 'error', reason });
    }
  }

  const out = path.join(ROOT, 'reports', 'sync-remaining-10-featured.json');
  fs.writeFileSync(
    out,
    JSON.stringify({ at: new Date().toISOString(), ok, skip, fail, results }, null, 2)
  );
  console.log('\n--- Summary ---');
  console.log(`✅ ok/linked: ${ok}`);
  console.log(`⏭  skipped:  ${skip}`);
  console.log(`❌ failed:   ${fail}`);
  console.log(`📄 ${out}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
