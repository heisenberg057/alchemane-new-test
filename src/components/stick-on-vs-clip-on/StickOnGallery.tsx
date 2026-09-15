'use client';

import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';
import { WorldsFinestHairSystems } from '@/components/homepage/WorldsFinestHairSystems';

export const StickOnGallery = () => {
  return (
    <AnimateOnScroll variant="fadeIn">
      <WorldsFinestHairSystems />
    </AnimateOnScroll>
  );
};
