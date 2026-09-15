'use client';

import { useEffect, useRef, useState } from 'react';
import { Cpu, Medal, ShieldCheck, Sparkles } from 'lucide-react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react';
import { usePrefersReducedMotion, useReveal } from '../HeroSecret/hooks';
import { pillars, pillarsTitle, type Pillar, type PillarIcon } from './content';

const icons: Record<PillarIcon, typeof Medal> = {
  medal: Medal,
  cpu: Cpu,
  sparkles: Sparkles,
  shield: ShieldCheck,
};

const START = [0.08, 0.28, 0.48, 0.68];
const WINDOW = 0.17;

function Emphasised({ text }: { text: string }) {
  return (
    <>
      {text.split('**').map((part, i) =>
        i % 2 ? <strong key={i}>{part}</strong> : <span key={i}>{part}</span>
      )}
    </>
  );
}

function Column({
  pillar,
  index,
  progress,
}: {
  pillar: Pillar;
  index: number;
  progress: MotionValue<number>;
}) {
  const Icon = icons[pillar.icon];
  const from = START[index];
  const opacity = useTransform(progress, [from, from + WINDOW], [0, 1]);
  const y = useTransform(progress, [from, from + WINDOW], [30, 0]);
  const iconOpacity = useTransform(progress, [from, from + 0.07], [0, 1]);
  const iconY = useTransform(progress, [from, from + 0.07], [16, 0]);

  return (
    <li className="pillars__col">
      <motion.span className="pillars__icon" style={{ opacity: iconOpacity, y: iconY }}>
        <Icon size={30} strokeWidth={1.5} aria-hidden="true" />
      </motion.span>

      <motion.div className="pillars__copy" style={{ opacity, y }}>
        <h3>{pillar.title}</h3>
        <p>
          <Emphasised text={pillar.body} />
        </p>
      </motion.div>
    </li>
  );
}

export default function Pillars() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const [still, setStill] = useState(true);
  const { ref: headRef, shown } = useReveal<HTMLDivElement>();

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
    stiffness: 120,
    damping: 26,
    mass: 0.4,
    restDelta: 0.0005,
  });

  return (
    <section
      className={`ahlV2Methods pillars${still ? ' pillars--still' : ''}`}
      ref={sectionRef}
      aria-labelledby="pillars-title"
    >
      <div className="pillars__pin">
        <div className="pillars__in wrap">
          <div
            className="pillars__head"
            data-shown={shown ? 'true' : 'false'}
            ref={headRef}
          >
            <h2 className="pillars__title" id="pillars-title">
              {pillarsTitle.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h2>
          </div>

          <ol className="pillars__grid">
            {pillars.map((pillar, i) => (
              <Column key={pillar.title} pillar={pillar} index={i} progress={eased} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
