'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { createPortal } from 'react-dom';
import { ABOUT_STORY_ASSETS } from './aboutStoryAssets';
import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';

export const AboutStory = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.documentElement.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimateOnScroll variant="fadeUp">
    <section className="w-full bg-white">

      {/* ── MOBILE ── */}
      <div className="md:hidden flex justify-center py-[72px] px-[16px]">
        <div className="relative w-[358px] h-[583px] rounded-[16px] overflow-hidden flex-shrink-0">
          <Image
            src={ABOUT_STORY_ASSETS.card.mobile.url}
            alt={ABOUT_STORY_ASSETS.card.mobile.alt}
            fill
            className="object-cover object-center"
            sizes="358px"
          />

          {/* Plus button — bottom-right */}
          <button
            type="button"
            aria-label="Read the full story of American Hairline"
            className="absolute bottom-5 right-5 z-10"
            onClick={() => setIsOpen(true)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44" fill="none">
              <path d="M22 0C27.8348 0 33.4305 2.31785 37.5564 6.44365C41.6822 10.5695 44 16.1652 44 22C44 27.8348 41.6822 33.4305 37.5564 37.5564C33.4305 41.6822 27.8348 44 22 44C16.1652 44 10.5695 41.6822 6.44365 37.5564C2.31785 33.4305 0 27.8348 0 22C0 16.1652 2.31785 10.5695 6.44365 6.44365C10.5695 2.31785 16.1652 0 22 0ZM24 11.858C24 11.1287 24.0157 11.2755 23.5 10.7598C22.9843 10.244 22.7293 10 22 10C21.2707 10 21.0157 10.244 20.5 10.7598C19.9843 11.2755 20 11.1287 20 11.858V20.5H15.929H12.858C12.1287 20.5 11.4292 20.5838 10.9135 21.0995C10.3977 21.6152 10 21.7707 10 22.5C10 23.2293 10.3977 23.5993 10.9135 24.115C11.4292 24.6308 12.1287 24.5 12.858 24.5H15.929H20V32.483C20 33.2123 19.9843 33.4843 20.5 34C21.0157 34.5157 21.2707 34.8511 22 34.8511C22.7293 34.8511 22.9843 34.5157 23.5 34C24.0157 33.4843 24 33.2123 24 32.483V24.5H31.483C32.2123 24.5 32.9118 24.6308 33.4275 24.115C33.9433 23.5993 34 23.2293 34 22.5C34 21.7707 33.5 21 33.5 21C32.9843 20.4843 32.2123 20.5 31.483 20.5H24V11.858Z" fill="#1769FF"/>
              <path d="M12 22.6016L32.3 22.6016" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M22.1016 12.5L22.1016 32.8" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ── DESKTOP ── */}
      <div className="hidden md:flex justify-center py-[120px]">
        <div className="w-full max-w-[1440px] px-10 xl:px-[160px]">
          <div className="relative w-full aspect-[1121/630] rounded-2xl overflow-hidden group shadow-xl">
            <Image
              src={ABOUT_STORY_ASSETS.card.desktop.url}
              alt={ABOUT_STORY_ASSETS.card.desktop.alt}
              fill
              className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
              sizes="min(1121px, calc(100vw - 320px))"
            />

            {/* Plus button — bottom-right */}
            <button
              type="button"
              aria-label="Read the full story of American Hairline"
              className="absolute bottom-12 right-12 group/btn cursor-pointer z-10"
              onClick={() => setIsOpen(true)}
            >
              <div className="relative">
                {/* Tooltip */}
                <div className="absolute bottom-full right-0 mb-3 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                  <div className="bg-white px-3 py-1.5 rounded text-xs font-bold shadow-lg relative">
                    Tap to read more
                    <div className="absolute top-full right-4 -mt-[1px] border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white" />
                  </div>
                </div>
                <div className="w-14 h-14 bg-[#1769FF] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 44 44" fill="none">
                    <path d="M22 0C27.8348 0 33.4305 2.31785 37.5564 6.44365C41.6822 10.5695 44 16.1652 44 22C44 27.8348 41.6822 33.4305 37.5564 37.5564C33.4305 41.6822 27.8348 44 22 44C16.1652 44 10.5695 41.6822 6.44365 37.5564C2.31785 33.4305 0 27.8348 0 22C0 16.1652 2.31785 10.5695 6.44365 6.44365C10.5695 2.31785 16.1652 0 22 0ZM24 11.858C24 11.1287 24.0157 11.2755 23.5 10.7598C22.9843 10.244 22.7293 10 22 10C21.2707 10 21.0157 10.244 20.5 10.7598C19.9843 11.2755 20 11.1287 20 11.858V20.5H15.929H12.858C12.1287 20.5 11.4292 20.5838 10.9135 21.0995C10.3977 21.6152 10 21.7707 10 22.5C10 23.2293 10.3977 23.5993 10.9135 24.115C11.4292 24.6308 12.1287 24.5 12.858 24.5H15.929H20V32.483C20 33.2123 19.9843 33.4843 20.5 34C21.0157 34.5157 21.2707 34.8511 22 34.8511C22.7293 34.8511 22.9843 34.5157 23.5 34C24.0157 33.4843 24 33.2123 24 32.483V24.5H31.483C32.2123 24.5 32.9118 24.6308 33.4275 24.115C33.9433 23.5993 34 23.2293 34 22.5C34 21.7707 33.5 21 33.5 21C32.9843 20.4843 32.2123 20.5 31.483 20.5H24V11.858Z" fill="white"/>
                    <path d="M12 22.6016L32.3 22.6016" stroke="#1769FF" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22.1016 12.5L22.1016 32.8" stroke="#1769FF" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* ── MODAL ── */}
      {isOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal panel */}
          <div className="relative w-full max-w-[1340px] max-h-[90vh] bg-white rounded-3xl animate-in fade-in zoom-in duration-300 shadow-2xl flex flex-col">

            {/* Close */}
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close story modal"
              className="absolute top-6 right-6 z-50 p-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors shadow-md"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="overflow-y-auto hide-scrollbar p-8 md:p-[60px] flex flex-col gap-10 items-center">

              {/* Gradient heading */}
              <h2 className="w-full max-w-[1020px] text-[18px] font-bold leading-[120%] tracking-[-0.1px]"
                style={{
                  background: 'linear-gradient(104deg, #4686FE 0%, #1769FF 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                The Journey of American Hairline
              </h2>

              {/* Para 1 */}
              <p className="w-full max-w-[1020px] text-[16px] leading-[140%] tracking-[-0.16px] text-[#555555]">
                When we first launched American Hairline, we thought we were simply creating{' '}
                <span className="font-bold text-[#555555]">hair systems</span>. But as we worked closely with some of{' '}
                <span className="font-bold text-[#555555]">Bollywood's biggest stars</span>, we realized that what we were truly doing was helping men feel like themselves again. We learned the importance of creating ultra-premium,{' '}
                <span className="font-bold text-[#555555]">natural-looking hair systems</span> that could withstand harsh studio lighting and the precision of 4K cameras. Every strand had to look like it was born right on that head.
                <br /><br />
                One day, an <span className="font-bold text-[#555555]">ordinary man</span> walked in. He wasn't a celebrity. He looked at us and said, "I just want to{' '}
                <span className="font-bold text-[#555555]">look like myself again</span>." That moment changed everything for us. We understood that there were thousands of men like him; men who didn't want fake solutions or quick fixes. They simply wanted to look{' '}
                <span className="font-bold text-[#555555]">natural</span>,{' '}
                <span className="font-bold text-[#555555]">feel confident</span>, and stop worrying about how their hair looked every day.
              </p>

              {/* Multiple images — desktop/mobile */}
              <div className="w-full max-w-[1020px]">
                <div className="relative w-full hidden md:block aspect-[2676/2880] rounded-3xl overflow-hidden shadow-lg">
                  <Image
                    src={ABOUT_STORY_ASSETS.modal.multipleImages.desktop.url}
                    alt={ABOUT_STORY_ASSETS.modal.multipleImages.desktop.alt}
                    fill
                    className="object-cover"
                    sizes="min(1020px, 90vw)"
                  />
                </div>
                <div className="relative w-full md:hidden aspect-[1368/1472] rounded-3xl overflow-hidden shadow-lg">
                  <Image
                    src={ABOUT_STORY_ASSETS.modal.multipleImages.mobile.url}
                    alt={ABOUT_STORY_ASSETS.modal.multipleImages.mobile.alt}
                    fill
                    className="object-cover"
                    sizes="calc(100vw - 64px)"
                  />
                </div>
              </div>

              {/* Para 2 */}
              <p className="w-full max-w-[1020px] text-[16px] leading-[140%] tracking-[-0.16px] text-[#555555]">
                With this realization, we took everything we had learned while working with celebrities: the precision,{' '}
                <span className="font-bold text-[#555555]">craftsmanship</span>, and attention to detail. We made it available to every man who wanted the same level of{' '}
                <span className="font-bold text-[#555555]">authenticity</span>. It wasn't always easy. We faced countless setbacks, resistance, and moments when scaling without compromising quality seemed impossible. But every time a client walked out smiling and said, "{' '}
                <span className="font-bold text-[#555555]">I finally feel like myself again</span>," we knew we were on the right path.
                <br /><br />
                Today, <span className="font-bold text-[#555555]">American Hairline</span> is India's most trusted name in{' '}
                <span className="font-bold text-[#555555]">non-surgical hair replacement</span>; not because of who we worked with, but because of who we work for. Real men. Men who choose confidence. Men who choose to take control of their own story.
                <br /><br />
                At the end of the day, it's not about hair;{' '}
                <span className="font-bold text-[#555555]">it's about how you feel when you look in the mirror</span>. That quiet confidence, that's what we exist for.
              </p>

              {/* Big image — desktop/mobile */}
              <div className="w-full max-w-[1020px]">
                <div className="relative w-full hidden md:block aspect-[4080/2772] rounded-[33px] overflow-hidden shadow-lg">
                  <Image
                    src={ABOUT_STORY_ASSETS.modal.bigImage.desktop.url}
                    alt={ABOUT_STORY_ASSETS.modal.bigImage.desktop.alt}
                    fill
                    className="object-cover"
                    sizes="min(1020px, 90vw)"
                  />
                </div>
                <div className="relative w-full md:hidden aspect-[1368/932] rounded-[33px] overflow-hidden shadow-lg">
                  <Image
                    src={ABOUT_STORY_ASSETS.modal.bigImage.mobile.url}
                    alt={ABOUT_STORY_ASSETS.modal.bigImage.mobile.alt}
                    fill
                    className="object-cover"
                    sizes="calc(100vw - 64px)"
                  />
                </div>
              </div>

            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
    </AnimateOnScroll>
  );
};
