'use client';

import { useEffect } from 'react';
import type { FunnelPageMeta } from '@/config/funnel-pages';
import { FunnelContactForm } from './FunnelContactForm';

export function FunnelBookingModal({
  open,
  onClose,
  meta,
}: {
  open: boolean;
  onClose: () => void;
  meta: FunnelPageMeta;
}) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-start justify-center overflow-y-auto bg-black/60 p-4 pt-8 md:items-center md:pt-4"
      role="dialog"
      aria-modal="true"
      aria-label="Contact us"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[440px] rounded-[12px] border border-[rgba(18,18,18,0.08)] bg-white p-[24px] shadow-[0px_12px_40px_rgba(0,0,0,0.18)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-[22px] leading-none text-[rgba(18,18,18,0.45)] hover:bg-[#f5f6f7] hover:text-[#121212]"
          aria-label="Close"
        >
          ×
        </button>

        <h2 className="text-center text-[22px] font-bold text-[#121212] mb-[20px] pr-6">
          Contact Us
        </h2>

        <FunnelContactForm meta={meta} />
      </div>
    </div>
  );
}
