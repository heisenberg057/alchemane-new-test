'use client';

import type { RefObject } from 'react';
import { useAlchemaneBooking } from './AlchemaneBookingProvider';

export function AlchemaneCtaButton({
  children,
  className = 'cta',
  anchorRef,
}: {
  children: React.ReactNode;
  className?: string;
  anchorRef?: RefObject<HTMLAnchorElement>;
}) {
  const { openBooking } = useAlchemaneBooking();

  return (
    <a
      href="#consultation"
      className={className}
      ref={anchorRef}
      onClick={(event) => {
        event.preventDefault();
        openBooking();
      }}
    >
      {children}
    </a>
  );
}
