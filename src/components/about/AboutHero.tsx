import Image from 'next/image';
import { Users } from 'lucide-react';
import { ABOUT_HERO_ASSETS } from './aboutHeroAssets';
import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';

export const AboutHero = () => {
  return (
    <AnimateOnScroll variant="fadeIn">
    <section className="bg-white flex flex-col items-center pt-6 pb-12 md:pt-8 md:pb-16 px-5 md:px-0">
      <div className="w-full max-w-[1440px] md:px-10 xl:px-[160px] flex flex-col items-center text-center">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-[rgba(23,105,255,0.08)] md:bg-[#F3F6FF] border border-[rgba(23,105,255,0.15)] md:border-[#1212120D] px-4 py-2 md:px-[11px] md:py-[5px] rounded-full md:rounded-[6px] mb-4 md:mb-3">
          <Users className="w-5 h-5 md:w-6 md:h-6 text-[#1769FF]" />
          <span className="text-[14px] font-semibold md:font-medium text-[#1769FF] tracking-[0.06px]">About Us</span>
        </div>

        {/* Heading */}
        <h1 className="text-[24px] sm:text-[28px] md:text-[48px] lg:text-[64px] font-extrabold text-[#121212] leading-[110%] md:leading-[58px] lg:leading-[77px] tracking-[-0.5px] mt-0 md:mt-[12px] max-w-full lg:max-w-[901px]">
          <span className="block">At American Hairline,<br/>We Solve Your</span>
          <span className="block">Hair Loss Worries</span>
        </h1>

        {/* Description */}
        <div className="flex flex-col items-center gap-4 md:gap-5 mt-5 md:mt-4">
          <p className="text-[16px] md:text-[20px] leading-[150%] md:leading-[31px] tracking-normal md:tracking-[-0.1px] text-[#333333] md:text-[#121212] max-w-full md:max-w-[607px]">
            We create handcrafted, customized <span className="font-bold text-[#121212]">non-surgical hair replacement systems</span> tailored to match your hair texture, density, and scalp.
          </p>
          <p className="text-[16px] md:text-[20px] leading-[150%] md:leading-[31px] tracking-normal md:tracking-[-0.1px] text-[#333333] md:text-[#121212] max-w-full md:max-w-[607px]">
            Designed with Indian hair texture, skin tone, and climate in mind, ensuring they <span className="font-bold text-[#121212]">blend seamlessly</span> and <span className="font-bold text-[#121212]">naturally</span>, just like your own hair.
          </p>
        </div>

        {/* Team Image — mobile */}
        <div className="relative w-full aspect-[358/447] rounded-[16px] overflow-hidden mt-8 md:hidden">
          <Image
            src={ABOUT_HERO_ASSETS.mobile.url}
            alt={ABOUT_HERO_ASSETS.mobile.alt}
            fill
            className="object-cover object-center"
            sizes="100vw"
            priority
          />
        </div>

        {/* Team Image — desktop */}
        <div className="relative hidden md:block w-full max-w-[1120px] h-[630px] rounded-[16px] overflow-hidden mt-[41px] mb-20">
          <Image
            src={ABOUT_HERO_ASSETS.desktop.url}
            alt={ABOUT_HERO_ASSETS.desktop.alt}
            fill
            className="object-cover object-center"
            sizes="min(1120px, 90vw)"
            fetchPriority="high"
          />
        </div>

      </div>
    </section>
    </AnimateOnScroll>
  );
};
