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
const hairPatch1Bullets = [
  {
    bold: 'Non-Surgical & Comfortable:',
    text: ' Our hair patches and wigs are completely non-surgical, providing an immediate, natural-looking result with no pain or downtime.',
  },
  {
    bold: 'Custom-Matched For Goa:',
    text: ' Every system is colour-matched and density-tailored to your natural hair, ensuring a seamless result that holds up in Goa\'s coastal humidity and beach lifestyle.',
  },
  {
    bold: 'Hair Replacement For All Ages:',
    text: ' Whether you\'re 25 or 60, our range of hair systems caters to all types and degrees of hair loss, providing natural-looking results at every age.',
  },
];

const hairPatch2Bullets = [
  {
    bold: 'Restore Confidence Instantly:',
    text: ' Our hair patches give you an immediate transformation. Walk out of our studio with a completely natural-looking head of hair the same day.',
  },
  {
    bold: 'Natural Hairline:',
    text: ' Through the use of high-quality skin-like materials and expert hand-tying techniques, our hairlines look completely natural from every angle.',
  },
  {
    bold: 'True Customisation:',
    text: ' Every aspect of your system is customised — from hair colour and density to base size and wave pattern — ensuring a perfect match to your natural hair.',
  },
  {
    bold: 'Maintained With Ease:',
    text: ' Our systems are designed to be low-maintenance. With our care kit and guidance, you can keep your hair looking fresh between professional service visits.',
  },
  {
    bold: 'Expert Team In Goa:',
    text: ' Our certified team has extensive experience serving clients across Goa, providing world-class hair replacement solutions tailored to the local lifestyle.',
  },
];

const whyChooseBullets = [
  { bold: 'Natural looking hair' },
  { bold: 'Comfortable to wear' },
  { bold: 'Custom made to match your hair color and style' },
  { bold: 'Non-invasive and painless' },
  { bold: 'Affordable compared to surgical options' },
];

const greatOptionAccordion = [
  {
    title: 'Natural-Looking Results',
    desc: 'Our hair systems are crafted to blend seamlessly with your natural hair, creating a completely undetectable result from every angle — ideal for Goa\'s social and outdoor lifestyle.',
  },
  {
    title: 'High-Quality Systems',
    desc: 'We use only premium-grade, 100% human hair and advanced base materials that resist humidity and maintain their natural appearance in Goa\'s coastal climate.',
  },
  {
    title: 'Personalised Consultation',
    desc: 'Every client receives a thorough consultation where our specialists assess your specific hair loss, lifestyle, and preferences before recommending a solution.',
  },
  {
    title: 'Trusted Nationwide',
    desc: 'American Hairline has helped thousands of men across India reclaim their confidence. Our Goa clients benefit from the same expertise and quality standards.',
  },
];

const faqs = [
  {
    q: 'Is getting non-surgical hair replacement safe?',
    a: 'Yes. Non-surgical hair replacement is completely safe. We use only medical-grade, dermatologically tested adhesives and base materials. There are no incisions, no chemicals on the scalp, and no known health risks when applied correctly.',
  },
  {
    q: 'How does the hair system stay in place in Goa\'s humidity?',
    a: 'We use humidity-resistant adhesives specifically selected for coastal climates like Goa\'s. Our systems are designed to maintain a secure bond even in heat, humidity, and during water activities.',
  },
  {
    q: 'How much does non-surgical hair replacement cost?',
    a: 'Costs depend on the type of system, level of customisation, and maintenance package chosen. We offer flexible pricing to suit a range of budgets. Contact us for a personalised quote.',
  },
  {
    q: 'Can I find the right adhesive to reapply the hair patch myself?',
    a: 'Yes. We provide a complete self-maintenance kit including the correct adhesive, application tools, and video guides so you can reapply your system confidently at home between professional visits.',
  },
  {
    q: 'What are the initial steps of the hair patch?',
    a: 'The process starts with a free consultation → scalp assessment → custom system design → production → professional fitting at our studio. The full process from consultation to delivery takes 3–4 weeks.',
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
function BulletGroup({ bullets }: { bullets: { bold: string; text?: string }[] }) {
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
            {b.text ?? ''}
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
            Hair Replacement Systems For<br />Men In Goa
          </h1>
          {/* Body — 16px, fontWeight 500 */}
          <p className={`text-[16px] font-[500] text-[#555555] leading-[1.7] max-w-[560px] mx-auto ${inView ? 'anim-fade-up delay-200' : 'opacity-0'}`}>
            Don't let hair loss stop you. Get your natural confidence back with the award-winning non-surgical hair replacement solutions in Goa.
          </p>
        </div>

        <div className={`relative w-full rounded-[20px] md:rounded-[24px] overflow-hidden bg-[#0a0c10] h-[280px] md:h-[500px] shadow-[0px_24px_64px_0px_rgba(0,0,0,0.2)] ${inView ? 'anim-scale-in delay-300' : 'opacity-0'}`}>
          <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-results-story-sameer-after.png" alt="Hair Replacement In Goa" fill className="object-cover object-top" sizes="(max-width: 768px) 100vw, 720px" />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.88)] via-[rgba(10,12,16,0.25)] to-transparent" />
          <div className="absolute bottom-[24px] md:bottom-[40px] left-[24px] md:left-[48px]">
            <p className="text-white text-[22px] md:text-[36px] font-extrabold tracking-[0.08em] uppercase leading-none m-0">HAIR REPLACEMENT</p>
            <p className="text-white/55 text-[13px] md:text-[18px] font-bold tracking-[0.2em] uppercase mt-[4px] m-0">IN GOA</p>
          </div>
        </div>

      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   2. HAIR PATCH & WIGS — FIRST
───────────────────────────────────────────────────────────── */
function HairPatch1Section() {
  const { ref, inView } = useInView();
  return (
    <section className="bg-[#F5F6F7] py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2 className="text-[26px] md:text-[44px] font-extrabold text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[64px]">
          Hair Patch & Wigs For Men<br />In Goa
        </h2>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-[48px] md:gap-[64px] items-center">

          <div className={`relative w-full h-[260px] md:h-[380px] rounded-[16px] overflow-hidden bg-[#121212] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.12)] ${inView ? 'anim-slide-r' : 'opacity-0'}`}>
            <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-3.png" alt="Hair Patch Wigs Goa" fill className="object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.65)] via-transparent to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="w-[52px] h-[52px] md:w-[64px] md:h-[64px] rounded-full flex items-center justify-center transition-transform hover:scale-110 duration-200"
                style={{ background: 'rgba(255,0,0,0.9)', boxShadow: '0 6px 24px rgba(255,0,0,0.4)' }}>
                <Play size={20} color="white" fill="white" style={{ marginLeft: 3 }} />
              </button>
            </div>
          </div>

          {/* Single grouped bullet card */}
          <div className={`${inView ? 'anim-slide-l delay-200' : 'opacity-0'}`}>
            <BulletGroup bullets={hairPatch1Bullets} />
          </div>

        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   3. HAIR PATCH & WIGS — SECOND
───────────────────────────────────────────────────────────── */
function HairPatch2Section() {
  const { ref, inView } = useInView();
  return (
    <section className="bg-white py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2 className="text-[26px] md:text-[44px] font-extrabold text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[64px]">
          Hair Patch & Wigs For<br />Men In Goa
        </h2>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-[48px] md:gap-[64px] items-center">

          {/* Single grouped bullet card left */}
          <div className={`${inView ? 'anim-slide-r' : 'opacity-0'}`}>
            <BulletGroup bullets={hairPatch2Bullets} />
          </div>

          {/* Branded video right */}
          <div className={`relative w-full h-[260px] md:h-[420px] rounded-[16px] overflow-hidden bg-[#121212] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.12)] ${inView ? 'anim-slide-l delay-200' : 'opacity-0'}`}>
            <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-2.png" alt="Undetectable Hair System Goa" fill className="object-cover object-center" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(23,105,255,0.55) 0%, transparent 55%)' }} />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.85)] via-transparent to-transparent" />
            <div className="absolute bottom-[20px] left-[20px]">
              <div className="flex items-center gap-[6px] mb-[5px]">
                <div className="w-[7px] h-[7px] rounded-full bg-[#4686FE]" />
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>Undetectable</span>
              </div>
              <p style={{ fontSize: '20px', fontWeight: 700, color: '#fff', lineHeight: '1.2', margin: 0 }}>Hair System In</p>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="w-[52px] h-[52px] md:w-[64px] md:h-[64px] rounded-full flex items-center justify-center transition-transform hover:scale-110 duration-200"
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
   4. WHY CHOOSE NON-SURGICAL HAIR REPLACEMENT?
───────────────────────────────────────────────────────────── */
function WhyChooseSection() {
  const { ref, inView } = useInView();
  return (
    <section className="bg-[#F5F6F7] py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2 className="text-[26px] md:text-[44px] font-extrabold text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[64px]">
          Why Choose Non-Surgical<br />Hair Replacement?
        </h2>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-[48px] md:gap-[64px] items-center">

          <div className={`relative w-full h-[260px] md:h-[380px] rounded-[16px] overflow-hidden bg-[#121212] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.12)] ${inView ? 'anim-slide-r' : 'opacity-0'}`}>
            <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-1.png" alt="Why Choose Non-Surgical" fill className="object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.6)] via-transparent to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="w-[52px] h-[52px] md:w-[64px] md:h-[64px] rounded-full flex items-center justify-center transition-transform hover:scale-110 duration-200"
                style={{ background: 'rgba(255,0,0,0.9)', boxShadow: '0 6px 24px rgba(255,0,0,0.4)' }}>
                <Play size={20} color="white" fill="white" style={{ marginLeft: 3 }} />
              </button>
            </div>
          </div>

          {/* Right: single card with intro para + dot bullets */}
          <div className={`${inView ? 'anim-slide-l delay-200' : 'opacity-0'}`}>
            <div
              className="rounded-[12px] p-[24px] md:p-[28px]"
              style={{
                background: '#fff',
                boxShadow: '0 2px 12px rgba(18,18,18,0.07)',
                border: '1px solid rgba(18,18,18,0.06)',
              }}
            >
              {/* Intro paragraph with inline bolds */}
              <p style={{ fontSize: '16px', fontWeight: 500, color: '#555555', lineHeight: '1.7', margin: '0 0 20px 0' }}>
                <strong style={{ fontWeight: 700, color: '#121212' }}>Non-surgical hair replacement</strong>{' '}
                is a great option for those who want to regain their confidence & look their best without surgery. Some of the{' '}
                <strong style={{ fontWeight: 700, color: '#121212' }}>benefits</strong>{' '}
                of non-surgical hair replacement are:
              </p>
              {/* Bullet list with filled dot markers */}
              <div className="flex flex-col gap-[14px]">
                {whyChooseBullets.map((b, i) => (
                  <div key={i} className="flex items-center gap-[12px]">
                    <div className="w-[8px] h-[8px] rounded-full bg-[#121212] flex-shrink-0" />
                    <p style={{ fontSize: '16px', fontWeight: 700, color: '#121212', lineHeight: '1.4', margin: 0 }}>
                      {b.bold.replace(/\.$/, '')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   5. WHY AMERICAN HAIRLINE IS A GREAT OPTION IN GOA
   + / × accordion, first item open
───────────────────────────────────────────────────────────── */
function GreatOptionSection() {
  const [openIndex, setOpenIndex] = useState(0);
  const { ref: videoRef, inView: videoInView } = useInView(0.1);
  const { ref: accordRef, inView: accordInView } = useInView(0.1);

  return (
    <section className="bg-white py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2 className="text-[26px] md:text-[44px] font-extrabold text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[56px]">
          Why American Hairline Is A Great Option For<br />Non-Surgical Hair Replacement In Goa
        </h2>

        <div
          ref={videoRef}
          className={`relative w-full rounded-[20px] overflow-hidden bg-[#0a0c10] h-[240px] md:h-[440px] shadow-[0px_16px_48px_0px_rgba(0,0,0,0.18)] mb-[32px] md:mb-[40px] ${videoInView ? 'anim-scale-in' : 'opacity-0'}`}
        >
          <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-results-story-amit-after.png" alt="Most Undetectable Hair System Goa" fill className="object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.75)] via-transparent to-transparent" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(100deg, rgba(10,12,16,0.6) 0%, transparent 60%)' }} />
          <div className="absolute bottom-[20px] md:bottom-[32px] left-[20px] md:left-[36px]">
            <p className="text-white text-[18px] md:text-[30px] font-extrabold leading-[1.2] m-0">
              <span style={{ fontStyle: 'italic', color: '#F5C518' }}>Most Undetectable</span>{' '}
              <span className="text-white">Hair System in India</span>
            </p>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <button className="w-[56px] h-[56px] md:w-[72px] md:h-[72px] rounded-full flex items-center justify-center transition-transform hover:scale-105 duration-300"
              style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1.5px solid rgba(255,255,255,0.25)' }}>
              <Play size={22} color="white" fill="white" style={{ marginLeft: 3 }} />
            </button>
          </div>
        </div>

        {/* Accordion — + / × icons, first item open */}
        <div ref={accordRef} className={`flex flex-col gap-[8px] ${accordInView ? 'anim-fade-up' : 'opacity-0'}`}>
          {greatOptionAccordion.map((item, i) => (
            <div
              key={i}
              className="bg-[#F5F6F7] rounded-[12px] overflow-hidden cursor-pointer"
              style={{ border: '1px solid rgba(18,18,18,0.06)' }}
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
                <span style={{ fontSize: '20px', fontWeight: 700, color: 'rgba(18,18,18,0.4)', flexShrink: 0, userSelect: 'none', lineHeight: 1 }}>
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
   6. FAQ — + / × icons, first item open
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
export default function GoaPage() {
  return (
    <main>
      <HeroSection />
      <HairPatch1Section />
      <HairPatch2Section />
      <WhyChooseSection />
      <GreatOptionSection />
      <FAQSection />
      <CTA />
      <ResultsRealPeople />
    </main>
  );
}