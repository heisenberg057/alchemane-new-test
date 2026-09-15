"use client";

import React, { useRef, useEffect } from 'react';
import { useEditorStore } from '@/lib/store/useEditorStore';

interface HeadingBlockProps {
  id: string;
  level?: number;
  text?: string;
  textAlign?: 'left' | 'center' | 'right';
  color?: string;
  fontWeight?: string;
  anchorId?: string;
  marginTop?: string;
  marginBottom?: string;
}

const fontWeightMap: Record<string, string> = {
  normal: '400',
  semibold: '600',
  bold: '700',
  extrabold: '800',
};

export function HeadingBlock({ id, level, text, textAlign, color, fontWeight, anchorId, marginTop, marginBottom }: HeadingBlockProps) {
  const { updateBlockProps, isPreviewMode } = useEditorStore();
  const ref = useRef<HTMLElement>(null);
  const isEditing = useRef(false);

  const safeLevel = typeof level === 'number' && level >= 1 && level <= 6 ? level : 2;
  const Tag = `h${safeLevel}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  const safeText = typeof text === 'string' ? text : '';
  const resolvedAnchorId = anchorId || id;

  useEffect(() => {
    if (ref.current && !isEditing.current && ref.current.textContent !== safeText) {
      ref.current.textContent = safeText;
    }
  }, [safeText]);

  return (
    <Tag
      id={resolvedAnchorId}
      ref={ref as React.Ref<HTMLHeadingElement>}
      style={{
        textAlign: textAlign ?? 'left',
        color: color ?? '#111827',
        fontWeight: fontWeightMap[fontWeight ?? ''] ?? '700',
        marginTop: marginTop || undefined,
        marginBottom: marginBottom || undefined,
      }}
      className="tracking-tight outline-none focus:ring-1 ring-[#e31c58]/30 px-1 rounded transition-all"
      contentEditable={!isPreviewMode}
      suppressContentEditableWarning
      onFocus={() => { isEditing.current = true; }}
      onBlur={(e) => {
        isEditing.current = false;
        if (!isPreviewMode) {
          const newText = e.currentTarget.textContent ?? '';
          // Auto-generate anchorId from text if not manually set
          const autoId = newText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          updateBlockProps(id, {
            text: newText,
            anchorId: anchorId || autoId || id,
          });
        }
      }}
    />
  );
}
