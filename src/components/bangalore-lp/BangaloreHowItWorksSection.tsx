'use client';

import { LazyGumletEmbed } from '@/components/video/LazyGumletEmbed';
import { gumletEmbedUrl } from '@/lib/media/cdn';
import { BANGALORE_HOW_IT_WORKS_VIDEO } from './content';
import styles from './BangaloreHowItWorksSection.module.css';

export function BangaloreHowItWorksSection() {
  return (
    <section className={styles.root} aria-labelledby="bangalore-works-title">
      <h2 id="bangalore-works-title" className={styles.title}>
        How It Works
        <br />
        <span className={styles.titleAccent}>From Visit to Final Look</span>
      </h2>

      <div className={styles.stage}>
        <LazyGumletEmbed
          embedSrc={gumletEmbedUrl(BANGALORE_HOW_IT_WORKS_VIDEO.gumletId)}
          title={BANGALORE_HOW_IT_WORKS_VIDEO.title}
          loadStrategy="visible"
          placeholderLabel="Tap to load video"
        />
      </div>
    </section>
  );
}
