import { HairTransplantHero } from '@/components/hair-transplant/HairTransplantHero';
import { HairTransplantBenefits } from '@/components/hair-transplant/HairTransplantBenefits';
import { HairTransplantComparison } from '@/components/hair-transplant/HairTransplantComparison';
import { HairTransplantCandidates } from '@/components/hair-transplant/HairTransplantCandidates';
import { HairTransplantSecret } from '@/components/hair-transplant/HairTransplantSecret';
import { HairTransplantProcess } from '@/components/hair-transplant/HairTransplantProcess';
import { HairTransplantTeam } from '@/components/hair-transplant/HairTransplantTeam';
import { ContactForm as CTA } from '@/components/homepage/ContactForm';
import { Ebook } from '@/components/homepage/Ebook';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import { hairTransplantSchema } from '@/config/page-schemas';

export default function HairTransplantPage() {
  return (
    <main className="min-h-screen bg-white font-proxima">
      <SchemaMarkup schema={hairTransplantSchema as any} />
      <HairTransplantHero />
      <HairTransplantBenefits />
      <HairTransplantComparison />
      <HairTransplantCandidates />
      <HairTransplantSecret />
      <HairTransplantProcess />
      <HairTransplantTeam />
      <CTA />
      <Ebook />
    </main>
  );
}
