'use client';

import React from 'react';
import { Check, ArrowUpRight } from 'lucide-react';
import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';

const situations = [
  "Genetic or hereditary factors",
  "Alopecia and patchy hair loss",
  "Hormonal or chemical imbalance",
  "Age-related hair thinning",
  "Medication or treatment side effects",
  "Hair loss caused by stress"
];

export const SMPSituations = () => {
  const scrollToContactForm = () => {
    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <AnimateOnScroll variant="fadeUp">
    <section className="bg-white md:bg-[#F5F6F7] py-[72px] md:py-16 px-4 md:px-10 xl:px-[160px]">
      <div className="max-w-[1440px] mx-auto flex flex-col items-center">
        <h2 className="text-[26px] md:text-[42px] font-extrabold md:font-bold text-center mb-8 md:mb-12 leading-tight">
          SMP Works For Every<br />Situation
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 w-full max-w-[1000px] mx-auto mb-8 md:mb-0">
          {situations.map((item, index) => (
            <div key={index} className="bg-white border border-[#121212]/10 md:border-none rounded-xl md:rounded-2xl p-4 md:p-6 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow h-[52px] md:h-[88px]">
              <div className="w-5 h-5 md:w-6 md:h-6 bg-[#1769FF] rounded-[4px] flex items-center justify-center flex-shrink-0">
                 <Check className="text-white w-3 h-3 md:w-4 md:h-4" strokeWidth={4} />
              </div>
              <span className="text-[16px] md:text-[18px] font-medium text-[#111111]">{item}</span>
            </div>
          ))}
        </div>

        {/* Mobile Button */}
        <div className="w-full max-w-[358px] md:hidden">
           <button
              type="button"
              onClick={scrollToContactForm}
              className="w-full bg-gradient-to-r from-[#4686FE] to-[#1769FF] text-white p-4 rounded-[12px] font-semibold text-[18px] flex items-center justify-center gap-2 shadow-lg"
           >
              Talk to an Expert
              <div className="w-6 h-6 bg-white rounded-[6px] flex items-center justify-center flex-shrink-0">
                 <ArrowUpRight className="w-4 h-4 text-[#1769FF]" />
              </div>
           </button>
        </div>

      </div>
    </section>
    </AnimateOnScroll>
  );
};
