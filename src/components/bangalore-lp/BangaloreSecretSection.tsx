'use client';

import { LazyGumletEmbed } from '@/components/video/LazyGumletEmbed';
import { gumletEmbedUrl } from '@/lib/media/cdn';
import { BangaloreR2Image } from './BangaloreR2Image';
import {
  BANGALORE_SECRET_BULLETS,
  BANGALORE_SECRET_COMPARISON,
  BANGALORE_SECRET_VIDEOS,
} from './content';
import { useBangaloreCarousel } from './useBangaloreCarousel';
import styles from './BangaloreSecretSection.module.css';

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

export function BangaloreSecretSection() {
  const { trackRef, activeIndex, canPrev, canNext, movePrev, moveNext, goTo } =
    useBangaloreCarousel({ itemCount: BANGALORE_SECRET_VIDEOS.length });

  return (
    <section className={styles.root} aria-labelledby="bangalore-secret-title">
      <h2 id="bangalore-secret-title" className={styles.title}>
        The Secret Behind Our
        <br />
        <span className={styles.titleAccent}>Natural Hairline</span>
      </h2>

      <div className={styles.carousel} aria-label="Natural hairline videos">
        <div ref={trackRef} className={styles.track}>
          {BANGALORE_SECRET_VIDEOS.map((video) => (
            <article key={video.id} className={styles.videoCard}>
              <LazyGumletEmbed
                embedSrc={gumletEmbedUrl(video.gumletId)}
                title={video.title}
                loadStrategy="visible"
                placeholderLabel="Tap to load video"
              />
            </article>
          ))}
        </div>

        <button
          type="button"
          className={`${styles.control} ${styles.controlPrev}`}
          onClick={movePrev}
          disabled={!canPrev}
          aria-label="Show previous natural hairline video"
        >
          <ChevronLeft />
        </button>
        <button
          type="button"
          className={`${styles.control} ${styles.controlNext}`}
          onClick={moveNext}
          disabled={!canNext}
          aria-label="Show next natural hairline video"
        >
          <ChevronRight />
        </button>
      </div>

      <div className={styles.dots} aria-hidden="true">
        {BANGALORE_SECRET_VIDEOS.map((video, index) => (
          <button
            key={video.id}
            type="button"
            className={`${styles.dot} ${activeIndex === index ? styles.dotActive : ''}`}
            onClick={() => goTo(index)}
            aria-label={`Go to natural hairline video ${index + 1}`}
            aria-current={activeIndex === index}
          />
        ))}
      </div>

      <ul className={styles.bullets}>
        {BANGALORE_SECRET_BULLETS.map((parts, bulletIndex) => (
          <li key={`secret-bullet-${bulletIndex}`} className={styles.bullet}>
            {parts.map((part, partIndex) =>
              part.bold ? (
                <strong key={`${bulletIndex}-${partIndex}`}>{part.text}</strong>
              ) : (
                <span key={`${bulletIndex}-${partIndex}`}>{part.text}</span>
              )
            )}
          </li>
        ))}
      </ul>

      <div className={styles.comparison}>
        <BangaloreR2Image
          className={styles.comparisonImage}
          src={BANGALORE_SECRET_COMPARISON.src}
          srcMobile={BANGALORE_SECRET_COMPARISON.srcMobile}
          alt={BANGALORE_SECRET_COMPARISON.alt}
          fill
          sizes="(max-width: 450px) 100vw, 390px"
        />
      </div>
    </section>
  );
}
