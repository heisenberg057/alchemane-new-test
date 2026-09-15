'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ArrowUpRight, Plus, X, Play, Check } from 'lucide-react';
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

  .faq-body {
    overflow: hidden;
    max-height: 0;
    opacity: 0;
    transition: max-height 0.42s cubic-bezier(0.4,0,0.2,1), opacity 0.32s ease;
  }
  .faq-body.open {
    max-height: 500px;
    opacity: 1;
  }

  /* Pill toggle */
  .tab-pill {
    position: relative;
    display: inline-flex;
    background: #EAECEF;
    border-radius: 999px;
    padding: 4px;
    gap: 0;
  }
  .tab-pill-btn {
    position: relative;
    z-index: 1;
    padding: 9px 22px;
    border-radius: 999px;
    border: none;
    background: transparent;
    font-size: 15px;
    font-weight: 600;
    color: #666;
    cursor: pointer;
    transition: color 0.25s ease;
    white-space: nowrap;
  }
  .tab-pill-btn.active {
    color: #121212;
  }
  .tab-pill-indicator {
    position: absolute;
    top: 4px;
    bottom: 4px;
    border-radius: 999px;
    background: white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.12);
    transition: left 0.28s cubic-bezier(0.4,0,0.2,1), width 0.28s cubic-bezier(0.4,0,0.2,1);
    pointer-events: none;
  }

  /* Sticky scroll order section */
  .order-sticky-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 48px;
    align-items: start;
    position: relative;
  }
  .order-sticky-left {
    position: sticky;
    top: 80px;
    align-self: start;
  }
  .order-steps-scroll {
    /* natural flow */
  }

  @media (max-width: 900px) {
    .order-sticky-layout {
      grid-template-columns: 1fr;
    }
    .order-sticky-left {
      position: relative;
      top: auto;
    }
  }
`;

/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────── */
const aboutBullets = [
  { text: 'Our crown-area hair patch systems are made from 100% natural human hair, making them an excellent solution for covering thinning or bald spots in the crown region while maintaining a completely natural appearance.' },
  { text: 'Each unit is individually handmade and carefully customized to match your natural hair\'s texture, density, and colour, ensuring a seamless blend with your existing hair for a realistic and comfortable result.' },
];

const stickOnBullets = [
  'More secure attachment; ideal if comfortable shaving',
  'Monthly servicing required at your hair replacement salon',
  'Ideal for crown area coverage',
  'Can manage application yourself once you learn',
  'Worn 24/7; stays on during all activities',
];

const clipOnBullets = [
  'Ready-to-wear right out of the box',
  'No shaving required; keeps your existing hair',
  'Easy to remove and reattach yourself',
  'Great for first-time users',
];

const designProcessSteps = [
  {
    n: 1,
    title: 'Book Consultation',
    desc: 'Book an in-depth video consultation with us to discuss your needs.',
  },
  {
    n: 2,
    title: 'Take Measurements',
    desc: 'Take a video for measurements of the hair loss area. We provide video resources to accurately guide you. Follow the steps, and send us your measurements.',
  },
  {
    n: 3,
    title: 'Receive Your System',
    desc: 'Our experts will design the hair system based on your measurements. A ready-to-wear system will be delivered to the comfort of your home.',
  },
];

const orderSteps = [
  { n: 1, bold: 'Book a Consultation:', text: ' Schedule a free consultation at our center.' },
  { n: 2, bold: 'Visit Us in Khar West:', text: ' Come to our Mumbai center for a personal meeting.' },
  { n: 3, bold: 'Discuss Your Needs:', text: ' Clear all your doubts about the process face-to-face with our experts.' },
  { n: 4, bold: 'Sample & Mould:', text: ' We take precise measurements and create your custom mould.' },
  { n: 5, bold: 'Order Placed!:', text: ' Your custom hair system goes into production; sit back and relax.' },
];

const faqs = [
  {
    q: 'Can you use styling products to create the hairstyle you want?',
    a: 'Yes. Our crown area patches use 100% human hair and can be styled with any standard hair products — including wax, gel, and sprays. Style them exactly as you would your own hair.',
  },
  {
    q: 'Does it look natural?',
    a: 'Absolutely. Our crown area patches are crafted with an ultra-thin base and individually hand-tied hairs, creating a completely natural appearance that blends seamlessly with your surrounding hair.',
  },
  {
    q: 'How long does it last?',
    a: 'With proper care and regular maintenance, a crown area hair patch typically lasts 6–12 months. Regular professional servicing every 3–4 weeks helps maximise its lifespan.',
  },
  {
    q: 'Will it be possible to bathe with this specific attachment?',
    a: 'Yes. Our stick-on systems use medical-grade waterproof adhesive that maintains a strong bond during showering and bathing. We recommend a specific post-wash care routine to maximise the bond duration.',
  },
  {
    q: 'How can I take this off without damaging my hair?',
    a: 'We provide a specialist adhesive remover (C22) that dissolves the bond safely without pulling or damaging your natural hair. Our team provides full removal guidance during your service appointment.',
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
   CARD WRAPPER — reusable glass-surface card
───────────────────────────────────────────────────────────── */
function Card({ children, className = '', style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={`bg-white rounded-[16px] border border-[rgba(18,18,18,0.07)] shadow-[0px_2px_16px_0px_rgba(0,0,0,0.06)] ${className}`}
      style={style}
    >
      {children}
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
            Crown Area Hair Patch
          </h1>
          <p className={`text-[18px] text-[#555555] leading-[1.7] max-w-[540px] mx-auto ${inView ? 'anim-fade-up delay-200' : 'opacity-0'}`}>
            Learn about our crown area hair patch solutions. The crown area hair patch is the perfect solution for you.
          </p>
        </div>

        {/* Hero card */}
        <div className={`relative w-full rounded-[20px] md:rounded-[24px] overflow-hidden bg-[#0a0c10] h-[280px] md:h-[500px] shadow-[0px_24px_64px_0px_rgba(0,0,0,0.2)] ${inView ? 'anim-scale-in delay-300' : 'opacity-0'}`}>
          <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-results-story-sameer-after.png" alt="Crown Area Hair Patch" fill className="object-cover object-top" sizes="(max-width: 768px) 100vw, 720px" />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.88)] via-[rgba(10,12,16,0.25)] to-transparent" />
          <div className="absolute bottom-[24px] md:bottom-[40px] left-[24px] md:left-[48px]">
            <p className="text-white text-[22px] md:text-[36px] font-extrabold tracking-[0.08em] uppercase leading-none m-0">
              CROWN AREA
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
   2. ABOUT CROWN AREA PATCH
───────────────────────────────────────────────────────────── */
function AboutSection() {
  const { ref, inView } = useInView();
  return (
    <section className="bg-[#F5F6F7] py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2 className="text-[26px] md:text-[44px] font-extrabold text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[64px]">
          About Crown Area Patch
        </h2>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-[48px] md:gap-[64px] items-center">

          {/* Video thumbnail */}
          <div className={`relative w-full rounded-[14px] overflow-hidden bg-[#0a0c10] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.15)] ${inView ? 'anim-slide-r' : 'opacity-0'}`}>
            <div className="bg-[#F5C518] px-[16px] py-[10px] flex items-center gap-[8px]">
              <span className="text-[#121212] text-[16px] md:text-[20px] font-extrabold uppercase leading-none tracking-[0.02em]">
                OWN HAIR LOSS FIXED
              </span>
            </div>
            <div className="relative w-full h-[220px] md:h-[280px]">
              <Image
                src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-2.png"
                alt="Before After Hair Patch"
                fill
                className="object-cover object-center"
              />
              <div className="absolute bottom-[12px] left-[12px] bg-black/60 px-[10px] py-[4px] rounded-[4px]">
                <span className="text-white text-[13px] font-bold">Before</span>
              </div>
              <div className="absolute bottom-[12px] right-[12px] bg-black/60 px-[10px] py-[4px] rounded-[4px]">
                <span className="text-white text-[13px] font-bold">After</span>
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
          </div>

          {/* Bullets in card */}
          <Card className={`p-[28px] md:p-[36px] flex flex-col gap-[24px] ${inView ? 'anim-slide-l delay-200' : 'opacity-0'}`}>
            {aboutBullets.map((b, i) => (
              <div key={i} className="flex gap-[12px] items-start">
                <div className="w-[7px] h-[7px] rounded-full bg-[#1769FF] flex-shrink-0 mt-[9px]" />
                <p className="text-[18px] text-[#555555] leading-[1.65] m-0">{b.text}</p>
              </div>
            ))}
          </Card>

        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   3. ATTACHMENT METHOD
───────────────────────────────────────────────────────────── */
function AttachmentSection() {
  const { ref, inView } = useInView();
  return (
    <section className="bg-white py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2 className="text-[26px] md:text-[44px] font-extrabold text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[56px]">
          Attachment Method
        </h2>

        <div ref={ref} className="flex flex-col gap-0">

          {/* Side-by-side photos */}
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-[16px] mb-[24px] ${inView ? 'anim-scale-in' : 'opacity-0'}`}>
            {['Stick-On Method', 'Clip-On Method'].map((label, i) => (
              <div key={i} className="relative w-full h-[200px] md:h-[240px] rounded-[14px] overflow-hidden bg-[#121212] shadow-[0px_4px_16px_0px_rgba(0,0,0,0.1)]">
                <Image
                  src={i === 0 ? 'https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-3.png' : 'https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-4.png'}
                  alt={label}
                  fill
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.55)] via-transparent to-transparent" />
                {/* Label badge */}
                <div className="absolute bottom-[14px] left-[14px] bg-white/10 backdrop-blur-sm border border-white/20 px-[12px] py-[6px] rounded-[8px]">
                  <span className="text-white text-[13px] font-bold">{label}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Stick-On + Clip-On comparison columns */}
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-[20px] mb-[20px] ${inView ? 'anim-fade-up delay-200' : 'opacity-0'}`}>
            {/* Stick-On */}
            <Card className="p-[28px] md:p-[32px]">
              <h3 className="text-[20px] font-extrabold text-[#121212] mb-[4px]">Stick-On</h3>
              <p className="text-[18px] text-[#888] mb-[20px] m-0">Secure fit for an active lifestyle</p>
              <div className="flex flex-col gap-[12px]">
                {stickOnBullets.map((b, i) => (
                  <div key={i} className="flex gap-[10px] items-start">
                    <div
                      className="w-[20px] h-[20px] rounded-[4px] flex items-center justify-center flex-shrink-0 mt-[1px]"
                      style={{ background: '#22c55e' }}
                    >
                      <Check size={11} color="white" strokeWidth={3} />
                    </div>
                    <p className="text-[18px] text-[#555555] leading-[1.6] m-0">{b}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Clip-On */}
            <Card className="p-[28px] md:p-[32px]">
              <h3 className="text-[20px] font-extrabold text-[#121212] mb-[4px]">Clip-On</h3>
              <p className="text-[18px] text-[#888] mb-[20px] m-0">Easy to apply, ready to wear</p>
              <div className="flex flex-col gap-[12px]">
                {clipOnBullets.map((b, i) => (
                  <div key={i} className="flex gap-[10px] items-start">
                    <div
                      className="w-[20px] h-[20px] rounded-[4px] flex items-center justify-center flex-shrink-0 mt-[1px]"
                      style={{ background: '#22c55e' }}
                    >
                      <Check size={11} color="white" strokeWidth={3} />
                    </div>
                    <p className="text-[18px] text-[#555555] leading-[1.6] m-0">{b}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* The Custom Design Process — card */}
          <Card className={`p-[28px] md:p-[40px] ${inView ? 'anim-fade-up delay-300' : 'opacity-0'}`}>
            <h3 className="text-[20px] font-extrabold text-[#121212] mb-[6px]">
              The Custom Design Process
            </h3>
            <p className="text-[18px] text-[#555555] leading-[1.65] mb-[28px] m-0">
              We ensure a perfect fit before you even choose your attachment method.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[20px]">
              {designProcessSteps.map((step) => (
                <div key={step.n} className="bg-[#F5F6F7] rounded-[12px] p-[20px] flex flex-col gap-[10px]">
                  <div className="flex items-start gap-[12px]">
                    <div
                      className="w-[28px] h-[28px] rounded-full flex items-center justify-center text-white text-[13px] font-extrabold flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #4686FE, #1769FF)' }}
                    >
                      {step.n}
                    </div>
                    <div>
                      <p className="text-[20px] font-semibold text-[#121212] m-0 mb-[4px]">{step.title}</p>
                      <p className="text-[18px] text-[#555555] leading-[1.6] m-0">{step.desc}</p>
                    </div>
                  </div>
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
   4. MEASUREMENTS
───────────────────────────────────────────────────────────── */
function MeasurementsSection() {
  const { ref, inView } = useInView();
  return (
    <section className="bg-[#F5F6F7] py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2 className="text-[26px] md:text-[44px] font-extrabold text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[56px]">
          Measurements
        </h2>

        <div ref={ref} className={`flex flex-col gap-[20px] ${inView ? 'anim-fade-up' : 'opacity-0'}`}>

          {/* For Clip-On System */}
          <Card className="p-[28px] md:p-[36px]">
            <div className="flex items-center gap-[10px] mb-[8px]">
              <div
                className="w-[32px] h-[32px] rounded-[8px] flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #4686FE, #1769FF)' }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="2" width="12" height="3" rx="1" fill="white" opacity="0.5"/>
                  <rect x="2" y="6.5" width="12" height="3" rx="1" fill="white" opacity="0.75"/>
                  <rect x="2" y="11" width="12" height="3" rx="1" fill="white"/>
                </svg>
              </div>
              <h3 className="text-[20px] font-extrabold text-[#121212] m-0">For Clip-On System</h3>
            </div>
            <p className="text-[18px] text-[#555555] leading-[1.65] mb-[20px]">
              Common sizes — 4×4 inches or 5×5 inches
            </p>
            <div className="grid grid-cols-2 gap-[12px]">
              {['Side to Side', 'Front to Back'].map((label, i) => (
                <div key={i} className="relative w-full h-[140px] md:h-[180px] rounded-[10px] overflow-hidden bg-[#e0e0e0] shadow-[0px_2px_8px_0px_rgba(0,0,0,0.07)]">
                  <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-1.png" alt={`Clip-On ${label}`} fill className="object-cover object-center" />
                  <div className="absolute top-[8px] left-[10px] bg-black/50 px-[8px] py-[3px] rounded-[4px]">
                    <span className="text-white text-[11px] font-semibold">{label}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* For Stick-On System */}
          <Card className="p-[28px] md:p-[36px]">
            <div className="flex items-center gap-[10px] mb-[8px]">
              <div
                className="w-[32px] h-[32px] rounded-[8px] flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #4686FE, #1769FF)' }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="2" y="5" width="12" height="9" rx="1.5" stroke="white" strokeWidth="1.5"/>
                  <path d="M2 7h12" stroke="white" strokeWidth="1.5"/>
                  <path d="M6 2l-4 3M10 2l4 3" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M6 7v7" stroke="white" strokeWidth="1" strokeDasharray="1.5 1.5"/>
                </svg>
              </div>
              <h3 className="text-[20px] font-extrabold text-[#121212] m-0">For Stick-On System</h3>
            </div>
            <p className="text-[18px] text-[#555555] leading-[1.65] mb-[20px]">
              Common sizes — 4×4 inches or 5×5 inches
            </p>
            <div className="grid grid-cols-2 gap-[12px]">
              {['Front to Back', 'Side to Side'].map((label, i) => (
                <div key={i} className="relative w-full h-[140px] md:h-[180px] rounded-[10px] overflow-hidden bg-[#e0e0e0] shadow-[0px_2px_8px_0px_rgba(0,0,0,0.07)]">
                  <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-2.png" alt={`Stick-On ${label}`} fill className="object-cover object-center" />
                  <div className="absolute top-[8px] left-[10px] bg-black/50 px-[8px] py-[3px] rounded-[4px]">
                    <span className="text-white text-[11px] font-semibold">{label}</span>
                  </div>
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
   5. HOW DO I ORDER?
   LEFT SIDE: sticky — heading card + video + tab toggle
   RIGHT SIDE: scrollable step cards + CTA (CTA exits sticky)
───────────────────────────────────────────────────────────── */
function HowToOrderSection() {
  const [tab, setTab] = useState<'mumbai' | 'outside'>('mumbai');
  const btn1Ref = useRef<HTMLButtonElement>(null);
  const btn2Ref = useRef<HTMLButtonElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);

  // Move indicator to active button
  useEffect(() => {
    const activeBtn = tab === 'mumbai' ? btn1Ref.current : btn2Ref.current;
    const indicator = pillRef.current;
    if (!activeBtn || !indicator) return;
    indicator.style.left = `${activeBtn.offsetLeft}px`;
    indicator.style.width = `${activeBtn.offsetWidth}px`;
  }, [tab]);

  useEffect(() => {
    const btn = btn1Ref.current;
    const indicator = pillRef.current;
    if (!btn || !indicator) return;
    indicator.style.transition = 'none';
    indicator.style.left = `${btn.offsetLeft}px`;
    indicator.style.width = `${btn.offsetWidth}px`;
    requestAnimationFrame(() => {
      indicator.style.transition = '';
    });
  }, []);

  const mumbaiSteps = orderSteps;
  const outsideSteps = [
    { n: 1, bold: 'Book Consultation:', text: ' Start with a free consultation with our crown area specialists — online or in person.' },
    { n: 2, bold: 'Talk To Us Live:', text: ' Our experts assess your crown area hair loss and recommend the best patch configuration.' },
    { n: 3, bold: 'Place Your Order:', text: ' Choose your system, confirm all specifications, and place your order with confidence.' },
  ];

  const activeSteps = tab === 'mumbai' ? mumbaiSteps : outsideSteps;

  return (
    <section className="bg-white py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        {/* ── Two-column sticky layout ── */}
        <div className="order-sticky-layout">

          {/* LEFT — sticky */}
          <div className="order-sticky-left flex flex-col gap-[20px]">

            {/* Heading — bare, no card */}
            <h2 className="text-[24px] md:text-[36px] font-extrabold text-[#121212] leading-[1.2] tracking-[-0.5px] m-0">
              How Do I Order My<br />Hair System?
            </h2>

            {/* Video thumbnail */}
            <div
              className="relative w-full rounded-[16px] overflow-hidden bg-[#0a0c10] h-[220px] md:h-[300px] shadow-[0px_16px_48px_0px_rgba(0,0,0,0.2)]"
            >
              <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-results-story-amit-after.png" alt="How To Order" fill className="object-cover object-center" style={{ opacity: 0.55 }} />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(5,7,10,0.7)] via-[rgba(5,7,10,0.45)] to-[rgba(5,7,10,0.2)]" />
              {/* Red banner top */}
              <div className="absolute top-0 left-0 right-0 bg-[#e00] flex items-center justify-center py-[10px] md:py-[14px] gap-[10px]">
                <p className="text-white text-[15px] md:text-[22px] font-extrabold leading-none uppercase m-0 tracking-[0.02em]">
                  HOW TO ORDER ONLINE!
                </p>
              </div>
              <div className="absolute top-[44px] md:top-[60px] left-0 right-0 flex items-center justify-center">
                <p className="text-white text-[16px] md:text-[26px] font-extrabold leading-none uppercase m-0">
                  AHL HAIR SYSTEMS!
                </p>
              </div>
              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center mt-[24px]">
                <button
                  className="w-[48px] h-[48px] md:w-[60px] md:h-[60px] rounded-full flex items-center justify-center transition-transform hover:scale-110 duration-200"
                  style={{ background: 'rgba(255,0,0,0.92)', boxShadow: '0 4px 20px rgba(255,0,0,0.4)' }}
                >
                  <Play size={20} color="white" fill="white" style={{ marginLeft: 3 }} />
                </button>
              </div>
            </div>

            {/* Pill toggle — bare, no card */}
            <div className="flex">
              <div className="tab-pill" style={{ position: 'relative' }}>
                <div ref={pillRef} className="tab-pill-indicator" />
                <button
                  ref={btn1Ref}
                  onClick={() => setTab('mumbai')}
                  className={`tab-pill-btn${tab === 'mumbai' ? ' active' : ''}`}
                >
                  I&apos;m in Mumbai
                </button>
                <button
                  ref={btn2Ref}
                  onClick={() => setTab('outside')}
                  className={`tab-pill-btn${tab === 'outside' ? ' active' : ''}`}
                >
                  I&apos;m Outside Mumbai
                </button>
              </div>
            </div>

          </div>

          {/* RIGHT — scrollable steps + CTAs */}
          <div className="order-steps-scroll flex flex-col gap-[16px]">

            {/* Steps — each in its own card */}
            {activeSteps.map((step) => (
              <Card key={step.n} className="p-[24px] md:p-[28px] flex gap-[16px] items-start">
                <div
                  className="w-[36px] h-[36px] rounded-full flex items-center justify-center flex-shrink-0 text-white text-[14px] font-extrabold"
                  style={{ background: 'linear-gradient(135deg, #4686FE, #1769FF)', boxShadow: '0 4px 12px rgba(23,105,255,0.25)' }}
                >
                  {step.n}
                </div>
                <p className="text-[18px] text-[#555555] leading-[1.65] m-0 pt-[6px]">
                  <strong className="text-[#121212] font-semibold">{step.bold}</strong>
                  {step.text}
                </p>
              </Card>
            ))}

            {/* Spacer so CTA is clearly below scroll zone */}
            <div className="h-[8px]" />

            {/* CTAs — bare, no card */}
            <div className="flex flex-col sm:flex-row gap-[12px]">
              <button
                className="flex items-center justify-center gap-[8px] px-[28px] py-[14px] rounded-[10px] text-white text-[15px] font-bold transition-transform hover:scale-[1.01] duration-200 flex-1"
                style={{ background: 'linear-gradient(135deg, #4686FE, #1769FF)', boxShadow: '0 8px 24px rgba(23,105,255,0.3)', border: 'none', cursor: 'pointer' }}
              >
                Book A Consultation <ArrowUpRight size={16} />
              </button>
              <button
                className="flex items-center justify-center gap-[8px] px-[28px] py-[14px] rounded-[10px] text-[#1769FF] text-[15px] font-bold border-2 border-[#1769FF] bg-white transition-transform hover:scale-[1.01] duration-200 flex-1"
                style={{ cursor: 'pointer' }}
              >
                Google Map Location <ArrowUpRight size={16} />
              </button>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   6. FAQ
───────────────────────────────────────────────────────────── */
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { ref, inView } = useInView();

  return (
    <section className="bg-[#F0F2F4] py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2 className="text-[26px] md:text-[44px] font-extrabold text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[40px] md:mb-[52px]">
          Frequently Asked Questions
        </h2>

        <div ref={ref} className="max-w-[720px] mx-auto">
          <div className={`flex flex-col gap-[10px] mb-[24px] ${inView ? 'anim-fade-up' : 'opacity-0'}`}>
            {faqs.map((faq, i) => {
              const isOpen = openIndex === i;
              return (
                <Card
                  key={i}
                  className="overflow-hidden"
                >
                  {/* Header row */}
                  <button
                    className="w-full flex justify-between items-start gap-[16px] px-[20px] md:px-[24px] py-[20px] md:py-[22px] text-left bg-transparent border-none cursor-pointer"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                  >
                    <span
                      className="text-[20px] leading-[1.45]"
                      style={{
                        fontWeight: isOpen ? 700 : 500,
                        color: isOpen ? '#121212' : '#222',
                        transition: 'font-weight 0.2s, color 0.2s',
                      }}
                    >
                      {faq.q}
                    </span>
                    <div
                      className="flex items-center justify-center flex-shrink-0 mt-[1px]"
                      style={{ width: 22, height: 22, color: '#aaa' }}
                    >
                      {isOpen
                        ? <X size={18} strokeWidth={2} style={{ color: '#aaa' }} />
                        : <Plus size={18} strokeWidth={2} style={{ color: '#aaa' }} />
                      }
                    </div>
                  </button>

                  {/* Body */}
                  <div className={`faq-body${isOpen ? ' open' : ''}`}>
                    <div className="h-[1px] bg-[rgba(18,18,18,0.07)] mx-[20px] md:mx-[24px]" />
                    <p
                      className="text-[18px] leading-[1.7] px-[20px] md:px-[24px] pt-[16px] pb-[22px] m-0"
                      style={{ color: '#666' }}
                    >
                      {faq.a}
                    </p>
                  </div>
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
              <h3 className="text-white text-[20px] font-extrabold tracking-[-0.3px] mb-[8px]">
                Still have questions?
              </h3>
              <p className="text-white/75 text-[18px] leading-[1.6] mb-[24px] m-0 max-w-[400px]">
                No worries, we&apos;re here to guide you. Talk to us, we will support you completely.
              </p>
              <button
                className="flex items-center gap-[8px] bg-white text-[#1769FF] px-[20px] py-[11px] rounded-[10px] text-[15px] font-bold transition-transform hover:scale-[1.02] duration-200"
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
   PAGE ROOT
───────────────────────────────────────────────────────────── */
export default function CrownAreaHairPatchPage() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <AttachmentSection />
      <MeasurementsSection />
      <HowToOrderSection />
      <FAQSection />
      <CTA />
      <ResultsRealPeople />
    </main>
  );
}