'use client';

import { useEffect, useRef } from 'react';
import { useFunnelBooking } from './FunnelBookingProvider';
import type { FunnelSectionPayload } from '@/lib/funnel/loadFunnelSections';
import { resolveFunnelSectionKey } from '@/lib/funnel/sectionKeys';

const BOOK_KEYWORDS = /book\s*now|book\s*consultation|triggerBookingPopup|1:1\s*consultation/i;

const NON_BOOKING_CONTROL_SELECTOR =
  '.funnel-location__arrow, .location-arrow-left, .location-arrow-right, .location-arrow-left-main, .location-arrow-right-main, .funnel-faq__tab, #tab-consultation, #tab-system, .location-carousel-dot, .location-dot-main, [data-funnel-no-booking]';

function isNonBookingControl(el: HTMLElement): boolean {
  return Boolean(el.closest(NON_BOOKING_CONTROL_SELECTOR));
}

function isBookingAnchor(anchor: HTMLAnchorElement): boolean {
  if (isNonBookingControl(anchor)) return false;
  const href = anchor.getAttribute('href') ?? '';
  const text = anchor.textContent ?? '';
  return (
    href === '#' ||
    href === '' ||
    BOOK_KEYWORDS.test(text) ||
    BOOK_KEYWORDS.test(anchor.getAttribute('aria-label') ?? '')
  );
}

function isBookingButton(button: HTMLButtonElement): boolean {
  if (isNonBookingControl(button)) return false;

  const text = button.textContent ?? '';
  return (
    button.classList.contains('expert-btn') ||
    BOOK_KEYWORDS.test(text) ||
    BOOK_KEYWORDS.test(button.getAttribute('aria-label') ?? '')
  );
}

export function FunnelHtmlSection({
  html,
  section,
}: {
  html: string;
  section: FunnelSectionPayload;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { openBooking } = useFunnelBooking();

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      if (isNonBookingControl(target)) return;

      const anchor = target.closest('a');
      if (anchor) {
        if (isBookingAnchor(anchor)) {
          e.preventDefault();
          openBooking();
        }
        return;
      }

      const button = target.closest('button');
      if (button && isBookingButton(button)) {
        e.preventDefault();
        openBooking();
      }
    };

    root.addEventListener('click', onClick);
    return () => root.removeEventListener('click', onClick);
  }, [openBooking]);

  if (!html.trim()) return null;

  return (
    <div
      ref={ref}
      id={`funnel-section-${section.id}`}
      data-funnel-owner={section.ownerSlug}
      data-funnel-source={section.sourceSlug}
      data-funnel-section={resolveFunnelSectionKey(section.sectionKey)}
      data-funnel-section-key={section.sectionKey}
      data-funnel-fallback={section.fromFallback ? 'true' : 'false'}
      data-funnel-shared={section.fromShared ? 'true' : 'false'}
      className="funnel-html-section w-full [&_img]:max-w-full [&_a]:cursor-pointer"
    >
      <div className="funnel-section-inner" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
