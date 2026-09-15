'use client';

import { useRef } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react';
import { usePrefersReducedMotion } from '../HeroSecret/hooks';
import { keyFacts, keyFactsTitle, type KeyFact, type KeyFactSlot } from './content';
import ParallaxImages from './ParallaxImages';

const cardStarts: Record<KeyFactSlot, number> = {
  left: 0.08,
  'middle-top': 0.16,
  'middle-bottom': 0.23,
  right: 0.3,
};

const cardTilt: Record<KeyFactSlot, number> = {
  left: -9,
  'middle-top': 0,
  'middle-bottom': 0,
  right: 9,
};

function FactCard({
  fact,
  progress,
  still,
}: {
  fact: KeyFact;
  progress: MotionValue<number>;
  still: boolean;
}) {
  const start = cardStarts[fact.slot];
  const tilt = cardTilt[fact.slot];
  const y = useTransform(progress, [start, start + 0.13, start + 0.42, start + 0.6], [260, 92, -14, 0]);
  const opacity = useTransform(progress, [start, start + 0.08, start + 0.24], [0, 0.45, 1]);
  const rotateX = useTransform(
    progress,
    [start, start + 0.2, start + 0.46, start + 0.6],
    [64, 34, -4, 0]
  );
  const rotateY = useTransform(progress, [start, start + 0.42, start + 0.6], [tilt, tilt * 0.35, 0]);
  const rotateZ = useTransform(
    progress,
    [start, start + 0.42, start + 0.6],
    [tilt * 0.35, tilt * 0.12, 0]
  );
  const scale = useTransform(
    progress,
    [start, start + 0.2, start + 0.46, start + 0.6],
    [0.82, 0.93, 1.015, 1]
  );

  return (
    <motion.article
      className={`facts__card facts__card--${fact.slot}${fact.image ? ' facts__card--visual' : ''}`}
      style={still ? undefined : { y, opacity, rotateX, rotateY, rotateZ, scale }}
    >
      {fact.image ? (
        <ParallaxImages
          className="facts__cardMedia"
          images={[
            {
              src: fact.image,
              alt: '',
              f: 0.08,
              r: 'clamp(14px, 1.25vw, 20px)',
            },
          ]}
          still={still}
          aria-hidden="true"
        />
      ) : null}
      <strong>{fact.value}</strong>
      <span>{fact.label}</span>
    </motion.article>
  );
}

export default function KeyFacts() {
  const sectionRef = useRef<HTMLElement>(null);
  const still = usePrefersReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'center center'],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 74,
    damping: 23,
    mass: 0.48,
    restDelta: 0.001,
  });

  const copyOpacity = useTransform(progress, [0, 0.13, 0.34], [0, 0.55, 1]);
  const copyY = useTransform(progress, [0, 0.34, 0.56], [110, -10, 0]);

  return (
    <section className="ahlV2Proof facts" ref={sectionRef} aria-labelledby="facts-title">
      <div className="facts__in wrap">
        <motion.div
          className="facts__intro"
          style={still ? undefined : { opacity: copyOpacity, y: copyY }}
        >
          <h2 id="facts-title">
            {keyFactsTitle.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h2>
        </motion.div>

        <div className="facts__perspective">
          <div className="facts__grid">
            {keyFacts.map((fact) => (
              <FactCard fact={fact} progress={progress} still={still} key={fact.value} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
