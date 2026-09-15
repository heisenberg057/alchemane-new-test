'use client';

import { useEffect, useRef, useState } from 'react';
import { useScroll } from 'motion/react';
import { MediaImage } from '@/components/media/MediaImage';
import { usePrefersReducedMotion } from '../HeroSecret/hooks';
import { hairSystems, systemsTitle } from './content';
import { CircularGallery, type GalleryItem } from './CircularGallery';

const items: GalleryItem[] = hairSystems.map((system) => ({
  id: system.id,
  common: system.title,
  photo: { url: system.image, text: system.title },
}));

const byId = new Map(hairSystems.map((s) => [s.id, s]));

function withAutoplay(src: string) {
  return src.replace('autoplay=false', 'autoplay=true');
}

export default function Systems() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const [still, setStill] = useState(true);
  const [playingId, setPlayingId] = useState<number | null>(null);

  useEffect(() => {
    const read = () =>
      setStill(reduced || !window.matchMedia('(min-width: 901px)').matches);
    read();
    window.addEventListener('resize', read);
    return () => window.removeEventListener('resize', read);
  }, [reduced]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const playing = playingId != null;

  return (
    <section
      className={`ahlV2Systems systems${still ? ' systems--still' : ''}${playing ? ' systems--playing' : ''}`}
      ref={sectionRef}
      aria-labelledby="systems-title"
    >
      <div className="systems__pin">
        <h2 className="systems__title" id="systems-title">
          {systemsTitle.map((line) => (
            <span key={line}>{line} </span>
          ))}
        </h2>

        <CircularGallery
          items={items}
          progress={scrollYProgress}
          turns={1}
          radius={700}
          perspectivePx={2200}
          autoRotateSpeed={still || playing ? 0 : 0.015}
          still={still}
          paused={playing}
          labelledBy="systems-title"
          renderCard={(item) => {
            const id = Number(item.id);
            const system = byId.get(id);
            const playable = Boolean(system?.src);
            const isPlaying = playingId === id;

            if (isPlaying && system?.src) {
              return (
                <>
                  <iframe
                    className="systems__video"
                    title={system.title}
                    src={withAutoplay(system.src)}
                    allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen; clipboard-write"
                    referrerPolicy="origin"
                    allowFullScreen
                  />
                  <button
                    type="button"
                    className="systems__close"
                    onClick={(e) => {
                      e.stopPropagation();
                      setPlayingId(null);
                    }}
                    aria-label="Close video"
                  >
                    ×
                  </button>
                </>
              );
            }

            if (!playable) {
              return (
                <MediaImage
                  src={item.photo.url}
                  alt={item.photo.text}
                  width={600}
                  height={750}
                  sizes="300px"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              );
            }

            return (
              <button
                type="button"
                className="systems__trigger"
                onClick={() => setPlayingId(id)}
                aria-label={`Play ${item.photo.text}`}
              >
                <MediaImage
                  src={item.photo.url}
                  alt={item.photo.text}
                  width={600}
                  height={750}
                  sizes="300px"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span className="systems__play" data-playable="true">
                  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M8.5 5.4v13.2L19 12z" fill="currentColor" />
                  </svg>
                </span>
              </button>
            );
          }}
        />
      </div>
    </section>
  );
}
