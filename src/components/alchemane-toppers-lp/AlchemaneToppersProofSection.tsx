'use client';

import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';
import { MediaImage } from '@/components/media/MediaImage';
import { TOPPERS_AWARD_IMAGE, TOPPERS_PROOF_STATS } from './content';
import styles from './AlchemaneToppersProofSection.module.css';

export function AlchemaneToppersProofSection({ mediaBase }: { mediaBase: string }) {
  return (
    <section className="section section--ink" aria-labelledby="alc-proof-title">
      <div className="container">
        <AnimateOnScroll className={styles.head}>
          <svg className={styles.strand} aria-hidden="true"><use href="#alc-i-strand" /></svg>
          <h2 className={styles.title} id="alc-proof-title">Here&apos;s why we&apos;re the <em>First Choice For Women</em></h2>
        </AnimateOnScroll>

        <AnimateOnScroll>
          <dl className={styles.stats}>
            {TOPPERS_PROOF_STATS.map((stat, index) => (
              <div key={index}>
                <dt>{stat.label}</dt>
                <dd>{stat.value}</dd>
              </div>
            ))}
          </dl>
        </AnimateOnScroll>

        <AnimateOnScroll>
          <figure className={styles.award}>
            <div className={styles.photo}>
              <MediaImage
                src={`${mediaBase}/${TOPPERS_AWARD_IMAGE.src780}`}
                alt={TOPPERS_AWARD_IMAGE.alt}
                width={780}
                height={438}
                sizes="(min-width: 900px) 560px, 92vw"
                className={styles.photoImg}
              />
            </div>
            <figcaption className={styles.caption}>
              <span>Winner of</span>
              <strong>&ldquo;Bharat Innovators</strong>
              <strong>Award&rdquo;</strong>
            </figcaption>
          </figure>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
