'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import { getImageUrl } from '@/lib/media/cdn';
import { usePrefersReducedMotion, useReveal } from '../HeroSecret/hooks';
import { scanImage, scanTitle } from './content';

type Rect = { left: number; top: number; width: number; height: number };

const ZERO: Rect = { left: 0, top: 0, width: 0, height: 0 };

/** Clears pin/growth Motion inline sizes so still CSS can take full width. */
const STILL_PANEL_STYLE = {
  position: 'static' as const,
  left: 'auto',
  top: 'auto',
  width: '100%',
  height: 'auto',
};

export default function Scan() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLSpanElement>(null);
  const reduced = usePrefersReducedMotion();
  const { ref: revealRef, shown } = useReveal<HTMLDivElement>();
  const [still, setStill] = useState(true);
  const [slot, setSlot] = useState<Rect>(ZERO);
  const [stage, setStage] = useState<Rect>(ZERO);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 901px)');
    const sync = () => setStill(reduced || !mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, [reduced]);

  const measure = useCallback(() => {
    if (still) return;
    const pin = pinRef.current;
    const el = slotRef.current;
    if (!pin || !el) return;
    const p = pin.getBoundingClientRect();
    const s = el.getBoundingClientRect();

    const cs = getComputedStyle(pin);
    const padX = parseFloat(cs.paddingLeft) || 0;
    const padY = parseFloat(cs.paddingTop) || 0;

    setStage({
      left: padX,
      top: padY,
      width: Math.max(0, p.width - padX * 2),
      height: Math.max(0, p.height - padY * 2),
    });
    setSlot({
      left: s.left - p.left,
      top: s.top - p.top,
      width: s.width,
      height: s.height,
    });
  }, [still]);

  useEffect(() => {
    measure();
    if (still) return;

    const ro = new ResizeObserver(measure);
    if (pinRef.current) ro.observe(pinRef.current);
    if (slotRef.current) ro.observe(slotRef.current);
    document.fonts?.ready.then(measure).catch(() => {});
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [measure, still]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const eased = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    mass: 0.4,
    restDelta: 0.0005,
  });

  const t = useTransform(eased, [0.08, 0.78], [0, 1], { clamp: true });
  const left = useTransform(t, [0, 1], [slot.left, stage.left]);
  const top = useTransform(t, [0, 1], [slot.top, stage.top]);
  const width = useTransform(t, [0, 1], [slot.width, stage.width]);
  const height = useTransform(t, [0, 1], [slot.height, stage.height]);
  const radius = useTransform(t, [0, 1], [12, 20], { clamp: true });
  const titleOpacity = useTransform(t, [0.12, 0.72], [1, 0.28], { clamp: true });
  const imageScale = useTransform(t, [0, 1], [1.12, 1]);

  return (
    <section
      className={`ahlV2Systems scan${still ? ' scan--still' : ''}`}
      ref={sectionRef}
      aria-labelledby="scan-title"
    >
      <div className="scan__pin" ref={pinRef}>
        <div className="scan__in wrap" ref={revealRef}>
          <motion.h2
            className="scan__title"
            id="scan-title"
            data-shown={shown || still ? 'true' : 'false'}
            style={still ? undefined : { opacity: titleOpacity }}
          >
            <span className="scan__line">
              {`${scanTitle.before} `}
              <span className="scan__slot" ref={slotRef} aria-hidden="true" />
              {` ${scanTitle.after}`}
            </span>
            <span className="scan__line">{scanTitle.second}</span>
          </motion.h2>
        </div>

        <motion.div
          key={still ? 'scan-panel-still' : 'scan-panel-grow'}
          className="scan__panel"
          data-shown={shown || still ? 'true' : 'false'}
          style={
            still
              ? STILL_PANEL_STYLE
              : { left, top, width, height, borderRadius: radius }
          }
        >
          {/* Keep motion.img for scroll scale; URL is already CDN WebP via getImageUrl */}
          <motion.img
            src={getImageUrl(scanImage.src, { width: 1600 })}
            alt={scanImage.alt}
            style={still ? undefined : { scale: imageScale }}
            loading="lazy"
            decoding="async"
          />
          <span className="scan__sweep" aria-hidden="true" />
        </motion.div>
      </div>
    </section>
  );
}
