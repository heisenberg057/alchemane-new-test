'use client';

import Image from 'next/image';
import { SMP_HERO_ASSETS } from './smpHeroAssets';
import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';

export const SMPHero = () => {
  return (
    <AnimateOnScroll variant="fadeIn">
    <section className="bg-white flex flex-col items-center pt-[32px] md:pt-[120px] pb-8 md:pb-16">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px] flex flex-col items-center text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-[8px] bg-[#F3F6FF] px-[11px] py-[5px] rounded-[6px] mb-4 md:mb-6 border border-[#1212120D]">
          <div className="w-5 h-5 md:w-6 md:h-6 relative">
            <Image src="/assets/smp-syringe.svg" alt="SMP" fill className="object-contain" />
          </div>
          <span className="text-xs md:text-sm font-semibold text-[#1769FF] uppercase tracking-wider">SMP</span>
        </div>

        {/* Heading */}
        <h1 className="text-[32px] md:text-[64px] font-extrabold text-dark leading-[1.2] tracking-[-0.5px] mb-4 md:mb-8 max-w-[900px]">
          Natural-Looking Scalp Micro Pigmentation (SMP) In India
        </h1>

        {/* Subheading */}
        <p className="max-w-[800px] text-[16px] md:text-[20px] leading-[25px] md:leading-[31px] tracking-[-0.1px] text-[#121212] mb-8 md:mb-12">
          SMP is a safe, <span className="font-bold">non-surgical procedure</span> that adds <span className="font-bold">pigment(color)</span> to the scalp, mimicking real hair. It restores density and improves the appearance of <span className="font-bold">thinning areas</span>, giving you a <span className="font-bold">natural, fuller look.</span>
        </p>

        {/* Image — mobile */}
        <div className="relative w-full aspect-[175/219] rounded-2xl overflow-hidden shadow-xl md:hidden">
          <Image
            src={SMP_HERO_ASSETS.mobile.url}
            alt={SMP_HERO_ASSETS.mobile.alt}
            fill
            className="object-cover object-center"
            sizes="calc(100vw - 32px)"
            priority
          />
        </div>

        {/* Image — desktop */}
        <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-xl hidden md:block">
          <Image
            src={SMP_HERO_ASSETS.desktop.url}
            alt={SMP_HERO_ASSETS.desktop.alt}
            fill
            className="object-cover object-center"
            sizes="min(1120px, calc(100vw - 320px))"
            fetchPriority="high"
          />
        </div>

      </div>
    </section>
    </AnimateOnScroll>
  );
};
