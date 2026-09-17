'use client';

import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';
import { MediaVideo } from '@/components/media/MediaVideo';
import { usePlayableVideo } from '@/components/alchemane/usePlayableVideo';
import type { AlchemaneVideoAsset } from '@/components/alchemane/content-types';
import styles from './AlchemaneToppersStorySection.module.css';
import { AlchemaneCtaButton } from '@/components/alchemane/AlchemaneCtaButton';

export function AlchemaneToppersStorySection({
  mediaBase,
  id,
  kicker,
  title,
  titleEmphasis,
  lead,
  ctaLabel,
  flip,
  video,
}: {
  mediaBase: string;
  id: string;
  kicker: string;
  title: string;
  titleEmphasis: string;
  lead?: string;
  ctaLabel: string;
  flip?: boolean;
  video: AlchemaneVideoAsset;
}) {
  const { playing, handlePlay } = usePlayableVideo();

  return (
    <section className={`section section--ivory ${flip ? styles.flip : ''}`} aria-labelledby={`${id}-title`}>
      <div className={`alcContainer ${styles.grid}`}>
        <AnimateOnScroll className={styles.media}>
          <MediaVideo
            className={`${styles.frame} ${flip ? styles.frameFlip : ''}`}
            videoClassName={styles.videoEl}
            posterClassName={styles.poster}
            playClassName={styles.playButton}
            src={`${mediaBase}/${video.src}`}
            poster={`${mediaBase}/${video.poster}`}
            alt={video.ariaLabel}
            label={video.ariaLabel}
            playing={playing}
            onPlay={handlePlay}
          />
        </AnimateOnScroll>
        <AnimateOnScroll className={styles.body}>
          <p className="kicker">{kicker}</p>
          <h2 className={styles.title} id={`${id}-title`}>{title} <em>{titleEmphasis}</em></h2>
          {lead ? <p className="sectionLead">{lead}</p> : null}
          <svg className={styles.strand} aria-hidden="true"><use href="#alc-i-strand" /></svg>
          <AlchemaneCtaButton>{ctaLabel}</AlchemaneCtaButton>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
