'use client';

import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';
import { MediaVideo } from '@/components/media/MediaVideo';
import { usePlayableVideo } from '@/components/alchemane/usePlayableVideo';
import { Rich } from '@/components/alchemane/Rich';
import { TOPPERS_FOUNDER } from './content';
import styles from './AlchemaneToppersFounderSection.module.css';
import { AlchemaneCtaButton } from '@/components/alchemane/AlchemaneCtaButton';

export function AlchemaneToppersFounderSection({ mediaBase }: { mediaBase: string }) {
  const { playing, handlePlay } = usePlayableVideo();
  const { background, credentials, ctaLabel, video } = TOPPERS_FOUNDER;

  return (
    <section className={`section section--${background}`} aria-labelledby="alc-vinitt-title">
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
          <p className="kicker">Founder</p>
          <h2 className={styles.title} id="alc-vinitt-title">The Mastery Behind Alchemane: <em>Meet Vinitt</em></h2>
          <ul className={styles.credentials}>
            {credentials.map((line, index) => (
              <li key={index}><Rich text={line} /></li>
            ))}
          </ul>
          <AlchemaneCtaButton>{ctaLabel}</AlchemaneCtaButton>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
