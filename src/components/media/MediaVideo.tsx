'use client'

import { useEffect, useRef, type VideoHTMLAttributes } from 'react'
import { getMediaUrl, gumletEmbedUrl, isExternalMediaUrl } from '@/lib/media/cdn'
import { MediaImage } from './MediaImage'

export type MediaVideoProps = {
  /** Local/R2 path or absolute URL. Ignored when gumletId is set. */
  src?: string
  /** Prefer Gumlet adaptive streaming when present. */
  gumletId?: string
  poster?: string
  alt?: string
  label?: string
  className?: string
  videoClassName?: string
  posterClassName?: string
  playClassName?: string
  /** When true, show poster with play affordance until clicked. */
  clickToPlay?: boolean
  playing?: boolean
  onPlay?: () => void
  /** Native video attrs when not using Gumlet. */
  videoProps?: Omit<VideoHTMLAttributes<HTMLVideoElement>, 'src' | 'poster' | 'className'>
}

/**
 * Prefer Gumlet when `gumletId` is set. Without it, poster-only for heavy
 * assets (no auto-download of multi‑MB MP4s). Optional native CDN mp4 with preload=none.
 */
export function MediaVideo({
  src = '',
  gumletId,
  poster = '',
  alt = '',
  label,
  className,
  videoClassName,
  posterClassName,
  playClassName,
  clickToPlay = true,
  playing = false,
  onPlay,
  videoProps,
}: MediaVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const hasGumlet = Boolean(gumletId)
  const hasNative = Boolean(src) && !hasGumlet
  const playable = hasGumlet || hasNative

  useEffect(() => {
    const video = videoRef.current
    if (!video || hasGumlet) return
    if (playing) {
      void video.play().catch(() => {})
      return
    }
    video.pause()
    video.currentTime = 0
  }, [playing, hasGumlet])

  if (hasGumlet && playing) {
    return (
      <div className={className}>
        <iframe
          className={videoClassName}
          src={gumletEmbedUrl(gumletId!)}
          title={alt || label || 'Video'}
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
          loading="lazy"
          style={{ border: 'none', width: '100%', height: '100%', minHeight: '240px' }}
        />
      </div>
    )
  }

  if (hasNative && playing) {
    const videoSrc = isExternalMediaUrl(src) ? src : getMediaUrl(src)
    const posterSrc = poster ? getMediaUrl(poster) : undefined
    return (
      <div className={className}>
        <video
          ref={videoRef}
          className={videoClassName}
          src={videoSrc}
          poster={posterSrc}
          controls
          autoPlay
          playsInline
          preload="none"
          {...videoProps}
        />
      </div>
    )
  }

  const posterInner = (
    <>
      {poster ? (
        <MediaImage
          src={poster}
          alt={playable ? '' : alt}
          width={1600}
          height={900}
          sizes="(max-width: 768px) 100vw, 60vw"
          className={posterClassName}
          style={{ width: '100%', height: 'auto' }}
        />
      ) : null}
      {playable && (
        <span className={playClassName}>
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M8 5.2v13.6L19 12z" fill="currentColor" />
          </svg>
          {label}
        </span>
      )}
    </>
  )

  if (playable && clickToPlay && onPlay) {
    return (
      <button type="button" className={className} onClick={onPlay}>
        {posterInner}
      </button>
    )
  }

  return <figure className={className}>{posterInner}</figure>
}

export default MediaVideo
