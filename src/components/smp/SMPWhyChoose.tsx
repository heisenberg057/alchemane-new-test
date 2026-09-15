import React from 'react';
import { Check } from 'lucide-react';
import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';

const reasons = [
  {
    title: "Specialized",
    desc: "We specialize in Scalp Micropigmentation treatment services."
  },
  {
    title: "Certified 5 Times",
    desc: "India's only expert certified five times in SMP."
  },
  {
    title: "Carbon-Based Ink",
    desc: "We use premium USA carbon-based ink designed only for SMP."
  },
  {
    title: "No Tattoo Ink",
    desc: "We never use tattoo ink, only safe SMP pigments are applied."
  },
  {
    title: "Precision Needles",
    desc: "We use 3rl and 1rl needles for natural SMP dot results."
  },
  {
    title: "Cheyenne Machine",
    desc: "We use Cheyenne, the USA's finest SMP equipment available."
  },
  {
    title: "6,500+ Clients",
    desc: "We have successfully treated 6,500+ SMP clients nationwide."
  },
  {
    title: "Hairline Expertise",
    desc: "We design natural hairlines with perfect dot size and shape."
  },
  {
    title: "Dermatologist Training",
    desc: "We are the only institute training dermatologists in SMP."
  },
  {
    title: "Do's & Don'ts",
    desc: "We provide detailed before and after-care SMP instructions."
  }
];

export const SMPWhyChoose = () => {
  return (
    <AnimateOnScroll variant="fadeUp">
    <section className="bg-[#F5F6F7] py-16 px-4 md:px-10 xl:px-[160px]">
      <div className="max-w-[1440px] mx-auto">
        <h2 className="text-[26px] md:text-[44px] font-extrabold text-center mb-12 leading-[1.2] tracking-[-0.5px]">
          Why Thousands Of Men<br />Choose American Hairline
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[1000px] mx-auto">
          {reasons.map((item, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow min-h-[100px]">
              <div className="w-6 h-6 bg-[#0057FF] rounded-[4px] flex items-center justify-center flex-shrink-0 mt-1">
                 <Check className="text-white w-4 h-4" strokeWidth={4} />
              </div>
              <div>
                  <span className="font-bold text-[#111111]">{item.title}</span>
                  <span className="text-[#111111]"> - {item.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
    </AnimateOnScroll>
  );
};
