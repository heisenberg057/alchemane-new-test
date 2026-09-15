'use client';

import { useEffect, useRef, useState } from 'react';

type LoadStrategy = 'visible' | 'click';

interface LazyGumletEmbedProps {
  embedSrc: string;
  title: string;
  loadStrategy?: LoadStrategy;
  rootMargin?: string;
  iframePointerEvents?: 'auto' | 'none';
  placeholderLabel?: string;
  className?: string;
  /**
   * Desktop gallery pattern: Gumlet expects a wide (e.g. 16:9) player width while the
   * visible card is a narrow strip. Parent should use overflow:hidden + position:relative.
   * Iframe is height 100%, this width, right-aligned so the crop matches the pre-lazy layout.
   */
  clipIframeWidthPx?: number;
  /** With clipIframeWidthPx: visible card width (px) so the placeholder centers in the cropped strip */
  clipVisibleWidthPx?: number;
  /** IntersectionObserver threshold (0–1). Higher = fewer eager loads in dense carousels. */
  intersectionThreshold?: number;
}

const DEFAULT_ALLOW =
  'accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen; clipboard-write';

export function LazyGumletEmbed({
  embedSrc,
  title,
  loadStrategy = 'visible',
  rootMargin = '240px 0px',
  iframePointerEvents = 'auto',
  placeholderLabel = 'Video loads on demand',
  className = '',
  clipIframeWidthPx,
  clipVisibleWidthPx,
  intersectionThreshold = 0.15,
}: LazyGumletEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (loadStrategy !== 'visible' || shouldLoad) return;

    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShouldLoad(true);
        observer.disconnect();
      },
      { rootMargin, threshold: intersectionThreshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [loadStrategy, rootMargin, shouldLoad, intersectionThreshold]);

  const clip = clipIframeWidthPx != null;
  const clipStyle = clip
    ? { top: 0, right: 0, bottom: 0, left: 'auto' as const, width: clipIframeWidthPx, height: '100%' }
    : undefined;
  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden ${className}`.trim()}
    >
      {shouldLoad ? (
        <iframe
          title={title}
          className={
            clip
              ? 'absolute top-0 right-0 block h-full border-0'
              : 'absolute inset-0 block h-full w-full border-0'
          }
          src={embedSrc}
          style={{
            pointerEvents: iframePointerEvents,
            ...(clip ? { width: clipIframeWidthPx, left: 'auto' } : {}),
          }}
          referrerPolicy="origin"
          allow={DEFAULT_ALLOW}
        />
      ) : (
        <button
          type="button"
          onClick={() => setShouldLoad(true)}
          aria-label={`Load ${title}`}
          className={
            clip
              ? 'absolute top-0 right-0 box-border flex h-full items-center justify-center overflow-hidden border-0 bg-[#0f172a] p-0 text-left'
              : 'absolute inset-0 box-border flex h-full w-full items-center justify-center overflow-hidden border-0 bg-[#0f172a] p-0 text-left'
          }
          style={clipStyle}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(70,134,254,0.28),_transparent_58%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,_rgba(15,23,42,0.2),_rgba(15,23,42,0.82))]" />
          {clip && clipVisibleWidthPx != null ? (
            <div
              className="absolute top-0 bottom-0 right-0 flex flex-col items-center justify-center gap-3 px-3 text-center text-white"
              style={{ width: clipVisibleWidthPx }}
            >
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-white/14 ring-1 ring-white/18 backdrop-blur-sm">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M8 6.5V17.5L17 12L8 6.5Z" fill="white" />
                </svg>
              </span>
              <div className="space-y-1">
                <p className="text-base font-semibold tracking-[-0.1px]">{title}</p>
                <p className="text-sm text-white/76">{placeholderLabel}</p>
              </div>
            </div>
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center text-white">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/14 ring-1 ring-white/18 backdrop-blur-sm">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M8 6.5V17.5L17 12L8 6.5Z" fill="white" />
                </svg>
              </span>
              <div className="space-y-1">
                <p className="text-base font-semibold tracking-[-0.1px]">{title}</p>
                <p className="text-sm text-white/76">{placeholderLabel}</p>
              </div>
            </div>
          )}
        </button>
      )}
    </div>
  );
}
