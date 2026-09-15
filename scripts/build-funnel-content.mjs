/**
 * Copies the current FlexiFunnel HTML export into src/content/funnel for SSR.
 * Run from AmericanHairline-Unified: node scripts/build-funnel-content.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const FLEXIFUNNEL = path.join(ROOT, '..', 'flexifunnel');
const OUT = path.join(ROOT, 'src', 'content', 'funnel');

const PAGES = [
  // clip-on-hair-system → React LP at src/app/lp/clip-on-hair-system
  'failed-hair-transplant',
  // hair-loss-solution-bangalore → React LP at src/app/lp/hair-loss-solution-bangalore
  'hair-loss-solution-for-corporate-men',
  'hair-loss-solution-for-gym-goers',
  'hair-loss-solution-for-married-men',
  'hair-loss-solutions',
  'hair-loss-solutions-delhi',
  'hair-loss-solutions-for-men',
  'hair-replacement-visitors',
  'scalp-micro-pigmentation',
  'stick-on-hair-system',
  'transplant-grade-hair-systems',
];

const SKIP_FILE_NAME = /\b(nav|utm|widget)\b/i;

const LOCATION_ADDRESSES = {
  default:
    'Saffron Building, 202, Linking Rd, above Anushree Reddy Store, Khar (West), Mumbai, Maharashtra 400052.',
  'hair-loss-solutions-delhi':
    'E 84, Greater Kailash 1 Rd, Hansraj Gupta Rd, New Delhi, Delhi 110048, India',
};

/** Remove FlexiFunnel editor labels that are not meant to render on-page. */
function stripFunnelMarkers(html) {
  return html
    .split(/\r?\n/)
    .filter((line) => {
      const t = line.trim();
      if (!t) return true;
      if (t.includes('<')) return true;
      if (/^\([^)]+\)\s*-\s*$/.test(t)) return false;
      if (/^.+\(Section-\d+\)\s*$/i.test(t)) return false;
      if (/^Header\s*-\s*$/i.test(t)) return false;
      return true;
    })
    .join('\n')
    .trim();
}

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

function sectionIdFromFileName(fileName) {
  const parsed = /^(\d+)[-. ]*(.+)\.html$/i.exec(fileName);
  if (!parsed) return slugify(fileName.replace(/\.html$/i, ''));
  const number = String(Number(parsed[1])).padStart(2, '0');
  return `block-${number}-${slugify(parsed[2]) || 'section'}`;
}

function sanitizeHtml(html) {
  return stripFunnelMarkers(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/\bon\w+\s*=\s*(["'])[\s\S]*?\1/gi, '')
      .replace(/\bon\w+\s*=\s*[^\s>]+/gi, '')
      .replace(/background\s*:\s*url\(<path-to-image>\)\s*([^;"']*)/gi, 'background: #f3f4f6')
  );
}

function normalizeLocationAddress(slug, fileName, html) {
  if (!/our location/i.test(fileName)) return html;

  const address = LOCATION_ADDRESSES[slug] ?? LOCATION_ADDRESSES.default;
  return html.replace(
    /(<strong>\s*Address:\s*<\/strong>\s*)([^<]+)(\s*<\/div>)/i,
    `$1\n    ${address}\n  $3`
  );
}

function replaceFirstHeading(html, tagName, innerHtml) {
  const headingPattern = new RegExp(`<${tagName}\\b([^>]*)>[\\s\\S]*?<\\/${tagName}>`, 'i');
  return html.replace(headingPattern, `<${tagName}$1>${innerHtml}</${tagName}>`);
}

function replaceFirstAvailableHeading(html, innerHtml, tagNames = ['h1', 'h2', 'h3']) {
  for (const tagName of tagNames) {
    const headingPattern = new RegExp(`<${tagName}\\b[^>]*>[\\s\\S]*?<\\/${tagName}>`, 'i');
    if (headingPattern.test(html)) {
      return replaceFirstHeading(html, tagName, innerHtml);
    }
  }

  return html;
}

function normalizeHeadings(fileName, html) {
  if (/this is for you if/i.test(fileName)) {
    return replaceFirstAvailableHeading(html, 'Who is it for?');
  }

  if (/(happyclients|happy clients|hear from our happy clients)/i.test(fileName)) {
    return replaceFirstAvailableHeading(
      html,
      'Confidence Restored<br><span class="sub-titles">Real Stories, Real Results</span>'
    );
  }

  if (/bollywood/i.test(fileName)) {
    return replaceFirstAvailableHeading(html, 'The Mind Behind India’s Natural Hairlines');
  }

  if (/real hair or illusion/i.test(fileName)) {
    return replaceFirstAvailableHeading(
      html,
      'Real Hair or Illusion<br><span style="color: #1769FF; text-transform: uppercase;">Watch & Decide</span>'
    );
  }

  if (/customization/i.test(fileName)) {
    return replaceFirstAvailableHeading(
      html,
      '<span style="color: #1769FF;">Customization:</span> <span style="color: #191919;">Made for You! Not just for Anyone</span>'
    );
  }

  return html;
}

function getOrderedHtmlFiles(dirPath) {
  return fs
    .readdirSync(dirPath)
    .filter((file) => file.toLowerCase().endsWith('.html'))
    .filter((file) => !SKIP_FILE_NAME.test(file))
    .sort((a, b) => {
      const aNumber = Number.parseInt(a, 10);
      const bNumber = Number.parseInt(b, 10);
      if (Number.isFinite(aNumber) && Number.isFinite(bNumber)) {
        return aNumber - bNumber;
      }
      return a.localeCompare(b);
    });
}

fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const manifest = {};

for (const slug of PAGES) {
  const dirPath = path.join(FLEXIFUNNEL, slug);
  if (!fs.existsSync(dirPath)) {
    console.warn(`Missing folder: ${dirPath}`);
    continue;
  }

  const outDir = path.join(OUT, slug);
  fs.rmSync(outDir, { recursive: true, force: true });
  fs.mkdirSync(outDir, { recursive: true });
  const sectionIds = [];

  for (const fileName of getOrderedHtmlFiles(dirPath)) {
    const raw = fs.readFileSync(path.join(dirPath, fileName), 'utf8');
    const html = normalizeHeadings(fileName, normalizeLocationAddress(slug, fileName, sanitizeHtml(raw)));
    if (!html.trim()) {
      console.warn(`[${slug}] empty after sanitize: ${fileName}`);
      continue;
    }

    const id = sectionIdFromFileName(fileName);
    fs.writeFileSync(path.join(outDir, `${id}.html`), html);
    sectionIds.push(id);
  }

  manifest[slug] = { sectionIds };
  console.log(`✓ ${slug}: ${sectionIds.length} sections`);
}

// Ensure manifest includes every configured slug
for (const slug of PAGES) {
  if (!manifest[slug]) manifest[slug] = { sectionIds: [] };
}

fs.writeFileSync(
  path.join(OUT, 'manifest.json'),
  JSON.stringify(manifest, null, 2)
);

console.log('Wrote', path.join(OUT, 'manifest.json'));
