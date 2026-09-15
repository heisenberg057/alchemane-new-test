'use client';

import Image from 'next/image';

export const AboutCTA = () => {
  const scrollToContactForm = () => {
    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="w-full bg-white flex justify-center py-[40px] md:py-[120px]">
      {/* Meteor Animation Styles */}
      <style jsx>{`
        @keyframes shootingStar {
          0% {
            opacity: 0;
            transform: translateX(0px) translateY(0px);
          }
          10% {
            opacity: 0.8;
          }
          100% {
            opacity: 0;
            transform: translateX(80px) translateY(80px);
          }
        }
        .meteor {
          position: absolute;
          width: 60px;
          height: 1.5px;
          background: linear-gradient(90deg, rgba(255, 255, 255, 0.8), transparent);
          border-radius: 999px;
          transform: rotate(-45deg);
          animation: shootingStar 2s ease-in infinite;
          will-change: transform, opacity;
        }
      `}</style>

      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">
        <div className="relative overflow-hidden rounded-2xl mx-auto bg-[#3B72F5] max-w-[1120px]">
          
          {/* Cloud background — right side */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_80%_50%,rgba(255,255,255,0.15)_0%,transparent_60%)]" />

          {/* Shooting star meteors */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="meteor" style={{ top: '15%', left: '35%', animationDelay: '0s', width: '50px' }} />
            <div className="meteor" style={{ top: '30%', left: '50%', animationDelay: '0.4s', width: '70px' }} />
            <div className="meteor" style={{ top: '10%', left: '65%', animationDelay: '0.8s', width: '45px' }} />
            <div className="meteor" style={{ top: '50%', left: '45%', animationDelay: '1.2s', width: '60px' }} />
            <div className="meteor" style={{ top: '20%', left: '75%', animationDelay: '0.2s', width: '55px' }} />
            <div className="meteor" style={{ top: '60%', left: '60%', animationDelay: '1.6s', width: '40px' }} />
            <div className="meteor" style={{ top: '40%', left: '80%', animationDelay: '0.6s', width: '65px' }} />
          </div>

          {/* Main Content — left aligned */}
          <div className="relative z-10 flex flex-col justify-center px-6 py-10 md:px-16 md:py-20 gap-4 md:gap-5 h-full">
            
            {/* Logo Text */}
            <div className="flex flex-col leading-none">
                <span className="text-white font-serif uppercase tracking-widest text-[12px] md:text-[14px] font-light">AMERICAN</span>
                <span className="text-white font-serif uppercase tracking-widest text-[12px] md:text-[14px] font-light">HAIRLINE</span>
            </div>

            {/* Heading */}
            <h2 className="text-[28px] md:text-[32px] font-extrabold text-white leading-[1.2] tracking-[-0.5px] capitalize font-proxima">
              Transform Your Life With Hair Again
            </h2>

            {/* Subtitle */}
            <p className="text-[16px] md:text-[20px] font-normal text-white/90 leading-[1.4] tracking-[-0.16px] font-proxima max-w-[600px]">
              Join thousands of men already living with natural-looking hair systems.
            </p>

            {/* CTA */}
            <button
              type="button"
              onClick={scrollToContactForm}
              className="inline-flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 rounded-lg bg-white border-none cursor-pointer w-fit mt-2 hover:bg-gray-50 transition-colors"
            >
              <span className="text-[16px] md:text-[18px] font-semibold text-[#121212] leading-none tracking-[-0.1px] font-proxima">
                Start Your Hair Journey
              </span>
              
              {/* SVG Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none" className="w-6 h-6 md:w-7 md:h-7 flex-shrink-0">
                <path d="M19.6 0H8.4C3.76081 0 0 3.76081 0 8.4V19.6C0 24.2392 3.76081 28 8.4 28H19.6C24.2392 28 28 24.2392 28 19.6V8.4C28 3.76081 24.2392 0 19.6 0Z" fill="#121212"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M11.1429 9.89286C11.1429 9.39975 11.5426 9 12.0357 9H18.1071C18.6003 9 19 9.39975 19 9.89286V15.9643C19 16.4574 18.6003 16.8571 18.1071 16.8571C17.614 16.8571 17.2143 16.4574 17.2143 15.9643V12.0484L10.5242 18.7386C10.1755 19.0871 9.61019 19.0871 9.26151 18.7386C8.91283 18.3899 8.91283 17.8246 9.26151 17.4758L15.9516 10.7857H12.0357C11.5426 10.7857 11.1429 10.386 11.1429 9.89286Z" fill="white"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
