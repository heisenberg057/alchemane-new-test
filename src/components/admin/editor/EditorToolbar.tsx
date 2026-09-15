"use client";

import React from 'react';
import { 
  Undo2, 
  Redo2, 
  Monitor, 
  Smartphone, 
  Tablet, 
  Eye, 
  Download, 
  Save,
  Menu,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useEditorStore } from '@/lib/store/useEditorStore';

export function EditorToolbar({ onClose }: { onClose?: () => void }) {
  const { undo, redo, historyIndex, history, device, setDevice, isPreviewMode, togglePreviewMode } = useEditorStore();

  return (
    <div className="h-12 bg-[#26292c] border-b border-[#131415] flex items-center px-3 justify-between shrink-0 text-[#e0e1e2]">
      <div className="flex items-center gap-1">
        <div className="bg-[#131415] p-1.5 rounded mr-2 cursor-pointer hover:bg-[#1d1f21] transition-colors">
          <Menu className="h-4 w-4 text-white" />
        </div>
        
        <div className="flex bg-[#131415] rounded-sm p-0.5">
          <Button 
            variant="ghost" 
            size="icon" 
            className={`h-7 w-7 transition-colors ${device === 'mobile' ? 'bg-[#e31c58] text-white' : 'text-muted-foreground hover:bg-[#1d1f21]'}`}
            onClick={() => setDevice('mobile')}
          >
            <Smartphone className="h-3.5 w-3.5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`h-7 w-7 transition-colors ${device === 'tablet' ? 'bg-[#e31c58] text-white' : 'text-muted-foreground hover:bg-[#1d1f21]'}`}
            onClick={() => setDevice('tablet')}
          >
            <Tablet className="h-3.5 w-3.5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`h-7 w-7 transition-colors ${device === 'desktop' ? 'bg-[#e31c58] text-white' : 'text-muted-foreground hover:bg-[#1d1f21]'}`}
            onClick={() => setDevice('desktop')}
          >
            <Monitor className="h-3.5 w-3.5" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-4 mx-3 bg-[#131415]" />

        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-muted-foreground hover:bg-[#131415] hover:text-white disabled:opacity-30" 
          onClick={undo} 
          disabled={historyIndex === 0}
        >
          <Undo2 className="h-3.5 w-3.5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-muted-foreground hover:bg-[#131415] hover:text-white disabled:opacity-30" 
          onClick={redo} 
          disabled={historyIndex >= history.length - 1}
        >
          <Redo2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          className={`h-8 text-xs font-bold transition-colors ${isPreviewMode ? 'bg-[#e31c58] text-white hover:bg-[#e31c58]/90' : 'text-muted-foreground hover:text-white hover:bg-[#131415]'}`}
          onClick={togglePreviewMode}
        >
          <Eye className="h-3.5 w-3.5 mr-2" /> {isPreviewMode ? 'Exit Preview' : 'Preview'}
        </Button>
        
        <div className="flex items-center">
          <Button 
            type="button"
            onClick={onClose}
            className="h-8 bg-[#e31c58] hover:bg-[#e31c58]/90 text-white rounded px-4 text-[10px] font-bold uppercase tracking-wider">
            Save & Exit Builder
          </Button>
        </div>
      </div>
    </div>
  );
}
