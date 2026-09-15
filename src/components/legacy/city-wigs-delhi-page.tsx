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
const humanHairBullets = [
  {
    bold: 'Natural-Looking Results:',
    text: ' Our human hair wigs are crafted to look and feel completely natural, blending seamlessly with your existing hair for a result no one can detect.',
  },
  {
    bold: 'Comfortable All Day:',
    text: ' Lightweight and breathable, our clip-on wigs are designed for all-day comfort — perfect for Delhi\'s varied climate and an active lifestyle.',
  },
  {
    bold: 'Fully Customised:',
    text: ' Each system is tailored to your exact hair colour, density, and wave pattern so the wig looks like your natural hair from every angle.',
  },
  {
    bold: 'Ideal For First-Time Users:',
    text: ' If you\'re new to hair systems, our clip-on wigs are the perfect starting point — easy to apply, comfortable to wear, and completely natural-looking.',
  },
];

const fullWigsBullets = [
  {
    bold: 'Patchy And Thin Hair:',
    text: ' Specially designed for men in Delhi experiencing patchy or thinning hair, our systems provide seamless coverage that blends naturally with existing hair.',
  },
  {
    bold: 'Maybe You Prefer To Switch:',
    text: ' Our full wigs suit men who want to change their hairstyle instantly without any long-term commitment — from short to long, straight to wavy.',
  },
  {
    bold: 'Complete Coverage:',
    text: ' For those with extensive hair loss, our full wigs offer 360-degree coverage with a completely natural-looking hairline tailored to your face shape.',
  },
];

const methodsBullets = [
  {
    bold: 'Glue + Wigs:',
    text: ' Medical-grade adhesive is applied to the scalp and the wig is positioned firmly on top. This method offers a longer-lasting, more secure hold — ideal for active lifestyles.',
  },
  {
    bold: 'Adhesive Strips:',
    text: ' Double-sided strips are applied around the perimeter of the wig for a clean, comfortable bond. Easy to apply and re-apply, making it perfect for everyday wear.',
  },
];

const suggestionsAccordion = [
  {
    title: 'Schedule a Free Consultation in Delhi',
    desc: 'Start with a free consultation at our Delhi studio. Our specialists will assess your hair loss, scalp condition, and lifestyle to recommend the most suitable wig for you.',
  },
  {
    title: 'Request Bespoke Customisation',
    desc: 'Always choose a customised wig over a stock option. Custom systems are colour-matched, sized, and styled specifically for you — ensuring a completely undetectable result.',
  },
  {
    title: 'Discovering My Truths',
    desc: 'Understanding your hair loss journey, including its cause and likely progression, helps our team design a long-term solution that remains effective and natural-looking.',
  },
  {
    title: 'Commitment to Our Own Solutions',
    desc: 'Every recommendation we make is backed by our own experience using these products. We only suggest solutions we trust completely and that have delivered real results.',
  },
  {
    title: 'Ongoing System and Education',
    desc: 'We provide ongoing educational resources, video guides, and care kits to ensure you always know how to maintain your wig and get the most from your investment.',
  },
];

const faqs = [
  {
    q: 'Find the best wigs for Men in Delhi?',
    a: 'American Hairline is one of Delhi\'s leading providers of premium human hair wigs for men. We offer fully customised systems, professional fitting, and ongoing maintenance support.',
  },
  {
    q: 'Is it convenient to find wigs for men in Delhi?',
    a: 'Yes. We have service access in Delhi through our network of trained technicians and studio locations. You can also book an online consultation and receive your custom system by courier.',
  },
  {
    q: 'Are wigs suitable for men in Delhi\'s climate?',
    a: 'Absolutely. Our breathable base materials and humidity-resistant adhesives are specifically recommended for Delhi\'s varied climate — keeping you comfortable year-round.',
  },
  {
    q: 'What happens when the wig starts to look less natural?',
    a: 'Book a maintenance session with our team. We will re-adhesive, clean, and re-style your system to restore its completely natural appearance. Regular servicing prevents visible wear.',
  },
  {
    q: 'Is styling equipment appropriate to use on the hair patch?',
    a: 'Yes. Our 100% human hair systems can be styled using standard tools — straighteners, curlers, and blow dryers. Always use heat protection to maintain the quality and longevity of the hair.',
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
            Hair Wigs For Men<br />In Delhi
          </h1>
          <p className={`text-[16px] font-[500] text-[#555555] leading-[1.7] max-w-[600px] mx-auto ${inView ? 'anim-fade-up delay-200' : 'opacity-0'}`}>
            Struggling with hair loss or thinning hair? Our high-quality hair wigs for men in Delhi offer a
            natural-looking, comfortable solution. Discover how our premium hair wigs can help you regain
            confidence and achieve the hairstyle you've always dreamed of.
          </p>
        </div>

        <div className={`relative w-full rounded-[20px] md:rounded-[24px] overflow-hidden bg-[#0a0c10] h-[280px] md:h-[500px] shadow-[0px_24px_64px_0px_rgba(0,0,0,0.2)] ${inView ? 'anim-scale-in delay-300' : 'opacity-0'}`}>
          <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-results-story-sameer-after.png" alt="Hair Wigs In Delhi" fill className="object-cover object-top" sizes="(max-width: 768px) 100vw, 720px" />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.88)] via-[rgba(10,12,16,0.25)] to-transparent" />
          <div className="absolute bottom-[24px] md:bottom-[40px] left-[24px] md:left-[48px]">
            <p className="text-white text-[22px] md:text-[36px] font-extrabold tracking-[0.08em] uppercase leading-none m-0">HAIR WIGS</p>
            <p className="text-white/55 text-[13px] md:text-[18px] font-bold tracking-[0.2em] uppercase mt-[4px] m-0">IN DELHI</p>
          </div>
        </div>

      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   2. MEN'S HUMAN HAIR WIGS IN DELHI
───────────────────────────────────────────────────────────── */
function HumanHairSection() {
  const { ref, inView } = useInView();
  return (
    <section className="bg-[#F5F6F7] py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2 className="text-[26px] md:text-[44px] font-extrabold text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[64px]">
          Men's Human Hair Wigs<br />In Delhi
        </h2>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-[48px] md:gap-[64px] items-stretch">

          <div className={`w-full flex md:items-stretch justify-center ${inView ? 'anim-slide-r' : 'opacity-0'}`}>
            <div className="relative w-full h-[280px] md:h-auto rounded-[16px] overflow-hidden bg-[#0a0c10] shadow-[0px_4px_24px_rgba(18,18,18,0.08)] flex-1">
              <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-2.png" alt="Clip On Hair Wigs Delhi" fill className="object-cover object-center" style={{ opacity: 0.5 }} />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(5,7,10,0.9)] via-[rgba(5,7,10,0.5)] to-[rgba(5,7,10,0.2)]" />
              <div className="absolute top-[20px] md:top-[28px] left-[20px] md:left-[28px] right-[20px]">
                <p className="text-white text-[16px] md:text-[22px] font-extrabold leading-[1.2] m-0 mb-[2px]">
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
                <button className="w-[52px] h-[52px] md:w-[64px] md:h-[64px] rounded-full flex items-center justify-center transition-transform hover:scale-110 duration-200"
                  style={{ background: 'rgba(255,0,0,0.9)', boxShadow: '0 6px 24px rgba(255,0,0,0.4)' }}>
                  <Play size={20} color="white" fill="white" style={{ marginLeft: 3 }} />
                </button>
              </div>
            </div>
          </div>

          <div className={`${inView ? 'anim-slide-l delay-200' : 'opacity-0'}`}>
            <BulletGroup bullets={humanHairBullets} />
          </div>

        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   3. FULL HAIR WIGS ARE MEANT FOR
───────────────────────────────────────────────────────────── */
function FullWigsSection() {
  const { ref, inView } = useInView();
  return (
    <section className="bg-white py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2 className="text-[26px] md:text-[44px] font-extrabold text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[64px]">
          Full Hair Wigs Are Meant For:
        </h2>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-[48px] md:gap-[64px] items-stretch">

          <div className={`${inView ? 'anim-slide-r' : 'opacity-0'}`}>
            <BulletGroup bullets={fullWigsBullets} />
          </div>

          <div className={`w-full flex md:items-stretch justify-center ${inView ? 'anim-slide-l delay-200' : 'opacity-0'}`}>
            <div className="relative w-full h-[280px] md:h-auto rounded-[16px] overflow-hidden bg-[#121212] shadow-[0px_4px_24px_rgba(18,18,18,0.08)] flex-1">
              <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-3.png" alt="Full Hair Wigs" fill className="object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.6)] via-transparent to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-[52px] h-[52px] md:w-[64px] md:h-[64px] rounded-full flex items-center justify-center transition-transform hover:scale-110 duration-200"
                  style={{ background: 'rgba(255,0,0,0.9)', boxShadow: '0 6px 24px rgba(255,0,0,0.4)' }}>
                  <Play size={20} color="white" fill="white" style={{ marginLeft: 3 }} />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   4. METHODS OF APPLICATION
───────────────────────────────────────────────────────────── */
function MethodsSection() {
  const { ref, inView } = useInView();
  return (
    <section className="bg-[#F5F6F7] py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2 className="text-[26px] md:text-[44px] font-extrabold text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[64px]">
          Methods Of Application
        </h2>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-[48px] md:gap-[64px] items-stretch">

          <div className={`w-full flex md:items-stretch justify-center ${inView ? 'anim-slide-r' : 'opacity-0'}`}>
            <div className="relative w-full h-[280px] md:h-auto rounded-[16px] overflow-hidden bg-[#121212] shadow-[0px_4px_24px_rgba(18,18,18,0.08)] flex-1">
              <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-1.png" alt="Methods Of Application" fill className="object-cover object-center" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(23,105,255,0.55) 0%, transparent 55%)' }} />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.75)] via-transparent to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-[52px] h-[52px] md:w-[64px] md:h-[64px] rounded-full flex items-center justify-center transition-transform hover:scale-110 duration-200"
                  style={{ background: 'rgba(255,0,0,0.9)', boxShadow: '0 6px 24px rgba(255,0,0,0.4)' }}>
                  <Play size={20} color="white" fill="white" style={{ marginLeft: 3 }} />
                </button>
              </div>
            </div>
          </div>

          <div className={`${inView ? 'anim-slide-l delay-200' : 'opacity-0'}`}>
            <BulletGroup bullets={methodsBullets} />
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
    <section className="bg-white py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2 className="text-[26px] md:text-[44px] font-extrabold text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[56px]">
          Our Suggestions For Choosing The<br />Right Wig In Delhi
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
            Selecting the right wig in Delhi requires careful consideration. Our specialists are here to guide you through
            every step — from base material to hair type to the right attachment method. Here are our top suggestions
            to help you make the best choice for your lifestyle.
          </p>

          <div className="flex flex-col gap-[8px]">
            {suggestionsAccordion.map((item, i) => (
              <div
                key={i}
                className="bg-[#F5F6F7] rounded-[12px] overflow-hidden cursor-pointer"
                style={{ border: '1px solid rgba(18,18,18,0.06)' }}
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
   6. LIFE OF THE HAIR WIG
───────────────────────────────────────────────────────────── */
function LifeSection() {
  const { ref, inView } = useInView();
  return (
    <section className="bg-[#F5F6F7] py-[72px] md:py-[120px] flex justify-center w-full">
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
                  {' '}or more. The lifespan depends on the quality of the base material, how frequently the wig is worn, and the care routine you follow. Premium bases last significantly longer than entry-level options.
                </p>
                <p style={cardBodyStyle}>
                  Regular servicing every 3–4 weeks extends the life of your system considerably. Our team provides a complete care kit and video tutorials so you can maintain your wig confidently at home between professional sessions. Using the right products is essential — always avoid harsh chemicals or sulphate-based shampoos.
                </p>
              </div>
            </div>
          </div>

          <div className={`w-full flex md:items-stretch justify-center ${inView ? 'anim-slide-l delay-200' : 'opacity-0'}`}>
            <div className="relative w-full h-[280px] md:h-auto rounded-[16px] overflow-hidden bg-[#121212] shadow-[0px_4px_24px_rgba(18,18,18,0.08)] flex-1">
              <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-4.png" alt="Life of Hair Wig" fill className="object-cover object-center" />
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
                <button className="w-[52px] h-[52px] md:w-[64px] md:h-[64px] rounded-full flex items-center justify-center transition-transform hover:scale-110 duration-200"
                  style={{ background: 'rgba(255,0,0,0.9)', boxShadow: '0 6px 24px rgba(255,0,0,0.4)' }}>
                  <Play size={20} color="white" fill="white" style={{ marginLeft: 3 }} />
                </button>
              </div>
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
                {openIndex === i && (
                  <p style={{ ...cardBodyStyle, paddingBottom: '20px' }}>
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
export default function DelhiWigsPage() {
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