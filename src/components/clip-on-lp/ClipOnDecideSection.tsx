'use client';

import { LazyGumletEmbed } from '@/components/video/LazyGumletEmbed';
import { gumletEmbedUrl } from '@/lib/media/cdn';
import { CLIP_ON_DECIDE_VIDEO } from './content';
import styles from './ClipOnDecideSection.module.css';

export function ClipOnDecideSection() {
  return (
    <section className={styles.root} aria-labelledby="clip-on-decide-title">
      <h2 id="clip-on-decide-title" className={styles.title}>
        Real Hair or Illusion?
        <br />
        <span className={styles.titleAccent}>Watch &amp; Decide</span>
      </h2>

      <div className={styles.stage}>
        <LazyGumletEmbed
          embedSrc={gumletEmbedUrl(CLIP_ON_DECIDE_VIDEO.gumletId)}
          title={CLIP_ON_DECIDE_VIDEO.title}
          loadStrategy="visible"
          placeholderLabel="Tap to load video"
        />
      </div>
    </section>
  );
}
