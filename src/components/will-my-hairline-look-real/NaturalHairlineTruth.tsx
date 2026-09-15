'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { useSnapCarousel } from '@/components/carousel/useSnapCarousel';

const cards = [
  {
    title: 'Why People Choose This Style:',
    items: [
      { bold: 'extremely natural', text: 'Hairline {bold} and sharp.' },
      { bold: 'groomed appearance.', text: 'Clean, {bold}' },
      { bold: 'fully backward.', text: 'Perfect for styling hair {bold}' },
      { bold: 'photos, videos,', text: 'Ideal for {bold} and high-visibility events.' },
    ],
  },
  {
    title: 'What You Should Know:',
    items: [
      { bold: 'weekly gluing', text: 'Requires {bold} on the front hairline.' },
      { bold: 'liquid glue work', text: 'Only {bold} — tapes will be visible.' },
      { bold: 'Glue attracts dust', text: '{bold} over time and may darken if not cleaned.' },
    ],
  },
  {
    title: 'Best For:',
    items: [
      { bold: 'confident', text: 'Men who are {bold} about their look.' },
      { bold: 'active lifestyle', text: 'Those with an {bold} who want freedom.' },
      { bold: 'professional settings', text: 'Great for {bold} and social events.' },
      { bold: 'brush-back hairstyles', text: 'Anyone who loves {bold}.' },
    ],
  },
  {
    title: 'Maintenance Tips:',
    items: [
      { bold: 'weekly', text: 'Re-glue {bold} for best results.' },
      { bold: 'gentle cleanser', text: 'Use a {bold} near the hairline.' },
      { bold: 'avoid oil-based', text: 'Always {bold} products near the bond.' },
      { bold: 'touch-up', text: 'Schedule a {bold} every 3–4 weeks.' },
    ],
  },
];

function renderText(text: string, bold: string) {
  const parts = text.split('{bold}');
  return (
    <>
      {parts[0]}
      <span className="font-bold">{bold}</span>
      {parts[1]}
    </>
  );
}

export const NaturalHairlineTruth = () => {
  const total = cards.length;
  const {
    scrollRef: trackRef,
    activeIndex,
    canPrev,
    canNext,
    scrollPrev,
    scrollNext,
    scrollToIndex,
  } = useSnapCarousel({
    itemSelector: '[data-truth-card]',
    itemCount: total,
  });

  return (
    <section className="py-20 md:py-[120px] bg-white">
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-10 xl:px-[160px] flex flex-col items-center">

        {/* Heading */}
        <h2 className="text-[#121212] text-[36px] md:text-[44px] font-extrabold text-center leading-[1.2] tracking-[-0.5px] max-w-[544px] mb-11">
          The Truth Behind Ultra <br />
          Natural Hairline
        </h2>

        {/* ── DESKTOP: original 2x2 + centered grid ── */}
        <div className="hidden md:flex flex-col gap-6 w-full max-w-[1120px]">

          {/* Row 1 */}
          <div className="flex gap-6 w-full">
            <div className="flex-1 h-[80px] px-6 bg-white rounded-[16px] border border-[#121212]/[0.08] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.05)] flex items-center gap-3">
              <div className="flex-shrink-0 w-6 h-6 relative"><Image src="/assets/icon-check-blue-square.svg" alt="Check" fill /></div>
              <p className="text-[#121212] text-[20px] leading-[24px] tracking-[-0.1px]"><span className="font-bold">Hair so real</span>, your barber won't know</p>
            </div>
            <div className="flex-1 h-[80px] px-6 bg-white rounded-[16px] border border-[#121212]/[0.08] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.05)] flex items-center gap-3">
              <div className="flex-shrink-0 w-6 h-6 relative"><Image src="/assets/icon-check-blue-square.svg" alt="Check" fill /></div>
              <p className="text-[#121212] text-[20px] leading-[24px] tracking-[-0.1px]">This is not a patch. <span className="font-bold">This is design</span></p>
            </div>
          </div>

          {/* Row 2 */}
          <div className="flex gap-6 w-full">
            <div className="flex-1 h-[80px] px-6 bg-white rounded-[16px] border border-[#121212]/[0.08] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.05)] flex items-center gap-3">
              <div className="flex-shrink-0 w-6 h-6 relative"><Image src="/assets/icon-check-blue-square.svg" alt="Check" fill /></div>
              <p className="text-[#121212] text-[20px] leading-[24px] tracking-[-0.1px]"><span className="font-bold">Real hairlines</span>, crafted with precision</p>
            </div>
            <div className="flex-1 h-[80px] px-6 bg-white rounded-[16px] border border-[#121212]/[0.08] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.05)] flex items-center gap-3">
              <div className="flex-shrink-0 w-6 h-6 relative"><Image src="/assets/icon-check-blue-square.svg" alt="Check" fill /></div>
              <p className="text-[#121212] text-[20px] leading-[24px] tracking-[-0.1px]">It's not magic. <span className="font-bold">It's science</span>, design & detail</p>
            </div>
          </div>

          {/* Row 3 centered */}
          <div className="flex justify-center w-full">
            <div className="w-full md:min-w-[500px] h-[80px] px-8 bg-white rounded-[16px] border border-[#121212]/[0.08] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.05)] flex items-center justify-center gap-3">
              <div className="flex-shrink-0 w-6 h-6 relative"><Image src="/assets/icon-check-blue-square.svg" alt="Check" fill /></div>
              <p className="text-[#121212] text-[20px] leading-[24px] tracking-[-0.1px]"><span className="font-bold">Natural hairlines</span> are built, strand by strand</p>
            </div>
          </div>
        </div>

        {/* ── MOBILE: swipeable carousel ── */}
        <div className="flex md:hidden flex-col w-full">

          {/*
            Scroll track — snap-x mandatory so each swipe lands on a card.
            overflow-x-scroll with hidden scrollbar (we render our own dots).
            Each card is 85vw wide so the next card peeks ~15vw from the right.
          */}
          <div
            ref={trackRef}
            className="flex overflow-x-scroll snap-x snap-mandatory scroll-smooth gap-4 pb-2 w-full"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <style>{`div::-webkit-scrollbar { display: none; }`}</style>

            {cards.map((card, i) => (
              <div
                key={i}
                data-truth-card=""
                className="
                  flex-shrink-0 snap-start
                  w-[85vw]
                  bg-white rounded-[16px]
                  border border-[#121212]/[0.08]
                  shadow-[0px_8px_24px_0px_rgba(0,0,0,0.05)]
                  p-6
                "
              >
                {/* Card title */}
                <h3 className="text-[#121212] text-[18px] font-bold leading-[24px] tracking-[-0.3px] mb-4">
                  {card.title}
                </h3>

                {/* Checklist items */}
                <div className="flex flex-col gap-3">
                  {card.items.map((item, j) => (
                    <div key={j} className="flex items-start gap-2">
                      <div className="flex-shrink-0 w-5 h-5 mt-0.5 relative">
                        <Image src="/assets/icon-check-blue-square.svg" alt="Check" fill />
                      </div>
                      <p className="text-[#121212] text-[15px] leading-[22px] tracking-[-0.1px]">
                        {renderText(item.text, item.bold)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* ── Carousel controls ── */}
          <div className="mt-6 flex items-center justify-center gap-[16px] px-[28px]">
            <TruthArrowButton
              direction="left"
              onClick={scrollPrev}
              disabled={!canPrev}
              gradientId="natural-hairline-truth-mobile-left"
            />

            <div
              style={{
                height: '44px',
                borderRadius: '24px',
                padding: '0 16px',
                background: 'rgba(232, 234, 237, 0.72)',
                backdropFilter: 'blur(3.5px)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flexShrink: 0,
              }}
            >
              {cards.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollToIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  style={{
                    width: i === activeIndex ? '32px' : '8px',
                    height: '8px',
                    borderRadius: '10px',
                    background: i === activeIndex ? '#121212' : 'rgba(18,18,18,0.30)',
                    transition: 'all 300ms ease',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    flexShrink: 0,
                  }}
                />
              ))}
            </div>

            <TruthArrowButton
              direction="right"
              onClick={scrollNext}
              disabled={!canNext}
              gradientId="natural-hairline-truth-mobile-right"
            />
          </div>
        </div>

      </div>
    </section>
  );
};

function TruthArrowButton({
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
