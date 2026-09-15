"use client";

import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';

function ConsultationArrow() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <path d="M19.6 0H8.4C3.76081 0 0 3.76081 0 8.4V19.6C0 24.2392 3.76081 28 8.4 28H19.6C24.2392 28 28 24.2392 28 19.6V8.4C28 3.76081 24.2392 0 19.6 0Z" fill="white" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.1429 9.89286C11.1429 9.39975 11.5426 9 12.0357 9H18.1071C18.6003 9 19 9.39975 19 9.89286V15.9643C19 16.4574 18.6003 16.8571 18.1071 16.8571C17.614 16.8571 17.2143 16.4574 17.2143 15.9643V12.0484L10.5242 18.7386C10.1755 19.0871 9.61019 19.0871 9.26151 18.7386C8.91283 18.3899 8.91283 17.8246 9.26151 17.4758L15.9516 10.7857H12.0357C11.5426 10.7857 11.1429 10.386 11.1429 9.89286Z"
        fill="url(#results-still-thinking-arrow)"
      />
      <defs>
        <linearGradient
          id="results-still-thinking-arrow"
          x1="9.53964"
          y1="6.75517"
          x2="21.2659"
          y2="9.57408"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#4686FE" />
          <stop offset="1" stopColor="#1769FF" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export const ResultsStillThinking = () => {
  const scrollToContactForm = () => {
    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <AnimateOnScroll variant="fadeUp">
    <section className="flex w-full justify-center bg-white py-[72px] md:py-[120px]">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">
        <div className="mx-auto max-w-[800px] rounded-[12px] border-t-4 border-t-[#4686FE] bg-white px-6 py-10 shadow-[0_8px_24px_rgba(0,0,0,0.05)] md:rounded-[16px] md:border-t-[6px] md:px-8 md:py-[60px]">
          <div className="mx-auto flex max-w-[640px] flex-col items-center text-center">
            <h2 className="text-[26px] font-extrabold capitalize leading-[1.2] tracking-[-0.5px] text-[#121212] md:text-[44px]">
              Still Thinking?
              <br />
              Your Hair Won&apos;t Wait
            </h2>

            <p className="mt-6 text-[18px] font-normal leading-[1.45] tracking-[-0.1px] text-[#121212] md:text-[20px] md:leading-[1.5]">
              The sooner you act, the easier it is to <span className="font-semibold">restore your look.</span> Book a private,{" "}
              <span className="font-semibold">no-obligation consultation</span> with our experts today.
            </p>

            <button
              type="button"
              onClick={scrollToContactForm}
              className="mt-8 inline-flex min-h-[56px] w-full items-center justify-center gap-3 rounded-[8px] bg-[linear-gradient(104deg,#4686FE_0%,#1769FF_100%)] px-4 py-[10px] text-center text-[18px] font-semibold capitalize leading-[140%] tracking-[0.2px] text-white shadow-[0_4px_8px_rgba(0,0,0,0.15)] transition-transform hover:scale-[1.01] md:min-h-[60px] md:w-auto md:min-w-[354px]"
            >
              <span>Book Your Consultation</span>
              <ConsultationArrow />
            </button>

            <p className="mt-5 max-w-[320px] text-[14px] font-normal leading-[1.3] tracking-[-0.16px] text-[#555] md:max-w-none">
              Limited slots available every month. Reserve yours today.
            </p>
          </div>
        </div>
      </div>
    </section>
    </AnimateOnScroll>
  );
};
