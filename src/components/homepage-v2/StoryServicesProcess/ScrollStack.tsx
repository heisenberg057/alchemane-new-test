'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionStyle,
  type MotionValue,
} from 'motion/react';
import { usePrefersReducedMotion } from '../HeroSecret/hooks';

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export function useScrollStack(rowCount: number) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const [still, setStill] = useState(true);

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

  const progress = useTransform(eased, clamp01);

  return { sectionRef, still, progress, last: rowCount - 1 };
}

type StackRowProps = {
  index: number;
  last: number;
  progress: MotionValue<number>;
  still: boolean;
  className: string;
  innerClassName: string;
  staticDelay?: number;
  children: ReactNode;
};

export function StackRow({
  index,
  last,
  progress,
  still,
  className,
  innerClassName,
  staticDelay = 70,
  children,
}: StackRowProps) {
  const open = useTransform(progress, (value) =>
    clamp01(value * last - (index - 1))
  );
  const peek = useTransform(progress, (value) =>
    clamp01(value * last - (index - 2))
  );

  const rows = useTransform(open, (value) => `minmax(0, ${value}fr)`);
  const scaleX = useTransform(open, [0, 1], [0.955, 1]);

  return (
    <motion.li
      className={className}
      style={
        still
          ? ({ '--mobile-delay': `${index * staticDelay}ms` } as MotionStyle)
          : ({
              gridTemplateRows: rows,
              scaleX,
              '--open': open,
              '--peek-amt': peek,
            } as MotionStyle)
      }
    >
      <div className={innerClassName}>{children}</div>
    </motion.li>
  );
}
