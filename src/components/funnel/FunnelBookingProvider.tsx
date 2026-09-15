'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { FunnelPageMeta } from '@/config/funnel-pages';
import { FunnelBookingModal } from './FunnelBookingModal';

type FunnelBookingContextValue = {
  openBooking: () => void;
  closeBooking: () => void;
};

const FunnelBookingContext = createContext<FunnelBookingContextValue | null>(null);

export function useFunnelBooking() {
  const ctx = useContext(FunnelBookingContext);
  if (!ctx) {
    throw new Error('useFunnelBooking must be used within FunnelBookingProvider');
  }
  return ctx;
}

export function FunnelBookingProvider({
  meta,
  children,
}: {
  meta: FunnelPageMeta;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const openBooking = useCallback(() => setOpen(true), []);
  const closeBooking = useCallback(() => setOpen(false), []);

  const value = useMemo(() => ({ openBooking, closeBooking }), [openBooking, closeBooking]);

  return (
    <FunnelBookingContext.Provider value={value}>
      {children}
      <FunnelBookingModal open={open} onClose={closeBooking} meta={meta} />
    </FunnelBookingContext.Provider>
  );
}
