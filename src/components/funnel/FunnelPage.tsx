'use client';

import type { FunnelPageMeta } from '@/config/funnel-pages';
import type { FunnelSectionPayload } from '@/lib/funnel/loadFunnelSections';
import { FunnelBookingProvider, useFunnelBooking } from './FunnelBookingProvider';
import { FunnelHeader } from './FunnelHeader';
import { FunnelHtmlSection } from './FunnelHtmlSection';
import { FunnelPageEffects } from './FunnelPageEffects';

const MARQUEE_SECTION_KEYS = new Set([
  'sticky-marquee',
  'block-02',
  'block-03-sticky-marquee',
  'block-03-sticky',
]);
const LEGACY_HEADER_SECTION_KEYS = new Set(['header', 'block-04']);

function organizeFunnelSections(sections: FunnelSectionPayload[]) {
  const marqueeSections: FunnelSectionPayload[] = [];
  const bodySections: FunnelSectionPayload[] = [];

  for (const section of sections) {
    if (MARQUEE_SECTION_KEYS.has(section.sectionKey)) {
      marqueeSections.push(section);
    } else if (LEGACY_HEADER_SECTION_KEYS.has(section.sectionKey)) {
      continue;
    } else {
      bodySections.push(section);
    }
  }

  return { marqueeSections, bodySections };
}

function FunnelEmptyState() {
  const { openBooking } = useFunnelBooking();
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-6 text-center">
      <p className="text-lg font-semibold text-[#121212]">This landing page is being prepared.</p>
      <button
        type="button"
        onClick={openBooking}
        className="mt-6 rounded-lg bg-gradient-to-r from-[#4686FE] to-[#1769FF] px-6 py-3 font-semibold text-white"
      >
        Book consultation
      </button>
    </div>
  );
}

function FunnelPageBody({ sections }: { sections: FunnelSectionPayload[] }) {
  if (sections.length === 0) return <FunnelEmptyState />;

  const { marqueeSections, bodySections } = organizeFunnelSections(sections);

  return (
    <>
      <FunnelHeader />
      {marqueeSections.map((section) => (
        <FunnelHtmlSection key={section.id} section={section} html={section.html} />
      ))}
      {bodySections.map((section) => (
        <FunnelHtmlSection key={section.id} section={section} html={section.html} />
      ))}
    </>
  );
}

export function FunnelPage({
  meta,
  sections,
}: {
  meta: FunnelPageMeta;
  sections: FunnelSectionPayload[];
}) {
  return (
    <FunnelBookingProvider meta={meta}>
      <div
        className="funnel-page funnel-page--responsive min-h-screen w-full overflow-x-hidden bg-white"
        data-funnel-slug={meta.slug}
      >
        <FunnelPageEffects />
        <FunnelPageBody sections={sections} />
      </div>
    </FunnelBookingProvider>
  );
}
