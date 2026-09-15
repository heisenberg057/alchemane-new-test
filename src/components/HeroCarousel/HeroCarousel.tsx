'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import styles from './HeroCarousel.module.css';
import { HERO_CAROUSEL_SLIDES } from './slides';

const SLIDES = Array.from({ length: 3 }, (_, setIndex) =>
  HERO_CAROUSEL_SLIDES.map((slide, slideIndex) => ({
    ...slide,
    originalIndex: slideIndex,
    uniqueId: `${slide.id}-${setIndex}`,
  })),
).flat();

export const HeroCarousel = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number>(0);
  const previousTimeRef = useRef<number>(0);

  // State refs (using refs to avoid re-renders during animation loop)
  const isDraggingRef = useRef(false);
  const isPausedRef = useRef(false);
  const startXRef = useRef(0);
  const currentTranslateRef = useRef(0);
  const prevTranslateRef = useRef(0);
  const velocityRef = useRef(0);
  const lastMoveTimeRef = useRef(0);
  const lastMoveXRef = useRef(0);

  // Constants
  // Card width 368px + Gap 23px = 391px per item (Desktop)
  // Mobile: 280px + 16px gap = 296px
  const [itemWidth, setItemWidth] = useState(391);
  
  useEffect(() => {
    const updateWidth = () => {
      setItemWidth(window.innerWidth < 768 ? 296 : 391);
    };
    
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const TOTAL_SET_WIDTH = itemWidth * HERO_CAROUSEL_SLIDES.length;
  const AUTOPLAY_SPEED = 0.8; // Pixels per frame (approx 60fps)
  const FRICTION = 0.95;

  const animate = useCallback((time: number) => {
    if (!previousTimeRef.current) previousTimeRef.current = time;
    const deltaTime = time - previousTimeRef.current;
    previousTimeRef.current = time;

    // Normalize speed for frame rate variations (target 60fps ~ 16.67ms)
    const timeScale = deltaTime / 16.67;

    if (!isDraggingRef.current) {
      // Autoplay logic
      if (!isPausedRef.current) {
        currentTranslateRef.current -= AUTOPLAY_SPEED * timeScale;
      }

      // Momentum logic (continues even if paused, but decays)
      if (Math.abs(velocityRef.current) > 0.1) {
        currentTranslateRef.current += velocityRef.current * timeScale;
        velocityRef.current *= FRICTION; // Decay velocity
      } else {
        velocityRef.current = 0;
      }
    }

    // Infinite Loop / Wrap Around Logic
    // If scrolled left past the first set (-TOTAL_SET_WIDTH), add width to reset
    if (currentTranslateRef.current <= -TOTAL_SET_WIDTH) {
      currentTranslateRef.current += TOTAL_SET_WIDTH;
    }
    // If scrolled right past 0 (e.g. dragging right), subtract width to reset
    else if (currentTranslateRef.current > 0) {
      currentTranslateRef.current -= TOTAL_SET_WIDTH;
    }

    // Apply transform
    if (stripRef.current) {
      stripRef.current.style.transform = `translate3d(${currentTranslateRef.current}px, 0, 0)`;
    }

    requestRef.current = requestAnimationFrame(animate);
  }, [TOTAL_SET_WIDTH]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [animate]);

  // Event Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    isPausedRef.current = true; // Pause autoplay on interaction
    startXRef.current = e.clientX;
    prevTranslateRef.current = currentTranslateRef.current;
    velocityRef.current = 0;
    lastMoveXRef.current = e.clientX;
    lastMoveTimeRef.current = performance.now();
    
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    
    if (stripRef.current) {
      stripRef.current.style.cursor = 'grabbing';
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    
    // Calculate delta
    const currentX = e.clientX;
    const diff = currentX - startXRef.current;
    currentTranslateRef.current = prevTranslateRef.current + diff;

    // Calculate instantaneous velocity for momentum
    const now = performance.now();
    const dt = now - lastMoveTimeRef.current;
    if (dt > 0) {
      const dx = currentX - lastMoveXRef.current;
      // Velocity in px/frame (approx)
      velocityRef.current = dx; 
      lastMoveTimeRef.current = now;
      lastMoveXRef.current = currentX;
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    isDraggingRef.current = false;
    // We do NOT immediately resume autoplay here; 
    // we let momentum play out, then mouseLeave will resume it fully if needed.
    // Or simpler: strictly follow spec "On mouseleave: RESUME".
    // So if pointer up happens inside, we are still paused (hovering).
    
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    
    if (stripRef.current) {
      stripRef.current.style.cursor = 'grab';
    }
  };

  const handleMouseEnter = () => {
    isPausedRef.current = true;
  };

  const handleMouseLeave = () => {
    isPausedRef.current = false;
    isDraggingRef.current = false; // Safety
  };

  return (
    <div 
      className={`w-full overflow-hidden bg-[#ffffff] pt-8 pb-12 ${styles.carouselContainer}`}
      role="region" 
      aria-label="Customer testimonials"
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        ref={stripRef}
        className={`${styles.carouselStrip} cursor-grab active:cursor-grabbing pl-4 md:pl-0`} // Start from left on mobile with padding
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{ touchAction: 'pan-y' }}
      >
        {SLIDES.map((slide) => (
          <div 
            key={slide.uniqueId}
            className="relative flex-shrink-0 w-[280px] md:w-[368px] h-[380px] md:h-[460px] rounded-xl overflow-hidden select-none bg-[#181e25]"
            role="group" 
            aria-label={slide.imageAlt}
          >
            <div className="absolute inset-0 w-full h-full z-0">
              <Image
                src={slide.mobileImageSrc}
                alt={slide.imageAlt}
                fill
                sizes="(max-width: 767px) 280px, 0px"
                className="object-cover object-top md:hidden"
                draggable={false}
                priority={slide.originalIndex === 0}
              />
              <Image
                src={slide.desktopImageSrc}
                alt=""
                fill
                sizes="(min-width: 768px) 368px, 0px"
                className="hidden object-cover object-top md:block"
                draggable={false}
                fetchPriority={slide.originalIndex === 0 ? 'high' : 'low'}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
