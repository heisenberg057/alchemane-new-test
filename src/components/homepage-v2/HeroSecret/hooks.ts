'use client';

import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react';

function reduced() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** Pointer tilt via CSS vars `--rx` / `--ry`. Skipped for coarse pointers and reduced motion. */
export function useTilt<T extends HTMLElement>(max = 5) {
  const ref = useRef<T>(null);
  const active = useRef(false);

  useEffect(() => {
    active.current =
      !reduced() && window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  }, []);

  const onMove = useCallback(
    (e: PointerEvent<T>) => {
      const el = ref.current;
      if (!el || !active.current) return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.setProperty('--ry', `${px * max * 2}deg`);
      el.style.setProperty('--rx', `${-py * max * 2}deg`);
    },
    [max]
  );

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  }, []);

  return { ref, onMove, onLeave };
}

/** Reveal once when the element enters the viewport (or immediately if reduced motion). */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) {
      setShown(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return { ref, shown };
}

/** Cards visible in MatchSlider. SSR + first paint always use 3; sync after mount. */
export function usePerView() {
  const [perView, setPerView] = useState(3);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 520px)');
    const sync = () => setPerView(mq.matches ? 2 : 3);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  return perView;
}

export function usePrefersReducedMotion() {
  const [prefers, setPrefers] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setPrefers(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return prefers;
}

export function useMediaQuery(query: string, initialMatches = false) {
  const [matches, setMatches] = useState(initialMatches);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

export { reduced };
