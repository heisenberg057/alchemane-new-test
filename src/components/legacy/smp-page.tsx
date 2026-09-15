import { SMPHero } from '@/components/smp/SMPHero';
import { SMPResults } from '@/components/smp/SMPResults';
import { SMPAbout } from '@/components/smp/SMPAbout';
import { SMPBenefits } from '@/components/smp/SMPBenefits';
import { SMPSituations } from '@/components/smp/SMPSituations';
import { SMPProcess } from '@/components/smp/SMPProcess';
import { SMPConcerns } from '@/components/smp/SMPConcerns';
import { SMPWhyChoose } from '@/components/smp/SMPWhyChoose';
import { SMPFAQ } from '@/components/smp/SMPFAQ';
import { SocialProof } from '@/components/homepage/SocialProof';
import { ContactForm as CTA } from '@/components/homepage/ContactForm';
import { Ebook } from '@/components/homepage/Ebook';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import { smpSchema } from '@/config/page-schemas';

export default function SMPPage() {
  return (
    <main className="min-h-screen bg-white font-proxima">
      <SchemaMarkup schema={smpSchema as any} />
      <SMPHero />
      <SMPResults />
      <SMPAbout />
      <SMPBenefits />
      <SMPSituations />
      <SMPProcess />
      <SMPConcerns />
      <SMPWhyChoose />
      <SMPFAQ />
      <SocialProof />
      <CTA />
      <Ebook />
    </main>
  );
}
