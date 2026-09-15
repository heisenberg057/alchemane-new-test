'use client';

import { useFunnelBooking } from '@/components/funnel/FunnelBookingProvider';
import { LazyGumletEmbed } from '@/components/video/LazyGumletEmbed';
import { gumletEmbedUrl } from '@/lib/media/cdn';
import { CLIP_ON_FOUNDER_BULLETS, CLIP_ON_FOUNDER_VIDEO } from './content';
import styles from './ClipOnFounderSection.module.css';

export function ClipOnFounderSection() {
  const { openBooking } = useFunnelBooking();

  return (
    <section className={styles.root} aria-labelledby="clip-on-founder-title">
      <h2 id="clip-on-founder-title" className={styles.title}>
        The Artist Behind
        <br />
        <span className={styles.titleAccent}>Bollywood’s Hair Secrets</span>
      </h2>

      <div className={styles.stage}>
        <LazyGumletEmbed
          embedSrc={gumletEmbedUrl(CLIP_ON_FOUNDER_VIDEO.gumletId)}
          title={CLIP_ON_FOUNDER_VIDEO.title}
          loadStrategy="visible"
          placeholderLabel="Tap to load video"
        />
      </div>

      <ul className={styles.bullets}>
        {CLIP_ON_FOUNDER_BULLETS.map((parts, bulletIndex) => (
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
        Book A Consultation Now
      </a>
      <p className={styles.ctaNote}>
        Paid consultation · Fee shared after form submission · 30–45 min · In-person or online
      </p>
    </section>
  );
}
