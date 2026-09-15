'use client';

import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';
import { Rich } from '@/components/alchemane/Rich';
import { AlchemaneEmbedCard } from '@/components/alchemane/AlchemaneEmbedCard';
import { AlchemaneCtaButton } from '@/components/alchemane/AlchemaneCtaButton';
import { WIGS_CONSULT } from './content';
import styles from './AlchemaneWigsConsultSection.module.css';

export function AlchemaneWigsConsultSection({ mediaBase }: { mediaBase: string }) {
  const { titlePrefix, titleEmphasis, video, willHappenLabel, willHappen, willNotHappenLabel, willNotHappen, optionsLabel, ctaLabel } = WIGS_CONSULT;

  return (
    <section className="section section--mist" aria-labelledby="consult-title">
      <div className="container">
        <AnimateOnScroll className={styles.head}>
          <h2 className="sectionTitle" id="consult-title">{titlePrefix} <em>{titleEmphasis}</em></h2>
        </AnimateOnScroll>
      </div>
      <div className="container">
        <div className={styles.grid}>
          <AnimateOnScroll className={styles.media}>
            <AlchemaneEmbedCard className={styles.frame} video={{ ...video, poster: `${mediaBase}/${video.poster}` }} />
          </AnimateOnScroll>
          <div className={styles.body}>
            <div className={styles.expectGrid}>
              <AnimateOnScroll className={styles.expectBlock}>
                <p className={styles.expectLabel}>{willHappenLabel}</p>
                <ul>
                  {willHappen.map((item, index) => (
                    <li key={index}>
                      <span className="mark markOk"><svg aria-hidden="true"><use href="#alc-i-check" /></svg></span>
                      <span><Rich text={item} /></span>
                    </li>
                  ))}
                </ul>
              </AnimateOnScroll>
              <AnimateOnScroll className={styles.expectBlock}>
                <p className={styles.expectLabel}>{willNotHappenLabel}</p>
                <ul>
                  {willNotHappen.map((item, index) => (
                    <li key={index}>
                      <span className="mark markOk"><svg aria-hidden="true"><use href="#alc-i-check" /></svg></span>
                      <span><Rich text={item} /></span>
                    </li>
                  ))}
                </ul>
              </AnimateOnScroll>
            </div>

            <AnimateOnScroll className={styles.optionsLabel}>
              <p>{optionsLabel}</p>
            </AnimateOnScroll>
            <AnimateOnScroll>
              <div className={styles.options}>
                <article className={styles.option}>
                  <span className={styles.optionIcon}><svg aria-hidden="true"><use href="#alc-i-check" /></svg></span>
                  <div><h3>In-Person</h3><p>At our Bandra branch (Mumbai).</p></div>
                </article>
                <article className={styles.option}>
                  <span className={styles.optionIcon}><svg aria-hidden="true"><use href="#alc-i-check" /></svg></span>
                  <div><h3>Online</h3><p>From your home or from anywhere.</p></div>
                </article>
              </div>
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
