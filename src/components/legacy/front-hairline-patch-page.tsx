'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ArrowUpRight, Play } from 'lucide-react';
import { ContactForm as CTA } from '@/components/homepage/ContactForm';
import { ResultsRealPeople } from '@/components/results/ResultsRealPeople';

/* ─────────────────────────────────────────────────────────────
   GLOBAL ANIMATION STYLES
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
  @keyframes slideRight {
    from { opacity: 0; transform: translateX(-24px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  @keyframes slideLeft {
    from { opacity: 0; transform: translateX(24px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  .anim-fade-up    { animation: fadeUp    0.65s cubic-bezier(0.4,0,0.2,1) both; }
  .anim-fade-in    { animation: fadeIn    0.55s ease both; }
  .anim-scale-in   { animation: scaleIn   0.65s cubic-bezier(0.4,0,0.2,1) both; }
  .anim-slide-r    { animation: slideRight 0.6s cubic-bezier(0.4,0,0.2,1) both; }
  .anim-slide-l    { animation: slideLeft  0.6s cubic-bezier(0.4,0,0.2,1) both; }
  .delay-100 { animation-delay: 0.10s; }
  .delay-200 { animation-delay: 0.20s; }
  .delay-300 { animation-delay: 0.30s; }
  .delay-400 { animation-delay: 0.40s; }
  .delay-500 { animation-delay: 0.50s; }
`;

/*
  FONT SYSTEM — matched to SMPAbout reference:
  ─────────────────────────────────────────────
  Section headings (h2):  mobile 26px / desktop 44–56px, fontWeight 800
  Subheadings / labels:   15px, fontWeight 700, color #121212
  Body / description:     14px, fontWeight 500, color #555
  Inline bold keywords:   same size as body (14px), fontWeight 700, color #121212
  Small caps / tags:      13px, fontWeight 500–700
*/

/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────── */
const naturalBullets = [
  {
    bold: 'Density & Placement:',
    text: ' Lower density and uneven placement at the front mimics natural growth and prevents a flakey look.',
  },
  {
    bold: 'Natural Hairline:',
    text: ' Matching temple angles and age-appropriate, slightly receding shapes ensure realistic appearance.',
  },
  {
    bold: 'Ultra Thin Base:',
    text: ' The base material blends seamlessly with your scalp for a flawless finish.',
  },
  {
    bold: 'Transitional Density:',
    text: ' Hand-tied with a gradual increase from single strands, our systems mirror true growing front scalp.',
  },
];

const attachmentBullets = [
  {
    bold: 'Liquid glue in the front area:',
    text: ' This method gives the most natural-looking feels, but SLIGHTLY more hold because you will brush down the front hairline and appear at the front area every 7–10 days with the help of liquid glue.',
  },
  {
    bold: 'Liquid glue + dotted tape:',
    text: ' This method gives the best results disappear to the liquid glue of dotted method, but if you prefer comfort try this lasts for 20 to 25 days, this may be the right option for you.',
  },
  {
    bold: 'For your better understanding:',
    text: ' Thick tapes last longer but look less natural. Thinner tapes or liquid glue provide a more silky appearance but require 7-10 day maintenance.',
  },
];

const faqs = [
  {
    q: 'Can I get a natural hairline clip-on hair systems?',
    a: 'Yes! Getting a natural hairline on hair systems is definitely possible. You need to choose a system with a V-looped front edge (the front-most portion of the hair system base) and keep the following in mind to maximise the conditions: natural front look. Style, Glue and clip to see the video.',
  },
  {
    q: 'Why is the life of the hair system so less?',
    a: 'The lifespan of a hair system depends on the quality of the base, the type of hair used, and how well it is maintained. Premium systems with proper care can last 6–12 months.',
  },
  {
    q: 'Can I get a natural hairline in semi customised units?',
    a: 'Yes, semi-customised units can be made with a natural hairline. Our team will work with you to find the best configuration for your face shape and desired style.',
  },
];

/* ─────────────────────────────────────────────────────────────
   useInView HOOK
───────────────────────────────────────────────────────────── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
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
          {/* h1 — matches SMPAbout desktop h2: 56px, fontWeight 800 */}
          <h1 className={`text-[32px] md:text-[56px] font-extrabold text-[#121212] leading-[1.1] tracking-[-1.5px] mb-[20px] ${inView ? 'anim-fade-up' : 'opacity-0'}`}>
            Front Hairline Patch
          </h1>
          {/* Body — 14px, fontWeight 500, #555 */}
          <p className={`text-[14px] font-[500] text-[#555555] leading-[1.7] max-w-[480px] mx-auto ${inView ? 'anim-fade-up delay-200' : 'opacity-0'}`}>
            We believe a natural front hairline is extremely important for the hair system
            to look natural.
          </p>
        </div>

        <div className={`relative w-full rounded-[20px] md:rounded-[24px] overflow-hidden bg-[#121212] h-[320px] md:h-[560px] shadow-[0px_24px_64px_0px_rgba(0,0,0,0.18)] ${inView ? 'anim-scale-in delay-300' : 'opacity-0'}`}>
          <Image
            src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-results-story-sameer-after.png"
            alt="Front Hairline Patch Before After"
            fill
            className="object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.5)] via-transparent to-transparent" />
        </div>

      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   2. WHAT MAKES IT NATURAL
───────────────────────────────────────────────────────────── */
function WhatMakesNaturalSection() {
  const { ref, inView } = useInView();
  return (
    <section className="bg-[#F5F6F7] py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        {/* Section heading — 26px mobile / 44px desktop, fontWeight 800 */}
        <h2 className="text-[26px] md:text-[44px] font-extrabold text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[64px]">
          What Makes A Front Hairline<br />Systems Look Natural?
        </h2>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-[48px] md:gap-[64px] items-center">

          {/* Video card */}
          <div className={`relative w-full h-[260px] md:h-[400px] rounded-[16px] overflow-hidden bg-[#121212] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.12)] ${inView ? 'anim-slide-r' : 'opacity-0'}`}>
            <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-2.png" alt="Front Hairline Natural" fill className="object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.65)] via-transparent to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="w-[52px] h-[52px] md:w-[64px] md:h-[64px] rounded-full flex items-center justify-center transition-transform hover:scale-110 duration-200"
                style={{ background: 'rgba(255,69,69,0.92)', boxShadow: '0 6px 24px rgba(255,69,69,0.5)' }}>
                <Play size={20} color="white" fill="white" style={{ marginLeft: 3 }} />
              </button>
            </div>
          </div>

          {/* Bullets — bold label: 15px/700/#121212, body: 14px/500/#555 */}
          <div className={`flex flex-col gap-[24px] ${inView ? 'anim-slide-l delay-200' : 'opacity-0'}`}>
            {naturalBullets.map((b, i) => (
              <p key={i} style={{ fontSize: '14px', fontWeight: 500, color: '#555555', lineHeight: '1.7', margin: 0 }}>
                <strong style={{ fontSize: '15px', fontWeight: 700, color: '#121212' }}>{b.bold}</strong>
                {b.text}
              </p>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   3. ATTACHMENT METHOD
───────────────────────────────────────────────────────────── */
function AttachmentMethodSection() {
  const { ref, inView } = useInView();
  return (
    <section className="bg-white py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        {/* Section heading — 26px mobile / 44px desktop, fontWeight 800 */}
        <h2 className="text-[26px] md:text-[44px] font-extrabold text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[64px]">
          Attachment Method
        </h2>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-[48px] md:gap-[64px] items-center">

          {/* Bullets LEFT — bold label: 15px/700/#121212, body: 14px/500/#555 */}
          <div className={`flex flex-col gap-[28px] ${inView ? 'anim-slide-r' : 'opacity-0'}`}>
            {attachmentBullets.map((b, i) => (
              <p key={i} style={{ fontSize: '14px', fontWeight: 500, color: '#555555', lineHeight: '1.7', margin: 0 }}>
                <strong style={{ fontSize: '15px', fontWeight: 700, color: '#121212' }}>{b.bold}</strong>
                {b.text}
              </p>
            ))}
          </div>

          {/* Video card RIGHT */}
          <div className={`relative w-full h-[260px] md:h-[400px] rounded-[16px] overflow-hidden bg-[#121212] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.12)] ${inView ? 'anim-slide-l delay-200' : 'opacity-0'}`}>
            <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-1.png" alt="Attachment Method" fill className="object-cover object-center" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(23,105,255,0.55) 0%, transparent 50%)' }} />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.8)] via-transparent to-transparent" />

            <div className="absolute bottom-[20px] left-[20px] right-[20px]">
              <div className="flex items-center gap-[8px] mb-[6px]">
                <div className="w-[8px] h-[8px] rounded-full bg-[#4686FE]" />
                {/* Small tag — 12px, 700 */}
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Undetectable</span>
              </div>
              {/* Video overlay label — 15px, 700 */}
              <p style={{ fontSize: '15px', fontWeight: 700, color: '#fff', lineHeight: '1.2', margin: 0 }}>
                Hair System In
              </p>
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <button className="w-[52px] h-[52px] rounded-full flex items-center justify-center transition-transform hover:scale-110 duration-200"
                style={{ background: 'rgba(255,69,69,0.92)', boxShadow: '0 6px 24px rgba(255,69,69,0.5)' }}>
                <Play size={18} color="white" fill="white" style={{ marginLeft: 2 }} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   4. NATURAL HAIR REPLACEMENT FOR MEN IN INDIA
───────────────────────────────────────────────────────────── */
function NaturalSystemSection() {
  const { ref, inView } = useInView(0.1);
  return (
    <section className="bg-[#F5F6F7] py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        {/* Section heading — 26px mobile / 44px desktop, fontWeight 800 */}
        <h2 className="text-[26px] md:text-[44px] font-extrabold text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[56px]">
          Natural Hair Replacement<br />Systems For Men In India
        </h2>

        <div
          ref={ref}
          className={`relative w-full rounded-[20px] md:rounded-[24px] overflow-hidden bg-[#0a0c10] h-[280px] md:h-[480px] shadow-[0px_16px_48px_0px_rgba(0,0,0,0.22)] ${inView ? 'anim-scale-in' : 'opacity-0'}`}
        >
          <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-results-story-amit-after.png" alt="Natural Hair Replacement" fill className="object-cover object-center" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(100deg, rgba(10,12,16,0.88) 0%, rgba(10,12,16,0.5) 50%, rgba(10,12,16,0.3) 100%)' }} />

          {/* Cinematic overlay headline — large display type, kept as-is */}
          <div className="absolute inset-0 flex items-center px-[28px] md:px-[48px]">
            <div className="max-w-[380px] md:max-w-[480px]">
              <h3 className="text-white text-[28px] md:text-[48px] font-extrabold leading-[1.05] tracking-[-1px] uppercase m-0">
                HOW TO CHOOSE<br />
                THE{' '}
                <span style={{ color: '#F5C518' }}>RIGHT</span>
                <br />
                HAIRSTYLE FOR<br />
                YOUR{' '}
                <span className="text-white/80">HAIR</span>
                <br />
                <span className="text-white/80">SYSTEM?</span>
              </h3>
            </div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <button className="w-[56px] h-[56px] md:w-[72px] md:h-[72px] rounded-full flex items-center justify-center transition-transform hover:scale-105 duration-300"
              style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1.5px solid rgba(255,255,255,0.25)' }}>
              <Play size={22} color="white" fill="white" style={{ marginLeft: 3 }} />
            </button>
          </div>

          <div className="absolute bottom-[20px] md:bottom-[32px] right-[20px] md:right-[40px]">
            <div className="flex flex-col items-end">
              {/* Small label — 12px, 700 */}
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '2px' }}>
                Achieve A
              </span>
              {/* Badge text — 15px mobile / 28px desktop, 700 */}
              <span className="text-[15px] md:text-[28px]" style={{ fontWeight: 700, color: '#F5C518', letterSpacing: '-0.3px', textTransform: 'uppercase' }}>
                NATURAL HAIRLINE
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   5. FAQ
───────────────────────────────────────────────────────────── */
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { ref, inView } = useInView();

  return (
    <section className="bg-white py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        {/* Section heading — 26px mobile / 44px desktop, fontWeight 800 */}
        <h2 className="text-[26px] md:text-[44px] font-extrabold text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[56px]">
          Frequently Asked Questions
        </h2>

        <div ref={ref} className="max-w-[760px] mx-auto">

          <div className={`flex flex-col mb-[40px] ${inView ? 'anim-fade-up' : 'opacity-0'}`}>
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="cursor-pointer"
                style={{ borderBottom: '1px solid rgba(18,18,18,0.08)' }}
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <div className="flex justify-between items-center py-[20px]">
                  {/* FAQ question — 15px, fontWeight 700, matches SMPAbout "Pros:" label style */}
                  <span style={{
                    fontSize: '15px',
                    fontWeight: 700,
                    lineHeight: '1.4',
                    paddingRight: '16px',
                    transition: 'color 0.3s',
                    color: openIndex === i ? '#121212' : 'rgba(18,18,18,0.65)',
                  }}>
                    {faq.q}
                  </span>
                  <span style={{ fontSize: '18px', fontWeight: 700, color: 'rgba(18,18,18,0.4)', flexShrink: 0, userSelect: 'none', lineHeight: 1 }}>
                    {openIndex === i ? '×' : '+'}
                  </span>
                </div>
                {openIndex === i && (
                  /* FAQ answer — 14px, fontWeight 500, matches body text */
                  <p style={{ fontSize: '14px', fontWeight: 500, color: '#555555', lineHeight: '1.7', paddingBottom: '20px', margin: 0 }}>
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Blue CTA card */}
          <div
            className={`rounded-[16px] p-[28px] md:p-[36px] ${inView ? 'anim-fade-up delay-300' : 'opacity-0'}`}
            style={{ background: 'linear-gradient(135deg, #4686FE 0%, #1769FF 100%)', boxShadow: '0 12px 32px rgba(23,105,255,0.3)' }}
          >
            {/* CTA heading — 24px, fontWeight 800, matches SMPAbout popup heading */}
            <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', letterSpacing: '-0.4px', marginBottom: '8px', lineHeight: '1.2' }}>
              Still have questions?
            </h3>
            {/* CTA body — 14px, fontWeight 500 */}
            <p style={{ fontSize: '14px', fontWeight: 500, color: 'rgba(255,255,255,0.75)', lineHeight: '1.65', marginBottom: '24px', maxWidth: '420px' }}>
              No worries, we're here to guide you. Talk to us, we will support you completely.
            </p>
            <button
              className="flex items-center gap-[8px] bg-white text-[#1769FF] px-[20px] py-[11px] rounded-[10px] transition-transform hover:scale-[1.02] duration-200"
              style={{ fontSize: '14px', fontWeight: 700, boxShadow: '0 4px 14px rgba(0,0,0,0.1)', border: 'none', cursor: 'pointer' }}
            >
              Send Queries
              <ArrowUpRight size={15} />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   PAGE ROOT
───────────────────────────────────────────────────────────── */
export default function FrontHairlinePatchPage() {
  return (
    <main>
      <HeroSection />
      <WhatMakesNaturalSection />
      <AttachmentMethodSection />
      <NaturalSystemSection />
      <FAQSection />
      <CTA />
      <ResultsRealPeople />
    </main>
  );
}