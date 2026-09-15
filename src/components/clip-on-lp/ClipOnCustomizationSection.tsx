'use client';

import { ClipOnStill } from './ClipOnStill';
import {
  CLIP_ON_CUSTOM_IMAGES,
  CLIP_ON_CUSTOM_LEFT,
  CLIP_ON_CUSTOM_RIGHT,
} from './content';
import styles from './ClipOnCustomizationSection.module.css';

export function ClipOnCustomizationSection() {
  return (
    <section className={styles.root} aria-labelledby="clip-on-custom-title">
      <h2 id="clip-on-custom-title" className={styles.title}>
        <span className={styles.titleAccent}>Customization:</span>
        <br />
        Made for YOU!
        <br />
        Not just for Anyone
      </h2>

      <div className={styles.grid}>
        <ul className={styles.list}>
          {CLIP_ON_CUSTOM_LEFT.map((item) => (
            <li key={item} className={styles.item}>
              {item}
            </li>
          ))}
        </ul>
        <ul className={styles.list}>
          {CLIP_ON_CUSTOM_RIGHT.map((item) => (
            <li key={item} className={styles.item}>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {CLIP_ON_CUSTOM_IMAGES.map((image) => (
        <ClipOnStill
          key={image.id}
          className={styles.card}
          src={image.src}
          srcMobile={image.srcMobile}
          alt={image.alt}
          width={image.width}
          height={image.height}
          sizes="(max-width: 450px) 100vw, 358px"
        />
      ))}
    </section>
  );
}
