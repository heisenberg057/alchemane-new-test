'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Play } from 'lucide-react';
import { Checklist } from '@/components/homepage/Checklist';
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
  .anim-fade-up  { animation: fadeUp     0.65s cubic-bezier(0.4,0,0.2,1) both; }
  .anim-scale-in { animation: scaleIn    0.65s cubic-bezier(0.4,0,0.2,1) both; }
  .anim-slide-r  { animation: slideRight 0.60s cubic-bezier(0.4,0,0.2,1) both; }
  .anim-slide-l  { animation: slideLeft  0.60s cubic-bezier(0.4,0,0.2,1) both; }
  .delay-100 { animation-delay: 0.10s; }
  .delay-200 { animation-delay: 0.20s; }
  .delay-300 { animation-delay: 0.30s; }
  .delay-400 { animation-delay: 0.40s; }
`;

/*
  FONT SYSTEM:
  ─────────────────────────────────────────────
  Section headings (h1/h2): existing responsive sizes, fontWeight 800
  Subheadings / bold labels: 20px, fontWeight 700, color #121212
  Body / description text:   16px, fontWeight 500, color #555
  Small caps / tags:         12px, fontWeight 700
*/

/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────── */
const customisedBullets = [
  {
    bold: 'Hair Wigs In Men In Lucknow:',
    text: ' Our manufacturer provides quality, quick and customised hair systems. Our Indian hair wigs give an excellent option. Our high-quality wigs are carefully crafted to look natural, provide comfort, and can be styled to match traditional front hair replacement methods.',
  },
  {
    bold: 'We recognise that every individual is unique,',
    text: ' and our expert team never, say ever. With our customised Hair Systems, our offers a personalised approach to hair replacement. Our experts work closely with you to design a new system that matches your hair type, colour, and preferences, ensuring a perfect fit and utmost satisfaction.',
  },
];

const clipOnBullets = [
  {
    bold: 'We believe every individual is unique,',
    text: ' and our custom-made specifically the only Hair Replacement System in Lucknow works closely with you to note your requirements and create a bespoke Clip-on Hair System.',
  },
  {
    bold: 'This customised solution is designed',
    text: ' to complement your distinct hair features while blending seamlessly with your existing hair. The result? A natural-looking, comfortable system that makes your hair system visits and feels completely authentic.',
  },
];

const faqs = [
  {
    q: 'How does the Hair Replacement System work?',
    a: 'Our Hair Replacement Systems involve attaching a custom-made base with natural hair using a safe, non-surgical method. The system is attached using adhesives or clips, giving you a natural and undetectable look.',
  },
  {
    q: 'Are Hair Systems comfortable to wear?',
    a: 'Yes! Our systems are designed for all-day comfort. They are lightweight, breathable, and custom-fitted to your scalp ensuring a secure and natural feel.',
  },
  {
    q: 'How long does a Hair System last?',
    a: 'The lifespan depends on the base material, maintenance routine, and lifestyle. On average, a well-maintained system lasts 6–12 months.',
  },
  {
    q: 'Can I style my Hair Replacement as desired?',
    a: 'Absolutely. Our hair systems use 100% human hair and can be cut, styled, and coloured just like your natural hair.',
  },
  {
    q: 'Is the Hair Replacement System suitable for all hair types?',
    a: 'Yes. We customise every system to match your natural hair texture, density, wave pattern, and colour — regardless of hair type.',
  },
  {
    q: 'Can I swim or do physical activities with a Hair System?',
    a: 'Yes, our systems are designed to stay secure during swimming and physical activities. We recommend using waterproof adhesives and proper aftercare for best results.',
  },
  {
    q: 'How often should I clean my Hair Replacement System?',
    a: 'We recommend cleaning every 7–14 days depending on activity level and adhesive type. Regular cleaning extends the life of the system significantly.',
  },
  {
    q: 'Is the adhesive used for the Hair System safe for the skin?',
    a: 'Yes. We use medical-grade, dermatologically tested adhesives that are safe for sensitive skin.',
  },
  {
    q: 'Can I swim with a Hair Replacement System?',
    a: 'Yes, with the right adhesive type and proper preparation. We advise a specific pre-swim routine to extend the life of the bond.',
  },
  {
    q: 'Do you offer consultations before providing the service?',
    a: 'Absolutely. Every client receives a personalised consultation — either in-person or online — before we proceed with any system. We want to make sure the solution is perfect for you.',
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
   SHARED: Single grouped card for bullet lists
───────────────────────────────────────────────────────────── */
function BulletGroup({ bullets }: { bullets: { bold: string; text: string }[] }) {
  return (
    <div
      className="rounded-[12px] overflow-hidden"
      style={{
        background: '#fff',
        boxShadow: '0 2px 12px rgba(18,18,18,0.07)',
        border: '1px solid rgba(18,18,18,0.06)',
      }}
    >
      {bullets.map((b, i) => (
        <div key={i} className="p-[18px] md:p-[22px]">
          <p style={{ fontSize: '16px', fontWeight: 500, color: '#555555', lineHeight: '1.7', margin: 0 }}>
            <strong style={{ fontSize: '20px', fontWeight: 700, color: '#121212' }}>{b.bold}</strong>
            {b.text}
          </p>
        </div>
      ))}
    </div>
  );
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
          <h1 className={`text-[32px] md:text-[52px] font-extrabold text-[#121212] leading-[1.1] tracking-[-1.5px] mb-[20px] ${inView ? 'anim-fade-up' : 'opacity-0'}`}>
            Hair Replacement Systems for<br />Men in Lucknow
          </h1>
          {/* Body — 16px, fontWeight 500 */}
          <p className={`text-[16px] font-[500] text-[#555555] leading-[1.7] max-w-[600px] mx-auto ${inView ? 'anim-fade-up delay-200' : 'opacity-0'}`}>
            If you're looking for the{' '}
            <strong style={{ fontWeight: 700, color: '#121212' }}>perfect hair replacement</strong>
            {' '}system for men in Lucknow, you have come to the right place. At American Hairline, we take pride in providing{' '}
            <strong style={{ fontWeight: 700, color: '#121212' }}>High-quality Hair Systems, Natural Hairline,</strong>
            {' '}and Hair Wigs specially designed for men who want to regain their confidence and achieve a stylish appearance.
          </p>
        </div>

        <div className={`relative w-full rounded-[20px] md:rounded-[24px] overflow-hidden bg-[#0a0c10] h-[280px] md:h-[500px] shadow-[0px_24px_64px_0px_rgba(0,0,0,0.2)] ${inView ? 'anim-scale-in delay-300' : 'opacity-0'}`}>
          <Image
            src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-results-story-sameer-after.png"
            alt="Hair Replacement In Lucknow"
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, min(1440px, 100vw)"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.88)] via-[rgba(10,12,16,0.25)] to-transparent" />
          <div className="absolute bottom-[24px] md:bottom-[40px] left-[24px] md:left-[48px]">
            <p className="text-white text-[22px] md:text-[36px] font-extrabold tracking-[0.08em] uppercase leading-none m-0">HAIR REPLACEMENT</p>
            <p className="text-white/55 text-[13px] md:text-[18px] font-bold tracking-[0.2em] uppercase mt-[4px] m-0">IN LUCKNOW</p>
          </div>
        </div>

      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   2. CUSTOMISED HAIR SYSTEM & HAIR WIGS IN LUCKNOW
───────────────────────────────────────────────────────────── */
function CustomisedSection() {
  const { ref, inView } = useInView();
  return (
    <section className="bg-[#F5F6F7] py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2 className="text-[26px] md:text-[44px] font-extrabold text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[64px]">
          Customized Hair System &<br />Hair Wigs In Lucknow
        </h2>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-[48px] md:gap-[64px] items-center">

          {/* Video card */}
          <div className={`relative w-full h-[260px] md:h-[400px] rounded-[16px] overflow-hidden bg-[#121212] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.12)] ${inView ? 'anim-slide-r' : 'opacity-0'}`}>
            <Image
              src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-2.png"
              alt="Customised Hair System Lucknow"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(23,105,255,0.6) 0%, transparent 55%)' }} />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.85)] via-transparent to-transparent" />
            <div className="absolute bottom-[20px] left-[20px]">
              <div className="flex items-center gap-[6px] mb-[5px]">
                <div className="w-[7px] h-[7px] rounded-full bg-[#4686FE]" />
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>Undetectable</span>
              </div>
              <p style={{ fontSize: '20px', fontWeight: 700, color: '#fff', lineHeight: '1.2', margin: 0 }}>Hair System In</p>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                type="button"
                className="w-[52px] h-[52px] md:w-[64px] md:h-[64px] rounded-full flex items-center justify-center transition-transform hover:scale-110 duration-200"
                style={{ background: 'rgba(255,69,69,0.92)', boxShadow: '0 6px 24px rgba(255,69,69,0.5)' }}
              >
                <Play size={20} color="white" fill="white" style={{ marginLeft: 3 }} />
              </button>
            </div>
          </div>

          {/* Single grouped bullet card */}
          <div className={`${inView ? 'anim-slide-l delay-200' : 'opacity-0'}`}>
            <BulletGroup bullets={customisedBullets} />
          </div>

        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   3. 21-POINT CHECKLIST — imported
───────────────────────────────────────────────────────────── */

/* ─────────────────────────────────────────────────────────────
   4. CLIP-ON HAIR SYSTEMS FOR MEN IN LUCKNOW
───────────────────────────────────────────────────────────── */
function ClipOnSection() {
  const { ref, inView } = useInView();
  return (
    <section className="bg-white py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2 className="text-[26px] md:text-[44px] font-extrabold text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[64px]">
          Clip-On Hair Systems For<br />Men In Lucknow
        </h2>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-[48px] md:gap-[64px] items-center">

          {/* Video card */}
          <div className={`relative w-full h-[260px] md:h-[400px] rounded-[16px] overflow-hidden bg-[#121212] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.12)] ${inView ? 'anim-slide-r' : 'opacity-0'}`}>
            <Image
              src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-3.png"
              alt="Clip-On Hair Systems Lucknow"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.65)] via-transparent to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                type="button"
                className="w-[52px] h-[52px] md:w-[64px] md:h-[64px] rounded-full flex items-center justify-center transition-transform hover:scale-110 duration-200"
                style={{ background: 'rgba(255,69,69,0.92)', boxShadow: '0 6px 24px rgba(255,69,69,0.5)' }}
              >
                <Play size={20} color="white" fill="white" style={{ marginLeft: 3 }} />
              </button>
            </div>
          </div>

          {/* Single grouped bullet card */}
          <div className={`${inView ? 'anim-slide-l delay-200' : 'opacity-0'}`}>
            <BulletGroup bullets={clipOnBullets} />
          </div>

        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   5. FAQ — + / × icons, first item open
───────────────────────────────────────────────────────────── */
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { ref, inView } = useInView();

  return (
    <section className="bg-[#F5F6F7] py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

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
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setOpenIndex(openIndex === i ? null : i);
                  }
                }}
                role="button"
                tabIndex={0}
              >
                <div className="flex justify-between items-center py-[18px] md:py-[20px]">
                  {/* Question — 20px, 700 */}
                  <span style={{
                    fontSize: '20px',
                    fontWeight: 700,
                    lineHeight: '1.4',
                    paddingRight: '16px',
                    transition: 'color 0.3s',
                    color: openIndex === i ? '#121212' : 'rgba(18,18,18,0.65)',
                  }}>
                    {faq.q}
                  </span>
                  <span style={{ fontSize: '20px', fontWeight: 700, color: 'rgba(18,18,18,0.4)', flexShrink: 0, userSelect: 'none', lineHeight: 1 }}>
                    {openIndex === i ? '×' : '+'}
                  </span>
                </div>
                {openIndex === i && (
                  /* Answer — 16px, 500 */
                  <p style={{ fontSize: '16px', fontWeight: 500, color: '#555555', lineHeight: '1.7', paddingBottom: '20px', margin: 0 }}>
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
            {/* CTA heading — 24px, 800 */}
            <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', letterSpacing: '-0.4px', marginBottom: '8px', lineHeight: '1.2' }}>
              Still have questions?
            </h3>
            {/* CTA body — 16px, 500 */}
            <p style={{ fontSize: '16px', fontWeight: 500, color: 'rgba(255,255,255,0.75)', lineHeight: '1.65', marginBottom: '24px', maxWidth: '420px' }}>
              No worries, we're here to guide you. Talk to us, we will support you completely.
            </p>
            <Link
              href="/contact-us"
              className="inline-flex items-center gap-[8px] bg-white text-[#1769FF] px-[20px] py-[11px] rounded-[10px] transition-transform hover:scale-[1.02] duration-200"
              style={{ fontSize: '16px', fontWeight: 700, boxShadow: '0 4px 14px rgba(0,0,0,0.1)' }}
            >
              Send Queries <ArrowUpRight size={15} />
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   PAGE ROOT
───────────────────────────────────────────────────────────── */
export default function HairReplacementSystemsLucknowPage() {
  return (
    <main>
      <HeroSection />
      <CustomisedSection />
      <Checklist />
      <ClipOnSection />
      <FAQSection />
      <CTA />
      <ResultsRealPeople />
    </main>
  );
}