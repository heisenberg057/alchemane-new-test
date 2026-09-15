'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type UseBangaloreCarouselOptions = {
  /** Designer fit/why carousels start on the second slide. */
  initialIndex?: number;
  itemCount: number;
};

export function useBangaloreCarousel({
  initialIndex = 0,
  itemCount,
}: UseBangaloreCarouselOptions) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const getStep = useCallback(() => {
    const track = trackRef.current;
    const item = track?.firstElementChild as HTMLElement | null;
    if (!track || !item) return 0;
    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
    return item.getBoundingClientRect().width + gap;
  }, []);

  const syncFromScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const step = getStep();
    if (!step) return;

    const maximum = Math.max(0, track.scrollWidth - track.clientWidth);
    const index = Math.min(
      itemCount - 1,
      Math.max(0, Math.round(track.scrollLeft / step))
    );

    setActiveIndex(index);
    setCanPrev(track.scrollLeft > 3);
    setCanNext(track.scrollLeft < maximum - 3);
  }, [getStep, itemCount]);

  const scrollToIndex = useCallback(
    (index: number) => {
      const track = trackRef.current;
      const step = getStep();
      if (!track || !step) return;
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      track.scrollTo({
        left: Math.max(0, Math.min(itemCount - 1, index) * step),
        behavior: reducedMotion ? 'auto' : 'smooth',
      });
    },
    [getStep, itemCount]
  );

  const move = useCallback(
    (direction: -1 | 1) => {
      const track = trackRef.current;
      const step = getStep();
      if (!track || !step) return;
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      track.scrollBy({
        left: direction * step,
        behavior: reducedMotion ? 'auto' : 'smooth',
      });
    },
    [getStep]
  );

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const applyInitial = () => {
      const step = getStep();
      if (initialIndex > 0 && step) {
        track.scrollLeft = initialIndex * step;
      }
      syncFromScroll();
    };

    const raf = requestAnimationFrame(applyInitial);

    const onScroll = () => syncFromScroll();
    track.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', syncFromScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      track.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', syncFromScroll);
    };
  }, [getStep, initialIndex, syncFromScroll]);

  return {
    trackRef,
    activeIndex,
    canPrev,
    canNext,
    movePrev: () => move(-1),
    moveNext: () => move(1),
    goTo: scrollToIndex,
  };
}
