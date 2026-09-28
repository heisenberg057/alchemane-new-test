'use client';

import styles from './AlchemaneFloatingContact.module.css';

// TODO: placeholder numbers — swap for Alchemane's real phone/WhatsApp
// numbers once available. Left as clearly-inert values so nothing
// accidentally dials or messages a real person in the meantime.
const PHONE_NUMBER = '+910000000000';
const WHATSAPP_NUMBER = '910000000000';

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.icon}>
      <path
        fill="currentColor"
        d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.24.2 2.45.57 3.57a1 1 0 0 1-.25 1.02z"
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={styles.icon}>
      <path
        fill="currentColor"
        d="M19.05 4.94A9.9 9.9 0 0 0 12.03 2C6.54 2 2.07 6.46 2.07 11.95c0 1.75.46 3.46 1.32 4.97L2 22l5.22-1.36a9.92 9.92 0 0 0 4.79 1.22h.01c5.49 0 9.95-4.46 9.95-9.95a9.88 9.88 0 0 0-2.92-6.97ZM12.02 20.2h-.01a8.24 8.24 0 0 1-4.19-1.14l-.3-.18-3.1.81.83-3.02-.2-.31a8.23 8.23 0 0 1-1.27-4.41c0-4.56 3.7-8.27 8.26-8.27 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.84c0 4.56-3.71 8.26-8.25 8.26Zm4.54-6.18c-.25-.13-1.47-.72-1.7-.8-.23-.08-.39-.13-.56.13-.17.25-.64.8-.79.96-.14.17-.29.19-.54.07-.25-.13-1.07-.39-2.04-1.24-.75-.68-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.52.11-.11.25-.29.37-.43.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.76-1.85-.2-.48-.41-.42-.56-.42h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.09s.9 2.42 1.03 2.59c.13.17 1.76 2.68 4.26 3.75.59.26 1.05.41 1.41.53.6.19 1.14.16 1.57.1.48-.07 1.47-.6 1.68-1.18.21-.59.21-1.09.15-1.19-.06-.1-.22-.16-.47-.29Z"
      />
    </svg>
  );
}

export function AlchemaneFloatingContact() {
  return (
    <div className={styles.root}>
      <a
        className={`${styles.button} ${styles.phone}`}
        href={`tel:${PHONE_NUMBER}`}
        aria-label="Call Alchemane"
      >
        <PhoneIcon />
      </a>
      <a
        className={`${styles.button} ${styles.whatsapp}`}
        href={`https://api.whatsapp.com/send/?phone=${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Alchemane on WhatsApp"
      >
        <WhatsAppIcon />
      </a>
    </div>
  );
}
