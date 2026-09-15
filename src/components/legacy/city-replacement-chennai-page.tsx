'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
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
  Subheadings / bold labels: 16px, fontWeight 700, color #121212
  Body / description text:   14px, fontWeight 500, color #555
  Small caps / tags:         12px, fontWeight 700
*/

/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────── */
const hairPatchBullets = [
  {
    bold: 'Our stock is varied with different hair systems',
    text: ' for men in Chennai, offering an excellent range and variety of hair patches and wigs. We have a wide range of options to offer you.',
  },
  {
    bold: 'It brings you happiness and comfort',
    text: ' with natural-looking patches for patches and hair wigs, which creates a proper, long-lasting look for you. People will not be able to tell if you are wearing a patch or a wig.',
  },
];

const whyChooseAccordion = [
  {
    title: 'Personal & Approach',
    desc: 'Our team takes a personal approach to understand your unique hair loss pattern, lifestyle, and goals — ensuring a hair system that fits your life, not just your scalp.',
  },
  {
    title: 'High-Quality Products',
    desc: 'We source only premium-grade hair systems with 100% human hair, advanced base materials, and long-lasting adhesives that meet international quality standards.',
  },
  {
    title: 'Seamless, Life-like Appearance',
    desc: 'Our expert technicians craft hairlines that blend with your natural hair seamlessly, making it impossible to distinguish the system from your real hair.',
  },
  {
    title: 'Pocket-friendly & Affordable',
    desc: 'We believe confidence should be affordable. Our pricing is competitive without compromising on quality, with flexible packages to suit every budget.',
  },
  {
    title: 'Lasting Quality and Money',
    desc: 'Invest once in a premium system and enjoy months of natural-looking hair. Our systems are built to last and come with comprehensive aftercare support.',
  },
];

const findBestBullets = [
  {
    bold: 'If you are looking for the best non-surgical hair replacement',
    text: ' in Chennai, you have come to the right place. Our team of hair experts provides a wide range of customised solutions to match your individual needs.',
  },
  {
    bold: 'We also ensure that every product we provide',
    text: ' is of the highest quality. Our team of experts is dedicated to ensuring your complete satisfaction. We are committed to providing you with the best possible solution.',
  },
  {
    bold: 'When you choose American Hairline,',
    text: ' you can trust that you are getting the best non-surgical hair replacement solution. Contact us today for a free consultation and take the first step toward a more confident you.',
  },
];

const faqs = [
  {
    q: 'Is there any surgical process in this?',
    a: 'No. Our hair replacement systems are entirely non-surgical. No incisions, no anaesthesia, no downtime. The system is attached to your scalp using medical-grade adhesives or clips.',
  },
  {
    q: 'What\'s the maintenance required for the regular upkeep?',
    a: 'We recommend a maintenance session every 3–4 weeks. This includes cleaning, re-adhesion, and a style refresh. Our team provides full guidance on home care routines.',
  },
  {
    q: 'Can I independently operate it on my own?',
    a: 'Yes, with the right training and products. We provide a complete self-maintenance kit and video guides so you can manage routine upkeep confidently at home.',
  },
  {
    q: 'Will it affect the existing hair?',
    a: 'No. Our systems are designed to sit on the scalp without affecting your existing hair. They are fully breathable and safe for long-term use.',
  },
  {
    q: 'What are the side effects of it?',
    a: 'When applied correctly with proper products, side effects are minimal. Some users may experience mild scalp sensitivity initially, which typically resolves within a few days.',
  },
  {
    q: 'Why your scalp health matters?',
    a: 'A healthy scalp provides a clean, secure base for the hair system. Proper scalp care extends the life of the system and ensures optimal comfort and appearance.',
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
          {/* h1 — 32px/52px, fontWeight 800 */}
          <h1 className={`text-[32px] md:text-[52px] font-extrabold text-[#121212] leading-[1.1] tracking-[-1.5px] mb-[20px] ${inView ? 'anim-fade-up' : 'opacity-0'}`}>
            Hair Replacement For<br />Men In Chennai
          </h1>
          {/* Body — 14px, fontWeight 500 */}
          <p className={`text-[14px] font-[500] text-[#555555] leading-[1.7] max-w-[560px] mx-auto ${inView ? 'anim-fade-up delay-200' : 'opacity-0'}`}>
            Say goodbye to hair loss and welcome our non-surgical hair replacement in Chennai. Say you regain the
            styling you've always wished.
          </p>
        </div>

        {/* Cinematic hero card */}
        <div className={`relative w-full rounded-[20px] md:rounded-[24px] overflow-hidden bg-[#0a0c10] h-[280px] md:h-[500px] shadow-[0px_24px_64px_0px_rgba(0,0,0,0.2)] ${inView ? 'anim-scale-in delay-300' : 'opacity-0'}`}>
          <Image
            src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-results-story-sameer-after.png"
            alt="Hair Replacement In Chennai"
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.88)] via-[rgba(10,12,16,0.25)] to-transparent" />
          <div className="absolute bottom-[24px] md:bottom-[40px] left-[24px] md:left-[48px]">
            <p className="text-white text-[22px] md:text-[36px] font-extrabold tracking-[0.08em] uppercase leading-none m-0">
              HAIR REPLACEMENT
            </p>
            <p className="text-white/55 text-[13px] md:text-[18px] font-bold tracking-[0.2em] uppercase mt-[4px] m-0">
              IN CHENNAI
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   2. HAIR PATCH & WIGS FOR MEN IN CHENNAI
───────────────────────────────────────────────────────────── */
function HairPatchSection() {
  const { ref, inView } = useInView();
  return (
    <section className="bg-[#F5F6F7] py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2 className="text-[26px] md:text-[44px] font-extrabold text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[64px]">
          Hair Patch & Wigs For Men<br />In Chennai
        </h2>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-[48px] md:gap-[64px] items-center">

          {/* Branded dark video card */}
          <div className={`relative w-full h-[280px] md:h-[420px] rounded-[16px] overflow-hidden bg-[#0a0c10] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.15)] ${inView ? 'anim-slide-r' : 'opacity-0'}`}>
            <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-1.png" alt="Premium Hair Systems" fill className="object-cover object-center" style={{ opacity: 0.45 }} />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(5,7,10,0.9)] via-[rgba(5,7,10,0.6)] to-[rgba(5,7,10,0.3)]" />
            <div className="absolute inset-0 flex items-center px-[24px] md:px-[32px]">
              <div>
                <p className="text-white/70 text-[12px] font-bold tracking-[0.06em] uppercase m-0 mb-[4px]">
                  Detailed INFO
                </p>
                <p className="text-white text-[22px] md:text-[32px] font-extrabold leading-[1.1] tracking-[-0.5px] m-0 mb-[2px]">
                  About <span style={{ color: '#F5C518' }}>PREMIUM</span>
                </p>
                <p className="text-white text-[22px] md:text-[32px] font-extrabold leading-[1.1] tracking-[-0.5px] m-0 mb-[2px]">
                  HAIR SYSTEMS
                </p>
                <p className="text-white/60 text-[18px] md:text-[26px] font-extrabold leading-[1.1] m-0">
                  (PATCHES)
                </p>
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="w-[52px] h-[52px] md:w-[64px] md:h-[64px] rounded-full flex items-center justify-center transition-transform hover:scale-110 duration-200"
                style={{ background: 'rgba(255,69,69,0.92)', boxShadow: '0 6px 24px rgba(255,69,69,0.5)' }}>
                <Play size={20} color="white" fill="white" style={{ marginLeft: 3 }} />
              </button>
            </div>
          </div>

          {/* Single grouped bullet card */}
          <div className={`${inView ? 'anim-slide-l delay-200' : 'opacity-0'}`}>
            <BulletGroup bullets={hairPatchBullets} />
          </div>

        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   3. WHY CHOOSE NON-SURGICAL
   + / × accordion, first item open
───────────────────────────────────────────────────────────── */
function WhyChooseSection() {
  const [openIndex, setOpenIndex] = useState(0);
  const { ref: videoRef, inView: videoInView } = useInView(0.1);
  const { ref: accordRef, inView: accordInView } = useInView(0.1);

  return (
    <section className="bg-white py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2 className="text-[26px] md:text-[44px] font-extrabold text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[56px]">
          Why Choose Our Non-Surgical Hair Replacement<br />Services In Chennai?
        </h2>

        {/* Full-width branded video */}
        <div
          ref={videoRef}
          className={`relative w-full rounded-[20px] overflow-hidden bg-[#0a0c10] h-[260px] md:h-[460px] shadow-[0px_16px_48px_0px_rgba(0,0,0,0.18)] mb-[48px] md:mb-[56px] ${videoInView ? 'anim-scale-in' : 'opacity-0'}`}
        >
          <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-results-story-amit-after.png" alt="Most Undetectable Hair System" fill className="object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.75)] via-transparent to-transparent" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(100deg, rgba(10,12,16,0.6) 0%, transparent 60%)' }} />
          <div className="absolute bottom-[20px] md:bottom-[32px] left-[20px] md:left-[36px]">
            <p className="text-white text-[20px] md:text-[32px] font-extrabold leading-[1.2] m-0">
              <span style={{ fontStyle: 'italic', color: '#F5C518' }}>Most Undetectable</span>
              {' '}
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
        <div ref={accordRef} className={`max-w-[760px] mx-auto ${accordInView ? 'anim-fade-up' : 'opacity-0'}`}>
          {whyChooseAccordion.map((item, i) => (
            <div
              key={i}
              className="cursor-pointer"
              style={{ borderBottom: '1px solid rgba(18,18,18,0.08)' }}
              onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
            >
              <div className="flex justify-between items-center py-[18px]">
                {/* Question — 16px, 700 when open; 14px, 500 when closed */}
                <span style={{
                  fontSize: openIndex === i ? '20px' : '16px',
                  fontWeight: openIndex === i ? 700 : 500,
                  color: openIndex === i ? '#121212' : 'rgba(18,18,18,0.65)',
                  lineHeight: '1.4',
                  paddingRight: '16px',
                  transition: 'all 0.3s',
                }}>
                  {item.title}
                </span>
                <span style={{ fontSize: '18px', fontWeight: 700, color: 'rgba(18,18,18,0.4)', flexShrink: 0, userSelect: 'none', lineHeight: 1 }}>
                  {openIndex === i ? '×' : '+'}
                </span>
              </div>
              {openIndex === i && (
                /* Answer — 14px, 500 */
                <p style={{ fontSize: '16px', fontWeight: 500, color: '#555555', lineHeight: '1.7', paddingBottom: '18px', margin: 0 }}>
                  {item.desc}
                </p>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   4. 21-POINT CHECKLIST — imported
───────────────────────────────────────────────────────────── */

/* ─────────────────────────────────────────────────────────────
   5. FIND THE BEST NON-SURGICAL HAIR REPLACEMENT IN CHENNAI
───────────────────────────────────────────────────────────── */
function FindBestSection() {
  const { ref, inView } = useInView();
  return (
    <section className="bg-[#F5F6F7] py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2 className="text-[26px] md:text-[44px] font-extrabold text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[64px]">
          Find The Best Non-Surgical Hair<br />Replacement In Chennai
        </h2>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-[48px] md:gap-[64px] items-center">

          {/* Video card */}
          <div className={`relative w-full h-[260px] md:h-[400px] rounded-[16px] overflow-hidden bg-[#121212] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.12)] ${inView ? 'anim-slide-r' : 'opacity-0'}`}>
            <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-3.png" alt="Find Best Hair Replacement Chennai" fill className="object-cover object-center" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(23,105,255,0.55) 0%, transparent 55%)' }} />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.75)] via-transparent to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="w-[52px] h-[52px] md:w-[64px] md:h-[64px] rounded-full flex items-center justify-center transition-transform hover:scale-110 duration-200"
                style={{ background: 'rgba(255,69,69,0.92)', boxShadow: '0 6px 24px rgba(255,69,69,0.5)' }}>
                <Play size={20} color="white" fill="white" style={{ marginLeft: 3 }} />
              </button>
            </div>
          </div>

          {/* Single grouped bullet card */}
          <div className={`${inView ? 'anim-slide-l delay-200' : 'opacity-0'}`}>
            <BulletGroup bullets={findBestBullets} />
          </div>

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
                  {/* Question — 16px, 700 */}
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
                  <span style={{ fontSize: '18px', fontWeight: 700, color: 'rgba(18,18,18,0.4)', flexShrink: 0, userSelect: 'none', lineHeight: 1 }}>
                    {openIndex === i ? '×' : '+'}
                  </span>
                </div>
                {openIndex === i && (
                  /* Answer — 14px, 500 */
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
            {/* CTA body — 14px, 500 */}
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
export default function ChennaiPage() {
  return (
    <main>
      <HeroSection />
      <HairPatchSection />
      <WhyChooseSection />
      <Checklist />
      <FindBestSection />
      <FAQSection />
      <CTA />
      <ResultsRealPeople />
    </main>
  );
}