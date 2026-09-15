import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { HeroCarousel } from '@/components/HeroCarousel/HeroCarousel';

const HERO_CLIENT_AVATARS = [
  'https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/runtime-homepage-client-avatar-1.png',
  'https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/runtime-homepage-client-avatar-2.png',
  'https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/runtime-homepage-client-avatar-3.png',
  'https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/runtime-homepage-client-avatar-4.png',
  'https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/runtime-homepage-client-avatar-5.png',
] as const;

export const Hero = () => {
  return (
    <section className="bg-white flex flex-col items-center pt-[16px] sm:pt-[20px] md:pt-[40px] lg:pt-[64px] pb-[32px] md:pb-[48px] text-center overflow-hidden">
      <div className="w-full max-w-[1440px] px-[20px] md:px-[60px] lg:px-[160px] flex flex-col items-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-[#F3F6FF] border border-[#1212120D] px-[11px] py-[5px] rounded-[6px] mb-3">
          <div className="relative w-5 h-5 md:w-6 md:h-6 flex-shrink-0">
            <Image src="/assets/about-badge-star.svg" alt="Star" fill className="object-contain" />
          </div>
          <span className="text-[12px] md:text-[14px] font-medium text-[#1769FF] tracking-[0.06px]">India’s #1 Hair System Experts</span>
        </div>

        {/* Heading */}
        <h1 className="text-[28px] sm:text-[32px] md:text-[48px] lg:text-[64px] font-extrabold text-[#121212] tracking-[-0.5px] leading-tight lg:leading-[77px] mt-[6px] md:mt-[12px] mb-[12px] md:mb-[16px] max-w-4xl">
          Tired of Hiding Your Hair Loss?
        </h1>

        {/* Subheading */}
        <p className="text-[16px] md:text-[18px] lg:text-[20px] text-[#121212] max-w-[607px] mx-auto leading-relaxed lg:leading-[31px] tracking-[-0.1px] mb-[18px] md:mb-[28px]">
          Get a <span className="font-bold">natural-looking</span> hair system trusted by Bollywood celebrities, <span className="font-bold">without surgery</span>, side effects, or regret.
        </p>

        {/* CTA Buttons Container */}
        <div className="flex flex-col items-center gap-3 w-full max-w-[320px] justify-center mb-[10px] md:mb-[14px]">
          {/* CTA Button */}
          <a href="#contact-form" className="flex items-center justify-center gap-[8px] bg-gradient-to-r from-[#4686fe] to-[#1769ff] text-white px-[24px] py-[16px] rounded-[12px] shadow-[0px_4px_8px_0px_#00000026] h-[52px] w-full hover:opacity-90 transition-opacity">
            <span className="text-[16px] md:text-[18px] font-semibold leading-[25px] tracking-[0.2px] whitespace-nowrap">Discuss With A Consultant</span>
            <div className="w-[24px] h-[24px] md:w-[27px] md:h-[28px] relative flex-shrink-0">
               <Image src="/assets/arrow-up-right-white-square.svg" alt="Arrow" fill className="object-contain" />
            </div>
          </a>

          {/* WhatsApp Link - Re-styled for consistency in flex-row if needed, but keeping original look for now */}
          <a
            href="https://api.whatsapp.com/send/?phone=917208329070"
            target="_blank"
            rel="noopener noreferrer"
            className="relative w-[241px] h-[44px] cursor-pointer group flex items-center justify-center"
          >
             <div className="relative w-[241px] h-[44px]">
                 {/* Icon Container */}
                 <div className="absolute top-0 left-0 w-[44px] h-[44px] flex items-center justify-center">
                    <div className="w-[24px] h-[24px] relative">
                       <Image src="/assets/whatsapp-icon.svg" alt="WhatsApp" fill className="object-contain" />
                    </div>
                 </div>
                 
                 {/* Text Container */}
                 <div className="absolute top-[10px] left-[40px] w-[201px] h-[24px]">
                    {/* Underline */}
                    <div className="absolute top-[19px] left-[130px] w-[71px] h-[1px]">
                       <Image src="/assets/whatsapp-underline.svg" alt="Underline" fill className="object-cover" />
                    </div>
                    
                    {/* Text */}
                    <p className="absolute top-0 left-0 w-full h-full text-[16px] leading-[24px] tracking-[-0.2px] text-[#555555] whitespace-nowrap">
                       <span className="font-medium">Prefer WhatsApp? </span>
                       <span className="font-extrabold">Chat Now</span>
                    </p>
                 </div>
             </div>
          </a>
        </div>

        {/* Social Proof Avatars */}
        <div className="flex flex-col items-center gap-[8px] md:gap-[10px] mb-[14px] md:mb-[20px]">
          <div className="flex items-center justify-center w-[180px]">
             {HERO_CLIENT_AVATARS.map((src, index) => (
               <div
                 key={src}
                 className={`w-[40px] h-[44px] md:w-[44px] md:h-[44px] rounded-full border-[2px] border-white relative overflow-hidden ${index === 0 ? 'z-0' : '-ml-[6px]'}`}
                 style={{ zIndex: index * 10 }}
               >
                 <Image src={src} alt={`User ${index + 1}`} fill className="object-cover" sizes="44px" />
               </div>
             ))}
          </div>
          <p className="text-[16px] md:text-[18px] font-medium text-[#121212] tracking-[0.2px] leading-relaxed lg:leading-[29px]">
            Trusted by 6,000+ men over the world
          </p>
        </div>
      </div>

      <HeroCarousel />
    </section>
  );
};
