'use client';

import '@/components/alchemane/alchemane-tokens.css';
import { AlchemaneIconSprite } from '@/components/alchemane/AlchemaneIconSprite';
import { AlchemaneHeader } from '@/components/alchemane/AlchemaneHeader';
import { AlchemaneFooter } from '@/components/alchemane/AlchemaneFooter';
import { AlchemaneStickyCta } from '@/components/alchemane/AlchemaneStickyCta';
import { AlchemaneBookingProvider } from '@/components/alchemane/AlchemaneBookingProvider';
import { useStickyCtaVisibility } from '@/components/alchemane/useStickyCtaVisibility';
import { AlchemaneWigsHero } from './AlchemaneWigsHero';
import { AlchemaneWigsFailSection } from './AlchemaneWigsFailSection';
import { AlchemaneWigsRealSection } from './AlchemaneWigsRealSection';
import { AlchemaneWigsProofSection } from './AlchemaneWigsProofSection';
import { AlchemaneWigsTrustSection } from './AlchemaneWigsTrustSection';
import { AlchemaneWigsFounderSection } from './AlchemaneWigsFounderSection';
import { AlchemaneWigsEducationSection } from './AlchemaneWigsEducationSection';
import { AlchemaneWigsGallerySection } from './AlchemaneWigsGallerySection';
import { AlchemaneWigsVoiceSection } from './AlchemaneWigsVoiceSection';
import { AlchemaneWigsTypesSection } from './AlchemaneWigsTypesSection';
import { AlchemaneWigsCompareSection } from './AlchemaneWigsCompareSection';
import { AlchemaneWigsWhyChooseSection } from './AlchemaneWigsWhyChooseSection';
import { AlchemaneWigsWhoForSection } from './AlchemaneWigsWhoForSection';
import { AlchemaneWigsJourneySection } from './AlchemaneWigsJourneySection';
import { AlchemaneWigsConsultSection } from './AlchemaneWigsConsultSection';
import { AlchemaneWigsOfferSection } from './AlchemaneWigsOfferSection';
import { AlchemaneWigsGuaranteeSection } from './AlchemaneWigsGuaranteeSection';
import { AlchemaneWigsPromiseSection } from './AlchemaneWigsPromiseSection';
import { AlchemaneWigsFaqSection } from './AlchemaneWigsFaqSection';
import { AlchemaneWigsLocationSection } from './AlchemaneWigsLocationSection';

const MEDIA_BASE = 'alchemane-wigs-lp';

export function AlchemaneWigsLandingPage() {
  const { heroCtaRef, offerRef, footerRef, hidden } = useStickyCtaVisibility();

  return (
    <div className="alchemane-scope">
      <AlchemaneBookingProvider thankYouHref="/wigs/thank-you">
        <a className="srOnly" href="#alc-main">Skip to main content</a>
        <AlchemaneIconSprite />
        <AlchemaneHeader mediaBase={MEDIA_BASE} />

        <main id="alc-main">
          <AlchemaneWigsHero mediaBase={MEDIA_BASE} heroCtaRef={heroCtaRef} />
          <AlchemaneWigsFailSection />
          <AlchemaneWigsRealSection mediaBase={MEDIA_BASE} />
          <AlchemaneWigsProofSection mediaBase={MEDIA_BASE} />
          <AlchemaneWigsTrustSection mediaBase={MEDIA_BASE} />
          <AlchemaneWigsFounderSection mediaBase={MEDIA_BASE} />
          <AlchemaneWigsEducationSection mediaBase={MEDIA_BASE} />
          <AlchemaneWigsGallerySection mediaBase={MEDIA_BASE} />
          <AlchemaneWigsVoiceSection mediaBase={MEDIA_BASE} />
          <AlchemaneWigsTypesSection mediaBase={MEDIA_BASE} />
          <AlchemaneWigsCompareSection />
          <AlchemaneWigsWhyChooseSection mediaBase={MEDIA_BASE} />
          <AlchemaneWigsWhoForSection />
          <AlchemaneWigsJourneySection />
          <AlchemaneWigsConsultSection mediaBase={MEDIA_BASE} />
          <AlchemaneWigsOfferSection offerRef={offerRef} />
          <AlchemaneWigsGuaranteeSection mediaBase={MEDIA_BASE} />
          <AlchemaneWigsPromiseSection mediaBase={MEDIA_BASE} />
          <AlchemaneWigsFaqSection />
          <AlchemaneWigsLocationSection mediaBase={MEDIA_BASE} />
        </main>

        <AlchemaneFooter mediaBase={MEDIA_BASE} footerRef={footerRef} />
        <AlchemaneStickyCta hidden={hidden} />
      </AlchemaneBookingProvider>
    </div>
  );
}
