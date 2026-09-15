'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { STICK_ON_METHODS_ASSETS } from './stickOnMethodsAssets';
import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';
import { useSnapCarousel } from '@/components/carousel/useSnapCarousel';

const GAP = 20;
const MOBILE_CARD_WIDTH = 260;
const MOBILE_CARD_HEIGHT = 480;

const cards = [
  {
    key: 'stick-on' as const,
    title: 'Stick-on Hair System',
    description:
      'Natural look with a secure fit you can trust. Swim, shower, workout, and live freely.',
    href: '/clip-on-or-stick-on/stick-on-hair-system',
    desktopImage: STICK_ON_METHODS_ASSETS.desktop.stickOn,
    mobileImage: STICK_ON_METHODS_ASSETS.mobile.stickOn,
  },
  {
    key: 'clip-on' as const,
    title: 'Clip-on Hair System',
    description:
      'No shaving, no glue, just clip, wear, and go. Perfect for easy volume without commitment.',
    href: '/clip-on-or-stick-on/clip-on-hair-system',
    desktopImage: STICK_ON_METHODS_ASSETS.desktop.clipOn,
    mobileImage: STICK_ON_METHODS_ASSETS.mobile.clipOn,
  },
];

function MobileArrowButton({
  direction,
  disabled,
  onClick,
  gradientId,
}: {
  direction: 'left' | 'right';
  disabled: boolean;
  onClick: () => void;
  gradientId: string;
}) {
  const arrowPath = direction === 'left'
    ? 'M18.666 24L10.666 16L18.666 8'
    : 'M13.334 24L21.334 16L13.334 8';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === 'left' ? 'Previous method' : 'Next method'}
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

function MethodPill({ title, iconSrc }: { title: string; iconSrc: string }) {
  return (
    <div
      className="inline-flex h-8 w-fit self-start items-center gap-[6px] rounded-[8px] border border-white px-[8px] py-[4px] backdrop-blur-[5px]"
      style={{ background: 'rgb(255, 255, 255)' }}
    >
      <div className="relative h-[18px] w-[18px] flex-shrink-0">
        <Image src={iconSrc} alt="" fill className="object-contain" aria-hidden="true" />
      </div>
      <span className="bg-[linear-gradient(104deg,#4686FE_0%,#1769FF_100%)] bg-clip-text
  text-[14px] font-semibold leading-[120%] tracking-[-0.1px] text-transparent">
        {title}
      </span>
    </div>
  );
}

function DesktopMethodCard({
  title,
  description,
  href,
  iconSrc,
  imageSrc,
  imageAlt,
}: {
  title: string;
  description: string;
  href: string;
  iconSrc: string;
  imageSrc: string;
  imageAlt: string;
}) {
  return (
    <div
      className="relative h-[580px] w-[445px] flex-shrink-0 overflow-hidden rounded-[16px] bg-[linear-gradient(130deg,#4686FE_0%,#1769FF_100%)]"
      style={{ boxShadow: '0 8px 24px 0 rgba(0, 0, 0, 0.05)' }}
    >
      <div className="relative z-10 flex h-full flex-col p-6 md:p-7">
        <MethodPill title={title} iconSrc={iconSrc} />
        <p className="mt-5 max-w-[408px] text-white text-[20px] font-semibold leading-[1.35] tracking-[-0.22px] md:text-[20px]">
          {description}
        </p>
        <Link
          href={href}
          className="mt-5 inline-flex items-center gap-1 text-white text-[20px] font-semibold tracking-[-0.224px] transition-opacity hover:opacity-80"
        >
          Know more
          <ChevronRight className="h-5 w-5" strokeWidth={2.2} />
        </Link>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[80%]">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-contain object-bottom"
          sizes="(max-width: 1279px) calc((100vw - 112px) / 2), 545px"
        />
      </div>
    </div>
  );
}

function MobileMethodCard({
  title,
  description,
  href,
  iconSrc,
  imageSrc,
  imageAlt,
}: {
  title: string;
  description: string;
  href: string;
  iconSrc: string;
  imageSrc: string;
  imageAlt: string;
}) {
  return (
    <div
      style={{
        width: `${MOBILE_CARD_WIDTH}px`,
        height: `${MOBILE_CARD_HEIGHT}px`,
        background: 'linear-gradient(104deg, #4686FE 0%, #1769FF 100%), #FFF',
        boxShadow: '0 8px 24px 0 rgba(0, 0, 0, 0.05)',
      }}
      className="relative flex-shrink-0 overflow-hidden rounded-[12px] border border-[rgba(18,18,18,0.08)]"
    >
      <div className="relative z-10 flex h-full flex-col p-6">
        <MethodPill title={title} iconSrc={iconSrc} />
        <p className="mt-5 max-w-[220px] text-white text-[16px] font-semibold leading-[1.4] tracking-[-0.2px]">
          {description}
        </p>
        <Link
          href={href}
          className="mt-5 inline-flex items-center gap-1 text-white text-[14px] font-semibold leading-[18px] tracking-[-0.224px] transition-opacity hover:opacity-80"
        >
          Know more
          <ChevronRight className="h-4 w-4" strokeWidth={2.2} />
        </Link>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[106%]">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className="object-contain object-bottom"
          sizes="(max-width: 767px) 260px, 0px"
        />
      </div>
    </div>
  );
}

export const StickOnMethods = () => {
  const {
    scrollRef: mobileScrollRef,
    activeIndex: mobileIndex,
    canPrev: canScrollMobilePrev,
    canNext: canScrollMobileNext,
    scrollPrev: goPrev,
    scrollNext: goNext,
    scrollToIndex,
  } = useSnapCarousel({
    itemSelector: '[data-stick-method-slide]',
    itemCount: cards.length,
  });

  return (
    <AnimateOnScroll variant="fadeUp">
    <section className="relative w-full overflow-hidden bg-white py-[72px] md:py-[120px]">
      <div className="mx-auto w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">
        <h2 className="max-w-[420px] text-left text-[26px] font-extrabold leading-[1.15] tracking-[-0.5px] text-[#121212] md:max-w-[540px] md:text-[44px]">
          Two Easy Methods To Get
          <br />
          Your Hair Back
        </h2>

        <div className="mt-8 hidden justify-center w-full gap-[40px] md:flex">
          <DesktopMethodCard
            title={cards[0].title}
            description={cards[0].description}
            href={cards[0].href}
            iconSrc="/assets/stick-on-icon.svg"
            imageSrc={cards[0].desktopImage.src}
            imageAlt={cards[0].desktopImage.alt}
          />
          <DesktopMethodCard
            title={cards[1].title}
            description={cards[1].description}
            href={cards[1].href}
            iconSrc="/assets/clip-on-icon.svg"
            imageSrc={cards[1].desktopImage.src}
            imageAlt={cards[1].desktopImage.alt}
          />
        </div>

        <div className="mt-8 md:hidden">
          <div
            ref={mobileScrollRef}
            className="flex w-full snap-x snap-mandatory items-start overflow-x-auto scroll-smooth pr-4 pb-2"
            style={{
              gap: `${GAP}px`,
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
              overscrollBehaviorX: 'contain',
            }}
          >
            {cards.map((card, index) => (
              <div key={card.key} data-stick-method-slide="" className="snap-start flex-shrink-0">
                <MobileMethodCard
                  title={card.title}
                  description={card.description}
                  href={card.href}
                  iconSrc={index === 0 ? '/assets/stick-on-icon.svg' : '/assets/clip-on-icon.svg'}
                  imageSrc={card.mobileImage.src}
                  imageAlt={card.mobileImage.alt}
                />
              </div>
            ))}
          </div>

          <div className="mt-8 flex w-full items-center justify-center gap-[12px]">
            <MobileArrowButton
              direction="left"
              disabled={!canScrollMobilePrev}
              onClick={goPrev}
              gradientId="methods-mobile-left"
            />

            <div
              className="flex min-w-0 flex-shrink-0 items-center justify-center gap-[8px]"
              style={{
                width: 152,
                height: 44,
                borderRadius: 24,
                background: 'rgba(232,234,237,0.72)',
                backdropFilter: 'blur(3.5px)',
              }}
            >
              {cards.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  aria-label={`Go to method ${index + 1}`}
                  onClick={() => scrollToIndex(index)}
                  className="border-0 p-0"
                  style={{
                    width: mobileIndex === index ? 32 : 8,
                    height: 8,
                    borderRadius: 10,
                    background: mobileIndex === index ? '#121212' : 'rgba(18,18,18,0.30)',
                    transition: 'all 260ms ease',
                    cursor: 'pointer',
                  }}
                />
              ))}
            </div>

            <MobileArrowButton
              direction="right"
              disabled={!canScrollMobileNext}
              onClick={goNext}
              gradientId="methods-mobile-right"
            />
          </div>
        </div>
      </div>
    </section>
    </AnimateOnScroll>
  );
};
