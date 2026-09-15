'use client';

import type { ImageProps } from 'next/image';
import { MediaImage } from '@/components/media/MediaImage';
import { getMediaUrl } from '@/lib/media/cdn';

type BangaloreR2ImageProps = Omit<ImageProps, 'src' | 'loader'> & {
  /** Desktop / default asset (usually `*-780.webp` or SVG) */
  src: string;
  /** Optional mobile art-direction asset (usually `*-390.webp`) */
  srcMobile?: string;
  alt: string;
};

/**
 * Bangalore LP stills on R2 — uses designer filenames as-is (no `.w{N}.webp`).
 */
export function BangaloreR2Image({ src, srcMobile, alt, fill, ...rest }: BangaloreR2ImageProps) {
  const image = <MediaImage src={src} alt={alt} original fill={fill} {...rest} />;

  if (!srcMobile) return image;

  return (
    // `display: contents` keeps `fill` images sized by the real positioned parent
    <picture style={fill ? { display: 'contents' } : undefined}>
      <source media="(max-width: 480px)" srcSet={getMediaUrl(srcMobile)} type="image/webp" />
      {image}
    </picture>
  );
}
