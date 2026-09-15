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
    bold: 'Hair Wigs In Men In Punjab:',
    text: ' Our manufacturer provides quality, quick and customised hair systems. Our Indian hair wigs give an excellent option and can be customised to perfectly match your natural hair colour, texture, and density.',
  },
  {
    bold: 'Premium Hair Systems:',
    text: ' We recognise that every individual is unique, and our expert team never compromise. With our customised Hair Systems, we offer a personalised approach to hair replacement that ensures a perfect fit and utmost satisfaction.',
  },
];

const whyChooseBullets = [
  'Natural looking hair',
  'Comfortable to wear',
  'Tailor-made to suit your hair color and style',
  'Non-invasive and painless',
  'Affordable compared to surgical options',
];

const bestChoiceAccordion = [
  {
    title: 'Proved Expertise',
    desc: 'Our team of specialists has years of proven experience in non-surgical hair replacement, delivering consistent and natural results for clients across Punjab.',
  },
  {
    title: 'Natural-Looking Systems',
    desc: 'Every hair system we provide is crafted to look and feel completely natural, blending seamlessly with your existing hair for an undetectable result.',
  },
  {
    title: 'Client Satisfaction',
    desc: 'We are committed to your complete satisfaction. Our team works closely with you from consultation through to aftercare to ensure the best possible outcome.',
  },
  {
    title: 'Premium Materials',
    desc: 'We use only the highest quality bases and 100% human hair in our systems, ensuring longevity, comfort, and a natural appearance.',
  },
  {
    title: 'Transparent Pricing',
    desc: 'No hidden costs. We offer fair, transparent pricing with flexible packages to suit different budgets without compromising on quality.',
  },
  {
    title: 'Customised Hair Systems',
    desc: 'Each system is fully custom-made to your specifications — hair colour, density, wave pattern, base size, and hairline shape are all tailored to you.',
  },
  {
    title: 'Nationwide Presence',
    desc: 'With a growing network of trained technicians and service centres across India, we can support you wherever you are in Punjab.',
  },
];

const findBestBullets = [
  {
    bold: 'American Hairline In Punjab:',
    text: ' is a one-stop-shop for all non-surgical hair replacement needs in Punjab. Our team of hair experts provides a wide range of customised solutions to match your individual needs.',
  },
  {
    bold: 'Please Feel Welcome to Contact Us',
    text: ' if you would like to learn more about our services or to schedule a free consultation. We are always happy to help you find the best solution for your hair loss.',
  },
];

const faqs = [
  {
    q: 'What is the non-surgical hair replacement?',
    a: 'Non-surgical hair replacement is a safe, painless method of restoring hair without surgery. It involves attaching a custom hair system to your scalp using medical-grade adhesives or clips, giving a completely natural appearance.',
  },
  {
    q: 'How much does it cost?',
    a: 'Costs vary depending on the type of system, customisation level, and maintenance requirements. We offer a range of packages to suit different budgets. Contact us for a personalised quote.',
  },
  {
    q: 'About how long does a hair patch last?',
    a: 'A well-maintained hair patch typically lasts 6–12 months. The lifespan depends on the base material, how often it is cleaned, and the adhesive used.',
  },
  {
    q: 'Is there a risk factor that can harm your health?',
    a: 'Non-surgical hair replacement is completely safe with no known health risks when applied and maintained correctly using medical-grade products.',
  },
  {
    q: 'Can I get a natural hairline in semi customised units?',
    a: 'Yes. Semi-customised units can include a natural, realistic hairline. Our team will guide you through the configuration options to find the best solution for your face shape and preferences.',
  },
  {
    q: 'Prices at what range for the items?',
    a: 'Our systems range from affordable stock options to fully custom premium solutions. Please reach out to our team for detailed pricing based on your specific requirements.',
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
            Hair Replacement For<br />Men In Punjab
          </h1>
          {/* Body — 16px, fontWeight 500 */}
          <p className={`text-[16px] font-[500] text-[#555555] leading-[1.7] max-w-[580px] mx-auto ${inView ? 'anim-fade-up delay-200' : 'opacity-0'}`}>
            Say goodbye to hair loss and welcome our non-surgical hair replacement in Punjab. Get you regain the
            styling you've always dreamed of.
          </p>
        </div>

        <div className={`relative w-full rounded-[20px] md:rounded-[24px] overflow-hidden bg-[#0a0c10] h-[280px] md:h-[500px] shadow-[0px_24px_64px_0px_rgba(0,0,0,0.2)] ${inView ? 'anim-scale-in delay-300' : 'opacity-0'}`}>
          <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-results-story-sameer-after.png" alt="Hair Replacement In Punjab" fill className="object-cover object-center" sizes="(max-width: 768px) 100vw, 720px" />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.88)] via-[rgba(10,12,16,0.25)] to-transparent" />
          <div className="absolute bottom-[24px] md:bottom-[40px] left-[24px] md:left-[48px]">
            <p className="text-white text-[22px] md:text-[36px] font-extrabold tracking-[0.08em] uppercase leading-none m-0">HAIR REPLACEMENT</p>
            <p className="text-white/55 text-[13px] md:text-[18px] font-bold tracking-[0.2em] uppercase mt-[4px] m-0">IN PUNJAB</p>
          </div>
        </div>

      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   2. HAIR PATCH & WIGS FOR MEN IN PUNJAB
───────────────────────────────────────────────────────────── */
function HairPatchSection() {
  const { ref, inView } = useInView();
  return (
    <section className="bg-[#F5F6F7] py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2 className="text-[26px] md:text-[44px] font-extrabold text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[64px]">
          Hair Patch & Wigs For Men<br />In Punjab
        </h2>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-[48px] md:gap-[64px] items-center">

          {/* Dark branded video card */}
          <div className={`relative w-full h-[280px] md:h-[420px] rounded-[16px] overflow-hidden bg-[#0a0c10] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.15)] ${inView ? 'anim-slide-r' : 'opacity-0'}`}>
            <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-1.png" alt="Premium Hair Systems Punjab" fill className="object-cover object-center" style={{ opacity: 0.45 }} />
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
   3. WHY CHOOSE NON-SURGICAL — video left, card right
───────────────────────────────────────────────────────────── */
function WhyChooseSection() {
  const { ref, inView } = useInView();
  return (
    <section className="bg-white py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2 className="text-[26px] md:text-[44px] font-extrabold text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[64px]">
          Why Choose Non-Surgical<br />Hair Replacement?
        </h2>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-[48px] md:gap-[64px] items-center">

          {/* Single card LEFT: intro para + dot bullets */}
          <div className={`${inView ? 'anim-slide-r' : 'opacity-0'}`}>
            <div
              className="rounded-[12px] p-[24px] md:p-[28px]"
              style={{
                background: '#fff',
                boxShadow: '0 2px 12px rgba(18,18,18,0.07)',
                border: '1px solid rgba(18,18,18,0.06)',
              }}
            >
              {/* Intro paragraph with inline bolds */}
              <p style={{ fontSize: '16px', fontWeight: 500, color: '#555555', lineHeight: '1.7', margin: '0 0 20px 0' }}>
                <strong style={{ fontWeight: 700, color: '#121212' }}>Non-surgical hair replacement</strong>{' '}
                is a great option for those who want to regain their confidence & look their best without surgery. Some of the{' '}
                <strong style={{ fontWeight: 700, color: '#121212' }}>benefits</strong>{' '}
                of non-surgical hair replacement are:
              </p>
              {/* Bullet list with filled dot markers */}
              <div className="flex flex-col gap-[14px]">
                {whyChooseBullets.map((b, i) => (
                  <div key={i} className="flex items-center gap-[12px]">
                    <div className="w-[8px] h-[8px] rounded-full bg-[#121212] flex-shrink-0" />
                    <p style={{ fontSize: '16px', fontWeight: 700, color: '#121212', lineHeight: '1.4', margin: 0 }}>
                      {b.replace(/\.$/, '')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Video card RIGHT */}
          <div className={`relative w-full h-[260px] md:h-[380px] rounded-[16px] overflow-hidden bg-[#121212] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.12)] ${inView ? 'anim-slide-l delay-200' : 'opacity-0'}`}>
            <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-2.png" alt="Why Choose Non-Surgical" fill className="object-cover object-center" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(23,105,255,0.5) 0%, transparent 55%)' }} />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.8)] via-transparent to-transparent" />
            <div className="absolute bottom-[20px] left-[20px]">
              <div className="flex items-center gap-[6px] mb-[4px]">
                <div className="w-[7px] h-[7px] rounded-full bg-[#4686FE]" />
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>Undetectable</span>
              </div>
              <p style={{ fontSize: '20px', fontWeight: 700, color: '#fff', lineHeight: '1.2', margin: 0 }}>Hair System in</p>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="w-[48px] h-[48px] md:w-[60px] md:h-[60px] rounded-full flex items-center justify-center transition-transform hover:scale-110 duration-200"
                style={{ background: 'rgba(255,0,0,0.9)', boxShadow: '0 6px 24px rgba(255,0,0,0.4)' }}>
                <Play size={18} color="white" fill="white" style={{ marginLeft: 2 }} />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   4. WHY AMERICAN HAIRLINE IS THE BEST CHOICE
   + / × accordion, first item open
───────────────────────────────────────────────────────────── */
function BestChoiceSection() {
  const [openIndex, setOpenIndex] = useState(0);
  const { ref: videoRef, inView: videoInView } = useInView(0.1);
  const { ref: accordRef, inView: accordInView } = useInView(0.1);

  return (
    <section className="bg-[#F5F6F7] py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2 className="text-[26px] md:text-[44px] font-extrabold text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[56px]">
          Why American Hairline Is The Best Choice For<br />Non-Surgical Hair Replacement In Punjab
        </h2>

        <div
          ref={videoRef}
          className={`relative w-full rounded-[20px] overflow-hidden bg-[#0a0c10] h-[240px] md:h-[440px] shadow-[0px_16px_48px_0px_rgba(0,0,0,0.18)] mb-[32px] md:mb-[40px] ${videoInView ? 'anim-scale-in' : 'opacity-0'}`}
        >
          <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-results-story-amit-after.png" alt="Best Choice Punjab" fill className="object-cover object-center" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(100deg, rgba(10,12,16,0.75) 0%, rgba(10,12,16,0.35) 55%, transparent 100%)' }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <button className="w-[56px] h-[56px] md:w-[72px] md:h-[72px] rounded-full flex items-center justify-center transition-transform hover:scale-105 duration-300"
              style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1.5px solid rgba(255,255,255,0.25)' }}>
              <Play size={22} color="white" fill="white" style={{ marginLeft: 3 }} />
            </button>
          </div>
        </div>

        {/* Accordion — + / × icons, first item open */}
        <div ref={accordRef} className={`flex flex-col gap-[8px] ${accordInView ? 'anim-fade-up' : 'opacity-0'}`}>
          {bestChoiceAccordion.map((item, i) => (
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
   5. CHECKLIST — imported
───────────────────────────────────────────────────────────── */

/* ─────────────────────────────────────────────────────────────
   6. FIND THE BEST NON-SURGICAL HAIR REPLACEMENT IN PUNJAB
───────────────────────────────────────────────────────────── */
function FindBestSection() {
  const { ref, inView } = useInView();
  return (
    <section className="bg-white py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2 className="text-[26px] md:text-[44px] font-extrabold text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[64px]">
          Find The Best Non-Surgical Hair<br />Replacement In Punjab
        </h2>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-[48px] md:gap-[64px] items-center">

          <div className={`relative w-full h-[260px] md:h-[400px] rounded-[16px] overflow-hidden bg-[#121212] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.12)] ${inView ? 'anim-slide-r' : 'opacity-0'}`}>
            <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-3.png" alt="Find Best Hair Replacement Punjab" fill className="object-cover object-center" />
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
   7. FAQ — + / × icons, first item open
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
export default function PunjabPage() {
  return (
    <main>
      <HeroSection />
      <HairPatchSection />
      <WhyChooseSection />
      <BestChoiceSection />
      <Checklist />
      <FindBestSection />
      <FAQSection />
      <CTA />
      <ResultsRealPeople />
    </main>
  );
}