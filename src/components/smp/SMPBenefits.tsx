'use client';

import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';

const benefits = [
  { 
     icon: "/assets/smp-icon-lock.svg", 
     text: (
        <>
           You want a <span className="font-bold">permanent solution</span><br/>that looks real.
        </>
     )
  },
  { 
     icon: "/assets/smp-icon-pill.svg", 
     text: (
        <>
           You are tired of <span className="font-bold">oils, shampoos,</span> or<br/><span className="font-bold">pills</span> that don't work.
        </>
     )
  },
  { 
     icon: "/assets/smp-icon-needle.svg", 
     text: (
        <>
           You don't want the <span className="font-bold">pain, cost,</span> or<br/><span className="font-bold">downtime</span> of a transplant.
        </>
     )
  },
  { 
     icon: "/assets/smp-icon-head.svg", 
     text: (
        <>
           You want <span className="font-bold">scars or alopecia patches</span><br/>covered naturally.
        </>
     )
  }
];

export const SMPBenefits = () => {
  const scrollToContactForm = () => {
    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <AnimateOnScroll variant="fadeUp">
    <section className="bg-[#F5F6F7] py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px] flex flex-col md:flex-row gap-8 md:gap-[160px] items-start">
         
         <div className="w-full md:w-[444px] md:sticky md:top-24">
            <h2 className="text-[26px] md:text-[44px] font-extrabold text-dark leading-[1.2] tracking-[-0.5px]">
               SMP Is Perfect For You, If...
            </h2>
         </div>

         <div className="w-full flex-1 flex flex-col gap-4">
            {benefits.map((item, index) => (
               <div key={index} className="flex items-center gap-4 md:gap-6 p-4 md:p-8 rounded-xl md:rounded-2xl bg-white border border-[#121212]/10 shadow-sm min-h-[92px] md:h-[136px] transition-all hover:shadow-md">
                  <div className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 bg-[#1769FF]/10 rounded-lg md:rounded-xl flex items-center justify-center">
                     <Image src={item.icon} alt="Icon" width={24} height={24} className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <p className="text-[16px] md:text-[24px] leading-[24px] md:leading-[34px] text-dark">
                     {item.text}
                  </p>
               </div>
            ))}
            
            {/* Call to Action Card */}
            <div className="bg-gradient-to-br from-[#4686FE] to-[#1769FF] p-6 md:p-8 rounded-2xl text-white mt-4 overflow-hidden relative">
               <div className="flex flex-col md:flex-row justify-between items-start relative z-10 gap-6 md:gap-0">
                  <div className="flex items-start gap-4">
                     <div className="mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="26" viewBox="0 0 50 26" fill="none" className="w-[50px] h-[26px] md:w-[76px] md:h-[40px]">
                          <g clipPath="url(#smp-benefits-smile-clip)">
                            <mask id="smp-benefits-smile-mask" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="0" y="0" width="50" height="26">
                              <path d="M0 0H50V26H0V0Z" fill="white"/>
                            </mask>
                            <g mask="url(#smp-benefits-smile-mask)">
                              <path fillRule="evenodd" clipRule="evenodd" d="M47.3393 3.73987C37.9546 21.1899 19.2086 28.2845 1.79729 18.4599C1.51957 18.3034 1.19125 18.2629 0.883842 18.3473C0.576429 18.4317 0.314812 18.6341 0.155955 18.9105C-0.00133197 19.1894 -0.0415845 19.5192 0.0440298 19.8276C0.129644 20.1361 0.334132 20.398 0.612621 20.5559C19.2753 31.0959 39.4026 23.5825 49.4613 4.88454C49.612 4.6024 49.645 4.2721 49.553 3.96573C49.4611 3.65936 49.2517 3.40178 48.9706 3.2492C48.6887 3.10083 48.3597 3.06911 48.0546 3.16088C47.7495 3.25265 47.4926 3.46057 47.3393 3.73987Z" fill="white"/>
                              <path d="M16.4475 10.976C17.3784 10.976 18.2712 10.6062 18.9294 9.94799C19.5877 9.28973 19.9575 8.39695 19.9575 7.46604C19.9575 6.53513 19.5877 5.64235 18.9294 4.9841C18.2712 4.32584 17.3784 3.95604 16.4475 3.95604C15.5166 3.95604 14.6238 4.32584 13.9656 4.9841C13.3073 5.64235 12.9375 6.53513 12.9375 7.46604C12.9375 8.39695 13.3073 9.28973 13.9656 9.94799C14.6238 10.6062 15.5166 10.976 16.4475 10.976ZM30.9788 7.24204C31.8915 7.24204 32.7668 6.87947 33.4122 6.2341C34.0576 5.58872 34.4202 4.71341 34.4202 3.80071C34.4202 2.88801 34.0576 2.01269 33.4122 1.36732C32.7668 0.721943 31.8915 0.359375 30.9788 0.359375C30.0661 0.359375 29.1908 0.721943 28.5454 1.36732C27.9001 2.01269 27.5375 2.88801 27.5375 3.80071C27.5375 4.71341 27.9001 5.58872 28.5454 6.2341C29.1908 6.87947 30.0661 7.24204 30.9788 7.24204Z" fill="white"/>
                            </g>
                          </g>
                          <defs>
                            <clipPath id="smp-benefits-smile-clip">
                              <rect width="50" height="26" fill="white"/>
                            </clipPath>
                          </defs>
                        </svg>
                     </div>
                     <div>
                        <h3 className="font-bold text-[26px] md:text-[32px] leading-[1.2] md:leading-[42px] mb-2">
                           If this sounds like YOU,<br/>SMP is perfect for YOU.
                        </h3>
                        <p className="text-[16px] md:text-[18px] leading-[24px] opacity-90 max-w-[400px] mb-6 hidden md:block">
                           It's a natural-looking solution that creates the illusion of a fuller hairline by replicating hair follicles on the scalp.
                        </p>
                        <p className="text-[16px] leading-[24px] opacity-90 max-w-[400px] mb-6 md:hidden">
                           It's a natural-looking solution that creates the illusion of a fuller hairline by replicating hair follicles on the scalp.
                        </p>
                        
                        <button
                           type="button"
                           onClick={scrollToContactForm}
                           className="bg-white text-dark w-full md:w-auto px-5 py-3 md:py-2.5 rounded-[10px] font-semibold text-[16px] md:text-[18px] flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors shadow-sm"
                        >
                           Talk to an Expert
                           <span className="w-6 h-6 rounded-[6px] bg-[#121212] flex items-center justify-center flex-shrink-0">
                             <ArrowUpRight className="w-4 h-4 text-white" />
                           </span>
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </div>

      </div>
    </section>
    </AnimateOnScroll>
  );
};
