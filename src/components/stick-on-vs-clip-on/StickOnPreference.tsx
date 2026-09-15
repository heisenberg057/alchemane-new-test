'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';

type SystemType = 'stick-on' | 'clip-on';

export const StickOnPreference = () => {
  const [activeSystem, setActiveSystem] = useState<SystemType>('stick-on');

  const stickOnFeatures = [
    { text: "Enjoy all-day wear without taking it off.", highlights: ["Enjoy all-day wear", "without taking it off."] },
    { text: "Prefer monthly care for best results.", highlights: ["Prefer monthly care"] },
    { text: "Love a natural, secure hairline look.", highlights: ["secure hairline look."] },
    { text: "Want the ease of no daily removal.", highlights: ["no daily removal."] },
    { text: "Like a snug and seamless fit every day.", highlights: ["seamless fit"] },
    { text: "Wake up ready to go, no styling needed.", highlights: ["Wake up ready to go"] },
    { text: "Value steady confidence with no shifting.", highlights: ["steady confidence"] },
    { text: "Prefer long-term commitment.", highlights: ["long-term"] }
  ];

  const clipOnFeatures = [
    { text: "Want flexibility to remove it anytime.", highlights: ["flexibility", "remove it anytime."] },
    { text: "Prefer zero professional maintenance.", highlights: ["zero professional maintenance."] },
    { text: "Love changing your look instantly.", highlights: ["changing your look"] },
    { text: "Want a solution that lasts longer.", highlights: ["lasts longer."] },
    { text: "Comfortable with daily self-application.", highlights: ["daily self-application."] },
    { text: "Perfect for occasional wear.", highlights: ["occasional wear."] },
    { text: "Value total control over your hair.", highlights: ["total control"] },
    { text: "Prefer no long-term commitment.", highlights: ["no long-term commitment."] }
  ];

  const currentFeatures = activeSystem === 'stick-on' ? stickOnFeatures : clipOnFeatures;
  const activeSystemHref =
    activeSystem === 'stick-on'
      ? '/clip-on-or-stick-on/stick-on-hair-system'
      : '/clip-on-or-stick-on/clip-on-hair-system';

  const renderHighlightedText = (text: string, highlights: string[]) => {
    let parts = [text];
    highlights.forEach(highlight => {
      const newParts: string[] = [];
      parts.forEach(part => {
        if (part.includes(highlight)) {
          const split = part.split(highlight);
          newParts.push(split[0]);
          newParts.push(highlight);
          newParts.push(split[1]);
        } else {
          newParts.push(part);
        }
      });
      parts = newParts;
    });

    return parts.map((part, index) => {
      if (highlights.includes(part)) {
        return <span key={index} className="font-bold text-[#121212]">{part}</span>;
      }
      return <span key={index} className="text-[#121212]">{part}</span>;
    });
  };

  return (
    <AnimateOnScroll variant="fadeUp">
    <section className="relative w-full bg-[#F5F6F7] py-[60px] md:py-[80px] lg:py-[120px] flex flex-col items-center">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px] flex flex-col items-center">

        {/* Heading */}
        <h2 className="text-[#121212] text-[28px] md:text-[36px] lg:text-[44px] font-extrabold leading-tight text-center mb-8 md:mb-10">
          Which Option Feels More <br />
          Like You?
        </h2>

        {/* Main Card */}
        <div className="w-full max-w-[650px] bg-white rounded-[16px] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.05)] border border-[#12121214] p-6 md:p-[32px_106px] flex flex-col items-center">
          
          {/* Toggle Switch */}
          <div className="w-full max-w-[360px] h-[48px] bg-white border border-[#12121214] rounded-lg p-1 flex items-center justify-between mb-8 md:mb-9 relative">
             <div 
               className={`w-1/2 h-full rounded-md flex items-center justify-center cursor-pointer transition-all duration-300 ${activeSystem === 'stick-on' ? 'bg-gradient-to-r from-[#4686fe] to-[#1769ff] shadow-md' : 'bg-transparent hover:bg-gray-50'}`}
               onClick={() => setActiveSystem('stick-on')}
             >
                <span className={`text-[16px] md:text-[18px] font-bold ${activeSystem === 'stick-on' ? 'text-white' : 'text-[#121212]'}`}>Stick-On</span>
             </div>
             <div 
               className={`w-1/2 h-full rounded-md flex items-center justify-center cursor-pointer transition-all duration-300 ${activeSystem === 'clip-on' ? 'bg-gradient-to-r from-[#4686fe] to-[#1769ff] shadow-md' : 'bg-transparent hover:bg-gray-50'}`}
               onClick={() => setActiveSystem('clip-on')}
             >
                <span className={`text-[16px] md:text-[18px] font-bold ${activeSystem === 'clip-on' ? 'text-white' : 'text-[#121212]'}`}>Clip-On</span>
             </div>
          </div>

          {/* List Title */}
          <h3 className="text-[#121212] text-[18px] md:text-[24px] font-semibold mb-6 w-full text-left">
            Is perfect if you:
          </h3>

          {/* Checklist */}
          <div className="flex flex-col gap-5 w-full mb-7 md:mb-9">
            {currentFeatures.map((item, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="relative w-4 h-4 md:w-6 md:h-6 flex-shrink-0 mt-1 md:mt-0.5">
                   <Image 
                     src="/assets/preference-check-icon.svg" 
                     alt="Check" 
                     fill 
                   />
                </div>
                <p className="text-[16px] md:text-[20px] leading-[1.5] text-[#121212]">
                   {renderHighlightedText(item.text, item.highlights)}
                </p>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <Link
            href={activeSystemHref}
            className="w-full h-[52px] bg-gradient-to-r from-[#4686fe] to-[#1769ff] rounded-lg flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:opacity-95 transition-all group"
          >
             <span className="text-white text-[16px] md:text-[18px] font-semibold tracking-[1px]">
               Explore {activeSystem === 'stick-on' ? 'Stick-On' : 'Clip-On'} System
             </span>
             <div className="relative w-7 h-7">
                <Image 
                  src="/assets/preference-arrow-icon.svg" 
                  alt="Arrow" 
                  fill 
                  className="group-hover:translate-x-1 transition-transform"
                />
             </div>
          </Link>

        </div>

      </div>
    </section>
    </AnimateOnScroll>
  );
};
