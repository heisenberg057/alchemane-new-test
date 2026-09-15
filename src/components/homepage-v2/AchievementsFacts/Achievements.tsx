'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { MediaImage } from '@/components/media/MediaImage';
import { achievements } from './content';
import { usePrefersReducedMotion } from '../HeroSecret/hooks';

export default function Achievements() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const still = usePrefersReducedMotion();
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      const pinned = window.matchMedia('(min-width: 901px)').matches && !still;
      setDistance(pinned ? Math.max(0, track.scrollWidth - window.innerWidth) : 0);
    };

    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [still]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const pinned = distance > 0;

  return (
    <section
      className={`ahlV2Proof work${pinned ? ' is-pinned' : ''}`}
      ref={sectionRef}
      aria-labelledby="work-title"
      style={pinned ? { height: `calc(100vh + ${distance}px)` } : undefined}
    >
      <div className="work__pin">
        <motion.div className="work__track" ref={trackRef} style={pinned ? { x } : undefined}>
          <div className="work__intro">
            <h2 className="work__title" id="work-title">
              Our Big{' '}
              <br />
              Achievements
            </h2>
            <a className="work__link" href="/results">
              View all results
              <ArrowRight size={16} strokeWidth={2} />
            </a>
          </div>

          {achievements
            .filter((item) => !item.hidden)
            .map((item) => (
              <article className="work__item" key={item.title}>
                <div className="work__media">
                  <MediaImage
                    src={item.img}
                    alt={item.title}
                    width={1200}
                    height={900}
                    sizes="(max-width: 900px) 85vw, 40vw"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <h3 className="work__name">{item.title}</h3>
                <p className="work__note">{item.note}</p>
              </article>
            ))}

          <div className="work__outro">
            <p className="work__outroCopy">
              Twelve years, 6,770+ men, and 12+ nations — the proof behind every hairline we build.
            </p>
            <a className="work__link" href="#contact-form">
              Discuss with a consultant
              <ArrowRight size={16} strokeWidth={2} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
