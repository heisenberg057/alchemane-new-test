'use client';

import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';
import { Rich } from '@/components/alchemane/Rich';
import { WIGS_JOURNEY } from './content';
import styles from './AlchemaneWigsJourneySection.module.css';

export function AlchemaneWigsJourneySection() {
  return (
    <section className="section section--ivory" aria-labelledby="journey-title">
      <div className="container">
        <AnimateOnScroll className={styles.head}>
          <h2 className="sectionTitle" id="journey-title">{WIGS_JOURNEY.title}</h2>
          <p className="sectionLead">{WIGS_JOURNEY.lead}</p>
        </AnimateOnScroll>

        <div className={styles.grid}>
          {WIGS_JOURNEY.cards.map((card, index) => (
            <AnimateOnScroll className={styles.card} key={index}>
              <h3>{card.titlePrefix} <em>{card.titleEmphasis}</em></h3>
              <ul>
                {card.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <span className="mark markOk"><svg aria-hidden="true"><use href="#alc-i-check" /></svg></span>
                    <span><Rich text={item} /></span>
                  </li>
                ))}
              </ul>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
