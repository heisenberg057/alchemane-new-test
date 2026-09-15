import Image from 'next/image';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const EBOOK_FORM_URL = 'https://forms.gle/e6GCEz3SrWSK7EvGA';

interface EbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc?: string;
  mobileImageSrc?: string;
}

export const EbookModal = ({ 
  isOpen, 
  onClose,
  imageSrc = "/assets/stick-on-ebook-cover.png",
  mobileImageSrc
}: EbookModalProps) => {
  const [mounted, setMounted] = useState(false);
  const mobileCoverSrc = mobileImageSrc || imageSrc;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const scrollY = window.scrollY;
    document.body.style.cssText = `position:fixed;top:-${scrollY}px;width:100%;overflow:hidden;`;
    return () => {
      document.body.style.cssText = '';
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] bg-[#F5F6F7] overflow-y-auto scrollbar-hide md:flex md:items-center md:justify-center md:bg-transparent md:px-4">
      {/* Backdrop - Desktop Only */}
      <div 
        className="hidden md:block absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full min-h-full md:min-h-0 md:max-w-[1340px] md:h-[995px] md:rounded-[24px] bg-[#F5F6F7] flex flex-col md:flex-row md:overflow-hidden">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="fixed top-4 right-4 md:absolute md:top-6 md:right-6 z-50 w-[44px] h-[44px] md:w-[63px] md:h-[63px] bg-white md:bg-transparent text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 44 44" fill="none" className="md:w-full md:h-full md:p-0">
            <mask id="mask0_1069_19948" style={{ maskType: 'luminance' }} maskUnits="userSpaceOnUse" x="10" y="10" width="24" height="24">
              <path d="M13.5147 13.5165C18.2005 8.83077 25.7995 8.83077 30.4853 13.5165C35.171 18.2023 35.171 25.8013 30.4853 30.4871C25.7995 35.1729 18.2005 35.1729 13.5147 30.4871C8.82896 25.8013 8.82896 18.2023 13.5147 13.5165Z" fill="white"/>
              <path d="M17.2891 17.2891L26.7172 26.7172" stroke="black" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M26.7109 17.2891L17.2828 26.7172" stroke="black" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round"/>
            </mask>
            <g mask="url(#mask0_1069_19948)">
              <path d="M44.6274 21.9946L22 -0.632812L-0.627415 21.9946L22 44.622L44.6274 21.9946Z" fill="#121212"/>
            </g>
          </svg>
        </button>

        {/* Left Side: Content */}
        <div className="w-full md:w-[480px] flex flex-col gap-6 p-5 pt-16 md:p-0 md:pt-0 md:ml-[120px] md:justify-center md:h-full bg-[#F5F6F7] md:bg-transparent">
          
          {/* Header */}
          <div className="flex flex-col gap-3 md:gap-4">
            <h2 className="text-[#121212] text-[18px] md:text-[26px] font-bold leading-[120%] tracking-[-0.1px]">
              The Easy Guide to choosing the <span className="text-[#1769FF]">right hair system</span>
            </h2>
            <p className="text-[#555555] text-[14px] md:text-[20px] leading-[140%]">
              This simple guide shows you how to avoid mistakes and choose the best option for your hair.
            </p>
          </div>

          {/* Checklist */}
          <div className="flex flex-col gap-4 md:gap-6">
            <h3 className="text-[#121212] text-[16px] md:text-[24px] font-semibold leading-[1.2]">
              What you’ll learn:
            </h3>
            
            <div className="flex flex-col gap-3 md:gap-4">
              {[
                {
                  title: "Natural-Looking Results",
                  desc: "Learn how to choose the most realistic hairline, density, and texture."
                },
                {
                  title: "Safe & Comfortable Wear",
                  desc: "Understand which hair system bases are the most secure for daily use."
                },
                {
                  title: "Avoid Common Mistakes",
                  desc: "Discover what most people get wrong when selecting a hair patch."
                },
                {
                  title: "Design over Product",
                  desc: "See why great results come from custom design, not just the system itself."
                }
              ].map((item, idx) => (
                <div key={idx} style={{ padding: '16px 10px 16px 16px' }} className="bg-white rounded-[12px] border border-[#121212]/[0.08] shadow-sm flex items-start gap-2 md:gap-3">
                  <div className="flex-shrink-0 w-5 h-5 md:w-6 md:h-6 relative mt-0.5">
                     <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
                       <path d="M5.48373 2H14.5163C14.9909 2 15.3867 2 15.7109 2.02667C16.048 2.05333 16.3659 2.11307 16.6656 2.26667C17.1253 2.50133 17.4987 2.87467 17.7333 3.3344C17.8869 3.6352 17.9467 3.952 17.9733 4.28907C18 4.61333 18 5.00907 18 5.48373V14.5163C18 14.9909 18 15.3867 17.9733 15.7109C17.9467 16.048 17.8869 16.3659 17.7333 16.6656C17.4997 17.1253 17.1264 17.4987 16.6667 17.7333C16.3669 17.8869 16.0491 17.9467 15.712 17.9733C15.3877 18 14.992 18 14.5173 18H5.48373C5.00907 18 4.61333 18 4.28907 17.9733C3.9584 17.9573 3.63307 17.8763 3.33333 17.7333C2.87467 17.4987 2.50133 17.1253 2.26667 16.6667C2.12373 16.368 2.04267 16.0427 2.02667 15.712C2 15.3867 2 14.9909 2 14.5163V5.48373C2 5.00907 2 4.61333 2.02667 4.28907C2.05333 3.952 2.11307 3.6352 2.26667 3.3344C2.50133 2.87467 2.87467 2.50133 3.3344 2.26667C3.6352 2.11307 3.952 2.05333 4.28907 2.02667C4.61333 2 5.00907 2 5.48373 2ZM13.5797 8.6176C13.7536 8.45013 13.8229 8.2016 13.7621 7.96907C13.7003 7.73547 13.5189 7.55413 13.2853 7.49333C13.0528 7.43147 12.8043 7.50187 12.6379 7.67467L9.1072 11.2032L7.80053 9.89653C7.5392 9.6352 7.1168 9.63627 6.85653 9.89653C6.59627 10.1579 6.59627 10.5792 6.8576 10.8405L8.63573 12.6176C8.896 12.8779 9.3184 12.8779 9.57867 12.6176L13.5787 8.6176H13.5797Z" fill="#191919"/>
                     </svg>
                  </div>
                  <div className="flex flex-col gap-1">
                    <h4 className="text-[#121212] text-[16px] md:text-[20px] font-semibold leading-[1.2]">
                      {item.title}
                    </h4>
                    <p className="text-[#555555] text-[14px] md:text-[18px] leading-[1.4]">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <a
              href={EBOOK_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full max-w-[342px] h-[52px] md:h-[56px] px-[24px] py-[14px] bg-[linear-gradient(104deg,#4686FE_0%,#1769FF_100%)] rounded-[8px] flex items-center justify-center gap-2 shadow-[0px_4px_8px_0px_rgba(0,0,0,0.15)] hover:scale-[1.02] transition-transform mx-auto md:mx-0"
            >
              <span className="text-white text-[16px] md:text-[18px] font-semibold tracking-[1px] uppercase">
                Get Your Free E-Book
              </span>
              <div className="w-[24px] h-[24px] md:w-[28px] md:h-[28px] relative flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 28 28" fill="none">
                  <path d="M18.8 2H9.2C5.22355 2 2 5.22355 2 9.2V18.8C2 22.7765 5.22355 26 9.2 26H18.8C22.7765 26 26 22.7765 26 18.8V9.2C26 5.22355 22.7765 2 18.8 2Z" fill="white"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M11.4286 10.3036C11.4286 9.85977 11.7883 9.5 12.2321 9.5H17.6964C18.1403 9.5 18.5 9.85977 18.5 10.3036V15.7678C18.5 16.2117 18.1403 16.5714 17.6964 16.5714C17.2526 16.5714 16.8929 16.2117 16.8929 15.7678V12.2436L10.8718 18.2647C10.558 18.5784 10.0492 18.5784 9.73536 18.2647C9.42155 17.9509 9.42155 17.4421 9.73536 17.1283L15.7564 11.1072H12.2321C11.7883 11.1072 11.4286 10.7474 11.4286 10.3036Z" fill="url(#paint0_linear_1069_45170)"/>
                  <defs>
                    <linearGradient id="paint0_linear_1069_45170" x1="9.98568" y1="7.47965" x2="20.5393" y2="10.0167" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#4686FE"/>
                      <stop offset="1" stopColor="#1769FF"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </a>
          </div>

        </div>

        {/* Mobile: book image below content */}
        <div className="w-full flex justify-center pt-6 pb-0 md:hidden">
           <Image 
             src={mobileCoverSrc} 
             alt="Ebook Cover" 
             width={300} 
             height={450} 
             className="object-contain" 
           />
        </div>

        {/* Desktop: right side panel */}
        <div className="hidden md:flex flex-1 items-center justify-center bg-[#F5F6F7] p-8 md:p-0 h-[300px] md:h-full flex-shrink-0">
          <div className="relative w-full h-full max-h-[800px]">
            <Image 
              src={imageSrc} 
              alt="Ebook Cover" 
              fill 
              className="object-contain"
            />
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
};
