'use client';

import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';
import { Rich } from '@/components/alchemane/Rich';
import { WIGS_WHO_FOR } from './content';
import styles from './AlchemaneWigsWhoForSection.module.css';

export function AlchemaneWigsWhoForSection() {
  return (
    <section className="section section--white" aria-labelledby="who-title">
      <div className="container">
        <AnimateOnScroll className={styles.head}>
          <h2 className="sectionTitle" id="who-title">{WIGS_WHO_FOR.title}</h2>
        </AnimateOnScroll>

        <AnimateOnScroll className={styles.who}>
          <p className={styles.label}>{WIGS_WHO_FOR.label}</p>
          <ul className={styles.list}>
            {WIGS_WHO_FOR.items.map((item, index) => (
              <li key={index}>
                <span className="mark markOk"><svg aria-hidden="true"><use href="#alc-i-check" /></svg></span>
                <span><Rich text={item} /></span>
              </li>
            ))}
          </ul>
          <p className={styles.resolve}><strong>{WIGS_WHO_FOR.resolveStrong}</strong> <em>{WIGS_WHO_FOR.resolveEmphasis}</em></p>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
