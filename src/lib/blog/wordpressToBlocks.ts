/**
 * wordpressToBlocks.ts
 *
 * Canonical transformer: WordPress Gutenberg HTML → normalized blog blocks.
 *
 * Design principles:
 * - Pure function. No DB calls, no side effects, no imports from Next.js or Payload.
 * - Uses cheerio (already a production dependency) for real DOM parsing — no regex HTML hacks.
 * - Processes Gutenberg block comments to understand structure, then delegates inner HTML
 *   parsing to cheerio for reliable extraction.
 * - Produces the canonical blocksData shape: { version, source, blocks }.
 * - Returns a warnings array alongside output for migration observability.
 */

import { load as cheerioLoad } from 'cheerio';
import { v4 as uuidv4 } from 'uuid';

// Shorthand for cheerio.load — xmlMode:false gives standard HTML parsing behaviour.
function load(html: string) {
  return cheerioLoad(html, { xmlMode: false });
}

// Tag name helper — works across cheerio/domhandler element shapes without
// depending on the exported Element type (which varies between cheerio versions).
function tagName(el: object): string {
  return ((el as Record<string, unknown>).tagName as string | undefined)?.toLowerCase() ?? '';
}

// ─── Output types ──────────────────────────────────────────────────────────────

export type BlogBlockType =
  | 'heading'
  | 'text'
  | 'image'
  | 'youtube'
  | 'list'
  | 'quote'
  | 'divider'
  | 'table'
  | 'callout';

export interface BlogBlock {
  id: string;
  type: BlogBlockType;
  props: Record<string, unknown>;
}

export interface TransformerWarning {
  code: string;
  message: string;
  context?: string;
}

export interface TransformerStats {
  totalInputBlocks: number;
  tocTablesRemoved: number;
  unsupportedContainersFlattened: number;
  unknownEmbedsSkipped: number;
  emptyBlocksSkipped: number;
  blocksProduced: number;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface TransformerResult {
  version: 1;
  source: 'wordpress-import';
  blocks: BlogBlock[];
  faqData: FaqItem[];
  warnings: TransformerWarning[];
  stats: TransformerStats;
}

// ─── Gutenberg block splitter ──────────────────────────────────────────────────

interface GutBlock {
  blockType: string;
  attrs: string;
  innerHtml: string;
  selfClosing: boolean;
}

/**
 * Split WordPress HTML into a flat list of top-level Gutenberg blocks.
 * Handles nested block comments by tracking depth per block type.
 * Text between blocks becomes { blockType: '__text__' }.
 */
function splitGutenbergBlocks(html: string): GutBlock[] {
  const result: GutBlock[] = [];
  // Matches <!-- wp:name {"key":"val"} --> or <!-- wp:name --> or <!-- wp:name /-->
  const OPEN = /<!--\s*wp:([\w/-]+)(\s[^]*?)?\s*(\/)?-->/g;

  let pos = 0;

  while (pos < html.length) {
    OPEN.lastIndex = pos;
    const openMatch = OPEN.exec(html);

    if (!openMatch) {
      const remaining = html.slice(pos).trim();
      if (remaining) result.push({ blockType: '__text__', attrs: '', innerHtml: remaining, selfClosing: false });
      break;
    }

    // Text before this block
    const before = html.slice(pos, openMatch.index).trim();
    if (before) result.push({ blockType: '__text__', attrs: '', innerHtml: before, selfClosing: false });

    const blockType = openMatch[1];
    const attrs = (openMatch[2] || '').trim();
    const isSelfClosing = openMatch[3] === '/';
    const contentStart = openMatch.index + openMatch[0].length;

    if (isSelfClosing) {
      result.push({ blockType, attrs, innerHtml: '', selfClosing: true });
      pos = contentStart;
      continue;
    }

    // Find matching closing comment, respecting nesting for same block type
    const escapedType = blockType.replace(/\//g, '\\/');
    const CLOSE_RE = new RegExp(`<!--\\s*\\/wp:${escapedType}\\s*-->`, 'g');
    const OPEN_SAME_RE = new RegExp(`<!--\\s*wp:${escapedType}(\\s[^]*?)?\\s*(\\/)?-->`, 'g');

    let depth = 1;
    let searchPos = contentStart;
    let innerEnd = html.length;

    while (searchPos < html.length && depth > 0) {
      OPEN_SAME_RE.lastIndex = searchPos;
      CLOSE_RE.lastIndex = searchPos;

      const nextOpen = OPEN_SAME_RE.exec(html);
      const nextClose = CLOSE_RE.exec(html);

      if (!nextClose) {
        innerEnd = html.length;
        pos = html.length;
        depth = 0;
        break;
      }

      if (nextOpen && nextOpen.index < nextClose.index) {
        // Another open of same type before close — go deeper
        depth++;
        searchPos = nextOpen.index + nextOpen[0].length;
      } else {
        depth--;
        if (depth === 0) {
          innerEnd = nextClose.index;
          pos = nextClose.index + nextClose[0].length;
        } else {
          searchPos = nextClose.index + nextClose[0].length;
        }
      }
    }

    result.push({ blockType, attrs, innerHtml: html.slice(contentStart, innerEnd).trim(), selfClosing: false });
  }

  return result;
}

// ─── TOC table detection ───────────────────────────────────────────────────────

/**
 * Returns true if a <table> element looks like a WordPress Table of Contents:
 * - Only 1 column
 * - Cells contain anchor links (#...) pointing to same-page headings
 * - Or a cell says "Table of Contents" / "Contents"
 * - Or all cell text is short anchor-link text with no real data
 */
function isTocTable(tableHtml: string): boolean {
  const $ = load(tableHtml);
  const table = $('table');
  if (!table.length) return false;

  // Single-column table is a strong signal
  const maxCols = Math.max(...$('tr').map((_, tr) => $(tr).find('td, th').length).get() as number[]);
  if (maxCols === 1) {
    // If all cells are anchor links or "Table of Contents" text → TOC
    const cellTexts = $('td, th').map((_, el) => $(el).text().trim()).get() as string[];
    const tocLabel = cellTexts.some(t =>
      /^(table\s+of\s+contents?|contents?)$/i.test(t)
    );
    if (tocLabel) return true;

    // All cells contain only anchor links
    const allAnchors = $('td, th').toArray().every(el => {
      const text = $(el).text().trim();
      const links = $(el).find('a[href^="#"]');
      return links.length > 0 || text === '';
    });
    if (allAnchors) return true;
  }

  // Check if a majority of cells are anchor links to headings
  const allCells = $('td, th').toArray();
  if (allCells.length === 0) return false;
  const anchorCells = allCells.filter(el => $(el).find('a[href^="#"]').length > 0);
  if (anchorCells.length / allCells.length >= 0.7) return true;

  return false;
}

// ─── Inline HTML sanitizer ────────────────────────────────────────────────────

const ALLOWED_INLINE = new Set(['a', 'strong', 'em', 'b', 'i', 'br', 'code', 'span']);

/**
 * Given an HTML string, return only safe inline content.
 * Strips block-level tags (div, figure, etc.) but preserves allowed inline tags.
 * Normalizes whitespace.
 */
function sanitizeInlineHtml(html: string): string {
  if (!html) return '';

  // Load fragment; cheerio wraps it in <html><body> automatically
  const $ = load(`<div id="__root">${html}</div>`);
  const root = $('#__root');

  // Walk all elements and strip any that are not allowed inline tags
  root.find('*').each((_, el) => {
    const tag = tagName(el);
    if (!ALLOWED_INLINE.has(tag)) {
      // Unwrap: replace the element with its own children/text
      $(el).replaceWith($(el).html() || '');
    }
  });

  // Get the cleaned inner HTML and normalize whitespace
  return (root.html() || '')
    .replace(/\s+/g, ' ')
    .replace(/\s*<br\s*\/?>\s*/gi, '<br/>')
    .trim();
}

/**
 * Extract plain text — strip ALL tags including allowed inline ones.
 */
function plainText(html: string): string {
  const $ = load(html);
  return $.root().text().replace(/\s+/g, ' ').trim();
}

// ─── Block converters ──────────────────────────────────────────────────────────

function makeId(anchorId?: string): string {
  return anchorId || uuidv4();
}

function convertHeading(innerHtml: string): BlogBlock | null {
  const $ = load(innerHtml);
  const headingEl = $('h1, h2, h3, h4, h5, h6').first();
  if (!headingEl.length) return null;

  const tag = headingEl.prop('tagName')?.toLowerCase() ?? 'h2';
  const level = parseInt(tag.replace('h', ''), 10) || 2;
  const anchorId = headingEl.attr('id') || undefined;

  // Preserve inline formatting inside heading
  const text = sanitizeInlineHtml(headingEl.html() || '');
  if (!text) return null;

  return {
    id: makeId(anchorId),
    type: 'heading',
    props: { text, level, anchorId },
  };
}

function convertParagraph(innerHtml: string): BlogBlock | null {
  const $ = load(innerHtml);
  // innerHtml is the content inside the wp:paragraph block, which contains a <p>
  const p = $('p').first();
  const rawHtml = p.length ? (p.html() || '') : innerHtml;
  const text = sanitizeInlineHtml(rawHtml);
  if (!plainText(text)) return null;

  return {
    id: uuidv4(),
    type: 'text',
    props: { text },
  };
}

function convertList(innerHtml: string, attrs: string): BlogBlock | null {
  const isOrdered = /"ordered"\s*:\s*true/i.test(attrs) || /<ol/i.test(innerHtml);

  // Strip Gutenberg list-item comments before parsing
  const stripped = innerHtml.replace(/<!--[\s\S]*?-->/g, '');
  const $ = load(stripped);

  const items: string[] = $('li').map((_, el) => {
    return sanitizeInlineHtml($(el).html() || '');
  }).get().filter(item => !!plainText(item));

  if (items.length === 0) return null;

  return {
    id: uuidv4(),
    type: 'list',
    props: { ordered: isOrdered, items },
  };
}

function convertTable(innerHtml: string): { block: BlogBlock | null; isToc: boolean } {
  const $ = load(innerHtml);
  const table = $('table').first();
  if (!table.length) return { block: null, isToc: false };

  const tableOuterHtml = $.html(table);
  if (isTocTable(tableOuterHtml)) {
    return { block: null, isToc: true };
  }

  // Extract headers — prefer <th> row, else first <tr>
  const theadRow = table.find('thead tr').first();
  const firstRow = table.find('tr').first();
  const headerRow = theadRow.length ? theadRow : firstRow;
  const isThRow = headerRow.find('th').length > 0;

  const headers: string[] = headerRow.find(isThRow ? 'th' : 'td').map((_, el) => {
    return plainText($(el).html() || '');
  }).get();

  const bodyRows = table.find('tbody tr').toArray();
  const dataRows: string[][] = (bodyRows.length > 0 ? bodyRows : table.find('tr').toArray().slice(1)).map(tr => {
    return $(tr).find('td').map((_, td) => plainText($(td).html() || '')).get();
  });

  if (headers.length === 0) return { block: null, isToc: false };

  return {
    block: {
      id: uuidv4(),
      type: 'table',
      props: { headers, rows: dataRows },
    },
    isToc: false,
  };
}

function convertImage(innerHtml: string): BlogBlock | null {
  const $ = load(innerHtml);
  const img = $('img').first();
  if (!img.length) return null;

  const url = img.attr('src') || '';
  if (!url) return null;

  const alt = img.attr('alt') || '';
  const caption = $('figcaption').first().text().trim() || undefined;

  return {
    id: uuidv4(),
    type: 'image',
    props: { url, alt, ...(caption ? { caption } : {}) },
  };
}

function extractYoutubeId(text: string): string | null {
  const match = text.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  );
  return match ? match[1] : null;
}

function convertEmbed(innerHtml: string, attrs: string): BlogBlock | null {
  // The YouTube URL can be in attrs JSON or as raw text inside the wrapper div
  const fromAttrs = extractYoutubeId(attrs);
  const fromHtml = extractYoutubeId(innerHtml);
  const videoId = fromAttrs || fromHtml;

  if (!videoId) return null;

  return {
    id: uuidv4(),
    type: 'youtube',
    props: { url: `https://www.youtube.com/watch?v=${videoId}` },
  };
}

// ─── Yoast FAQ block converter ────────────────────────────────────────────────

interface FaqConversionResult {
  blocks: BlogBlock[];
  faqItems: FaqItem[];
}

/**
 * Convert a yoast/faq-block into heading+text block pairs, and extract
 * plain-text Q&A pairs for SEO schema use.
 *
 * Strategy:
 * 1. Parse the rendered HTML (.schema-faq-section divs) for content with
 *    inline formatting preserved.
 * 2. Fall back to the JSON attrs (jsonQuestion / jsonAnswer) for plain text
 *    when the HTML parse yields nothing.
 * 3. The attrs JSON also sources the faqData SEO structure (always plain text).
 */
function convertFaqBlock(innerHtml: string, attrs: string): FaqConversionResult {
  const resultBlocks: BlogBlock[] = [];
  const faqItems: FaqItem[] = [];

  // ── Try HTML parse first (preserves inline formatting) ──────────────────────
  const $ = load(innerHtml);
  const sections = $('.schema-faq-section').toArray();

  if (sections.length > 0) {
    for (const section of sections) {
      const questionEl = $(section).find('.schema-faq-question').first();
      const answerEl   = $(section).find('.schema-faq-answer').first();

      const questionText = questionEl.length
        ? sanitizeInlineHtml(questionEl.html() || '')
        : '';
      const answerText = answerEl.length
        ? sanitizeInlineHtml(answerEl.html() || '')
        : '';

      if (!plainText(questionText) && !plainText(answerText)) continue;

      if (plainText(questionText)) {
        resultBlocks.push({
          id: uuidv4(),
          type: 'heading',
          props: { text: questionText, level: 3 },
        });
      }
      if (plainText(answerText)) {
        resultBlocks.push({
          id: uuidv4(),
          type: 'text',
          props: { text: answerText },
        });
      }

      // faqData: always plain text for SEO schema
      faqItems.push({
        question: plainText(questionText),
        answer:   plainText(answerText),
      });
    }

    if (resultBlocks.length > 0) return { blocks: resultBlocks, faqItems };
  }

  // ── Fallback: parse attrs JSON ───────────────────────────────────────────────
  try {
    const parsed = JSON.parse(attrs) as {
      questions?: Array<{
        jsonQuestion?: string;
        jsonAnswer?: string;
        question?: (string | object)[];
        answer?: (string | object)[];
      }>;
    };

    for (const q of (parsed.questions ?? [])) {
      // jsonQuestion / jsonAnswer are already plain text strings in WordPress attrs
      const questionStr = q.jsonQuestion?.trim() ?? '';
      const answerStr   = q.jsonAnswer?.trim()   ?? '';

      if (!questionStr && !answerStr) continue;

      if (questionStr) {
        resultBlocks.push({
          id: uuidv4(),
          type: 'heading',
          props: { text: questionStr, level: 3 },
        });
      }
      if (answerStr) {
        resultBlocks.push({
          id: uuidv4(),
          type: 'text',
          props: { text: answerStr },
        });
      }

      faqItems.push({ question: questionStr, answer: answerStr });
    }
  } catch {
    // attrs not valid JSON — nothing we can do
  }

  return { blocks: resultBlocks, faqItems };
}

function convertQuote(innerHtml: string): BlogBlock | null {
  const $ = load(innerHtml);
  const cite = $('cite').first();
  const attribution = cite.length ? plainText(cite.html() || '') : undefined;
  cite.remove();

  const text = plainText($.html() || '');
  if (!text) return null;

  return {
    id: uuidv4(),
    type: 'quote',
    props: { text, ...(attribution ? { attribution } : {}) },
  };
}

// ─── Container / group flattener ──────────────────────────────────────────────

const LAYOUT_BLOCK_TYPES = new Set([
  'group', 'columns', 'column', 'media-text',
  'cover', 'row', 'stack', 'grid',
  'core/group', 'core/columns', 'core/column',
]);

function isLayoutBlock(blockType: string): boolean {
  return LAYOUT_BLOCK_TYPES.has(blockType) || blockType.endsWith('/group') || blockType.endsWith('/columns');
}

// ─── Main transformer ──────────────────────────────────────────────────────────

export function wordpressToBlocks(html: string): TransformerResult {
  const warnings: TransformerWarning[] = [];
  const stats: TransformerStats = {
    totalInputBlocks: 0,
    tocTablesRemoved: 0,
    unsupportedContainersFlattened: 0,
    unknownEmbedsSkipped: 0,
    emptyBlocksSkipped: 0,
    blocksProduced: 0,
  };

  if (!html || typeof html !== 'string') {
    return { version: 1, source: 'wordpress-import', blocks: [], faqData: [], warnings, stats };
  }

  const gutBlocks = splitGutenbergBlocks(html.trim());
  stats.totalInputBlocks = gutBlocks.length;

  const blocks: BlogBlock[] = [];
  const faqData: FaqItem[] = [];

  function processBlock(gb: GutBlock): void {
    const { blockType, attrs, innerHtml } = gb;

    // ── Heading ──────────────────────────────────────────────────────────────
    if (blockType === 'heading') {
      const block = convertHeading(innerHtml);
      if (block) { blocks.push(block); return; }
      stats.emptyBlocksSkipped++;
      return;
    }

    // ── Paragraph ────────────────────────────────────────────────────────────
    if (blockType === 'paragraph') {
      const block = convertParagraph(innerHtml);
      if (block) { blocks.push(block); return; }
      stats.emptyBlocksSkipped++;
      return;
    }

    // ── List ─────────────────────────────────────────────────────────────────
    if (blockType === 'list') {
      const block = convertList(innerHtml, attrs);
      if (block) { blocks.push(block); return; }
      stats.emptyBlocksSkipped++;
      return;
    }

    // ── Table ─────────────────────────────────────────────────────────────────
    if (blockType === 'table') {
      const { block, isToc } = convertTable(innerHtml);
      if (isToc) {
        stats.tocTablesRemoved++;
        warnings.push({ code: 'TOC_TABLE_REMOVED', message: 'WordPress TOC table removed — page TOC is generated from headings', context: innerHtml.slice(0, 80) });
        return;
      }
      if (block) { blocks.push(block); return; }
      stats.emptyBlocksSkipped++;
      return;
    }

    // ── Image ─────────────────────────────────────────────────────────────────
    if (blockType === 'image') {
      const block = convertImage(innerHtml);
      if (block) { blocks.push(block); return; }
      stats.emptyBlocksSkipped++;
      return;
    }

    // ── YouTube / embed ───────────────────────────────────────────────────────
    if (
      blockType === 'embed' ||
      blockType === 'core-embed/youtube' ||
      blockType.endsWith('/youtube') ||
      blockType === 'video'
    ) {
      const block = convertEmbed(innerHtml, attrs);
      if (block) { blocks.push(block); return; }
      warnings.push({ code: 'UNKNOWN_EMBED_SKIPPED', message: `Embed block could not be converted to YouTube block`, context: blockType });
      stats.unknownEmbedsSkipped++;
      return;
    }

    // ── Separator / HR ────────────────────────────────────────────────────────
    if (blockType === 'separator') {
      blocks.push({ id: uuidv4(), type: 'divider', props: {} });
      return;
    }

    // ── Quote / pullquote ─────────────────────────────────────────────────────
    if (blockType === 'quote' || blockType === 'pullquote') {
      const block = convertQuote(innerHtml);
      if (block) { blocks.push(block); return; }
      stats.emptyBlocksSkipped++;
      return;
    }

    // ── Yoast FAQ block ───────────────────────────────────────────────────────
    if (blockType === 'yoast/faq-block') {
      const { blocks: faqBlocks, faqItems } = convertFaqBlock(innerHtml, attrs);
      if (faqBlocks.length > 0) {
        for (const b of faqBlocks) blocks.push(b);
        for (const item of faqItems) faqData.push(item);
        warnings.push({
          code: 'FAQ_BLOCK_PROCESSED',
          message: `FAQ block processed — ${faqItems.length} Q&A pair(s) converted`,
          context: `${faqItems.length} pairs`,
        });
      } else {
        warnings.push({
          code: 'FAQ_BLOCK_EMPTY',
          message: 'yoast/faq-block produced no content — skipped',
          context: blockType,
        });
        stats.emptyBlocksSkipped++;
      }
      return;
    }

    // ── Layout containers (group, columns, column, etc.) ──────────────────────
    // These have no article semantics. We flatten their inner content by
    // recursively processing the inner Gutenberg blocks they contain.
    if (isLayoutBlock(blockType)) {
      warnings.push({
        code: 'CONTAINER_FLATTENED',
        message: `Unsupported layout container wp:${blockType} — inner content flattened`,
        context: blockType,
      });
      stats.unsupportedContainersFlattened++;
      // Recurse into the inner HTML to extract real content blocks
      const inner = splitGutenbergBlocks(innerHtml);
      for (const child of inner) processBlock(child);
      return;
    }

    // ── Raw text / unrecognized block type ────────────────────────────────────
    if (blockType === '__text__' || blockType === 'freeform' || blockType === 'html') {
      // Parse the raw HTML chunk and extract whatever we can
      const $ = load(innerHtml);

      $('body').children().each((_, el) => {
        const tag = tagName(el);

        if (/^h[1-6]$/.test(tag)) {
          const block = convertHeading($.html(el));
          if (block) blocks.push(block);
          return;
        }

        if (tag === 'p') {
          const text = sanitizeInlineHtml($(el).html() || '');
          if (plainText(text)) {
            // Check for YouTube URL inside the paragraph
            const ytId = extractYoutubeId($(el).text());
            if (ytId) {
              blocks.push({ id: uuidv4(), type: 'youtube', props: { url: `https://www.youtube.com/watch?v=${ytId}` } });
              return;
            }
            blocks.push({ id: uuidv4(), type: 'text', props: { text } });
          }
          return;
        }

        if (tag === 'ul' || tag === 'ol') {
          const items: string[] = $(el).find('li').map((_, li) => sanitizeInlineHtml($(li).html() || '')).get().filter(t => !!plainText(t));
          if (items.length) blocks.push({ id: uuidv4(), type: 'list', props: { ordered: tag === 'ol', items } });
          return;
        }

        if (tag === 'blockquote') {
          const block = convertQuote($.html(el));
          if (block) blocks.push(block);
          return;
        }

        if (tag === 'table') {
          const { block, isToc } = convertTable($.html(el));
          if (isToc) {
            stats.tocTablesRemoved++;
            warnings.push({ code: 'TOC_TABLE_REMOVED', message: 'TOC table in freeform HTML removed', context: '' });
            return;
          }
          if (block) blocks.push(block);
          return;
        }

        if (tag === 'figure') {
          // Could be image or embed
          const img = $(el).find('img').first();
          if (img.length) {
            const block = convertImage($.html(el));
            if (block) blocks.push(block);
            return;
          }
          // Check for youtube URL in figure text
          const ytId = extractYoutubeId($(el).text());
          if (ytId) {
            blocks.push({ id: uuidv4(), type: 'youtube', props: { url: `https://www.youtube.com/watch?v=${ytId}` } });
          }
          return;
        }

        if (tag === 'hr') {
          blocks.push({ id: uuidv4(), type: 'divider', props: {} });
          return;
        }

        // div or other container — try to extract text content as paragraph
        if (tag === 'div') {
          const text = sanitizeInlineHtml($(el).html() || '');
          if (plainText(text)) {
            blocks.push({ id: uuidv4(), type: 'text', props: { text } });
          }
        }
      });

      return;
    }

    // ── Completely unhandled block type ───────────────────────────────────────
    warnings.push({
      code: 'UNHANDLED_BLOCK_TYPE',
      message: `Block type wp:${blockType} has no handler — skipped`,
      context: blockType,
    });
    stats.emptyBlocksSkipped++;
  }

  for (const gb of gutBlocks) processBlock(gb);

  stats.blocksProduced = blocks.length;

  return {
    version: 1,
    source: 'wordpress-import',
    blocks,
    faqData,
    warnings,
    stats,
  };
}
