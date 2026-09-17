'use client';

import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';
import { useSnapCarousel } from '@/components/carousel/useSnapCarousel';
import { AlchemaneEmbedCard } from '@/components/alchemane/AlchemaneEmbedCard';
import { AlchemaneCtaButton } from '@/components/alchemane/AlchemaneCtaButton';
import { WIGS_EDUCATION, type EducationGroup } from './content';
import styles from './AlchemaneWigsEducationSection.module.css';

function VideoGroupCarousel({ group, mediaBase, isFirst }: { group: EducationGroup; mediaBase: string; isFirst?: boolean }) {
  const count = group.items.length;
  const { scrollRef, activeIndex, canPrev, canNext, scrollPrev, scrollNext, scrollToIndex } = useSnapCarousel({
    itemSelector: ':scope > *',
    itemCount: count,
  });

  return (
    <div className={`${styles.group}${isFirst ? ` ${styles.groupFirst}` : ''}`}>
      <div className={styles.groupHead}>
        <h3>{group.heading}</h3>
        <p>{group.lead}</p>
      </div>
      <div className={styles.carousel}>
        <div ref={scrollRef} className={styles.track}>
          {group.items.map((item, index) => (
            <article className={styles.card} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${count}`} key={index}>
              <AlchemaneEmbedCard
                className={styles.frame}
                video={{ ...item.video, poster: `${mediaBase}/${item.video.poster}` }}
              />
              <p className={styles.label}>
                <span className={styles.num} aria-hidden="true">{index + 1}</span>
                {item.label}
              </p>
            </article>
          ))}
        </div>
        <div className="carouselNav">
          <button type="button" className="carouselControl" disabled={!canPrev} aria-label="Previous video" onClick={scrollPrev}>
            <svg aria-hidden="true"><use href="#alc-i-chev-left" /></svg>
          </button>
          <div className="carouselProgress" aria-label="Select video">
            {group.items.map((_, index) => (
              <button key={index} type="button" aria-current={index === activeIndex} aria-label={`Go to item ${index + 1} of ${count}`} onClick={() => scrollToIndex(index)} />
            ))}
          </div>
          <p className="carouselStatus" aria-live="polite">{`${activeIndex + 1} / ${count}`}</p>
          <button type="button" className="carouselControl" disabled={!canNext} aria-label="Next video" onClick={scrollNext}>
            <svg aria-hidden="true"><use href="#alc-i-chev-right" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export function AlchemaneWigsEducationSection({ mediaBase }: { mediaBase: string }) {
  return (
    <section className="section section--white" aria-labelledby="education-title">
      <div className="alcContainer">
        <AnimateOnScroll className={styles.head}>
          <h2 className="sectionTitle" id="education-title">{WIGS_EDUCATION.titlePrefix} <em>{WIGS_EDUCATION.titleEmphasis}</em></h2>
          <p className="sectionLead">{WIGS_EDUCATION.lead}</p>
        </AnimateOnScroll>

        {WIGS_EDUCATION.groups.map((group, index) => (
          <AnimateOnScroll key={index}>
            <VideoGroupCarousel group={group} mediaBase={mediaBase} isFirst={index === 0} />
          </AnimateOnScroll>
        ))}

        <AnimateOnScroll className={styles.stillQuestions}>
          <h3>{WIGS_EDUCATION.stillQuestionsTitle}</h3>
          <p>{WIGS_EDUCATION.stillQuestionsLead}</p>
          <AlchemaneCtaButton>{WIGS_EDUCATION.stillQuestionsCta}</AlchemaneCtaButton>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
