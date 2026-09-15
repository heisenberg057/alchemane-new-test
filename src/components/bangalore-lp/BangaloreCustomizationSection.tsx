'use client';

import { BangaloreR2Image } from './BangaloreR2Image';
import {
  BANGALORE_CUSTOM_IMAGES,
  BANGALORE_CUSTOM_LEFT,
  BANGALORE_CUSTOM_RIGHT,
} from './content';
import styles from './BangaloreCustomizationSection.module.css';

export function BangaloreCustomizationSection() {
  return (
    <section className={styles.root} aria-labelledby="bangalore-custom-title">
      <h2 id="bangalore-custom-title" className={styles.title}>
        <span className={styles.titleAccent}>Customization:</span>
        <br />
        Made for YOU!
        <br />
        Not just for Anyone
      </h2>

      <div className={styles.grid}>
        <ul className={styles.list}>
          {BANGALORE_CUSTOM_LEFT.map((item) => (
            <li key={item} className={styles.item}>
              {item}
            </li>
          ))}
        </ul>
        <ul className={styles.list}>
          {BANGALORE_CUSTOM_RIGHT.map((item) => (
            <li key={item} className={styles.item}>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {BANGALORE_CUSTOM_IMAGES.map((image) => (
        <BangaloreR2Image
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
