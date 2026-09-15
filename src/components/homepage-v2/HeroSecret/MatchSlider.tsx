'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MediaImage } from '@/components/media/MediaImage';
import { clients } from './content';
import { usePerView } from './hooks';

export function MatchSlider() {
  const perView = usePerView();
  const pages = Math.max(1, Math.ceil(clients.length / perView));
  const [page, setPage] = useState(0);

  useEffect(() => {
    setPage((p) => Math.min(p, pages - 1));
  }, [pages]);

  const go = (next: number) => setPage((next + pages) % pages);

  return (
    <section
      className="match"
      aria-labelledby="match-title"
      style={{ '--per-view': perView } as CSSProperties}
    >
      <h2 className="match__title" id="match-title">
        Trusted by 6k+ men around the world
      </h2>

      <div className="match__body">
        <button
          className="match__arrow match__arrow--prev"
          type="button"
          onClick={() => go(page - 1)}
          aria-label="Previous clients"
        >
          <ChevronLeft size={20} strokeWidth={2.5} />
        </button>

        <div className="match__viewport">
          <ul
            className="match__track"
            style={{
              transform: `translateX(calc(${-page * 100}% - ${page} * var(--card-gap)))`,
            }}
          >
            {clients.map((person, i) => (
              <li
                className="match__item"
                key={`${person.client}-${i}`}
                aria-hidden={Math.floor(i / perView) !== page}
              >
                <div className="match__thumb">
                  <MediaImage
                    src={person.img}
                    alt={`${person.client}, wearing a ${person.style} hair system`}
                    width={480}
                    height={480}
                    sizes="(max-width: 900px) 40vw, 180px"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <span className="match__label">{person.client}</span>
              </li>
            ))}
          </ul>
        </div>

        <button
          className="match__arrow match__arrow--next"
          type="button"
          onClick={() => go(page + 1)}
          aria-label="Next clients"
        >
          <ChevronRight size={20} strokeWidth={2.5} />
        </button>

        <div className="match__dots" role="group" aria-label="Client pages">
          {Array.from({ length: pages }, (_, i) => (
            <button
              className="match__dot"
              key={i}
              type="button"
              aria-current={i === page ? 'true' : undefined}
              aria-label={`Go to page ${i + 1} of ${pages}`}
              onClick={() => go(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
