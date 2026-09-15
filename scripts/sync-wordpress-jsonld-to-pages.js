/**
 * Loads JSON-LD from SEO WordPress/WordPress JSON-LD into Payload Pages:
 *   enableSchema: true
 *   customSchema: pretty-printed JSON (array of @graph objects from WordPress export)
 *
 * Filenames must match: "{slug} schema.json" (e.g. about-us schema.json)
 *
 *   cd AmericanHairline-Unified && npm run sync-jsonld
 *
 * Requires: PAYLOAD_URL, PAYLOAD_ADMIN_EMAIL, PAYLOAD_ADMIN_PASSWORD
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

const JSONLD_DIR = path.join(__dirname, '../../SEO WordPress/WordPress JSON-LD');

function parseSlugFromFilename(name) {
  const m = name.match(/^(.+?)\s+schema\.json$/i);
  return m ? m[1].trim() : null;
}

async function main() {
  if (!email || !password) {
    console.error('Set PAYLOAD_ADMIN_EMAIL and PAYLOAD_ADMIN_PASSWORD');
    process.exit(1);
  }

  if (!fs.existsSync(JSONLD_DIR)) {
    console.error('JSON-LD folder not found:', JSONLD_DIR);
    process.exit(1);
  }

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

  const files = fs.readdirSync(JSONLD_DIR).filter((f) => f.toLowerCase().endsWith('schema.json'));

  let updated = 0;
  let skippedNoPage = 0;
  let failed = 0;

  for (const file of files) {
    const slug = parseSlugFromFilename(file);
    if (!slug) {
      console.warn('Skip (bad name):', file);
      continue;
    }

    const doc = bySlug.get(slug);
    if (!doc?.id) {
      console.warn('No Payload page for slug:', slug, '(file:', file + ')');
      skippedNoPage++;
      continue;
    }

    const fullPath = path.join(JSONLD_DIR, file);
    let raw;
    try {
      raw = fs.readFileSync(fullPath, 'utf8');
    } catch (e) {
      console.error('Read failed:', file, e.message);
      failed++;
      continue;
    }

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      console.error('Invalid JSON:', file, e.message);
      failed++;
      continue;
    }

    const customSchema = JSON.stringify(parsed, null, 2);

    try {
      await axios.patch(
        `${API}/pages/${doc.id}`,
        {
          enableSchema: true,
          customSchema,
        },
        { headers: authHeaders }
      );
      updated++;
      console.log('Updated JSON-LD:', slug);
    } catch (err) {
      console.error('PATCH failed:', slug, err.response?.data || err.message);
      failed++;
    }
  }

  console.log('\nSummary: updated', updated, '| no matching page', skippedNoPage, '| failed', failed, '| files', files.length);
}

main().catch((e) => {
  console.error(e.response?.data || e);
  process.exit(1);
});
