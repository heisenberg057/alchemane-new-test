'use client';

import Image from 'next/image';
import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';

export const HairPatchConsultation = () => {
  const scrollToContactForm = () => {
    const element = document.getElementById('contact-form');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <AnimateOnScroll variant="fadeUp">
    <section className="py-[60px] md:py-[80px] lg:py-[120px] bg-[#F5F6F7]">
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-10 xl:px-[160px] flex justify-center">

        <div className="w-full max-w-[1120px] bg-white rounded-[16px] border border-[#12121214] shadow-[0px_8px_24px_0px_#0000000D] py-8 md:py-[72px] px-4 flex flex-col items-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 bg-[#1769FF1A] rounded-[6px] px-3 py-1.5 mb-3">
             <div className="relative w-[18px] h-[18px]">
                <Image src="/assets/hair-patch-get-started.svg" alt="Send" fill />
             </div>
             <span className="text-[#1769FF] text-[14px] font-medium tracking-[0.06px] leading-[20px]">Get Started</span>
          </div>

          {/* Heading */}
          <h2 className="text-[#121212] text-[26px] md:text-[36px] lg:text-[48px] font-extrabold leading-[1.2] lg:leading-[58px] tracking-[-0.5px] text-center mb-8 md:mb-12 lg:mb-16 max-w-[660px]">
             Book Your 1:1 Consultation Online Or In Person
          </h2>

          {/* Features Grid */}
          <div className="flex flex-col md:flex-row items-start justify-center gap-5 md:gap-10 lg:gap-[84px] w-full mb-8 md:mb-12 lg:mb-16 px-2 md:px-0">
             
             {/* Feature 1 */}
             <div className="flex flex-row md:flex-col items-start md:items-center gap-3 md:gap-6 w-full md:max-w-[240px]">
                <div className="w-[24px] h-[24px] md:w-[52px] md:h-[52px] rounded-[12px] bg-transparent md:bg-[#D7257D1A] flex items-center justify-center p-0 md:p-2.5 shrink-0">
                   <div className="relative w-full h-full">
                      <Image src="/assets/hair-patch-location-icon.svg" alt="Location" fill />
                   </div>
                </div>
                <div className="flex flex-col items-start md:items-center gap-1 md:gap-2 text-left md:text-center">
                   <p className="text-[#121212] text-[16px] md:text-[20px] leading-[1.2] md:leading-[24px] tracking-[-0.5px]">
                      <span className="font-bold">Mumbai </span>|
                      <span className="font-bold"> Delhi </span>|
                      <span className="font-bold"> Bangalore</span>
                   </p>
                   <p className="text-[#555555] text-[16px] md:text-[18px] font-medium leading-[1.5] md:leading-[27px] tracking-[-0.16px]">
                      Pick your city or choose online video consultation
                   </p>
                </div>
             </div>

             {/* Feature 2 */}
             <div className="flex flex-row md:flex-col items-start md:items-center gap-3 md:gap-6 w-full md:max-w-[240px]">
                <div className="w-[24px] h-[24px] md:w-[52px] md:h-[52px] rounded-[12px] bg-transparent md:bg-[#0074BA1A] flex items-center justify-center p-0 md:p-2.5 shrink-0">
                   <div className="relative w-full h-full">
                      <Image src="/assets/hair-patch-globe-icon.svg" alt="Globe" fill />
                   </div>
                </div>
                <div className="flex flex-col items-start md:items-center gap-1 md:gap-2 text-left md:text-center">
                   <p className="text-[#121212] text-[16px] md:text-[20px] font-bold leading-[1.2] md:leading-[24px] tracking-[-0.5px]">
                      12+ countries Served
                   </p>
                   <p className="text-[#555555] text-[16px] md:text-[18px] font-medium leading-[1.5] md:leading-[27px] tracking-[-0.16px]">
                      Trusted by 6,700+ clients globally
                   </p>
                </div>
             </div>

             {/* Feature 3 */}
             <div className="flex flex-row md:flex-col items-start md:items-center gap-3 md:gap-6 w-full md:max-w-[240px]">
                <div className="w-[24px] h-[24px] md:w-[52px] md:h-[52px] rounded-[12px] bg-transparent md:bg-[#FF8C351A] flex items-center justify-center p-0 md:p-2.5 shrink-0">
                   <div className="relative w-full h-full">
                      <Image src="/assets/hair-patch-lock-icon.svg" alt="Lock" fill />
                   </div>
                </div>
                <div className="flex flex-col items-start md:items-center gap-1 md:gap-2 text-left md:text-center">
                   <p className="text-[#121212] text-[16px] md:text-[20px] font-bold leading-[1.2] md:leading-[24px] tracking-[-0.5px]">
                      100% Confidential
                   </p>
                   <p className="text-[#555555] text-[16px] md:text-[18px] font-medium leading-[1.5] md:leading-[27px] tracking-[-0.16px]">
                      Honest advice from experts
                   </p>
                </div>
             </div>

          </div>

          {/* CTA Section */}
          <div className="flex flex-col items-center gap-3 w-full px-2 md:px-0">
             <button
               type="button"
               onClick={scrollToContactForm}
               className="w-full md:max-w-[360px] h-[52px] md:h-[45px] bg-gradient-to-r from-[#4686FE] to-[#1769FF] rounded-[8px] shadow-[0px_4px_8px_0px_#00000026] flex items-center justify-center gap-3 hover:opacity-90 transition-opacity"
             >
                <span className="text-white text-[16px] md:text-[18px] font-semibold tracking-[0.2px] leading-[25px]">Book Your Consultation Now</span>
                <div className="relative w-[20px] h-[20px] md:w-[28px] md:h-[28px]">
                   <Image src="/assets/hair-patch-arrow-up-right-white.svg" alt="Arrow" fill />
                </div>
             </button>
             <p className="text-[#555555] text-[14px] font-medium leading-[18px] tracking-[-0.16px]">Only takes 1 minute</p>
          </div>

        </div>

      </div>
    </section>
    </AnimateOnScroll>
  );
};
