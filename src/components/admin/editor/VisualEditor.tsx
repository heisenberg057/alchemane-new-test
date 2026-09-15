"use client";

import React, { useEffect } from 'react';
import { WidgetPalette } from './WidgetPalette';
import { Canvas } from './Canvas';
import { PropertyInspector } from './PropertyInspector';
import { EditorToolbar } from './EditorToolbar';
import { useEditorStore } from '@/lib/store/useEditorStore';
import { cn } from '@/lib/utils';

function isFocusedInEditable() {
  const el = document.activeElement;
  if (!el) return false;
  const tag = el.tagName.toLowerCase();
  if (tag === 'input' || tag === 'textarea') return true;
  if ((el as HTMLElement).isContentEditable) return true;
  // TipTap editor
  if (el.closest('.tiptap')) return true;
  return false;
}

export function VisualEditor({ onClose }: { onClose?: () => void }) {
  const { isPreviewMode, blocks, undo, redo, selectedId, removeBlock, selectBlock } = useEditorStore();

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const isMac = navigator.platform.startsWith('Mac');
      const mod = isMac ? e.metaKey : e.ctrlKey;

      if (mod && !e.shiftKey && e.key === 'z') {
        undo();
        e.preventDefault();
        return;
      }
      if (mod && e.shiftKey && e.key === 'z') {
        redo();
        e.preventDefault();
        return;
      }
      if (mod && e.key === 'y') {
        redo();
        e.preventDefault();
        return;
      }
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId && !isFocusedInEditable()) {
        removeBlock(selectedId);
        e.preventDefault();
        return;
      }
      if (e.key === 'Escape') {
        selectBlock(null);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [undo, redo, selectedId, removeBlock, selectBlock]);

  return (
    <div className="flex flex-col w-full h-full bg-[#131415] overflow-hidden shadow-2xl relative">
      <EditorToolbar onClose={onClose} />
      {!isPreviewMode && (
        <div className="px-4 py-1 bg-[#1a1d1f] border-b border-[#2a2d30] text-xs text-[#666] select-none flex items-center gap-3">
          <span>Blocks: {blocks.length}</span>
          <span className="text-[#444]">|</span>
          <span className="text-[#444]">⌘Z undo · ⌘⇧Z redo · Del remove selected</span>
        </div>
      )}
      <div className="flex flex-1 overflow-hidden h-[calc(100vh-48px)]">
        {/* Left Panel - Widget Palette */}
        {!isPreviewMode && (
          <aside className="w-[300px] border-r border-[#131415] bg-[#26292c] overflow-y-auto no-scrollbar transition-all">
            <WidgetPalette />
          </aside>
        )}

        {/* Center Panel - Canvas (The Page) */}
        <main className={cn(
          "flex-1 overflow-y-auto relative no-scrollbar transition-all",
          isPreviewMode ? "bg-white p-0 flex justify-center w-full" : "bg-[#f1f3f5] p-12 border-x border-[#131415]/10"
        )}>
          <Canvas />
        </main>

        {/* Right Panel - Property Inspector */}
        {!isPreviewMode && (
          <aside className="w-[300px] border-l border-[#131415] bg-[#26292c] overflow-y-auto no-scrollbar transition-all">
            <PropertyInspector />
          </aside>
        )}
      </div>
    </div>
  );
}
