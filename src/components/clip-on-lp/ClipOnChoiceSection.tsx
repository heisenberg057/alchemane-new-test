'use client';

import { ClipOnStill } from './ClipOnStill';
import { CLIP_ON_CHOICE_AWARD, CLIP_ON_CHOICE_STATS } from './content';
import styles from './ClipOnChoiceSection.module.css';

export function ClipOnChoiceSection() {
  return (
    <section className={styles.root} aria-labelledby="clip-on-choice-title">
      <div className={styles.glass}>
        <h2 id="clip-on-choice-title" className={styles.title}>
          Here’s why we’re the
          <br />
          <span className={styles.titleAccent}>First Choice For Men</span>
        </h2>

        <div className={styles.stats}>
          {CLIP_ON_CHOICE_STATS.map((stat) => (
            <article key={stat.label} className={styles.stat}>
              <strong className={styles.statValue}>{stat.value}</strong>
              <span className={styles.statLabel}>{stat.label}</span>
            </article>
          ))}
        </div>

        <div className={styles.awards}>
          <figure className={styles.awardCard}>
            <ClipOnStill
              className={styles.awardImage}
              src={CLIP_ON_CHOICE_AWARD.src}
              srcMobile={CLIP_ON_CHOICE_AWARD.srcMobile}
              alt={CLIP_ON_CHOICE_AWARD.alt}
              width={CLIP_ON_CHOICE_AWARD.width}
              height={CLIP_ON_CHOICE_AWARD.height}
              sizes="(max-width: 450px) 100vw, 358px"
            />
          </figure>
        </div>
      </div>
    </section>
  );
}
