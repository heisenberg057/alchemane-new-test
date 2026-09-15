"use client";

import React from 'react';
import { useEditorStore } from '@/lib/store/useEditorStore';

interface TocBlockProps {
  id: string;
  title?: string;
  showH2?: boolean;
  showH3?: boolean;
  showH4?: boolean;
}

export function TocBlock({ id, title, showH2 = true, showH3 = true, showH4 = false }: TocBlockProps) {
  const { blocks } = useEditorStore();

  const headings = blocks.filter((b) => {
    if (b.type !== 'heading') return false;
    const lvl = typeof b.props?.level === 'number' ? b.props.level : 2;
    return (showH2 && lvl === 2) || (showH3 && lvl === 3) || (showH4 && lvl === 4);
  });

  return (
    <nav className="bg-gray-50 border border-gray-200 rounded-lg p-5">
      <p className="font-bold text-gray-900 mb-3 text-base">{title || 'Table of Contents'}</p>
      <ol className="space-y-1.5">
        {headings.map((h) => {
          const lvl = typeof h.props?.level === 'number' ? h.props.level : 2;
          const text = typeof h.props?.text === 'string' ? h.props.text : '';
          const anchorId = typeof h.props?.anchorId === 'string' ? h.props.anchorId : h.id;
          const indent = lvl === 3 ? 'ml-4' : lvl === 4 ? 'ml-8' : '';
          return (
            <li key={h.id} className={indent}>
              <a href={`#${anchorId}`} className="text-[#e31c58] hover:underline text-sm">
                {text || '(untitled heading)'}
              </a>
            </li>
          );
        })}
        {headings.length === 0 && (
          <li className="text-gray-400 text-xs italic">No headings found — add H2/H3 blocks</li>
        )}
      </ol>
    </nav>
  );
}
