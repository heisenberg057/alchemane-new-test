  // import React from 'react';
  // import Image from 'next/image';
  // import { ArrowLeft, ArrowRight } from 'lucide-react';

  // const steps = [
  //   {
  //     step: "01",
  //     title: "Hairline Design & Consultation",
  //     desc: "We assess your face shape, age, and lifestyle before designing your ideal hairline.",
  //     image: "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-1.png"
  //   },
  //   {
  //     step: "02",
  //     title: "SMP Session",
  //     desc: "Our specialists replicate real follicles using 3H & 1H micro-needles and carbon-based ink.",
  //     image: "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-2.png"
  //   },
  //   {
  //     step: "03",
  //     title: "Build Gradually",
  //     desc: "2-3 sessions, spaced 7-10 days apart, build density layer by layer for a natural look.",
  //     image: "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-3.png"
  //   },
  //   {
  //     step: "04",
  //     title: "Final Look & Touch-Up",
  //     desc: "Instant confidence restored. Touch-ups are only needed every 18-30 months.",
  //     image: "https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-4.png"
  //   }
  // ];

  // export const SMPProcess = () => {
  //   return (
  //     <section className="bg-[#F5F6F7] py-[72px] md:py-16 pl-4 md:px-10 xl:px-[160px] overflow-hidden">
  //       <div className="max-w-[1440px] mx-auto">
  //         <h2 className="text-[26px] md:text-[42px] font-extrabold md:font-bold mb-8 md:mb-12 leading-tight pr-4">
  //           The Step-By-Step Process<br />To Fuller Look
  //         </h2>
          
  //         {/* Desktop View */}
  //         <div className="hidden lg:grid grid-cols-4 gap-6">
  //           {steps.map((item, index) => (
  //             <div key={index} className="bg-white rounded-[32px] p-6 flex flex-col h-full relative overflow-hidden group hover:shadow-lg transition-all duration-300">
  //               <div className="w-fit px-3 py-1 bg-[#0057FF] text-white text-xs font-bold rounded-full mb-4">
  //                 Step {item.step}
  //               </div>
  //               <h3 className="text-xl font-bold mb-3">{item.title}</h3>
  //               <p className="text-gray-600 text-sm mb-6 leading-relaxed">
  //                 {item.desc}
  //               </p>
  //               <div className="mt-auto relative w-full aspect-[4/3] rounded-2xl overflow-hidden">
  //                 <Image
  //                     src={item.image}
  //                     alt={item.title}
  //                     fill
  //                     className="object-cover"
  //                 />
  //               </div>
  //             </div>
  //           ))}
  //         </div>

  //         {/* Mobile/Tablet Scroll View */}
  //         <div className="lg:hidden flex overflow-x-auto gap-4 pb-8 snap-x snap-mandatory pr-4">
  //             {steps.map((item, index) => (
  //             <div key={index} className="bg-white rounded-[12px] p-6 flex flex-col min-w-[260px] w-[260px] h-[480px] relative overflow-hidden shadow-[0px_8px_24px_0px_rgba(0,0,0,0.05)] snap-center border border-[#121212]/5">
                
  //               {/* Badge */}
  //               <div className="w-fit px-3 py-1.5 bg-gradient-to-r from-[#4686FE] to-[#1769FF] text-white text-[12px] font-semibold rounded-[6px] mb-6">
  //                 Step {item.step}
  //               </div>

  //               <div className="flex flex-col gap-2 mb-4">
  //                 <h3 className="text-[20px] font-semibold leading-[24px] tracking-[-0.1px]">{item.title}</h3>
  //                 <p className="text-[#555555] text-[16px] leading-[19px] tracking-[-0.16px]">
  //                   {item.desc}
  //                 </p>
  //               </div>

  //               <div className="mt-auto relative w-full aspect-square rounded-2xl overflow-hidden -mx-6 -mb-6">
  //                 <Image
  //                     src={item.image}
  //                     alt={item.title}
  //                     fill
  //                     className="object-cover"
  //                 />
  //               </div>
  //             </div>
  //           ))}
  //         </div>
          
  //         {/* Mobile Controls */}
  //         <div className="flex lg:hidden items-center justify-center gap-3 mt-4 pr-4">
  //             <div className="w-8 h-2 bg-dark rounded-full"></div>
  //             <div className="w-2 h-2 bg-dark/20 rounded-full"></div>
  //             <div className="w-2 h-2 bg-dark/20 rounded-full"></div>
  //             <div className="w-2 h-2 bg-dark/20 rounded-full"></div>
  //             <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#4686FE] to-[#1769FF] flex items-center justify-center ml-2 shadow-lg shadow-blue-500/30">
  //               <ArrowRight className="w-5 h-5 text-white" />
  //             </div>
  //         </div>

  //         <div className="hidden lg:flex justify-end gap-4 mt-8">
  //             <button className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:bg-gray-100 transition-colors">
  //                 <ArrowLeft className="w-5 h-5 text-gray-600" />
  //             </button>
  //             <button className="w-12 h-12 rounded-full bg-[#0057FF] flex items-center justify-center hover:bg-blue-600 transition-colors">
  //                 <ArrowRight className="w-5 h-5 text-white" />
  //             </button>
  //         </div>
  //       </div>
  //     </section>
  //   );
  // };

'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { SMP_PROCESS_ASSETS } from './smpProcessAssets';
import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';

const steps = SMP_PROCESS_ASSETS;

/* ═══════════════════════════════════════════════════════════════
   DESKTOP — true sticky scroll
   - Outer section: 500vh (100vh per step + 100vh buffer)
   - Both left + right panels: position sticky, top 0, height 100vh
   - Active step derived from window.scrollY relative to section
   - No buttons, no contained scroll, pure page scroll
═══════════════════════════════════════════════════════════════ */
function DesktopSticky() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0); // 0–1 within current step

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const sectionTop    = -rect.top;                        // px scrolled into section
      const scrollable    = rect.height - window.innerHeight; // total scrollable distance
      const raw           = sectionTop / scrollable;          // 0 → 1 across whole section
      const clamped       = Math.max(0, Math.min(1, raw));

      // Map 0–1 across N steps
      const stepFloat  = clamped * steps.length;
      const stepIndex  = Math.min(Math.floor(stepFloat), steps.length - 1);
      const stepProgress = stepFloat - Math.floor(stepFloat);   // 0–1 within step

      setActiveStep(stepIndex);
      setProgress(stepProgress);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on mount
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // progress is used for the right panel progress bar

  return (
    // 400vh tall scroll canvas — gives each step ~100vh of scroll travel
    <div
      ref={sectionRef}
      className="hidden lg:block"
      style={{ height: `${steps.length * 100}vh` }}
    >
      {/* Sticky viewport — pins to screen while section is in view */}
      <div style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        display: 'flex',
        alignItems: 'stretch',
        overflow: 'hidden',
        gap: 0,
        paddingRight: 40,
        paddingTop: 0,
        paddingBottom: 0,
      }}>

        {/* ── LEFT PANEL — fully static, centred vertically ── */}
        <div style={{
          width: '42%',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 56px 0 0',
          height: '100vh',
        }}>
          <p style={{
            fontSize: 11, fontWeight: 700,
            letterSpacing: '0.18em', textTransform: 'uppercase',
            color: '#1769FF', marginBottom: 16,
          }}>
            The Process
          </p>
          <h2 style={{
            fontSize: 40, fontWeight: 800,
            lineHeight: 1.15, letterSpacing: '-0.8px',
            color: '#121212', marginBottom: 52,
          }}>
            The Step‑By‑Step<br />Process To A<br />Fuller Look
          </h2>

          {/* Step list — big number + title, both darken when reached */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {steps.map((s, i) => {
              const isActive  = i === activeStep;
              const isReached = i <= activeStep;

              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  {/* Numbered circle */}
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: isActive
                      ? 'linear-gradient(135deg,#4686FE,#1769FF)'
                      : isReached ? '#121212' : '#ECEEF0',
                    boxShadow: isActive ? '0 0 0 5px rgba(23,105,255,0.12)' : 'none',
                    transition: 'all 0.45s ease',
                  }}>
                    <span style={{
                      fontSize: 13, fontWeight: 800,
                      color: isReached ? '#fff' : 'rgba(18,18,18,0.3)',
                      transition: 'color 0.4s ease',
                      letterSpacing: '-0.02em',
                    }}>
                      {i + 1}
                    </span>
                  </div>

                  {/* Title */}
                  <p style={{
                    fontSize: 15, margin: 0,
                    fontWeight: isReached ? 600 : 400,
                    color: isReached ? '#121212' : 'rgba(18,18,18,0.28)',
                    transition: 'all 0.45s ease',
                    lineHeight: 1.35,
                  }}>
                    {s.title}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── RIGHT PANEL — cinematic crossfade ── */}
        <div style={{
          flex: 1,
          position: 'relative',
          height: '75vh',
          maxHeight: '75vh',
          alignSelf: 'center',
          borderRadius: 24,
          overflow: 'hidden',
          background: '#111',
          margin: '0',
        }}>
          {steps.map((item, i) => {
            const isActive = i === activeStep;
            const isNext   = i === activeStep + 1;
            const isPrev   = i === activeStep - 1;

            // Entering: slides up from below. Leaving: drifts up slightly.
            let opacity = 0;
            let translateY = 30;

            if (isActive) {
              opacity = 1;
              translateY = 0;
            } else if (isPrev) {
              opacity = 0;
              translateY = -20;
            } else if (isNext) {
              opacity = 0;
              translateY = 30;
            }

            return (
              <div
                key={i}
                style={{
                  position: 'absolute', inset: 0,
                  opacity,
                  transform: `translateY(${translateY}px) scale(${isActive ? 1 : 0.99})`,
                  transition: 'opacity 0.65s ease, transform 0.65s cubic-bezier(0.4,0,0.2,1)',
                  zIndex: isActive ? 2 : 1,
                  pointerEvents: isActive ? 'auto' : 'none',
                }}
              >
                <Image
                  src={item.desktop.url}
                  alt={item.desktop.alt}
                  fill
                  className="object-cover object-[center_90%]"
                  sizes="(min-width: 1024px) 58vw, 100vw"
                />
                {/* Gradient overlay */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(10,12,16,0.9) 0%, rgba(10,12,16,0.25) 50%, transparent 80%)',
                }} />

                {/* Step badge */}
                <div style={{
                  position: 'absolute', top: 28, left: 28,
                  background: 'linear-gradient(135deg,#4686FE,#1769FF)',
                  color: '#fff', fontSize: 11, fontWeight: 700,
                  padding: '6px 14px', borderRadius: 8, letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}>
                  Step {item.step}
                </div>

                {/* Progress bar at top */}
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: 'rgba(255,255,255,0.1)' }}>
                  <div style={{
                    height: '100%',
                    background: 'linear-gradient(90deg,#4686FE,#1769FF)',
                    width: isActive ? `${((activeStep + progress) / steps.length) * 100}%` : `${(activeStep / steps.length) * 100}%`,
                    transition: 'width 0.1s linear',
                    borderRadius: '0 2px 2px 0',
                  }} />
                </div>

                {/* Bottom text */}
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0,
                  padding: '0 40px 44px',
                  transform: isActive ? 'translateY(0)' : 'translateY(12px)',
                  opacity: isActive ? 1 : 0,
                  transition: 'opacity 0.55s ease 0.12s, transform 0.55s ease 0.12s',
                }}>
                  <h3 style={{
                    fontSize: 32, fontWeight: 800,
                    letterSpacing: '-0.5px', color: '#fff',
                    marginBottom: 12, lineHeight: 1.2,
                  }}>
                    {item.title}
                  </h3>
                  <p style={{
                    fontSize: 15, color: 'rgba(255,255,255,0.65)',
                    lineHeight: 1.65, margin: 0, maxWidth: 460,
                  }}>
                    {item.desc}
                  </p>
                </div>

                {/* Step counter */}
                <div style={{
                  position: 'absolute', bottom: 40, right: 36,
                  display: 'flex', alignItems: 'baseline', gap: 3,
                }}>
                  <span style={{ fontSize: 44, fontWeight: 800, color: '#fff', lineHeight: 1, opacity: 0.9 }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span style={{ fontSize: 20, color: 'rgba(255,255,255,0.28)', fontWeight: 600 }}>
                    /{steps.length}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MOBILE — vertical timeline (reference image style)
   Spine left, nodes on spine, content right, driven by scroll.
═══════════════════════════════════════════════════════════════ */
function MobileTimeline() {
  const [activeStep, setActiveStep] = useState(0);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    nodeRefs.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveStep(i); },
        { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, []);

  const spinePercent = steps.length > 1
    ? (activeStep / (steps.length - 1)) * 100
    : 0;

  return (
    <div className="lg:hidden">
      {/* Header */}
      <div style={{ marginBottom: 48 }}>
        <p style={{
          fontSize: 11, fontWeight: 700, letterSpacing: '0.18em',
          textTransform: 'uppercase', color: '#1769FF', marginBottom: 12,
        }}>
          The Process
        </p>
        <h2 style={{
          fontSize: 26, fontWeight: 800, lineHeight: 1.2,
          letterSpacing: '-0.5px', color: '#121212', margin: 0,
        }}>
          The Step‑By‑Step<br />Process To A Fuller Look
        </h2>
      </div>

      {/* Timeline */}
      <div style={{ position: 'relative' }}>
        {/* Spine track — runs between first and last node only (top:20 to bottom:20 aligns node centres) */}
        <div style={{
          position: 'absolute', left: 19, top: 20,
          width: 2, background: 'rgba(18,18,18,0.08)', borderRadius: 2,
          height: 'calc(100% - 40px)',
        }} />
        {/* Spine fill — grows from first node to last node as steps are reached */}
        <div style={{
          position: 'absolute', left: 19, top: 20,
          width: 2, borderRadius: 2,
          background: 'linear-gradient(to bottom,#4686FE,#1769FF)',
          height: `calc(${spinePercent}% * (100% - 40px) / 100)`,
          maxHeight: 'calc(100% - 40px)',
          transition: 'height 0.5s cubic-bezier(0.4,0,0.2,1)',
        }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {steps.map((item, i) => {
            const isActive = i === activeStep;
            const isDone   = i < activeStep;

            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 20,
                paddingBottom: i < steps.length - 1 ? 56 : 0,
                position: 'relative',
              }}>
                {/* Node */}
                <div
                  ref={el => { nodeRefs.current[i] = el; }}
                  style={{
                    width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1, marginTop: 2,
                    background: isActive
                      ? 'linear-gradient(135deg,#4686FE,#1769FF)'
                      : isDone ? 'rgba(23,105,255,0.12)' : '#ECEEF0',
                    border: `2px solid ${isActive || isDone ? '#1769FF' : '#D8DBDF'}`,
                    boxShadow: isActive ? '0 0 0 5px rgba(23,105,255,0.12)' : 'none',
                    transition: 'all 0.45s ease',
                  }}
                >
                  {isDone ? (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2.5 7L5.5 10L11.5 4" stroke="#1769FF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <span style={{
                      fontSize: 11, fontWeight: 800,
                      color: isActive ? '#fff' : 'rgba(18,18,18,0.3)',
                      letterSpacing: '0.04em', transition: 'color 0.3s ease',
                    }}>
                      {item.step}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div style={{ flex: 1, paddingTop: 4 }}>
                  <p style={{
                    fontSize: 11, fontWeight: 700, letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: isActive || isDone ? '#1769FF' : 'rgba(18,18,18,0.28)',
                    marginBottom: 4, transition: 'color 0.4s ease',
                  }}>
                    Step {item.step}
                  </p>
                  <h3 style={{
                    fontSize: 18, fontWeight: 700, letterSpacing: '-0.3px', lineHeight: 1.3,
                    color: isActive || isDone ? '#121212' : 'rgba(18,18,18,0.32)',
                    marginBottom: 8, transition: 'color 0.4s ease',
                  }}>
                    {item.title}
                  </h3>
                  <p style={{
                    fontSize: 14, color: isActive || isDone ? 'rgba(18,18,18,0.58)' : 'rgba(18,18,18,0.25)',
                    lineHeight: 1.65, marginBottom: 14, transition: 'color 0.4s ease',
                  }}>
                    {item.desc}
                  </p>
                  {/* Image */}
                  <div style={{
                    position: 'relative', width: '100%', aspectRatio: '16/9',
                    borderRadius: 12, overflow: 'hidden',
                    opacity: isActive || isDone ? 1 : 0.2,
                    transform: 'scale(1)',
                    boxShadow: isActive ? '0 10px 32px rgba(23,105,255,0.13)' : '0 2px 10px rgba(0,0,0,0.06)',
                    border: `2px solid ${isActive ? 'rgba(23,105,255,0.3)' : 'transparent'}`,
                    transition: 'all 0.5s cubic-bezier(0.4,0,0.2,1)',
                  }}>
                    <Image
                      src={item.mobile.url}
                      alt={item.mobile.alt}
                      fill
                      className="object-cover object-[center_73%]"
                      sizes="(max-width: 1023px) calc(100vw - 60px), 100vw"
                    />
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: isActive || isDone
                        ? 'linear-gradient(to top,rgba(10,12,16,0.3) 0%,transparent 60%)'
                        : 'rgba(245,246,247,0.35)',
                      transition: 'all 0.5s ease',
                    }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export const SMPProcess = () => (
  <AnimateOnScroll variant="fadeUp">
  <section className="bg-[#F5F6F7] px-4 md:px-10 xl:px-[160px]">
    <div className="max-w-[1440px] mx-auto">
      {/* Desktop: no extra padding — the sticky section handles its own height */}
      <DesktopSticky />
      {/* Mobile: normal section padding */}
      <div className="lg:hidden py-[72px]">
        <MobileTimeline />
      </div>
    </div>
  </section>
  </AnimateOnScroll>
);