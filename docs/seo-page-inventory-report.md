# Page-by-page SEO inventory — American Hairline (Next.js)

**Generated from codebase review** (`src/app`, `src/config`, `src/components/seo`).  
**Scope:** Public, indexable marketing surfaces. **`/admin/**` is excluded** (disallowed in `robots.ts`).  
**Date:** March 29, 2026.

---

## 1. How SEO is implemented (end-to-end)

| Layer | What it does | Primary files |
|--------|----------------|---------------|
| **Site defaults** | `metadataBase`, default title template, default description, OG/Twitter defaults | `src/config/seo.config.ts` |
| **WordPress crawl map** | Per-path `title`, `description`, `canonical` when no CMS override | `src/config/legacy-seo-map.ts` (119 paths) |
| **Home** | `generateMetadata` + optional CMS page `home` | `src/app/page.tsx` |
| **Catch-all routes** | `generateMetadata` + `LEGACY_SEO_MAP[path]` + optional CMS `pages/slug/{path}` | `src/app/[...slug]/page.tsx` |
| **Blog index** | Static `metadata` + `blogSchema` | `src/app/blog/page.tsx`, `page-schemas.ts` |
| **Blog posts** | `generateMetadata` from post fields | `src/app/blog/[slug]/page.tsx` |
| **JSON-LD (global)** | `Organization` + `WebSite` on **every** page | `src/app/layout.tsx` → `StructuredData.tsx` |
| **JSON-LD (page)** | `SchemaMarkup` in page components or `page.customSchema` from CMS | Various + `[...slug]/page.tsx` |
| **Sitemap** | Static list + dynamic posts/products (API-gated) | `src/app/sitemap.ts` |
| **Robots** | Allow `/`, disallow `/admin/`, `/api/`, `/auth/` | `src/app/robots.ts` |

**Metadata resolution order (simplified)**

1. **CMS** (`seoTitle`, `metaDescription`, `canonicalUrl`, …) if the API returns a page record.  
2. Else **`LEGACY_SEO_MAP[path]`** (when the path exists in the map).  
3. Else **`defaultSEO`** (same default title + description as the homepage-style fallback).

**Important:** Any route **not** in `LEGACY_SEO_MAP` and **without** a CMS page gets the **same default meta title and description** as the rest of the site unless you add map entries or CMS records.

---

## 2. Legend — columns used in the master table

| Column | Meaning |
|--------|---------|
| **Meta title / description** | Effective source: **L** = legacy map, **C** = CMS overrides when present, **S** = static export (`blog/page.tsx`), **D** = default site SEO only when L+C absent. |
| **Canonical** | **L** from legacy, **C** from CMS, **R** = relative path from code (`/${slug}`), **I** = implicit via `metadataBase` where not set. |
| **Sitemap** | **Yes** = in static list or emitted dynamically; **Dyn** = only when `API_URL` is set and not matching the `onrender` skip in code. |
| **Page JSON-LD** | Structured data **beyond** global Organization + WebSite. |
| **Status** | **Strong** = unique meta + page schema or strong legacy + canonical; **Partial** = some gaps; **Weak** = default meta and/or no page schema. |

---

## 3. Global items (every page)

| Item | Status | Notes |
|------|--------|--------|
| `metadataBase` | Done | `https://americanhairline.com` (via env) |
| Organization schema | Done | `StructuredData.tsx` — includes **`+91 9222666111`** |
| WebSite schema | Done | SearchAction target `/search?q=` — ensure route exists or adjust |
| Robots (index/follow) | Done | Root layout + per-route overrides when CMS sets noindex |
| Open Graph / Twitter (defaults) | Done | In `seo.config.ts` for fallbacks |

**Recommended (global):** Resolve duplicate **Organization/WebSite** graphs if page-level schema also embeds similar `@type`s; validate **SearchAction** URL.

---

## 4. Master table — static marketing URLs (from `sitemap.ts`)

Routes below match the **static `routes` array** (44 URL paths including `''` for home). Dynamic **`/blog/{slug}`** and **`/products/{slug}`** are covered in §5.

| # | URL | Meta title / description | Canonical | Sitemap | Page JSON-LD | Status | What’s required / gaps |
|---|-----|--------------------------|-----------|---------|--------------|--------|-------------------------|
| 1 | `/` | **L** (+ optional **C** for slug `home`) | **L** / **C** | Yes | `homeSchema` (ItemList/VideoObject + related types) + optional CMS `customSchema` | Partial | Align H1 (emotional) vs title (keyword); consider WebPage-focused schema |
| 2 | `/about-us` | **L** (+ **C**) | **L** / **C** | Yes | `aboutUsSchema` (VideoObject + AboutPage) | Strong | Optional: trim redundant VideoObject if not on page |
| 3 | `/contact-us` | **L** (+ **C**) | **L** / **C** | Yes | `contactUsSchema` (LocalBusiness) | Partial | Title is keyword-heavy vs H1 “Contact Us” — rewrite title for intent |
| 4 | `/blog` | **S** (`Blog \| American Hairline`) | **I** | Yes | `blogSchema` (**Blog**) | Partial | Add explicit `alternates.canonical`; enrich static description for keywords |
| 5 | `/products` | **D** unless **C** | **R** / **C** | Yes | None (CMS `customSchema` only) | Weak | Add **unique** title/description in CMS or legacy map; Product/Collection schema |
| 6 | `/results` | **D** unless **C** | **R** / **C** | Yes | None | Weak | Unique meta + ImageGallery or Collection schema |
| 7 | `/scalp-micropigmentation` | **L** (+ **C**) | **L** / **C** | Yes | `smpSchema` | Strong | Title mentions Mumbai; H1 is India-wide — align geo if needed |
| 8 | `/hair-transplant` | **L** (+ **C**) | **L** / **C** | Yes | `hairTransplantSchema` | Partial | Title vs H1 (combo positioning) — align messaging |
| 9 | `/hair-patch-vs-hair-system` | **D** unless **C** | **R** / **C** | Yes | None | Weak | Add **L** map entry or CMS SEO; FAQ or Article schema |
| 10 | `/clip-on-or-stick-on` | **D** unless **C** | **R** / **C** | Yes | None | Weak | Unique meta + HowTo/FAQ schema |
| 11 | `/clip-on-or-stick-on/clip-on-hair-system` | **D** unless **C** | **R** / **C** | Yes | `clipOnHairSystemSchema` | Partial | Add legacy/CMS **unique** title (avoid default duplicate) |
| 12 | `/clip-on-or-stick-on/stick-on-hair-system` | **D** unless **C** | **R** / **C** | Yes | **None** in component | Weak | Add JSON-LD (e.g. Product/Service) + unique meta |
| 13 | `/clip-on-system-lifespan` | **D** unless **C** | **R** / **C** | Yes | None | Weak | Unique meta + FAQ schema |
| 14 | `/stick-on-system-lifespan` | **D** unless **C** | **R** / **C** | Yes | None | Weak | Same as above |
| 15 | `/will-my-hairline-look-real` | **D** unless **C** | **R** / **C** | Yes | None | Weak | Unique meta + FAQ |
| 16 | `/career` | **D** unless **C** | **R** / **C** | Yes | None | Weak | Unique meta; JobPosting if listings |
| 17 | `/hair-patch-for-men` | **L** (+ **C**) | **L** / **C** | Yes | `hairPatchForMenSchema` | Strong | Maintain CMS/legacy parity |
| 18 | `/hair-replacement-for-men` | **L** (+ **C**) | **L** / **C** | Yes | `hairReplacementForMenSchema` | Strong | — |
| 19 | `/hair-wigs-for-men` | **L** (+ **C**) | **L** / **C** | Yes | `hairWigsForMenSchema` | Strong | — |
| 20 | `/swiss-lace-hair-patch` | **L** (+ **C**) | **L** / **C** | Yes | `swissLaceSchema` | Strong | Legacy title short vs rich H1 — optional title refresh |
| 21 | `/skin-base-hair-systems` | **L** (+ **C**) | **L** / **C** | Yes | `skinBaseSchema` | Strong | — |
| 22 | `/clip-on-hair-system` | **L** (+ **C**) | **L** / **C** | Yes | `clipOnHairSystemSchema` | Strong | — |
| 23 | `/customized-hair-systems` | **L** (+ **C**) | **L** / **C** | Yes | `customizedSchema` | Strong | — |
| 24 | `/crown-area-patch` | **L** (+ **C**) | **L** / **C** | Yes | `crownAreaSchema` | Strong | — |
| 25 | `/non-surgical-hair-replacement-in-mumbai` | **L** (+ **C**) | **L** / **C** | Yes | `mumbaiSchema` | Strong | — |
| 26 | `/non-surgical-hair-replacement-systems-in-delhi` | **L** (+ **C**) | **L** / **C** | Yes | `delhiSchema` | Strong | — |
| 27 | `/non-surgical-hair-replacement-in-bangalore` | **L** (+ **C**) | **L** / **C** | Yes | `bangaloreSchema` | Strong | — |
| 28 | `/non-surgical-hair-replacement-in-chennai` | **D** unless **C** | **R** / **C** | Yes | **None** (no `schema` prop) | Weak | Add **L** or CMS meta; **LocalBusiness** / city schema like top 3 cities |
| 29 | `/non-surgical-hair-replacement-in-hyderabad` | **D** unless **C** | **R** / **C** | Yes | None | Weak | Same |
| 30 | `/non-surgical-hair-replacement-in-punjab` | **D** unless **C** | **R** / **C** | Yes | None | Weak | Same |
| 31 | `/non-surgical-hair-replacement-in-rajasthan` | **D** unless **C** | **R** / **C** | Yes | None | Weak | Same |
| 32 | `/non-surgical-hair-replacement-in-surat` | **D** unless **C** | **R** / **C** | Yes | None | Weak | Same |
| 33 | `/non-surgical-hair-replacement-for-men-in-pune` | **D** unless **C** | **R** / **C** | Yes | None | Weak | Same |
| 34 | `/hair-replacement-systems-for-men-in-goa` | **D** unless **C** | **R** / **C** | Yes | None | Weak | Same |
| 35 | `/hair-replacement-systems-for-men-in-kolkata` | **D** unless **C** | **R** / **C** | Yes | None | Weak | Same |
| 36 | `/hair-replacement-systems-for-men-in-lucknow` | **D** unless **C** | **R** / **C** | Yes | None | Weak | Same |
| 37 | `/hair-replacement-systems-in-ahmedabad` | **D** unless **C** | **R** / **C** | Yes | None | Weak | Same |
| 38 | `/hair-wigs-for-men-in-mumbai` | **D** unless **C** | **R** / **C** | Yes | None | Weak | Add city + offer meta; optional LocalBusiness |
| 39 | `/hair-wigs-for-men-in-delhi` | **D** unless **C** | **R** / **C** | Yes | None | Weak | Same |
| 40 | `/hair-wigs-for-men-in-bangalore` | **D** unless **C** | **R** / **C** | Yes | None | Weak | Same |
| 41 | `/hair-wigs-for-men-in-chennai` | **D** unless **C** | **R** / **C** | Yes | None | Weak | Same |
| 42 | `/hair-wigs-for-men-in-hyderabad` | **D** unless **C** | **R** / **C** | Yes | None | Weak | Same |
| 43 | `/hair-wigs-for-men-in-kolkata` | **D** unless **C** | **R** / **C** | Yes | None | Weak | Same |
| 44 | `/hair-wigs-for-men-in-pune` | **D** unless **C** | **R** / **C** | Yes | None | Weak | Same |

**Summary counts (static list)**

- **Legacy-backed meta (when no CMS):** 15 of the marketing paths above (plus `/` counted separately) — **28 paths** rely on **default duplicate meta** unless CMS fills them.  
- **Page-level JSON-LD:** 16 named bundles in `page-schemas.ts`; **not all routes** use them (see table).  
- **City JSON-LD:** Only **Mumbai, Delhi, Bangalore** pass `schema` into `CityPage`; **12 other city URLs** have no dedicated city schema in code.

---

## 5. Dynamic URLs

### 5.1 `/blog/[slug]` (blog posts)

| Aspect | Status |
|--------|--------|
| **Meta title** | **C** — `post.metaTitle` or `` `{title} \| American Hairline Blog` `` |
| **Meta description** | **C** — `post.metaDescription` or `excerpt` |
| **Canonical** | **Not set in `generateMetadata`** — **required:** add `alternates.canonical` |
| **Sitemap** | **Dyn** — included when `api.getPosts` runs (skipped if `API_URL` includes `onrender`) |
| **JSON-LD** | Global only — **required:** **Article** or **BlogPosting** + optional **BreadcrumbList** |
| **OG/Twitter** | **Not set in `generateMetadata`** — **recommended:** align with post |

### 5.2 `/products/[slug]` (and other CMS-only `[...slug]` paths)

Rendered when **`getPageData`** returns a CMS page (e.g. product detail). Not hard-coded in the legacy switch.

| Aspect | Status |
|--------|--------|
| **Meta** | **C** primary; **L** only if path exists in legacy map (most product slugs **won’t**) |
| **Sitemap** | **Dyn** — `api.getProducts` (same API guard as posts) |
| **JSON-LD** | **`page.customSchema`** if set in CMS — else none |
| **Required** | **Product** + **Offer** (if e-commerce) or **Service**; ensure unique titles per SKU |

### 5.3 Not found

Unknown `[...slug]` paths with no CMS page → **`notFound()`** (404). No SEO meta beyond Next defaults for error.

---

## 6. Priority checklist — what to do next

### Critical (duplicate / thin SEO)

1. **CMS or legacy entries** for all **28** static routes currently on **default** meta (§4 table, “Weak” rows).  
2. **Blog posts:** canonical + Article/BlogPosting + OG/Twitter.  
3. **Stick-on nested URL:** add page JSON-LD + unique meta.  
4. **Remaining city pages:** parity with Mumbai/Delhi/Bangalore (meta + LocalBusiness-style schema).

### Important

5. Explicit **canonical** on `/blog` index.  
6. **Product** listing `/products`: unique title/description; validate **sitemap** vs live routes.  
7. Review **global** WebSite/Organization duplication vs page schemas.

### Nice to have

8. **BreadcrumbList** on deep pages.  
9. Length tuning for titles (≈60 chars) and descriptions (≈120–160 chars).  
10. Validate **SearchAction** in `WebsiteSchema` matches a real search route.

---

## 7. File reference (quick)

| Concern | File |
|---------|------|
| Default SEO | `src/config/seo.config.ts` |
| WordPress map | `src/config/legacy-seo-map.ts` |
| Page JSON-LD exports | `src/config/page-schemas.ts` |
| Catch-all metadata + CMS | `src/app/[...slug]/page.tsx` |
| Home metadata | `src/app/page.tsx` |
| Blog index | `src/app/blog/page.tsx` |
| Blog post metadata | `src/app/blog/[slug]/page.tsx` |
| Sitemap | `src/app/sitemap.ts` |
| Global JSON-LD | `src/components/seo/StructuredData.tsx` |
| Robots | `src/app/robots.ts` |

---

*This report reflects the repository state at generation time. CMS content and API availability in production may change effective titles, descriptions, and sitemap entries.*
