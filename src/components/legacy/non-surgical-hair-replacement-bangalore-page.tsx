'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ArrowUpRight, Play } from 'lucide-react';
import { Checklist } from '@/components/homepage/Checklist';
import { ContactForm as CTA } from '@/components/homepage/ContactForm';
import { ResultsRealPeople } from '@/components/results/ResultsRealPeople';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import { bangaloreSchema } from '@/config/page-schemas';

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
  Body / description text:   18px, fontWeight 500, color #555
  Small caps / tags:         12px, fontWeight 700
*/

/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────── */
const hairLossBullets = [
  {
    bold: 'Genetic Predisposition:',
    text: ' Hereditary androgenetic alopecia accounts for the vast majority of hair loss cases in Bangalore. If baldness runs in your family, early non-surgical intervention can make a significant difference.',
  },
  {
    bold: 'Hard Water:',
    text: ' Bangalore is known for its hard water supply. The high mineral content weakens hair follicles over time, leading to increased breakage, dryness, and progressive thinning.',
  },
  {
    bold: 'Stress & Tech Lifestyle:',
    text: ' Bangalore\'s fast-paced IT and startup culture creates high levels of chronic stress — one of the most common triggers for accelerated hair loss in men under 40.',
  },
  {
    bold: 'Environmental Factors:',
    text: ' Urban pollution, heat, and humidity in Bangalore can damage the scalp environment, weakening the hair growth cycle and leading to premature thinning.',
  },
];

const hairPatchBullets = [
  {
    bold: 'Complete Coverage:',
    text: ' Our hair patches provide seamless, natural-looking coverage for any level of hair loss — from minor thinning to complete baldness — completely undetectable in Bangalore\'s social and professional settings.',
  },
  {
    bold: 'Customised For You:',
    text: ' Every system is individually tailored to match your exact hair colour, density, wave pattern, and scalp size — ensuring a perfectly natural fit every time.',
  },
  {
    bold: 'Designed For Bangalore:',
    text: ' Our systems use breathable, humidity-resistant materials and adhesives that hold strong in Bangalore\'s climate — keeping you confident from morning meetings to evening events.',
  },
];

const features = [
  { bold: 'ISO Certified', text: 'The Only ISO Certified hair system company in India to Guarantee You Quality.' },
  { bold: 'Ready to Wear', text: 'Completely Styled and Cut Ready to Wear Hair System delivered at your Doorstep.' },
  { bold: '100% Human Hair', text: 'We use premium Real Human Remy Hair for 100% natural-looking systems.' },
  { bold: 'Fully Customisable', text: 'Match any hairstyle from a scanning of hair system specs, from density to hairline.' },
  { bold: 'Single Strand Implant', text: 'Single-strand implantation mimics natural growth for hair matching Nordic density.' },
  { bold: 'Certified by Amazon', text: 'Certified by American Board of Accreditation Services for high-quality hair systems.' },
  { bold: 'Access to Educational Videos', text: 'Our learning videos cover the essentials for a smooth start.' },
  { bold: 'Customer Support', text: 'Our dedicated team provides expert guidance and prompt assistance for you.' },
  { bold: 'Order Online', text: 'Online ordering process makes it Easier to Order out of the Comfort of your home.' },
  { bold: 'Affordable', text: 'As an online platform, we offer premium hair systems at affordable prices.' },
  { bold: 'Certified by AIAO Bio', text: 'We are certified by American International Accreditation Organisation.' },
];

const secretBullets = [
  {
    bold: 'Density & Placement:',
    text: ' Lower density and uneven placement at the front mimics natural growth and prevents a flakey, artificial look.',
  },
  {
    bold: 'Natural Hairline:',
    text: ' Matching temple angles and age-appropriate, slightly receding shapes ensure a completely realistic appearance.',
  },
  {
    bold: 'Ultra Thin Base:',
    text: ' The base material blends seamlessly with your scalp for a flawless, skin-like finish.',
  },
  {
    bold: 'Transitional Density:',
    text: ' Hand-tied with a gradual increase from single strands, our systems mirror true growing front scalp density.',
  },
];

const servicesAccordion = [
  {
    title: 'Hair Patch Replacement Services In Bangalore',
    desc: 'Our primary service — custom hair patches fitted by our certified Bangalore specialists. Each patch is designed to perfectly match your natural hair for a completely undetectable result.',
  },
  {
    title: 'Style Your Replacement',
    desc: 'Post-fitting, our expert stylists cut, colour, and style your system to complement your facial features and personal aesthetic preferences perfectly.',
  },
  {
    title: 'Hair Wig Replacement',
    desc: 'For those seeking full coverage, our complete hair wig systems provide a 360-degree natural solution with a custom hairline and density profile tailored to your face shape.',
  },
];

const faqs = [
  {
    q: 'What is the non-surgical hair replacement?',
    a: 'Non-surgical hair replacement involves attaching a custom-made hair system to your scalp using medical-grade adhesives or clips — no surgery, no incisions, no downtime. The result is a completely natural-looking head of hair.',
  },
  {
    q: 'How much does it cost in Bangalore?',
    a: 'Costs vary based on the type of system, customisation level, and maintenance package. We offer a range of packages to suit different budgets across Bangalore. Contact us for a personalised quote.',
  },
  {
    q: 'How long does a hair replacement system last?',
    a: 'With proper care and regular maintenance every 3–4 weeks, a high-quality hair system typically lasts 6–12 months. Premium base materials significantly extend the lifespan.',
  },
  {
    q: 'How is it different from hair transplant in Bangalore?',
    a: 'Hair transplant is a surgical procedure with significant cost, recovery time, and variable results. Non-surgical hair replacement is immediate, completely reversible, and a fraction of the cost.',
  },
  {
    q: 'How much does non-surgical hair replacement cost in Bangalore?',
    a: 'Our systems are priced competitively to offer premium quality at accessible costs. We offer multiple packages — from standard to fully customised systems — to suit every budget in Bangalore.',
  },
  {
    q: 'How do you know the best non-surgical hair replacement options?',
    a: 'Book a free consultation with our Bangalore team. Our specialists assess your hair loss, lifestyle, and budget to recommend the single best option for your unique situation.',
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
   SHARED: White bullet card
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
        <div
          key={i}
          className="p-[18px] md:p-[22px]"
          style={{}}
        >
          <p style={{ fontSize: '14px', fontWeight: 500, color: '#555555', lineHeight: '1.7', margin: 0 }}>
            <strong style={{ fontSize: '16px', fontWeight: 700, color: '#121212' }}>{b.bold}</strong>
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
          {/* h1 — 32px/52px, fontWeight 800 */}
          <h1 className={`text-[32px] md:text-[52px] font-extrabold text-[#121212] leading-[1.1] tracking-[-1.5px] mb-[20px] ${inView ? 'anim-fade-up' : 'opacity-0'}`}>
            Hair Replacement For<br />Men In Bangalore
          </h1>
          {/* Body — 18px, fontWeight 500 */}
          <p className={`text-[18px] font-[500] text-[#555555] leading-[1.7] max-w-[600px] mx-auto ${inView ? 'anim-fade-up delay-200' : 'opacity-0'}`}>
            Are you looking for the best hair replacement for men in Bangalore? You have come to the right place. At American Hairline, we take pride in providing{' '}
            <strong style={{ fontWeight: 700, color: '#121212' }}>high-quality Hair Systems, Natural Hairlines,</strong>
            {' '}and Hair Wigs specially designed for men who want to regain their confidence.
          </p>
        </div>

        {/* Cinematic hero card */}
        <div className={`relative w-full rounded-[20px] md:rounded-[24px] overflow-hidden bg-[#0a0c10] h-[280px] md:h-[500px] shadow-[0px_24px_64px_0px_rgba(0,0,0,0.2)] ${inView ? 'anim-scale-in delay-300' : 'opacity-0'}`}>
          <Image
            src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-results-story-sameer-after.png"
            alt="Hair Replacement In Bangalore"
            fill
            sizes="(max-width: 768px) 100vw, min(1120px, 90vw)"
            className="object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.88)] via-[rgba(10,12,16,0.25)] to-transparent" />
          <div className="absolute bottom-[24px] md:bottom-[40px] left-[24px] md:left-[48px]">
            <p className="text-white text-[22px] md:text-[36px] font-extrabold tracking-[0.08em] uppercase leading-none m-0">
              HAIR REPLACEMENT
            </p>
            <p className="text-white/55 text-[13px] md:text-[18px] font-bold tracking-[0.2em] uppercase mt-[4px] m-0">
              IN BANGALORE
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   2. HIGHEST NO OF MEN WITH HAIR LOSS IN BANGALORE, WHY?
───────────────────────────────────────────────────────────── */
function HairLossSection() {
  const { ref, inView } = useInView();
  return (
    <section className="bg-[#F5F6F7] py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2 className="text-[26px] md:text-[44px] font-extrabold text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[64px]">
          Highest No Of Men With Hair Loss<br />In Bangalore, Why?
        </h2>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-[48px] md:gap-[64px] items-center">

          {/* Branded dark video */}
          <div className={`relative w-full h-[280px] md:h-[420px] rounded-[16px] overflow-hidden bg-[#0a0c10] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.15)] ${inView ? 'anim-slide-r' : 'opacity-0'}`}>
            <Image
              src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-2.png"
              alt="Bangalore Hair Loss Why"
              fill
              sizes="(max-width: 768px) 100vw, min(1120px, 90vw)"
              className="object-cover object-center"
              style={{ opacity: 0.4 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(5,7,10,0.92)] via-[rgba(5,7,10,0.6)] to-[rgba(5,7,10,0.25)]" />
            <div className="absolute inset-0 flex flex-col items-start justify-center px-[24px] md:px-[32px] gap-[4px]">
              <p className="text-[#4686FE] text-[20px] md:text-[28px] font-extrabold leading-[1.1] tracking-[-0.3px] uppercase m-0">BANGALORE</p>
              <p className="text-white text-[20px] md:text-[28px] font-extrabold leading-[1.1] tracking-[-0.3px] uppercase m-0">HAIRLOSS</p>
              <p className="text-[#F5C518] text-[28px] md:text-[40px] font-extrabold leading-[1.1] tracking-[-0.5px] uppercase m-0">WHY?</p>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                type="button"
                className="w-[52px] h-[52px] md:w-[64px] md:h-[64px] rounded-full flex items-center justify-center transition-transform hover:scale-110 duration-200"
                style={{ background: 'rgba(255,0,0,0.9)', boxShadow: '0 6px 24px rgba(255,0,0,0.4)' }}>
                <Play size={20} color="white" fill="white" style={{ marginLeft: 3 }} />
              </button>
            </div>
          </div>

          {/* Single grouped card */}
          <div className={`${inView ? 'anim-slide-l delay-200' : 'opacity-0'}`}>
            <BulletGroup bullets={hairLossBullets} />
          </div>

        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   3. HAIR PATCH & WIGS FOR MEN IN BANGALORE
───────────────────────────────────────────────────────────── */
function HairPatchSection() {
  const { ref, inView } = useInView();
  return (
    <section className="bg-white py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2 className="text-[26px] md:text-[44px] font-extrabold text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[64px]">
          Hair Patch & Wigs For Men<br />In Bangalore
        </h2>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-[48px] md:gap-[64px] items-center">

          {/* Single grouped card */}
          <div className={`${inView ? 'anim-slide-r' : 'opacity-0'}`}>
            <BulletGroup bullets={hairPatchBullets} />
          </div>

          {/* Branded video right */}
          <div className={`relative w-full h-[260px] md:h-[400px] rounded-[16px] overflow-hidden bg-[#121212] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.12)] ${inView ? 'anim-slide-l delay-200' : 'opacity-0'}`}>
            <Image
              src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-1.png"
              alt="Hair Patch Wigs Bangalore"
              fill
              sizes="(max-width: 768px) 100vw, min(1120px, 90vw)"
              className="object-cover object-center"
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(23,105,255,0.55) 0%, transparent 55%)' }} />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.85)] via-transparent to-transparent" />
            <div className="absolute bottom-[20px] left-[20px]">
              <div className="flex items-center gap-[6px] mb-[5px]">
                <div className="w-[7px] h-[7px] rounded-full bg-[#4686FE]" />
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>Undetectable</span>
              </div>
              <p style={{ fontSize: '16px', fontWeight: 700, color: '#fff', lineHeight: '1.2', margin: 0 }}>Hair System In</p>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                type="button"
                className="w-[52px] h-[52px] md:w-[64px] md:h-[64px] rounded-full flex items-center justify-center transition-transform hover:scale-110 duration-200"
                style={{ background: 'rgba(255,0,0,0.9)', boxShadow: '0 6px 24px rgba(255,0,0,0.4)' }}>
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
───────────────────────────────────────────────────────────── */
function WhyChooseSection() {
  const { ref: videoRef, inView: videoInView } = useInView(0.1);
  const { ref: gridRef, inView: gridInView } = useInView(0.1);
  return (
    <section className="bg-[#F5F6F7] py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2 className="text-[26px] md:text-[44px] font-extrabold text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[56px]">
          Why Thousands Of Men<br />Choose American Hairline
        </h2>

        <div
          ref={videoRef}
          className={`relative w-full h-[240px] md:h-[440px] rounded-[20px] overflow-hidden bg-[#121212] shadow-[0px_16px_48px_0px_rgba(0,0,0,0.15)] mb-[48px] md:mb-[56px] ${videoInView ? 'anim-scale-in' : 'opacity-0'}`}
        >
          <Image
            src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-3.png"
            alt="Why Choose American Hairline Bangalore"
            fill
            sizes="(max-width: 768px) 100vw, min(1120px, 90vw)"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.55)] via-transparent to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              type="button"
              className="w-[60px] h-[60px] md:w-[80px] md:h-[80px] rounded-full flex items-center justify-center transition-transform hover:scale-105 duration-300"
              style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1.5px solid rgba(255,255,255,0.25)' }}>
              <Play size={24} color="white" fill="white" style={{ marginLeft: 3 }} />
            </button>
          </div>
        </div>

        {/* Feature cards grid — icon + heading on own line + body below */}
        <div ref={gridRef} className={`grid grid-cols-1 md:grid-cols-2 gap-[12px] md:gap-[14px] ${gridInView ? 'anim-fade-up' : 'opacity-0'}`}>
          {features.map((f, i) => (
            <div
              key={i}
              className="flex gap-[16px] items-start p-[18px] md:p-[20px] rounded-[12px]"
              style={{
                background: '#fff',
                boxShadow: '0 2px 12px rgba(18,18,18,0.07)',
                border: '1px solid rgba(18,18,18,0.06)',
                animationDelay: `${i * 0.05}s`,
              }}
            >
              {/* SVG checkmark in blue rounded square */}
              <div
                className="w-[40px] h-[40px] rounded-[10px] flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #4686FE, #1769FF)', boxShadow: '0 4px 12px rgba(23,105,255,0.25)', marginTop: '2px' }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 10.5L8 14.5L16 6.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              {/* Heading + body split into separate lines */}
              <div>
                <p style={{ fontSize: '16px', fontWeight: 700, color: '#121212', lineHeight: '1.4', margin: '0 0 4px 0' }}>
                  {f.bold}
                </p>
                <p style={{ fontSize: '14px', fontWeight: 500, color: '#555555', lineHeight: '1.65', margin: 0 }}>
                  {f.text}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   5. SECRET TO NATURAL LOOKING HAIR
───────────────────────────────────────────────────────────── */
function SecretSection() {
  const { ref, inView } = useInView();
  return (
    <section className="bg-white py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2 className="text-[26px] md:text-[44px] font-extrabold text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[64px]">
          Secret To Natural Looking Hair
        </h2>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-[48px] md:gap-[64px] items-center">

          {/* Video left */}
          <div className={`relative w-full h-[260px] md:h-[400px] rounded-[16px] overflow-hidden bg-[#121212] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.12)] ${inView ? 'anim-slide-r' : 'opacity-0'}`}>
            <Image
              src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-4.png"
              alt="Secret Natural Looking Hair Bangalore"
              fill
              sizes="(max-width: 768px) 100vw, min(1120px, 90vw)"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.6)] via-transparent to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                type="button"
                className="w-[52px] h-[52px] md:w-[64px] md:h-[64px] rounded-full flex items-center justify-center transition-transform hover:scale-110 duration-200"
                style={{ background: 'rgba(255,0,0,0.9)', boxShadow: '0 6px 24px rgba(255,0,0,0.4)' }}>
                <Play size={20} color="white" fill="white" style={{ marginLeft: 3 }} />
              </button>
            </div>
          </div>

          {/* Single grouped card */}
          <div className={`${inView ? 'anim-slide-l delay-200' : 'opacity-0'}`}>
            <BulletGroup bullets={secretBullets} />
          </div>

        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   6. SERVICES OFFERED AT AMERICAN HAIRLINE
   + / × accordion, first item open
───────────────────────────────────────────────────────────── */
function ServicesSection() {
  const [openIndex, setOpenIndex] = useState(0);
  const { ref: videoRef, inView: videoInView } = useInView(0.1);
  const { ref: accordRef, inView: accordInView } = useInView(0.1);

  return (
    <section className="bg-[#F5F6F7] py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2 className="text-[26px] md:text-[44px] font-extrabold text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[56px]">
          Services Offered At<br />American Hairline
        </h2>

        {/* Blue "Hair Replacement" branded video */}
        <div
          ref={videoRef}
          className={`relative w-full rounded-[20px] overflow-hidden bg-[#e8eeff] h-[240px] md:h-[400px] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.08)] mb-[32px] md:mb-[40px] ${videoInView ? 'anim-scale-in' : 'opacity-0'}`}
        >
          <Image
            src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-results-story-amit-after.png"
            alt="Services Bangalore"
            fill
            sizes="(max-width: 768px) 100vw, min(1120px, 90vw)"
            className="object-cover object-center"
            style={{ opacity: 0.65 }}
          />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(100deg, rgba(10,12,16,0.72) 0%, rgba(10,12,16,0.3) 55%, transparent 100%)' }} />
          <div className="absolute bottom-[20px] md:bottom-[28px] left-[20px] md:left-[28px]">
            <p className="text-[#4686FE] text-[24px] md:text-[40px] font-extrabold leading-[1.15] tracking-[-0.5px] m-0">
              Hair<br />Replacement
            </p>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              type="button"
              className="w-[52px] h-[52px] md:w-[64px] md:h-[64px] rounded-full flex items-center justify-center transition-transform hover:scale-110 duration-200"
              style={{ background: 'rgba(255,0,0,0.9)', boxShadow: '0 4px 20px rgba(255,0,0,0.4)' }}>
              <Play size={20} color="white" fill="white" style={{ marginLeft: 3 }} />
            </button>
          </div>
        </div>

        {/* Accordion — + / × icons, first item open */}
        <div ref={accordRef} className={`flex flex-col gap-[8px] max-w-[760px] mx-auto ${accordInView ? 'anim-fade-up' : 'opacity-0'}`}>
          {servicesAccordion.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-[12px] overflow-hidden cursor-pointer"
              style={{ border: '1px solid rgba(18,18,18,0.08)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
              onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
            >
              <div className="flex justify-between items-center px-[20px] md:px-[24px] py-[16px] md:py-[18px]">
                {/* Question — 20px, 700 when open; 18px, 500 when closed */}
                <span style={{
                  fontSize: openIndex === i ? '20px' : '18px',
                  fontWeight: openIndex === i ? 700 : 500,
                  color: openIndex === i ? '#121212' : 'rgba(18,18,18,0.75)',
                  lineHeight: '1.4',
                  paddingRight: '16px',
                  transition: 'all 0.3s',
                }}>
                  {item.title}
                </span>
                <span style={{ fontSize: '16px', fontWeight: 700, color: 'rgba(18,18,18,0.4)', flexShrink: 0, userSelect: 'none', lineHeight: 1 }}>
                  {openIndex === i ? '×' : '+'}
                </span>
              </div>
              {openIndex === i && (
                <div className="px-[20px] md:px-[24px] pb-[18px]">
                  {/* Answer — 18px, 500 */}
                  <p style={{ fontSize: '14px', fontWeight: 500, color: '#555555', lineHeight: '1.7', margin: 0 }}>{item.desc}</p>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   7. CHECKLIST — imported
───────────────────────────────────────────────────────────── */

/* ─────────────────────────────────────────────────────────────
   8. FAQ — + / × icons, first item open
───────────────────────────────────────────────────────────── */
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { ref, inView } = useInView();

  return (
    <section className="bg-white py-[72px] md:py-[120px] flex justify-center w-full">
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
              >
                <div className="flex justify-between items-center py-[18px] md:py-[20px]">
                  {/* Question — 20px, 700 */}
                  <span style={{
                    fontSize: '16px',
                    fontWeight: 700,
                    lineHeight: '1.4',
                    paddingRight: '16px',
                    transition: 'color 0.3s',
                    color: openIndex === i ? '#121212' : 'rgba(18,18,18,0.65)',
                  }}>
                    {faq.q}
                  </span>
                  <span style={{ fontSize: '16px', fontWeight: 700, color: 'rgba(18,18,18,0.4)', flexShrink: 0, userSelect: 'none', lineHeight: 1 }}>
                    {openIndex === i ? '×' : '+'}
                  </span>
                </div>
                {openIndex === i && (
                  /* Answer — 18px, 500 */
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
            {/* CTA heading — 24px, 800 */}
            <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', letterSpacing: '-0.4px', marginBottom: '8px', lineHeight: '1.2' }}>
              Still have questions?
            </h3>
            {/* CTA body — 18px, 500 */}
            <p style={{ fontSize: '14px', fontWeight: 500, color: 'rgba(255,255,255,0.75)', lineHeight: '1.65', marginBottom: '24px', maxWidth: '420px' }}>
              No worries, we're here to guide you. Talk to us, we will support you completely.
            </p>
            <Link
              href="/contact-us"
              className="inline-flex items-center gap-[8px] bg-white text-[#1769FF] px-[20px] py-[11px] rounded-[10px] transition-transform hover:scale-[1.02] duration-200"
              style={{ fontSize: '14px', fontWeight: 700, boxShadow: '0 4px 14px rgba(0,0,0,0.1)' }}
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
export default function BangaloreReplacementPage() {
  return (
    <main>
      <SchemaMarkup schema={bangaloreSchema as any} />
      <HeroSection />
      <HairLossSection />
      <HairPatchSection />
      <WhyChooseSection />
      <SecretSection />
      <ServicesSection />
      <Checklist />
      <FAQSection />
      <CTA />
      <ResultsRealPeople />
    </main>
  );
}