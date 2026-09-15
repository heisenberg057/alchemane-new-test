'use client';

import Image from 'next/image';
import { useFunnelBooking } from '@/components/funnel/FunnelBookingProvider';
import { LazyGumletEmbed } from '@/components/video/LazyGumletEmbed';
import { gumletEmbedUrl } from '@/lib/media/cdn';
import styles from './ClipOnHero.module.css';

/**
 * Designer source: `Clip on/videos/v3.mp4` (looping muted hero film).
 * Gumlet: https://play.gumlet.io/embed/6aa2aafe01b54a5cf8698dc0
 */
const HERO_GUMLET_ID = '6aa2aafe01b54a5cf8698dc0';

export function ClipOnHero() {
  const { openBooking } = useFunnelBooking();

  return (
    <section className={styles.root} aria-labelledby="clip-on-hero-title">
      <div className={styles.panel}>
        <div className={styles.titleWrap}>
          <h1 id="clip-on-hero-title" className={styles.title}>
            <span className={styles.titleAccent}>Undetectable.</span>
          </h1>
          <p className={styles.subhead}>
            Custom hair systems for Indian men — no surgery, no pain, no waiting 12 months.
          </p>
        </div>

        <a
          className={styles.cta}
          href="#contact-form"
          onClick={(event) => {
            event.preventDefault();
            openBooking();
          }}
        >
          Book My Consultation
        </a>
        <p className={styles.ctaNote}>
          Paid consultation · Fee shared after form submission · 30–45 min · In-person or online
        </p>

        <div className={styles.stage} aria-label="3D hair system detail video">
          <div className={styles.filmFrame}>
            <LazyGumletEmbed
              embedSrc={gumletEmbedUrl(HERO_GUMLET_ID)}
              title="3D clip-on hair system detail"
              loadStrategy="visible"
              placeholderLabel="Tap to load video"
            />
          </div>
          <span className={styles.filmLabel}>3D Hair System Detail</span>
          <span className={styles.filmProgress} aria-hidden="true">
            <i className={styles.filmProgressFill} />
          </span>
        </div>

        <div className={styles.trust}>
          <p className={styles.trustLead}>Trusted by 6,700+ Clients Across 12 Countries</p>
          <ul className={styles.trustList}>
            <li className={styles.trustItem}>
              <Image
                className={`${styles.trustIcon} ${styles.trustIconGoogle}`}
                src="/assets/clip-on-lp/google.svg"
                alt=""
                width={20}
                height={20}
                aria-hidden
              />
              <span>4.9 Google rating</span>
            </li>
            <li className={styles.trustItem}>
              <Image
                className={`${styles.trustIcon} ${styles.trustIconYoutube}`}
                src="/assets/clip-on-lp/youtube.svg"
                alt=""
                width={24}
                height={18}
                aria-hidden
              />
              <span>50k+ Subscribers on YouTube</span>
            </li>
            <li className={styles.trustItem}>
              <Image
                className={styles.trustIcon}
                src="/assets/clip-on-lp/shield.svg"
                alt=""
                width={24}
                height={24}
                aria-hidden
              />
              <span>
                Non-Damaging <i className={styles.trustDivider}>|</i> Certified Safe
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Hash target for #contact-form CTAs; booking opens via FunnelBookingModal */}
      <div id="contact-form" className="sr-only" aria-hidden="true" />
    </section>
  );
}
