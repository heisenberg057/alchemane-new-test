import type { Block } from "@/lib/store/useEditorStore";

function stripHtml(html: string): string {
  if (!html) return "";
  return html.replace(/<[^>]*>?/gm, " ");
}

function walkBlock(block: Block): string[] {
  const out: string[] = [];
  const p = block.props || {};
  switch (block.type) {
    case "heading":
    case "text":
      out.push(stripHtml(String(p.text ?? p.content ?? "")).trim());
      break;
    case "list":
      if (Array.isArray(p.items)) {
        out.push(p.items.map((x: string) => stripHtml(String(x))).join(" "));
      }
      break;
    case "table": {
      const headers = Array.isArray(p.headers) ? p.headers : [];
      const rows = Array.isArray(p.rows) ? p.rows : [];
      out.push(
        [...headers, ...rows.flat()]
          .map((c: string) => stripHtml(String(c)))
          .filter(Boolean)
          .join(" ")
      );
      break;
    }
    case "button":
      out.push(stripHtml(String(p.text ?? "")));
      break;
    default:
      break;
  }
  if (block.children?.length) {
    for (const c of block.children) {
      out.push(...walkBlock(c));
    }
  }
  return out.filter(Boolean);
}

/** Plain text from VisualEditor block tree for AI / SEO prompts. */
export function blocksToPlainText(blocks: Block[]): string {
  if (!blocks?.length) return "";
  return blocks.flatMap(walkBlock).join("\n\n").trim();
}

export function stripHtmlToText(html: string): string {
  return stripHtml(html).replace(/\s+/g, " ").trim();
}
