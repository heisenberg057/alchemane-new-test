'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Mobile-only sticky booking tray: hidden while the hero CTA, the offer
 * section, or the footer is on screen, shown otherwise.
 */
export function useStickyCtaVisibility() {
  const heroCtaRef = useRef<HTMLAnchorElement>(null);
  const offerRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const trayQuery = window.matchMedia('(max-width: 1023px)');
    const state = { heroCtaVisible: true, offerVisible: false, footerVisible: false };

    const apply = () => {
      const show = trayQuery.matches && !state.heroCtaVisible && !state.offerVisible && !state.footerVisible;
      setHidden(!show);
    };

    const observers: IntersectionObserver[] = [];

    if (heroCtaRef.current) {
      const obs = new IntersectionObserver(
        ([entry]) => {
          state.heroCtaVisible = entry.isIntersecting;
          apply();
        },
        { threshold: 0.5 }
      );
      obs.observe(heroCtaRef.current);
      observers.push(obs);
    }
    if (offerRef.current) {
      const obs = new IntersectionObserver(
        ([entry]) => {
          state.offerVisible = entry.isIntersecting;
          apply();
        },
        { threshold: 0.25 }
      );
      obs.observe(offerRef.current);
      observers.push(obs);
    }
    if (footerRef.current) {
      const obs = new IntersectionObserver(
        ([entry]) => {
          state.footerVisible = entry.isIntersecting;
          apply();
        },
        { threshold: 0 }
      );
      obs.observe(footerRef.current);
      observers.push(obs);
    }

    trayQuery.addEventListener('change', apply);
    apply();

    return () => {
      observers.forEach((obs) => obs.disconnect());
      trayQuery.removeEventListener('change', apply);
    };
  }, []);

  return { heroCtaRef, offerRef, footerRef, hidden };
}
