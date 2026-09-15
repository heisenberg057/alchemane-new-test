'use client';

import { LazyGumletEmbed } from '@/components/video/LazyGumletEmbed';
import { gumletEmbedUrl } from '@/lib/media/cdn';
import { BANGALORE_DECIDE_VIDEO } from './content';
import styles from './BangaloreDecideSection.module.css';

export function BangaloreDecideSection() {
  return (
    <section className={styles.root} aria-labelledby="bangalore-decide-title">
      <h2 id="bangalore-decide-title" className={styles.title}>
        Real Hair or Illusion?
        <br />
        <span className={styles.titleAccent}>Watch &amp; Decide</span>
      </h2>

      <div className={styles.stage}>
        <LazyGumletEmbed
          embedSrc={gumletEmbedUrl(BANGALORE_DECIDE_VIDEO.gumletId)}
          title={BANGALORE_DECIDE_VIDEO.title}
          loadStrategy="visible"
          placeholderLabel="Tap to load video"
        />
      </div>
    </section>
  );
}
