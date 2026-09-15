'use client';

import type { CSSProperties, HTMLAttributes } from 'react';
import { MediaImage } from '@/components/media/MediaImage';

export type ParallaxImage = {
  src: string;
  alt: string;
  f?: number;
  r?: string;
};

export interface ParallaxImagesProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  images: readonly ParallaxImage[];
  still?: boolean;
}

type ParallaxImageStyle = CSSProperties & {
  '--f': number;
  '--r': string;
};

export default function ParallaxImages({
  images,
  still = false,
  className,
  ...rest
}: ParallaxImagesProps) {
  return (
    <div
      className={['parallaxImages', still ? 'parallaxImages--still' : '', className]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    >
      {images.map((image) => {
        const style: ParallaxImageStyle = {
          '--f': image.f ?? 0.1,
          '--r': image.r ?? '10px',
        };

        return (
          <div className="parallaxImages__item" key={image.src}>
            <MediaImage
              className="parallax-img"
              src={image.src}
              alt={image.alt}
              aria-hidden={image.alt ? undefined : true}
              width={900}
              height={1200}
              sizes="(max-width: 900px) 45vw, 22vw"
              style={style}
            />
          </div>
        );
      })}
    </div>
  );
}
