'use client';

import { BANGALORE_WHY_CARDS } from './content';
import { useBangaloreCarousel } from './useBangaloreCarousel';
import styles from './BangaloreWhySection.module.css';

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

export function BangaloreWhySection() {
  const { trackRef, activeIndex, canPrev, canNext, movePrev, moveNext, goTo } =
    useBangaloreCarousel({
      itemCount: BANGALORE_WHY_CARDS.length,
      initialIndex: 1,
    });

  return (
    <section className={styles.root} aria-labelledby="bangalore-why-title">
      <h2 id="bangalore-why-title" className={styles.title}>
        Why Men Choose
        <br />
        <span className={styles.titleAccent}>American Hairline</span>
      </h2>

      <div className={styles.carousel} aria-label="Reasons to choose American Hairline">
        <div ref={trackRef} className={styles.track}>
          {BANGALORE_WHY_CARDS.map((card) => (
            <article key={card.id} className={styles.card}>
              <b className={styles.badge}>{card.number}</b>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <p className={styles.copy}>
                {card.parts.map((part, index) =>
                  part.bold ? (
                    <strong key={`${card.id}-${index}`}>{part.text}</strong>
                  ) : (
                    <span key={`${card.id}-${index}`}>{part.text}</span>
                  )
                )}
              </p>
            </article>
          ))}
        </div>

        <button
          type="button"
          className={`${styles.control} ${styles.controlPrev}`}
          onClick={movePrev}
          disabled={!canPrev}
          aria-label="Show previous reason"
        >
          <ChevronLeft />
        </button>
        <button
          type="button"
          className={`${styles.control} ${styles.controlNext}`}
          onClick={moveNext}
          disabled={!canNext}
          aria-label="Show next reason"
        >
          <ChevronRight />
        </button>
      </div>

      <div className={styles.dots} aria-hidden="true">
        {BANGALORE_WHY_CARDS.map((card, index) => (
          <button
            key={card.id}
            type="button"
            className={`${styles.dot} ${activeIndex === index ? styles.dotActive : ''}`}
            onClick={() => goTo(index)}
            aria-label={`Go to reason ${index + 1}`}
            aria-current={activeIndex === index}
          />
        ))}
      </div>
    </section>
  );
}
