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
  Subheadings / bold labels: 20px, fontWeight 700, color #121212
  Body / description text:   16px, fontWeight 500, color #555
  Small caps / tags:         12px, fontWeight 700
*/

/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────── */
const hairPatchBullets = [
  {
    bold: 'Premium Hair Systems In Rajasthan:',
    text: ' Our manufacturer provides quality, quick and customised hair systems. Our Indian hair wigs give an excellent option. Our high-quality wigs are carefully crafted to look natural, provide comfort, and can be styled to match your preferred hair replacement method.',
  },
  {
    bold: 'We recognise that every individual is unique,',
    text: ' and our expert team never compromise. With our customised Hair Systems, we offer a personalised approach to hair replacement that ensures a perfect fit and utmost satisfaction.',
  },
];

const excellentChoiceAccordion = [
  {
    title: 'Personalised Personalised',
    desc: 'Our team takes the time to understand your unique hair loss pattern, lifestyle, and aesthetic goals to craft a solution that is perfectly tailored to you.',
  },
  {
    title: 'Natural Quality',
    desc: 'We use only premium-grade, 100% human hair and advanced base materials that create a seamlessly natural look and feel every time.',
  },
  {
    title: 'Advanced Technology',
    desc: 'Our systems are built using the latest hair replacement technology, ensuring superior bonding, breathability, and undetectable results.',
  },
  {
    title: 'Customised Systems',
    desc: 'Every system is custom-crafted to match your specific hair colour, density, wave pattern, and scalp measurements for a truly unique fit.',
  },
  {
    title: 'Affordable Pricing',
    desc: 'We believe everyone deserves access to quality hair systems. Our transparent pricing offers excellent value without compromising on quality.',
  },
  {
    title: 'Supportive Environment',
    desc: 'From your first consultation to ongoing aftercare, our team is always available to guide and support you throughout your hair restoration journey.',
  },
  {
    title: 'Ongoing Maintenance',
    desc: 'We provide a full maintenance programme to keep your system looking its best — including cleaning, re-adhesion, and styling refreshes.',
  },
  {
    title: 'Satisfaction Guaranteed',
    desc: 'We stand behind the quality of our products. If you are not fully satisfied, we will work with you to make it right — guaranteed.',
  },
];

const findBestBullets = [
  {
    bold: 'Expert Guidance At Rajasthan:',
    text: ' For the best non-surgical hair replacement in Rajasthan, look no further. Our team of experts provides a wide range of customised solutions, helping you find the perfect match for your individual needs.',
  },
  {
    bold: 'Comprehensive Treatment:',
    text: ' Each consultation includes a thorough assessment of your hair loss condition and requirements. We then offer tailored solutions that perfectly align with your needs and lifestyle.',
  },
  {
    bold: 'Natural Look Confidence:',
    text: ' We ensure that your hair system looks completely natural and undetectable, allowing you to go about your daily life with confidence and ease.',
  },
];

const faqs = [
  {
    q: 'How long can I wear it all day?',
    a: 'Our hair systems are designed for 24/7 wear. With the right adhesive and proper care, you can wear your system continuously and simply refresh the bond every 2–4 weeks.',
  },
  {
    q: 'Is it possible to get a custom hairline to appear natural?',
    a: 'Yes, absolutely. We specialise in creating natural-looking custom hairlines that match your facial structure, age, and natural hair growth pattern.',
  },
  {
    q: 'How long does this hair replacement process work?',
    a: 'The full process from consultation to delivery typically takes 3–4 weeks. Once you receive your system, application takes approximately 1–2 hours.',
  },
  {
    q: 'Is there any side effect in the hair replacement system with its process?',
    a: 'When applied and maintained correctly using recommended medical-grade products, there are no known side effects. Our systems are skin-safe and dermatologically tested.',
  },
  {
    q: 'Does the maintenance affect the hair replacement system?',
    a: 'Regular maintenance actually extends the life of your system significantly. Proper cleaning, re-adhesion, and professional servicing keep your system looking and performing at its best.',
  },
  {
    q: 'What are certain key buying parameters?',
    a: 'Key factors to consider include base material type, hair density, hair colour match, wave pattern, base size, and the type of adhesive used. Our consultants will guide you through each of these parameters.',
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
          <h1 className={`text-[32px] md:text-[52px] font-extrabold text-[#121212] leading-[1.1] tracking-[-1.5px] mb-[20px] ${inView ? 'anim-fade-up' : 'opacity-0'}`}>
            Hair Replacement For<br />Men In Rajasthan
          </h1>
          {/* Body — 16px, fontWeight 500 */}
          <p className={`text-[16px] font-[500] text-[#555555] leading-[1.7] max-w-[560px] mx-auto ${inView ? 'anim-fade-up delay-200' : 'opacity-0'}`}>
            Don't worry — we offer a solution to you. We make looking amazing for hair replacement
            in Rajasthan and make your hair look perfect.
          </p>
        </div>

        <div className={`relative w-full rounded-[20px] md:rounded-[24px] overflow-hidden bg-[#0a0c10] h-[280px] md:h-[500px] shadow-[0px_24px_64px_0px_rgba(0,0,0,0.2)] ${inView ? 'anim-scale-in delay-300' : 'opacity-0'}`}>
          <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-results-story-sameer-after.png" alt="Hair Replacement In Rajasthan" fill className="object-cover object-center" sizes="(max-width: 768px) 100vw, 720px" />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.88)] via-[rgba(10,12,16,0.25)] to-transparent" />
          <div className="absolute bottom-[24px] md:bottom-[40px] left-[24px] md:left-[48px]">
            <p className="text-white text-[22px] md:text-[36px] font-extrabold tracking-[0.08em] uppercase leading-none m-0">HAIR REPLACEMENT</p>
            <p className="text-white/55 text-[13px] md:text-[18px] font-bold tracking-[0.2em] uppercase mt-[4px] m-0">IN RAJASTHAN</p>
          </div>
        </div>

      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   2. HAIR PATCH & WIGS FOR MEN IN RAJASTHAN
───────────────────────────────────────────────────────────── */
function HairPatchSection() {
  const { ref, inView } = useInView();
  return (
    <section className="bg-[#F5F6F7] py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2 className="text-[26px] md:text-[44px] font-extrabold text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[64px]">
          Hair Patch & Wigs For Men<br />In Rajasthan
        </h2>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-[48px] md:gap-[64px] items-center">

          {/* Dark branded video card */}
          <div className={`relative w-full h-[280px] md:h-[420px] rounded-[16px] overflow-hidden bg-[#0a0c10] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.15)] ${inView ? 'anim-slide-r' : 'opacity-0'}`}>
            <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-1.png" alt="Premium Hair Systems Rajasthan" fill className="object-cover object-center" style={{ opacity: 0.45 }} />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(5,7,10,0.9)] via-[rgba(5,7,10,0.6)] to-[rgba(5,7,10,0.3)]" />
            <div className="absolute inset-0 flex items-center px-[24px] md:px-[32px]">
              <div>
                <p className="text-white/70 text-[12px] font-bold tracking-[0.06em] uppercase m-0 mb-[4px]">Detailed INFO</p>
                <p className="text-white text-[22px] md:text-[32px] font-extrabold leading-[1.1] tracking-[-0.5px] m-0 mb-[2px]">
                  About <span style={{ color: '#F5C518' }}>PREMIUM</span>
                </p>
                <p className="text-white text-[22px] md:text-[32px] font-extrabold leading-[1.1] tracking-[-0.5px] m-0 mb-[2px]">HAIR SYSTEMS</p>
                <p className="text-white/60 text-[18px] md:text-[26px] font-extrabold leading-[1.1] m-0">(PATCHES)</p>
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="w-[52px] h-[52px] md:w-[64px] md:h-[64px] rounded-full flex items-center justify-center transition-transform hover:scale-110 duration-200"
                style={{ background: 'rgba(255,0,0,0.9)', boxShadow: '0 6px 24px rgba(255,0,0,0.4)' }}>
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
   3. WHY AMERICAN HAIRLINE IS AN EXCELLENT CHOICE
   + / × accordion, first item open
───────────────────────────────────────────────────────────── */
function ExcellentChoiceSection() {
  const [openIndex, setOpenIndex] = useState(0);
  const { ref: videoRef, inView: videoInView } = useInView(0.1);
  const { ref: accordRef, inView: accordInView } = useInView(0.1);

  return (
    <section className="bg-white py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2 className="text-[26px] md:text-[44px] font-extrabold text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[56px]">
          Why American Hairline Is An Excellent Choice<br />For Non-Surgical Hair Replacement In Rajasthan
        </h2>

        <div
          ref={videoRef}
          className={`relative w-full rounded-[20px] overflow-hidden bg-[#0a0c10] h-[240px] md:h-[440px] shadow-[0px_16px_48px_0px_rgba(0,0,0,0.18)] mb-[32px] md:mb-[40px] ${videoInView ? 'anim-scale-in' : 'opacity-0'}`}
        >
          <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-results-story-amit-after.png" alt="Most Undetectable Hair System" fill className="object-cover object-center" />
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
          {excellentChoiceAccordion.map((item, i) => (
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
   4. CHECKLIST — imported
───────────────────────────────────────────────────────────── */

/* ─────────────────────────────────────────────────────────────
   5. FIND THE BEST NON-SURGICAL HAIR REPLACEMENT IN RAJASTHAN
───────────────────────────────────────────────────────────── */
function FindBestSection() {
  const { ref, inView } = useInView();
  return (
    <section className="bg-[#F5F6F7] py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2 className="text-[26px] md:text-[44px] font-extrabold text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[64px]">
          Find The Best Non-Surgical Hair<br />Replacement In Rajasthan
        </h2>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-[48px] md:gap-[64px] items-center">

          <div className={`relative w-full h-[260px] md:h-[400px] rounded-[16px] overflow-hidden bg-[#121212] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.12)] ${inView ? 'anim-slide-r' : 'opacity-0'}`}>
            <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-3.png" alt="Find Best Hair Replacement Rajasthan" fill className="object-cover object-center" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(23,105,255,0.55) 0%, transparent 55%)' }} />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.75)] via-transparent to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="w-[52px] h-[52px] md:w-[64px] md:h-[64px] rounded-full flex items-center justify-center transition-transform hover:scale-110 duration-200"
                style={{ background: 'rgba(255,0,0,0.9)', boxShadow: '0 6px 24px rgba(255,0,0,0.4)' }}>
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
export default function RajasthanPage() {
  return (
    <main>
      <HeroSection />
      <HairPatchSection />
      <ExcellentChoiceSection />
      <Checklist />
      <FindBestSection />
      <FAQSection />
      <CTA />
      <ResultsRealPeople />
    </main>
  );
}