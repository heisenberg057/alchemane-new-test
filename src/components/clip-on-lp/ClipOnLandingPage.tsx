'use client';

import { FunnelBookingProvider } from '@/components/funnel/FunnelBookingProvider';
import { FunnelHeader } from '@/components/funnel/FunnelHeader';
import { getFunnelMeta } from '@/config/funnel-pages';
import { ClipOnChoiceSection } from './ClipOnChoiceSection';
import { ClipOnCompareSection } from './ClipOnCompareSection';
import { ClipOnCustomizationSection } from './ClipOnCustomizationSection';
import { ClipOnDecideSection } from './ClipOnDecideSection';
import { ClipOnFaqSection } from './ClipOnFaqSection';
import { ClipOnFitSection } from './ClipOnFitSection';
import { ClipOnFooter } from './ClipOnFooter';
import { ClipOnFounderSection } from './ClipOnFounderSection';
import { ClipOnHappyClientsSection } from './ClipOnHappyClientsSection';
import { ClipOnHero } from './ClipOnHero';
import { ClipOnHowItWorksSection } from './ClipOnHowItWorksSection';
import { ClipOnLocationSection } from './ClipOnLocationSection';
import { ClipOnOfferSection } from './ClipOnOfferSection';
import { ClipOnResultsCarousel } from './ClipOnResultsCarousel';
import { ClipOnReviewsSection } from './ClipOnReviewsSection';
import { ClipOnSecretSection } from './ClipOnSecretSection';
import { ClipOnStickyCta } from './ClipOnStickyCta';
import { ClipOnThinnestSection } from './ClipOnThinnestSection';
import { ClipOnWhySection } from './ClipOnWhySection';

const liveMeta = getFunnelMeta('clip-on-hair-system');

type ClipOnLandingPageProps = {
  /** When true, use testing tracking for /lp/clip-on-testing */
  testing?: boolean;
};

export function ClipOnLandingPage({ testing = false }: ClipOnLandingPageProps) {
  const meta = testing
    ? { ...liveMeta, trackingEventForm: 'funnel_clip_on_testing' }
    : liveMeta;

  return (
    <FunnelBookingProvider meta={meta}>
      <div
        className="funnel-page funnel-page--responsive min-h-screen w-full overflow-x-hidden bg-[#fafafa]"
        data-funnel-slug={testing ? 'clip-on-testing' : liveMeta.slug}
        style={{ paddingBottom: 'calc(74px + env(safe-area-inset-bottom))' }}
      >
        <FunnelHeader />
        <p className="m-0 border-y border-black/[0.07] bg-[#fafafa] px-3 py-2.5 text-center font-[family-name:var(--font-funnel-montserrat),Montserrat,sans-serif] text-[13px] font-semibold leading-[18px] text-[#191919]">
          📍 In-Person Consultations — Khar West, Mumbai · Online
        </p>
        <ClipOnHero />
        <ClipOnResultsCarousel />
        <ClipOnFitSection />
        <ClipOnDecideSection />
        <ClipOnSecretSection />
        <ClipOnCompareSection />
        <ClipOnChoiceSection />
        <ClipOnWhySection />
        <ClipOnCustomizationSection />
        <ClipOnHowItWorksSection />
        <ClipOnReviewsSection />
        <ClipOnHappyClientsSection />
        <ClipOnFounderSection />
        <ClipOnThinnestSection />
        <ClipOnOfferSection />
        <ClipOnFaqSection />
        <ClipOnLocationSection />
        <ClipOnFooter />
        <ClipOnStickyCta />
      </div>
    </FunnelBookingProvider>
  );
}
