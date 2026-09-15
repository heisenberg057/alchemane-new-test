'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';
import Image from 'next/image';
import { HAIR_PATCH_CLIENT_ASSETS } from './hairPatchClientsAssets';
import { useSnapCarousel } from '@/components/carousel/useSnapCarousel';

const clients = [
  {
    id: 1,
    name: "Hrithik Bahl",
    title: "Physical Therapist",
    image: HAIR_PATCH_CLIENT_ASSETS.hrithik.url,
    quote: "As a therapist, I needed to look sharp. This system gave me that edge, naturally."
  },
  {
    id: 2,
    name: "Arnav Mukherjee",
    title: "Entrepreneur",
    image: HAIR_PATCH_CLIENT_ASSETS.arnav.url,
    quote: "The confidence boost was immediate. It's not just hair, it's a lifestyle upgrade."
  },
  {
    id: 3,
    name: "Aryan Bera",
    title: "Civil Engineer",
    image: HAIR_PATCH_CLIENT_ASSETS.aryan.url,
    quote: "I can wear any style I want now. The natural look is truly unbelievable."
  },
];

export const Gallery = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const {
    scrollRef: mobileScrollRef,
    activeIndex: mobileIndex,
    canPrev: canMobilePrev,
    canNext: canMobileNext,
    scrollPrev: goPrev,
    scrollNext: goNext,
    scrollToIndex,
  } = useSnapCarousel({
    itemSelector: '[data-hair-patch-client-mobile-card]',
    itemCount: clients.length,
  });

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .gallery-no-scrollbar::-webkit-scrollbar { display: none; }
        .gallery-no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      {/* ── MOBILE ── */}
      <div className="block lg:hidden">
        <section className="py-[40px] bg-[#f5f6f7]">

          {/* Heading */}
          <h2 style={{
            color: '#121212',
            fontSize: '26px',
            fontWeight: 800,
            lineHeight: '120%',
            letterSpacing: '-0.5px',
            textTransform: 'capitalize',
            maxWidth: '334px',
            marginBottom: '24px',
            paddingLeft: '16px',
          }}>
            Some Of Our Clients With The Most Natural Hairlines
          </h2>

          {/* Cards track */}
          <div
            ref={mobileScrollRef}
            className="flex gap-[16px] overflow-x-auto snap-x snap-mandatory gallery-no-scrollbar px-[16px]"
          >
            {clients.map((client) => (
              <div
                key={client.id}
                data-hair-patch-client-mobile-card=""
                className="relative flex-shrink-0 w-[calc(100vw-32px)] snap-center"
              >
                {/* Card image 4:5 */}
                <div style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '4/5',
                  borderRadius: '16px',
                  overflow: 'hidden',
                }}>
                  <Image
                    src={client.image}
                    alt={client.name}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 1024px) 100vw"
                  />

                  {/* Play */}
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="w-[56px] h-[56px] rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-colors cursor-pointer">
                      <Play className="text-white w-6 h-6 fill-white ml-0.5" />
                    </div>
                  </div>

                  {/* Quote overlay */}
                  <div
                    className="absolute bottom-0 left-0 right-0 p-[20px_20px_24px_20px] z-10"
                    style={{ background: 'linear-gradient(to top, rgba(24,30,37,0.9) 0%, transparent 60%)' }}
                  >
                    <p style={{
                      color: '#FFFFFF',
                      fontSize: '20px',
                      fontWeight: 600,
                      lineHeight: '130%',
                      letterSpacing: '-0.4px',
                    }}>
                      "{client.quote}"
                    </p>
                  </div>
                </div>

                {/* Name / title */}
                <div style={{ marginTop: '16px', paddingLeft: '4px' }}>
                  <p style={{ color: '#121212', fontSize: '18px', fontWeight: 400, lineHeight: '120%', letterSpacing: '-0.1px' }}>
                    {client.name}
                  </p>
                  <p style={{ color: 'rgba(85,85,85,0.60)', fontSize: '16px', fontWeight: 400, lineHeight: '120%', letterSpacing: '-0.16px', marginTop: '4px' }}>
                    {client.title}
                  </p>
                </div>
              </div>
            ))}

            {/* Right spacer */}
            <div className="w-[1px] flex-shrink-0" />
          </div>

          {/* Navigation controls */}
          <div className="flex items-center justify-center gap-[12px] mt-[24px]">

            {/* Prev */}
            <button
              onClick={goPrev}
              disabled={!canMobilePrev}
              className={`w-[44px] h-[44px] rounded-full bg-[#E8EAED] flex items-center justify-center transition-opacity ${
                !canMobilePrev ? 'opacity-40 cursor-not-allowed' : 'opacity-70 cursor-pointer'
              }`}
            >
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" style={{ transform: 'rotate(180deg)' }}>
                <path d="M11.666 21L18.666 14L11.666 7" stroke="#555555" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {/* Dots pill — driven purely by mobileIndex */}
            <div
              className="flex items-center justify-center gap-[8px] flex-shrink-0"
              style={{
                width: '152px', height: '44px',
                borderRadius: '24px',
                background: 'rgba(232, 234, 237, 0.72)',
                backdropFilter: 'blur(3.5px)',
              }}
            >
              {clients.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollToIndex(i)}
                  style={{
                    width: i === mobileIndex ? '32px' : '8px',
                    height: '8px',
                    borderRadius: '10px',
                    background: i === mobileIndex ? '#121212' : 'rgba(18,18,18,0.30)',
                    transition: 'all 300ms ease',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    flexShrink: 0,
                  }}
                />
              ))}
            </div>

            {/* Next */}
            <button
              onClick={goNext}
              disabled={!canMobileNext}
              className={`w-[44px] h-[44px] rounded-full flex items-center justify-center transition-opacity ${
                !canMobileNext ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
              }`}
              style={{ background: 'linear-gradient(104deg, #4686FE 0%, #1769FF 100%)' }}
              onMouseEnter={(e) => { if (canMobileNext) (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
            >
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <path d="M11.666 21L18.666 14L11.666 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

        </section>
      </div>

      {/* ── DESKTOP ── */}
      <div className="hidden lg:block">
        <section className="py-[60px] md:py-[80px] lg:py-[120px] bg-[#f5f6f7] flex flex-col items-center">
          <h2 className="text-[28px] md:text-[36px] lg:text-[44px] font-extrabold text-[#121212] text-center mb-[32px] lg:mb-[44px] leading-tight lg:leading-[53px] tracking-[-0.5px] max-w-[640px] px-[20px]">
            Some of Our Clients With the Most Natural Hairlines
          </h2>

          <div className="flex flex-col lg:flex-row gap-[12px] w-full max-w-[1120px] px-[20px] lg:px-0">
            {clients.map((client, index) => (
              <div
                key={client.id}
                onMouseEnter={() => setActiveIndex(index)}
                className={`flex flex-col shrink-0 transition-all duration-500 ease-in-out overflow-hidden w-full ${
                  activeIndex === index ? 'lg:w-[740px]' : 'lg:w-[178px]'
                }`}
              >
                <div className={`relative w-full rounded-[12px] overflow-hidden group cursor-pointer transition-all duration-500 ${activeIndex === index ? 'h-[300px] lg:h-[403px]' : 'h-[240px] lg:h-[403px]'}`}>
                  <Image src={client.image} alt={client.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="w-[56px] h-[56px] lg:w-[72px] lg:h-[72px] rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30 transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-play text-white w-6 h-6 lg:w-8 lg:h-8 fill-white ml-1"><polygon points="6 3 20 12 6 21 6 3"></polygon></svg>
                    </div>
                  </div>
                  <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#181E25] to-transparent transition-all duration-500 ${
                    activeIndex === index ? 'h-2/3 lg:h-1/2 p-6 lg:p-8 flex items-end' : 'h-[100px] lg:h-[152px]'
                  }`}>
                    {activeIndex === index && client.quote && (
                      <p className="text-white text-[16px] lg:text-[20px] font-semibold leading-[22px] lg:leading-[26px] tracking-[-0.4px] max-w-[700px] animate-fadeIn">
                        "{client.quote}"
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-[16px] flex flex-col gap-1 px-1">
                  <p className="text-[20px] font-medium text-[#121212] leading-[24px] tracking-[-0.1px] whitespace-nowrap overflow-hidden text-ellipsis">{client.name}</p>
                  <p className="text-[18px] font-medium text-[#55555580] leading-[22px] tracking-[-0.16px] whitespace-nowrap overflow-hidden text-ellipsis">{client.title}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};
