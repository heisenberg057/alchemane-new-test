import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';
import { LazyGumletEmbed } from '@/components/video/LazyGumletEmbed';

export const RealHairIllusion = () => {
  return (
    <AnimateOnScroll variant="fadeIn">
    <section className="bg-white flex flex-col items-center py-[60px] md:py-[80px] lg:py-[120px] px-[20px] md:px-[60px] lg:px-[160px]">
      <div className="w-full max-w-[1440px] flex flex-col items-center">
        {/* Heading */}
        <h2 className="text-[28px] md:text-[36px] lg:text-[44px] font-extrabold leading-tight lg:leading-[53px] tracking-[-0.5px] text-[#121212] text-center mb-[32px] lg:mb-[44px]">
          Real Hair or Illusion?<br />
          Watch & Decide
        </h2>

        {/* Mobile Video (4:3) — hidden on lg+ */}
        <div
          className="block lg:hidden w-full rounded-[16px] overflow-hidden shadow-[0px_4px_12px_0px_rgba(0,0,0,0.15)]"
          style={{ position: 'relative', aspectRatio: '4/3' }}
        >
          <LazyGumletEmbed
            title="Real hair or illusion"
            embedSrc="https://play.gumlet.io/embed/69dc8fdfc6b8ccb79da8cd90?background=false&autoplay=false&loop=false&disable_player_controls=false"
            rootMargin="180px 0px"
            placeholderLabel="Load the comparison video when you reach it"
          />
        </div>

        {/* Desktop Video (16:9) — hidden below lg */}
        <div
          className="hidden lg:block w-full lg:w-[992px] rounded-[16px] overflow-hidden shadow-[0px_4px_12px_0px_rgba(0,0,0,0.15)]"
          style={{ position: 'relative', aspectRatio: '16/9' }}
        >
          <LazyGumletEmbed
            title="Real hair or illusion"
            embedSrc="https://play.gumlet.io/embed/69dc8c957e5487dd1d9236bd?background=false&autoplay=false&loop=false&disable_player_controls=false"
            rootMargin="260px 0px"
            placeholderLabel="Video loads only when this section is near"
          />
        </div>
      </div>
    </section>
    </AnimateOnScroll>
  );
};
