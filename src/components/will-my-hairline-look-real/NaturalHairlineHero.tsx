import Image from 'next/image';
import { NATURAL_HAIRLINE_HERO_ASSETS } from './naturalHairlineHeroAssets';
import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';

export const NaturalHairlineHero = () => {
  return (
    <AnimateOnScroll variant="fadeIn">
    <section className="relative w-full bg-white flex flex-col items-center">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px] flex flex-col items-center text-center py-[32px] md:py-[100px]">
        <div className="inline-flex items-center justify-center gap-[8px] border border-[#1212120D] rounded-[6px] bg-[#F3F6FF] px-[11px] py-[5px]">
          <div className="relative w-5 h-5 md:w-6 md:h-6">
            <Image src="/assets/icon-natural-hairline.svg" alt="Natural Hairline" fill className="object-contain" />
          </div>
          <span className="text-[#1769FF] font-medium text-[14px] tracking-[0.06px]">Natural Hairline</span>
        </div>

        <h1 className="mt-[16px] text-[#121212] text-center text-[32px] md:text-[64px] font-extrabold leading-[38px] md:leading-[1.2] tracking-[-0.5px]">
          <span className="md:hidden">
            Will My Hairline
            <br />
            Look Real?
          </span>
          <span className="hidden md:inline">Will My Hairline Look Real?</span>
        </h1>

        <p className="mt-[16px] w-[342px] md:w-auto text-center text-[16px] md:text-[20px] leading-[25px] md:leading-[31px] tracking-[-0.1px] text-[#121212] md:max-w-[763px]">
          <span className="font-medium">At American Hairline, we specialize in creating </span>
          <span className="font-bold">natural hairlines</span>
          <span className="font-medium">
            {' '}
            that no one can detect. It is
            <br />
            our craft and we are proud to say we have cracked it.
          </span>
        </p>

        <div className="mt-[32px] w-full md:hidden">
          <div className="mx-auto w-full max-w-[358px] overflow-hidden rounded-[12px] shadow-[0_12px_30px_rgba(18,18,18,0.12)]">
            <div className="relative aspect-[4/5] w-full">
              <Image
                src={NATURAL_HAIRLINE_HERO_ASSETS.mobile.src}
                alt={NATURAL_HAIRLINE_HERO_ASSETS.mobile.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) calc(100vw - 32px), 358px"
                priority
              />
            </div>
          </div>
        </div>

        <div className="mt-12 hidden w-full md:block">
          <div className="relative mx-auto w-full max-w-[1120px] overflow-hidden rounded-[16px] shadow-[0_20px_50px_rgba(18,18,18,0.16)]">
            <div className="relative aspect-[16/9] w-full">
              <Image
                src={NATURAL_HAIRLINE_HERO_ASSETS.desktop.src}
                alt={NATURAL_HAIRLINE_HERO_ASSETS.desktop.alt}
                fill
                className="object-cover"
                sizes="(min-width: 1440px) 1120px, (min-width: 768px) calc(100vw - 160px), 100vw"
                fetchPriority="high"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
    </AnimateOnScroll>
  );
};
