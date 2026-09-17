'use client';

import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';
import { useSnapCarousel } from '@/components/carousel/useSnapCarousel';
import { MediaVideo } from '@/components/media/MediaVideo';
import { usePlayableVideo } from '@/components/alchemane/usePlayableVideo';
import { TOPPERS_METHODS, TOPPERS_METHODS_HINT } from './content';
import styles from './AlchemaneToppersMethodsSection.module.css';

function MethodCard({ mediaBase, index, item }: { mediaBase: string; index: number; item: (typeof TOPPERS_METHODS)[number] }) {
  const { playing, handlePlay } = usePlayableVideo();
  return (
    <article className={styles.card} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${TOPPERS_METHODS.length}`}>
      <MediaVideo
        className={styles.frame}
        videoClassName={styles.videoEl}
        posterClassName={styles.poster}
        playClassName={styles.playButton}
        src={`${mediaBase}/${item.video.src}`}
        poster={`${mediaBase}/${item.video.poster}`}
        alt={item.video.ariaLabel}
        label={item.video.ariaLabel}
        playing={playing}
        onPlay={handlePlay}
      />
      <p className={styles.label}>
        <span className={styles.num} aria-hidden="true">{index + 1}</span>
        {item.label}
      </p>
    </article>
  );
}

export function AlchemaneToppersMethodsSection({ mediaBase }: { mediaBase: string }) {
  const count = TOPPERS_METHODS.length;
  const { scrollRef, activeIndex, canPrev, canNext, scrollPrev, scrollNext, scrollToIndex } = useSnapCarousel({
    itemSelector: ':scope > *',
    itemCount: count,
  });

  return (
    <section className="section section--ivory" aria-labelledby="alc-method-title">
      <div className="alcContainer">
        <AnimateOnScroll className={styles.head}>
          <h2 className="sectionTitle" id="alc-method-title">Popular Method of <em>Application</em></h2>
          <p className="sectionHint">{TOPPERS_METHODS_HINT}</p>
        </AnimateOnScroll>
      </div>
      <div className="alcContainer">
        <div className={styles.carousel}>
          <div ref={scrollRef} className={styles.track}>
            {TOPPERS_METHODS.map((item, index) => (
              <MethodCard key={index} mediaBase={mediaBase} index={index} item={item} />
            ))}
          </div>
          <div className="carouselNav">
            <button type="button" className="carouselControl" disabled={!canPrev} aria-label="Previous application" onClick={scrollPrev}>
              <svg aria-hidden="true"><use href="#alc-i-chev-left" /></svg>
            </button>
            <div className="carouselProgress" aria-label="Select application">
              {TOPPERS_METHODS.map((_, index) => (
                <button key={index} type="button" aria-current={index === activeIndex} aria-label={`Go to item ${index + 1} of ${count}`} onClick={() => scrollToIndex(index)} />
              ))}
            </div>
            <p className="carouselStatus" aria-live="polite">{`${activeIndex + 1} / ${count}`}</p>
            <button type="button" className="carouselControl" disabled={!canNext} aria-label="Next application" onClick={scrollNext}>
              <svg aria-hidden="true"><use href="#alc-i-chev-right" /></svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
