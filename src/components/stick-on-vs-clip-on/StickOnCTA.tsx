import Image from 'next/image';

export const StickOnCTA = () => {
  return (
    <section className="relative w-full bg-white py-[72px] md:py-[120px] flex flex-col items-center">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px] flex flex-col items-center text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-[#1769FF]/10 rounded-md px-3 py-1.5 mb-3">
          <div className="relative w-[18px] h-[18px]">
            <Image 
              src="/assets/icon-chat-bubble-blue.svg" 
              alt="Chat" 
              fill 
              className="object-contain" 
            />
          </div>
          <span className="text-[#1769FF] font-medium text-[14px] tracking-[0.06px]">Still Confused?</span>
        </div>

        {/* Heading */}
        <h2 className="text-[#121212] text-[26px] md:text-[48px] font-extrabold leading-tight mb-6 max-w-[800px]">
          Not Sure What Best For You? <br />
          Let’s Find The Perfect Fit
        </h2>

        {/* Subheading */}
        <p className="text-[18px] md:text-[24px] font-semibold leading-relaxed mb-8 md:mb-9 max-w-[740px]">
          <span className="text-[#121212]">Get in touch with our expert. We’re here </span>
          <span className="text-[#121212]/50">to provide the guidance you need.</span>
        </p>

        {/* CTA Button */}
        <button className="flex items-center gap-2 bg-gradient-to-r from-[#4686fe] to-[#1769ff] text-white px-6 py-3.5 rounded-lg text-[16px] md:text-[18px] font-semibold shadow-lg hover:opacity-90 transition-opacity">
          Speak To An Expert
          <div className="w-[24px] h-[24px] md:w-[28px] md:h-[28px] relative ml-1">
             <Image 
               src="/assets/icon-arrow-up-right-white.svg" 
               alt="Arrow" 
               fill 
               className="object-contain"
             />
          </div>
        </button>

      </div>
    </section>
  );
};
