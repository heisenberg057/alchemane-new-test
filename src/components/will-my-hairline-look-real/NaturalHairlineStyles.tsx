'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';
import { useSnapCarousel } from '@/components/carousel/useSnapCarousel';

const cards = [
  {
    title: "Why People Choose This Style:",
    features: [
      { text: "Clean, groomed appearance." },
      { text: "Hairline extremely natural and sharp." },
      { text: "Perfect for styling hair fully backward." },
      { text: "Ideal for photos, videos, and high visibility events." }
    ]
  },
  {
    title: "What You Should Know:",
    features: [
      { text: "Requires weekly gluing of the front hairline." },
      { text: "Only liquid glue works; tapes will be visible." },
      { text: "Glue attracts dust over time and may darken if not cleaned." }
    ]
  },
  {
    title: "Ideal For Men Who:",
    features: [
      { text: "Prioritize a natural, visible hairline." },
      { text: "Want a polished, professional appearance." },
      { text: "Are active in high-visibility settings, such as events, or public speaking." },
      { text: "Don't mind regular maintenance to keep their look fresh and sharp." }
    ]
  },
  {
    title: "May Not Be the Right Choice If:",
    features: [
      { text: "You prefer low-maintenance options.", isNegative: true },
      { text: "Travel frequently and need a more hassle-free hair solution.", isNegative: true },
      { text: "Are sensitive to frequent touch-ups or hairline adjustments.", isNegative: true },
      { text: "Don't want the added commitment of maintaining the glued front area.", isNegative: true }
    ]
  }
];

const boldWords = new Set([
  'groomed', 'extremely', 'natural', 'fully', 'backward', 'photos', 'videos',
  'weekly', 'gluing', 'liquid', 'glue', 'works', 'attracts', 'dust', 'visible',
  'hairline', 'polished', 'professional', 'active', 'high-visibility', 'regular',
  'maintenance', 'prefer', 'low-maintenance', 'Travel', 'frequently', 'sensitive',
  'maintaining', 'glued'
]);

function BoldText({ text }: { text: string }) {
  return (
    <>
      {text.split(' ').map((word, i) => {
        const clean = word.replace(/[.,;:]/g, '');
        return boldWords.has(clean)
          ? <span key={i} className="font-bold">{word} </span>
          : word + ' ';
      })}
    </>
  );
}

function ArrowButton({
  direction,
  onClick,
  disabled,
}: {
  direction: 'left' | 'right';
  onClick: () => void;
  disabled: boolean;
}) {
  const arrowPath =
    direction === 'left'
      ? 'M21.334 24L13.334 16L21.334 8'
      : 'M13.334 24L21.334 16L13.334 8';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === 'left' ? 'Previous slide' : 'Next slide'}
      className="flex h-[56px] w-[56px] items-center justify-center rounded-full aspect-square"
    >
      {disabled ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56" fill="none">
          <circle opacity="0.7" cx="28" cy="28" r="28" fill="#E8EAED" />
          <g transform="translate(12, 12)">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d={arrowPath} stroke="#121212" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.3" />
            </svg>
          </g>
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56" fill="none">
          <circle cx="28" cy="28" r="28" fill={`url(#natural_hairline_styles_${direction})`} />
          <g transform="translate(12, 12)">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d={arrowPath} stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </g>
          <defs>
            <linearGradient
              id={`natural_hairline_styles_${direction}`}
              x1="3.02198"
              y1="-12.571"
              x2="68.6891"
              y2="3.21483"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#4686FE" />
              <stop offset="1" stopColor="#1769FF" />
            </linearGradient>
          </defs>
        </svg>
      )}
    </button>
  );
}

export const NaturalHairlineStyles = () => {
  const desktopRef = useRef<HTMLDivElement>(null);

  // ── Mobile state ──────────────────────────────────────────────────────────
  const {
    scrollRef: mobileRef,
    activeIndex: mobileIndex,
    canPrev: canMobilePrev,
    canNext: canMobileNext,
    scrollPrev: scrollMobilePrev,
    scrollNext: scrollMobileNext,
    scrollToIndex: scrollMobileTo,
  } = useSnapCarousel({
    itemSelector: '[data-card]',
    itemCount: cards.length,
  });

  // ── Desktop state ─────────────────────────────────────────────────────────
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);

  const updateDesktop = useCallback(() => {
    const el = desktopRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanLeft(el.scrollLeft > 1);
    setCanRight(el.scrollLeft < max - 1);
  }, []);

  useEffect(() => {
    const el = desktopRef.current;
    if (!el) return;
    updateDesktop();
    el.addEventListener('scroll', updateDesktop, { passive: true });
    window.addEventListener('resize', updateDesktop);
    return () => { el.removeEventListener('scroll', updateDesktop); window.removeEventListener('resize', updateDesktop); };
  }, [updateDesktop]);

  const scrollDesktop = (dir: 'left' | 'right') => {
    desktopRef.current?.scrollBy({ left: dir === 'left' ? -400 : 400, behavior: 'smooth' });
  };

  return (
    <AnimateOnScroll variant="fadeUp">
    <section className="py-20 md:py-[120px] bg-white overflow-hidden">
      <div className="pl-4 md:pl-10 xl:pl-[160px]">

        {/* Heading */}
        <h2 className="text-[#121212] text-[36px] md:text-[44px] font-extrabold leading-[1.2] tracking-[-0.5px] max-w-[640px] mb-12">
          HD Exposed Hairline — Brush <br />Back Hairstyle
        </h2>

        {/* ══ MOBILE carousel ══════════════════════════════════════════════ */}
        <div className="block md:hidden">
          <div
            ref={mobileRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory pr-4"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {cards.map((card, index) => (
              <div
                key={index}
                data-card=""
                className="flex h-[400px] w-[318px] min-w-[218px] flex-shrink-0 snap-start flex-col gap-5 rounded-[16px] border border-[#121212]/[0.08] bg-white p-5 shadow-[0px_8px_24px_0px_rgba(0,0,0,0.05)]"
                style={{
                  scrollSnapAlign: 'start',
                }}
              >
                <h3 className="text-[18px] font-bold leading-[1.3] tracking-[-0.25px] text-[#121212]">{card.title}</h3>
                <div className="flex flex-col gap-4">
                  {card.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="mt-0.5 h-5 w-5 flex-shrink-0">
                        {(feature as any).isNegative ? (
                          <div className="w-5 h-5 bg-[#EF4444] rounded-[4px] flex items-center justify-center">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M9 3L3 9M3 3L9 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </div>
                        ) : (
                          <div className="w-5 h-5 bg-[#22C55E] rounded-[4px] flex items-center justify-center">
                            <svg width="14" height="10" viewBox="0 0 14 10" fill="none"><path d="M12.3333 1L5 8.33333L1.66667 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </div>
                        )}
                      </div>
                      <p className="text-[15px] leading-[1.5] tracking-[-0.1px] text-[#121212]"><BoldText text={feature.text} /></p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <div className="w-[1px] flex-shrink-0" />
          </div>

          {/* Mobile controls: ← dots pill → */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <ArrowButton direction="left" onClick={scrollMobilePrev} disabled={!canMobilePrev} />

            <div
              className="flex items-center justify-center gap-[8px] flex-shrink-0"
              style={{ width: 152, height: 44, borderRadius: 24, background: 'rgba(232,234,237,0.72)', backdropFilter: 'blur(3.5px)', WebkitBackdropFilter: 'blur(3.5px)' }}
            >
              {cards.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollMobileTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  style={{
                    width: i === mobileIndex ? 32 : 8,
                    height: 8,
                    borderRadius: 999,
                    background: i === mobileIndex ? '#121212' : 'rgba(18,18,18,0.30)',
                    transition: 'all 300ms ease',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    flexShrink: 0,
                  }}
                />
              ))}
            </div>

            <ArrowButton direction="right" onClick={scrollMobileNext} disabled={!canMobileNext} />
          </div>
        </div>

        {/* ══ DESKTOP carousel ═════════════════════════════════════════════ */}
        <div className="hidden md:block">
          <div
            ref={desktopRef}
            className="flex gap-6 overflow-x-auto pb-6 pr-10 xl:pr-[160px]"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', scrollSnapType: 'x mandatory' }}
          >
            {cards.map((card, index) => (
              <div
                key={index}
                className="flex-shrink-0 bg-white rounded-[16px] border border-[#121212]/[0.08] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.05)] p-8 flex flex-col gap-6"
                style={{ width: 350, minWidth: 350, scrollSnapAlign: 'start' }}
              >
                <h3 className="text-[#121212] text-[20px] font-bold leading-[28px] tracking-[-0.25px]">{card.title}</h3>
                <div className="flex flex-col gap-5">
                  {card.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 mt-1">
                        {(feature as any).isNegative ? (
                          <div className="w-5 h-5 bg-[#EF4444] rounded-[4px] flex items-center justify-center">
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M9 3L3 9M3 3L9 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </div>
                        ) : (
                          <div className="w-5 h-5 bg-[#22C55E] rounded-[4px] flex items-center justify-center">
                            <svg width="14" height="10" viewBox="0 0 14 10" fill="none"><path d="M12.3333 1L5 8.33333L1.66667 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          </div>
                        )}
                      </div>
                      <p className="text-[#121212] text-[16px] leading-[24px] tracking-[-0.1px]"><BoldText text={feature.text} /></p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop nav — bottom right, blue until exhausted */}
          <div className="flex items-center gap-3 mt-8 pr-10 xl:pr-[160px] justify-end">
            <ArrowButton direction="left" onClick={() => scrollDesktop('left')} disabled={!canLeft} />
            <ArrowButton direction="right" onClick={() => scrollDesktop('right')} disabled={!canRight} />
          </div>
        </div>

      </div>
    </section>
    </AnimateOnScroll>
  );
};
