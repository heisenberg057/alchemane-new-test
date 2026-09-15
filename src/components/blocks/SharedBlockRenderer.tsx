"use client";

import React, { useMemo, useState } from 'react';
import { ImageIcon, PlayCircle } from 'lucide-react';
import { RichTextBlock } from '@/components/admin/editor/blocks/RichTextBlock';
import { cn } from '@/lib/utils';
import { collectHeadings, getHeadingAnchor, normalizeHeadingAnchors, slugifyAnchor, stripHtml } from '@/lib/editor/blockUtils';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { BuilderTable } from '@/components/blocks/BuilderTable';

export interface Block {
  id: string;
  type: string;
  props?: Record<string, unknown>;
  children?: Block[];
}

export interface RenderBlockShellArgs {
  block: Block;
  content: React.ReactNode;
  depth: number;
  isSelected: boolean;
  isCollapsed: boolean;
  hasChildren: boolean;
}

export interface RenderBlockOptions {
  interactive?: boolean;
  isPreviewMode?: boolean;
  device?: 'desktop' | 'tablet' | 'mobile';
  defaultImageFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  selectedId?: string | null;
  collapsedIds?: Set<string>;
  onPropChange?: (id: string, props: Record<string, unknown>) => void;
  onSelectBlock?: (id: string | null) => void;
  onToggleCollapse?: (id: string) => void;
  renderBlockShell?: (args: RenderBlockShellArgs) => React.ReactNode;
}

function s(val: unknown): string {
  return typeof val === 'string' ? val : String(val ?? '');
}

function n(val: unknown, fallback = 0): number {
  return typeof val === 'number' ? val : Number(val ?? fallback);
}

function resolveGap(props: Record<string, unknown>, device: RenderBlockOptions['device']) {
  if (device === 'mobile') return '12px';
  if (device === 'tablet') return s(props.tabletGap) || s(props.gap) || '14px';
  return s(props.gap) || '16px';
}

function resolveResponsiveWidth(props: Record<string, unknown>, device: RenderBlockOptions['device']) {
  if (device === 'mobile') return s(props.mobileWidth) || s(props.mobileMaxWidth) || s(props.maxWidth) || s(props.width) || '100%';
  if (device === 'tablet') return s(props.tabletWidth) || s(props.maxWidth) || s(props.width) || '100%';
  return s(props.maxWidth) || s(props.width) || '100%';
}

function parseYouTubeId(url: string): string {
  if (!url) return '';
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match?.[1] ?? '';
}

function getEmbedUrl(url: string, props?: Record<string, unknown>): string {
  if (!url) return '';
  if (url.includes('embed/')) return url;
  const videoId = parseYouTubeId(url);
  if (!videoId) return url;
  let embedUrl = `https://www.youtube.com/embed/${videoId}`;
  const params: string[] = [];
  if (props?.autoplay) params.push('autoplay=1');
  if (props?.mute) params.push('mute=1');
  if (props?.controls === false) params.push('controls=0');
  if (props?.startTime && n(props.startTime) > 0) params.push(`start=${n(props.startTime)}`);
  if (props?.endTime && n(props.endTime) > 0) params.push(`end=${n(props.endTime)}`);
  if (params.length > 0) embedUrl += `?${params.join('&')}`;
  return embedUrl;
}

function buildRel(props: Record<string, unknown>) {
  const rel: string[] = [];
  if (props.nofollow) rel.push('nofollow');
  if (props.sponsored) rel.push('sponsored');
  return rel.length > 0 ? rel.join(' ') : undefined;
}

function defaultHeadingFontSize(level: number) {
  switch (level) {
    case 1:
      return 'clamp(2.25rem, 4vw, 3.5rem)';
    case 2:
      return 'clamp(1.75rem, 3vw, 2.5rem)';
    case 3:
      return 'clamp(1.35rem, 2.4vw, 2rem)';
    case 4:
      return '1.25rem';
    case 5:
      return '1.05rem';
    default:
      return '1rem';
  }
}

function ImageBlockContent({
  props,
  interactive,
  device,
  defaultImageFit,
}: {
  props: Record<string, unknown>;
  interactive: boolean;
  device: RenderBlockOptions['device'];
  defaultImageFit?: RenderBlockOptions['defaultImageFit'];
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [broken, setBroken] = useState(false);
  const imageUrl = s(props.url);
  const alt = s(props.alt);
  const caption = s(props.caption);
  const aspectRatio = s(props.aspectRatio);
  const objectFit = s(props.objectFit) || defaultImageFit || 'cover';
  const desktopWidth = s(props.maxWidth) || s(props.width) || '100%';
  const tabletWidth = s(props.tabletWidth) || desktopWidth;
  const mobileWidth = s(props.mobileWidth) || s(props.mobileMaxWidth) || '100%';
  const wrapperWidth = resolveResponsiveWidth(props, device);
  const alignment = s(props.alignment) || 'center';
  const hasImage = Boolean(imageUrl);
  const imageBody = hasImage ? (
    <>
      {!loaded && !broken && (
        <div className="absolute inset-0 animate-pulse bg-[linear-gradient(110deg,#edf2f7,35%,#f8fbff,50%,#edf2f7)] bg-[length:200%_100%]" />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl}
        alt={alt}
        loading={props.lazyLoad === false ? 'eager' : 'lazy'}
        style={{
          width: '100%',
          height: aspectRatio ? '100%' : 'auto',
          objectFit: objectFit as React.CSSProperties['objectFit'],
          borderRadius: s(props.borderRadius) || '20px',
          display: broken ? 'none' : 'block',
        }}
        className={cn(
          'builder-image transition-transform duration-300',
          props.shadow !== false && 'shadow-[0_20px_45px_rgba(15,23,42,0.14)]',
          Boolean(props.hoverZoom) && 'hover:scale-[1.035]',
        )}
        onLoad={() => {
          setLoaded(true);
          setBroken(false);
        }}
        onError={() => {
          setBroken(true);
          setLoaded(false);
        }}
      />
      {broken && (
        <div className="flex min-h-[220px] flex-col items-center justify-center rounded-[20px] border border-dashed border-[#f2bcc9] bg-[#fff8fa] px-6 text-center text-[#9f1239]">
          <ImageIcon className="mb-3 h-10 w-10 opacity-50" />
          <div className="text-sm font-semibold">Image unavailable</div>
          <div className="mt-1 text-xs">Replace the source or choose another asset from the media library.</div>
        </div>
      )}
    </>
  ) : (
    <div className="flex min-h-[220px] flex-col items-center justify-center rounded-[20px] border border-dashed border-[#d5dce6] bg-[#f8fafc] px-6 text-center text-[#64748b]">
      <ImageIcon className="mb-3 h-10 w-10 opacity-50" />
      <div className="text-sm font-semibold">Image Block</div>
      <div className="mt-1 text-xs">{interactive ? 'Upload an image or paste a media URL in the inspector.' : 'No image selected yet.'}</div>
    </div>
  );

  return (
    <>
      <figure
        style={{
          maxWidth: device ? wrapperWidth : desktopWidth,
          ['--builder-image-desktop-width' as string]: desktopWidth,
          ['--builder-image-tablet-width' as string]: tabletWidth,
          ['--builder-image-mobile-width' as string]: mobileWidth,
          marginLeft: alignment === 'center' ? 'auto' : undefined,
          marginRight: alignment === 'center' ? 'auto' : alignment === 'right' ? 0 : undefined,
        }}
        className="builder-image-figure"
      >
        <div
          className="relative overflow-hidden"
          style={{ aspectRatio: aspectRatio || undefined }}
          onClick={() => {
            if (props.openInLightbox && hasImage) setLightboxOpen(true);
          }}
        >
          {s(props.linkUrl) && hasImage ? (
            <a href={!interactive ? s(props.linkUrl) : '#'} target={s(props.linkTarget) || '_self'} onClick={(event) => interactive && event.preventDefault()}>
              {imageBody}
            </a>
          ) : imageBody}
        </div>
        {caption && <figcaption className="mt-3 text-center text-sm text-gray-500">{caption}</figcaption>}
      </figure>
      {lightboxOpen && hasImage && (
        <button
          type="button"
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/85 p-8"
          onClick={() => setLightboxOpen(false)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl} alt={alt} className="max-h-full max-w-full rounded-2xl object-contain" />
        </button>
      )}
    </>
  );
}

function YouTubeBlockContent({
  props,
  interactive,
}: {
  props: Record<string, unknown>;
  interactive: boolean;
}) {
  const [loaded, setLoaded] = useState(interactive || props.lazyLoad === false);
  const url = s(props.url).trim();
  const videoId = parseYouTubeId(url);
  const embedUrl = getEmbedUrl(url, props);
  const thumbUrl = videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : '';
  const aspectRatio = s(props.aspectRatio) || '16/9';
  const caption = s(props.caption);

  return (
    <div className="builder-video space-y-3">
      <div className="relative overflow-hidden rounded-[24px] bg-[#0f172a] shadow-[0_20px_45px_rgba(15,23,42,0.18)]" style={{ aspectRatio }}>
        {url ? (
          loaded ? (
            <iframe
              title={caption || 'YouTube Video'}
              className="absolute inset-0 h-full w-full border-0"
              src={embedUrl}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <button type="button" className="absolute inset-0 w-full" onClick={() => setLoaded(true)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={thumbUrl} alt={caption || 'Video thumbnail'} className="h-full w-full object-cover opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-black/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <PlayCircle className="h-20 w-20 text-white drop-shadow-2xl" />
              </div>
            </button>
          )
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white/65">
            <PlayCircle className="mb-3 h-12 w-12 opacity-50" />
            <div className="text-sm font-semibold">YouTube Block</div>
            <div className="mt-1 text-xs">Paste a YouTube URL to render a responsive embed.</div>
          </div>
        )}
      </div>
      {caption && <p className="text-center text-sm text-gray-500">{caption}</p>}
    </div>
  );
}

interface BlockItemProps {
  block: Block;
  options: RenderBlockOptions;
  allBlocks: Block[];
  depth: number;
}

function BlockItem({ block, options, allBlocks, depth }: BlockItemProps) {
  const {
    interactive = false,
    device,
    selectedId,
    collapsedIds,
    onPropChange,
    onSelectBlock,
    renderBlockShell,
  } = options;
  const props = (block.props ?? {}) as Record<string, unknown>;
  const isCollapsed = collapsedIds?.has(block.id) ?? false;

  const save = (nextProps: Record<string, unknown>) => {
    onPropChange?.(block.id, nextProps);
  };

  const normalizedBlocks = useMemo(() => normalizeHeadingAnchors(allBlocks), [allBlocks]);
  const headings = useMemo(() => collectHeadings(normalizedBlocks), [normalizedBlocks]);

  const sharedChildren = Array.isArray(block.children) && block.children.length > 0 && !isCollapsed ? (
    <SharedBlockRenderer
      blocks={block.children}
      allBlocks={normalizedBlocks}
      options={options}
      depth={depth + 1}
    />
  ) : null;

  let content: React.ReactNode = null;

  switch (block.type) {
    case 'heading': {
      const level = Math.min(6, Math.max(1, n(props.level, 2)));
      const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
      const text = s(props.text);
      const anchorId = getHeadingAnchor({ ...block, props });
      const fontWeightMap: Record<string, string> = {
        normal: '400',
        semibold: '600',
        bold: '700',
        extrabold: '800',
      };

      content = (
        <Tag
          id={anchorId}
          style={{
            textAlign: (s(props.textAlign) || 'left') as React.CSSProperties['textAlign'],
            color: s(props.color) || '#111827',
            fontWeight: fontWeightMap[s(props.fontWeight)] ?? '700',
            fontSize: s(props.fontSize) || defaultHeadingFontSize(level),
            marginTop: s(props.marginTop) || undefined,
            marginBottom: s(props.marginBottom) || undefined,
            scrollMarginTop: '96px',
          }}
          className={cn(
            'builder-heading tracking-tight',
            interactive && 'outline-none focus:ring-2 focus:ring-[#e31c58]/40 rounded-md px-1',
          )}
          {...(interactive
            ? {
                contentEditable: true,
                suppressContentEditableWarning: true,
                onFocus: () => onSelectBlock?.(block.id),
                onBlur: (event: React.FocusEvent<HTMLHeadingElement>) => {
                  const nextText = event.currentTarget.textContent ?? '';
                  const nextAnchor = s(props.anchorId).trim() || slugifyAnchor(nextText) || block.id;
                  save({ text: nextText, anchorId: nextAnchor });
                },
              }
            : { dangerouslySetInnerHTML: { __html: text } })}
        />
      );
      break;
    }

    case 'text': {
      const text = s(props.text);
      content = interactive ? (
        <RichTextBlock
          id={block.id}
          text={text}
          fontSize={s(props.fontSize) || '16px'}
          color={s(props.color) || '#333333'}
          textAlign={s(props.textAlign) || 'left'}
          onChange={(html) => save({ text: html })}
          onSelect={() => onSelectBlock?.(block.id)}
        />
      ) : (
        <div
          style={{
            fontSize: s(props.fontSize) || '16px',
            color: s(props.color) || '#333333',
            textAlign: (s(props.textAlign) || 'left') as React.CSSProperties['textAlign'],
          }}
          className="builder-richtext leading-7"
          dangerouslySetInnerHTML={{ __html: text }}
        />
      );
      break;
    }

    case 'list': {
      const items: string[] = Array.isArray(props.items) ? props.items.map(String) : ['First item', 'Second item'];
      const ordered = Boolean(props.ordered);
      const ListTag = ordered ? 'ol' : 'ul';

      content = (
        <ListTag
          className={cn('builder-list space-y-2 pl-6', ordered ? 'list-decimal' : 'list-disc')}
          style={{ color: s(props.color) || '#374151' }}
        >
          {items.map((item, index) => (
            <li
              key={`${block.id}-${index}`}
              className={cn(interactive && 'outline-none focus:ring-2 focus:ring-[#e31c58]/30 rounded px-1')}
              {...(interactive
                ? {
                    contentEditable: true,
                    suppressContentEditableWarning: true,
                    onFocus: () => onSelectBlock?.(block.id),
                    onBlur: (event: React.FocusEvent<HTMLLIElement>) => {
                      const updated = [...items];
                      updated[index] = event.currentTarget.innerHTML;
                      save({ items: updated });
                    },
                    dangerouslySetInnerHTML: { __html: item },
                  }
                : { dangerouslySetInnerHTML: { __html: item } })}
            />
          ))}
        </ListTag>
      );
      break;
    }

    case 'quote': {
      content = (
        <blockquote
          className="builder-quote rounded-2xl border-l-4 px-5 py-4"
          style={{
            borderColor: s(props.borderColor) || '#4686fe',
            backgroundColor: s(props.backgroundColor) || 'rgba(248, 250, 252, 0.9)',
          }}
        >
          <div
            className={cn('text-lg leading-8 text-gray-700 italic', interactive && 'outline-none focus:ring-2 focus:ring-[#e31c58]/30 rounded')}
            {...(interactive
              ? {
                  contentEditable: true,
                  suppressContentEditableWarning: true,
                  onFocus: () => onSelectBlock?.(block.id),
                  onBlur: (event: React.FocusEvent<HTMLDivElement>) => save({ text: event.currentTarget.innerHTML }),
                  dangerouslySetInnerHTML: { __html: s(props.text) || 'Enter quote text here...' },
                }
              : { dangerouslySetInnerHTML: { __html: s(props.text) } })}
          />
          {(props.attribution || interactive) && (
            <footer
              className={cn('mt-3 text-sm font-medium text-gray-500', interactive && 'outline-none focus:ring-2 focus:ring-[#e31c58]/30 rounded')}
              {...(interactive
                ? {
                    contentEditable: true,
                    suppressContentEditableWarning: true,
                    onFocus: () => onSelectBlock?.(block.id),
                    onBlur: (event: React.FocusEvent<HTMLElement>) => save({ attribution: event.currentTarget.textContent ?? '' }),
                  }
                : {})}
            >
              {interactive ? s(props.attribution) || 'Attribution' : s(props.attribution) ? `— ${s(props.attribution)}` : null}
            </footer>
          )}
        </blockquote>
      );
      break;
    }

    case 'callout': {
      const backgroundColor = s(props.backgroundColor) || s(props.calloutColor) || '#fff7ed';
      const borderColor = s(props.borderColor) || '#fdba74';
      content = (
        <div
          className="builder-callout rounded-2xl border px-5 py-4 shadow-sm"
          style={{ backgroundColor, borderColor }}
        >
          {(props.title || interactive) && (
            <div
              className={cn('mb-2 text-sm font-semibold uppercase tracking-[0.14em] text-gray-700', interactive && 'outline-none focus:ring-2 focus:ring-[#e31c58]/30 rounded')}
              {...(interactive
                ? {
                    contentEditable: true,
                    suppressContentEditableWarning: true,
                    onFocus: () => onSelectBlock?.(block.id),
                    onBlur: (event: React.FocusEvent<HTMLDivElement>) => save({ title: event.currentTarget.textContent ?? '' }),
                  }
                : {})}
            >
              {interactive ? s(props.title) || 'Callout' : s(props.title)}
            </div>
          )}
          <div
            className={cn('builder-richtext text-sm leading-7 text-gray-700', interactive && 'outline-none focus:ring-2 focus:ring-[#e31c58]/30 rounded')}
            {...(interactive
              ? {
                  contentEditable: true,
                  suppressContentEditableWarning: true,
                  onFocus: () => onSelectBlock?.(block.id),
                  onBlur: (event: React.FocusEvent<HTMLDivElement>) => save({ text: event.currentTarget.innerHTML }),
                  dangerouslySetInnerHTML: { __html: s(props.text) || 'Enter your callout message here...' },
                }
              : { dangerouslySetInnerHTML: { __html: s(props.text) } })}
          />
        </div>
      );
      break;
    }

    case 'table': {
      content = (
        <BuilderTable
          blockId={block.id}
          props={props}
          interactive={interactive}
          onChange={(nextProps) => save(nextProps)}
          onSelect={() => onSelectBlock?.(block.id)}
        />
      );
      break;
    }

    case 'button': {
      const variantMap: Record<string, Record<string, string>> = {
        primary: { backgroundColor: '#4686fe', color: '#ffffff', border: 'transparent' },
        secondary: { backgroundColor: '#002f5b', color: '#ffffff', border: 'transparent' },
        outline: { backgroundColor: 'transparent', color: '#4686fe', border: '#4686fe' },
        ghost: { backgroundColor: 'rgba(15,23,42,0.04)', color: '#111827', border: 'transparent' },
        dark: { backgroundColor: '#111827', color: '#ffffff', border: 'transparent' },
        brand: { backgroundColor: '#f59e0b', color: '#111827', border: 'transparent' },
      };
      const sizeMap: Record<string, { padding: string; fontSize: string }> = {
        sm: { padding: '0.65rem 1rem', fontSize: '0.85rem' },
        md: { padding: '0.8rem 1.2rem', fontSize: '0.95rem' },
        lg: { padding: '0.95rem 1.5rem', fontSize: '1rem' },
        xl: { padding: '1.15rem 1.75rem', fontSize: '1.1rem' },
      };
      const variant = variantMap[s(props.variant)] ?? variantMap.primary;
      const size = sizeMap[s(props.size)] ?? sizeMap.md;
      const icon = s(props.icon);
      const iconPosition = s(props.iconPosition) || 'left';
      const text = s(props.text) || 'Click Here';
      const rel = buildRel(props);
      const hoverColor = s(props.hoverColor) || variant.backgroundColor;
      const contentInner = (
        <>
          {icon && iconPosition === 'left' && <span className="text-[1.05em]">{icon}</span>}
          <span
            className={cn(interactive && 'outline-none')}
            {...(interactive
              ? {
                  contentEditable: true,
                  suppressContentEditableWarning: true,
                  onFocus: () => onSelectBlock?.(block.id),
                  onBlur: (event: React.FocusEvent<HTMLSpanElement>) => save({ text: event.currentTarget.textContent ?? '' }),
                }
              : {})}
          >
            {text}
          </span>
          {icon && iconPosition === 'right' && <span className="text-[1.05em]">{icon}</span>}
        </>
      );

      content = (
        <div style={{ textAlign: (s(props.align) || 'left') as React.CSSProperties['textAlign'] }}>
          <a
            href={!interactive ? s(props.link) || '#' : '#'}
            target={s(props.target) || '_self'}
            rel={rel}
            data-tracking-id={s(props.trackingId) || undefined}
            className="builder-button inline-flex items-center justify-center gap-2 font-semibold no-underline transition-all duration-200 hover:-translate-y-0.5"
            style={{
              width: props.fullWidth ? '100%' : 'auto',
              padding: s(props.padding) || size.padding,
              fontSize: size.fontSize,
              color: s(props.color) || variant.color,
              backgroundColor: s(props.backgroundColor) || variant.backgroundColor,
              border: `1px solid ${s(props.borderColor) || variant.border}`,
              borderRadius: s(props.borderRadius) || '14px',
              boxShadow: props.shadow === false ? 'none' : '0 12px 24px rgba(15, 23, 42, 0.12)',
              ['--builder-button-hover' as string]: hoverColor,
            }}
            onClick={(event) => {
              if (interactive) {
                event.preventDefault();
                onSelectBlock?.(block.id);
              }
            }}
          >
            {contentInner}
          </a>
        </div>
      );
      break;
    }

    case 'image': {
      content = (
        <ImageBlockContent
          props={props}
          interactive={interactive}
          device={device}
          defaultImageFit={options.defaultImageFit}
        />
      );
      break;
    }

    case 'youtube': {
      content = <YouTubeBlockContent props={props} interactive={interactive} />;
      break;
    }

    case 'video': {
      const url = s(props.url).trim();
      content = url ? (
        <div className="overflow-hidden rounded-[24px] bg-black shadow-[0_20px_45px_rgba(15,23,42,0.18)]">
          <video
            src={url}
            controls={props.controls !== false}
            autoPlay={Boolean(props.autoplay)}
            muted={Boolean(props.muted)}
            className="block w-full"
          />
        </div>
      ) : (
        <div className="flex min-h-[220px] items-center justify-center rounded-[24px] border border-dashed border-[#d5dce6] bg-[#f8fafc] text-sm text-[#64748b]">
          Add a video URL in the inspector.
        </div>
      );
      break;
    }

    case 'divider': {
      content = (
        <div style={{ padding: s(props.margin) || '18px 0' }}>
          <hr style={{ borderTop: `${s(props.thickness) || '1px'} solid ${s(props.color) || '#e2e8f0'}` }} />
        </div>
      );
      break;
    }

    case 'spacer': {
      content = (
        <div style={{ height: s(props.height) || '48px' }}>
          {interactive && (
            <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-[#d4dbe4] bg-[#f8fafc] text-[10px] font-semibold uppercase tracking-[0.18em] text-[#94a3b8]">
              Spacer · {s(props.height) || '48px'}
            </div>
          )}
        </div>
      );
      break;
    }

    case 'toc': {
      const showLevels = new Set<number>();
      if (props.showH1) showLevels.add(1);
      if (props.showH2 !== false) showLevels.add(2);
      if (props.showH3 !== false) showLevels.add(3);
      if (props.showH4) showLevels.add(4);

      const tocItems = headings.filter((heading) => heading.includeInToc && showLevels.has(heading.level));
      content = (
        <nav className="builder-toc rounded-[24px] border border-[#e5eaf1] bg-[#f8fafc] p-5 shadow-[0_12px_32px_rgba(15,23,42,0.05)]">
          <div className="mb-4 text-sm font-semibold uppercase tracking-[0.16em] text-[#0f172a]">
            {s(props.title) || 'Table of Contents'}
          </div>
          <ol className="space-y-2">
            {tocItems.map((heading) => (
              <li key={heading.id} className={cn(heading.level === 3 && 'ml-4', heading.level === 4 && 'ml-8')}>
                <a
                  href={`#${heading.anchorId}`}
                  className="text-sm text-[#4686fe] transition-colors hover:text-[#2f6fe6] hover:underline"
                  onClick={(event) => {
                    if (typeof document !== 'undefined') {
                      const target = document.getElementById(heading.anchorId);
                      if (target) {
                        event.preventDefault();
                        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }
                  }}
                >
                  {heading.text || '(untitled section)'}
                </a>
              </li>
            ))}
            {tocItems.length === 0 && <li className="text-sm text-gray-400">Add headings to generate the table of contents.</li>}
          </ol>
        </nav>
      );
      break;
    }

    case 'faq': {
      const items = Array.isArray(props.items) ? (props.items as { q: string; a: string }[]) : [];
      content = (
        <div className="space-y-3">
          {items.length === 0 && (
            <div className="rounded-2xl border border-dashed border-[#d6deea] bg-[#f8fafc] p-5 text-sm text-[#64748b]">
              Add FAQ items from the inspector.
            </div>
          )}
          {items.map((item, index) => (
            <details key={`${block.id}-faq-${index}`} className="group overflow-hidden rounded-2xl border border-[#e4eaf0] bg-white shadow-[0_10px_26px_rgba(15,23,42,0.04)]" open={interactive ? index === 0 : undefined}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold text-[#0f172a]">
                <span>{item.q}</span>
                <span className="text-[#94a3b8] transition-transform group-open:rotate-180">⌄</span>
              </summary>
              <div className="px-5 pb-5 text-sm leading-7 text-[#475569]">{item.a}</div>
            </details>
          ))}
        </div>
      );
      break;
    }

    case 'section':
    case 'column':
    case 'columns-2':
    case 'columns-3':
    case 'columns-4': {
      const layout = s(props.layout) || (block.type.startsWith('columns-') ? 'flex-row' : 'stack');
      const gap = resolveGap(props, device);
      const isRowLayout = layout === 'flex-row';
      const useGrid = block.type === 'columns-4';
      const childCount = block.children?.length ?? (block.type === 'columns-2' ? 2 : block.type === 'columns-3' ? 3 : block.type === 'columns-4' ? 4 : 0);
      const responsiveLayoutClass = useGrid
        ? device === 'mobile'
          ? 'grid-cols-1'
          : device === 'tablet'
            ? 'grid-cols-2'
            : device === 'desktop'
              ? 'grid-cols-4'
              : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-4'
        : device === 'mobile'
          ? 'flex-col'
          : device === 'tablet'
            ? 'flex-row'
            : device === 'desktop'
              ? isRowLayout ? 'flex-row' : 'flex-col'
              : isRowLayout
                ? 'flex-col md:flex-row'
                : 'flex-col';

      content = (
        <div
          className={cn(
            'builder-layout w-full rounded-[24px] transition-all',
            interactive && 'border border-dashed border-[#d6deea] bg-[#fcfdff]',
          )}
          style={{
            padding: s(props.padding) || '16px',
            marginTop: s(props.marginTop) || undefined,
            marginBottom: s(props.marginBottom) || undefined,
            backgroundColor: s(props.backgroundColor) || 'transparent',
            borderRadius: s(props.borderRadius) || undefined,
            boxShadow: props.shadow ? '0 20px 40px rgba(15, 23, 42, 0.08)' : undefined,
          }}
        >
          <div
            className={cn(
              'w-full',
              useGrid ? 'grid' : 'flex',
              responsiveLayoutClass,
            )}
            style={{ gap }}
          >
            {sharedChildren}
            {!sharedChildren && interactive && childCount === 0 && (
              <div className="flex min-h-[120px] items-center justify-center rounded-2xl border border-dashed border-[#d6deea] bg-[#f8fafc] text-sm text-[#64748b]">
                Drop blocks here or use quick insert.
              </div>
            )}
          </div>
        </div>
      );
      break;
    }

    default: {
      content = interactive ? (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          Unsupported block type: <strong className="font-mono">{block.type}</strong>
        </div>
      ) : null;
      break;
    }
  }

  if (renderBlockShell) {
    return (
      <>
        {renderBlockShell({
          block,
          content,
          depth,
          isSelected: selectedId === block.id,
          isCollapsed,
          hasChildren: Array.isArray(block.children) && block.children.length > 0,
        })}
      </>
    );
  }

  return <>{content}</>;
}

export function SharedBlockRenderer({
  blocks,
  options = {},
  allBlocks,
  depth = 0,
}: {
  blocks: Block[];
  options?: RenderBlockOptions;
  allBlocks?: Block[];
  depth?: number;
}) {
  const normalizedBlocks = useMemo(() => normalizeHeadingAnchors(allBlocks ?? blocks), [allBlocks, blocks]);

  if (!blocks || !Array.isArray(blocks)) return null;

  const items = blocks.map((block) => block.id);

  if (options.interactive && options.renderBlockShell) {
    return (
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        {blocks.map((block) => (
          <BlockItem
            key={block.id}
            block={block}
            options={options}
            allBlocks={normalizedBlocks}
            depth={depth}
          />
        ))}
      </SortableContext>
    );
  }

  return (
    <>
      {blocks.map((block) => (
        <BlockItem
          key={block.id}
          block={block}
          options={options}
          allBlocks={normalizedBlocks}
          depth={depth}
        />
      ))}
    </>
  );
}
