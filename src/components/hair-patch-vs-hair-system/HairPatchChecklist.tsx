'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';
import { LazyGumletEmbed } from '@/components/video/LazyGumletEmbed';

const checklistItems = [
  { id: 1, title: "Hair Colour Match", desc: "Strand-to-strand precision, no visible mismatch" },
  { id: 2, title: "Hair Strand Diameter", desc: "Fine / Medium / Coarse, matched to native texture" },
  { id: 3, title: "Wave Type", desc: "Straight / Soft wave / Body wave / Defined curls" },
  { id: 4, title: "Hairline Shape", desc: "Straight / M-curve / Rounded / Slight recession" },
  { id: 5, title: "Hairline Density", desc: "Low / Medium / High (especially front 1 inch)" },
  { id: 6, title: "Hairline Direction", desc: "Brush back / Left-right / Natural fall (starting point)" },
  { id: 7, title: "Whorl Area / Crown Design", desc: "Clockwise / Anti-clockwise / Flat crown realism" },
  { id: 8, title: "Overall Hair Direction", desc: "Forward / Side / Backward, aligned to natural growth" },
  { id: 9, title: "Knotting Technique at Root", desc: "V-loop / Injected / Single / Double secure knots" },
  { id: 10, title: "Bleached Knots / No Knot Visibility", desc: "Invisible roots / Lightened knots for scalp realism" },
  { id: 11, title: "Base Type", desc: "Swiss lace / PU / Hybrid / Mono / Lace front PU back" },
  { id: 12, title: "Base Colour / Scalp Tint", desc: "PU tone matched exactly to real scalp shade" },
  { id: 13, title: "Ventilation Technique", desc: "Flat / Semi-lift / Elevated, controls lift & volume" },
  { id: 14, title: "Baby Hair Addition", desc: "Short / Wispy / Slightly irregular to soften hairline edge" },
  { id: 15, title: "Clip-on / Stick-on Selection", desc: "Temporary / Semi-permanent / Lifestyle-fit for daily wear" },
  { id: 16, title: "Scalp Mold Accuracy", desc: "POP mold or digital for exact fit (not estimation)" },
  { id: 17, title: "Right Hairstyle", desc: "Based on face structure (quiff, pompadour, classic, messy)" },
  { id: 18, title: "Right Haircut", desc: "Layering, tapering, fade, texture blend into side/back" },
  { id: 19, title: "Frontal Transition Zone", desc: "Gradual / Jagged / Slightly uneven to mimic real hair" },
  { id: 20, title: "Grey Hair Percentage (if any)", desc: "Light / Scattered / Blended strands to mimic natural aging" },
  { id: 21, title: "Fade Compatibility", desc: "Side/back blending to match skin fade / temple fade" },
];

export const Checklist = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const isPausedRef = useRef<boolean>(false);
  const lastTimeRef = useRef<number>(0);
  const SPEED = 40; // px per second

  const [isPausedState, setIsPausedState] = useState(false);

  // Mobile animation refs
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const mobileAnimationRef = useRef<number>(0);
  const mobileIsPausedRef = useRef<boolean>(false);
  const mobileLastTimeRef = useRef<number>(0);
  const MOBILE_SPEED = 35;

  const animate = useCallback((timestamp: number) => {
    if (!scrollRef.current || isPausedRef.current) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }

    if (lastTimeRef.current === 0) {
      lastTimeRef.current = timestamp;
    }

    const delta = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;

    const el = scrollRef.current;
    el.scrollTop += (SPEED * delta) / 1000;

    // Seamless loop: when we've scrolled past the first copy, reset
    const halfHeight = el.scrollHeight / 2;
    if (el.scrollTop >= halfHeight) {
      el.scrollTop -= halfHeight;
    }

    animationRef.current = requestAnimationFrame(animate);
  }, []);

  const mobileAnimate = useCallback((timestamp: number) => {
    if (!mobileScrollRef.current || mobileIsPausedRef.current) {
      mobileAnimationRef.current = requestAnimationFrame(mobileAnimate);
      return;
    }
    if (mobileLastTimeRef.current === 0) mobileLastTimeRef.current = timestamp;
    const delta = timestamp - mobileLastTimeRef.current;
    mobileLastTimeRef.current = timestamp;
    const el = mobileScrollRef.current;
    el.scrollTop += (MOBILE_SPEED * delta) / 1000;
    const halfHeight = el.scrollHeight / 2;
    if (el.scrollTop >= halfHeight) el.scrollTop -= halfHeight;
    mobileAnimationRef.current = requestAnimationFrame(mobileAnimate);
  }, []);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    mobileAnimationRef.current = requestAnimationFrame(mobileAnimate);
    return () => {
        cancelAnimationFrame(animationRef.current);
        cancelAnimationFrame(mobileAnimationRef.current);
    };
  }, [animate, mobileAnimate]);

  const handleMouseEnter = () => {
    isPausedRef.current = true;
    lastTimeRef.current = 0; // reset delta so no jump on resume
    setIsPausedState(true);
  };

  const handleMouseLeave = () => {
    isPausedRef.current = false;
    setIsPausedState(false);
  };

  const handleTouchStart = () => {
    isPausedRef.current = true;
    lastTimeRef.current = 0;
    setIsPausedState(true);
  };

  const handleTouchEnd = () => {
    setTimeout(() => {
      isPausedRef.current = false;
      setIsPausedState(false);
    }, 1500);
  };

  const handleMobileTouchStart = () => {
    mobileIsPausedRef.current = true;
    mobileLastTimeRef.current = 0;
  };
  const handleMobileTouchEnd = () => {
    setTimeout(() => { mobileIsPausedRef.current = false; }, 1500);
  };

  return (
    <AnimateOnScroll variant="fadeUp">
    <>
    {/* MOBILE VERSION */}
    <section className="block lg:hidden py-[40px] bg-white">
      <div className="flex flex-col items-center px-[16px]">
        
        {/* Heading */}
        <h2 className="text-[28px] font-extrabold text-[#121212] leading-[120%] tracking-[-0.5px] self-stretch mb-[24px] text-left">
          Our 21-Point Checklist For A Perfect Hair System
        </h2>

        {/* Video — 4:5 aspect ratio */}
        <div className="w-full rounded-[16px] overflow-hidden mb-[24px]" style={{ position: 'relative', aspectRatio: '4/5' }}>
          <LazyGumletEmbed
            title="Hair patch vs system checklist video mobile"
            embedSrc="https://play.gumlet.io/embed/69d8e1c4e77eaed319101ca4?background=false&autoplay=false&loop=false&disable_player_controls=false"
            rootMargin="120px 0px"
            placeholderLabel="Video loads when in view"
          />
        </div>

        {/* Subheading */}
        <h3 className="text-[18px] font-bold text-[#121212] self-stretch mb-[16px]">
          We Custom Every Detail:
        </h3>

        {/* Checklist infinite scroll */}
        <div 
          className="w-full h-[352px] rounded-[16px] overflow-hidden relative mb-[24px]" 
          style={{ background: 'rgba(23, 105, 255, 0.05)' }}
        >
          <div 
            ref={mobileScrollRef} 
            className="p-[20px_16px] h-full overflow-y-auto" 
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} 
            onTouchStart={handleMobileTouchStart} 
            onTouchEnd={handleMobileTouchEnd} 
          >
            <div className="space-y-5"> 
              {[...checklistItems, ...checklistItems].map((item, index) => ( 
                <div key={index} className="flex gap-3 items-start"> 
                  <div 
                    className="w-6 h-6 rounded-[6px] text-white flex items-center justify-center text-[13px] font-bold flex-shrink-0 mt-[2px]" 
                    style={{ background: '#1769FF' }} 
                  > 
                    {item.id} 
                  </div> 
                  <div> 
                    <p style={{ 
                      color: '#121212', 
                      fontSize: '18px', 
                      fontWeight: 600, 
                      lineHeight: '120%', 
                      letterSpacing: '-0.1px', 
                      fontFamily: '"Proxima Nova", sans-serif'
                    }}> 
                      {item.title} 
                    </p> 
                    <p style={{ 
                      color: '#555555', 
                      fontSize: '16px', 
                      fontWeight: 400, 
                      lineHeight: '150%', 
                      letterSpacing: '-0.16px', 
                      fontFamily: '"Proxima Nova", sans-serif'
                    }}> 
                      {item.desc} 
                    </p> 
                  </div> 
                </div> 
              ))} 
            </div> 
          </div> 
          {/* Fade overlays */} 
          <div className="absolute top-0 left-0 right-0 h-8 pointer-events-none z-10" 
            style={{ background: 'linear-gradient(to bottom, rgba(23,105,255,0.05), transparent)' }} /> 
          <div className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none z-10" 
            style={{ background: 'linear-gradient(to top, rgba(23,105,255,0.05), transparent)' }} /> 
        </div> 

        {/* CTA Button */}
        <a
          href="#contact-form"
          className="w-full h-[52px] flex items-center justify-center gap-[8px] rounded-[8px] hover:opacity-90 transition-opacity"
          style={{
            background: 'linear-gradient(104deg, #4686FE 0%, #1769FF 100%)',
            boxShadow: '0px 4px 8px 0px rgba(0, 0, 0, 0.15)',
            padding: '14px 24px',
          }}
        >
          <span style={{
            color: '#FFFFFF',
            fontSize: '18px',
            fontWeight: 600,
            lineHeight: '140%',
            letterSpacing: '1px',
            textTransform: 'capitalize',
            fontFamily: '"Proxima Nova", sans-serif'
          }}>
            Discuss With A Consultant
          </span>
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none" style={{ flexShrink: 0 }}>
            <path d="M18.8 2H9.2C5.22355 2 2 5.22355 2 9.2V18.8C2 22.7765 5.22355 26 9.2 26H18.8C22.7765 26 26 22.7765 26 18.8V9.2C26 5.22355 22.7765 2 18.8 2Z" fill="white"/>
            <path fillRule="evenodd" clipRule="evenodd" d="M11.4286 10.3036C11.4286 9.85977 11.7883 9.5 12.2321 9.5H17.6964C18.1403 9.5 18.5 9.85977 18.5 10.3036V15.7678C18.5 16.2117 18.1403 16.5714 17.6964 16.5714C17.2526 16.5714 16.8929 16.2117 16.8929 15.7678V12.2436L10.8718 18.2647C10.558 18.5784 10.0492 18.5784 9.73536 18.2647C9.42155 17.9509 9.42155 17.4421 9.73536 17.1283L15.7564 11.1072H12.2321C11.7883 11.1072 11.4286 10.7474 11.4286 10.3036Z" fill="url(#paint0_linear_1069_12954)"/>
            <defs>
              <linearGradient id="paint0_linear_1069_12954" x1="9.98568" y1="7.47965" x2="20.5393" y2="10.0167" gradientUnits="userSpaceOnUse">
                <stop stopColor="#4686FE"/>
                <stop offset="1" stopColor="#1769FF"/>
              </linearGradient>
            </defs>
          </svg>
        </a>
      </div>
    </section>

    {/* DESKTOP VERSION */}
    <div className="hidden lg:block">
    <section className="py-[60px] md:py-[80px] lg:py-20 bg-white flex flex-col items-center">
      <h2 className="text-[32px] md:text-[40px] lg:text-5xl font-extrabold text-dark text-center mb-[32px] lg:mb-10 leading-tight max-w-[800px] mx-auto">
        Our 21-Point Checklist for a<br />Perfect Hair System
      </h2>

      <div className="flex flex-col lg:flex-row w-full max-w-[1440px] px-[20px] md:px-[60px] lg:px-[160px] gap-[32px] lg:gap-8">
         {/* Left: Checklist */}
         <div className="flex-1 flex flex-col w-full">
            <h3 className="text-[18px] lg:text-xl font-bold text-dark mb-4 lg:mb-6">We Custom Every Detail:</h3>
            
            {/* Outer wrapper — handles rounding and clips scrollbar */}
            <div className="bg-[#f3f6ff] rounded-2xl h-[300px] lg:h-[408px] relative overflow-hidden w-full">
               <div 
                 ref={scrollRef}
                 className={`p-6 h-full overflow-y-auto ${isPausedState ? 'cursor-grab active:cursor-grabbing' : ''}`}
                 style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                 onMouseEnter={handleMouseEnter}
                 onMouseLeave={handleMouseLeave}
                 onTouchStart={handleTouchStart}
                 onTouchEnd={handleTouchEnd}
               >
                  <div className="space-y-6">
                     {[...checklistItems, ...checklistItems].map((item, index) => (
                        <div key={index} className="flex gap-4 items-start">
                           <div className="w-6 h-6 bg-primary rounded text-white flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                              {item.id}
                           </div>
                           <div>
                              <p className="text-[16px] lg:text-lg font-bold text-dark">{item.title}</p>
                              <p className="text-[14px] lg:text-base text-dark-secondary/80">{item.desc}</p>
                           </div>
                        </div>
                     ))}
                  </div>
                  {/* Fade gradients for scroll indication */}
                  <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-[#f3f6ff] to-transparent pointer-events-none"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#f3f6ff] to-transparent pointer-events-none"></div>
               </div>
            </div>
         </div>

         {/* Right: Video */}
         <div className="w-full lg:w-[544px] rounded-2xl overflow-hidden mt-0 lg:mt-12 flex-shrink-0" style={{ position: 'relative', aspectRatio: '16/9' }}>
            <LazyGumletEmbed
              title="Hair patch vs system checklist video desktop"
              embedSrc="https://play.gumlet.io/embed/69d8e1c4246219337545fc86?background=false&autoplay=false&loop=false&disable_player_controls=false"
              rootMargin="200px 0px"
              placeholderLabel="Video loads when in view"
            />
         </div>
      </div>
    </section>
    </div>
    </>
    </AnimateOnScroll>
  );
};
