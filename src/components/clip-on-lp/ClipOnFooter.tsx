'use client';

import Link from 'next/link';
import { ClipOnStill } from './ClipOnStill';
import { CLIP_ON_FOOTER } from './content';
import styles from './ClipOnFooter.module.css';

export function ClipOnFooter() {
  return (
    <footer className={styles.root}>
      <ClipOnStill
        className={styles.logo}
        src={CLIP_ON_FOOTER.logo}
        srcMobile={CLIP_ON_FOOTER.logoMobile}
        alt="American Hairline"
        width={424}
        height={167}
        sizes="143px"
      />

      <nav className={styles.nav} aria-label="Legal">
        {CLIP_ON_FOOTER.links.map((link) => (
          <Link key={link.href} href={link.href} className={styles.link}>
            {link.label}
          </Link>
        ))}
      </nav>

      <p className={styles.disclaimer}>
        <strong>Disclaimer:</strong> {CLIP_ON_FOOTER.disclaimer}
      </p>
      <p className={styles.copyright}>{CLIP_ON_FOOTER.copyright}</p>
    </footer>
  );
}
