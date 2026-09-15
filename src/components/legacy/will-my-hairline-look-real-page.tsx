import { NaturalHairlineHero } from '@/components/will-my-hairline-look-real/NaturalHairlineHero';
import { WorldsFinestHairSystems } from '@/components/homepage/WorldsFinestHairSystems';
import { NaturalHairlineDesign } from '@/components/will-my-hairline-look-real/NaturalHairlineDesign';
import { ResultsTransformations } from '@/components/results/ResultsTransformations';
import { NaturalHairlineTruth } from '@/components/will-my-hairline-look-real/NaturalHairlineTruth';
import { NaturalHairlineBenefits } from '@/components/will-my-hairline-look-real/NaturalHairlineBenefits';
import { NaturalHairlineCTA } from '@/components/will-my-hairline-look-real/NaturalHairlineCTA';
import { NaturalHairlineFlowchart } from '@/components/will-my-hairline-look-real/NaturalHairlineFlowchart';
import { NaturalHairlineStyles } from '@/components/will-my-hairline-look-real/NaturalHairlineStyles';
import { NaturalHairlineGuide } from '@/components/will-my-hairline-look-real/NaturalHairlineGuide';
import { ContactForm as CTA } from '@/components/homepage/ContactForm';
import { Ebook } from '@/components/homepage/Ebook';

export default function WillMyHairlineLookRealPage() {
  return (
    <main className="relative min-h-screen bg-white">
      <NaturalHairlineHero />
      <WorldsFinestHairSystems />
      <NaturalHairlineDesign />
      <ResultsTransformations />
      <NaturalHairlineTruth />
      <NaturalHairlineBenefits />
      <NaturalHairlineCTA />
      <NaturalHairlineFlowchart />
      <NaturalHairlineStyles />
      <NaturalHairlineGuide />
      <CTA />
      <Ebook />
    </main>
  );
}
