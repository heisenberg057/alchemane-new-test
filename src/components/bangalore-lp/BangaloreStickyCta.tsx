'use client';

import { useFunnelBooking } from '@/components/funnel/FunnelBookingProvider';
import styles from './BangaloreStickyCta.module.css';

export function BangaloreStickyCta() {
  const { openBooking } = useFunnelBooking();

  return (
    <aside className={styles.root} aria-label="Trusted client booking action">
      <div className={styles.trust}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M12 1.5 22 5v6.5c0 6.1-4.2 10.4-10 12-5.8-1.6-10-5.9-10-12V5z"
            fill="#ccd6dd"
          />
          <path
            d="M12 3.6 20 6.3v5.2c0 4.9-3.2 8.4-8 9.8-4.8-1.4-8-4.9-8-9.8V6.3z"
            fill="#55acee"
          />
          <path d="M12 3.6 20 6.3v5.2c0 4.9-3.2 8.4-8 9.8z" fill="#226699" />
        </svg>
        <span className={styles.trustText}>
          <strong className={styles.trustStrong}>Trusted by 6,770+ clients</strong>
          <small className={styles.trustSmall}>Across 12 countries</small>
        </span>
      </div>
      <a
        className={styles.cta}
        href="#contact-form"
        onClick={(event) => {
          event.preventDefault();
          openBooking();
        }}
      >
        Book Now
      </a>
    </aside>
  );
}
