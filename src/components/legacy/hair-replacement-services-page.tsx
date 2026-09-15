'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight, Play } from 'lucide-react';
import { ContactForm as CTA } from '@/components/homepage/ContactForm';
import { ResultsRealPeople } from '@/components/results/ResultsRealPeople';

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
const serviceSteps = [
  {
    title: 'Removal',
    desc: 'After wearing it for 15 to 35 days, the hair system is removed from the scalp with the help of a remover called C22.',
  },
  {
    title: 'Cleaning of the Scalp',
    desc: 'The scalp is thoroughly cleaned to remove any adhesive residue, ensuring a fresh and healthy base for reapplication.',
  },
  {
    title: 'Cleaning of the Hair System',
    desc: 'The hair system is carefully washed and conditioned to maintain its quality and natural appearance.',
  },
  {
    title: 'Application of Tape',
    desc: 'Medical-grade double-sided tape is applied precisely to ensure a strong, comfortable, and long-lasting bond.',
  },
  {
    title: 'Fixing the Hair System',
    desc: 'The hair system is aligned with your natural hairline and secured firmly for a seamless, undetectable fit.',
  },
  {
    title: 'Styling',
    desc: 'Our expert stylists cut, style, and blend the hair system to match your desired look and personality.',
  },
];

const suggestions = [
  {
    bold: 'Prioritise quality:',
    text: ' Never compromise on the high standard of service provided.',
  },
  {
    bold: 'Prevent damage:',
    text: ' Using incorrect products causes dryness and weakens the base, significantly reducing the hair system\'s lifespan.',
  },
  {
    bold: 'Premium products:',
    text: ' While premium products increase service costs, they are a worthwhile investment for better longevity, hair texture, and scalp protection.',
  },
  {
    bold: 'Long-term value:',
    text: ' White premium products increase service costs, they are a worthwhile investment for better longevity, hair texture, and scalp protection.',
  },
];

/* ─────────────────────────────────────────────────────────────
   1. HERO SECTION
───────────────────────────────────────────────────────────── */
function HeroSection() {
  return (
    <section className="bg-white py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <div className="text-center mb-[48px] md:mb-[56px]">
          <h1 className="text-[32px] md:text-[52px] font-extrabold text-[#121212] leading-[1.15] tracking-[-1px] mb-[16px]">
            Hair Replacement Services
          </h1>
          {/* Body — 16px, fontWeight 500 */}
          <p className="text-[16px] font-[500] text-[#555555] leading-[1.7] max-w-[540px] mx-auto">
            Get your hair system professionally serviced by{' '}
            <strong style={{ fontWeight: 700, color: '#121212' }}>internationally trained hair experts.</strong>
            {' '}Enjoy a fresh, secure, and completely natural look every time.
          </p>
        </div>

        {/* Video hero card */}
        <div className="relative w-full rounded-[20px] md:rounded-[24px] overflow-hidden bg-[#121212] h-[280px] md:h-[480px] shadow-[0px_24px_64px_0px_rgba(0,0,0,0.18)]">
          <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-1.png" alt="Hair Replacement Service" fill className="object-cover object-center" sizes="(max-width: 768px) 100vw, 720px" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0c10] via-[rgba(10,12,16,0.3)] to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-[20px]">
            <button className="w-[56px] h-[56px] md:w-[72px] md:h-[72px] rounded-full flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1.5px solid rgba(255,255,255,0.25)' }}>
              <Play size={20} color="white" fill="white" style={{ marginLeft: 3 }} />
            </button>
            <div className="text-center">
              <p className="text-white text-[18px] md:text-[24px] font-extrabold tracking-[0.2em] uppercase leading-none m-0">
                HAIR REPLACEMENT
              </p>
              <p className="text-white/50 text-[11px] md:text-[13px] tracking-[0.25em] uppercase mt-[6px] m-0">
                SERVICE
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   2. SERVICES SECTION
   + / × accordion, first item open
───────────────────────────────────────────────────────────── */
function ServicesSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="bg-[#F5F6F7] py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2 className="text-[26px] md:text-[44px] font-extrabold text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[64px]">
          Hair Replacement Services<br />By American Hairline
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[48px] md:gap-[64px] items-start">

          {/* Video card */}
          <div className="relative w-full h-[280px] md:h-[440px] rounded-[16px] overflow-hidden bg-[#121212] shadow-[0px_8px_32px_0px_rgba(0,0,0,0.12)]">
            <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-2.png" alt="Hair Replacement Process" fill className="object-cover object-center" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(23,105,255,0.6) 0%, transparent 55%)' }} />
            <div className="absolute inset-0 bg-gradient-to-t from-[rgba(10,12,16,0.7)] via-transparent to-transparent" />
            <div className="absolute top-[24px] left-[24px] md:top-[32px] md:left-[32px]">
              <p className="text-white text-[22px] md:text-[32px] font-extrabold leading-[1.2] tracking-[-0.5px] m-0">
                Hair<br />Replacement
              </p>
            </div>
            <button
              className="absolute top-[24px] right-[24px] md:top-[32px] md:right-[32px] w-[44px] h-[44px] md:w-[52px] md:h-[52px] rounded-full flex items-center justify-center"
              style={{ background: 'rgba(255,69,69,0.92)', boxShadow: '0 4px 16px rgba(255,69,69,0.45)' }}
            >
              <Play size={16} color="white" fill="white" style={{ marginLeft: 2 }} />
            </button>
          </div>

          {/* Accordion — + / × icons, first item open */}
          <div className="flex flex-col">
            {serviceSteps.map((step, i) => (
              <div
                key={i}
                className="cursor-pointer"
                style={{ borderBottom: '1px solid rgba(18,18,18,0.08)' }}
                onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
              >
                <div className="flex justify-between items-center py-[18px]">
                  {/* Title — 20px/700 when open, 16px/500 when closed */}
                  <span style={{
                    fontSize: openIndex === i ? '20px' : '16px',
                    fontWeight: openIndex === i ? 700 : 500,
                    color: openIndex === i ? '#121212' : 'rgba(18,18,18,0.55)',
                    lineHeight: '1.4',
                    transition: 'all 0.3s',
                  }}>
                    {step.title}
                  </span>
                  <span style={{ fontSize: '20px', fontWeight: 700, color: 'rgba(18,18,18,0.4)', flexShrink: 0, marginLeft: '16px', userSelect: 'none', lineHeight: 1 }}>
                    {openIndex === i ? '×' : '+'}
                  </span>
                </div>
                {openIndex === i && (
                  /* Answer — 16px, 500 */
                  <p style={{ fontSize: '16px', fontWeight: 500, color: '#555555', lineHeight: '1.65', paddingBottom: '18px', margin: 0 }}>
                    {step.desc}
                  </p>
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
   3. SUGGESTIONS SECTION
───────────────────────────────────────────────────────────── */
function SuggestionsSection() {
  return (
    <section className="bg-white py-[72px] md:py-[120px] flex justify-center w-full">
      <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

        <h2 className="text-[26px] md:text-[44px] font-extrabold text-[#121212] leading-[1.2] tracking-[-0.5px] text-center mb-[48px] md:mb-[64px]">
          Our Suggestions
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[48px] md:gap-[64px] items-center">

          {/* Image */}
          <div className="relative w-full h-[300px] md:h-[420px] rounded-[16px] overflow-hidden shadow-[0px_8px_24px_0px_rgba(0,0,0,0.08)]">
            <Image src="https://pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/legacy-smp-step-3.png" alt="Our Suggestions" fill className="object-cover object-center" />
          </div>

          {/* Single grouped card for bullets */}
          <div
            className="rounded-[12px] overflow-hidden"
            style={{
              background: '#fff',
              boxShadow: '0 2px 12px rgba(18,18,18,0.07)',
              border: '1px solid rgba(18,18,18,0.06)',
            }}
          >
            {suggestions.map((s, i) => (
              <div key={i} className="p-[18px] md:p-[22px]">
                <p style={{ fontSize: '16px', fontWeight: 500, color: '#555555', lineHeight: '1.65', margin: 0 }}>
                  <strong style={{ fontSize: '20px', fontWeight: 700, color: '#121212' }}>{s.bold}</strong>
                  {s.text}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   PAGE ROOT
───────────────────────────────────────────────────────────── */
export default function HairReplacementPage() {
  return (
    <main>
      <HeroSection />
      <ServicesSection />
      <SuggestionsSection />
      <CTA />
      <ResultsRealPeople />
    </main>
  );
}