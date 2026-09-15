'use client';

import Image from 'next/image';
import { Plus, X, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { HAIR_PATCH_BENEFITS_ASSETS } from './hairPatchBenefitsAssets';
import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';

const benefits = [
  {
    title: 'Natural-Looking Results',
    desc: 'Learn how to choose the most realistic hairline, density, and texture.',
  },
  {
    title: 'Safe & Comfortable Wear',
    desc: 'Understand which hair system bases are the most secure for daily use.',
  },
  {
    title: 'Avoid Common Mistakes',
    desc: 'Discover what most people get wrong when selecting a hair patch.',
  },
  {
    title: 'Design over Product',
    desc: 'See why great results come from custom design, not just the system itself.',
  },
];

const BenefitItem = ({ title, desc }: { title: string; desc: string }) => (
  <div
    style={{
      background: '#fff',
      borderRadius: '12px',
      padding: '16px',
      display: 'flex',
      gap: '12px',
      alignItems: 'flex-start',
    }}
  >
    <div
      style={{
        width: '22px',
        height: '22px',
        borderRadius: '5px',
        background: '#121212',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        marginTop: '2px',
      }}
    >
      <Check style={{ width: '13px', height: '13px', color: '#fff', strokeWidth: 3 }} />
    </div>
    <div>
      <p style={{ fontSize: '15px', fontWeight: 700, color: '#121212', margin: '0 0 4px', letterSpacing: '-0.2px' }}>
        {title}
      </p>
      <p style={{ fontSize: '13px', color: '#666', margin: 0, lineHeight: '1.55' }}>
        {desc}
      </p>
    </div>
  </div>
);

export const HairPatchBenefits = () => {
  const [open, setOpen] = useState(false);
  const scrollToContactForm = () => {
    window.location.href = '/contact-us';
  };

  const openModal = () => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    setOpen(true);
  };

  const closeModal = () => {
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    setOpen(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  const DesignPhilosophyCard = () => (
    <div
      style={{
        background: 'linear-gradient(130deg, #4686FE 0%, #1769FF 100%)',
        borderRadius: '14px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div
          style={{
            width: '30px', height: '30px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C8.686 2 6 4.686 6 8c0 2.21 1.12 4.16 2.83 5.33V15a1 1 0 001 1h4.34a1 1 0 001-1v-1.67C16.88 12.16 18 10.21 18 8c0-3.314-2.686-6-6-6z" fill="white" fillOpacity="0.9"/>
            <path d="M9 17h6M10 20h4" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </div>
        <p style={{ fontSize: '15px', fontWeight: 800, color: '#fff', margin: 0 }}>Design Philosophy:</p>
      </div>
      <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)', lineHeight: '1.65', margin: 0 }}>
        It's not just about "adding hair." It's about aesthetic design, the way a stylist creates a custom look, not a haircut.
      </p>
      <button
        type="button"
        onClick={scrollToContactForm}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: '#fff', border: 'none', borderRadius: '9px',
          padding: '11px 18px', fontSize: '14px', fontWeight: 700,
          color: '#121212', cursor: 'pointer', alignSelf: 'flex-start', letterSpacing: '-0.1px',
        }}
      >
        Talk to an Expert
        <span style={{ width: '22px', height: '22px', background: '#121212', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="11" height="11" viewBox="0 0 10 10" fill="none">
            <path d="M1.5 8.5L8.5 1.5M8.5 1.5H4M8.5 1.5V6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
      </button>
    </div>
  );

  return (
    <AnimateOnScroll variant="fadeUp">
    <>
      {/* ── Section ── */}
      <style>{`
        .benefits-card { width: 100%; height: 583px; }
        @media (min-width: 768px) { .benefits-card { width: 100%; max-width: 1120px; height: 583px; } }
        .plus-btn-wrap { bottom: 20px; right: 20px; }
      `}</style>
      <section className="py-[60px] md:py-[80px] lg:py-[120px] bg-[#F5F6F7]">
        <div className="w-full max-w-[1440px] mx-auto px-4 md:px-10 xl:px-[160px] flex justify-center">
          <div className="benefits-card relative rounded-[16px] overflow-hidden bg-[#1769FF] shadow-[0px_8px_24px_0px_#0000000D] group cursor-pointer">

            {/* Desktop image */}
            <div className="absolute inset-0 hidden md:block pointer-events-none overflow-hidden">
              <div className="absolute inset-y-0 right-[11%] w-[85%] h-[90%]">
                <Image
                  src={HAIR_PATCH_BENEFITS_ASSETS.desktopCard.src}
                  alt={HAIR_PATCH_BENEFITS_ASSETS.desktopCard.alt}
                  fill
                  className="object-contain object-right-bottom scale-[1.18] translate-x-[4%] translate-y-[4%]"
                />
              </div>
            </div>

            {/* Mobile image */}
            <div className="absolute inset-0 md:hidden overflow-hidden">
              <Image
                src={HAIR_PATCH_BENEFITS_ASSETS.mobileCard.src}
                alt={HAIR_PATCH_BENEFITS_ASSETS.mobileCard.alt}
                fill
                className="object-cover scale-[1.16] translate-y-[4%]"
                style={{ objectPosition: '52% 30%' }}
              />
            </div>

            {/* Plus button */}
            <div className="plus-btn-wrap absolute z-20 group/plus">
              {!open && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 opacity-0 group-hover/plus:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="relative bg-white px-3 py-1 rounded-[4px] shadow-sm whitespace-nowrap">
                    <span className="text-black text-[12px] font-semibold">Tap to read more</span>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-white" />
                  </div>
                </div>
              )}
              <button
                onClick={openModal}
                className="w-[44px] h-[44px] bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
              >
                <Plus className="w-6 h-6 text-[#121212]" />
              </button>
            </div>

            {/* Heading overlay */}
            <div className="absolute top-[24px] left-[24px] md:top-[119px] md:left-[79px] flex flex-col gap-2 z-10">
              <div className="inline-flex items-center justify-center px-3 py-1.5 bg-white rounded-[6px] w-fit">
                <span className="text-[#555555] text-[12px] md:text-[16px] font-semibold tracking-[-0.12px]">
                  Hair System Benefits
                </span>
              </div>
              <h2 className="text-white text-[32px] md:text-[48px] font-extrabold leading-[1.2] md:leading-[58px] tracking-[-0.5px] max-w-[300px] md:max-w-[403px]">
                Benefits of a Natural Looking{' '}
                <span style={{ color: '#93C4FF' }}>Hair System</span>
              </h2>
            </div>

          </div>
        </div>
      </section>

      {/* ── Modal (portalled to body to escape AnimateOnScroll stacking context) ── */}
      {open && createPortal(
        <div
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(10, 20, 60, 0.60)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '16px',
          }}
        >
          {/* ── DESKTOP ── */}
          <div className="hidden md:flex"
            style={{
              background: '#F0F2F5', borderRadius: '20px',
              width: '100%', maxWidth: '1100px',
              maxHeight: 'calc(100vh - 48px)',
              overflow: 'hidden', position: 'relative', flexDirection: 'row',
            }}
          >
            <button onClick={closeModal}
              style={{
                position: 'absolute', top: '16px', right: '16px',
                width: '36px', height: '36px', borderRadius: '50%',
                background: '#121212', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10,
              }}
            >
              <X style={{ width: '16px', height: '16px', color: '#fff' }} />
            </button>

            <div style={{ flex: '1 1 0', overflowY: 'auto', padding: '44px 40px 40px', display: 'flex', flexDirection: 'column', gap: '0' }}>
              <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#121212', margin: '0 0 10px', lineHeight: '1.25', letterSpacing: '-0.4px', maxWidth: '360px' }}>
                The Easy Guide to choosing the{' '}
                <span style={{ color: '#1769FF' }}>right hair system</span>
              </h2>
              <p style={{ fontSize: '14px', color: '#555', margin: '0 0 24px', lineHeight: '1.6', maxWidth: '400px' }}>
                This simple guide shows you how to avoid mistakes and choose the best option for your hair.
              </p>
              <p style={{ fontSize: '15px', fontWeight: 700, color: '#121212', margin: '0 0 14px' }}>What you'll learn:</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
                {benefits.map((b, i) => <BenefitItem key={i} {...b} />)}
              </div>
              <DesignPhilosophyCard />
            </div>

            <div
              style={{
                width: '47%',
                minWidth: '460px',
                flexShrink: 0,
                position: 'relative',
                overflow: 'hidden',
                background: '#FFFFFF',
              }}
            >
              <Image
                src={HAIR_PATCH_BENEFITS_ASSETS.desktopModal.src}
                alt={HAIR_PATCH_BENEFITS_ASSETS.desktopModal.alt}
                fill
                style={{
                  objectFit: 'cover',
                  objectPosition: '110% center',
                  transform: 'scale(1.3) translateY(18%)',
                }}
              />
            </div>
          </div>

          {/* ── MOBILE ── */}
          <div className="flex md:hidden"
            style={{
              background: '#F0F2F5', borderRadius: '20px',
              width: '100%', maxWidth: '420px',
              maxHeight: 'calc(100vh - 32px)', overflowY: 'auto',
              flexDirection: 'column', position: 'relative',
            }}
          >
            <button onClick={closeModal}
              style={{
                position: 'absolute', top: '14px', right: '14px',
                width: '32px', height: '32px', borderRadius: '50%',
                background: '#121212', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 10, flexShrink: 0,
              }}
            >
              <X style={{ width: '15px', height: '15px', color: '#fff' }} />
            </button>

            <div style={{ padding: '28px 20px 32px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#121212', margin: '0 0 8px', lineHeight: '1.3', letterSpacing: '-0.3px', paddingRight: '36px' }}>
                The Easy Guide to choosing the{' '}
                <span style={{ color: '#1769FF' }}>right hair system</span>
              </h2>
              <p style={{ fontSize: '13px', color: '#555', margin: '0 0 20px', lineHeight: '1.6' }}>
                This simple guide shows you how to avoid mistakes and choose the best option for your hair.
              </p>
              <p style={{ fontSize: '14px', fontWeight: 700, color: '#121212', margin: '0 0 12px' }}>What you'll learn:</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                {benefits.map((b, i) => <BenefitItem key={i} {...b} />)}
              </div>
              <DesignPhilosophyCard />
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
    </AnimateOnScroll>
  );
};
