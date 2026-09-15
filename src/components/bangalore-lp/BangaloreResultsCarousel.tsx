'use client';

import { MediaImage } from '@/components/media/MediaImage';
import { BANGALORE_RESULTS } from './content';
import { useBangaloreCarousel } from './useBangaloreCarousel';
import styles from './BangaloreResultsCarousel.module.css';

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

export function BangaloreResultsCarousel() {
  const { trackRef, activeIndex, canPrev, canNext, movePrev, moveNext, goTo } =
    useBangaloreCarousel({ itemCount: BANGALORE_RESULTS.length });

  return (
    <section className={styles.root} aria-labelledby="bangalore-results-title">
      <h2 id="bangalore-results-title" className={styles.title}>
        Confidence Restored
        <br />
        <span className={styles.titleAccent}>Real Stories, Real Results</span>
      </h2>

      <div
        className={styles.carousel}
        aria-label="Client before and after transformations"
      >
        <div ref={trackRef} className={styles.track}>
          {BANGALORE_RESULTS.map((slide, index) => (
            <article key={slide.id} className={styles.card}>
              <MediaImage
                className={styles.image}
                src={slide.src}
                alt={slide.alt}
                fill
                sizes="(max-width: 389px) 280px, 320px"
                quality={75}
                priority={index === 0}
              />
            </article>
          ))}
        </div>

        <button
          type="button"
          className={`${styles.control} ${styles.controlPrev}`}
          onClick={movePrev}
          disabled={!canPrev}
          aria-label="Show previous transformation"
        >
          <ChevronLeft />
        </button>
        <button
          type="button"
          className={`${styles.control} ${styles.controlNext}`}
          onClick={moveNext}
          disabled={!canNext}
          aria-label="Show next transformation"
        >
          <ChevronRight />
        </button>
      </div>

      <div className={styles.dots} aria-hidden="true">
        {BANGALORE_RESULTS.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            className={`${styles.dot} ${activeIndex === index ? styles.dotActive : ''}`}
            onClick={() => goTo(index)}
            aria-label={`Go to transformation ${index + 1}`}
            aria-current={activeIndex === index}
          />
        ))}
      </div>
    </section>
  );
}
