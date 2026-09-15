'use client';

import { LazyGumletEmbed } from '@/components/video/LazyGumletEmbed';
import { gumletEmbedUrl } from '@/lib/media/cdn';
import { CLIP_ON_HOW_IT_WORKS_VIDEO } from './content';
import styles from './ClipOnHowItWorksSection.module.css';

export function ClipOnHowItWorksSection() {
  return (
    <section className={styles.root} aria-labelledby="clip-on-works-title">
      <h2 id="clip-on-works-title" className={styles.title}>
        How It Works
        <br />
        <span className={styles.titleAccent}>From Visit to Final Look</span>
      </h2>

      <div className={styles.stage}>
        <LazyGumletEmbed
          embedSrc={gumletEmbedUrl(CLIP_ON_HOW_IT_WORKS_VIDEO.gumletId)}
          title={CLIP_ON_HOW_IT_WORKS_VIDEO.title}
          loadStrategy="visible"
          placeholderLabel="Tap to load video"
        />
      </div>
    </section>
  );
}
