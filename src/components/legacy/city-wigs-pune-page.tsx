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
const humanHairBullets = [
  {
    bold: 'Provides Instant Volume:',
    text: ' Our clip-on hair wigs give you an immediate, natural-looking volume boost — no waiting, no surgery, just instant confidence.',
  },
  {
    bold: 'Easy Scalp Maintenance:',
    text: ' Our wigs allow for easy access to the scalp for cleaning and maintenance, ensuring your scalp stays healthy.',
  },
  {
    bold: '100% Human Hair:',
    text: ' Our wigs are made from premium human hair and can be styled, coloured, and treated exactly like your natural hair.',
  },
  {
    bold: 'Recommended For First-Time Users:',
    text: ' A perfect starting point if you are new to hair systems. Easy to apply and remove, with a completely natural appearance.',
  },
];

const fullWigsBullets = [
  {
    bold: 'Patchy And Thin Hair:',
    text: ' Our systems are specially designed for men experiencing patchy or thin hair, providing seamless coverage that blends naturally.',
  },
  {
    bold: 'Complete Coverage Needs:',
    text: ' If you have extensive hair loss on top of the head, our full hair wigs provide complete and natural-looking coverage.',
  },
  {
    bold: 'Maybe You Prefer:',
    text: ' Our wigs also suit people who simply want the freedom to change hairstyles instantly, without the commitment of a permanent solution.',
  },
];

const methodsBullets = [
  {
    bold: 'Glue + Wigs:',
    text: ' This method involves applying a medical-grade adhesive to the scalp, then placing the hair system firmly on top. This provides a longer-lasting hold — ideal for active lifestyles.',
  },
  {
    bold: 'Adhesive Strip Wigs:',
    text: ' Double-sided adhesive strips are placed along the perimeter of the wig base and pressed onto the scalp. This method is clean, easy to apply, and comfortable for everyday wear.',
  },
];

const suggestionsAccordion = [
  {
    title: 'Match to Your Scalp Colour',
    desc: 'The base of your wig should closely match your scalp tone for a natural, undetectable look. Our colour-matching service ensures the perfect fit every time.',
  },
  {
    title: 'Choose the Right Cap Size',
    desc: 'A properly fitted cap is essential for comfort and security. We provide precise measurements to ensure your wig stays in place without feeling tight.',
  },
  {
    title: 'Check the Cap Style',
    desc: 'Different cap constructions offer varying levels of breathability, naturalness, and durability. Our consultants will help you select the best style for your lifestyle.',
  },
  {
    title: 'Maintain Hair Quality',
    desc: 'Using sulphate-free shampoos and conditioning products specifically designed for hair systems keeps the hair looking fresh and natural for longer.',
  },
  {
    title: 'Try Before You Buy',
    desc: 'We encourage clients to try different styles during consultation before committing, ensuring you are completely happy with your choice.',
  },
];

const faqs = [
  {
    q: 'Are wigs suitable to wear all day?',
    a: 'Yes. Our wigs are designed for all-day comfort. With the right adhesive or clip-on method, you can wear them from morning to night without any discomfort.',
  },
  {
    q: 'Can wigs be styled in different ways?',
    a: 'Absolutely. Our 100% human hair wigs can be cut, styled, blow-dried, and even coloured — giving you complete freedom over your look.',
  },
  {
    q: 'Are wigs suitable for individuals undergoing chemotherapy?',
    a: 'Yes. We provide specially designed, soft, and comfortable wigs for individuals undergoing chemotherapy. Our team offers sensitive and supportive consultations.',
  },
  {
    q: 'Is there any possible way to secure the wigs properly?',
    a: 'Yes. We offer multiple secure attachment methods including medical-grade adhesive, adhesive strips, and clip-on systems. Our team will guide you to the best option for your needs.',
  },
  {
    q: 'Is styling equipment appropriate for wig usage?',
    a: 'Standard styling tools such as straighteners, curlers, and dryers can be used on our human hair wigs. We recommend using heat protection products to maintain the hair quality.',
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
          <h1
            className={`text-[32px] md:text-[52px] text-[#121212] leading-[1.1] tracking-[-1.5px] mb-[20px] ${inView ? 'anim-fade-up' : 'opacity-0'}`}
            style={{ fontWeight: 800 }}
          >
            Hair Wigs For Men<br />In Pune
          </h1>
          <p
            className={`text-[#555555] leading-[1.7] max-w-[600px] mx-auto ${inView ? 'anim-fade-up delay-200' : 'opacity-0'}`}
            style={{ fontSize: '16px', fontWeight: 500 }}
          >
            Struggling with hair loss or thinning hair? Our high-quality hair wigs for men in Pune offer a
            natural-looking, comfortable solution. Discover how our premium hair wigs can help you regain
            confidence and achieve the hairstyle you've always dreamed of.
          </p>
        </div>

        {/* Cinematic hero card */}
        <div className={`relative w-full rounded-[20px] md:rounded-[24px] overflow-hidden bg-[#0a0c10] h-[280px] md:h-[500px] shadow-[0px_24px_64px_0px_rgba(0,0,0,0.2)] ${inView ? 'anim-scale-in delay-300' : 'opacity-0'}`}>
          <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-results-story-sameer-after.png" alt="Hair Wigs In Pune" fill className="object-cover object-top" sizes="(max-width: 768px) 100vw, 720px" />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.88)] via-[rgba(10,12,16,0.25)] to-transparent" />
          <div className="absolute bottom-[24px] md:bottom-[40px] left-[24px] md:left-[48px]">
            <p
              className="text-white leading-none m-0 uppercase tracking-[0.08em]"
              style={{ fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 800 }}
            >
              HAIR WIGS
            </p>
            <p
              className="text-white/55 uppercase mt-[4px] m-0 tracking-[0.2em]"
              style={{ fontSize: 'clamp(13px, 1.5vw, 18px)', fontWeight: 700 }}
            >
              IN PUNE
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   2. MEN'S HUMAN HAIR WIGS — video left, card right
───────────────────────────────────────────────────────────── */
function HumanHairSection() {
  const { ref, inView } = useInView();
  return (
    <section className="bg-[#F5F6F7] py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2
          className="text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[64px]"
          style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 800 }}
        >
          Men's Human Hair Wigs<br />In Pune
        </h2>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-[48px] md:gap-[64px] items-center">

          {/* "HY SHAVE? TRY CLIP-ON" branded video left */}
          <div className={`relative w-full h-[280px] md:h-[420px] rounded-[16px] overflow-hidden bg-[#0a0c10] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.15)] ${inView ? 'anim-slide-r' : 'opacity-0'}`}>
            <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-2.png" alt="Clip On Hair Wigs Pune" fill className="object-cover object-center" style={{ opacity: 0.5 }} />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(5,7,10,0.9)] via-[rgba(5,7,10,0.5)] to-[rgba(5,7,10,0.2)]" />
            <div className="absolute top-[20px] md:top-[28px] left-[20px] md:left-[28px]">
              <p className="text-white leading-[1.2] m-0" style={{ fontSize: 'clamp(16px, 1.8vw, 22px)', fontWeight: 800 }}>
                <span className="text-white/60">HY SHAVE?</span>{' '}
                <span className="text-white">TRY</span>{' '}
                <span style={{ color: '#4686FE' }}>CLIP-ON</span>
              </p>
            </div>
            <div className="absolute bottom-[20px] left-[20px] right-[20px] flex justify-between items-end">
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>Before</span>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>After</span>
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

          {/* Bullet card right */}
          <div className={`${inView ? 'anim-slide-l delay-200' : 'opacity-0'}`}>
            <BulletGroup bullets={humanHairBullets} />
          </div>

        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   3. FULL HAIR WIGS — card left, video right
───────────────────────────────────────────────────────────── */
function FullWigsSection() {
  const { ref, inView } = useInView();
  return (
    <section className="bg-white py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2
          className="text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[64px]"
          style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 800 }}
        >
          Full Hair Wigs Are Meant For:
        </h2>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-[48px] md:gap-[64px] items-center">

          {/* Bullet card left */}
          <div className={`${inView ? 'anim-slide-r' : 'opacity-0'}`}>
            <BulletGroup bullets={fullWigsBullets} />
          </div>

          {/* Video right */}
          <div className={`relative w-full h-[260px] md:h-[380px] rounded-[16px] overflow-hidden bg-[#121212] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.12)] ${inView ? 'anim-slide-l delay-200' : 'opacity-0'}`}>
            <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-3.png" alt="Full Hair Wigs Pune" fill className="object-cover object-center" />
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
   4. METHODS OF APPLICATION — card left, video right
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
          Methods Of Application
        </h2>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-[48px] md:gap-[64px] items-center">

          {/* Bullet card left */}
          <div className={`${inView ? 'anim-slide-r' : 'opacity-0'}`}>
            <BulletGroup bullets={methodsBullets} />
          </div>

          {/* Video right */}
          <div className={`relative w-full h-[260px] md:h-[380px] rounded-[16px] overflow-hidden bg-[#121212] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.12)] ${inView ? 'anim-slide-l delay-200' : 'opacity-0'}`}>
            <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-1.png" alt="Methods Of Application" fill className="object-cover object-center" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(23,105,255,0.55) 0%, transparent 55%)' }} />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.75)] via-transparent to-transparent" />
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
   5. OUR SUGGESTIONS — + / × accordion, first item open
───────────────────────────────────────────────────────────── */
function SuggestionsSection() {
  const [openIndex, setOpenIndex] = useState(0);
  const { ref: videoRef, inView: videoInView } = useInView(0.1);
  const { ref: contentRef, inView: contentInView } = useInView(0.1);

  return (
    <section className="bg-[#F5F6F7] py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2
          className="text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[56px]"
          style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 800 }}
        >
          Our Suggestions For Choosing The<br />Right Wig In Pune
        </h2>

        {/* "WHY HE CRIED?" branded dark video */}
        <div
          ref={videoRef}
          className={`relative w-full rounded-[20px] overflow-hidden bg-[#0a0c10] h-[240px] md:h-[380px] shadow-[0px_16px_48px_0px_rgba(0,0,0,0.2)] mb-[40px] md:mb-[48px] ${videoInView ? 'anim-scale-in' : 'opacity-0'}`}
        >
          <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-results-story-sameer-after.png" alt="Why He Cried After Hair Restoration" fill className="object-cover object-center" style={{ opacity: 0.45 }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(5,7,10,0.5) 0%, rgba(5,7,10,0.75) 100%)' }} />
          <div className="absolute inset-0 flex flex-col items-center justify-center px-[20px] text-center gap-[8px]">
            <p className="text-white leading-[1.1] tracking-[-0.5px] uppercase m-0" style={{ fontSize: 'clamp(22px, 3.5vw, 40px)', fontWeight: 800 }}>
              WHY HE CRIED?
            </p>
            <p className="text-white/80 leading-[1.1] uppercase m-0" style={{ fontSize: 'clamp(16px, 2.2vw, 26px)', fontWeight: 800 }}>
              AFTER HAIR RESTORATION
            </p>
            <p className="m-0 mt-[4px]" style={{ fontSize: 'clamp(24px, 3vw, 36px)' }}>😮</p>
          </div>
          <div className="absolute inset-0 flex items-end justify-center pb-[24px] md:pb-[32px]">
            <button
              className="w-[48px] h-[48px] md:w-[56px] md:h-[56px] rounded-full flex items-center justify-center transition-transform hover:scale-110 duration-200"
              style={{ background: 'rgba(255,0,0,0.92)', boxShadow: '0 4px 20px rgba(255,0,0,0.4)' }}
            >
              <Play size={18} color="white" fill="white" style={{ marginLeft: 2 }} />
            </button>
          </div>
        </div>

        {/* Intro paragraph + + / × accordion */}
        <div ref={contentRef} className={`max-w-[760px] mx-auto ${contentInView ? 'anim-fade-up' : 'opacity-0'}`}>
          <p style={{ fontSize: '16px', fontWeight: 500, color: '#555555', lineHeight: '1.7', marginBottom: '32px' }}>
            Selecting the right wig requires careful consideration. Our specialists are here to guide you through
            every step — from base material to hair type to attachment method. Here are our top suggestions
            to help you make the best choice for your lifestyle and preferences.
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

      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   6. LIFE OF THE HAIR WIG
───────────────────────────────────────────────────────────── */
function LifeSection() {
  const { ref, inView } = useInView();
  return (
    <section className="bg-white py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2
          className="text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[64px]"
          style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 800 }}
        >
          Life Of The Hair Wig
        </h2>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-[48px] md:gap-[64px] items-center">

          {/* 2 paragraphs in single card left */}
          <div className={`${inView ? 'anim-slide-r' : 'opacity-0'}`}>
            <div
              className="rounded-[12px] overflow-hidden"
              style={{
                background: '#fff',
                boxShadow: '0 2px 12px rgba(18,18,18,0.07)',
                border: '1px solid rgba(18,18,18,0.06)',
              }}
            >
              <div className="p-[18px] md:p-[22px]">
                <p style={{ fontSize: '16px', fontWeight: 500, color: '#555555', lineHeight: '1.7', margin: '0 0 16px 0' }}>
                  With the right care and maintenance, our premium hair wigs can last{' '}
                  <strong style={{ fontWeight: 700, color: '#121212' }}>6 to 12 months</strong>
                  {' '}or more. The lifespan depends on the quality of the base material, how frequently the wig is worn, and the care routine you follow. Premium bases last significantly longer than entry-level options.
                </p>
                <p style={{ fontSize: '16px', fontWeight: 500, color: '#555555', lineHeight: '1.7', margin: 0 }}>
                  Regular servicing every 3–4 weeks extends the life of your system considerably. Our team provides a complete care kit and video tutorials so you can maintain your wig confidently at home between professional sessions. Using the right products is essential — always avoid harsh chemicals or sulphate-based shampoos.
                </p>
              </div>
            </div>
          </div>

          {/* Branded "Undetectable Hair System" video right */}
          <div className={`relative w-full h-[260px] md:h-[380px] rounded-[16px] overflow-hidden bg-[#121212] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.12)] ${inView ? 'anim-slide-l delay-200' : 'opacity-0'}`}>
            <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-4.png" alt="Life of Hair Wig Pune" fill className="object-cover object-center" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(23,105,255,0.55) 0%, transparent 55%)' }} />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.85)] via-transparent to-transparent" />
            <div className="absolute bottom-[20px] left-[20px]">
              <div className="flex items-center gap-[6px] mb-[5px]">
                <div className="w-[7px] h-[7px] rounded-full bg-[#4686FE]" />
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>Undetectable</span>
              </div>
              <p style={{ fontSize: '20px', fontWeight: 700, color: '#fff', lineHeight: '1.2', margin: 0 }}>Hair System in</p>
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
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   7. FAQ — + / × icons, first item open
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

          {/* FAQ accordion */}
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
                  <span style={{ fontSize: '20px', fontWeight: 700, color: 'rgba(18,18,18,0.4)', flexShrink: 0, userSelect: 'none' as const, lineHeight: 1 }}>
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
            <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', letterSpacing: '-0.4px', marginBottom: '8px', lineHeight: '1.2' }}>
              Still have questions?
            </h3>
            <p style={{ fontSize: '16px', fontWeight: 500, color: 'rgba(255,255,255,0.75)', lineHeight: '1.65', marginBottom: '24px', maxWidth: '400px' }}>
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
export default function PunePage() {
  return (
    <main>
      <HeroSection />
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