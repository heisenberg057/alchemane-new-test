'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';
import { getMediaUrl } from '@/lib/media/cdn';
import { AlchemaneCtaButton } from '@/components/alchemane/AlchemaneCtaButton';
import { EXTENSION_HERO } from './content';
import styles from './AlchemaneExtensionHero.module.css';

export function AlchemaneExtensionHero({
  mediaBase,
  heroCtaRef,
}: {
  mediaBase: string;
  heroCtaRef?: RefObject<HTMLAnchorElement>;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [paused, setPaused] = useState(false);
  const { badge, title, ctaLabel, ctaNote, video, trustTitle, trustBreak, trustItems } = EXTENSION_HERO;

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const sync = () => setPaused(el.paused);
    el.addEventListener('play', sync);
    el.addEventListener('pause', sync);
    if (prefersReducedMotion) {
      el.removeAttribute('autoplay');
      el.pause();
    }
    sync();

    let userPaused = false;
    let observer: IntersectionObserver | undefined;
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) el.pause();
          else if (!userPaused && !prefersReducedMotion) el.play().catch(() => {});
        },
        { threshold: 0.1 }
      );
      observer.observe(el);
    }
    const onToggle = () => { userPaused = el.paused; };
    const toggleBtn = el.closest(`.${styles.video}`)?.querySelector('[data-hero-toggle]');
    toggleBtn?.addEventListener('click', onToggle);

    return () => {
      el.removeEventListener('play', sync);
      el.removeEventListener('pause', sync);
      observer?.disconnect();
      toggleBtn?.removeEventListener('click', onToggle);
    };
  }, []);

  const handleToggle = () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) el.play().catch(() => {});
    else el.pause();
  };

  return (
    <section className={styles.root} id="top" aria-labelledby="alc-hero-title">
      <svg className={styles.strand} viewBox="0 0 1200 700" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path className={`${styles.strandPath} ${styles.strandTeal}`} pathLength={1} d="M-40 560C160 520 250 250 470 240S760 470 940 420 1120 160 1260 120" />
        <path className={`${styles.strandPath} ${styles.strandGold}`} pathLength={1} d="M-40 600C190 560 280 300 480 290S770 520 950 460 1130 200 1260 160" />
      </svg>

      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <p className={styles.badge}><span>{badge}</span></p>
          <h1 className={styles.title} id="alc-hero-title">{title}</h1>
          <div className={styles.action}>
            <AlchemaneCtaButton anchorRef={heroCtaRef}>{ctaLabel}</AlchemaneCtaButton>
            <p className="ctaNote">{ctaNote}</p>
          </div>
        </div>

        <div className={styles.media}>
          <figure className={styles.video}>
            <video
              ref={videoRef}
              src={getMediaUrl(`${mediaBase}/${video.src}`)}
              poster={getMediaUrl(`${mediaBase}/${video.poster}`)}
              width={video.width}
              height={video.height}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label={video.ariaLabel}
            />
            <button
              className={styles.videoToggle}
              type="button"
              data-hero-toggle
              aria-pressed={paused}
              aria-label={paused ? 'Play hero video' : 'Pause hero video'}
              onClick={handleToggle}
            >
              <svg className={styles.videoIcon} aria-hidden="true" style={{ display: paused ? 'none' : 'block' }}><use href="#alc-i-pause" /></svg>
              <svg className={styles.videoIcon} aria-hidden="true" style={{ display: paused ? 'block' : 'none' }}><use href="#alc-i-play" /></svg>
            </button>
            <figcaption className={styles.videoCaption}>Filmed in-studio</figcaption>
          </figure>
        </div>

        <div className={styles.trust}>
          <p className={styles.trustTitle}>{trustTitle} <span className={styles.trustBreak}>{trustBreak}</span></p>
          <ul className={styles.trustList}>
            {trustItems.map((item, index) => (
              <li key={index}>
                <img src={getMediaUrl(`${mediaBase}/${item.icon}`)} width={item.width} height={item.height} alt="" />
                <span>{item.label}{item.suffix ? <> <i>|</i> {item.suffix}</> : null}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <a className={styles.scroll} href="#who" aria-label="Scroll to next section">
        <svg aria-hidden="true"><use href="#alc-i-chev-down" /></svg>
      </a>
    </section>
  );
}
