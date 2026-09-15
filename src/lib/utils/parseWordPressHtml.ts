import { v4 as uuidv4 } from 'uuid';
import type { Block } from '@/lib/store/useEditorStore';

/**
 * Converts WordPress Gutenberg HTML (stored in `wordpressHtml`) into
 * Visual Builder Block objects.
 *
 * Uses a two-pass Gutenberg-aware approach:
 * - Pass 1: identify top-level block boundaries (wp:list, wp:table, etc.)
 *   treating nested block comments (wp:list-item) as part of their parent
 * - Pass 2: parse the inner HTML of each outer block
 *
 * Supports: paragraph, heading (h1-h6), image, youtube/embed,
 *           list (ul/ol with inner HTML per item), table (with cell data),
 *           divider, blockquote.
 */

/** Strip all HTML tags and decode basic entities — used only for plain-text extraction */
function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim();
}

/**
 * Extract text/HTML content of cells from a <tr> element string.
 * Returns array of inner HTML strings for each <td> or <th>.
 */
function extractCells(trContent: string): string[] {
  const cells: string[] = [];
  const re = /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(trContent)) !== null) {
    cells.push(m[1].trim());
  }
  return cells;
}

/**
 * Split html into top-level Gutenberg blocks, respecting nesting.
 * Returns array of { blockType, attrs, innerHtml } objects.
 * Text between blocks becomes { blockType: '__text__', innerHtml }.
 */
interface GutenbergBlock {
  blockType: string;
  attrs: string;
  innerHtml: string;
}

function splitIntoGutenbergBlocks(html: string): GutenbergBlock[] {
  const result: GutenbergBlock[] = [];
  // Matches opening block comment: <!-- wp:blocktype {...} --> or <!-- wp:blocktype -->
  const openRe = /<!--\s*wp:([\w\/-]+)(\s[^>]*)?\s*-->/g;
  // Matches closing block comment: <!-- /wp:blocktype -->
  const closeRe = /<!--\s*\/wp:([\w\/-]+)\s*-->/g;

  let pos = 0;

  while (pos < html.length) {
    openRe.lastIndex = pos;
    const openMatch = openRe.exec(html);

    if (!openMatch) {
      // No more open tags — remaining text
      const remaining = html.slice(pos).trim();
      if (remaining) result.push({ blockType: '__text__', attrs: '', innerHtml: remaining });
      break;
    }

    // Text before this open tag
    const before = html.slice(pos, openMatch.index).trim();
    if (before) result.push({ blockType: '__text__', attrs: '', innerHtml: before });

    const blockType = openMatch[1];
    const attrs = (openMatch[2] || '').trim();
    const contentStart = openMatch.index + openMatch[0].length;

    // Self-closing blocks (e.g. <!-- wp:separator /-->) — not common in this dataset
    if (openMatch[0].endsWith('/-->')) {
      result.push({ blockType, attrs, innerHtml: '' });
      pos = contentStart;
      continue;
    }

    // Find the matching close tag, accounting for nesting
    let depth = 1;
    let searchPos = contentStart;
    let innerEnd = -1;

    while (searchPos < html.length && depth > 0) {
      // Look for next open or close of this block type
      const nextOpenRe = new RegExp(`<!--\\s*wp:${blockType.replace('/', '\\/')}(\\s[^>]*)?\\s*-->`, 'g');
      const nextCloseRe = new RegExp(`<!--\\s*\\/wp:${blockType.replace('/', '\\/')}\\s*-->`, 'g');
      nextOpenRe.lastIndex = searchPos;
      nextCloseRe.lastIndex = searchPos;

      const nextOpen = nextOpenRe.exec(html);
      const nextClose = nextCloseRe.exec(html);

      if (!nextClose) {
        // No closing tag found — treat rest as inner content
        innerEnd = html.length;
        depth = 0;
        break;
      }

      if (nextOpen && nextOpen.index < nextClose.index) {
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

    if (innerEnd === -1) {
      innerEnd = html.length;
      pos = html.length;
    }

    const innerHtml = html.slice(contentStart, innerEnd).trim();
    result.push({ blockType, attrs, innerHtml });
  }

  return result;
}

export function parseWordPressHtmlToBlocks(html: string): Block[] {
  if (!html || typeof html !== 'string') return [];

  const gutenbergBlocks = splitIntoGutenbergBlocks(html);
  const blocks: Block[] = [];

  for (const gb of gutenbergBlocks) {
    const { blockType, attrs, innerHtml } = gb;

    // ── Heading ──────────────────────────────────────────────────────────────
    if (blockType === 'heading' || blockType === '__text__') {
      const headingMatch = innerHtml.match(/^<h([1-6])([^>]*)>([\s\S]*?)<\/h[1-6]>/i);
      if (headingMatch) {
        const level = parseInt(headingMatch[1], 10);
        const tagAttrs = headingMatch[2] || '';
        const rawInner = headingMatch[3];

        // Extract anchor id if present (for TOC support)
        const idMatch = tagAttrs.match(/\bid=["']([^"']+)["']/i);
        const anchorId = idMatch?.[1] || undefined;

        // Preserve inline formatting but strip block-level tags
        const cleanedInner = rawInner
          .replace(/<\/?(strong|em|b|i|span|a)[^>]*>/gi, (m) => m) // keep inline tags
          .replace(/<[^>]+>/g, '') // strip anything else (e.g. wp classes)
          .trim();

        // Re-apply inline HTML from original (keep <strong>, <em>, <a>)
        const inlineHtml = rawInner
          .replace(/<(strong|em|b|i)>/gi, '<$1>')
          .replace(/<\/(strong|em|b|i)>/gi, '</$1>')
          .replace(/<a\s([^>]*)>/gi, '<a $1>')
          .replace(/<\/a>/gi, '</a>')
          .replace(/<[^>]+>/g, '') // strip remaining tags (class, wp-block-heading, etc.)
          .trim();

        if (inlineHtml || cleanedInner) {
          blocks.push({
            id: anchorId || uuidv4(),
            type: 'heading',
            props: {
              text: inlineHtml || cleanedInner,
              level,
              textAlign: 'left',
              color: '#111827',
            },
          });
        }
        continue;
      }

      // If __text__ but not a heading, fall through to paragraph handling below
      if (blockType !== '__text__') continue;
    }

    // ── List (ul/ol) ─────────────────────────────────────────────────────────
    if (blockType === 'list') {
      const isOrdered = /"ordered"\s*:\s*true/i.test(attrs) || /<ol/i.test(innerHtml);

      // Extract <li> content — preserve inner HTML (links, bold)
      // The innerHtml for a list block looks like:
      //   <ul><!-- wp:list-item --><li>text</li><!-- /wp:list-item -->...</ul>
      // We strip out the wp:list-item comments first, then grab <li> content
      const strippedInner = innerHtml.replace(/<!--[\s\S]*?-->/g, '');
      const items = Array.from(strippedInner.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi))
        .map((m) => {
          // Clean up but preserve inline HTML (links, bold, em)
          return m[1]
            .replace(/\s+/g, ' ')
            .trim();
        })
        .filter((item) => {
          const plain = stripTags(item);
          return plain.length > 0;
        });

      if (items.length) {
        blocks.push({
          id: uuidv4(),
          type: 'list',
          props: { items, ordered: isOrdered, color: '#374151' },
        });
      }
      continue;
    }

    // ── Table ─────────────────────────────────────────────────────────────────
    if (blockType === 'table') {
      // WordPress wraps tables in <figure class="wp-block-table"><table>...</table></figure>
      const tableMatch = innerHtml.match(/<table[^>]*>([\s\S]*?)<\/table>/i);
      if (tableMatch) {
        const tableContent = tableMatch[1];
        const allRows = Array.from(tableContent.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi));

        if (allRows.length === 0) continue;

        // Check if first row has <th> elements → use as headers
        const firstRowContent = allRows[0][1];
        const hasThHeaders = /<th/i.test(firstRowContent);

        let headers: string[];
        let dataRows: string[][];

        if (hasThHeaders) {
          headers = extractCells(firstRowContent).map(stripTags);
          dataRows = allRows.slice(1).map((r) => extractCells(r[1]).map(stripTags));
        } else {
          // No explicit headers — use cell content of first row as headers
          headers = extractCells(firstRowContent).map(stripTags);
          dataRows = allRows.slice(1).map((r) => extractCells(r[1]).map(stripTags));
        }

        // Filter out empty headers (e.g. single-cell "Table of Contents" decoration)
        const allEmpty = headers.every((h) => !h.trim());
        if (allEmpty && dataRows.length === 0) continue;

        blocks.push({
          id: uuidv4(),
          type: 'table',
          props: {
            headers: allEmpty ? headers.map((_, i) => `Column ${i + 1}`) : headers,
            rows: dataRows,
            borderColor: '#e5e7eb',
            headerBackgroundColor: '#f9fafb',
          },
        });
      }
      continue;
    }

    // ── Image ─────────────────────────────────────────────────────────────────
    if (blockType === 'image') {
      const imgTagMatch = innerHtml.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
      const altMatch = innerHtml.match(/alt=["']([^"']*)["']/i);
      if (imgTagMatch) {
        blocks.push({
          id: uuidv4(),
          type: 'image',
          props: {
            url: imgTagMatch[1],
            alt: altMatch?.[1] || '',
            width: '100%',
            borderRadius: '8px',
          },
        });
      }
      continue;
    }

    // ── YouTube / video embed ─────────────────────────────────────────────────
    if (blockType === 'embed' || blockType === 'core-embed/youtube' || blockType === 'video') {
      const youtubeMatch = innerHtml.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
      if (youtubeMatch) {
        blocks.push({
          id: uuidv4(),
          type: 'youtube',
          props: {
            url: `https://www.youtube.com/watch?v=${youtubeMatch[1]}`,
            width: '100%',
            height: '400px',
          },
        });
      }
      continue;
    }

    // ── Separator / HR ────────────────────────────────────────────────────────
    if (blockType === 'separator') {
      blocks.push({
        id: uuidv4(),
        type: 'divider',
        props: { thickness: '1px', color: '#e5e7eb', margin: '24px 0' },
      });
      continue;
    }

    // ── Quote / Blockquote ────────────────────────────────────────────────────
    if (blockType === 'quote' || blockType === 'pullquote') {
      const pMatch = innerHtml.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
      const citeMatch = innerHtml.match(/<cite[^>]*>([\s\S]*?)<\/cite>/i);
      const quoteText = pMatch ? stripTags(pMatch[1]) : stripTags(innerHtml);
      if (quoteText) {
        blocks.push({
          id: uuidv4(),
          type: 'quote',
          props: {
            text: quoteText,
            attribution: citeMatch ? stripTags(citeMatch[1]) : '',
            borderColor: '#e31c58',
          },
        });
      }
      continue;
    }

    // ── Paragraph (and __text__ fallback) ────────────────────────────────────
    {
      // For wp:paragraph the innerHtml is <p ...>...</p>
      // For __text__ it may be raw text fragments between blocks
      const candidate = (blockType === '__text__') ? innerHtml : innerHtml;

      // Check for inline YouTube in paragraph
      const youtubeMatch = candidate.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
      if (youtubeMatch) {
        blocks.push({
          id: uuidv4(),
          type: 'youtube',
          props: { url: `https://www.youtube.com/watch?v=${youtubeMatch[1]}`, width: '100%', height: '400px' },
        });
        continue;
      }

      // Check for standalone image
      const imgTagMatch = candidate.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
      if (imgTagMatch && !candidate.match(/^<figure[^>]*class="[^"]*wp-block-embed/i)) {
        const altMatch = candidate.match(/alt=["']([^"']*)["']/i);
        blocks.push({
          id: uuidv4(),
          type: 'image',
          props: { url: imgTagMatch[1], alt: altMatch?.[1] || '', width: '100%', borderRadius: '8px' },
        });
        continue;
      }

      // Check for standalone HR
      if (/^<hr\s*\/?>$/i.test(candidate.trim())) {
        blocks.push({
          id: uuidv4(),
          type: 'divider',
          props: { thickness: '1px', color: '#e5e7eb', margin: '24px 0' },
        });
        continue;
      }

      // Paragraph — extract inner HTML from <p> if present
      const pMatch = candidate.match(/^<p[^>]*>([\s\S]*?)<\/p>$/i);
      const innerContent = pMatch ? pMatch[1] : candidate;

      // Skip whitespace / nbsp only
      const plain = innerContent.replace(/&nbsp;/g, ' ').replace(/<[^>]+>/g, '').trim();
      if (!plain) continue;

      blocks.push({
        id: uuidv4(),
        type: 'text',
        props: {
          text: innerContent,
          fontSize: '16px',
          color: '#374151',
        },
      });
    }
  }

  return blocks;
}
