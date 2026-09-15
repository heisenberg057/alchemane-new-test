import { StickOnHero } from '@/components/stick-on-vs-clip-on/StickOnHero';
import { StickOnPreference } from '@/components/stick-on-vs-clip-on/StickOnPreference';
import { StickOnMethods } from '@/components/stick-on-vs-clip-on/StickOnMethods';
import { StickOnGallery } from '@/components/stick-on-vs-clip-on/StickOnGallery';
import { StickOnComparison } from '@/components/stick-on-vs-clip-on/StickOnComparison';
import { StickOnResults } from '@/components/stick-on-vs-clip-on/StickOnResults';
import { StickOnCTA } from '@/components/stick-on-vs-clip-on/StickOnCTA';
import { ContactForm as CTA } from '@/components/homepage/ContactForm';
import { Ebook } from '@/components/homepage/Ebook';

export default function StickOnPage() {
  return (
    <main className="relative min-h-screen bg-white">
      <StickOnHero />
      <StickOnPreference />
      <StickOnMethods />
      <StickOnGallery />
      <StickOnComparison />
      <StickOnResults />
      <StickOnCTA />
      <CTA />
      <Ebook />
    </main>
  );
}
