'use client';

import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';
import { MediaImage } from '@/components/media/MediaImage';
import { Rich } from '@/components/alchemane/Rich';
import { WIGS_REAL } from './content';
import styles from './AlchemaneWigsRealSection.module.css';

export function AlchemaneWigsRealSection({ mediaBase }: { mediaBase: string }) {
  return (
    <section className="section section--ivory" aria-labelledby="real-title">
      <div className="container">
        <AnimateOnScroll className={styles.head}>
          <h2 className="sectionTitle" id="real-title">{WIGS_REAL.titlePrefix} <em>{WIGS_REAL.titleEmphasis}</em></h2>
        </AnimateOnScroll>

        <div className={styles.grid}>
          <AnimateOnScroll className={styles.media}>
            <figure className={styles.photo}>
              <MediaImage
                src={`${mediaBase}/${WIGS_REAL.photo.src}`}
                alt={WIGS_REAL.photo.alt}
                width={WIGS_REAL.photo.width}
                height={WIGS_REAL.photo.height}
                className={styles.photoImg}
              />
            </figure>
          </AnimateOnScroll>
          <div className={styles.body}>
            <AnimateOnScroll>
              <ul className={styles.checklist}>
                {WIGS_REAL.checklist.map((item, index) => (
                  <li key={index}>
                    <span className="mark markOk"><svg aria-hidden="true"><use href="#alc-i-check" /></svg></span>
                    <span><Rich text={item} /></span>
                  </li>
                ))}
              </ul>
            </AnimateOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}
