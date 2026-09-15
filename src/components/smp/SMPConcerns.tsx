'use client';
import { useState } from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { SMP_CONCERNS_ASSETS } from './smpConcernsAssets';
import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';

const concerns = [
  { id: 'alopecia',       label: 'Alopecia',       assets: SMP_CONCERNS_ASSETS.alopecia },
  { id: 'front-hairline', label: 'Front Hairline',  assets: SMP_CONCERNS_ASSETS.frontHairline },
  { id: 'scar-treatment', label: 'Scar Treatment',  assets: SMP_CONCERNS_ASSETS.scar },
  { id: 'crown-area',     label: 'Crown Area',      assets: SMP_CONCERNS_ASSETS.crownArea },
  { id: 'full-head',      label: 'Full Head',       assets: SMP_CONCERNS_ASSETS.fullHead },
];

const content = {
  alopecia: {
    title: 'For Alopecia:',
    points: [
      'Patchy Loss: Tiny dots in bald patches reduce scalp visibility; keep hair slightly longer for natural blending.',
      'Overall Loss (50%+): Very short cut + pigments across scalp create full look. Hairline kept receded with fine, uneven dots for realism.',
    ],
  },
  'front-hairline': {
    title: 'For Front Hairline:',
    points: [
      'Receding Hairline: Restore your youthful look by redefining the hairline with natural-looking density.',
      'Custom Design: We design the hairline to match your age and facial structure for a realistic appearance.',
    ],
  },
  'scar-treatment': {
    title: 'For Scar Treatment:',
    points: [
      'Camouflage Scars: Effective for strip scars (FUT) and FUE scars from hair transplants.',
      'Seamless Blending: Pigments are matched to your hair color to blend scars into surrounding hair.',
    ],
  },
  'crown-area': {
    title: 'For Crown Area:',
    points: [
      'Thinning Crown: Add density to the crown area to reduce the contrast between scalp and hair.',
      'Fuller Look: Creates the appearance of a full head of hair without surgery.',
    ],
  },
  'full-head': {
    title: 'For Full Head:',
    points: [
      'Complete Balding: Create a full \'shaved head\' look for complete baldness.',
      'Defined Hairline: Frame your face with a new, perfectly designed hairline.',
    ],
  },
};

export const SMPConcerns = () => {
  const [activeTab, setActiveTab] = useState('alopecia');
  const scrollToContactForm = () => {
    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const activeConcern = concerns.find(c => c.id === activeTab)!;
  const activeContent = content[activeTab as keyof typeof content];

  return (
    <AnimateOnScroll variant="fadeUp">
    <section className="bg-white py-[72px] md:py-[120px] px-4 md:px-10 xl:px-[160px]">
      <div className="max-w-[1440px] mx-auto">

        <h2 className="text-[26px] md:text-[44px] font-extrabold text-dark leading-[1.2] tracking-[-0.5px] text-center mb-10 md:mb-14">
          Find The SMP Treatment For<br />Your Concern
        </h2>

        {/* ── Tab bar ── */}
        <style>{`.smp-tab-bar::-webkit-scrollbar { display: none; }`}</style>
        <div className="flex justify-center mb-10 md:mb-12">
          {/* Mobile: 358×42 scrollable pill */}
          <div
            className="smp-tab-bar md:hidden bg-[#F5F6F7] p-1 rounded-full flex gap-1"
            style={{ width: 358, height: 42, overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none', flexShrink: 0 }}
          >
            {concerns.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 rounded-full text-[12px] font-semibold transition-all whitespace-nowrap flex-shrink-0 h-full ${
                  activeTab === tab.id ? 'bg-[#0057FF] text-white shadow-md' : 'text-[#555]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {/* Desktop: natural width pill */}
          <div className="smp-tab-bar hidden md:flex bg-[#F5F6F7] p-1.5 rounded-full gap-1.5">
            {concerns.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-7 py-3 rounded-full text-[16px] font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab.id ? 'bg-[#0057FF] text-white shadow-md' : 'text-[#555] hover:text-dark'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Content grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">

          {/* Image — mobile: 16/10, desktop: 4/3 */}
          <div className="relative w-full rounded-2xl md:rounded-3xl overflow-hidden">
            {/* Mobile image — 16/10 */}
            <div className="relative w-full md:hidden" style={{ aspectRatio: '16/10' }}>
              <Image
                src={activeConcern.assets.mobile.url}
                alt={activeConcern.assets.mobile.alt}
                fill
                className="object-cover object-center"
                sizes="calc(100vw - 32px)"
              />
            </div>
            {/* Desktop image — 4/3 */}
            <div className="relative w-full hidden md:block" style={{ aspectRatio: '4/3' }}>
              <Image
                src={activeConcern.assets.desktop.url}
                alt={activeConcern.assets.desktop.alt}
                fill
                className="object-cover object-center"
                sizes="(min-width: 1280px) 560px, 50vw"
              />
            </div>
          </div>

          {/* Right column — text card + CTA */}
          <div className="flex flex-col gap-4 h-full">
            <div className="bg-[#F5F6F7] rounded-2xl md:rounded-3xl p-6 md:p-8 flex-1">
              <h3 className="text-[18px] md:text-[20px] font-bold text-dark mb-5">
                {activeContent.title}
              </h3>
              <ul className="flex flex-col gap-4">
                {activeContent.points.map((point, i) => {
                  const colonIdx = point.indexOf(':');
                  const bold = colonIdx !== -1 ? point.slice(0, colonIdx) : null;
                  const rest = colonIdx !== -1 ? point.slice(colonIdx + 1) : point;
                  return (
                    <li key={i} className="flex gap-3 text-[#555] leading-relaxed text-[15px] md:text-[16px]">
                      <span
                        className="w-1.5 h-1.5 rounded-full bg-dark mt-[7px] flex-shrink-0"
                        aria-hidden="true"
                      />
                      <span>
                        {bold ? (
                          <><span className="font-bold text-dark">{bold}:</span>{rest}</>
                        ) : (
                          point
                        )}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <button
              type="button"
              onClick={scrollToContactForm}
              className="w-full flex-shrink-0 bg-gradient-to-r from-[#4686FE] to-[#1769FF] text-white py-4 rounded-[12px] font-semibold text-[15px] md:text-[16px] flex items-center justify-center gap-2 shadow-[0px_4px_8px_0px_rgba(0,0,0,0.15)] hover:opacity-90 transition-opacity"
            >
              Book Your Treatment
              <span className="w-6 h-6 bg-white rounded-[6px] flex items-center justify-center flex-shrink-0">
                <ArrowUpRight className="w-4 h-4 text-[#1769FF]" aria-hidden="true" />
              </span>
            </button>
          </div>

        </div>
      </div>
    </section>
    </AnimateOnScroll>
  );
};
