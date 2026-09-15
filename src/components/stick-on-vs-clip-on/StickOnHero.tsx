'use client';

import Image from 'next/image';
import { STICK_ON_HERO_ASSETS } from './stickOnHeroAssets';
import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';

export const StickOnHero = () => {
  return (
    <AnimateOnScroll variant="fadeIn">
    <section className="relative w-full bg-white py-[72px] md:py-[100px] flex flex-col items-center">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px] flex flex-col items-center text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-[#F3F6FF] border border-[#1212120D] rounded-md px-3 py-1.5 mb-6">
          <div className="relative w-6 h-6">
            <Image 
              src="/assets/our-methods-icon.svg" 
              alt="Our Methods" 
              fill 
              className="object-contain" 
            />
          </div>
          <span className="text-[#1769FF] font-medium text-[14px] tracking-[0.06px]">Our Methods</span>
        </div>

        {/* Heading */}
        <h1 className="text-[#121212] text-[32px] md:text-[64px] font-extrabold leading-[1.2] tracking-[-0.5px] max-w-[965px] mb-4">
          Stick-On or Clip-On: <br />
          Which One Fits Your Lifestyle?
        </h1>

        {/* Description */}
        <p className="text-[#121212] text-[16px] md:text-[20px] leading-[1.55] tracking-[-0.1px] max-w-[763px] mb-12">
          The right hair system should not only look good. It should also suit your lifestyle, <span className="font-bold">feel comfortable</span>, and make you <span className="font-bold">feel confident</span>.
        </p>

        {/* Split Visual */}
        <div className="relative w-full max-w-[1120px] aspect-[4/5] md:aspect-[16/9] rounded-[16px] overflow-hidden shadow-2xl">
          <div className="absolute inset-0 hidden md:block">
            <Image
              src={STICK_ON_HERO_ASSETS.desktop.src}
              alt={STICK_ON_HERO_ASSETS.desktop.alt}
              fill
              className="object-cover"
              sizes="(max-width: 767px) 0px, (max-width: 1440px) calc(100vw - 320px), 1120px"
              fetchPriority="high"
            />
          </div>
          <div className="absolute inset-0 md:hidden">
            <Image
              src={STICK_ON_HERO_ASSETS.mobile.src}
              alt={STICK_ON_HERO_ASSETS.mobile.alt}
              fill
              className="object-cover"
              sizes="(max-width: 767px) calc(100vw - 32px), 0px"
              priority
            />
          </div>
        </div>

      </div>
    </section>
    </AnimateOnScroll>
  );
};
