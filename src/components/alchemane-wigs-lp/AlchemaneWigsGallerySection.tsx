'use client';

import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';
import { useSnapCarousel } from '@/components/carousel/useSnapCarousel';
import { AlchemaneEmbedCard } from '@/components/alchemane/AlchemaneEmbedCard';
import { WIGS_GALLERY_CLIPS } from './content';
import styles from './AlchemaneWigsGallerySection.module.css';

export function AlchemaneWigsGallerySection({ mediaBase }: { mediaBase: string }) {
  const count = WIGS_GALLERY_CLIPS.length;
  const { scrollRef, activeIndex, canPrev, canNext, scrollPrev, scrollNext, scrollToIndex } = useSnapCarousel({
    itemSelector: ':scope > *',
    itemCount: count,
  });

  return (
    <section className="section section--ivory" aria-labelledby="natural-title">
      <div className="alcContainer">
        <AnimateOnScroll className={styles.head}>
          <h2 className="sectionTitle" id="natural-title">Do They Look Natural? <em>Watch &amp; Decide</em></h2>
          <p className="sectionHint">Real clients, unedited</p>
        </AnimateOnScroll>
      </div>
      <div className="alcContainer">
        <div className={styles.carousel}>
          <div ref={scrollRef} className={styles.track}>
            {WIGS_GALLERY_CLIPS.map((video, index) => (
              <article className={styles.card} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${count}`} key={index}>
                <span className={styles.index} aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <AlchemaneEmbedCard className={styles.frame} video={{ ...video, poster: `${mediaBase}/${video.poster}` }} />
              </article>
            ))}
          </div>
          <div className="carouselNav">
            <button type="button" className="carouselControl" disabled={!canPrev} aria-label="Previous client story" onClick={scrollPrev}>
              <svg aria-hidden="true"><use href="#alc-i-chev-left" /></svg>
            </button>
            <div className="carouselProgress" aria-label="Select client story">
              {WIGS_GALLERY_CLIPS.map((_, index) => (
                <button key={index} type="button" aria-current={index === activeIndex} aria-label={`Go to item ${index + 1} of ${count}`} onClick={() => scrollToIndex(index)} />
              ))}
            </div>
            <p className="carouselStatus" aria-live="polite">{`${activeIndex + 1} / ${count}`}</p>
            <button type="button" className="carouselControl" disabled={!canNext} aria-label="Next client story" onClick={scrollNext}>
              <svg aria-hidden="true"><use href="#alc-i-chev-right" /></svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
