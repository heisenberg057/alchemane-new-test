'use client';

import React, { useState, useRef, useEffect } from 'react';
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
  .delay-200 { animation-delay: 0.20s; }
  .delay-300 { animation-delay: 0.30s; }

  /* Sticky scroll — How To Order */
  .order-sticky-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 48px;
    align-items: start;
  }
  .order-sticky-left {
    position: sticky;
    top: 80px;
    align-self: start;
  }
  @media (max-width: 900px) {
    .order-sticky-layout { grid-template-columns: 1fr; }
    .order-sticky-left { position: relative; top: auto; }
  }
`;

/* ─────────────────────────────────────────────────────────────
   DATA — exact content from reference images
───────────────────────────────────────────────────────────── */

// Image 2 — Custom Hair Unit tab
const customHairUnitBullets = [
  { bold: 'Self-Confidence:', text: ' Hair loss can lower self-confidence. A non-surgical hair system restores a natural look.' },
  { bold: 'No Pain / No Bleeding:', text: ' Unlike surgical methods, there is no pain, bleeding, or medication involved.' },
  { bold: 'No Side Effects:', text: ' We use medical-grade adhesives that are bacteria-resistant, safe, and designed for comfortable wear.' },
  { bold: 'Reversible:', text: ' If you decide to stop wearing your hair system, it can simply be removed. The solution is not permanent.' },
  { bold: 'Desired Density:', text: ' Hair systems allow you to achieve your desired density, independent of your natural hair.' },
];

// Image 2 — Stock Hair Unit tab
const stockHairUnitBullets = [
  { bold: 'Ready to wear:', text: ' A faster option — based on a stock system that is then customised and styled to suit you.' },
  { bold: 'Available sooner:', text: ' Available much sooner than a fully custom system.' },
  { bold: 'Ideal to start quickly:', text: ' Ideal for those who need to start quickly, to customise further over time.' },
  { bold: 'Specialist adapted:', text: ' Our specialists adapt a close-matched stock to your colour and cut before delivery.' },
];

// Image 1 — Secret section bullets (with intro line)
const secretBullets = [
  { bold: 'Density:', text: ' We avoid the common high-density look by designing units that blend naturally with your existing hair.' },
  { bold: 'Natural Front Hairline:', text: ' We use ultra-thin bases and invisible knotting to create a seamless, undetectable hairline.' },
  { bold: 'Expert Blending:', text: ' Our 15 years of experience ensures perfectly textured, ready-to-wear systems that blend with your natural hair.' },
  { bold: 'Manageable Hairstyles:', text: ' We recommend starting with a short, light-density style for easy maintenance and a more natural transition.' },
];

const orderSteps = [
  { n: 1, bold: 'Book Consultation:', text: ' Start with a free consultation — online or in person — with our customisation specialists.' },
  { n: 2, bold: 'Talk To Us Live:', text: ' Our experts assess your hair loss pattern and lifestyle to recommend the best configuration.' },
  { n: 3, bold: 'Check Your Needs:', text: ' We take precise scalp measurements and note all your specifications for production.' },
  { n: 4, bold: 'System Made:', text: ' Your fully customised system is produced and quality-checked before dispatch.' },
  { n: 5, bold: 'Final Delivery:', text: ' Your system arrives at your door, ready for a professional fitting session.' },
];

const faqs = [
  {
    q: 'What is a customised hair system and what are its benefits?',
    a: 'A customised hair system is a hair patch or wig made entirely to your measurements and specifications — matching your exact hair colour, density, wave pattern, base size, and hairline shape. The benefit is a completely natural, undetectable result that fits your unique hair loss situation perfectly.',
  },
  {
    q: 'Can you customise Hair Unit?',
    a: 'Yes. Every system we produce is fully customisable. We offer over 40 colour shades, multiple base materials, varying densities, and custom hairline profiles. Our specialists guide you through every choice during the consultation.',
  },
  {
    q: 'Learn easily, discuss and customise with it?',
    a: 'Absolutely. Our consultation process is simple and thorough. We explain every option in plain language, show you samples, and work with you step-by-step to design a system you are completely happy with.',
  },
  {
    q: 'Do I need to shave the sides for the wig to stay?',
    a: 'Not always. For many clients, we can work with existing hair. Whether shaving is necessary depends on your hair loss extent and the type of system chosen. Our team assesses this individually during consultation.',
  },
  {
    q: 'Do I need to take care of the sides for the remaining edge?',
    a: 'Yes. Proper edge care is part of the maintenance routine. We provide detailed instructions and recommended products for keeping the sides and perimeter clean, secure, and natural-looking.',
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
   CARD — plain white rounded card, matching reference
───────────────────────────────────────────────────────────── */
function Card({ children, className = '', style = {} }: {
  children: React.ReactNode; className?: string; style?: React.CSSProperties;
}) {
  return (
    <div
      className={`bg-white rounded-[12px] border border-[rgba(18,18,18,0.07)] shadow-[0px_2px_12px_0px_rgba(0,0,0,0.06)] ${className}`}
      style={style}
    >
      {children}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   1. HERO  — Image 3
   Bold inline: "best option" and "Fully customized"
───────────────────────────────────────────────────────────── */
function HeroSection() {
  const { ref, inView } = useInView(0.1);
  return (
    <section className="bg-white py-[72px] md:py-[120px] flex justify-center w-full">
      <style>{globalStyles}</style>
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <div ref={ref} className="text-center mb-[48px] md:mb-[64px]">
          <h1 className={`text-[32px] md:text-[52px] font-extrabold text-[#121212] leading-[1.1] tracking-[-1.5px] mb-[20px] ${inView ? 'anim-fade-up' : 'opacity-0'}`}>
            Fully Customized<br />Hair Systems
          </h1>
          {/* Image 3: "best option" and "Fully customized" are bold */}
          <p className={`text-[18px] text-[#555555] leading-[1.7] max-w-[520px] mx-auto ${inView ? 'anim-fade-up delay-200' : 'opacity-0'}`}>
            If you are looking for the <strong className="text-[#121212] font-bold">best option</strong> for yourself in hair systems and if time and cost are not major concerns, <strong className="text-[#121212] font-bold">Fully customized</strong> hair systems would be the best option for you.
          </p>
        </div>

        <div className={`relative w-full rounded-[20px] md:rounded-[24px] overflow-hidden bg-[#0a0c10] h-[280px] md:h-[500px] shadow-[0px_24px_64px_0px_rgba(0,0,0,0.2)] ${inView ? 'anim-scale-in delay-300' : 'opacity-0'}`}>
          <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-results-story-sameer-after.png" alt="Fully Customized Hair Systems" fill className="object-cover object-top" sizes="(max-width: 768px) 100vw, 720px" />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.88)] via-[rgba(10,12,16,0.25)] to-transparent" />
          <div className="absolute bottom-[24px] md:bottom-[40px] left-[24px] md:left-[48px]">
            <p className="text-white text-[22px] md:text-[36px] font-extrabold tracking-[0.08em] uppercase leading-none m-0">CUSTOMIZED</p>
            <p className="text-white/55 text-[13px] md:text-[18px] font-bold tracking-[0.2em] uppercase mt-[4px] m-0 italic">HAIR SYSTEMS</p>
          </div>
        </div>

      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   2. TWO TYPE OF HAIR UNITS  — Image 2
   Left: branded video thumbnail
   Right: rectangular tab buttons (NOT pill) + plain bullet list inside white card
───────────────────────────────────────────────────────────── */
function TwoTypesSection() {
  const [activeTab, setActiveTab] = useState<'custom' | 'stock'>('custom');
  const { ref, inView } = useInView();
  const activeBullets = activeTab === 'custom' ? customHairUnitBullets : stockHairUnitBullets;

  return (
    <section className="bg-[#F5F6F7] py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2 className="text-[26px] md:text-[44px] font-extrabold text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[64px]">
          Two Type Of Hair Units
        </h2>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-[32px] md:gap-[48px] items-start">

          {/* LEFT — branded video (Image 2 style) */}
          <div className={`relative w-full h-[280px] md:h-[360px] rounded-[12px] overflow-hidden bg-[#0a0c10] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.15)] ${inView ? 'anim-slide-r' : 'opacity-0'}`}>
            <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-2.png" alt="Full vs Semi-Custom" fill className="object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(5,7,10,0.7)] via-[rgba(5,7,10,0.3)] to-transparent" />
            {/* Red top banner */}
            <div className="absolute top-0 left-0 right-0 bg-[#e00] px-[14px] py-[10px]">
              <p className="text-white text-[16px] md:text-[20px] font-extrabold uppercase leading-none m-0 tracking-[0.02em]">
                WHAT YOU NEED:
              </p>
            </div>
            {/* Yellow headline */}
            <div className="absolute top-[48px] md:top-[56px] left-[14px]">
              <p className="text-white text-[18px] md:text-[26px] font-extrabold leading-[1.15] uppercase m-0">
                FULL VS.{' '}
                <span style={{ color: '#F5C518' }}>SEMI-CUSTOM!</span>
              </p>
            </div>
            {/* Play */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                className="w-[52px] h-[52px] md:w-[64px] md:h-[64px] rounded-full flex items-center justify-center transition-transform hover:scale-110 duration-200"
                style={{ background: 'rgba(255,0,0,0.92)', boxShadow: '0 6px 24px rgba(255,0,0,0.4)' }}
              >
                <Play size={22} color="white" fill="white" style={{ marginLeft: 3 }} />
              </button>
            </div>
          </div>

          {/* RIGHT — tab buttons + bullet list in white card */}
          <div className={`${inView ? 'anim-slide-l delay-200' : 'opacity-0'}`}>
            <Card className="overflow-hidden">
              {/* Tab row — segmented control: active = blue filled pill, inactive = plain grey text */}
              <div className="flex items-center p-[6px] border-b border-[rgba(18,18,18,0.08)] bg-white">
                <button
                  onClick={() => setActiveTab('custom')}
                  className="flex-1 py-[10px] text-[18px] font-semibold transition-all duration-200 rounded-[8px]"
                  style={{
                    background: activeTab === 'custom' ? 'linear-gradient(135deg, #4686FE, #1769FF)' : 'transparent',
                    color: activeTab === 'custom' ? '#fff' : 'rgba(18,18,18,0.45)',
                    borderTop: '0px solid transparent',
                    borderRight: '0px solid transparent',
                    borderBottom: '0px solid transparent',
                    borderLeft: '0px solid transparent',
                    cursor: 'pointer',
                    boxShadow: activeTab === 'custom' ? '0 2px 8px rgba(23,105,255,0.25)' : 'none',
                  }}
                >
                  Custom Hair Unit
                </button>
                <button
                  onClick={() => setActiveTab('stock')}
                  className="flex-1 py-[10px] text-[18px] font-semibold transition-all duration-200 rounded-[8px]"
                  style={{
                    background: activeTab === 'stock' ? 'linear-gradient(135deg, #4686FE, #1769FF)' : 'transparent',
                    color: activeTab === 'stock' ? '#fff' : 'rgba(18,18,18,0.45)',
                    borderTop: '0px solid transparent',
                    borderRight: '0px solid transparent',
                    borderBottom: '0px solid transparent',
                    borderLeft: '0px solid transparent',
                    cursor: 'pointer',
                    boxShadow: activeTab === 'stock' ? '0 2px 8px rgba(23,105,255,0.25)' : 'none',
                  }}
                >
                  Stock Hair Unit
                </button>
              </div>

              {/* Bullet list — plain, like Image 2 */}
              <div className="p-[24px] md:p-[28px] flex flex-col gap-[16px]">
                {activeBullets.map((b, i) => (
                  <div key={i} className="flex gap-[10px] items-start">
                    <span className="text-[#121212] text-[18px] mt-[1px] flex-shrink-0">•</span>
                    <p className="text-[18px] text-[#444444] leading-[1.6] m-0">
                      <strong className="text-[#121212] font-semibold">{b.bold}</strong>
                      {b.text}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   4. SECRET TO NATURAL LOOKING HAIR  — Image 1
   Left: video. Right: white card with intro text + bullet list.
───────────────────────────────────────────────────────────── */
function SecretSection() {
  const { ref, inView } = useInView();
  return (
    <section className="bg-[#F5F6F7] py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2 className="text-[26px] md:text-[44px] font-extrabold text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[64px]">
          Secret To Natural Looking Hair
        </h2>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-[32px] md:gap-[48px] items-start">

          {/* LEFT — video thumbnail, matching Image 1 */}
          <div className={`relative w-full h-[260px] md:h-[360px] rounded-[12px] overflow-hidden bg-[#121212] shadow-[0px_4px_20px_0px_rgba(0,0,0,0.1)] ${inView ? 'anim-slide-r' : 'opacity-0'}`}>
            <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-3.png" alt="Secret Natural Looking Hair" fill className="object-cover object-center" />
            <div className="absolute inset-0 bg-[rgba(0,0,0,0.12)]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                className="w-[52px] h-[52px] rounded-full flex items-center justify-center transition-transform hover:scale-110 duration-200"
                style={{ background: 'rgba(255,0,0,0.92)', boxShadow: '0 4px 20px rgba(255,0,0,0.4)' }}
              >
                <Play size={20} color="white" fill="white" style={{ marginLeft: 3 }} />
              </button>
            </div>
          </div>

          {/* RIGHT — white card, intro + bullets, matching Image 1 */}
          <Card className={`p-[24px] md:p-[28px] ${inView ? 'anim-slide-l delay-200' : 'opacity-0'}`}>
            <p className="text-[18px] text-[#444444] leading-[1.65] mb-[20px] m-0">
              Important factors that make a Hair system look natural are:
            </p>
            <div className="flex flex-col gap-[14px]">
              {secretBullets.map((b, i) => (
                <div key={i} className="flex gap-[10px] items-start">
                  <span className="text-[#121212] text-[18px] mt-[1px] flex-shrink-0">•</span>
                  <p className="text-[18px] text-[#444444] leading-[1.6] m-0">
                    <strong className="text-[#121212] font-semibold">{b.bold}</strong>
                    {b.text}
                  </p>
                </div>
              ))}
            </div>
          </Card>

        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   5. FAQ
───────────────────────────────────────────────────────────── */
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { ref, inView } = useInView();

  return (
    <section className="bg-[#F5F6F7] py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2 className="text-[26px] md:text-[44px] font-extrabold text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[56px]">
          Frequently Asked Questions
        </h2>

        <div ref={ref} className="max-w-[760px] mx-auto">
          <div className={`flex flex-col gap-[10px] mb-[24px] ${inView ? 'anim-fade-up' : 'opacity-0'}`}>
            {faqs.map((faq, i) => {
              const isOpen = openIndex === i;
              return (
                <Card key={i} className="overflow-hidden">
                  <button
                    className="w-full flex justify-between items-start gap-[16px] px-[20px] md:px-[24px] py-[20px] md:py-[22px] text-left bg-transparent border-none cursor-pointer"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                  >
                    <span
                      className="text-[20px] leading-[1.4]"
                      style={{ fontWeight: isOpen ? 700 : 500, color: isOpen ? '#121212' : 'rgba(18,18,18,0.7)' }}
                    >
                      {faq.q}
                    </span>
                    {isOpen
                      ? <ChevronUp size={18} className="flex-shrink-0 mt-[3px]" style={{ color: 'rgba(18,18,18,0.4)' }} />
                      : <ChevronDown size={18} className="flex-shrink-0 mt-[3px]" style={{ color: 'rgba(18,18,18,0.4)' }} />
                    }
                  </button>
                  {isOpen && (
                    <>
                      <div className="h-[1px] bg-[rgba(18,18,18,0.07)] mx-[20px] md:mx-[24px]" />
                      <p className="text-[18px] text-[#555555] leading-[1.7] px-[20px] md:px-[24px] pt-[16px] pb-[22px] m-0">
                        {faq.a}
                      </p>
                    </>
                  )}
                </Card>
              );
            })}
          </div>

          {/* Blue CTA card */}
          <Card
            className={`overflow-hidden ${inView ? 'anim-fade-up delay-300' : 'opacity-0'}`}
            style={{ background: 'linear-gradient(135deg, #4686FE 0%, #1769FF 100%)', border: 'none', boxShadow: '0 12px 32px rgba(23,105,255,0.3)' }}
          >
            <div className="p-[28px] md:p-[36px]">
              <h3 className="text-white text-[20px] font-extrabold tracking-[-0.3px] mb-[8px]">Still have questions?</h3>
              <p className="text-white/75 text-[18px] leading-[1.6] mb-[24px] m-0 max-w-[400px]">
                No worries, we're here to guide you. Talk to us, we will support you completely.
              </p>
              <button
                className="flex items-center gap-[8px] bg-white text-[#1769FF] px-[20px] py-[11px] rounded-[10px] text-[18px] font-bold transition-transform hover:scale-[1.02] duration-200"
                style={{ boxShadow: '0 4px 14px rgba(0,0,0,0.1)', border: 'none', cursor: 'pointer' }}
              >
                Send Queries <ArrowUpRight size={15} />
              </button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   6. HOW DO I ORDER MY HAIR SYSTEM?
   Sticky scroll: heading + video sticky left, step cards scroll right
───────────────────────────────────────────────────────────── */
function HowToOrderSection() {
  return (
    <section className="bg-white py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">
        <div className="order-sticky-layout">

          {/* LEFT — sticky */}
          <div className="order-sticky-left flex flex-col gap-[20px]">
            <h2 className="text-[24px] md:text-[36px] font-extrabold text-[#121212] leading-[1.2] tracking-[-0.5px] m-0">
              How Do I Order My<br />Hair System?
            </h2>

            {/* Video */}
            <div className="relative w-full rounded-[14px] overflow-hidden bg-[#0a0c10] h-[220px] md:h-[300px] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.18)]">
              <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-results-story-amit-after.png" alt="How To Order" fill className="object-cover object-center" style={{ opacity: 0.5 }} />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(5,7,10,0.85)] via-[rgba(5,7,10,0.4)] to-[rgba(5,7,10,0.15)]" />
              <div className="absolute top-0 left-0 right-0 bg-[#e00] flex items-center justify-center py-[10px] md:py-[13px]">
                <p className="text-white text-[14px] md:text-[20px] font-extrabold leading-none uppercase m-0 tracking-[0.02em]">
                  HOW TO ORDER ONLINE!
                </p>
              </div>
              <div className="absolute top-[42px] md:top-[58px] left-0 right-0 flex items-center justify-center">
                <p className="text-white text-[14px] md:text-[22px] font-extrabold leading-none uppercase m-0">
                  AHL HAIR SYSTEMS!
                </p>
              </div>
              <div className="absolute inset-0 flex items-center justify-center mt-[20px]">
                <button
                  className="w-[46px] h-[46px] md:w-[58px] md:h-[58px] rounded-full flex items-center justify-center transition-transform hover:scale-110 duration-200"
                  style={{ background: 'rgba(255,0,0,0.92)', boxShadow: '0 4px 20px rgba(255,0,0,0.4)' }}
                >
                  <Play size={18} color="white" fill="white" style={{ marginLeft: 3 }} />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT — scrollable step cards + bare CTAs */}
          <div className="flex flex-col gap-[14px]">
            {orderSteps.map((step) => (
              <Card key={step.n} className="p-[22px] md:p-[26px] flex gap-[16px] items-start">
                <div
                  className="w-[34px] h-[34px] rounded-full flex items-center justify-center flex-shrink-0 text-white text-[14px] font-extrabold"
                  style={{ background: 'linear-gradient(135deg, #4686FE, #1769FF)', boxShadow: '0 3px 10px rgba(23,105,255,0.25)' }}
                >
                  {step.n}
                </div>
                <p className="text-[18px] text-[#555555] leading-[1.65] m-0 pt-[5px]">
                  <strong className="text-[#121212] font-semibold">{step.bold}</strong>
                  {step.text}
                </p>
              </Card>
            ))}

            <div className="h-[4px]" />

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-[12px]">
              <button
                className="flex items-center justify-center gap-[8px] px-[28px] py-[14px] rounded-[10px] text-white text-[18px] font-bold transition-transform hover:scale-[1.01] duration-200 flex-1"
                style={{ background: 'linear-gradient(135deg, #4686FE, #1769FF)', boxShadow: '0 8px 24px rgba(23,105,255,0.3)', border: 'none', cursor: 'pointer' }}
              >
                Book Consultation <ArrowUpRight size={16} />
              </button>
              <button
                className="flex items-center justify-center gap-[8px] px-[28px] py-[14px] rounded-[10px] text-[#1769FF] text-[18px] font-bold border-2 border-[#1769FF] bg-white transition-transform hover:scale-[1.01] duration-200 flex-1"
                style={{ cursor: 'pointer' }}
              >
                Quality Check <ArrowUpRight size={16} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   PAGE ROOT
───────────────────────────────────────────────────────────── */
export default function CustomizedHairSystemsPage() {
  return (
    <main>
      <HeroSection />
      <TwoTypesSection />
      <Checklist />
      <SecretSection />
      <FAQSection />
      <HowToOrderSection />
      <CTA />
      <ResultsRealPeople />
    </main>
  );
}