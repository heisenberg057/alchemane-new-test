import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import { BlockRenderer } from "@/components/blocks/BlockRenderer";
import { BlogSidebar } from "@/components/blog/BlogSidebar";
import {
  AboutPage,
  AustralianMirageHairPatchPage,
  CareerPage,
  CityHyderabadPage,
  CityKolkataPage,
  CityMumbaiPage,
  CityReplacementChennaiPage,
  CityReplacementGoaPage,
  CityReplacementPunjabPage,
  CityReplacementRajasthanPage,
  CitySuratPage,
  CityWigsBangalorePage,
  CityWigsChennaiPage,
  CityWigsDelhiPage,
  CityWigsHyderabadPage,
  CityWigsKolkataPage,
  CityWigsMumbaiPage,
  CityWigsPunePage,
  ClipOnHairSystemPage,
  ClipOnOrStickOnPage,
  ClipOnSystemLifespanPage,
  CommonQuestionsPage,
  ConsultationFormPage,
  ContactPage,
  CrownAreaPatchPage,
  CustomizedHairSystemsPage,
  DisclaimerPage,
  FrontHairlinePatchPage,
  HairPatchForMenPage,
  HairPatchVsSystemPage,
  HairReplacementForMenPage,
  HairReplacementServicesPage,
  HairReplacementSystemsAhmedabadPage,
  HairReplacementSystemsLucknowPage,
  HairTransplantPage,
  HairWigsForMenPage,
  NonSurgicalHairReplacementBangalorePage,
  NonSurgicalHairReplacementChennaiPage,
  NonSurgicalHairReplacementDelhiPage,
  NonSurgicalHairReplacementPage,
  NonSurgicalHairReplacementPunjabPage,
  NonSurgicalHairReplacementPunePage,
  NonSurgicalHairReplacementRajasthanPage,
  PrivacyPolicyPage,
  ProductsPage,
  ResultsPage,
  SkinBaseHairSystemsPage,
  SMPPage,
  StickOnHairSystemPage,
  StickOnSystemLifespanPage,
  SupportPage,
  SwissLaceHairPatchPage,
  TermsOfServicePage,
  WillMyHairlineLookRealPage,
} from './legacy-dynamic-pages';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import { LEGACY_SEO_MAP } from '@/config/legacy-seo-map';
import { defaultSEO } from '@/config/seo.config';
import { buildPageMetadata } from '@/lib/seo/buildPageMetadata';
import {
  bangaloreSchema,
  createClipOnOrStickOnSchema,
  createClipOnHairSystemSchema,
  createConsultationFormSchema,
  createContactUsSchema,
  createHairPatchVsHairSystemSchema,
  createStickOnHairSystemSchema,
} from '@/config/page-schemas';

type PageProps = {
  params: Promise<{ slug: string[] }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

async function getPageData(slugArray: string[]) {
  const slug = slugArray.join("/");
  if (!slug) return null;

  try {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "/api";
    const resolvedApiBase = apiBase.startsWith("http")
      ? apiBase
      : `${(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "")}${apiBase}`;
    const qs = new URLSearchParams({
      "where[slug][equals]": slug,
      limit: "1",
      depth: "0",
    });
    const res = await fetch(`${resolvedApiBase}/pages?${qs.toString()}`, {
      next: { revalidate: 60 }, // Revalidate every minute
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      console.warn(`Failed to fetch page (status ${res.status}) for slug "${slug}"`);
      return null;
    }

    const json = await res.json();
    const doc = json.docs?.[0] ?? json.data?.page;
    return doc ?? null;
  } catch (error) {
    console.error("Error fetching page:", error);
    return null;
  }
}

export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const slugArray = resolvedParams?.slug || [];
  const page = await getPageData(slugArray);
  const routePath = `/${slugArray.join('/')}`;
  const legacySeo = LEGACY_SEO_MAP[routePath];

  const fallbackTitle =
    (typeof defaultSEO.title === 'object' && defaultSEO.title && 'default' in defaultSEO.title
      ? String(defaultSEO.title.default)
      : 'American Hairline');
  const fallbackDescription =
    (typeof defaultSEO.description === 'string' && defaultSEO.description) ||
    'Discover the best non-surgical hair replacement for men at American Hairline.';

  if (!page) {
    return buildPageMetadata({
      title: legacySeo?.title || fallbackTitle,
      description: legacySeo?.description || fallbackDescription,
      canonical: legacySeo?.canonical || routePath,
      fallbackTitle,
      fallbackDescription,
    });
  }

  // Construct Robots
  let robotsText = "";
  if (!page.isIndexable) {
    robotsText = "noindex";
  } else {
    robotsText = "index";
  }

  if (!page.isFollowable) {
    robotsText += ", nofollow";
  } else {
    robotsText += ", follow";
  }

  if (page.advancedRobots) {
    robotsText += `, ${page.advancedRobots}`;
  }

  return buildPageMetadata({
    title: page.seoTitle || legacySeo?.title || page.title || fallbackTitle,
    description:
      page.metaDescription || legacySeo?.description || fallbackDescription,
    canonical:
      page.canonicalUrl || legacySeo?.canonical || `/${slugArray.join("/")}`,
    robots: robotsText,
    ogTitle: page.ogTitle,
    ogDescription: page.ogDescription,
    ogImage: page.ogImage,
    featuredImage: page.featuredImage,
    twitterTitle: page.twitterTitle,
    twitterDescription: page.twitterDescription,
    twitterImage: page.twitterImage,
    fallbackTitle,
    fallbackDescription,
  });
}

export default async function DynamicPage({ params, searchParams }: PageProps) {
  const resolvedParams = await params;
  const resolvedSearchParams = searchParams ? await searchParams : {};
  const slugArray = resolvedParams?.slug || [];
  const page = await getPageData(slugArray);

  if (!page) {
    // If NOT found in DB, we still allow legacy components to render!
    // We just don't have DB SEO for them.
  }

  const urlPath = slugArray.join("/");

  let LegacyComponent = null;
  let legacySchema: Record<string, unknown>[] | null = null;
  // -------------------------------------------------------------
  // LEGACY REACT COMPONENT MAPPING
  // (Keep in sync with src/config/legacy-marketing-page-slugs.ts for CMS sync.)
  // -------------------------------------------------------------
  switch (urlPath) {
    case 'about-us': LegacyComponent = <AboutPage />; break;
    case 'contact-us':
      LegacyComponent = <ContactPage />;
      legacySchema = createContactUsSchema('https://americanhairline.com/contact-us/');
      break;
    case 'consultation-form':
      LegacyComponent = <ConsultationFormPage />;
      legacySchema = createConsultationFormSchema('https://americanhairline.com/consultation-form/');
      break;
    case 'career': LegacyComponent = <CareerPage />; break;
    case 'clip-on-or-stick-on':
      LegacyComponent = <ClipOnOrStickOnPage />;
      legacySchema = createClipOnOrStickOnSchema('https://americanhairline.com/clip-on-or-stick-on/');
      break;
    case 'clip-on-or-stick-on/clip-on-hair-system':
      LegacyComponent = <ClipOnHairSystemPage />;
      legacySchema = createClipOnHairSystemSchema('https://americanhairline.com/clip-on-or-stick-on/clip-on-hair-system/');
      break;
    case 'clip-on-or-stick-on/stick-on-hair-system':
      LegacyComponent = <StickOnHairSystemPage />;
      legacySchema = createStickOnHairSystemSchema('https://americanhairline.com/clip-on-or-stick-on/stick-on-hair-system/');
      break;
    case 'clip-on-system-lifespan': LegacyComponent = <ClipOnSystemLifespanPage />; break;
    case 'hair-patch-vs-hair-system':
      LegacyComponent = <HairPatchVsSystemPage />;
      legacySchema = createHairPatchVsHairSystemSchema('https://americanhairline.com/hair-patch-vs-hair-system/');
      break;
    case 'hair-transplant': LegacyComponent = <HairTransplantPage />; break;
    case 'products': LegacyComponent = <ProductsPage searchParams={resolvedSearchParams} />; break;
    case 'results': LegacyComponent = <ResultsPage />; break;
    case 'scalp-micropigmentation': LegacyComponent = <SMPPage />; break;
    case 'stick-on-system-lifespan': LegacyComponent = <StickOnSystemLifespanPage />; break;
    case 'will-my-hairline-look-real': LegacyComponent = <WillMyHairlineLookRealPage />; break;
    // ── Priority 1 Service Pages ──────────────────────────────────────
    case 'hair-patch-for-men': LegacyComponent = <HairPatchForMenPage />; break;
    case 'hair-replacement-for-men': LegacyComponent = <HairReplacementForMenPage />; break;
    case 'hair-wigs-for-men': LegacyComponent = <HairWigsForMenPage />; break;
    case 'swiss-lace-hair-patch': LegacyComponent = <SwissLaceHairPatchPage />; break;
    case 'skin-base-hair-systems': LegacyComponent = <SkinBaseHairSystemsPage />; break;
    case 'clip-on-hair-system':
      LegacyComponent = <ClipOnHairSystemPage />;
      legacySchema = createClipOnHairSystemSchema('https://americanhairline.com/clip-on-hair-system/');
      break;
    case 'customized-hair-systems': LegacyComponent = <CustomizedHairSystemsPage />; break;
    case 'crown-area-patch': LegacyComponent = <CrownAreaPatchPage />; break;
    // ── City Pages (Step 2 — all city routes) ────────────────────────────
    case 'non-surgical-hair-replacement-in-mumbai':
      LegacyComponent = <CityMumbaiPage />; break;
    case 'non-surgical-hair-replacement-systems-in-delhi':
      LegacyComponent = <NonSurgicalHairReplacementDelhiPage />; break;
    case 'non-surgical-hair-replacement-in-bangalore':
      LegacyComponent = <NonSurgicalHairReplacementBangalorePage />; break;
    case 'non-surgical-hair-replacement-in-chennai':
      LegacyComponent = <NonSurgicalHairReplacementChennaiPage />; break;
    case 'non-surgical-hair-replacement-in-hyderabad':
      LegacyComponent = <CityHyderabadPage />; break;
    case 'non-surgical-hair-replacement-in-punjab':
      LegacyComponent = <NonSurgicalHairReplacementPunjabPage />; break;
    case 'non-surgical-hair-replacement-in-rajasthan':
      LegacyComponent = <NonSurgicalHairReplacementRajasthanPage />; break;
    case 'non-surgical-hair-replacement-in-surat':
      LegacyComponent = <CitySuratPage />; break;
    case 'non-surgical-hair-replacement-for-men-in-pune':
      LegacyComponent = <NonSurgicalHairReplacementPunePage />; break;
    case 'hair-replacement-systems-for-men-in-goa':
      LegacyComponent = <CityReplacementGoaPage />; break;
    case 'hair-replacement-systems-for-men-in-kolkata':
      LegacyComponent = <CityKolkataPage />; break;
    case 'hair-replacement-systems-for-men-in-lucknow':
      LegacyComponent = <HairReplacementSystemsLucknowPage />; break;
    case 'hair-replacement-systems-in-ahmedabad':
      LegacyComponent = <HairReplacementSystemsAhmedabadPage />; break;
    case 'hair-wigs-for-men-in-mumbai':
      LegacyComponent = <CityWigsMumbaiPage />; break;
    case 'hair-wigs-for-men-in-delhi':
      LegacyComponent = <CityWigsDelhiPage />; break;
    case 'hair-wigs-for-men-in-bangalore':
      LegacyComponent = <CityWigsBangalorePage />; break;
    case 'hair-wigs-for-men-in-chennai':
      LegacyComponent = <CityWigsChennaiPage />; break;
    case 'hair-wigs-for-men-in-hyderabad':
      LegacyComponent = <CityWigsHyderabadPage />; break;
    case 'hair-wigs-for-men-in-kolkata':
      LegacyComponent = <CityWigsKolkataPage />; break;
    case 'hair-wigs-for-men-in-pune':
      LegacyComponent = <CityWigsPunePage />; break;
    // ── New legacy marketing pages (merged from Updated-Design) ─────────────
    case 'australian-mirage-hair-patch':
      LegacyComponent = <AustralianMirageHairPatchPage />; break;
    case 'common-questions':
      LegacyComponent = <CommonQuestionsPage />; break;
    case 'support':
      LegacyComponent = <SupportPage />; break;
    case 'disclaimer':
      LegacyComponent = <DisclaimerPage />; break;
    case 'front-hairline-patch':
      LegacyComponent = <FrontHairlinePatchPage />; break;
    case 'hair-replacement-for-men-in-chennai':
      LegacyComponent = <CityReplacementChennaiPage />; break;
    case 'hair-replacement-for-men-in-punjab':
      LegacyComponent = <CityReplacementPunjabPage />; break;
    case 'hair-replacement-for-men-in-rajasthan':
      LegacyComponent = <CityReplacementRajasthanPage />; break;
    case 'hair-replacement-services':
      LegacyComponent = <HairReplacementServicesPage />; break;
    case 'non-surgical-hair-replacement':
      LegacyComponent = <NonSurgicalHairReplacementPage />; break;
    case 'privacy-policy':
      LegacyComponent = <PrivacyPolicyPage />; break;
    case 'terms-of-service':
      LegacyComponent = <TermsOfServicePage />; break;
    // ── Additional Legacy Service Page Mappings ─────────────────────────────
    case 'front-hairline-transplant-2':
      LegacyComponent = <HairTransplantPage />; break;
    case 'tape-glue-hair-system':
      LegacyComponent = <StickOnHairSystemPage />;
      legacySchema = createStickOnHairSystemSchema('https://americanhairline.com/tape-glue-hair-system/');
      break;
    case 'clipon-tape-hair-system':
      LegacyComponent = <ClipOnHairSystemPage />; break;
    case 'full-lace-french-lace-hair-systems':
      LegacyComponent = <SkinBaseHairSystemsPage />; break;
  }

  // If no legacy component exists, MUST have a page from DB to render!
  if (!LegacyComponent && !page) {
    notFound();
  }

  let parsedBlocks = [];
  if (page?.blocksData) {
    try {
      const parsed = typeof page.blocksData === 'string' ? JSON.parse(page.blocksData) : page.blocksData;
      parsedBlocks = Array.isArray(parsed) ? parsed : (parsed?.blocks || []);
    } catch (e) {
      console.error("Failed to parse blocksData", e);
    }
  }

  return (
    <>
      {/* JSON-LD from CMS (WordPress export synced to customSchema); respect Enable Schema toggle */}
      {page?.enableSchema !== false && page?.customSchema ? (
        <SchemaMarkup schema={page.customSchema} />
      ) : legacySchema ? (
        <SchemaMarkup schema={legacySchema} />
      ) : null}

      {/* Head Scripts */}
      {page?.customHeadScripts && (
        <div dangerouslySetInnerHTML={{ __html: page.customHeadScripts }} />
      )}

      {/* Layout Overrides */}
      {page?.headerStyle === 'hidden' && <style>{`header, nav.main-nav { display: none !important; }`}</style>}
      {page?.headerStyle === 'transparent' && <style>{`header, nav.main-nav { position: absolute; top: 0; width: 100%; background: transparent !important; z-index: 50; }`}</style>}
      {page?.footerStyle === 'hidden' && <style>{`footer { display: none !important; }`}</style>}

      {LegacyComponent ? (
        LegacyComponent
      ) : (
        <main className="flex-1 w-full relative">
          <div className={page.showSidebar ? "container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8" : "w-full"}>

            <div className={page.showSidebar ? "lg:col-span-3 w-full" : "w-full"}>
              {/* Render blocks if visual builder is used, otherwise render HTML content */}
              {parsedBlocks.length > 0 ? (
                <div className="custom-blocks-renderer">
                  <BlockRenderer blocks={parsedBlocks} />
                </div>
              ) : (
                <div
                  className="prose prose-lg max-w-none w-full mx-auto py-12 px-4"
                  dangerouslySetInnerHTML={{ __html: page.content || "" }}
                />
              )}
            </div>

            {page.showSidebar && (
              <aside className="lg:col-span-1 hidden lg:block">
                <BlogSidebar />
              </aside>
            )}

          </div>
        </main>
      )}

      {/* Inject Custom Footer Scripts */}
      {page?.customFooterScripts && (
        <div dangerouslySetInnerHTML={{ __html: page.customFooterScripts }} />
      )}
    </>
  );
}
