# Funnel landing pages (`/lp/*`)

## Routes

The `/lp/*` routes match the folder names in `../flexifunnel/` exactly:

- `/lp/clip-on-hair-system`
- `/lp/failed-hair-transplant`
- `/lp/hair-loss-solution-bangalore`
- `/lp/hair-loss-solution-for-corporate-men`
- `/lp/hair-loss-solution-for-gym-goers`
- `/lp/hair-loss-solution-for-married-men`
- `/lp/hair-loss-solutions`
- `/lp/hair-loss-solutions-delhi`
- `/lp/hair-loss-solutions-for-men`
- `/lp/hair-replacement-visitors`
- `/lp/scalp-micro-pigmentation`
- `/lp/stick-on-hair-system`
- `/lp/transplant-grade-hair-systems`

## Import Workflow

From `AmericanHairline-Unified/`:

```bash
npm run build:funnel
```

This regenerates `src/content/funnel/*` and `src/content/funnel/manifest.json` from the current `../flexifunnel/*` HTML export.

The importer skips FlexiFunnels-only helper files whose names include `nav`, `utm`, or `widget`, and skips empty sections such as `18-CONSULTATION.html`.

## Local Test

From `AmericanHairline-Unified/`:

```bash
npm run dev
```

Then open, for example:

```text
http://localhost:3000/lp/hair-loss-solution-for-corporate-men
```

## Smoke Tests

Test each route at 390px, 768px, 1024px, 1280px, and 1440px.

- The page loads at the folder-name URL.
- Main site header/footer are not shown on `/lp/*`.
- FlexiFunnels helper scripts are not rendered directly.
- CTA clicks open the Next funnel booking modal.
- Hero media, testimonial media, FAQ toggles, and location carousel controls work.
- No page is accidentally showing another campaign's copied fallback content.
