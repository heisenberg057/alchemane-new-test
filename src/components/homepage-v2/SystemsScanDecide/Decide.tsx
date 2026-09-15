'use client';

import { useState } from 'react';
import { MediaImage } from '@/components/media/MediaImage';
import { gumletEmbedUrl } from '@/lib/media/cdn';
import { useReveal } from '../HeroSecret/hooks';
import { decideNote, decideTitle, decideVideo } from './content';

export default function Decide() {
  const { ref: revealRef, shown } = useReveal<HTMLDivElement>();
  const [playing, setPlaying] = useState(false);
  const playable = Boolean(decideVideo.gumletId) || decideVideo.src !== '';

  const media = (
    <>
      <MediaImage
        className="decide__poster"
        src={decideVideo.poster}
        alt={playable ? '' : decideVideo.alt}
        width={1600}
        height={900}
        sizes="(max-width: 900px) 100vw, 70vw"
        style={{ width: '100%', height: 'auto' }}
      />
      {playable ? (
        <span className="decide__play">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M8 5.2v13.6L19 12z" fill="currentColor" />
          </svg>
          {decideVideo.label}
        </span>
      ) : null}
    </>
  );

  return (
    <section className="ahlV2Systems decide" aria-labelledby="decide-title">
      <div
        className="decide__in wrap"
        data-shown={shown ? 'true' : 'false'}
        ref={revealRef}
      >
        <h2 className="decide__title" id="decide-title">
          {decideTitle.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>

        <div className="decide__stage">
          {playable && playing && decideVideo.gumletId ? (
            <div className="decide__card">
              <iframe
                className="decide__video"
                src={gumletEmbedUrl(decideVideo.gumletId)}
                title={decideVideo.alt}
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
                loading="lazy"
                style={{ border: 'none', width: '100%', height: '100%', minHeight: 320 }}
              />
            </div>
          ) : playable && playing && decideVideo.src ? (
            <div className="decide__card">
              <video
                className="decide__video"
                src={decideVideo.src}
                poster={decideVideo.poster}
                controls
                autoPlay
                playsInline
                preload="none"
              />
            </div>
          ) : playable ? (
            <button
              type="button"
              className="decide__card decide__card--playable"
              onClick={() => setPlaying(true)}
            >
              {media}
            </button>
          ) : (
            <figure className="decide__card">{media}</figure>
          )}
        </div>

        <p className="decide__note">{decideNote}</p>
      </div>
    </section>
  );
}
