'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { createPortal } from 'react-dom';
import { Calendar, X, Check } from 'lucide-react';

import { ContactForm } from '@/components/homepage/ContactForm';
import { Ebook } from '@/components/homepage/Ebook';
import { WorldsFinestHairSystems } from '@/components/homepage/WorldsFinestHairSystems';
import { useSnapCarousel } from '@/components/carousel/useSnapCarousel';
import { LazyGumletEmbed } from '@/components/video/LazyGumletEmbed';
import { STICK_ON_LIFESPAN_BASE_ASSETS, STICK_ON_LIFESPAN_CAR_ASSETS } from './stickOnLifespanAssets';

export default function StickOnSystemLifespanPage() {
  const [activeModal, setActiveModal] = useState<'thin' | 'thick' | null>(null);

  const openModal = useCallback((type: 'thin' | 'thick') => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    setActiveModal(type);
  }, []);

  const closeModal = useCallback(() => {
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    setActiveModal(null);
  }, []);

  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  return (
    <main className="bg-white min-h-screen overflow-x-hidden">

      {/* Hero Section */}
      <section className="flex flex-col items-center py-12 md:py-[120px] px-5 md:px-[160px] max-w-[1440px] mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#F3F6FF] border border-[#1212120D] rounded-[6px] mb-3">
          <Calendar className="w-4 h-4 text-[#1769FF]" strokeWidth={2} />
          <span className="text-[#1769FF] text-[13px] md:text-[14px] font-medium leading-[20px] tracking-[0.06px]">Stick-On System Lifespan</span>
        </div>
        <h1 className="text-[#121212] text-center text-[28px] md:text-[64px] font-extrabold leading-[1.2] tracking-[-0.5px] max-w-[900px] mb-3 md:mb-4">
          How Long Does a Stick-On Hair System Last?
        </h1>
        <p className="text-[#121212] text-center text-[16px] md:text-[20px] leading-[26px] md:leading-[31px] tracking-[-0.1px] max-w-[780px] mb-8 md:mb-[44px]">
          It ultimately depends on what matters most to you, whether it's an <span className="font-bold">ultra-natural look</span> or <span className="font-bold">longer system life</span>. At American Hairline, we help you find the perfect choice for your <span className="font-bold">lifestyle</span>, <span className="font-bold">budget</span>, and <span className="font-bold">expectations</span>.
        </p>
        <div className="relative w-full max-w-[1120px] rounded-[12px] md:rounded-[16px] overflow-hidden shadow-[0px_8px_24px_0px_rgba(0,0,0,0.05)]">
          {/* Mobile Video (4:5) */}
          <div className="block md:hidden" style={{ position: 'relative', aspectRatio: '4/5' }}>
            <LazyGumletEmbed
              title="Stick-On System Lifespan mobile"
              embedSrc="https://play.gumlet.io/embed/69dc8fdfc6b8ccb79da8cd92?background=false&autoplay=false&loop=false&disable_player_controls=false"
              rootMargin="160px 0px"
              placeholderLabel="Video loads when in view"
            />
          </div>
          {/* Desktop Video (16:9) */}
          <div className="hidden md:block" style={{ position: 'relative', aspectRatio: '16/9' }}>
            <LazyGumletEmbed
              title="Stick-On System Lifespan desktop"
              embedSrc="https://play.gumlet.io/embed/69dc8fdfc6b8ccb79da8cd90?background=false&autoplay=false&loop=false&disable_player_controls=false"
              rootMargin="160px 0px"
              placeholderLabel="Video loads when in view"
            />
          </div>
          {/* Text overlay */}
          <div className="absolute bottom-0 left-0 w-full h-[35%] bg-gradient-to-t from-[#181E25] to-transparent pointer-events-none z-10" />
          <div className="absolute bottom-0 left-0 w-full p-6 md:p-[50px] flex flex-col items-center justify-end text-center pointer-events-none z-10">
            <h2 className="uppercase italic font-black text-[22px] md:text-[44px] leading-[28px] md:leading-[53px] tracking-[1px]">
              <span className="text-white block">Stick-On</span>
              <span className="text-white/50 block">System Lifespan</span>
            </h2>
          </div>
        </div>
      </section>

      {/* Choose Your Perfect Balance Section */}
      <section className="bg-[#F5F6F7] py-12 md:py-[120px] px-5 md:px-[160px]">
        <div className="max-w-[1440px] mx-auto flex flex-col items-center">
          <h2 className="text-[22px] md:text-[44px] font-extrabold text-[#121212] text-center leading-[1.2] tracking-[-0.5px] max-w-[700px] mb-6 md:mb-[44px]">
            Choose Your Perfect Balance: Look, Comfort, or Lifespan?
          </h2>
          <div className="flex flex-col md:flex-row gap-4 md:gap-8 w-full mb-8 md:mb-[48px]">
            <div className="flex flex-col bg-white border border-[#12121214] rounded-[12px] md:rounded-[16px] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.05)] p-6 md:p-[32px] flex-1 gap-4 md:gap-6">
              <h3 className="text-[20px] md:text-[32px] font-bold text-[#121212] leading-[1.3] tracking-[-0.5px]">Option (A):</h3>
              <div className="flex flex-col gap-4 md:gap-6">
                <div className="flex items-center gap-3"><span className="text-[22px] md:text-[28px] leading-none">🍀</span><span className="text-[16px] md:text-[22px] font-medium text-[#121212] leading-[1.3] tracking-[-0.1px]">Ultra-natural look</span></div>
                <div className="flex items-center gap-3"><span className="text-[22px] md:text-[28px] leading-none">❤️</span><span className="text-[16px] md:text-[22px] font-medium text-[#121212] leading-[1.3] tracking-[-0.1px]">Extreme comfort and lightweight</span></div>
              </div>
            </div>
            <div className="flex flex-col bg-white border border-[#12121214] rounded-[12px] md:rounded-[16px] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.05)] p-6 md:p-[32px] flex-1 gap-4 md:gap-6">
              <h3 className="text-[20px] md:text-[32px] font-bold text-[#121212] leading-[1.3] tracking-[-0.5px]">Option (B):</h3>
              <div className="flex items-center gap-3"><span className="text-[22px] md:text-[28px] leading-none">🕰️</span><span className="text-[16px] md:text-[22px] font-medium text-[#121212] leading-[1.3] tracking-[-0.1px]">Long lifespan and durable</span></div>
            </div>
          </div>
          <p className="text-center text-[18px] md:text-[28px] leading-[26px] md:leading-[36px] tracking-[-0.25px] mb-7 md:mb-[36px]">
            <span className="font-bold text-[#121212]">You can get only 1 out of 2. </span>
            <span className="font-bold text-[#121212]/50">That's why we design based on what YOU value most.</span>
          </p>
          <a href="#contact-form" className="flex h-[52px] w-full max-w-[358px] items-center justify-center gap-2 rounded-[8px] bg-gradient-to-r from-[#4686FE] to-[#1769FF] px-6 py-[14px] shadow-[0px_4px_8px_0px_rgba(0,0,0,0.15)] transition-opacity hover:opacity-90 md:inline-flex md:w-auto md:px-6">
            <span className="text-white text-[16px] md:text-[18px] font-semibold leading-[25px] tracking-[0.2px]">Talk to an Expert</span>
            <svg className="h-7 w-7 flex-shrink-0" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <path d="M18.8 2H9.2C5.22355 2 2 5.22355 2 9.2V18.8C2 22.7765 5.22355 26 9.2 26H18.8C22.7765 26 26 22.7765 26 18.8V9.2C26 5.22355 22.7765 2 18.8 2Z" fill="white" />
              <path fillRule="evenodd" clipRule="evenodd" d="M11.4286 10.3036C11.4286 9.85977 11.7883 9.5 12.2321 9.5H17.6964C18.1403 9.5 18.5 9.85977 18.5 10.3036V15.7678C18.5 16.2117 18.1403 16.5714 17.6964 16.5714C17.2526 16.5714 16.8929 16.2117 16.8929 15.7678V12.2436L10.8718 18.2647C10.558 18.5784 10.0492 18.5784 9.73536 18.2647C9.42155 17.9509 9.42155 17.4421 9.73536 17.1283L15.7564 11.1072H12.2321C11.7883 11.1072 11.4286 10.7474 11.4286 10.3036Z" fill="url(#choose-balance-cta-gradient)" />
              <defs>
                <linearGradient id="choose-balance-cta-gradient" x1="9.98568" y1="7.47965" x2="20.5393" y2="10.0167" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#4686FE" />
                  <stop offset="1" stopColor="#1769FF" />
                </linearGradient>
              </defs>
            </svg>
          </a>
        </div>
      </section>

      {/* Two Base Options Section */}
      <section id="base-options" className="bg-white py-12 md:py-[120px] px-5 md:px-[160px]">
        <div className="max-w-[1120px] mx-auto flex flex-col gap-6 md:gap-[44px]">
          <h2 className="text-[22px] md:text-[44px] font-extrabold text-[#121212] leading-[1.2] tracking-[-0.5px] capitalize">
            Two Base Options for Your Stick-On Hair System
          </h2>
          <div className="md:hidden"><BaseOptionsCarousel onOpenModal={openModal} /></div>
          <div className="hidden md:flex flex-row gap-8 w-full">
            {baseCards.map((card) => (
              <div key={card.id} className="relative flex h-[698px] w-[544px] flex-shrink-0 flex-col overflow-hidden rounded-[16px] border border-[#12121214] bg-white p-8 shadow-[0px_8px_24px_0px_rgba(0,0,0,0.05)]">
                <div className="mb-5 inline-flex items-center justify-center gap-[6px] self-start rounded-[6px] bg-[#12121212] px-3 py-[5px]"><GearIcon /><span className="text-[12px] font-semibold leading-[16px] tracking-[-0.12px] text-[#555555]">{card.label}</span></div>
                <div className="flex flex-col gap-2 mb-4">
                  <h3 className="text-[24px] xl:text-[28px] font-bold text-[#121212] leading-[1.2] tracking-[-0.5px]">{card.title}</h3>
                  <p className="text-[15px] xl:text-[17px] font-medium text-[#555555] leading-[1.5]">{card.desc}</p>
                </div>
                <div className="relative mt-auto h-[472px] w-[472px]">
                  <Image src={card.card.desktop.url} alt={card.card.desktop.alt} fill className="object-contain object-bottom" sizes="472px" />
                  <button type="button" onClick={() => openModal(card.id)} className="absolute bottom-0 right-0 z-10 flex h-[44px] w-[44px] cursor-pointer items-center justify-center rounded-full transition-transform hover:scale-110" aria-label={`Read more about ${card.title}`}>
                    <PlusCircleIcon />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Car Example Section */}
      <section className="bg-[#F5F6F7] py-12 md:py-[120px] px-5 md:px-[160px]">
        <div className="max-w-[1440px] mx-auto flex flex-col items-start gap-6 md:gap-[44px]">
          <h2 className="text-[22px] md:text-[44px] font-extrabold text-[#121212] leading-[1.2] tracking-[-0.5px] max-w-[800px]">Car Example: Think Of It Like This Before Choosing</h2>
          <div className="md:hidden w-full"><CarExampleCarousel /></div>
          <div className="hidden md:flex flex-row gap-8 w-full">
            {carCards.map((card) => (
              <div key={card.id} className="flex flex-col flex-1">
                <div className="relative w-full h-[365px] rounded-[16px] overflow-hidden mb-6"><Image src={card.image.desktop.url} alt={card.image.desktop.alt} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" /></div>
                <div className="flex flex-col flex-1 bg-white border border-[#12121214] rounded-[16px] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.05)] p-8">
                  <div className="flex flex-col gap-1 mb-8">
                    <h3 className="text-[32px] font-bold text-[#121212] leading-[1.3] tracking-[-0.5px]">{card.title}</h3>
                    <p className="text-[18px] font-medium text-[#121212] leading-[1.5] tracking-[-0.16px]">{card.subtitle}</p>
                  </div>
                  <div className="flex flex-col gap-8 mb-8">
                    <div className="flex flex-col gap-3">
                      <p className="text-[22px] font-bold text-[#121212] leading-[1.3] tracking-[-0.5px]">Pros:</p>
                      <div className="flex flex-col gap-5">{card.pros.map((p) => (<div key={p} className="flex items-center gap-2"><ProIcon /><p className="text-[20px] font-medium text-[#121212] leading-[1.5] tracking-[-0.16px]">{p}</p></div>))}</div>
                    </div>
                    <div className="flex flex-col gap-3">
                      <p className="text-[22px] font-bold text-[#121212] leading-[1.3] tracking-[-0.5px]">Cons:</p>
                      <div className="flex flex-col gap-5">{card.cons.map((c) => (<div key={c} className="flex items-center gap-2"><ConIcon /><p className="text-[20px] font-medium text-[#121212] leading-[1.5] tracking-[-0.16px]">{c}</p></div>))}</div>
                    </div>
                  </div>
                  <div className="w-full h-[2px] bg-[#12121214] mb-8" />
                  <p className="text-[24px] font-bold text-[#121212]/50 leading-[1.4] tracking-[-0.25px]">{card.footer.muted}<span className="text-[#121212]">{card.footer.bold}</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FIXED: Thin Base Vs. Thick Base Comparison Table ── */}
      <section className="bg-white py-12 md:py-[120px] px-5 md:px-[160px]">
        <div className="max-w-[1440px] mx-auto flex flex-col items-center">
          <h2 className="text-[22px] md:text-[44px] font-extrabold text-[#121212] text-center leading-[1.2] tracking-[-0.5px] mb-6 md:mb-[44px]">
            Thin Base Vs. Thick Base
          </h2>

          <div className="w-full max-w-[992px] rounded-[12px] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.05)] overflow-hidden border border-[#E5E7EB]">

            {/* Header */}
            <div className="flex w-full bg-[#121212]">
              <div className="w-[30%] py-3 md:py-[44px] px-2 md:px-4 flex items-center justify-center border-r border-white/10">
                <span className="text-center text-[18px] font-bold leading-[140%] tracking-[-0.25px] text-white md:text-[28px] md:leading-[130%]">Feature</span>
              </div>
              <div className="flex-1 py-3 md:py-[22px] px-2 md:px-4 flex items-center justify-center border-r border-white/10">
                <span className="text-center text-[18px] font-bold leading-[140%] tracking-[-0.25px] text-white md:text-[28px] md:leading-[130%]">Thin Base +<br />Low Density</span>
              </div>
              <div className="flex-1 py-3 md:py-[22px] px-2 md:px-4 flex items-center justify-center">
                <span className="text-center text-[18px] font-bold leading-[140%] tracking-[-0.25px] text-white md:text-[28px] md:leading-[130%]">Thick Base +<br />High Density</span>
              </div>
            </div>

            {/* Rows */}
            {[
              { label: 'Hairline\nRealism', thinStars: 5, thickStars: 2, alt: true },
              { label: 'Comfort',           thinStars: 5, thickStars: 2, alt: false },
              { label: 'Overall\nLook',     thinStars: 5, thickStars: 3, alt: true },
              { label: 'System\nLife',      thinStars: 2, thickStars: 5, alt: false },
            ].map((row) => (
              <div key={row.label} className={`flex w-full border-b last:border-b-0 border-[#E5E7EB] ${row.alt ? '' : 'bg-[#121212]/[0.02]'}`}>
                {/* Feature */}
                <div className="w-[30%] py-4 md:py-[44px] px-2 md:px-4 flex items-center justify-center border-r border-[#E5E7EB]">
                  <span className="whitespace-pre-line text-center text-[16px] font-bold leading-[120%] tracking-[-0.25px] text-[#121212] md:text-[20px]">{row.label}</span>
                </div>
                {/* Thin stars */}
                <div className="flex-1 py-4 md:py-[20px] px-1 md:px-4 flex items-center justify-center gap-[2px] md:gap-1 flex-wrap border-r border-[#E5E7EB]">
                  {Array.from({ length: row.thinStars }).map((_, i) => (
                    <StarIcon key={i} />
                  ))}
                </div>
                {/* Thick stars */}
                <div className="flex-1 py-4 md:py-[20px] px-1 md:px-4 flex items-center justify-center gap-[2px] md:gap-1 flex-wrap">
                  {Array.from({ length: row.thickStars }).map((_, i) => (
                    <StarIcon key={i} />
                  ))}
                </div>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* Still Confused Between Bases Section */}
      <section className="bg-[#F5F6F7] py-12 md:py-[120px] px-5 md:px-[160px]">
        <div className="max-w-[1440px] mx-auto flex flex-col items-center">
          <h2 className="text-[22px] md:text-[44px] font-extrabold text-[#121212] text-center leading-[1.2] tracking-[-0.5px] mb-6 md:mb-[44px]">Still Confused Between Bases?</h2>
          <div className="flex flex-col lg:flex-row items-stretch gap-5 md:gap-8 w-full">
            {[
              { title: 'Option 1 (Thin Base + Low Density)', questions: ['Is appearance my top priority?','Do I want extreme comfort for daily wear?','Do I want the most invisible-looking hairline possible?','Am I okay changing the system every 3 to 4 months?','Do I want it to feel like nothing\'s there, even if someone touches my head?'], conclusion: 'If this sounds like you, then go for a thin base, low density.' },
              { title: 'Option 2 (Thick Base + High Density)', questions: ['Am I okay if it looks slightly heavier or fuller?','Do I prefer something that lasts 6 to 8 months?','Do I want a more economical option with fewer replacements?','Am I okay compromising a bit on comfort if it means I don\'t have to worry for months?','Do I want something that handles rougher use and travel?'], conclusion: 'If this sounds like you, then go for a thick base, high density.' },
            ].map((option) => (
              <div key={option.title} className="flex flex-col flex-1 bg-white border border-[#12121214] rounded-[12px] md:rounded-[16px] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.05)] overflow-hidden">
                <div className="h-[5px] w-full bg-[#1769FF]" />
                <div className="p-5 md:p-[32px]">
                  <h3 className="text-[18px] md:text-[26px] font-bold text-[#121212] leading-[1.4] tracking-[-0.16px] mb-5 md:mb-6">{option.title}</h3>
                  <div className="flex items-center gap-2 mb-3 md:mb-4"><span className="text-[20px]">💡</span><p className="text-[16px] md:text-[20px] font-semibold text-[#121212] leading-[1.3] tracking-[-0.1px]">Ask yourself:</p></div>
                  <ul className="flex flex-col gap-2.5 md:gap-3 pl-1 mb-6 md:mb-8">
                    {option.questions.map((q) => (
                      <li key={q} className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#555555] mt-[8px] flex-shrink-0" />
                        <p className="text-[14px] md:text-[18px] font-medium text-[#555555] leading-[1.6] tracking-[-0.16px]">{q}</p>
                      </li>
                    ))}
                  </ul>
                  <div className="w-full h-[1px] bg-[#12121214] mb-5 md:mb-8" />
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-[#1769FF] rounded-[4px] flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg width="12" height="9" viewBox="0 0 14 10" fill="none"><path d="M12.3333 1L5 8.33333L1.66667 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                    <p className="text-[15px] md:text-[20px] font-bold text-[#121212] leading-[1.4] tracking-[-0.25px]">{option.conclusion}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* World's Finest Thinnest Hair Systems */}
      <WorldsFinestHairSystems />

      {/* Fill This Form */}
      <ContactForm />

      <Ebook imageSrc="/assets/stick-on-ebook-cover.png" />

      <ThinBaseModal  isOpen={activeModal === 'thin'}  onClose={closeModal} />
      <ThickBaseModal isOpen={activeModal === 'thick'} onClose={closeModal} />
    </main>
  );
}

// ─── Shared helpers ───────────────────────────────────────────────────────────
const GearIcon = () => (
  <svg className="h-4 w-4 md:h-[18px] md:w-[18px]" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <g clipPath="url(#stick-on-lifespan-gear-clip)">
      <path fillRule="evenodd" clipRule="evenodd" d="M9.58469 0.335938C10.364 0.335938 11.0336 0.872546 11.1802 1.61466L11.2454 1.94466C11.5017 3.24177 12.8855 4.01637 14.1723 3.583L14.4998 3.4727C15.236 3.22476 16.0501 3.51864 16.4398 4.17299L17.0284 5.16135C17.4181 5.81572 17.2735 6.6462 16.6839 7.14035L16.4217 7.36011C15.3911 8.22385 15.3911 9.77305 16.4217 10.6368L16.6839 10.8565C17.2735 11.3507 17.4181 12.1812 17.0284 12.8355L16.4398 13.8239C16.0501 14.4783 15.236 14.7721 14.4997 14.5241L14.1724 14.4138C12.8855 13.9804 11.5017 14.755 11.2454 16.0522L11.1802 16.3822C11.0336 17.1243 10.364 17.6609 9.58469 17.6609H8.40749C7.62817 17.6609 6.95858 17.1243 6.81195 16.3823L6.74671 16.0521C6.49041 14.755 5.10656 13.9804 3.81976 14.4138L3.49244 14.5241C2.75621 14.7721 1.94208 14.4782 1.55238 13.8238L0.963819 12.8355C0.574133 12.1812 0.718678 11.3507 1.30826 10.8565L1.57051 10.6368C2.60102 9.77297 2.60102 8.22385 1.57051 7.36015L1.30826 7.14036C0.718678 6.6462 0.574134 5.81574 0.963819 5.16138L1.5524 4.17301C1.94209 3.51864 2.7562 3.22477 3.49241 3.47272L3.81983 3.58299C5.1066 4.01637 6.49041 3.24182 6.74671 1.94475L6.81194 1.6146C6.95858 0.872516 7.62809 0.335938 8.40749 0.335938H9.58469ZM8.99609 11.4735C10.363 11.4735 11.4711 10.3653 11.4711 8.99845C11.4711 7.6315 10.363 6.52344 8.99609 6.52344C7.62914 6.52344 6.52107 7.6315 6.52107 8.99845C6.52107 10.3653 7.62914 11.4735 8.99609 11.4735Z" fill="black" />
      <path fillRule="evenodd" clipRule="evenodd" d="M9.58469 0.335938C10.364 0.335938 11.0336 0.872546 11.1802 1.61466L11.2454 1.94466C11.5017 3.24177 12.8855 4.01637 14.1723 3.583L14.4998 3.4727C15.236 3.22476 16.0501 3.51864 16.4398 4.17299L17.0284 5.16135C17.4181 5.81572 17.2735 6.6462 16.6839 7.14035L16.4217 7.36011C15.3911 8.22385 15.3911 9.77305 16.4217 10.6368L16.6839 10.8565C17.2735 11.3507 17.4181 12.1812 17.0284 12.8355L16.4398 13.8239C16.0501 14.4783 15.236 14.7721 14.4997 14.5241L14.1724 14.4138C12.8855 13.9804 11.5017 14.755 11.2454 16.0522L11.1802 16.3822C11.0336 17.1243 10.364 17.6609 9.58469 17.6609H8.40749C7.62817 17.6609 6.95858 17.1243 6.81195 16.3823L6.74671 16.0521C6.49041 14.755 5.10656 13.9804 3.81976 14.4138L3.49244 14.5241C2.75621 14.7721 1.94208 14.4782 1.55238 13.8238L0.963819 12.8355C0.574133 12.1812 0.718678 11.3507 1.30826 10.8565L1.57051 10.6368C2.60102 9.77297 2.60102 8.22385 1.57051 7.36015L1.30826 7.14036C0.718678 6.6462 0.574134 5.81574 0.963819 5.16138L1.5524 4.17301C1.94209 3.51864 2.7562 3.22477 3.49241 3.47272L3.81983 3.58299C5.1066 4.01637 6.49041 3.24182 6.74671 1.94475L6.81194 1.6146C6.95858 0.872516 7.62809 0.335938 8.40749 0.335938H9.58469ZM8.99609 11.4735C10.363 11.4735 11.4711 10.3653 11.4711 8.99845C11.4711 7.6315 10.363 6.52344 8.99609 6.52344C7.62914 6.52344 6.52107 7.6315 6.52107 8.99845C6.52107 10.3653 7.62914 11.4735 8.99609 11.4735Z" fill="url(#stick-on-lifespan-gear-gradient)" />
    </g>
    <defs>
      <linearGradient id="stick-on-lifespan-gear-gradient" x1="1.6365" y1="-3.55323" x2="21.0836" y2="0.899084" gradientUnits="userSpaceOnUse">
        <stop stopColor="#4686FE" />
        <stop offset="1" stopColor="#1769FF" />
      </linearGradient>
      <clipPath id="stick-on-lifespan-gear-clip">
        <rect width="18" height="18" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const PlusCircleIcon = () => (
  <svg className="h-8 w-8 md:h-[44px] md:w-[44px]" viewBox="0 0 44 44" fill="none" aria-hidden="true">
    <path d="M22 0C27.8348 0 33.4305 2.31785 37.5564 6.44365C41.6822 10.5695 44 16.1652 44 22C44 27.8348 41.6822 33.4305 37.5564 37.5564C33.4305 41.6822 27.8348 44 22 44C16.1652 44 10.5695 41.6822 6.44365 37.5564C2.31785 33.4305 0 27.8348 0 22C0 16.1652 2.31785 10.5695 6.44365 6.44365C10.5695 2.31785 16.1652 0 22 0ZM24 11.858C24 11.1287 24.0157 11.2755 23.5 10.7598C22.9843 10.244 22.7293 10 22 10C21.2707 10 21.0157 10.244 20.5 10.7598C19.9843 11.2755 20 11.1287 20 11.858V20.5H15.929H12.858C12.1287 20.5 11.4292 20.5838 10.9135 21.0995C10.3977 21.6152 10 21.7707 10 22.5C10 23.2293 10.3977 23.5993 10.9135 24.115C11.4292 24.6308 12.1287 24.5 12.858 24.5H15.929H20V32.483C20 33.2123 19.9843 33.4843 20.5 34C21.0157 34.5157 21.2707 34.8511 22 34.8511C22.7293 34.8511 22.9843 34.5157 23.5 34C24.0157 33.4843 24 33.2123 24 32.483V24.5H31.483C32.2123 24.5 32.9118 24.6308 33.4275 24.115C33.9433 23.5993 34 23.2293 34 22.5C34 21.7707 33.5 21 33.5 21C32.9843 20.4843 32.2123 20.5 31.483 20.5H24V11.858Z" fill="#121212" />
  </svg>
);
const StarIcon = () => (
  <svg className="h-5 w-5 flex-shrink-0 md:h-[26.667px] md:w-[26.667px]" viewBox="0 0 27 27" fill="none" aria-hidden="true">
    <path d="M9.53765 4.544C11.227 1.51467 12.071 0 13.3336 0C14.5963 0 15.4403 1.51467 17.1296 4.544L17.567 5.328C18.047 6.18933 18.287 6.62 18.6603 6.904C19.0336 7.188 19.5003 7.29333 20.4336 7.504L21.2816 7.696C24.5616 8.43867 26.2003 8.80933 26.591 10.064C26.9803 11.3173 25.863 12.6253 23.627 15.24L23.0483 15.916C22.4136 16.6587 22.095 17.0307 21.9523 17.4893C21.8096 17.9493 21.8576 18.4453 21.9536 19.436L22.0416 20.3387C22.379 23.828 22.5483 25.572 21.527 26.3467C20.5056 27.1213 18.9696 26.4147 15.9003 25.0013L15.1043 24.636C14.2323 24.2333 13.7963 24.0333 13.3336 24.0333C12.871 24.0333 12.435 24.2333 11.563 24.636L10.7683 25.0013C7.69765 26.4147 6.16165 27.1213 5.14165 26.348C4.11898 25.572 4.28831 23.828 4.62565 20.3387L4.71365 19.4373C4.80965 18.4453 4.85765 17.9493 4.71365 17.4907C4.57231 17.0307 4.25365 16.6587 3.61898 15.9173L3.04031 15.24C0.804314 12.6267 -0.31302 11.3187 0.0763133 10.064C0.465647 8.80933 2.10698 8.43733 5.38698 7.696L6.23498 7.504C7.16698 7.29333 7.63231 7.188 8.00698 6.904C8.38165 6.62 8.62031 6.18933 9.10031 5.328L9.53765 4.544Z" fill="#FBBF24" />
  </svg>
);
const ProIcon = () => (<div className="w-5 h-5 bg-[#00C853] rounded-[4px] flex items-center justify-center flex-shrink-0"><svg width="12" height="9" viewBox="0 0 14 10" fill="none"><path d="M12.3333 1L5 8.33333L1.66667 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></div>);
const ConIcon = () => (<div className="w-5 h-5 bg-[#FF3B30] rounded-[4px] flex items-center justify-center flex-shrink-0"><svg width="9" height="9" viewBox="0 0 10 10" fill="none"><path d="M7.5 2.5L2.5 7.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M2.5 2.5L7.5 7.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></div>);

// Shared ArrowButton
function ArrowButton({ direction, onClick, disabled, size = 44 }: { direction: 'left'|'right'; onClick: ()=>void; disabled: boolean; size?: number }) {
  const gradientId = `stick-on-lifespan-arrow-${direction}-${disabled ? 'disabled' : 'active'}`;

  return (
    <button type="button" onClick={onClick} disabled={disabled} style={{ width: size, height: size, borderRadius: '50%', border: 'none', padding: 0, flexShrink: 0, cursor: disabled ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', transition: 'opacity 0.2s' }}>
      <svg width={size} height={size} viewBox="0 0 44 44" fill="none" aria-hidden="true">
        <circle cx="22" cy="22" r="22" fill="#E8EAED" opacity={disabled ? 0.7 : 1} />
        {!disabled && <circle cx="22" cy="22" r="22" fill={`url(#${gradientId})`} />}
        <path d="M18 13L27 22L18 31" stroke={disabled ? 'rgba(18,18,18,0.4)' : 'white'} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: direction === 'left' ? 'rotate(180deg)' : 'none', transformOrigin: '22px 22px' }} />
        <defs>
          <linearGradient id={gradientId} x1="2.37441" y1="-9.87725" x2="53.97" y2="2.52594" gradientUnits="userSpaceOnUse">
            <stop stopColor="#4686FE" />
            <stop offset="1" stopColor="#1769FF" />
          </linearGradient>
        </defs>
      </svg>
    </button>
  );
}

// Dots pill
function DotsPill({ total, active, onDotClick }: { total: number; active: number; onDotClick: (i: number) => void }) {
  return (
    <div className="flex items-center justify-center gap-[8px] flex-shrink-0" style={{ width: 152, height: 44, borderRadius: 24, background: 'rgba(232,234,237,0.72)', backdropFilter: 'blur(3.5px)', WebkitBackdropFilter: 'blur(3.5px)' }}>
      {Array.from({ length: total }).map((_, i) => (
        <button type="button" key={i} onClick={() => onDotClick(i)} style={{ width: i === active ? 32 : 8, height: 8, borderRadius: 999, background: i === active ? '#121212' : 'rgba(18,18,18,0.30)', transition: 'all 300ms ease', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0 }} />
      ))}
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const baseCards = [
  { id: 'thin' as const, label: '1st Option', title: 'Thin Base + Low Density', desc: 'This means the base is very thin, and the hair density is low.', ...STICK_ON_LIFESPAN_BASE_ASSETS.thin },
  { id: 'thick' as const, label: '2nd Option', title: 'Thick Base + High Density', desc: 'This means the base is thicker, and the hair density is high.', ...STICK_ON_LIFESPAN_BASE_ASSETS.thick },
];
const carCards = [
  { id: 'sports', image: STICK_ON_LIFESPAN_CAR_ASSETS.sport, title: 'Sports Car', subtitle: '(Thin Base + Low Density = Less Life)', pros: ['Looks stunning', 'Feels amazing'], cons: ['High maintenance', "Can't handle rough roads"], footer: { muted: 'Ideal for men who ', bold: 'are okay with changing it every 3–4 months.' } },
  { id: 'suv', image: STICK_ON_LIFESPAN_CAR_ASSETS.fortuner, title: 'Fortuner SUV', subtitle: '(Thick Base + High Density = More Life)', pros: ['Low maintenance', 'Strong, rugged, long-lasting'], cons: ['Heavier', "Doesn't look as sleek"], footer: { muted: 'Perfect for men who ', bold: 'are okay with compromising on realism.' } },
];
const R2_MEDIA = "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media";

const videoCards = [
  { id: 1, title: 'Styling Demo',     image: `${R2_MEDIA}/runtime-stick-on-guy.png` },
  { id: 2, title: 'Mannequin View 1', image: `${R2_MEDIA}/runtime-transplant-benefit-natural.png` },
  { id: 3, title: 'Mannequin View 2', image: `${R2_MEDIA}/runtime-transplant-benefit-real.png` },
  { id: 4, title: 'Hair Touching',    image: `${R2_MEDIA}/runtime-stick-on-guy.png` },
  { id: 5, title: 'Side View',        image: `${R2_MEDIA}/runtime-transplant-benefit-natural.png` },
];

// ─── Modals ───────────────────────────────────────────────────────────────────
interface BaseModalProps { isOpen: boolean; onClose: () => void; }

const ThinBaseModal = ({ isOpen, onClose }: BaseModalProps) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted || !isOpen) return null;
  const items = [{ title: 'Super natural hairline', desc: 'Seamlessly blends with your skin for a flawless look.' },{ title: 'Feels ultra-light and breathable', desc: 'So you can wear it all day without any discomfort.' },{ title: 'Stay Undetectable', desc: 'No one will notice, even if they touch your scalp.' }];
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full md:h-auto md:max-w-[1340px] md:mx-4 md:max-h-[90vh] md:rounded-[24px] bg-[#F5F6F7] overflow-hidden flex flex-col md:flex-row shadow-2xl" style={{ height: '100dvh' } as React.CSSProperties}>
        <button type="button" onClick={onClose} className="absolute top-4 right-4 md:top-6 md:right-6 z-30 w-[36px] h-[36px] md:w-[44px] md:h-[44px] bg-black text-white rounded-full flex items-center justify-center flex-shrink-0" aria-label="Close"><X className="w-4 h-4 md:w-5 md:h-5" /></button>
        <div className="flex flex-col w-full h-full overflow-y-auto md:hidden">
          <div className="flex flex-col gap-5 p-6 pt-14 pb-0">
            <div className="flex flex-col gap-2"><h2 className="text-[#121212] text-[20px] font-bold leading-[1.3]">Stick-On Hair System with <span className="text-[#1769FF]">Thin Base and Low Density</span></h2><p className="text-[#555555] text-[14px] leading-[1.6]">This means the base is very thin, and the hair density is low. Here's what it gives you:</p></div>
            <div className="flex flex-col gap-3">{items.map((item) => (<div key={item.title} className="bg-white p-4 rounded-[12px] border border-[#121212]/[0.08] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.04)] flex items-start gap-3"><div className="flex-shrink-0 w-5 h-5 bg-black rounded-[4px] flex items-center justify-center mt-0.5"><Check className="w-3 h-3 text-white" strokeWidth={3} /></div><div className="flex flex-col gap-0.5"><h4 className="text-[#121212] text-[15px] font-semibold leading-[1.3]">{item.title}</h4><p className="text-[#555555] text-[13px] leading-[1.5]">{item.desc}</p></div></div>))}</div>
            <p className="text-[#121212] text-[16px] font-bold leading-[1.5] pb-2"><span className="text-[#121212]/50">It's designed to provide </span>lasting results for 3–4 months.</p>
          </div>
          <div className="relative mx-auto mt-2 h-[320px] w-[320px] max-w-full"><Image src={STICK_ON_LIFESPAN_BASE_ASSETS.thin.modal.mobile.url} alt={STICK_ON_LIFESPAN_BASE_ASSETS.thin.modal.mobile.alt} fill className="object-contain object-bottom" sizes="320px" /></div>
        </div>
        <div className="hidden md:flex w-full h-[741px]">
          <div className="w-[60%] p-[64px] flex flex-col gap-8 overflow-y-auto">
            <div className="flex flex-col gap-3"><h2 className="text-[#121212] text-[32px] font-bold leading-[1.2] tracking-[-0.1px]">Stick-On Hair System with <span className="text-[#1769FF]">Thin Base and Low Density</span></h2><p className="text-[#555555] text-[20px] leading-[1.5] tracking-[-0.16px]">This means the base is very thin, and the hair density is low. Here's what it gives you:</p></div>
            <div className="flex flex-col gap-4">{items.map((item) => (<div key={item.title} className="bg-white p-5 rounded-[12px] border border-[#121212]/[0.08] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.05)] flex items-start gap-4"><div className="flex-shrink-0 w-6 h-6 bg-black rounded-[4px] flex items-center justify-center mt-0.5"><Check className="w-4 h-4 text-white" strokeWidth={3} /></div><div className="flex flex-col gap-1"><h4 className="text-[#121212] text-[20px] font-semibold leading-[1.3]">{item.title}</h4><p className="text-[#555555] text-[18px] leading-[1.5]">{item.desc}</p></div></div>))}</div>
            <p className="text-[#121212] text-[24px] font-bold leading-[1.4]"><span className="text-[#121212]/50">It's designed to provide </span>lasting results for 3–4 months.</p>
          </div>
          <div className="relative flex flex-1 items-center justify-center p-8"><div className="relative h-[645px] w-[645px] max-w-full"><Image src={STICK_ON_LIFESPAN_BASE_ASSETS.thin.modal.desktop.url} alt={STICK_ON_LIFESPAN_BASE_ASSETS.thin.modal.desktop.alt} fill className="object-contain object-center" sizes="645px" /></div></div>
        </div>
      </div>
    </div>, document.body
  );
};

const ThickBaseModal = ({ isOpen, onClose }: BaseModalProps) => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted || !isOpen) return null;
  const items = [{ title: 'Durable & long-lasting', desc: 'It remains durable and intact for a period of 6 to 8 months.' },{ title: 'Ideal for low maintenance', desc: 'Perfect for those who prefer fewer system changes.' }];
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full md:h-auto md:max-w-[1340px] md:mx-4 md:max-h-[90vh] md:rounded-[24px] bg-[#F5F6F7] overflow-hidden flex flex-col md:flex-row shadow-2xl" style={{ height: '100dvh' } as React.CSSProperties}>
        <button type="button" onClick={onClose} className="absolute top-4 right-4 md:top-6 md:right-6 z-30 w-[36px] h-[36px] md:w-[44px] md:h-[44px] bg-black text-white rounded-full flex items-center justify-center flex-shrink-0" aria-label="Close"><X className="w-4 h-4 md:w-5 md:h-5" /></button>
        <div className="flex flex-col w-full h-full overflow-y-auto md:hidden">
          <div className="flex flex-col gap-5 p-6 pt-14 pb-0">
            <div className="flex flex-col gap-2"><h2 className="text-[#121212] text-[20px] font-bold leading-[1.3]">Stick-On Hair System with <span className="text-[#1769FF]">Thick Base and High Density</span></h2><p className="text-[#555555] text-[14px] leading-[1.6]">This means the base is thicker, and the hair density is high. Here's what it gives you:</p></div>
            <div className="flex flex-col gap-3">{items.map((item) => (<div key={item.title} className="bg-white p-4 rounded-[12px] border border-[#121212]/[0.08] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.04)] flex items-start gap-3"><div className="flex-shrink-0 w-5 h-5 bg-black rounded-[4px] flex items-center justify-center mt-0.5"><Check className="w-3 h-3 text-white" strokeWidth={3} /></div><div className="flex flex-col gap-0.5"><h4 className="text-[#121212] text-[15px] font-semibold leading-[1.3]">{item.title}</h4><p className="text-[#555555] text-[13px] leading-[1.5]">{item.desc}</p></div></div>))}</div>
            <p className="text-[#121212] text-[16px] font-bold leading-[1.5] pb-2"><span className="text-[#121212]/50">It's slightly heavier and more </span>noticeable when touched.</p>
          </div>
          <div className="relative mx-auto mt-2 h-[320px] w-[320px] max-w-full"><Image src={STICK_ON_LIFESPAN_BASE_ASSETS.thick.modal.mobile.url} alt={STICK_ON_LIFESPAN_BASE_ASSETS.thick.modal.mobile.alt} fill className="object-contain object-bottom" sizes="320px" /></div>
        </div>
        <div className="hidden md:flex w-full h-[741px]">
          <div className="w-auto flex-shrink-0 flex flex-col gap-[36px] ml-[160px] mt-[72px] overflow-y-auto pb-8">
            <div className="flex flex-col gap-4 w-[494px]"><h2 className="text-[#121212] text-[26px] font-bold leading-[1.2] tracking-[-0.1px]">Stick-On Hair System with <span className="text-[#1769FF]">Thick Base and High Density</span></h2><p className="text-[#555555] text-[20px] leading-[1.5] tracking-[-0.16px]">This means the base is thicker, and the hair density is high. Here's what it gives you:</p></div>
            <div className="flex flex-col gap-4 w-[494px]">{items.map((item) => (<div key={item.title} className="bg-white p-5 rounded-[12px] border border-[#121212]/[0.08] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.05)] flex items-start gap-3"><div className="flex-shrink-0 w-6 h-6 bg-black rounded-[4px] flex items-center justify-center mt-0.5"><Check className="w-4 h-4 text-white" strokeWidth={3} /></div><div className="flex flex-col gap-1"><h4 className="text-[#121212] text-[20px] font-semibold leading-[1.3]">{item.title}</h4><p className="text-[#555555] text-[18px] leading-[1.5]">{item.desc}</p></div></div>))}</div>
            <p className="text-[#121212] text-[24px] font-bold leading-[1.4] w-[494px]"><span className="text-[#121212]/50">It's slightly heavier and more </span>noticeable when touched.</p>
          </div>
          <div className="relative mt-[48px] flex flex-1 items-center justify-center p-8"><div className="relative h-[645px] w-[645px] max-w-full"><Image src={STICK_ON_LIFESPAN_BASE_ASSETS.thick.modal.desktop.url} alt={STICK_ON_LIFESPAN_BASE_ASSETS.thick.modal.desktop.alt} fill className="object-contain object-center" sizes="645px" /></div></div>
        </div>
      </div>
    </div>, document.body
  );
};

// ─── Carousels ────────────────────────────────────────────────────────────────
const CARD_W = 260, CARD_GAP = 16;

interface BaseOptionsCarouselProps { onOpenModal: (type: 'thin' | 'thick') => void; }

const BaseOptionsCarousel = ({ onOpenModal }: BaseOptionsCarouselProps) => {
  const total = baseCards.length;
  const { scrollRef, activeIndex, canPrev, canNext, scrollPrev, scrollNext, scrollToIndex: scrollTo } = useSnapCarousel({
    itemSelector: '[data-stick-lifespan-base-card]',
    itemCount: total,
  });

  return (
    <div className="flex flex-col gap-5">
      <div ref={scrollRef} className="flex gap-4 overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', scrollSnapType: 'x mandatory' }}>
        {baseCards.map((card) => (
          <div key={card.id} data-stick-lifespan-base-card="" style={{ width: CARD_W, minWidth: CARD_W, height: 480, scrollSnapAlign: 'start' }} className="relative flex flex-shrink-0 flex-col overflow-hidden rounded-[16px] border border-[#12121214] bg-white shadow-[0px_8px_24px_0px_rgba(0,0,0,0.05)]">
            <div className="flex flex-col p-5 pb-4">
              <div className="mb-3 inline-flex items-center justify-center gap-[6px] self-start rounded-[6px] bg-[#12121212] px-3 py-[5px]"><GearIcon /><span className="text-[12px] font-semibold leading-[16px] tracking-[-0.12px] text-[#555555]">{card.label}</span></div>
              <div className="flex flex-col gap-1.5"><h3 className="text-[20px] font-bold leading-[1.2] tracking-[-0.4px] text-[#121212]">{card.title}</h3><p className="text-[14px] font-medium leading-[1.5] text-[#555555]">{card.desc}</p></div>
            </div>
            <div className="relative mx-auto mt-auto h-[258px] w-[258px]">
              <Image src={card.card.mobile.url} alt={card.card.mobile.alt} fill className="object-contain object-bottom" sizes="258px" />
              <button type="button" onClick={() => onOpenModal(card.id)} className="absolute bottom-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full active:scale-95" aria-label={`Read more about ${card.title}`}>
                <PlusCircleIcon />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-3">
        <ArrowButton direction="left"  onClick={scrollPrev} disabled={!canPrev} size={44} />
        <DotsPill total={total} active={activeIndex} onDotClick={scrollTo} />
        <ArrowButton direction="right" onClick={scrollNext} disabled={!canNext} size={44} />
      </div>
    </div>
  );
};

const CAR_CARD_W = 260, CAR_CARD_GAP = 16;

const CarExampleCarousel = () => {
  const total = carCards.length;
  const { scrollRef, activeIndex, canPrev, canNext, scrollPrev, scrollNext, scrollToIndex: scrollTo } = useSnapCarousel({
    itemSelector: '[data-stick-lifespan-car-card]',
    itemCount: total,
  });

  return (
    <div className="flex flex-col gap-5 w-full">
      <div ref={scrollRef} className="flex gap-4 overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', scrollSnapType: 'x mandatory' }}>
        {carCards.map((card) => (
          <div key={card.id} data-stick-lifespan-car-card="" style={{ width: CAR_CARD_W, minWidth: CAR_CARD_W, height: 480, scrollSnapAlign: 'start' }} className="flex-shrink-0 flex flex-col bg-white border border-[#12121214] rounded-[16px] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.05)] overflow-hidden">
            <div className="relative w-full h-[140px] flex-shrink-0"><Image src={card.image.mobile.url} alt={card.image.mobile.alt} fill className="object-cover" sizes="260px" /></div>
            <div className="flex flex-col flex-1 p-4 overflow-hidden">
              <div className="mb-3"><h3 className="text-[17px] font-bold text-[#121212] leading-[1.2] tracking-[-0.4px]">{card.title}</h3><p className="text-[12px] font-medium text-[#121212] leading-[1.5] mt-0.5">{card.subtitle}</p></div>
              <div className="mb-3"><p className="text-[13px] font-bold text-[#121212] mb-2">Pros:</p><div className="flex flex-col gap-2">{card.pros.map((p) => (<div key={p} className="flex items-center gap-2"><ProIcon /><p className="text-[13px] font-medium text-[#121212] leading-[1.4]">{p}</p></div>))}</div></div>
              <div className="mb-4"><p className="text-[13px] font-bold text-[#121212] mb-2">Cons:</p><div className="flex flex-col gap-2">{card.cons.map((c) => (<div key={c} className="flex items-center gap-2"><ConIcon /><p className="text-[13px] font-medium text-[#121212] leading-[1.4]">{c}</p></div>))}</div></div>
              <div className="mt-auto"><div className="w-full h-[1px] bg-[#12121214] mb-3" /><p className="text-[12px] font-bold text-[#121212]/50 leading-[1.5]">{card.footer.muted}<span className="text-[#121212]">{card.footer.bold}</span></p></div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-3">
        <ArrowButton direction="left"  onClick={scrollPrev} disabled={!canPrev} size={44} />
        <DotsPill total={total} active={activeIndex} onDotClick={scrollTo} />
        <ArrowButton direction="right" onClick={scrollNext} disabled={!canNext} size={44} />
      </div>
    </div>
  );
};

const VIDEO_CARD_W = 260, VIDEO_CARD_GAP = 16;

const CarouselSection = () => {
  const total = videoCards.length;
  const { scrollRef, activeIndex, canPrev, canNext, scrollPrev, scrollNext, scrollToIndex: scrollTo } = useSnapCarousel({
    itemSelector: '[data-stick-lifespan-video-card]',
    itemCount: total,
  });

  return (
    <div className="w-full flex flex-col gap-5">
      <div ref={scrollRef} className="w-full overflow-x-auto flex gap-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', scrollSnapType: 'x mandatory' }}>
        {videoCards.map((card) => (
          <div key={card.id} data-stick-lifespan-video-card="" style={{ width: VIDEO_CARD_W, minWidth: VIDEO_CARD_W, height: 480, scrollSnapAlign: 'start' }} className="flex-shrink-0 relative rounded-[16px] overflow-hidden group cursor-pointer shadow-[0px_4px_12px_0px_rgba(0,0,0,0.15)]">
            <Image src={card.image} alt={card.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="260px" />
            <div className="absolute inset-0 bg-black/15 group-hover:bg-black/25 transition-colors flex items-center justify-center">
              <div className="w-[60px] h-[60px] rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                <div className="w-[48px] h-[48px] rounded-full bg-white flex items-center justify-center pl-1 shadow-lg">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-[#121212]"><path d="M8 5v14l11-7z" /></svg>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-3">
        <ArrowButton direction="left"  onClick={scrollPrev} disabled={!canPrev} size={44} />
        <DotsPill total={total} active={activeIndex} onDotClick={scrollTo} />
        <ArrowButton direction="right" onClick={scrollNext} disabled={!canNext} size={44} />
      </div>
    </div>
  );
};

const DesktopVideoCarousel = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(true);
  const DESKTOP_CARD_W = 360, DESKTOP_GAP = 24;

  const handleScroll = useCallback(() => {
    const el = scrollRef.current; if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanLeft(el.scrollLeft > 1);
    setCanRight(el.scrollLeft < max - 1);
  }, []);

  useEffect(() => {
    const el = scrollRef.current; if (!el) return;
    updateDesktop(); el.addEventListener('scroll', handleScroll, { passive: true }); window.addEventListener('resize', updateDesktop);
    return () => { el.removeEventListener('scroll', handleScroll); window.removeEventListener('resize', updateDesktop); };
  }, [handleScroll]);

  const updateDesktop = () => {
    const el = scrollRef.current; if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanLeft(el.scrollLeft > 1); setCanRight(el.scrollLeft < max - 1);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div ref={scrollRef} className="flex gap-6 overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', scrollSnapType: 'x mandatory' }}>
        {videoCards.map((card) => (
          <div key={card.id} style={{ width: DESKTOP_CARD_W, minWidth: DESKTOP_CARD_W, height: 240, scrollSnapAlign: 'start' }} className="flex-shrink-0 relative rounded-[12px] overflow-hidden group cursor-pointer shadow-[0px_4px_12px_0px_rgba(0,0,0,0.15)]">
            <Image src={card.image} alt={card.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="360px" />
            <div className="absolute inset-0 bg-black/15 group-hover:bg-black/25 transition-colors flex items-center justify-center">
              <div className="w-[56px] h-[56px] rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                <div className="w-[44px] h-[44px] rounded-full bg-white flex items-center justify-center pl-1 shadow-lg">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-[#121212]"><path d="M8 5v14l11-7z" /></svg>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-end gap-3">
        <ArrowButton direction="left"  onClick={() => scrollRef.current?.scrollBy({ left: -(DESKTOP_CARD_W + DESKTOP_GAP), behavior: 'smooth' })} disabled={!canLeft}  size={44} />
        <ArrowButton direction="right" onClick={() => scrollRef.current?.scrollBy({ left:  (DESKTOP_CARD_W + DESKTOP_GAP), behavior: 'smooth' })} disabled={!canRight} size={44} />
      </div>
    </div>
  );
};
