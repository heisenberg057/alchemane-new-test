import { v4 as uuidv4 } from 'uuid';
import type { Block, BlockType } from '@/lib/store/useEditorStore';

const KNOWN_BLOCK_TYPES: ReadonlySet<string> = new Set<BlockType>([
  'heading', 'text', 'image', 'youtube', 'video',
  'section', 'column', 'divider', 'table', 'button',
  'spacer', 'list', 'quote', 'callout',
]);

/**
 * Ensures a single raw block has all required fields.
 * - Heals missing `id` with a new uuidv4
 * - Guarantees `props` is always a plain object
 * - Leaves `type` as-is (even unknown types); callers can filter separately
 */
export function normalizeBlock(raw: unknown): Block | null {
  if (!raw || typeof raw !== 'object') return null;
  const b = raw as Record<string, unknown>;

  // Must have a string type
  if (typeof b.type !== 'string' || !b.type) return null;

  const id = typeof b.id === 'string' && b.id ? b.id : uuidv4();
  const props: Record<string, unknown> =
    b.props !== null && typeof b.props === 'object' && !Array.isArray(b.props)
      ? (b.props as Record<string, unknown>)
      : {};

  // Recursively normalise children (section/column containers)
  let children: Block[] | undefined;
  if (Array.isArray(b.children)) {
    children = (b.children as unknown[])
      .map(normalizeBlock)
      .filter((c): c is Block => c !== null);
  }

  return {
    id,
    type: b.type as BlockType,
    props,
    ...(children !== undefined ? { children } : {}),
  };
}

/**
 * Normalises an array of raw block data.
 * - Filters out nulls / non-objects
 * - Heals ids and props on every block
 * - Deduplicates by id (keeps first occurrence)
 */
export function normalizeBlocks(raw: unknown[]): Block[] {
  const seen = new Set<string>();
  const result: Block[] = [];

  for (const item of raw) {
    const block = normalizeBlock(item);
    if (!block) continue;
    if (seen.has(block.id)) {
      // Duplicate id — assign a fresh one
      block.id = uuidv4();
    }
    seen.add(block.id);
    result.push(block);
  }

  return result;
}

/** Returns true when a block type is known/supported by the Visual Builder. */
export function isKnownBlockType(type: string): type is BlockType {
  return KNOWN_BLOCK_TYPES.has(type);
}
