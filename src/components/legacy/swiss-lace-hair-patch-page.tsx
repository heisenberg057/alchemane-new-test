'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ArrowUpRight, Play } from 'lucide-react';
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

  /* Sticky panels */
  .methods-sticky-panel,
  .order-sticky-panel {
    position: sticky;
    top: 100px;
    align-self: flex-start;
  }

  /* Shared card style */
  .bullet-card-item {
    background: #fff;
    border: 1px solid rgba(18,18,18,0.08);
    border-radius: 16px;
    padding: 22px 26px;
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
  Subheadings / bold labels: 20px, fontWeight 500, color #121212
  Body / description text:   18px, fontWeight 500, color #555
*/

/* ─────────────────────────────────────────────────────────────
   TYPOGRAPHY TOKENS
───────────────────────────────────────────────────────────── */

// Body text inside cards — #121212, 18px, weight 400, 150% line-height
const cardBodyStyle: React.CSSProperties = {
  fontFamily: "'ProximaNova-Medium', 'Proxima Nova', sans-serif",
  fontSize: '18px',
  fontWeight: 400,
  color: '#121212',
  lineHeight: '150%',
  letterSpacing: '-0.16px',
  margin: 0,
};

// Bold label inside cards — same size, weight 700
const cardBoldStyle: React.CSSProperties = {
  fontFamily: "'Proxima Nova', 'ProximaNova-Medium', sans-serif",
  fontSize: '18px',
  fontWeight: 700,
  color: '#121212',
  lineHeight: '150%',
  letterSpacing: '-0.16px',
};

// Body text outside cards
const bodyTextStyle: React.CSSProperties = {
  fontFamily: "'ProximaNova-Medium', 'Proxima Nova', sans-serif",
  fontSize: '18px',
  fontWeight: 500,
  color: '#555555',
  lineHeight: '1.7',
  margin: 0,
};

const subheadingBoldStyle: React.CSSProperties = {
  fontFamily: "'ProximaNova-Medium', 'Proxima Nova', sans-serif",
  fontSize: '18px',
  fontWeight: 700,
  color: '#121212',
  lineHeight: '1.5',
};

/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────── */
const aboutBullets = [
  {
    bold: 'Ultra-Thin Transparent Base:',
    text: ' Swiss lace is one of the finest base materials available. Its ultra-thin, transparent construction blends seamlessly with your scalp, making the hairline virtually undetectable from any angle.',
  },
  {
    bold: 'Breathable & Comfortable:',
    text: ' The fine mesh construction allows excellent airflow to the scalp, making Swiss lace patches exceptionally comfortable for all-day wear — even in warm, humid climates.',
  },
  {
    bold: 'Premium Natural Look:',
    text: ' Each hair strand is individually hand-tied to the lace base, creating a completely natural appearance and movement that is indistinguishable from your own hair.',
  },
  {
    bold: 'AMERICAN HAIRLINE:',
    text: ' Our Swiss lace hair patches are crafted to the highest international standards, customised to match your exact hair colour, density, and scalp measurements.',
  },
];

const methodsBullets = [
  {
    bold: 'Glue Method:',
    text: ' Medical-grade liquid adhesive is applied to the scalp and the lace patch is positioned and pressed firmly into place. This method offers a longer-lasting, flexible hold — ideal for all lifestyles.',
  },
  {
    bold: 'Tape Method:',
    text: ' Double-sided medical tape is applied around the perimeter of the lace base for a clean, secure bond. Easy to apply and remove during maintenance visits.',
  },
  {
    bold: 'Combination Method:',
    text: ' Many clients use a combination of tape and adhesive for maximum security. Our specialists will recommend the ideal attachment method based on your scalp type and activity level.',
  },
  {
    bold: 'Aftercare:',
    text: ' We provide a complete maintenance kit and detailed instructions so you can care for your Swiss lace patch confidently between professional service sessions.',
  },
];

const features = [
  { bold: 'ISO Certified', text: 'The Only ISO Certified hair system company in India to Guarantee You Quality.' },
  { bold: 'Access to Educational Videos', text: 'Our learning videos cover the essentials for a smooth start.' },
  { bold: 'Ready to Wear', text: 'Completely Styled and Cut Ready to Wear Hair System delivered at your Doorstep.' },
  { bold: 'Customer Support', text: 'Our dedicated team provides expert guidance and prompt assistance for you.' },
  { bold: '100% Human Hair', text: 'We use premium Real Human Remy Hair for 100% natural-looking systems.' },
  { bold: 'Order Online', text: 'Online ordering process makes it Easier to Order out of the Comfort of your home.' },
  { bold: 'Fully Customisable', text: "India's only brand customising all hair system specs, from density to hairline." },
  { bold: 'Affordable', text: 'As an online platform, we offer premium hair systems at affordable prices.' },
  { bold: 'Single Strand Implant', text: 'Single-strand implantation mimics natural growth for total hair parting flexibility.' },
  { bold: 'Certified by AIAO Bio', text: 'We are certified by American International Accreditation Organisation.' },
  { bold: 'Certified by American', text: 'Certified by American Board of Accreditation Services for high-quality hair systems.' },
];

const orderSteps = [
  { n: 1, bold: 'Book Consultation:', text: ' Start by booking a free consultation with our specialists, either online or in person.' },
  { n: 2, bold: 'Talk To Us Live:', text: ' Speak directly with our hair experts who will assess your needs and recommend the perfect system.' },
  { n: 3, bold: 'Check Your Needs:', text: ' We take detailed measurements and record your hair specifications for customisation.' },
  { n: 4, bold: 'System Made:', text: ' Your custom system is crafted and quality-checked before being delivered to your door.' },
];

const faqs = [
  {
    q: 'How long does a Swiss Lace hair patch last?',
    a: 'With proper care and regular maintenance every 3–4 weeks, a Swiss lace hair patch typically lasts 3–6 months. The fine lace base is more delicate than thicker bases, so gentle handling and recommended care products significantly extend the lifespan.',
  },
  {
    q: 'Does the lace base get damaged in this process?',
    a: 'The lace base is durable when handled correctly. Using our recommended adhesives, removers, and maintenance routine protects the integrity of the lace. Avoid harsh chemicals and always use the correct removal technique to prevent any damage.',
  },
  {
    q: 'Is it necessary to shave my head to wear a Swiss lace patch?',
    a: 'A clean shave on the area being covered provides the most secure bond and the most natural-looking result with a lace base. However, our specialists will assess your individual situation during consultation and advise accordingly.',
  },
  {
    q: 'Which is more comfortable — Swiss lace or skin base?',
    a: 'Swiss lace is generally considered more breathable and comfortable, especially in warm weather, due to its fine mesh construction. Skin base offers a slightly more robust hold. The best choice depends on your lifestyle, climate, and personal preference — our specialists will guide you.',
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
          <h1
            className={`text-[#121212] leading-[1.1] tracking-[-1.5px] mb-[20px] ${inView ? 'anim-fade-up' : 'opacity-0'}`}
            style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800 }}
          >
            Swiss Lace Hair Patch
          </h1>
          <p
            className={`max-w-[580px] mx-auto ${inView ? 'anim-fade-up delay-200' : 'opacity-0'}`}
            style={{
              fontFamily: "'ProximaNova-Medium', 'Proxima Nova', sans-serif",
              fontSize: '18px',
              fontWeight: 500,
              color: '#555555',
              lineHeight: '1.7',
              margin: '0 auto',
              textAlign: 'center',
            }}
          >
            Swiss lace is one of the finest base materials for hair patches. Discover why it is the premium choice for men who want the most natural, undetectable hair system in India.
          </p>
        </div>

        <div className={`relative w-full rounded-[20px] md:rounded-[24px] overflow-hidden bg-[#0a0c10] h-[280px] md:h-[500px] shadow-[0px_24px_64px_0px_rgba(0,0,0,0.2)] ${inView ? 'anim-scale-in delay-300' : 'opacity-0'}`}>
          <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-results-story-sameer-after.png" alt="Swiss Lace Hair Patch" fill className="object-cover object-top" sizes="(max-width: 768px) 100vw, 720px" />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.88)] via-[rgba(10,12,16,0.25)] to-transparent" />
          <div className="absolute bottom-[24px] md:bottom-[40px] left-[24px] md:left-[48px]">
            <p className="text-white leading-none m-0 uppercase tracking-[0.08em]" style={{ fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 800 }}>
              SWISS LACE
            </p>
            <p className="text-white/55 uppercase mt-[4px] m-0 tracking-[0.2em]" style={{ fontSize: 'clamp(13px, 1.5vw, 18px)', fontWeight: 700 }}>
              HAIR PATCH
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   2. ABOUT SWISS LACE HAIR SYSTEMS
   White bg. Centered heading. Plain bullet list LEFT + video RIGHT.
───────────────────────────────────────────────────────────── */
function AboutSection() {
  const { ref, inView } = useInView();
  return (
    <section className="bg-white py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2
          className="text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[64px]"
          style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 800 }}
        >
          About Swiss Lace Hair Systems
        </h2>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-[32px] md:gap-[48px] items-stretch">

          {/* LEFT: single card wrapping all bullets */}
          <div
            className={`rounded-[16px] h-full ${inView ? 'anim-slide-r' : 'opacity-0'}`}
            style={{
              background: '#fff',
              boxShadow: '0 4px 24px rgba(18,18,18,0.08)',
              padding: '28px 32px',
            }}
          >
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {aboutBullets.map((b, i) => (
                <li key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span style={{ color: '#121212', fontSize: '18px', lineHeight: '150%', flexShrink: 0, marginTop: '1px' }}>•</span>
                  <p style={cardBodyStyle}>
                    <strong style={cardBoldStyle}>{b.bold}</strong>
                    {b.text}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT: video same height as card */}
          <div className={`relative w-full rounded-[16px] overflow-hidden bg-[#121212] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.12)] min-h-[280px] md:min-h-[340px] ${inView ? 'anim-slide-l delay-200' : 'opacity-0'}`}>
            <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-2.png" alt="About Swiss Lace" fill className="object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.4)] via-transparent to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <button
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
   3. METHODS OF ATTACHMENT
   Grey bg. Centered heading. Video LEFT + plain bullet list RIGHT.
───────────────────────────────────────────────────────────── */
function MethodsSection() {
  const { ref, inView } = useInView();
  return (
    <section className="bg-[#F5F6F7] py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2
          className="text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[64px]"
          style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 800 }}
        >
          Methods Of Attachment
        </h2>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-[32px] md:gap-[48px] items-stretch">

          {/* LEFT: video same height as card */}
          <div className={`relative w-full rounded-[16px] overflow-hidden bg-[#121212] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.12)] min-h-[280px] md:min-h-[340px] ${inView ? 'anim-slide-r' : 'opacity-0'}`}>
            <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-1.png" alt="Methods Of Attachment" fill className="object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.4)] via-transparent to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                className="w-[52px] h-[52px] md:w-[64px] md:h-[64px] rounded-full flex items-center justify-center transition-transform hover:scale-110 duration-200"
                style={{ background: 'rgba(255,0,0,0.9)', boxShadow: '0 6px 24px rgba(255,0,0,0.4)' }}
              >
                <Play size={20} color="white" fill="white" style={{ marginLeft: 3 }} />
              </button>
            </div>
          </div>

          {/* RIGHT: single card wrapping all bullets */}
          <div
            className={`rounded-[16px] h-full ${inView ? 'anim-slide-l delay-200' : 'opacity-0'}`}
            style={{
              background: '#fff',
              boxShadow: '0 4px 24px rgba(18,18,18,0.08)',
              padding: '28px 32px',
            }}
          >
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {methodsBullets.map((b, i) => (
                <li key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span style={{ color: '#121212', fontSize: '18px', lineHeight: '150%', flexShrink: 0, marginTop: '1px' }}>•</span>
                  <p style={cardBodyStyle}>
                    <strong style={cardBoldStyle}>{b.bold}</strong>
                    {b.text}
                  </p>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   SVG ICON
───────────────────────────────────────────────────────────── */
function CheckboxIcon() {
  return (
    <svg
      width="20" height="20" viewBox="0 0 20 20"
      fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0, marginTop: '2px' }}
    >
      <rect width="20" height="20" rx="5" fill="#1769FF" />
      <path d="M5 10.5L8.5 14L15 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────
   4. WHY THOUSANDS OF MEN CHOOSE AMERICAN HAIRLINE
   Grey bg. Full-width video + 2-col feature grid.
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

        <div
          ref={videoRef}
          className={`relative w-full h-[240px] md:h-[440px] rounded-[20px] overflow-hidden bg-[#121212] shadow-[0px_16px_48px_0px_rgba(0,0,0,0.15)] mb-[48px] md:mb-[56px] ${videoInView ? 'anim-scale-in' : 'opacity-0'}`}
        >
          <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-3.png" alt="Why Choose American Hairline" fill className="object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.55)] via-transparent to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              className="w-[60px] h-[60px] md:w-[80px] md:h-[80px] rounded-full flex items-center justify-center transition-transform hover:scale-105 duration-300"
              style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1.5px solid rgba(255,255,255,0.25)' }}
            >
              <Play size={24} color="white" fill="white" style={{ marginLeft: 3 }} />
            </button>
          </div>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
          {features.map((f, i) => (
            <div
              key={i}
              className={`flex items-start gap-[14px] bg-white rounded-[16px] p-[24px] hover:shadow-md transition-shadow duration-300 ${gridInView ? 'anim-fade-up' : 'opacity-0'}`}
              style={{ boxShadow: '0 4px 24px rgba(18,18,18,0.08)', minHeight: '100px', animationDelay: `${i * 0.05}s` }}
            >
              <CheckboxIcon />
              <p style={cardBodyStyle}>
                <strong style={cardBoldStyle}>{f.bold}</strong>
                {' – '}{f.text}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   5. HOW DO I ORDER MY HAIR SYSTEM?
   Desktop: scrolling step cards LEFT, sticky RIGHT panel (heading + video).
   Mobile:  heading + video + step list.
───────────────────────────────────────────────────────────── */
function HowToOrderSection() {
  const stepCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeStep, setActiveStep] = useState(0);
  const { ref: mobileRef, inView: mobileInView } = useInView(0.1);

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

        {/* ── DESKTOP ── */}
        <div className="hidden lg:flex gap-[56px] items-start">

          {/* LEFT: scrolling step cards + CTAs */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {orderSteps.map((step, i) => (
              <div
                key={step.n}
                ref={(el) => { stepCardRefs.current[i] = el; }}
                style={{ background: '#fff', boxShadow: '0 4px 24px rgba(18,18,18,0.08)', borderRadius: '16px', padding: '22px 26px' }}
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
                  <p style={cardBoldStyle}>{step.bold}</p>
                </div>
                <p style={cardBodyStyle}>{step.text}</p>
              </div>
            ))}

            {/* CTAs below cards */}
            <div style={{ paddingTop: '8px', display: 'flex', flexDirection: 'row', gap: '14px' }}>
              <button
                className="flex items-center justify-center gap-[8px] px-[28px] py-[14px] rounded-[10px] text-white transition-transform hover:scale-[1.01] duration-200"
                style={{ fontSize: '18px', fontWeight: 700, background: 'linear-gradient(135deg, #4686FE, #1769FF)', boxShadow: '0 8px 24px rgba(23,105,255,0.3)', border: 'none', cursor: 'pointer' }}
              >
                Book Consultation <ArrowUpRight size={16} />
              </button>
              <button
                className="flex items-center justify-center gap-[8px] px-[28px] py-[14px] rounded-[10px] text-[#1769FF] bg-white border-2 border-[#1769FF] transition-transform hover:scale-[1.01] duration-200"
                style={{ fontSize: '18px', fontWeight: 700, cursor: 'pointer' }}
              >
                Quality Check <ArrowUpRight size={16} />
              </button>
            </div>
          </div>

          {/* RIGHT sticky panel: heading + 16:9 video */}
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
            <div
              className="relative w-full rounded-[20px] overflow-hidden bg-[#0a0c10] shadow-[0px_16px_48px_0px_rgba(0,0,0,0.2)]"
              style={{ aspectRatio: '16 / 9' }}
            >
              <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-results-story-amit-after.png" alt="How To Order AHL Hair Systems" fill className="object-cover object-center" style={{ opacity: 0.45 }} />
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
                  className="w-[48px] h-[48px] rounded-full flex items-center justify-center transition-transform hover:scale-110 duration-200"
                  style={{ background: 'rgba(255,0,0,0.92)', boxShadow: '0 4px 20px rgba(255,0,0,0.4)' }}
                >
                  <Play size={18} color="white" fill="white" style={{ marginLeft: 2 }} />
                </button>
              </div>
            </div>
            <p style={{ ...bodyTextStyle, color: '#555555' }}>
              Getting your custom Swiss lace hair system is simple. Follow these steps to start your journey with American Hairline.
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

          <div
            ref={mobileRef}
            className={`relative w-full rounded-[20px] overflow-hidden bg-[#0a0c10] shadow-[0px_16px_48px_0px_rgba(0,0,0,0.2)] ${mobileInView ? 'anim-scale-in' : 'opacity-0'}`}
            style={{ aspectRatio: '16 / 9' }}
          >
            <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-results-story-amit-after.png" alt="How To Order AHL Hair Systems" fill className="object-cover object-center" style={{ opacity: 0.45 }} />
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
                className="w-[44px] h-[44px] rounded-full flex items-center justify-center transition-transform hover:scale-110 duration-200"
                style={{ background: 'rgba(255,0,0,0.92)', boxShadow: '0 4px 20px rgba(255,0,0,0.4)' }}
              >
                <Play size={16} color="white" fill="white" style={{ marginLeft: 2 }} />
              </button>
            </div>
          </div>

          <div className={`flex flex-col gap-[12px] ${mobileInView ? 'anim-fade-up' : 'opacity-0'}`}>
            {orderSteps.map((step) => (
              <div
                key={step.n}
                className="flex gap-[14px] items-start p-[20px] bg-white rounded-[12px]"
                style={{ boxShadow: '0 4px 24px rgba(18,18,18,0.08)' }}
              >
                <div
                  className="w-[32px] h-[32px] rounded-full flex items-center justify-center flex-shrink-0 text-white"
                  style={{ background: 'linear-gradient(135deg, #4686FE, #1769FF)', fontSize: '14px', fontWeight: 800 }}
                >
                  {step.n}
                </div>
                <p style={cardBodyStyle}>
                  <strong style={cardBoldStyle}>{step.bold}</strong>
                  {step.text}
                </p>
              </div>
            ))}
          </div>

          <div className={`flex flex-col sm:flex-row gap-[14px] justify-center ${mobileInView ? 'anim-fade-up delay-300' : 'opacity-0'}`}>
            <button
              className="flex items-center justify-center gap-[8px] px-[28px] py-[14px] rounded-[10px] text-white transition-transform hover:scale-[1.01] duration-200"
              style={{ fontSize: '18px', fontWeight: 700, background: 'linear-gradient(135deg, #4686FE, #1769FF)', boxShadow: '0 8px 24px rgba(23,105,255,0.3)', border: 'none', cursor: 'pointer' }}
            >
              Book Consultation <ArrowUpRight size={16} />
            </button>
            <button
              className="flex items-center justify-center gap-[8px] px-[28px] py-[14px] rounded-[10px] text-[#1769FF] font-bold border-2 border-[#1769FF] bg-white transition-transform hover:scale-[1.01] duration-200"
              style={{ fontSize: '18px', cursor: 'pointer' }}
            >
              Quality Check <ArrowUpRight size={16} />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   6. FAQ
   Grey bg. + / × icons, animated collapse, blue CTA card.
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
            {faqs.map((faq, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  key={i}
                  className="cursor-pointer"
                  style={{ borderBottom: '1px solid rgba(18,18,18,0.08)' }}
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                >
                  <div className="flex justify-between items-center py-[18px] md:py-[20px]">
                    <span style={{
                      ...bodyTextStyle,
                      fontSize: isOpen ? '20px' : '18px',
                      color: isOpen ? '#121212' : 'rgba(18,18,18,0.65)',
                      paddingRight: '16px',
                      transition: 'color 0.3s',
                    }}>
                      {faq.q}
                    </span>
                    <span style={{
                      fontSize: '22px',
                      fontWeight: 400,
                      color: 'rgba(18,18,18,0.4)',
                      flexShrink: 0,
                      lineHeight: 1,
                    }}>
                      {isOpen ? '×' : '+'}
                    </span>
                  </div>
                  <div style={{
                    display: 'grid',
                    gridTemplateRows: isOpen ? '1fr' : '0fr',
                    transition: 'grid-template-rows 0.3s ease',
                  }}>
                    <div style={{ overflow: 'hidden' }}>
                      <p style={{ ...bodyTextStyle, opacity: 0.75, paddingBottom: '20px' }}>{faq.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div
            className={`rounded-[16px] p-[28px] md:p-[36px] ${inView ? 'anim-fade-up delay-300' : 'opacity-0'}`}
            style={{ background: 'linear-gradient(135deg, #4686FE 0%, #1769FF 100%)', boxShadow: '0 12px 32px rgba(23,105,255,0.3)' }}
          >
            <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', letterSpacing: '-0.4px', marginBottom: '8px', lineHeight: '1.2' }}>
              Still have questions?
            </h3>
            <p style={{ ...bodyTextStyle, color: 'rgba(255,255,255,0.75)', marginBottom: '24px', maxWidth: '400px' }}>
              No worries, we're here to guide you. Talk to us, we will support you completely.
            </p>
            <button
              className="flex items-center gap-[8px] bg-white text-[#1769FF] px-[20px] py-[11px] rounded-[10px] transition-transform hover:scale-[1.02] duration-200"
              style={{ fontSize: '16px', fontWeight: 700, boxShadow: '0 4px 14px rgba(0,0,0,0.1)', border: 'none', cursor: 'pointer' }}
            >
              Send Queries <ArrowUpRight size={15} />
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
export default function SwissLaceHairPatchPage() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <MethodsSection />
      <WhyChooseSection />
      <HowToOrderSection />
      <FAQSection />
      <CTA />
      <ResultsRealPeople />
    </main>
  );
}