import type { RefObject } from 'react';
import { MediaImage } from '@/components/media/MediaImage';
import styles from './AlchemaneFooter.module.css';

export function AlchemaneFooter({
  mediaBase,
  footerRef,
}: {
  mediaBase: string;
  footerRef?: RefObject<HTMLElement>;
}) {
  return (
    <footer className={styles.root} ref={footerRef}>
      <div className={`container ${styles.inner}`}>
        <MediaImage
          src={`${mediaBase}/images/alchemane-logo-780.webp`}
          alt="Alchemane Hair Extensions"
          width={1035}
          height={239}
          className={styles.logo}
        />
        <nav className={styles.nav} aria-label="Legal">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </nav>
        <p className={styles.disclaimer}>
          <strong>Disclaimer:</strong> Results may vary from individual to individual depending on factors such as
          hair type, scalp condition, medical background, lifestyle and aftercare. No specific result should be
          construed as typical.
        </p>
        <p className={styles.copy}>Alchemane Hair Extensions © 2026 – All Rights Reserved.</p>
      </div>
    </footer>
  );
}
