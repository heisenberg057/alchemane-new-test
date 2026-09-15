'use client';

import type { RefObject } from 'react';
import { getMediaUrl } from '@/lib/media/cdn';
import { MediaImage } from '@/components/media/MediaImage';
import { AlchemaneEmbedCard } from '@/components/alchemane/AlchemaneEmbedCard';
import { AlchemaneCtaButton } from '@/components/alchemane/AlchemaneCtaButton';
import { Rich } from '@/components/alchemane/Rich';
import { WIGS_HERO } from './content';
import styles from './AlchemaneWigsHero.module.css';

export function AlchemaneWigsHero({
  mediaBase,
  heroCtaRef,
}: {
  mediaBase: string;
  heroCtaRef?: RefObject<HTMLAnchorElement>;
}) {
  const h = WIGS_HERO;

  return (
    <section className={styles.root} id="top" aria-labelledby="alc-hero-title">
      <svg className={styles.strand} viewBox="0 0 1200 700" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path className={`${styles.strandPath} ${styles.strandTeal}`} pathLength={1} d="M-40 560C160 520 250 250 470 240S760 470 940 420 1120 160 1260 120" />
        <path className={`${styles.strandPath} ${styles.strandGold}`} pathLength={1} d="M-40 600C190 560 280 300 480 290S770 520 950 460 1130 200 1260 160" />
      </svg>

      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <p className={styles.badge}><span>{h.badge}</span></p>
          <h1 className={styles.title} id="alc-hero-title">{h.title}</h1>
          <p className="sectionLead">{h.lead}</p>
          <ul className={styles.checklist}>
            {h.checklist.map((item, index) => (
              <li key={index}>
                <span className="mark markOk"><svg aria-hidden="true"><use href="#alc-i-check" /></svg></span>
                <span>{item.strong ? <strong>{item.strong}</strong> : null} {item.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.media}>
          <figure className={styles.card}>
            <MediaImage src={`${mediaBase}/${h.photo.src}`} alt={h.photo.alt} width={h.photo.width} height={h.photo.height} className={styles.cardImg} />
            <div className={styles.quote}>
              <p className={styles.quoteLabel}><span className={styles.quoteDot} aria-hidden="true" />{h.quoteLabel}</p>
              <p>&ldquo;{h.quote}&rdquo;</p>
            </div>
          </figure>
        </div>

        <div className={styles.body}>
          <p className={styles.bodyCopy}><Rich text={h.bodyCopy} /></p>
          <ul className={styles.checklist}>
            {h.bodyChecklist.map((item, index) => (
              <li key={index}>
                <span className="mark markOk"><svg aria-hidden="true"><use href="#alc-i-check" /></svg></span>
                <span>{item.strong} <Rich text={item.text} /></span>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.trust}>
          <AlchemaneEmbedCard
            video={{ ...h.video, poster: `${mediaBase}/${h.video.poster}` }}
            className={`${styles.card} ${styles.cardVideo}`}
          />
          <p className={styles.trustTitle}>{h.trustTitle} <span className={styles.trustBreak}>{h.trustBreak}</span></p>
          <ul className={styles.trustList}>
            {h.trustItems.map((item, index) => (
              <li key={index}>
                <img src={getMediaUrl(`${mediaBase}/${item.icon}`)} width={item.width} height={item.height} alt="" />
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
          <div className={styles.action}>
            <AlchemaneCtaButton anchorRef={heroCtaRef}>{h.ctaLabel}</AlchemaneCtaButton>
          </div>
        </div>
      </div>

      <a className={styles.scroll} href="#fail" aria-label="Scroll to next section">
        <svg aria-hidden="true"><use href="#alc-i-chev-down" /></svg>
      </a>
    </section>
  );
}
