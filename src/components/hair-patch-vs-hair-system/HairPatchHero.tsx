'use client';

import Image from 'next/image';
import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';
import { LazyGumletEmbed } from '@/components/video/LazyGumletEmbed';

export const HairPatchHero = () => {
  return (
    <AnimateOnScroll variant="fadeIn">
    <section className="relative w-full bg-white py-8 md:py-[120px] flex flex-col items-center">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px] flex flex-col items-center text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-[#F3F6FF] border border-[#1212120D] rounded-md px-3 py-1.5 mb-4 md:mb-6">
          <div className="relative w-5 h-5 md:w-6 md:h-6">
            <Image 
              src="/assets/hair-patch-burst-icon.svg" 
              alt="Burst Icon" 
              fill 
              className="object-contain" 
            />
          </div>
          <span className="text-[#1769FF] font-medium text-[14px] tracking-[0.06px]">Myth Busted</span>
        </div>

        {/* Heading */}
        <h1 className="text-[#121212] text-[32px] md:text-[64px] font-extrabold leading-[1.2] tracking-[-0.5px] max-w-[965px] mb-4">
          Hair Patch vs Hair 
          System: What’s the Difference?
        </h1>

        {/* Description Paragraph */}
        <p className="text-[#121212] text-[16px] md:text-[20px] leading-[1.55] tracking-[-0.1px] max-w-[763px] mb-8 md:mb-12">
          Most people think <span className="font-bold">wigs</span>, <span className="font-bold">patches</span>, and <span className="font-bold">hair systems</span> are the same but they’re not. Knowing the <span className="font-bold">difference</span> can change how <span className="font-bold">natural</span> you look and how confident you feel.
        </p>

        {/* 📱 Mobile Video / 💻 Desktop Video */}
        <div className="relative w-full max-w-[1120px] aspect-[4/5] md:aspect-[16/9] md:h-[630px] rounded-[16px] overflow-hidden group cursor-pointer">

          {/* Mobile Video */}
          <div className="absolute inset-0 block md:hidden">
            <LazyGumletEmbed
              title="Gumlet video mobile"
              embedSrc="https://play.gumlet.io/embed/69ddcfcd416cc16cb4bc4e04?background=false&autoplay=false&loop=false&disable_player_controls=false"
              rootMargin="160px 0px"
              placeholderLabel="Video loads when in view"
            />
          </div>

          {/* Desktop Video */}
          <div className="absolute inset-0 hidden md:block">
            <LazyGumletEmbed
              title="Gumlet video desktop"
              embedSrc="https://play.gumlet.io/embed/69ddcfcd416cc16cb4bc4e06?background=false&autoplay=false&loop=false&disable_player_controls=false"
              rootMargin="160px 0px"
              placeholderLabel="Video loads when in view"
            />
          </div>

        </div>

      </div>
    </section>
    </AnimateOnScroll>
  );
};
