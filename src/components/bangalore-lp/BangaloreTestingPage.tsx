'use client';

import { FunnelBookingProvider } from '@/components/funnel/FunnelBookingProvider';
import { FunnelHeader } from '@/components/funnel/FunnelHeader';
import { getFunnelMeta } from '@/config/funnel-pages';
import { BangaloreChoiceSection } from './BangaloreChoiceSection';
import { BangaloreCompareSection } from './BangaloreCompareSection';
import { BangaloreCustomizationSection } from './BangaloreCustomizationSection';
import { BangaloreDecideSection } from './BangaloreDecideSection';
import { BangaloreFaqSection } from './BangaloreFaqSection';
import { BangaloreFitSection } from './BangaloreFitSection';
import { BangaloreFooter } from './BangaloreFooter';
import { BangaloreFounderSection } from './BangaloreFounderSection';
import { BangaloreHappyClientsSection } from './BangaloreHappyClientsSection';
import { BangaloreHero } from './BangaloreHero';
import { BangaloreHowItWorksSection } from './BangaloreHowItWorksSection';
import { BangaloreLocationSection } from './BangaloreLocationSection';
import { BangaloreOfferSection } from './BangaloreOfferSection';
import { BangaloreResultsCarousel } from './BangaloreResultsCarousel';
import { BangaloreReviewsSection } from './BangaloreReviewsSection';
import { BangaloreSecretSection } from './BangaloreSecretSection';
import { BangaloreStickyCta } from './BangaloreStickyCta';
import { BangaloreThinnestSection } from './BangaloreThinnestSection';
import { BangaloreWhySection } from './BangaloreWhySection';

const liveMeta = getFunnelMeta('hair-loss-solution-bangalore');

type BangaloreLandingPageProps = {
  /** When true, use testing tracking + optional banner for /lp/bangalore-testing */
  testing?: boolean;
};

export function BangaloreLandingPage({ testing = false }: BangaloreLandingPageProps) {
  const meta = testing
    ? { ...liveMeta, trackingEventForm: 'funnel_bangalore_testing' }
    : liveMeta;

  return (
    <FunnelBookingProvider meta={meta}>
      <div
        className="funnel-page funnel-page--responsive min-h-screen w-full overflow-x-hidden bg-[#fafafa]"
        data-funnel-slug={testing ? 'bangalore-testing' : liveMeta.slug}
        style={{ paddingBottom: 'calc(74px + env(safe-area-inset-bottom))' }}
      >
        <FunnelHeader />
        <p className="m-0 border-y border-black/[0.07] bg-[#fafafa] px-3 py-2.5 text-center font-[family-name:var(--font-funnel-montserrat),Montserrat,sans-serif] text-[13px] font-semibold leading-[18px] text-[#191919]">
          📍 In-Person Consultations — Indiranagar, Bangalore
        </p>
        <BangaloreHero />
        <BangaloreResultsCarousel />
        <BangaloreFitSection />
        <BangaloreDecideSection />
        <BangaloreSecretSection />
        <BangaloreCompareSection />
        <BangaloreChoiceSection />
        <BangaloreWhySection />
        <BangaloreCustomizationSection />
        <BangaloreHowItWorksSection />
        <BangaloreReviewsSection />
        <BangaloreHappyClientsSection />
        <BangaloreFounderSection />
        <BangaloreThinnestSection />
        <BangaloreOfferSection />
        <BangaloreFaqSection />
        <BangaloreLocationSection />
        <BangaloreFooter />
        <BangaloreStickyCta />
      </div>
    </FunnelBookingProvider>
  );
}

/** @deprecated Prefer BangaloreLandingPage — kept for existing test-route imports */
export function BangaloreTestingPage() {
  return <BangaloreLandingPage testing />;
}
