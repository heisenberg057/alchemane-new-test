'use client';

import { useFunnelBooking } from '@/components/funnel/FunnelBookingProvider';
import { LazyGumletEmbed } from '@/components/video/LazyGumletEmbed';
import { BangaloreR2Image } from './BangaloreR2Image';
import styles from './BangaloreHero.module.css';

/** Live Gumlet asset matching designer file `original_video_68aad1eacd4a3cfd54ca2e15.mp4` */
const HERO_GUMLET_EMBED =
  'https://play.gumlet.io/embed/68aad1eacd4a3cfd54ca2e15?background=false&autoplay=false&loop=false&disable_player_controls=false';

export function BangaloreHero() {
  const { openBooking } = useFunnelBooking();

  return (
    <section className={styles.root} aria-labelledby="bangalore-hero-title">
      <div className={styles.panel}>
        <div className={styles.titleWrap}>
          <p className={styles.eyebrow}>Hair Loss in Bangalore?</p>
          <h1 id="bangalore-hero-title" className={styles.title}>
            Get Your Confidence Back.
            <br />
            <span className={styles.titleAccent}>Naturally.</span>
          </h1>
          <p className={styles.subhead}>
            Custom hair systems for Bangalore&apos;s men — no surgery, no pain, no waiting 12
            months.
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

        <div className={styles.stage}>
          <LazyGumletEmbed
            embedSrc={HERO_GUMLET_EMBED}
            title="American Hairline hair system in Bangalore"
            loadStrategy="visible"
            placeholderLabel="Tap to load video"
          />
        </div>

        <div className={styles.trust}>
          <p className={styles.trustLead}>Trusted by 6,770+ Clients Across 12 Countries</p>
          <ul className={styles.trustList}>
            <li className={styles.trustItem}>
              <BangaloreR2Image
                className={`${styles.trustIcon} ${styles.trustIconGoogle}`}
                src="/media/bangalore-lp/google.svg"
                alt=""
                width={20}
                height={20}
                aria-hidden
              />
              <span>4.9 Google rating</span>
            </li>
            <li className={styles.trustItem}>
              <BangaloreR2Image
                className={`${styles.trustIcon} ${styles.trustIconYoutube}`}
                src="/media/bangalore-lp/youtube.svg"
                alt=""
                width={24}
                height={18}
                aria-hidden
              />
              <span>50k+ Subscribers on YouTube</span>
            </li>
            <li className={styles.trustItem}>
              <BangaloreR2Image
                className={styles.trustIcon}
                src="/media/bangalore-lp/shield.svg"
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
