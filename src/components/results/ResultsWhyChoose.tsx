"use client";

import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';

const rows = [
  {
    problem: "Hairline recession",
    typical: "Hair transplant (12+ mos)",
    solution: "Non-surgical system (2 hrs)",
  },
  {
    problem: "Crown thinning",
    typical: "Topical treatments",
    solution: "Instant volume, exact match",
  },
  {
    problem: "Temple loss",
    typical: "Waiting / Powders",
    solution: "Precise custom design",
  },
  {
    problem: "Advanced hair loss",
    typical: "PRP + months of waiting",
    solution: "Full coverage instantly",
  },
  {
    problem: "Transplant failure",
    typical: "Risky revision surgery",
    solution: "Natural system over scar",
  },
];

const headers = ["The Problem", "Typical Solution", "Our Solution"] as const;

export const ResultsWhyChoose = () => {
  return (
    <AnimateOnScroll variant="fadeUp">
    <section className="flex w-full justify-center bg-white py-[72px] md:py-[120px]">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">
        <div className="mx-auto max-w-[920px] text-center">
          <h2 className="text-[26px] font-extrabold capitalize leading-[1.2] tracking-[-0.5px] text-[#121212] md:text-[44px]">
            Why Men Choose American Hairline
          </h2>
          <p className="mx-auto mt-4 max-w-[760px] text-[18px] font-normal leading-[1.55] tracking-[-0.1px] text-[#121212] md:text-[20px]">
            Stop waiting months for 'maybe'. Get guaranteed results today.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-[992px] overflow-hidden rounded-[12px] border border-[#E5E7EB] bg-white shadow-[0_8px_24px_rgba(0,0,0,0.05)] md:mt-14">
          <div className="grid grid-cols-3 bg-[#121212]">
            {headers.map((header) => (
              <div
                key={header}
                className="flex min-h-[72px] items-center justify-center border-r border-white/20 px-3 py-4 text-center text-[16px] font-bold leading-[1] tracking-[-0.25px] text-white last:border-r-0 md:min-h-[96px] md:px-6 md:text-[28px]"
              >
                {header}
              </div>
            ))}
          </div>

          {rows.map((row, index) => (
            <div
              key={row.problem}
              className={`grid grid-cols-3 ${index !== rows.length - 1 ? "border-b border-[#E5E7EB]" : ""}`}
            >
              <div className="flex min-h-[88px] items-center justify-center border-r border-[#E5E7EB] px-3 py-4 text-center text-[13px] font-bold leading-[1.25] tracking-[-0.25px] text-[#121212] md:min-h-[82px] md:px-6 md:text-[20px] md:leading-[1.2]">
                {row.problem}
              </div>
              <div className="flex min-h-[88px] items-center justify-center border-r border-[#E5E7EB] px-3 py-4 text-center text-[13px] font-bold leading-[1.25] tracking-[-0.25px] text-[#121212] md:min-h-[82px] md:px-6 md:text-[20px] md:leading-[1.2]">
                {row.typical}
              </div>
              <div className="flex min-h-[88px] items-center justify-center px-3 py-4 text-center text-[13px] font-bold leading-[1.25] tracking-[-0.25px] text-[#121212] md:min-h-[82px] md:px-6 md:text-[20px] md:leading-[1.2]">
                {row.solution}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
    </AnimateOnScroll>
  );
};
