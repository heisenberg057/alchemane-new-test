'use client';

import Image, { type ImageProps } from 'next/image';
import { MediaImage } from '@/components/media/MediaImage';
import { getMediaUrl } from '@/lib/media/cdn';

type ClipOnStillProps = Omit<ImageProps, 'src' | 'loader'> & {
  /** R2 key (`/media/clip-on-lp/...`) or local SVG (`/assets/clip-on-lp/...`) */
  src: string;
  /** Optional mobile art-direction (`*-390.webp` on R2) */
  srcMobile?: string;
  alt: string;
};

function isLocalPublicAsset(src: string) {
  return src.startsWith('/assets/');
}

/**
 * Clip-on LP images: R2 stills via MediaImage (`original`); local SVGs via next/image.
 */
export function ClipOnStill({ src, srcMobile, alt, fill, ...rest }: ClipOnStillProps) {
  if (isLocalPublicAsset(src)) {
    const image = <Image src={src} alt={alt} fill={fill} unoptimized {...rest} />;
    if (!srcMobile) return image;
    return (
      <picture style={fill ? { display: 'contents' } : undefined}>
        <source media="(max-width: 480px)" srcSet={srcMobile} type="image/webp" />
        {image}
      </picture>
    );
  }

  const image = <MediaImage src={src} alt={alt} original fill={fill} {...rest} />;

  if (!srcMobile) return image;

  return (
    <picture style={fill ? { display: 'contents' } : undefined}>
      <source media="(max-width: 480px)" srcSet={getMediaUrl(srcMobile)} type="image/webp" />
      {image}
    </picture>
  );
}
