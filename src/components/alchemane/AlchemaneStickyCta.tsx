'use client';

import { useCountdown } from './useCountdown';
import { AlchemaneCtaButton } from './AlchemaneCtaButton';
import styles from './AlchemaneStickyCta.module.css';

export function AlchemaneStickyCta({ hidden }: { hidden: boolean }) {
  const { hours, minutes, seconds } = useCountdown();

  return (
    <div className={styles.root} data-hidden={hidden ? 'true' : 'false'}>
      <div className={styles.offer}>
        <span className={styles.badge}>Limited Time Offer</span>
        <div className={styles.countdown}>
          <div className={styles.unit}><b>{hours}</b><span>Hours</span></div>
          <span className={styles.dots} aria-hidden="true">:</span>
          <div className={styles.unit}><b>{minutes}</b><span>Minutes</span></div>
          <span className={styles.dots} aria-hidden="true">:</span>
          <div className={styles.unit}><b>{seconds}</b><span>Seconds</span></div>
        </div>
      </div>
      <AlchemaneCtaButton className={styles.book}>Book Now</AlchemaneCtaButton>
    </div>
  );
}
