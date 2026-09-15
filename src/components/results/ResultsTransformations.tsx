import { AnimateOnScroll } from '@/components/shared/AnimateOnScroll';
import { Gallery } from '@/components/homepage/Gallery';

export const ResultsTransformations = () => {
  return (
    <AnimateOnScroll variant="fadeUp">
      <Gallery
        mobileTitle="Watch More Real Men, Real Transformations"
        desktopTitle="Watch More Real Men, Real Transformations"
      />
    </AnimateOnScroll>
  );
};
