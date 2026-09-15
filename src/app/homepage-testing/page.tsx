import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { buildPageMetadata } from '@/lib/seo/buildPageMetadata';

const HeroSecret = dynamic(() => import('@/components/homepage-v2/HeroSecret'));
const AchievementsFacts = dynamic(() => import('@/components/homepage-v2/AchievementsFacts'));
const Checklist = dynamic(() =>
  import('@/components/homepage/Checklist').then((module) => ({
    default: module.Checklist,
  }))
);
const ClientStoriesBacked = dynamic(
  () => import('@/components/homepage-v2/ClientStoriesBacked')
);
const SystemsScanDecide = dynamic(
  () => import('@/components/homepage-v2/SystemsScanDecide')
);
const StoryServicesProcess = dynamic(
  () => import('@/components/homepage-v2/StoryServicesProcess')
);
const MethodsPillarsDeck = dynamic(
  () => import('@/components/homepage-v2/MethodsPillarsDeck')
);
const SalonsFaqForm = dynamic(() => import('@/components/homepage-v2/SalonsFaqForm'));
const Ebook = dynamic(() =>
  import('@/components/homepage/Ebook').then((module) => ({ default: module.Ebook }))
);

export const metadata: Metadata = {
  ...buildPageMetadata({
    title: 'Homepage Design Testing | American Hairline',
    description: 'Internal homepage design testing page. Not for public indexing.',
    canonical: '/homepage-testing',
    robots: { index: false, follow: false },
    fallbackTitle: 'Homepage Design Testing | American Hairline',
    fallbackDescription: 'Internal homepage design testing page. Not for public indexing.',
  }),
};

export default function HomepageTestingPage() {
  return (
    <main id="homepage-testing">
      {/* Step 1: designer HeroSecret */}
      <HeroSecret />
      {/* Step 2: designer Achievements + KeyFacts */}
      <AchievementsFacts />
      <Checklist />
      {/* Step 3: designer ClientStories + Backed */}
      <ClientStoriesBacked />
      {/* Step 4: designer Systems + Scan + Decide */}
      <SystemsScanDecide />
      {/* Step 5: designer Story + Services + Process */}
      <StoryServicesProcess />
      {/* Step 6: designer Methods + Pillars + Deck */}
      <MethodsPillarsDeck />
      {/* Step 7: designer Salons + Faq + Form */}
      <SalonsFaqForm />
      <Ebook />
    </main>
  );
}
