'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ArrowUpRight, ChevronDown, ChevronUp, Play } from 'lucide-react';
import { Checklist } from '@/components/homepage/Checklist';
import { ContactForm as CTA } from '@/components/homepage/ContactForm';
import { ResultsRealPeople } from '@/components/results/ResultsRealPeople';

/* ─────────────────────────────────────────────────────────────
   GLOBAL STYLES
───────────────────────────────────────────────────────────── */
const globalStyles = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(28px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.96); }
    to   { opacity: 1; transform: scale(1); }
  }
  .anim-fade-up   { animation: fadeUp  0.65s cubic-bezier(0.4,0,0.2,1) both; }
  .anim-fade-in   { animation: fadeIn  0.5s ease both; }
  .anim-scale-in  { animation: scaleIn 0.6s cubic-bezier(0.4,0,0.2,1) both; }
  .delay-100 { animation-delay: 0.1s; }
  .delay-200 { animation-delay: 0.2s; }
  .delay-300 { animation-delay: 0.3s; }
  .delay-400 { animation-delay: 0.4s; }
  .delay-500 { animation-delay: 0.5s; }
  .hp-tabs::-webkit-scrollbar  { display: none; }
`;

/*
  FONT SYSTEM — matched to SMPAbout reference:
  ─────────────────────────────────────────────
  Section headings (h1/h2): mobile 26–32px / desktop 44–56px, fontWeight 800 (font-extrabold)
  Subheadings / bold labels: 15px, fontWeight 700, color #121212
  Body / description text:   14px, fontWeight 500, color #555
  Inline bold keywords:      15px, fontWeight 700, color #121212
  Small caps / tags:         12–13px, fontWeight 500–700
*/

/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────── */
const wigsBullets = [
  {
    bold: 'Celebrity Choice:',
    text: ' We provide Bollywood stars and high-profile clients with natural-looking hair patches and seamless hairlines that restore confidence.',
  },
  {
    bold: 'Customised for You:',
    text: ' From hair density to custom sizing, our experts tailor a wide range of styles and sizes to fit your unique hair loss journey.',
  },
  {
    bold: 'Start Your Transformation:',
    text: ' Stop letting hair loss hold you back. Contact American Hairline for a consultation and get the celebrity look you\'ve always wanted.',
  },
];

const features = [
  { bold: 'ISO Certified', text: ' — The Only ISO Certified hair system company in India to Guarantee You Quality.' },
  { bold: 'Access to Educational Videos', text: ' — Our learning videos cover the essentials for a smooth start.' },
  { bold: 'Ready to Wear', text: ' — Completely Styled and Cut Ready to Wear Hair System delivered at your Doorstep.' },
  { bold: 'Customer Support', text: ' — Our dedicated team provides expert guidance and prompt assistance for you.' },
  { bold: '100% Human Hair', text: ' — We use premium Real Human Remy Hair for 100% natural-looking systems.' },
  { bold: 'Order Online', text: ' — Online ordering process makes it Easier to Order out of the Comfort of your home.' },
  { bold: 'Fully Customisable', text: ' — India\'s only brand customising all hair system specs, from density to hairline.' },
  { bold: 'Affordable', text: ' — As an online platform, we offer premium hair systems at affordable prices.' },
  { bold: 'Single Strand Implant', text: ' — Single-strand implantation mimics natural growth for total hair-parting flexibility.' },
  { bold: 'Certified by AIAO-Bar', text: ' — We are certified by American International Accreditation Organisation.' },
  { bold: 'Certified by American', text: ' — Certified by American Board of Accreditation Services for high-quality hair systems.' },
];

/* ─────────────────────────────────────────────────────────────
   useInView
───────────────────────────────────────────────────────────── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/* ─────────────────────────────────────────────────────────────
   1. HERO
───────────────────────────────────────────────────────────── */
function HeroSection() {
  const { ref, inView } = useInView(0.1);
  return (
    <section className="bg-white py-[72px] md:py-[120px] flex justify-center w-full">
      <style>{globalStyles}</style>
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <div ref={ref} className="text-center mb-[48px] md:mb-[64px]">
          {/* h1 — 32px mobile / 56px desktop, fontWeight 800 */}
          <h1 className={`text-[32px] md:text-[56px] font-extrabold text-[#121212] leading-[1.1] tracking-[-1.5px] mb-[20px] ${inView ? 'anim-fade-up' : 'opacity-0'}`}>
            Hair Patch For Men
          </h1>
          {/* Body — 14px, fontWeight 500, #555 */}
          <p className={`text-[18px] font-[500] text-[#555555] leading-[1.7] max-w-[600px] mx-auto ${inView ? 'anim-fade-up delay-200' : 'opacity-0'}`}>
            Our hair patches are specifically designed to provide the most{' '}
            <strong style={{ fontWeight: 700, color: '#121212' }}>natural-looking front hairlines,</strong>
            {' '}and are perfect for those experiencing hair loss or thinning in specific areas of the scalp. They are made of{' '}
            <strong style={{ fontWeight: 700, color: '#121212' }}>high-quality human hair</strong>
            {' '}and can be customised to match your existing hair texture, strand density, wave type, tone-for-tone density hair. They are easy to apply and remove, and can be worn during any activity, whether it's work or play.
          </p>
        </div>

        {/* Hero image card */}
        <div className={`relative w-full rounded-[20px] md:rounded-[24px] overflow-hidden bg-[#121212] h-[320px] md:h-[540px] shadow-[0px_24px_64px_0px_rgba(0,0,0,0.2)] ${inView ? 'anim-scale-in delay-300' : 'opacity-0'}`}>
          <Image
            src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-results-story-sameer-after.png"
            alt="Hair Patch For Men"
            fill
            className="object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.75)] via-[rgba(10,12,16,0.1)] to-transparent" />
        </div>

      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   2. HAIR PATCHES & WIGS
───────────────────────────────────────────────────────────── */
function HairPatchesSection() {
  const { ref, inView } = useInView();
  return (
    <section className="bg-[#F5F6F7] py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        {/* Section heading — 26px mobile / 44px desktop, fontWeight 800 */}
        <h2 className="text-[26px] md:text-[44px] font-extrabold text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[64px]">
          Hair Patches & Wigs For<br />Men In India
        </h2>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-[48px] md:gap-[64px] items-center">

          {/* Video card */}
          <div className={`relative w-full h-[260px] md:h-[400px] rounded-[16px] overflow-hidden bg-[#121212] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.12)] ${inView ? 'anim-scale-in' : 'opacity-0'}`}>
            <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-2.png" alt="Undetectable Hair System" fill className="object-cover object-center" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(23,105,255,0.65) 0%, transparent 55%)' }} />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.8)] via-transparent to-transparent" />

            <div className="absolute bottom-[24px] left-[24px]">
              <div className="inline-flex items-center gap-[6px] bg-white/10 backdrop-blur-sm px-[10px] py-[5px] rounded-[6px] border border-white/15 mb-[8px]">
                <div className="w-[8px] h-[8px] rounded-full bg-[#4686FE]" />
                {/* Small tag — 12px, 700 */}
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#fff', letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>Undetectable</span>
              </div>
              {/* Video overlay label — 15px, 700 */}
              <p style={{ fontSize: '20px', fontWeight: 700, color: '#fff', lineHeight: '1.2', margin: 0 }}>
                Hair System In
              </p>
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <button className="w-[52px] h-[52px] md:w-[64px] md:h-[64px] rounded-full flex items-center justify-center transition-transform hover:scale-110 duration-200"
                style={{ background: 'rgba(255,69,69,0.92)', boxShadow: '0 6px 24px rgba(255,69,69,0.5)' }}>
                <Play size={20} color="white" fill="white" style={{ marginLeft: 3 }} />
              </button>
            </div>
          </div>

          {/* Bullets — each in a white card */}
          <div className={`flex flex-col gap-[12px] ${inView ? 'anim-fade-up delay-200' : 'opacity-0'}`}>
            {wigsBullets.map((b, i) => (
              <div
                key={i}
                className="rounded-[12px] p-[18px] md:p-[20px]"
                style={{
                  background: '#fff',
                  boxShadow: '0 2px 12px rgba(18,18,18,0.07)',
                  border: '1px solid rgba(18,18,18,0.06)',
                }}
              >
                <p style={{ fontSize: '18px', fontWeight: 500, color: '#555555', lineHeight: '1.7', margin: 0 }}>
                  <strong style={{ fontSize: '20px', fontWeight: 700, color: '#121212' }}>{b.bold}</strong>
                  {b.text}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   3. WHY THOUSANDS CHOOSE
───────────────────────────────────────────────────────────── */
function WhyChooseSection() {
  const { ref: videoRef, inView: videoInView } = useInView(0.1);
  const { ref: gridRef, inView: gridInView } = useInView(0.1);

  return (
    <section className="bg-white py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        {/* Section heading — 26px mobile / 44px desktop, fontWeight 800 */}
        <h2 className="text-[26px] md:text-[44px] font-extrabold text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[56px]">
          Why Thousands Of Men<br />Choose American Hairline
        </h2>

        {/* Large video */}
        <div ref={videoRef} className={`relative w-full h-[260px] md:h-[480px] rounded-[20px] overflow-hidden bg-[#121212] shadow-[0px_16px_48px_0px_rgba(0,0,0,0.15)] mb-[56px] md:mb-[72px] ${videoInView ? 'anim-scale-in' : 'opacity-0'}`}>
          <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-1.png" alt="Why Choose American Hairline" fill className="object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.6)] via-transparent to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <button className="w-[60px] h-[60px] md:w-[80px] md:h-[80px] rounded-full flex items-center justify-center transition-transform hover:scale-105 duration-300"
              style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1.5px solid rgba(255,255,255,0.25)' }}>
              <Play size={24} color="white" fill="white" style={{ marginLeft: 3 }} />
            </button>
          </div>
        </div>

        {/* Feature grid — bold label: 15px/700/#121212, body: 14px/500/#555 */}
        <div ref={gridRef} className={`grid grid-cols-1 md:grid-cols-2 gap-[12px] md:gap-[14px] ${gridInView ? 'anim-fade-up' : 'opacity-0'}`}>
          {features.map((f, i) => {
            const isLastOdd = i === features.length - 1 && features.length % 2 !== 0;
            return (
              <div
                key={i}
                className={`${isLastOdd ? 'md:col-span-2 md:max-w-[50%] md:mx-auto w-full' : ''}`}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {/* White card */}
                <div
                  className="flex gap-[14px] items-start rounded-[12px] p-[18px] md:p-[20px]"
                  style={{
                    background: '#fff',
                    boxShadow: '0 2px 12px rgba(18,18,18,0.07)',
                    border: '1px solid rgba(18,18,18,0.06)',
                  }}
                >
                  {/* Blue rounded-square checkbox — aligned to bold heading line */}
                  <div className="flex-shrink-0" style={{ marginTop: '2px' }}>
                    <svg width="22" height="22" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="20" height="20" rx="5" fill="url(#feat-grad)" />
                      <path d="M5 10.5L8.5 14L15 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <defs>
                        <linearGradient id="feat-grad" x1="0" y1="0" x2="20" y2="20" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#4686FE" />
                          <stop offset="1" stopColor="#1769FF" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  {/* Bold heading on its own line, body text below */}
                  <div>
                    <p style={{ fontSize: '20px', fontWeight: 700, color: '#121212', lineHeight: '1.4', margin: '0 0 4px 0' }}>
                      {f.bold.replace(/:$/, '')}
                    </p>
                    <p style={{ fontSize: '18px', fontWeight: 500, color: '#555555', lineHeight: '1.65', margin: 0 }}>
                      {f.text.replace(/^ — /, '')}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   PAGE ROOT
───────────────────────────────────────────────────────────── */
export default function HairPatchPage() {
  return (
    <main>
      <HeroSection />
      <HairPatchesSection />
      <WhyChooseSection />
      <Checklist />
      <CTA />
      <ResultsRealPeople />
    </main>
  );
}