'use client';

import Image from 'next/image';
import { Check, Plus, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { SMP_ABOUT_ASSETS } from './smpAboutAssets';
import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';

const pros = [
  'No Scar / No pain',
  '100% Safe',
  'Results within a month',
  'Makes the scalp look fuller',
];

const cons = [
  'Needs touch up after 2 years',
  'SMP does not regrow hair',
];

function PopupItem({ label, tone }: { label: string; tone: 'positive' | 'negative' }) {
  const isPositive = tone === 'positive';

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '10px',
        padding: '13px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
      }}
    >
      <span
        style={{
          width: '22px',
          height: '22px',
          borderRadius: '6px',
          background: isPositive ? '#22C55E' : '#EF4444',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {isPositive ? (
          <Check style={{ width: '13px', height: '13px', color: '#fff', strokeWidth: 3 }} />
        ) : (
          <X style={{ width: '13px', height: '13px', color: '#fff', strokeWidth: 3 }} />
        )}
      </span>
      <span style={{ fontSize: '14px', color: '#121212', fontWeight: 500 }}>{label}</span>
    </div>
  );
}

export const SMPAbout = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [open]);

  return (
    <AnimateOnScroll variant="fadeUp">
    <>
      <section className="bg-white py-[72px] md:py-[120px] flex justify-center w-full">
        <div className="w-full max-w-[1440px] px-4 md:px-10 xl:px-[160px]">

          {/* ── Card ── */}
          <div
            className="relative inline-flex h-[583px] w-full flex-col items-center justify-start overflow-hidden rounded-2xl bg-[#F5F6F7] md:flex-row md:items-center md:justify-between md:rounded-3xl"
          >

            {/* Left: text content */}
            <div className="relative z-10 w-full self-start p-[24px_56px_417px_24px] md:max-w-[500px] md:p-20">
              <div className="inline-flex items-center gap-2 bg-[#121212]/5 px-3 py-1.5 rounded-md mb-4 w-fit">
                <Image src="/assets/smp-syringe.svg" alt="SMP" width={16} height={16} />
                <span className="text-xs font-semibold text-[#555555]">SMP</span>
              </div>
              <h2 className="text-[32px] md:text-[56px] font-extrabold text-dark leading-[1.1] mb-8">
                About <br className="md:hidden" /><span className="text-[#1769FF]">Scalp<br />Micropigmentation</span>
              </h2>
            </div>

            {/* Right: designer card image — mobile */}
            <div className="absolute inset-x-0 bottom-0 h-[634px] md:hidden">
              <Image
                src={SMP_ABOUT_ASSETS.card.mobile.url}
                alt={SMP_ABOUT_ASSETS.card.mobile.alt}
                fill
                className="object-contain object-bottom"
                sizes="100vw"
              />
            </div>

            {/* Right: designer card image — desktop */}
            <div className="hidden md:block absolute right-0 top-0 bottom-0 w-[480px] xl:w-[560px] overflow-hidden">
              <Image
                src={SMP_ABOUT_ASSETS.card.desktop.url}
                alt={SMP_ABOUT_ASSETS.card.desktop.alt}
                fill
                className="object-cover object-center"
                sizes="560px"
              />
            </div>

            {/* + Button */}
            <button
              onClick={() => setOpen(true)}
              aria-label="Learn more about Scalp Micropigmentation"
              className="absolute bottom-6 right-6 z-20 w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
            >
              <Plus className="w-5 h-5 text-[#121212]" />
            </button>

          </div>
        </div>
      </section>

      {/* ── Popup ── */}
      {open && (
        createPortal(
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
          onTouchMove={(e) => e.preventDefault()}
          style={{
            position: 'fixed', inset: 0, zIndex: 9999,
            background: 'rgba(10, 20, 60, 0.55)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 'max(16px, env(safe-area-inset-top)) 16px max(16px, env(safe-area-inset-bottom))',
          }}
        >
          {/* ── DESKTOP popup ── */}
          <div
            className="hidden md:flex"
            style={{
              background: '#F0F2F5', borderRadius: '20px',
              width: '100%', maxWidth: '1100px',
              maxHeight: 'calc(100vh - 48px)',
              overflow: 'hidden', position: 'relative', flexDirection: 'row',
            }}
          >
            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              style={{
                position: 'absolute', top: '16px', right: '16px',
                width: '36px', height: '36px', borderRadius: '50%',
                background: '#121212', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10,
              }}
            >
              <X style={{ width: '16px', height: '16px', color: '#fff' }} />
            </button>

            {/* Left: text */}
            <div style={{ flex: '1 1 0', overflowY: 'auto', padding: '44px 40px', display: 'flex', flexDirection: 'column' }}>
              <p style={{ fontSize: '13px', color: '#888', margin: '0 0 4px', fontWeight: 500 }}>About</p>
              <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#121212', margin: '0 0 14px', letterSpacing: '-0.4px', lineHeight: '1.2' }}>
                <span style={{ color: '#1769FF' }}>Scalp Micropigmentation</span>
              </h2>
              <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.7', margin: '0 0 28px' }}>
                Scalp micropigmentation creates the illusion of hair growth with <strong style={{ color: '#121212' }}>no side effects</strong> when done by <strong style={{ color: '#121212' }}>trained experts</strong> using the right ink. We use carbon-based inks designed for Indian skin, trained by <strong style={{ color: '#121212' }}>international academies</strong>.
              </p>

              <p style={{ fontSize: '15px', fontWeight: 700, color: '#121212', margin: '0 0 12px' }}>Pros:</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '24px' }}>
                {pros.map((p, i) => <PopupItem key={i} label={p} tone="positive" />)}
              </div>

              <p style={{ fontSize: '15px', fontWeight: 700, color: '#121212', margin: '0 0 12px' }}>Cons:</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {cons.map((c, i) => <PopupItem key={i} label={c} tone="negative" />)}
              </div>
            </div>

            {/* Right: designer overlay image */}
            <div style={{ width: '480px', flexShrink: 0, position: 'relative', overflow: 'hidden' }}>
              <Image
                src={SMP_ABOUT_ASSETS.overlay.desktop.url}
                alt={SMP_ABOUT_ASSETS.overlay.desktop.alt}
                fill
                style={{ objectFit: 'cover', objectPosition: 'center top' }}
                sizes="480px"
              />
            </div>
          </div>

          {/* ── MOBILE popup ── */}
          <div
            className="flex md:hidden"
            style={{
              background: '#F0F2F5', borderRadius: '16px',
              width: '100%',
              maxWidth: '420px',
              maxHeight: 'calc(100vh - 32px)',
              overflowY: 'auto',
              flexDirection: 'column', position: 'relative', flexShrink: 0,
            }}
            onTouchMove={(e) => e.stopPropagation()}
          >
            {/* Close — sticky */}
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              style={{
                position: 'sticky', top: '14px', alignSelf: 'flex-end',
                marginRight: '14px', marginTop: '14px',
                width: '32px', height: '32px', borderRadius: '50%',
                background: '#121212', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                zIndex: 10, flexShrink: 0,
              }}
            >
              <X style={{ width: '15px', height: '15px', color: '#fff' }} />
            </button>

            <div style={{ padding: '28px 20px 32px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#121212', margin: '0 0 10px', lineHeight: '1.3', letterSpacing: '-0.3px', paddingRight: '36px' }}>
                About <span style={{ color: '#1769FF' }}>Scalp Micropigmentation</span>
              </h2>
              <p style={{ fontSize: '13px', color: '#555', margin: '0 0 24px', lineHeight: '1.65' }}>
                Scalp micropigmentation creates the illusion of hair growth with <strong style={{ color: '#121212' }}>no side effects</strong> when done by <strong style={{ color: '#121212' }}>trained experts</strong> using the right ink. We use carbon-based inks designed for Indian skin, trained by <strong style={{ color: '#121212' }}>international academies</strong>.
              </p>

              <p style={{ fontSize: '14px', fontWeight: 700, color: '#121212', margin: '0 0 10px' }}>Pros:</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                {pros.map((p, i) => <PopupItem key={i} label={p} tone="positive" />)}
              </div>

              <p style={{ fontSize: '14px', fontWeight: 700, color: '#121212', margin: '0 0 10px' }}>Cons:</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {cons.map((c, i) => <PopupItem key={i} label={c} tone="negative" />)}
              </div>
            </div>
          </div>

        </div>
        ,
        document.body
        )
      )}
    </>
    </AnimateOnScroll>
  );
};
