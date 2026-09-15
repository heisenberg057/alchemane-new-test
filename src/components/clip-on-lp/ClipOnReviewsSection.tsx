'use client';

import { ClipOnStill } from './ClipOnStill';
import { CLIP_ON_REVIEWS, CLIP_ON_REVIEWS_TRUST } from './content';
import { useClipOnCarousel } from './useClipOnCarousel';
import styles from './ClipOnReviewsSection.module.css';

export function ClipOnReviewsSection() {
  const { trackRef, activeIndex, goTo } = useClipOnCarousel({
    itemCount: CLIP_ON_REVIEWS.length,
  });

  return (
    <section className={styles.root} aria-labelledby="clip-on-reviews-title">
      <div className={styles.glass}>
        <h2 id="clip-on-reviews-title" className={styles.title}>
          What Our Clients Say
        </h2>
        <p className={styles.lead}>Honest feedback from those who made the change.</p>

        <div className={styles.carousel} aria-label="Client reviews">
          <div ref={trackRef} className={styles.track}>
            {CLIP_ON_REVIEWS.map((review) => (
              <blockquote key={review.id} className={styles.card}>
                <p className={styles.quote}>“{review.quote}”</p>
                <span className={styles.stars} aria-label="5 out of 5 stars">
                  ★★★★★
                </span>
                <footer className={styles.meta}>
                  <span className={styles.avatar} aria-hidden="true">
                    {review.initials}
                  </span>
                  <span className={styles.metaText}>
                    <strong className={styles.name}>{review.name}</strong>
                    <small className={styles.when}>{review.when}</small>
                  </span>
                </footer>
              </blockquote>
            ))}
          </div>
        </div>

        <div className={styles.dots} aria-hidden="true">
          {CLIP_ON_REVIEWS.map((review, index) => (
            <button
              key={review.id}
              type="button"
              className={`${styles.dot} ${activeIndex === index ? styles.dotActive : ''}`}
              onClick={() => goTo(index)}
              aria-label={`Go to review ${index + 1}`}
              aria-current={activeIndex === index}
            />
          ))}
        </div>

        <div className={styles.trust}>
          <strong className={styles.trustLead}>{CLIP_ON_REVIEWS_TRUST.lead}</strong>
          {CLIP_ON_REVIEWS_TRUST.items.map((item) => (
            <span key={item.id} className={styles.trustItem}>
              <ClipOnStill
                className={styles.trustIcon}
                src={item.icon}
                alt=""
                width={item.width}
                height={item.height}
                aria-hidden
              />
              {item.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
