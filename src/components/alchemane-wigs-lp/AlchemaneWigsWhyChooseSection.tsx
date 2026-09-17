'use client';

import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';
import { AlchemaneEmbedCard } from '@/components/alchemane/AlchemaneEmbedCard';
import { AlchemaneCtaButton } from '@/components/alchemane/AlchemaneCtaButton';
import { WIGS_WHY_CHOOSE } from './content';
import styles from './AlchemaneWigsWhyChooseSection.module.css';

export function AlchemaneWigsWhyChooseSection({ mediaBase }: { mediaBase: string }) {
  const { titlePrefix, titleEmphasis, video, benefits, ctaLabel } = WIGS_WHY_CHOOSE;

  return (
    <section className="section section--ivory" aria-labelledby="why-choose-title">
      <div className="alcContainer">
        <AnimateOnScroll className={styles.head}>
          <h2 className="sectionTitle" id="why-choose-title">{titlePrefix} <em>{titleEmphasis}</em></h2>
        </AnimateOnScroll>

        <div className={styles.grid}>
          <AnimateOnScroll className={styles.media}>
            <AlchemaneEmbedCard className={styles.frame} video={{ ...video, poster: `${mediaBase}/${video.poster}` }} />
          </AnimateOnScroll>
          <div className={styles.body}>
            <AnimateOnScroll>
              <ol className={styles.benefits}>
                {benefits.map((benefit, index) => (
                  <li key={index}>
                    <span className={styles.num} aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                    <span className={styles.text}><strong>{benefit.strong}</strong> — {benefit.text}</span>
                  </li>
                ))}
              </ol>
            </AnimateOnScroll>
            <AnimateOnScroll className={styles.ctaWrap}>
              <AlchemaneCtaButton>{ctaLabel}</AlchemaneCtaButton>
            </AnimateOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}
