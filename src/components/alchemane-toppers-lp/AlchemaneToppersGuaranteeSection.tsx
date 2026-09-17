'use client';

import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';
import { MediaImage } from '@/components/media/MediaImage';
import styles from './AlchemaneToppersGuaranteeSection.module.css';
import { AlchemaneCtaButton } from '@/components/alchemane/AlchemaneCtaButton';

export function AlchemaneToppersGuaranteeSection({ mediaBase }: { mediaBase: string }) {
  return (
    <section className="section section--white" aria-labelledby="alc-guarantee-title">
      <div className={`alcContainer ${styles.grid}`}>
        <AnimateOnScroll className={styles.badgeWrap}>
          <MediaImage
            src={`${mediaBase}/images/money-back-badge-390.webp`}
            alt="100% money back guarantee"
            width={920}
            height={920}
            className={styles.badge}
          />
        </AnimateOnScroll>
        <AnimateOnScroll className={styles.body}>
          <h2 className={styles.title} id="alc-guarantee-title">
            100% Consultation Fee<span className={styles.scope}>Back Guarantee</span>
          </h2>
          <p className="sectionLead">
            If your consultation doesn&apos;t feel <strong>genuine or valuable</strong>, we&apos;ll refund the full
            consultation fee — no questions asked.
          </p>
          <p className={styles.promise}>We Promise!<span>— no questions asked.</span></p>
          <p className={styles.trust}>Trusted by <strong>6,700+</strong> Clients Across 12 Countries</p>
          <AlchemaneCtaButton>Book A Consultation Now</AlchemaneCtaButton>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
