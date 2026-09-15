'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './HairPatchAnimation.module.css';

const FRAME_COUNT = 12;
const FRAME_PATHS = Array.from(
  { length: FRAME_COUNT },
  (_, i) => `/models/hair-patch/frame-${String(i + 1).padStart(2, '0')}.png`
);

const FRAME_LABELS = [
  'FRONT VIEW',
  'FRONT TOP ANGLE',
  'TOP VIEW',
  'BACK TOP ANGLE',
  'BACK VIEW',
  'RIGHT ANGLE',
  'RIGHT SIDE',
  'RIGHT TOP ANGLE',
  'LEFT TOP ANGLE',
  'LEFT SIDE',
  'LEFT ANGLE',
  'FRONT VIEW',
];

const STATIC_FRAME = FRAME_PATHS[5];
const BALD_HEAD_SRC = '/images/bald-head.jpg';

/** Act boundaries as fractions of total pinned scroll */
const ACT1_END = 0.55;
const ACT2_END = 0.85;

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function isMobileViewport() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(max-width: 767px)').matches;
}

async function preloadFrames(paths: string[]): Promise<HTMLImageElement[]> {
  return Promise.all(
    paths.map(
      (src) =>
        new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new window.Image();
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error(`Failed to load ${src}`));
          img.src = src;
        })
    )
  );
}

export default function HairPatchAnimation() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const shimmerRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const bottomFillRef = useRef<HTMLDivElement>(null);
  const frameLabelRef = useRef<HTMLDivElement>(null);

  const framesRef = useRef<HTMLImageElement[]>([]);
  const mobileRef = useRef(false);
  const rafRef = useRef<number>(0);
  const scrollProgressRef = useRef(0);
  const lastLabelIndexRef = useRef(-1);
  const shimmerFiredRef = useRef(false);
  const revealActiveRef = useRef(false);
  const needsDrawRef = useRef(true);

  const [ready, setReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(prefersReducedMotion());
  }, []);

  /* ── Preload frames ─────────────────────────── */
  useEffect(() => {
    if (reducedMotion) return;
    let cancelled = false;

    preloadFrames(FRAME_PATHS)
      .then((images) => {
        if (cancelled) return;
        framesRef.current = images;
        needsDrawRef.current = true;
        setReady(true);
      })
      .catch((err) => {
        console.error('[HairPatchAnimation] preload failed', err);
        if (!cancelled) setReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, [reducedMotion]);

  /* ── Canvas crossfade renderer ───────────────── */
  const drawBlendedFrame = useCallback((spinProgress: number) => {
    const canvas = canvasRef.current;
    const frames = framesRef.current;
    if (!canvas || frames.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cssSize = mobileRef.current ? 300 : 500;
    const size = Math.round(cssSize * dpr);

    if (canvas.width !== size || canvas.height !== size) {
      canvas.width = size;
      canvas.height = size;
    }

    const exact = spinProgress * (FRAME_COUNT - 1);
    const currentFrame = Math.min(FRAME_COUNT - 1, Math.floor(exact));
    const nextFrame = Math.min(currentFrame + 1, FRAME_COUNT - 1);
    const blend = exact - currentFrame;

    const drawImageFit = (img: HTMLImageElement, alpha: number) => {
      if (alpha <= 0.01) return;
      ctx.globalAlpha = alpha;
      const scale = Math.min(size / img.width, size / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);
    };

    ctx.clearRect(0, 0, size, size);
    drawImageFit(frames[currentFrame], 1 - blend);
    if (nextFrame !== currentFrame) drawImageFit(frames[nextFrame], blend);
    ctx.globalAlpha = 1;

    // Frame label swap (only when index changes)
    const labelIndex = Math.round(exact);
    if (labelIndex !== lastLabelIndexRef.current && frameLabelRef.current) {
      lastLabelIndexRef.current = labelIndex;
      const el = frameLabelRef.current;
      el.style.opacity = '0';
      window.setTimeout(() => {
        el.textContent = FRAME_LABELS[labelIndex] ?? '';
        el.style.opacity = '1';
      }, 120);
    }
  }, []);

  /* ── GSAP ScrollTrigger + rAF loop ───────────── */
  useEffect(() => {
    if (reducedMotion || !ready) return;

    gsap.registerPlugin(ScrollTrigger);
    mobileRef.current = isMobileViewport();

    const section = sectionRef.current;
    const pin = pinRef.current;
    if (!section || !pin) return;

    // rAF render loop — draws only when scroll progress changed
    let lastDrawn = -1;
    const renderLoop = () => {
      const p = scrollProgressRef.current;
      if (needsDrawRef.current || p !== lastDrawn) {
        lastDrawn = p;
        needsDrawRef.current = false;
        const spinProgress = Math.min(1, p / ACT1_END);
        drawBlendedFrame(spinProgress);
      }
      rafRef.current = requestAnimationFrame(renderLoop);
    };
    rafRef.current = requestAnimationFrame(renderLoop);

    const st = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: '+=300%',
      pin,
      scrub: 0.3,
      anticipatePin: 1,
      onUpdate: (self) => {
        const p = self.progress;
        scrollProgressRef.current = p;
        const mobile = mobileRef.current;
        const spinProgress = Math.min(1, p / ACT1_END);

        // Progress bars
        if (progressFillRef.current) {
          progressFillRef.current.style.transform = `scaleX(${spinProgress})`;
        }
        if (bottomFillRef.current) {
          bottomFillRef.current.style.transform = `scaleX(${p})`;
        }

        // Scroll hint fades out by 20%
        if (hintRef.current) {
          hintRef.current.style.opacity = String(Math.max(0, 1 - p / 0.2));
        }

        const canvas = canvasRef.current;
        const head = headRef.current;
        const reveal = revealRef.current;

        // ── ACT 1: spin ──
        if (p <= ACT1_END) {
          if (canvas) {
            gsap.set(canvas, { y: 0, scale: 1, opacity: 1 });
          }
          if (head && !mobile) {
            gsap.set(head, { opacity: 0, y: 40 });
          }
          if (reveal) gsap.set(reveal, { opacity: 0 });
          shimmerFiredRef.current = false;
          if (shimmerRef.current) {
            shimmerRef.current.classList.remove(styles.shimmerActive);
          }
        }
        // ── ACT 2: landing (desktop) ──
        else if (p <= ACT2_END) {
          const t = (p - ACT1_END) / (ACT2_END - ACT1_END);

          if (mobile) {
            if (canvas) gsap.set(canvas, { y: 0, scale: 1, opacity: 1 });
            if (reveal) gsap.set(reveal, { opacity: 0 });
          } else {
            if (head) {
              const headIn = Math.min(1, t / 0.35);
              gsap.set(head, {
                opacity: headIn,
                y: gsap.utils.interpolate(40, 0, headIn),
              });
            }
            if (canvas) {
              // rise slightly, then descend and shrink onto the head
              let y: number;
              let scale: number;
              if (t < 0.35) {
                const u = t / 0.35;
                y = gsap.utils.interpolate(0, -60, u);
                scale = gsap.utils.interpolate(1, 0.85, u);
              } else {
                const u = (t - 0.35) / 0.65;
                y = gsap.utils.interpolate(-60, -30, u);
                scale = gsap.utils.interpolate(0.85, 0.65, u);
              }
              gsap.set(canvas, { y, scale, opacity: 1 });
            }
            if (reveal) gsap.set(reveal, { opacity: 0 });
          }
        }
        // ── ACT 3: reveal ──
        else {
          const t = (p - ACT2_END) / (1 - ACT2_END);

          // one-time shimmer at landing
          if (!mobile && !shimmerFiredRef.current && shimmerRef.current) {
            shimmerFiredRef.current = true;
            shimmerRef.current.classList.add(styles.shimmerActive);
          }

          if (!mobile) {
            if (canvas) gsap.set(canvas, { y: -30, scale: 0.65 });
            if (headRef.current) gsap.set(headRef.current, { opacity: 1, y: 0 });
          }
          if (reveal) {
            const opacity = Math.min(1, t * 1.5);
            gsap.set(reveal, { opacity });
            const shouldEnable = opacity > 0.25;
            if (shouldEnable !== revealActiveRef.current) {
              revealActiveRef.current = shouldEnable;
              reveal.style.pointerEvents = shouldEnable ? 'auto' : 'none';
            }
          }
        }
      },
    });

    const onResize = () => {
      mobileRef.current = isMobileViewport();
      needsDrawRef.current = true;
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(rafRef.current);
      st.kill();
    };
  }, [ready, reducedMotion, drawBlendedFrame]);

  /* ── Reduced-motion fallback ─────────────────── */
  if (reducedMotion) {
    return (
      <section className={styles.reduced} aria-label="Hair patch 3D view animation">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={STATIC_FRAME} alt="Hair system top view" className={styles.reducedImage} />
        <h2 className={styles.revealHeadline}>This is what we do for 6,000+ men</h2>
        <p className={styles.revealSub}>Non-surgical. Natural. Permanent-looking.</p>
        <a href="#contact-form" className={styles.cta}>
          Book a Free Consultation
        </a>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className={styles.section}>
      <div ref={pinRef} className={styles.pin}>
        {!ready && (
          <div className={styles.loader} aria-hidden="true">
            <div className={styles.spinner} />
          </div>
        )}

        <div className={styles.inner}>
          {/* LEFT — copy */}
          <div className={styles.left}>
            <p className={styles.label}>The Hair System</p>
            <h2 className={styles.heading}>
              Engineered to look exactly like your own hair
            </h2>
            <p className={styles.paragraph}>
              Every strand, every texture, every hairline — custom-matched to you.
              Scroll to explore the system that has transformed 6,000+ men.
            </p>
            <div ref={hintRef} className={styles.scrollHint}>
              <span className={styles.arrow} aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M12 4v16m0 0l-6-6m6 6l6-6"
                    stroke="#999999"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span>Scroll to explore</span>
            </div>
          </div>

          {/* RIGHT — canvas animation */}
          <div className={styles.right}>
            <div
              className={styles.stage}
              aria-label="Hair patch 3D view animation"
              role="img"
            >
              <div ref={headRef} className={styles.headLayer} aria-hidden="true">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={BALD_HEAD_SRC} alt="" className={styles.headImage} draggable={false} />
              </div>

              <canvas ref={canvasRef} className={styles.canvas} />

              <div ref={shimmerRef} className={styles.shimmer} aria-hidden="true" />
            </div>

            <div className={styles.progressTrack} aria-hidden="true">
              <div ref={progressFillRef} className={styles.progressFill} />
            </div>

            <div ref={frameLabelRef} className={styles.frameLabel} aria-live="polite">
              {FRAME_LABELS[0]}
            </div>
          </div>
        </div>

        {/* ACT 3 reveal overlay */}
        <div ref={revealRef} className={styles.reveal}>
          <h2 className={styles.revealHeadline}>This is what we do for 6,000+ men</h2>
          <p className={styles.revealSub}>Non-surgical. Natural. Permanent-looking.</p>
          <a href="#contact-form" className={styles.cta}>
            Book a Free Consultation
          </a>
        </div>

        {/* Bottom viewport progress line */}
        <div className={styles.bottomBar} aria-hidden="true">
          <div ref={bottomFillRef} className={styles.bottomBarFill} />
        </div>
      </div>
    </section>
  );
}
