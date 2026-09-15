'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionStyle,
  type MotionValue,
} from 'motion/react';
import { usePrefersReducedMotion, useReveal } from '../HeroSecret/hooks';
import { MediaImage } from '@/components/media/MediaImage';
import { gumletEmbedUrl } from '@/lib/media/cdn';
import {
  processAction,
  processSteps,
  processTitle,
  processVideo,
  type ProcessStep,
} from './content';

const START = [0.1, 0.36, 0.62];
const COPY_WINDOW = 0.16;
const RULE_WINDOW = 0.22;

function ProcessMark({
  className,
  style,
}: {
  className?: string;
  style?: MotionStyle;
}) {
  return (
    <motion.span className={className} style={style} aria-hidden="true">
      <svg viewBox="0 0 12 12" width="12" height="12" focusable="false">
        <path
          d="M6 1.25v9.5M1.25 6h9.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="square"
        />
      </svg>
    </motion.span>
  );
}

function Step({
  step,
  index,
  progress,
}: {
  step: ProcessStep;
  index: number;
  progress: MotionValue<number>;
  last?: boolean;
}) {
  const from = START[index];
  const opacity = useTransform(progress, [from, from + COPY_WINDOW], [0, 1]);
  const y = useTransform(progress, [from, from + COPY_WINDOW], [26, 0]);
  const scaleX = useTransform(
    progress,
    [from + 0.04, from + 0.04 + RULE_WINDOW],
    [0, 1]
  );
  const markIn = useTransform(progress, [from, from + 0.06], [0, 1]);
  const markOut = useTransform(
    progress,
    [from + 0.02 + RULE_WINDOW, from + 0.08 + RULE_WINDOW],
    [0, 1]
  );

  return (
    <li className="process__step">
      <motion.div className="process__copy" style={{ opacity, y }}>
        <span className="process__label">{step.label}</span>
        <h3 className="process__stepTitle">{step.title}</h3>
        <p>{step.body}</p>
      </motion.div>

      <div className="process__rule">
        <ProcessMark className="process__mark" style={{ opacity: markIn }} />
        <span className="process__line">
          <motion.i style={{ scaleX }} />
        </span>
        <ProcessMark
          className="process__mark process__mark--end"
          style={{ opacity: markOut }}
        />
      </div>
    </li>
  );
}

function ProcessMedia() {
  const [playing, setPlaying] = useState(false);
  const playable = Boolean(processVideo.gumletId) || processVideo.src !== '';

  if (playable && playing && processVideo.gumletId) {
    return (
      <div className="process__media">
        <iframe
          className="process__video"
          src={gumletEmbedUrl(processVideo.gumletId)}
          title={processVideo.alt}
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
          loading="lazy"
          style={{ border: 'none', width: '100%', height: '100%', minHeight: 280 }}
        />
      </div>
    );
  }

  if (playable && playing && processVideo.src) {
    return (
      <div className="process__media">
        <video
          className="process__video"
          src={processVideo.src}
          poster={processVideo.poster}
          controls
          autoPlay
          playsInline
          preload="none"
        />
      </div>
    );
  }

  const inner = (
    <>
      <MediaImage
        src={processVideo.poster}
        alt={playable ? '' : processVideo.alt}
        width={1600}
        height={1000}
        sizes="(max-width: 900px) 100vw, 50vw"
        style={{ width: '100%', height: 'auto' }}
      />
      {playable ? (
        <span className="process__play">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M8 5.2v13.6L19 12z" fill="currentColor" />
          </svg>
          {processVideo.label}
        </span>
      ) : null}
    </>
  );

  return playable ? (
    <button
      type="button"
      className="process__media process__media--playable"
      onClick={() => setPlaying(true)}
    >
      {inner}
    </button>
  ) : (
    <figure className="process__media">{inner}</figure>
  );
}

export default function Process() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const [still, setStill] = useState(true);
  const { ref: topRef, shown } = useReveal<HTMLDivElement>();

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 901px)');
    const read = () => setStill(reduced || !mq.matches);
    read();
    mq.addEventListener('change', read);
    return () => mq.removeEventListener('change', read);
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
      className={`ahlV2Story process${still ? ' process--still' : ''}`}
      ref={sectionRef}
      aria-labelledby="process-title"
    >
      <div className="process__pin">
        <div className="process__in wrap">
          <div
            className="process__top"
            data-shown={shown ? 'true' : 'false'}
            ref={topRef}
          >
            <div className="process__lead">
              <h2 className="process__title" id="process-title">
                {processTitle.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h2>

              <a className="btn btn--lg process__cta" href="#contact-form">
                {processAction}
                <ArrowUpRight
                  className="btn__arrow"
                  size={16}
                  strokeWidth={2.4}
                  aria-hidden="true"
                />
              </a>
            </div>

            <ProcessMedia />
          </div>

          <ol className="process__steps">
            {processSteps.map((step, i) => (
              <Step key={step.title} step={step} index={i} progress={eased} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
