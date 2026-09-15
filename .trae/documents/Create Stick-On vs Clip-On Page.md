# Create "Stick-On or Clip-On" Page

## 1. Asset Migration
Copy required images from `.figma/image/` to `public/assets/` with descriptive names:
- **Hero**: `ml0qcxoa-v75fmel.png` -> `stick-on-hero-bg.png`, `ml0qcxoa-19uzrc0.png` -> `stick-on-hero-left.png`, `ml0qcxoa-j63khs0.png` -> `stick-on-hero-right.png`
- **Quiz**: `ml0qcxo2-21pj45b.svg` -> `check-icon.svg`
- **Gallery**: Copy the 12 gallery thumbnail images (`ml0qcxoa-9ybl6xi.png`, etc.) to `stick-on-gallery-1.png` through `stick-on-gallery-12.png`.
- **Comparison**: Use existing icons or simple text.
- **Methods**: `ml0qcxob-v9uuk5e.png` -> `stick-on-method.png`, `ml0qcxob-pf1w1rq.png` -> `clip-on-method.png`
- **Results**: `ml0qcxob-74octb1.png` -> `result-nishant.png`, `ml0qcxob-47o95el.png` -> `result-2.png`, `ml0qcxob-2wlf9ij.png` -> `result-3.png`, `ml0qcxob-bzwb4n9.png` -> `result-4.png`
- **CTA**: `ml0qcxo2-fsbvmj8.svg` -> `tape-icon.svg`

## 2. Page & Component Structure
Create new route `src/app/stick-on-vs-clip-on/page.tsx` and the following components in `src/components/stick-on-vs-clip-on/`:

### `StickOnHero.tsx`
- Split layout showing "Stick-On" vs "Clip-On".
- "Our Methods" badge.
- Main title and intro text.

### `StickOnPreference.tsx`
- Interactive toggle/quiz section "Which option feels more like you?".
- Dynamic list of benefits based on selection (Stick-On vs Clip-On).

### `StickOnGallery.tsx`
- Grid/Carousel of "World's Finest Thinnest Hair Systems".
- Video thumbnails with play buttons.

### `StickOnComparison.tsx`
- Comparison table: Daily Wear, Servicing, Shaving, Lifestyle, Application.

### `StickOnMethods.tsx`
- Two cards: "Stick-on Hair System" vs "Clip-on Hair System".
- Description and "Know more" links.

### `StickOnResults.tsx`
- Testimonials section with "Real Results".
- Featured client "Nishant Thakkar" and others.

### `StickOnCTA.tsx`
- "Not Sure What Best For You?" section.
- "Speak To An Expert" button.

### `StickOnEbook.tsx` (Reuse/Adapt)
- Reuse the design of the eBook section, similar to the Hair Patch page.

## 3. Navbar Integration
- Update `src/components/homepage/Navbar.tsx` to include "Stick-On vs Clip-On" in the "Confused? We'll Guide You" dropdown.
