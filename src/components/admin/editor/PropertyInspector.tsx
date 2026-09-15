"use client";

import React, { useRef, useState } from 'react';
import { useEditorStore } from '@/lib/store/useEditorStore';
import { normalizeTableProps, addTableColumn, addTableRow, duplicateTableColumn, duplicateTableRow, moveTableColumn, moveTableRow, removeTableColumn, removeTableRow, toLegacyTableProps } from '@/lib/editor/tableUtils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Settings, Trash2, ChevronRight, Sliders, Palette, Zap, Upload, Plus, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mediaService } from '@/lib/api/media.service';
import { MediaPickerDialog } from './MediaPickerDialog';
import type { Media } from '@/lib/hooks/useMedia';

const BRAND_COLORS = ['#e31c58', '#002f5b', '#ffffff', '#000000', '#f8f9fa', '#374151'];

export function PropertyInspector() {
  const { blocks, selectedId, updateBlockProps, removeBlock } = useEditorStore();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);

  const findBlock = (blocks: any[]): any => {
    for (const block of blocks) {
      if (block.id === selectedId) return block;
      if (block.children) {
        const found = findBlock(block.children);
        if (found) return found;
      }
    }
    return null;
  };

  const selectedBlock = findBlock(blocks);

  if (!selectedBlock) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-[#26292c] text-muted-foreground opacity-50">
        <Settings className="h-10 w-10 mb-4" />
        <p className="text-xs uppercase tracking-widest font-bold">No Widget Selected</p>
        <p className="text-[10px] mt-2">Select a widget on the canvas to edit its properties</p>
      </div>
    );
  }

  const handlePropChange = (key: string, value: any) => {
    updateBlockProps(selectedBlock.id, { [key]: value });
  };

  const handlePropsChange = (patch: Record<string, any>) => {
    updateBlockProps(selectedBlock.id, patch);
  };

  const ControlGroup = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div className="space-y-2 pb-4 border-b border-[#131415] last:border-b-0">
      <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{label}</Label>
      {children}
    </div>
  );

  const ColorControl = ({ propKey, label, defaultVal = '#000000' }: { propKey: string; label?: string; defaultVal?: string }) => (
    <ControlGroup label={label || 'Color'}>
      <div className="flex gap-1 flex-wrap mb-1">
        {BRAND_COLORS.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => handlePropChange(propKey, c)}
            className="w-5 h-5 rounded border border-white/10 shrink-0"
            style={{ backgroundColor: c }}
            title={c}
          />
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          type="color"
          value={selectedBlock.props[propKey] || defaultVal}
          onChange={(e) => handlePropChange(propKey, e.target.value)}
          className="w-10 h-8 p-0 bg-transparent border-none cursor-pointer"
        />
        <Input
          value={selectedBlock.props[propKey] || ''}
          onChange={(e) => handlePropChange(propKey, e.target.value)}
          className="flex-1 bg-[#131415] border-none text-xs h-8"
          placeholder={defaultVal}
        />
      </div>
    </ControlGroup>
  );

  return (
    <div className="flex flex-col h-full bg-[#26292c] text-[#e0e1e2]">
      <div className="sticky top-0 z-20 px-3 py-4 border-b border-[#131415] flex items-center justify-between bg-[#1d1f21]">
        <div className="flex items-center gap-2">
          <Zap className="h-3.5 w-3.5 text-[#e31c58]" />
          <h2 className="text-xs font-bold uppercase tracking-wider">Edit {selectedBlock.type}</h2>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground h-6 w-6 hover:text-destructive transition-colors"
          onClick={() => removeBlock(selectedBlock.id)}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      <Tabs defaultValue="content" className="flex-1 flex flex-col">
        <TabsList className="sticky top-[57px] z-10 w-full bg-[#131415] rounded-none h-10 border-b border-[#131415]">
          <TabsTrigger value="content" className="flex-1 text-[10px] uppercase font-bold data-[state=active]:bg-[#26292c] data-[state=active]:text-[#e31c58] rounded-none">
            <Sliders className="h-3 w-3 mr-1.5" /> Content
          </TabsTrigger>
          <TabsTrigger value="style" className="flex-1 text-[10px] uppercase font-bold data-[state=active]:bg-[#26292c] data-[state=active]:text-[#e31c58] rounded-none">
            <Palette className="h-3 w-3 mr-1.5" /> Style
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex-1 text-[10px] uppercase font-bold data-[state=active]:bg-[#26292c] data-[state=active]:text-[#e31c58] rounded-none">
            <Settings className="h-3 w-3 mr-1.5" /> Advanced
          </TabsTrigger>
        </TabsList>

        {/* ─── CONTENT TAB ────────────────────────────────────────────── */}
        <TabsContent value="content" className="flex-1 overflow-y-auto p-4 space-y-4 m-0 no-scrollbar">
          {/* HEADING */}
          {selectedBlock.type === 'heading' && (
            <>
              <ControlGroup label="Text Content">
                <Input
                  value={selectedBlock.props.text || ''}
                  onChange={(e) => handlePropChange('text', e.target.value)}
                  className="bg-[#131415] border-none text-xs focus-visible:ring-1 focus-visible:ring-[#e31c58]"
                />
              </ControlGroup>
              <ControlGroup label="HTML Tag">
                <Select
                  value={selectedBlock.props.level?.toString() || '2'}
                  onValueChange={(v) => handlePropChange('level', parseInt(v))}
                >
                  <SelectTrigger className="bg-[#131415] border-none text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#26292c] border-[#131415] text-white">
                    {[1, 2, 3, 4, 5, 6].map(l => (
                      <SelectItem key={l} value={l.toString()} className="text-xs hover:bg-[#1d1f21]">H{l}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </ControlGroup>
              <ControlGroup label="Anchor ID">
                <Input
                  value={selectedBlock.props.anchorId || ''}
                  onChange={(e) => handlePropChange('anchorId', e.target.value)}
                  placeholder="auto-generated from text"
                  className="bg-[#131415] border-none text-xs"
                />
              </ControlGroup>
              <ControlGroup label="Table of Contents">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedBlock.props.includeInToc !== false}
                    onChange={(e) => handlePropChange('includeInToc', e.target.checked)}
                    className="cursor-pointer"
                  />
                  <span className="text-[10px] text-muted-foreground">Include this heading in generated TOC</span>
                </label>
              </ControlGroup>
              <ControlGroup label="Font Weight">
                <div className="flex bg-[#131415] rounded overflow-hidden">
                  {['normal', 'semibold', 'bold', 'extrabold'].map((fw) => (
                    <button
                      key={fw}
                      type="button"
                      onClick={() => handlePropChange('fontWeight', fw)}
                      className={`flex-1 py-1.5 text-[9px] capitalize transition-colors ${selectedBlock.props.fontWeight === fw ? 'bg-[#e31c58] text-white' : 'hover:bg-[#1d1f21] text-muted-foreground'}`}
                    >
                      {fw}
                    </button>
                  ))}
                </div>
              </ControlGroup>
            </>
          )}

          {/* TEXT */}
          {selectedBlock.type === 'text' && (
            <ControlGroup label="Editor Content">
              <p className="text-[10px] text-muted-foreground">Edit text directly on the canvas. Use the floating toolbar to format selected text.</p>
            </ControlGroup>
          )}

          {/* IMAGE */}
          {selectedBlock.type === 'image' && (
            <>
              <ControlGroup label="Asset">
                {selectedBlock.props.url ? (
                  <div className="mb-3 overflow-hidden rounded-2xl border border-[#1d1f21] bg-[#131415]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={String(selectedBlock.props.url)}
                      alt={String(selectedBlock.props.alt || 'Selected image')}
                      className="h-36 w-full object-cover"
                    />
                    <div className="border-t border-[#1d1f21] px-3 py-2 text-[10px] text-muted-foreground">
                      {String(selectedBlock.props.url)}
                    </div>
                  </div>
                ) : (
                  <div className="mb-3 flex h-28 items-center justify-center rounded-2xl border border-dashed border-[#1d1f21] bg-[#131415] text-[10px] text-muted-foreground">
                    No image selected
                  </div>
                )}
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setIsUploading(true);
                    try {
                      const res = await mediaService.uploadFile(file);
                      if (res.success && res.data?.media?.[0]?.url) {
                        handlePropsChange({
                          url: res.data.media[0].url,
                          alt: res.data.media[0].altText || selectedBlock.props.alt || '',
                          caption: res.data.media[0].caption || selectedBlock.props.caption || '',
                        });
                      }
                    } finally {
                      setIsUploading(false);
                    }
                  }}
                />
                <div className="grid gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="w-full bg-[#131415] border-[#1d1f21] text-xs hover:bg-[#1d1f21] text-white"
                    disabled={isUploading}
                    onClick={() => imageInputRef.current?.click()}
                  >
                    {isUploading ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" /> : <Upload className="h-3.5 w-3.5 mr-1" />}
                    {isUploading ? 'Uploading...' : selectedBlock.props.url ? 'Replace from disk' : 'Upload from disk'}
                  </Button>
                  <MediaPickerDialog
                    open={isMediaPickerOpen}
                    onOpenChange={setIsMediaPickerOpen}
                    onSelect={(media: Media) => {
                      handlePropsChange({
                        url: media.url,
                        alt: media.altText || selectedBlock.props.alt || '',
                        caption: media.caption || selectedBlock.props.caption || '',
                      });
                    }}
                    triggerLabel={selectedBlock.props.url ? 'Replace from Media Library' : 'Choose from Media Library'}
                  />
                  {selectedBlock.props.url && (
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      className="w-full border-[#4b111d] bg-[#2a1118] text-xs text-[#fecdd3] hover:bg-[#37131d]"
                      onClick={() => handlePropsChange({ url: '', caption: '', alt: '' })}
                    >
                      Remove image
                    </Button>
                  )}
                </div>
              </ControlGroup>
              <ControlGroup label="Or paste URL">
                <Input
                  value={selectedBlock.props.url || ''}
                  onChange={(e) => handlePropChange('url', e.target.value)}
                  placeholder="https://..."
                  className="bg-[#131415] border-none text-xs"
                />
              </ControlGroup>
              <ControlGroup label="Alt Text">
                <Input
                  value={selectedBlock.props.alt || ''}
                  onChange={(e) => handlePropChange('alt', e.target.value)}
                  className="bg-[#131415] border-none text-xs"
                />
              </ControlGroup>
              <ControlGroup label="Caption">
                <Input
                  value={selectedBlock.props.caption || ''}
                  onChange={(e) => handlePropChange('caption', e.target.value)}
                  placeholder="Optional caption..."
                  className="bg-[#131415] border-none text-xs"
                />
              </ControlGroup>
              <ControlGroup label="Link URL">
                <Input
                  value={selectedBlock.props.linkUrl || ''}
                  onChange={(e) => handlePropChange('linkUrl', e.target.value)}
                  placeholder="https://..."
                  className="bg-[#131415] border-none text-xs"
                />
              </ControlGroup>
              <ControlGroup label="Link Target">
                <div className="flex bg-[#131415] rounded overflow-hidden">
                  {[{ label: 'Same Tab', val: '_self' }, { label: 'New Tab', val: '_blank' }].map(({ label, val }) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handlePropChange('linkTarget', val)}
                      className={`flex-1 py-1.5 text-[10px] transition-colors ${(selectedBlock.props.linkTarget || '_self') === val ? 'bg-[#e31c58] text-white' : 'hover:bg-[#1d1f21] text-muted-foreground'}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </ControlGroup>
              <ControlGroup label="Image Options">
                <div className="space-y-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={selectedBlock.props.lazyLoad !== false} onChange={(e) => handlePropChange('lazyLoad', e.target.checked)} className="cursor-pointer" />
                    <span className="text-[10px] text-muted-foreground">Lazy load image</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={Boolean(selectedBlock.props.hoverZoom)} onChange={(e) => handlePropChange('hoverZoom', e.target.checked)} className="cursor-pointer" />
                    <span className="text-[10px] text-muted-foreground">Hover zoom</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={Boolean(selectedBlock.props.openInLightbox)} onChange={(e) => handlePropChange('openInLightbox', e.target.checked)} className="cursor-pointer" />
                    <span className="text-[10px] text-muted-foreground">Open in lightbox</span>
                  </label>
                </div>
              </ControlGroup>
            </>
          )}

          {/* LIST */}
          {selectedBlock.type === 'list' && (
            <>
              <ControlGroup label="List Type">
                <div className="flex bg-[#131415] rounded overflow-hidden">
                  {[{ label: 'Bullet', val: false }, { label: 'Numbered', val: true }].map(({ label, val }) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => handlePropChange('ordered', val)}
                      className={`flex-1 py-1.5 text-[10px] capitalize transition-colors ${selectedBlock.props.ordered === val ? 'bg-[#e31c58] text-white' : 'hover:bg-[#1d1f21] text-muted-foreground'}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </ControlGroup>
              <ControlGroup label="Items">
                <div className="space-y-1">
                  {(selectedBlock.props.items as string[] || []).map((item: string, idx: number) => (
                    <div key={idx} className="flex gap-1 items-center">
                      <Input
                        value={item}
                        onChange={(e) => {
                          const newItems = [...(selectedBlock.props.items as string[])];
                          newItems[idx] = e.target.value;
                          handlePropChange('items', newItems);
                        }}
                        className="bg-[#131415] border-none text-xs h-7"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newItems = (selectedBlock.props.items as string[]).filter((_: string, i: number) => i !== idx);
                          handlePropChange('items', newItems);
                        }}
                        className="text-muted-foreground hover:text-destructive shrink-0"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => handlePropChange('items', [...(selectedBlock.props.items as string[] || []), 'New item'])}
                    className="flex items-center gap-1 text-[10px] text-[#e31c58] hover:text-[#e31c58]/80 mt-1"
                  >
                    <Plus className="h-3 w-3" /> Add item
                  </button>
                </div>
              </ControlGroup>
            </>
          )}

          {/* QUOTE */}
          {selectedBlock.type === 'quote' && (
            <>
              <ControlGroup label="Quote Text">
                <textarea
                  value={selectedBlock.props.text || ''}
                  onChange={(e) => handlePropChange('text', e.target.value)}
                  className="w-full bg-[#131415] border-none text-xs p-2 min-h-[100px] focus:ring-1 focus:ring-[#e31c58] outline-none rounded"
                  placeholder="Enter the quote..."
                />
              </ControlGroup>
              <ControlGroup label="Attribution (optional)">
                <Input
                  value={selectedBlock.props.attribution || ''}
                  onChange={(e) => handlePropChange('attribution', e.target.value)}
                  placeholder="— Author name"
                  className="bg-[#131415] border-none text-xs"
                />
              </ControlGroup>
            </>
          )}

          {/* CALLOUT */}
          {selectedBlock.type === 'callout' && (
            <>
              <ControlGroup label="Type">
                <Select
                  value={selectedBlock.props.type || 'info'}
                  onValueChange={(v) => handlePropChange('type', v)}
                >
                  <SelectTrigger className="bg-[#131415] border-none text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#26292c] border-[#131415] text-white">
                    <SelectItem value="info" className="text-xs hover:bg-[#1d1f21]">ℹ️ Info</SelectItem>
                    <SelectItem value="tip" className="text-xs hover:bg-[#1d1f21]">💡 Tip</SelectItem>
                    <SelectItem value="warning" className="text-xs hover:bg-[#1d1f21]">⚠️ Warning</SelectItem>
                    <SelectItem value="note" className="text-xs hover:bg-[#1d1f21]">📝 Note</SelectItem>
                    <SelectItem value="success" className="text-xs hover:bg-[#1d1f21]">✅ Success</SelectItem>
                  </SelectContent>
                </Select>
              </ControlGroup>
              <ControlGroup label="Title (optional)">
                <Input
                  value={selectedBlock.props.title || ''}
                  onChange={(e) => handlePropChange('title', e.target.value)}
                  placeholder="Callout title"
                  className="bg-[#131415] border-none text-xs"
                />
              </ControlGroup>
              <ControlGroup label="Message">
                <textarea
                  value={selectedBlock.props.text || ''}
                  onChange={(e) => handlePropChange('text', e.target.value)}
                  className="w-full bg-[#131415] border-none text-xs p-2 min-h-[80px] focus:ring-1 focus:ring-[#e31c58] outline-none rounded"
                  placeholder="Enter callout message..."
                />
              </ControlGroup>
            </>
          )}

          {/* YOUTUBE */}
          {(selectedBlock.type === 'youtube' || selectedBlock.type === 'video') && (
            <>
              <ControlGroup label={selectedBlock.type === 'youtube' ? 'YouTube Link' : 'Video URL'}>
                <Input
                  value={selectedBlock.props.url || ''}
                  onChange={(e) => handlePropChange('url', e.target.value)}
                  className="bg-[#131415] border-none text-xs"
                  placeholder={selectedBlock.type === 'youtube' ? 'https://youtube.com/...' : 'https://...'}
                />
              </ControlGroup>
              {selectedBlock.type === 'youtube' && (
                <>
                  <ControlGroup label="Caption">
                    <Input
                      value={selectedBlock.props.caption || ''}
                      onChange={(e) => handlePropChange('caption', e.target.value)}
                      className="bg-[#131415] border-none text-xs"
                      placeholder="Optional caption..."
                    />
                  </ControlGroup>
                  <ControlGroup label="Start / End Time (seconds)">
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        value={selectedBlock.props.startTime || 0}
                        onChange={(e) => handlePropChange('startTime', parseInt(e.target.value) || 0)}
                        className="bg-[#131415] border-none text-xs h-7"
                        placeholder="Start"
                      />
                      <Input
                        type="number"
                        value={selectedBlock.props.endTime || 0}
                        onChange={(e) => handlePropChange('endTime', parseInt(e.target.value) || 0)}
                        className="bg-[#131415] border-none text-xs h-7"
                        placeholder="End"
                      />
                    </div>
                  </ControlGroup>
                  <ControlGroup label="Options">
                    <div className="space-y-1">
                      {[
                        { key: 'autoplay', label: 'Autoplay' },
                        { key: 'mute', label: 'Muted' },
                        { key: 'controls', label: 'Show Controls', inverted: false },
                      ].map(({ key, label }) => (
                        <label key={key} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={Boolean(selectedBlock.props[key])}
                            onChange={(e) => handlePropChange(key, e.target.checked)}
                            className="cursor-pointer"
                          />
                          <span className="text-[10px] text-muted-foreground">{label}</span>
                        </label>
                      ))}
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedBlock.props.lazyLoad !== false}
                          onChange={(e) => handlePropChange('lazyLoad', e.target.checked)}
                          className="cursor-pointer"
                        />
                        <span className="text-[10px] text-muted-foreground">Lazy load thumbnail first</span>
                      </label>
                    </div>
                  </ControlGroup>
                </>
              )}
            </>
          )}

          {/* BUTTON */}
          {selectedBlock.type === 'button' && (
            <>
              <ControlGroup label="Button Text">
                <Input
                  value={selectedBlock.props.text || ''}
                  onChange={(e) => handlePropChange('text', e.target.value)}
                  className="bg-[#131415] border-none text-xs"
                />
              </ControlGroup>
              <ControlGroup label="Destination Link">
                <Input
                  value={selectedBlock.props.link || ''}
                  onChange={(e) => handlePropChange('link', e.target.value)}
                  className="bg-[#131415] border-none text-xs"
                />
              </ControlGroup>
              <ControlGroup label="Variant">
                <div className="grid grid-cols-5 gap-1">
                  {[
                    { val: 'primary', bg: '#e31c58', label: 'P' },
                    { val: 'secondary', bg: '#002f5b', label: 'S' },
                    { val: 'outline', bg: 'transparent', label: 'O', border: '#e31c58' },
                    { val: 'ghost', bg: 'transparent', label: 'G', border: '#e5e7eb' },
                    { val: 'dark', bg: '#111827', label: 'D' },
                  ].map(({ val, bg, label, border }) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handlePropChange('variant', val)}
                      className={`h-7 rounded text-[9px] font-bold transition-all ${(selectedBlock.props.variant || 'primary') === val ? 'ring-2 ring-white/60 scale-105' : 'opacity-70 hover:opacity-100'}`}
                      style={{ backgroundColor: bg, color: val === 'outline' || val === 'ghost' ? '#374151' : '#fff', border: border ? `2px solid ${border}` : 'none' }}
                      title={val}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </ControlGroup>
              <ControlGroup label="Size">
                <div className="flex bg-[#131415] rounded overflow-hidden">
                  {['sm', 'md', 'lg', 'xl'].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handlePropChange('size', s)}
                      className={`flex-1 py-1.5 text-[10px] uppercase transition-colors ${(selectedBlock.props.size || 'md') === s ? 'bg-[#e31c58] text-white' : 'hover:bg-[#1d1f21] text-muted-foreground'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </ControlGroup>
              <ControlGroup label="Options">
                <div className="space-y-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(selectedBlock.props.fullWidth)}
                      onChange={(e) => handlePropChange('fullWidth', e.target.checked)}
                      className="cursor-pointer"
                    />
                    <span className="text-[10px] text-muted-foreground">Full width</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={(selectedBlock.props.target || '_self') === '_blank'}
                      onChange={(e) => handlePropChange('target', e.target.checked ? '_blank' : '_self')}
                      className="cursor-pointer"
                    />
                    <span className="text-[10px] text-muted-foreground">Open in new tab</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(selectedBlock.props.nofollow)}
                      onChange={(e) => handlePropChange('nofollow', e.target.checked)}
                      className="cursor-pointer"
                    />
                    <span className="text-[10px] text-muted-foreground">Nofollow</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(selectedBlock.props.sponsored)}
                      onChange={(e) => handlePropChange('sponsored', e.target.checked)}
                      className="cursor-pointer"
                    />
                    <span className="text-[10px] text-muted-foreground">Sponsored</span>
                  </label>
                </div>
              </ControlGroup>
              <ControlGroup label="Icon">
                <div className="grid grid-cols-[1fr_auto] gap-2">
                  <Input
                    value={selectedBlock.props.icon || ''}
                    onChange={(e) => handlePropChange('icon', e.target.value)}
                    className="bg-[#131415] border-none text-xs"
                    placeholder="Optional icon"
                  />
                  <Select value={selectedBlock.props.iconPosition || 'left'} onValueChange={(v) => handlePropChange('iconPosition', v)}>
                    <SelectTrigger className="w-[92px] bg-[#131415] border-none text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#26292c] border-[#131415] text-white">
                      <SelectItem value="left" className="text-xs">Left</SelectItem>
                      <SelectItem value="right" className="text-xs">Right</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </ControlGroup>
            </>
          )}

          {/* SPACER */}
          {selectedBlock.type === 'spacer' && (
            <ControlGroup label="Height (px, rem, vh)">
              <Input
                value={selectedBlock.props.height || '50px'}
                onChange={(e) => handlePropChange('height', e.target.value)}
                className="bg-[#131415] border-none text-xs"
              />
            </ControlGroup>
          )}

          {/* TABLE */}
          {selectedBlock.type === 'table' && (() => {
            const normalized = normalizeTableProps(selectedBlock.props);
            const table = normalized.tableData;
            const saveTable = (nextTable: typeof table) => {
              const legacy = toLegacyTableProps(nextTable);
              handlePropsChange({
                tableData: nextTable,
                headers: legacy.headers,
                rows: legacy.rows,
              });
            };

            return (
              <>
                <ControlGroup label="Structure">
                  <div className="grid grid-cols-2 gap-2">
                    <Button type="button" size="sm" variant="outline" className="bg-[#131415] border-[#1d1f21] text-xs text-white hover:bg-[#1d1f21]" onClick={() => saveTable(addTableRow(table))}>
                      <Plus className="mr-1 h-3 w-3" /> Add Row
                    </Button>
                    <Button type="button" size="sm" variant="outline" className="bg-[#131415] border-[#1d1f21] text-xs text-white hover:bg-[#1d1f21]" onClick={() => saveTable(addTableColumn(table))}>
                      <Plus className="mr-1 h-3 w-3" /> Add Column
                    </Button>
                  </div>
                  <div className="mt-2 rounded-xl border border-[#131415] bg-[#131415] p-2 text-[10px] text-muted-foreground">
                    Rows: {table.rows.length} · Columns: {table.columns.length}
                  </div>
                </ControlGroup>
                <ControlGroup label="Options">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={selectedBlock.props.headerRow !== false} onChange={(e) => handlePropChange('headerRow', e.target.checked)} className="cursor-pointer" />
                    <span className="text-[10px] text-muted-foreground">Header row</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={selectedBlock.props.striped !== false} onChange={(e) => handlePropChange('striped', e.target.checked)} className="cursor-pointer" />
                    <span className="text-[10px] text-muted-foreground">Striped rows</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={Boolean(selectedBlock.props.headerColumn)} onChange={(e) => handlePropChange('headerColumn', e.target.checked)} className="cursor-pointer" />
                    <span className="text-[10px] text-muted-foreground">Header column</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={Boolean(selectedBlock.props.stickyHeader)} onChange={(e) => handlePropChange('stickyHeader', e.target.checked)} className="cursor-pointer" />
                    <span className="text-[10px] text-muted-foreground">Sticky header row</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={Boolean(selectedBlock.props.stickyFirstColumn)} onChange={(e) => handlePropChange('stickyFirstColumn', e.target.checked)} className="cursor-pointer" />
                    <span className="text-[10px] text-muted-foreground">Sticky first column</span>
                  </label>
                </ControlGroup>
                <ControlGroup label="Cell Padding">
                  <div className="flex bg-[#131415] rounded overflow-hidden">
                    {['compact', 'normal', 'spacious'].map((p) => (
                      <button key={p} type="button" onClick={() => handlePropChange('cellPadding', p)} className={`flex-1 py-1.5 text-[10px] capitalize transition-colors ${(selectedBlock.props.cellPadding || 'normal') === p ? 'bg-[#e31c58] text-white' : 'hover:bg-[#1d1f21] text-muted-foreground'}`}>{p}</button>
                    ))}
                  </div>
                </ControlGroup>
                <ControlGroup label="Columns">
                  <div className="space-y-1">
                    {table.columns.map((column, i) => (
                      <div key={i} className="flex gap-1 items-center">
                        <Input
                          value={column.width || ''}
                          onChange={(e) => {
                            const nextColumns = table.columns.map((item, index) => index === i ? { ...item, width: e.target.value } : item);
                            saveTable({ ...table, columns: nextColumns });
                          }}
                          placeholder="220px"
                          className="bg-[#131415] border-none text-xs h-7"
                        />
                        <button type="button" onClick={() => saveTable(moveTableColumn(table, i, 'left'))} className="text-[10px] text-muted-foreground hover:text-white shrink-0">Left</button>
                        <button type="button" onClick={() => saveTable(moveTableColumn(table, i, 'right'))} className="text-[10px] text-muted-foreground hover:text-white shrink-0">Right</button>
                        <button type="button" onClick={() => saveTable(duplicateTableColumn(table, i))} className="text-[10px] text-muted-foreground hover:text-white shrink-0">Dup</button>
                        {table.columns.length > 1 && <button type="button" onClick={() => saveTable(removeTableColumn(table, i))} className="text-muted-foreground hover:text-destructive shrink-0"><X className="h-3 w-3" /></button>}
                      </div>
                    ))}
                    <button type="button" onClick={() => saveTable(addTableColumn(table))} className="flex items-center gap-1 text-[10px] text-[#e31c58] hover:text-[#e31c58]/80 mt-1"><Plus className="h-3 w-3" /> Add Column</button>
                  </div>
                </ControlGroup>
                <ControlGroup label={`Rows (${table.rows.length})`}>
                  <div className="space-y-2">
                    {table.rows.map((row, ri) => (
                      <div key={row.id} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] text-muted-foreground uppercase">Row {ri + 1}</span>
                          <div className="flex items-center gap-1">
                            <button type="button" onClick={() => saveTable(moveTableRow(table, ri, 'up'))} className="text-[10px] text-muted-foreground hover:text-white">Up</button>
                            <button type="button" onClick={() => saveTable(moveTableRow(table, ri, 'down'))} className="text-[10px] text-muted-foreground hover:text-white">Down</button>
                            <button type="button" onClick={() => saveTable(duplicateTableRow(table, ri))} className="text-[10px] text-muted-foreground hover:text-white">Dup</button>
                            <button type="button" onClick={() => saveTable(removeTableRow(table, ri))} className="text-muted-foreground hover:text-destructive"><X className="h-3 w-3" /></button>
                          </div>
                        </div>
                        {row.cells.map((cell, ci) => (
                          <Input
                            key={cell.id}
                            value={cell.content || ''}
                            placeholder={`Cell ${ci + 1}`}
                            onChange={(e) => {
                              const nextRows = table.rows.map((currentRow, rowIndex) => rowIndex === ri ? {
                                ...currentRow,
                                cells: currentRow.cells.map((currentCell, cellIndex) => cellIndex === ci ? { ...currentCell, content: e.target.value } : currentCell),
                              } : currentRow);
                              saveTable({ ...table, rows: nextRows });
                            }}
                            className="bg-[#131415] border-none text-xs h-7"
                          />
                        ))}
                      </div>
                    ))}
                    <button type="button" onClick={() => saveTable(addTableRow(table))} className="flex items-center gap-1 text-[10px] text-[#e31c58] hover:text-[#e31c58]/80 mt-1"><Plus className="h-3 w-3" /> Add Row</button>
                  </div>
                </ControlGroup>
              </>
            );
          })()}

          {/* TOC */}
          {selectedBlock.type === 'toc' && (
            <>
              <ControlGroup label="Title">
                <Input value={selectedBlock.props.title || 'Table of Contents'} onChange={(e) => handlePropChange('title', e.target.value)} className="bg-[#131415] border-none text-xs" />
              </ControlGroup>
              <ControlGroup label="Include Headings">
                {[{ key: 'showH1', label: 'H1 (title)' }, { key: 'showH2', label: 'H2 (sections)' }, { key: 'showH3', label: 'H3 (subsections)' }, { key: 'showH4', label: 'H4 (minor)' }].map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={selectedBlock.props[key] !== false} onChange={(e) => handlePropChange(key, e.target.checked)} className="cursor-pointer" />
                    <span className="text-[10px] text-muted-foreground">{label}</span>
                  </label>
                ))}
              </ControlGroup>
            </>
          )}

          {/* FAQ */}
          {selectedBlock.type === 'faq' && (() => {
            const items: { q: string; a: string }[] = Array.isArray(selectedBlock.props.items) ? selectedBlock.props.items : [];
            return (
              <ControlGroup label={`FAQ Items (${items.length})`}>
                <div className="space-y-3">
                  {items.map((item, idx) => (
                    <div key={idx} className="bg-[#131415] rounded p-2 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] text-muted-foreground uppercase">Item {idx + 1}</span>
                        <button type="button" onClick={() => handlePropChange('items', items.filter((_, i) => i !== idx))} className="text-muted-foreground hover:text-destructive">
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                      <Input
                        value={item.q}
                        onChange={(e) => { const ni = items.map((it, i) => i === idx ? { ...it, q: e.target.value } : it); handlePropChange('items', ni); }}
                        placeholder="Question..."
                        className="bg-[#26292c] border-none text-xs h-7"
                      />
                      <textarea
                        value={item.a}
                        onChange={(e) => { const ni = items.map((it, i) => i === idx ? { ...it, a: e.target.value } : it); handlePropChange('items', ni); }}
                        placeholder="Answer..."
                        className="w-full bg-[#26292c] text-xs p-1.5 min-h-[60px] outline-none focus:ring-1 focus:ring-[#e31c58]/50 rounded resize-y text-[#e0e1e2]"
                      />
                    </div>
                  ))}
                  <button type="button" onClick={() => handlePropChange('items', [...items, { q: `Question ${items.length + 1}`, a: 'Answer here...' }])} className="flex items-center gap-1 text-[10px] text-[#e31c58] hover:text-[#e31c58]/80">
                    <Plus className="h-3 w-3" /> Add Question
                  </button>
                </div>
              </ControlGroup>
            );
          })()}
        </TabsContent>

        {/* ─── STYLE TAB ──────────────────────────────────────────────── */}
        <TabsContent value="style" className="flex-1 overflow-y-auto p-4 space-y-4 m-0 no-scrollbar">
          <ColorControl propKey="color" label="Typography Color" defaultVal="#333333" />

          {(selectedBlock.type === 'heading' || selectedBlock.type === 'text' || selectedBlock.type === 'button') && (
            <ControlGroup label="Alignment">
              <div className="flex bg-[#131415] rounded overflow-hidden">
                {['left', 'center', 'right', 'justify'].map(align => (
                  <button
                    key={align}
                    onClick={() => handlePropChange(selectedBlock.type === 'button' ? 'align' : 'textAlign', align)}
                    className={`flex-1 py-1.5 text-[10px] capitalize transition-colors ${(selectedBlock.props.textAlign === align || selectedBlock.props.align === align) ? 'bg-[#e31c58] text-white' : 'hover:bg-[#1d1f21]'}`}
                  >
                    {align}
                  </button>
                ))}
              </div>
            </ControlGroup>
          )}

          {selectedBlock.type === 'heading' && (
            <ControlGroup label="Font Size">
              <Input
                value={selectedBlock.props.fontSize || ''}
                onChange={(e) => handlePropChange('fontSize', e.target.value)}
                placeholder="Auto"
                className="bg-[#131415] border-none text-xs"
              />
            </ControlGroup>
          )}

          {(selectedBlock.type === 'button' || selectedBlock.type === 'section') && (
            <ColorControl propKey="backgroundColor" label="Background Color" defaultVal="transparent" />
          )}

          {selectedBlock.type === 'image' && (
            <>
              <ControlGroup label="Alignment">
                <div className="flex bg-[#131415] rounded overflow-hidden">
                  {['left', 'center', 'right'].map(a => (
                    <button key={a} type="button" onClick={() => handlePropChange('alignment', a)} className={`flex-1 py-1.5 text-[10px] capitalize transition-colors ${(selectedBlock.props.alignment || 'center') === a ? 'bg-[#e31c58] text-white' : 'hover:bg-[#1d1f21] text-muted-foreground'}`}>{a}</button>
                  ))}
                </div>
              </ControlGroup>
              <ControlGroup label="Responsive Widths">
                <div className="grid grid-cols-1 gap-2">
                  <div>
                    <Label className="text-[9px] text-muted-foreground uppercase">Desktop</Label>
                    <Input value={selectedBlock.props.maxWidth || ''} onChange={(e) => handlePropChange('maxWidth', e.target.value)} placeholder="e.g. 720px or 80%" className="mt-1 bg-[#131415] border-none text-xs" />
                  </div>
                  <div>
                    <Label className="text-[9px] text-muted-foreground uppercase">Tablet</Label>
                    <Input value={selectedBlock.props.tabletWidth || ''} onChange={(e) => handlePropChange('tabletWidth', e.target.value)} placeholder="e.g. 100% or 540px" className="mt-1 bg-[#131415] border-none text-xs" />
                  </div>
                  <div>
                    <Label className="text-[9px] text-muted-foreground uppercase">Mobile</Label>
                    <Input value={selectedBlock.props.mobileMaxWidth || selectedBlock.props.mobileWidth || ''} onChange={(e) => handlePropsChange({ mobileMaxWidth: e.target.value, mobileWidth: e.target.value })} placeholder="e.g. 100% or 320px" className="mt-1 bg-[#131415] border-none text-xs" />
                  </div>
                </div>
              </ControlGroup>
              <ControlGroup label="Border Radius">
                <Input value={selectedBlock.props.borderRadius || '0px'} onChange={(e) => handlePropChange('borderRadius', e.target.value)} className="bg-[#131415] border-none text-xs" />
              </ControlGroup>
              <ControlGroup label="Aspect Ratio">
                <div className="grid grid-cols-4 gap-1">
                  {['', '16/9', '4/3', '1/1'].map((ratio) => (
                    <button
                      key={ratio || 'auto'}
                      type="button"
                      onClick={() => handlePropChange('aspectRatio', ratio)}
                      className={`rounded px-2 py-1.5 text-[10px] transition-colors ${(selectedBlock.props.aspectRatio || '') === ratio ? 'bg-[#e31c58] text-white' : 'bg-[#131415] text-muted-foreground hover:bg-[#1d1f21]'}`}
                    >
                      {ratio || 'Auto'}
                    </button>
                  ))}
                </div>
              </ControlGroup>
              <ControlGroup label="Object Fit">
                <Select value={selectedBlock.props.objectFit || 'cover'} onValueChange={(v) => handlePropChange('objectFit', v)}>
                  <SelectTrigger className="bg-[#131415] border-none text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#26292c] border-[#131415] text-white">
                    <SelectItem value="cover" className="text-xs">Cover</SelectItem>
                    <SelectItem value="contain" className="text-xs">Contain</SelectItem>
                    <SelectItem value="fill" className="text-xs">Fill</SelectItem>
                    <SelectItem value="scale-down" className="text-xs">Scale down</SelectItem>
                  </SelectContent>
                </Select>
              </ControlGroup>
              <ControlGroup label="Shadow">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={Boolean(selectedBlock.props.shadow)} onChange={(e) => handlePropChange('shadow', e.target.checked)} className="cursor-pointer" />
                  <span className="text-[10px] text-muted-foreground">Drop shadow</span>
                </label>
              </ControlGroup>
            </>
          )}

          {selectedBlock.type === 'youtube' && (
            <ControlGroup label="Aspect Ratio">
              <div className="flex bg-[#131415] rounded overflow-hidden">
                {[{ label: '16:9', val: '16/9' }, { label: '4:3', val: '4/3' }, { label: '1:1', val: '1/1' }].map(({ label, val }) => (
                  <button key={val} type="button" onClick={() => handlePropChange('aspectRatio', val)} className={`flex-1 py-1.5 text-[10px] transition-colors ${(selectedBlock.props.aspectRatio || '16/9') === val ? 'bg-[#e31c58] text-white' : 'hover:bg-[#1d1f21] text-muted-foreground'}`}>{label}</button>
                ))}
              </div>
            </ControlGroup>
          )}

          {selectedBlock.type === 'table' && (
            <>
              <ColorControl propKey="headerBackgroundColor" label="Header Background" defaultVal="#f8fafc" />
              <ColorControl propKey="borderColor" label="Border Color" defaultVal="#dbe3ec" />
              <ColorControl propKey="stripedColor" label="Zebra Row Color" defaultVal="#f8fafc" />
              <ControlGroup label="Cell Alignment">
                <div className="flex bg-[#131415] rounded overflow-hidden">
                  {['left', 'center', 'right'].map((align) => (
                    <button key={align} type="button" onClick={() => handlePropChange('textAlign', align)} className={`flex-1 py-1.5 text-[10px] capitalize transition-colors ${(selectedBlock.props.textAlign || 'left') === align ? 'bg-[#e31c58] text-white' : 'hover:bg-[#1d1f21] text-muted-foreground'}`}>{align}</button>
                  ))}
                </div>
              </ControlGroup>
              <ControlGroup label="Border Style">
                <div className="flex bg-[#131415] rounded overflow-hidden">
                  {['solid', 'dashed', 'none'].map((style) => (
                    <button key={style} type="button" onClick={() => handlePropChange('borderStyle', style)} className={`flex-1 py-1.5 text-[10px] capitalize transition-colors ${(selectedBlock.props.borderStyle || 'solid') === style ? 'bg-[#e31c58] text-white' : 'hover:bg-[#1d1f21] text-muted-foreground'}`}>{style}</button>
                  ))}
                </div>
              </ControlGroup>
              <ControlGroup label="Rounded Corners">
                <Input value={selectedBlock.props.borderRadius || '22px'} onChange={(e) => handlePropChange('borderRadius', e.target.value)} className="bg-[#131415] border-none text-xs" />
              </ControlGroup>
            </>
          )}

          {selectedBlock.type === 'quote' && (
            <ColorControl propKey="borderColor" label="Border Color" defaultVal="#e31c58" />
          )}

          {selectedBlock.type === 'callout' && (
            <>
              <ColorControl propKey="calloutColor" label="Callout Color" defaultVal="#fff7ed" />
              <ColorControl propKey="borderColor" label="Border Color" defaultVal="#fdba74" />
            </>
          )}

          {selectedBlock.type === 'button' && (
            <>
              <ColorControl propKey="backgroundColor" label="Button Color" defaultVal="#e31c58" />
              <ColorControl propKey="hoverColor" label="Hover Color" defaultVal="#be123c" />
              <ColorControl propKey="borderColor" label="Border Color" defaultVal="transparent" />
            </>
          )}

          {selectedBlock.type === 'column' && (
            <ControlGroup label="Column Width (%)">
              <Input value={selectedBlock.props.width || '100%'} onChange={(e) => handlePropChange('width', e.target.value)} className="bg-[#131415] border-none text-xs" />
            </ControlGroup>
          )}

          {(selectedBlock.type === 'section' || selectedBlock.type === 'column') && (
            <>
              <ControlGroup label="Padding">
                <Input value={selectedBlock.props.padding || '16px'} onChange={(e) => handlePropChange('padding', e.target.value)} className="bg-[#131415] border-none text-xs" />
              </ControlGroup>
              <ControlGroup label="Gap">
                <Input value={selectedBlock.props.gap || '16px'} onChange={(e) => handlePropChange('gap', e.target.value)} className="bg-[#131415] border-none text-xs" />
              </ControlGroup>
            </>
          )}

          {/* Spacing for all blocks */}
          {selectedBlock.type === 'heading' && (
            <ControlGroup label="Spacing">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label className="text-[9px] text-muted-foreground uppercase">Margin Top</Label>
                  <Input value={selectedBlock.props.marginTop || ''} onChange={(e) => handlePropChange('marginTop', e.target.value)} placeholder="24px" className="bg-[#131415] border-none text-xs h-7 mt-0.5" />
                </div>
                <div>
                  <Label className="text-[9px] text-muted-foreground uppercase">Margin Bottom</Label>
                  <Input value={selectedBlock.props.marginBottom || ''} onChange={(e) => handlePropChange('marginBottom', e.target.value)} placeholder="8px" className="bg-[#131415] border-none text-xs h-7 mt-0.5" />
                </div>
              </div>
            </ControlGroup>
          )}
        </TabsContent>

        {/* ─── ADVANCED TAB ───────────────────────────────────────────── */}
        <TabsContent value="advanced" className="flex-1 overflow-y-auto p-4 space-y-4 m-0 no-scrollbar">
          <ControlGroup label="Block ID">
            <Input value={selectedBlock.id} readOnly className="bg-[#131415] border-none text-xs font-mono opacity-50" />
          </ControlGroup>
          <ControlGroup label="Block Type">
            <Input value={selectedBlock.type} readOnly className="bg-[#131415] border-none text-xs font-mono opacity-50" />
          </ControlGroup>
          {selectedBlock.type === 'button' && (
            <ControlGroup label="Tracking ID">
              <Input value={selectedBlock.props.trackingId || ''} onChange={(e) => handlePropChange('trackingId', e.target.value)} placeholder="Optional UTM / analytics ID" className="bg-[#131415] border-none text-xs" />
            </ControlGroup>
          )}
          <ControlGroup label="Raw Props (read only)">
            <textarea
              readOnly
              value={JSON.stringify(selectedBlock.props, null, 2)}
              className="w-full bg-[#131415] border-none text-[9px] font-mono p-2 min-h-[150px] outline-none rounded text-muted-foreground"
            />
          </ControlGroup>
        </TabsContent>
      </Tabs>

      <div className="px-3 py-2 border-t border-[#131415] bg-[#1d1f21] flex items-center gap-1 shrink-0 overflow-x-auto no-scrollbar">
        <span className="text-[10px] text-muted-foreground uppercase whitespace-nowrap">Path:</span>
        <span className="text-[9px] bg-[#131415] px-1.5 py-0.5 rounded text-[#e31c58] whitespace-nowrap">Canvas</span>
        <ChevronRight className="h-2 w-2 text-muted-foreground" />
        <span className="text-[9px] bg-[#e31c58] text-white px-1.5 py-0.5 rounded whitespace-nowrap">{selectedBlock.type}</span>
      </div>
    </div>
  );
}
