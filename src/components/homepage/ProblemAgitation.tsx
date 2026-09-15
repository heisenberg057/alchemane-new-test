'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';

const problems = [
  { text: "If you are tired of feeling self-conscious about your hair.", icon: "/assets/mkxm0e5w-1bk6g5t.svg" },
  { text: "If you avoid photos, mirrors, or social events.", icon: "/assets/mkxm0e5w-uovbby5.svg" },
  { text: "If you have tried oils, pills, & shampoos that never worked.", icon: "/assets/mkxm0e5w-nsel7fg.svg" },
  { text: "If surgery feels too risky, complicated, or overwhelming.", icon: "/assets/mkxm0e5w-uo9nrbl.svg" },
  { text: "If you want a natural-looking, pain-free solution.", icon: "/assets/mkxm0e5w-y3fs1p1.svg" },
];

export const ProblemAgitation = () => {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    
    cardRefs.current.forEach((card, index) => {
      if (!card) return;
      
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            }, index * 100);
            observer.unobserve(card); // fire once only
          }
        },
        { threshold: 0.15 }
      );
      
      observer.observe(card);
      observers.push(observer);
    });
    
    return () => observers.forEach(obs => obs.disconnect());
  }, []);

  return (
    <section className="py-[60px] md:py-[80px] lg:py-[120px] bg-[#f5f6f7] flex justify-center">
      <div className="w-full max-w-[1440px] flex flex-col lg:flex-row justify-between items-start px-[20px] md:px-[60px] lg:px-[160px] gap-[32px] lg:gap-0">
         {/* Left Side - Heading */}
    <div className="w-full lg:w-[444px] static lg:sticky lg:top-32 self-start">
      <h2 className="text-[32px] md:text-[44px] font-extrabold text-[#121212] leading-tight lg:leading-[53px] tracking-[-0.5px] w-full lg:w-[444px] text-center lg:text-left">
        This Might Sound Like Your Story
            </h2>
         </div>

         {/* Right Side - List of Problems */}
         <div className="flex flex-col gap-[16px] w-full lg:w-[576px]">
            {problems.map((prob, index) => (
               <div 
                  key={index} 
                  ref={(el) => { cardRefs.current[index] = el; }}
                  style={{ 
                     opacity: 0, 
                     transform: 'translateY(40px)', 
                     transition: `opacity 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * 100}ms, transform 600ms cubic-bezier(0.25, 0.46, 0.45, 0.94) ${index * 100}ms` 
                  }}
                  className="flex items-center gap-[16px] lg:gap-[24px] bg-white h-auto min-h-[80px] lg:h-[136px] p-[16px] lg:pl-[31px] lg:pr-[12px] rounded-[16px] border border-[#12121214] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.05)]"
               >
                  <div className="w-[40px] h-[40px] lg:w-[48px] lg:h-[48px] bg-[#1769ff1a] rounded-[12px] flex items-center justify-center flex-shrink-0 p-[10px] lg:p-[12px]">
                     <Image src={prob.icon} alt="Icon" width={24} height={24} className="w-[20px] h-[20px] lg:w-[24px] lg:h-[24px]" />
                  </div>
                  <p className="text-[16px] lg:text-[24px] font-medium text-[#121212] leading-snug lg:leading-[34px] tracking-[-0.25px] w-full lg:w-[410px]">
                     {prob.text}
                  </p>
               </div>
            ))}

            {/* Solution Card (CTA) */}
            <div 
               ref={(el) => { cardRefs.current[problems.length] = el; }}
               style={{ 
                  opacity: 0, 
                  transform: 'translateY(40px)', 
                  transition: 'opacity 700ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 500ms, transform 700ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 500ms' 
               }}
               className="relative w-full lg:w-[576px] h-auto min-h-[252px] rounded-[16px] overflow-hidden border border-[#12121214] bg-[linear-gradient(125.4deg,#4686fe_-1.21%,#1769ff_101.21%)] p-[24px] lg:pt-[91px] lg:pl-[143px] lg:pr-[28px] lg:pb-[23px] flex flex-col lg:block"
            >
               
               {/* Header */}
               <div className="flex items-center gap-[16px] lg:gap-[36px] lg:absolute lg:top-[23px] lg:left-[31px] mb-[16px] lg:mb-0">
                  <div className="relative w-[50px] h-[26px] lg:w-[76px] lg:h-[40px] flex-shrink-0">
                     <Image src="/assets/mkxm0e5w-6vwx9ht.svg" alt="Smile" fill className="object-contain" />
                  </div>
                  <h3 className="text-[24px] lg:text-[32px] font-bold text-white leading-tight lg:leading-[42px] tracking-[-0.5px]">
                     If Yes, we’ll guide you
                  </h3>
               </div>

               {/* Body Content */}
               <p className="text-[16px] lg:text-[18px] font-normal text-white leading-snug lg:leading-[24px] tracking-[-0.16px] w-full lg:w-[403px] mb-[20px] lg:mb-0">
                  Need clarity? Our consultant will guide you step by step to find what truly works for you. Zero pressure. All clarity.
               </p>
               
               <a href="#contact-form" className="bg-white text-[#121212] px-[20px] py-[10px] rounded-[8px] flex items-center gap-[8px] font-semibold text-[16px] lg:text-[18px] leading-[24px] tracking-[-0.1px] hover:opacity-90 w-fit transition-opacity lg:mt-[20px]">
                  <span>Get Guidance Now</span>
                  <div className="w-[20px] h-[20px] lg:w-[22px] lg:h-[24px] flex items-center justify-center">
                    <ArrowUpRight className="w-[16px] h-[16px]" />
                  </div>
               </a>
            </div>
         </div>
      </div>
    </section>
  );
};
