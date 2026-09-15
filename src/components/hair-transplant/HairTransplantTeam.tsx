'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { HT_TEAM_ASSETS } from './hairTransplantAssets';
import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';
import { useSnapCarousel } from '@/components/carousel/useSnapCarousel';

const surgeons = HT_TEAM_ASSETS;

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
      aria-label={direction === 'left' ? 'Previous surgeon' : 'Next surgeon'}
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

export const HairTransplantTeam = () => {
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
    itemCount: surgeons.length,
  });

  return (
    <AnimateOnScroll variant="fadeUp">
    <section className="bg-white py-[72px] md:py-[120px] px-4 md:px-10 xl:px-[160px]">
      <div className="max-w-[1440px] mx-auto">

        <h2 className="text-[26px] md:text-[44px] font-extrabold text-[#121212] mb-10 md:mb-14 text-center leading-[1.2] tracking-[-0.5px]">
          Meet Our Expert Team Of<br />
          Transplant Surgeons
        </h2>

        {/* ── Desktop: two cards side by side ── */}
        <div className="hidden md:flex justify-center gap-6">
          {surgeons.map((doctor, index) => (
            <div
              key={index}
              className="relative flex-shrink-0 rounded-2xl overflow-hidden"
              style={{ width: 544, aspectRatio: '533/436' }}
            >
              <Image
                src={doctor.desktop.url}
                alt={doctor.desktop.alt}
                fill
                className="object-cover object-center"
                sizes="544px"
              />
            </div>
          ))}
        </div>

        {/* ── Mobile: carousel ── */}
        <div className="md:hidden flex flex-col gap-[40px]">
          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-[16px] snap-x snap-mandatory px-[16px]"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {surgeons.map((doctor, index) => (
              <div
                key={index}
                data-card=""
                className="relative flex-shrink-0 w-[334px] max-w-[calc(100vw-32px)] rounded-[12px] overflow-hidden snap-center"
                style={{ aspectRatio: '163/204' }}
              >
                <Image
                  src={doctor.mobile.url}
                  alt={doctor.mobile.alt}
                  fill
                  className="object-cover object-center"
                  sizes="334px"
                />
              </div>
            ))}
          </div>

          {/* ── Controls ── */}
          <div className="flex items-center justify-center gap-[12px]">
            <ArrowButton
              direction="left"
              onClick={scrollPrev}
              disabled={!canPrev}
              gradientId="team-left"
            />
            <div
              className="flex items-center justify-center gap-[8px] flex-shrink-0"
              style={{
                width: 152, height: 44, borderRadius: 24,
                background: 'rgba(232,234,237,0.72)',
                backdropFilter: 'blur(3.5px)',
                WebkitBackdropFilter: 'blur(3.5px)',
              }}
            >
              {surgeons.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollToIndex(i)}
                  aria-label={`Go to surgeon ${i + 1}`}
                  style={{
                    width: i === activeIndex ? 32 : 8,
                    height: 8, borderRadius: 10, border: 'none',
                    padding: 0, cursor: 'pointer', flexShrink: 0,
                    background: i === activeIndex ? '#121212' : 'rgba(18,18,18,0.30)',
                    transition: 'all 300ms ease',
                  }}
                />
              ))}
            </div>
            <ArrowButton
              direction="right"
              onClick={scrollNext}
              disabled={!canNext}
              gradientId="team-right"
            />
          </div>
        </div>

      </div>
    </section>
    </AnimateOnScroll>
  );
};
