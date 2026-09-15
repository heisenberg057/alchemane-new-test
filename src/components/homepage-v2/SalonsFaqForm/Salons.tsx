'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowUpRight, Pause, Play } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { MediaImage } from '@/components/media/MediaImage';
import { usePrefersReducedMotion } from '../HeroSecret/hooks';
import { salons, salonsAction, salonsOutro, salonsTitle } from './content';

export default function Salons() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 901px)');
    const measure = () => {
      const track = trackRef.current;
      const pin = pinRef.current;
      if (!track || !pin) return;
      const pinned = mq.matches && !reduced;
      /* Use the pin width (not window) so the end of the rail lands flush —
         window.innerWidth overshoots when scrollbars / chrome differ and leaves
         dead whitespace after the last panel. */
      const travel = track.scrollWidth - pin.clientWidth;
      setDistance(pinned ? Math.max(0, travel) : 0);
    };

    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    if (pinRef.current) ro.observe(pinRef.current);

    const imgs = trackRef.current?.querySelectorAll('img') ?? [];
    imgs.forEach((img) => {
      if (!img.complete) img.addEventListener('load', measure, { once: true });
    });

    mq.addEventListener('change', measure);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      mq.removeEventListener('change', measure);
      window.removeEventListener('resize', measure);
    };
  }, [reduced]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const pinned = distance > 0;

  return (
    <section
      className={`ahlV2Close salons${pinned ? ' is-pinned' : ''}`}
      ref={sectionRef}
      aria-labelledby="salons-title"
      style={
        pinned
          ? { height: `calc(100svh - var(--ahl-header-h, 64px) + ${distance}px)` }
          : undefined
      }
    >
      <div className="salons__pin" ref={pinRef}>
        <motion.div
          className="salons__track"
          ref={trackRef}
          style={pinned ? { x } : undefined}
        >
          <div className="salons__intro">
            <h2 className="salons__title" id="salons-title">
              {salonsTitle.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h2>
            <a className="salons__link" href={salonsOutro.href}>
              {salonsOutro.action}
              <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
            </a>
          </div>

          {salons.map((salon) => (
            <SalonCard key={salon.city} salon={salon} reduced={reduced} />
          ))}

          <div className="salons__outro">
            <p className="salons__outroCopy">{salonsOutro.copy}</p>
            <a className="salons__link" href={salonsOutro.href}>
              {salonsOutro.action}
              <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function SalonCard({
  salon,
  reduced,
}: {
  salon: (typeof salons)[number];
  reduced: boolean;
}) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const canRotate = salon.images.length > 1 && !reduced && !paused;

  useEffect(() => {
    if (!canRotate) return;
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % salon.images.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [canRotate, salon.images.length]);

  const selectPhoto = (index: number) => {
    setActive(index);
    setPaused(true);
  };

  return (
    <article className={`salons__item salons__item--${salon.city.toLowerCase()}`}>
      <div
        className="salons__media"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        {salon.images.map((image, index) => (
          <MediaImage
            className={index === active ? 'is-active' : ''}
            src={image}
            alt={index === active ? salon.alt : ''}
            aria-hidden={index === active ? undefined : true}
            key={image}
            width={1200}
            height={800}
            sizes="(max-width: 900px) 90vw, 40vw"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ))}
        <h3 className="salons__city">{salon.city}</h3>
        {salon.images.length > 1 ? (
          <div className="salons__controls" aria-label={`${salon.city} salon photos`}>
            <div
              className="salons__dots"
              role="group"
              aria-label={`Choose ${salon.city} salon photo`}
            >
              {salon.images.map((_, index) => (
                <button
                  className={`salons__dot${index === active ? ' is-active' : ''}`}
                  type="button"
                  aria-label={`Show ${salon.city} salon photo ${index + 1}`}
                  aria-pressed={index === active}
                  onClick={() => selectPhoto(index)}
                  key={index}
                />
              ))}
            </div>
            {!reduced ? (
              <button
                className="salons__pause"
                type="button"
                aria-label={`${paused ? 'Play' : 'Pause'} ${salon.city} salon photo slideshow`}
                aria-pressed={paused}
                onClick={() => setPaused((value) => !value)}
              >
                {paused ? <Play aria-hidden="true" /> : <Pause aria-hidden="true" />}
              </button>
            ) : null}
          </div>
        ) : null}
      </div>

      <p className="salons__address">{salon.address}</p>
      <a className="salons__direction" href={salon.href} target="_blank" rel="noreferrer">
        {salonsAction}
        <ArrowUpRight size={14} strokeWidth={2.4} aria-hidden="true" />
      </a>
    </article>
  );
}
