'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { Play, Plus, X, ArrowUpRight } from 'lucide-react';
import { ClipOnMethodHero } from '@/components/homepage/ClipOnMethodHero';
import { ContactForm as CTA } from '@/components/homepage/ContactForm';
import { Ebook } from '@/components/homepage/Ebook';
import { ResultsTransformations } from '@/components/results/ResultsTransformations';
import { Achievements } from '@/components/homepage/Achievements';
import { Checklist } from '@/components/homepage/Checklist';
import { SocialProof } from '@/components/homepage/SocialProof';
import { CLIP_ON_REAL_FEARS_ASSETS } from './clipOnRealFearsAssets';
import { CLIP_ON_THREE_THINGS_ASSETS } from './clipOnThreeThingsAssets';
import { CLIP_ON_LEARN_STICK_ON_ASSETS } from './clipOnLearnStickOnAssets';
import { ZYCON_SECTION_ASSETS } from './zyconSectionAssets';
import { useSnapCarousel } from '@/components/carousel/useSnapCarousel';

function ThreeThingsArrowButton({
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
      aria-label={direction === 'left' ? 'Previous' : 'Next'}
      style={{
        width: 56, height: 56, border: 'none', padding: 0, flexShrink: 0,
        cursor: disabled ? 'default' : 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'transparent',
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56" fill="none">
        <defs>
          <linearGradient id={gradientId} x1="3.02198" y1="-12.571" x2="68.6891" y2="3.21483" gradientUnits="userSpaceOnUse">
            <stop stopColor="#4686FE" /><stop offset="1" stopColor="#1769FF" />
          </linearGradient>
        </defs>
        <circle cx="28" cy="28" r="28" fill="#E8EAED" opacity={disabled ? 0.7 : 1} />
        {!disabled && <circle cx="28" cy="28" r="28" fill={`url(#${gradientId})`} />}
        <svg x="12" y="12" width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d={arrowPath} stroke={disabled ? 'rgba(18,18,18,0.4)' : 'white'} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </svg>
    </button>
  );
}

function ThreeThingsSection() {
  const cards = CLIP_ON_THREE_THINGS_ASSETS;
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
    itemCount: cards.length,
  });

  return (
    <section className="bg-white py-[72px] md:py-[120px]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 xl:px-[160px]">
        <h2 className="text-[26px] md:text-[44px] font-extrabold text-[#121212] leading-[1.2] tracking-[-0.5px] mb-8 md:mb-[44px] max-w-[640px]">
          A Hair System Gives You Three Things Every Man Wants:
        </h2>

        {/* ── Desktop: 3 fixed-width cards ── */}
        <div className="hidden md:flex justify-start gap-6">
          {cards.map((card, i) => (
            <div
              key={i}
              className="flex-shrink-0 flex flex-col bg-white border border-[#12121214] rounded-[16px] shadow-[0px_8px_24px_0px_#0000000D] overflow-hidden"
              style={{ width: 352, height: 644 }}
            >
              <div className="flex flex-col px-6 pt-[28px] pb-4 flex-shrink-0 gap-4">
                <span className="text-[56px] leading-none">{card.emoji}</span>
                <div className="flex flex-col gap-2">
                  <h3 className="text-[22px] font-semibold text-[#121212] leading-[28px] tracking-[-0.1px]">{card.title}</h3>
                  <p className="text-[16px] text-[#555555] font-medium leading-[23px] tracking-[-0.16px]">{card.desc}</p>
                </div>
              </div>
              <div className="relative flex-1 w-full overflow-hidden">
                <Image
                  src={card.desktop.url}
                  alt={card.desktop.alt}
                  fill
                  className="object-cover object-bottom"
                  sizes="352px"
                />
              </div>
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
            {cards.map((card, i) => (
              <div
                key={i}
                data-card=""
                className="flex-shrink-0 flex flex-col bg-white border border-[#12121214] rounded-[12px] snap-center overflow-hidden"
                style={{ width: 260, height: 480, boxShadow: '0px 8px 24px 0px rgba(0,0,0,0.05)' }}
              >
                <div className="flex flex-col px-5 pt-[24px] pb-3 flex-shrink-0 gap-3">
                  <span className="text-[48px] leading-none">{card.emoji}</span>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-[20px] font-semibold text-[#121212] leading-[26px] tracking-[-0.1px]">{card.title}</h3>
                    <p className="text-[14px] text-[#555555] font-medium leading-[20px] tracking-[-0.16px]">{card.desc}</p>
                  </div>
                </div>
                <div className="relative flex-1 w-full overflow-hidden">
                  <Image
                    src={card.mobile.url}
                    alt={card.mobile.alt}
                    fill
                    className="object-cover object-bottom"
                    sizes="260px"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-[12px]">
            <ThreeThingsArrowButton
              direction="left"
              onClick={scrollPrev}
              disabled={!canPrev}
              gradientId="three-things-left"
            />
            <div
              className="flex items-center justify-center gap-[8px] flex-shrink-0"
              style={{ width: 152, height: 44, borderRadius: 24, background: 'rgba(232,234,237,0.72)', backdropFilter: 'blur(3.5px)', WebkitBackdropFilter: 'blur(3.5px)' }}
            >
              {cards.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollToIndex(i)}
                  aria-label={`Go to card ${i + 1}`}
                  style={{
                    width: i === activeIndex ? 32 : 8, height: 8, borderRadius: 10,
                    border: 'none', padding: 0, cursor: 'pointer', flexShrink: 0,
                    background: i === activeIndex ? '#121212' : 'rgba(18,18,18,0.30)',
                    transition: 'all 300ms ease',
                  }}
                />
              ))}
            </div>
            <ThreeThingsArrowButton
              direction="right"
              onClick={scrollNext}
              disabled={!canNext}
              gradientId="three-things-right"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ClipOnHairSystemPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [isZyconModalOpen, setIsZyconModalOpen] = useState(false);

  const scrollToContactForm = () => {
    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const faqItems = [
    {
      question: "What is Zycon range?",
      answer: "The Zycon range is a clip-on hair system that supports scalp health by using antibacterial protection and controlling odor. It is designed to help you stay comfortable, confident, and unrestricted in your active lifestyle."
    },
    { 
      question: "Will my partner notice?", 
      answer: "No, the system is designed to be undetectable, even up close. The materials used mimic the natural scalp and hair growth patterns." 
    },
    { 
      question: "Can I swim?", 
      answer: "Yes, you can swim with our secure clip-on systems. We recommend using a swimming cap for extra security during vigorous activities." 
    },
    { 
      question: "What if I have little hair left?", 
      answer: "We have solutions tailored for various stages of hair loss. The clip-on system can be adapted to work with your existing hair." 
    },
    { 
      question: "Does it feel hot or heavy?", 
      answer: "No, the base is breathable and lightweight for maximum comfort, even in warm climates." 
    },
    { 
      question: "Will it fall off?", 
      answer: "The clips are medical-grade and secure, ensuring it stays in place throughout your daily activities." 
    },
    { 
      question: "Is it visible?", 
      answer: "The hairline is ultra-natural and blends seamlessly with your existing hair, making it virtually invisible." 
    },
    { 
      question: "Will it damage scalp?", 
      answer: "No, the Zycon range is antibacterial and safe for your scalp. It promotes hygiene and prevents irritation." 
    },
    { 
      question: "Can I wear in gym?", 
      answer: "Absolutely, it is designed for active lifestyles including gym sessions. It handles sweat and movement well." 
    },
    { 
      question: "Can I remove it?", 
      answer: "Yes, the clip-on system allows for easy daily removal, giving you full control and flexibility." 
    },
    { 
      question: "What about sweat & odor?", 
      answer: "The antibacterial base helps control odor and manages sweat effectively, keeping you fresh all day." 
    }
  ];

  return (
    <main className="bg-white">
      <ClipOnMethodHero />
      {/* The Real Fears Men Have Section */}
      <section className="bg-[#F5F6F7] py-[72px] md:py-[120px]">
        <div className="max-w-[1440px] mx-auto px-4 md:px-10 xl:px-[160px]">
          <h2 className="text-[26px] md:text-[44px] font-extrabold text-[#121212] text-center leading-[1.2] tracking-[-0.5px] mb-8 md:mb-[44px]">
            The Real Fears Men Have
          </h2>

          {/* ── Mobile layout ── */}
          <div className="flex flex-col gap-5 md:hidden">
            {/* Image — full width, landscape */}
            <div className="relative w-full rounded-[16px] overflow-hidden" style={{ aspectRatio: '145/89' }}>
              <Image
                src={CLIP_ON_REAL_FEARS_ASSETS.mobile.url}
                alt={CLIP_ON_REAL_FEARS_ASSETS.mobile.alt}
                fill
                className="object-cover object-center"
                sizes="100vw"
              />
            </div>

            {/* White card */}
            <div className="bg-white rounded-[16px] border border-[#12121214] shadow-[0px_8px_24px_0px_#0000000D] p-6 flex flex-col gap-4">
              <h3 className="text-[18px] font-semibold text-[#121212] leading-[24px] tracking-[-0.1px]">
                Every man we meet shares the same fears:
              </h3>
              <div className="flex flex-col gap-4">
                {[
                  { emoji: '🪒', text: "I don't want to shave my head." },
                  { emoji: '💇‍♂️', text: "I want to keep my natural hair." },
                  { emoji: '🔒', text: "It must never fall off. It has to feel super secure." },
                  { emoji: '🤝', text: "Even if someone touches my head, they shouldn't know." },
                  { emoji: '👨', text: "It should look exactly like my hair before hair loss." },
                ].map(({ emoji, text }, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-[22px] leading-none mt-[2px] flex-shrink-0">{emoji}</span>
                    <p className="text-[16px] text-[#121212] font-medium leading-[24px] tracking-[-0.16px]">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Italic reassurance text */}
            <p className="text-center text-[15px] text-[#555555] leading-[22px] tracking-[-0.1px]">
              You&apos;re not alone.<br />
              <span>These fears are real </span>
              <span className="text-[#1769FF] font-medium">and they deserve a real solution.</span>
            </p>

            {/* CTA */}
            <button
              type="button"
              onClick={scrollToContactForm}
              className="w-full h-[56px] rounded-[12px] bg-gradient-to-r from-[#4686FE] to-[#1769FF] flex items-center justify-center gap-2 shadow-[0px_4px_8px_0px_#00000026] hover:opacity-90 transition-opacity"
            >
              <span className="text-white font-semibold text-[18px] leading-[25px] tracking-[0.2px]">
                Discuss With A Consultant
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none" style={{ flexShrink: 0 }}>
                <path d="M18.8 2H9.2C5.22355 2 2 5.22355 2 9.2V18.8C2 22.7765 5.22355 26 9.2 26H18.8C22.7765 26 26 22.7765 26 18.8V9.2C26 5.22355 22.7765 2 18.8 2Z" fill="white"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M11.4286 10.3036C11.4286 9.85977 11.7883 9.5 12.2321 9.5H17.6964C18.1403 9.5 18.5 9.85977 18.5 10.3036V15.7678C18.5 16.2117 18.1403 16.5714 17.6964 16.5714C17.2526 16.5714 16.8929 16.2117 16.8929 15.7678V12.2436L10.8718 18.2647C10.558 18.5784 10.0492 18.5784 9.73536 18.2647C9.42155 17.9509 9.42155 17.4421 9.73536 17.1283L15.7564 11.1072H12.2321C11.7883 11.1072 11.4286 10.7474 11.4286 10.3036Z" fill="url(#real-fears-arrow-grad)"/>
                <defs>
                  <linearGradient id="real-fears-arrow-grad" x1="9.98568" y1="7.47965" x2="20.5393" y2="10.0167" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#4686FE"/>
                    <stop offset="1" stopColor="#1769FF"/>
                  </linearGradient>
                </defs>
              </svg>
            </button>
          </div>

          {/* ── Desktop layout ── */}
          <div className="hidden md:flex items-center justify-center gap-8 w-full">
            {/* Left: image */}
            <div
              className="relative flex-shrink-0 rounded-[16px] overflow-hidden"
              style={{ width: 544, aspectRatio: '4/3' }}
            >
              <Image
                src={CLIP_ON_REAL_FEARS_ASSETS.desktop.url}
                alt={CLIP_ON_REAL_FEARS_ASSETS.desktop.alt}
                fill
                className="object-cover object-center"
                sizes="544px"
              />
            </div>

            {/* Right: card + CTA */}
            <div className="flex flex-col gap-5 w-full max-w-[544px]">
              <div className="bg-white rounded-[16px] border border-[#12121214] shadow-[0px_8px_24px_0px_#0000000D] p-[31px_23px] flex flex-col gap-4">
                <h3 className="text-[20px] font-semibold text-[#121212] leading-[24px] tracking-[-0.1px]">
                  Every man we meet shares the same fears:
                </h3>
                <div className="flex flex-col gap-4">
                  {[
                    { emoji: '🪒', text: "I don't want to shave my head." },
                    { emoji: '💇‍♂️', text: "I want to keep my natural hair." },
                    { emoji: '🔒', text: "It must never fall off. It has to feel super secure." },
                    { emoji: '🤝', text: "Even if someone touches my head, they shouldn't know." },
                    { emoji: '👨', text: "It should look exactly like my hair before hair loss." },
                  ].map(({ emoji, text }, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-[24px] flex-shrink-0">{emoji}</span>
                      <p className="text-[18px] text-[#121212] font-medium leading-[26px] tracking-[-0.16px]">{text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={scrollToContactForm}
                className="w-full h-[56px] rounded-[12px] bg-gradient-to-r from-[#4686FE] to-[#1769FF] flex items-center justify-center gap-2 shadow-[0px_4px_8px_0px_#00000026] hover:opacity-90 transition-opacity"
              >
                <span className="text-white font-semibold text-[18px] leading-[25px] tracking-[0.2px]">
                  Discuss With A Consultant
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none" style={{ flexShrink: 0 }}>
                  <path d="M18.8 2H9.2C5.22355 2 2 5.22355 2 9.2V18.8C2 22.7765 5.22355 26 9.2 26H18.8C22.7765 26 26 22.7765 26 18.8V9.2C26 5.22355 22.7765 2 18.8 2Z" fill="white"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M11.4286 10.3036C11.4286 9.85977 11.7883 9.5 12.2321 9.5H17.6964C18.1403 9.5 18.5 9.85977 18.5 10.3036V15.7678C18.5 16.2117 18.1403 16.5714 17.6964 16.5714C17.2526 16.5714 16.8929 16.2117 16.8929 15.7678V12.2436L10.8718 18.2647C10.558 18.5784 10.0492 18.5784 9.73536 18.2647C9.42155 17.9509 9.42155 17.4421 9.73536 17.1283L15.7564 11.1072H12.2321C11.7883 11.1072 11.4286 10.7474 11.4286 10.3036Z" fill="url(#real-fears-arrow-grad-desk)"/>
                  <defs>
                    <linearGradient id="real-fears-arrow-grad-desk" x1="9.98568" y1="7.47965" x2="20.5393" y2="10.0167" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#4686FE"/>
                      <stop offset="1" stopColor="#1769FF"/>
                    </linearGradient>
                  </defs>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Three Things Every Man Wants Section */}
      <ThreeThingsSection />

      {/* Clip-On Is Perfect For Men Who Section */}
      <section className="py-[60px] md:py-[80px] lg:py-[120px] bg-[#F5F6F7] flex justify-center">
        <div className="w-full max-w-[1440px] flex flex-col lg:flex-row justify-between items-start px-[20px] md:px-[60px] lg:px-[160px] gap-[32px] lg:gap-0">

          <div className="w-full lg:w-[444px] static lg:sticky lg:top-32 self-start">
            <h2 className="text-[32px] md:text-[44px] font-extrabold text-[#121212] leading-tight lg:leading-[53px] tracking-[-0.5px] w-full lg:w-[444px] text-center lg:text-left">
              Clip-On Is Perfect For Men Who...
            </h2>
          </div>

          <div className="flex flex-col gap-[16px] w-full lg:w-[576px]">

            {/* Card 1 */}
            <div className="flex items-center gap-[16px] lg:gap-[24px] bg-white h-auto min-h-[80px] lg:h-[136px] p-[16px] lg:pl-[31px] lg:pr-[12px] rounded-[16px] border border-[#12121214] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.05)]">
              <div className="w-[52px] h-[52px] lg:w-[72px] lg:h-[72px] flex-shrink-0 flex items-center justify-center bg-[#1769FF1A] rounded-[12px] p-[10px] lg:p-[12px]">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-[32px] h-[32px] lg:w-[48px] lg:h-[48px] flex-shrink-0" viewBox="0 0 32 32" fill="none" style={{ aspectRatio: '1/1' }}>
                  <path d="M3.67187 27.9982C3.38854 27.9982 3.15109 27.9024 2.95954 27.7106C2.76776 27.519 2.67188 27.2816 2.67188 26.9982V15.3316C2.67188 14.7816 2.86776 14.3107 3.25954 13.9189C3.65109 13.5274 4.12187 13.3316 4.67187 13.3316H11.0052C11.1359 13.3316 11.2625 13.357 11.3852 13.4079C11.5077 13.459 11.6139 13.5312 11.7039 13.6246C11.7937 13.7181 11.8663 13.8264 11.9219 13.9496C11.9774 14.0729 12.0052 14.2002 12.0052 14.3316V15.9982C12.0052 17.1094 12.3941 18.0538 13.1719 18.8316C13.9497 19.6094 14.8941 19.9982 16.0052 19.9982C17.1163 19.9982 18.0607 19.6094 18.8385 18.8316C19.6163 18.0538 20.0052 17.1094 20.0052 15.9982V14.3316C20.0052 14.2009 20.0307 14.0742 20.0815 13.9516C20.1327 13.8291 20.2049 13.7229 20.2982 13.6329C20.3917 13.5431 20.5001 13.4704 20.6232 13.4149C20.7465 13.3594 20.8739 13.3316 21.0052 13.3316H27.3385C27.8885 13.3316 28.3594 13.5274 28.7512 13.9189C29.1427 14.3107 29.3385 14.7816 29.3385 15.3316V26.9982C29.3385 27.2816 29.2427 27.519 29.0512 27.7106C28.8594 27.9024 28.6219 27.9982 28.3385 27.9982H3.67187ZM15.9992 16.6649C15.7143 16.6649 15.4774 16.569 15.2885 16.3772C15.0997 16.1857 15.0052 15.9482 15.0052 15.6649C15.0052 13.2871 15.2774 10.9538 15.8219 8.6649C16.3663 6.376 17.5385 4.46489 19.3385 2.93156C19.5607 2.75378 19.8042 2.67634 20.0689 2.69923C20.3333 2.72212 20.5565 2.83289 20.7385 3.03156C20.9163 3.25378 20.9997 3.49822 20.9885 3.76489C20.9774 4.03156 20.8607 4.25378 20.6385 4.43156C19.0385 5.76489 18.033 7.4461 17.6219 9.47523C17.2107 11.5041 17.0052 13.5674 17.0052 15.6649C17.0052 15.9482 16.9087 16.1857 16.7159 16.3772C16.5232 16.569 16.2843 16.6649 15.9992 16.6649ZM7.67187 20.6649C7.96074 20.6649 8.19967 20.5704 8.38854 20.3816C8.57741 20.1927 8.67187 19.9538 8.67187 19.6649C8.67187 19.376 8.57741 19.1371 8.38854 18.9482C8.19967 18.7594 7.96074 18.6649 7.67187 18.6649C7.38301 18.6649 7.14407 18.7594 6.95521 18.9482C6.76634 19.1371 6.67187 19.376 6.67187 19.6649C6.67187 19.9538 6.76634 20.1927 6.95521 20.3816C7.14407 20.5704 7.38301 20.6649 7.67187 20.6649ZM9.00521 23.9982C9.29407 23.9982 9.53301 23.9038 9.72187 23.7149C9.91074 23.526 10.0052 23.2871 10.0052 22.9982C10.0052 22.7094 9.91074 22.4704 9.72187 22.2816C9.53301 22.0927 9.29407 21.9982 9.00521 21.9982C8.71634 21.9982 8.47741 22.0927 8.28854 22.2816C8.09967 22.4704 8.00521 22.7094 8.00521 22.9982C8.00521 23.2871 8.09967 23.526 8.28854 23.7149C8.47741 23.9038 8.71634 23.9982 9.00521 23.9982ZM24.3385 20.6649C24.6274 20.6649 24.8663 20.5704 25.0552 20.3816C25.2441 20.1927 25.3385 19.9538 25.3385 19.6649C25.3385 19.376 25.2441 19.1371 25.0552 18.9482C24.8663 18.7594 24.6274 18.6649 24.3385 18.6649C24.0497 18.6649 23.8107 18.7594 23.6219 18.9482C23.433 19.1371 23.3385 19.376 23.3385 19.6649C23.3385 19.9538 23.433 20.1927 23.6219 20.3816C23.8107 20.5704 24.0497 20.6649 24.3385 20.6649Z" fill="url(#clip-perf-1)"/>
                  <defs>
                    <linearGradient id="clip-perf-1" x1="4.11091" y1="-2.98476" x2="35.193" y2="4.88985" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#4686FE"/><stop offset="1" stopColor="#1769FF"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <p className="text-[16px] lg:text-[24px] font-medium text-[#121212] leading-snug lg:leading-[34px] tracking-[-0.25px] w-full lg:w-[410px]">
                Have thinning hair at the crown or top.
              </p>
            </div>

            {/* Card 2 */}
            <div className="flex items-center gap-[16px] lg:gap-[24px] bg-white h-auto min-h-[80px] lg:h-[136px] p-[16px] lg:pl-[31px] lg:pr-[12px] rounded-[16px] border border-[#12121214] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.05)]">
              <div className="w-[52px] h-[52px] lg:w-[72px] lg:h-[72px] flex-shrink-0 flex items-center justify-center bg-[#1769FF1A] rounded-[12px] p-[10px] lg:p-[12px]">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-[32px] h-[32px] lg:w-[48px] lg:h-[48px] flex-shrink-0" viewBox="0 0 48 48" fill="none" style={{ aspectRatio: '1/1' }}>
                  <g clipPath="url(#clip-perf-2-clip)">
                    <path d="M40.0039 19.0014C40.7996 19.0014 41.5626 19.3174 42.1252 19.8801C42.6878 20.4427 43.0039 21.2057 43.0039 22.0014C43.0039 26.5101 41.2128 30.8341 38.0247 34.0222C34.8366 37.2103 30.5126 39.0014 26.0039 39.0014H21.2399C21.7581 39.5841 22.029 40.3457 21.9953 41.1248C21.9615 41.9039 21.6257 42.6392 21.0591 43.175C20.4924 43.7107 19.7394 44.0047 18.9596 43.9947C18.1799 43.9847 17.4347 43.6715 16.8819 43.1214L11.8939 38.1334C11.3304 37.5775 11.0104 36.8209 11.0039 36.0294V35.9734C11.0099 35.2314 11.2879 34.5534 11.7399 34.0334L11.8819 33.8794L16.8819 28.8794C17.4285 28.3012 18.1824 27.9639 18.9778 27.9415C19.7731 27.9192 20.5447 28.2138 21.1229 28.7604C21.7011 29.307 22.0384 30.0609 22.0607 30.8562C22.0831 31.6516 21.7885 32.4232 21.2419 33.0014H26.0039C28.9213 33.0014 31.7192 31.8425 33.7821 29.7796C35.845 27.7167 37.0039 24.9188 37.0039 22.0014C37.0039 21.2057 37.32 20.4427 37.8826 19.8801C38.4452 19.3174 39.2083 19.0014 40.0039 19.0014ZM31.1239 4.88138L36.1239 9.88138C36.6857 10.4439 37.0013 11.2064 37.0013 12.0014C37.0013 12.7964 36.6857 13.5589 36.1239 14.1214L31.1239 19.1214C30.5698 19.6648 29.8266 19.9723 29.0505 19.9793C28.2744 19.9863 27.5258 19.6923 26.9619 19.159C26.3981 18.6257 26.0628 17.8946 26.0267 17.1193C25.9905 16.344 26.2562 15.5849 26.7679 15.0014H22.0039C19.0865 15.0014 16.2886 16.1603 14.2257 18.2232C12.1628 20.2861 11.0039 23.084 11.0039 26.0014C11.0039 26.797 10.6878 27.5601 10.1252 28.1227C9.56262 28.6853 8.79956 29.0014 8.00391 29.0014C7.20826 29.0014 6.4452 28.6853 5.88259 28.1227C5.31998 27.5601 5.00391 26.797 5.00391 26.0014C5.00391 21.4927 6.79497 17.1687 9.98309 13.9806C13.1712 10.7924 17.4952 9.00138 22.0039 9.00138H26.7679C26.2497 8.41864 25.9788 7.65702 26.0125 6.87794C26.0463 6.09885 26.3821 5.36352 26.9488 4.8278C27.5154 4.29208 28.2684 3.99806 29.0482 4.00806C29.8279 4.01806 30.5712 4.33129 31.1239 4.88138Z" fill="url(#clip-perf-2-grad)"/>
                  </g>
                  <defs>
                    <linearGradient id="clip-perf-2-grad" x1="7.05454" y1="-4.96861" x2="51.8516" y2="5.2651" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#4686FE"/><stop offset="1" stopColor="#1769FF"/>
                    </linearGradient>
                    <clipPath id="clip-perf-2-clip">
                      <rect width="48" height="48" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <p className="text-[16px] lg:text-[24px] font-medium text-[#121212] leading-snug lg:leading-[34px] tracking-[-0.25px] w-full lg:w-[410px]">
                Want the freedom to wear or remove it anytime.
              </p>
            </div>

            {/* Card 3 */}
            <div className="flex items-center gap-[16px] lg:gap-[24px] bg-white h-auto min-h-[80px] lg:h-[136px] p-[16px] lg:pl-[31px] lg:pr-[12px] rounded-[16px] border border-[#12121214] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.05)]">
              <div className="w-[52px] h-[52px] lg:w-[72px] lg:h-[72px] flex-shrink-0 flex items-center justify-center bg-[#1769FF1A] rounded-[12px] p-[10px] lg:p-[12px]">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-[32px] h-[32px] lg:w-[48px] lg:h-[48px] flex-shrink-0" viewBox="0 0 48 48" fill="none" style={{ aspectRatio: '1/1' }}>
                  <path d="M23.1713 5.99927C23.9214 5.24939 24.9386 4.82812 25.9993 4.82813C27.0599 4.82812 28.0772 5.24939 28.8273 5.99927L29.9993 7.16927L31.1713 5.99927C31.879 5.29193 32.8261 4.87553 33.8258 4.83221C34.8254 4.78889 35.805 5.1218 36.5713 5.76527L36.8273 5.99927L41.9993 11.1713C42.7492 11.9214 43.1704 12.9386 43.1704 13.9993C43.1704 15.0599 42.7492 16.0772 41.9993 16.8273L40.8273 17.9993L41.9993 19.1713C42.7492 19.9214 43.1704 20.9386 43.1704 21.9993C43.1704 23.0599 42.7492 24.0772 41.9993 24.8273L24.8273 41.9993C24.0772 42.7492 23.0599 43.1704 21.9993 43.1704C20.9386 43.1704 19.9214 42.7492 19.1713 41.9993L17.9993 40.8273L16.8273 41.9993C16.0772 42.7492 15.0599 43.1704 13.9993 43.1704C12.9386 43.1704 11.9214 42.7492 11.1713 41.9993L5.99927 36.8273C5.24939 36.0772 4.82813 35.0599 4.82813 33.9993C4.82812 32.9386 5.24939 31.9214 5.99927 31.1713L7.16927 29.9973L5.99927 28.8273C5.29193 28.1196 4.87553 27.1724 4.83221 26.1728C4.78889 25.1731 5.1218 24.1935 5.76527 23.4273L5.99927 23.1693L23.1713 5.99927ZM29.2253 14.4193C28.8233 14.1084 28.3181 13.9623 27.8122 14.0105C27.3064 14.0587 26.8378 14.2976 26.5018 14.6787C26.1657 15.0598 25.9873 15.5546 26.0028 16.0625C26.0183 16.5704 26.2266 17.0534 26.5853 17.4133L27.1693 17.9993L25.0333 20.1333C24.4648 19.9821 23.8701 19.958 23.2913 20.0626C22.7124 20.1672 22.1637 20.398 21.6842 20.7386C21.2046 21.0792 20.8059 21.5212 20.5165 22.0332C20.227 22.5453 20.0538 23.1148 20.0093 23.7013L19.9993 23.9993L20.0093 24.2993C20.0293 24.5493 20.0693 24.7953 20.1333 25.0333L17.9993 27.1693L17.4133 26.5853L17.2253 26.4193C16.8233 26.1084 16.3181 25.9623 15.8122 26.0105C15.3064 26.0587 14.8378 26.2976 14.5018 26.6787C14.1657 27.0598 13.9873 27.5546 14.0028 28.0625C14.0183 28.5704 14.2266 29.0534 14.5853 29.4133L15.1693 29.9993L14.5853 30.5853L14.4193 30.7733C14.1084 31.1753 13.9623 31.6805 14.0105 32.1863C14.0587 32.6922 14.2976 33.1607 14.6787 33.4968C15.0598 33.8328 15.5546 34.0112 16.0625 33.9957C16.5704 33.9802 17.0534 33.772 17.4133 33.4133L17.9993 32.8293L18.5853 33.4133L18.7733 33.5793C19.1753 33.8901 19.6805 34.0363 20.1863 33.9881C20.6922 33.9399 21.1607 33.701 21.4968 33.3198C21.8328 32.9387 22.0112 32.4439 21.9957 31.936C21.9802 31.4281 21.772 30.9452 21.4133 30.5853L20.8293 29.9993L22.9673 27.8653C23.6453 28.0449 24.3587 28.0434 25.0359 27.8608C25.7132 27.6783 26.3307 27.3211 26.8266 26.825C27.3225 26.3289 27.6794 25.7113 27.8617 25.0339C28.044 24.3566 28.0452 23.6432 27.8653 22.9653L29.9993 20.8293L30.5853 21.4133L30.7733 21.5793C31.1753 21.8901 31.6805 22.0363 32.1863 21.9881C32.6922 21.9399 33.1607 21.701 33.4968 21.3198C33.8328 20.9387 34.0112 20.4439 33.9957 19.936C33.9802 19.4281 33.772 18.9452 33.4133 18.5853L32.8293 17.9993L33.4133 17.4133L33.5793 17.2253C33.8901 16.8233 34.0363 16.3181 33.9881 15.8122C33.9399 15.3064 33.701 14.8378 33.3198 14.5018C32.9387 14.1657 32.4439 13.9873 31.936 14.0028C31.4281 14.0183 30.9452 14.2266 30.5853 14.5853L29.9993 15.1693L29.4133 14.5853L29.2253 14.4193Z" fill="url(#clip-perf-3-grad)"/>
                  <defs>
                    <linearGradient id="clip-perf-3-grad" x1="6.89723" y1="-3.77906" x2="51.8585" y2="7.02927" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#4686FE"/><stop offset="1" stopColor="#1769FF"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <p className="text-[16px] lg:text-[24px] font-medium text-[#121212] leading-snug lg:leading-[34px] tracking-[-0.25px] w-full lg:w-[410px]">
                Are not ready to shave their head for a stick-on system.
              </p>
            </div>

            {/* Card 4 */}
            <div className="flex items-center gap-[16px] lg:gap-[24px] bg-white h-auto min-h-[80px] lg:h-[136px] p-[16px] lg:pl-[31px] lg:pr-[12px] rounded-[16px] border border-[#12121214] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.05)]">
              <div className="w-[52px] h-[52px] lg:w-[72px] lg:h-[72px] flex-shrink-0 flex items-center justify-center bg-[#1769FF1A] rounded-[12px] p-[10px] lg:p-[12px]">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-[32px] h-[32px] lg:w-[48px] lg:h-[48px] flex-shrink-0" viewBox="0 0 48 48" fill="none" style={{ aspectRatio: '1/1' }}>
                  <g clipPath="url(#clip-perf-4-clip)">
                    <path fillRule="evenodd" clipRule="evenodd" d="M32.4631 1.35577C33.802 0.0168274 35.9728 0.0168274 37.3117 1.35577L46.6474 10.6915C47.9866 12.0304 47.9866 14.2013 46.6474 15.5402C45.3085 16.8792 43.1379 16.8792 41.7987 15.5402L39.5554 13.2967L35.0684 17.7837L43.5356 26.251C44.8744 27.5899 44.8744 29.7608 43.5356 31.0997C42.1967 32.4387 40.0258 32.4387 38.6869 31.0997L35.2552 27.6682L23.6951 39.4601L23.6838 39.4714C22.9466 40.2096 22.0711 40.7952 21.1074 41.1946C20.1437 41.594 19.1108 41.7998 18.0676 41.7998C17.0244 41.7998 15.9914 41.594 15.0278 41.1946C14.267 40.8792 13.5612 40.4479 12.9349 39.9171L6.19279 46.6591C4.85383 47.9983 2.68299 47.9983 1.34405 46.6591C0.00510865 45.3202 0.00510865 43.1496 1.34405 41.8104L8.08621 35.0684C7.5554 34.442 7.12409 33.7363 6.80869 32.9755C6.40923 32.0118 6.20362 30.9788 6.20362 29.9357C6.20362 28.8925 6.40923 27.8595 6.80869 26.8959C7.20819 25.9322 7.79369 25.0567 8.53176 24.3195L8.54311 24.3081L20.3351 12.748L16.9035 9.31641C15.5646 7.97745 15.5646 5.80662 16.9035 4.46766C18.2425 3.12872 20.4133 3.12872 21.7523 4.46766L30.2195 12.935L34.7067 8.44796L32.4631 6.2045C31.1242 4.86555 31.1242 2.69471 32.4631 1.35577Z" fill="url(#clip-perf-4-grad)"/>
                  </g>
                  <defs>
                    <linearGradient id="clip-perf-4-grad" x1="2.89298" y1="-10.2692" x2="58.3722" y2="3.06763" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#4686FE"/><stop offset="1" stopColor="#1769FF"/>
                    </linearGradient>
                    <clipPath id="clip-perf-4-clip">
                      <rect width="48" height="48" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <p className="text-[16px] lg:text-[24px] font-medium text-[#121212] leading-snug lg:leading-[34px] tracking-[-0.25px] w-full lg:w-[410px]">
                Are still continuing a treatment and need coverage.
              </p>
            </div>

            {/* Card 5 */}
            <div className="flex items-center gap-[16px] lg:gap-[24px] bg-white h-auto min-h-[80px] lg:h-[136px] p-[16px] lg:pl-[31px] lg:pr-[12px] rounded-[16px] border border-[#12121214] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.05)]">
              <div className="w-[52px] h-[52px] lg:w-[72px] lg:h-[72px] flex-shrink-0 flex items-center justify-center bg-[#1769FF1A] rounded-[12px] p-[10px] lg:p-[12px]">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-[32px] h-[32px] lg:w-[48px] lg:h-[48px] flex-shrink-0" viewBox="0 0 48 48" fill="none" style={{ aspectRatio: '1/1' }}>
                  <path d="M41.6317 25.3638C43.1405 25.3638 44.0835 23.7304 43.3291 22.4237C42.9789 21.8174 42.3319 21.4438 41.6317 21.4438C29.5189 21.1693 23.9917 15.5638 23.9917 3.80375C23.9917 2.72135 23.1141 1.84375 22.0317 1.84375C20.9493 1.84375 20.0717 2.72135 20.0717 3.80375C20.0717 15.6617 14.4073 21.2674 2.43166 21.4438C0.922863 21.4438 -0.0201372 23.0772 0.734263 24.3838C1.08446 24.9902 1.73146 25.3638 2.43166 25.3638C14.3093 25.3638 19.8953 30.9693 20.0717 43.0037C20.0717 44.0863 20.9491 44.9637 22.0317 44.9637C23.1141 44.9637 23.9917 44.0862 23.9917 43.0037C24.5993 30.9105 30.1657 25.3638 41.5141 25.3638H41.6317Z" fill="url(#clip-perf-5-grad-a)"/>
                  <path d="M33.8393 7.95589H36.2893V10.4059C36.2893 11.5375 37.5143 12.2447 38.4943 11.6789C38.9491 11.4163 39.2293 10.9311 39.2293 10.4059V7.95589H41.6793C42.8109 7.95589 43.5181 6.73089 42.9523 5.75089C42.6897 5.29609 42.2045 5.01589 41.6793 5.01589H39.2293V2.56589C39.2293 1.43429 38.0043 0.727092 37.0243 1.29289C36.5695 1.55549 36.2893 2.04069 36.2893 2.56589V5.01589H33.8393C32.7077 5.01589 32.0005 6.24089 32.5663 7.22089C32.8289 7.67569 33.3141 7.95589 33.8393 7.95589Z" fill="url(#clip-perf-5-grad-b)"/>
                  <path d="M46.0387 40.0628H43.5887V37.6128C43.5887 36.4812 42.3637 35.774 41.3837 36.3398C40.9289 36.6024 40.6487 37.0876 40.6487 37.6128V40.0628H38.1987C37.0671 40.0628 36.3599 41.2878 36.9257 42.2678C37.1883 42.7226 37.6735 43.0028 38.1987 43.0028H40.6487V45.4528C40.6487 46.5844 41.8737 47.2916 42.8537 46.7258C43.3085 46.4632 43.5887 45.978 43.5887 45.4528V43.0028H46.0387C47.1703 43.0028 47.8775 41.7778 47.3117 40.7978C47.0491 40.343 46.5639 40.0628 46.0387 40.0628Z" fill="url(#clip-perf-5-grad-c)"/>
                  <defs>
                    <linearGradient id="clip-perf-5-grad-a" x1="2.79599" y1="-7.83595" x2="53.3658" y2="4.32227" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#4686FE"/><stop offset="1" stopColor="#1769FF"/>
                    </linearGradient>
                    <linearGradient id="clip-perf-5-grad-b" x1="32.9491" y1="-1.32714" x2="45.5951" y2="1.71285" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#4686FE"/><stop offset="1" stopColor="#1769FF"/>
                    </linearGradient>
                    <linearGradient id="clip-perf-5-grad-c" x1="37.3085" y1="33.7197" x2="49.9545" y2="36.7597" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#4686FE"/><stop offset="1" stopColor="#1769FF"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <p className="text-[16px] lg:text-[24px] font-medium text-[#121212] leading-snug lg:leading-[34px] tracking-[-0.25px] w-full lg:w-[410px]">
                Just want to look younger and feel confident again.
              </p>
            </div>

            {/* Blue CTA Card */}
            <div className="relative flex min-h-[196px] w-full flex-col overflow-hidden rounded-[16px] border border-[#12121214] bg-[linear-gradient(125.4deg,#4686fe_-1.21%,#1769ff_101.21%)] p-[24px] lg:min-h-[164px] lg:w-[576px] lg:flex-row lg:items-start lg:gap-[36px] lg:p-[24px_28px_24px_31px]">
              <div className="relative mb-[14px] h-[26px] w-[50px] flex-shrink-0 lg:mb-0 lg:mt-[7px] lg:h-[40px] lg:w-[76px]">
                <svg width="76" height="40" viewBox="0 0 76 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <g clipPath="url(#clip-smile-clip)">
                    <mask id="clip-smile-mask" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="0" y="-1" width="76" height="41">
                      <path d="M0 -0.000732422H76V39.9993H0V-0.000732422Z" fill="white"/>
                    </mask>
                    <g mask="url(#clip-smile-mask)">
                      <path fillRule="evenodd" clipRule="evenodd" d="M71.9557 5.74685C57.691 32.593 29.1971 43.5079 2.73188 28.393C2.30974 28.1522 1.81071 28.09 1.34344 28.2198C0.876173 28.3497 0.478514 28.6611 0.237051 29.0863C-0.0020246 29.5153 -0.0632084 30.0227 0.0669253 30.4973C0.197059 30.9718 0.50788 31.3747 0.931184 31.6176C29.2984 47.833 59.892 36.274 75.1812 7.50787C75.4102 7.07381 75.4604 6.56567 75.3206 6.09432C75.1809 5.62298 74.8627 5.22671 74.4353 4.99198C74.0068 4.76371 73.5068 4.71491 73.043 4.8561C72.5792 4.99728 72.1888 5.31716 71.9557 5.74685Z" fill="white"/>
                      <path d="M24.9993 16.8797C26.4142 16.8797 27.7713 16.3108 28.7718 15.2981C29.7724 14.2854 30.3345 12.9119 30.3345 11.4797C30.3345 10.0476 29.7724 8.67404 28.7718 7.66134C27.7713 6.64865 26.4142 6.07972 24.9993 6.07972C23.5843 6.07972 22.2272 6.64865 21.2267 7.66134C20.2262 8.67404 19.6641 10.0476 19.6641 11.4797C19.6641 12.9119 20.2262 14.2854 21.2267 15.2981C22.2272 16.3108 23.5843 16.8797 24.9993 16.8797ZM47.0869 11.1351C48.4742 11.1351 49.8047 10.5773 50.7856 9.58442C51.7666 8.59154 52.3177 7.2449 52.3177 5.84074C52.3177 4.43659 51.7666 3.08995 50.7856 2.09707C49.8047 1.10418 48.4742 0.546387 47.0869 0.546387C45.6996 0.546387 44.3691 1.10418 43.3881 2.09707C42.4072 3.08995 41.8561 4.43659 41.8561 5.84074C41.8561 7.2449 42.4072 8.59154 43.3881 9.58442C44.3691 10.5773 45.6996 11.1351 47.0869 11.1351Z" fill="white"/>
                    </g>
                  </g>
                  <defs>
                    <clipPath id="clip-smile-clip">
                      <rect width="76" height="40" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <div className="flex flex-col items-start">
                <h3 className="mb-[10px] text-[20px] font-bold leading-[25px] tracking-[-0.5px] text-white lg:mb-[4px] lg:text-[26px] lg:leading-[31px]">
                  If this sounds like YOU,<br />Clip-On is made for YOU.
                </h3>
                <p className="mb-[18px] w-full text-[14px] font-normal leading-[20px] tracking-[-0.16px] text-white lg:mb-[12px] lg:w-[360px]">
                  It&apos;s light, secure, and looks just like your real hair.
                </p>
                <button type="button" onClick={scrollToContactForm} className="flex items-center gap-[8px] rounded-[8px] bg-white px-[16px] py-[8px] transition-opacity hover:bg-opacity-90 lg:inline-flex lg:py-[10px] lg:pl-[20px] lg:pr-[12px]">
                  <span className="text-[#121212] font-semibold text-[14px] leading-[18px] tracking-[-0.1px]">Talk to an Expert</span>
                  <ArrowUpRight className="w-[22px] h-[24px] text-[#121212]" />
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 21-Point Checklist Section */}
      <Checklist />

      {/* Our Achievements Section */}
      <Achievements />

      <SocialProof />

      {/* Why Choose American Hairline Section */}
      <section className="bg-[#F5F6F7] py-[120px] px-4 md:px-10 xl:px-[160px]">
        <div className="max-w-[1440px] mx-auto flex flex-col items-center">
          <h2 className="text-[32px] md:text-[44px] font-extrabold text-[#121212] text-center leading-[1.2] tracking-[-0.5px] mb-[64px] max-w-[800px]">
            Why Thousands Of Men<br className="hidden md:block" />
            Choose American Hairline
          </h2>
          <div className="flex flex-col w-full max-w-[1120px] gap-6">
            <div className="flex flex-col md:flex-row gap-6 w-full">
              <div className="flex-1 bg-white rounded-[16px] border border-[#12121214] shadow-[0px_8px_24px_0px_#0000000D] p-6 md:px-6 md:py-[26px] flex items-center gap-4 min-h-[80px]">
                <div className="relative w-6 h-6 flex-shrink-0">
                  <Image src="/assets/icon-check-blue-square.svg" alt="Check" fill className="object-contain" />
                </div>
                <p className="text-[18px] md:text-[20px] text-[#121212] leading-[24px] tracking-[-0.1px]">
                  Specialists in <span className="font-bold">ultra-natural</span> blending
                </p>
              </div>
              <div className="flex-1 bg-white rounded-[16px] border border-[#12121214] shadow-[0px_8px_24px_0px_#0000000D] p-6 md:px-6 md:py-[26px] flex items-center gap-4 min-h-[80px]">
                <div className="relative w-6 h-6 flex-shrink-0">
                  <Image src="/assets/icon-check-blue-square.svg" alt="Check" fill className="object-contain" />
                </div>
                <p className="text-[18px] md:text-[20px] text-[#121212] leading-[24px] tracking-[-0.1px]">
                  <span className="font-bold">Exclusive creators</span> of Zycon™ range
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-6 w-full">
              <div className="flex-1 bg-white rounded-[16px] border border-[#12121214] shadow-[0px_8px_24px_0px_#0000000D] p-6 md:px-6 md:py-[26px] flex items-center gap-4 min-h-[80px]">
                <div className="relative w-6 h-6 flex-shrink-0">
                  <Image src="/assets/icon-check-blue-square.svg" alt="Check" fill className="object-contain" />
                </div>
                <p className="text-[18px] md:text-[20px] text-[#121212] leading-[24px] tracking-[-0.1px]">
                  <span className="font-bold">Custom-made</span> for every client
                </p>
              </div>
              <div className="flex-1 bg-white rounded-[16px] border border-[#12121214] shadow-[0px_8px_24px_0px_#0000000D] p-6 md:px-6 md:py-[26px] flex items-center gap-4 min-h-[80px]">
                <div className="relative w-6 h-6 flex-shrink-0">
                  <Image src="/assets/icon-check-blue-square.svg" alt="Check" fill className="object-contain" />
                </div>
                <p className="text-[18px] md:text-[20px] text-[#121212] leading-[24px] tracking-[-0.1px]">
                  Clients from <span className="font-bold">12+ countries</span>
                </p>
              </div>
            </div>
            <div className="flex justify-center w-full">
               <div className="w-full md:w-auto md:min-w-[544px] bg-white rounded-[16px] border border-[#12121214] shadow-[0px_8px_24px_0px_#0000000D] p-6 md:px-6 md:py-[26px] flex items-center gap-4 min-h-[80px]">
                <div className="relative w-6 h-6 flex-shrink-0">
                  <Image src="/assets/icon-check-blue-square.svg" alt="Check" fill className="object-contain" />
                </div>
                <p className="text-[18px] md:text-[20px] text-[#121212] leading-[24px] tracking-[-0.1px]">
                  <span className="font-bold">Antibacterial, odor-free, breathable</span> base built with<br className="hidden md:block" />
                  medical-grade technology
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Zycon Range Promo */}
      <section className="bg-[#F5F6F7] py-[64px] md:py-[120px] px-4 md:px-10 xl:px-[160px]">
        <div className="max-w-[1440px] mx-auto">
          <div className="relative w-full max-w-[358px] md:max-w-[1120px] mx-auto h-[583px] rounded-[20px] bg-white shadow-[0px_8px_24px_0px_#0000000D] border border-[#12121214]" style={{ overflow: 'visible' }}>
            {/* gradient + content clipped inside */}
            <div className="absolute inset-0 rounded-[20px] overflow-hidden">
              <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0085FF 0%, #A033FF 50%, #FF5C00 100%)' }} />
              <div className="relative z-10 w-full h-full flex flex-col md:flex-row items-center">
                <div className="relative z-20 flex flex-col justify-start md:justify-center px-6 pt-12 md:pt-0 md:pl-[80px] w-full md:w-1/2 h-full">
                  <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-[6px] bg-white w-fit mb-4 shadow-sm">
                    <span className="text-[#555555] text-[12px] md:text-[16px] font-bold leading-[16px] tracking-[-0.12px] uppercase">Zycon Range • Pro Series</span>
                  </div>
                  <h2 className="text-white text-[32px] md:text-[48px] font-extrabold leading-[1.1] tracking-[-0.5px] max-w-[575px]">
                    Premium Clip-On<br /><span className="text-[#121212]">With Medicated <br className="md:hidden" /> Hygiene</span>
                  </h2>
                </div>
                <div className="absolute bottom-0 left-0 right-0 z-10 flex h-full items-end justify-center overflow-hidden md:static md:w-1/2 md:justify-end">
                  <div className="relative mt-auto h-[852px] w-[479px] max-w-[78vw] -translate-y-[270px] md:mr-[-24px] md:h-[1064px] md:w-[598px] md:-translate-y-[456px]">
                    <Image
                      src={ZYCON_SECTION_ASSETS.card.desktop.url}
                      alt={ZYCON_SECTION_ASSETS.card.desktop.alt}
                      fill
                      className="hidden object-contain object-bottom md:block"
                      sizes="598px"
                    />
                    <Image
                      src={ZYCON_SECTION_ASSETS.card.mobile.url}
                      alt={ZYCON_SECTION_ASSETS.card.mobile.alt}
                      fill
                      className="object-contain object-bottom md:hidden"
                      sizes="479px"
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* + button — outside overflow:hidden so always visible */}
            <div className="absolute bottom-5 right-5 z-30 group" style={{ pointerEvents: 'auto' }}>
              <button
                onClick={() => setIsZyconModalOpen(true)}
                style={{ width: 44, height: 44, borderRadius: '50%', background: '#1769FF', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.25)', transition: 'transform 0.2s' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1)'}
              >
                <Plus className="w-6 h-6 text-white" />
              </button>
              <div className="absolute bottom-full mb-2 right-0 w-max bg-white px-3 py-1.5 rounded-[4px] shadow-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <span className="text-black text-[12px] font-semibold">Tap to read more</span>
                <div className="absolute top-full right-4 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table Section */}
      <section className="bg-[#F5F6F7] py-[120px] px-4 md:px-10 xl:px-[160px]">
        <div className="max-w-[1440px] mx-auto flex flex-col items-center">
          <h2 className="text-[32px] md:text-[44px] font-extrabold text-[#121212] text-center leading-[1.2] tracking-[-0.5px] mb-[44px]">
            Stick-On Vs. Clip-On<br />
            Hair Systems
          </h2>
          <div className="w-full max-w-[992px] rounded-[12px] shadow-[0px_8px_24px_0px_#0000000D] overflow-hidden">
            <div className="w-full flex flex-col bg-white border border-[#E5E7EB] rounded-[12px]">
              <div className="flex w-full bg-[#121212] border-b border-[#1212121F]">
                <div className="w-[30%] py-5 md:py-[44px] px-3 md:px-4 text-center text-white text-[16px] md:text-[28px] font-bold leading-[1.3] tracking-[-0.25px]">Feature</div>
                <div className="w-[35%] py-5 md:py-[44px] px-3 md:px-4 text-center text-white text-[16px] md:text-[28px] font-bold leading-[1.3] tracking-[-0.25px] border-l border-white/10">Stick-On System</div>
                <div className="w-[35%] py-5 md:py-[44px] px-3 md:px-4 text-center text-white text-[16px] md:text-[28px] font-bold leading-[1.3] tracking-[-0.25px] border-l border-white/10">Clip-On System</div>
              </div>
              <div className="flex w-full border-b border-[#E5E7EB]">
                <div className="w-[30%] py-5 md:py-[44px] px-3 md:px-4 text-center text-[#121212] text-[16px] md:text-[20px] font-bold leading-[1.4] tracking-[-0.25px]">Daily Wear</div>
                <div className="w-[35%] py-5 md:py-[44px] px-3 md:px-4 text-center text-[#121212] text-[16px] md:text-[20px] leading-[1.4] tracking-[-0.16px] border-l border-[#E5E7EB]">No (continuously wear)</div>
                <div className="w-[35%] py-5 md:py-[44px] px-3 md:px-4 text-center text-[#121212] text-[16px] md:text-[20px] leading-[1.4] tracking-[-0.16px] border-l border-[#E5E7EB]">Yes (daily removal)</div>
              </div>
              <div className="flex w-full border-b border-[#E5E7EB] bg-[#121212]/[0.02]">
                <div className="w-[30%] py-5 md:py-[44px] px-3 md:px-4 text-center text-[#121212] text-[16px] md:text-[20px] font-bold leading-[1.4] tracking-[-0.25px]">Monthly Servicing</div>
                <div className="w-[35%] py-5 md:py-[44px] px-3 md:px-4 text-center text-[#121212] text-[16px] md:text-[20px] leading-[1.4] tracking-[-0.16px] border-l border-[#E5E7EB]">Required</div>
                <div className="w-[35%] py-5 md:py-[44px] px-3 md:px-4 text-center text-[#121212] text-[16px] md:text-[20px] leading-[1.4] tracking-[-0.16px] border-l border-[#E5E7EB]">Not required</div>
              </div>
              <div className="flex w-full border-b border-[#E5E7EB]">
                <div className="w-[30%] py-5 md:py-[44px] px-3 md:px-4 text-center text-[#121212] text-[16px] md:text-[20px] font-bold leading-[1.4] tracking-[-0.25px]">Shaving Needed</div>
                <div className="w-[35%] py-5 md:py-[44px] px-3 md:px-4 text-center text-[#121212] text-[16px] md:text-[20px] leading-[1.4] tracking-[-0.16px] border-l border-[#E5E7EB]">Yes</div>
                <div className="w-[35%] py-5 md:py-[44px] px-3 md:px-4 text-center text-[#121212] text-[16px] md:text-[20px] leading-[1.4] tracking-[-0.16px] border-l border-[#E5E7EB]">No</div>
              </div>
              <div className="flex w-full border-b border-[#E5E7EB] bg-[#121212]/[0.02]">
                <div className="w-[30%] py-5 md:py-[44px] px-3 md:px-4 text-center text-[#121212] text-[16px] md:text-[20px] font-bold leading-[1.4] tracking-[-0.25px]">Active Lifestyle</div>
                <div className="w-[35%] py-5 md:py-[44px] px-3 md:px-4 text-center text-[#121212] text-[16px] md:text-[20px] leading-[1.4] tracking-[-0.16px] border-l border-[#E5E7EB]">Perfect fit</div>
                <div className="w-[35%] py-5 md:py-[44px] px-3 md:px-4 text-center text-[#121212] text-[16px] md:text-[20px] leading-[1.4] tracking-[-0.16px] border-l border-[#E5E7EB]">Great for gym &amp; daily activity</div>
              </div>
              <div className="flex w-full">
                <div className="w-[30%] py-5 md:py-[44px] px-3 md:px-4 text-center text-[#121212] text-[16px] md:text-[20px] font-bold leading-[1.4] tracking-[-0.25px]">Application Type</div>
                <div className="w-[35%] py-5 md:py-[44px] px-3 md:px-4 text-center text-[#121212] text-[16px] md:text-[20px] leading-[1.4] tracking-[-0.16px] border-l border-[#E5E7EB]">Needs professional</div>
                <div className="w-[35%] py-5 md:py-[44px] px-3 md:px-4 text-center text-[#121212] text-[16px] md:text-[20px] leading-[1.4] tracking-[-0.16px] border-l border-[#E5E7EB]">Easy to wear yourself</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ResultsTransformations />

      {/* FAQ Section */}
      <section className="bg-white py-[120px] px-4 md:px-10 xl:px-[160px]">
        <div className="max-w-[1440px] mx-auto flex flex-col items-center">
          <h2 className="text-[32px] md:text-[44px] font-extrabold text-[#121212] text-center leading-[53px] tracking-[-0.5px] mb-[44px]">
            Frequently Asked Questions
          </h2>
          <div className="flex flex-col gap-4 w-full max-w-[608px]">
            {faqItems.map((item, index) => (
              <div 
                key={index}
                className={`flex flex-col bg-white border border-[#12121214] rounded-[16px] shadow-[0px_8px_24px_0px_#0000000D] overflow-hidden transition-all duration-300 cursor-pointer ${
                  openFaq === index ? 'pb-6' : ''
                }`}
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
              >
                <div className="flex items-center justify-between p-6 md:px-6 md:py-[19px] min-h-[64px]">
                  <h3 className="text-[20px] font-semibold text-[#121212] leading-[24px] tracking-[-0.1px]">
                    {item.question}
                  </h3>
                  <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                    {openFaq === index ? (
                      <X className="w-6 h-6 text-[#121212]" strokeWidth={1.5} />
                    ) : (
                      <Plus className="w-6 h-6 text-[#121212]" strokeWidth={1.5} />
                    )}
                  </div>
                </div>
                <div 
                  className={`px-6 text-[18px] text-[#555555] leading-[25px] tracking-[-0.16px] transition-all duration-300 ease-in-out ${
                    openFaq === index ? 'max-h-[500px] opacity-100 mt-[-8px]' : 'max-h-0 opacity-0 overflow-hidden'
                  }`}
                >
                  {item.answer}
                </div>
              </div>
            ))}
            <div className="w-full bg-gradient-to-r from-[#4686FE] to-[#1769FF] rounded-[16px] p-6 md:p-[23px] flex flex-col items-start border border-[#12121214]">
              <h3 className="text-[24px] md:text-[32px] font-bold text-white leading-[42px] tracking-[-0.5px]">
                Still have questions?
              </h3>
              <p className="text-[18px] text-white leading-[24px] tracking-[-0.16px] mt-2 mb-6 max-w-[560px]">
                No worries, we're here to guide you. Talk to us, we will explain everything.
              </p>
              <button
                type="button"
                onClick={scrollToContactForm}
                className="inline-flex items-center gap-2 bg-white rounded-[8px] px-5 py-2.5 hover:bg-opacity-90 transition-opacity"
              >
                <span className="text-[#121212] font-semibold text-[18px] leading-[24px] tracking-[-0.1px]">
                  Need Guidance
                </span>
                <ArrowUpRight className="w-[22px] h-[22px] text-[#121212]" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Don't Just Hide Hair Loss Section */}
      <section className="bg-[#F5F6F7] py-[120px] px-4 md:px-10 xl:px-[160px]">
        <div className="max-w-[1440px] mx-auto flex flex-col items-center">
          <div className="w-full max-w-[800px] bg-white border border-[#12121214] rounded-[16px] shadow-[0px_8px_24px_0px_#0000000D] p-8 md:px-8 md:py-[60px] flex flex-col items-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[4px] bg-[#1769FF]" />
            <div className="flex flex-col items-center gap-9 w-full">
              <div className="flex flex-col items-center gap-4 text-center">
                <h2 className="text-[32px] md:text-[48px] font-extrabold text-[#121212] leading-[1.2] tracking-[-0.5px]">
                  Don't Just Hide Hair Loss.<br />
                  Reverse It Instantly.
                </h2>
                <p className="text-[18px] md:text-[24px] text-[#121212] leading-[34px] tracking-[-0.5px]">
                  Zycon™ India's first medical-grade clip-on hair system.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-3 w-full">
                {['Invisible', 'Secure', 'Scalp-Safe', '99.9% Antibacterial', '100% Odor-Free', 'All-Day Comfort'].map((feature, i) => (
                  <div key={i} className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#F3F6FF] border border-[#1212120D] rounded-full">
                    <Image src="/assets/icon-check-blue-square.svg" alt="Check" width={16} height={16} className="object-contain" />
                    <span className="text-[16px] md:text-[18px] text-[#121212] leading-[22px] tracking-[-0.16px]">{feature}</span>
                  </div>
                ))}
              </div>
              <div className="flex flex-col items-center gap-4 mt-2">
                <p className="text-[20px] md:text-[22px] font-bold text-[#121212] leading-[29px] tracking-[-0.25px] text-center">
                  Try it once, and you'll never look back
                </p>
                <div className="flex flex-col items-center gap-3">
                   <button
                    type="button"
                    onClick={scrollToContactForm}
                    className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-[#4686FE] to-[#1769FF] rounded-[8px] px-6 py-3 shadow-[0px_4px_8px_0px_#00000026] hover:opacity-90 transition-opacity"
                  >
                    <span className="text-white font-semibold text-[18px] leading-[25px] tracking-[0.2px]">
                      Discuss With A Consultant
                    </span>
                    <div className="bg-white p-1 rounded-[4px]">
                      <ArrowUpRight className="w-4 h-4 text-[#1769FF]" />
                    </div>
                  </button>
                  <p className="text-[14px] text-[#555555] text-center leading-[18px] tracking-[-0.16px]">
                    Only limited Zycon demo slots available<br />
                    every month.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Learn How Stick-On Works Section */}
      <section className="bg-[#F5F6F7] py-[64px] md:py-[120px] px-4 md:px-10 xl:px-[160px]">
        <div className="mx-auto flex max-w-[1440px] flex-col items-center">
          <h2 className="mb-[36px] w-full max-w-[1120px] text-left text-[32px] font-extrabold leading-[1.2] tracking-[-0.5px] text-[#121212] md:mb-[44px] md:text-[44px]">Learn How The Stick-On Hair<br />System Works</h2>
          <div className="relative h-[583px] w-full max-w-[358px] overflow-hidden rounded-[16px] bg-gradient-to-br from-[#4686FE] to-[#1769FF] shadow-[0px_8px_24px_0px_#0000000D] md:max-w-[1120px]">
            <div className="relative z-10 flex h-full flex-col md:flex-row">
              <div className="relative z-20 flex h-full w-full flex-col items-start px-[24px] pt-[28px] md:w-[52%] md:justify-center md:pl-[80px] md:pt-0">
                <div className="mb-[16px] flex h-[32px] items-center gap-[6px] rounded-[8px] border border-white bg-white px-[8px] py-[4px] backdrop-blur-[5px] md:h-auto md:px-[8px] md:py-[8px]">
                  <div className="relative h-5 w-5 flex-shrink-0">
                    <Image src="/assets/stick-on-icon.svg" alt="Stick-on Hair System" fill className="object-contain" />
                  </div>
                  <span className="bg-gradient-to-r from-[#4686FE] to-[#1769FF] bg-clip-text text-[14px] font-semibold leading-[18px] tracking-[-0.1px] text-transparent md:text-[20px] md:leading-[20px]">Stick-on Hair System</span>
                </div>
                <p className="mb-[14px] max-w-[300px] text-[20px] font-semibold leading-[24px] tracking-[-0.1px] text-white md:mb-[18px] md:max-w-[488px] md:text-[30px] md:leading-[36px]">Natural look with a secure fit you can trust. Swim, shower, workout, and live freely.</p>
                <a href="/clip-on-or-stick-on/stick-on-hair-system" className="flex items-center gap-2 text-white text-[14px] font-semibold leading-[18px] tracking-[-0.224px] transition-opacity hover:opacity-80 md:text-[20px] md:leading-normal">
                  Know more
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 12L10 8L6 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </a>
              </div>
              <div className="absolute bottom-0 left-1/2 h-[414px] w-[444px] -translate-x-1/2 md:left-auto md:right-0 md:h-[582px] md:w-[624px] md:translate-x-0">
                <Image
                  src={CLIP_ON_LEARN_STICK_ON_ASSETS.desktop.url}
                  alt={CLIP_ON_LEARN_STICK_ON_ASSETS.desktop.alt}
                  fill
                  className="hidden object-contain object-bottom md:block"
                  sizes="624px"
                />
                <Image
                  src={CLIP_ON_LEARN_STICK_ON_ASSETS.mobile.url}
                  alt={CLIP_ON_LEARN_STICK_ON_ASSETS.mobile.alt}
                  fill
                  className="object-contain object-bottom md:hidden"
                  sizes="444px"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTA />

      {/* Free E-Book Section */}
      <Ebook
        imageSrc="/assets/clip-on-ebook-cover.png"
        mobileImageSrc="/assets/clip-on-ebook-cover.png"
      />

      {/* ── Zycon Popup ─────────────────────────────────────────────────── */}
      {isZyconModalOpen && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setIsZyconModalOpen(false); }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(10,20,60,0.60)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 16,
          }}
        >
          {/* ── DESKTOP modal ── */}
          <div className="hidden md:flex"
            style={{
              background: '#F2F3F5',
              borderRadius: 20,
              width: 'min(1100px, calc(100vw - 64px))',
              height: 'min(620px, calc(100vh - 80px))',
              overflow: 'hidden',
              position: 'relative',
              flexDirection: 'row',
            }}
          >
            <button
              onClick={() => setIsZyconModalOpen(false)}
              style={{
                position: 'absolute', top: 20, right: 20,
                width: 40, height: 40, borderRadius: '50%',
                background: '#121212', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </button>
            {/* Left: text */}
            <div style={{
              width: '40%', minWidth: 320, flexShrink: 0,
              padding: '64px 56px',
              display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 20,
            }}>
              <h2 style={{ fontSize: 26, fontWeight: 800, color: '#121212', margin: 0, lineHeight: 1.25, letterSpacing: '-0.4px' }}>
                Premium Clip-On With Medicated Hygiene –{' '}
                <span style={{ color: '#BA62FC' }}>Zycon Range</span> • <span style={{ color: '#F2416B' }}>Pro Series</span>
              </h2>
              <p style={{ fontSize: 15, color: '#444', lineHeight: 1.7, margin: 0 }}>
                The Zycon range is a clip-on hair system that supports scalp health by using <b style={{ color: '#121212' }}>antibacterial protection</b> and <b style={{ color: '#121212' }}>controlling odor</b>. It is designed to help you stay comfortable, confident, and unrestricted in your <b style={{ color: '#121212' }}>active lifestyle</b>.
              </p>
              <a href="/contact-us" style={{ color: '#1769FF', fontSize: 15, fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                Know more
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6 12L10 8L6 4" stroke="#1769FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </a>
            </div>
            {/* Right: image */}
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
              <Image
                src={ZYCON_SECTION_ASSETS.popup.desktop.url}
                alt={ZYCON_SECTION_ASSETS.popup.desktop.alt}
                fill
                style={{ objectFit: 'contain', objectPosition: 'center bottom' }}
                sizes="770px"
              />
            </div>
          </div>

          {/* ── MOBILE modal ── */}
          <div className="flex md:hidden"
            style={{
              background: '#fff',
              borderRadius: 20,
              width: 'calc(100vw - 32px)',
              height: 'calc(100vh - 48px)',
              flexDirection: 'column',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <button
              onClick={() => setIsZyconModalOpen(false)}
              style={{
                position: 'absolute', top: 16, right: 16,
                width: 36, height: 36, borderRadius: '50%',
                background: '#121212', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </button>
            {/* Text — top */}
            <div style={{ padding: '32px 24px 20px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 12, paddingRight: 60 }}>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: '#121212', margin: 0, lineHeight: 1.3, letterSpacing: '-0.3px' }}>
                Premium Clip-On with medicated hygiene –{' '}
                <span style={{ color: '#BA62FC' }}>Zycon Range</span> • <span style={{ color: '#F2416B' }}>Pro Series</span>
              </h2>
              <p style={{ fontSize: 18, color: '#555', lineHeight: 1.65, margin: 0 }}>
                The Zycon range is a clip-on hair system that supports scalp health by using <b style={{ color: '#121212' }}>antibacterial protection</b> and <b style={{ color: '#121212' }}>controlling odor</b>. It is designed to help you stay comfortable, confident, and unrestricted in your <b style={{ color: '#121212' }}>active lifestyle</b>.
              </p>
              <a href="/contact-us" style={{ color: '#1769FF', fontSize: 18, fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                Know more
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6 12L10 8L6 4" stroke="#1769FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </a>
            </div>
            {/* Image — fills remaining space */}
            <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
              <Image
                src={ZYCON_SECTION_ASSETS.popup.mobile.url}
                alt={ZYCON_SECTION_ASSETS.popup.mobile.alt}
                fill
                style={{ objectFit: 'contain', objectPosition: 'center bottom' }}
                sizes="508px"
              />
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
