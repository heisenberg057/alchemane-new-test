'use client';

import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';
import { useSnapCarousel } from '@/components/carousel/useSnapCarousel';
import { MediaImage } from '@/components/media/MediaImage';
import { WIGS_TYPES } from './content';
import styles from './AlchemaneWigsTypesSection.module.css';

export function AlchemaneWigsTypesSection({ mediaBase }: { mediaBase: string }) {
  const count = WIGS_TYPES.items.length;
  const { scrollRef, activeIndex, canPrev, canNext, scrollPrev, scrollNext, scrollToIndex } = useSnapCarousel({
    itemSelector: ':scope > *',
    itemCount: count,
  });

  return (
    <section className="section section--ivory" aria-labelledby="wig-types-title">
      <div className="container">
        <AnimateOnScroll className={styles.head}>
          <h2 className="sectionTitle" id="wig-types-title">{WIGS_TYPES.titlePrefix} <em>{WIGS_TYPES.titleEmphasis}</em></h2>
          <p className="sectionLead">{WIGS_TYPES.lead}</p>
        </AnimateOnScroll>
      </div>
      <div className="container">
        <div className={styles.carousel}>
          <div ref={scrollRef} className={styles.track}>
            {WIGS_TYPES.items.map((item, index) => (
              <article className={styles.card} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${count}`} key={index}>
                <div className={`${styles.frame}${!item.photo ? ` ${styles.frameEmpty}` : ''}`}>
                  {item.photo ? (
                    <MediaImage
                      src={`${mediaBase}/${item.photo.src}`}
                      alt={item.photo.alt}
                      width={item.photo.width}
                      height={item.photo.height}
                      className={styles.frameImg}
                    />
                  ) : (
                    <span className={styles.comingSoon}>Coming soon</span>
                  )}
                </div>
                <p className={styles.label}>
                  <span className={styles.num} aria-hidden="true">{index + 1}</span>
                  {item.label}
                </p>
              </article>
            ))}
          </div>
          <div className="carouselNav">
            <button type="button" className="carouselControl" disabled={!canPrev} aria-label="Previous wig type" onClick={scrollPrev}>
              <svg aria-hidden="true"><use href="#alc-i-chev-left" /></svg>
            </button>
            <div className="carouselProgress" aria-label="Select wig type">
              {WIGS_TYPES.items.map((_, index) => (
                <button key={index} type="button" aria-current={index === activeIndex} aria-label={`Go to item ${index + 1} of ${count}`} onClick={() => scrollToIndex(index)} />
              ))}
            </div>
            <p className="carouselStatus" aria-live="polite">{`${activeIndex + 1} / ${count}`}</p>
            <button type="button" className="carouselControl" disabled={!canNext} aria-label="Next wig type" onClick={scrollNext}>
              <svg aria-hidden="true"><use href="#alc-i-chev-right" /></svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
