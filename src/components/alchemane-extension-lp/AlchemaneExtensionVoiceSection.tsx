'use client';

import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';
import { MediaVideo } from '@/components/media/MediaVideo';
import { usePlayableVideo } from '@/components/alchemane/usePlayableVideo';
import { Rich } from '@/components/alchemane/Rich';
import { EXTENSION_VOICE } from './content';
import styles from './AlchemaneExtensionVoiceSection.module.css';
import { AlchemaneCtaButton } from '@/components/alchemane/AlchemaneCtaButton';

export function AlchemaneExtensionVoiceSection({ mediaBase }: { mediaBase: string }) {
  const { playing, handlePlay } = usePlayableVideo();
  const { kicker, title, video, quotes, ctaLabel } = EXTENSION_VOICE;

  return (
    <section className="section section--white" aria-labelledby="alc-say-title">
      <div className={`alcContainer ${styles.grid}`}>
        <AnimateOnScroll className={styles.media}>
          <MediaVideo
            className={styles.frame}
            videoClassName={styles.videoEl}
            posterClassName={styles.poster}
            playClassName={styles.playButton}
            src={`${mediaBase}/${video.src}`}
            gumletId={video.gumletId}
            poster={`${mediaBase}/${video.poster}`}
            alt={video.ariaLabel}
            label={video.ariaLabel}
            playing={playing}
            onPlay={handlePlay}
          />
        </AnimateOnScroll>
        <AnimateOnScroll className={styles.body}>
          <p className="kicker">{kicker}</p>
          <h2 className="sectionTitle" id="alc-say-title">{title}</h2>
          <ul className={styles.quotes}>
            {quotes.map((quote, index) => (
              <li key={index}><Rich text={quote} /></li>
            ))}
          </ul>
          <AlchemaneCtaButton>{ctaLabel}</AlchemaneCtaButton>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
