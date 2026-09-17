'use client';

import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';
import { EXTENSION_COMPARE } from './content';
import styles from './AlchemaneExtensionCompareSection.module.css';
import { AlchemaneCtaButton } from '@/components/alchemane/AlchemaneCtaButton';

export function AlchemaneExtensionCompareSection() {
  const { titlePrefix, titleEmphasis, otherHead, usHead, captionOther, ctaLabel, rows } = EXTENSION_COMPARE;

  return (
    <section className="section section--white" aria-labelledby="alc-compare-title">
      <div className="alcContainer">
        <AnimateOnScroll className={styles.head}>
          <h2 className="sectionTitle" id="alc-compare-title">{titlePrefix} <em>{titleEmphasis}</em></h2>
        </AnimateOnScroll>

        <AnimateOnScroll>
          <table className={styles.table} role="table">
            <caption className="srOnly">{captionOther}</caption>
            <thead role="rowgroup">
              <tr role="row">
                <th role="columnheader" scope="col" className={styles.featureHead}>Feature &amp; Services</th>
                <th role="columnheader" scope="col">{otherHead}</th>
                <th role="columnheader" scope="col" className={styles.usHead}>{usHead}</th>
              </tr>
            </thead>
            <tbody role="rowgroup">
              {rows.map((row, index) => (
                <tr role="row" key={index}>
                  <th role="rowheader" scope="row">{row.feature}</th>
                  <td role="cell">
                    <span className={styles.value}>{row.other}</span>
                    <span className={`${styles.mark} ${styles.markNo}`}><svg aria-hidden="true"><use href="#alc-i-cross" /></svg></span>
                  </td>
                  <td role="cell">
                    <span className={styles.value}>{row.us}</span>
                    <span className={`${styles.mark} ${styles.markOk}`}><svg aria-hidden="true"><use href="#alc-i-check" /></svg></span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </AnimateOnScroll>

        <AnimateOnScroll className={styles.ctaWrap}>
          <AlchemaneCtaButton>{ctaLabel}</AlchemaneCtaButton>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
