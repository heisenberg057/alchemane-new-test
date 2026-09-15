'use client';

import { useFunnelBooking } from '@/components/funnel/FunnelBookingProvider';
import { BangaloreR2Image } from './BangaloreR2Image';
import { BANGALORE_FIT_CARDS } from './content';
import { useBangaloreCarousel } from './useBangaloreCarousel';
import styles from './BangaloreFitSection.module.css';

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

export function BangaloreFitSection() {
  const { openBooking } = useFunnelBooking();
  const { trackRef, activeIndex, canPrev, canNext, movePrev, moveNext, goTo } =
    useBangaloreCarousel({
      itemCount: BANGALORE_FIT_CARDS.length,
      initialIndex: 1,
    });

  return (
    <section className={styles.root} aria-labelledby="bangalore-fit-title">
      <h2 id="bangalore-fit-title" className={styles.title}>
        This Is For You If...
      </h2>

      <div className={styles.carousel} aria-label="Reasons this solution may fit you">
        <div ref={trackRef} className={styles.track}>
          {BANGALORE_FIT_CARDS.map((card) => (
            <article key={card.id} className={styles.card}>
              <BangaloreR2Image
                className={styles.icon}
                src={card.icon}
                alt=""
                width={52}
                height={52}
                aria-hidden
              />
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
        {BANGALORE_FIT_CARDS.map((card, index) => (
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

      <a
        className={styles.cta}
        href="#contact-form"
        onClick={(event) => {
          event.preventDefault();
          openBooking();
        }}
      >
        Start Your Hair Journey
      </a>
      <p className={styles.ctaNote}>
        Paid consultation · Fee shared after form submission · 30–45 min · In-person or online
      </p>
    </section>
  );
}
