'use client';

import Image from 'next/image';
import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';

interface EbookSectionProps {
  imageSrc?: string;
  mobileImageSrc?: string;
  className?: string;
  onClick?: () => void;
}

export const EbookSection = ({ 
  imageSrc = "/assets/hair-patch-ebook-cover.png",
  mobileImageSrc,
  className = "bg-white",
  onClick
}: EbookSectionProps) => {
  const mobileCoverSrc = mobileImageSrc || imageSrc;

  return (
    <AnimateOnScroll variant="fadeUp">
    <section className={`pt-[72px] pb-[120px] px-[16px] md:py-[80px] md:px-[60px] xl:px-[160px] flex justify-center items-center ${className}`}>
      <div className="w-full max-w-[358px] md:max-w-[1120px]">
        
        <div 
          onClick={onClick}
          className="w-full max-w-[358px] md:max-w-[1120px] min-h-[583px] md:h-[583px] flex-shrink-0 rounded-[16px] overflow-hidden border border-[#12121214] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.05)] bg-white flex flex-col md:flex-row items-start md:items-stretch relative group cursor-pointer p-0"
        >
           {/* DESKTOP ONLY: contained book image */}
           <div className="hidden md:flex w-[420px] lg:w-[480px] flex-shrink-0 items-center justify-center p-[24px] lg:p-[32px]">
             <div className="relative w-full h-full">
               <Image 
                 src={imageSrc} 
                 alt="The Ultimate Guide to Choosing the Perfect Hair System" 
                 fill
                 className="object-contain object-center"
                 sizes="(min-width: 1280px) 416px, 372px"
               />
             </div>
           </div>
           
           {/* Content — top on mobile, RIGHT side on desktop */}
           <div className="flex flex-col items-start gap-3 md:gap-6 p-[20px] md:p-0 md:pl-[80px] md:pr-[40px] md:flex-1 md:justify-center md:self-center w-full z-10">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-[6px] px-[12px] py-[5px] bg-[#12121212] rounded-[6px]">
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" className="md:w-[18px] md:h-[18px]">
                   <g clipPath="url(#clip0_1069_19847)">
                     <path d="M5.95312 2.15L7.04063 4H4.75C4.05937 4 3.5 3.44062 3.5 2.75C3.5 2.05938 4.05937 1.5 4.75 1.5H4.81875C5.28437 1.5 5.71875 1.74688 5.95312 2.15ZM2 2.75C2 3.2 2.10938 3.625 2.3 4H1C0.446875 4 0 4.44688 0 5V7C0 7.55312 0.446875 8 1 8H15C15.5531 8 16 7.55312 16 7V5C16 4.44688 15.5531 4 15 4H13.7C13.8906 3.625 14 3.2 14 2.75C14 1.23125 12.7688 0 11.25 0H11.1812C10.1844 0 9.25938 0.528125 8.75313 1.3875L8 2.67188L7.24687 1.39062C6.74062 0.528125 5.81562 0 4.81875 0H4.75C3.23125 0 2 1.23125 2 2.75ZM12.5 2.75C12.5 3.44062 11.9406 4 11.25 4H8.95938L10.0469 2.15C10.2844 1.74688 10.7156 1.5 11.1812 1.5H11.25C11.9406 1.5 12.5 2.05938 12.5 2.75ZM1 9V14.5C1 15.3281 1.67188 16 2.5 16H7V9H1ZM9 16H13.5C14.3281 16 15 15.3281 15 14.5V9H9V16Z" fill="url(#paint0_linear_1069_19847)"/>
                   </g>
                   <defs>
                     <linearGradient id="paint0_linear_1069_19847" x1="0.863423" y1="-3.59173" x2="19.6255" y2="0.918522" gradientUnits="userSpaceOnUse">
                       <stop stopColor="#4686FE"/>
                       <stop offset="1" stopColor="#1769FF"/>
                     </linearGradient>
                     <clipPath id="clip0_1069_19847">
                       <rect width="16" height="16" fill="white"/>
                     </clipPath>
                   </defs>
                 </svg>
                 <span className="text-[#555555] text-[14px] md:text-[16px] font-semibold tracking-[-0.12px]">Free eBook</span>
              </div>

              {/* Heading */}
              <h2 className="text-[32px] font-extrabold leading-[36px] tracking-[-0.25px] md:text-[48px] md:leading-[120%] md:tracking-[-0.5px] text-left max-w-[403px]">
                 <span className="bg-[linear-gradient(104deg,#4686FE_0%,#1769FF_100%)] bg-clip-text text-transparent">The Easy Guide</span> <br />
                 <span className="text-[#121212]">to Choosing the Right Hair System</span>
              </h2>

           </div>

           {/* Plus Button Interaction */}
           <div className="absolute z-20 bottom-[22px] right-[16px] md:bottom-10 md:right-10">
              {/* Tooltip */}
              <div className="absolute bottom-full right-0 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none hidden lg:block">
                 <div className="relative bg-white px-3 py-1 rounded-[4px] shadow-sm whitespace-nowrap border border-gray-100">
                    <span className="text-black text-[12px] font-semibold">Tap to read more</span>
                    <div className="absolute top-full right-4 -mt-1 border-4 border-transparent border-t-white"></div>
                 </div>
              </div>

              {/* Button */}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onClick?.();
                }}
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', width: 44, height: 44, flexShrink: 0 }}
                className="hover:scale-110 transition-transform"
              >
                 <svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44" fill="none">
                   <path d="M22 0C27.8348 0 33.4305 2.31785 37.5564 6.44365C41.6822 10.5695 44 16.1652 44 22C44 27.8348 41.6822 33.4305 37.5564 37.5564C33.4305 41.6822 27.8348 44 22 44C16.1652 44 10.5695 41.6822 6.44365 37.5564C2.31785 33.4305 0 27.8348 0 22C0 16.1652 2.31785 10.5695 6.44365 6.44365C10.5695 2.31785 16.1652 0 22 0ZM24 11.858C24 11.1287 24.0157 11.2755 23.5 10.7598C22.9843 10.244 22.7293 10 22 10C21.2707 10 21.0157 10.244 20.5 10.7598C19.9843 11.2755 20 11.1287 20 11.858V20.5H15.929H12.858C12.1287 20.5 11.4292 20.5838 10.9135 21.0995C10.3977 21.6152 10 21.7707 10 22.5C10 23.2293 10.3977 23.5993 10.9135 24.115C11.4292 24.6308 12.1287 24.5 12.858 24.5H15.929H20V32.483C20 33.2123 19.9843 33.4843 20.5 34C21.0157 34.5157 21.2707 34.8511 22 34.8511C22.7293 34.8511 22.9843 34.5157 23.5 34C24.0157 33.4843 24 33.2123 24 32.483V24.5H31.483C32.2123 24.5 32.9118 24.6308 33.4275 24.115C33.9433 23.5993 34 23.2293 34 22.5C34 21.7707 33.5 21 33.5 21C32.9843 20.4843 32.2123 20.5 31.483 20.5H24V11.858Z" fill="#1769FF"/>
                   <path d="M12 22.6016L32.3 22.6016" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                   <path d="M22.1016 12.5L22.1016 32.8" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
                 </svg>
              </button>
           </div>

           {/* MOBILE ONLY: contained book image */}
           <div className="w-full flex justify-center px-[20px] pb-[24px] pt-[8px] md:hidden">
             <Image
               src={mobileCoverSrc}
               alt="The Ultimate Guide to Choosing the Perfect Hair System"
               width={260}
               height={350}
               className="w-[260px] max-w-full h-auto object-contain"
             />
           </div>

        </div>

      </div>
    </section>
    </AnimateOnScroll>
  );
};
