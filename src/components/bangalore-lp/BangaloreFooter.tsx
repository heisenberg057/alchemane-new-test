'use client';

import Link from 'next/link';
import { BangaloreR2Image } from './BangaloreR2Image';
import { BANGALORE_FOOTER } from './content';
import styles from './BangaloreFooter.module.css';

export function BangaloreFooter() {
  return (
    <footer className={styles.root}>
      <BangaloreR2Image
        className={styles.logo}
        src={BANGALORE_FOOTER.logo}
        alt="American Hairline"
        width={424}
        height={167}
        sizes="143px"
      />

      <nav className={styles.nav} aria-label="Legal">
        {BANGALORE_FOOTER.links.map((link) => (
          <Link key={link.href} href={link.href} className={styles.link}>
            {link.label}
          </Link>
        ))}
      </nav>

      <p className={styles.disclaimer}>
        <strong>Disclaimer:</strong> {BANGALORE_FOOTER.disclaimer}
      </p>
      <p className={styles.copyright}>{BANGALORE_FOOTER.copyright}</p>
    </footer>
  );
}
