'use client';

import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';
import { useSnapCarousel } from '@/components/carousel/useSnapCarousel';
import { MediaVideo } from '@/components/media/MediaVideo';
import { usePlayableVideo } from '@/components/alchemane/usePlayableVideo';
import { TOPPERS_CONSULT_CLIPS, TOPPERS_CONSULT_HINT } from './content';
import styles from './AlchemaneToppersConsultSection.module.css';
import { AlchemaneCtaButton } from '@/components/alchemane/AlchemaneCtaButton';

function ConsultClip({ mediaBase, index, video }: { mediaBase: string; index: number; video: (typeof TOPPERS_CONSULT_CLIPS)[number] }) {
  const { playing, handlePlay } = usePlayableVideo();
  return (
    <article className={styles.card} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${TOPPERS_CONSULT_CLIPS.length}`}>
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
    </article>
  );
}

export function AlchemaneToppersConsultSection({ mediaBase }: { mediaBase: string }) {
  const count = TOPPERS_CONSULT_CLIPS.length;
  const { scrollRef, activeIndex, canPrev, canNext, scrollPrev, scrollNext, scrollToIndex } = useSnapCarousel({
    itemSelector: ':scope > *',
    itemCount: count,
  });

  return (
    <section className="section section--mist" aria-labelledby="alc-consult-title">
      <div className="container">
        <AnimateOnScroll className={styles.head}>
          <h2 className="sectionTitle" id="alc-consult-title">Step Inside a <em>Real Consultation</em></h2>
          <p className="sectionHint">{TOPPERS_CONSULT_HINT}</p>
        </AnimateOnScroll>
      </div>
      <div className="container">
        <div className={styles.carousel}>
          <div ref={scrollRef} className={styles.track}>
            {TOPPERS_CONSULT_CLIPS.map((video, index) => (
              <ConsultClip key={index} mediaBase={mediaBase} index={index} video={video} />
            ))}
          </div>
          <div className="carouselNav">
            <button type="button" className="carouselControl" disabled={!canPrev} aria-label="Previous consultation clip" onClick={scrollPrev}>
              <svg aria-hidden="true"><use href="#alc-i-chev-left" /></svg>
            </button>
            <div className="carouselProgress" aria-label="Select consultation clip">
              {TOPPERS_CONSULT_CLIPS.map((_, index) => (
                <button key={index} type="button" aria-current={index === activeIndex} aria-label={`Go to item ${index + 1} of ${count}`} onClick={() => scrollToIndex(index)} />
              ))}
            </div>
            <p className="carouselStatus" aria-live="polite">{`${activeIndex + 1} / ${count}`}</p>
            <button type="button" className="carouselControl" disabled={!canNext} aria-label="Next consultation clip" onClick={scrollNext}>
              <svg aria-hidden="true"><use href="#alc-i-chev-right" /></svg>
            </button>
          </div>
        </div>

        <AnimateOnScroll>
          <div className={styles.options}>
            <article className={styles.option}>
              <span className={styles.optionIcon}><svg aria-hidden="true"><use href="#alc-i-check" /></svg></span>
              <div><h3>In-Person</h3><p>At our Bandra branch, Mumbai.</p></div>
            </article>
            <article className={styles.option}>
              <span className={styles.optionIcon}><svg aria-hidden="true"><use href="#alc-i-check" /></svg></span>
              <div><h3>Online</h3><p>From the comfort of your home.</p></div>
            </article>
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll className={styles.ctaWrap}>
          <AlchemaneCtaButton>Book Your Consultation</AlchemaneCtaButton>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
