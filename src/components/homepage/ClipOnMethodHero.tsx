import Image from 'next/image';
import { CLIP_ON_HERO_ASSETS } from './clipOnHeroAssets';
import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';

export const ClipOnMethodHero = () => {
  return (
    <AnimateOnScroll variant="fadeIn">
    <section className="w-full bg-white">
      <div className="max-w-[1440px] mx-auto flex flex-col items-center px-4 pt-8 pb-8 md:px-10 md:pt-[120px] md:pb-[136px] xl:px-[160px]">

        {/* Badge */}
        <div className="inline-flex items-center justify-center gap-2 bg-[#F3F6FF] border border-[#1212120D] rounded-[6px] px-[7px] py-[5px] md:px-[11px]">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
            <path d="M12.8344 2.18817C12.5738 2.06932 12.2907 2.00781 12.0044 2.00781C11.718 2.00781 11.4349 2.06932 11.1744 2.18817L2.60436 6.08817C2.42691 6.16641 2.27604 6.29457 2.17012 6.45703C2.0642 6.61948 2.00781 6.80923 2.00781 7.00317C2.00781 7.1971 2.0642 7.38686 2.17012 7.54931C2.27604 7.71177 2.42691 7.83993 2.60436 7.91817L11.1844 11.8282C11.4449 11.947 11.728 12.0085 12.0144 12.0085C12.3007 12.0085 12.5838 11.947 12.8444 11.8282L21.4244 7.92817C21.6018 7.84993 21.7527 7.72177 21.8586 7.55931C21.9645 7.39686 22.0209 7.20711 22.0209 7.01317C22.0209 6.81923 21.9645 6.62948 21.8586 6.46703C21.7527 6.30457 21.6018 6.17641 21.4244 6.09817L12.8344 2.18817Z" fill="#1769FF" stroke="#1769FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2.00782 12C2.00734 12.1913 2.06173 12.3787 2.16453 12.5399C2.26733 12.7012 2.41424 12.8297 2.58782 12.91L11.1878 16.82C11.447 16.9374 11.7283 16.9981 12.0128 16.9981C12.2974 16.9981 12.5786 16.9374 12.8378 16.82L21.4178 12.92C21.5948 12.8404 21.7449 12.7111 21.8496 12.5477C21.9544 12.3844 22.0093 12.1941 22.0078 12" stroke="#1769FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2.00782 17.0078C2.00734 17.1991 2.06173 17.3865 2.16453 17.5478C2.26733 17.7091 2.41424 17.8375 2.58782 17.9178L11.1878 21.8278C11.447 21.9452 11.7283 22.0059 12.0128 22.0059C12.2974 22.0059 12.5786 21.9452 12.8378 21.8278L21.4178 17.9278C21.5948 17.8483 21.7449 17.7189 21.8496 17.5555C21.9544 17.3922 22.0093 17.2019 22.0078 17.0078" stroke="#1769FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-[#1769FF] text-[14px] leading-[20px] tracking-[0.06px] font-medium">
            Clip-On Method
          </span>
        </div>

        {/* Heading */}
        <h1 className="mt-4 md:mt-3 max-w-[272px] md:max-w-[965px] text-center text-[#121212] text-[32px] md:text-[64px] font-extrabold tracking-[-0.5px] leading-[38px] md:leading-[77px]">
          Get Hair Loss Coverage
          <br />
          Without Shaving Your Head
        </h1>

        {/* Subtext */}
        <p className="mt-4 max-w-[358px] md:max-w-[763px] text-center text-[#121212] text-[16px] md:text-[20px] tracking-[-0.1px] leading-[25px] md:leading-[31px]">
          <span className="font-medium">Invisible.&nbsp;</span>
          <span className="font-bold">Secure</span>
          <span className="font-medium">. Scalp-safe. Looks just like&nbsp;</span>
          <span className="font-bold">natural hair</span>
          <span className="font-medium">
            . No glue. No shaving.
            <br />
            Clip it on and it stays firm,&nbsp;
          </span>
          <span className="font-bold">feels light</span>
          <span className="font-medium">, and styles naturally.</span>
        </p>

        {/* Mobile image */}
        <div className="md:hidden mt-8 relative w-full max-w-[359px] rounded-[12px] overflow-hidden"
          style={{ aspectRatio: '117/146' }}>
          <Image
            src={CLIP_ON_HERO_ASSETS.mobile.url}
            alt={CLIP_ON_HERO_ASSETS.mobile.alt}
            fill
            className="object-cover object-center"
            sizes="(max-width: 391px) calc(100vw - 32px), 359px"
            priority
          />
        </div>

        {/* Desktop image */}
        <div className="hidden md:block mt-[44px] relative w-full max-w-[1120px] rounded-[16px] overflow-hidden"
          style={{ aspectRatio: '16/9' }}>
          <Image
            src={CLIP_ON_HERO_ASSETS.desktop.url}
            alt={CLIP_ON_HERO_ASSETS.desktop.alt}
            fill
            className="object-cover object-center"
            sizes="(min-width: 1440px) 1120px, (min-width: 1280px) calc(100vw - 320px), calc(100vw - 80px)"
            fetchPriority="high"
          />
        </div>

      </div>
    </section>
    </AnimateOnScroll>
  );
};
