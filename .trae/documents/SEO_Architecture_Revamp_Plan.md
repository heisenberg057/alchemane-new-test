# SEO Architecture Revamp Plan

## 1. Problem Statement
The current SEO Dashboard relies on `Screpy`, which has no public API. This forces us to "mock" the service, rendering the Technical SEO features (PageSpeed, Mobile, Broken Links) non-functional. To make the dashboard "Live" and "Proper," we need to replace Screpy with reliable, available data sources.

## 2. Proposed Architecture

### A. Technical SEO Engine (Replacement for Screpy)
We will switch to the **Google PageSpeed Insights API (Lighthouse)**.
- **Why?**: It is the industry standard, free, and provides comprehensive metrics.
- **Metrics to Track**:
  - Performance (Core Web Vitals: LCP, CLS, FID)
  - Accessibility
  - Best Practices (HTTPS, meta tags)
  - SEO Score (Google's own evaluation)
- **Implementation**:
  - Create `lighthouse.service.js` to handle API calls.
  - No new dependencies needed (use `axios`).

### B. On-Page & Content Analysis (Enhanced)
We will upgrade the local analysis using robust parsing libraries.
- **Tools**:
  - `cheerio` (New Dependency): For robust HTML parsing (H1, H2, Alt tags, Meta).
  - `OpenRouter` (Existing): For semantic analysis (User intent, Sentiment).
- **Checks**:
  - **Structure**: H1 existence, Heading hierarchy (H1 -> H2 -> H3).
  - **Metadata**: Title length, Meta description length/relevance.
  - **Content**: Word count, Keyword density, Readability (Flesch-Kincaid).
  - **Images**: Alt text presence.
  - **Links**: Internal vs. External link counts.

### C. Keyword Tracking
Since Screpy was also used for this, we will temporarily **disable** the "Keyword Tracker" feature or mark it as "Coming Soon" to avoid broken UX, as building a reliable rank tracker requires paid 3rd party APIs (like DataForSEO or SerpApi). We will focus on On-Page optimization first.

## 3. Implementation Steps

### Phase 1: Dependencies & Cleanup
1.  **Install**: `cheerio` for HTML parsing.
2.  **Remove**: `screpy.service.js` references.
3.  **Database**:
    - Add `lighthouseScore`, `lighthouseData` to `SeoAnalysis` model.
    - Deprecate/Ignore `screpyScore`, `screpyData`.

### Phase 2: Service Development
1.  **Create `lighthouse.service.js`**:
    - Method `analyzeUrl(url)`: Calls Google API.
    - Method `parseResult(data)`: Extracts simplified scores for the dashboard.
2.  **Update `seoAnalysis.service.js`**:
    - Integrate `cheerio` for better local parsing.
    - Switch external call from `screpyService` to `lighthouseService`.
    - Map new data to the Prisma schema.

### Phase 3: Dashboard Update
1.  **Update Frontend**:
    - Rename "Screpy Score" to "Technical Score" or "PageSpeed Score".
    - Display Core Web Vitals (LCP, CLS) if available.

## 4. Verification
- **Test**: Run "Run Full Analysis" on a published post.
- **Expect**: Real PageSpeed scores (0-100) and detailed content feedback.

## 5. Required Keys
- `GOOGLE_PAGESPEED_API_KEY`: Free to generate from Google Cloud Console. (Can run without key with lower rate limits, but key is recommended).

