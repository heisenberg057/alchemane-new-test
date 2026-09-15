"use client";

import React from 'react';
import { useEditorStore } from '@/lib/store/useEditorStore';
import { Input } from '@/components/ui/input';
import { Plus, X } from 'lucide-react';

interface FaqItem { q: string; a: string; }

interface FaqBlockProps {
  id: string;
  items?: FaqItem[];
}

export function FaqBlock({ id, items = [] }: FaqBlockProps) {
  const { updateBlockProps, isPreviewMode } = useEditorStore();

  if (isPreviewMode) {
    return (
      <div className="space-y-3">
        {items.map((item, i) => (
          <details key={i} className="border border-gray-200 rounded-lg overflow-hidden group">
            <summary className="cursor-pointer p-4 font-semibold flex justify-between items-center hover:bg-gray-50 list-none select-none">
              <span>{item.q}</span>
              <svg className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="px-4 pb-4 text-gray-700 text-sm leading-relaxed">{item.a}</div>
          </details>
        ))}
      </div>
    );
  }

  const updateItem = (idx: number, field: 'q' | 'a', value: string) => {
    const updated = items.map((item, i) => i === idx ? { ...item, [field]: value } : item);
    updateBlockProps(id, { items: updated });
  };

  const addItem = () => {
    updateBlockProps(id, { items: [...items, { q: `Question ${items.length + 1}`, a: 'Answer here...' }] });
  };

  const removeItem = (idx: number) => {
    updateBlockProps(id, { items: items.filter((_, i) => i !== idx) });
  };

  return (
    <div className="space-y-2 p-2 bg-gray-50 rounded border border-dashed border-gray-300">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">FAQ Block — edit questions below</p>
      {items.map((item, i) => (
        <div key={i} className="bg-white rounded border border-gray-200 p-3 space-y-2">
          <div className="flex items-start gap-2">
            <span className="text-[10px] text-gray-400 font-semibold pt-2 w-4 shrink-0">Q:</span>
            <Input
              value={item.q}
              onChange={(e) => updateItem(i, 'q', e.target.value)}
              className="text-sm font-semibold flex-1 h-7 border-gray-200"
              placeholder="Enter question..."
            />
            <button
              type="button"
              onClick={() => removeItem(i)}
              className="text-gray-400 hover:text-red-500 transition-colors shrink-0 pt-1"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-[10px] text-gray-400 font-semibold pt-2 w-4 shrink-0">A:</span>
            <textarea
              value={item.a}
              onChange={(e) => updateItem(i, 'a', e.target.value)}
              className="text-sm text-gray-600 flex-1 border border-gray-200 rounded px-2 py-1 min-h-[60px] outline-none focus:ring-1 focus:ring-[#e31c58]/50 resize-y"
              placeholder="Enter answer..."
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="flex items-center gap-1 text-[10px] text-[#e31c58] hover:text-[#e31c58]/80 mt-1"
      >
        <Plus className="h-3 w-3" /> Add Question
      </button>
    </div>
  );
}
