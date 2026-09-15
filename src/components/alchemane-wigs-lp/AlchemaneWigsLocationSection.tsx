'use client';

import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';
import { useSnapCarousel } from '@/components/carousel/useSnapCarousel';
import { MediaImage } from '@/components/media/MediaImage';
import { WIGS_LOCATION_PHOTOS } from './content';
import styles from './AlchemaneWigsLocationSection.module.css';

export function AlchemaneWigsLocationSection({ mediaBase }: { mediaBase: string }) {
  const count = WIGS_LOCATION_PHOTOS.length;
  const { scrollRef, activeIndex, canPrev, canNext, scrollPrev, scrollNext, scrollToIndex } = useSnapCarousel({
    itemSelector: ':scope > *',
    itemCount: count,
  });

  return (
    <section className="section section--ivory" aria-labelledby="location-title">
      <div className="container">
        <AnimateOnScroll className={styles.head}>
          <h2 className="sectionTitle" id="location-title">Our Location</h2>
          <p className="sectionHint">Khar West, Mumbai</p>
        </AnimateOnScroll>
      </div>
      <div className="container">
        <div className={styles.carousel} role="group" aria-roledescription="carousel" aria-label="Studio photos">
          <div ref={scrollRef} className={styles.track}>
            {WIGS_LOCATION_PHOTOS.map((photo, index) => (
              <figure className={`${styles.card} ${photo.wide ? styles.cardWide : ''}`} key={index} role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${count}`}>
                <MediaImage
                  src={`${mediaBase}/${photo.src}`}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  sizes="(min-width: 768px) 280px, 72vw"
                  className={styles.img}
                  loading="eager"
                />
              </figure>
            ))}
          </div>
          <div className="carouselNav">
            <button type="button" className="carouselControl" disabled={!canPrev} aria-label="Previous studio photo" onClick={scrollPrev}>
              <svg aria-hidden="true"><use href="#alc-i-chev-left" /></svg>
            </button>
            <div className="carouselProgress" aria-label="Select studio photo">
              {WIGS_LOCATION_PHOTOS.map((_, index) => (
                <button key={index} type="button" aria-current={index === activeIndex} aria-label={`Go to item ${index + 1} of ${count}`} onClick={() => scrollToIndex(index)} />
              ))}
            </div>
            <p className="carouselStatus" aria-live="polite">{`${activeIndex + 1} / ${count}`}</p>
            <button type="button" className="carouselControl" disabled={!canNext} aria-label="Next studio photo" onClick={scrollNext}>
              <svg aria-hidden="true"><use href="#alc-i-chev-right" /></svg>
            </button>
          </div>
        </div>

        <AnimateOnScroll>
          <address className={styles.address}>
            <svg className={styles.addressIcon} aria-hidden="true"><use href="#alc-i-pin" /></svg>
            <div>
              <strong>Address:</strong>
              401/402, 4th Floor, Empressa Building, 2nd Road, Opp. BMC Market, Near Kabutar, Above CSB Bank Khar, Ram
              Krishna Nagar, Khar West, Mumbai – 400052.
            </div>
          </address>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
