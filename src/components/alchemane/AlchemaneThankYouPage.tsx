import './alchemane-tokens.css';
import { MediaImage } from '@/components/media/MediaImage';
import styles from './AlchemaneThankYouPage.module.css';

const WHATSAPP_POINTS = [
  { strong: 'No spam. No sales.', text: 'Just pure value.' },
  { strong: '1,400+ women', text: 'joined our private circle — only real talk & results.' },
  { strong: 'Real client stories', text: "(the ones we can't post publicly)." },
  { strong: '', text: 'Behind-the-scenes tips from Bollywood-level transformations.' },
  { strong: 'Expert answers', text: "to the questions you're too shy to ask." },
];

function youtubePoints(productTerm: string) {
  return [
    { strong: 'Go behind the scenes', text: 'on our YouTube channel.' },
    { strong: '', text: 'Watch real-life client journeys (before/after).' },
    { strong: 'Expert Q&As', text: `that reveal the truth about ${productTerm}.` },
    { strong: 'Informational videos', text: `to understand how ${productTerm} work.` },
  ];
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path
        fill="currentColor"
        d="M16 3C9 3 3.3 8.7 3.3 15.7c0 2.4.7 4.7 1.9 6.7L3 29l6.8-2.1c1.9 1 4 1.6 6.2 1.6 7 0 12.7-5.7 12.7-12.7S23 3 16 3Zm0 23.1c-2 0-3.9-.5-5.6-1.5l-.4-.2-4 1.2 1.2-3.9-.3-.4a10.3 10.3 0 0 1-1.7-5.6C5.2 9.8 10 5 16 5s10.8 4.8 10.8 10.7S22 26.1 16 26.1Zm5.9-8c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1a8.7 8.7 0 0 1-4.3-3.8c-.3-.6.3-.5.9-1.7.1-.2 0-.4 0-.5l-1-2.3c-.2-.6-.5-.5-.7-.5h-.6a1.2 1.2 0 0 0-.9.4 3.6 3.6 0 0 0-1.1 2.7c0 1.6 1.1 3.1 1.3 3.4.2.2 2.3 3.5 5.5 4.9.8.3 1.4.5 1.8.7.8.2 1.5.2 2 .1.6-.1 1.9-.8 2.2-1.5.2-.7.2-1.3.1-1.5s-.3-.2-.6-.4Z"
      />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="7" width="28" height="18" rx="5" />
      <path d="M13.5 12v8l7-4-7-4Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function AlchemaneThankYouPage({
  mediaBase,
  brandLine,
  productTerm,
  whatsappHref = '#',
  youtubeHref = '#',
}: {
  mediaBase: string;
  brandLine: string;
  productTerm: string;
  whatsappHref?: string;
  youtubeHref?: string;
}) {
  return (
    <div className="alchemane-scope">
      <header className={styles.header}>
        <a href="#top" aria-label="Alchemane Hair Extensions — home">
          <MediaImage
            src={`${mediaBase}/images/alchemane-logo-780.webp`}
            alt="Alchemane Hair Extensions"
            width={1035}
            height={239}
            className={styles.logo}
            priority
          />
        </a>
      </header>

      <section className={styles.banner}>
        <div className="container">
          <h1 className={styles.bannerTitle}>Thank You!</h1>
          <p className={styles.bannerLead}>
            We truly appreciate you reaching out to <strong>{brandLine}</strong>.
          </p>
          <p className={styles.bannerSub}>
            One of our friendly experts will be in touch with you very soon — we&apos;re excited to help you on your
            journey!
          </p>
        </div>
      </section>

      <div className="container">
        <div className={styles.stayConnected}>
          <span className={styles.hourglass} aria-hidden="true">⏳</span>
          <h2 className={styles.sectionTitle}>While You Wait,<br /><em>Stay Connected!</em></h2>
        </div>

        <div className={styles.cards}>
          <article className={`${styles.card} ${styles.cardTeal}`}>
            <h3 className={styles.cardTitle}>Join Our Private WhatsApp Group</h3>
            <ul className={styles.pointList}>
              {WHATSAPP_POINTS.map((point, index) => (
                <li key={index}>
                  <span className={styles.pointIcon}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4.5 12.5 5 5 10-11" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                  <span>{point.strong ? <strong>{point.strong}</strong> : null} {point.text}</span>
                </li>
              ))}
            </ul>
            <p className={styles.quote}>&ldquo;Private group – others can&apos;t see your name or number.&rdquo;</p>
            <a className={`${styles.button} ${styles.buttonTeal}`} href={whatsappHref} target="_blank" rel="noreferrer">
              <WhatsAppIcon />
              Join Our WhatsApp Group
            </a>
          </article>

          <article className={`${styles.card} ${styles.cardChampagne}`}>
            <h3 className={styles.cardTitle}>See the Real Change, On YouTube</h3>
            <ul className={styles.pointList}>
              {youtubePoints(productTerm).map((point, index) => (
                <li key={index}>
                  <span className={styles.pointIcon}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4.5 12.5 5 5 10-11" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
                  <span>{point.strong ? <strong>{point.strong}</strong> : null} {point.text}</span>
                </li>
              ))}
            </ul>
            <p className={styles.quote}>&ldquo;See actual demos of our process — not just polished ads.&rdquo;</p>
            <a className={`${styles.button} ${styles.buttonChampagne}`} href={youtubeHref} target="_blank" rel="noreferrer">
              <YouTubeIcon />
              See Our YouTube Channel
            </a>
          </article>
        </div>
      </div>
    </div>
  );
}
