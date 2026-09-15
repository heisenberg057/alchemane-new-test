'use client';

import { ClipOnStill } from './ClipOnStill';
import { CLIP_ON_RESULTS } from './content';
import { useClipOnCarousel } from './useClipOnCarousel';
import styles from './ClipOnResultsCarousel.module.css';

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

export function ClipOnResultsCarousel() {
  const { trackRef, activeIndex, canPrev, canNext, movePrev, moveNext, goTo } =
    useClipOnCarousel({ itemCount: CLIP_ON_RESULTS.length });

  return (
    <section className={styles.root} aria-labelledby="clip-on-results-title">
      <h2 id="clip-on-results-title" className={styles.title}>
        Confidence Restored
        <br />
        <span className={styles.titleAccent}>Real Stories, Real Results</span>
      </h2>

      <div
        className={styles.carousel}
        aria-label="Client before and after transformations"
      >
        <div ref={trackRef} className={styles.track}>
          {CLIP_ON_RESULTS.map((slide, index) => (
            <article key={slide.id} className={styles.card}>
              <ClipOnStill
                className={styles.image}
                src={slide.src}
                srcMobile={slide.srcMobile}
                alt={slide.alt}
                fill
                sizes="(max-width: 389px) 280px, 320px"
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
        {CLIP_ON_RESULTS.map((slide, index) => (
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
