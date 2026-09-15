'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ArrowUpRight, ChevronDown, ChevronUp, Play } from 'lucide-react';
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

// Section body text outside cards (subtitles, descriptions)
const bodyTextStyle: React.CSSProperties = {
  fontFamily: "'ProximaNova-Medium', 'Proxima Nova', sans-serif",
  fontSize: '18px',
  fontWeight: 500,
  color: '#555555',
  lineHeight: '1.7',
  margin: 0,
};

const subheadingBoldStyle: React.CSSProperties = {
  fontFamily: "'ProximaNova-Medium', 'Proxima Nova', sans-serif",
  fontSize: '18px',
  fontWeight: 700,
  color: '#121212',
  lineHeight: '1.5',
};

/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────── */

// Section 2 — Men's Human Hair Wigs In India
const aboutBullets = [
  {
    bold: 'Introduction:',
    text: ' Natural-looking human hair wigs for men, designed for hair loss including alopecia and cancer care.',
  },
  {
    bold: 'Product Quality:',
    text: ' Made with 100% real human hair, hand-tied on a breathable lace cap for comfort and natural movement.',
  },
  {
    bold: 'Hair Loss Solutions:',
    text: ' Lace front wigs, full lace wigs, and hair patches designed to look and feel like natural hair.',
  },
  {
    bold: 'Wig Care Products:',
    text: ' Specially designed care products to keep your wig looking its best without damage or irritation.',
  },
  {
    bold: 'Support & Guidance:',
    text: ' Our team is here to help you choose the right wig and feel confident again.',
  },
];

// Section 3 — Full Hair Wigs Are Meant For
const fullWigsBullets = [
  {
    bold: 'Full Hair Wigs:',
    text: ' Designed for men who desire a complete and transformative look. Ideal for those dealing with significant hair loss from conditions like alopecia or undergoing chemotherapy, our full hair wigs offer complete coverage and a natural appearance.',
  },
  {
    bold: 'Wigs For Cancer Patients:',
    text: ' Men who are undergoing chemo therapy, go through hair fall and lose most of their hair. Full wigs for men are ideal in such cases. We advise planning this well in advance.',
  },
  {
    bold: 'Wigs For Alopecia Patients:',
    text: ' Full wigs are designed for those who have lost most or all of their hair. This is a common solution for rising alopecia cases.',
  },
];

// Section 4 — Methods Of Application
const methodsBullets = [
  {
    bold: 'Stick On Wigs:',
    subPoints: [
      'You need to shave of your natural hair and stick it you your scalp.',
      'Needs to be removed and stuck again every 20 to 25 days.',
    ],
  },
  {
    bold: 'Elastic Cap Hair Wigs:',
    subPoints: [
      'This wig cap has an elastic band at the back.',
      'It is to be worn like a cap.',
      'You do not need to shave off your hair for the same.',
      'You can wear it every morning and remove it every night.',
      'You can wear is an per your convenience.',
    ],
  },
];

// Section 5 — Our Suggestions accordion
const suggestions = [
  {
    title: 'Lower density',
    desc: 'Try choosing a lower density / less hair / full wig. This looks more real and is a lot more comfortable.',
  },
  { title: 'Avoid online wigs', desc: '' },
  { title: 'Age appropriate', desc: '' },
  { title: 'Customize your wig', desc: '' },
  { title: "Don't go for cheap wigs", desc: '' },
  { title: 'Go to a wig specialist', desc: '' },
  { title: 'Elastic cap preferred', desc: '' },
  { title: 'Stick on are a little high in maintenance', desc: '' },
  { title: 'Try not choosing a brush back hairstyle', desc: '' },
  { title: 'Keep the hairstyle simple', desc: '' },
  { title: 'Consult in detail with your wig specialist before placing the order', desc: '' },
  { title: 'Avoid Exposed hairline', desc: '' },
];

// Section 6 — Life Of The Hair Wig
const lifeBullets = [
  {
    bold: 'Stick On:',
    text: ' Stick-on systems typically last 5 to 9 months, depending on hair volume and the chosen base. While higher density increases durability, a lighter volume often provides a more natural appearance.',
  },
  {
    bold: 'Elastic Cap Hair Wigs:',
    text: " Elastic caps often last 12+ months since they aren't worn during sleep or showers. While they lack the stuck-down natural hairline of adhesive models, they are an ideal, low-maintenance starting point for new users. We recommend keeping your natural side burns if possible. If not, we can attach adhesive side burns to the wig or cut the elastic cap to create a natural-looking illusion of hair.",
  },
];

// Section 7 — How To Order
const orderSteps = [
  { n: 1, bold: 'Book Consultation:', text: ' Start by booking a free consultation at our center, either online or in person.' },
  { n: 2, bold: 'Talk To Us Live:', text: ' Speak directly with our hair experts who will assess your needs and recommend the ideal wig system.' },
  { n: 3, bold: 'Check Your Needs:', text: ' We take precise measurements and record all your specifications for a perfect customised fit.' },
  { n: 4, bold: 'System Made:', text: ' Your custom wig is crafted and quality-checked before being delivered directly to your door.' },
];

// Section 8 — FAQ
const faqs = [
  {
    q: 'What type of wig is easy to maintain when you live an active lifestyle?',
    a: 'You can use a clip-on type of wig system as it requires no adhesives of any kind and it attaches and comes out at any time simply on its own. Sticky adhesive patches and tapes will not hold in water. This type is excellent for those who live a very active and athletic life.',
  },
  {
    q: 'How do I maintain my wig properly?',
    a: 'Use the right conditioners and shampoo — preferably American Hairline specific products. Clean the wig gently and regularly. Avoid harsh chemicals and always handle the base with care. A consistent conditioning and cleansing routine extends the lifespan significantly.',
  },
  {
    q: 'Can I style my hair in a way I like?',
    a: 'Yes. Our wigs are made from 100% real human hair, which means you can style, cut, colour, and shape your wig just like your natural hair. Our specialists can guide you on the best styles suited to the base you choose.',
  },
  {
    q: 'How do I wash the wig properly?',
    a: 'Use lukewarm water and a sulphate-free shampoo. Gently work the shampoo through the hair without rubbing. Rinse thoroughly, apply conditioner, and allow the wig to air dry on a wig stand. Avoid wringing or twisting the hair.',
  },
  {
    q: 'Should the hairline of a non-surgical hair wig be separate to the hair wig?',
    a: 'No. The hairline should be seamlessly integrated with the wig for the most natural result. Our specialists design each wig with a customised hairline that matches your natural growth pattern, making it completely undetectable.',
  },
  {
    q: 'Do you provide additional service or outside care as a result of wear and tear?',
    a: 'Yes. We offer maintenance and repair services for wigs purchased from us. We also assess and service wigs from other providers wherever possible. Contact our team and we will advise the best course of action.',
  },
  {
    q: 'How long can a wig last?',
    a: 'With proper care — using the right adhesive, removing it correctly, avoiding harsh water conditions, and following a regular maintenance routine — a quality wig can last anywhere from 6 months to longer. Regular professional servicing is recommended to extend the lifespan.',
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
          <h1
            className={`text-[#121212] leading-[1.1] tracking-[-1.5px] mb-[20px] ${inView ? 'anim-fade-up' : 'opacity-0'}`}
            style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800 }}
          >
            Hair Wigs For Men
          </h1>
          <p
            className={`max-w-[580px] mx-auto ${inView ? 'anim-fade-up delay-200' : 'opacity-0'}`}
            style={{ ...bodyTextStyle, textAlign: 'center', margin: '0 auto' }}
          >
            Full head wigs are meant for those who have experienced complete hair loss, due to illness or chemotherapy, etc.
          </p>
        </div>

        <div className={`relative w-full rounded-[20px] md:rounded-[24px] overflow-hidden bg-[#0a0c10] h-[280px] md:h-[500px] shadow-[0px_24px_64px_0px_rgba(0,0,0,0.2)] ${inView ? 'anim-scale-in delay-300' : 'opacity-0'}`}>
          <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-results-story-sameer-after.png" alt="Hair Wigs For Men" fill className="object-cover object-top" sizes="(max-width: 768px) 100vw, 720px" />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.88)] via-[rgba(10,12,16,0.25)] to-transparent" />
          <div className="absolute bottom-[24px] md:bottom-[40px] left-[24px] md:left-[48px]">
            <p className="text-white leading-none m-0 uppercase tracking-[0.08em]" style={{ fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 800 }}>HAIR WIGS</p>
            <p className="text-white/55 uppercase mt-[4px] m-0 tracking-[0.2em]" style={{ fontSize: 'clamp(13px, 1.5vw, 18px)', fontWeight: 700 }}>FOR MEN</p>
          </div>
        </div>

      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   2. MEN'S HUMAN HAIR WIGS IN INDIA
   White bg. Centered heading. Video LEFT + bullet card RIGHT.
───────────────────────────────────────────────────────────── */
function MensWigsSection() {
  const { ref, inView } = useInView();
  return (
    <section className="bg-[#F5F6F7] py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2
          className="text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[64px]"
          style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 800 }}
        >
          Men's Human Hair Wigs<br />In India
        </h2>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-[32px] md:gap-[48px] items-stretch">

          {/* LEFT: video */}
          <div className={`relative w-full rounded-[16px] overflow-hidden bg-[#121212] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.12)] min-h-[280px] md:min-h-[340px] ${inView ? 'anim-slide-r' : 'opacity-0'}`}>
            <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-2.png" alt="Men's Human Hair Wigs" fill className="object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.4)] via-transparent to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="w-[52px] h-[52px] md:w-[64px] md:h-[64px] rounded-full flex items-center justify-center transition-transform hover:scale-110 duration-200"
                style={{ background: 'rgba(255,0,0,0.9)', boxShadow: '0 6px 24px rgba(255,0,0,0.4)' }}>
                <Play size={20} color="white" fill="white" style={{ marginLeft: 3 }} />
              </button>
            </div>
          </div>

          {/* RIGHT: bullet card */}
          <div
            className={`rounded-[16px] h-full ${inView ? 'anim-slide-l delay-200' : 'opacity-0'}`}
            style={{ background: '#fff', boxShadow: '0 4px 24px rgba(18,18,18,0.08)', padding: '28px 32px' }}
          >
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {aboutBullets.map((b, i) => (
                <li key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span style={{ color: '#121212', fontSize: '18px', lineHeight: '150%', flexShrink: 0, marginTop: '1px' }}>•</span>
                  <p style={cardBodyStyle}>
                    <strong style={cardBoldStyle}>{b.bold}</strong>
                    {b.text}
                  </p>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   3. FULL HAIR WIGS ARE MEANT FOR
   White bg. Centered heading. Bullet card LEFT + video RIGHT.
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

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-[32px] md:gap-[48px] items-stretch">

          {/* LEFT: bullet card */}
          <div
            className={`rounded-[16px] h-full ${inView ? 'anim-slide-r' : 'opacity-0'}`}
            style={{ background: '#fff', boxShadow: '0 4px 24px rgba(18,18,18,0.08)', padding: '28px 32px' }}
          >
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {fullWigsBullets.map((b, i) => (
                <li key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span style={{ color: '#121212', fontSize: '18px', lineHeight: '150%', flexShrink: 0, marginTop: '1px' }}>•</span>
                  <p style={cardBodyStyle}>
                    <strong style={cardBoldStyle}>{b.bold}</strong>
                    {' '}{b.text}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT: video */}
          <div className={`relative w-full rounded-[16px] overflow-hidden bg-[#121212] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.12)] min-h-[280px] md:min-h-[340px] ${inView ? 'anim-slide-l delay-200' : 'opacity-0'}`}>
            <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-3.png" alt="Full Hair Wigs Are Meant For" fill className="object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.4)] via-transparent to-transparent" />
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
   4. METHODS OF APPLICATION
   Grey bg. Centered heading. Video LEFT + sub-point bullet card RIGHT.
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

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-[32px] md:gap-[48px] items-stretch">

          {/* LEFT: video */}
          <div className={`relative w-full rounded-[16px] overflow-hidden bg-[#121212] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.12)] min-h-[280px] md:min-h-[340px] ${inView ? 'anim-slide-r' : 'opacity-0'}`}>
            <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-1.png" alt="Methods Of Application" fill className="object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.4)] via-transparent to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="w-[52px] h-[52px] md:w-[64px] md:h-[64px] rounded-full flex items-center justify-center transition-transform hover:scale-110 duration-200"
                style={{ background: 'rgba(255,0,0,0.9)', boxShadow: '0 6px 24px rgba(255,0,0,0.4)' }}>
                <Play size={20} color="white" fill="white" style={{ marginLeft: 3 }} />
              </button>
            </div>
          </div>

          {/* RIGHT: bullet card with sub-points */}
          <div
            className={`rounded-[16px] h-full ${inView ? 'anim-slide-l delay-200' : 'opacity-0'}`}
            style={{ background: '#fff', boxShadow: '0 4px 24px rgba(18,18,18,0.08)', padding: '28px 32px' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              {methodsBullets.map((b, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <span style={{ color: '#121212', fontSize: '18px', lineHeight: '150%', flexShrink: 0, marginTop: '1px' }}>•</span>
                    <p style={cardBodyStyle}><strong style={cardBoldStyle}>{b.bold}</strong></p>
                  </div>
                  <div style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {b.subPoints.map((point, j) => (
                      <p key={j} style={cardBodyStyle}>– {point}</p>
                    ))}
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
   5. OUR SUGGESTIONS FOR CHOOSING THE RIGHT WIG IN INDIA
   White bg. Centered heading. Full-width video + accordion.
───────────────────────────────────────────────────────────── */
function SuggestionsSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { ref: videoRef, inView: videoInView } = useInView(0.1);
  const { ref: accordRef, inView: accordInView } = useInView(0.1);

  return (
    <section className="bg-white py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2
          className="text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[56px]"
          style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 800 }}
        >
          Our Suggestions For Choosing The<br />Right Wig In India
        </h2>

        {/* Full-width video */}
        <div
          ref={videoRef}
          className={`relative w-full rounded-[20px] overflow-hidden bg-[#0a0c10] h-[240px] md:h-[400px] shadow-[0px_16px_48px_0px_rgba(0,0,0,0.18)] mb-[32px] md:mb-[40px] ${videoInView ? 'anim-scale-in' : 'opacity-0'}`}
        >
          <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-results-story-sameer-after.png" alt="Choosing The Right Wig" fill className="object-cover object-center" style={{ opacity: 0.7 }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.55)] via-transparent to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <button className="w-[52px] h-[52px] md:w-[64px] md:h-[64px] rounded-full flex items-center justify-center transition-transform hover:scale-110 duration-200"
              style={{ background: 'rgba(255,0,0,0.9)', boxShadow: '0 4px 20px rgba(255,0,0,0.4)' }}>
              <Play size={20} color="white" fill="white" style={{ marginLeft: 3 }} />
            </button>
          </div>
        </div>

        {/* Accordion */}
        <div ref={accordRef} className={`flex flex-col gap-[4px] ${accordInView ? 'anim-fade-up' : 'opacity-0'}`}>
          {suggestions.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="bg-white rounded-[12px] overflow-hidden cursor-pointer"
                style={{ border: '1px solid rgba(18,18,18,0.08)', boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}
                onClick={() => setOpenIndex(isOpen ? null : i)}
              >
                <div className="flex items-center justify-between px-[18px] md:px-[22px] py-[14px] md:py-[16px]">
                  <span style={{ ...bodyTextStyle, color: isOpen ? '#121212' : 'rgba(18,18,18,0.75)', fontWeight: isOpen ? 500 : 500 }}>
                    {item.title}
                  </span>
                  {isOpen
                    ? <ChevronUp size={17} style={{ color: 'rgba(18,18,18,0.4)', flexShrink: 0 }} />
                    : <ChevronDown size={17} style={{ color: 'rgba(18,18,18,0.4)', flexShrink: 0 }} />
                  }
                </div>
                {isOpen && item.desc && (
                  <div className="px-[18px] md:px-[22px] pb-[14px]">
                    <p style={{ ...bodyTextStyle, opacity: 0.75 }}>{item.desc}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   6. LIFE OF THE HAIR WIG
   Grey bg. Centered heading. Bullet card LEFT + video RIGHT.
───────────────────────────────────────────────────────────── */
function LifeOfWigSection() {
  const { ref, inView } = useInView();
  return (
    <section className="bg-[#F5F6F7] py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2
          className="text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[64px]"
          style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 800 }}
        >
          Life Of The Hair Wig
        </h2>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-[32px] md:gap-[48px] items-stretch">

          {/* LEFT: bullet card — exact match to reference image */}
          <div
            className={`rounded-[16px] ${inView ? 'anim-slide-r' : 'opacity-0'}`}
            style={{
              background: '#fff',
              boxShadow: '0 4px 24px rgba(18,18,18,0.08)',
              padding: '28px 32px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignSelf: 'stretch',
            }}
          >
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {lifeBullets.map((b, i) => (
                <li key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <span style={{ color: '#121212', fontSize: '18px', lineHeight: '150%', flexShrink: 0, marginTop: '1px' }}>•</span>
                  <p style={cardBodyStyle}>
                    <strong style={cardBoldStyle}>{b.bold}</strong>
                    {b.text}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT: video — align-self: stretch to match card height */}
          <div className={`relative w-full rounded-[16px] overflow-hidden bg-[#121212] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.12)] min-h-[280px] md:min-h-[340px] ${inView ? 'anim-slide-l delay-200' : 'opacity-0'}`}
            style={{ alignSelf: 'stretch' }}>
            <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-4.png" alt="Life Of The Hair Wig" fill className="object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.55)] via-transparent to-transparent" />
            <div className="absolute bottom-[16px] left-[16px] right-[16px]">
              <p style={{ color: '#fff', fontSize: 'clamp(14px, 2vw, 20px)', fontWeight: 800, lineHeight: 1.2, margin: 0 }}>
                <span style={{ color: '#4686FE', fontStyle: 'italic' }}>Undetectable</span> Hair System in India
              </p>
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
   7. HOW DO I ORDER MY HAIR SYSTEM?
   White bg. Scrolling step cards LEFT + sticky heading/video RIGHT.
───────────────────────────────────────────────────────────── */
function HowToOrderSection() {
  const stepCardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeStep, setActiveStep] = useState(0);
  const { ref: mobileRef, inView: mobileInView } = useInView(0.1);

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
  }, []);

  return (
    <section className="bg-white py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        {/* ── DESKTOP ── */}
        <div className="hidden lg:flex gap-[56px] items-start">

          {/* LEFT: scrolling step cards + CTAs */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {orderSteps.map((step, i) => (
              <div
                key={step.n}
                ref={(el) => { stepCardRefs.current[i] = el; }}
                style={{ background: '#fff', border: '1px solid rgba(18,18,18,0.08)', borderRadius: '16px', padding: '22px 26px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                  <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'linear-gradient(135deg, #4686FE, #1769FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: '#fff', fontSize: '13px', fontWeight: 700 }}>
                    {step.n}
                  </div>
                  <p style={subheadingBoldStyle}>{step.bold}</p>
                </div>
                <p style={bodyTextStyle}>{step.text}</p>
              </div>
            ))}
            <div style={{ paddingTop: '8px', display: 'flex', flexDirection: 'row', gap: '14px' }}>
              <button className="flex items-center justify-center gap-[8px] px-[28px] py-[14px] rounded-[10px] text-white transition-transform hover:scale-[1.01] duration-200"
                style={{ fontSize: '18px', fontWeight: 700, background: 'linear-gradient(135deg, #4686FE, #1769FF)', boxShadow: '0 8px 24px rgba(23,105,255,0.3)', border: 'none', cursor: 'pointer' }}>
                Book Consultation <ArrowUpRight size={16} />
              </button>
              <button className="flex items-center justify-center gap-[8px] px-[28px] py-[14px] rounded-[10px] text-[#1769FF] bg-white border-2 border-[#1769FF] transition-transform hover:scale-[1.01] duration-200"
                style={{ fontSize: '18px', fontWeight: 700, cursor: 'pointer' }}>
                Quality Check <ArrowUpRight size={16} />
              </button>
            </div>
          </div>

          {/* RIGHT: sticky heading + video */}
          <div style={{ width: '42%', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '20px', position: 'sticky', top: '100px', alignSelf: 'flex-start' }}>
            <h2 className="text-[#121212] leading-[1.2] tracking-[-0.5px]"
              style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 800, margin: 0 }}>
              How Do I Order My<br />Hair System?
            </h2>
            <div className="relative w-full rounded-[20px] overflow-hidden bg-[#0a0c10] shadow-[0px_16px_48px_0px_rgba(0,0,0,0.2)]"
              style={{ aspectRatio: '16 / 9' }}>
              <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-results-story-amit-after.png" alt="How To Order" fill className="object-cover object-center" style={{ opacity: 0.45 }} />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(5,7,10,0.9)] via-[rgba(5,7,10,0.6)] to-[rgba(5,7,10,0.3)]" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-[20px] gap-[6px]">
                <p className="text-white leading-[1.1] uppercase m-0" style={{ fontSize: 'clamp(16px, 2.2vw, 28px)', fontWeight: 800 }}>
                  HOW TO ORDER <span style={{ color: '#F5C518' }}>ONLINE!</span>
                </p>
                <p className="text-white leading-[1.1] uppercase m-0" style={{ fontSize: 'clamp(13px, 1.6vw, 20px)', fontWeight: 800 }}>
                  AHL HAIR SYSTEMS!
                </p>
              </div>
              <div className="absolute inset-0 flex items-end justify-center pb-[20px]">
                <button className="w-[48px] h-[48px] rounded-full flex items-center justify-center transition-transform hover:scale-110 duration-200"
                  style={{ background: 'rgba(255,0,0,0.92)', boxShadow: '0 4px 20px rgba(255,0,0,0.4)' }}>
                  <Play size={18} color="white" fill="white" style={{ marginLeft: 2 }} />
                </button>
              </div>
            </div>
            <p style={{ ...bodyTextStyle, color: '#555555' }}>
              Getting your custom hair wig is simple. Follow these steps to start your journey with American Hairline.
            </p>
          </div>

        </div>

        {/* ── MOBILE ── */}
        <div className="flex flex-col gap-[28px] lg:hidden">
          <h2 className="text-[#121212] leading-[1.2] tracking-[-0.5px] text-center"
            style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 800, margin: 0 }}>
            How Do I Order My<br />Hair System?
          </h2>
          <div ref={mobileRef} className={`relative w-full rounded-[20px] overflow-hidden bg-[#0a0c10] shadow-[0px_16px_48px_0px_rgba(0,0,0,0.2)] ${mobileInView ? 'anim-scale-in' : 'opacity-0'}`}
            style={{ aspectRatio: '16 / 9' }}>
            <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-results-story-amit-after.png" alt="How To Order" fill className="object-cover object-center" style={{ opacity: 0.45 }} />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(5,7,10,0.9)] via-[rgba(5,7,10,0.6)] to-[rgba(5,7,10,0.3)]" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-[20px] gap-[6px]">
              <p className="text-white leading-[1.1] uppercase m-0" style={{ fontSize: 'clamp(16px, 4.5vw, 22px)', fontWeight: 800 }}>HOW TO ORDER <span style={{ color: '#F5C518' }}>ONLINE!</span></p>
              <p className="text-white leading-[1.1] uppercase m-0" style={{ fontSize: 'clamp(12px, 3.5vw, 16px)', fontWeight: 800 }}>AHL HAIR SYSTEMS!</p>
            </div>
            <div className="absolute inset-0 flex items-end justify-center pb-[16px]">
              <button className="w-[44px] h-[44px] rounded-full flex items-center justify-center"
                style={{ background: 'rgba(255,0,0,0.92)', boxShadow: '0 4px 20px rgba(255,0,0,0.4)' }}>
                <Play size={16} color="white" fill="white" style={{ marginLeft: 2 }} />
              </button>
            </div>
          </div>
          <div className={`flex flex-col gap-[12px] ${mobileInView ? 'anim-fade-up' : 'opacity-0'}`}>
            {orderSteps.map((step) => (
              <div key={step.n} className="flex gap-[14px] items-start p-[20px] bg-[#F5F6F7] rounded-[12px]"
                style={{ border: '1px solid rgba(18,18,18,0.06)' }}>
                <div className="w-[32px] h-[32px] rounded-full flex items-center justify-center flex-shrink-0 text-white"
                  style={{ background: 'linear-gradient(135deg, #4686FE, #1769FF)', fontSize: '14px', fontWeight: 800 }}>
                  {step.n}
                </div>
                <p style={bodyTextStyle}><strong style={subheadingBoldStyle}>{step.bold}</strong>{step.text}</p>
              </div>
            ))}
          </div>
          <div className={`flex flex-col sm:flex-row gap-[14px] justify-center ${mobileInView ? 'anim-fade-up delay-300' : 'opacity-0'}`}>
            <button className="flex items-center justify-center gap-[8px] px-[28px] py-[14px] rounded-[10px] text-white transition-transform hover:scale-[1.01] duration-200"
              style={{ fontSize: '18px', fontWeight: 700, background: 'linear-gradient(135deg, #4686FE, #1769FF)', boxShadow: '0 8px 24px rgba(23,105,255,0.3)', border: 'none', cursor: 'pointer' }}>
              Book Consultation <ArrowUpRight size={16} />
            </button>
            <button className="flex items-center justify-center gap-[8px] px-[28px] py-[14px] rounded-[10px] text-[#1769FF] font-bold border-2 border-[#1769FF] bg-white transition-transform hover:scale-[1.01] duration-200"
              style={{ fontSize: '18px', cursor: 'pointer' }}>
              Quality Check <ArrowUpRight size={16} />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   8. FAQ
   Grey bg. + / × toggle, animated collapse, blue CTA card.
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
            {faqs.map((faq, i) => {
              const isOpen = openIndex === i;
              return (
                <div key={i} className="cursor-pointer" style={{ borderBottom: '1px solid rgba(18,18,18,0.08)' }}
                  onClick={() => setOpenIndex(isOpen ? null : i)}>
                  <div className="flex justify-between items-center py-[18px] md:py-[20px]">
                    <span style={{ ...bodyTextStyle, fontSize: isOpen ? '20px' : '18px', color: isOpen ? '#121212' : 'rgba(18,18,18,0.65)', paddingRight: '16px', transition: 'color 0.3s' }}>
                      {faq.q}
                    </span>
                    <span style={{ fontSize: '22px', fontWeight: 400, color: 'rgba(18,18,18,0.4)', flexShrink: 0, lineHeight: 1 }}>
                      {isOpen ? '×' : '+'}
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateRows: isOpen ? '1fr' : '0fr', transition: 'grid-template-rows 0.3s ease' }}>
                    <div style={{ overflow: 'hidden' }}>
                      <p style={{ ...bodyTextStyle, opacity: 0.75, paddingBottom: '20px' }}>{faq.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={`rounded-[16px] p-[28px] md:p-[36px] ${inView ? 'anim-fade-up delay-300' : 'opacity-0'}`}
            style={{ background: 'linear-gradient(135deg, #4686FE 0%, #1769FF 100%)', boxShadow: '0 12px 32px rgba(23,105,255,0.3)' }}>
            <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', letterSpacing: '-0.4px', marginBottom: '8px', lineHeight: '1.2' }}>
              Still have questions?
            </h3>
            <p style={{ ...bodyTextStyle, color: 'rgba(255,255,255,0.75)', marginBottom: '24px', maxWidth: '400px' }}>
              No worries, we're here to guide you. Talk to us, we will support you completely.
            </p>
            <button className="flex items-center gap-[8px] bg-white text-[#1769FF] px-[20px] py-[11px] rounded-[10px] transition-transform hover:scale-[1.02] duration-200"
              style={{ fontSize: '16px', fontWeight: 700, boxShadow: '0 4px 14px rgba(0,0,0,0.1)', border: 'none', cursor: 'pointer' }}>
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
export default function HairWigsForMenPage() {
  return (
    <main>
      <HeroSection />
      <MensWigsSection />
      <FullWigsSection />
      <MethodsSection />
      <SuggestionsSection />
      <LifeOfWigSection />
      <HowToOrderSection />
      <FAQSection />
      <CTA />
      <ResultsRealPeople />
    </main>
  );
}