/**
 * CDN media URL helpers — browsers should hit R2/CDN directly, never the VPS proxy.
 *
 * Phase 1: absolute NEXT_PUBLIC_R2_PUBLIC_URL + prebuilt `.w{400|800|1200}.webp`
 * Phase 2: NEXT_PUBLIC_MEDIA_CDN_URL + NEXT_PUBLIC_MEDIA_IMAGE_RESIZE=1 (CF Image Resizing)
 */

const DEFAULT_R2 = 'https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev'
const PREBUILT_WIDTHS = [400, 800, 1200] as const

function stripTrailingSlash(url: string): string {
  return url.replace(/\/$/, '')
}

/** Public origin for media (custom CDN domain preferred, else R2). */
export function getMediaOrigin(): string {
  const cdn = process.env.NEXT_PUBLIC_MEDIA_CDN_URL
  if (cdn) return stripTrailingSlash(cdn)
  const r2 = process.env.NEXT_PUBLIC_R2_PUBLIC_URL
  if (r2) return stripTrailingSlash(r2)
  return DEFAULT_R2
}

/**
 * True when we should emit absolute CDN URLs.
 * Local/dev keeps `/media/...` so `public/media` works without R2.
 *
 * `NEXT_PUBLIC_MEDIA_LOCAL_OVERRIDE=1` forces local `/media/...` URLs even in a
 * production build — for preview deployments that bundle their own media
 * instead of pulling from the real R2 bucket. Never set in real production.
 */
export function useAbsoluteMediaUrls(): boolean {
  if (process.env.NEXT_PUBLIC_MEDIA_LOCAL_OVERRIDE === '1') return false
  if (process.env.NEXT_PUBLIC_MEDIA_FORCE_ABSOLUTE === '1') return true
  if (process.env.NEXT_PUBLIC_MEDIA_CDN_URL) return true
  return process.env.NODE_ENV === 'production'
}

export function isAbsoluteUrl(src: string): boolean {
  return /^https?:\/\//i.test(src) || src.startsWith('//')
}

/** Leave Gumlet / external URLs alone. */
export function isExternalMediaUrl(src: string): boolean {
  if (!isAbsoluteUrl(src)) return false
  try {
    const host = new URL(src.startsWith('//') ? `https:${src}` : src).hostname
    return (
      host.includes('gumlet.io') ||
      host.includes('youtube.com') ||
      host.includes('youtu.be') ||
      host.includes('wistia')
    )
  } catch {
    return false
  }
}

/**
 * Normalize to a bucket-relative path under `media/`, without leading slash.
 * Accepts `/media/foo.png`, `media/foo.png`, `foo.png`, or full R2/CDN URL.
 */
export function toMediaKey(src: string): string {
  if (!src) return ''
  if (isExternalMediaUrl(src)) return src

  let path = src.trim()
  if (isAbsoluteUrl(path)) {
    try {
      path = new URL(path.startsWith('//') ? `https:${path}` : path).pathname
    } catch {
      return src
    }
  }

  path = path.replace(/^\/+/, '')
  if (path.startsWith('media/')) return path
  return `media/${path}`
}

/** Absolute or relative public URL for a media asset (image or video file). */
export function getMediaUrl(src: string): string {
  if (!src) return ''
  if (isExternalMediaUrl(src)) return src

  const key = toMediaKey(src)
  if (!useAbsoluteMediaUrls()) {
    return `/${key}`
  }

  return `${getMediaOrigin()}/${key}`
}

function nearestPrebuiltWidth(width: number): (typeof PREBUILT_WIDTHS)[number] {
  let best: (typeof PREBUILT_WIDTHS)[number] = PREBUILT_WIDTHS[0]
  for (const candidate of PREBUILT_WIDTHS) {
    if (Math.abs(candidate - width) < Math.abs(best - width)) best = candidate
  }
  // Prefer never upsizing past requested width when possible
  const notLarger = PREBUILT_WIDTHS.filter((w) => w >= width)
  if (notLarger.length) return notLarger[0]!
  return best
}

function prebuiltWebpKey(mediaKey: string, width: number): string {
  const w = nearestPrebuiltWidth(width)
  const replaced = mediaKey.replace(/\.(png|jpe?g|webp|avif)$/i, `.w${w}.webp`)
  if (replaced === mediaKey) {
    return `${mediaKey}.w${w}.webp`
  }
  return replaced
}

export function isImageResizeEnabled(): boolean {
  return process.env.NEXT_PUBLIC_MEDIA_IMAGE_RESIZE === '1'
}

export type ImageUrlOptions = {
  width?: number
  quality?: number
  /** Skip prebuilt webp / CF resize and return original. */
  original?: boolean
}

/**
 * Responsive image URL for a given target width.
 * - CF Image Resizing when enabled (Phase 2)
 * - Else prebuilt `.w{N}.webp` on the CDN (Phase 1)
 * - Else original asset
 */
export function getImageUrl(src: string, options: ImageUrlOptions = {}): string {
  if (!src) return ''
  if (isExternalMediaUrl(src)) return src

  const width = options.width ?? 800
  const quality = options.quality ?? 75
  const key = toMediaKey(src)

  if (options.original || /\.(mp4|webm|mov)$/i.test(key)) {
    return getMediaUrl(key)
  }

  if (isImageResizeEnabled() && useAbsoluteMediaUrls()) {
    const origin = getMediaOrigin()
    const params = `width=${Math.min(Math.round(width), 3840)},quality=${quality},format=auto`
    return `${origin}/cdn-cgi/image/${params}/${key}`
  }

  if (useAbsoluteMediaUrls() && /\.(png|jpe?g|webp|avif)$/i.test(key)) {
    return `${getMediaOrigin()}/${prebuiltWebpKey(key, width)}`
  }

  return getMediaUrl(key)
}

/** next/image loader — returns CDN URL directly (does not hit `/_next/image`). */
export function mediaImageLoader({
  src,
  width,
  quality,
}: {
  src: string
  width: number
  quality?: number
}): string {
  return getImageUrl(src, { width, quality })
}

/** Gumlet embed URL from asset id. */
export function gumletEmbedUrl(id: string): string {
  return `https://play.gumlet.io/embed/${id}?background=false&autoplay=false&loop=false&disable_player_controls=false`
}
