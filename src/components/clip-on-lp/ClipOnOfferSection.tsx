'use client';

import { useFunnelBooking } from '@/components/funnel/FunnelBookingProvider';
import { CLIP_ON_OFFER_CHECKS, CLIP_ON_OFFER_GUIDANCE } from './content';
import styles from './ClipOnOfferSection.module.css';

function GuaranteeBadge() {
  return (
    <svg
      className={styles.badge}
      viewBox="0 0 220 220"
      role="img"
      aria-labelledby="clip-on-guarantee-badge-title"
    >
      <title id="clip-on-guarantee-badge-title">100 percent money back guarantee</title>
      <defs>
        <linearGradient id="clip-on-guarantee-badge-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#4686fe" />
          <stop offset="1" stopColor="#1769ff" />
        </linearGradient>
        <path
          id="clip-on-guarantee-badge-ring"
          d="M110,110 m-79,0 a79,79 0 1,1 158,0 a79,79 0 1,1 -158,0"
        />
      </defs>
      <circle cx="110" cy="110" r="102" fill="url(#clip-on-guarantee-badge-gradient)" />
      <circle
        cx="110"
        cy="110"
        r="88"
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        strokeDasharray="3 5"
        opacity="0.8"
      />
      <text className={styles.badgeRing}>
        <textPath href="#clip-on-guarantee-badge-ring" startOffset="50%" textAnchor="middle">
          MONEY BACK • GUARANTEE •
        </textPath>
      </text>
      <text className={styles.badgeValue} x="110" y="116" textAnchor="middle">
        100%
      </text>
      <text className={styles.badgeLabel} x="110" y="144" textAnchor="middle">
        CONSULTATION FEE
      </text>
    </svg>
  );
}

export function ClipOnOfferSection() {
  const { openBooking } = useFunnelBooking();

  return (
    <section
      id="consultation"
      className={styles.root}
      aria-labelledby="clip-on-consultation-title"
    >
      <div className={styles.card}>
        <h2 id="clip-on-consultation-title" className={styles.title}>
          Let’s Start with a
          <br />
          <span className={styles.titleAccent}>Consultation</span>
        </h2>
        <p className={styles.intro}>
          We take on a limited number of new consultations each week so every client gets proper
          time, clear options, and honest guidance.
        </p>

        <span className={styles.limit}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <rect x="4" y="5.5" width="16" height="14" rx="2" />
            <path d="M8 3.5v4M16 3.5v4M4 10h16" />
          </svg>
          Limited to 30 consultations per week
        </span>

        <div className={styles.guarantee}>
          <GuaranteeBadge />
          <div>
            <h3 className={styles.guaranteeTitle}>100% Consultation Fee Back Guarantee</h3>
            <p className={styles.guaranteeCopy}>
              Your consultation is paid, and our CRM team shares the fee after you submit the form.
              If you don’t find it{' '}
              <strong>genuine or valuable, we’ll refund the consultation fee in full</strong> — no
              questions asked.
            </p>
          </div>
        </div>

        <div className={styles.guidance}>
          <h3 className={styles.guidanceTitle}>What Makes Us Different</h3>
          <ul className={styles.bullets}>
            {CLIP_ON_OFFER_GUIDANCE.map((parts, bulletIndex) => (
              <li key={`offer-guidance-${bulletIndex}`} className={styles.bullet}>
                {parts.map((part, partIndex) =>
                  part.bold ? (
                    <strong key={`${bulletIndex}-${partIndex}`}>{part.text}</strong>
                  ) : (
                    <span key={`${bulletIndex}-${partIndex}`}>{part.text}</span>
                  )
                )}
              </li>
            ))}
          </ul>
          <p className={styles.tagline}>
            Just Genuine <span className={styles.taglineAccent}>“Guidance”</span>
          </p>
        </div>

        <div className={styles.checks}>
          {CLIP_ON_OFFER_CHECKS.map((item) => (
            <article key={item.id} className={styles.checkItem}>
              <span className={styles.checkMark} aria-hidden="true">
                ✓
              </span>
              <div>
                <h3 className={styles.checkTitle}>{item.title}</h3>
                <p className={styles.checkBody}>{item.body}</p>
              </div>
            </article>
          ))}
        </div>

        <a
          className={styles.cta}
          href="#contact-form"
          onClick={(event) => {
            event.preventDefault();
            openBooking();
          }}
        >
          Book A Consultation Now
        </a>
        <p className={styles.ctaNote}>
          Paid consultation · Fee shared after form submission · 30–45 min · In-person or online
        </p>
      </div>
    </section>
  );
}
