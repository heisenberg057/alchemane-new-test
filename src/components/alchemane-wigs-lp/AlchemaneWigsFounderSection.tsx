'use client';

import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';
import { MediaImage } from '@/components/media/MediaImage';
import { AlchemaneCtaButton } from '@/components/alchemane/AlchemaneCtaButton';
import { Rich } from '@/components/alchemane/Rich';
import { WIGS_FOUNDER } from './content';
import styles from './AlchemaneWigsFounderSection.module.css';

export function AlchemaneWigsFounderSection({ mediaBase }: { mediaBase: string }) {
  return (
    <section className="section section--ivory" aria-labelledby="alc-vinitt-title">
      <div className={`container ${styles.grid}`}>
        <AnimateOnScroll className={styles.media}>
          <figure className={styles.photo}>
            <MediaImage
              src={`${mediaBase}/${WIGS_FOUNDER.photo.src}`}
              alt={WIGS_FOUNDER.photo.alt}
              width={WIGS_FOUNDER.photo.width}
              height={WIGS_FOUNDER.photo.height}
              className={styles.photoImg}
            />
          </figure>
        </AnimateOnScroll>
        <AnimateOnScroll className={styles.body}>
          <p className="kicker">Founder</p>
          <h2 className={styles.title} id="alc-vinitt-title">The Expert Behind Alchemane: <em>Meet Vinitt</em></h2>
          <ul className={styles.credentials}>
            {WIGS_FOUNDER.credentials.map((line, index) => (
              <li key={index}><Rich text={line} /></li>
            ))}
          </ul>
          <AlchemaneCtaButton>{WIGS_FOUNDER.ctaLabel}</AlchemaneCtaButton>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
