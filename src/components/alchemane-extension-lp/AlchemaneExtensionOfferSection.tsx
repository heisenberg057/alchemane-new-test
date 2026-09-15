'use client';

import type { RefObject } from 'react';
import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';
import { useCountdown } from '@/components/alchemane/useCountdown';
import { AlchemaneCtaButton } from '@/components/alchemane/AlchemaneCtaButton';
import styles from './AlchemaneExtensionOfferSection.module.css';

export function AlchemaneExtensionOfferSection({ offerRef }: { offerRef?: RefObject<HTMLElement> }) {
  const { hours, minutes, seconds } = useCountdown();

  return (
    <section className="section section--mist" id="consultation" aria-labelledby="alc-offer-title" ref={offerRef}>
      <div className="container">
        <AnimateOnScroll>
          <h2 className="sectionTitle" id="alc-offer-title">Let&apos;s Start with a <em>Consultation</em></h2>
        </AnimateOnScroll>

        <AnimateOnScroll className={styles.panel}>
          <p className={styles.eyebrow}>Limited time offer</p>
          <p className={styles.quote}>Book now before it&apos;s gone — slots reset every 24 hours.</p>
          <div className={styles.countdown} role="timer" aria-live="off">
            <div className={styles.unit}><b>{hours}</b><span>Hours</span></div>
            <span className={styles.sep} aria-hidden="true">:</span>
            <div className={styles.unit}><b>{minutes}</b><span>Minutes</span></div>
            <span className={styles.sep} aria-hidden="true">:</span>
            <div className={styles.unit}><b>{seconds}</b><span>Seconds</span></div>
          </div>
          <p className={styles.slotsLeft}>Only 24 consultation slots left</p>
          <AlchemaneCtaButton className="cta ctaWide">Book A Consultation Now</AlchemaneCtaButton>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
