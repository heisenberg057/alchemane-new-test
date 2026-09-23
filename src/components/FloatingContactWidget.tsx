'use client';

import Link from 'next/link';
import { Phone, MessageCircleMore } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useTracking } from '@/providers/TrackingProvider';

const PHONE_NUMBER = '+919222666111';
const WHATSAPP_URL = 'https://api.whatsapp.com/send/?phone=917208329070';

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8 fill-current" aria-hidden="true">
      <path d="M19.05 4.94A9.9 9.9 0 0 0 12.03 2C6.54 2 2.07 6.46 2.07 11.95c0 1.75.46 3.46 1.32 4.97L2 22l5.22-1.36a9.92 9.92 0 0 0 4.79 1.22h.01c5.49 0 9.95-4.46 9.95-9.95a9.88 9.88 0 0 0-2.92-6.97ZM12.02 20.2h-.01a8.24 8.24 0 0 1-4.19-1.14l-.3-.18-3.1.81.83-3.02-.2-.31a8.23 8.23 0 0 1-1.27-4.41c0-4.56 3.7-8.27 8.26-8.27 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.84c0 4.56-3.71 8.26-8.25 8.26Zm4.54-6.18c-.25-.13-1.47-.72-1.7-.8-.23-.08-.39-.13-.56.13-.17.25-.64.8-.79.96-.14.17-.29.19-.54.07-.25-.13-1.07-.39-2.04-1.24-.75-.68-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.52.11-.11.25-.29.37-.43.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.76-1.85-.2-.48-.41-.42-.56-.42h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.09s.9 2.42 1.03 2.59c.13.17 1.76 2.68 4.26 3.75.59.26 1.05.41 1.41.53.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.59.21-1.09.15-1.19-.06-.1-.22-.16-.47-.29Z" />
    </svg>
  );
}

function FloatingButton({
  href,
  label,
  bgClass,
  onClick,
  children,
}: {
  href: string;
  label: string;
  bgClass: string;
  onClick: () => Promise<void>;
  children: React.ReactNode;
}) {
  const commonClass =
    'flex h-14 w-14 items-center justify-center rounded-full text-white shadow-[0_18px_40px_rgba(15,23,42,0.18)] transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent';

  const isExternal = href.startsWith('http');

  if (isExternal) {
    return (
      <a
        href={href}
        aria-label={label}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => {
          void onClick();
        }}
        className={`${commonClass} ${bgClass}`}
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      aria-label={label}
      onClick={() => {
        void onClick();
      }}
      className={`${commonClass} ${bgClass}`}
    >
      {children}
    </Link>
  );
}

export function FloatingContactWidget() {
  const pathname = usePathname();
  const { trackConversion } = useTracking();

  if (
    !pathname ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/lp') ||
    pathname.startsWith('/alchemane') ||
    pathname.startsWith('/permanent-extensions') ||
    pathname.startsWith('/toppers') ||
    pathname.startsWith('/wigs')
  ) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-4 z-[80] flex flex-col items-center gap-3 md:bottom-8 md:right-6">
      <FloatingButton
        href={`tel:${PHONE_NUMBER.replace(/[^\d+]/g, '')}`}
        label="Call American Hairline"
        bgClass="bg-[#2789eb]"
        onClick={async () => {
          await trackConversion('phone_click', 50, {
            location: 'floating_contact_widget',
            channel: 'phone',
            phone: PHONE_NUMBER,
          });
          if (typeof window !== 'undefined') {
            (window as any).dataLayer?.push({
              event: 'phone_click',
              location: 'floating_contact_widget',
              phone_number: PHONE_NUMBER,
            });
          }
        }}
      >
        <Phone className="h-6 w-6 fill-current" />
      </FloatingButton>

      <FloatingButton
        href={WHATSAPP_URL}
        label="Chat on WhatsApp"
        bgClass="bg-[#25D366]"
        onClick={async () => {
          await trackConversion('whatsapp_click', 50, {
            location: 'floating_contact_widget',
            channel: 'whatsapp',
            destination: WHATSAPP_URL,
          });
          if (typeof window !== 'undefined') {
            (window as any).dataLayer?.push({
              event: 'whatsapp_click',
              location: 'floating_contact_widget',
              destination: WHATSAPP_URL,
            });
          }
        }}
      >
        <WhatsAppIcon />
      </FloatingButton>
    </div>
  );
}
