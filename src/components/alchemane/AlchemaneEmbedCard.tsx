'use client';

import { useState } from 'react';
import { MediaImage } from '@/components/media/MediaImage';

export interface AlchemaneEmbedAsset {
  embedSrc: string;
  poster: string;
  width: number;
  height: number;
  alt: string;
}

/**
 * Click-to-load embed (Gumlet or YouTube iframe) — mirrors the original
 * `[data-embed-card]` behaviour: a poster image with a play button that,
 * on click, swaps itself for a live iframe. No cross-card pause
 * coordination, matching the source site's own behaviour.
 */
export function AlchemaneEmbedCard({
  video,
  className,
  posterClassName,
  cornerPlayButton,
}: {
  video: AlchemaneEmbedAsset;
  className: string;
  posterClassName?: string;
  cornerPlayButton?: boolean;
}) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className={`${className} is-playing`} data-video-card>
        <iframe
          src={video.embedSrc}
          title={video.alt}
          loading="lazy"
          allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className={className} data-video-card>
      <MediaImage
        src={video.poster}
        alt={video.alt}
        width={video.width}
        height={video.height}
        className={posterClassName}
      />
      <button
        type="button"
        className={`play-button${cornerPlayButton ? ' play-button--corner' : ''}`}
        aria-label={`Play: ${video.alt}`}
        onClick={() => setPlaying(true)}
      >
        <i aria-hidden="true" />
      </button>
    </div>
  );
}
