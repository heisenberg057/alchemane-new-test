'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type UseSnapCarouselOptions = {
  itemSelector: string;
  itemCount: number;
};

function getClampedPositions(container: HTMLDivElement, itemSelector: string) {
  const maxScroll = Math.max(container.scrollWidth - container.clientWidth, 0);
  return Array.from(container.querySelectorAll<HTMLElement>(itemSelector)).map((item) =>
    Math.min(item.offsetLeft, maxScroll),
  );
}

export function useSnapCarousel({
  itemSelector,
  itemCount,
}: UseSnapCarouselOptions) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const positionsRef = useRef<number[]>([]);
  const frameRef = useRef<number | null>(null);
  const pendingIndexRef = useRef<number | null>(null);
  const pendingLeftRef = useRef<number | null>(null);

  const syncState = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;

    const positions = getClampedPositions(container, itemSelector);
    positionsRef.current = positions;

    if (!positions.length) {
      setActiveIndex(0);
      return;
    }

    const currentScroll = container.scrollLeft;

    if (pendingIndexRef.current !== null && pendingLeftRef.current !== null) {
      const distanceToPending = Math.abs(pendingLeftRef.current - currentScroll);

      // Keep button state stable during programmatic smooth scrolling so
      // the index does not flicker back to the previous slide mid-animation.
      if (distanceToPending > 2) {
        return;
      }

      const settledIndex = pendingIndexRef.current;
      pendingIndexRef.current = null;
      pendingLeftRef.current = null;
      setActiveIndex(Math.min(Math.max(settledIndex, 0), Math.max(itemCount - 1, 0)));
      return;
    }

    let nextIndex = 0;
    let smallestDistance = Number.POSITIVE_INFINITY;

    positions.forEach((position, index) => {
      const distance = Math.abs(position - currentScroll);
      if (distance < smallestDistance) {
        smallestDistance = distance;
        nextIndex = index;
      }
    });

    setActiveIndex(Math.min(Math.max(nextIndex, 0), Math.max(itemCount - 1, 0)));
  }, [itemCount, itemSelector]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
      frameRef.current = requestAnimationFrame(syncState);
    };

    syncState();

    const resizeObserver = new ResizeObserver(syncState);
    resizeObserver.observe(container);
    container.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', syncState);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
      resizeObserver.disconnect();
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', syncState);
    };
  }, [syncState]);

  const scrollToIndex = useCallback(
    (index: number) => {
      const container = scrollRef.current;
      if (!container) return;

      const positions = positionsRef.current.length
        ? positionsRef.current
        : getClampedPositions(container, itemSelector);
      positionsRef.current = positions;

      const clampedIndex = Math.min(Math.max(index, 0), Math.max(itemCount - 1, 0));
      const nextLeft = positions[clampedIndex] ?? 0;

      pendingIndexRef.current = clampedIndex;
      pendingLeftRef.current = nextLeft;
      setActiveIndex(clampedIndex);
      container.scrollTo({
        left: nextLeft,
        behavior: 'smooth',
      });
    },
    [itemCount, itemSelector],
  );

  const scrollPrev = useCallback(() => {
    scrollToIndex(activeIndex - 1);
  }, [activeIndex, scrollToIndex]);

  const scrollNext = useCallback(() => {
    scrollToIndex(activeIndex + 1);
  }, [activeIndex, scrollToIndex]);

  return {
    scrollRef,
    activeIndex,
    canPrev: activeIndex > 0,
    canNext: activeIndex < itemCount - 1,
    scrollPrev,
    scrollNext,
    scrollToIndex,
  };
}
