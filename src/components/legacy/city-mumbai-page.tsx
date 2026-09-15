'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ArrowUpRight, ChevronDown, ChevronUp, Play } from 'lucide-react';
import { ContactForm as CTA } from '@/components/homepage/ContactForm';
import { ResultsRealPeople } from '@/components/results/ResultsRealPeople';
import { Locations } from '@/components/homepage/Locations';

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
   DATA
───────────────────────────────────────────────────────────── */
const hairPatchBullets = [
  {
    bold: 'Non-Surgical & Pain-Free:',
    text: ' Our hair patch and system solutions require no surgery, no incisions, and no downtime — giving you a natural-looking result without any risk.',
  },
  {
    bold: 'Customised For You:',
    text: ' Every system is tailored to match your exact hair colour, density, wave pattern, and scalp measurements for a perfect, undetectable fit.',
  },
  {
    bold: 'Premium Quality Hair:',
    text: ' We use only 100% human hair in our systems, ensuring a natural look, feel, and styling freedom that synthetic alternatives simply cannot match.',
  },
  {
    bold: 'Start Your Journey:',
    text: ' Contact American Hairline today for a personalised consultation and take the first step towards reclaiming your confidence in Mumbai.',
  },
];

const servicesAccordion = [
  {
    title: 'Hair Patch Fixing & Hair Replacement Services In Mumbai',
    desc: 'Our most popular service. We design and fit fully custom hair patches for men experiencing partial or full hair loss — completely natural and undetectable.',
  },
  {
    title: 'Hair Transplant Clinic In Mumbai',
    desc: 'We partner with leading hair transplant clinics in Mumbai to offer surgical options for those who prefer a permanent solution. Our specialists guide you through the entire process.',
  },
  {
    title: 'Scalp Micro Pigmentation In Mumbai',
    desc: 'Scalp Micro Pigmentation (SMP) is a non-surgical, non-invasive procedure that replicates the appearance of hair follicles on the scalp, creating the illusion of a fuller head of hair.',
  },
  {
    title: 'Hair Wigs For Men In Mumbai',
    desc: 'We understand that hair loss due to cancer treatments, radiation, alopecia can be devastating for every individual. Our full head wigs are designed especially to look like your own hair and give you the confidence to be able to walk out of your home without feeling self-conscious. These wigs can be made to suit your needs in terms of style, color, texture and length. Our mission is to provide the best quality in customised wigs to all those suffering from cancer, alopecia or any other medical condition with the finest alternative hair.',
  },
];

const features = [
  { bold: 'ISO Certified', text: 'The Only ISO Certified hair system company in India to Guarantee You Quality.' },
  { bold: 'Access to Educational Videos', text: 'Our learning videos cover the essentials for a smooth start.' },
  { bold: 'Ready to Wear', text: 'Completely Styled and Cut Ready To Wear Hair System delivered at your Doorstep.' },
  { bold: 'Customer Support', text: 'Our dedicated team provides expert guidance and prompt assistance for you.' },
  { bold: '100% Human Hair', text: 'We use premium Real Human Remy Hair for 100% natural-looking systems.' },
  { bold: 'Order Online', text: 'Online ordering process makes it Easier to Order out of the Comfort of your home.' },
  { bold: 'Fully Customisable', text: "India's only brand customising all hair system specs, from density to hairline." },
  { bold: 'Affordable', text: 'As an online platform, we offer premium hair systems at affordable prices.' },
  { bold: 'Single Strand Implant', text: 'Single-strand implantation mimics natural growth for total hair parting flexibility.' },
  { bold: 'Certified by AIAO Bio', text: 'We are certified by American International Accreditation Organisation.' },
  { bold: 'Certified by American', text: 'Certified by American Board of Accreditation Services for high-quality hair systems.' },
];

const faqs = [
  {
    q: 'What is non-surgical hair replacement?',
    a: 'Non-surgical hair replacement is a safe, painless method of restoring hair without surgery. A custom hair system is attached to the scalp using medical-grade adhesives or clips for a completely natural appearance.',
  },
  {
    q: 'How long does the hair replacement last?',
    a: 'With proper care and regular maintenance, a well-fitted hair system can last 6–12 months. Maintenance visits every 3–4 weeks help significantly extend the lifespan.',
  },
  {
    q: 'What is a hair patch in Mumbai?',
    a: 'A hair patch is a custom-made piece of hair system that is applied to a specific area of hair loss on the scalp. It is designed to blend perfectly with your natural hair for a seamless result.',
  },
  {
    q: 'What is the process for hair replacement in Mumbai?',
    a: 'The process starts with a consultation, followed by measurements and customisation of your system. Once ready, our specialists fit the system at our studio. The entire process takes 3–4 weeks.',
  },
  {
    q: 'How much does hair replacement cost in Mumbai?',
    a: 'Costs depend on the type of system, level of customisation, and chosen maintenance package. We offer flexible pricing to suit a range of budgets. Contact us for a personalised quote.',
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
function CheckboxIcon() {
  return (
    <svg
      width="20" height="20" viewBox="0 0 20 20"
      fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
    >
      <rect width="20" height="20" rx="5" fill="#1769FF" />
      <path d="M5 10.5L8.5 14L15 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* Body text: 18px / weight 500 */
const bodyTextStyle: React.CSSProperties = {
  fontFamily: "'ProximaNova-Medium', 'Proxima Nova', sans-serif",
  fontSize: '18px',
  fontWeight: 500,
  color: '#121212',
  lineHeight: '150%',
  letterSpacing: '-0.16px',
  margin: 0,
};

/* Subheading bold label: 20px / weight 500 */
const subheadingBoldStyle: React.CSSProperties = {
  fontFamily: "'ProximaNova-Medium', 'Proxima Nova', sans-serif",
  fontSize: '20px',
  fontWeight: 500,
  color: '#121212',
  lineHeight: '150%',
  letterSpacing: '-0.16px',
};

function ContentCard({ children, minH = '400px' }: { children: React.ReactNode; minH?: string; }) {
  return (
    <div
      className="flex flex-col justify-center rounded-[16px] h-full"
      style={{
        background: '#fff',
        border: '1px solid rgba(18,18,18,0.07)',
        boxShadow: '0 2px 16px rgba(18,18,18,0.08)',
        padding: '28px 32px',
        minHeight: minH,
      }}
    >
      {children}
    </div>
  );
}

/* BulletGroup — no dividers between items, clean spacing only */
function BulletGroup({ bullets }: { bullets: { bold: string; text: string }[] }) {
  return (
    <ContentCard minH="100%">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {bullets.map((b, i) => (
          <div key={i}>
            <p style={bodyTextStyle}>
              <strong style={subheadingBoldStyle}>{b.bold}</strong>
              {b.text}
            </p>
          </div>
        ))}
      </div>
    </ContentCard>
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
            className={`text-[#121212] leading-[1.1] tracking-[-1.5px] mb-[20px] ${inView ? 'anim-fade-up' : 'opacity-0'}`}
            style={{ fontSize: 'clamp(32px, 4vw, 52px)', fontWeight: 800 }}
          >
            Non Surgical Hair<br />Replacement In Mumbai
          </h1>
          <p
            className={`max-w-[580px] mx-auto text-center ${inView ? 'anim-fade-up delay-200' : 'opacity-0'}`}
            style={{ ...bodyTextStyle, opacity: 0.7, textAlign: 'center' }}
          >
            For those who want to feel like themselves again. Our non-surgical solutions are specially designed
            for men in Mumbai.
          </p>
        </div>

        <div className={`relative w-full rounded-[20px] md:rounded-[24px] overflow-hidden bg-[#0a0c10] h-[280px] md:h-[500px] shadow-[0px_24px_64px_0px_rgba(0,0,0,0.2)] ${inView ? 'anim-scale-in delay-300' : 'opacity-0'}`}>
          <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-results-story-sameer-after.png" alt="Non Surgical Hair Replacement Mumbai" fill className="object-cover object-top" sizes="(max-width: 768px) 100vw, 720px" />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.88)] via-[rgba(10,12,16,0.25)] to-transparent" />
          <div className="absolute bottom-[24px] md:bottom-[40px] left-[24px] md:left-[48px]">
            <p className="text-white leading-none m-0 uppercase tracking-[0.08em]" style={{ fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 800 }}>
              HAIR REPLACEMENT
            </p>
            <p className="text-white/55 uppercase mt-[4px] m-0 tracking-[0.2em]" style={{ fontSize: 'clamp(13px, 1.5vw, 18px)', fontWeight: 700 }}>
              IN MUMBAI
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   2. HAIR PATCH & SYSTEMS FOR MEN IN MUMBAI
───────────────────────────────────────────────────────────── */
function HairPatchSection() {
  const { ref, inView } = useInView();
  return (
    <section className="bg-[#F5F6F7] py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2
          className="text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[64px]"
          style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 800 }}
        >
          Hair Patch & Systems For Men<br />In Mumbai
        </h2>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-[48px] md:gap-[64px] items-stretch">

          <div className={`relative w-full h-full min-h-[280px] md:min-h-[420px] rounded-[16px] overflow-hidden bg-[#0a0c10] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.15)] ${inView ? 'anim-slide-r' : 'opacity-0'}`}>
            <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-2.png" alt="Hair Patch Systems Mumbai" fill className="object-cover object-center" style={{ opacity: 0.55 }} />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(5,7,10,0.9)] via-[rgba(5,7,10,0.45)] to-[rgba(5,7,10,0.2)]" />
            <div className="absolute top-[20px] md:top-[28px] left-[20px] md:left-[28px]">
              <p className="leading-[1.1] tracking-[-0.3px] m-0" style={{ fontSize: 'clamp(18px, 2.2vw, 28px)', fontWeight: 800 }}>
                <span style={{ color: '#4686FE' }}>HAIR </span>
                <span style={{ color: '#fff' }}>PATCH</span>
              </p>
              <p className="m-0 mt-[4px]" style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Mumbai
              </p>
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

          <div className={`${inView ? 'anim-slide-l delay-200' : 'opacity-0'} h-full`}>
            <BulletGroup bullets={hairPatchBullets} />
          </div>

        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   3. AESTHETIC SENSE
───────────────────────────────────────────────────────────── */
function AestheticSection() {
  const { ref, inView } = useInView();
  return (
    <section className="bg-white py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2
          className="text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[64px]"
          style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 800 }}
        >
          Aesthetic Sense
        </h2>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-[48px] md:gap-[64px] items-stretch">

          <div className={`${inView ? 'anim-slide-r' : 'opacity-0'}`}>
            <ContentCard minH="380px">
              <p style={bodyTextStyle}>
                We strongly believe that a hair system should look so natural that no one can make out.
                <br /><br />
                This need great amount of{' '}
                <strong style={subheadingBoldStyle}>Aesthetic sense</strong>
                {' '}in terms of hairstyle and styling the hair the right way.
                <br /><br />
                Choosing the right density, keeping it age appropriate, adding the crown area in a particular direction, choosing a safe and breathable base and some of the factors one should consider which Unfortunately in Mumbai there are hardly any who understand this in depth.
              </p>
            </ContentCard>
          </div>

          <div className={`relative w-full h-[260px] md:h-[380px] rounded-[16px] overflow-hidden bg-[#121212] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.12)] ${inView ? 'anim-slide-l delay-200' : 'opacity-0'}`}>
            <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-3.png" alt="Aesthetic Sense" fill className="object-cover object-center" />
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
   4. SALONS
───────────────────────────────────────────────────────────── */
function SalonsSection() {
  return <Locations />;
}

/* ─────────────────────────────────────────────────────────────
   5. SERVICES OFFERED
───────────────────────────────────────────────────────────── */
function ServicesSection() {
  const [openIndex, setOpenIndex] = useState(3);
  const { ref: videoRef, inView: videoInView } = useInView(0.1);
  const { ref: accordRef, inView: accordInView } = useInView(0.1);

  return (
    <section className="bg-white py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2
          className="text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[56px]"
          style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 800 }}
        >
          Services Offered At American<br />Hairline Mumbai
        </h2>

        <div
          ref={videoRef}
          className={`relative w-full rounded-[20px] overflow-hidden bg-[#0a0c10] h-[240px] md:h-[400px] shadow-[0px_16px_48px_0px_rgba(0,0,0,0.18)] mb-[32px] md:mb-[40px] ${videoInView ? 'anim-scale-in' : 'opacity-0'}`}
        >
          <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-results-story-amit-after.png" alt="Services Mumbai" fill className="object-cover object-center" style={{ opacity: 0.7 }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.75)] via-transparent to-transparent" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(100deg, rgba(10,12,16,0.6) 0%, transparent 60%)' }} />
          <div className="absolute bottom-[20px] md:bottom-[32px] left-[20px] md:left-[36px]">
            <p className="leading-[1.15] m-0" style={{ fontSize: 'clamp(24px, 3.5vw, 42px)', fontWeight: 800, color: '#4686FE' }}>
              Hair<br />Replacement
            </p>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              className="w-[52px] h-[52px] md:w-[64px] md:h-[64px] rounded-full flex items-center justify-center transition-transform hover:scale-110 duration-200"
              style={{ background: 'rgba(255,0,0,0.9)', boxShadow: '0 4px 20px rgba(255,0,0,0.4)' }}
            >
              <Play size={20} color="white" fill="white" style={{ marginLeft: 3 }} />
            </button>
          </div>
        </div>

        <div ref={accordRef} className={`flex flex-col gap-[8px] ${accordInView ? 'anim-fade-up' : 'opacity-0'}`}>
          {servicesAccordion.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-[12px] overflow-hidden cursor-pointer"
              style={{ border: '1px solid rgba(18,18,18,0.08)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
              onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
            >
              <div className="flex items-center gap-[12px] px-[16px] md:px-[20px] py-[14px] md:py-[16px]">
                <CheckboxIcon />
                <span style={{
                  flex: 1,
                  ...bodyTextStyle,
                  fontWeight: openIndex === i ? 500 : 500,
                  fontSize: openIndex === i ? '20px' : '18px',
                  color: openIndex === i ? '#121212' : 'rgba(18,18,18,0.75)',
                  transition: 'all 0.3s',
                }}>
                  {item.title}
                </span>
                {openIndex === i
                  ? <ChevronUp size={17} style={{ color: 'rgba(18,18,18,0.4)', flexShrink: 0 }} />
                  : <ChevronDown size={17} style={{ color: 'rgba(18,18,18,0.4)', flexShrink: 0 }} />
                }
              </div>
              {openIndex === i && (
                <div className="px-[16px] md:px-[20px] pb-[16px]" style={{ paddingLeft: '52px' }}>
                  <p style={{ ...bodyTextStyle, opacity: 0.75 }}>{item.desc}</p>
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
   6. OUR BACKGROUND
───────────────────────────────────────────────────────────── */
const backgroundItems: React.ReactNode[] = [
  <>Well, we have developed the <strong style={subheadingBoldStyle}>Aesthetic sense</strong> purely because we have been doing hair systems for almost all <strong style={subheadingBoldStyle}>Bollywood celebrities</strong> for years . That has been our core work for a decade.</>,
  <>Working with Bollywood actors, we developed the art of making a hair system <strong style={subheadingBoldStyle}>look natural.</strong></>,
  <>We then progressed to regular men who <strong style={subheadingBoldStyle}>choose quality</strong> over price.</>,
  <>We design very high end hair systems which are made in <strong style={subheadingBoldStyle}>USA</strong>, <strong style={subheadingBoldStyle}>Mexico</strong> and <strong style={subheadingBoldStyle}>north Korea</strong>.</>,
];

function BackgroundSection() {
  const { ref, inView } = useInView();
  return (
    <section className="bg-[#F5F6F7] py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2
          className="text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[64px]"
          style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 800 }}
        >
          Our Background
        </h2>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-[48px] md:gap-[64px] items-stretch">

          <div className={`${inView ? 'anim-slide-r' : 'opacity-0'} h-full`}>
            <ContentCard>
              {/* No dividers — clean vertical spacing only */}
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {backgroundItems.map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '20px', color: '#121212', lineHeight: 1.3, flexShrink: 0 }}>●</span>
                    <p style={bodyTextStyle}>{item}</p>
                  </li>
                ))}
              </ul>
            </ContentCard>
          </div>

          <div className={`relative w-full h-full min-h-[260px] md:min-h-[380px] rounded-[16px] overflow-hidden bg-[#f0f0f0] ${inView ? 'anim-slide-l delay-200' : 'opacity-0'}`}>
            <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-1.png" alt="Our Background" fill className="object-cover object-center" />
          </div>

        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   7. WHY THOUSANDS OF MEN CHOOSE AMERICAN HAIRLINE
───────────────────────────────────────────────────────────── */
function WhyChooseSection() {
  const { ref: videoRef, inView: videoInView } = useInView(0.1);
  const { ref: gridRef, inView: gridInView } = useInView(0.1);
  return (
    <section className="bg-white py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2
          className="text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[56px]"
          style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 800 }}
        >
          Why Thousands Of Men<br />Choose American Hairline
        </h2>

        <div
          ref={videoRef}
          className={`relative w-full h-[240px] md:h-[440px] rounded-[20px] overflow-hidden bg-[#0a0c10] shadow-[0px_16px_48px_0px_rgba(0,0,0,0.18)] mb-[48px] md:mb-[56px] ${videoInView ? 'anim-scale-in' : 'opacity-0'}`}
        >
          <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-2.png" alt="Why Choose American Hairline" fill className="object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.6)] via-transparent to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              className="w-[60px] h-[60px] md:w-[80px] md:h-[80px] rounded-full flex items-center justify-center transition-transform hover:scale-105 duration-300"
              style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1.5px solid rgba(255,255,255,0.25)' }}
            >
              <Play size={24} color="white" fill="white" style={{ marginLeft: 3 }} />
            </button>
          </div>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-[10px] md:gap-[12px]">
          {features.map((f, i) => (
            <div
              key={i}
              className={`flex gap-[14px] items-start rounded-[12px] ${gridInView ? 'anim-fade-up' : 'opacity-0'}`}
              style={{
                background: '#fff',
                border: '1px solid rgba(18,18,18,0.08)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                padding: '16px 18px',
                animationDelay: `${i * 0.05}s`,
              }}
            >
              <CheckboxIcon />
              <p style={bodyTextStyle}>
                <strong style={subheadingBoldStyle}>{f.bold}</strong>
                {' – '}
                {f.text}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   8. FAQ
───────────────────────────────────────────────────────────── */
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
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
                <div
                  key={i}
                  className="cursor-pointer"
                  style={{ borderBottom: '1px solid rgba(18,18,18,0.08)' }}
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                >
                  <div className="flex justify-between items-center py-[18px] md:py-[20px]">
                    <span style={{
                      ...bodyTextStyle,
                      fontWeight: 400,
                      color: 'rgba(18,18,18,0.65)',
                      paddingRight: '16px',
                    }}>
                      {faq.q}
                    </span>
                    <span style={{ 
                      fontSize: '26px', 
                      fontWeight: 400, 
                      color: 'rgba(18,18,18,0.4)', 
                      flexShrink: 0, 
                      lineHeight: 1,
                      transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease',
                      display: 'inline-block'
                    }}>
                      +
                    </span>
                  </div>
                  
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateRows: isOpen ? '1fr' : '0fr',
                      transition: 'grid-template-rows 0.3s ease',
                    }}
                  >
                    <div style={{ overflow: 'hidden' }}>
                      <p style={{ ...bodyTextStyle, opacity: 0.7, paddingBottom: '20px' }}>
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div
            className={`rounded-[16px] p-[28px] md:p-[36px] ${inView ? 'anim-fade-up delay-300' : 'opacity-0'}`}
            style={{ background: 'linear-gradient(135deg, #4686FE 0%, #1769FF 100%)', boxShadow: '0 12px 32px rgba(23,105,255,0.3)' }}
          >
            <h3 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', letterSpacing: '-0.4px', marginBottom: '8px', lineHeight: '1.2' }}>
              Still have questions?
            </h3>
            <p style={{ ...bodyTextStyle, color: 'rgba(255,255,255,0.75)', marginBottom: '24px', maxWidth: '400px' }}>
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
export default function NonSurgicalMumbaiPage() {
  return (
    <main>
      <HeroSection />
      <HairPatchSection />
      <AestheticSection />
      <SalonsSection />
      <ServicesSection />
      <BackgroundSection />
      <WhyChooseSection />
      <FAQSection />
      <CTA />
      <ResultsRealPeople />
    </main>
  );
}