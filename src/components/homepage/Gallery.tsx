'use client';

import { useState, useRef, useEffect } from 'react';
import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';
import { useSnapCarousel } from '@/components/carousel/useSnapCarousel';
import { LazyGumletEmbed } from '@/components/video/LazyGumletEmbed';

const mobileVideoCards = [
  { id: 1, label: 'v2', name: 'Rahul Sharma', age: 34, src: 'https://play.gumlet.io/embed/69dc78d9c6b8ccb79da6e701?background=false&autoplay=false&loop=false&disable_player_controls=false' },
  { id: 2, label: 'v1', name: 'Arjun Mehta', age: 29, src: 'https://play.gumlet.io/embed/69dc78d9c6b8ccb79da6e6ff?background=false&autoplay=false&loop=false&disable_player_controls=false' },
  { id: 3, label: 'v4', name: 'Karan Verma', age: 41, src: 'https://play.gumlet.io/embed/69dc78d9e556529568ba94a5?background=false&autoplay=false&loop=false&disable_player_controls=false' },
  { id: 4, label: 'v6', name: 'Vikram Nair', age: 37, src: 'https://play.gumlet.io/embed/69dc78d9e556529568ba94a3?background=false&autoplay=false&loop=false&disable_player_controls=false' },
  { id: 5, label: 'v5', name: 'Rohan Kapoor', age: 26, src: 'https://play.gumlet.io/embed/69dc78d97e5487dd1d909a40?background=false&autoplay=false&loop=false&disable_player_controls=false' },
  { id: 6, label: 'v3', name: 'Aditya Singh', age: 45, src: 'https://play.gumlet.io/embed/69dc78d9c6b8ccb79da6e6fd?background=false&autoplay=false&loop=false&disable_player_controls=false' },
];

const desktopVideoCards = [
  { id: 1, label: 'v1', name: 'Rahul Sharma', age: 34, src: 'https://play.gumlet.io/embed/69dc7c0e7e5487dd1d90da27?background=false&autoplay=false&loop=false&disable_player_controls=false' },
  { id: 2, label: 'v2', name: 'Arjun Mehta', age: 29, src: 'https://play.gumlet.io/embed/69dc7c0ee556529568bad276?background=false&autoplay=false&loop=false&disable_player_controls=false' },
  { id: 3, label: 'v3', name: 'Karan Verma', age: 41, src: 'https://play.gumlet.io/embed/69dc7c0ee556529568bad27a?background=false&autoplay=false&loop=false&disable_player_controls=false' },
  { id: 4, label: 'v4', name: 'Vikram Nair', age: 37, src: 'https://play.gumlet.io/embed/69dc7c0ec6b8ccb79da72732?background=false&autoplay=false&loop=false&disable_player_controls=false' },
  { id: 5, label: 'v5', name: 'Rohan Kapoor', age: 26, src: 'https://play.gumlet.io/embed/69dc7c0e7e5487dd1d90da29?background=false&autoplay=false&loop=false&disable_player_controls=false' },
  { id: 6, label: 'v6', name: 'Aditya Singh', age: 45, src: 'https://play.gumlet.io/embed/69dc7c0ee556529568bad27c?background=false&autoplay=false&loop=false&disable_player_controls=false' },
];

const MOBILE_GAP = 12;
const DESKTOP_GAP = 12;
const DEFAULT_MOBILE_TITLE = 'Some Of Our Clients With The Most Natural Hairlines';
const DEFAULT_DESKTOP_TITLE = 'Some of Our Clients With the Most Natural Hairlines';

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

export const Gallery = ({
  mobileTitle = DEFAULT_MOBILE_TITLE,
  desktopTitle = DEFAULT_DESKTOP_TITLE,
}: {
  mobileTitle?: string;
  desktopTitle?: string;
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  /** Desktop: mount Gumlet only for the default slide and slides the user has hovered (avoids N iframes in one row). */
  const [desktopEmbedLoaded, setDesktopEmbedLoaded] = useState(() => new Set<number>([0]));

  const [mobileCardW, setMobileCardW] = useState(334);
  const [desktopH, setDesktopH] = useState(300);
  const [leftPad, setLeftPad] = useState(160);

  const desktopScrollRef = useRef<HTMLDivElement>(null);
  const {
    scrollRef: mobileScrollRef,
    activeIndex: mobileIndex,
    canPrev: canScrollMobilePrev,
    canNext: canScrollMobileNext,
    scrollPrev: goMobilePrev,
    scrollNext: goMobileNext,
    scrollToIndex: scrollMobileTo,
  } = useSnapCarousel({
    itemSelector: '[data-gallery-mobile-slide]',
    itemCount: mobileVideoCards.length,
  });

  // ── Responsive sizing ──────────────────────────────────
  useEffect(() => {
    const update = () => {
      setMobileCardW(Math.min(window.innerWidth - 44, 420));
      setDesktopH(Math.min(Math.max(Math.round(window.innerWidth * 0.21), 230), 360));
      setLeftPad(Math.max(60, (window.innerWidth - 1440) / 2 + 160));
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const activeW = Math.round(desktopH * (16 / 9));
  const inactiveW = Math.round(desktopH * (9 / 16));

  // ── Scroll desktop container to bring active card into view ──
  const scrollToCard = (index: number) => {
    if (!desktopScrollRef.current) return;
    const cards = desktopScrollRef.current.querySelectorAll('[data-card]');
    if (cards[index]) {
      cards[index].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start',
      });
    }
  };

  const goDesktopPrev = () => {
    const newIndex = Math.max(activeIndex - 1, 0);
    setActiveIndex(newIndex);
    scrollToCard(newIndex);
  };

  const goDesktopNext = () => {
    const newIndex = Math.min(activeIndex + 1, desktopVideoCards.length - 1);
    setActiveIndex(newIndex);
    scrollToCard(newIndex);
  };

  return (
    <AnimateOnScroll variant="fadeIn">
    <>
      {/* ══════════════════ MOBILE ══════════════════ */}
      <div className="block lg:hidden">
        <section className="py-[40px] bg-[#f5f6f7] overflow-hidden">

          <div className="pl-[28px]">
            <h2 style={{
              color: '#121212',
              fontSize: '26px',
              fontWeight: 800,
              lineHeight: '120%',
              letterSpacing: '-0.5px',
              textTransform: 'capitalize',
              maxWidth: `${mobileCardW}px`,
              marginBottom: '24px',
            }}>
              {mobileTitle}
            </h2>

            <div
              ref={mobileScrollRef}
              className="flex snap-x snap-mandatory overflow-x-auto pb-2 pr-[28px] scroll-smooth"
              style={{
                gap: `${MOBILE_GAP}px`,
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
                overscrollBehaviorX: 'contain',
              }}
            >
                {mobileVideoCards.map((video) => (
                  <div
                    key={video.id}
                    data-gallery-mobile-slide=""
                    className="snap-start"
                    style={{ flexShrink: 0, width: `${mobileCardW}px` }}
                  >
                    <div style={{
                      position: 'relative',
                      width: `${mobileCardW}px`,
                      aspectRatio: '4 / 5',
                      borderRadius: '16px',
                      overflow: 'hidden',
                    }}>
                      <LazyGumletEmbed
                        title={`${video.name} hairline result`}
                        embedSrc={video.src}
                        rootMargin="120px 0px"
                        iframePointerEvents="none"
                        placeholderLabel="Video loads when this card is near."
                      />
                    </div>

                    <div style={{
                      marginTop: '10px',
                      paddingLeft: '4px',
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '6px',
                    }}>
                      <span style={{ color: '#121212', fontSize: '15px', fontWeight: 700, letterSpacing: '-0.2px' }}>
                        {video.name}
                      </span>
                      <span style={{ color: 'rgba(18,18,18,0.45)', fontSize: '13px', fontWeight: 500 }}>
                        Age {video.age}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Nav controls */}
          <div className="flex items-center justify-center gap-[16px] mt-[24px] px-[28px]">
            <ArrowButton
              direction="left"
              onClick={goMobilePrev}
              disabled={!canScrollMobilePrev}
              gradientId="gallery-mob-left"
            />

            <div style={{
              height: '44px', borderRadius: '24px', padding: '0 16px',
              background: 'rgba(232, 234, 237, 0.72)', backdropFilter: 'blur(3.5px)',
              display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0,
            }}>
              {mobileVideoCards.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollMobileTo(i)}
                  style={{
                    width: i === mobileIndex ? '32px' : '8px',
                    height: '8px', borderRadius: '10px',
                    background: i === mobileIndex ? '#121212' : 'rgba(18,18,18,0.30)',
                    transition: 'all 300ms ease',
                    border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0,
                  }}
                />
              ))}
            </div>

            <ArrowButton
              direction="right"
              onClick={goMobileNext}
              disabled={!canScrollMobileNext}
              gradientId="gallery-mob-right"
            />

          </div>
        </section>
      </div>

      {/* ══════════════════ DESKTOP ══════════════════ */}
      <div className="hidden lg:block">
        <section className="py-[60px] lg:py-[120px] bg-[#f5f6f7]">

          {/* Heading */}
          <div style={{
            paddingLeft: 'max(60px, calc((100vw - 1440px) / 2 + 160px))',
            marginBottom: '44px',
          }}>
            <h2 style={{
              fontSize: '44px',
              fontWeight: 800,
              color: '#121212',
              lineHeight: '53px',
              letterSpacing: '-0.5px',
              maxWidth: '600px',
            }}>
              {desktopTitle}
            </h2>
          </div>

          {/* Card row */}
          <div
            ref={desktopScrollRef}
            style={{
              paddingLeft: `${leftPad}px`,
              display: 'flex',
              gap: `${DESKTOP_GAP}px`,
              alignItems: 'flex-start',
              overflowX: 'scroll',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              paddingBottom: '4px',
              scrollBehavior: 'smooth',
            }}
          >
            {desktopVideoCards.map((video, index) => {
              const isActive = activeIndex === index;

              return (
                <div
                  key={video.id}
                  data-card
                  onMouseEnter={() => {
                    setActiveIndex(index);
                    setDesktopEmbedLoaded((prev) => new Set(prev).add(index));
                  }}
                  style={{ flexShrink: 0 }}
                >
                  {/* Video card */}
                  <div
                    style={{
                      width: `${isActive ? activeW : inactiveW}px`,
                      height: `${desktopH}px`,
                      transition: 'width 350ms ease',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      position: 'relative',
                      cursor: 'pointer',
                    }}
                  >
                    {desktopEmbedLoaded.has(index) ? (
                    <LazyGumletEmbed
                      title={`${video.name} hairline result`}
                      embedSrc={video.src}
                      rootMargin="160px 0px"
                      iframePointerEvents={isActive ? 'auto' : 'none'}
                      placeholderLabel="Video loads only when this card is near"
                      clipIframeWidthPx={activeW}
                      clipVisibleWidthPx={isActive ? activeW : inactiveW}
                    />
                    ) : (
                      <div
                        className="absolute inset-0 bg-[#0f172a]"
                        aria-hidden
                        style={{ pointerEvents: 'none' }}
                      />
                    )}

                    {!isActive && (
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: 'rgba(0,0,0,0.35)',
                        borderRadius: '16px',
                        pointerEvents: 'none',
                      }} />
                    )}
                  </div>

                  {/* Name + age */}
                  <div style={{
                    marginTop: '10px',
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '6px',
                    width: `${isActive ? activeW : inactiveW}px`,
                    transition: 'width 350ms ease',
                    overflow: 'hidden',
                  }}>
                    <span style={{
                      color: '#121212',
                      fontSize: '15px',
                      fontWeight: 700,
                      letterSpacing: '-0.2px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}>
                      {video.name}
                    </span>
                    <span style={{
                      color: 'rgba(18,18,18,0.45)',
                      fontSize: '13px',
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}>
                      Age {video.age}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Right spacer */}
            <div style={{ flexShrink: 0, width: `${leftPad}px` }} />
          </div>

          {/* Nav buttons */}
          <div style={{
            paddingLeft: 'max(60px, calc((100vw - 1440px) / 2 + 160px))',
            paddingRight: 'max(60px, calc((100vw - 1440px) / 2 + 160px))',
          }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
              <ArrowButton
                direction="left"
                onClick={goDesktopPrev}
                disabled={activeIndex === 0}
                gradientId="gallery-desk-left"
              />
              <ArrowButton
                direction="right"
                onClick={goDesktopNext}
                disabled={activeIndex === desktopVideoCards.length - 1}
                gradientId="gallery-desk-right"
              />
            </div>
          </div>

        </section>
      </div>
    </>
    </AnimateOnScroll>
  );
};
