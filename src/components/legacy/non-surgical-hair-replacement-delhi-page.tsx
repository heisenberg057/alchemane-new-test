'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Play } from 'lucide-react';
import { Checklist } from '@/components/homepage/Checklist';
import { ContactForm as CTA } from '@/components/homepage/ContactForm';
import { ResultsRealPeople } from '@/components/results/ResultsRealPeople';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import { delhiSchema } from '@/config/page-schemas';

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
  Section headings (h1/h2): clamp sizes, fontWeight 800
  Subheadings / bold labels: 20px, fontWeight 700, color #121212
  Body / description text:   16px, fontWeight 500, color #555
  Small caps / tags:         12px, fontWeight 700
*/

/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────── */
const hairPatchBullets = [
  {
    bold: 'Natural Hair Concealment:',
    text: ' Our customised, low-density systems and natural patches help regain your hair and self-esteem, creating a seamless, completely undetectable appearance.',
  },
  {
    bold: 'Customised For You:',
    text: ' From hair density to custom sizing, our experts tailor a wide range of styles and sizes to fit your unique hair loss journey and lifestyle.',
  },
  {
    bold: 'Premium Patches:',
    text: ' High-quality human hair patches custom-matched to your colour and texture, ensuring a natural look that lasts. Contact American Hairline today to start your transformation.',
  },
];

const secretBullets = [
  {
    bold: 'Density & Placement:',
    text: ' Lower density and uneven placement at the front mimics natural growth and prevents a fake look.',
  },
  {
    bold: 'Natural Hairline:',
    text: ' Matching temple angles and age-appropriate, slightly receding shapes ensure a realistic appearance.',
  },
  {
    bold: 'Ultra Thin Base:',
    text: ' The base material blends seamlessly with your scalp for a completely flawless finish.',
  },
  {
    bold: 'Transitional Density:',
    text: ' Hand-tied with a gradual increase from single strands, our systems mirror true growing front scalp.',
  },
];

const features = [
  { bold: 'ISO Certified', text: '— The Only ISO Certified hair system company in India to Guarantee You Quality.' },
  { bold: 'Access to Educational Videos', text: '— Our learning videos cover the essentials for a smooth start.' },
  { bold: 'Ready to Wear', text: '— Completely Styled and Cut Ready to Wear Hair System delivered at your Doorstep.' },
  { bold: 'Customer Support', text: '— Our dedicated team provides expert guidance and prompt assistance for you.' },
  { bold: '100% Human Hair', text: '— We use premium Real Human Remy Hair for 100% natural-looking systems.' },
  { bold: 'Order Online', text: '— Online ordering process makes it Easier to Order out of the Comfort of your home.' },
  { bold: 'Fully Customisable', text: "— India's only brand customising all hair system specs, from density to hairline." },
  { bold: 'Affordable', text: '— As an online platform, we offer premium hair systems at affordable prices.' },
  { bold: 'Single Strand Implant', text: '— Single-strand implantation mimics natural growth for hair-parting flexibility.' },
  { bold: 'Certified by AIAO-Bar', text: '— We are certified by American International Accreditation Organisation.' },
  { bold: 'Certified by American', text: '— Certified by American Board of Accreditation Services for high-quality hair systems.' },
];

const faqs = [
  {
    q: 'What is non-surgical hair replacement?',
    a: 'Non-surgical hair replacement involves attaching a custom-made hair system to your scalp using medical-grade adhesives or clips - no incisions, no anaesthesia, no downtime. It gives a completely natural and undetectable appearance.',
  },
  {
    q: 'Is the non-surgical Hair replacement system durable?',
    a: 'Yes. With proper care and regular maintenance, our premium hair systems can last 6-12 months. The durability depends on the base material, adhesive type, and how frequently you maintain the system.',
  },
  {
    q: 'How long does a Hair replacement system last?',
    a: 'A well-maintained system typically lasts 6-12 months. We also offer maintenance packages to help extend the life of your system.',
  },
  {
    q: 'Is it possible to style the Hair replacement system?',
    a: 'Absolutely. Our systems use 100% human hair and can be cut, styled, coloured, and treated just like your natural hair - giving you complete styling freedom.',
  },
  {
    q: 'How much does it cost for hair replacement system?',
    a: 'Costs vary based on the type of system, level of customisation, and maintenance requirements. We offer packages to suit a range of budgets. Contact us for a personalised quote.',
  },
  {
    q: 'Does it affect health in any manner?',
    a: 'No. When applied and maintained correctly using recommended medical-grade products, our systems are completely safe with no known health risks or side effects.',
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
   SHARED: Blue checkbox SVG — matches reference image exactly
───────────────────────────────────────────────────────────── */
function CheckboxIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
    >
      <rect width="20" height="20" rx="5" fill="#1769FF" />
      <path
        d="M5 10.5L8.5 14L15 7"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   SHARED: BulletGroup card
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
   1. HERO — plain centred text, no card wrapper
───────────────────────────────────────────────────────────── */
function HeroSection() {
  const { ref, inView } = useInView(0.1);
  return (
    <section className="bg-white py-[72px] md:py-[120px] flex justify-center w-full">
      <style>{globalStyles}</style>
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <div ref={ref} className="text-center mb-[48px] md:mb-[64px]">
          <h1
            className={`text-[32px] md:text-[52px] text-[#121212] leading-[1.1] tracking-[-1.5px] mb-[20px] ${inView ? 'anim-fade-up' : 'opacity-0'}`}
            style={{ fontWeight: 800 }}
          >
            Non Surgical Hair Replacement<br />For Men In Delhi
          </h1>
          <p
            className={`text-[#555555] leading-[1.7] max-w-[600px] mx-auto ${inView ? 'anim-fade-up delay-200' : 'opacity-0'}`}
            style={{ fontSize: '16px', fontWeight: 500 }}
          >
            You are the best provider of quality hair systems and other solutions in Delhi. We understand the{' '}
            <strong style={{ fontWeight: 700, color: '#121212' }}>financial burden</strong>
            {' '}of non-surgical hair replacement in Delhi. That is why we offer a wide range of hair replacement solutions to help you find the best one for you.
          </p>
        </div>

        {/* Cinematic hero card */}
        <div className={`relative w-full rounded-[20px] md:rounded-[24px] overflow-hidden bg-[#0a0c10] h-[280px] md:h-[500px] shadow-[0px_24px_64px_0px_rgba(0,0,0,0.2)] ${inView ? 'anim-scale-in delay-300' : 'opacity-0'}`}>
          <Image
            src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-results-story-sameer-after.png"
            alt="Hair Replacement In Delhi"
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, min(1440px, 100vw)"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.88)] via-[rgba(10,12,16,0.25)] to-transparent" />
          <div className="absolute bottom-[24px] md:bottom-[40px] left-[24px] md:left-[48px]">
            <p
              className="text-white leading-none m-0 uppercase tracking-[0.08em]"
              style={{ fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 800 }}
            >
              HAIR REPLACEMENT
            </p>
            <p
              className="text-white/55 uppercase mt-[4px] m-0 tracking-[0.2em]"
              style={{ fontSize: 'clamp(13px, 1.5vw, 18px)', fontWeight: 700 }}
            >
              IN DELHI
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   2. HAIR PATCH & WIGS FOR MEN IN DELHI
   Grey bg. Video left + BulletGroup right.
───────────────────────────────────────────────────────────── */
function HairPatchSection() {
  const { ref, inView } = useInView();
  return (
    <section className="bg-[#F5F6F7] py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2
          className="text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[64px]"
          style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 800 }}
        >
          Hair Patch & Wigs For Men<br />In Delhi
        </h2>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-[48px] md:gap-[64px] items-center">

          {/* Branded video left */}
          <div className={`relative w-full h-[260px] md:h-[400px] rounded-[16px] overflow-hidden bg-[#121212] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.12)] ${inView ? 'anim-slide-r' : 'opacity-0'}`}>
            <Image
              src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-2.png"
              alt="Hair Patch Wigs Delhi"
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
                style={{ background: 'rgba(255,0,0,0.9)', boxShadow: '0 6px 24px rgba(255,0,0,0.4)' }}
              >
                <Play size={20} color="white" fill="white" style={{ marginLeft: 3 }} />
              </button>
            </div>
          </div>

          {/* BulletGroup right */}
          <div className={`${inView ? 'anim-slide-l delay-200' : 'opacity-0'}`}>
            <BulletGroup bullets={hairPatchBullets} />
          </div>

        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   3. SECRET TO NATURAL LOOKING HAIR
   White bg. Intro card + BulletGroup left. Video right.
───────────────────────────────────────────────────────────── */
function SecretSection() {
  const { ref, inView } = useInView();
  return (
    <section className="bg-white py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2
          className="text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[64px]"
          style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 800 }}
        >
          Secret To Natural Looking Hair
        </h2>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-[48px] md:gap-[64px] items-center">

          {/* Left: intro card + BulletGroup */}
          <div className={`flex flex-col gap-[16px] ${inView ? 'anim-slide-r' : 'opacity-0'}`}>
            <div
              className="rounded-[12px] overflow-hidden"
              style={{ background: '#fff', boxShadow: '0 2px 12px rgba(18,18,18,0.07)', border: '1px solid rgba(18,18,18,0.06)' }}
            >
              <div className="p-[18px] md:p-[22px]">
                <p style={{ fontSize: '16px', fontWeight: 500, color: '#555555', lineHeight: '1.7', margin: 0 }}>
                  Achieving a natural look with your hair system requires careful attention to detail. Here are the key factors that make the difference between a natural-looking result and one that does not fool anyone.
                </p>
              </div>
            </div>
            <BulletGroup bullets={secretBullets} />
          </div>

          {/* Video right */}
          <div className={`relative w-full h-[260px] md:h-[420px] rounded-[16px] overflow-hidden bg-[#121212] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.12)] ${inView ? 'anim-slide-l delay-200' : 'opacity-0'}`}>
            <Image
              src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-3.png"
              alt="Secret Natural Looking Hair"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.65)] via-transparent to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                type="button"
                className="w-[52px] h-[52px] md:w-[64px] md:h-[64px] rounded-full flex items-center justify-center transition-transform hover:scale-110 duration-200"
                style={{ background: 'rgba(255,0,0,0.9)', boxShadow: '0 6px 24px rgba(255,0,0,0.4)' }}
              >
                <Play size={20} color="white" fill="white" style={{ marginLeft: 3 }} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   4. WHY THOUSANDS OF MEN CHOOSE AMERICAN HAIRLINE
   Grey bg. Large video + 2-col feature grid with blue checkbox SVGs.
───────────────────────────────────────────────────────────── */
function WhyChooseSection() {
  const { ref: videoRef, inView: videoInView } = useInView(0.1);
  const { ref: gridRef, inView: gridInView } = useInView(0.1);

  return (
    <section className="bg-[#F5F6F7] py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2
          className="text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[56px]"
          style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 800 }}
        >
          Why Thousands Of Men<br />Choose American Hairline
        </h2>

        {/* Large video */}
        <div
          ref={videoRef}
          className={`relative w-full h-[240px] md:h-[440px] rounded-[20px] overflow-hidden bg-[#121212] shadow-[0px_16px_48px_0px_rgba(0,0,0,0.15)] mb-[48px] md:mb-[56px] ${videoInView ? 'anim-scale-in' : 'opacity-0'}`}
        >
          <Image
            src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-1.png"
            alt="Why Choose American Hairline Delhi"
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, min(1440px, 100vw)"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.55)] via-transparent to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              type="button"
              className="w-[60px] h-[60px] md:w-[80px] md:h-[80px] rounded-full flex items-center justify-center transition-transform hover:scale-105 duration-300"
              style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1.5px solid rgba(255,255,255,0.25)' }}
            >
              <Play size={24} color="white" fill="white" style={{ marginLeft: 3 }} />
            </button>
          </div>
        </div>

        {/* Feature grid — blue checkbox SVG icon, 2-col layout matching reference */}
        <div
          ref={gridRef}
          className={`grid grid-cols-1 md:grid-cols-2 gap-[12px] md:gap-[14px] ${gridInView ? 'anim-fade-up' : 'opacity-0'}`}
        >
          {features.map((f, i) => (
            <div
              key={i}
              className="flex gap-[12px] items-start p-[16px] md:p-[18px] bg-white rounded-[12px]"
              style={{
                border: '1px solid rgba(18,18,18,0.06)',
                boxShadow: '0 1px 6px rgba(0,0,0,0.04)',
                animationDelay: `${i * 0.04}s`,
              }}
            >
              <div className="mt-[2px]">
                <CheckboxIcon />
              </div>
              <p style={{ fontSize: '15px', fontWeight: 400, color: '#444444', lineHeight: '1.6', margin: 0 }}>
                <strong style={{ fontWeight: 700, color: '#121212' }}>{f.bold}</strong>
                {' '}{f.text}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   6. FAQ — white bg. + / × accordion + blue CTA card.
───────────────────────────────────────────────────────────── */
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { ref, inView } = useInView();

  return (
    <section className="bg-white py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2
          className="text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[56px]"
          style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 800 }}
        >
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
                  <span style={{ fontSize: '22px', fontWeight: 400, color: 'rgba(18,18,18,0.4)', flexShrink: 0, lineHeight: 1 }}>
                    {openIndex === i ? '×' : '+'}
                  </span>
                </div>
                {openIndex === i && (
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
            <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', letterSpacing: '-0.4px', marginBottom: '8px', lineHeight: '1.2' }}>
              Still have questions?
            </h3>
            <p style={{ fontSize: '16px', fontWeight: 500, color: 'rgba(255,255,255,0.75)', lineHeight: '1.65', marginBottom: '24px', maxWidth: '400px' }}>
              No worries, we are here to guide you. Talk to us, we will support you completely.
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
export default function NonSurgicalHairReplacementDelhiPage() {
  return (
    <main>
      <SchemaMarkup schema={delhiSchema as any} />
      <HeroSection />
      <HairPatchSection />
      <SecretSection />
      <WhyChooseSection />
      <Checklist />
      <FAQSection />
      <CTA />
      <ResultsRealPeople />
    </main>
  );
}
