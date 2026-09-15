import Image from 'next/image';

export const NaturalHairlineGuide = () => {
  return (
    <section className="py-20 md:py-[120px] bg-[#F5F6F7]">
      <div className="w-full max-w-[1440px] mx-auto px-4 md:px-10 xl:px-[160px]">

        {/*
          Outer flex container.
          On mobile: stacks vertically (flex-col).
          On desktop: side-by-side (flex-row), with items-start so both
          columns start at the top — required for sticky to work.
        */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12">

          {/* ── LEFT: Sticky heading ──
              sticky + top-[120px] keeps it pinned 120px from the top of the
              viewport while the right column scrolls past it.
              Only activates on lg+ — on mobile it just flows normally.
          */}
          <div className="w-full lg:max-w-[444px] lg:sticky lg:top-[120px]">
            <h2 className="text-[#121212] text-[36px] md:text-[44px] font-extrabold leading-[1.2] tracking-[-0.5px]">
              If You Want To Use Your Natural Hair In The Front...
            </h2>
          </div>

          {/* ── RIGHT: Scrolling cards ──
              Normal flow — scrolls with the page while the left stays pinned.
          */}
          <div className="w-full lg:max-w-[640px] flex flex-col gap-9">

            {/* Step A */}
            <div className="w-full bg-white rounded-[16px] border border-[#121212]/[0.08] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.05)] p-8">
              <h3 className="text-[#121212] text-[26px] font-bold leading-[34px] tracking-[-0.5px] mb-5">
                A. Check Is the density in the first 1/2 to 1 inch good?
              </h3>

              <div className="flex items-center gap-2">
                <div className="flex-shrink-0 w-5 h-5 relative">
                  <Image src="/assets/icon-check-blue-square.svg" alt="Check" fill />
                </div>
                <p className="text-[#121212] text-[20px] font-bold leading-[26px] tracking-[-0.16px]">
                  If yes: <span className="font-normal">You can use your natural hair in the front</span>
                </p>
              </div>
            </div>

            {/* Step B */}
            <div className="w-full bg-white rounded-[16px] border border-[#121212]/[0.08] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.05)] p-8">
              <h3 className="text-[#121212] text-[26px] font-bold leading-[34px] tracking-[-0.5px] mb-5">
                B. If the density is low (some hair, but scalp shows):
              </h3>

              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-2">
                  <div className="flex-shrink-0 w-5 h-5 relative">
                    <Image src="/assets/icon-check-blue-square.svg" alt="Check" fill />
                  </div>
                  <p className="text-[#121212] text-[20px] font-medium leading-[26px] tracking-[-0.16px]">
                    1st Apply <span className="font-bold">fiber powder</span> (e.g., Toppik)
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-shrink-0 w-5 h-5 relative">
                    <Image src="/assets/icon-check-blue-square.svg" alt="Check" fill />
                  </div>
                  <p className="text-[#121212] text-[20px] font-medium leading-[26px] tracking-[-0.16px]">
                    2nd Do <span className="font-bold">Scalp Micropigmentation</span> (SMP)
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 w-5 h-5 mt-1 relative">
                    <Image src="/assets/icon-check-blue-square.svg" alt="Check" fill />
                  </div>
                  <p className="text-[#121212] text-[20px] font-medium leading-[26px] tracking-[-0.16px]">
                    If you're <span className="font-bold">okay with either</span>, you can go ahead with a brush-back.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-shrink-0 w-5 h-5 relative">
                    <Image src="/assets/icon-check-blue-square.svg" alt="Check" fill />
                  </div>
                  <p className="text-[#121212] text-[20px] font-medium leading-[26px] tracking-[-0.16px]">
                    If not, an <span className="font-bold">exposed hairline</span> is not advisable.
                  </p>
                </div>
              </div>
            </div>

            {/* Step C */}
            <div className="w-full bg-white rounded-[16px] border border-[#121212]/[0.08] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.05)] p-8">
              <h3 className="text-[#121212] text-[26px] font-bold leading-[34px] tracking-[-0.5px] mb-5">
                C. If the density is very low (nearly bald or too thin):
              </h3>

              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-2">
                  <div className="flex-shrink-0 w-5 h-5 relative">
                    <Image src="/assets/icon-check-blue-square.svg" alt="Check" fill />
                  </div>
                  <p className="text-[#121212] text-[20px] font-bold leading-[26px] tracking-[-0.16px]">
                    Not advisable <span className="font-normal">to use your own hair in the front.</span>
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 w-5 h-5 mt-1 relative">
                    <Image src="/assets/icon-check-blue-square.svg" alt="Check" fill />
                  </div>
                  <p className="text-[#121212] text-[20px] font-medium leading-[26px] tracking-[-0.16px]">
                    Consider a more <span className="font-bold">complete hair solution</span> such as a <span className="font-bold">hair system</span>, or discuss with a stylist for alternative options.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};