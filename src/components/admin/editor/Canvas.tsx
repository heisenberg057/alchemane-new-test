import React, { useMemo, useState } from 'react';
import { useEditorStore, Block, getSiblingTargets } from '@/lib/store/useEditorStore';
import { cn } from '@/lib/utils';
import { findBlockById } from '@/lib/editor/blockUtils';
import {
  PlusCircle,
  Plus,
  Copy,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronRight,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { SharedBlockRenderer } from '@/components/blocks/SharedBlockRenderer';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import { BlockErrorBoundary } from './BlockErrorBoundary';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay as DndDragOverlay,
  DragStartEvent,
  useDroppable,
} from '@dnd-kit/core';
import {
  sortableKeyboardCoordinates,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export function Canvas() {
  const {
    blocks,
    selectedId,
    selectBlock,
    device,
    isPreviewMode,
    moveBlock,
    updateBlockProps,
  } = useEditorStore();
  const [activeBlock, setActiveBlock] = useState<Block | null>(null);
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(new Set());

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const shellRenderer = useMemo(() => {
    function RenderEditorShell({ block, content, depth, isSelected, isCollapsed, hasChildren }: any) {
      return (
        <EditorBlockShell
          key={block.id}
          block={block}
          content={content}
          depth={depth}
          isSelected={isSelected}
          isCollapsed={isCollapsed}
          hasChildren={hasChildren}
          onToggleCollapse={() => {
            setCollapsedIds((current) => {
              const next = new Set(current);
              if (next.has(block.id)) next.delete(block.id);
              else next.add(block.id);
              return next;
            });
          }}
        />
      );
    }

    RenderEditorShell.displayName = 'RenderEditorShell';
    return RenderEditorShell;
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    const found = findBlockById(blocks, String(event.active.id));
    setActiveBlock(found ?? null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveBlock(null);
    if (over && active.id !== over.id) {
      const overId = String(over.id);
      if (overId.startsWith('container:')) {
        moveBlock(String(active.id), overId.replace('container:', ''), 'inside');
        return;
      }
      if (overId.startsWith('container-shell:')) {
        moveBlock(String(active.id), overId.replace('container-shell:', ''), 'inside');
        return;
      }

      const activeIndex = event.active.data.current?.sortable?.index;
      const overIndex = event.over?.data.current?.sortable?.index;
      const sameContainer = event.active.data.current?.sortable?.containerId === event.over?.data.current?.sortable?.containerId;
      const position = sameContainer && typeof activeIndex === 'number' && typeof overIndex === 'number' && activeIndex < overIndex ? 'after' : 'before';
      moveBlock(String(active.id), overId, position);
    }
  };

  const getDeviceWidth = () => {
    switch (device) {
      case 'mobile':
        return 'max-w-[390px]';
      case 'tablet':
        return 'max-w-[820px]';
      case 'desktop':
      default:
        return 'max-w-6xl';
    }
  };

  if (blocks.length === 0) {
    return (
      <div className="flex min-h-[460px] flex-col items-center justify-center rounded-[28px] border border-dashed border-[#d5dce6] bg-[radial-gradient(circle_at_top,#ffffff,rgba(248,250,252,0.92))] p-10 text-center shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
        <PlusCircle className="mb-4 h-12 w-12 text-[#c3cedb]" />
        <p className="text-lg font-semibold text-[#0f172a]">Start building your page visually</p>
        <p className="mt-2 max-w-md text-sm leading-6 text-[#64748b]">
          Drag widgets from the left panel or insert one-click templates to build polished, production-ready sections.
        </p>
      </div>
    );
  }

  if (isPreviewMode) {
    return (
      <div className={cn('mx-auto w-full rounded-[28px] border border-[#e4eaf0] bg-white p-8 shadow-[0_24px_90px_rgba(15,23,42,0.12)]', getDeviceWidth())}>
        <BlockRenderer blocks={blocks} prose={true} device={device} />
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={() => setActiveBlock(null)}
    >
      <div className={cn('mx-auto mt-8 w-full rounded-[28px] border border-[#dce5ef] bg-white p-8 shadow-[0_24px_90px_rgba(15,23,42,0.12)] transition-all duration-300', getDeviceWidth())}>
        <BlockErrorBoundary blockType="canvas-root">
          <SharedBlockRenderer
            blocks={blocks}
            allBlocks={blocks}
            options={{
              interactive: true,
              device,
              selectedId,
              collapsedIds,
              onPropChange: updateBlockProps,
              onSelectBlock: selectBlock,
              onToggleCollapse: (id) => {
                setCollapsedIds((current) => {
                  const next = new Set(current);
                  if (next.has(id)) next.delete(id);
                  else next.add(id);
                  return next;
                });
              },
              renderBlockShell: shellRenderer,
            }}
          />
        </BlockErrorBoundary>

        <button
          type="button"
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[#d5dce6] px-6 py-6 text-sm font-medium text-[#64748b] transition-all hover:border-[#e31c58] hover:bg-[#fff4f7] hover:text-[#e31c58]"
          onClick={() => useEditorStore.getState().addBlock('text')}
        >
          <Plus className="h-4 w-4" />
          Quick insert paragraph block
        </button>
      </div>

      <DndDragOverlay>
        {activeBlock && (
          <div className="w-[min(720px,80vw)] rounded-[24px] border border-[#e31c58] bg-white p-5 shadow-[0_28px_80px_rgba(227,28,88,0.24)]">
            <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#e31c58]">{activeBlock.type}</div>
            <SharedBlockRenderer
              blocks={[activeBlock]}
              allBlocks={blocks}
              options={{ interactive: false, device }}
            />
          </div>
        )}
      </DndDragOverlay>
    </DndContext>
  );
}

function EditorBlockShell({
  block,
  content,
  depth,
  isSelected,
  isCollapsed,
  hasChildren,
  onToggleCollapse,
}: {
  block: Block;
  content: React.ReactNode;
  depth: number;
  isSelected: boolean;
  isCollapsed: boolean;
  hasChildren: boolean;
  onToggleCollapse: () => void;
}) {
  const { removeBlock, duplicateBlock, selectBlock, addBlock, moveBlock, insertBlocksRelative } = useEditorStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const { prevId, nextId } = getSiblingTargets(block.id);
  const sortable = useSortable({ id: block.id });
  const isContainer = block.type === 'section' || block.type === 'column';
  const dropInside = useDroppable({
    id: `container-shell:${block.id}`,
    disabled: !isContainer || isCollapsed,
  });
  const style = {
    transform: CSS.Transform.toString(sortable.transform),
    transition: sortable.transition,
    opacity: sortable.isDragging ? 0.35 : 1,
    zIndex: sortable.isDragging ? 40 : 1,
  };

  return (
    <div
      ref={(node) => {
        sortable.setNodeRef(node);
        if (isContainer) {
          dropInside.setNodeRef(node);
        }
      }}
      style={style}
      className={cn(
        'group relative rounded-[24px] transition-all duration-200',
        isSelected
          ? 'ring-2 ring-[#e31c58] ring-offset-4 ring-offset-[#f8fafc] shadow-[0_18px_50px_rgba(227,28,88,0.12)]'
          : 'hover:ring-1 hover:ring-[#e31c58]/35 hover:ring-offset-2 hover:ring-offset-white',
        dropInside.isOver && 'ring-2 ring-[#0ea5e9] ring-offset-4 ring-offset-[#f8fafc]',
        depth > 0 && 'mt-2',
      )}
      onMouseDown={() => selectBlock(block.id)}
      onContextMenu={(event) => {
        event.preventDefault();
        setMenuOpen((open) => !open);
      }}
    >
      <div
        className={cn(
          'absolute left-4 right-4 top-3 z-20 flex items-center justify-between gap-3 rounded-2xl border border-white/60 bg-white/90 px-3 py-2 shadow-[0_14px_32px_rgba(15,23,42,0.08)] backdrop-blur transition-all',
          isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
        )}
      >
        <div className="flex items-center gap-2">
          {hasChildren && (
            <button
              type="button"
              className="rounded-md p-1 text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#0f172a]"
              onMouseDown={(event) => {
                event.stopPropagation();
                onToggleCollapse();
              }}
              title={isCollapsed ? 'Expand block' : 'Collapse block'}
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          )}
          <div className="rounded-full bg-[#fff4f7] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#e31c58]">
            {block.type}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            className="rounded-md p-2 text-[#64748b] transition-colors hover:bg-[#f1f5f9] hover:text-[#0f172a]"
            title="Insert paragraph inside"
            onMouseDown={(event) => {
              event.stopPropagation();
              addBlock('text', block.type === 'section' || block.type === 'column' ? block.id : undefined);
            }}
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="rounded-md p-2 text-[#64748b] transition-colors hover:bg-[#f1f5f9] hover:text-[#0f172a] disabled:opacity-35"
            title="Move up"
            disabled={!prevId}
            onMouseDown={(event) => {
              event.stopPropagation();
              if (prevId) moveBlock(block.id, prevId, 'before');
            }}
          >
            <ArrowUp className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="rounded-md p-2 text-[#64748b] transition-colors hover:bg-[#f1f5f9] hover:text-[#0f172a] disabled:opacity-35"
            title="Move down"
            disabled={!nextId}
            onMouseDown={(event) => {
              event.stopPropagation();
              if (nextId) moveBlock(block.id, nextId, 'after');
            }}
          >
            <ArrowDown className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="rounded-md p-2 text-[#64748b] transition-colors hover:bg-[#f1f5f9] hover:text-[#0f172a]"
            title="Duplicate"
            onMouseDown={(event) => {
              event.stopPropagation();
              duplicateBlock(block.id);
            }}
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            type="button"
            className="rounded-md p-2 text-[#64748b] transition-colors hover:bg-[#fff1f2] hover:text-[#be123c]"
            title="Delete"
            onMouseDown={(event) => {
              event.stopPropagation();
              removeBlock(block.id);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <div
            {...sortable.attributes}
            {...sortable.listeners}
            className="cursor-grab rounded-md p-2 text-[#64748b] transition-colors hover:bg-[#f1f5f9] hover:text-[#0f172a] active:cursor-grabbing"
            title="Drag to reorder"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <GripVertical className="h-4 w-4" />
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="absolute right-4 top-16 z-30 min-w-[220px] rounded-2xl border border-[#e5eaf1] bg-white p-2 shadow-[0_24px_60px_rgba(15,23,42,0.14)]">
          <button
            type="button"
            className="flex w-full items-center rounded-xl px-3 py-2 text-left text-sm text-[#334155] hover:bg-[#f8fafc]"
            onClick={() => {
              insertBlocksRelative(block.id, [{
                id: crypto.randomUUID(),
                type: 'text',
                props: { text: '<p>New paragraph…</p>', fontSize: '16px', color: '#333333' },
              }], 'before');
              setMenuOpen(false);
            }}
          >
            Insert paragraph above
          </button>
          <button
            type="button"
            className="flex w-full items-center rounded-xl px-3 py-2 text-left text-sm text-[#334155] hover:bg-[#f8fafc]"
            onClick={() => {
              insertBlocksRelative(block.id, [{
                id: crypto.randomUUID(),
                type: 'text',
                props: { text: '<p>New paragraph…</p>', fontSize: '16px', color: '#333333' },
              }], 'after');
              setMenuOpen(false);
            }}
          >
            Insert paragraph below
          </button>
          <button
            type="button"
            className="flex w-full items-center rounded-xl px-3 py-2 text-left text-sm text-[#334155] hover:bg-[#f8fafc]"
            onClick={() => {
              duplicateBlock(block.id);
              setMenuOpen(false);
            }}
          >
            Duplicate block
          </button>
          <button
            type="button"
            className="flex w-full items-center rounded-xl px-3 py-2 text-left text-sm text-[#be123c] hover:bg-[#fff1f2]"
            onClick={() => {
              removeBlock(block.id);
              setMenuOpen(false);
            }}
          >
            Delete block
          </button>
        </div>
      )}

      <div className="rounded-[24px] border border-transparent p-4 pt-14 transition-colors group-hover:border-[#eef2f7]">
        {isCollapsed ? (
          <div className="rounded-2xl border border-dashed border-[#d5dce6] bg-[#f8fafc] px-5 py-4 text-sm text-[#64748b]">
            Block collapsed. Expand to continue editing.
          </div>
        ) : (
          <>
            {content}
            {isContainer && (
              <ContainerDropIndicator
                blockId={block.id}
                active={dropInside.isOver}
                onInsert={() => addBlock('text', block.id)}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

function ContainerDropIndicator({
  blockId,
  active,
  onInsert,
}: {
  blockId: string;
  active: boolean;
  onInsert: () => void;
}) {
  const droppable = useDroppable({ id: `container:${blockId}` });

  return (
    <div
      ref={droppable.setNodeRef}
      className={cn(
        'mt-3 rounded-2xl border border-dashed px-4 py-3 text-center text-xs transition-all',
        active || droppable.isOver
          ? 'border-[#0ea5e9] bg-[#eff8ff] text-[#0369a1]'
          : 'border-[#d7e0ea] bg-[#f8fafc] text-[#64748b]',
      )}
    >
      <div className="flex items-center justify-center gap-2">
        <Plus className="h-3.5 w-3.5" />
        <span>Drop block inside container</span>
        <button type="button" className="rounded-full bg-white px-2 py-1 text-[10px] font-semibold text-[#e31c58]" onClick={onInsert}>
          Quick insert
        </button>
      </div>
    </div>
  );
}
