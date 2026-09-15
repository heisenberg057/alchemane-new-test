'use client';

import { useState, useRef, useEffect } from 'react';
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
  .journey-sticky-panel,
  .order-sticky-panel {
    position: sticky;
    top: 100px;
    align-self: flex-start;
  }

  /* Journey stage cards */
  .stage-card-item {
    background: #fff;
    border: 1px solid rgba(18,18,18,0.08);
    border-radius: 16px;
    padding: 22px 26px;
  }

  /* Order step cards */
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
const designingBullets = [
  {
    text: 'Designing a non-surgical hair system is the most important step in the hair replacement process. The expert must match the system\'s hair texture, volume, and color with your natural hair so it looks realistic, fashionable, and blends seamlessly.',
  },
  {
    text: 'Creating the right hair system requires understanding your desired look, selecting the appropriate base, and choosing a system that suits your lifestyle and the time and effort you are willing to invest in maintenance.',
  },
  {
    text: 'Stick-on hair systems typically require servicing every 20 to 30 days, while clip-on systems require basic care such as shampooing, conditioning, and styling, which can usually be done by yourself.',
    highlight: { 'hair texture, volume, and color': true, 'natural hair': true, 'desired look': true, 'appropriate base': true, 'require servicing': true, 'require basic care': true },
  },
];

const pros = [
  { bold: 'Self confidence', text: 'Hair loss can be very defeating for a man and can impact how he feels about himself. We do our best to design systems that restore confidence.' },
  { bold: 'It\'s Reversible', text: 'If you decide that you are no longer interested in wearing a hair system, there is no permanent commitment; you are always free to stop.' },
  { bold: 'No Pain/No Bleeding', text: 'Unlike surgical methods, there is no pain or bleeding involved with the non-surgical method.' },
  { bold: 'Get The Density You Desire', text: 'With non-surgical hair systems, you can achieve your desired density. This is not the case with surgical options.' },
  { bold: 'No Side Effects', text: 'At American Hairline, we care about our clients\' health. Our systems are bacteria resistant and extremely safe.' },
];

const cons = [
  { bold: 'System Lifespan', text: 'Hair non-surgical hair systems need to be replaced periodically as the base material wears over time.' },
  { bold: 'Maintenance Schedule', text: 'If you have chosen the stick-on method, you will need regular professional servicing every 3-4 weeks.' },
];

const journeySteps = [
  { title: 'Hair Loss Stage 1:', desc: 'Minor recession at the temples. Hair density remains largely intact. A small frontal patch or clip-on system addresses this stage perfectly.' },
  { title: 'Hair Loss Stage 2:', desc: 'Recession deepens at the temples and the crown begins to thin. A combined front and crown patch is recommended for natural coverage.' },
  { title: 'Hair Loss Stage 3:', desc: 'Significant thinning across the front and crown. A full coverage system provides the most natural and complete result at this stage.' },
  { title: 'Hair Loss Stage 4:', desc: 'Extensive balding across the top. A full bespoke system matched precisely to your remaining hair provides seamless, undetectable coverage.' },
  { title: 'Hair Loss Stage 5:', desc: 'Near-complete loss on top with a remaining horseshoe of hair at the sides. A full cap system or full coverage patch delivers the best result.' },
  { title: 'Hair Loss Stage 6:', desc: 'Complete baldness on top. A complete hair system with a custom-designed hairline restores a full, completely natural-looking head of hair.' },
];

const orderStepsMumbai = [
  { n: 1, bold: 'Book a Consultation', text: 'Schedule a free consultation at our center.' },
  { n: 2, bold: 'Visit Us in Khar West', text: 'Come to our Mumbai center for a personal meeting.' },
  { n: 3, bold: 'Discuss Your Needs', text: 'Clear all your doubts about the process face-to-face with our experts.' },
  { n: 4, bold: 'Sample & Mould', text: 'We take precise measurements and create your custom mould.' },
  { n: 5, bold: 'Order Placed!', text: 'Your custom hair system goes into production; sit back and relax.' },
];

const orderStepsOutside = [
  { n: 1, bold: 'Book Consultation:', text: ' Start with a free consultation - online or in person - with our non-surgical specialists.' },
  { n: 2, bold: 'Talk To Us Live:', text: ' Our experts assess your hair loss and lifestyle to recommend the ideal system configuration.' },
  { n: 3, bold: 'Check Your Needs:', text: ' We take precise scalp measurements and note all your specifications for production.' },
  { n: 4, bold: 'System Made:', text: ' Your system is crafted, quality-checked, and delivered directly to your door within 3-4 weeks.' },
];

const faqs = [
  {
    q: 'What is non-surgical?',
    a: 'Non-surgical hair replacement involves attaching a custom-made hair system to your scalp using medical-grade adhesives or clips - no surgery, no incisions, and no downtime. The result is a completely natural-looking head of hair from the same day of fitting.',
  },
  {
    q: 'How long does this last?',
    a: 'With proper care and regular maintenance, a quality non-surgical hair system typically lasts 6-12 months. Premium base materials and correct adhesive use extend the lifespan significantly.',
  },
  {
    q: 'Still have questions?',
    a: 'Our team is always available to answer any questions you may have. Book a free consultation or contact us directly by phone, WhatsApp, or email - we are here to guide you every step of the way.',
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
   SVG ICONS — exact from reference image
───────────────────────────────────────────────────────────── */
function CheckIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="22" height="22" rx="6" fill="#22C55E" />
      <path d="M6 11.5L9.5 15L16 8" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CrossIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="22" height="22" rx="6" fill="#EF4444" />
      <path d="M7.5 7.5L14.5 14.5M14.5 7.5L7.5 14.5" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
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
            Non-Surgical<br />Hair Replacement
          </h1>
          <p
            className={`text-[#555555] leading-[1.7] max-w-[540px] mx-auto ${inView ? 'anim-fade-up delay-200' : 'opacity-0'}`}
            style={{ fontSize: '16px', fontWeight: 500 }}
          >
            AHL has the most effective non-surgical hair replacement solution. Experience the most natural-looking and undetectable hair replacement in India.
          </p>
        </div>

        <div className={`relative w-full rounded-[20px] md:rounded-[24px] overflow-hidden bg-[#121212] h-[280px] md:h-[500px] shadow-[0px_24px_64px_0px_rgba(0,0,0,0.2)] ${inView ? 'anim-scale-in delay-300' : 'opacity-0'}`}>
          <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-results-story-sameer-after.png" alt="Non-Surgical Hair Replacement" fill className="object-cover object-top" sizes="(max-width: 768px) 100vw, 720px" />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.65)] via-transparent to-transparent" />
        </div>

      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   2. ABOUT NON-SURGICAL HAIR SYSTEMS
───────────────────────────────────────────────────────────── */
function AboutSection() {
  const { ref, inView } = useInView();
  return (
    <section className="bg-[#F5F6F7] py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2
          className="text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[16px] md:mb-[20px]"
          style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 800 }}
        >
          About Non-Surgical<br />Hair Systems
        </h2>

        <p
          className="text-center text-[#555555] max-w-[520px] mx-auto mb-[48px] md:mb-[64px]"
          style={{ fontSize: '16px', fontWeight: 500, lineHeight: '1.7' }}
        >
          There are two types of non-surgical hair systems. They differ mainly in their methods
          of application and suitability for your lifestyle.
        </p>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-[32px] md:gap-[48px] items-center">

          {/* Video left */}
          <div className={`relative w-full h-[280px] md:h-[420px] rounded-[16px] overflow-hidden bg-[#0a0c10] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.15)] ${inView ? 'anim-slide-r' : 'opacity-0'}`}>
            <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-1.png" alt="Detailed INFO About Premium Hair Systems" fill className="object-cover object-center" style={{ opacity: 0.45 }} />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(5,7,10,0.9)] via-[rgba(5,7,10,0.55)] to-[rgba(5,7,10,0.25)]" />
            <div className="absolute inset-0 flex items-center px-[24px] md:px-[32px]">
              <div>
                <p className="text-white/70 uppercase m-0 mb-[4px]" style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.06em' }}>Detailed INFO</p>
                <p className="text-white leading-[1.1] m-0 mb-[2px]" style={{ fontSize: 'clamp(22px, 2.5vw, 32px)', fontWeight: 800 }}>
                  About <span style={{ color: '#F5C518' }}>PREMIUM</span>
                </p>
                <p className="text-white leading-[1.1] m-0 mb-[2px]" style={{ fontSize: 'clamp(22px, 2.5vw, 32px)', fontWeight: 800 }}>HAIR SYSTEMS</p>
                <p className="text-white/60 leading-[1.1] m-0" style={{ fontSize: 'clamp(18px, 2vw, 26px)', fontWeight: 800 }}>(PATCHES)</p>
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                className="w-[52px] h-[52px] md:w-[64px] md:h-[64px] rounded-full flex items-center justify-center transition-transform hover:scale-110 duration-200"
                style={{ background: 'rgba(255,0,0,0.9)', boxShadow: '0 6px 24px rgba(255,0,0,0.4)' }}
              >
                <Play size={20} color="white" fill="white" style={{ marginLeft: 3 }} />
              </button>
            </div>
          </div>

          {/* Right: two system type cards */}
          <div className={`flex flex-col gap-[16px] ${inView ? 'anim-slide-l delay-200' : 'opacity-0'}`}>

            {/* Stick-On System */}
            <div
              className="bg-white rounded-[16px] p-[24px] md:p-[28px]"
              style={{ border: '1px solid rgba(18,18,18,0.07)', boxShadow: '0 2px 12px rgba(18,18,18,0.06)' }}
            >
              <div className="flex items-center gap-[12px] mb-[10px]">
                <div
                  className="w-[36px] h-[36px] rounded-[10px] flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(23,105,255,0.08)' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1769FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 12h8M12 8v8" />
                  </svg>
                </div>
                <p style={{ fontSize: '20px', fontWeight: 700, color: '#121212', margin: 0 }}>Stick-On System</p>
              </div>
              <p style={{ fontSize: '16px', fontWeight: 500, color: '#555555', lineHeight: '1.65', margin: '0 0 18px 0' }}>
                The top area of the head needs to be shaved for a secure, flush fit using specialised adhesives.
              </p>
              <button
                className="flex items-center gap-[6px] px-[16px] py-[9px] rounded-[8px] text-white transition-transform hover:scale-[1.02] duration-200"
                style={{ fontSize: '14px', fontWeight: 700, background: 'linear-gradient(135deg, #4686FE, #1769FF)', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(23,105,255,0.25)' }}
              >
                Explore Now <ArrowUpRight size={13} />
              </button>
            </div>

            {/* Clip-On System */}
            <div
              className="bg-white rounded-[16px] p-[24px] md:p-[28px]"
              style={{ border: '1px solid rgba(18,18,18,0.07)', boxShadow: '0 2px 12px rgba(18,18,18,0.06)' }}
            >
              <div className="flex items-center gap-[12px] mb-[10px]">
                <div
                  className="w-[36px] h-[36px] rounded-[10px] flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(23,105,255,0.08)' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1769FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  </svg>
                </div>
                <p style={{ fontSize: '20px', fontWeight: 700, color: '#121212', margin: 0 }}>Clip-On System</p>
              </div>
              <p style={{ fontSize: '16px', fontWeight: 500, color: '#555555', lineHeight: '1.65', margin: '0 0 18px 0' }}>
                Easily attachable and removable using secure clips. No shaving required, perfect for flexible wear.
              </p>
              <button
                className="flex items-center gap-[6px] px-[16px] py-[9px] rounded-[8px] text-white transition-transform hover:scale-[1.02] duration-200"
                style={{ fontSize: '14px', fontWeight: 700, background: 'linear-gradient(135deg, #4686FE, #1769FF)', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(23,105,255,0.25)' }}
              >
                Explore Now <ArrowUpRight size={13} />
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   3. DESIGNING A NON-SURGICAL HAIR SYSTEM
   White bg. Bullet list left (matching reference image) + video right.
───────────────────────────────────────────────────────────── */
function DesigningSection() {
  const { ref, inView } = useInView();
  return (
    <section className="bg-white py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2
          className="text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[64px]"
          style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 800 }}
        >
          Designing A Non-Surgical Hair System
        </h2>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-[48px] md:gap-[64px] items-start">

          {/* Left: bullet list card matching reference */}
          <div className={`${inView ? 'anim-slide-r' : 'opacity-0'}`}>
            <div
              className="rounded-[16px] overflow-hidden"
              style={{ background: '#fff', boxShadow: '0 2px 16px rgba(18,18,18,0.08)', border: '1px solid rgba(18,18,18,0.07)' }}
            >
              <ul style={{ margin: 0, padding: '24px 28px', listStyle: 'disc', paddingLeft: '44px' }}>
                <li style={{ fontSize: '15px', fontWeight: 400, color: '#333', lineHeight: '1.75', marginBottom: '16px' }}>
                  Designing a non-surgical hair system is the most important step in the hair replacement process. The expert must match the system's{' '}
                  <strong style={{ fontWeight: 700, color: '#121212' }}>hair texture, volume</strong>, and{' '}
                  <strong style={{ fontWeight: 700, color: '#121212' }}>color</strong> with your{' '}
                  <strong style={{ fontWeight: 700, color: '#121212' }}>natural hair</strong> so it looks realistic, fashionable, and blends seamlessly.
                </li>
                <li style={{ fontSize: '15px', fontWeight: 400, color: '#333', lineHeight: '1.75', marginBottom: '16px' }}>
                  Creating the right hair system requires understanding your{' '}
                  <strong style={{ fontWeight: 700, color: '#121212' }}>desired look</strong>, selecting the{' '}
                  <strong style={{ fontWeight: 700, color: '#121212' }}>appropriate base</strong>, and choosing a system that suits your lifestyle and the time and effort you are willing to invest in maintenance.
                </li>
                <li style={{ fontSize: '15px', fontWeight: 400, color: '#333', lineHeight: '1.75', marginBottom: 0 }}>
                  <strong style={{ fontWeight: 700, color: '#121212' }}>Stick-on</strong> hair systems typically{' '}
                  <strong style={{ fontWeight: 700, color: '#121212' }}>require servicing</strong> every 20 to 30 days, while{' '}
                  <strong style={{ fontWeight: 700, color: '#121212' }}>clip-on</strong> systems{' '}
                  <strong style={{ fontWeight: 700, color: '#121212' }}>require basic care</strong> such as shampooing, conditioning, and styling, which can usually be done by yourself.
                </li>
              </ul>
            </div>
          </div>

          {/* Video right */}
          <div className={`relative w-full h-[260px] md:h-[360px] rounded-[16px] overflow-hidden bg-[#121212] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.12)] ${inView ? 'anim-slide-l delay-200' : 'opacity-0'}`}>
            <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-2.png" alt="Designing Hair System" fill className="object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.6)] via-transparent to-transparent" />
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
   4. BENEFITS — side by side Pros + Cons with specific SVG icons
───────────────────────────────────────────────────────────── */
function BenefitsSection() {
  const { ref: videoRef, inView: videoInView } = useInView(0.1);
  const { ref: listRef, inView: listInView } = useInView(0.1);
  return (
    <section className="bg-[#F5F6F7] py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2
          className="text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[56px]"
          style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 800 }}
        >
          Benefits Of Non Surgical<br />Hair Systems
        </h2>

        {/* Full-width video */}
        <div
          ref={videoRef}
          className={`relative w-full rounded-[20px] overflow-hidden bg-[#121212] h-[240px] md:h-[440px] shadow-[0px_16px_48px_0px_rgba(0,0,0,0.15)] mb-[48px] ${videoInView ? 'anim-scale-in' : 'opacity-0'}`}
        >
          <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-results-story-amit-after.png" alt="Benefits Non-Surgical" fill className="object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.6)] via-transparent to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              className="w-[56px] h-[56px] md:w-[72px] md:h-[72px] rounded-full flex items-center justify-center transition-transform hover:scale-105 duration-300"
              style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1.5px solid rgba(255,255,255,0.25)' }}
            >
              <Play size={22} color="white" fill="white" style={{ marginLeft: 3 }} />
            </button>
          </div>
        </div>

        {/* Pros + Cons side by side */}
        <div ref={listRef} className={`grid grid-cols-1 md:grid-cols-2 gap-[40px] ${listInView ? 'anim-fade-up' : 'opacity-0'}`}>

          {/* Pros */}
          <div>
            <h3 className="text-[#121212] mb-[20px]" style={{ fontSize: '20px', fontWeight: 700 }}>Pros:</h3>
            <div className="flex flex-col gap-[14px]">
              {pros.map((p, i) => (
                <div
                  key={i}
                  className="flex gap-[12px] items-start p-[16px] bg-white rounded-[12px]"
                  style={{ border: '1px solid rgba(18,18,18,0.06)', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}
                >
                  <div className="flex-shrink-0 mt-[1px]">
                    <CheckIcon />
                  </div>
                  <div>
                    <p style={{ fontSize: '16px', fontWeight: 700, color: '#121212', margin: '0 0 4px 0' }}>{p.bold}</p>
                    <p style={{ fontSize: '15px', fontWeight: 400, color: '#555555', lineHeight: '1.6', margin: 0 }}>{p.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cons */}
          <div>
            <h3 className="text-[#121212] mb-[20px]" style={{ fontSize: '20px', fontWeight: 700 }}>Cons:</h3>
            <div className="flex flex-col gap-[14px]">
              {cons.map((c, i) => (
                <div
                  key={i}
                  className="flex gap-[12px] items-start p-[16px] bg-white rounded-[12px]"
                  style={{ border: '1px solid rgba(18,18,18,0.06)', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}
                >
                  <div className="flex-shrink-0 mt-[1px]">
                    <CrossIcon />
                  </div>
                  <div>
                    <p style={{ fontSize: '16px', fontWeight: 700, color: '#121212', margin: '0 0 4px 0' }}>{c.bold}</p>
                    <p style={{ fontSize: '15px', fontWeight: 400, color: '#555555', lineHeight: '1.6', margin: 0 }}>{c.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   5. THE HAIR LOSS JOURNEY OF A MAN
   Desktop: sticky LEFT panel (title above video, 16:9 video, no dot bar).
            scrolling cards RIGHT. CTA full-width below cards.
   Mobile:  video + vertical roadmap.
───────────────────────────────────────────────────────────── */
function HairLossJourneySection() {
  const [activeStage, setActiveStage] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const { ref: mobileVideoRef, inView: mobileVideoInView } = useInView(0.1);
  const { ref: mobileStepsRef, inView: mobileStepsInView } = useInView(0.1);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveStage(i); },
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

          {/* LEFT sticky panel: title + 16:9 video (no dot bar) */}
          <div
            className="journey-sticky-panel"
            style={{ width: '42%', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            {/* Heading sticky above video */}
            <h2
              className="text-[#121212] leading-[1.2] tracking-[-0.5px]"
              style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 800, margin: 0 }}
            >
              The Hair Loss<br />Journey Of A Man
            </h2>

            {/* 16:9 video */}
            <div
              className="relative w-full rounded-[20px] overflow-hidden bg-[#e0e8f0] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.1)]"
              style={{ aspectRatio: '16 / 9' }}
            >
              <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-4.png" alt="Hair Loss Journey" fill className="object-cover object-center" />
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  className="w-[52px] h-[52px] md:w-[64px] md:h-[64px] rounded-full flex items-center justify-center transition-transform hover:scale-105 duration-300"
                  style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', border: '1.5px solid rgba(255,255,255,0.3)' }}
                >
                  <Play size={20} color="white" fill="white" style={{ marginLeft: 3 }} />
                </button>
              </div>
            </div>

            {/* Intro text */}
            <p style={{ fontSize: '16px', fontWeight: 500, color: '#555555', lineHeight: '1.7', margin: 0 }}>
              Let us follow the journey of Alex, a common man from Hyderabad:
            </p>
          </div>

          {/* RIGHT: scrolling stage cards + full-width CTA */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {journeySteps.map((step, i) => (
              <div
                key={i}
                ref={(el) => { cardRefs.current[i] = el; }}
                className="stage-card-item"
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                  <div style={{
                    width: '30px', height: '30px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #4686FE, #1769FF)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, color: '#fff', fontSize: '13px', fontWeight: 700,
                  }}>
                    {i + 1}
                  </div>
                  <p style={{ fontSize: '20px', fontWeight: 700, color: '#121212', margin: 0 }}>{step.title}</p>
                </div>
                <p style={{ fontSize: '16px', fontWeight: 500, color: '#555555', lineHeight: '1.7', margin: 0 }}>{step.desc}</p>
              </div>
            ))}

            {/* Full-width CTA card — same width as cards column */}
            <div
              className="w-full rounded-[16px] p-[28px] md:p-[32px]"
              style={{ background: 'linear-gradient(135deg, #4686FE 0%, #1769FF 100%)', boxShadow: '0 12px 32px rgba(23,105,255,0.3)', marginTop: '8px' }}
            >
              <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', marginBottom: '8px', lineHeight: '1.2' }}>
                Is the hair system detectable?
              </h3>
              <p style={{ fontSize: '16px', fontWeight: 500, color: 'rgba(255,255,255,0.8)', lineHeight: '1.6', marginBottom: '20px' }}>
                No! If designed the right way, the hair system is not detectable at all.
              </p>
              <button
                className="flex items-center gap-[8px] bg-white text-[#1769FF] px-[20px] py-[11px] rounded-[10px] transition-transform hover:scale-[1.02] duration-200"
                style={{ fontSize: '15px', fontWeight: 700, boxShadow: '0 4px 14px rgba(0,0,0,0.1)', border: 'none', cursor: 'pointer' }}
              >
                Speak To An Expert <ArrowUpRight size={14} />
              </button>
            </div>
          </div>

        </div>

        {/* ── MOBILE ── */}
        <div className="flex flex-col gap-[24px] lg:hidden">

          <h2
            className="text-[#121212] leading-[1.2] tracking-[-0.5px] text-center"
            style={{ fontSize: 'clamp(22px, 7vw, 36px)', fontWeight: 800, margin: 0 }}
          >
            The Hair Loss<br />Journey Of A Man
          </h2>

          {/* 16:9 video */}
          <div
            ref={mobileVideoRef}
            className={`relative w-full rounded-[16px] overflow-hidden bg-[#e0e8f0] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.1)] ${mobileVideoInView ? 'anim-scale-in' : 'opacity-0'}`}
            style={{ aspectRatio: '16 / 9' }}
          >
            <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-4.png" alt="Hair Loss Journey" fill className="object-cover object-center" />
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                className="w-[44px] h-[44px] rounded-full flex items-center justify-center transition-transform hover:scale-105 duration-300"
                style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)', border: '1.5px solid rgba(255,255,255,0.3)' }}
              >
                <Play size={17} color="white" fill="white" style={{ marginLeft: 2 }} />
              </button>
            </div>
          </div>

          {/* Vertical roadmap */}
          <div
            ref={mobileStepsRef}
            className={`flex flex-col ${mobileStepsInView ? 'anim-fade-up' : 'opacity-0'}`}
          >
            <p style={{ fontSize: 'clamp(13px, 3.5vw, 16px)', fontWeight: 500, color: '#555555', lineHeight: '1.7', marginBottom: '20px' }}>
              Let us follow the journey of Alex, a common man from Hyderabad:
            </p>
            {journeySteps.map((step, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start',
                  paddingBottom: '16px',
                  borderBottom: i < journeySteps.length - 1 ? '1px solid rgba(18,18,18,0.07)' : 'none',
                }}
              >
                {/* Spine */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #4686FE, #1769FF)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontSize: '12px', fontWeight: 700, flexShrink: 0, marginTop: '2px',
                  }}>
                    {i + 1}
                  </div>
                  {i < journeySteps.length - 1 && (
                    <div style={{ width: '2px', flex: 1, marginTop: '6px', background: 'rgba(70,134,254,0.2)', minHeight: '16px' }} />
                  )}
                </div>
                {/* Content */}
                <div style={{ paddingBottom: '14px' }}>
                  <p style={{ fontSize: 'clamp(14px, 4vw, 17px)', fontWeight: 700, color: '#121212', margin: '0 0 4px 0', lineHeight: 1.3 }}>{step.title}</p>
                  <p style={{ fontSize: 'clamp(12px, 3.5vw, 15px)', fontWeight: 500, color: '#555555', lineHeight: '1.6', margin: 0 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile CTA card */}
          <div
            className={`w-full rounded-[16px] p-[20px] ${mobileStepsInView ? 'anim-fade-up delay-300' : 'opacity-0'}`}
            style={{ background: 'linear-gradient(135deg, #4686FE 0%, #1769FF 100%)', boxShadow: '0 12px 32px rgba(23,105,255,0.3)' }}
          >
            <h3 style={{ fontSize: 'clamp(16px, 5vw, 20px)', fontWeight: 800, color: '#fff', marginBottom: '8px', lineHeight: '1.2' }}>
              Is the hair system detectable?
            </h3>
            <p style={{ fontSize: 'clamp(13px, 3.5vw, 15px)', fontWeight: 500, color: 'rgba(255,255,255,0.85)', lineHeight: '1.6', marginBottom: '16px' }}>
              No! If designed the right way, the hair system is not detectable at all.
            </p>
            <button
              className="flex items-center gap-[6px] bg-white text-[#1769FF] px-[16px] py-[10px] rounded-[10px] transition-transform hover:scale-[1.02] duration-200"
              style={{ fontSize: 'clamp(12px, 3.5vw, 14px)', fontWeight: 700, boxShadow: '0 4px 14px rgba(0,0,0,0.1)', border: 'none', cursor: 'pointer' }}
            >
              Speak To An Expert <ArrowUpRight size={13} />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   6. HOW DO I ORDER MY HAIR SYSTEM?
   Desktop: scrolling step cards LEFT (toggle-driven), sticky RIGHT
            (title + 16:9 video + toggle below video).
   Mobile:  heading + video + toggle + step grid.
───────────────────────────────────────────────────────────── */
function HowToOrderSection() {
  const [inMumbai, setInMumbai] = useState(true);
  const activeSteps = inMumbai ? orderStepsMumbai : orderStepsOutside;

  const stepCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    setActiveStep(0);
    stepCardRefs.current = [];
  }, [inMumbai]);

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
  }, [inMumbai]);

  /* Shared toggle UI */
  const Toggle = () => (
    <div
      className="flex rounded-[10px] overflow-hidden"
      style={{ border: '1.5px solid #1769FF', background: '#fff', width: 'fit-content' }}
    >
      <button
        onClick={() => setInMumbai(true)}
        style={{
          padding: '9px 22px',
          fontSize: '14px',
          fontWeight: 700,
          border: 'none',
          cursor: 'pointer',
          borderRadius: '8px 0 0 8px',
          background: inMumbai ? 'linear-gradient(135deg, #4686FE, #1769FF)' : 'transparent',
          color: inMumbai ? '#fff' : '#1769FF',
          transition: 'all 0.2s ease',
        }}
      >
        I'm in Mumbai
      </button>
      <button
        onClick={() => setInMumbai(false)}
        style={{
          padding: '9px 22px',
          fontSize: '14px',
          fontWeight: 700,
          border: 'none',
          cursor: 'pointer',
          borderRadius: '0 8px 8px 0',
          background: !inMumbai ? 'linear-gradient(135deg, #4686FE, #1769FF)' : 'transparent',
          color: !inMumbai ? '#fff' : '#1769FF',
          transition: 'all 0.2s ease',
        }}
      >
        I'm Outside Mumbai
      </button>
    </div>
  );

  return (
    <section className="bg-[#F5F6F7] py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        {/* ── DESKTOP: cards LEFT, sticky RIGHT ── */}
        <div className="hidden lg:flex gap-[56px] items-start">

          {/* LEFT: scrolling step cards + CTAs */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {activeSteps.map((step, i) => (
              <div
                key={`${inMumbai ? 'm' : 'o'}-${step.n}`}
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
              <button
                className="flex items-center justify-center gap-[8px] px-[28px] py-[14px] rounded-[10px] text-white transition-transform hover:scale-[1.01] duration-200"
                style={{ fontSize: '16px', fontWeight: 700, background: 'linear-gradient(135deg, #4686FE, #1769FF)', boxShadow: '0 8px 24px rgba(23,105,255,0.3)', border: 'none', cursor: 'pointer' }}
              >
                Book A Consultation <ArrowUpRight size={16} />
              </button>
              {inMumbai && (
                <button
                  className="flex items-center justify-center gap-[8px] px-[28px] py-[14px] rounded-[10px] text-[#1769FF] bg-white border-2 border-[#1769FF] transition-transform hover:scale-[1.01] duration-200"
                  style={{ fontSize: '16px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Google Map Location <ArrowUpRight size={16} />
                </button>
              )}
              {!inMumbai && (
                <button
                  className="flex items-center justify-center gap-[8px] px-[28px] py-[14px] rounded-[10px] text-[#1769FF] bg-white border-2 border-[#1769FF] transition-transform hover:scale-[1.01] duration-200"
                  style={{ fontSize: '16px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Quality Check <ArrowUpRight size={16} />
                </button>
              )}
            </div>
          </div>

          {/* RIGHT sticky panel: title + 16:9 video + toggle below video */}
          <div
            className="order-sticky-panel"
            style={{ width: '42%', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}
          >
            {/* Heading */}
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
              <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-results-story-sameer-after.png" alt="How To Order" fill className="object-cover object-center" style={{ opacity: 0.45 }} />
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

            {/* Toggle below video */}
            <Toggle />

            {/* Intro text */}
            <p style={{ fontSize: '16px', fontWeight: 500, color: '#555555', lineHeight: '1.7', margin: 0 }}>
              {inMumbai
                ? 'Visit our Mumbai center in Khar West for a personal consultation and same-day fitting.'
                : 'Getting your custom hair system is simple. Follow these steps to start your journey with American Hairline.'}
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
            <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-results-story-sameer-after.png" alt="How To Order" fill className="object-cover object-center" style={{ opacity: 0.45 }} />
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

          {/* Toggle below video on mobile too */}
          <div className="flex justify-center">
            <Toggle />
          </div>

          {/* Step grid */}
          <div className="flex flex-col gap-[12px]">
            {activeSteps.map((step) => (
              <div
                key={`${inMumbai ? 'm' : 'o'}-${step.n}`}
                className="flex gap-[14px] items-start p-[20px] bg-white rounded-[12px]"
                style={{ border: '1px solid rgba(18,18,18,0.06)' }}
              >
                <div
                  className="w-[32px] h-[32px] rounded-full flex items-center justify-center flex-shrink-0 text-white"
                  style={{ background: 'linear-gradient(135deg, #4686FE, #1769FF)', fontSize: '14px', fontWeight: 800 }}
                >
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
            <button
              className="flex items-center justify-center gap-[8px] px-[28px] py-[14px] rounded-[10px] text-white transition-transform hover:scale-[1.01] duration-200"
              style={{ fontSize: '16px', fontWeight: 700, background: 'linear-gradient(135deg, #4686FE, #1769FF)', boxShadow: '0 8px 24px rgba(23,105,255,0.3)', border: 'none', cursor: 'pointer' }}
            >
              Book A Consultation <ArrowUpRight size={16} />
            </button>
            {inMumbai ? (
              <button
                className="flex items-center justify-center gap-[8px] px-[28px] py-[14px] rounded-[10px] text-[#1769FF] bg-white border-2 border-[#1769FF] transition-transform hover:scale-[1.01] duration-200"
                style={{ fontSize: '16px', fontWeight: 700, cursor: 'pointer' }}
              >
                Google Map Location <ArrowUpRight size={16} />
              </button>
            ) : (
              <button
                className="flex items-center justify-center gap-[8px] px-[28px] py-[14px] rounded-[10px] text-[#1769FF] bg-white border-2 border-[#1769FF] transition-transform hover:scale-[1.01] duration-200"
                style={{ fontSize: '16px', fontWeight: 700, cursor: 'pointer' }}
              >
                Quality Check <ArrowUpRight size={16} />
              </button>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   7. FAQ — + / x icons, first item open
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
                  <span style={{ fontSize: '20px', fontWeight: 700, lineHeight: '1.4', paddingRight: '16px', transition: 'color 0.3s', color: openIndex === i ? '#121212' : 'rgba(18,18,18,0.65)' }}>
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
export default function NonSurgicalHairReplacementPage() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <DesigningSection />
      <BenefitsSection />
      <HairLossJourneySection />
      <HowToOrderSection />
      <FAQSection />
      <CTA />
      <ResultsRealPeople />
    </main>
  );
}