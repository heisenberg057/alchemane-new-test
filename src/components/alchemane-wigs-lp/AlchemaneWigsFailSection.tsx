'use client';

import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';
import { Rich } from '@/components/alchemane/Rich';
import { WIGS_FAIL } from './content';
import styles from './AlchemaneWigsFailSection.module.css';

export function AlchemaneWigsFailSection() {
  return (
    <section className="section section--white" id="fail" aria-labelledby="fail-title">
      <div className="alcContainer">
        <AnimateOnScroll className={styles.head}>
          <h2 className="sectionTitle" id="fail-title">{WIGS_FAIL.titlePrefix} <em>{WIGS_FAIL.titleEmphasis}</em></h2>
        </AnimateOnScroll>

        <AnimateOnScroll className={styles.fail}>
          <p className={styles.label}>{WIGS_FAIL.label}</p>
          <ul className={styles.list}>
            {WIGS_FAIL.items.map((item, index) => (
              <li key={index}>
                <span className="mark markNo"><svg aria-hidden="true"><use href="#alc-i-cross" /></svg></span>
                <span><Rich text={item} /></span>
              </li>
            ))}
          </ul>
          <p className={styles.resolve}><em>{WIGS_FAIL.resolveEmphasis}</em> {WIGS_FAIL.resolveRest}</p>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
