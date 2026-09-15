"use client";

import React, { useState } from 'react';
import { ImageIcon } from 'lucide-react';

interface ImageBlockProps {
  url?: string;
  alt?: string;
  width?: string;
  borderRadius?: string;
  caption?: string;
  alignment?: 'left' | 'center' | 'right';
  shadow?: boolean;
  linkUrl?: string;
  maxWidth?: string;
}

function isValidUrl(value: unknown): value is string {
  if (!value || typeof value !== 'string' || !value.trim()) return false;
  try {
    const u = new URL(value);
    return u.protocol === 'http:' || u.protocol === 'https:' || u.protocol === 'data:';
  } catch {
    return value.startsWith('/') || value.startsWith('./') || value.startsWith('../');
  }
}

export function ImageBlock({ url, alt, width, borderRadius, caption, alignment = 'center', shadow = false, linkUrl, maxWidth }: ImageBlockProps) {
  const [imgError, setImgError] = useState(false);

  const hasUrl = isValidUrl(url);
  const showImage = hasUrl && !imgError;
  const resolvedMaxWidth = maxWidth || width || '100%';

  const imgEl = showImage ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url as string}
      alt={alt || ''}
      className={`w-full h-auto block ${shadow ? 'shadow-lg' : ''}`}
      style={{ borderRadius: borderRadius || '0px' }}
      onError={() => setImgError(true)}
    />
  ) : (
    <div
      className="flex flex-col items-center justify-center bg-muted/30 border-2 border-dashed rounded"
      style={{ minHeight: '160px' }}
    >
      <ImageIcon className="h-10 w-10 text-muted-foreground/40 mb-2" />
      <span className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
        {imgError ? 'Image failed to load' : 'Select image in Inspector'}
      </span>
      {imgError && url && (
        <span className="text-[10px] text-muted-foreground/50 mt-1 max-w-[200px] truncate">{url}</span>
      )}
    </div>
  );

  return (
    <figure style={{ textAlign: alignment, maxWidth: resolvedMaxWidth, margin: alignment === 'center' ? '0 auto' : undefined }}>
      {showImage && linkUrl ? (
        <a href={linkUrl} target="_self" onClick={(e) => e.preventDefault()}>
          {imgEl}
        </a>
      ) : imgEl}
      {caption && (
        <figcaption className="text-sm text-muted-foreground mt-1 text-center">{caption}</figcaption>
      )}
    </figure>
  );
}
