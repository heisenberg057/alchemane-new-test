'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { CLIP_ON_LIFESPAN_BASE_ASSETS } from '@/components/legacy/clipOnLifespanBaseOptionsAssets';

interface ClipOnDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'thin' | 'thick';
}

export const ClipOnDetailsModal = ({ isOpen, onClose, type }: ClipOnDetailsModalProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!mounted || !isOpen) return null;

  const content = {
    thin: {
      title: <>Clip-On Hair System with <span className="text-[#1769FF]">Thin Base and Low Density</span></>,
      description: "This means the base is very thin, and the hair density is low. Here's what it gives you:",
      features: [
        { title: 'Lightweight & Natural Look',   desc: 'Blends easily and feels more natural with everyday use.' },
        { title: 'Gradual Thinning',             desc: 'Hair reduces slowly over time, keeping it realistic.' },
        { title: 'Perfect for Daily Wear',       desc: 'Flexible for styling and comfortable for regular use.' },
      ],
      footer: <>It's designed to provide <span className="text-[#121212]">lasting results for 3–4 months.</span></>,
    },
    thick: {
      title: <>Clip-On Hair System with <span className="text-[#1769FF]">Thick Base and High Density</span></>,
      description: "This means the base is thicker, and the hair density is high. Here's what it gives you:",
      features: [
        { title: 'Maximum Volume',       desc: 'Packed with more hair per square inch for a naturally fuller look.' },
        { title: 'Long-Lasting Fullness',desc: 'Stays dense and thick for a much longer period of time.' },
        { title: 'Durable with Care',    desc: 'With basic cleaning and regular care, it can last for 6–8 months.' },
      ],
      footer: <>It's slightly heavier, but <span className="text-[#121212]">designed to last 6–8 months with proper care.</span></>,
    },
  };

  const c = content[type];
  const assets = CLIP_ON_LIFESPAN_BASE_ASSETS[type];

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* ── DESKTOP modal ── */}
      <div className="hidden md:flex relative w-full bg-[#F2F3F5] rounded-[20px] overflow-hidden shadow-2xl"
        style={{ width: 'min(1340px, calc(100vw - 64px))', height: 'min(741px, calc(100vh - 64px))', flexDirection: 'row' }}
      >
        {/* Close */}
        <button onClick={onClose}
          style={{ position: 'absolute', top: 20, right: 20, width: 40, height: 40, borderRadius: '50%', background: '#121212', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Left: text — 40% */}
        <div style={{ width: '42%', minWidth: 300, flexShrink: 0, padding: '64px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 24 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#121212', margin: 0, lineHeight: 1.25, letterSpacing: '-0.4px' }}>{c.title}</h2>
          <p style={{ fontSize: 15, color: '#555', lineHeight: 1.65, margin: 0 }}>{c.description}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {c.features.map((f, i) => (
              <div key={i} className="bg-white rounded-[12px] p-[16px] border border-[#12121214] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.04)] flex items-start gap-3">
                <div className="w-5 h-5 flex-shrink-0 rounded-[4px] bg-[#1769FF] flex items-center justify-center mt-0.5">
                  <svg width="10" height="8" viewBox="0 0 12 10" fill="none"><path d="M1 5L4.5 8.5L11 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 700, color: '#121212', margin: '0 0 2px' }}>{f.title}</p>
                  <p style={{ fontSize: 14, color: '#555', margin: 0, lineHeight: 1.55 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 16, fontWeight: 700, color: 'rgba(18,18,18,0.5)', margin: 0, lineHeight: 1.4 }}>{c.footer}</p>
        </div>

        {/* Right: image — 645×645 */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <Image
            src={assets.modal.desktop.url}
            alt={assets.modal.desktop.alt}
            fill
            style={{ objectFit: 'contain', objectPosition: 'center center' }}
            sizes="645px"
          />
        </div>
      </div>

      {/* ── MOBILE modal ── */}
      <div className="flex md:hidden relative flex-col bg-white rounded-[20px] overflow-hidden shadow-2xl"
        style={{ width: 'calc(100vw - 32px)', height: 'calc(100vh - 48px)' }}
      >
        {/* Close */}
        <button onClick={onClose}
          style={{ position: 'absolute', top: 16, right: 16, width: 36, height: 36, borderRadius: '50%', background: '#121212', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10 }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Text — top */}
        <div style={{ padding: '28px 20px 16px', paddingRight: 52, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#121212', margin: 0, lineHeight: 1.3, letterSpacing: '-0.3px' }}>{c.title}</h2>
          <p style={{ fontSize: 14, color: '#555', lineHeight: 1.6, margin: 0 }}>{c.description}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {c.features.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <div style={{ width: 16, height: 16, flexShrink: 0, borderRadius: 3, background: '#1769FF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 2 }}>
                  <svg width="8" height="6" viewBox="0 0 12 10" fill="none"><path d="M1 5L4.5 8.5L11 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <p style={{ fontSize: 13, color: '#444', margin: 0, lineHeight: 1.5 }}><b style={{ color: '#121212' }}>{f.title}</b> — {f.desc}</p>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 14, fontWeight: 700, color: 'rgba(18,18,18,0.6)', margin: 0, lineHeight: 1.5 }}>{c.footer}</p>
        </div>

        {/* Image — fills remaining space */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <Image
            src={assets.modal.mobile.url}
            alt={assets.modal.mobile.alt}
            fill
            style={{ objectFit: 'contain', objectPosition: 'center bottom' }}
            sizes="calc(100vw - 32px)"
          />
        </div>
      </div>
    </div>,
    document.body,
  );
};
