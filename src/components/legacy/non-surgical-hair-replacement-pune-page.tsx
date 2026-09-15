'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Play } from 'lucide-react';
import { Checklist } from '@/components/homepage/Checklist';
import { ContactForm as CTA } from '@/components/homepage/ContactForm';
import { ResultsRealPeople } from '@/components/results/ResultsRealPeople';

/* ─────────────────────────────────────────────────────────────
   GLOBAL ANIMATION + STICKY STYLES
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

  .order-sticky-panel {
    position: sticky;
    top: 100px;
    align-self: flex-start;
  }
  .order-card-item {
    background: #fff;
    border: 1px solid rgba(18,18,18,0.08);
    border-radius: 16px;
    padding: 22px 26px;
  }
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
const nonSurgicalBullets = [
  {
    bold: 'Instant Natural Results:',
    text: ' Our non-surgical hair replacement in Pune offers an immediate, completely natural-looking result without any surgery, scars, or recovery time.',
  },
  {
    bold: 'Fully Customised For You:',
    text: ' Every system is custom-matched to your hair colour, density, texture, and wave pattern — ensuring a perfectly natural fit for your unique hair loss situation.',
  },
  {
    bold: "Designed For Pune's Lifestyle:",
    text: " Our breathable, humidity-resistant systems are ideal for Pune's climate, keeping you comfortable and confident whether in the office, at the gym, or outdoors.",
  },
];

const hairPatchBullets = [
  {
    bold: 'Premium Hair Patches:',
    text: ' Our hair patches and wigs for men in Pune are made from 100% human hair, crafted to blend seamlessly with your existing hair for a completely undetectable result.',
  },
  {
    bold: 'Versatile Solutions:',
    text: ' We cover any area of hair loss — from receding hairlines and crown thinning to complete baldness — with solutions customised to your exact requirements.',
  },
  {
    bold: 'Expertly Handcrafted:',
    text: ' Advanced techniques ensure your bespoke hair system has a realistic hairline and a natural feel. Our experts work closely with you to design a system that perfectly complements your look.',
  },
];

const features = [
  { bold: 'ISO Certified', text: '— The Only ISO Certified hair system company in India to Guarantee You Quality.' },
  { bold: 'Access to Educational Videos', text: '— Our learning videos cover the essentials for a smooth start.' },
  { bold: 'Ready to Wear', text: '— Completely Styled and Cut Ready to Wear Hair System delivered at your Doorstep.' },
  { bold: 'Customer Support', text: '— Our dedicated team provides expert guidance and prompt assistance for you.' },
  { bold: '100% Human Hair', text: '— We use premium Real Human Remy Hair for 100% natural-looking systems.' },
  { bold: 'Order Online', text: '— Online ordering process makes it Easier to Order out of the Comfort of your home.' },
  { bold: 'Fully Customisable', text: "— Match any hairstyle from a scanning of hair system specs, from density to hairline." },
  { bold: 'Affordable', text: '— As an online platform, we offer premium hair systems at affordable prices.' },
  { bold: 'Single Strand Implant', text: '— Single-strand implantation mimics natural growth for hair-parting flexibility.' },
  { bold: 'Certified by AIAO Bio', text: '— We are certified by American International Accreditation Organisation.' },
  { bold: 'Certified by American', text: '— Certified by American Board of Accreditation Services for high-quality hair systems.' },
];

const orderSteps = [
  {
    n: 1,
    bold: 'Book Consultation:',
    text: ' Start by booking a free consultation with our Pune specialists, either online or in person.',
  },
  {
    n: 2,
    bold: 'Talk To Us Live:',
    text: ' Speak directly with our hair experts who will assess your needs and recommend the perfect system.',
  },
  {
    n: 3,
    bold: 'Check Your Needs:',
    text: ' We take detailed measurements of your scalp and record your hair specifications for customisation.',
  },
  {
    n: 4,
    bold: 'System Made:',
    text: ' Your custom system is crafted and quality-checked before being delivered directly to your door.',
  },
];

const faqs = [
  {
    q: 'What is non-surgical hair replacement in Pune?',
    a: 'Non-surgical hair replacement in Pune involves attaching a custom-made hair system to your scalp using medical-grade adhesives or clips - with no surgery, no incisions, and no downtime. The result is a completely natural-looking head of hair.',
  },
  {
    q: 'How long does a hair replacement system last in Pune?',
    a: 'With proper care and regular maintenance every 3-4 weeks, a quality hair system typically lasts 6-12 months. Premium base materials and correct use of recommended adhesives can significantly extend the lifespan.',
  },
  {
    q: 'Can I style my hair naturally?',
    a: 'Absolutely. Our 100% human hair systems can be cut, styled, coloured, and treated just like your natural hair - giving you complete freedom to achieve any look you desire.',
  },
  {
    q: 'Does AHL provide a consultation for hair replacement?',
    a: 'Yes. Every client receives a comprehensive consultation - either in person at our Pune studio or online - before we begin any customisation. We assess your hair loss, lifestyle, and preferences to find the ideal solution.',
  },
  {
    q: 'How can I maintain my regular non-surgical hair replacement system?',
    a: 'We recommend cleaning every 7-14 days, a professional re-adhesion visit every 3-4 weeks, and using our recommended care kit at home. Our team provides full guidance and video tutorials to make home maintenance easy.',
  },
  {
    q: 'How can I order my hair replacement system?',
    a: 'Book a free consultation, speak with our expert, we take your measurements and specifications, your custom system is produced, then delivered to your door. The entire process takes 3-4 weeks from consultation to delivery.',
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
   SHARED: Blue checkbox SVG — matches reference image
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
            Non Surgical Hair<br />Replacement In Pune
          </h1>
          <p
            className={`text-[#555555] leading-[1.7] max-w-[600px] mx-auto ${inView ? 'anim-fade-up delay-200' : 'opacity-0'}`}
            style={{ fontSize: '16px', fontWeight: 500 }}
          >
            You are the best Hairline providers in Pune. Our hair replacement solutions are specially designed for men in Pune to look their absolute best, restore confidence, and embrace life fully.
          </p>
        </div>

        {/* Cinematic hero card */}
        <div className={`relative w-full rounded-[20px] md:rounded-[24px] overflow-hidden bg-[#0a0c10] h-[280px] md:h-[500px] shadow-[0px_24px_64px_0px_rgba(0,0,0,0.2)] ${inView ? 'anim-scale-in delay-300' : 'opacity-0'}`}>
          <Image
            src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-results-story-sameer-after.png"
            alt="Hair Replacement In Pune"
            fill
            className="object-cover object-top"
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
              IN PUNE
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   2. NON SURGICAL HAIR REPLACEMENT IN PUNE
   Grey bg. Video left + BulletGroup right.
───────────────────────────────────────────────────────────── */
function NonSurgicalSection() {
  const { ref, inView } = useInView();
  return (
    <section className="bg-[#F5F6F7] py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2
          className="text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[64px]"
          style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 800 }}
        >
          Non Surgical Hair Replacement<br />In Pune
        </h2>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-[48px] md:gap-[64px] items-center">

          {/* Video left */}
          <div className={`relative w-full h-[260px] md:h-[400px] rounded-[16px] overflow-hidden bg-[#121212] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.12)] ${inView ? 'anim-slide-r' : 'opacity-0'}`}>
            <Image
              src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-2.png"
              alt="Non Surgical Pune"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(23,105,255,0.55) 0%, transparent 55%)' }} />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.75)] via-transparent to-transparent" />
            <div className="absolute bottom-[20px] left-[20px]">
              <div className="flex items-center gap-[6px] mb-[4px]">
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
            <BulletGroup bullets={nonSurgicalBullets} />
          </div>

        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   3. HAIR PATCH & WIGS FOR MEN IN PUNE
   White bg. BulletGroup left + video right.
───────────────────────────────────────────────────────────── */
function HairPatchSection() {
  const { ref, inView } = useInView();
  return (
    <section className="bg-white py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2
          className="text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[64px]"
          style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 800 }}
        >
          Hair Patch & Wigs For Men<br />In Pune
        </h2>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-[48px] md:gap-[64px] items-center">

          {/* BulletGroup left */}
          <div className={`${inView ? 'anim-slide-r' : 'opacity-0'}`}>
            <BulletGroup bullets={hairPatchBullets} />
          </div>

          {/* Video right */}
          <div className={`relative w-full h-[260px] md:h-[400px] rounded-[16px] overflow-hidden bg-[#121212] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.12)] ${inView ? 'anim-slide-l delay-200' : 'opacity-0'}`}>
            <Image
              src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-3.png"
              alt="Hair Patch Wigs Pune"
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
            alt="Why Choose American Hairline Pune"
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

        {/* Feature grid — blue checkbox SVG, 2-col layout */}
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
   5. CHECKLIST — imported component
───────────────────────────────────────────────────────────── */

/* ─────────────────────────────────────────────────────────────
   6. HOW DO I ORDER MY HAIR SYSTEM?
   White bg.
   Desktop: scrolling step cards LEFT, sticky RIGHT panel
            (title above 16:9 video).
   Mobile:  heading + video + step grid + CTAs stacked.
───────────────────────────────────────────────────────────── */
function HowToOrderSection() {
  const [activeStep, setActiveStep] = useState(0);
  const stepCardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    stepCardRefs.current.forEach((card, i) => {
      if (!card) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveStep(i); },
        { threshold: 0.55 }
      );
      obs.observe(card);
      observers.push(obs);
    });
    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  return (
    <section className="bg-white py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        {/* ── DESKTOP: cards LEFT, sticky RIGHT ── */}
        <div className="hidden lg:flex gap-[56px] items-start">

          {/* LEFT: scrolling step cards + CTAs */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {orderSteps.map((step, i) => (
              <div
                key={step.n}
                ref={(el) => { stepCardRefs.current[i] = el; }}
                className="order-card-item"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                  <div style={{
                    width: '30px', height: '30px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #4686FE, #1769FF)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, color: '#fff', fontSize: '13px', fontWeight: 700,
                  }}>
                    {step.n}
                  </div>
                  <p style={{ fontSize: '20px', fontWeight: 700, color: '#121212', margin: 0 }}>{step.bold}</p>
                </div>
                <p style={{ fontSize: '16px', fontWeight: 500, color: '#555555', lineHeight: '1.7', margin: 0 }}>{step.text}</p>
              </div>
            ))}

            {/* CTAs below cards */}
            <div style={{ paddingTop: '8px', display: 'flex', flexDirection: 'row', gap: '14px' }}>
              <Link
                href="/consultation-form"
                className="flex items-center justify-center gap-[8px] px-[28px] py-[14px] rounded-[10px] text-white transition-transform hover:scale-[1.01] duration-200"
                style={{ fontSize: '16px', fontWeight: 700, background: 'linear-gradient(135deg, #4686FE, #1769FF)', boxShadow: '0 8px 24px rgba(23,105,255,0.3)' }}
              >
                Book Consultation <ArrowUpRight size={16} />
              </Link>
              <Link
                href="/contact-us"
                className="flex items-center justify-center gap-[8px] px-[28px] py-[14px] rounded-[10px] text-[#1769FF] bg-white border-2 border-[#1769FF] transition-transform hover:scale-[1.01] duration-200"
                style={{ fontSize: '16px', fontWeight: 700 }}
              >
                Quality Check <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>

          {/* RIGHT sticky panel: title + 16:9 video */}
          <div
            className="order-sticky-panel"
            style={{ width: '42%', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            <h2
              className="text-[#121212] leading-[1.2] tracking-[-0.5px]"
              style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 800, margin: 0 }}
            >
              How Do I Order My<br />Hair System?
            </h2>

            {/* 16:9 video */}
            <div
              className="relative w-full rounded-[20px] overflow-hidden bg-[#0a0c10] shadow-[0px_16px_48px_0px_rgba(0,0,0,0.2)]"
              style={{ aspectRatio: '16 / 9' }}
            >
              <Image
                src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-results-story-amit-after.png"
                alt="How To Order AHL Hair Systems"
                fill
                className="object-cover object-center"
                style={{ opacity: 0.45 }}
                sizes="(max-width: 1024px) 100vw, 42vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(5,7,10,0.9)] via-[rgba(5,7,10,0.6)] to-[rgba(5,7,10,0.3)]" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-[20px] gap-[6px]">
                <p className="text-white leading-[1.1] uppercase m-0" style={{ fontSize: 'clamp(16px, 2.2vw, 28px)', fontWeight: 800 }}>
                  HOW TO ORDER <span style={{ color: '#F5C518' }}>ONLINE!</span>
                </p>
                <p className="text-white leading-[1.1] uppercase m-0" style={{ fontSize: 'clamp(13px, 1.6vw, 20px)', fontWeight: 800 }}>
                  AHL HAIR SYSTEMS!
                </p>
              </div>
              <div className="absolute inset-0 flex items-end justify-center pb-[20px] md:pb-[28px]">
                <button
                  type="button"
                  className="w-[48px] h-[48px] rounded-full flex items-center justify-center transition-transform hover:scale-110 duration-200"
                  style={{ background: 'rgba(255,0,0,0.92)', boxShadow: '0 4px 20px rgba(255,0,0,0.4)' }}
                >
                  <Play size={18} color="white" fill="white" style={{ marginLeft: 2 }} />
                </button>
              </div>
            </div>

            <p style={{ fontSize: '16px', fontWeight: 500, color: '#555555', lineHeight: '1.7', margin: 0 }}>
              Getting your custom hair system is simple. Follow these steps to start your journey with American Hairline in Pune.
            </p>
          </div>

        </div>

        {/* ── MOBILE ── */}
        <div className="flex flex-col gap-[28px] lg:hidden">

          <h2
            className="text-[#121212] leading-[1.2] tracking-[-0.5px] text-center"
            style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 800, margin: 0 }}
          >
            How Do I Order My<br />Hair System?
          </h2>

          {/* 16:9 video */}
          <div
            className="relative w-full rounded-[20px] overflow-hidden bg-[#0a0c10] shadow-[0px_16px_48px_0px_rgba(0,0,0,0.2)]"
            style={{ aspectRatio: '16 / 9' }}
          >
            <Image
              src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-results-story-amit-after.png"
              alt="How To Order AHL Hair Systems"
              fill
              className="object-cover object-center"
              style={{ opacity: 0.45 }}
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(5,7,10,0.9)] via-[rgba(5,7,10,0.6)] to-[rgba(5,7,10,0.3)]" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-[20px] gap-[6px]">
              <p className="text-white leading-[1.1] uppercase m-0" style={{ fontSize: 'clamp(16px, 4.5vw, 22px)', fontWeight: 800 }}>
                HOW TO ORDER <span style={{ color: '#F5C518' }}>ONLINE!</span>
              </p>
              <p className="text-white leading-[1.1] uppercase m-0" style={{ fontSize: 'clamp(12px, 3.5vw, 16px)', fontWeight: 800 }}>
                AHL HAIR SYSTEMS!
              </p>
            </div>
            <div className="absolute inset-0 flex items-end justify-center pb-[16px]">
              <button
                type="button"
                className="w-[44px] h-[44px] rounded-full flex items-center justify-center transition-transform hover:scale-110 duration-200"
                style={{ background: 'rgba(255,0,0,0.92)', boxShadow: '0 4px 20px rgba(255,0,0,0.4)' }}
              >
                <Play size={16} color="white" fill="white" style={{ marginLeft: 2 }} />
              </button>
            </div>
          </div>

          {/* Step cards */}
          <div className="flex flex-col gap-[12px]">
            {orderSteps.map((step) => (
              <div
                key={step.n}
                className="flex gap-[14px] items-start p-[18px] bg-[#F5F6F7] rounded-[12px]"
                style={{ border: '1px solid rgba(18,18,18,0.06)' }}
              >
                <div style={{
                  width: '30px', height: '30px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #4686FE, #1769FF)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, color: '#fff', fontSize: '13px', fontWeight: 700,
                }}>
                  {step.n}
                </div>
                <div>
                  <p style={{ fontSize: '16px', fontWeight: 700, color: '#121212', margin: '0 0 4px 0' }}>{step.bold}</p>
                  <p style={{ fontSize: '15px', fontWeight: 400, color: '#555555', lineHeight: '1.6', margin: 0 }}>{step.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-[14px] justify-center">
            <Link
              href="/consultation-form"
              className="flex items-center justify-center gap-[8px] px-[28px] py-[14px] rounded-[10px] text-white transition-transform hover:scale-[1.01] duration-200"
              style={{ fontSize: '16px', fontWeight: 700, background: 'linear-gradient(135deg, #4686FE, #1769FF)', boxShadow: '0 8px 24px rgba(23,105,255,0.3)' }}
            >
              Book Consultation <ArrowUpRight size={16} />
            </Link>
            <Link
              href="/contact-us"
              className="flex items-center justify-center gap-[8px] px-[28px] py-[14px] rounded-[10px] text-[#1769FF] bg-white border-2 border-[#1769FF] transition-transform hover:scale-[1.01] duration-200"
              style={{ fontSize: '16px', fontWeight: 700 }}
            >
              Quality Check <ArrowUpRight size={16} />
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   7. FAQ — grey bg. + / × accordion + blue CTA card.
───────────────────────────────────────────────────────────── */
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { ref, inView } = useInView();

  return (
    <section className="bg-[#F5F6F7] py-[72px] md:py-[120px] flex justify-center w-full">
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
export default function NonSurgicalHairReplacementPunePage() {
  return (
    <main>
      <HeroSection />
      <NonSurgicalSection />
      <HairPatchSection />
      <WhyChooseSection />
      <Checklist />
      <HowToOrderSection />
      <FAQSection />
      <CTA />
      <ResultsRealPeople />
    </main>
  );
}