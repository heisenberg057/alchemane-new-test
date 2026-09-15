'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { Calendar, Lightbulb } from 'lucide-react';
import { CLIP_ON_LIFESPAN_BASE_ASSETS } from './clipOnLifespanBaseOptionsAssets';

import { Ebook } from '@/components/homepage/Ebook';
import { WorldsFinestHairSystems } from '@/components/homepage/WorldsFinestHairSystems';
import { ContactForm } from '@/components/homepage/ContactForm';
import { useSnapCarousel } from '@/components/carousel/useSnapCarousel';
import { LazyGumletEmbed } from '@/components/video/LazyGumletEmbed';
import { ClipOnDetailsModal } from '@/components/clip-on-system-lifespan/ClipOnDetailsModal';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import { clipOnSystemLifespanSchema } from '@/config/page-schemas';

export default function ClipOnSystemLifespanPage() {
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
    <main className="bg-white min-h-screen">
      <SchemaMarkup schema={clipOnSystemLifespanSchema as any} />
      <section className="flex flex-col items-center py-[40px] md:py-[120px] px-4 md:px-[160px] max-w-[1440px] mx-auto">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-[11px] py-[5px] bg-[#F3F6FF] border border-[#1212120D] rounded-[6px] mb-3">
          <Calendar className="w-[18px] h-[18px] text-[#1769FF]" strokeWidth={2} />
          <span className="text-[#1769FF] text-[14px] font-medium leading-[20px] tracking-[0.06px]">
            Clip-On System Lifespan
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-[#121212] text-center text-[32px] md:text-[64px] font-extrabold leading-[1.2] tracking-[-0.5px] max-w-[900px] mb-4">
          How Long Does a<br />
          Clip-On Hair System Last?
        </h1>

        {/* Description */}
        <p className="text-[#121212] text-center text-[16px] md:text-[20px] leading-[25px] md:leading-[31px] tracking-[-0.1px] max-w-[780px] mb-[32px] md:mb-[44px]">
          It depends on the density you choose. Since <span className="font-bold">clip-ons are not glued</span> or taped to your scalp daily, they face <span className="font-bold">less wear</span> and tear, which means a <span className="font-bold">longer lifespan</span> compared to stick-ons.
        </p>

        {/* Hero Video Container */}
        <div className="relative w-full max-w-[1120px] rounded-[12px] md:rounded-[16px] overflow-hidden shadow-[0px_8px_24px_0px_rgba(0,0,0,0.05)]">
          {/* Mobile Video (4:5) */}
          <div className="block md:hidden" style={{ position: 'relative', aspectRatio: '4/5' }}>
            <LazyGumletEmbed
              title="Clip-On System Lifespan mobile"
              embedSrc="https://play.gumlet.io/embed/69de0199416cc16cb4c10ae6?background=false&autoplay=false&loop=false&disable_player_controls=false"
              rootMargin="160px 0px"
              placeholderLabel="Video loads when in view"
            />
          </div>
          {/* Desktop Video (16:9) */}
          <div className="hidden md:block" style={{ position: 'relative', aspectRatio: '16/9' }}>
            <LazyGumletEmbed
              title="Clip-On System Lifespan desktop"
              embedSrc="https://play.gumlet.io/embed/69de0199416cc16cb4c10ae1?background=false&autoplay=false&loop=false&disable_player_controls=false"
              rootMargin="160px 0px"
              placeholderLabel="Video loads when in view"
            />
          </div>
          {/* Gradient overlay */}
          <div className="absolute bottom-0 left-0 w-full h-[35%] bg-gradient-to-t from-[#181E25] to-transparent pointer-events-none z-10" />
          {/* Text overlay */}
          <div className="absolute bottom-0 left-0 w-full p-6 md:p-[50px] flex flex-col items-center justify-end text-center pointer-events-none z-10">
            <h2 className="uppercase italic font-black text-[22px] md:text-[44px] leading-[28px] md:leading-[53px] tracking-[1px]">
              <span className="text-white block">Clip-On</span>
              <span className="text-white/50 block">System Lifespan</span>
            </h2>
          </div>
        </div>

      </section>

      {/* Thin Base Vs. Thick Base Comparison Table */}
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

      {/* Two Base Options Section */}
      <section id="base-options" className="bg-white py-12 md:py-[120px] px-5 md:px-[160px]">
        <div className="max-w-[1120px] mx-auto flex flex-col gap-6 md:gap-[44px]">
          <h2 className="text-[22px] md:text-[44px] font-extrabold text-[#121212] leading-[1.2] tracking-[-0.5px] capitalize">
            Two Base Options for Your Clip-On Hair System
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

      {/* Still Confused Between Bases? Section */}
      <section className="bg-[#F5F6F7] py-[60px] md:py-[120px] px-4 md:px-[160px]">
        <div className="max-w-[1120px] mx-auto flex flex-col gap-6 md:gap-[44px]">

          <h2 className="text-[22px] md:text-[44px] font-extrabold text-[#121212] leading-[1.2] tracking-[-0.5px]">
            Still Confused Between Bases?
          </h2>

          <div className="flex flex-col lg:flex-row items-stretch gap-5 md:gap-8 w-full">
            {[
              {
                title: 'Option 1 (Thin Base + Low Density)',
                questions: [
                  "Is appearance my top priority?",
                  "Do I want extreme comfort for daily wear?",
                  "Do I want the most invisible-looking hairline possible?",
                  "Am I okay changing the system every 3 to 4 months?",
                  "Do I want it to feel like nothing's there, even if someone touches my head?",
                ],
                conclusion: 'If this sounds like you, then go for a thin base, low density.',
              },
              {
                title: 'Option 2 (Thick Base + High Density)',
                questions: [
                  "Am I okay if it looks slightly heavier or fuller?",
                  "Do I prefer something that lasts 6 to 8 months?",
                  "Do I want a more economical option with fewer replacements?",
                  "Am I okay compromising a bit on comfort if it means I don't have to worry for months?",
                  "Do I want something that handles rougher use and travel?",
                ],
                conclusion: 'If this sounds like you, then go for a thick base, high density.',
              },
            ].map((option) => (
              <div key={option.title} className="flex flex-col flex-1 bg-white rounded-[16px] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.05)] overflow-hidden" style={{ borderTop: '4px solid #4686FE' }}>
                <div className="p-5 md:p-[32px] flex flex-col flex-1">
                  <h3 className="text-[18px] md:text-[26px] font-bold text-[#121212] leading-[1.4] tracking-[-0.16px] mb-5 md:mb-6">{option.title}</h3>
                  <div className="flex items-center gap-2 mb-3 md:mb-4">
                    <Lightbulb className="w-[18px] h-[18px] md:w-[22px] md:h-[22px] text-[#FFC107] fill-[#FFC107] flex-shrink-0" />
                    <p className="text-[16px] md:text-[20px] font-semibold text-[#121212] leading-[1.3] tracking-[-0.1px]">Ask yourself:</p>
                  </div>
                  <ul className="flex flex-col gap-2.5 md:gap-3 pl-1 mb-6 md:mb-8 flex-1">
                    {option.questions.map((q) => (
                      <li key={q} className="flex items-start gap-2">
                        <div className="w-2 h-2 rounded-full bg-[#555555] mt-[8px] flex-shrink-0" />
                        <p className="text-[14px] md:text-[18px] font-medium text-[#555555] leading-[1.6] tracking-[-0.16px]">{q}</p>
                      </li>
                    ))}
                  </ul>
                  <div className="w-full h-[1px] bg-[#12121214] mb-5 md:mb-8" />
                  <div className="flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mt-0.5 w-[18px] h-[18px] md:w-[20px] md:h-[20px]" viewBox="0 0 18 18" fill="none">
                      <path d="M3.9192 0H14.0808C14.6148 0 15.06 1.13994e-07 15.4248 0.0300001C15.804 0.0600001 16.1616 0.1272 16.4988 0.3C17.016 0.564 17.436 0.984 17.7 1.5012C17.8728 1.8396 17.94 2.196 17.97 2.5752C18 2.94 18 3.3852 18 3.9192V14.0808C18 14.6148 18 15.06 17.97 15.4248C17.94 15.804 17.8728 16.1616 17.7 16.4988C17.4372 17.016 17.0172 17.436 16.5 17.7C16.1628 17.8728 15.8052 17.94 15.426 17.97C15.0612 18 14.616 18 14.082 18H3.9192C3.3852 18 2.94 18 2.5752 17.97C2.2032 17.952 1.8372 17.8608 1.5 17.7C0.984 17.436 0.564 17.016 0.3 16.5C0.1392 16.164 0.0480001 15.798 0.0300001 15.426C1.13994e-07 15.06 0 14.6148 0 14.0808V3.9192C0 3.3852 1.13994e-07 2.94 0.0300001 2.5752C0.0600001 2.196 0.1272 1.8396 0.3 1.5012C0.564 0.984 0.984 0.564 1.5012 0.3C1.8396 0.1272 2.196 0.0600001 2.5752 0.0300001C2.94 1.13994e-07 3.3852 0 3.9192 0ZM13.0272 7.4448C13.2228 7.2564 13.3008 6.9768 13.2324 6.7152C13.1628 6.4524 12.9588 6.2484 12.696 6.18C12.4344 6.1104 12.1548 6.1896 11.9676 6.384L7.9956 10.3536L6.5256 8.8836C6.2316 8.5896 5.7564 8.5908 5.4636 8.8836C5.1708 9.1776 5.1708 9.6516 5.4648 9.9456L7.4652 11.9448C7.758 12.2376 8.2332 12.2376 8.526 11.9448L13.026 7.4448H13.0272Z" fill="#1769FF"/>
                    </svg>
                    <p className="text-[15px] md:text-[20px] font-bold text-[#121212] leading-[1.4] tracking-[-0.25px]">{option.conclusion}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* World's Finest Thinnest Hair Systems Section */}
      <WorldsFinestHairSystems />

      <ContactForm />

      {/* Free E-Book Section */}
      <Ebook
        imageSrc="/assets/clip-on-ebook-cover.png"
        mobileImageSrc="/assets/clip-on-ebook-cover.png"
      />

      <ClipOnDetailsModal isOpen={activeModal === 'thin'} onClose={closeModal} type="thin" />
      <ClipOnDetailsModal isOpen={activeModal === 'thick'} onClose={closeModal} type="thick" />
    </main>
  );
}

// ─── Shared helpers ───────────────────────────────────────────────────────────
const StarIcon = () => (
  <svg className="h-5 w-5 flex-shrink-0 md:h-[26.667px] md:w-[26.667px]" viewBox="0 0 27 27" fill="none" aria-hidden="true">
    <path d="M9.53765 4.544C11.227 1.51467 12.071 0 13.3336 0C14.5963 0 15.4403 1.51467 17.1296 4.544L17.567 5.328C18.047 6.18933 18.287 6.62 18.6603 6.904C19.0336 7.188 19.5003 7.29333 20.4336 7.504L21.2816 7.696C24.5616 8.43867 26.2003 8.80933 26.591 10.064C26.9803 11.3173 25.863 12.6253 23.627 15.24L23.0483 15.916C22.4136 16.6587 22.095 17.0307 21.9523 17.4893C21.8096 17.9493 21.8576 18.4453 21.9536 19.436L22.0416 20.3387C22.379 23.828 22.5483 25.572 21.527 26.3467C20.5056 27.1213 18.9696 26.4147 15.9003 25.0013L15.1043 24.636C14.2323 24.2333 13.7963 24.0333 13.3336 24.0333C12.871 24.0333 12.435 24.2333 11.563 24.636L10.7683 25.0013C7.69765 26.4147 6.16165 27.1213 5.14165 26.348C4.11898 25.572 4.28831 23.828 4.62565 20.3387L4.71365 19.4373C4.80965 18.4453 4.85765 17.9493 4.71365 17.4907C4.57231 17.0307 4.25365 16.6587 3.61898 15.9173L3.04031 15.24C0.804314 12.6267 -0.31302 11.3187 0.0763133 10.064C0.465647 8.80933 2.10698 8.43733 5.38698 7.696L6.23498 7.504C7.16698 7.29333 7.63231 7.188 8.00698 6.904C8.38165 6.62 8.62031 6.18933 9.10031 5.328L9.53765 4.544Z" fill="#FBBF24" />
  </svg>
);

const GearIcon = () => (
  <svg className="h-4 w-4 md:h-[18px] md:w-[18px]" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <g clipPath="url(#clip-on-lifespan-gear-clip)">
      <path fillRule="evenodd" clipRule="evenodd" d="M9.58469 0.335938C10.364 0.335938 11.0336 0.872546 11.1802 1.61466L11.2454 1.94466C11.5017 3.24177 12.8855 4.01637 14.1723 3.583L14.4998 3.4727C15.236 3.22476 16.0501 3.51864 16.4398 4.17299L17.0284 5.16135C17.4181 5.81572 17.2735 6.6462 16.6839 7.14035L16.4217 7.36011C15.3911 8.22385 15.3911 9.77305 16.4217 10.6368L16.6839 10.8565C17.2735 11.3507 17.4181 12.1812 17.0284 12.8355L16.4398 13.8239C16.0501 14.4783 15.236 14.7721 14.4997 14.5241L14.1724 14.4138C12.8855 13.9804 11.5017 14.755 11.2454 16.0522L11.1802 16.3822C11.0336 17.1243 10.364 17.6609 9.58469 17.6609H8.40749C7.62817 17.6609 6.95858 17.1243 6.81195 16.3823L6.74671 16.0521C6.49041 14.755 5.10656 13.9804 3.81976 14.4138L3.49244 14.5241C2.75621 14.7721 1.94208 14.4782 1.55238 13.8238L0.963819 12.8355C0.574133 12.1812 0.718678 11.3507 1.30826 10.8565L1.57051 10.6368C2.60102 9.77297 2.60102 8.22385 1.57051 7.36015L1.30826 7.14036C0.718678 6.6462 0.574134 5.81574 0.963819 5.16138L1.5524 4.17301C1.94209 3.51864 2.7562 3.22477 3.49241 3.47272L3.81983 3.58299C5.1066 4.01637 6.49041 3.24182 6.74671 1.94475L6.81194 1.6146C6.95858 0.872516 7.62809 0.335938 8.40749 0.335938H9.58469ZM8.99609 11.4735C10.363 11.4735 11.4711 10.3653 11.4711 8.99845C11.4711 7.6315 10.363 6.52344 8.99609 6.52344C7.62914 6.52344 6.52107 7.6315 6.52107 8.99845C6.52107 10.3653 7.62914 11.4735 8.99609 11.4735Z" fill="black" />
      <path fillRule="evenodd" clipRule="evenodd" d="M9.58469 0.335938C10.364 0.335938 11.0336 0.872546 11.1802 1.61466L11.2454 1.94466C11.5017 3.24177 12.8855 4.01637 14.1723 3.583L14.4998 3.4727C15.236 3.22476 16.0501 3.51864 16.4398 4.17299L17.0284 5.16135C17.4181 5.81572 17.2735 6.6462 16.6839 7.14035L16.4217 7.36011C15.3911 8.22385 15.3911 9.77305 16.4217 10.6368L16.6839 10.8565C17.2735 11.3507 17.4181 12.1812 17.0284 12.8355L16.4398 13.8239C16.0501 14.4783 15.236 14.7721 14.4997 14.5241L14.1724 14.4138C12.8855 13.9804 11.5017 14.755 11.2454 16.0522L11.1802 16.3822C11.0336 17.1243 10.364 17.6609 9.58469 17.6609H8.40749C7.62817 17.6609 6.95858 17.1243 6.81195 16.3823L6.74671 16.0521C6.49041 14.755 5.10656 13.9804 3.81976 14.4138L3.49244 14.5241C2.75621 14.7721 1.94208 14.4782 1.55238 13.8238L0.963819 12.8355C0.574133 12.1812 0.718678 11.3507 1.30826 10.8565L1.57051 10.6368C2.60102 9.77297 2.60102 8.22385 1.57051 7.36015L1.30826 7.14036C0.718678 6.6462 0.574134 5.81574 0.963819 5.16138L1.5524 4.17301C1.94209 3.51864 2.7562 3.22477 3.49241 3.47272L3.81983 3.58299C5.1066 4.01637 6.49041 3.24182 6.74671 1.94475L6.81194 1.6146C6.95858 0.872516 7.62809 0.335938 8.40749 0.335938H9.58469ZM8.99609 11.4735C10.363 11.4735 11.4711 10.3653 11.4711 8.99845C11.4711 7.6315 10.363 6.52344 8.99609 6.52344C7.62914 6.52344 6.52107 7.6315 6.52107 8.99845C6.52107 10.3653 7.62914 11.4735 8.99609 11.4735Z" fill="url(#clip-on-lifespan-gear-gradient)" />
    </g>
    <defs>
      <linearGradient id="clip-on-lifespan-gear-gradient" x1="1.6365" y1="-3.55323" x2="21.0836" y2="0.899084" gradientUnits="userSpaceOnUse">
        <stop stopColor="#4686FE" />
        <stop offset="1" stopColor="#1769FF" />
      </linearGradient>
      <clipPath id="clip-on-lifespan-gear-clip">
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

// Shared ArrowButton
function ArrowButton({ direction, onClick, disabled, size = 44 }: { direction: 'left'|'right'; onClick: ()=>void; disabled: boolean; size?: number }) {
  const gradientId = `clip-on-lifespan-arrow-${direction}-${disabled ? 'disabled' : 'active'}`;
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
  { id: 'thin' as const, label: '1st Option', title: 'Thin Base + Low Density', desc: 'This means the base is very thin, and the hair density is low.', ...CLIP_ON_LIFESPAN_BASE_ASSETS.thin },
  { id: 'thick' as const, label: '2nd Option', title: 'Thick Base + High Density', desc: 'This means the base is thicker, and the hair density is high.', ...CLIP_ON_LIFESPAN_BASE_ASSETS.thick },
];

// ─── Carousels ────────────────────────────────────────────────────────────────
const CARD_W = 260, CARD_GAP = 16;

interface BaseOptionsCarouselProps { onOpenModal: (type: 'thin' | 'thick') => void; }

const BaseOptionsCarousel = ({ onOpenModal }: BaseOptionsCarouselProps) => {
  const total = baseCards.length;
  const { scrollRef, activeIndex, canPrev, canNext, scrollPrev, scrollNext, scrollToIndex: scrollTo } = useSnapCarousel({
    itemSelector: '[data-clip-lifespan-base-card]',
    itemCount: total,
  });

  return (
    <div className="flex flex-col gap-5">
      <div ref={scrollRef} className="flex gap-4 overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', scrollSnapType: 'x mandatory' }}>
        {baseCards.map((card) => (
          <div key={card.id} data-clip-lifespan-base-card="" style={{ width: CARD_W, minWidth: CARD_W, height: 480, scrollSnapAlign: 'start' }} className="relative flex flex-shrink-0 flex-col overflow-hidden rounded-[16px] border border-[#12121214] bg-white shadow-[0px_8px_24px_0px_rgba(0,0,0,0.05)]">
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
