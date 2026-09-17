'use client';

import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';
import { AlchemaneEmbedCard } from '@/components/alchemane/AlchemaneEmbedCard';
import { WIGS_VOICE } from './content';
import styles from './AlchemaneWigsVoiceSection.module.css';

export function AlchemaneWigsVoiceSection({ mediaBase }: { mediaBase: string }) {
  return (
    <section className="section section--white" aria-labelledby="choose-title">
      <div className="alcContainer">
        <AnimateOnScroll className={styles.head}>
          <h2 className="sectionTitle" id="choose-title">{WIGS_VOICE.title}</h2>
          <p className="sectionHint">{WIGS_VOICE.hint}</p>
        </AnimateOnScroll>
      </div>
      <div className="alcContainer">
        <AnimateOnScroll>
          <AlchemaneEmbedCard
            className={styles.frame}
            video={{ ...WIGS_VOICE.video, poster: `${mediaBase}/${WIGS_VOICE.video.poster}` }}
          />
        </AnimateOnScroll>
      </div>
    </section>
  );
}
