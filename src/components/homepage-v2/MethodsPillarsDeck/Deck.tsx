'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronsLeftRight } from 'lucide-react';
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from 'motion/react';
import { MediaImage } from '@/components/media/MediaImage';
import { usePrefersReducedMotion, useReveal } from '../HeroSecret/hooks';
import { CardStack, type CardStackItem } from './CardStack';
import { deckCards, deckTitle } from './content';

const CARD_RATIO = 1472 / 1840;
const CLOSED = 0.08;
const STEPS = 40;

const items: CardStackItem[] = deckCards.map((card, i) => ({
  id: i,
  title: card.name,
  imageSrc: card.image,
}));

export default function Deck() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const { ref: headRef, shown } = useReveal<HTMLDivElement>();
  const [still, setStill] = useState(true);
  const [size, setSize] = useState({ w: 418, h: 522, narrow: false });
  const [open, setOpen] = useState(CLOSED);

  useEffect(() => {
    const read = () => {
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      let h = Math.min(540, Math.max(300, vh * 0.58));
      let w = h * CARD_RATIO;
      const maxW = vw * 0.72;
      if (w > maxW) {
        w = maxW;
        h = w / CARD_RATIO;
      }
      const narrow = vw < 901;
      setSize({ w: Math.round(w), h: Math.round(h), narrow });
      setStill(reduced || narrow);
    };
    read();
    window.addEventListener('resize', read);
    return () => window.removeEventListener('resize', read);
  }, [reduced]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const eased = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    mass: 0.4,
    restDelta: 0.0005,
  });

  const openness = useTransform(eased, [0.05, 0.62], [CLOSED, 1], {
    clamp: true,
  });

  useMotionValueEvent(openness, 'change', (value) => {
    if (still) return;
    setOpen(Math.round(value * STEPS) / STEPS);
  });

  useEffect(() => {
    setOpen(Math.round(openness.get() * STEPS) / STEPS);
  }, [openness]);

  const openNow = still ? 1 : open;

  return (
    <section
      className={`ahlV2Methods deck${still ? ' deck--still' : ''}`}
      ref={sectionRef}
      aria-labelledby="deck-title"
    >
      <div className="deck__pin">
        <div className="deck__in wrap">
          <div
            className="deck__head"
            data-shown={shown ? 'true' : 'false'}
            ref={headRef}
          >
            <h2 className="deck__title" id="deck-title">
              {deckTitle.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h2>
          </div>

          <CardStack
            items={items}
            className="deck__stack"
            variant="bare"
            initialIndex={2}
            openness={openNow}
            maxVisible={size.narrow ? 3 : 5}
            cardWidth={size.w}
            cardHeight={size.h}
            overlap={size.narrow ? 0.78 : 0.56}
            spreadDeg={size.narrow ? 16 : 30}
            perspectivePx={1400}
            depthPx={90}
            tiltXDeg={7}
            activeLiftPx={18}
            activeScale={1.04}
            inactiveScale={0.93}
            springStiffness={220}
            springDamping={26}
            loop
            showDots={false}
            renderCard={(item) => {
              const card = deckCards[Number(item.id)];
              return (
                <MediaImage
                  className="deck__art"
                  src={card.image}
                  alt={`${card.name}, before and after his hair system. He says: “${card.quote}”`}
                  draggable={false}
                  width={1472}
                  height={1840}
                  sizes="(max-width: 900px) 90vw, 420px"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              );
            }}
          />

          <div className="deck__swipeHint">
            <span>Swipe to see more transformations</span>
            <motion.span
              className="deck__swipeIcon"
              aria-hidden="true"
              animate={reduced ? { x: 0 } : { x: [-2, 3, -2] }}
              transition={
                reduced
                  ? { duration: 0 }
                  : { duration: 1.6, ease: 'easeInOut', repeat: Infinity }
              }
            >
              <ChevronsLeftRight size={18} strokeWidth={2.2} />
            </motion.span>
          </div>
        </div>
      </div>
    </section>
  );
}
