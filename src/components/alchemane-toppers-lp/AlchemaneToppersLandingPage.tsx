'use client';

import '@/components/alchemane/alchemane-tokens.css';
import { AlchemaneIconSprite } from '@/components/alchemane/AlchemaneIconSprite';
import { AlchemaneHeader } from '@/components/alchemane/AlchemaneHeader';
import { AlchemaneFooter } from '@/components/alchemane/AlchemaneFooter';
import { AlchemaneStickyCta } from '@/components/alchemane/AlchemaneStickyCta';
import { AlchemaneBookingProvider } from '@/components/alchemane/AlchemaneBookingProvider';
import { useStickyCtaVisibility } from '@/components/alchemane/useStickyCtaVisibility';
import { AlchemaneToppersHero } from './AlchemaneToppersHero';
import { AlchemaneToppersWhoSection } from './AlchemaneToppersWhoSection';
import { AlchemaneToppersStorySection } from './AlchemaneToppersStorySection';
import { AlchemaneToppersResultsGallery } from './AlchemaneToppersResultsGallery';
import { AlchemaneToppersProofSection } from './AlchemaneToppersProofSection';
import { AlchemaneToppersWhySection } from './AlchemaneToppersWhySection';
import { AlchemaneToppersConsultSection } from './AlchemaneToppersConsultSection';
import { AlchemaneToppersMethodsSection } from './AlchemaneToppersMethodsSection';
import { AlchemaneToppersCompareSection } from './AlchemaneToppersCompareSection';
import { AlchemaneToppersFounderSection } from './AlchemaneToppersFounderSection';
import { AlchemaneToppersOfferSection } from './AlchemaneToppersOfferSection';
import { AlchemaneToppersGuaranteeSection } from './AlchemaneToppersGuaranteeSection';
import { AlchemaneToppersPromiseSection } from './AlchemaneToppersPromiseSection';
import { AlchemaneToppersFaqSection } from './AlchemaneToppersFaqSection';
import { AlchemaneToppersLocationSection } from './AlchemaneToppersLocationSection';
import { TOPPERS_SECOND_STORY, TOPPERS_STORY } from './content';

const MEDIA_BASE = 'alchemane-toppers-lp';

export function AlchemaneToppersLandingPage() {
  const { heroCtaRef, offerRef, footerRef, hidden } = useStickyCtaVisibility();

  return (
    <div className="alchemane-scope">
      <AlchemaneBookingProvider thankYouHref="/toppers/thank-you">
        <a className="srOnly" href="#alc-main">Skip to main content</a>
        <AlchemaneIconSprite />
        <AlchemaneHeader mediaBase={MEDIA_BASE} />

        <main id="alc-main">
          <AlchemaneToppersHero mediaBase={MEDIA_BASE} heroCtaRef={heroCtaRef} />
          <AlchemaneToppersWhoSection mediaBase={MEDIA_BASE} />
          <AlchemaneToppersStorySection mediaBase={MEDIA_BASE} {...TOPPERS_STORY} />
          <AlchemaneToppersResultsGallery mediaBase={MEDIA_BASE} />
          <AlchemaneToppersProofSection mediaBase={MEDIA_BASE} />
          <AlchemaneToppersStorySection mediaBase={MEDIA_BASE} {...TOPPERS_SECOND_STORY} />
          <AlchemaneToppersWhySection mediaBase={MEDIA_BASE} />
          <AlchemaneToppersConsultSection mediaBase={MEDIA_BASE} />
          <AlchemaneToppersMethodsSection mediaBase={MEDIA_BASE} />
          <AlchemaneToppersCompareSection />
          <AlchemaneToppersFounderSection mediaBase={MEDIA_BASE} />
          <AlchemaneToppersOfferSection offerRef={offerRef} />
          <AlchemaneToppersGuaranteeSection mediaBase={MEDIA_BASE} />
          <AlchemaneToppersPromiseSection mediaBase={MEDIA_BASE} />
          <AlchemaneToppersFaqSection />
          <AlchemaneToppersLocationSection mediaBase={MEDIA_BASE} />
        </main>

        <AlchemaneFooter mediaBase={MEDIA_BASE} footerRef={footerRef} />
        <AlchemaneStickyCta hidden={hidden} />
      </AlchemaneBookingProvider>
    </div>
  );
}
