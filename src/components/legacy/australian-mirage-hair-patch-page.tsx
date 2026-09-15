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
`;

/* ─────────────────────────────────────────────────────────────
   SVG ICONS
───────────────────────────────────────────────────────────── */
const svgIcons: Record<string, JSX.Element> = {
  iso: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/>
    </svg>
  ),
  ready: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  ),
  hair: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a5 5 0 0 1 5 5c0 3-2 5-5 8-3-3-5-5-5-8a5 5 0 0 1 5-5z"/>
    </svg>
  ),
  custom: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
    </svg>
  ),
  strand: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v20M6 6c1.5 2 4.5 2 6 0s4.5-2 6 0M6 12c1.5 2 4.5 2 6 0s4.5-2 6 0M6 18c1.5 2 4.5 2 6 0s4.5-2 6 0"/>
    </svg>
  ),
  amazon: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 12l2 2 4-4"/>
    </svg>
  ),
  video: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>
    </svg>
  ),
  support: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  cart: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
    </svg>
  ),
  affordable: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
  cert: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
    </svg>
  ),
};

/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────── */
const aboutBullets = [
  {
    bold: 'What Is Australian Mirage?',
    text: 'The Australian Mirage is one of our most popular premium hair patch systems. It features an ultra-thin, skin-like base that creates a seamless, completely undetectable hairline for a truly natural look.',
  },
  {
    bold: 'Natural Movement & Feel:',
    text: 'Crafted with 100% premium human hair, the Australian Mirage moves and flows exactly like natural hair — responding to wind, water, and activity with complete realism.',
  },
  {
    bold: 'Designed For Long-Term Wear:',
    text: 'The Australian Mirage base is specifically engineered for durability and comfort, providing a long-lasting bond that holds securely through swimming, exercise, and daily activities.',
  },
];

const methodsBullets = [
  {
    bold: 'Adhesive Bond Method:',
    text: 'Medical-grade liquid adhesive is applied around the perimeter of the base, providing a secure, long-lasting bond. This is the most popular attachment method for the Australian Mirage system.',
  },
  {
    bold: 'Tape Method:',
    text: 'Double-sided medical tape is placed around the base for a clean, even hold. This method is quick to apply, gentle on the scalp, and ideal for clients who prefer a less permanent bond.',
  },
];

const features = [
  { iconKey: 'iso',        bold: 'ISO Certified',                text: 'The Only ISO Certified hair system company in India to Guarantee You Quality.' },
  { iconKey: 'video',      bold: 'Access to Educational Videos', text: 'Our learning videos cover the essentials for a smooth start.' },
  { iconKey: 'ready',      bold: 'Ready to Wear',                text: 'Completely Styled and Cut Ready To Wear Hair System delivered at your Doorstep.' },
  { iconKey: 'support',    bold: 'Customer Support',             text: 'Our dedicated team provides expert guidance and prompt assistance for you.' },
  { iconKey: 'hair',       bold: '100% Human Hair',              text: 'We use premium Real Human Remy Hair for 100% natural-looking systems.' },
  { iconKey: 'cart',       bold: 'Order Online',                 text: 'Online ordering process makes it Easier to Order out of the Comfort of your home.' },
  { iconKey: 'custom',     bold: 'Fully Customisable',           text: 'Match any hairstyle from a scanning of hair system specs, from density to hairline.' },
  { iconKey: 'affordable', bold: 'Affordable',                   text: 'As an online platform, we offer premium hair systems at affordable prices.' },
  { iconKey: 'strand',     bold: 'Single Strand Implant',        text: 'Single-strand implantation mimics natural growth for hair matching Nordic density.' },
  { iconKey: 'cert',       bold: 'Certified by AIAO Bio',        text: 'We are certified by American International Accreditation Organisation.' },
  { iconKey: 'amazon',     bold: 'Certified by Amazon',          text: 'Certified by American Board of Accreditation Services for high-quality hair systems.' },
];

const faqs = [
  {
    q: 'What is the construction of Mirage Australian hair patches?',
    a: 'Mirage Australian hair patches feature a PU border with a skin base in between. This design combines the durability of the PU material with the natural appearance of the skin-based silk top at the center. The PU-based edges provide stability and secure attachment, while the skin-based silk top creates a realistic look.',
  },
  {
    q: 'Does the Mirage Australian patch provide a natural hairline?',
    a: 'Yes. The Australian Mirage system is specifically designed with an ultra-thin skin perimeter that creates a seamless, completely undetectable hairline, even at close range.',
  },
  {
    q: 'How durable are Mirage Australian hair patches?',
    a: 'With proper care and regular maintenance every 3–4 weeks, the Australian Mirage typically lasts 6–12 months. The ultra-thin skin base is designed for durability while maintaining its natural appearance.',
  },
  {
    q: 'Can Mirage Australian hair patches be customized?',
    a: 'Yes. Every Australian Mirage system is fully customised to match your hair colour, density, wave pattern, and scalp measurements. We design each piece specifically for your unique requirements.',
  },
  {
    q: 'Are Mirage Australian hair patches suitable for everyone?',
    a: 'The Australian Mirage is suitable for most people experiencing hair loss. A free consultation with our specialists will determine the best configuration for your specific hair type, scalp condition, and lifestyle.',
  },
  {
    q: 'Where can I find Mirage Australian hair patches?',
    a: 'You can order directly through our website or visit our centre. Book a free consultation to get started and our team will guide you through the entire process from measurement to delivery.',
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
          <h1 className={`text-[32px] md:text-[52px] font-extrabold text-[#121212] leading-[1.1] tracking-[-1.5px] mb-[20px] ${inView ? 'anim-fade-up' : 'opacity-0'}`}>
            Australian Mirage Hair Patch
          </h1>
          <p className={`text-[17px] md:text-[19px] text-[#555555] leading-[1.7] max-w-[560px] mx-auto ${inView ? 'anim-fade-up delay-200' : 'opacity-0'}`}>
            Experience the exceptional quality of the Australian Mirage Hair Patch and explore the finest hair replacement solutions we can offer you.
          </p>
        </div>

        <div className={`relative w-full rounded-[20px] md:rounded-[24px] overflow-hidden bg-[#0a0c10] h-[280px] md:h-[500px] shadow-[0px_24px_64px_0px_rgba(0,0,0,0.2)] ${inView ? 'anim-scale-in delay-300' : 'opacity-0'}`}>
          <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-results-story-sameer-after.png" alt="Australian Mirage Hair Patch" fill className="object-cover object-top" sizes="(max-width: 768px) 100vw, 720px" />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.88)] via-[rgba(10,12,16,0.25)] to-transparent" />
          <div className="absolute bottom-[24px] md:bottom-[40px] left-[24px] md:left-[48px]">
            <p className="text-white text-[22px] md:text-[36px] font-extrabold tracking-[0.06em] uppercase leading-none m-0">
              AUSTRALIAN MIRAGE
            </p>
            <p className="text-white/55 text-[13px] md:text-[18px] font-bold tracking-[0.2em] uppercase mt-[4px] m-0 italic">
              HAIR PATCH
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   2. ABOUT — bullets in white cards (left) + video (right)
───────────────────────────────────────────────────────────── */
function AboutSection() {
  const { ref, inView } = useInView();
  return (
    <section className="bg-[#F5F6F7] py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2 className="text-[26px] md:text-[44px] font-extrabold text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[64px]">
          About Australian Mirage<br />Hair Systems
        </h2>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-[48px] md:gap-[64px] items-center">

          {/* Cards left */}
          <div className={`flex flex-col gap-[16px] ${inView ? 'anim-slide-r' : 'opacity-0'}`}>
            {aboutBullets.map((b, i) => (
              <div key={i} className="flex gap-[14px] items-start bg-white rounded-[12px] border border-[rgba(18,18,18,0.06)] p-[20px] md:p-[24px] shadow-[0px_2px_8px_0px_rgba(0,0,0,0.04)]">
                <div className="w-[8px] h-[8px] rounded-full bg-[#1769FF] flex-shrink-0 mt-[9px]" />
                <p className="text-[15px] md:text-[16px] text-[#555555] leading-[1.75] m-0">
                  <strong className="text-[#121212] font-semibold">{b.bold}</strong>
                  {' '}{b.text}
                </p>
              </div>
            ))}
          </div>

          {/* Video right */}
          <div className={`relative w-full h-[260px] md:h-[400px] rounded-[16px] overflow-hidden bg-[#121212] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.12)] ${inView ? 'anim-slide-l delay-200' : 'opacity-0'}`}>
            <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-2.png" alt="About Australian Mirage" fill className="object-cover object-center" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(23,105,255,0.55) 0%, transparent 55%)' }} />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.85)] via-transparent to-transparent" />
            <div className="absolute bottom-[20px] left-[20px]">
              <div className="flex items-center gap-[6px] mb-[5px]">
                <div className="w-[7px] h-[7px] rounded-full bg-[#4686FE]" />
                <span className="text-white/60 text-[11px] font-bold tracking-[0.1em] uppercase">Undetectable</span>
              </div>
              <p className="text-white text-[18px] md:text-[22px] font-extrabold leading-[1.2] m-0">Hair System In</p>
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
   3. METHODS OF ATTACHMENT — video left + cards right
───────────────────────────────────────────────────────────── */
function MethodsSection() {
  const { ref, inView } = useInView();
  return (
    <section className="bg-white py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2 className="text-[26px] md:text-[44px] font-extrabold text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[64px]">
          Methods Of Attachment
        </h2>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-[48px] md:gap-[64px] items-center">

          {/* Video left */}
          <div className={`relative w-full h-[260px] md:h-[380px] rounded-[16px] overflow-hidden bg-[#121212] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.12)] ${inView ? 'anim-slide-r' : 'opacity-0'}`}>
            <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-1.png" alt="Methods Of Attachment" fill className="object-cover object-center" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(23,105,255,0.5) 0%, transparent 55%)' }} />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.65)] via-transparent to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="w-[52px] h-[52px] md:w-[64px] md:h-[64px] rounded-full flex items-center justify-center transition-transform hover:scale-110 duration-200"
                style={{ background: 'rgba(255,0,0,0.9)', boxShadow: '0 6px 24px rgba(255,0,0,0.4)' }}>
                <Play size={20} color="white" fill="white" style={{ marginLeft: 3 }} />
              </button>
            </div>
          </div>

          {/* Cards right */}
          <div className={`flex flex-col gap-[16px] ${inView ? 'anim-slide-l delay-200' : 'opacity-0'}`}>
            {methodsBullets.map((b, i) => (
              <div key={i} className="flex gap-[14px] items-start bg-[#F5F6F7] rounded-[12px] border border-[rgba(18,18,18,0.06)] p-[20px] md:p-[24px]">
                <div className="w-[8px] h-[8px] rounded-full bg-[#1769FF] flex-shrink-0 mt-[9px]" />
                <p className="text-[15px] md:text-[16px] text-[#555555] leading-[1.75] m-0">
                  <strong className="text-[#121212] font-semibold">{b.bold}</strong>
                  {' '}{b.text}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   4. WHY CHOOSE — video + 2-col SVG checkbox cards
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
          <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-3.png" alt="Why Choose American Hairline" fill className="object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.55)] via-transparent to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <button className="w-[60px] h-[60px] md:w-[80px] md:h-[80px] rounded-full flex items-center justify-center transition-transform hover:scale-105 duration-300"
              style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1.5px solid rgba(255,255,255,0.25)' }}>
              <Play size={24} color="white" fill="white" style={{ marginLeft: 3 }} />
            </button>
          </div>
        </div>

        {/* 2-col SVG checkbox card grid */}
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-[14px] md:gap-[16px]">
          {features.map((f, i) => (
            <div
              key={i}
              className={`flex gap-[16px] items-start p-[18px] md:p-[22px] bg-white rounded-[12px] border border-[rgba(18,18,18,0.05)] hover:shadow-[0px_4px_16px_0px_rgba(0,0,0,0.06)] transition-shadow duration-300 ${gridInView ? 'anim-fade-up' : 'opacity-0'}`}
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div
                className="w-[36px] h-[36px] rounded-[8px] flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #4686FE, #1769FF)', boxShadow: '0 4px 12px rgba(23,105,255,0.25)' }}
              >
                {svgIcons[f.iconKey]}
              </div>
              <p className="text-[15px] md:text-[16px] text-[#555555] leading-[1.7] m-0">
                <strong className="text-[#121212] font-semibold">{f.bold}</strong>
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
   MOBILE ORDER ROADMAP — vertical timeline, scroll-driven
───────────────────────────────────────────────────────────── */
function MobileOrderRoadmap({ tab, setTab }: { tab: 'mumbai' | 'outside'; setTab: (t: 'mumbai' | 'outside') => void }) {
  const steps = tab === 'mumbai' ? inMumbaiSteps : outsideMumbaiSteps;
  const [activeStep, setActiveStep] = useState(0);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    nodeRefs.current.forEach((el, i) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveStep(i); },
        { rootMargin: '-30% 0px -60% 0px', threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach(o => o.disconnect());
  }, [tab]);

  const spinePercent = steps.length > 1 ? (activeStep / (steps.length - 1)) * 100 : 0;

  return (
    <div>
      {/* Header */}
      <h2 style={{ fontSize: 26, fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.5px', color: '#121212', marginBottom: 28 }}>
        How Do I Order My<br />Hair System?
      </h2>

      {/* Toggle */}
      <div style={{ display: 'flex', marginBottom: 40 }}>
        <div style={{ display: 'flex', borderRadius: 999, padding: 3, border: '1.5px solid #2563EB' }}>
          {(['mumbai', 'outside'] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); setActiveStep(0); }}
              style={{
                padding: '9px 20px', borderRadius: 999, fontSize: 14, fontWeight: 600,
                background: tab === t ? '#2563EB' : 'transparent',
                color: tab === t ? '#fff' : '#2563EB',
                border: 'none', cursor: 'pointer', transition: 'all 0.2s ease',
              }}
            >
              {t === 'mumbai' ? "I'm in Mumbai" : "I'm Outside Mumbai"}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div style={{ position: 'relative' }}>
        {/* Spine track */}
        <div style={{
          position: 'absolute', left: 19, top: 20,
          width: 2, background: 'rgba(18,18,18,0.08)', borderRadius: 2,
          height: 'calc(100% - 40px)',
        }} />
        {/* Spine fill */}
        <div style={{
          position: 'absolute', left: 19, top: 20,
          width: 2, borderRadius: 2,
          background: 'linear-gradient(to bottom,#4686FE,#1769FF)',
          height: `calc(${spinePercent}% * (100% - 40px) / 100)`,
          maxHeight: 'calc(100% - 40px)',
          transition: 'height 0.5s cubic-bezier(0.4,0,0.2,1)',
        }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {steps.map((step, i) => {
            const isActive = i === activeStep;
            const isDone   = i < activeStep;

            return (
              <div key={`${tab}-${i}`} style={{
                display: 'flex', alignItems: 'flex-start', gap: 20,
                paddingBottom: i < steps.length - 1 ? 52 : 0,
                position: 'relative',
              }}>
                {/* Node */}
                <div
                  ref={el => { nodeRefs.current[i] = el; }}
                  style={{
                    width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1, marginTop: 2,
                    background: isActive
                      ? 'linear-gradient(135deg,#4686FE,#1769FF)'
                      : isDone ? 'rgba(23,105,255,0.12)' : '#ECEEF0',
                    border: `2px solid ${isActive || isDone ? '#1769FF' : '#D8DBDF'}`,
                    boxShadow: isActive ? '0 0 0 5px rgba(23,105,255,0.12)' : 'none',
                    transition: 'all 0.45s ease',
                  }}
                >
                  {isDone ? (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2.5 7L5.5 10L11.5 4" stroke="#1769FF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <span style={{
                      fontSize: 12, fontWeight: 800,
                      color: isActive ? '#fff' : 'rgba(18,18,18,0.3)',
                      letterSpacing: '0.04em', transition: 'color 0.3s ease',
                    }}>
                      {String(step.n).padStart(2, '0')}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div style={{ flex: 1, paddingTop: 4 }}>
                  <p style={{
                    fontSize: 11, fontWeight: 700, letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: isActive || isDone ? '#1769FF' : 'rgba(18,18,18,0.28)',
                    marginBottom: 4, transition: 'color 0.4s ease',
                  }}>
                    Step {String(step.n).padStart(2, '0')}
                  </p>
                  <h3 style={{
                    fontSize: 18, fontWeight: 700, letterSpacing: '-0.3px', lineHeight: 1.3,
                    color: isActive || isDone ? '#121212' : 'rgba(18,18,18,0.32)',
                    marginBottom: 6, transition: 'color 0.4s ease',
                  }}>
                    {step.bold}
                  </h3>
                  <p style={{
                    fontSize: 14,
                    color: isActive || isDone ? 'rgba(18,18,18,0.58)' : 'rgba(18,18,18,0.25)',
                    lineHeight: 1.65, margin: 0, transition: 'color 0.4s ease',
                  }}>
                    {step.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 44 }}>
        <button style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          padding: '14px 28px', borderRadius: 999, color: '#fff', fontSize: 15, fontWeight: 700,
          background: '#2563EB', border: 'none', cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(37,99,235,0.25)',
        }}>
          Book A Consultation
          <ArrowUpRight size={15} />
        </button>
        <button style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          padding: '14px 28px', borderRadius: 999, color: '#2563EB', fontSize: 15, fontWeight: 700,
          background: '#fff', border: '1.5px solid #2563EB', cursor: 'pointer',
        }}>
          Google Map Location
          <ArrowUpRight size={15} />
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   5. HOW TO ORDER — sticky left + scrollable right steps
───────────────────────────────────────────────────────────── */

const inMumbaiSteps = [
  { n: 1, bold: 'Book a Consultation',   text: 'Schedule a free consultation at our center. Our team will walk you through everything you need to know before getting started.' },
  { n: 2, bold: 'Visit Us in Khar West', text: 'Come to our Mumbai center for a personal meeting with our hair specialists who will guide you through the process.' },
  { n: 3, bold: 'Discuss Your Needs',    text: 'Clear all your doubts about the process face-to-face with our experts. We listen carefully to understand your exact requirements.' },
  { n: 4, bold: 'Sample & Mould',        text: 'We take precise measurements and create your custom mould, ensuring a perfect fit that looks completely natural.' },
  { n: 5, bold: 'Order Placed!',         text: 'Your custom hair system goes into production. Sit back, relax, and we will deliver it directly to you.' },
];

const outsideMumbaiSteps = [
  { n: 1, bold: 'Book a Consultation',    text: 'Start by booking a free online consultation with our specialists. We will assess your needs and guide you remotely.' },
  { n: 2, bold: 'Talk To Us Live',        text: 'Connect with our hair experts over video. They will recommend the perfect Australian Mirage configuration for you.' },
  { n: 3, bold: 'Check Your Needs',       text: 'We take precise scalp measurements remotely and record all your hair specifications for a fully custom system.' },
  { n: 4, bold: 'Sample & Mould Kit',     text: 'We send you a mould kit with full instructions so we can create an exact fit from wherever you are.' },
  { n: 5, bold: 'System Made & Shipped!', text: 'Your Australian Mirage is crafted, quality-checked, and delivered directly to your door nationwide.' },
];

function HowToOrderSection() {
  const [tab, setTab] = useState<'mumbai' | 'outside'>('mumbai');
  const steps = tab === 'mumbai' ? inMumbaiSteps : outsideMumbaiSteps;

  return (
    <section className="bg-white w-full">

      {/* ── MOBILE layout: roadmap timeline ── */}
      <div className="lg:hidden w-full max-w-[1440px] mx-auto px-4 md:px-10 py-[72px]">
        <MobileOrderRoadmap tab={tab} setTab={setTab} />
      </div>

      {/* ── DESKTOP sticky-scroll layout ── */}
      <div className="hidden lg:flex w-full max-w-[1440px] mx-auto px-10 xl:px-[160px] gap-[80px] xl:gap-[100px]">

        {/* ── LEFT — sticky panel, always fully on screen ── */}
        <div
          className="w-[42%] flex-shrink-0 flex flex-col justify-center gap-[28px]"
          style={{
            position: 'sticky',
            top: 0,
            height: '100vh',
            alignSelf: 'flex-start',
          }}
        >
          <h2 className="text-[38px] xl:text-[44px] font-extrabold text-[#121212] leading-[1.15] tracking-[-1px]">
            How Do I Order My Hair System?
          </h2>

          {/* Video card — 5:4 aspect ratio */}
          <div
            className="relative w-full rounded-[20px] overflow-hidden bg-[#0a0c10]"
            style={{ aspectRatio: '5 / 4', boxShadow: '0 16px 48px rgba(0,0,0,0.18)' }}
          >
            <Image
              src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-results-story-amit-after.png"
              alt="How To Order AHL Hair Systems"
              fill
              className="object-cover object-center"
              style={{ opacity: 0.45 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(5,7,10,0.92)] via-[rgba(5,7,10,0.55)] to-[rgba(5,7,10,0.25)]" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-[24px] gap-[6px]">
              <p className="text-white text-[26px] xl:text-[30px] font-extrabold leading-[1.1] uppercase m-0">
                HOW TO ORDER{' '}
                <span style={{ color: '#F5C518' }}>ONLINE!</span>
              </p>
              <p className="text-white text-[20px] xl:text-[24px] font-extrabold leading-[1.1] uppercase m-0">
                AHL HAIR SYSTEMS!
              </p>
            </div>
            <div className="absolute inset-0 flex items-end justify-center pb-[24px]">
              <button
                className="w-[56px] h-[56px] rounded-full flex items-center justify-center transition-transform hover:scale-110 duration-200"
                style={{ background: 'rgba(255,0,0,0.92)', boxShadow: '0 4px 20px rgba(255,0,0,0.4)' }}
              >
                <Play size={20} color="white" fill="white" style={{ marginLeft: 3 }} />
              </button>
            </div>
          </div>
        </div>

        {/* ── RIGHT — toggle sticky + step cards scroll + CTAs resume normal scroll ── */}
        <div
          className="flex-1 flex flex-col"
          style={{ minHeight: '100vh' }}
        >
          {/* Top spacer — vertically centres the right content against the left panel on entry */}
          <div style={{ flex: '0 0 auto', height: 'calc((100vh - 520px) / 2)' }} />

          {/* Toggle — sticky at the top of the viewport while scrolling through steps */}
          <div
            className="bg-white pb-[20px]"
            style={{ position: 'sticky', top: 0, zIndex: 10 }}
          >
            <div className="flex">
              <div className="flex rounded-full p-[3px]" style={{ border: '1.5px solid #2563EB' }}>
                {(['mumbai', 'outside'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className="px-[28px] py-[10px] rounded-full text-[15px] font-semibold transition-all duration-200"
                    style={{
                      background: tab === t ? '#2563EB' : 'transparent',
                      color: tab === t ? '#fff' : '#2563EB',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    {t === 'mumbai' ? "I'm in Mumbai" : "I'm Outside Mumbai"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Step cards — scroll through these in normal page flow */}
          <div className="flex flex-col gap-[16px] mt-[4px]">
            {steps.map((step) => (
              <div
                key={`${tab}-${step.n}`}
                className="flex gap-[20px] items-start p-[28px] bg-white rounded-[16px] border border-[rgba(18,18,18,0.08)] transition-all duration-300"
                style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}
              >
                <div
                  className="w-[36px] h-[36px] rounded-full flex items-center justify-center flex-shrink-0 text-white text-[15px] font-bold"
                  style={{ background: '#2563EB', minWidth: 36 }}
                >
                  {step.n}
                </div>
                <div>
                  <p className="text-[16px] font-bold text-[#111111] leading-[1.3] m-0 mb-[8px]">
                    {step.bold}
                  </p>
                  <p className="text-[15px] text-[#666666] leading-[1.7] m-0">
                    {step.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA buttons — once these scroll into view, the sticky left panel
              naturally releases and normal page scroll continues */}
          <div className="flex flex-row gap-[14px] mt-[32px] pb-[80px]">
            <button
              className="flex items-center justify-center gap-[8px] px-[28px] py-[14px] rounded-full text-white text-[15px] font-bold transition-transform hover:scale-[1.01] duration-200"
              style={{ background: '#2563EB', boxShadow: '0 8px 24px rgba(37,99,235,0.25)', border: 'none', cursor: 'pointer' }}
            >
              Book A Consultation <ArrowUpRight size={16} />
            </button>
            <button
              className="flex items-center justify-center gap-[8px] px-[28px] py-[14px] rounded-full text-[#2563EB] text-[15px] font-bold bg-white transition-transform hover:scale-[1.01] duration-200"
              style={{ border: '1.5px solid #2563EB', cursor: 'pointer' }}
            >
              Google Map Location <ArrowUpRight size={16} />
            </button>
          </div>

          {/* Bottom spacer — ensures the section is tall enough that the left panel
              stays locked until the CTAs have fully scrolled into view */}
          <div style={{ flex: '0 0 auto', height: 'calc((100vh - 520px) / 2)' }} />
        </div>

      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   6. FAQ — exact match to screenshot
───────────────────────────────────────────────────────────── */
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { ref, inView } = useInView();

  return (
    <section className="bg-[#F0F2F5] py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2 className="text-[28px] md:text-[40px] font-extrabold text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[28px] md:mb-[36px]">
          Frequently Asked Questions
        </h2>

        <div ref={ref} className="max-w-[600px] mx-auto">

          <div className={`flex flex-col gap-[10px] mb-[12px] ${inView ? 'anim-fade-up' : 'opacity-0'}`}>
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white rounded-[14px] overflow-hidden"
                style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
              >
                <button
                  className="w-full flex justify-between items-start gap-[16px] px-[20px] py-[18px] text-left cursor-pointer"
                  style={{ background: 'none', border: 'none' }}
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                >
                  <span className="text-[15px] md:text-[15px] font-semibold text-[#111111] leading-[1.45]">
                    {faq.q}
                  </span>
                  <span
                    className="flex-shrink-0 text-[#999999] leading-none select-none"
                    style={{ fontSize: 22, fontWeight: 300, marginTop: 1 }}
                  >
                    {openIndex === i ? '×' : '+'}
                  </span>
                </button>
                {openIndex === i && (
                  <p className="text-[14px] md:text-[14px] text-[#666666] leading-[1.7] px-[20px] pb-[20px] m-0">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Blue CTA card */}
          <div
            className={`rounded-[14px] p-[24px] md:p-[28px] mt-[10px] ${inView ? 'anim-fade-up delay-300' : 'opacity-0'}`}
            style={{ background: '#2563EB', boxShadow: '0 4px 20px rgba(37,99,235,0.35)' }}
          >
            <h3 className="text-white text-[20px] md:text-[22px] font-extrabold tracking-[-0.2px] mb-[6px] leading-[1.2]">
              Still have questions?
            </h3>
            <p className="text-white/70 text-[14px] leading-[1.6] mb-[20px] m-0">
              No worries, we're here to guide you. Talk to us, we will explain everything.
            </p>
            <button
              className="flex items-center gap-[7px] bg-white text-[#2563EB] px-[18px] py-[10px] rounded-[8px] text-[14px] font-semibold transition-transform hover:scale-[1.02] duration-200"
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)', border: 'none', cursor: 'pointer' }}
            >
              Need Guidance <ArrowUpRight size={14} />
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
export default function AustralianMiragePage() {
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