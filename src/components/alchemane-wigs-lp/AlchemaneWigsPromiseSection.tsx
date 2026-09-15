'use client';

import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';
import { MediaImage } from '@/components/media/MediaImage';
import { WIGS_PROMISE_ITEMS, WIGS_PROMISE_LEAD } from './content';
import styles from './AlchemaneWigsPromiseSection.module.css';

export function AlchemaneWigsPromiseSection({ mediaBase }: { mediaBase: string }) {
  return (
    <section className="section section--ivory" aria-labelledby="promise-title">
      <div className="container">
        <AnimateOnScroll className={styles.head}>
          <h2 className="sectionTitle" id="promise-title">The Alchemane Promise</h2>
          <p className="sectionLead">{WIGS_PROMISE_LEAD}</p>
        </AnimateOnScroll>

        <AnimateOnScroll>
          <ul className={styles.list}>
            {WIGS_PROMISE_ITEMS.map((item) => (
              <li className={styles.item} key={item.title}>
                <span className={styles.icon}>
                  <MediaImage src={`${mediaBase}/icons/${encodeURIComponent('check (1) 1.svg')}`} width={16} height={16} alt="" />
                </span>
                <div><h3>{item.title}</h3><p>{item.text}</p></div>
              </li>
            ))}
          </ul>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
