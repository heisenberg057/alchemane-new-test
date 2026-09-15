import { HairPatchHero } from '@/components/hair-patch-vs-hair-system/HairPatchHero';
import { HairPatchComparison } from '@/components/hair-patch-vs-hair-system/HairPatchComparison';
import { Checklist } from '@/components/hair-patch-vs-hair-system/HairPatchChecklist';
import { ResultsTransformations } from '@/components/results/ResultsTransformations';
import { HairPatchConsultation } from '@/components/hair-patch-vs-hair-system/HairPatchConsultation';
import { ContactForm as CTA } from '@/components/homepage/ContactForm';
import { Ebook } from '@/components/homepage/Ebook';
import { HairPatchMyth } from '@/components/hair-patch-vs-hair-system/HairPatchMyth';
import { HairPatchWhyFail } from '@/components/hair-patch-vs-hair-system/HairPatchWhyFail';
import { HairPatchBenefits } from '@/components/hair-patch-vs-hair-system/HairPatchBenefits';

export default function HairPatchVsSystemPage() {
  return (
    <main className="relative min-h-screen bg-white">
      <HairPatchHero />
      <HairPatchComparison />
      <Checklist />
      <HairPatchMyth />
      <HairPatchWhyFail />
      <HairPatchBenefits />
      <ResultsTransformations />
      <HairPatchConsultation />
      <CTA />
      <Ebook imageSrc="/assets/hair-patch-ebook-cover.png" mobileImageSrc="/assets/hair-patch-ebook-cover.png" />
    </main>
  );
}
