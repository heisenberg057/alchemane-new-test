import React from 'react';

const rows = [
  {
    feature: "Front Hairline",
    transplant: "Thin, weak",
    hybrid: "Extremely Natural Hairline"
  },
  {
    feature: "Brush Back",
    transplant: "Gaps visible",
    hybrid: "Full, smooth look"
  },
  {
    feature: "Overall Density",
    transplant: "Thin once hair falls",
    hybrid: "Full, even density"
  },
  {
    feature: "Temple Area",
    transplant: "Often skipped",
    hybrid: "Well-defined temples"
  },
  {
    feature: "Weak Graft",
    transplant: "Limited results",
    hybrid: "Works with limited grafts"
  },
  {
    feature: "Donor Need",
    transplant: "5000+ grafts",
    hybrid: "Low, only front needed"
  },
  {
    feature: "Self-Belief",
    transplant: "Often disappointing",
    hybrid: "Boosts confidence"
  }
];

export const HairTransplantComparison = () => {
  return (
    <section className="bg-white py-[72px] px-4 md:py-20 md:px-10 xl:px-[160px]">
      <div className="max-w-[1000px] mx-auto flex flex-col items-center">
        <h2 className="text-[26px] md:text-[42px] font-extrabold text-[#121212] text-center mb-8 md:mb-12 leading-tight tracking-[-0.5px]">
          Why hybrid wins: Natural<br className="md:hidden" /> Hairline and Good Density
        </h2>

        {/* Desktop Table (hidden on mobile) */}
        <div className="hidden md:block w-full border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          {/* Header Row */}
          <div className="grid grid-cols-3 bg-[#121212] text-white">
            <div className="p-8 flex items-center justify-center text-center text-2xl font-bold border-r border-white/10">
              Feature
            </div>
            <div className="p-8 flex items-center justify-center text-center text-2xl font-bold border-r border-white/10">
              Hair Transplant
            </div>
            <div className="p-8 flex items-center justify-center text-center text-2xl font-bold bg-[#121212]">
              Front Transplant<br />+ Hair System
            </div>
          </div>

          {/* Data Rows */}
          {rows.map((row, index) => (
            <div key={index} className={`grid grid-cols-3 ${index % 2 === 0 ? 'bg-white' : 'bg-[#F9FAFB]'} border-b border-gray-100 last:border-0`}>
              <div className="p-6 flex items-center justify-center text-center text-xl font-bold text-[#121212] border-r border-gray-100">
                {row.feature}
              </div>
              <div className="p-6 flex items-center justify-center text-center text-xl text-[#121212] border-r border-gray-100">
                {row.transplant}
              </div>
              <div className="p-6 flex items-center justify-center text-center text-xl font-medium text-[#121212]">
                {row.hybrid}
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Table (visible on mobile) */}
        <div className="md:hidden w-full max-w-[358px] border border-[#E5E7EB] rounded-xl overflow-hidden shadow-[0px_8px_24px_0px_rgba(0,0,0,0.05)] bg-white">
          {/* Header Row */}
          <div className="grid grid-cols-3 bg-[#121212] border-b border-[#1212121F]">
             <div className="py-8 px-0 flex items-center justify-center text-center h-[89px]">
                <span className="text-white text-[18px] font-bold leading-[25px] tracking-[-0.25px]">Feature</span>
             </div>
             <div className="py-[19px] px-2 flex items-center justify-center text-center border-l border-[#E5E7EB]">
                <span className="text-white text-[18px] font-bold leading-[25px] tracking-[-0.25px]">Hair<br/>Transplant</span>
             </div>
             <div className="py-[19px] px-2 flex items-center justify-center text-center border-l border-[#E5E7EB]">
                <span className="text-white text-[18px] font-bold leading-[25px] tracking-[-0.25px]">Front Transplant<br/>+ Hair System</span>
             </div>
          </div>

          {/* Data Rows */}
          {rows.map((row, index) => (
            <div key={index} className={`grid grid-cols-3 min-h-[78px] ${index % 2 === 0 ? 'bg-white' : 'bg-[#12121205]'} border-b border-[#E5E7EB] last:border-0`}>
              {/* Feature Name */}
              <div className="p-4 flex items-center pl-4 pr-6">
                 <span className="text-[#121212] text-[16px] font-bold leading-[19px] tracking-[-0.25px] break-words w-full">
                    {row.feature === "Front Hairline" ? <>Front<br/>Hairline</> : 
                     row.feature === "Brush Back" ? <>Brush<br/>Back</> :
                     row.feature === "Overall Density" ? <>Overall<br/>Density</> :
                     row.feature === "Temple Area" ? <>Temple<br/>Area</> :
                     row.feature === "Weak Graft" ? <>Weak<br/>Graft</> :
                     row.feature === "Donor Need" ? <>Donor<br/>Need</> :
                     row.feature === "Self-Belief" ? <>Self-<br/>Belief</> :
                     row.feature}
                 </span>
              </div>

              {/* Transplant Value */}
              <div className="p-4 flex items-center justify-center border-l border-[#E5E7EB] px-2 bg-[#ffffff]">
                 <span className="text-[#121212] text-[16px] font-normal leading-[19px] tracking-[-0.16px] text-center w-full">
                    {row.transplant === "Thin, weak" ? <>Thin,<br/>weak</> :
                     row.transplant === "Gaps visible" ? <>Gaps<br/>visible</> :
                     row.transplant === "Thin once hair falls" ? "Thin once hair falls" :
                     row.transplant === "Often skipped" ? "Often skipped" :
                     row.transplant === "Limited results" ? "Limited results" :
                     row.transplant === "5000+ grafts" ? <>5000+<br/>grafts</> :
                     row.transplant === "Often disappointing" ? "Often disappointing" :
                     row.transplant}
                 </span>
              </div>

              {/* Hybrid Value */}
              <div className="p-4 flex items-center justify-center border-l border-[#E5E7EB] px-2 bg-[#ffffff]">
                 <span className="text-[#121212] text-[16px] font-normal leading-[19px] tracking-[-0.16px] text-center w-full">
                    {row.hybrid === "Extremely Natural Hairline" ? <>Extremely<br/>Natural Hairline</> :
                     row.hybrid === "Full, smooth look" ? <>Full,<br/>smooth look</> :
                     row.hybrid === "Full, even density" ? "Full, even density" :
                     row.hybrid === "Well-defined temples" ? "Well-defined temples" :
                     row.hybrid === "Works with limited grafts" ? "Works with limited grafts" :
                     row.hybrid === "Low, only front needed" ? <>Low, only<br/>front needed</> :
                     row.hybrid === "Boosts confidence" ? "Boosts confidence" :
                     row.hybrid}
                 </span>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-8 md:mt-12 text-center text-[20px] md:text-[28px] font-bold text-[#121212] leading-[26px] md:leading-snug max-w-[343px] md:max-w-3xl tracking-[-0.25px]">
          <span className="text-black/50">If your donor area falls short, this</span> <span className="text-black">hybrid solution gives you a flawless, natural look.</span>
        </p>
      </div>
    </section>
  );
};
