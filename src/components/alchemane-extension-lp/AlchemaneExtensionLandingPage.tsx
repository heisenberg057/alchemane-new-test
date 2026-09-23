'use client';

import '@/components/alchemane/alchemane-tokens.css';
import { AlchemaneIconSprite } from '@/components/alchemane/AlchemaneIconSprite';
import { AlchemaneHeader } from '@/components/alchemane/AlchemaneHeader';
import { AlchemaneFooter } from '@/components/alchemane/AlchemaneFooter';
import { AlchemaneStickyCta } from '@/components/alchemane/AlchemaneStickyCta';
import { AlchemaneBookingProvider } from '@/components/alchemane/AlchemaneBookingProvider';
import { useStickyCtaVisibility } from '@/components/alchemane/useStickyCtaVisibility';
import { AlchemaneExtensionHero } from './AlchemaneExtensionHero';
import { AlchemaneExtensionWhoSection } from './AlchemaneExtensionWhoSection';
import { AlchemaneExtensionStorySection } from './AlchemaneExtensionStorySection';
import { AlchemaneExtensionResultsGallery } from './AlchemaneExtensionResultsGallery';
import { AlchemaneExtensionProofSection } from './AlchemaneExtensionProofSection';
import { AlchemaneExtensionWhySection } from './AlchemaneExtensionWhySection';
import { AlchemaneExtensionConsultSection } from './AlchemaneExtensionConsultSection';
import { AlchemaneExtensionVoiceSection } from './AlchemaneExtensionVoiceSection';
import { AlchemaneExtensionMethodsSection } from './AlchemaneExtensionMethodsSection';
import { AlchemaneExtensionCompareSection } from './AlchemaneExtensionCompareSection';
import { AlchemaneExtensionFounderSection } from './AlchemaneExtensionFounderSection';
import { AlchemaneExtensionOfferSection } from './AlchemaneExtensionOfferSection';
import { AlchemaneExtensionGuaranteeSection } from './AlchemaneExtensionGuaranteeSection';
import { AlchemaneExtensionPromiseSection } from './AlchemaneExtensionPromiseSection';
import { AlchemaneExtensionFaqSection } from './AlchemaneExtensionFaqSection';
import { AlchemaneExtensionLocationSection } from './AlchemaneExtensionLocationSection';
import { EXTENSION_SECOND_STORY, EXTENSION_STORY } from './content';

const MEDIA_BASE = 'alchemane-extension-lp';

export function AlchemaneExtensionLandingPage() {
  const { heroCtaRef, offerRef, footerRef, hidden } = useStickyCtaVisibility();

  return (
    <div className="alchemane-scope">
      <AlchemaneBookingProvider thankYouHref="/lp/permanent-extensions/thank-you">
        <a className="srOnly" href="#alc-main">Skip to main content</a>
        <AlchemaneIconSprite />
        <AlchemaneHeader mediaBase={MEDIA_BASE} />

        <main id="alc-main">
          <AlchemaneExtensionHero mediaBase={MEDIA_BASE} heroCtaRef={heroCtaRef} />
          <AlchemaneExtensionWhoSection mediaBase={MEDIA_BASE} />
          <AlchemaneExtensionStorySection mediaBase={MEDIA_BASE} {...EXTENSION_STORY} />
          <AlchemaneExtensionResultsGallery mediaBase={MEDIA_BASE} />
          <AlchemaneExtensionProofSection mediaBase={MEDIA_BASE} />
          <AlchemaneExtensionStorySection mediaBase={MEDIA_BASE} {...EXTENSION_SECOND_STORY} />
          <AlchemaneExtensionWhySection mediaBase={MEDIA_BASE} />
          <AlchemaneExtensionConsultSection mediaBase={MEDIA_BASE} />
          <AlchemaneExtensionVoiceSection mediaBase={MEDIA_BASE} />
          <AlchemaneExtensionMethodsSection mediaBase={MEDIA_BASE} />
          <AlchemaneExtensionCompareSection />
          <AlchemaneExtensionFounderSection mediaBase={MEDIA_BASE} />
          <AlchemaneExtensionOfferSection offerRef={offerRef} />
          <AlchemaneExtensionGuaranteeSection mediaBase={MEDIA_BASE} />
          <AlchemaneExtensionPromiseSection mediaBase={MEDIA_BASE} />
          <AlchemaneExtensionFaqSection />
          <AlchemaneExtensionLocationSection mediaBase={MEDIA_BASE} />
        </main>

        <AlchemaneFooter mediaBase={MEDIA_BASE} footerRef={footerRef} />
        <AlchemaneStickyCta hidden={hidden} />
      </AlchemaneBookingProvider>
    </div>
  );
}
