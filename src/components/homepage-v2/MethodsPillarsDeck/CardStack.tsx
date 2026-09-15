'use client';

import * as React from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { MediaImage } from '@/components/media/MediaImage';

/**
 * CardStack — a fanned, index-driven card deck.
 *
 * Ported from the supplied Next/Tailwind/shadcn component to this project's
 * stack, which is Vite + plain CSS and imports from `motion/react`. The
 * geometry, the props and the behaviour are the original's; what changed is
 * only how it is expressed:
 *
 * - `next/link` became a plain `<a>`; there is no router here.
 * - Every Tailwind utility became a class in the `.cstack` block of
 *   `global.css`. Adding Tailwind now would bring its preflight reset and
 *   restyle everything already built.
 * - `framer-motion` became `motion/react`; the former is on disk only as a
 *   transitive dependency.
 * - `cn()` is gone — with plain CSS the class lists are short enough to join
 *   inline.
 *
 * Added for this codebase: `variant="bare"`, which drops the card chrome. Our
 * cards are finished artwork with their own rounded corners on transparency,
 * and a bordered box would draw the rectangle the picture is not.
 */

export type CardStackItem = {
  id: string | number
  title: string
  description?: string
  imageSrc?: string
  href?: string
  ctaLabel?: string
  tag?: string
}

export type CardStackProps<T extends CardStackItem> = {
  items: T[]

  /** Selected index on mount */
  initialIndex?: number

  /** How many cards are visible around the active (odd recommended) */
  maxVisible?: number

  /** Card sizing */
  cardWidth?: number
  cardHeight?: number

  /** How much cards overlap each other (0..0.8). Higher = more overlap */
  overlap?: number

  /** Total fan angle (deg). Higher = wider arc */
  spreadDeg?: number

  /**
   * How far open the hand is, 0..1. 1 is the full `spreadDeg`/`overlap`
   * geometry; 0 collapses the cards onto each other. Added for this codebase
   * so scroll can open the fan while the component keeps owning which card is
   * active — the spread and the selection are separate things.
   */
  openness?: number

  /** 3D / depth feel */
  perspectivePx?: number
  depthPx?: number
  tiltXDeg?: number

  /** Active emphasis */
  activeLiftPx?: number
  activeScale?: number
  inactiveScale?: number

  /** Motion */
  springStiffness?: number
  springDamping?: number

  /** Behavior */
  loop?: boolean
  autoAdvance?: boolean
  intervalMs?: number
  pauseOnHover?: boolean

  /** UI */
  showDots?: boolean
  className?: string
  /** `framed` keeps the border, radius and shadow; `bare` leaves the card to
   *  whatever `renderCard` draws. */
  variant?: 'framed' | 'bare'

  /** Hooks */
  onChangeIndex?: (index: number, item: T) => void

  /** Custom renderer (optional) */
  renderCard?: (item: T, state: { active: boolean }) => React.ReactNode
}

function wrapIndex(n: number, len: number) {
  if (len <= 0) return 0
  return ((n % len) + len) % len
}

/** Minimal signed offset from active index to i, with wrapping (for loop behavior). */
function signedOffset(i: number, active: number, len: number, loop: boolean) {
  const raw = i - active
  if (!loop || len <= 1) return raw

  // consider wrapped alternative
  const alt = raw > 0 ? raw - len : raw + len
  return Math.abs(alt) < Math.abs(raw) ? alt : raw
}

export function CardStack<T extends CardStackItem>({
  items,
  initialIndex = 0,
  maxVisible = 7,

  cardWidth = 520,
  cardHeight = 320,

  overlap = 0.48,
  spreadDeg = 48,
  openness = 1,

  perspectivePx = 1100,
  depthPx = 140,
  tiltXDeg = 12,

  activeLiftPx = 22,
  activeScale = 1.03,
  inactiveScale = 0.94,

  springStiffness = 280,
  springDamping = 28,

  loop = true,
  autoAdvance = false,
  intervalMs = 2800,
  pauseOnHover = true,

  showDots = true,
  className,
  variant = 'framed',

  onChangeIndex,
  renderCard,
}: CardStackProps<T>) {
  const reduceMotion = useReducedMotion()
  const len = items.length

  const [active, setActive] = React.useState(() => wrapIndex(initialIndex, len))
  const [hovering, setHovering] = React.useState(false)

  // keep active in bounds if items change
  React.useEffect(() => {
    setActive((a) => wrapIndex(a, len))
  }, [len])

  React.useEffect(() => {
    if (!len) return
    onChangeIndex?.(active, items[active]!)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])

  const maxOffset = Math.max(0, Math.floor(maxVisible / 2))

  /* `openness` scales the whole geometry, so a closed hand is the same fan at
     0 — no second layout to keep in step with the first. */
  const open = Math.min(1, Math.max(0, openness))
  const cardSpacing =
    Math.max(10, Math.round(cardWidth * (1 - overlap))) * open
  const stepDeg = (maxOffset > 0 ? spreadDeg / maxOffset : 0) * open

  const canGoPrev = loop || active > 0
  const canGoNext = loop || active < len - 1

  const prev = React.useCallback(() => {
    if (!len) return
    if (!canGoPrev) return
    setActive((a) => wrapIndex(a - 1, len))
  }, [canGoPrev, len])

  const next = React.useCallback(() => {
    if (!len) return
    if (!canGoNext) return
    setActive((a) => wrapIndex(a + 1, len))
  }, [canGoNext, len])

  // keyboard navigation (when container focused)
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') prev()
    if (e.key === 'ArrowRight') next()
  }

  // autoplay
  React.useEffect(() => {
    if (!autoAdvance) return
    if (reduceMotion) return
    if (!len) return
    if (pauseOnHover && hovering) return

    const id = window.setInterval(
      () => {
        if (loop || active < len - 1) next()
      },
      Math.max(700, intervalMs),
    )

    return () => window.clearInterval(id)
  }, [
    autoAdvance,
    intervalMs,
    hovering,
    pauseOnHover,
    reduceMotion,
    len,
    loop,
    active,
    next,
  ])

  if (!len) return null

  const activeItem = items[active]!

  return (
    <div
      className={`cstack${className ? ` ${className}` : ''}`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Stage */}
      <div
        className="cstack__stage"
        style={{ height: Math.max(380, cardHeight + 80) }}
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        {/* background wash / spotlight (unique feel) */}
        <div className="cstack__wash cstack__wash--top" aria-hidden="true" />
        <div className="cstack__wash cstack__wash--bottom" aria-hidden="true" />

        <div
          className="cstack__field"
          style={{ perspective: `${perspectivePx}px` }}
        >
          <AnimatePresence initial={false}>
            {items.map((item, i) => {
              const off = signedOffset(i, active, len, loop)
              const abs = Math.abs(off)
              const visible = abs <= maxOffset

              // hide far-away cards cleanly
              if (!visible) return null

              // fan geometry
              const rotateZ = off * stepDeg
              const x = off * cardSpacing
              const y = abs * 10 * open // subtle arc-down feel
              const z = -abs * depthPx

              const isActive = off === 0

              const scale = isActive ? activeScale : inactiveScale
              const lift = isActive ? -activeLiftPx : 0

              const rotateX = isActive ? 0 : tiltXDeg

              const zIndex = 100 - abs

              // drag only on the active card
              const dragProps = isActive
                ? {
                    drag: 'x' as const,
                    dragConstraints: { left: 0, right: 0 },
                    dragElastic: 0.18,
                    onDragEnd: (
                      _e: unknown,
                      info: { offset: { x: number }; velocity: { x: number } },
                    ) => {
                      if (reduceMotion) return
                      const travel = info.offset.x
                      const v = info.velocity.x
                      const threshold = Math.min(160, cardWidth * 0.22)

                      // swipe logic
                      if (travel > threshold || v > 650) prev()
                      else if (travel < -threshold || v < -650) next()
                    },
                  }
                : {}

              return (
                <motion.div
                  key={item.id}
                  className={[
                    'cstack__card',
                    variant === 'framed' ? 'cstack__card--framed' : '',
                    isActive ? 'is-active' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  style={{
                    width: cardWidth,
                    height: cardHeight,
                    zIndex,
                    transformStyle: 'preserve-3d',
                  }}
                  initial={
                    reduceMotion
                      ? false
                      : { opacity: 0, y: y + 40, x, rotateZ, rotateX, scale }
                  }
                  animate={{
                    opacity: 1,
                    x,
                    y: y + lift,
                    rotateZ,
                    rotateX,
                    // motion does not animate translateZ reliably across setups,
                    // so it is applied as a CSS transform on the child below.
                    scale,
                  }}
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : {
                          type: 'spring',
                          stiffness: springStiffness,
                          damping: springDamping,
                        }
                  }
                  onClick={() => setActive(i)}
                  {...dragProps}
                >
                  <div
                    className="cstack__depth"
                    style={{
                      transform: `translateZ(${z}px)`,
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    {renderCard ? (
                      renderCard(item, { active: isActive })
                    ) : (
                      <DefaultFanCard item={item} active={isActive} />
                    )}
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Dots navigation centered at bottom */}
      {showDots ? (
        <div className="cstack__nav">
          <div className="cstack__dots">
            {items.map((it, idx) => {
              const on = idx === active
              return (
                <button
                  key={it.id}
                  type="button"
                  onClick={() => setActive(idx)}
                  className={`cstack__dot${on ? ' is-on' : ''}`}
                  aria-label={`Go to ${it.title}`}
                  aria-current={on || undefined}
                />
              )
            })}
          </div>
          {activeItem.href ? (
            <a
              href={activeItem.href}
              target="_blank"
              rel="noreferrer"
              className="cstack__link"
              aria-label="Open link"
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                <path
                  d="M21 3h-7m7 0v7m0-7L10 14M18 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          ) : null}
        </div>
      ) : null}
    </div>
  )
}

function DefaultFanCard({ item }: { item: CardStackItem; active: boolean }) {
  return (
    <div className="cstack__default">
      {/* image */}
      <div className="cstack__img">
        {item.imageSrc ? (
          <MediaImage
            src={item.imageSrc}
            alt={item.title}
            draggable={false}
            width={800}
            height={1000}
            sizes="(max-width: 900px) 90vw, 400px"
            priority
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div className="cstack__empty">No image</div>
        )}
      </div>

      {/* subtle gradient overlay at bottom for text readability */}
      <div className="cstack__scrim" />

      {/* content */}
      <div className="cstack__body">
        <div className="cstack__title">{item.title}</div>
        {item.description ? (
          <div className="cstack__desc">{item.description}</div>
        ) : null}
      </div>
    </div>
  )
}
