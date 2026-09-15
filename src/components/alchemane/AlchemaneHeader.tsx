import { MediaImage } from '@/components/media/MediaImage';
import { AlchemaneCtaButton } from './AlchemaneCtaButton';
import styles from './AlchemaneHeader.module.css';

export function AlchemaneHeader({ mediaBase }: { mediaBase: string }) {
  return (
    <header className={styles.root}>
      <div className={styles.inner}>
        <a className={styles.brand} href="#top" aria-label="Alchemane Hair Extensions — home">
          <MediaImage
            src={`${mediaBase}/images/alchemane-logo-780.webp`}
            alt="Alchemane Hair Extensions"
            width={1035}
            height={239}
            className={styles.logo}
            priority
          />
        </a>
        <AlchemaneCtaButton className={styles.cta}>Book a Consultation</AlchemaneCtaButton>
      </div>
    </header>
  );
}
