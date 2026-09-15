'use client';

import Image from 'next/image';
import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';

export const HairPatchMyth = () => {
  const scrollToContactForm = () => {
    const element = document.getElementById('contact-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const comparisonCardStyle = {
    borderRadius: '12px',
    border: '2px solid #666666',
    background: `
      radial-gradient(120% 140% at 0% 0%, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.02) 32%, rgba(255,255,255,0) 58%),
      linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 38%, rgba(255,255,255,0) 100%),
      rgba(18, 18, 18, 0.25)
    `,
    boxShadow: `
      inset 0 1px 0 rgba(255,255,255,0.18),
      inset 0 -14px 32px rgba(255,255,255,0.02),
      0 18px 40px rgba(0,0,0,0.18)
    `,
    backdropFilter: 'blur(25.974834442138672px)',
    WebkitBackdropFilter: 'blur(25.974834442138672px)',
  } satisfies React.CSSProperties;

  return (
    <AnimateOnScroll variant="fadeUp">
    <section className="py-[60px] md:py-[80px] lg:py-[120px] bg-[#F5F6F7]">
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-10 xl:px-[160px] flex justify-center">
        
        <div className="w-full max-w-[1120px] bg-[#121212] rounded-[16px] border border-[#12121214] shadow-[0px_8px_24px_0px_#0000000D] py-6 px-4 md:py-[39px] md:px-[126px] flex flex-col items-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 bg-[#FFFFFF40] backdrop-blur-[5px] rounded-[8px] px-2 py-2 mb-3">
             <div className="relative w-[18px] h-[18px]">
                <Image src="/assets/hair-patch-chat-bubble.svg" alt="Chat" fill />
             </div>
             <span className="text-white text-[14px] md:text-[16px] font-semibold tracking-[0.4px] uppercase leading-[16px]">STILL CONFUSED?</span>
          </div>

          {/* Heading */}
          <h2 className="text-white text-[26px] md:text-[28px] lg:text-[32px] font-extrabold leading-[1.2] tracking-[-0.5px] text-center mb-8 md:mb-12">
            The Simplest Way To <br className="md:hidden" /> Understand It:
          </h2>

          {/* Comparison Cards */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-10 w-full justify-center">
            
            {/* Left Card - Hair Patch */}
            <div
              className="flex w-full md:max-w-[413px] py-5 px-4 md:py-[25px] md:px-[24px] items-center gap-4 md:gap-5"
              style={comparisonCardStyle}
            >
               <div className="relative w-[44px] h-[44px] md:w-[68px] md:h-[68px] flex-shrink-0">
                  <Image src="/assets/hair-patch-shirt-icon.svg" alt="Shirt" fill />
               </div>
               <div className="flex flex-col gap-1">
                  <h3 className="text-white text-[16px] md:text-[26px] font-bold leading-[1.2] md:leading-[36px] tracking-[-0.5px]">Hair Patch</h3>
                  <p className="text-[#FFFFFFB2] text-[16px] md:text-[20px] font-medium leading-[1.4] md:leading-[28px] tracking-[-0.16px]">Like buying readymade clothes</p>
               </div>
            </div>

            {/* Right Card - Hair System */}
            <div
              className="flex w-full md:max-w-[413px] py-5 px-4 md:py-[25px] md:px-[24px] items-center gap-4 md:gap-5"
              style={comparisonCardStyle}
            >
               <div className="relative w-[44px] h-[44px] md:w-[68px] md:h-[68px] flex-shrink-0">
                  <Image src="/assets/hair-patch-suit-icon.svg" alt="Suit" fill />
               </div>
               <div className="flex flex-col gap-1 items-start">
                  <h3 className="text-white text-[16px] md:text-[26px] font-bold leading-[1.2] md:leading-[36px] tracking-[-0.5px]">Hair System</h3>
                  <p className="text-[#FFFFFFB2] text-[16px] md:text-[20px] font-medium leading-[1.4] md:leading-[28px] tracking-[-0.16px]">Like a suit tailored by a designer</p>
               </div>
            </div>

          </div>

          {/* Bottom Text */}
          <p className="text-white text-[20px] md:text-[24px] font-bold leading-[1.3] md:leading-[31px] tracking-[-0.25px] text-center mt-8 md:mt-11">
             <span className="text-[#FFFFFF80]">One is general patch. </span>
             <span>The other one is made for you.</span>
          </p>

          {/* CTA Button */}
          <button
            type="button"
            onClick={scrollToContactForm}
            className="mt-8 w-full max-w-[360px] h-[45px] bg-gradient-to-r from-[#4686FE] to-[#1769FF] rounded-[8px] shadow-[0px_4px_8px_0px_#00000026] flex items-center justify-center gap-3 hover:opacity-90 transition-opacity"
          >
             <span className="text-white text-[16px] md:text-[18px] font-semibold tracking-[0.2px]">Talk to an Expert</span>
             <div className="relative w-[20px] h-[20px] md:w-[28px] md:h-[28px]">
                <Image src="/assets/hair-patch-arrow-up-right.svg" alt="Arrow" fill />
             </div>
          </button>

        </div>
      </div>
    </section>
    </AnimateOnScroll>
  );
};
