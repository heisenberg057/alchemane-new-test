'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { AlchemaneBookingModal } from './AlchemaneBookingModal';

type AlchemaneBookingContextValue = {
  openBooking: () => void;
  closeBooking: () => void;
};

const AlchemaneBookingContext = createContext<AlchemaneBookingContextValue | null>(null);

export function useAlchemaneBooking() {
  const ctx = useContext(AlchemaneBookingContext);
  if (!ctx) {
    throw new Error('useAlchemaneBooking must be used within AlchemaneBookingProvider');
  }
  return ctx;
}

export function AlchemaneBookingProvider({
  children,
  thankYouHref,
}: {
  children: ReactNode;
  thankYouHref: string;
}) {
  const [open, setOpen] = useState(false);

  const openBooking = useCallback(() => setOpen(true), []);
  const closeBooking = useCallback(() => setOpen(false), []);

  const value = useMemo(() => ({ openBooking, closeBooking }), [openBooking, closeBooking]);

  return (
    <AlchemaneBookingContext.Provider value={value}>
      {children}
      <AlchemaneBookingModal open={open} onClose={closeBooking} thankYouHref={thankYouHref} />
    </AlchemaneBookingContext.Provider>
  );
}
