'use client';

import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';
import { MediaVideo } from '@/components/media/MediaVideo';
import { usePlayableVideo } from '@/components/alchemane/usePlayableVideo';
import { EXTENSION_BENEFITS, EXTENSION_WHY } from './content';
import styles from './AlchemaneExtensionWhySection.module.css';
import { AlchemaneCtaButton } from '@/components/alchemane/AlchemaneCtaButton';

export function AlchemaneExtensionWhySection({ mediaBase }: { mediaBase: string }) {
  const { playing, handlePlay } = usePlayableVideo();
  const { kicker, title, titleEmphasis, video, ctaLabel } = EXTENSION_WHY;

  return (
    <section className="section section--white" aria-labelledby="alc-why-title">
      <div className="alcContainer">
        <AnimateOnScroll className={styles.head}>
          <p className="kicker">{kicker}</p>
          <h2 className="sectionTitle" id="alc-why-title">{title} <em>{titleEmphasis}</em></h2>
        </AnimateOnScroll>

        <div className={styles.grid}>
          <AnimateOnScroll className={styles.media}>
            <MediaVideo
              className={styles.frame}
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
          <div className={styles.body}>
            <AnimateOnScroll>
              <ol className={styles.benefits}>
                {EXTENSION_BENEFITS.map((benefit, index) => (
                  <li key={index}>
                    <span className={styles.num} aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                    <span className={styles.text}><strong>{benefit.strong}</strong> — {benefit.text}</span>
                  </li>
                ))}
              </ol>
            </AnimateOnScroll>
            <AnimateOnScroll className={styles.ctaWrap}>
              <AlchemaneCtaButton>{ctaLabel}</AlchemaneCtaButton>
            </AnimateOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}
