'use client';

import React, { useRef, useState, useEffect } from 'react';
import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';
import { useSnapCarousel } from '@/components/carousel/useSnapCarousel';
import { LazyGumletEmbed } from '@/components/video/LazyGumletEmbed';

const CAROUSEL_ITEMS = [
  'https://play.gumlet.io/embed/69dc87687e5487dd1d91c6b9?background=false&autoplay=false&loop=false&disable_player_controls=false', // t1
  'https://play.gumlet.io/embed/69dc879b7e5487dd1d91cb18?background=false&autoplay=false&loop=false&disable_player_controls=false', // t2
  'https://play.gumlet.io/embed/69dc879be556529568bbc72d?background=false&autoplay=false&loop=false&disable_player_controls=false', // t3
  'https://play.gumlet.io/embed/69dc8768c6b8ccb79da81316?background=false&autoplay=false&loop=false&disable_player_controls=false', // v1
  'https://play.gumlet.io/embed/69dc8768c6b8ccb79da81338?background=false&autoplay=false&loop=false&disable_player_controls=false', // v2
  'https://play.gumlet.io/embed/69dc87687e5487dd1d91c69a?background=false&autoplay=false&loop=false&disable_player_controls=false', // v3
  'https://play.gumlet.io/embed/69dc8768c6b8ccb79da81314?background=false&autoplay=false&loop=false&disable_player_controls=false', // v4
  'https://play.gumlet.io/embed/69dc8768c6b8ccb79da81336?background=false&autoplay=false&loop=false&disable_player_controls=false', // v5
  'https://play.gumlet.io/embed/69dc87687e5487dd1d91c6a6?background=false&autoplay=false&loop=false&disable_player_controls=false', // v6
  'https://play.gumlet.io/embed/69dc87687e5487dd1d91c6ab?background=false&autoplay=false&loop=false&disable_player_controls=false', // v7
  'https://play.gumlet.io/embed/69dc8768e556529568bbc2c3?background=false&autoplay=false&loop=false&disable_player_controls=false', // v8
  'https://play.gumlet.io/embed/69dc8768c6b8ccb79da8133d?background=false&autoplay=false&loop=false&disable_player_controls=false', // v9
];

const OVERFLOW_TOLERANCE = 8;

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

export const WorldsFinestHairSystems = () => {
  // Desktop refs
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [hasDesktopOverflow, setHasDesktopOverflow] = useState(false);
  const [canScrollDesktopPrev, setCanScrollDesktopPrev] = useState(false);
  const [canScrollDesktopNext, setCanScrollDesktopNext] = useState(false);

  // Mobile state & refs
  // Use first 8 items for mobile to fit dots nicely
  const mobileItems = CAROUSEL_ITEMS.slice(0, 8);
  const {
    scrollRef: mobileScrollRef,
    activeIndex: mobileIndex,
    canPrev: canScrollMobilePrev,
    canNext: canScrollMobileNext,
    scrollPrev: goMobilePrev,
    scrollNext: goMobileNext,
    scrollToIndex: scrollMobileTo,
  } = useSnapCarousel({
    itemSelector: '[data-world-mobile-slide]',
    itemCount: mobileItems.length,
  });

  useEffect(() => {
    const updateDesktopScrollState = () => {
      const container = scrollContainerRef.current;
      if (!container) {
        setHasDesktopOverflow(false);
        setCanScrollDesktopPrev(false);
        setCanScrollDesktopNext(false);
        return;
      }

      const maxScrollLeft = Math.max(container.scrollWidth - container.clientWidth, 0);
      const hasOverflow = maxScrollLeft > OVERFLOW_TOLERANCE;

      setHasDesktopOverflow(hasOverflow);
      setCanScrollDesktopPrev(hasOverflow && container.scrollLeft > OVERFLOW_TOLERANCE);
      setCanScrollDesktopNext(hasOverflow && container.scrollLeft < maxScrollLeft - OVERFLOW_TOLERANCE);
    };

    const container = scrollContainerRef.current;
    if (!container) return undefined;

    const frame = window.requestAnimationFrame(updateDesktopScrollState);
    container.addEventListener('scroll', updateDesktopScrollState, { passive: true });
    window.addEventListener('resize', updateDesktopScrollState);

    return () => {
      window.cancelAnimationFrame(frame);
      container.removeEventListener('scroll', updateDesktopScrollState);
      window.removeEventListener('resize', updateDesktopScrollState);
    };
  }, []);

  // Desktop scroll logic
  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const hasMobileOverflow = mobileItems.length > 1;

  return (
    <AnimateOnScroll variant="fadeUp">
    <>
      {/* MOBILE VERSION */}
      <div className="block md:hidden">
        <section className="py-[40px] bg-[#f5f6f7] overflow-hidden">
          <div className="pl-[28px]">

            {/* Heading */}
            <h2 style={{
              color: '#121212',
              fontSize: '26px',
              fontWeight: 800,
              lineHeight: '120%',
              letterSpacing: '-0.5px',
              textTransform: 'capitalize',
              maxWidth: '334px',
              marginBottom: '24px',
            }}>
              World's Finest Thinnest Hair Systems
            </h2>

            {/* Cards Track Container */}
            <div
              ref={mobileScrollRef}
              className="flex snap-x snap-mandatory gap-[12px] overflow-x-auto pr-[28px] pb-2 scroll-smooth"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
                overscrollBehaviorX: 'contain',
              }}
            >
                {mobileItems.map((src, index) => (
                  <div
                    key={index}
                    data-world-mobile-slide=""
                    className="snap-start"
                    style={{ flexShrink: 0, width: '334px' }}
                  >

                    {/* Video Embed — 4:5 ratio */}
                    <div style={{
                      position: 'relative',
                      width: '334px',
                      aspectRatio: '4/5',
                      borderRadius: '16px',
                      overflow: 'hidden',
                    }}>
                      <LazyGumletEmbed
                        title={`World's finest hair system sample ${index + 1}`}
                        embedSrc={src}
                        rootMargin="120px 0px"
                        iframePointerEvents="none"
                        placeholderLabel="Video loads when this card is near."
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="mt-[24px] flex w-full items-center justify-center gap-[16px] px-[16px]">
            {hasMobileOverflow && (
              <ArrowButton
                direction="left"
                onClick={goMobilePrev}
                disabled={!canScrollMobilePrev}
                gradientId="world-mobile-left"
              />
            )}

            <div
              className="flex min-w-[152px] items-center justify-center gap-[8px] flex-shrink-0"
              style={{
                width: '152px',
                height: '44px',
                borderRadius: '24px',
                background: 'rgba(232, 234, 237, 0.72)',
                backdropFilter: 'blur(3.5px)',
              }}
            >
              {mobileItems.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollMobileTo(i)}
                  style={{
                    width: i === mobileIndex ? '32px' : '8px',
                    height: '8px',
                    borderRadius: '10px',
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

            {hasMobileOverflow && (
              <ArrowButton
                direction="right"
                onClick={goMobileNext}
                disabled={!canScrollMobileNext}
                gradientId="world-mobile-right"
              />
            )}
          </div>
        </section>
      </div>

      {/* DESKTOP VERSION */}
      <div className="hidden md:block">
        <section className="bg-[#f5f6f7] py-[60px] md:py-[80px] lg:py-[120px]">

          {/* ROW 1: Heading — centered container */}
          <div className="max-w-[1440px] mx-auto px-[20px] md:px-[60px] lg:px-[160px]">
            <h2 className="text-[32px] md:text-[44px] font-extrabold leading-tight lg:leading-[53px] tracking-[-0.5px] text-[#121212] w-full lg:w-[463px] mb-[32px] lg:mb-[44px] text-center lg:text-left">
              World's Finest Thinnest Hair Systems
            </h2>
          </div>

          {/* ROW 2: Carousel — full width, left-padded to match heading */}
          <div className="relative mb-[32px] overflow-hidden">
            <div
              ref={scrollContainerRef}
              className="flex gap-[16px] lg:gap-[22px] overflow-x-auto pb-[20px]"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                paddingLeft: 'max(60px, calc((100vw - 1440px) / 2 + 160px))',
              }}
            >
              {CAROUSEL_ITEMS.map((src, index) => (
                <div
                  key={index}
                  className="relative flex-shrink-0 rounded-[12px] overflow-hidden shadow-[0px_4px_12px_0px_rgba(0,0,0,0.15)]"
                  style={{
                    width: '260px',
                    aspectRatio: '4/5',
                  }}
                >
                  <LazyGumletEmbed
                    title={`World's finest hair system sample ${index + 1}`}
                    embedSrc={src}
                    rootMargin="0px 0px 80px 0px"
                    intersectionThreshold={0.55}
                    placeholderLabel="Video loads when this card is mostly in view"
                  />
                </div>
              ))}

              {/* Right spacer */}
              <div className="flex-shrink-0 w-[20px] lg:w-[140px]" />
            </div>

            {/* Right fade gradient */}
            <div
              className="absolute top-0 right-0 bottom-[20px] w-[200px] pointer-events-none z-10"
              style={{ background: 'linear-gradient(to right, transparent, #f5f6f7)' }}
            />
          </div>

          {/* ROW 3: Nav buttons */}
          <div className="max-w-[1440px] mx-auto px-[20px] md:px-[60px] lg:px-[160px]">
            {hasDesktopOverflow && (
              <div className="flex justify-center lg:justify-end items-center gap-[12px]">
                <ArrowButton
                  direction="left"
                  onClick={() => scroll('left')}
                  disabled={!canScrollDesktopPrev}
                  gradientId="world-desktop-left"
                />
                <ArrowButton
                  direction="right"
                  onClick={() => scroll('right')}
                  disabled={!canScrollDesktopNext}
                  gradientId="world-desktop-right"
                />
              </div>
            )}
          </div>

        </section>
      </div>
    </>
    </AnimateOnScroll>
  );
};

export default WorldsFinestHairSystems;
