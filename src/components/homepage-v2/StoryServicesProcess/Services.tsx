'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import {
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react';
import { MediaImage } from '@/components/media/MediaImage';
import { useMediaQuery, usePrefersReducedMotion } from '../HeroSecret/hooks';
import { services, servicesAction, servicesTitle } from './content';

const LAST = services.length - 1;
const STEP_VH = 38;
const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const mobile = useMediaQuery('(max-width: 900px)');
  const [still, setStill] = useState(true);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const read = () =>
      setStill(reduced || !window.matchMedia('(min-width: 901px)').matches);
    read();
    window.addEventListener('resize', read);
    return () => window.removeEventListener('resize', read);
  }, [reduced]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const eased = useSpring(scrollYProgress, {
    stiffness: 130,
    damping: 28,
    mass: 0.4,
    restDelta: 0.0005,
  });

  const cursor = useTransform(eased, (progress) => {
    const raw = clamp01((progress - 0.02) / 0.96) * LAST;
    const point = Math.floor(raw);
    const t = clamp01((raw - point - 0.3) / 0.4);
    const step = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(2 - 2 * t, 3) / 2;
    return Math.min(LAST, point + step);
  });

  useMotionValueEvent(cursor, 'change', (value) => {
    if (still) return;
    setActive(Math.min(LAST, Math.max(0, Math.round(value))));
  });

  const onOpen = useCallback(
    (index: number) => {
      if (still) {
        setActive(index);
        return;
      }
      const section = sectionRef.current;
      if (!section) return;
      const step = (window.innerHeight * STEP_VH) / 100;
      window.scrollTo({
        top: section.offsetTop + index * step + step * 0.5,
        behavior: 'smooth',
      });
    },
    [still]
  );

  return (
    <section
      className={`ahlV2Story services${still ? ' services--still' : ''}`}
      ref={sectionRef}
      aria-labelledby="services-title"
    >
      <div className="services__pin">
        <div className="services__in wrap">
          <div className="services__masthead">
            <h2 className="services__title" id="services-title">
              {servicesTitle.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h2>
          </div>

          <ol className="services__list">
            {services.map((service, i) => {
              const expanded = mobile || i === active;

              return (
                <li
                  className="services__row"
                  data-open={expanded ? 'true' : 'false'}
                  key={service.title}
                >
                  <div className="services__media">
                    <MediaImage
                      src={service.image}
                      alt={service.alt}
                      width={1200}
                      height={900}
                      sizes="(max-width: 900px) 100vw, 45vw"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  <div className="services__text">
                    <h3 className="services__lead">
                      <button
                        type="button"
                        className="services__head"
                        onClick={() => onOpen(i)}
                        aria-expanded={expanded}
                        disabled={mobile}
                      >
                        <span className="services__name">{service.title}</span>
                        <span className="services__index" aria-hidden="true">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                      </button>
                    </h3>

                    <div className="services__body">
                      <div className="services__bodyIn">
                        <p>{service.body}</p>
                        <a className="services__cta" href={service.href}>
                          {servicesAction}
                          <ArrowUpRight size={14} strokeWidth={2.4} />
                        </a>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
