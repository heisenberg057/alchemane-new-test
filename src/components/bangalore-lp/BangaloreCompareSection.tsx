'use client';

import { BangaloreR2Image } from './BangaloreR2Image';
import {
  BANGALORE_COMPARE_ICONS,
  BANGALORE_COMPARE_ROWS,
  type BangaloreCompareCell,
} from './content';
import styles from './BangaloreCompareSection.module.css';

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

function StatusCell({ cell }: { cell: BangaloreCompareCell }) {
  const iconSrc =
    cell.status === 'check' ? BANGALORE_COMPARE_ICONS.check : BANGALORE_COMPARE_ICONS.cross;

  return (
    <span className={styles.cell}>
      <CellLines lines={cell.lines} />
      <BangaloreR2Image
        className={styles.status}
        src={iconSrc}
        alt={cell.statusAlt}
        width={18}
        height={18}
      />
    </span>
  );
}

export function BangaloreCompareSection() {
  return (
    <section className={styles.root} aria-labelledby="bangalore-compare-title">
      <h2 id="bangalore-compare-title" className={styles.title}>
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

        {BANGALORE_COMPARE_ROWS.map((row) => (
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
