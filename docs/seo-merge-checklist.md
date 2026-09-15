# SEO Merge Checklist

When a developer delivers a new page component, complete all 3 steps for that page before marking it done.

> **Files to edit:**
> - Switch statement → `src/app/[...slug]/page.tsx`
> - Sitemap → `src/app/sitemap.ts`
> - Redirects → `next.config.mjs` (remove the temp redirect if one exists)

---

## Priority 2 — Service Pages

### `/tape-glue-hair-system`
- [ ] Import component in `[...slug]/page.tsx`
- [ ] Add `case 'tape-glue-hair-system': LegacyComponent = <TapeGlueHairSystemPage />; break;`
- [ ] Add `'/tape-glue-hair-system'` to `sitemap.ts` static routes
- [ ] No redirect existed — nothing to remove from `next.config.mjs`

---

### `/clipon-tape-hair-system`
- [ ] Import component in `[...slug]/page.tsx`
- [ ] Add `case 'clipon-tape-hair-system': LegacyComponent = <CliponTapeHairSystemPage />; break;`
- [ ] Add `'/clipon-tape-hair-system'` to `sitemap.ts` static routes
- [ ] No redirect existed — nothing to remove from `next.config.mjs`

---

### `/full-lace-french-lace-hair-systems`
- [ ] Import component in `[...slug]/page.tsx`
- [ ] Add `case 'full-lace-french-lace-hair-systems': LegacyComponent = <FullLaceFrenchLaceHairSystemsPage />; break;`
- [ ] Add `'/full-lace-french-lace-hair-systems'` to `sitemap.ts` static routes
- [ ] No redirect existed — nothing to remove from `next.config.mjs`

---

### `/australian-mirage-hair-patch`
- [ ] Import component in `[...slug]/page.tsx`
- [ ] Add `case 'australian-mirage-hair-patch': LegacyComponent = <AustralianMirageHairPatchPage />; break;`
- [ ] Add `'/australian-mirage-hair-patch'` to `sitemap.ts` static routes
- [ ] No redirect existed — nothing to remove from `next.config.mjs`

---

### `/front-hairline-patch`
- [ ] Import component in `[...slug]/page.tsx`
- [ ] Add `case 'front-hairline-patch': LegacyComponent = <FrontHairlinePatchPage />; break;`
- [ ] Add `'/front-hairline-patch'` to `sitemap.ts` static routes
- [ ] No redirect existed — nothing to remove from `next.config.mjs`

---

### `/hair-replacement-services`
- [ ] Import component in `[...slug]/page.tsx`
- [ ] Add `case 'hair-replacement-services': LegacyComponent = <HairReplacementServicesPage />; break;`
- [ ] Add `'/hair-replacement-services'` to `sitemap.ts` static routes
- [ ] No redirect existed — nothing to remove from `next.config.mjs`

---

### `/hair-replacement-training`
- [ ] Import component in `[...slug]/page.tsx`
- [ ] Add `case 'hair-replacement-training': LegacyComponent = <HairReplacementTrainingPage />; break;`
- [ ] Add `'/hair-replacement-training'` to `sitemap.ts` static routes
- [ ] No redirect existed — nothing to remove from `next.config.mjs`

---

### `/front-hairline-transplant-2`
- [ ] Import component in `[...slug]/page.tsx`
- [ ] Add `case 'front-hairline-transplant-2': LegacyComponent = <FrontHairlineTransplantPage />; break;`
- [ ] Add `'/front-hairline-transplant-2'` to `sitemap.ts` static routes
- [ ] No redirect existed — nothing to remove from `next.config.mjs`

---

### `/consultation-form`
- [ ] Import component in `[...slug]/page.tsx`
- [ ] Add `case 'consultation-form': LegacyComponent = <ConsultationFormPage />; break;`
- [ ] Add `'/consultation-form'` to `sitemap.ts` static routes
- [ ] No redirect existed — nothing to remove from `next.config.mjs`

---

### `/common-questions`
- [ ] Import component in `[...slug]/page.tsx`
- [ ] Add `case 'common-questions': LegacyComponent = <CommonQuestionsPage />; break;`
- [ ] Add `'/common-questions'` to `sitemap.ts` static routes
- [ ] No redirect existed — nothing to remove from `next.config.mjs`

---

### `/support`
- [ ] Import component in `[...slug]/page.tsx`
- [ ] Add `case 'support': LegacyComponent = <SupportPage />; break;`
- [ ] Add `'/support'` to `sitemap.ts` static routes
- [ ] No redirect existed — nothing to remove from `next.config.mjs`

---

### `/online-assessment` ⬅️ NEW (discovered from JSON-LD folder)
- [ ] Import component in `[...slug]/page.tsx`
- [ ] Add `case 'online-assessment': LegacyComponent = <OnlineAssessmentPage />; break;`
- [ ] Add `'/online-assessment'` to `sitemap.ts` static routes
- [ ] Schema already exported as `onlineAssessmentSchema` in `src/config/page-schemas.ts` — add to component

---

### `/online-consultation` ⬅️ NEW (discovered from JSON-LD folder)
- [ ] Import component in `[...slug]/page.tsx`
- [ ] Add `case 'online-consultation': LegacyComponent = <OnlineConsultationPage />; break;`
- [ ] Add `'/online-consultation'` to `sitemap.ts` static routes
- [ ] Schema already exported as `onlineConsultationSchema` in `src/config/page-schemas.ts` — add to component

---

### `/ultra-thin-polyfuse-hair-system` ⬅️ NEW (discovered from JSON-LD folder)
- [ ] Import component in `[...slug]/page.tsx`
- [ ] Add `case 'ultra-thin-polyfuse-hair-system': LegacyComponent = <UltraThinPolyfuseHairSystemPage />; break;`
- [ ] Add `'/ultra-thin-polyfuse-hair-system'` to `sitemap.ts` static routes
- [ ] Schema already exported as `ultraThinPolyfuseHairSystemSchema` in `src/config/page-schemas.ts` — add to component

---

## City Pages — Studio Details Needed

All 20 city page routes (3 original + 17 new) are now wired to the `CityPage` template. When you have real studio addresses and Google Maps embed URLs, update the `studioAddress` and `mapEmbedUrl` in the corresponding `case` in `[...slug]/page.tsx`.

**Pages using placeholder addresses (update when real details available):**

| City | URL slug | Has schema? |
|---|---|---|
| Mumbai | `non-surgical-hair-replacement-in-mumbai` | ✅ `mumbaiSchema` |
| Delhi | `non-surgical-hair-replacement-systems-in-delhi` | ✅ `delhiSchema` |
| Bangalore | `non-surgical-hair-replacement-in-bangalore` | ✅ `bangaloreSchema` |
| Chennai | `non-surgical-hair-replacement-in-chennai` | ⏳ Schema in JSON folder |
| Hyderabad | `non-surgical-hair-replacement-in-hyderabad` | ⏳ Schema in JSON folder |
| Punjab | `non-surgical-hair-replacement-in-punjab` | ⏳ Schema in JSON folder |
| Rajasthan | `non-surgical-hair-replacement-in-rajasthan` | ⏳ Schema in JSON folder |
| Surat | `non-surgical-hair-replacement-in-surat` | ⏳ Schema in JSON folder |
| Pune (NSH) | `non-surgical-hair-replacement-for-men-in-pune` | ⏳ Schema in JSON folder |
| Goa | `hair-replacement-systems-for-men-in-goa` | ⏳ Schema in JSON folder |
| Kolkata | `hair-replacement-systems-for-men-in-kolkata` | ⏳ Schema in JSON folder |
| Lucknow | `hair-replacement-systems-for-men-in-lucknow` | ⏳ Schema in JSON folder |
| Ahmedabad | `hair-replacement-systems-in-ahmedabad` | ⏳ Schema in JSON folder |
| Mumbai (wigs) | `hair-wigs-for-men-in-mumbai` | ⏳ Schema in JSON folder |
| Delhi (wigs) | `hair-wigs-for-men-in-delhi` | ⏳ Schema in JSON folder |
| Bangalore (wigs) | `hair-wigs-for-men-in-bangalore` | ⏳ Schema in JSON folder |
| Chennai (wigs) | `hair-wigs-for-men-in-chennai` | ⏳ Schema in JSON folder |
| Hyderabad (wigs) | `hair-wigs-for-men-in-hyderabad` | ⏳ Schema in JSON folder |
| Kolkata (wigs) | `hair-wigs-for-men-in-kolkata` | ⏳ Schema in JSON folder |
| Pune (wigs) | `hair-wigs-for-men-in-pune` | ⏳ Schema in JSON folder |

> To add schemas to the remaining 17 city pages: export them from `page-schemas.ts` and pass `schema={xyzSchema as any}` to the `CityPage` in the `[...slug]/page.tsx` switch case.

---

## Redirects to Remove When a Page Goes Live

These are currently redirecting to `/` — remove them from `next.config.mjs` once the real page exists:

| Page | Current Redirect | Action |
|---|---|---|
| `/privacy-policy-2` | → `/` | Remove if a privacy policy page is built |
| `/disclaimer` | → `/` | Remove if a disclaimer page is built |
| `/terms-of-service` | → `/` | Remove if a ToS page is built |
| `/u-n-l-framework` | → `/` | Keep redirect — no real page needed |

> All blog post redirects can stay permanently — blog content is being served through the CMS at `/blog`.

