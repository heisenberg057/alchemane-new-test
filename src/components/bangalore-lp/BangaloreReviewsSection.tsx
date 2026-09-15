'use client';

import { BangaloreR2Image } from './BangaloreR2Image';
import { BANGALORE_REVIEWS, BANGALORE_REVIEWS_TRUST } from './content';
import { useBangaloreCarousel } from './useBangaloreCarousel';
import styles from './BangaloreReviewsSection.module.css';

export function BangaloreReviewsSection() {
  const { trackRef, activeIndex, goTo } = useBangaloreCarousel({
    itemCount: BANGALORE_REVIEWS.length,
  });

  return (
    <section className={styles.root} aria-labelledby="bangalore-reviews-title">
      <div className={styles.glass}>
        <h2 id="bangalore-reviews-title" className={styles.title}>
          Client Stories
        </h2>
        <p className={styles.lead}>Men who switched from transplant to hair systems.</p>

        <div className={styles.carousel} aria-label="Client reviews">
          <div ref={trackRef} className={styles.track}>
            {BANGALORE_REVIEWS.map((review) => (
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
          {BANGALORE_REVIEWS.map((review, index) => (
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
          <strong className={styles.trustLead}>{BANGALORE_REVIEWS_TRUST.lead}</strong>
          {BANGALORE_REVIEWS_TRUST.items.map((item) => (
            <span key={item.id} className={styles.trustItem}>
              <BangaloreR2Image
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
