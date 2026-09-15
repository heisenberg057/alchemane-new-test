import { AboutHero } from '@/components/about/AboutHero';
import { WhyChooseUs } from '@/components/about/WhyChooseUs';
import { AboutStory } from '@/components/about/AboutStory';
import { Achievements } from '@/components/homepage/Achievements';
import { AboutMission } from '@/components/about/AboutMission';
import { SocialProof } from '@/components/homepage/SocialProof';
import { AboutFounder } from '@/components/about/AboutFounder';
import { Services } from '@/components/homepage/Services';
import { AboutCTA } from '@/components/about/AboutCTA';
import { Locations } from '@/components/homepage/Locations';
import { AboutCareers } from '@/components/about/AboutCareers';
import { ContactForm as CTA } from '@/components/homepage/ContactForm';
import { Ebook } from '@/components/homepage/Ebook';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import { aboutUsSchema } from '@/config/page-schemas';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white font-proxima">
      <SchemaMarkup schema={aboutUsSchema as any} />
      <AboutHero />
      <WhyChooseUs />
      <AboutStory />
      <AboutMission />
      <Achievements />
      <SocialProof />
      <AboutFounder />
      <Services />
      <AboutCTA />
      <Locations />
      <AboutCareers />
      <CTA />
      <Ebook />
    </main>
  );
}
