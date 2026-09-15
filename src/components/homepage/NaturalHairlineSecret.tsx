import Image from 'next/image';
import { NATURAL_HAIRLINE_SECRET_BANNER } from './naturalHairlineSecretAssets';
import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';
import { LazyGumletEmbed } from '@/components/video/LazyGumletEmbed';

export const NaturalHairlineSecret = () => {
  return (
    <AnimateOnScroll variant="fadeUp">
    <section className="py-[60px] md:py-[80px] lg:py-[120px] bg-[#F5F6F7] flex flex-col items-center">
      <div className="w-full max-w-[1440px] px-[20px] md:px-[60px] lg:px-[160px] flex flex-col items-center">

        {/* Heading */}
        <h2 className="text-[#121212] text-[32px] md:text-[48px] lg:text-[44px] font-extrabold leading-tight lg:leading-[53px] tracking-[-0.5px] text-center mb-[32px] lg:mb-[44px] max-w-[450px]">
          The Secret Behind Our <br /> Natural Hairline
        </h2>

        {/* Two Column Layout */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start gap-[16px] lg:gap-[32px] w-full lg:w-auto">

          {/* LEFT: Video Embed — responsive Gumlet player */}

          {/* Mobile embed (hidden on lg+) */}
          <div className="block lg:hidden w-full rounded-[16px] overflow-hidden flex-shrink-0" style={{ position: 'relative', aspectRatio: '4/5' }}>
            <LazyGumletEmbed
              title="Natural hairline explanation"
              embedSrc="https://play.gumlet.io/embed/69d8daf5e77eaed3190f8277"
              rootMargin="180px 0px"
              placeholderLabel="Load the hairline explanation when you reach it"
            />
          </div>

          {/* Desktop embed (hidden below lg) */}
          <div className="hidden lg:block w-[544px] rounded-[16px] overflow-hidden flex-shrink-0" style={{ position: 'relative', aspectRatio: '4/3' }}>
            <LazyGumletEmbed
              title="Natural hairline explanation"
              embedSrc="https://play.gumlet.io/embed/69d8de2ae77eaed3190fcad1?background=false&autoplay=false&loop=false&disable_player_controls=false"
              rootMargin="260px 0px"
              placeholderLabel="Video loads only when this section is near"
            />
          </div>

          {/* RIGHT: Feature Card + Bottom Banner */}
          <div className="flex flex-col gap-[16px] flex-shrink-0 w-full lg:w-[544px]">

            {/* Feature Cards — 544x266 */}
            <div
              className="bg-white rounded-[16px] border border-[#12121214] flex flex-col items-center justify-center w-full lg:w-[544px] h-auto lg:h-[266px]"
              style={{
                padding: '24px 20px',
                gap: '16px',
                boxShadow: '0px 8px 24px 0px rgba(0, 0, 0, 0.05)'
              }}
            >
              {/* Feature 1 */}
              <div className="flex flex-col items-center text-center gap-1">
                <h3 className="text-[#121212] text-[18px] lg:text-[20px] font-semibold leading-[24px] tracking-[-0.1px]">
                  Looks Just Like Your Own Scalp
                </h3>
                <p className="text-[#555555] text-[16px] lg:text-[18px] leading-[22px] tracking-[-0.16px]">
                  Nobody can tell
                </p>
              </div>

              {/* Separator */}
              <div className="h-[2px] w-[48px] bg-[#1212121A]"></div>

              {/* Feature 2 */}
              <div className="flex flex-col items-center text-center gap-1">
                <h3 className="text-[#121212] text-[18px] lg:text-[20px] font-semibold leading-[24px] tracking-[-0.1px]">
                  No Harsh or Fake Hairline
                </h3>
                <p className="text-[#555555] text-[16px] lg:text-[18px] leading-[22px] tracking-[-0.16px]">
                  Only natural edges
                </p>
              </div>

              {/* Separator */}
              <div className="h-[2px] w-[48px] bg-[#1212121A]"></div>

              {/* Feature 3 */}
              <div className="flex flex-col items-center text-center gap-1">
                <h3 className="text-[#121212] text-[18px] lg:text-[20px] font-semibold leading-[24px] tracking-[-0.1px]">
                  Feels Light, Breathable, Comfortable
                </h3>
                <p className="text-[#555555] text-[16px] lg:text-[18px] leading-[22px] tracking-[-0.16px]">
                  Just like your own
                </p>
              </div>
            </div>

            {/* Bottom Banner — 544x122 */}
            <div
              className="relative w-full lg:w-[544px] h-[100px] lg:h-[122px] rounded-[16px] overflow-hidden flex-shrink-0"
              style={{ boxShadow: '0px 8px 24px 0px rgba(0, 0, 0, 0.05)' }}
            >
              <Image
                src={NATURAL_HAIRLINE_SECRET_BANNER.mobileImageSrc}
                alt={NATURAL_HAIRLINE_SECRET_BANNER.imageAlt}
                fill
                sizes="100vw"
                className="object-cover md:hidden"
              />
              <Image
                src={NATURAL_HAIRLINE_SECRET_BANNER.desktopImageSrc}
                alt=""
                fill
                sizes="544px"
                className="hidden object-cover md:block"
              />
            </div>

          </div>
        </div>
      </div>
    </section>
    </AnimateOnScroll>
  );
};
