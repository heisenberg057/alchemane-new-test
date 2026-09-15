'use client';

import Image from 'next/image';

const stats = [
  { value: "12+ Years", label: "Experience" },
  { value: "6,770+", label: "Men Helped" },
  { value: "100%", label: "Natural Looking" },
  { value: "12+ Nations", label: "Client Base" },
];

export const WhyChooseUs = () => {
  const scrollToContactForm = () => {
    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="bg-[#F0F2F5] md:bg-[#F5F6F7] pt-10 pb-12 px-5 md:py-[120px] flex justify-center">
      <div className="w-full max-w-[1440px] md:px-10 lg:px-[80px] xl:px-[160px] flex flex-col md:flex-row md:items-stretch justify-between gap-8 md:gap-0">
        
        {/* Left Content 
          Increased max-w from 432px to 500px to ensure the text has physical space to stay on one line
        */}
        <div className="flex flex-col items-start justify-between w-full md:max-w-[500px]">
          <h2 className="text-[32px] md:text-[44px] font-extrabold text-[#121212] leading-[110%] md:leading-[53px] tracking-[-0.5px] text-left">
            {/* Mobile (unchanged) */}
            <span className="block md:hidden">Why Men Around The World Choose Us</span>
            
            {/* Desktop (Forced to 2 lines using whitespace-nowrap) */}
            <span className="hidden md:block whitespace-nowrap">Why Men Around The</span>
            <span className="hidden md:block">World Choose Us</span>
          </h2>

          {/* Desktop CTA */}
          <div className="w-full md:w-auto hidden md:block">
            <button
              type="button"
              onClick={scrollToContactForm}
              className="flex items-center justify-center gap-3 bg-[#1769FF] text-white px-10 py-6 rounded-[14px] shadow-[0px_8px_20px_0px_rgba(23,105,255,0.25)] hover:scale-[1.02] transition-all duration-200"
            >
              <span className="text-[22px] font-bold leading-[28px] tracking-[0.2px]">Talk To An Expert</span>
              <div className="relative w-[30px] h-[30px]">
                 <Image src="/assets/icon-arrow-up-right-white.svg" alt="Arrow" fill className="object-contain" />
              </div>
            </button>
          </div>
        </div>

        {/* Right Stats Grid */}
        <div className="grid grid-cols-2 gap-3 md:gap-5 w-full md:max-w-[544px]">
           {stats.map((stat, index) => (
              <div key={index} className="flex flex-col items-start md:items-center justify-center w-full min-h-[120px] md:h-[151px] bg-white rounded-[16px] border border-[rgba(18,18,18,0.06)] md:border-[2px] md:border-[#12121214] shadow-none md:shadow-[0px_10px_30px_0px_rgba(0,0,0,0.05)] p-5 md:p-0">
                 <span className="text-[28px] md:text-[30px] font-extrabold leading-[110%] md:leading-[39px] tracking-[-0.5px] md:tracking-[1px] text-[#1769FF] mb-2">
                    {stat.value}
                 </span>
                 <span className="text-[16px] md:text-[22px] font-normal leading-[150%] md:leading-[24px] tracking-normal md:tracking-[-0.16px] text-[#555555]">
                    {stat.label}
                 </span>
              </div>
           ))}
        </div>

        {/* Mobile CTA */}
        <div className="w-full md:hidden mt-2">
          <button
            type="button"
            onClick={scrollToContactForm}
            className="flex items-center justify-center gap-3 w-full h-[60px] bg-[#1769FF] text-white rounded-[12px] shadow-none"
          >
            <span className="text-[18px] font-bold leading-[25px]">Talk To A Hair Expert</span>
            <div className="relative w-[28px] h-[28px]">
               <Image src="/assets/icon-arrow-up-right-white.svg" alt="Arrow" fill className="object-contain" />
            </div>
          </button>
        </div>

      </div>
    </section>
  );
};
