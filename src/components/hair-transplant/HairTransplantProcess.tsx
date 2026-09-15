import { ArrowUpRight } from 'lucide-react';
import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';

const steps = [
  {
    step: "Step 1",
    title: "Expert Consultation",
    desc: "Meet with our core team of hair system designers, transplant surgeons, and specialists.",
    details: {
      label: "We assess:",
      points: [
        "Your donor area",
        "Face structure",
        "Hair texture, color, and volume",
        "Desired hairstyle, hairline shape, temple area, and density",
      ],
    },
    footer: "This step provides 100% clarity on what's possible and what will look best for you.",
  },
  {
    step: "Step 2",
    title: "Strategic Planning & Design",
    desc: "The design process begins as our team of surgeons, hair experts, and designers collaborate to map your scalp.",
    details: {
      label: "We plan:",
      points: [
        "Transplant areas (using FUE for a minimally invasive, precise extraction process)",
        "Custom hair system coverage",
      ],
    },
    footer: "Every detail is tailored to your needs, from texture to volume and color, ensuring a natural result.",
  },
  {
    step: "Step 3",
    title: "Execution & Styling",
    desc: "Your transplant is performed with precision and care, and after 15–30 days of healing, we begin the fitting of your hair system.",
    details: {
      label: "We blend:",
      points: [
        "Your new front hairline",
        "Full volume at the back",
      ],
    },
    footer: "The final styling is designed to match your face shape and lifestyle, creating a seamless, natural look.",
  },
];

const CheckIcon = () => (
  <span className="flex-shrink-0 mt-[3px] w-[18px] h-[18px] rounded-full bg-[#1769FF]/10 flex items-center justify-center" aria-hidden="true">
    <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
      <path d="M1.5 4.5L3.5 6.5L7.5 2.5" stroke="#1769FF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </span>
);

export const HairTransplantProcess = () => {
  return (
    <AnimateOnScroll variant="fadeUp">
    <section className="bg-[#F5F6F7] py-[72px] md:py-[120px] px-4 md:px-10 xl:px-[160px]">
      <div className="max-w-[1440px] mx-auto">

        <h2 className="text-[26px] md:text-[44px] font-extrabold text-dark leading-[1.2] tracking-[-0.5px] mb-10 md:mb-14">
          A Step-by-Step Design Process<br />
          For Your Perfect Look
        </h2>

        {/* ── Step cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6">
          {steps.map((item, index) => (
            <div
              key={index}
              className="flex flex-col bg-white rounded-2xl border border-black/5 overflow-hidden"
            >
              {/* Card body */}
              <div className="p-5 md:p-6 flex flex-col gap-5 flex-1">

                {/* Step badge + title */}
                <div>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-[#1769FF]/8 text-[#1769FF] text-[11px] font-bold tracking-[0.08em] uppercase mb-3">
                    {item.step}
                  </span>
                  <h3 className="text-[17px] md:text-[18px] font-bold text-dark leading-[1.3] tracking-[-0.2px]">
                    {item.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-[14px] text-[#555] leading-[1.65]">
                  {item.desc}
                </p>

                {/* Details list */}
                <div>
                  <p className="text-[13px] font-bold text-dark mb-2.5 uppercase tracking-[0.06em]">
                    {item.details.label}
                  </p>
                  <div className="flex flex-col gap-2">
                    {item.details.points.map((point, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <CheckIcon />
                        <p className="text-[13px] text-[#555] leading-[1.6]">{point}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mx-5 md:mx-6 mb-5 md:mb-6 pt-4 border-t border-black/6">
                <p className="text-[13px] text-[#555] leading-[1.65] italic">
                  {item.footer}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ── The Result card ── */}
        <div
          className="rounded-2xl p-6 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          style={{ background: 'linear-gradient(135deg, #1769FF 0%, #4686FE 100%)' }}
        >
          <div className="flex flex-col gap-3 max-w-[720px]">
            {/* Label */}
            <div className="flex items-center gap-2.5">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center" aria-hidden="true">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <circle cx="6" cy="6" r="4" stroke="white" strokeWidth="1.5" />
                  <circle cx="6" cy="6" r="1.5" fill="white" />
                </svg>
              </span>
              <span className="text-white text-[22px] md:text-[28px] font-extrabold leading-[1.2] tracking-[-0.4px]">
                The Result:
              </span>
            </div>
            {/* Body */}
            <p className="text-white/90 text-[14px] md:text-[16px] leading-[1.7]">
              A natural front hairline and full volume at the back. Want more details?{' '}
              <span className="font-bold underline cursor-pointer hover:text-white transition-colors">
                Watch the video.
              </span>
            </p>
          </div>

          {/* CTA */}
          <button className="flex-shrink-0 flex items-center gap-2 bg-white text-dark font-bold text-[15px] md:text-[16px] px-6 py-3.5 rounded-xl hover:bg-white/90 transition-colors whitespace-nowrap">
            Discuss With a Consultant
            <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

      </div>
    </section>
    </AnimateOnScroll>
  );
};
