'use client';

import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';
import { useSnapCarousel } from '@/components/carousel/useSnapCarousel';
import { MediaVideo } from '@/components/media/MediaVideo';
import { usePlayableVideo } from '@/components/alchemane/usePlayableVideo';
import { TOPPERS_GALLERY_CLIPS } from './content';
import styles from './AlchemaneToppersResultsGallery.module.css';

function ClipCard({ mediaBase, index, video }: { mediaBase: string; index: number; video: (typeof TOPPERS_GALLERY_CLIPS)[number] }) {
  const { playing, handlePlay } = usePlayableVideo();
  return (
    <article className={styles.card} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${TOPPERS_GALLERY_CLIPS.length}`}>
      <span className={styles.index} aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
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
    </article>
  );
}

export function AlchemaneToppersResultsGallery({ mediaBase }: { mediaBase: string }) {
  const count = TOPPERS_GALLERY_CLIPS.length;
  const { scrollRef, activeIndex, canPrev, canNext, scrollPrev, scrollNext, scrollToIndex } = useSnapCarousel({
    itemSelector: ':scope > *',
    itemCount: count,
  });

  return (
    <section className="section section--white" aria-labelledby="alc-natural-title">
      <div className="alcContainer">
        <AnimateOnScroll className={styles.head}>
          <h2 className="sectionTitle" id="alc-natural-title">Do They Look Natural? <em>Watch &amp; Decide</em></h2>
          <p className="sectionHint">Real clients, unedited</p>
        </AnimateOnScroll>
      </div>
      <div className="alcContainer">
        <div className={styles.carousel} role="group" aria-roledescription="carousel" aria-label="Real client results">
          <div ref={scrollRef} className={styles.track}>
            {TOPPERS_GALLERY_CLIPS.map((video, index) => (
              <ClipCard key={index} mediaBase={mediaBase} index={index} video={video} />
            ))}
          </div>
          <div className="carouselNav">
            <button type="button" className="carouselControl" disabled={!canPrev} aria-label="Previous client story" onClick={scrollPrev}>
              <svg aria-hidden="true"><use href="#alc-i-chev-left" /></svg>
            </button>
            <div className="carouselProgress" aria-label="Select client story">
              {TOPPERS_GALLERY_CLIPS.map((_, index) => (
                <button key={index} type="button" aria-current={index === activeIndex} aria-label={`Go to item ${index + 1} of ${count}`} onClick={() => scrollToIndex(index)} />
              ))}
            </div>
            <p className="carouselStatus" aria-live="polite">{`${activeIndex + 1} / ${count}`}</p>
            <button type="button" className="carouselControl" disabled={!canNext} aria-label="Next client story" onClick={scrollNext}>
              <svg aria-hidden="true"><use href="#alc-i-chev-right" /></svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
