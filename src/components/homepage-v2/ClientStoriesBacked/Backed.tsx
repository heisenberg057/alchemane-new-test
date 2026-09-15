'use client';

import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react';
import { Star, StarHalf } from 'lucide-react';
import { MediaImage } from '@/components/media/MediaImage';
import { backedFoot, backedProof, backedTitle } from './content';
import { usePrefersReducedMotion, useReveal } from '../HeroSecret/hooks';

function Stars({ rating, lit }: { rating: number; lit: number }) {
  const whole = Math.floor(rating);
  const half = rating - whole >= 0.25;
  const glyphs = whole + (half ? 1 : 0);

  return (
    <span className="backed__stars" aria-hidden="true">
      {Array.from({ length: glyphs }, (_, i) => {
        const Glyph = i < whole ? Star : StarHalf;
        return (
          <Glyph
            key={i}
            size={17}
            strokeWidth={0}
            fill="currentColor"
            data-lit={i < lit ? 'true' : 'false'}
          />
        );
      })}
    </span>
  );
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

function useCount(target: number, run: boolean, ms = 1100) {
  const reduced = usePrefersReducedMotion();
  const [value, setValue] = useState(reduced ? target : 0);

  useEffect(() => {
    if (reduced) {
      setValue(target);
      return;
    }
    if (!run) return;

    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ms);
      setValue(target * easeOut(t));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, run, ms, reduced]);

  return value;
}

function ProofCard({
  item,
  run,
}: {
  item: (typeof backedProof)[number];
  run: boolean;
}) {
  const count = useCount(item.count, run);
  const cardRef = useRef<HTMLLIElement>(null);

  const onMove = useCallback((e: PointerEvent<HTMLLIElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`);
    el.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`);
  }, []);

  const onLeave = useCallback(() => {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty('--mx', '50%');
    el.style.setProperty('--my', '0%');
  }, []);

  const decimals = 'decimals' in item ? item.decimals : undefined;
  const suffix = 'suffix' in item ? item.suffix : undefined;
  const unit = 'unit' in item ? item.unit : undefined;
  const stars = 'stars' in item ? item.stars : undefined;
  const shown = decimals ? count.toFixed(decimals) : Math.round(count);

  return (
    <li
      className="backed__card"
      ref={cardRef}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <span className="backed__spot" aria-hidden="true" />

      <div className="backed__top">
        <MediaImage
          className="backed__icon"
          src={item.icon}
          alt={item.alt}
          width={168}
          height={168}
          sizes="168px"
        />
        <span className="backed__note">{item.note}</span>
      </div>

      <p className="backed__value">
        <span aria-hidden="true">
          {shown}
          {suffix ?? ''}
        </span>
        <span className="sr-only">{item.value}</span>
        {unit ? <span className="backed__unit">{unit}</span> : null}
        {stars ? (
          <Stars
            rating={stars}
            lit={Math.ceil((count / item.count) * Math.ceil(stars))}
          />
        ) : null}
      </p>

      <p className="backed__label">{item.label}</p>
    </li>
  );
}

export default function Backed() {
  const { ref, shown } = useReveal<HTMLDivElement>();

  return (
    <section className="ahlV2Voices backed" aria-labelledby="backed-title">
      <div className="wrap">
        <div
          className="backed__panel"
          data-shown={shown ? 'true' : 'false'}
          ref={ref}
        >
          <div className="backed__in">
            <h2 className="backed__title" id="backed-title">
              {backedTitle.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h2>

            <ul className="backed__proof">
              {backedProof.map((item) => (
                <ProofCard key={item.label} item={item} run={shown} />
              ))}
            </ul>

            <p className="backed__foot">{backedFoot}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
