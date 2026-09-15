'use client';

import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';
import { useSnapCarousel } from '@/components/carousel/useSnapCarousel';
import { getMediaUrl } from '@/lib/media/cdn';
import { Rich } from '@/components/alchemane/Rich';
import { EXTENSION_WHO_ARIA_LABEL, EXTENSION_WHO_ITEMS } from './content';
import styles from './AlchemaneExtensionWhoSection.module.css';
import { AlchemaneCtaButton } from '@/components/alchemane/AlchemaneCtaButton';

export function AlchemaneExtensionWhoSection({ mediaBase }: { mediaBase: string }) {
  const count = EXTENSION_WHO_ITEMS.length;
  const { scrollRef, activeIndex, canPrev, canNext, scrollPrev, scrollNext, scrollToIndex } = useSnapCarousel({
    itemSelector: ':scope > *',
    itemCount: count,
  });

  return (
    <section className="section section--white" id="who" aria-labelledby="alc-who-title">
      <div className="container">
        <AnimateOnScroll className={styles.head}>
          <h2 className="sectionTitle" id="alc-who-title">Who Is It For?</h2>
          <p className="sectionHint" aria-hidden="true">Swipe through</p>
        </AnimateOnScroll>
      </div>

      <div className="container">
        <div className={styles.carousel} role="group" aria-roledescription="carousel" aria-label={EXTENSION_WHO_ARIA_LABEL}>
          <div ref={scrollRef} className={styles.track}>
            {EXTENSION_WHO_ITEMS.map((item, index) => (
              <article className={styles.card} key={index} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${count}`}>
                <img className={styles.icon} src={getMediaUrl(`${mediaBase}/${item.icon}`)} width={52} height={52} alt="" loading="lazy" />
                <p><Rich text={item.text} /></p>
              </article>
            ))}
          </div>
          <div className={styles.nav}>
            <button type="button" className={styles.control} disabled={!canPrev} aria-label="Previous card" onClick={scrollPrev}>
              <svg aria-hidden="true"><use href="#alc-i-chev-left" /></svg>
            </button>
            <div className={styles.progress} aria-label="Select card">
              {EXTENSION_WHO_ITEMS.map((_, index) => (
                <button key={index} type="button" className={styles.dot} aria-current={index === activeIndex} aria-label={`Go to item ${index + 1} of ${count}`} onClick={() => scrollToIndex(index)} />
              ))}
            </div>
            <p className={styles.status} aria-live="polite">{`${activeIndex + 1} / ${count}`}</p>
            <button type="button" className={styles.control} disabled={!canNext} aria-label="Next card" onClick={scrollNext}>
              <svg aria-hidden="true"><use href="#alc-i-chev-right" /></svg>
            </button>
          </div>
        </div>

        <AnimateOnScroll className={styles.ctaWrap}>
          <AlchemaneCtaButton>Speak to an Expert</AlchemaneCtaButton>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
