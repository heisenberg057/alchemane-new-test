'use client';

import type { Ref } from 'react';
import { motion, useTransform, type MotionValue } from 'motion/react';
import { usePrefersReducedMotion } from './hooks';
import { secretBenefits, secretClosingLines, secretTitleLines } from './content';

const secretTitleWordLines = secretTitleLines.map((line) => line.split(/\s+/));

function SecretTitleWord({
  word,
  index,
  progress,
  still,
}: {
  word: string;
  index: number;
  progress: MotionValue<number>;
  still: boolean;
}) {
  const start = index * 0.018;
  const end = start + 0.06;
  const opacity = useTransform(progress, [start, end], [0, 1]);
  const filter = useTransform(progress, [start, end], ['blur(12px)', 'blur(0px)']);
  const y = useTransform(progress, [start, end], [16, 0]);

  return (
    <motion.span
      className="secret__titleWord"
      style={still ? undefined : { opacity, filter, y }}
    >
      {word}
    </motion.span>
  );
}

function SecretBenefit({
  benefit,
  index,
  progress,
  still,
}: {
  benefit: (typeof secretBenefits)[number];
  index: number;
  progress: MotionValue<number>;
  still: boolean;
}) {
  const start = 0.3 + index * 0.075;
  const opacity = useTransform(progress, [start, start + 0.055], [0, 1]);
  const y = useTransform(progress, [start, start + 0.055], [18, 0]);

  return (
    <motion.li className="secret__benefit" style={still ? undefined : { opacity, y }}>
      <span className="secret__benefitNumber" aria-hidden="true">
        0{index + 1}
      </span>
      <div>
        <h3>{benefit.title}</h3>
        <p>{benefit.note}</p>
      </div>
    </motion.li>
  );
}

type SecretProps = {
  sectionRef: Ref<HTMLElement>;
  progress: MotionValue<number>;
};

export function Secret({ sectionRef, progress }: SecretProps) {
  const reduced = usePrefersReducedMotion();

  const titleOpacity = useTransform(progress, [0, 0.22, 0.3], [1, 1, 0]);
  const benefitsOpacity = useTransform(progress, [0.27, 0.35, 0.7, 0.78], [0, 1, 1, 0]);
  const benefitsX = useTransform(progress, [0.27, 0.35], [30, 0]);
  const closingOpacity = useTransform(progress, [0.72, 0.82, 1, 1], [0, 1, 1, 1]);
  const closingX = useTransform(progress, [0.72, 0.82], [30, 0]);

  return (
    <section
      className={`secret${reduced ? ' secret--still' : ''}`}
      ref={sectionRef}
      aria-labelledby="secret-title"
    >
      <div className="secret__pin">
        <div className="secret__scenes wrap">
          <motion.h2
            className="secret__title"
            id="secret-title"
            aria-label={secretTitleLines.join(' ')}
            style={reduced ? undefined : { opacity: titleOpacity }}
          >
            {secretTitleWordLines.map((words, lineIndex) => {
              const priorWordCount = secretTitleWordLines
                .slice(0, lineIndex)
                .reduce((total, line) => total + line.length, 0);

              return (
                <span
                  className="secret__titleLine"
                  aria-hidden="true"
                  key={secretTitleLines[lineIndex]}
                >
                  {words.map((word, wordIndex) => (
                    <span key={`${word}-${wordIndex}`}>
                      <SecretTitleWord
                        word={word}
                        index={priorWordCount + wordIndex}
                        progress={progress}
                        still={reduced}
                      />
                      {wordIndex < words.length - 1 ? ' ' : null}
                    </span>
                  ))}
                </span>
              );
            })}
          </motion.h2>

          <motion.ul
            className="secret__benefits"
            style={reduced ? undefined : { opacity: benefitsOpacity, x: benefitsX }}
          >
            {secretBenefits.map((benefit, index) => (
              <SecretBenefit
                benefit={benefit}
                index={index}
                progress={progress}
                still={reduced}
                key={benefit.title}
              />
            ))}
          </motion.ul>

          <motion.p
            className="secret__closing"
            style={reduced ? undefined : { opacity: closingOpacity, x: closingX }}
          >
            {secretClosingLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </motion.p>
        </div>
      </div>
    </section>
  );
}
