'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ACHIEVEMENT_ASSETS } from './achievementsAssets';
import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';
import { useSnapCarousel } from '@/components/carousel/useSnapCarousel';

const achievements = ACHIEVEMENT_ASSETS;

function ArrowButton({
  direction, onClick, disabled, gradientId,
}: {
  direction: 'left' | 'right'; onClick: () => void; disabled: boolean; gradientId: string;
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
        width: 56, height: 56, border: 'none', padding: 0, flexShrink: 0,
        cursor: disabled ? 'default' : 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'transparent',
        transition: 'transform 0.2s ease, opacity 0.2s ease',
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56" fill="none">
        <defs>
          <linearGradient id={gradientId} x1="3.02198" y1="-12.571" x2="68.6891" y2="3.21483" gradientUnits="userSpaceOnUse">
            <stop stopColor="#4686FE" />
            <stop offset="1" stopColor="#1769FF" />
          </linearGradient>
        </defs>
        <circle cx="28" cy="28" r="28" fill="#E8EAED" opacity={disabled ? 0.7 : 1} />
        {!disabled && <circle cx="28" cy="28" r="28" fill={`url(#${gradientId})`} />}
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

export const Achievements = () => {

  /* ── Desktop: hover-accordion + arrow nav ── */
  const [activeIndex, setActiveIndex] = useState(0);
  const desktopScrollRef = useRef<HTMLDivElement>(null);

  const getDesktopStep = () => {
    const container = desktopScrollRef.current;
    if (!container) return 0;
    const firstCard = container.querySelector<HTMLElement>('[data-card]');
    if (!firstCard) return 0;
    const gap = parseFloat(window.getComputedStyle(container).columnGap) || 0;
    return firstCard.offsetWidth + gap;
  };

  useEffect(() => {
    const container = desktopScrollRef.current;
    if (!container) return;
    const handleScroll = () => {
      const step = getDesktopStep();
      if (!step) return;
      const index = Math.round(container.scrollLeft / step);
      setActiveIndex(Math.min(Math.max(index, 0), achievements.length - 1));
    };
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const desktopScrollTo = (index: number) => {
    const clamped = Math.min(Math.max(index, 0), achievements.length - 1);
    setActiveIndex(clamped);
    if (desktopScrollRef.current) {
      const step = getDesktopStep();
      desktopScrollRef.current.scrollTo({ left: clamped * step, behavior: 'smooth' });
    }
  };

  /* ── Mobile: standard scroll carousel ── */
  const {
    scrollRef: mobileScrollRef,
    activeIndex: mobileIndex,
    canPrev: canScrollMobilePrev,
    canNext: canScrollMobileNext,
    scrollPrev: scrollMobilePrev,
    scrollNext: scrollMobileNext,
    scrollToIndex: mobileScrollTo,
  } = useSnapCarousel({
    itemSelector: '[data-mobile-card]',
    itemCount: achievements.length,
  });

  return (
    <AnimateOnScroll variant="fadeUp">
    <>
      {/* ══════════════════════════════════════
          MOBILE
      ══════════════════════════════════════ */}
      <div className="block md:hidden">
        <section className="py-[72px] bg-white w-full">

          <h2 className="text-[26px] font-extrabold text-[#121212] pl-[16px] mb-[32px] text-left tracking-[-0.5px] leading-[31px]">
            Our Big Achievements
          </h2>

          {/* Scroll container */}
          <div
            ref={mobileScrollRef}
            className="flex gap-[16px] overflow-x-auto snap-x snap-mandatory px-[16px]"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {achievements.map((item, index) => (
              <div
                key={item.id}
                data-mobile-card=""
                className="relative flex-shrink-0 w-[334px] max-w-[calc(100vw-32px)] aspect-[334/460] rounded-[12px] overflow-hidden snap-center"
              >
                <Image
                  src={item.mobileImageSrc}
                  alt={item.alt}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 366px) calc(100vw - 32px), 334px"
                />
              </div>
            ))}
            <div className="w-[1px] flex-shrink-0" />
          </div>

          {/* Mobile controls */}
          <div className="mt-[40px] flex items-center justify-center gap-[12px] px-[16px]">
            <ArrowButton
              direction="left"
              onClick={scrollMobilePrev}
              disabled={!canScrollMobilePrev}
              gradientId="ach-mob-left"
            />
            <div
              className="flex min-w-0 items-center justify-center gap-[8px] flex-shrink-0"
              style={{ width: 152, height: 44, borderRadius: 24, background: 'rgba(232,234,237,0.72)', backdropFilter: 'blur(3.5px)' }}
            >
              {achievements.map((_, i) => (
                <button key={i} onClick={() => mobileScrollTo(i)} style={{
                  width: i === mobileIndex ? 32 : 8, height: 8, borderRadius: 10,
                  border: 'none', padding: 0, cursor: 'pointer', flexShrink: 0,
                  background: i === mobileIndex ? '#121212' : 'rgba(18,18,18,0.30)',
                  transition: 'all 300ms ease',
                }} />
              ))}
            </div>
            <ArrowButton
              direction="right"
              onClick={scrollMobileNext}
              disabled={!canScrollMobileNext}
              gradientId="ach-mob-right"
            />
          </div>

        </section>
      </div>

      {/* ══════════════════════════════════════
          DESKTOP
      ══════════════════════════════════════ */}
      <div className="hidden md:block">
        <section className="py-[60px] md:py-[80px] lg:py-20 bg-white overflow-hidden">

          {/* Heading */}
          <div className="max-w-[1440px] mx-auto px-[20px] md:px-[60px] lg:px-[160px]">
            <h2 className="text-[32px] md:text-[48px] lg:text-5xl font-extrabold text-dark mb-[32px] lg:mb-12 text-center lg:text-left">
              Our Big Achievements
            </h2>
          </div>

          {/* Gallery row */}
          <div className="relative mb-[32px]">
            <div
              ref={desktopScrollRef}
              className="flex gap-3 h-[418px] overflow-x-auto"
              style={{
                paddingLeft: 'max(60px, calc((100vw - 1440px) / 2 + 160px))',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {achievements.map((item, index) => (
                <div
                  key={item.id}
                  data-card=""
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`relative rounded-2xl overflow-hidden transition-all duration-500 ease-in-out cursor-pointer flex-shrink-0 h-full ${
                    activeIndex === index
                      ? 'w-[560px] lg:w-[660px] xl:w-[740px]'
                      : 'w-[120px] lg:w-[160px] xl:w-[184px]'
                  }`}
                >
                  <Image
                    src={item.desktopImageSrc}
                    alt={item.alt}
                    fill
                    className={`object-cover object-center transition-transform duration-700 ${activeIndex === index ? 'scale-100' : 'scale-110'}`}
                    sizes={activeIndex === index
                      ? '(min-width: 1280px) 740px, (min-width: 1024px) 660px, 560px'
                      : '(min-width: 1280px) 184px, (min-width: 1024px) 160px, 120px'
                    }
                  />
                </div>
              ))}
              <div className="flex-shrink-0 w-[120px]" />
            </div>

            {/* Right fade */}
            <div
              className="absolute top-0 right-0 bottom-0 w-[200px] pointer-events-none z-10"
              style={{ background: 'linear-gradient(to right, transparent, #ffffff)' }}
            />
          </div>

          {/* Desktop nav buttons */}
          <div className="max-w-[1440px] mx-auto px-[20px] md:px-[60px] lg:px-[160px]">
            <div className="flex justify-end gap-3">
              <ArrowButton
                direction="left"
                onClick={() => desktopScrollTo(activeIndex - 1)}
                disabled={activeIndex === 0}
                gradientId="ach-desk-left"
              />
              <ArrowButton
                direction="right"
                onClick={() => desktopScrollTo(activeIndex + 1)}
                disabled={activeIndex === achievements.length - 1}
                gradientId="ach-desk-right"
              />
            </div>
          </div>

        </section>
      </div>
    </>
    </AnimateOnScroll>
  );
};
