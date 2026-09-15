'use client';

import { useFunnelBooking } from '@/components/funnel/FunnelBookingProvider';
import { LazyGumletEmbed } from '@/components/video/LazyGumletEmbed';
import { gumletEmbedUrl } from '@/lib/media/cdn';
import { BANGALORE_FOUNDER_BULLETS, BANGALORE_FOUNDER_VIDEO } from './content';
import styles from './BangaloreFounderSection.module.css';

export function BangaloreFounderSection() {
  const { openBooking } = useFunnelBooking();

  return (
    <section className={styles.root} aria-labelledby="bangalore-founder-title">
      <h2 id="bangalore-founder-title" className={styles.title}>
        The Artist Behind
        <br />
        <span className={styles.titleAccent}>Bollywood’s Hair Secrets</span>
      </h2>

      <div className={styles.stage}>
        <LazyGumletEmbed
          embedSrc={gumletEmbedUrl(BANGALORE_FOUNDER_VIDEO.gumletId)}
          title={BANGALORE_FOUNDER_VIDEO.title}
          loadStrategy="visible"
          placeholderLabel="Tap to load video"
        />
      </div>

      <ul className={styles.bullets}>
        {BANGALORE_FOUNDER_BULLETS.map((parts, bulletIndex) => (
          <li key={`founder-bullet-${bulletIndex}`} className={styles.bullet}>
            {parts.map((part, partIndex) =>
              part.bold ? (
                <strong key={`${bulletIndex}-${partIndex}`}>{part.text}</strong>
              ) : (
                <span key={`${bulletIndex}-${partIndex}`}>{part.text}</span>
              )
            )}
          </li>
        ))}
      </ul>

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
    </section>
  );
}
