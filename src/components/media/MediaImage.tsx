'use client'

import Image, { type ImageProps, type ImageLoader } from 'next/image'
import { mediaImageLoader, getMediaUrl, isExternalMediaUrl } from '@/lib/media/cdn'

type MediaImageProps = Omit<ImageProps, 'src' | 'loader'> & {
  src: string
  /** Prefer for LCP / above-the-fold only. */
  priority?: boolean
  /**
   * Serve the exact file (e.g. designer `-390.webp` / `-780.webp`) instead of
   * rewriting to prebuilt `.w{400|800|1200}.webp` variants.
   */
  original?: boolean
  /** Allow gallery CSS hooks like data-current */
  'data-current'?: string
}

const originalLoader: ImageLoader = ({ src }) => src

/**
 * CDN-backed image. Uses a custom loader so bytes come from R2/CDN,
 * not the Next.js image optimizer on the VPS.
 */
export function MediaImage({
  src,
  alt,
  priority = false,
  original = false,
  loading,
  sizes = '(max-width: 768px) 100vw, 50vw',
  className,
  fill,
  width,
  height,
  ...rest
}: MediaImageProps) {
  if (!src) return null

  if (isExternalMediaUrl(src)) {
    // External hosts (rare for homepage stills) — plain img to avoid remotePatterns gaps
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        loading={priority ? 'eager' : loading === 'eager' ? 'eager' : 'lazy'}
        decoding="async"
        {...(fill
          ? { style: { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' } }
          : { width, height })}
      />
    )
  }

  const resolved = getMediaUrl(src)
  const loader = original ? originalLoader : mediaImageLoader

  if (fill) {
    return (
      <Image
        src={resolved}
        alt={alt}
        fill
        loader={loader}
        unoptimized={original}
        sizes={sizes}
        priority={priority}
        loading={priority ? undefined : loading ?? 'lazy'}
        className={className}
        {...rest}
      />
    )
  }

  const w = typeof width === 'number' ? width : 1200
  const h = typeof height === 'number' ? height : 800

  return (
    <Image
      src={resolved}
      alt={alt}
      width={w}
      height={h}
      loader={loader}
      unoptimized={original}
      sizes={sizes}
      priority={priority}
      loading={priority ? undefined : loading ?? 'lazy'}
      className={className}
      {...rest}
    />
  )
}

export default MediaImage
