import Image from 'next/image';
import { ABOUT_FOUNDER_ASSETS } from './aboutFounderAssets';
import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';

export const AboutFounder = () => {
  return (
    <AnimateOnScroll variant="fadeUp">
    <section className="w-full bg-white flex flex-col items-center py-[72px] md:py-[120px]">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px] flex flex-col items-center">

        {/* Heading */}
        <h2 className="w-full text-center text-[26px] md:text-[44px] font-extrabold text-[#121212] leading-[1.2] tracking-[-0.5px] max-w-[340px] md:max-w-[635px] mb-8 md:mb-[44px]">
          Our Founder: The Vision Behind India&apos;s Natural Hairlines
        </h2>

        {/* Image — mobile */}
        <div className="relative w-full max-w-[358px] md:hidden rounded-[16px] overflow-hidden" style={{ height: '739px' }}>
          <Image
            src={ABOUT_FOUNDER_ASSETS.mobile.url}
            alt={ABOUT_FOUNDER_ASSETS.mobile.alt}
            fill
            className="object-cover object-top"
            sizes="358px"
          />
        </div>

        {/* Image — desktop */}
        <div className="relative hidden md:block w-full max-w-[992px] rounded-[16px] overflow-hidden" style={{ height: '741px' }}>
          <Image
            src={ABOUT_FOUNDER_ASSETS.desktop.url}
            alt={ABOUT_FOUNDER_ASSETS.desktop.alt}
            fill
            className="object-cover object-top"
            sizes="min(992px, calc(100vw - 320px))"
          />
        </div>

      </div>
    </section>
    </AnimateOnScroll>
  );
};
