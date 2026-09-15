'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { SMP_RESULTS_ASSETS } from './smpResultsAssets';
import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';
import { useSnapCarousel } from '@/components/carousel/useSnapCarousel';

const results = SMP_RESULTS_ASSETS;

function ArrowButton({
  direction,
  onClick,
  disabled,
  gradientId,
}: {
  direction: 'left' | 'right';
  onClick: () => void;
  disabled: boolean;
  gradientId: string;
}) {
  const arrowPath = direction === 'left'
    ? 'M18.666 24L10.666 16L18.666 8'
    : 'M13.334 24L21.334 16L13.334 8';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === 'left' ? 'Previous result' : 'Next result'}
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

export const SMPResults = () => {
  const {
    scrollRef,
    activeIndex,
    canPrev,
    canNext,
    scrollPrev,
    scrollNext,
    scrollToIndex,
  } = useSnapCarousel({
    itemSelector: '[data-card]',
    itemCount: results.length,
  });

  return (
    <AnimateOnScroll variant="fadeUp">
    <section className="bg-[#F5F6F7] py-[72px] md:py-[120px] w-full">
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-10 xl:px-[160px]">

        {/* Heading */}
        <h2 className="text-[26px] md:text-[44px] font-extrabold text-dark leading-[1.2] tracking-[-0.5px] max-w-[600px] mb-8 md:mb-12">
          Real Results That Showcase True Transformations
        </h2>

        {/* Scroll container */}
        <div
          ref={scrollRef}
          className="w-full overflow-x-auto flex gap-4 md:gap-5 snap-x snap-mandatory pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {results.map((item, index) => (
            <div
              key={item.id}
              data-card=""
              className="flex-shrink-0 snap-center rounded-2xl overflow-hidden"
              style={{ width: 'clamp(280px, 68vw, 320px)', aspectRatio: '4/5' }}
            >
              {/* Mobile image */}
              <div className="relative w-full h-full md:hidden">
                <Image
                  src={item.mobile.url}
                  alt={item.alt}
                  fill
                  className="object-cover object-center"
                  sizes="clamp(280px, 68vw, 320px)"
                  loading={index < 2 ? 'eager' : 'lazy'}
                />
              </div>
              {/* Desktop image */}
              <div className="relative w-full h-full hidden md:block">
                <Image
                  src={item.desktop.url}
                  alt={item.alt}
                  fill
                  className="object-cover object-center"
                  sizes="368px"
                  loading={index < 3 ? 'eager' : 'lazy'}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Desktop arrows — below gallery, right-aligned */}
        <div className="hidden md:flex justify-end gap-3 mt-8">
          <ArrowButton direction="left" onClick={scrollPrev} disabled={!canPrev} gradientId="smp-res-desk-left" />
          <ArrowButton direction="right" onClick={scrollNext} disabled={!canNext} gradientId="smp-res-desk-right" />
        </div>

        {/* Mobile navigation */}
        <div className="flex md:hidden items-center justify-center gap-[12px] mt-6">
          <ArrowButton direction="left" onClick={scrollPrev} disabled={!canPrev} gradientId="smp-res-mob-left" />
          <div
            className="flex items-center justify-center gap-[8px] flex-shrink-0"
            style={{ width: 152, height: 44, borderRadius: 24, background: 'rgba(232,234,237,0.72)', backdropFilter: 'blur(3.5px)', WebkitBackdropFilter: 'blur(3.5px)' }}
          >
            {results.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToIndex(i)}
                aria-label={`Go to result ${i + 1}`}
                style={{
                  width: i === activeIndex ? 32 : 8,
                  height: 8,
                  borderRadius: 10,
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  flexShrink: 0,
                  background: i === activeIndex ? '#121212' : 'rgba(18,18,18,0.30)',
                  transition: 'all 300ms ease',
                }}
              />
            ))}
          </div>
          <ArrowButton direction="right" onClick={scrollNext} disabled={!canNext} gradientId="smp-res-mob-right" />
        </div>

      </div>
    </section>
    </AnimateOnScroll>
  );
};
