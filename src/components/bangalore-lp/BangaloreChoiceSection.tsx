'use client';

import { BangaloreR2Image } from './BangaloreR2Image';
import { BANGALORE_CHOICE_AWARD, BANGALORE_CHOICE_STATS } from './content';
import styles from './BangaloreChoiceSection.module.css';

export function BangaloreChoiceSection() {
  return (
    <section className={styles.root} aria-labelledby="bangalore-choice-title">
      <div className={styles.glass}>
        <h2 id="bangalore-choice-title" className={styles.title}>
          Here’s why we’re the
          <br />
          <span className={styles.titleAccent}>First Choice For Men</span>
        </h2>

        <div className={styles.stats}>
          {BANGALORE_CHOICE_STATS.map((stat) => (
            <article key={stat.label} className={styles.stat}>
              <strong className={styles.statValue}>{stat.value}</strong>
              <span className={styles.statLabel}>{stat.label}</span>
            </article>
          ))}
        </div>

        <div className={styles.awards}>
          <figure className={styles.awardCard}>
            <BangaloreR2Image
              className={styles.awardImage}
              src={BANGALORE_CHOICE_AWARD.src}
              srcMobile={BANGALORE_CHOICE_AWARD.srcMobile}
              alt={BANGALORE_CHOICE_AWARD.alt}
              width={BANGALORE_CHOICE_AWARD.width}
              height={BANGALORE_CHOICE_AWARD.height}
              sizes="(max-width: 450px) 100vw, 358px"
            />
          </figure>
        </div>
      </div>
    </section>
  );
}
