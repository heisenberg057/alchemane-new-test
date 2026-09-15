'use client';

import * as React from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from 'motion/react';
import { MediaImage } from '@/components/media/MediaImage';

export interface GalleryItem {
  id: string | number;
  common: string;
  binomial?: string;
  photo: {
    url: string;
    text: string;
    pos?: string;
  };
}

export interface CircularGalleryProps {
  items: GalleryItem[];
  progress?: MotionValue<number>;
  turns?: number;
  radius?: number;
  perspectivePx?: number;
  autoRotateSpeed?: number;
  cardWidth?: number;
  cardHeight?: number;
  still?: boolean;
  /** Freeze the ring at its current angle (e.g. while a video plays). */
  paused?: boolean;
  className?: string;
  labelledBy?: string;
  renderCard?: (item: GalleryItem) => React.ReactNode;
}

function Card({
  item,
  index,
  count,
  angle,
  radius,
  cardWidth,
  cardHeight,
  renderCard,
}: {
  item: GalleryItem;
  index: number;
  count: number;
  angle: MotionValue<number>;
  radius: number;
  cardWidth: number;
  cardHeight: number;
  renderCard?: (item: GalleryItem) => React.ReactNode;
}) {
  const itemAngle = (index * 360) / count;

  const opacity = useTransform(angle, (deg) => {
    const relative = (itemAngle + (deg % 360) + 360) % 360;
    const facing = relative > 180 ? 360 - relative : relative;
    return Math.max(0.28, 1 - facing / 180);
  });

  return (
    <motion.li
      className="cgal__card"
      style={{
        width: cardWidth,
        height: cardHeight,
        marginLeft: -cardWidth / 2,
        marginTop: -cardHeight / 2,
        transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
        opacity,
      }}
    >
      <div className="cgal__face">
        {renderCard ? (
          renderCard(item)
        ) : (
          <>
            <MediaImage
              src={item.photo.url}
              alt={item.photo.text}
              width={600}
              height={750}
              sizes="300px"
              style={{
                objectPosition: item.photo.pos || 'center',
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            <div className="cgal__caption">
              <h3>{item.common}</h3>
              {item.binomial ? <em>{item.binomial}</em> : null}
            </div>
          </>
        )}
      </div>
    </motion.li>
  );
}

export const CircularGallery = React.forwardRef<HTMLDivElement, CircularGalleryProps>(
  function CircularGallery(
    {
      items,
      progress,
      turns = 1,
      radius = 700,
      perspectivePx = 2200,
      autoRotateSpeed = 0.02,
      cardWidth = 300,
      cardHeight = 375,
      still = false,
      paused = false,
      className,
      labelledBy,
      renderCard,
    },
    ref
  ) {
    const drift = useMotionValue(0);
    const held = React.useRef<number | null>(null);

    React.useEffect(() => {
      if (still || paused || autoRotateSpeed === 0) return;
      let frame = 0;
      const tick = () => {
        drift.set(drift.get() + autoRotateSpeed);
        frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(frame);
    }, [still, paused, autoRotateSpeed, drift]);

    const scrolled = useTransform(progress ?? drift, (p) =>
      progress ? p * turns * 360 : 0
    );
    const raw = useTransform([scrolled, drift], ([s, d]) => {
      const next = Number(s) + Number(d);
      if (paused) {
        if (held.current == null) held.current = next;
        return held.current;
      }
      held.current = null;
      return next;
    });
    const angle = useSpring(raw, {
      stiffness: 90,
      damping: 24,
      mass: 0.5,
      restDelta: 0.01,
    });

    if (still) {
      return (
        <div
          ref={ref}
          className={`cgal cgal--still${className ? ` ${className}` : ''}`}
          aria-labelledby={labelledBy}
        >
          <ul className="cgal__rail">
            {items.map((item) => (
              <li className="cgal__card" key={item.id} style={{ width: cardWidth }}>
                <div className="cgal__face">
                  {renderCard ? (
                    renderCard(item)
                  ) : (
                    <>
                      <MediaImage
                        src={item.photo.url}
                        alt={item.photo.text}
                        width={600}
                        height={750}
                        sizes="300px"
                        style={{
                          objectPosition: item.photo.pos || 'center',
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                      <div className="cgal__caption">
                        <h3>{item.common}</h3>
                        {item.binomial ? <em>{item.binomial}</em> : null}
                      </div>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={`cgal${className ? ` ${className}` : ''}`}
        style={{ perspective: `${perspectivePx}px` }}
        aria-labelledby={labelledBy}
      >
        <motion.ul className="cgal__ring" style={{ rotateY: angle }}>
          {items.map((item, i) => (
            <Card
              key={item.id}
              item={item}
              index={i}
              count={items.length}
              angle={angle}
              radius={radius}
              cardWidth={cardWidth}
              cardHeight={cardHeight}
              renderCard={renderCard}
            />
          ))}
        </motion.ul>
      </div>
    );
  }
);
