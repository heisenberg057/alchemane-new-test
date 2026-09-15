'use client';
import React from 'react';
import Image from 'next/image';
import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';
import { LazyGumletEmbed } from '@/components/video/LazyGumletEmbed';

export const HairTransplantHero = () => {
  return (
    <AnimateOnScroll variant="fadeIn">
    <section className="bg-white pb-12 pt-6">
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 xl:px-[160px]">
        <div className="bg-[#121212] rounded-[24px] max-w-[1120px] mx-auto flex flex-col items-center text-center overflow-hidden pt-[64px] pb-0">
          
          {/* Badge */}
          <div className="flex items-center gap-[7px] mb-8 px-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <g clipPath="url(#clip0_1069_60377)">
                <path d="M12.0032 14.9051C13.064 14.9051 14.0814 14.4836 14.8316 13.7335C15.5817 12.9833 16.0032 11.9659 16.0032 10.9051C15.9756 10.0602 15.7385 9.23552 15.3132 8.50506C14.6432 7.13506 13.9532 5.72506 15.6832 1.50506C15.7913 1.29976 15.8247 1.06324 15.7775 0.836031C15.7304 0.608824 15.6058 0.405073 15.4249 0.259687C15.2441 0.114301 15.0183 0.0363307 14.7863 0.0391356C14.5543 0.0419405 14.3304 0.125346 14.1532 0.275061C12.4532 1.54506 7.25315 5.40506 8.00315 10.9951C8.07333 12.0243 8.51984 12.9917 9.25756 13.7128C9.99528 14.4339 10.9726 14.8583 12.0032 14.9051Z" fill="#58D293"/>
                <path d="M22.5 10.9063H18.5C18.2449 10.9058 17.9992 11.0029 17.8133 11.1776C17.6274 11.3524 17.5153 11.5916 17.5 11.8463C17.5 13.3049 16.9205 14.7039 15.8891 15.7353C14.8576 16.7668 13.4587 17.3463 12 17.3463C10.5413 17.3463 9.14236 16.7668 8.11091 15.7353C7.07946 14.7039 6.5 13.3049 6.5 11.8463C6.48469 11.5916 6.37261 11.3524 6.18671 11.1776C6.00081 11.0029 5.75514 10.9058 5.5 10.9063H1.5C1.10218 10.9063 0.720644 11.0643 0.43934 11.3456C0.158035 11.6269 0 12.0084 0 12.4063L0 22.4063C0 22.8041 0.158035 23.1856 0.43934 23.4669C0.720644 23.7482 1.10218 23.9063 1.5 23.9063H22.5C22.8978 23.9063 23.2794 23.7482 23.5607 23.4669C23.842 23.1856 24 22.8041 24 22.4063V12.4063C24 12.0084 23.842 11.6269 23.5607 11.3456C23.2794 11.0643 22.8978 10.9063 22.5 10.9063ZM1.5 15.4063C1.5 15.141 1.60536 14.8867 1.79289 14.6991C1.98043 14.5116 2.23478 14.4063 2.5 14.4063C2.76522 14.4063 3.01957 14.5116 3.20711 14.6991C3.39464 14.8867 3.5 15.141 3.5 15.4063ZM3.5 22.4063C3.23478 22.4063 2.98043 22.3009 2.79289 22.1134C2.60536 21.9258 2.5 21.6715 2.5 21.4063C2.5 21.141 2.60536 20.8867 2.79289 20.6991C2.98043 20.5116 3.23478 20.4063 3.5 20.4063C3.76522 20.4063 4.01957 20.5116 4.20711 20.6991C4.39464 20.8867 4.5 21.141 4.5 21.4063C4.5 21.6715 4.39464 21.9258 4.20711 22.1134C4.01957 22.3009 3.76522 22.4063 3.5 22.4063ZM7 18.8963C6.73478 18.8963 6.48043 18.7909 6.29289 18.6034C6.10536 18.4158 6 18.1615 6 17.8963C6 17.631 6.10536 17.3767 6.29289 17.1891C6.48043 17.0016 6.73478 16.8963 7 16.8963C7.26522 16.8963 7.51957 17.0016 7.70711 17.1891C7.89464 17.3767 8 17.631 8 17.8963C8 18.1615 7.89464 18.4158 7.70711 18.6034C7.51957 18.7909 7.26522 18.8963 7 18.8963ZM9 22.4063C8.73478 22.4063 8.48043 22.3009 8.29289 22.1134C8.10536 21.9258 8 21.6715 8 21.4063C8 21.141 8.10536 20.8867 8.29289 20.6991C8.48043 20.5116 8.73478 20.4063 9 20.4063C9.26522 20.4063 9.51957 20.5116 9.70711 20.6991C9.89464 20.8867 10 21.141 10 21.4063C10 21.6715 9.89464 21.9258 9.70711 22.1134C9.51957 22.3009 9.26522 22.4063 9 22.4063ZM14.5 22.4063C14.2348 22.4063 13.9804 22.3009 13.7929 22.1134C13.6054 21.9258 13.5 21.6715 13.5 21.4063C13.5 21.141 13.6054 20.8867 13.7929 20.6991C13.9804 20.5116 14.2348 20.4063 14.5 20.4063C14.7652 20.4063 15.0196 20.5116 15.2071 20.6991C15.3946 20.8867 15.5 21.141 15.5 21.4063C15.5 21.6715 15.3946 21.9258 15.2071 22.1134C15.0196 22.3009 14.7652 22.4063 14.5 22.4063ZM17 18.8963C16.7348 18.8963 16.4804 18.7909 16.2929 18.6034C16.1054 18.4158 16 17.631 16 17.8963C16 17.631 16.1054 17.3767 16.2929 17.1891C16.4804 17.0016 16.7348 16.8963 17 16.8963C17.2652 16.8963 17.5196 17.0016 17.7071 17.1891C17.8946 17.3767 18 17.631 18 17.8963C18 18.1615 17.8946 18.4158 17.7071 18.6034C17.5196 18.7909 17.2652 18.8963 17 18.8963ZM20 22.4063C19.7348 22.4063 19.4804 22.3009 19.2929 22.1134C19.1054 21.9258 19 21.6715 19 21.4063C19 21.141 19.1054 20.8867 19.2929 20.6991C19.4804 20.5116 19.7348 20.4063 20 20.4063C20.2652 20.4063 20.5196 20.5116 20.7071 20.6991C20.8946 20.8867 21 21.141 21 21.4063C21 21.6715 20.8946 21.9258 20.7071 22.1134C20.5196 22.3009 20.2652 22.4063 20 22.4063ZM21.5 16.4063C21.2348 16.4063 20.9804 16.3009 20.7929 16.1134C20.6054 15.9258 20.5 15.6715 20.5 15.4063C20.5 15.141 20.6054 14.8867 20.7929 14.6991C20.9804 14.5116 21.2348 14.4063 21.5 14.4063C21.7652 14.4063 22.0196 14.5116 22.2071 14.6991C22.3946 14.8867 22.5 15.141 22.5 15.4063C22.5 15.6715 22.3946 15.9258 22.2071 16.1134C22.0196 16.3009 21.7652 16.4063 21.5 16.4063Z" fill="#58D293"/>
              </g>
              <defs>
                <clipPath id="clip0_1069_60377">
                  <rect width="24" height="24" fill="white"/>
                </clipPath>
              </defs>
            </svg>
            <span className="text-[#58D293] text-[16px] font-medium tracking-[0.064px] leading-[1.4]">Hair Transplant</span>
          </div>

          {/* Heading */}
          <h1 className="text-[36px] md:text-[64px] font-extrabold text-white mb-6 leading-[1.2] tracking-[-0.5px] px-4">
            Front Hairline Transplant<br />
            <span className="text-white">+ Hair System</span>
          </h1>

          {/* Subheading */}
          <p className="text-white text-[20px] max-w-[607px] mb-8 leading-[1.55] tracking-[-0.1px] px-4">
            If you're serious about looking your <span className="font-bold">absolute best</span>, this is the most <span className="font-bold">advanced solution</span> available today.
          </p>

          {/* Trusted By */}
          <div className="flex flex-col items-center gap-3 mb-[48px] px-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className={`relative w-[44px] h-[44px] rounded-full border-2 border-white/20 overflow-hidden ${i === 1 ? 'ml-0' : '-ml-3'}`}>
                  <Image
                    src={`/assets/transplant-user-${i}.png`}
                    alt={`User avatar ${i}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
            <p className="text-white/70 text-sm font-medium">Trusted by 6,000+ men over the world</p>
          </div>

          {/* 🔥 MAIN VISUAL (VIDEO) */}
          <div className="relative w-full rounded-[16px] overflow-hidden h-[560px] md:h-[640px]">

            {/* Mobile Video */}
            <div className="absolute inset-0 block md:hidden">
              <LazyGumletEmbed
                title="Gumlet video mobile"
                embedSrc="https://play.gumlet.io/embed/69dde6f6416cc16cb4be91a0?background=false&autoplay=false&loop=false&disable_player_controls=false"
                rootMargin="160px 0px"
                placeholderLabel="Video loads when in view"
              />
            </div>

            {/* Desktop Video */}
            <div className="absolute inset-0 hidden md:block">
              <LazyGumletEmbed
                title="Gumlet video desktop"
                embedSrc="https://play.gumlet.io/embed/69dde6f6416cc16cb4be919e?background=false&autoplay=false&loop=false&disable_player_controls=false"
                rootMargin="160px 0px"
                placeholderLabel="Video loads when in view"
              />
            </div>

            {/* Bottom Text Overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-[35%] bg-gradient-to-t from-white via-white/90 to-transparent flex items-end justify-center pb-8 z-10">
              <div className="text-center">
                <h2 className="text-[32px] md:text-[56px] font-black italic uppercase text-[#121212] tracking-[2px] leading-tight">
                  Combination
                </h2>
                <h2 className="text-[32px] md:text-[56px] font-black italic uppercase text-black/40 tracking-[2px] leading-tight">
                  Method
                </h2>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
    </AnimateOnScroll>
  );
};
