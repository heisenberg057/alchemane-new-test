'use client';

import { LazyGumletEmbed } from '@/components/video/LazyGumletEmbed';
import { gumletEmbedUrl } from '@/lib/media/cdn';
import { CLIP_ON_HAPPY_CLIENTS_VIDEO } from './content';
import styles from './ClipOnHappyClientsSection.module.css';

export function ClipOnHappyClientsSection() {
  return (
    <section className={styles.root} aria-labelledby="clip-on-happy-clients-title">
      <h2 id="clip-on-happy-clients-title" className={styles.title}>
        Hear From Our <span className={styles.titleAccent}>Happy Clients</span>
      </h2>

      <div className={styles.stage}>
        <LazyGumletEmbed
          embedSrc={gumletEmbedUrl(CLIP_ON_HAPPY_CLIENTS_VIDEO.gumletId)}
          title={CLIP_ON_HAPPY_CLIENTS_VIDEO.title}
          loadStrategy="visible"
          placeholderLabel="Tap to load video"
        />
      </div>
    </section>
  );
}
