'use client';

import { LazyGumletEmbed } from '@/components/video/LazyGumletEmbed';
import { gumletEmbedUrl } from '@/lib/media/cdn';
import { BANGALORE_HAPPY_CLIENTS_VIDEO } from './content';
import styles from './BangaloreHappyClientsSection.module.css';

export function BangaloreHappyClientsSection() {
  return (
    <section className={styles.root} aria-labelledby="bangalore-happy-clients-title">
      <h2 id="bangalore-happy-clients-title" className={styles.title}>
        Hear From Our <span className={styles.titleAccent}>Happy Clients</span>
      </h2>

      <div className={styles.stage}>
        <LazyGumletEmbed
          embedSrc={gumletEmbedUrl(BANGALORE_HAPPY_CLIENTS_VIDEO.gumletId)}
          title={BANGALORE_HAPPY_CLIENTS_VIDEO.title}
          loadStrategy="visible"
          placeholderLabel="Tap to load video"
        />
      </div>
    </section>
  );
}
