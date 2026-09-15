'use client';

import Link from 'next/link';
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
const understandingBullets = [
  {
    bold: 'Non-Surgical Solutions:',
    text: ' Our non-surgical methods allow you to regain your confidence without the risks associated with invasive procedures and without the high cost of surgery.',
  },
  {
    bold: 'Natural Result:',
    text: ' Using premium grade hair that matches your natural colour, texture, and density, we create a seamless look that blends perfectly with your existing hair.',
  },
  {
    bold: 'Flexible Hair Solutions:',
    text: ' Whether you need a full head system, a frontal patch, or crown coverage, our experts will customise the perfect solution to match your unique needs.',
  },
];

const benefitsBullets = [
  {
    bold: 'Natural & Undetectable Appearance:',
    text: ' Our hair systems are crafted to blend seamlessly with your natural hair, giving a completely undetectable appearance.',
  },
  {
    bold: 'Instant Transformation:',
    text: ' Experience an immediate change in your appearance, improving your confidence and overall look almost instantly.',
  },
  {
    bold: 'No Side Effects:',
    text: ' Our non-surgical methods are completely safe with no risk of infections, scarring, or other complications.',
  },
  {
    bold: 'Customised For You:',
    text: ' Each system is custom-designed to match your natural hair colour, texture, and density for a perfectly personalised result.',
  },
  {
    bold: 'Durable & Long-Lasting:',
    text: ' With proper care, our hair systems can last 6-12 months, offering a cost-effective solution to hair loss.',
  },
  {
    bold: 'Specialist Support:',
    text: ' Our expert team is available to provide ongoing support and guidance throughout your hair restoration journey.',
  },
];

const bestInIndustryAccordion = [
  {
    title: 'Our Networks',
    desc: 'We have an extensive network of certified technicians and specialists across India, ensuring you always have access to expert care and support wherever you are.',
  },
  {
    title: 'Customised Products',
    desc: 'Every product is tailored specifically to your measurements, hair type, and lifestyle needs - ensuring a perfect fit and natural appearance every time.',
  },
  {
    title: 'Natural & Bold',
    desc: 'Our systems use only the finest human hair crafted to move, feel, and look exactly like your natural hair in any setting.',
  },
];

const tipsBullets = [
  {
    bold: 'Patch and wash your hair regularly',
    text: ' - keep it clean by washing once every 7-10 days using a mild, sulphate-free shampoo to extend the life of the bond and maintain the natural look.',
  },
  {
    bold: 'Secure with quality adhesive:',
    text: ' Always use the recommended adhesive or tape for your hair system type. Inferior products can damage the base and reduce the overall lifespan significantly.',
  },
  {
    bold: 'Regular Maintenance Visit:',
    text: ' Schedule professional servicing every 3-4 weeks. Our experts will re-bond, clean, and style your system so it always looks fresh and undetectable.',
  },
];

const faqs = [
  {
    q: 'How long can I wear it daily?',
    a: "Our hair systems are designed for all-day wear. You can wear them 24/7 with the right adhesive. Most clients find they forget they're wearing one within a few days.",
  },
  {
    q: 'Is it possible to get a custom hairline to look natural?',
    a: 'Absolutely. Every system we create includes a custom-designed hairline that matches your face shape, age, and natural growth patterns for a completely realistic appearance.',
  },
  {
    q: 'Can you clarify if these systems come with a guarantee?',
    a: 'Yes. We offer a quality guarantee on all our hair systems. If you experience any issues within the covered period, we will repair or replace the system at no additional cost.',
  },
  {
    q: 'Is it challenging to maintain regularly in your Hair Replacement System or not?',
    a: 'Not at all. We provide full training, video tutorials, and a maintenance kit so you can manage routine care confidently at home between professional sessions.',
  },
  {
    q: 'Does the maintenance charge affect the total cost of ownership?',
    a: 'Maintenance costs are modest compared to surgical alternatives. We offer affordable maintenance packages and transparent pricing with no hidden fees.',
  },
  {
    q: 'Which categories of adhesives are generally used?',
    a: 'We use medical-grade, skin-safe adhesives including liquid bonding glue, double-sided tape, and combination systems - each suited to different lifestyles and preferences.',
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
            className={`text-[32px] md:text-[52px] text-[#121212] leading-[1.1] tracking-[-1.5px] mb-[20px] ${inView ? 'anim-fade-up' : 'opacity-0'}`}
            style={{ fontWeight: 800 }}
          >
            Non Surgical Hair Replacement<br />In Ahmedabad
          </h1>
          <p
            className={`text-[#555555] leading-[1.7] max-w-[640px] mx-auto ${inView ? 'anim-fade-up delay-200' : 'opacity-0'}`}
            style={{ fontSize: '16px', fontWeight: 500 }}
          >
            Are you looking for an{' '}
            <strong style={{ fontWeight: 700, color: '#121212' }}>effective solution</strong>
            {' '}for hair loss? You have come to the right place. At American Hairline, we take pride in providing{' '}
            <strong style={{ fontWeight: 700, color: '#121212' }}>high quality Hair Systems, Natural Hairlines,</strong>
            {' '}and Hair Wigs specially designed for men who want to regain their confidence and achieve a stylish appearance.
          </p>
        </div>

        {/* Cinematic hero card */}
        <div className={`relative w-full rounded-[20px] md:rounded-[24px] overflow-hidden bg-[#0a0c10] h-[280px] md:h-[500px] shadow-[0px_24px_64px_0px_rgba(0,0,0,0.2)] ${inView ? 'anim-scale-in delay-300' : 'opacity-0'}`}>
          <Image
            src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-results-story-sameer-after.png"
            alt="Hair Replacement In Ahmedabad"
            fill
            sizes="(max-width: 768px) 100vw, min(1120px, 90vw)"
            className="object-cover object-center"
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
              IN AHMEDABAD
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   2. UNDERSTANDING HAIR LOSS AND HAIR WIGS
   Grey bg. Video left + BulletGroup right.
───────────────────────────────────────────────────────────── */
function UnderstandingSection() {
  const { ref, inView } = useInView();
  return (
    <section className="bg-[#F5F6F7] py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2
          className="text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[64px]"
          style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 800 }}
        >
          Understanding Hair Loss And Hair Wigs<br />For Men In Ahmedabad
        </h2>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-[48px] md:gap-[64px] items-center">

          {/* Video left */}
          <div className={`relative w-full h-[260px] md:h-[400px] rounded-[16px] overflow-hidden bg-[#121212] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.12)] ${inView ? 'anim-slide-r' : 'opacity-0'}`}>
            <Image
              src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-2.png"
              alt="Understanding Hair Loss"
              fill
              sizes="(max-width: 768px) 100vw, min(1120px, 90vw)"
              className="object-cover object-center"
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(23,105,255,0.55) 0%, transparent 55%)' }} />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.8)] via-transparent to-transparent" />
            <div className="absolute bottom-[20px] left-[20px]">
              <div className="flex items-center gap-[6px] mb-[4px]">
                <div className="w-[7px] h-[7px] rounded-full bg-[#4686FE]" />
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>Undetectable</span>
              </div>
              <p style={{ fontSize: '20px', fontWeight: 700, color: '#fff', lineHeight: '1.2', margin: 0 }}>Hair System In</p>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <button type="button"
                className="w-[52px] h-[52px] md:w-[64px] md:h-[64px] rounded-full flex items-center justify-center transition-transform hover:scale-110 duration-200"
                style={{ background: 'rgba(255,0,0,0.9)', boxShadow: '0 6px 24px rgba(255,0,0,0.4)' }}
              >
                <Play size={20} color="white" fill="white" style={{ marginLeft: 3 }} />
              </button>
            </div>
          </div>

          {/* BulletGroup right */}
          <div className={`${inView ? 'anim-slide-l delay-200' : 'opacity-0'}`}>
            <BulletGroup bullets={understandingBullets} />
          </div>

        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   3. BENEFITS
   White bg. BulletGroup left + video right.
───────────────────────────────────────────────────────────── */
function BenefitsSection() {
  const { ref, inView } = useInView();
  return (
    <section className="bg-white py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2
          className="text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[64px]"
          style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 800 }}
        >
          Benefits Of American Hairline's Hair Replacement<br />Systems In Ahmedabad
        </h2>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-[32px] md:gap-[48px] items-center">

          {/* BulletGroup left */}
          <div className={`${inView ? 'anim-slide-r' : 'opacity-0'}`}>
            <BulletGroup bullets={benefitsBullets} />
          </div>

          {/* Video right */}
          <div className={`relative w-full h-[300px] md:h-[460px] rounded-[20px] overflow-hidden bg-[#f0f0f0] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.08)] ${inView ? 'anim-slide-l delay-200' : 'opacity-0'}`}>
            <Image
              src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-3.png"
              alt="Benefits Hair Replacement Ahmedabad"
              fill
              sizes="(max-width: 768px) 100vw, min(1120px, 90vw)"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <button type="button"
                className="w-[56px] h-[56px] md:w-[64px] md:h-[64px] rounded-full flex items-center justify-center transition-transform hover:scale-110 duration-200"
                style={{ background: 'rgba(255,0,0,0.88)', boxShadow: '0 4px 20px rgba(255,0,0,0.4)' }}
              >
                <Play size={22} color="white" fill="white" style={{ marginLeft: 3 }} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   4. WHAT MAKES OUR PRODUCTS THE BEST
   Grey bg. Full-width video + + / × accordion below.
───────────────────────────────────────────────────────────── */
function BestInIndustrySection() {
  const [openIndex, setOpenIndex] = useState(0);
  const { ref: videoRef, inView: videoInView } = useInView(0.1);
  const { ref: accordRef, inView: accordInView } = useInView(0.1);

  return (
    <section className="bg-[#F5F6F7] py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2
          className="text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[56px]"
          style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 800 }}
        >
          What Makes American Hairline's Products<br />The Best In The Industry
        </h2>

        {/* Full-width video */}
        <div
          ref={videoRef}
          className={`relative w-full rounded-[16px] overflow-hidden bg-[#e8e8e8] h-[240px] md:h-[420px] shadow-[0px_8px_24px_0px_rgba(0,0,0,0.08)] mb-[32px] md:mb-[40px] ${videoInView ? 'anim-scale-in' : 'opacity-0'}`}
        >
          <Image
            src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-results-story-amit-after.png"
            alt="Hair Replacement"
            fill
            sizes="(max-width: 768px) 100vw, min(1120px, 90vw)"
            className="object-cover object-center"
            style={{ opacity: 0.75 }}
          />
          <div className="absolute bottom-[20px] md:bottom-[28px] left-[20px] md:left-[28px]">
            <p
              className="leading-[1.15] tracking-[-0.5px] m-0"
              style={{ color: '#1769FF', fontSize: 'clamp(24px, 3vw, 40px)', fontWeight: 800 }}
            >
              Hair<br />Replacement
            </p>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <button type="button"
              className="w-[52px] h-[52px] md:w-[64px] md:h-[64px] rounded-full flex items-center justify-center transition-transform hover:scale-110 duration-200"
              style={{ background: 'rgba(255,0,0,0.9)', boxShadow: '0 4px 20px rgba(255,0,0,0.4)' }}
            >
              <Play size={22} color="white" fill="white" style={{ marginLeft: 3 }} />
            </button>
          </div>
        </div>

        {/* + / × accordion */}
        <div ref={accordRef} className={`flex flex-col gap-[8px] ${accordInView ? 'anim-fade-up' : 'opacity-0'}`}>
          {bestInIndustryAccordion.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-[12px] overflow-hidden cursor-pointer"
              style={{ border: '1px solid rgba(18,18,18,0.08)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
              onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
            >
              <div className="flex justify-between items-center px-[20px] md:px-[24px] py-[16px] md:py-[18px]">
                <span style={{
                  fontSize: openIndex === i ? '20px' : '16px',
                  fontWeight: openIndex === i ? 700 : 500,
                  color: openIndex === i ? '#121212' : 'rgba(18,18,18,0.75)',
                  lineHeight: '1.4',
                  paddingRight: '16px',
                  transition: 'all 0.3s',
                }}>
                  {item.title}
                </span>
                <span style={{ fontSize: '20px', fontWeight: 700, color: 'rgba(18,18,18,0.4)', flexShrink: 0, userSelect: 'none' as const, lineHeight: 1 }}>
                  {openIndex === i ? '×' : '+'}
                </span>
              </div>
              {openIndex === i && (
                <div className="px-[20px] md:px-[24px] pb-[18px]">
                  <p style={{ fontSize: '16px', fontWeight: 500, color: '#555555', lineHeight: '1.7', margin: 0 }}>{item.desc}</p>
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
   5. TIPS AND TRICKS
   White bg. Video left + BulletGroup right.
───────────────────────────────────────────────────────────── */
function TipsSection() {
  const { ref, inView } = useInView();
  return (
    <section className="bg-white py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2
          className="text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[64px]"
          style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 800 }}
        >
          Tips And Tricks For Maintaining Your Hair<br />System Or Patch In Ahmedabad
        </h2>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-[48px] md:gap-[64px] items-center">

          {/* Branded video left */}
          <div className={`relative w-full h-[260px] md:h-[400px] rounded-[16px] overflow-hidden bg-[#121212] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.12)] ${inView ? 'anim-slide-r' : 'opacity-0'}`}>
            <Image
              src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-4.png"
              alt="Tips Maintaining Hair System"
              fill
              sizes="(max-width: 768px) 100vw, min(1120px, 90vw)"
              className="object-cover object-center"
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(23,105,255,0.55) 0%, transparent 55%)' }} />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.85)] via-transparent to-transparent" />
            <div className="absolute bottom-[20px] left-[20px]">
              <div className="flex items-center gap-[6px] mb-[4px]">
                <div className="w-[7px] h-[7px] rounded-full bg-[#4686FE]" />
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>Undetectable</span>
              </div>
              <p style={{ fontSize: '20px', fontWeight: 700, color: '#fff', lineHeight: '1.2', margin: 0 }}>Hair System in</p>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <button type="button"
                className="w-[52px] h-[52px] md:w-[64px] md:h-[64px] rounded-full flex items-center justify-center transition-transform hover:scale-110 duration-200"
                style={{ background: 'rgba(255,0,0,0.9)', boxShadow: '0 6px 24px rgba(255,0,0,0.4)' }}
              >
                <Play size={20} color="white" fill="white" style={{ marginLeft: 3 }} />
              </button>
            </div>
          </div>

          {/* BulletGroup right */}
          <div className={`${inView ? 'anim-slide-l delay-200' : 'opacity-0'}`}>
            <BulletGroup bullets={tipsBullets} />
          </div>

        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   6. FAQ — grey bg. + / × accordion + blue CTA card.
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
export default function AhmedabadPage() {
  return (
    <main>
      <HeroSection />
      <UnderstandingSection />
      <BenefitsSection />
      <BestInIndustrySection />
      <TipsSection />
      <FAQSection />
      <CTA />
      <ResultsRealPeople />
    </main>
  );
}