'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';
import { useSnapCarousel } from '@/components/carousel/useSnapCarousel';

const CARDS = [
  {
    id: 1,
    title: "India's #1 Top Experts",
    icon: '/assets/mlg6nkql-sfa7d6w.svg',
    content: (
      <>
        Trusted by thousands and featured in national media, we specialize in <span className="font-bold text-[#555555]">non-surgical hair systems</span> tailored to Indian men — blending perfectly with your face shape, hair texture, and lifestyle. Our systems use <span className="font-bold text-[#555555]">100% human hair</span> and are <span className="font-bold text-[#555555]">ISO certified</span> for safety and quality.
      </>
    ),
  },
  {
    id: 2,
    title: "Tailored with Technology",
    icon: '/assets/mlg6oa0k-ihlb0bt.svg',
    content: (
      <>
        From <span className="font-bold text-[#555555]">Invisible Hairline Sculpting™</span> to <span className="font-bold text-[#555555]">Nano Fusion Technology</span>, every system is crafted with advanced design and precision engineering for a seamless, natural look. Our <span className="font-bold text-[#555555]">Single-strand Implantation</span> technique customizes your hairline with unmatched detail.
      </>
    ),
  },
  {
    id: 3,
    title: "Celebrity-Trusted",
    icon: '/assets/mlg6obzx-ll3b0t6.svg',
    content: (
      <>
        Our systems are trusted by <span className="font-bold text-[#555555]">Bollywood actors</span> and public figures, designed for high-definition cameras — yet discreet in daily life. Lightweight, breathable, and <span className="font-bold text-[#555555]">virtually invisible</span> even up close. <span className="font-bold text-[#555555]">USA-manufactured</span> and <span className="font-bold text-[#555555]">doctor approved</span>.
      </>
    ),
  },
  {
    id: 4,
    title: "Genuine Advice",
    icon: '/assets/mlg6odnl-23rjov2.svg',
    content: (
      <>
        No pressure, no upselling. Just expert advice from professionals who care. We guide you to the right solution, with <span className="font-bold text-[#555555]">durability</span>, <span className="font-bold text-[#555555]">comfort</span>, and <span className="font-bold text-[#555555]">natural results</span> as our priority. We specialize in <span className="font-bold text-[#555555]">ultra-natural looking hairlines</span> that restore confidence and look truly undetectable.
      </>
    ),
  },
];

const OVERFLOW_TOLERANCE = 8;

function ArrowButton({
  direction,
  onClick,
  disabled,
}: {
  direction: 'left' | 'right';
  onClick: () => void;
  disabled: boolean;
}) {
  const arrowPath = direction === 'left'
    ? 'M18.666 24L10.666 16L18.666 8'
    : 'M13.334 24L21.334 16L13.334 8';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === 'left' ? 'Previous slide' : 'Next slide'}
      style={{
        width: 56,
        height: 56,
        border: 'none',
        padding: 0,
        flexShrink: 0,
        cursor: disabled ? 'default' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'transparent',
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56" fill="none">
        <defs>
          <linearGradient id={`why-choose-${direction}`} x1="3.02198" y1="-12.571" x2="68.6891" y2="3.21483" gradientUnits="userSpaceOnUse">
            <stop stopColor="#4686FE" />
            <stop offset="1" stopColor="#1769FF" />
          </linearGradient>
        </defs>
        <circle cx="28" cy="28" r="28" fill="#E8EAED" opacity={disabled ? 0.7 : 1} />
        {!disabled && <circle cx="28" cy="28" r="28" fill={`url(#why-choose-${direction})`} />}
        <svg x="12" y="12" width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path
            d={arrowPath}
            stroke={disabled ? 'rgba(18,18,18,0.4)' : 'white'}
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </svg>
    </button>
  );
}

export const WhyChooseAmericanHairline = () => {

  // ── Mobile state ──────────────────────────────────────────
  const {
    scrollRef: mobileScrollRef,
    activeIndex: mobileIndex,
    canPrev: canScrollMobilePrev,
    canNext: canScrollMobileNext,
    scrollPrev: scrollMobilePrev,
    scrollNext: scrollMobileNext,
    scrollToIndex: scrollMobileTo,
  } = useSnapCarousel({
    itemSelector: '[data-card]',
    itemCount: CARDS.length,
  });
  const [hasMobileOverflow, setHasMobileOverflow] = useState(false);

  useEffect(() => {
    const updateMobileOverflow = () => {
      const el = mobileScrollRef.current;
      if (!el) {
        setHasMobileOverflow(false);
        return;
      }

      setHasMobileOverflow(el.scrollWidth - el.clientWidth > OVERFLOW_TOLERANCE);
    };

    const frame = window.requestAnimationFrame(updateMobileOverflow);
    window.addEventListener('resize', updateMobileOverflow);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', updateMobileOverflow);
    };
  }, []);

  const goPrev = () => scrollMobilePrev();
  const goNext = () => scrollMobileNext();

  // ── Desktop state ─────────────────────────────────────────
  const desktopScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [hasDesktopOverflow, setHasDesktopOverflow] = useState(false);
  const getDesktopStep = useCallback(() => {
    const el = desktopScrollRef.current;
    if (!el) return 0;
    const card = el.querySelector('[data-desktop-card]') as HTMLElement | null;
    if (!card) return 0;
    const gap = parseFloat(window.getComputedStyle(el).columnGap || window.getComputedStyle(el).gap) || 22;
    return card.offsetWidth + gap;
  }, []);

  const updateDesktopScroll = useCallback(() => {
    const el = desktopScrollRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const hasOverflow = max > OVERFLOW_TOLERANCE;
    setHasDesktopOverflow(hasOverflow);
    setCanScrollLeft(hasOverflow && el.scrollLeft > OVERFLOW_TOLERANCE);
    setCanScrollRight(hasOverflow && el.scrollLeft < max - OVERFLOW_TOLERANCE);
  }, []);

  useEffect(() => {
    const el = desktopScrollRef.current;
    if (!el) return;
    updateDesktopScroll();
    el.addEventListener('scroll', updateDesktopScroll, { passive: true });
    window.addEventListener('resize', updateDesktopScroll);
    return () => {
      el.removeEventListener('scroll', updateDesktopScroll);
      window.removeEventListener('resize', updateDesktopScroll);
    };
  }, [updateDesktopScroll]);

  const scrollDesktop = (dir: 'left' | 'right') => {
    const el = desktopScrollRef.current;
    if (!el) return;
    const step = getDesktopStep();
    if (!step) return;
    const max = Math.max(el.scrollWidth - el.clientWidth, 0);
    const target = dir === 'left'
      ? Math.max(el.scrollLeft - step, 0)
      : Math.min(el.scrollLeft + step, max);
    el.scrollTo({ left: target, behavior: 'smooth' });
  };

  return (
    <AnimateOnScroll variant="fadeUp">
    <>
      {/* ══ MOBILE ══════════════════════════════════════════════ */}
      <div className="block md:hidden">
        <section className="py-[40px] bg-[#F5F6F7]">

          <h2 className="text-[26px] font-extrabold text-[#121212] leading-[120%] tracking-[-0.5px] mb-[24px] px-[16px]">
            Why Thousands Of Men<br />Choose American Hairline
          </h2>

          {/* Cards track — 1 card + spill of next */}
          <div
            ref={mobileScrollRef}
            className="flex gap-[12px] overflow-x-auto snap-x snap-mandatory px-[16px]"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {CARDS.map((card) => (
              <div
                key={card.id}
                data-card=""
                className="flex-shrink-0 snap-start bg-white rounded-[16px] border border-[#12121214] flex flex-col gap-[14px]"
                style={{
                  // viewport - px-16 both sides - 40px spill
                  width: 'calc(100vw - 32px - 40px)',
                  minWidth: 'calc(100vw - 32px - 40px)',
                  minHeight: 340,
                  padding: '24px 20px',
                  boxShadow: '0px 8px 24px 0px rgba(0,0,0,0.05)',
                  boxSizing: 'border-box',
                }}
              >
                <div className="flex flex-col gap-[10px]">
                  <div className="w-[44px] h-[44px] rounded-[12px] flex items-center justify-center" style={{ background: 'rgba(23,105,255,0.1)', padding: 8 }}>
                    <div className="w-[28px] h-[28px] relative">
                      <Image src={card.icon} alt={card.title} fill className="object-contain" />
                    </div>
                  </div>
                  <h3 className="text-[18px] font-bold text-[#121212] leading-[26px] tracking-[-0.4px] m-0">
                    {card.title}
                  </h3>
                </div>
                <p className="text-[14px] text-[#555555] leading-[22px] m-0">
                  {card.content}
                </p>
              </div>
            ))}
            {/* right spacer so last card doesn't stick to edge */}
            <div className="w-[1px] flex-shrink-0" />
          </div>

          {/* Mobile controls — left ghost | dots pill | right blue */}
          <div className="mt-[24px] flex w-full items-center justify-center gap-[16px] px-[16px]">

            {hasMobileOverflow && (
              <ArrowButton direction="left" onClick={goPrev} disabled={!canScrollMobilePrev} />
            )}

            {/* Dots pill */}
            <div
              className="flex min-w-[152px] flex-shrink-0 items-center justify-center gap-[8px]"
              style={{
                width: '152px',
                height: '44px',
                borderRadius: '24px',
                background: '#E8EAED',
                border: '1px solid rgba(18,18,18,0.08)',
                boxShadow: '0 1px 2px rgba(18,18,18,0.04)',
                position: 'relative',
                zIndex: 1,
              }}
            >
              {CARDS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollMobileTo(i)}
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
                    display: 'block',
                  }}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            {hasMobileOverflow && (
              <ArrowButton direction="right" onClick={goNext} disabled={!canScrollMobileNext} />
            )}

          </div>
        </section>
      </div>

      {/* ══ DESKTOP ═════════════════════════════════════════════ */}
      <div className="hidden md:block">
        <section className="bg-[#F5F6F7] py-[80px] lg:py-[120px]">
          <div className="max-w-[1440px] mx-auto px-[60px] lg:px-[160px]">

            <h2 className="text-[40px] lg:text-[44px] font-extrabold text-[#121212] leading-tight lg:leading-[53px] tracking-[-0.5px] mb-[44px]">
              Why Thousands Of Men Choose American Hairline
            </h2>

            {/* Cards — 3 visible + peek of 4th, snap per card, arrows nav */}
            <div
              ref={desktopScrollRef}
              className="flex gap-[22px] overflow-x-auto pb-[32px]"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                scrollSnapType: 'x mandatory',
                WebkitOverflowScrolling: 'touch',
              }}
            >
              {CARDS.map((card) => (
                <div
                  key={card.id}
                  data-desktop-card=""
                  className="flex-shrink-0 bg-white rounded-[16px] border border-[#12121214] flex flex-col gap-[16px]"
                  style={{
                    // Four cards should fit the desktop viewport cleanly with no artificial whitespace scroll.
                    width: 'calc((100% - 66px) / 4)',
                    minWidth: 'calc((100% - 66px) / 4)',
                    minHeight: 410,
                    padding: 31,
                    boxShadow: '0px 8px 24px 0px rgba(0,0,0,0.05)',
                    boxSizing: 'border-box',
                    scrollSnapAlign: 'start',
                  }}
                >
                  <div className="flex flex-col gap-[12px]">
                    <div className="w-[52px] h-[52px] rounded-[12px] flex items-center justify-center" style={{ background: 'rgba(23,105,255,0.1)' }}>
                      <div className="w-[34px] h-[34px] relative">
                        <Image src={card.icon} alt={card.title} fill className="object-contain" />
                      </div>
                    </div>
                    <h3 className="text-[26px] font-bold text-[#121212] leading-[34px] tracking-[-0.5px] m-0">
                      {card.title}
                    </h3>
                  </div>
                  <p className="text-[18px] text-[#555555] leading-[29px] m-0">
                    {card.content}
                  </p>
                </div>
              ))}
            </div>

            {/* Desktop nav — bottom right, blue until exhausted */}
            {hasDesktopOverflow && (
              <div className="flex justify-center lg:justify-end items-center gap-[12px]">
                <ArrowButton direction="left" onClick={() => scrollDesktop('left')} disabled={!canScrollLeft} />
                <ArrowButton direction="right" onClick={() => scrollDesktop('right')} disabled={!canScrollRight} />
              </div>
            )}

          </div>
        </section>
      </div>
    </>
    </AnimateOnScroll>
  );
};
