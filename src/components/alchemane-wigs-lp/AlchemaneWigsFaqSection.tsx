'use client';

import { useRef, useState, type KeyboardEvent, type SyntheticEvent } from 'react';
import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';
import type { AlchemaneFaqItem } from '@/components/alchemane/content-types';
import { WIGS_FAQ } from './content';
import styles from './AlchemaneWigsFaqSection.module.css';

function FaqPanel({ id, labelledBy, hidden, items }: { id: string; labelledBy: string; hidden: boolean; items: AlchemaneFaqItem[] }) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const handleToggle = (event: SyntheticEvent<HTMLDetailsElement>) => {
    const target = event.currentTarget;
    if (!target.open) return;
    panelRef.current?.querySelectorAll('details').forEach((other) => {
      if (other !== target) other.open = false;
    });
  };

  return (
    <div className={styles.panel} id={id} role="tabpanel" aria-labelledby={labelledBy} tabIndex={0} hidden={hidden} ref={panelRef}>
      {items.map((item, index) => (
        <details className={styles.item} key={index} open={item.open} onToggle={handleToggle}>
          <summary className={styles.summary}>{item.question}</summary>
          <p className={styles.answer}>{item.answer}</p>
        </details>
      ))}
    </div>
  );
}

export function AlchemaneWigsFaqSection() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let target: number | null = null;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') target = (index + 1) % WIGS_FAQ.tabs.length;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') target = (index - 1 + WIGS_FAQ.tabs.length) % WIGS_FAQ.tabs.length;
    else if (event.key === 'Home') target = 0;
    else if (event.key === 'End') target = WIGS_FAQ.tabs.length - 1;
    if (target !== null) {
      event.preventDefault();
      setActive(target);
      tabRefs.current[target]?.focus();
    }
  };

  return (
    <section className="section section--white" aria-labelledby="faq-title">
      <div className="container">
        <div className={styles.faq}>
          <AnimateOnScroll className={styles.head}>
            <h2 className="sectionTitle" id="faq-title">Frequently Asked Questions</h2>
            <p className="sectionLead">{WIGS_FAQ.lead}</p>
          </AnimateOnScroll>

          <AnimateOnScroll className={styles.main}>
            <div className={styles.tabs} role="tablist" aria-label="FAQ categories">
              {WIGS_FAQ.tabs.map((tab, index) => (
                <button
                  key={tab.id}
                  id={`alc-tab-${tab.id}`}
                  ref={(el) => { tabRefs.current[index] = el; }}
                  type="button"
                  role="tab"
                  className={styles.tab}
                  aria-selected={index === active}
                  aria-controls={`alc-panel-${tab.id}`}
                  tabIndex={index === active ? 0 : -1}
                  onClick={() => setActive(index)}
                  onKeyDown={(event) => onKeyDown(event, index)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {WIGS_FAQ.tabs.map((tab, index) => (
              <FaqPanel key={tab.id} id={`alc-panel-${tab.id}`} labelledBy={`alc-tab-${tab.id}`} hidden={index !== active} items={tab.items} />
            ))}
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
