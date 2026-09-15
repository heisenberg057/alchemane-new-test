'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ArrowUpRight, ChevronDown, ChevronUp, Play } from 'lucide-react';
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
  Section headings (h1/h2): clamp sizes, fontWeight 800
  Subheadings / bold labels: 20px, fontWeight 700, color #121212
  Body / description text:   16px, fontWeight 500, color #555
  Small caps / tags:         12px, fontWeight 700
*/

/* ─────────────────────────────────────────────────────────────
   DATA
───────────────────────────────────────────────────────────── */
const hairPatchBullets = [
  {
    bold: 'Our stock is varied with different hair systems',
    text: ' for men in Surat, offering an excellent range and variety of hair patches and wigs. We have a wide range of options to offer you.',
  },
  {
    bold: 'It brings you happiness and comfort',
    text: ' with natural-looking patches, which creates a proper, long-lasting look. People will not be able to tell if you are wearing a patch or a wig.',
  },
  {
    bold: 'The hair replacement systems',
    text: ' are available at different price points to suit your budget without compromising on quality or the natural appearance of the system.',
  },
];

const advantagesBullets = [
  'Non-surgical and pain free.',
  'Natural-looking results.',
  'Reduces styling time.',
  'More cost-effective option.',
  'Affordable solutions for every budget.',
  'Versatile hair replacement options.',
  'Suitable for any skin type.',
];

const whyChooseAccordion = [
  {
    title: 'Experienced Professionals',
    desc: 'Our team of specialists has years of experience delivering consistent, natural-looking results for clients across Surat and Gujarat. We follow internationally certified standards.',
  },
  {
    title: 'Post-Service After Systems',
    desc: 'We provide comprehensive aftercare guidance and support. Our team is always available to assist you with any questions or concerns after your service.',
  },
  {
    title: 'Affordable Prices',
    desc: 'We believe quality hair replacement should be accessible to everyone. Our transparent pricing and flexible packages make it easy to find a solution that fits your budget.',
  },
  {
    title: 'Hair Loss Treatment Methods',
    desc: 'We offer a full range of non-surgical hair replacement methods including clip-on systems, bonded patches, and full-head solutions — all customised to your specific needs.',
  },
];

const typesBullets = [
  {
    bold: 'Adhesive Bond Systems:',
    text: ' The most popular method. High-quality human or synthetic patches are applied directly to the scalp using medical-grade adhesives for a secure, natural-looking result.',
  },
  {
    bold: 'Clip-On Hair Systems:',
    text: ' A flexible option that allows you to attach and detach your hair system easily. Ideal for those who prefer a non-permanent solution with full styling freedom.',
  },
  {
    bold: 'Full Head Systems:',
    text: ' Designed for complete hair loss, our full head systems provide 360-degree coverage with a completely natural hairline and density, custom-made to your exact specifications.',
  },
];

const faqs = [
  {
    q: 'What is non-surgical hair replacement?',
    a: 'Non-surgical hair replacement is a safe, painless method of restoring hair using custom hair systems attached to the scalp with medical-grade adhesives or clips - no surgery required.',
  },
  {
    q: 'Can I do it in Surat?',
    a: 'Yes. We serve clients in Surat directly. You can book an in-person consultation at our nearest centre or opt for a fully online consultation with doorstep delivery of your custom system.',
  },
  {
    q: 'How durable is a hair replacement system?',
    a: 'With proper care and regular maintenance, a high-quality hair system can last 6-12 months. Premium base materials and correct adhesive use significantly extend the lifespan.',
  },
  {
    q: 'What steps are required for hair replacement maintenance?',
    a: 'We recommend cleaning the system every 7-14 days, scheduling a professional re-adhesion every 3-4 weeks, and using our recommended care products to maintain both the base and hair.',
  },
  {
    q: 'Can I customise it to my own preference?',
    a: 'Absolutely. Every system we create is fully customised - including hair colour, density, wave pattern, hairline shape, base size, and style - to match your exact preferences and lifestyle.',
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
   SHARED: Blue checkbox SVG — matches reference image exactly
───────────────────────────────────────────────────────────── */
function CheckboxIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0 }}
    >
      <rect width="20" height="20" rx="5" fill="#1769FF" />
      <path
        d="M5 10.5L8.5 14L15 7"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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
   1. HERO — plain centred text, no card wrapper
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
            Non Surgical Hair<br />Replacement In Surat
          </h1>
          <p
            className={`text-[#555555] leading-[1.7] max-w-[580px] mx-auto ${inView ? 'anim-fade-up delay-200' : 'opacity-0'}`}
            style={{ fontSize: '16px', fontWeight: 500 }}
          >
            Don't let hair loss affect your confidence. Our non-surgical hair replacement solutions help you to
            look your best again and feel more{' '}
            <strong style={{ fontWeight: 700, color: '#121212' }}>confident in Surat.</strong>
          </p>
        </div>

        {/* Cinematic hero card */}
        <div className={`relative w-full rounded-[20px] md:rounded-[24px] overflow-hidden bg-[#0a0c10] h-[280px] md:h-[500px] shadow-[0px_24px_64px_0px_rgba(0,0,0,0.2)] ${inView ? 'anim-scale-in delay-300' : 'opacity-0'}`}>
          <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-results-story-sameer-after.png" alt="Hair Replacement In Surat" fill className="object-cover object-center" sizes="(max-width: 768px) 100vw, 720px" />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.88)] via-[rgba(10,12,16,0.25)] to-transparent" />
          <div className="absolute bottom-[24px] md:bottom-[40px] left-[24px] md:left-[48px]">
            <p
              className="text-white leading-none m-0 uppercase tracking-[0.08em]"
              style={{ fontSize: 'clamp(22px, 3vw, 36px)', fontWeight: 800 }}
            >
              HAIR REPLACEMENT
            </p>
            <p
              className="text-white/55 uppercase mt-[4px] m-0 tracking-[0.2em]"
              style={{ fontSize: 'clamp(13px, 1.5vw, 18px)', fontWeight: 700 }}
            >
              IN SURAT
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   2. HAIR PATCH & WIGS FOR MEN
   Grey bg. Branded video left + BulletGroup right.
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
          Hair Patch & Wigs For Men<br />In Surat
        </h2>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-[48px] md:gap-[64px] items-center">

          {/* "ANSPLANT or PATCH" branded video left */}
          <div className={`relative w-full h-[280px] md:h-[420px] rounded-[16px] overflow-hidden bg-[#0a0c10] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.15)] ${inView ? 'anim-slide-r' : 'opacity-0'}`}>
            <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-2.png" alt="Ansplant or Patch" fill className="object-cover object-center" style={{ opacity: 0.5 }} />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(5,7,10,0.9)] via-[rgba(5,7,10,0.55)] to-[rgba(5,7,10,0.25)]" />
            <div className="absolute top-[20px] md:top-[28px] left-[20px] md:left-[28px]">
              <p className="text-white leading-[1.1] tracking-[-0.3px] m-0" style={{ fontSize: 'clamp(20px, 2.5vw, 30px)', fontWeight: 800 }}>
                <span style={{ color: '#4686FE' }}>ANSPLANT</span>
                {' '}
                <span className="text-white/80" style={{ fontWeight: 700, fontSize: 'clamp(16px, 2vw, 22px)' }}>or</span>
                {' '}
                <span className="text-white">PATCH</span>
              </p>
            </div>
            <div className="absolute bottom-[20px] left-[20px] right-[20px] flex justify-between">
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

          {/* BulletGroup right */}
          <div className={`${inView ? 'anim-slide-l delay-200' : 'opacity-0'}`}>
            <BulletGroup bullets={hairPatchBullets} />
          </div>

        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   3. ADVANTAGES OF NON-SURGICAL HAIR REPLACEMENT
   White bg. Intro card + BulletGroup left. Video right.
───────────────────────────────────────────────────────────── */
function AdvantagesSection() {
  const { ref, inView } = useInView();
  return (
    <section className="bg-white py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2
          className="text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[64px]"
          style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 800 }}
        >
          Advantages Of Non-Surgical<br />Hair Replacement
        </h2>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-[48px] md:gap-[64px] items-center">

          {/* Left: single card — paragraph + ● bullet list, no dividers */}
          <div className={`${inView ? 'anim-slide-r' : 'opacity-0'}`}>
            <div
              className="rounded-[16px] p-[24px] md:p-[32px]"
              style={{ background: '#fff', boxShadow: '0 2px 16px rgba(18,18,18,0.08)', border: '1px solid rgba(18,18,18,0.07)' }}
            >
              <p style={{ fontSize: '15px', fontWeight: 500, color: '#555555', lineHeight: '1.7', margin: '0 0 20px 0' }}>
                <strong style={{ fontWeight: 700, color: '#121212' }}>Non-surgical hair replacement</strong>
                {' '}is a great option for those who want to regain their confidence and look their best without surgery. Some{' '}
                <strong style={{ fontWeight: 700, color: '#121212' }}>additional benefits</strong>
                {' '}of non-surgical hair replacement are:
              </p>
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {advantagesBullets.map((b, i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '18px', color: '#121212', lineHeight: 1, flexShrink: 0 }}>●</span>
                    <span style={{ fontSize: '15px', fontWeight: 700, color: '#121212', lineHeight: '1.5' }}>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Video right */}
          <div className={`relative w-full h-[260px] md:h-[400px] rounded-[16px] overflow-hidden bg-[#121212] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.12)] ${inView ? 'anim-slide-l delay-200' : 'opacity-0'}`}>
            <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-3.png" alt="Advantages Non-Surgical" fill className="object-cover object-center" />
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
   4. WHY CHOOSE OUR NON-SURGICAL SERVICES IN SURAT?
   Grey bg. Full-width video + accordion with blue checkbox SVG
   icons matching the reference image exactly.
───────────────────────────────────────────────────────────── */
function WhyChooseSection() {
  const [openIndex, setOpenIndex] = useState(0);
  const { ref: videoRef, inView: videoInView } = useInView(0.1);
  const { ref: accordRef, inView: accordInView } = useInView(0.1);

  return (
    <section className="bg-[#F5F6F7] py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2
          className="text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[56px]"
          style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 800 }}
        >
          Why Choose Our Non-Surgical Hair Replacement<br />Services In Surat?
        </h2>

        {/* Full-width "Most Undetectable" video */}
        <div
          ref={videoRef}
          className={`relative w-full rounded-[20px] overflow-hidden bg-[#0a0c10] h-[240px] md:h-[440px] shadow-[0px_16px_48px_0px_rgba(0,0,0,0.18)] mb-[32px] md:mb-[40px] ${videoInView ? 'anim-scale-in' : 'opacity-0'}`}
        >
          <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-results-story-amit-after.png" alt="Most Undetectable Hair System" fill className="object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.75)] via-transparent to-transparent" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(100deg, rgba(10,12,16,0.6) 0%, transparent 60%)' }} />
          <div className="absolute bottom-[20px] md:bottom-[32px] left-[20px] md:left-[36px]">
            <p className="leading-[1.2] m-0" style={{ fontSize: 'clamp(18px, 2.5vw, 30px)', fontWeight: 800 }}>
              <span style={{ fontStyle: 'italic', color: '#F5C518' }}>Most Undetectable</span>
              {' '}
              <span className="text-white">Hair System in India</span>
            </p>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              className="w-[56px] h-[56px] md:w-[72px] md:h-[72px] rounded-full flex items-center justify-center transition-transform hover:scale-105 duration-300"
              style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1.5px solid rgba(255,255,255,0.25)' }}
            >
              <Play size={22} color="white" fill="white" style={{ marginLeft: 3 }} />
            </button>
          </div>
        </div>

        {/* Accordion — blue checkbox SVG left, ChevronDown/Up right, matching reference */}
        <div ref={accordRef} className={`flex flex-col gap-[8px] ${accordInView ? 'anim-fade-up' : 'opacity-0'}`}>
          {whyChooseAccordion.map((item, i) => (
            <div
              key={i}
              className="bg-white rounded-[12px] overflow-hidden cursor-pointer"
              style={{ border: '1px solid rgba(18,18,18,0.08)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
              onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
            >
              {/* Row: checkbox SVG + title + chevron */}
              <div className="flex items-center gap-[12px] px-[16px] md:px-[20px] py-[14px] md:py-[16px]">
                <CheckboxIcon />
                <span
                  style={{
                    flex: 1,
                    fontSize: openIndex === i ? '16px' : '16px',
                    fontWeight: openIndex === i ? 700 : 500,
                    color: openIndex === i ? '#121212' : 'rgba(18,18,18,0.8)',
                    lineHeight: '1.4',
                    transition: 'all 0.3s',
                  }}
                >
                  {item.title}
                </span>
                {openIndex === i
                  ? <ChevronUp size={17} style={{ color: 'rgba(18,18,18,0.4)', flexShrink: 0 }} />
                  : <ChevronDown size={17} style={{ color: 'rgba(18,18,18,0.4)', flexShrink: 0 }} />
                }
              </div>
              {openIndex === i && (
                <div className="px-[16px] md:px-[20px] pb-[16px] pl-[48px]">
                  <p style={{ fontSize: '16px', fontWeight: 500, color: '#555555', lineHeight: '1.7', margin: 0 }}>
                    {item.desc}
                  </p>
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
   6. TYPES OF NON-SURGICAL HAIR REPLACEMENT SOLUTIONS
   White bg. Branded video left + BulletGroup right.
───────────────────────────────────────────────────────────── */
function TypesSection() {
  const { ref, inView } = useInView();
  return (
    <section className="bg-white py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2
          className="text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[64px]"
          style={{ fontSize: 'clamp(26px, 3.5vw, 44px)', fontWeight: 800 }}
        >
          Types Of Non-Surgical Hair Replacement<br />Solutions At American Hairline
        </h2>

        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-[48px] md:gap-[64px] items-center">

          {/* Branded "Undetectable Hair System in" video left */}
          <div className={`relative w-full h-[260px] md:h-[400px] rounded-[16px] overflow-hidden bg-[#121212] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.12)] ${inView ? 'anim-slide-r' : 'opacity-0'}`}>
            <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-4.png" alt="Types Non-Surgical Solutions" fill className="object-cover object-center" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(23,105,255,0.55) 0%, transparent 55%)' }} />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.85)] via-transparent to-transparent" />
            <div className="absolute bottom-[20px] left-[20px]">
              <div className="flex items-center gap-[6px] mb-[5px]">
                <div className="w-[7px] h-[7px] rounded-full bg-[#4686FE]" />
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>Undetectable</span>
              </div>
              <p style={{ fontSize: '20px', fontWeight: 700, color: '#fff', lineHeight: '1.2', margin: 0 }}>Hair System In</p>
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

          {/* BulletGroup right */}
          <div className={`${inView ? 'anim-slide-l delay-200' : 'opacity-0'}`}>
            <BulletGroup bullets={typesBullets} />
          </div>

        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   7. FAQ — grey bg. + / × accordion + blue CTA card.
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

          {/* Blue CTA card */}
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
export default function SuratPage() {
  return (
    <main>
      <HeroSection />
      <HairPatchSection />
      <AdvantagesSection />
      <WhyChooseSection />
      <Checklist />
      <TypesSection />
      <FAQSection />
      <CTA />
      <ResultsRealPeople />
    </main>
  );
}