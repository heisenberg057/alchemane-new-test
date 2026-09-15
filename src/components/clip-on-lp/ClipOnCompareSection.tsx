'use client';

import { ClipOnStill } from './ClipOnStill';
import {
  CLIP_ON_COMPARE_ICONS,
  CLIP_ON_COMPARE_ROWS,
  type ClipOnCompareCell,
} from './content';
import styles from './ClipOnCompareSection.module.css';

function CellLines({ lines }: { lines: string[] }) {
  return (
    <>
      {lines.map((line, index) => (
        <span key={`${line}-${index}`}>
          {index > 0 ? <br /> : null}
          {line}
        </span>
      ))}
    </>
  );
}

function StatusCell({ cell }: { cell: ClipOnCompareCell }) {
  const iconSrc =
    cell.status === 'check' ? CLIP_ON_COMPARE_ICONS.check : CLIP_ON_COMPARE_ICONS.cross;

  return (
    <span className={styles.cell}>
      <CellLines lines={cell.lines} />
      <ClipOnStill
        className={styles.status}
        src={iconSrc}
        alt={cell.statusAlt}
        width={18}
        height={18}
      />
    </span>
  );
}

export function ClipOnCompareSection() {
  return (
    <section className={styles.root} aria-labelledby="clip-on-compare-title">
      <h2 id="clip-on-compare-title" className={styles.title}>
        Hair Transplant vs Hair System
        <br />
        <span className={styles.titleAccent}>See the Clear Winner</span>
      </h2>

      <div
        className={styles.table}
        role="table"
        aria-label="Hair transplant compared with American Hairline"
      >
        <div className={`${styles.row} ${styles.head}`} role="row">
          <strong className={styles.headCell} role="columnheader">
            Feature
            <br />
            &amp; Services
          </strong>
          <strong className={styles.headCell} role="columnheader">
            Hair
            <br />
            Transplant
          </strong>
          <strong className={styles.headCell} role="columnheader">
            American
            <br />
            Hairline
          </strong>
        </div>

        {CLIP_ON_COMPARE_ROWS.map((row) => (
          <div key={row.feature.join('-')} className={styles.row} role="row">
            <strong className={styles.feature} role="rowheader">
              <CellLines lines={row.feature} />
            </strong>
            <StatusCell cell={row.transplant} />
            <StatusCell cell={row.ahl} />
          </div>
        ))}
      </div>
    </section>
  );
}
