import { Camera } from 'lucide-react';
import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';
import { LazyGumletEmbed } from '@/components/video/LazyGumletEmbed';

export const ResultsHero = () => {
  return (
    <AnimateOnScroll variant="fadeIn">
    <section className="bg-white flex flex-col items-center pt-[32px] pb-[32px] md:pt-[120px] md:pb-16">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px] flex flex-col items-center text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center justify-center gap-2 bg-[#F3F6FF] px-[11px] py-[5px] md:px-[12px] md:py-[6px] rounded-[6px] mb-[16px] md:mb-3 border border-[#1212120D]">
          <Camera className="w-[20px] h-[20px] md:w-6 md:h-6 text-[#1769FF]" />
          <span className="text-[14px] font-medium text-[#1769FF] tracking-[0.06px]">Results</span>
        </div>

        {/* Heading */}
        <h1 className="text-[32px] leading-[38px] md:text-[64px] font-extrabold text-[#121212] md:leading-[77px] tracking-[-0.5px] mt-0 md:mt-[12px] max-w-[342px] md:max-w-[965px]">
          Real Men,<br />Real Transformations
        </h1>

        {/* Subheading */}
        <p className="max-w-[342px] md:max-w-[763px] text-[16px] leading-[25px] md:text-[20px] md:leading-[31px] tracking-[-0.1px] text-[#121212] mt-[16px] md:mt-4 mb-[32px] md:mb-[44px]">
          Watch real men reveal the <span className="font-bold">natural-looking transformations</span> that helped them regain confidence and feel like themselves again.
        </p>

        {/* Mobile Video (4:3) — hidden on lg+ */}
        <div
          className="block lg:hidden w-full rounded-[16px] overflow-hidden shadow-[0px_4px_12px_0px_rgba(0,0,0,0.15)]"
          style={{ position: 'relative', aspectRatio: '4/3' }}
        >
          <LazyGumletEmbed
            title="Results hero video mobile"
            embedSrc="https://play.gumlet.io/embed/69dc8fdfc6b8ccb79da8cd90?background=false&autoplay=false&loop=false&disable_player_controls=false"
            rootMargin="120px 0px"
            placeholderLabel="Video loads when in view"
          />
        </div>

        {/* Desktop Video (16:9) — hidden below lg */}
        <div
          className="hidden lg:block w-full lg:w-[992px] rounded-[16px] overflow-hidden shadow-[0px_4px_12px_0px_rgba(0,0,0,0.15)]"
          style={{ position: 'relative', aspectRatio: '16/9' }}
        >
          <LazyGumletEmbed
            title="Results hero video desktop"
            embedSrc="https://play.gumlet.io/embed/69dc8c957e5487dd1d9236bd?background=false&autoplay=false&loop=false&disable_player_controls=false"
            rootMargin="120px 0px"
            placeholderLabel="Video loads when in view"
          />
        </div>

      </div>
    </section>
    </AnimateOnScroll>
  );
};
