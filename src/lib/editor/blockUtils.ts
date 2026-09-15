export interface EditorBlockLike {
  id: string;
  type: string;
  props?: Record<string, any>;
  children?: EditorBlockLike[];
}

export interface HeadingEntry {
  id: string;
  text: string;
  level: number;
  anchorId: string;
  includeInToc: boolean;
}

export function cloneBlocks<T extends EditorBlockLike>(blocks: T[]): T[] {
  return JSON.parse(JSON.stringify(blocks));
}

export function slugifyAnchor(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function getHeadingAnchor(block: EditorBlockLike): string {
  const manual = typeof block.props?.anchorId === 'string' ? block.props.anchorId.trim() : '';
  const text = typeof block.props?.text === 'string' ? block.props.text : '';
  return manual || slugifyAnchor(stripHtml(text)) || block.id;
}

export function stripHtml(value: string): string {
  return value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

export function normalizeHeadingAnchors<T extends EditorBlockLike>(blocks: T[]): T[] {
  const seenAnchors = new Map<string, number>();

  const walk = (items: T[]): T[] =>
    items.map((block) => {
      const nextBlock = {
        ...block,
        props: { ...(block.props ?? {}) },
        children: block.children ? walk(block.children as T[]) : block.children,
      };

      if (nextBlock.type === 'heading') {
        const baseAnchor = getHeadingAnchor(nextBlock);
        const occurrence = seenAnchors.get(baseAnchor) ?? 0;
        seenAnchors.set(baseAnchor, occurrence + 1);
        nextBlock.props.anchorId =
          occurrence === 0 ? baseAnchor : `${baseAnchor}-${occurrence + 1}`;

        if (typeof nextBlock.props.includeInToc !== 'boolean') {
          nextBlock.props.includeInToc = true;
        }
      }

      return nextBlock as T;
    });

  return walk(blocks);
}

export function ensureUniqueBlockIds<T extends EditorBlockLike>(blocks: T[]): T[] {
  const seenIds = new Map<string, number>();

  const walk = (items: T[]): T[] =>
    items.map((block) => {
      const baseId = block.id || 'block';
      const occurrence = seenIds.get(baseId) ?? 0;
      seenIds.set(baseId, occurrence + 1);

      const nextId = occurrence === 0 ? baseId : `${baseId}__${occurrence + 1}`;

      return {
        ...block,
        id: nextId,
        children: Array.isArray(block.children) ? walk(block.children as T[]) : block.children,
      };
    });

  return walk(blocks);
}

export function collectHeadings<T extends EditorBlockLike>(blocks: T[]): HeadingEntry[] {
  const headings: HeadingEntry[] = [];

  const walk = (items: T[]) => {
    items.forEach((block) => {
      if (block.type === 'heading') {
        const level = typeof block.props?.level === 'number' ? block.props.level : 2;
        const text = stripHtml(typeof block.props?.text === 'string' ? block.props.text : '');
        headings.push({
          id: block.id,
          text,
          level,
          anchorId: getHeadingAnchor(block),
          includeInToc: block.props?.includeInToc !== false,
        });
      }

      if (Array.isArray(block.children) && block.children.length > 0) {
        walk(block.children as T[]);
      }
    });
  };

  walk(blocks);
  return headings;
}

export function updateBlockById<T extends EditorBlockLike>(
  blocks: T[],
  id: string,
  updater: (block: T) => T,
): T[] {
  return blocks.map((block) => {
    if (block.id === id) {
      return updater(block);
    }

    if (Array.isArray(block.children) && block.children.length > 0) {
      return {
        ...block,
        children: updateBlockById(block.children as T[], id, updater),
      };
    }

    return block;
  });
}

export function removeBlockById<T extends EditorBlockLike>(blocks: T[], id: string): T[] {
  return blocks
    .filter((block) => block.id !== id)
    .map((block) => ({
      ...block,
      children: Array.isArray(block.children) ? removeBlockById(block.children as T[], id) : block.children,
    }));
}

export function appendBlocksToParent<T extends EditorBlockLike>(
  blocks: T[],
  newBlocks: T[],
  parentId?: string,
): T[] {
  if (!parentId) {
    return [...blocks, ...newBlocks];
  }

  return blocks.map((block) => {
    if (block.id === parentId) {
      return {
        ...block,
        children: [...(block.children ?? []), ...newBlocks],
      };
    }

    if (Array.isArray(block.children) && block.children.length > 0) {
      return {
        ...block,
        children: appendBlocksToParent(block.children as T[], newBlocks, parentId),
      };
    }

    return block;
  });
}

export function duplicateBlockTree<T extends EditorBlockLike>(
  block: T,
  makeId: () => string,
): T {
  const duplicated = cloneBlocks([block])[0];
  const walk = (node: T) => {
    node.id = makeId();
    if (Array.isArray(node.children)) {
      node.children.forEach((child) => walk(child as T));
    }
  };
  walk(duplicated);
  return duplicated;
}

export function duplicateBlockById<T extends EditorBlockLike>(
  blocks: T[],
  id: string,
  makeId: () => string,
): { blocks: T[]; duplicatedId: string | null } {
  let duplicatedId: string | null = null;

  const walk = (items: T[]): T[] => {
    const next: T[] = [];

    items.forEach((block) => {
      next.push(block);

      if (block.id === id) {
        const duplicated = duplicateBlockTree(block, makeId);
        duplicatedId = duplicated.id;
        next.push(duplicated);
        return;
      }

      if (Array.isArray(block.children) && block.children.length > 0) {
        next[next.length - 1] = {
          ...block,
          children: walk(block.children as T[]),
        };
      }
    });

    return next;
  };

  return { blocks: walk(blocks), duplicatedId };
}

export function moveBlockWithinSiblings<T extends EditorBlockLike>(
  blocks: T[],
  activeId: string,
  overId: string,
): T[] {
  const reorder = (items: T[]): T[] => {
    const activeIndex = items.findIndex((item) => item.id === activeId);
    const overIndex = items.findIndex((item) => item.id === overId);

    if (activeIndex !== -1 && overIndex !== -1) {
      const next = [...items];
      const [moved] = next.splice(activeIndex, 1);
      next.splice(overIndex, 0, moved);
      return next;
    }

    return items.map((block) => {
      if (Array.isArray(block.children) && block.children.length > 0) {
        return {
          ...block,
          children: reorder(block.children as T[]),
        };
      }
      return block;
    });
  };

  return reorder(blocks);
}

export function insertBlocksRelative<T extends EditorBlockLike>(
  blocks: T[],
  targetId: string,
  newBlocks: T[],
  position: 'before' | 'after',
): T[] {
  const walk = (items: T[]): T[] => {
    const targetIndex = items.findIndex((item) => item.id === targetId);
    if (targetIndex !== -1) {
      const next = [...items];
      const offset = position === 'before' ? 0 : 1;
      next.splice(targetIndex + offset, 0, ...newBlocks);
      return next;
    }

    return items.map((block) => {
      if (Array.isArray(block.children) && block.children.length > 0) {
        return {
          ...block,
          children: walk(block.children as T[]),
        };
      }

      return block;
    });
  };

  return walk(blocks);
}

export function findSiblingIds<T extends EditorBlockLike>(
  blocks: T[],
  id: string,
): { prevId: string | null; nextId: string | null } {
  const findInList = (items: T[]): { prevId: string | null; nextId: string | null } | null => {
    const index = items.findIndex((item) => item.id === id);
    if (index !== -1) {
      return {
        prevId: index > 0 ? items[index - 1].id : null,
        nextId: index < items.length - 1 ? items[index + 1].id : null,
      };
    }

    for (const block of items) {
      if (Array.isArray(block.children) && block.children.length > 0) {
        const nested = findInList(block.children as T[]);
        if (nested) return nested;
      }
    }

    return null;
  };

  return findInList(blocks) ?? { prevId: null, nextId: null };
}

export function findBlockById<T extends EditorBlockLike>(blocks: T[], id: string): T | null {
  for (const block of blocks) {
    if (block.id === id) {
      return block;
    }

    if (Array.isArray(block.children) && block.children.length > 0) {
      const nested = findBlockById(block.children as T[], id);
      if (nested) return nested;
    }
  }

  return null;
}

function detachBlockByIdMutable<T extends EditorBlockLike>(items: T[], id: string): T | null {
  const index = items.findIndex((item) => item.id === id);
  if (index !== -1) {
    const [removed] = items.splice(index, 1);
    return removed;
  }

  for (const block of items) {
    if (Array.isArray(block.children) && block.children.length > 0) {
      const removed = detachBlockByIdMutable(block.children as T[], id);
      if (removed) return removed;
    }
  }

  return null;
}

function insertRelativeMutable<T extends EditorBlockLike>(
  items: T[],
  targetId: string,
  block: T,
  position: 'before' | 'after',
): boolean {
  const index = items.findIndex((item) => item.id === targetId);
  if (index !== -1) {
    const offset = position === 'before' ? 0 : 1;
    items.splice(index + offset, 0, block);
    return true;
  }

  for (const item of items) {
    if (Array.isArray(item.children) && item.children.length > 0) {
      if (insertRelativeMutable(item.children as T[], targetId, block, position)) {
        return true;
      }
    }
  }

  return false;
}

function appendToContainerMutable<T extends EditorBlockLike>(items: T[], containerId: string, block: T): boolean {
  for (const item of items) {
    if (item.id === containerId) {
      item.children = [...(item.children ?? []), block];
      return true;
    }

    if (Array.isArray(item.children) && item.children.length > 0) {
      if (appendToContainerMutable(item.children as T[], containerId, block)) {
        return true;
      }
    }
  }

  return false;
}

export function moveBlockInTree<T extends EditorBlockLike>(
  blocks: T[],
  activeId: string,
  targetId: string,
  position: 'before' | 'after' | 'inside' = 'before',
): T[] {
  if (activeId === targetId) return blocks;

  const nextBlocks = cloneBlocks(blocks);
  const movingBlock = findBlockById(nextBlocks, activeId);
  if (!movingBlock) return blocks;

  if (findBlockById([movingBlock] as T[], targetId)) {
    return blocks;
  }

  const detached = detachBlockByIdMutable(nextBlocks, activeId);
  if (!detached) return blocks;

  const inserted =
    position === 'inside'
      ? appendToContainerMutable(nextBlocks, targetId, detached)
      : insertRelativeMutable(nextBlocks, targetId, detached, position);

  if (!inserted) {
    return blocks;
  }

  return nextBlocks;
}
