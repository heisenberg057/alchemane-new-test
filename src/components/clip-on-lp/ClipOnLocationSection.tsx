'use client';

import { ClipOnStill } from './ClipOnStill';
import { CLIP_ON_LOCATION_ADDRESS, CLIP_ON_LOCATION_IMAGES } from './content';
import { useClipOnCarousel } from './useClipOnCarousel';
import styles from './ClipOnLocationSection.module.css';

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

export function ClipOnLocationSection() {
  const { trackRef, activeIndex, canPrev, canNext, movePrev, moveNext, goTo } =
    useClipOnCarousel({ itemCount: CLIP_ON_LOCATION_IMAGES.length });

  return (
    <section className={styles.root} aria-labelledby="clip-on-location-title">
      <h2 id="clip-on-location-title" className={styles.title}>
        Our Location
      </h2>

      <div className={styles.carousel} aria-label="Clinic photos">
        <div ref={trackRef} className={styles.track}>
          {CLIP_ON_LOCATION_IMAGES.map((image, index) => (
            <div key={image.id} className={styles.slide}>
              <ClipOnStill
                className={styles.image}
                src={image.src}
                srcMobile={image.srcMobile}
                alt={image.alt}
                fill
                sizes="338px"
                priority={index === 0}
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          className={`${styles.control} ${styles.controlPrev}`}
          onClick={movePrev}
          disabled={!canPrev}
          aria-label="Show previous clinic photo"
        >
          <ChevronLeft />
        </button>
        <button
          type="button"
          className={`${styles.control} ${styles.controlNext}`}
          onClick={moveNext}
          disabled={!canNext}
          aria-label="Show next clinic photo"
        >
          <ChevronRight />
        </button>
      </div>

      <div className={styles.dots} role="tablist" aria-label="Select clinic photo">
        {CLIP_ON_LOCATION_IMAGES.map((image, index) => (
          <button
            key={image.id}
            type="button"
            className={`${styles.dot} ${activeIndex === index ? styles.dotActive : ''}`}
            onClick={() => goTo(index)}
            aria-label={`Show clinic photo ${index + 1}`}
            aria-current={activeIndex === index}
          />
        ))}
      </div>

      <address className={styles.address}>
        <strong className={styles.addressLabel}>Address:</strong>
        <br />
        {CLIP_ON_LOCATION_ADDRESS}
      </address>
      <p className={styles.hours}>
        Visits by appointment · Timing confirmed by our CRM team after form submission.
      </p>
    </section>
  );
}
