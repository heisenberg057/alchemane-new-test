'use client';

import { useEffect, useRef } from 'react';

export type AnimateVariant = 'fadeUp' | 'fadeIn' | 'fadeLeft' | 'fadeRight';

interface AnimateOnScrollProps {
  children: React.ReactNode;
  variant?: AnimateVariant;
  delay?: 0 | 100 | 200 | 300 | 400;
  className?: string;
}

const delayClass: Record<number, string> = {
  0:   '',
  100: 'aos-delay-100',
  200: 'aos-delay-200',
  300: 'aos-delay-300',
  400: 'aos-delay-400',
};

export function AnimateOnScroll({
  children,
  variant = 'fadeUp',
  delay = 0,
  className = '',
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect reduced-motion preference — skip animation entirely
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('aos-visible');
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('aos-visible');
          observer.disconnect(); // trigger once only
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const dc = delayClass[delay] ?? '';

  return (
    <div
      ref={ref}
      className={`aos-init aos-${variant} ${dc} ${className}`.trim()}
    >
      {children}
    </div>
  );
}
