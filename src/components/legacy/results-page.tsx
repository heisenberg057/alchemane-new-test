import { ResultsHero } from '@/components/results/ResultsHero';
import { ResultsRealPeople } from '@/components/results/ResultsRealPeople';
import { ResultsTransformations } from '@/components/results/ResultsTransformations';
import { SocialProof } from '@/components/homepage/SocialProof';
import { Achievements } from '@/components/homepage/Achievements';
import { ResultsMistakes } from '@/components/results/ResultsMistakes';
import { ResultsWhyChoose } from '@/components/results/ResultsWhyChoose';
import { ResultsStillThinking } from '@/components/results/ResultsStillThinking';
import { ContactForm as CTA } from '@/components/homepage/ContactForm';
import { Ebook } from '@/components/homepage/Ebook';

export default function ResultsPage() {
  return (
    <main className="min-h-screen bg-white font-proxima" suppressHydrationWarning>
      <ResultsHero />
      <ResultsRealPeople />
      <SocialProof />
      <ResultsTransformations />
      <Achievements />
      <ResultsMistakes />
      <ResultsWhyChoose />
      <ResultsStillThinking />
      <CTA />
      <Ebook />
    </main>
  );
}
