'use client';

import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';
import { MediaImage } from '@/components/media/MediaImage';
import { TOPPERS_PROMISE_LEAD } from './content';
import styles from './AlchemaneToppersPromiseSection.module.css';

const ITEMS = [
  { title: '100% Human Hair', text: 'No blends. No shortcuts. No synthetics.' },
  { title: 'Safe & Gentle', text: 'No glue. No chemicals. Just gentle, hair-safe methods.' },
  { title: 'Custom Fit', text: 'Every strand is tailored to your hair, face & lifestyle.' },
  { title: 'Ongoing Support', text: "From consult to touch-up, we're with you." },
  { title: 'Happiness Guarantee', text: "If it doesn't feel right, we'll fix it until it's perfect." },
];

export function AlchemaneToppersPromiseSection({ mediaBase }: { mediaBase: string }) {
  return (
    <section className="section section--ivory" aria-labelledby="alc-promise-title">
      <div className="alcContainer">
        <AnimateOnScroll className={styles.head}>
          <h2 className="sectionTitle" id="alc-promise-title">The Alchemane Promise</h2>
          <p className="sectionLead">{TOPPERS_PROMISE_LEAD}</p>
        </AnimateOnScroll>

        <AnimateOnScroll>
          <ul className={styles.list}>
            {ITEMS.map((item) => (
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
