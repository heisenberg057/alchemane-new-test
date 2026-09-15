'use client';

import Image from 'next/image';
import { useState, useEffect, useRef, useId } from 'react';
import { createPortal } from 'react-dom';
import { NATURAL_HAIRLINE_BENEFITS_ASSETS } from './naturalHairlineBenefitsAssets';
import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';

const benefits = [
  {
    title: 'Looks Extremely Natural',
    description:
      'Even at close range, the hairline blends seamlessly, giving a real look.',
  },
  {
    title: 'Style with Confidence',
    description:
      'You can confidently wear a brush-back hairstyle without worry.',
  },
  {
    title: 'Feels Like Your Own Hair',
    description:
      'No difference in texture when someone touches it. It feels just like natural hair.',
  },
  {
    title: 'Zero Social Awkwardness',
    description:
      'Feel comfortable in any social situation, without any self-consciousness.',
  },
];

export const NaturalHairlineBenefits = () => {
  const [isOpen, setIsOpen] = useState(false);
  // Stores scroll position at the exact moment user presses +
  const savedScrollY = useRef<number>(0);

  const openPopup = () => {
    // Capture scroll position synchronously before anything changes
    savedScrollY.current = window.scrollY;
    setIsOpen(true);
  };

  const closePopup = () => {
    setIsOpen(false);
  };

  // Lock/unlock scroll — using html element overflow so no position:fixed jump occurs
  useEffect(() => {
    const html = document.documentElement;
    if (isOpen) {
      // Prevent scroll on <html> without touching body position
      html.style.overflow = 'hidden';
    } else {
      html.style.overflow = '';
      // Restore the exact scroll position the user was at
      window.scrollTo({ top: savedScrollY.current, left: 0, behavior: 'instant' as ScrollBehavior });
    }
    return () => {
      html.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePopup();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <AnimateOnScroll variant="fadeUp">
    <>
      <section className="py-20 md:py-[120px] bg-[#F5F6F7]">
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-10 xl:px-[160px] flex justify-center">

          {/* ── Main Blue Card ── */}
          <div
            className="relative w-full max-w-[1120px] rounded-[16px] overflow-hidden shadow-[0px_8px_24px_0px_rgba(0,0,0,0.05)]"
            style={{
              background: 'linear-gradient(130.21deg, #4686fe -3.11%, #1769ff 103.11%)',
              /* mobile: auto height so card wraps content; desktop: fixed 583px */
              height: undefined,
            }}
          >
            {/* ────────────────────────────────────────────
                MOBILE LAYOUT  (flex-col, visible < md)
            ──────────────────────────────────────────── */}
            <div className="relative block h-[583px] md:hidden">
              <div className="absolute inset-0 overflow-hidden">
                <Image
                  src={NATURAL_HAIRLINE_BENEFITS_ASSETS.mobileCard.src}
                  alt={NATURAL_HAIRLINE_BENEFITS_ASSETS.mobileCard.alt}
                  fill
                  className="object-cover scale-[1.16] translate-y-[4%]"
                  style={{ objectPosition: '52% 30%' }}
                  sizes="(max-width: 768px) calc(100vw - 32px), 358px"
                />
              </div>

              <div className="absolute top-[24px] left-[24px] flex max-w-[300px] flex-col gap-2 z-10">
                <div className="inline-flex w-fit items-center justify-center rounded-[6px] bg-white px-3 py-1.5 shadow-sm">
                  <span className="text-[#555555] text-[12px] font-semibold tracking-[-0.12px]">
                    Hairline Benefits
                  </span>
                </div>

                <h2 className="text-white text-[32px] font-extrabold leading-[1.2] tracking-[-0.5px]">
                  Benefits of a Natural Looking Hairline
                </h2>
              </div>

              <div className="absolute bottom-5 right-5 z-20">
                <PlusButton onClick={openPopup} />
              </div>
            </div>

            {/* ────────────────────────────────────────────
                DESKTOP LAYOUT  (absolute positioning, visible ≥ md)
            ──────────────────────────────────────────── */}
            <div className="hidden md:block" style={{ height: 583 }}>

              {/* Man image */}
              <div
                className="absolute top-[15px] pointer-events-none"
                style={{ left: 430, width: 753, height: 568 }}
              >
                <Image
                  src={NATURAL_HAIRLINE_BENEFITS_ASSETS.desktopCard.src}
                  alt={NATURAL_HAIRLINE_BENEFITS_ASSETS.desktopCard.alt}
                  fill
                  className="object-contain object-left-top"
                  sizes="(min-width: 1440px) 753px, (min-width: 768px) 52vw, 100vw"
                />
              </div>

              {/* Text content */}
              <div className="absolute top-[119px] left-[79px] z-10 flex flex-col items-start gap-8">
                {/* Badge */}
                <div className="bg-white px-3 py-1.5 rounded-[6px] shadow-sm">
                  <span className="text-[#555555] text-[16px] font-semibold tracking-[-0.12px]">
                    Hairline Benefits
                  </span>
                </div>

                {/* Heading */}
                <h2 className="text-white text-[36px] md:text-[48px] font-extrabold leading-[58px] tracking-[-0.5px] max-w-[460px]">
                  Benefits of a Natural Looking Hairline
                </h2>
              </div>

              {/* Plus button — pixel-perfect from design */}
              <div className="absolute z-20" style={{ top: 510, left: 1060 }}>
                <PlusButton onClick={openPopup} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────────────────────────────
          POPUP / MODAL
          - fixed overlay so background stays locked
          - inner sheet scrolls on small screens
      ──────────────────────────────────────────────────────────── */}
      {isOpen && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(10, 20, 60, 0.6)' }}
          onClick={() => closePopup()}
        >
          <div className="relative hidden w-full max-w-[1080px] overflow-hidden rounded-[20px] bg-white shadow-[0px_20px_60px_rgba(0,0,0,0.25)] md:flex" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => closePopup()}
              className="absolute right-4 top-4 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-[#f0f0f0] transition-colors hover:bg-[#e0e0e0]"
              aria-label="Close"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1L13 13M13 1L1 13" stroke="#333" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>

            <div className="relative flex-1 overflow-y-auto p-10" style={{ maxHeight: 'calc(100vh - 48px)', maxWidth: 680 }}>

              <h3 className="mb-4 text-[28px] font-bold leading-[36px] text-[#111]">
                Hairline Insights & <span className="text-[#1769ff]">Benefits</span>
              </h3>

              <p className="mb-2 text-[18px] leading-[29px] text-[#555]">
                The unique advantages that give you a natural-looking hairline.
                In the video, discover exactly what makes a hairline look real
                and what doesn't. It's perfect for anyone unsure after
                researching.
              </p>

              <a
                href="#"
                className="mb-6 inline-block text-[18px] font-medium text-[#1769ff] underline underline-offset-2"
              >
                Watch the video
              </a>

              <div className="mt-2 flex flex-col gap-3">
                {benefits.map((b) => (
                  <div
                    key={b.title}
                    className="flex items-start gap-4 rounded-[10px] border border-[#E8E8E8] px-5 py-4"
                  >
                    <div className="mt-0.5 flex h-[24px] w-[24px] flex-shrink-0 items-center justify-center rounded-[5px] bg-[#111]">
                      <svg width="13" height="10" viewBox="0 0 11 8" fill="none">
                        <path d="M1 4L4 7L10 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-[18px] font-semibold leading-[25px] text-[#111]">{b.title}</p>
                      <p className="mt-1 text-[16px] leading-[24px] text-[#777]">{b.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <a
                href="/contact-us"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-[10px] bg-[#1769ff] px-6 py-4 text-[18px] font-semibold text-white transition-colors hover:bg-[#0f52cc]"
              >
                Talk To An Expert
                <TalkToExpertIcon />
              </a>
            </div>

            <div className="relative hidden w-[380px] flex-shrink-0 md:block">
              <Image
                src={NATURAL_HAIRLINE_BENEFITS_ASSETS.desktopModal.src}
                alt={NATURAL_HAIRLINE_BENEFITS_ASSETS.desktopModal.alt}
                fill
                className="object-cover object-top"
                sizes="380px"
              />
            </div>
          </div>

          <div
            className="relative flex w-full max-w-[420px] flex-col overflow-y-auto rounded-[20px] bg-[#F0F2F5] md:hidden"
            style={{ maxHeight: 'calc(100vh - 32px)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => closePopup()}
              className="absolute right-[14px] top-[14px] z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#121212]"
              aria-label="Close"
            >
              <svg width="15" height="15" viewBox="0 0 14 14" fill="none">
                <path d="M1 1L13 13M13 1L1 13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>

            <div className="px-5 pb-8 pt-7">
              <h3 className="mb-2 pr-9 text-[20px] font-extrabold leading-[1.3] tracking-[-0.3px] text-[#121212]">
                Hairline Insights & <span className="text-[#1769FF]">Benefits</span>
              </h3>

              <p className="mb-5 text-[13px] leading-[1.6] text-[#555]">
                The unique advantages that give you a natural-looking hairline.
                In the video, discover exactly what makes a hairline look real and what
                doesn&apos;t. It&apos;s perfect for anyone unsure after researching.
              </p>

              <a
                href="#"
                className="mb-5 inline-block text-[14px] font-semibold text-[#1769ff] underline underline-offset-2"
              >
                Watch the video
              </a>

              <div className="flex flex-col gap-3">
                {benefits.map((b) => (
                  <div
                    key={b.title}
                    className="flex items-start gap-3 rounded-[12px] bg-white p-4"
                  >
                    <div className="mt-[2px] flex h-[22px] w-[22px] flex-shrink-0 items-center justify-center rounded-[5px] bg-[#121212]">
                      <svg width="13" height="10" viewBox="0 0 11 8" fill="none">
                        <path d="M1 4L4 7L10 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <div>
                      <p className="mb-1 text-[15px] font-bold tracking-[-0.2px] text-[#121212]">{b.title}</p>
                      <p className="text-[13px] leading-[1.55] text-[#666]">{b.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <a
                href="/contact-us"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-[10px] bg-[#1769ff] px-6 py-4 text-[16px] font-semibold text-white transition-colors hover:bg-[#0f52cc]"
              >
                Talk To An Expert
                <TalkToExpertIcon />
              </a>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
    </AnimateOnScroll>
  );
};

/* ── Reusable Plus Button ── */
function PlusButton({ onClick }: { onClick: () => void }) {
  return (
    <div className="group relative cursor-pointer" onClick={onClick}>
      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="bg-white px-3 py-1 rounded shadow-lg whitespace-nowrap relative">
          <p className="text-[12px] font-semibold text-black">Tap to read more</p>
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-white" />
        </div>
      </div>

      {/* Circle button */}
      <div className="w-[44px] h-[44px] bg-white rounded-full flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-110">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 4V16M4 10H16" stroke="#1769ff" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      </div>
    </div>
  );
}

function TalkToExpertIcon() {
  const gradientId = useId();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
      className="h-6 w-6 flex-shrink-0 md:h-[28px] md:w-[28px]"
      style={{ aspectRatio: '1 / 1' }}
    >
      <path d="M18.8 2H9.2C5.22355 2 2 5.22355 2 9.2V18.8C2 22.7765 5.22355 26 9.2 26H18.8C22.7765 26 26 22.7765 26 18.8V9.2C26 5.22355 22.7765 2 18.8 2Z" fill="white"/>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.4286 10.3036C11.4286 9.85977 11.7883 9.5 12.2321 9.5H17.6964C18.1403 9.5 18.5 9.85977 18.5 10.3036V15.7678C18.5 16.2117 18.1403 16.5714 17.6964 16.5714C17.2526 16.5714 16.8929 16.2117 16.8929 15.7678V12.2436L10.8718 18.2647C10.558 18.5784 10.0492 18.5784 9.73536 18.2647C9.42155 17.9509 9.42155 17.4421 9.73536 17.1283L15.7564 11.1072H12.2321C11.7883 11.1072 11.4286 10.7474 11.4286 10.3036Z"
        fill={`url(#${gradientId})`}
      />
      <defs>
        <linearGradient
          id={gradientId}
          x1="9.98568"
          y1="7.47965"
          x2="20.5393"
          y2="10.0167"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#4686FE"/>
          <stop offset="1" stopColor="#1769FF"/>
        </linearGradient>
      </defs>
    </svg>
  );
}
