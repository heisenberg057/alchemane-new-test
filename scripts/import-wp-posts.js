const fs = require('fs');
const path = require('path');
const axios = require('axios');
const dotenv = require('dotenv');
const { XMLParser } = require('fast-xml-parser');

const DRY_RUN = process.argv.includes('--dry-run');
const SLUGS_ARG = process.argv.find((arg) => arg.startsWith('--slugs='));
const TARGET_SLUGS = SLUGS_ARG
  ? new Set(
      SLUGS_ARG
        .replace('--slugs=', '')
        .split(',')
        .map((slug) => slug.trim())
        .filter(Boolean)
    )
  : null;

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../.env.local') });
dotenv.config({ path: path.join(__dirname, '../backend/.env') });

const API_URL = process.env.PAYLOAD_URL
  ? `${String(process.env.PAYLOAD_URL).replace(/\/$/, '')}/api`
  : process.env.API_URL || 'http://localhost:3000/api';
const ADMIN_EMAIL = process.env.PAYLOAD_ADMIN_EMAIL || process.env.ADMIN_EMAIL || 'admin@americanhairline.com';
const ADMIN_PASSWORD = process.env.PAYLOAD_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD || 'Admin12345';
const XML_FILE_PATH = path.join(__dirname, '../../SEO WordPress/POSTS.xml');

// Category mapping (WordPress Name -> Backend ID)
const CATEGORY_MAP = {
  'Hair Transplants': 'hair-transplant',
  'transplant': 'hair-transplant',
  'Hair Systems': 'hair-systems',
  'Hair Replacement Systems': 'hair-systems',
  'Non surgical hair replacement systems': 'hair-systems',
  'Scalp Micropigmentation': 'general-care',
  'Scalp Micro Pigmentation': 'general-care',
  'smp': 'general-care',
  'Success Stories': 'success-stories',
  'General Care': 'general-care'
};

function stripHtml(value) {
  return String(value || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeMetaDescription(rawDescription, fallbackSources = []) {
  const invalidPlaceholders = new Set(['', '%%excerpt%%']);
  let description = String(rawDescription || '').trim();
  if (invalidPlaceholders.has(description)) {
    description = '';
  }

  if (!description) {
    for (const source of fallbackSources) {
      const candidate = stripHtml(source);
      if (candidate) {
        description = candidate;
        break;
      }
    }
  }

  if (!description) {
    return '';
  }

  if (description.length > 160) {
    description = `${description.slice(0, 157).trimEnd()}...`;
  }

  if (description.length < 140) {
    for (const source of fallbackSources) {
      const candidate = stripHtml(source);
      if (!candidate || candidate === description) continue;
      description = `${description} ${candidate}`.replace(/\s+/g, ' ').trim();
      if (description.length >= 140) break;
    }
  }

  if (description.length > 160) {
    description = `${description.slice(0, 157).trimEnd()}...`;
  }

  return description;
}

function resolveCategoryValue(categoryNames = []) {
  for (const rawName of categoryNames) {
    const name = String(rawName || '').trim();
    if (!name) continue;
    if (CATEGORY_MAP[name]) return CATEGORY_MAP[name];
    const lowered = name.toLowerCase();
    if (CATEGORY_MAP[lowered]) return CATEGORY_MAP[lowered];
  }
  return undefined;
}

async function main() {
  console.log('🚀 Starting WordPress blog post import...');

  if (!fs.existsSync(XML_FILE_PATH)) {
    console.error(`❌ XML file not found at: ${XML_FILE_PATH}`);
    process.exit(1);
  }

  // 1. Parse XML (dry-run skips network entirely)
  console.log('📄 Parsing XML file...');
  const xmlContent = fs.readFileSync(XML_FILE_PATH, 'utf-8');
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_"
  });
  const jsonObj = parser.parse(xmlContent);
  const rawItems = jsonObj.rss?.channel?.item;
  const items = Array.isArray(rawItems) ? rawItems : rawItems ? [rawItems] : [];

  if (!items.length) {
    console.error('❌ No items found in XML.');
    process.exit(1);
  }

  const attachmentMap = {};
  items.forEach(item => {
    if (item['wp:post_type'] === 'attachment') {
      attachmentMap[item['wp:post_id']] = item['wp:attachment_url'];
    }
  });
  console.log(`🖼️ Found ${Object.keys(attachmentMap).length} attachments.`);

  const publishedPosts = items.filter(item => 
    item['wp:post_type'] === 'post' &&
    item['wp:status'] === 'publish' &&
    (!TARGET_SLUGS || TARGET_SLUGS.has(item['wp:post_name']))
  );
  console.log(`📝 Found ${publishedPosts.length} published posts to import.`);

  if (DRY_RUN) {
    console.log('\n--- Dry run ---');
    console.log(`Would import ${publishedPosts.length} published posts (no API calls).`);
    console.log('----------------');
    process.exit(0);
  }

  // 2. Authenticate
  console.log('🔐 Authenticating with CMS API...');
  let token;
  try {
    const loginRes = await axios.post(`${API_URL}/users/login`, {
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    });
    const body = loginRes.data?.data ?? loginRes.data;
    token = body.token || body.accessToken;
    console.log('✅ Authenticated successfully.');
  } catch (error) {
    console.error('❌ Authentication failed:', error.response?.data || error.message);
    process.exit(1);
  }

  const api = axios.create({
    baseURL: API_URL,
    headers: { Authorization: `Bearer ${token}` }
  });

  let successCount = 0;
  let failCount = 0;
  let skippedCount = 0;

  for (const post of publishedPosts) {
    try {
      // Extract postmeta
      const postmeta = Array.isArray(post['wp:postmeta']) ? post['wp:postmeta'] : [post['wp:postmeta']];
      const getMeta = (key) => postmeta.find(m => m['wp:meta_key'] === key)?.['wp:meta_value'] || '';

      const rawSchema = getMeta('saswp_custom_schema_field');
      const customSchema = rawSchema ? (rawSchema.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)?.[1]?.trim() || '') : '';
      let parsedCustomSchema = null;
      if (customSchema) {
        try {
          parsedCustomSchema = JSON.parse(customSchema);
        } catch {
          parsedCustomSchema = null;
        }
      }

      // Map category
      const wpCategories = Array.isArray(post.category) ? post.category : [post.category];
      const categoryNames = wpCategories.filter(c => c?.['@_domain'] === 'category').map(c => c['#text']);
      const categoryValue = resolveCategoryValue(categoryNames);
      const rawMetaDescription = getMeta('_yoast_wpseo_metadesc');
      const metaDescription = normalizeMetaDescription(rawMetaDescription, [
        post['excerpt:encoded'],
        post['content:encoded'],
        typeof post.title === 'object' ? post.title['#text'] || String(post.title) : String(post.title),
      ]);
      const title = typeof post.title === 'object' ? post.title['#text'] || String(post.title) : String(post.title);
      
      const payload = {
        title,
        slug: post['wp:post_name'],
        wordpressHtml: post['content:encoded'],
        meta: {
          description: metaDescription || undefined,
          keywords: getMeta('_yoast_wpseo_focuskw') || undefined,
        },
        structuredData: {
          schemaType: 'Custom',
          customSchema: parsedCustomSchema,
        },
        _status: 'published',
        publishedDate: new Date(post.pubDate).toISOString(),
        category: categoryValue,
      };

      console.log(`📤 Importing [${post['wp:post_name']}]...`);
      const existingRes = await api.get('/posts', {
        params: {
          where: {
            slug: {
              equals: post['wp:post_name'],
            },
          },
          limit: 1,
          depth: 0,
        },
      });
      const existing = existingRes.data?.docs?.[0];
      if (existing?.id) {
        console.log(`↻ Updating existing post [${post['wp:post_name']}]...`);
        await api.patch(`/posts/${existing.id}`, payload);
      } else {
        await api.post('/posts', payload);
      }
      successCount++;
    } catch (error) {
      console.error(`❌ Failed to import post: ${post['wp:post_name']}`);
      const responseData = error.response?.data;
      const reason =
        responseData?.errors ||
        responseData?.message ||
        responseData ||
        error.message;
      console.error('   Reason:', reason);
      failCount++;
    }
  }

  console.log('\n--- Import Summary ---');
  console.log(`✅ Successfully imported: ${successCount}`);
  console.log(`❌ Failed to import: ${failCount}`);
  console.log(`⏭️ Skipped: ${skippedCount}`);
  console.log('----------------------');
}

main();
