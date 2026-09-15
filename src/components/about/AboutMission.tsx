import Image from 'next/image';
import { ABOUT_MISSION_ASSETS } from './aboutMissionAssets';
import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';

export const AboutMission = () => {
  return (
    <AnimateOnScroll variant="fadeUp">
    <section className="w-full bg-[#F0F2F5] md:bg-[#F5F6F7] py-[72px] md:py-[120px]">
      <div className="w-full max-w-[1440px] px-[16px] md:px-[60px] lg:px-[80px] xl:px-[160px] flex flex-col items-start md:items-center mx-auto">

        {/* Heading */}
        <h2 className="text-[26px] md:text-[44px] font-extrabold text-[#121212] leading-[1.2] mb-[32px] md:mb-[60px] max-w-[340px] md:max-w-[850px] tracking-tight">
          Our Mission: Building The Future Of Non-Surgical Hair Solutions
        </h2>

        {/* Image — mobile */}
        <div className="relative w-full aspect-[4/5] rounded-[20px] overflow-hidden shadow-[0px_10px_30px_rgba(0,0,0,0.1)] md:hidden">
          <Image
            src={ABOUT_MISSION_ASSETS.mobile.url}
            alt={ABOUT_MISSION_ASSETS.mobile.alt}
            fill
            className="object-cover object-center"
            sizes="calc(100vw - 32px)"
          />
        </div>

        {/* Image — desktop */}
        <div className="relative w-full max-w-[992px] aspect-[992/558] rounded-[20px] overflow-hidden shadow-[0px_10px_30px_rgba(0,0,0,0.1)] hidden md:block">
          <Image
            src={ABOUT_MISSION_ASSETS.desktop.url}
            alt={ABOUT_MISSION_ASSETS.desktop.alt}
            fill
            className="object-cover object-center"
            sizes="min(992px, calc(100vw - 320px))"
          />
        </div>

      </div>
    </section>
    </AnimateOnScroll>
  );
};
