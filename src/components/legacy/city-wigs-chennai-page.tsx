'use client';

import React, { useState, useRef, useEffect } from 'react';
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

/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────── */
const whyHairLossBullets = [
  {
    bold: 'Hard Water & Minerals:',
    text: ' Chennai\'s water supply is rich in calcium, magnesium, and chlorine. Regular use weakens hair follicles over time, leading to breakage, dryness, and thinning.',
  },
  {
    bold: 'Humidity & Heat:',
    text: ' Chennai\'s tropical coastal climate creates constant humidity and high temperatures that can damage hair structure and accelerate hair loss in men.',
  },
  {
    bold: 'Genetic Predisposition:',
    text: ' Hereditary androgenetic alopecia is the most common cause of hair loss among men in Chennai. Early identification allows for more effective intervention.',
  },
  {
    bold: 'Stress & Urban Lifestyle:',
    text: ' The demands of Chennai\'s professional environment combined with dietary habits and daily stress can significantly accelerate hair loss in men of all ages.',
  },
];

const humanHairBullets = [
  {
    bold: 'Premium Natural Hair:',
    text: ' Our hair wigs for men in Chennai are made from 100% human hair, ensuring they look, feel, and move exactly like your natural hair.',
  },
  {
    bold: 'Replacement Consideration:',
    text: ' Our expert team guides you through every stage of the replacement process — from consultation to fitting — ensuring the most comfortable and natural outcome.',
  },
  {
    bold: 'The Quality Is Incomparable:',
    text: ' We source only the finest hair and base materials, resulting in systems that look premium and last significantly longer than standard alternatives.',
  },
  {
    bold: 'Styles Made Manageable:',
    text: ' Our wigs can be cut, styled, and coloured just like natural hair, giving you complete freedom to achieve any hairstyle you desire.',
  },
  {
    bold: 'Customer Complaints Addressed:',
    text: ' We take customer feedback seriously and have an active support team dedicated to resolving any concerns quickly and to your complete satisfaction.',
  },
];

const fullWigsBullets = [
  {
    bold: 'For Hair Wigs:',
    text: ' Our full wigs provide seamless, natural-looking coverage for men in Chennai experiencing any level of hair loss — from minor thinning to complete baldness.',
  },
  {
    bold: 'For Hair Patches:',
    text: ' Targeted patches cover specific areas of hair loss without affecting the surrounding natural hair, providing precise and undetectable coverage.',
  },
  {
    bold: 'Affordable & Versatile:',
    text: ' Our range of full wigs suits a variety of budgets without compromising on the quality, naturalness, or durability of the system.',
  },
];

const methodsBullets = [
  {
    bold: 'Glue + Wigs:',
    text: ' Medical-grade adhesive bonds the wig securely to the scalp. This method provides a long-lasting hold ideal for Chennai\'s active lifestyle.',
  },
  {
    bold: 'Adhesive Strips:',
    text: ' Double-sided strips applied around the perimeter offer a clean, comfortable bond — easy to apply and suitable for everyday wear.',
  },
  {
    bold: 'Tape-On Application:',
    text: ' Medical-grade tape provides a strong, comfortable hold that is gentle on the scalp and can be replaced easily during maintenance sessions.',
  },
];

const suggestionsAccordion = [
  {
    title: 'Free Consultation with Our Experts',
    desc: 'Begin with a free consultation at our Chennai studio. Our specialists will assess your hair loss, scalp health, and lifestyle needs to recommend the ideal wig solution for you.',
  },
  {
    title: 'Review Customisation Options',
    desc: 'Explore our full range of customisation options — from base material to hair density to hairline shape. A custom system always delivers a more natural and long-lasting result.',
  },
  {
    title: 'Commitment to Our Own Solutions',
    desc: 'Every product and method we recommend is one we have personally tested and verified. We only suggest solutions we trust completely and that have delivered proven results.',
  },
  {
    title: 'Background On My Services',
    desc: 'American Hairline has served thousands of clients across Chennai and India. Our background in premium non-surgical hair replacement means every client receives expert-level care.',
  },
];

const faqs = [
  {
    q: 'Find the best wigs for Men in Chennai?',
    a: 'American Hairline is one of Chennai\'s leading providers of premium human hair wigs for men. We offer fully customised systems, professional fitting, and comprehensive aftercare support across Chennai.',
  },
  {
    q: 'Is it convenient to use wigs in Chennai\'s climate?',
    a: 'Yes. Our wigs use breathable, humidity-resistant base materials and adhesives that are specifically recommended for Chennai\'s coastal tropical climate — keeping you comfortable all day.',
  },
  {
    q: 'Can I swim or exercise while wearing a wig in Chennai?',
    a: 'Yes. With the right waterproof adhesive, you can swim, exercise, and carry out all activities normally. We recommend a specific pre-swim routine to extend the adhesive bond.',
  },
  {
    q: 'What happens to the wig if it starts looking less natural?',
    a: 'Book a maintenance session with our Chennai team. We will re-adhesive, clean, and restyle your system so it looks completely natural. Regular servicing every 3–4 weeks prevents visible wear.',
  },
  {
    q: 'Is styling equipment appropriate to use on the hair patch?',
    a: 'Yes. Our 100% human hair systems can be styled with straighteners, curlers, and blow dryers just like natural hair. Always use heat protectant to maintain quality and longevity.',
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
   SHARED COMPONENTS
───────────────────────────────────────────────────────────── */
function BulletGroup({ bullets }: { bullets: { bold: string; text?: string; sub?: string[] }[] }) {
  return (
    <div className="rounded-[16px] overflow-hidden h-full flex flex-col justify-center bg-white shadow-[0px_4px_24px_rgba(18,18,18,0.08)]">
      <div className="p-[24px] md:p-[32px] flex flex-col gap-[20px]">
        {bullets.map((b, i) => (
          <div key={i} className="flex flex-col">
            <p style={cardBodyStyle}>
              <strong style={cardBoldStyle}>• {b.bold}</strong>{b.text ? `${b.text}` : ''}
            </p>
            {b.sub && b.sub.length > 0 && (
              <div className="mt-[10px] flex flex-col gap-[8px] pl-[18px]">
                {b.sub.map((s, j) => (
                  <p key={j} style={{ ...cardBodyStyle, fontSize: '16px', color: '#555555' }}>
                    - {s}
                  </p>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function PlayBtn({ size = 20 }: { size?: number }) {
  return (
    <button className="w-[52px] h-[52px] md:w-[64px] md:h-[64px] rounded-full flex items-center justify-center transition-transform hover:scale-110 duration-200"
      style={{ background: 'rgba(255,0,0,0.92)', boxShadow: '0 6px 24px rgba(255,0,0,0.4)' }}>
      <Play size={size} color="white" fill="white" style={{ marginLeft: 3 }} />
    </button>
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
            Hair Wigs For Men<br />In Chennai
          </h1>
          <p className={`text-[16px] font-[500] text-[#555555] leading-[1.7] max-w-[600px] mx-auto ${inView ? 'anim-fade-up delay-200' : 'opacity-0'}`}>
            Looking for the best hair wigs for men in Chennai? Our premium human hair wigs are specially designed for men in Chennai. We offer the best quality hair wigs that look and feel completely natural, helping you regain your confidence.
          </p>
        </div>

        <div className={`relative w-full rounded-[20px] md:rounded-[24px] overflow-hidden bg-[#0a0c10] h-[280px] md:h-[500px] shadow-[0px_24px_64px_0px_rgba(0,0,0,0.2)] ${inView ? 'anim-scale-in delay-300' : 'opacity-0'}`}>
          <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-results-story-sameer-after.png" alt="Hair Wigs In Chennai" fill className="object-cover object-top" sizes="(max-width: 768px) 100vw, 720px" />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.88)] via-[rgba(10,12,16,0.25)] to-transparent" />
          <div className="absolute bottom-[24px] md:bottom-[40px] left-[24px] md:left-[48px]">
            <p className="text-white text-[22px] md:text-[36px] font-extrabold tracking-[0.08em] uppercase leading-none m-0">HAIR WIGS</p>
            <p className="text-white/55 text-[13px] md:text-[18px] font-bold tracking-[0.2em] uppercase mt-[4px] m-0">IN CHENNAI</p>
          </div>
        </div>

      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   2. WHY HAIR LOSS OCCURS AMONG MEN IN CHENNAI
───────────────────────────────────────────────────────────── */
function WhyHairLossSection() {
  const { ref, inView } = useInView();
  return (
    <section className="bg-[#F5F6F7] py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2 className="text-[26px] md:text-[44px] font-extrabold text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[64px]">
          Why Hair Loss Occurs Among Men<br />In Chennai City?
        </h2>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-[48px] md:gap-[64px] items-stretch">

          <div className={`w-full flex md:items-stretch justify-center ${inView ? 'anim-slide-r' : 'opacity-0'}`}>
            <div className="relative w-full h-[280px] md:h-auto rounded-[16px] overflow-hidden bg-[#0a0c10] shadow-[0px_4px_24px_rgba(18,18,18,0.08)] flex-1">
              <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-2.png" alt="Why Hair Loss Chennai" fill className="object-cover object-center" style={{ opacity: 0.5 }} />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(5,7,10,0.88)] via-[rgba(5,7,10,0.5)] to-[rgba(5,7,10,0.2)]" />
              <div className="absolute top-[20px] md:top-[28px] left-[20px] md:left-[28px]">
                <p className="text-white text-[16px] md:text-[22px] font-extrabold leading-[1.2] m-0">
                  <span className="text-white/60">HY SHAVE?</span>{' '}
                  <span className="text-white">TRY</span>{' '}
                  <span style={{ color: '#4686FE' }}>CLIP-ON</span>
                </p>
              </div>
              <div className="absolute bottom-[20px] left-[20px] right-[20px] flex justify-between items-end">
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>Before</span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>After</span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center"><PlayBtn /></div>
            </div>
          </div>

          <div className={`${inView ? 'anim-slide-l delay-200' : 'opacity-0'}`}>
            <BulletGroup bullets={whyHairLossBullets} />
          </div>

        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   3. MEN'S HUMAN HAIR WIGS IN CHENNAI
───────────────────────────────────────────────────────────── */
function HumanHairSection() {
  const { ref, inView } = useInView();
  return (
    <section className="bg-white py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2 className="text-[26px] md:text-[44px] font-extrabold text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[64px]">
          Men's Human Hair Wigs<br />In Chennai
        </h2>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-[48px] md:gap-[64px] items-stretch">

          <div className={`${inView ? 'anim-slide-r' : 'opacity-0'}`}>
            <BulletGroup bullets={humanHairBullets} />
          </div>

          <div className={`w-full flex md:items-stretch justify-center ${inView ? 'anim-slide-l delay-200' : 'opacity-0'}`}>
            <div className="relative w-full h-[280px] md:h-auto rounded-[16px] overflow-hidden bg-[#0a0c10] shadow-[0px_4px_24px_rgba(18,18,18,0.08)] flex-1">
              <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-1.png" alt="Human Hair Wigs Chennai" fill className="object-cover object-center" style={{ opacity: 0.5 }} />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(5,7,10,0.88)] via-[rgba(5,7,10,0.5)] to-[rgba(5,7,10,0.2)]" />
              <div className="absolute top-[20px] md:top-[28px] left-[20px] md:left-[28px]">
                <p className="text-white text-[16px] md:text-[22px] font-extrabold leading-[1.2] m-0">
                  <span className="text-white/60">HY SHAVE?</span>{' '}
                  <span className="text-white">TRY</span>{' '}
                  <span style={{ color: '#4686FE' }}>CLIP-ON</span>
                </p>
              </div>
              <div className="absolute bottom-[20px] left-[20px] right-[20px] flex justify-between items-end">
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>Before</span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>After</span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center"><PlayBtn /></div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   4. FULL HAIR WIGS ARE MEANT FOR
───────────────────────────────────────────────────────────── */
function FullWigsSection() {
  const { ref, inView } = useInView();
  return (
    <section className="bg-[#F5F6F7] py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2 className="text-[26px] md:text-[44px] font-extrabold text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[64px]">
          Full Hair Wigs Are Meant For:
        </h2>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-[48px] md:gap-[64px] items-stretch">

          <div className={`w-full flex md:items-stretch justify-center ${inView ? 'anim-slide-r' : 'opacity-0'}`}>
            <div className="relative w-full h-[260px] md:h-auto rounded-[16px] overflow-hidden bg-[#121212] shadow-[0px_4px_24px_rgba(18,18,18,0.08)] flex-1">
              <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-3.png" alt="Full Hair Wigs Chennai" fill className="object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.6)] via-transparent to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center"><PlayBtn /></div>
            </div>
          </div>

          <div className={`${inView ? 'anim-slide-l delay-200' : 'opacity-0'}`}>
            <BulletGroup bullets={fullWigsBullets} />
          </div>

        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   5. METHODS OF APPLICATION
───────────────────────────────────────────────────────────── */
function MethodsSection() {
  const { ref, inView } = useInView();
  return (
    <section className="bg-white py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2 className="text-[26px] md:text-[44px] font-extrabold text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[64px]">
          Methods Of Application
        </h2>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-[48px] md:gap-[64px] items-stretch">

          <div className={`${inView ? 'anim-slide-r' : 'opacity-0'}`}>
            <BulletGroup bullets={methodsBullets} />
          </div>

          <div className={`w-full flex md:items-stretch justify-center ${inView ? 'anim-slide-l delay-200' : 'opacity-0'}`}>
            <div className="relative w-full h-[260px] md:h-auto rounded-[16px] overflow-hidden bg-[#121212] shadow-[0px_4px_24px_rgba(18,18,18,0.08)] flex-1">
              <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-4.png" alt="Methods Of Application" fill className="object-cover object-center" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(23,105,255,0.5) 0%, transparent 55%)' }} />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.65)] via-transparent to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center"><PlayBtn /></div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   6. OUR SUGGESTIONS — + / × accordion, first item open
───────────────────────────────────────────────────────────── */
function SuggestionsSection() {
  const [openIndex, setOpenIndex] = useState(0);
  const { ref: videoRef, inView: videoInView } = useInView(0.1);
  const { ref: contentRef, inView: contentInView } = useInView(0.1);

  return (
    <section className="bg-[#F5F6F7] py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2 className="text-[26px] md:text-[44px] font-extrabold text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[56px]">
          Our Suggestions For Choosing The<br />Right Wig In Chennai
        </h2>

        <div
          ref={videoRef}
          className={`relative w-full rounded-[20px] overflow-hidden bg-[#0a0c10] h-[240px] md:h-[380px] shadow-[0px_16px_48px_0px_rgba(0,0,0,0.2)] mb-[40px] md:mb-[48px] ${videoInView ? 'anim-scale-in' : 'opacity-0'}`}
        >
          <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-results-story-sameer-after.png" alt="Why He Cried After Hair Restoration" fill className="object-cover object-center" style={{ opacity: 0.45 }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(5,7,10,0.5) 0%, rgba(5,7,10,0.75) 100%)' }} />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-[20px] text-center gap-[8px]">
            <p className="text-white text-[22px] md:text-[40px] font-extrabold leading-[1.1] tracking-[-0.5px] uppercase m-0">WHY HE CRIED?</p>
            <p className="text-white/80 text-[16px] md:text-[26px] font-extrabold leading-[1.1] uppercase m-0">AFTER HAIR RESTORATION</p>
            <p className="text-[24px] md:text-[36px] m-0 mt-[4px]">😮</p>
          </div>
          <div className="absolute inset-0 flex items-end justify-center pb-[24px] md:pb-[32px]">
            <button className="w-[48px] h-[48px] md:w-[56px] md:h-[56px] rounded-full flex items-center justify-center transition-transform hover:scale-110 duration-200"
              style={{ background: 'rgba(255,0,0,0.92)', boxShadow: '0 4px 20px rgba(255,0,0,0.4)' }}>
              <Play size={18} color="white" fill="white" style={{ marginLeft: 2 }} />
            </button>
          </div>
        </div>

        <div ref={contentRef} className={`max-w-[760px] mx-auto ${contentInView ? 'anim-fade-up' : 'opacity-0'}`}>
          <p style={{ ...cardBodyStyle, color: '#555555', marginBottom: '32px' }}>
            Selecting the right wig in Chennai requires careful consideration. Our specialists are here to guide you through every step. Here are our top suggestions to help you make the best choice for your lifestyle and preferences.
          </p>

          <div className="flex flex-col gap-[8px]">
            {suggestionsAccordion.map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-[12px] overflow-hidden cursor-pointer"
                style={{ border: '1px solid rgba(18,18,18,0.08)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
              >
                <div className="flex justify-between items-center px-[20px] md:px-[24px] py-[16px] md:py-[18px]">
                  <span style={{
                    ...cardBodyStyle,
                    fontWeight: openIndex === i ? 700 : 400,
                    color: openIndex === i ? '#121212' : 'rgba(18,18,18,0.75)',
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
                    <p style={{ ...cardBodyStyle, color: '#555555' }}>{item.desc}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   7. LIFE OF THE HAIR WIG
───────────────────────────────────────────────────────────── */
function LifeSection() {
  const { ref, inView } = useInView();
  return (
    <section className="bg-white py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2 className="text-[26px] md:text-[44px] font-extrabold text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[64px]">
          Life Of The Hair Wig
        </h2>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-[48px] md:gap-[64px] items-stretch">

          <div className={`${inView ? 'anim-slide-r' : 'opacity-0'}`}>
            <div className="rounded-[16px] overflow-hidden h-full flex flex-col justify-center bg-white shadow-[0px_4px_24px_rgba(18,18,18,0.08)]">
              <div className="p-[24px] md:p-[32px] flex flex-col gap-[20px]">
                <p style={{ ...cardBodyStyle, margin: '0 0 16px 0' }}>
                  With the right care and maintenance, our premium hair wigs can last{' '}
                  <strong style={cardBoldStyle}>6 to 12 months</strong>
                  {' '}or longer. The lifespan depends on the quality of the base material, frequency of wear, and how consistently you follow the recommended care routine.
                </p>
                <p style={cardBodyStyle}>
                  Regular servicing every 3–4 weeks is key to extending the life of your system. Our Chennai team provides a complete care kit, video tutorials, and professional maintenance support to keep your wig looking its absolute best between sessions.
                </p>
              </div>
            </div>
          </div>

          <div className={`w-full flex md:items-stretch justify-center ${inView ? 'anim-slide-l delay-200' : 'opacity-0'}`}>
            <div className="relative w-full h-[280px] md:h-auto rounded-[16px] overflow-hidden bg-[#121212] shadow-[0px_4px_24px_rgba(18,18,18,0.08)] flex-1">
              <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-2.png" alt="Life of Hair Wig Chennai" fill className="object-cover object-center" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(23,105,255,0.55) 0%, transparent 55%)' }} />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.85)] via-transparent to-transparent" />
              <div className="absolute bottom-[20px] left-[20px]">
                <div className="flex items-center gap-[6px] mb-[5px]">
                  <div className="w-[7px] h-[7px] rounded-full bg-[#4686FE]" />
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>Undetectable</span>
                </div>
                <p style={{ fontSize: '20px', fontWeight: 700, color: '#fff', lineHeight: '1.2', margin: 0 }}>Hair System in</p>
              </div>
              <div className="absolute inset-0 flex items-center justify-center"><PlayBtn /></div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   8. FAQ — + / × icons, first item open
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
                  <span style={{
                    ...cardBodyStyle,
                    fontWeight: 700,
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
                {openIndex === i && <p style={{ ...cardBodyStyle, paddingBottom: '20px' }}>{faq.a}</p>}
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
            <p style={{ fontSize: '18px', fontWeight: 400, color: 'rgba(255,255,255,0.75)', lineHeight: '150%', letterSpacing: '-0.16px', marginBottom: '24px', maxWidth: '400px' }}>
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
export default function ChennaiWigsPage() {
  return (
    <main>
      <HeroSection />
      <WhyHairLossSection />
      <HumanHairSection />
      <FullWigsSection />
      <MethodsSection />
      <SuggestionsSection />
      <LifeSection />
      <FAQSection />
      <CTA />
      <ResultsRealPeople />
    </main>
  );
}