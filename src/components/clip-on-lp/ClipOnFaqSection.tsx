'use client';

import { useState } from 'react';
import {
  CLIP_ON_FAQ_CONSULTATION,
  CLIP_ON_FAQ_SYSTEM,
  type ClipOnFaqItem,
} from './content';
import styles from './ClipOnFaqSection.module.css';

type FaqTab = 'consultation' | 'system';

function FaqPanel({
  items,
  openId,
  onToggle,
}: {
  items: ClipOnFaqItem[];
  openId: string | null;
  onToggle: (id: string) => void;
}) {
  return (
    <div className={styles.panel} role="tabpanel">
      {items.map((item) => {
        const open = openId === item.id;
        return (
          <div key={item.id} className={`${styles.item} ${open ? styles.itemOpen : ''}`}>
            <button
              type="button"
              className={styles.trigger}
              aria-expanded={open}
              onClick={() => onToggle(item.id)}
            >
              {item.question}
            </button>
            {open ? <p className={styles.answer}>{item.answer}</p> : null}
          </div>
        );
      })}
    </div>
  );
}

export function ClipOnFaqSection() {
  const [tab, setTab] = useState<FaqTab>('consultation');
  const [openId, setOpenId] = useState<string | null>('c6');

  const switchTab = (next: FaqTab) => {
    setTab(next);
    setOpenId(next === 'consultation' ? 'c6' : null);
  };

  const onToggle = (id: string) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <section className={styles.root} aria-labelledby="clip-on-faq-title">
      <div className={styles.glass}>
        <h2 id="clip-on-faq-title" className={styles.title}>
          Frequently Asked Questions
        </h2>
        <p className={styles.lead}>
          These are the exact questions most men ask before choosing us. Get clear, honest answers
          to make a confident decision.
        </p>

        <div className={styles.tabs} role="tablist" aria-label="FAQ categories">
          <button
            id="clip-on-consultation-tab"
            type="button"
            role="tab"
            aria-selected={tab === 'consultation'}
            className={`${styles.tab} ${tab === 'consultation' ? styles.tabActive : ''}`}
            onClick={() => switchTab('consultation')}
          >
            Consultation
          </button>
          <button
            id="clip-on-system-tab"
            type="button"
            role="tab"
            aria-selected={tab === 'system'}
            className={`${styles.tab} ${tab === 'system' ? styles.tabActive : ''}`}
            onClick={() => switchTab('system')}
          >
            Hair System
          </button>
        </div>

        {tab === 'consultation' ? (
          <FaqPanel items={CLIP_ON_FAQ_CONSULTATION} openId={openId} onToggle={onToggle} />
        ) : (
          <FaqPanel items={CLIP_ON_FAQ_SYSTEM} openId={openId} onToggle={onToggle} />
        )}
      </div>
    </section>
  );
}
