"use client";

import React, { useCallback, useEffect, useRef } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import { Extension } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { Highlight } from '@tiptap/extension-highlight';
import { TextAlign } from '@tiptap/extension-text-align';
import { Underline } from '@tiptap/extension-underline';
import { RichTextToolbar } from './RichTextToolbar';

const FontSize = Extension.create({
  name: 'fontSize',
  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize || null,
            renderHTML: (attributes) => {
              if (!attributes.fontSize) return {};
              return { style: `font-size: ${attributes.fontSize}` };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize:
        (fontSize: string) =>
        ({ chain }) =>
          chain().setMark('textStyle', { fontSize }).run(),
      unsetFontSize:
        () =>
        ({ chain }) =>
          chain().setMark('textStyle', { fontSize: null }).removeEmptyTextStyle().run(),
    };
  },
});

interface RichTextBlockProps {
  id: string;
  text?: string;
  fontSize?: string;
  color?: string;
  textAlign?: string;
  interactive?: boolean;
  onChange?: (html: string) => void;
  onSelect?: () => void;
}

export function RichTextBlock({
  id,
  text,
  fontSize,
  color,
  textAlign = 'left',
  interactive = true,
  onChange,
  onSelect,
}: RichTextBlockProps) {
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const save = useCallback(
    (html: string) => {
      if (!onChange) return;
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
      saveTimeout.current = setTimeout(() => onChange(html), 250);
    },
    [onChange],
  );

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Link.configure({ openOnClick: false }),
      Color,
      TextStyle,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Underline,
      FontSize,
    ],
    content: text || '',
    editable: interactive,
    onUpdate: ({ editor }) => save(editor.getHTML()),
    onSelectionUpdate: () => onSelect?.(),
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    const next = text || '';
    if (current !== next) {
      editor.commands.setContent(next, { emitUpdate: false });
    }
  }, [editor, text]);

  useEffect(() => {
    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
  }, []);

  if (!editor) return null;

  return (
    <div
      data-block-id={id}
      style={{
        fontSize: fontSize || '16px',
        color: color || '#333333',
        textAlign: textAlign as React.CSSProperties['textAlign'],
      }}
      className="builder-richtext min-h-[1.5em] leading-7"
      onMouseDown={() => onSelect?.()}
    >
      {interactive && <RichTextToolbar editor={editor} />}
      <EditorContent
        editor={editor}
        className={cnEditor(interactive)}
      />
    </div>
  );
}

function cnEditor(interactive: boolean) {
  return [
    'tiptap-editor',
    '[&_.tiptap]:min-h-[1.5em]',
    '[&_.tiptap]:outline-none',
    '[&_.tiptap]:leading-7',
    interactive ? '[&_.tiptap]:cursor-text' : '',
  ].join(' ');
}
