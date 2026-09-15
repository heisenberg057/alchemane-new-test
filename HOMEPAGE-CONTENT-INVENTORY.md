# American Hairline — Homepage Content & Asset Inventory

**URL:** `http://127.0.0.1:3000/` (production: `https://americanhairline.com/`)  
**Source:** `AmericanHairline-Unified/src/app/page.tsx`  
**Layout wrap:** `src/app/layout.tsx` → Header (Navbar) + Footer around all public pages  

**Last documented:** July 2026  

---

## Page overview

The homepage renders **18 sections** inside `<main>`, in this order:

| # | Section | Component |
|---|---------|-----------|
| 1 | Hero | `src/components/homepage/Hero.tsx` + `HeroCarousel` |
| 2 | Natural Hairline Secret | `NaturalHairlineSecret.tsx` |
| 3 | Achievements | `Achievements.tsx` |
| 4 | Stats | `Stats.tsx` |
| 5 | 21-Point Checklist | `Checklist.tsx` |
| 6 | Client Results Gallery | `Gallery.tsx` |
| 7 | Social Proof | `SocialProof.tsx` |
| 8 | World’s Finest Hair Systems | `WorldsFinestHairSystems.tsx` |
| 9 | Real Hair or Illusion | `RealHairIllusion.tsx` |
| 10 | Problem Agitation | `ProblemAgitation.tsx` |
| 11 | Services | `Services.tsx` |
| 12 | Process | `Process.tsx` |
| 13 | Trusted Methods | `TrustedMethods/TrustedMethods.tsx` |
| 14 | Why Choose Us | `WhyChooseUs/WhyChooseUs.tsx` |
| 15 | Locations | `Locations.tsx` |
| 16 | FAQ | `FAQ.tsx` |
| 17 | Contact Form (CTA) | `ContactForm.tsx` (`#contact-form`) |
| 18 | Free eBook | `Ebook.tsx` |

> **Note:** `Methods` is imported in `page.tsx` but **not rendered**.

### Default SEO (slug `/`)

| Field | Value |
|-------|-------|
| Title | Non Surgical Hair Replacement in India \| Hair Patch & Wigs For Men |
| Description | Discover the best non-surgical hair replacement for men at American Hairline. Achieve a natural look with customized solutions for hair restoration. |
| Canonical | `https://americanhairline.com/` |

### Media hosts used across the page

| Host | Usage |
|------|--------|
| `/public/assets/...` | Local SVGs, icons, logos |
| Cloudflare R2 `pub-dfcfdec07a8f40f2b756b4cce22c7bf9.r2.dev/media/` | Photos, banners, ebook covers, salon image |
| Gumlet `play.gumlet.io/embed/...` | All section videos |

---

## Layout chrome (not part of `<main>`, but on every homepage load)

### Header / Navbar

| Item | Detail |
|------|--------|
| Files | `layout/Header.tsx` → `homepage/Navbar.tsx` |
| Logo | `/assets/mkxm0e5x-jjniexs.png` (alt: American Hairline) |
| CTA icon | `/assets/mkxm0e5x-6dk90ej.svg` |

**Nav labels:** Home · Confused? We'll Guide You · Solutions · Results · About Us · Book Now  

**Guide dropdown:** Hair patch vs Hair system · Clip-On or Stick-On · Clip-On Hair System · Stick-On Hair System · Will my hairline look real? · Stick-On System Lifespan · Clip-On System Lifespan  

**Solutions dropdown:** Hair Systems (No Surgery) · SMP (Scalp Micropigmentation) · Hair Transplant  

**Mobile-only:** Careers · Get In Touch · hamburger overlay  

### Footer

| Item | Detail |
|------|--------|
| Files | `layout/Footer.tsx` → `homepage/Footer.tsx` |
| Logo | `/assets/mkxm0e5w-j3lk0es.png` |
| Tagline | Regain your confidence with India’s most natural-looking, non-surgical hair replacement solutions… |
| Quick Links | About us · Customer Support · Terms of Services · Privacy Policy · Disclaimer Policy · Blog |
| Solution | Non-Surgical Hair Replacement · Scalp Micro Pigmentation · Hair Transplant |
| Contact defaults | Phone `9222666111` · Email `info@americanhairline.com` |
| Copyright | American Hairline © {year} – All Rights Reserved. |

Also in layout: floating contact widget, analytics (GTM/GA/FB when env configured).

---

## Section 1 — Hero

| | |
|--|--|
| **Files** | `Hero.tsx`, `HeroCarousel/HeroCarousel.tsx`, `HeroCarousel/slides.ts` |
| **Purpose** | Above-the-fold pitch with CTAs, avatar social proof, and before/after carousel |

### Content

| Element | Copy |
|---------|------|
| Badge | India’s #1 Hair System Experts |
| H1 | Tired of Hiding Your Hair Loss? |
| Subheading | Get a **natural-looking** hair system trusted by Bollywood celebrities, **without surgery**, side effects, or regret. |
| Primary CTA | Discuss With A Consultant → `#contact-form` |
| Secondary CTA | Prefer WhatsApp? **Chat Now** → `https://api.whatsapp.com/send/?phone=917208329070` |
| Social proof line | Trusted by 6,000+ men over the world |

### Assets

| Asset | Path |
|-------|------|
| Badge star | `/assets/about-badge-star.svg` |
| CTA arrow | `/assets/arrow-up-right-white-square.svg` |
| WhatsApp icon | `/assets/whatsapp-icon.svg` |
| WhatsApp underline | `/assets/whatsapp-underline.svg` |
| Client avatars (5) | R2 `runtime-homepage-client-avatar-1.png` … `-5.png` |
| Carousel desktop | R2 `media/1.png` … `5.png` |
| Carousel mobile | R2 `media/1-1.png` … `5-1.png` |

### Interaction / responsive

- Infinite autoplay HeroCarousel (pause on hover; drag/momentum)
- Mobile cards ~280×380 · Desktop ~368×460
- Separate mobile vs desktop carousel images

---

## Section 2 — The Secret Behind Our Natural Hairline

| | |
|--|--|
| **Files** | `NaturalHairlineSecret.tsx`, `naturalHairlineSecretAssets.ts` |
| **Purpose** | Explains natural hairline finish via video + feature cards + banner |

### Content

| Element | Copy |
|---------|------|
| H2 | The Secret Behind Our Natural Hairline |
| Feature 1 | **Looks Just Like Your Own Scalp** — Nobody can tell |
| Feature 2 | **No Harsh or Fake Hairline** — Only natural edges |
| Feature 3 | **Feels Light, Breathable, Comfortable** — Just like your own |

### Assets

| Asset | Path / URL |
|-------|------------|
| Mobile video (Gumlet) | `https://play.gumlet.io/embed/69d8daf5e77eaed3190f8277` |
| Desktop video (Gumlet) | `https://play.gumlet.io/embed/69d8de2ae77eaed3190fcad1?...` |
| Banner mobile | R2 `media/card image-1.png` |
| Banner desktop | R2 `media/card image.png` |

### Interaction / responsive

- Lazy Gumlet players
- Mobile 4:5 video · Desktop 4:3 (~544px)
- Banner swaps at `md` breakpoint

---

## Section 3 — Our Big Achievements

| | |
|--|--|
| **Files** | `Achievements.tsx`, `achievementsAssets.ts` |
| **Purpose** | Brand milestone image carousel / accordion |

### Content

- **H2:** Our Big Achievements

| # | Image alt | Desktop asset | Mobile asset |
|---|-----------|---------------|--------------|
| 1 | American Hairline offered a deal on Shark Tank India | R2 `Shark tank.png` | `Shark tank-1.png` |
| 2 | American Hairline winning the Bharat Innovators Award | R2 `Bharat Innovators Award.png` | `Bharat Innovators Award-1.png` |
| 3 | American Hairline designing for Bollywood celebrities | R2 `Bollywood Celebrities.png` | `Bollywood Celebrities-1.png` |
| 4 | American Hairline using advanced 3D scan technology | R2 `3D Scan Technology.png` | `3D Scan Technology-1.png` |

### Interaction / responsive

- Mobile: snap carousel + dots + arrows
- Desktop: hover-expand accordion cards + scroll arrows
- Fully separate mobile/desktop UIs and image crops

---

## Section 4 — Stats (“Why Men Around the World Choose Us”)

| | |
|--|--|
| **File** | `Stats.tsx` |
| **Purpose** | Credibility numbers + expert CTA |

### Content

| Element | Copy |
|---------|------|
| H2 | Why Men Around the World Choose Us |
| Stat 1 | **12+ Years** — Experience |
| Stat 2 | **6,770+** — Men Helped |
| Stat 3 | **100%** — Natural Looking |
| Stat 4 | **12+ Nations** — Client Base |
| CTA | Talk to an Expert → `#contact-form` |

### Assets

- Inline SVG arrow only (no external images)

---

## Section 5 — 21-Point Checklist

| | |
|--|--|
| **File** | `Checklist.tsx` |
| **Purpose** | Customization checklist with walkthrough video |

### Content

| Element | Copy |
|---------|------|
| H2 (mobile) | Our 21-Point Checklist For A Perfect Hair System |
| H2 (desktop) | Our 21-Point Checklist for a Perfect Hair System |
| Subheading | We Custom Every Detail: |
| Mobile CTA | Discuss With A Consultant → `#contact-form` |

**Checklist items (1–21):**

1. Hair Colour Match — Strand-to-strand precision, no visible mismatch  
2. Hair Strand Diameter — Fine / Medium / Coarse, matched to native texture  
3. Wave Type — Straight / Soft wave / Body wave / Defined curls  
4. Hairline Shape — Straight / M-curve / Rounded / Slight recession  
5. Hairline Density — Low / Medium / High (especially front 1 inch)  
6. Hairline Direction — Brush back / Left-right / Natural fall (starting point)  
7. Whorl Area / Crown Design — Clockwise / Anti-clockwise / Flat crown realism  
8. Overall Hair Direction — Forward / Side / Backward, aligned to natural growth  
9. Knotting Technique at Root — V-loop / Injected / Single / Double secure knots  
10. Bleached Knots / No Knot Visibility — Invisible roots / Lightened knots for scalp realism  
11. Base Type — Swiss lace / PU / Hybrid / Mono / Lace front PU back  
12. Base Colour / Scalp Tint — PU tone matched exactly to real scalp shade  
13. Ventilation Technique — Flat / Semi-lift / Elevated, controls lift & volume  
14. Baby Hair Addition — Short / Wispy / Slightly irregular to soften hairline edge  
15. Clip-on / Stick-on Selection — Temporary / Semi-permanent / Lifestyle-fit for daily wear  
16. Scalp Mold Accuracy — POP mold or digital for exact fit (not estimation)  
17. Right Hairstyle — Based on face structure (quiff, pompadour, classic, messy)  
18. Right Haircut — Layering, tapering, fade, texture blend into side/back  
19. Frontal Transition Zone — Gradual / Jagged / Slightly uneven to mimic real hair  
20. Grey Hair Percentage (if any) — Light / Scattered / Blended strands to mimic natural aging  
21. Fade Compatibility — Side/back blending to match skin fade / temple fade  

### Assets

| Asset | URL |
|-------|-----|
| Mobile Gumlet | `https://play.gumlet.io/embed/69d8e1c4e77eaed319101ca4?...` |
| Desktop Gumlet | `https://play.gumlet.io/embed/69d8e1c4246219337545fc86?...` |

### Interaction

- Auto-scrolling duplicated checklist (pauses on hover/touch)
- Lazy Gumlet video

---

## Section 6 — Client Results Gallery

| | |
|--|--|
| **File** | `Gallery.tsx` |
| **Purpose** | Client natural-hairline video results carousel |

### Content

| Element | Copy |
|---------|------|
| H2 (mobile) | Some Of Our Clients With The Most Natural Hairlines |
| H2 (desktop) | Some of Our Clients With the Most Natural Hairlines |

**Client cards:**

| Name | Age |
|------|-----|
| Rahul Sharma | 34 |
| Arjun Mehta | 29 |
| Karan Verma | 41 |
| Vikram Nair | 37 |
| Rohan Kapoor | 26 |
| Aditya Singh | 45 |

### Assets (Gumlet — different IDs for mobile vs desktop)

**Mobile embeds:**  
`69dc78d9c6b8ccb79da6e701`, `…da6e6ff`, `…ba94a5`, `…ba94a3`, `…909a40`, `…da6e6fd`

**Desktop embeds:**  
`69dc7c0e7e5487dd1d90da27`, `…bad276`, `…bad27a`, `…da72732`, `…90da29`, `…bad27c`

### Interaction / responsive

- Mobile snap carousel · Desktop hover-expand + arrows
- Mobile aspect 4:5 · Desktop active 16:9 / inactive 9:16

---

## Section 7 — Social Proof (“Trusted By Thousands”)

| | |
|--|--|
| **File** | `SocialProof.tsx` |
| **Purpose** | Google rating + YouTube subscriber proof |

### Content

| Element | Copy |
|---------|------|
| Badge | Happy Clients |
| H2 | Trusted By Thousands |
| Google card | **4.9** Google Rating · 300+ reviews |
| YouTube card | **50K+** Subscribers on YouTube · Growing community |
| Footer line | Join our community of satisfied customers |

### Assets

| Asset | Path |
|-------|------|
| Heart badge | `/assets/mlg2rlvn-hca6p1f.svg` |
| Google icon | `/assets/mlg2rlvn-y8dzcdj.svg` |
| Star (full) | `/assets/mlg2rlvn-ydd7c9s.svg` |
| Star parts (5th) | `/assets/mlg2rlvn-e3qdktq.svg`, `/assets/mlg2rlvn-4rn9huc.svg` |
| YouTube icon | `/assets/mlg2s3tl-vsuwlea.svg` |

---

## Section 8 — World’s Finest Thinnest Hair Systems

| | |
|--|--|
| **File** | `WorldsFinestHairSystems.tsx` |
| **Purpose** | Video gallery of thinnest hair-system product samples |

### Content

- **H2:** World's Finest Thinnest Hair Systems

### Assets (12 Gumlet embeds)

| # | Embed ID fragment |
|---|-------------------|
| 1–3 | `69dc87687e5487dd1d91c6b9`, `69dc879b7e5487dd1d91cb18`, `69dc879be556529568bbc72d` |
| 4–6 | `69dc8768c6b8ccb79da81316`, `…da81338`, `…91c69a` |
| 7–9 | `…da81314`, `…da81336`, `…91c6a6` |
| 10–12 | `…91c6ab`, `…bbc2c3`, `…da8133d` |

### Interaction / responsive

- Mobile: first **8** videos + dots/arrows (334px, 4:5)
- Desktop: all **12** horizontal scroll (260px, 4:5)

---

## Section 9 — Real Hair or Illusion?

| | |
|--|--|
| **File** | `RealHairIllusion.tsx` |
| **Purpose** | Comparison video — real hair vs system illusion |

### Content

- **H2:** Real Hair or Illusion? · Watch & Decide

### Assets

| Viewport | Gumlet |
|----------|--------|
| Mobile (4:3) | `https://play.gumlet.io/embed/69dc8fdfc6b8ccb79da8cd90?...` |
| Desktop (16:9) | `https://play.gumlet.io/embed/69dc8c957e5487dd1d9236bd?...` |

---

## Section 10 — Problem Agitation

| | |
|--|--|
| **File** | `ProblemAgitation.tsx` |
| **Purpose** | Empathy / problem list ending in guidance CTA |

### Content

| Element | Copy |
|---------|------|
| H2 | This Might Sound Like Your Story |
| Problem 1 | If you are tired of feeling self-conscious about your hair. |
| Problem 2 | If you avoid photos, mirrors, or social events. |
| Problem 3 | If you have tried oils, pills, & shampoos that never worked. |
| Problem 4 | If surgery feels too risky, complicated, or overwhelming. |
| Problem 5 | If you want a natural-looking, pain-free solution. |
| Solution card H3 | If Yes, we’ll guide you |
| Body | Need clarity? Our consultant will guide you step by step… Zero pressure. All clarity. |
| CTA | Get Guidance Now → `#contact-form` |

### Assets

| Icon | Path |
|------|------|
| Problem 1–5 | `/assets/mkxm0e5w-1bk6g5t.svg`, `…uovbby5.svg`, `…nsel7fg.svg`, `…uo9nrbl.svg`, `…y3fs1p1.svg` |
| Smile (solution) | `/assets/mkxm0e5w-6vwx9ht.svg` |

---

## Section 11 — Services

| | |
|--|--|
| **Files** | `Services.tsx`, `servicesAssets.ts` |
| **Purpose** | Accordion of three core service offerings |

### Content

- **H2:** Explore Our Trusted Range Of Hair Services

| Service | Description | Link | Icon | Desktop image | Mobile image |
|---------|-------------|------|------|---------------|--------------|
| Non-Surgical Hair Replacement | Natural hair systems, no surgery with perfectly blended and built to restore confidence. | `/hair-patch-vs-hair-system` | `/assets/mkxm0e5w-s3t7ehh.svg` | R2 `non sergical hairline.png` | `NON SERGICAL.png` |
| Scalp Micro Pigmentation | A non-invasive treatment that uses micro-needles to deposit pigment into the scalp… | `/scalp-micropigmentation` | `/assets/mkxm0e5w-bjikbwk.png` | R2 `smp.png` | `SMP.png` |
| Hair Transplant | A permanent solution for hair loss, moving hair follicles from a donor area… | `/hair-transplant` | `/assets/mkxm0e5w-wrbhjc8.svg` | R2 `hair transplant.png` | `TRANSPLANT.png` |

**CTA on each card:** Explore Now  

### Interaction

- Accordion (one active) · Mobile image above list · Desktop large side preview

---

## Section 12 — Process

| | |
|--|--|
| **File** | `Process.tsx` |
| **Purpose** | Three-step journey to natural hair |

### Content

| Element | Copy |
|---------|------|
| H2 | The Step-by-Step Process to Natural Hair |
| Step 1 | **Consultation** — Meet our expert to discuss your hair goals |
| Step 2 | **Customization** — Get a solution tailored exactly for you |
| Step 3 | **Transformation** — See your new look come alive instantly |
| CTA | Discuss With a Consultant → `#contact-form` |

### Assets

| Viewport | Gumlet |
|----------|--------|
| Mobile (4:5) | `https://play.gumlet.io/embed/69dc8fdfc6b8ccb79da8cd92?...` |
| Desktop (4:3) | `https://play.gumlet.io/embed/69dc8fdfc6b8ccb79da8cd90?...` |

> Note: Desktop process video ID matches Real Hair Illusion **mobile** embed.

---

## Section 13 — Trusted Methods

| | |
|--|--|
| **Files** | `TrustedMethods/TrustedMethods.tsx`, `trustedMethodsAssets.ts` |
| **Purpose** | Stick-on vs clip-on method accordion |

### Content

- **H2:** Our Trusted Methods For A Natural Look

| Method | Body | Link | Desktop image | Mobile image |
|--------|------|------|---------------|--------------|
| Stick-On Hair Systems | No clips, no hassle, just stick, style, and go… | `/clip-on-or-stick-on/stick-on-hair-system` | R2 `stick on hair system changes.png` | `STICK  ON.png` |
| Clip-On Hair Systems | Secure, stylish, and removable in seconds… | `/clip-on-or-stick-on/clip-on-hair-system` | R2 `clip3 on hair system changes.png` | `CLIP ON.png` |

**CTA:** Explore Now · Icons are inline SVGs  

---

## Section 14 — Why Choose Us

| | |
|--|--|
| **File** | `WhyChooseUs/WhyChooseUs.tsx` |
| **Purpose** | Four reason cards in a carousel |

### Content

- **H2:** Why Thousands Of Men Choose American Hairline

| Card | Summary of body |
|------|-----------------|
| India’s #1 Top Experts | Non-surgical hair systems for Indian men · 100% human hair · ISO certified |
| Tailored with Technology | Invisible Hairline Sculpting™ · Nano Fusion Technology · Single-strand Implantation |
| Celebrity-Trusted | Bollywood / public figures · virtually invisible · USA-manufactured · doctor approved |
| Genuine Guidance | No pressure · durability · natural looking · undetectable |

### Assets

- Inline gradient SVG icons only (no external image files)

### Interaction

- Mobile snap carousel · Desktop drag + arrows

---

## Section 15 — Locations

| | |
|--|--|
| **Files** | `Locations.tsx`, `shared/locationSalonAssets.ts` |
| **Purpose** | Premium salon cities accordion |

### Content

- **H2:** Walk Into Any of Our Premium Salons
- **CTA:** Get Direction → `/contact-us`

| City | Address |
|------|---------|
| Mumbai | Saffron Building, 202, Linking Rd, above Anushree Reddy Store, Khar (W), Mumbai- 52 |
| Delhi | Plot No. 2, 2nd Floor, Main Road, Hudson Lane, GTB Nagar, Delhi - 110009 |
| Bangalore | 2nd Floor, 12th Main Rd, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560008 |

### Assets

| Asset | Path |
|-------|------|
| Shared salon photo (all cities) | R2 `media/runtime-premium-salon-showcase.png` |
| Alt | Interior view of an American Hairline premium salon. |
| City icons | Inline SVGs |

---

## Section 16 — FAQ

| | |
|--|--|
| **File** | `FAQ.tsx` |
| **Purpose** | Tabbed FAQ accordion + guidance CTA |

### Content

- **H2:** Frequently Asked Questions  
- **Tabs:** Consultation · Hair System  

#### Consultation tab

1. **How long does the consultation take?** — Usually 30 to 45 minutes…  
2. **What happens in the consultation?** — We assess your hair loss condition…  
3. **Is it an in-person or online consultation?** — We offer both…  
4. **Will I get to see real samples or demos?** — Yes…  
5. **Will I be pressured to buy during the consultation?** — Absolutely not…  
6. **Will I know the total cost after the consultation?** — Yes, transparent cost breakdown…  

#### Hair System tab

1. **How long does a hair system last?** — Typically 3 to 6 months  
2. **Can I swim and shower with it?** — Yes, securely bonded…  
3. **Does it look natural?** — Designed to be undetectable…  
4. **How often do I need maintenance?** — Every 3–4 weeks…  
5. **Can I style it like my own hair?** — Yes…  
6. **Is it comfortable to wear?** — Lightweight and breathable…  

**Bottom CTA card:** Still have questions? · No worries, we’re here to guide you… · **Need Guidance** → `#contact-form`

### Assets

- Lucide `ArrowUpRight` + inline plus/cross SVGs

---

## Section 17 — Contact Form

| | |
|--|--|
| **File** | `ContactForm.tsx` |
| **Anchor** | `#contact-form` (target for most homepage CTAs) |
| **Purpose** | Homepage lead capture |

### Content

| Element | Copy |
|---------|------|
| H2 | Fill This Form to Get the Right Guidance |
| Fields | Name · Phone Number · City |
| Placeholders | Full Name · 98765 43210 · Please select |
| Default country | `+91` (from `COUNTRY_CODES`) |
| Default cities | Mumbai · Delhi · Bangalore · Other |
| Submit | Submit |

### Assets / tech

- Cloudflare Turnstile widget  
- Inline submit arrow SVG  
- react-hook-form + zod · posts via `api.submitContactForm` · thank-you redirect · UTM/tracking  

---

## Section 18 — Free eBook

| | |
|--|--|
| **Files** | `Ebook.tsx`, `shared/EbookSection.tsx`, `shared/ebookAssets.ts`, `shared/EbookModal.tsx` |
| **Purpose** | Free ebook promo that opens a modal with Google Form CTA |

### Section content

| Element | Copy |
|---------|------|
| Badge | Free eBook |
| H2 | **The Easy Guide** to Choosing the Right Hair System |
| Hover tip (lg+) | Tap to read more |
| Image alt | The Ultimate Guide to Choosing the Perfect Hair System |

### Modal content

| Element | Copy |
|---------|------|
| Title | The Easy Guide to choosing the right hair system |
| Body | This simple guide shows you how to avoid mistakes and choose the best option for your hair. |
| Learn 1 | Natural-Looking Results — realistic hairline, density, texture |
| Learn 2 | Safe & Comfortable Wear — secure bases for daily use |
| Learn 3 | Avoid Common Mistakes — what people get wrong selecting a hair patch |
| Learn 4 | Design over Product — custom design drives results |
| CTA | Get Your Free E-Book → `https://forms.gle/e6GCEz3SrWSK7EvGA` |

### Assets

| Asset | Path |
|-------|------|
| Desktop cover | R2 `media/ebook.png` |
| Mobile cover | R2 `media/ebook-1.png` |

---

## Homepage CTA map (common destinations)

| Destination | Used by |
|-------------|---------|
| `#contact-form` | Hero, Stats, Checklist (mobile), Problem Agitation, Process, FAQ |
| WhatsApp `917208329070` | Hero |
| `/hair-patch-vs-hair-system` | Services (Non-Surgical) |
| `/scalp-micropigmentation` | Services (SMP) |
| `/hair-transplant` | Services (Transplant) |
| `/clip-on-or-stick-on/stick-on-hair-system` | Trusted Methods |
| `/clip-on-or-stick-on/clip-on-hair-system` | Trusted Methods |
| `/contact-us` | Locations “Get Direction” |
| Google Form ebook | Ebook modal |

---

## Quick asset summary by type

| Type | Where used |
|------|------------|
| **Local `/assets/*.svg|png`** | Navbar, Footer, Hero icons, SocialProof, Problem icons, Service icons |
| **R2 photos** | Hero avatars/carousel, NaturalHairline banner, Achievements, Services images, Trusted Methods, Locations salon, Ebook covers |
| **Gumlet videos** | NaturalHairline, Checklist, Gallery, WorldsFinest, RealHairIllusion, Process |

---

## Related testing page (not production homepage)

`/homepage-testing` mirrors these 18 sections and currently also inserts an experimental **`HairPatchAnimation`** between Natural Hairline Secret and Achievements. That animation is **not** on the live `/` homepage.
