'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { HT_BENEFITS_ASSETS } from './hairTransplantAssets';
import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';
import { useSnapCarousel } from '@/components/carousel/useSnapCarousel';

const benefits = HT_BENEFITS_ASSETS;

function ArrowButton({
  direction, onClick, disabled, gradientId,
}: {
  direction: 'left' | 'right'; onClick: () => void; disabled: boolean; gradientId: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === 'left' ? 'Previous benefit' : 'Next benefit'}
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
            d={direction === 'left' ? 'M18.666 24L10.666 16L18.666 8' : 'M13.334 24L21.334 16L13.334 8'}
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

export const HairTransplantBenefits = () => {
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
    itemCount: benefits.length,
  });

  return (
    <AnimateOnScroll variant="fadeUp">
    <section className="bg-[#F5F6F7] py-[72px] md:py-[120px] px-4 md:px-10 xl:px-[160px]">
      <div className="max-w-[1440px] mx-auto">

        <h2 className="text-[26px] md:text-[44px] font-extrabold text-dark leading-[1.2] tracking-[-0.5px] mb-10 md:mb-14">
          Why Combination Method Is<br />
          The Best Solution
        </h2>

        {/* ── Desktop: 3 cards at 352×644 (41/75) ── */}
        <div className="hidden md:flex gap-6 justify-center">
          {benefits.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl overflow-hidden flex flex-col flex-shrink-0"
              style={{ width: 352, aspectRatio: '41/75' }}
            >
              {/* Text block — top */}
              <div className="px-6 pt-6 pb-4 flex-shrink-0">
                <h3 className="text-[20px] font-bold text-dark mb-2 leading-[1.3] tracking-[-0.3px]">
                  {item.title}
                </h3>
                <p className="text-[#555555] text-[15px] leading-[1.6]">
                  {item.desc}
                </p>
              </div>

              {/* Image — fills remaining height, anchored toward top */}
              <div className="relative flex-1 w-full overflow-hidden">
                <Image
                  src={item.desktop.url}
                  alt={item.desktop.alt}
                  fill
                  className="object-cover"
                  style={{ objectPosition: 'center 100%' }}
                  sizes="352px"
                />
              </div>
            </div>
          ))}
        </div>

        {/* ── Mobile: horizontal carousel (Achievements sizing) ── */}
        <div className="md:hidden flex flex-col gap-6">
          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-[16px] snap-x snap-mandatory px-[16px]"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {benefits.map((item, index) => (
              <div
                key={index}
                data-card=""
                className="bg-white rounded-[12px] overflow-hidden flex flex-col flex-shrink-0 snap-center shadow-[0px_8px_24px_0px_rgba(0,0,0,0.05)]"
                style={{ width: 260, height: 380, aspectRatio: '13/19' }}
              >
                {/* Text block — top */}
                <div className="px-5 pt-5 pb-3 flex-shrink-0">
                  <h3 className="text-[18px] font-bold text-dark mb-2 leading-[1.3] tracking-[-0.2px]">
                    {item.title}
                  </h3>
                  <p className="text-[#555555] text-[14px] leading-[1.45] tracking-[-0.1px]">
                    {item.desc}
                  </p>
                </div>

                {/* Image — fills remaining height */}
                <div className="relative flex-1 w-full overflow-hidden">
                  <Image
                    src={item.mobile.url}
                    alt={item.mobile.alt}
                    fill
                    className="object-cover object-[center_100%]"
                    sizes="260px"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3">
            <ArrowButton
              direction="left"
              onClick={scrollPrev}
              disabled={!canPrev}
              gradientId="ht-ben-left"
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
              {benefits.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollToIndex(i)}
                  aria-label={`Go to benefit ${i + 1}`}
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
              gradientId="ht-ben-right"
            />
          </div>
        </div>

      </div>
    </section>
    </AnimateOnScroll>
  );
};
