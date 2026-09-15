"use client";

import React from 'react';
import {
  Heading1,
  Type,
  Image as ImageIcon,
  Youtube,
  Minus,
  Search,
  LayoutGrid,
  Table,
  MousePointer2,
  List,
  Quote,
  AlertCircle,
  Columns2,
  Columns3,
  Columns4,
  HelpCircle,
  ListOrdered,
  BookOpen,
  FileText,
  MousePointer,
  Zap,
} from 'lucide-react';
import { useEditorStore, BlockType } from '@/lib/store/useEditorStore';
import { Input } from '@/components/ui/input';
import { BLOCK_PRESETS } from '@/lib/editor/presets';

const WIDGETS: { type: BlockType; label: string; icon: any; category: string }[] = [
  // Content
  { type: 'heading', label: 'Heading', icon: Heading1, category: 'Content' },
  { type: 'text', label: 'Paragraph', icon: Type, category: 'Content' },
  { type: 'list', label: 'List', icon: List, category: 'Content' },
  { type: 'quote', label: 'Quote', icon: Quote, category: 'Content' },
  { type: 'callout', label: 'Callout', icon: AlertCircle, category: 'Content' },
  { type: 'table', label: 'Table', icon: Table, category: 'Content' },
  { type: 'button', label: 'CTA Button', icon: MousePointer2, category: 'Content' },
  { type: 'toc', label: 'Contents', icon: ListOrdered, category: 'Content' },
  { type: 'faq', label: 'FAQ', icon: HelpCircle, category: 'Content' },
  // Media
  { type: 'image', label: 'Image', icon: ImageIcon, category: 'Media' },
  { type: 'youtube', label: 'YouTube', icon: Youtube, category: 'Media' },
  // Layout
  { type: 'columns-2', label: '2 Columns', icon: Columns2, category: 'Layout' },
  { type: 'columns-3', label: '3 Columns', icon: Columns3, category: 'Layout' },
  { type: 'columns-4', label: '4 Columns', icon: Columns4, category: 'Layout' },
  { type: 'spacer', label: 'Spacer', icon: Minus, category: 'Layout' },
  // Formatting
  { type: 'divider', label: 'Divider', icon: Minus, category: 'Formatting' },
];

const CATEGORIES = ['Content', 'Media', 'Layout', 'Formatting'];

export function WidgetPalette() {
  const { addBlock, blocks } = useEditorStore();
  const [search, setSearch] = React.useState('');
  const [activeTab, setActiveTab] = React.useState<'elements' | 'templates'>('elements');

  const filteredWidgets = WIDGETS.filter(w =>
    w.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-[#26292c] text-[#e0e1e2]">
      <div className="p-3 border-b border-[#131415] space-y-3">
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab('elements')}
            className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded transition-colors ${activeTab === 'elements' ? 'bg-[#e31c58] text-white' : 'text-muted-foreground hover:bg-[#1d1f21]'}`}
          >
            Elements
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`flex-1 py-1.5 text-[10px] font-bold uppercase rounded transition-colors ${activeTab === 'templates' ? 'bg-[#e31c58] text-white' : 'text-muted-foreground hover:bg-[#1d1f21]'}`}
          >
            Templates
          </button>
        </div>
        {activeTab === 'elements' && (
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search Widget..."
              className="pl-8 h-8 bg-[#131415] border-none text-[12px] placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-[#e31c58]"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar">
        {activeTab === 'elements' && (
          <>
            {CATEGORIES.map(category => {
              const widgets = filteredWidgets.filter(w => w.category === category);
              if (widgets.length === 0) return null;
              return (
                <div key={category} className="border-b border-[#131415]">
                  <div className="px-3 py-2 text-[10px] font-bold text-muted-foreground uppercase bg-[#1d1f21]">
                    {category}
                  </div>
                  <div className="grid grid-cols-2 gap-[1px] bg-[#131415]">
                    {widgets.map(widget => (
                      <button
                        key={widget.type}
                        onClick={() => addBlock(widget.type)}
                        className="flex flex-col items-center justify-center py-4 px-2 bg-[#26292c] hover:bg-[#1d1f21] transition-colors group"
                      >
                        <widget.icon className="h-6 w-6 mb-2 text-muted-foreground group-hover:text-[#e31c58] transition-colors" />
                        <span className="text-[10px] text-muted-foreground group-hover:text-white transition-colors">{widget.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </>
        )}

        {activeTab === 'templates' && (
          <div className="p-3 space-y-2">
            <p className="text-[10px] text-muted-foreground mb-3">Click a template to append its blocks to the canvas.</p>
            {BLOCK_PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => {
                  const newBlocks = preset.blocks();
                  useEditorStore.getState().appendBlocks(newBlocks);
                }}
                className="w-full flex items-center gap-3 p-3 bg-[#1d1f21] rounded hover:bg-[#131415] transition-colors text-left"
              >
                <Zap className="h-5 w-5 text-[#e31c58] shrink-0" />
                <div>
                  <p className="text-xs font-medium text-white">{preset.name}</p>
                  <p className="text-[10px] text-muted-foreground">{preset.blocks().length} blocks</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
