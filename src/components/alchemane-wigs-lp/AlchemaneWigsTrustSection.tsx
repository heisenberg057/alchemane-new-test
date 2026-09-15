'use client';

import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';
import { useSnapCarousel } from '@/components/carousel/useSnapCarousel';
import { AlchemaneEmbedCard } from '@/components/alchemane/AlchemaneEmbedCard';
import { AlchemaneCtaButton } from '@/components/alchemane/AlchemaneCtaButton';
import { WIGS_TRUST } from './content';
import styles from './AlchemaneWigsTrustSection.module.css';

export function AlchemaneWigsTrustSection({ mediaBase }: { mediaBase: string }) {
  const count = WIGS_TRUST.celebs.length;
  const { scrollRef, activeIndex, canPrev, canNext, scrollPrev, scrollNext, scrollToIndex } = useSnapCarousel({
    itemSelector: ':scope > *',
    itemCount: count,
  });

  return (
    <section className="section section--white" aria-labelledby="trust-title">
      <div className="container">
        <AnimateOnScroll className={styles.head}>
          <h2 className="sectionTitle" id="trust-title">{WIGS_TRUST.title}</h2>
          <p className="sectionLead">{WIGS_TRUST.lead}</p>
        </AnimateOnScroll>

        <div className={styles.grid}>
          <AnimateOnScroll className={styles.card}>
            <span className={styles.icon}><svg aria-hidden="true"><use href="#alc-i-star" /></svg></span>
            <p className="kicker">{WIGS_TRUST.celebKicker}</p>
            <h3>{WIGS_TRUST.celebTitlePrefix} <em>{WIGS_TRUST.celebTitleEmphasis}</em></h3>

            <div className={styles.carousel}>
              <div ref={scrollRef} className={styles.track}>
                {WIGS_TRUST.celebs.map((celeb, index) => (
                  <article className={styles.reel} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${count}`} key={index}>
                    <AlchemaneEmbedCard
                      className={styles.reelFrame}
                      video={{ ...celeb.video, poster: `${mediaBase}/${celeb.video.poster}` }}
                    />
                  </article>
                ))}
              </div>
              <div className="carouselNav">
                <button type="button" className="carouselControl" disabled={!canPrev} aria-label="Previous celebrity client" onClick={scrollPrev}>
                  <svg aria-hidden="true"><use href="#alc-i-chev-left" /></svg>
                </button>
                <div className="carouselProgress" aria-label="Select celebrity client">
                  {WIGS_TRUST.celebs.map((_, index) => (
                    <button key={index} type="button" aria-current={index === activeIndex} aria-label={`Go to item ${index + 1} of ${count}`} onClick={() => scrollToIndex(index)} />
                  ))}
                </div>
                <p className="carouselStatus" aria-live="polite">{`${activeIndex + 1} / ${count}`}</p>
                <button type="button" className="carouselControl" disabled={!canNext} aria-label="Next celebrity client" onClick={scrollNext}>
                  <svg aria-hidden="true"><use href="#alc-i-chev-right" /></svg>
                </button>
              </div>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll className={styles.card}>
            <span className={styles.icon}><svg aria-hidden="true"><use href="#alc-i-shield-brand" /></svg></span>
            <p className="kicker">{WIGS_TRUST.medicalKicker}</p>
            <h3>{WIGS_TRUST.medicalTitlePrefix} <em>{WIGS_TRUST.medicalTitleEmphasis}</em></h3>
            <ul className={styles.hospitals}>
              {WIGS_TRUST.hospitals.map((hospital) => (
                <li key={hospital}>
                  <span className={styles.hospitalIcon}><svg aria-hidden="true"><use href="#alc-i-building" /></svg></span>
                  {hospital}
                </li>
              ))}
            </ul>
            <p className={styles.note}>{WIGS_TRUST.medicalNote}</p>
          </AnimateOnScroll>
        </div>

        <AnimateOnScroll className={styles.closing}>
          <p>{WIGS_TRUST.closingPrefix} <em>{WIGS_TRUST.closingEmphasis}</em></p>
        </AnimateOnScroll>

        <AnimateOnScroll className={styles.ctaWrap}>
          <AlchemaneCtaButton>{WIGS_TRUST.ctaLabel}</AlchemaneCtaButton>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
