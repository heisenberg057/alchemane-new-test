"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import type { Editor } from '@tiptap/react';
import { useEditorStore } from '@/lib/store/useEditorStore';
import { collectHeadings } from '@/lib/editor/blockUtils';

interface ToolbarProps {
  editor: Editor;
}

const BRAND_COLORS = ['#e31c58', '#002f5b', '#111827', '#374151', '#6b7280', '#ffffff'];
const HIGHLIGHT_COLORS = ['#fef08a', '#bbf7d0', '#bfdbfe', '#fbcfe8', '#fde68a', ''];
const FONT_SIZES = ['14px', '16px', '18px', '20px', '24px', '28px', '32px'];

function ToolbarButton({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void;
  active?: boolean;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(event) => {
        event.preventDefault();
        onClick();
      }}
      className={`flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-xs font-medium transition-colors ${
        active ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
      }`}
    >
      {children}
    </button>
  );
}

export function RichTextToolbar({ editor }: ToolbarProps) {
  const { blocks } = useEditorStore();
  const headings = useMemo(() => collectHeadings(blocks), [blocks]);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [showFontSizes, setShowFontSizes] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [newTab, setNewTab] = useState(false);
  const [nofollow, setNofollow] = useState(false);
  const [sponsored, setSponsored] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateToolbar = () => {
      const { empty } = editor.state.selection;
      if (empty || !editor.isFocused) {
        setPosition(null);
        return;
      }

      try {
        const coords = editor.view.coordsAtPos(editor.state.selection.from);
        setPosition({
          top: coords.top + window.scrollY - 56,
          left: Math.max(16, coords.left + window.scrollX - 40),
        });
      } catch {
        setPosition(null);
      }
    };

    editor.on('selectionUpdate', updateToolbar);
    editor.on('transaction', updateToolbar);
    editor.on('focus', updateToolbar);
    editor.on('blur', () => {
      setTimeout(() => {
        if (!containerRef.current?.matches(':hover')) {
          setPosition(null);
        }
      }, 120);
    });

    return () => {
      editor.off('selectionUpdate', updateToolbar);
      editor.off('transaction', updateToolbar);
      editor.off('focus', updateToolbar);
    };
  }, [editor]);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowLinkForm(false);
        setShowFontSizes(false);
        setShowColorPicker(false);
        setShowHighlightPicker(false);
      }
    };

    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, []);

  if (!position) return null;

  const currentLink = editor.getAttributes('link');
  const toolbar = (
    <div
      ref={containerRef}
      className="fixed z-[9999] max-w-[680px] rounded-2xl border border-[#2a2d30] bg-[#151719] px-2 py-2 text-white shadow-[0_24px_60px_rgba(0,0,0,0.35)]"
      style={{ top: position.top, left: position.left }}
      onMouseDown={(event) => event.preventDefault()}
    >
      <div className="flex flex-wrap items-center gap-1">
        <ToolbarButton title="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton title="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton title="Underline" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <span className="underline">U</span>
        </ToolbarButton>
        <ToolbarButton title="Strikethrough" active={editor.isActive('strike')} onClick={() => editor.chain().focus().toggleStrike().run()}>
          <span className="line-through">S</span>
        </ToolbarButton>
        <ToolbarButton title="Inline code" active={editor.isActive('code')} onClick={() => editor.chain().focus().toggleCode().run()}>
          {'</>'}
        </ToolbarButton>

        <Divider />

        <ToolbarButton title="Bullet list" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          • List
        </ToolbarButton>
        <ToolbarButton title="Ordered list" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          1. List
        </ToolbarButton>
        <ToolbarButton title="Quote" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
          “ ”
        </ToolbarButton>

        <Divider />

        {([2, 3, 4] as const).map((level) => (
          <ToolbarButton
            key={level}
            title={`Heading ${level}`}
            active={editor.isActive('heading', { level })}
            onClick={() => editor.chain().focus().toggleHeading({ level }).run()}
          >
            H{level}
          </ToolbarButton>
        ))}
        <ToolbarButton title="Paragraph" active={editor.isActive('paragraph')} onClick={() => editor.chain().focus().setParagraph().run()}>
          ¶
        </ToolbarButton>

        <Divider />

        {(['left', 'center', 'right', 'justify'] as const).map((align) => (
          <ToolbarButton
            key={align}
            title={`Align ${align}`}
            active={editor.isActive({ textAlign: align })}
            onClick={() => editor.chain().focus().setTextAlign(align).run()}
          >
            {align === 'left' ? '≡' : align === 'center' ? '≣' : align === 'right' ? '☰' : '☷'}
          </ToolbarButton>
        ))}

        <Divider />

        <div className="relative">
          <ToolbarButton
            title="Link"
            active={editor.isActive('link')}
            onClick={() => {
              setShowLinkForm((open) => !open);
              setShowFontSizes(false);
              setShowColorPicker(false);
              setShowHighlightPicker(false);
              setLinkUrl(currentLink.href || '');
              setNewTab(currentLink.target === '_blank');
              const rel = String(currentLink.rel || '');
              setNofollow(rel.includes('nofollow'));
              setSponsored(rel.includes('sponsored'));
            }}
          >
            Link
          </ToolbarButton>
          {showLinkForm && (
            <div className="absolute left-0 top-full mt-2 w-[320px] rounded-xl border border-[#2a2d30] bg-[#111315] p-3 shadow-2xl">
              <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/55">Hyperlink</div>
              <input
                value={linkUrl}
                onChange={(event) => setLinkUrl(event.target.value)}
                placeholder="https:// or #anchor-id"
                className="mb-2 h-9 w-full rounded-lg border border-[#2a2d30] bg-[#1b1f23] px-3 text-xs text-white outline-none focus:border-[#e31c58]"
              />
              {headings.length > 0 && (
                <select
                  className="mb-2 h-9 w-full rounded-lg border border-[#2a2d30] bg-[#1b1f23] px-3 text-xs text-white outline-none"
                  value=""
                  onChange={(event) => {
                    if (event.target.value) setLinkUrl(event.target.value);
                  }}
                >
                  <option value="">Link to section…</option>
                  {headings.map((heading) => (
                    <option key={heading.id} value={`#${heading.anchorId}`}>
                      {heading.text || heading.anchorId}
                    </option>
                  ))}
                </select>
              )}
              <label className="mb-1 flex items-center gap-2 text-xs text-white/70">
                <input type="checkbox" checked={newTab} onChange={(event) => setNewTab(event.target.checked)} />
                Open in new tab
              </label>
              <label className="mb-1 flex items-center gap-2 text-xs text-white/70">
                <input type="checkbox" checked={nofollow} onChange={(event) => setNofollow(event.target.checked)} />
                Nofollow
              </label>
              <label className="mb-3 flex items-center gap-2 text-xs text-white/70">
                <input type="checkbox" checked={sponsored} onChange={(event) => setSponsored(event.target.checked)} />
                Sponsored
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="flex-1 rounded-lg bg-[#e31c58] px-3 py-2 text-xs font-semibold text-white"
                  onMouseDown={(event) => {
                    event.preventDefault();
                    if (!linkUrl.trim()) return;
                    const rel = [nofollow ? 'nofollow' : '', sponsored ? 'sponsored' : ''].filter(Boolean).join(' ') || null;
                    editor.chain().focus().extendMarkRange('link').setLink({
                      href: linkUrl.trim(),
                      target: newTab ? '_blank' : '_self',
                      rel,
                    }).run();
                    setShowLinkForm(false);
                  }}
                >
                  Apply
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-[#2a2d30] px-3 py-2 text-xs font-semibold text-white/75"
                  onMouseDown={(event) => {
                    event.preventDefault();
                    editor.chain().focus().unsetLink().run();
                    setShowLinkForm(false);
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <ToolbarButton
            title="Font size"
            onClick={() => {
              setShowFontSizes((open) => !open);
              setShowLinkForm(false);
              setShowColorPicker(false);
              setShowHighlightPicker(false);
            }}
          >
            Size
          </ToolbarButton>
          {showFontSizes && (
            <div className="absolute left-0 top-full mt-2 flex min-w-[92px] flex-col gap-1 rounded-xl border border-[#2a2d30] bg-[#111315] p-2 shadow-2xl">
              {FONT_SIZES.map((size) => (
                <button
                  key={size}
                  type="button"
                  className="rounded-lg px-2 py-1 text-left text-xs text-white/80 hover:bg-white/10"
                  onMouseDown={(event) => {
                    event.preventDefault();
                    (editor.chain().focus() as any).setFontSize(size).run();
                    setShowFontSizes(false);
                  }}
                >
                  {size}
                </button>
              ))}
              <button
                type="button"
                className="rounded-lg px-2 py-1 text-left text-xs text-white/65 hover:bg-white/10"
                onMouseDown={(event) => {
                  event.preventDefault();
                  (editor.chain().focus() as any).unsetFontSize().run();
                  setShowFontSizes(false);
                }}
              >
                Reset
              </button>
            </div>
          )}
        </div>

        <div className="relative">
          <ToolbarButton
            title="Text color"
            onClick={() => {
              setShowColorPicker((open) => !open);
              setShowLinkForm(false);
              setShowFontSizes(false);
              setShowHighlightPicker(false);
            }}
          >
            Color
          </ToolbarButton>
          {showColorPicker && (
            <div className="absolute left-0 top-full mt-2 rounded-xl border border-[#2a2d30] bg-[#111315] p-2 shadow-2xl">
              <div className="mb-2 flex gap-1">
                {BRAND_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className="h-6 w-6 rounded-full border border-white/10"
                    style={{ backgroundColor: color }}
                    onMouseDown={(event) => {
                      event.preventDefault();
                      editor.chain().focus().setColor(color).run();
                    }}
                  />
                ))}
              </div>
              <input
                type="color"
                className="h-8 w-full cursor-pointer rounded-lg bg-transparent"
                onChange={(event) => editor.chain().focus().setColor(event.target.value).run()}
              />
            </div>
          )}
        </div>

        <div className="relative">
          <ToolbarButton
            title="Highlight"
            active={editor.isActive('highlight')}
            onClick={() => {
              setShowHighlightPicker((open) => !open);
              setShowLinkForm(false);
              setShowFontSizes(false);
              setShowColorPicker(false);
            }}
          >
            Highlight
          </ToolbarButton>
          {showHighlightPicker && (
            <div className="absolute left-0 top-full mt-2 flex gap-1 rounded-xl border border-[#2a2d30] bg-[#111315] p-2 shadow-2xl">
              {HIGHLIGHT_COLORS.map((color) => (
                <button
                  key={color || 'clear'}
                  type="button"
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 text-[10px] text-white/75"
                  style={{ backgroundColor: color || '#1f2429' }}
                  onMouseDown={(event) => {
                    event.preventDefault();
                    if (!color) {
                      editor.chain().focus().unsetHighlight().run();
                    } else {
                      editor.chain().focus().setHighlight({ color }).run();
                    }
                    setShowHighlightPicker(false);
                  }}
                >
                  {!color ? '×' : ''}
                </button>
              ))}
            </div>
          )}
        </div>

        <Divider />

        <ToolbarButton title="Clear formatting" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}>
          Clear
        </ToolbarButton>
      </div>
    </div>
  );

  return ReactDOM.createPortal(toolbar, document.body);
}

function Divider() {
  return <span className="mx-1 h-5 w-px bg-white/12" />;
}
