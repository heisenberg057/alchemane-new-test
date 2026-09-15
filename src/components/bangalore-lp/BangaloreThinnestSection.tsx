'use client';

import { LazyGumletEmbed } from '@/components/video/LazyGumletEmbed';
import { gumletEmbedUrl } from '@/lib/media/cdn';
import { BANGALORE_THINNEST_VIDEOS } from './content';
import { useBangaloreCarousel } from './useBangaloreCarousel';
import styles from './BangaloreThinnestSection.module.css';

function ChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m14.5 6-6 6 6 6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m9.5 6 6 6-6 6" />
    </svg>
  );
}

export function BangaloreThinnestSection() {
  const { trackRef, activeIndex, canPrev, canNext, movePrev, moveNext } = useBangaloreCarousel({
    itemCount: BANGALORE_THINNEST_VIDEOS.length,
  });

  return (
    <section className={styles.root} aria-labelledby="bangalore-thin-title">
      <h2 id="bangalore-thin-title" className={styles.title}>
        World&apos;s Thinnest
        <br />
        <span className={styles.titleAccent}>Hair Systems</span>
      </h2>

      <div className={styles.carousel} aria-label="World's thinnest hair systems">
        <div ref={trackRef} className={styles.track}>
          {BANGALORE_THINNEST_VIDEOS.map((video) => (
            <article key={video.id} className={styles.slide}>
              <LazyGumletEmbed
                embedSrc={gumletEmbedUrl(video.gumletId)}
                title={video.title}
                loadStrategy="visible"
                placeholderLabel="Tap to load video"
                intersectionThreshold={0.25}
              />
            </article>
          ))}
        </div>

        <button
          type="button"
          className={`${styles.control} ${styles.controlPrev}`}
          onClick={movePrev}
          disabled={!canPrev}
          aria-label="Show previous hair system"
        >
          <ChevronLeft />
        </button>
        <button
          type="button"
          className={`${styles.control} ${styles.controlNext}`}
          onClick={moveNext}
          disabled={!canNext}
          aria-label="Show next hair system"
        >
          <ChevronRight />
        </button>
      </div>

      <p className={styles.counter} aria-live="polite">
        {activeIndex + 1} / {BANGALORE_THINNEST_VIDEOS.length}
      </p>
    </section>
  );
}
