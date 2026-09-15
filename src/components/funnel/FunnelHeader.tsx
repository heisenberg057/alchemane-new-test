import Image from 'next/image';
import Link from 'next/link';

const FUNNEL_LOGO_SRC = '/assets/mkxm0e5w-j3lk0es.png';

export function FunnelHeader() {
  return (
    <header className="funnel-header" role="banner">
      <div className="funnel-header__inner">
        <Link href="/" className="funnel-header__brand" aria-label="American Hairline home">
          <Image
            src={FUNNEL_LOGO_SRC}
            alt="American Hairline"
            width={155}
            height={60}
            className="funnel-header__logo"
            priority
          />
        </Link>
      </div>
    </header>
  );
}
