import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import {
  appendBlocksToParent,
  cloneBlocks,
  duplicateBlockById,
  findSiblingIds,
  insertBlocksRelative,
  moveBlockInTree,
  moveBlockWithinSiblings,
  normalizeHeadingAnchors,
  removeBlockById,
  updateBlockById,
} from '@/lib/editor/blockUtils';

export type BlockType =
  | 'heading'
  | 'text'
  | 'image'
  | 'youtube'
  | 'video'
  | 'section'
  | 'column'
  | 'columns-2'
  | 'columns-3'
  | 'columns-4'
  | 'divider'
  | 'table'
  | 'button'
  | 'spacer'
  | 'list'
  | 'quote'
  | 'callout'
  | 'toc'
  | 'faq';

export interface Block {
  id: string;
  type: BlockType;
  props: Record<string, any>;
  children?: Block[];
}

interface EditorState {
  blocks: Block[];
  selectedId: string | null;
  history: Block[][];
  historyIndex: number;
  
  // View State
  device: 'desktop' | 'tablet' | 'mobile';
  isPreviewMode: boolean;
  
  // Actions
  setBlocks: (blocks: Block[]) => void;
  replaceBlocks: (blocks: Block[], options?: { recordHistory?: boolean; preserveSelection?: boolean }) => void;
  appendBlocks: (blocks: Block[], parentId?: string) => void;
  insertBlocksRelative: (targetId: string, blocks: Block[], position: 'before' | 'after') => void;
  resetEditor: () => void;
  addBlock: (type: BlockType, parentId?: string) => void;
  removeBlock: (id: string) => void;
  updateBlockProps: (id: string, props: Record<string, any>) => void;
  selectBlock: (id: string | null) => void;
  moveBlock: (activeId: string, overId: string, position?: 'before' | 'after' | 'inside') => void;
  duplicateBlock: (id: string) => void;
  setDevice: (device: 'desktop' | 'tablet' | 'mobile') => void;
  togglePreviewMode: () => void;
  
  // History
  undo: () => void;
  redo: () => void;
  saveToHistory: () => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  blocks: [],
  selectedId: null,
  history: [[]],
  historyIndex: 0,
  device: 'desktop',
  isPreviewMode: false,

  setBlocks: (blocks) => {
    get().replaceBlocks(blocks, { recordHistory: false, preserveSelection: true });
  },

  replaceBlocks: (blocks, options) => {
    const recordHistory = options?.recordHistory ?? true;
    const preserveSelection = options?.preserveSelection ?? true;
    const normalized = normalizeHeadingAnchors(cloneBlocks(blocks));

    set((state) => {
      const validIds = new Set<string>();
      const collectIds = (items: Block[]) => {
        items.forEach((block) => {
          validIds.add(block.id);
          if (Array.isArray(block.children)) {
            collectIds(block.children);
          }
        });
      };
      collectIds(normalized);

      return {
        blocks: normalized,
        selectedId: preserveSelection && state.selectedId && validIds.has(state.selectedId) ? state.selectedId : null,
      };
    });

    if (recordHistory) {
      get().saveToHistory();
    }
  },

  appendBlocks: (blocks, parentId) => {
    const current = get().blocks;
    const nextBlocks = appendBlocksToParent(current, normalizeHeadingAnchors(cloneBlocks(blocks)), parentId);
    get().replaceBlocks(nextBlocks);
  },

  insertBlocksRelative: (targetId, blocks, position) => {
    const nextBlocks = insertBlocksRelative(get().blocks, targetId, normalizeHeadingAnchors(cloneBlocks(blocks)), position);
    get().replaceBlocks(nextBlocks);
  },

  resetEditor: () => set({
    blocks: [],
    selectedId: null,
    history: [[]],
    historyIndex: 0,
    device: 'desktop',
    isPreviewMode: false,
  }),

  addBlock: (type, parentId) => {
    // Handle multi-column presets
    if (type === 'columns-2' || type === 'columns-3' || type === 'columns-4') {
      const colCount = type === 'columns-2' ? 2 : type === 'columns-3' ? 3 : 4;
      const sectionId = uuidv4();
      const columns: Block[] = Array.from({ length: colCount }, () => ({
        id: uuidv4(),
        type: 'column' as BlockType,
        props: { width: `${Math.round(100 / colCount)}%`, padding: '8px', stackOnMobile: true },
        children: [],
      }));
      const sectionBlock: Block = {
        id: sectionId,
        type: 'section',
        props: { backgroundColor: 'transparent', padding: '16px', layout: 'flex-row', gap: '16px', stackOnMobile: true },
        children: columns,
      };
      get().appendBlocks([sectionBlock]);
      set({ selectedId: sectionId });
      return;
    }

    const newBlock: Block = {
      id: uuidv4(),
      type,
      props: getDefaultProps(type),
      children: type === 'section' || type === 'column' ? [] : undefined,
    };

    get().appendBlocks([newBlock], parentId);
    set({ selectedId: newBlock.id });
  },

  removeBlock: (id) => {
    const nextBlocks = removeBlockById(get().blocks, id);
    get().replaceBlocks(nextBlocks, { preserveSelection: false });
  },

  updateBlockProps: (id, props) => {
    const nextBlocks = updateBlockById(get().blocks, id, (block) => ({
      ...block,
      props: { ...(block.props ?? {}), ...props },
    }));
    get().replaceBlocks(nextBlocks);
  },

  selectBlock: (id) => set({ selectedId: id }),
  setDevice: (device) => set({ device }),
  togglePreviewMode: () => set((state) => ({ isPreviewMode: !state.isPreviewMode, selectedId: null })),

  moveBlock: (activeId, overId, position = 'before') => {
    if (activeId === overId) return;
    const nextBlocks =
      position === 'before' && findSiblingIds(get().blocks, activeId).prevId === overId
        ? moveBlockWithinSiblings(get().blocks, activeId, overId)
        : moveBlockInTree(get().blocks, activeId, overId, position);
    get().replaceBlocks(nextBlocks);
    set({ selectedId: activeId });
  },

  duplicateBlock: (id: string) => {
    const { blocks, duplicatedId } = duplicateBlockById(get().blocks, id, uuidv4);
    get().replaceBlocks(blocks);
    if (duplicatedId) {
      set({ selectedId: duplicatedId });
    }
  },

  saveToHistory: () => {
    const { blocks, history, historyIndex } = get();
    const snapshot = JSON.stringify(normalizeHeadingAnchors(cloneBlocks(blocks)));
    // Dedup: skip if state is identical to the current history head
    if (history[historyIndex] !== undefined && JSON.stringify(history[historyIndex]) === snapshot) {
      return;
    }
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(snapshot));
    // Limit history to 50 steps
    if (newHistory.length > 50) newHistory.shift();
    set({
      history: newHistory,
      historyIndex: newHistory.length - 1
    });
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      set({ 
        blocks: JSON.parse(JSON.stringify(history[prevIndex])),
        historyIndex: prevIndex 
      });
    }
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      set({ 
        blocks: JSON.parse(JSON.stringify(history[nextIndex])),
        historyIndex: nextIndex 
      });
    }
  },
}));

export function getSiblingTargets(id: string) {
  return findSiblingIds(useEditorStore.getState().blocks, id);
}

function getDefaultProps(type: BlockType): Record<string, any> {
  switch (type) {
    case 'heading':
      return { text: 'New Heading', level: 2, textAlign: 'left', color: '#111827', fontWeight: 'bold', fontSize: '', anchorId: '', includeInToc: true, marginTop: '24px', marginBottom: '8px' };
    case 'text':
      return { text: '<p>Enter your text here...</p>', fontSize: '16px', color: '#333333', textAlign: 'left' };
    case 'image':
      return {
        url: '',
        alt: '',
        width: '100%',
        tabletWidth: '100%',
        mobileWidth: '100%',
        borderRadius: '0px',
        caption: '',
        alignment: 'center',
        shadow: false,
        linkUrl: '',
        linkTarget: '_self',
        maxWidth: '',
        mobileMaxWidth: '100%',
        aspectRatio: '',
        objectFit: 'cover',
        lazyLoad: true,
        openInLightbox: false,
        hoverZoom: false,
      };
    case 'youtube':
      return { url: '', caption: '', autoplay: false, mute: false, controls: true, startTime: 0, endTime: 0, aspectRatio: '16/9', lazyLoad: true };
    case 'video':
      return { url: '', autoplay: false, controls: true };
    case 'section':
      return { backgroundColor: 'transparent', padding: '20px', layout: 'stack', gap: '16px', stackOnMobile: true };
    case 'column':
      return { width: '100%', padding: '8px', stackOnMobile: true };
    case 'columns-2':
    case 'columns-3':
    case 'columns-4':
      return {}; // handled separately in addBlock
    case 'divider':
      return { thickness: '1px', color: '#eeeeee', margin: '20px 0' };
    case 'table':
      return {
        headers: ['Column 1', 'Column 2'],
        rows: [['', ''], ['', '']],
        tableData: undefined,
        borderColor: '#eeeeee',
        headerBackgroundColor: '#f8f9fa',
        striped: true,
        headerRow: true,
        headerColumn: false,
        stickyHeader: false,
        stickyFirstColumn: false,
        cellPadding: 'normal',
        textAlign: 'left',
        cellBackgroundColor: '#ffffff',
        stripedColor: '#f8fafc',
        borderStyle: 'solid',
        borderRadius: '22px',
      };
    case 'button':
      return {
        text: 'Click Here', link: '#', target: '_self',
        backgroundColor: '#e31c58', color: '#ffffff',
        borderRadius: '14px', padding: '', align: 'left',
        size: 'md', variant: 'primary', fullWidth: false,
        trackingId: '', nofollow: false, sponsored: false,
        icon: '', iconPosition: 'left', hoverColor: '',
      };
    case 'spacer':
      return { height: '50px' };
    case 'list':
      return { items: ['First item', 'Second item', 'Third item'], ordered: false, color: '#333333' };
    case 'quote':
      return { text: 'Enter quote text here...', attribution: '', borderColor: '#e31c58' };
    case 'callout':
      return { title: 'Note', text: 'Enter your callout message here...', type: 'info', calloutColor: '#fff7ed', borderColor: '#fdba74' };
    case 'toc':
      return { title: 'Table of Contents', showH1: false, showH2: true, showH3: true, showH4: false };
    case 'faq':
      return { items: [{ q: 'Question 1', a: 'Answer 1' }, { q: 'Question 2', a: 'Answer 2' }] };
    default:
      return {};
  }
}
