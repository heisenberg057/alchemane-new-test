| Route | Method | What it does (1 line) | Status |
|---|---|---|---|
| `/:slug*` | `GET,POST,PATCH,DELETE,PUT` | Route handler | Working |
| `/admin/bootstrap-session` | `POST` | Route handler | Working |
| `/ai-seo/citation-history/:id` | `GET` | Payload ai-citation-tests | Working |
| `/ai-seo/dashboard` | `GET` | Payload ai-citation-tests,posts | Stubbed |
| `/ai-seo/faqs/:id` | `POST` | FAQs generated | Working |
| `/ai-seo/generate/meta-description` | `POST` | Route handler | Working |
| `/ai-seo/generate/seo-title` | `POST` | Route handler | Working |
| `/ai-seo/optimize-all` | `POST` | Batch optimization finished | Working |
| `/ai-seo/optimize/:id` | `POST` | Route handler | Working |
| `/ai-seo/status/:id` | `GET` | Payload posts | Working |
| `/ai-seo/suggestions/:id` | `GET` | Payload posts | Working |
| `/ai-seo/test-citation/:id` | `POST` | Citation tests completed | Working |
| `/analytics/overview` | `GET` | Success | Working |
| `/analytics/pageview` | `POST` | Payload analytics | Working |
| `/analytics/posts` | `GET` | Payload analytics | Working |
| `/auth/:...nextauth` | `` | Route handler | Working |
| `/auth/refresh-token` | `POST` | Route handler | Working |
| `/calculator/cost` | `POST` | Calculation successful | Working |
| `/calculator/estimate-grafts` | `POST` | Estimation successful | Stubbed |
| `/calculator/save` | `POST` | Payload calculators | Working |
| `/calculator/stats` | `GET` | Payload calculators | Working |
| `/comments` | `POST` | Comment created | Working |
| `/forms/newsletter` | `POST` | Subscribed successfully | Working |
| `/forms/submit` | `POST` | Form submitted successfully | Working |
| `/gdpr/delete` | `POST` | Route handler | Working |
| `/gdpr/export` | `POST` | Route handler | Working |
| `/gdpr/verify` | `GET` | Route handler | Working |
| `/health` | `GET` | Route handler | Working |
| `/health/deep` | `GET` | Payload posts | Working |
| `/lead-optimization/dashboard` | `GET` | Payload form-abandonments,exit-intents,conversion-events,calculators | Working |
| `/lead-optimization/exit-intent/content` | `GET` | Exit intent content retrieved | Working |
| `/lead-optimization/track/conversion` | `POST` | Conversion event tracked | Working |
| `/lead-optimization/track/trigger` | `POST` | Trigger tracked | Working |
| `/lead-optimization/triggers/rules` | `POST` | Trigger rules retrieved | Working |
| `/lead-scoring/hot-leads` | `GET` | Route handler | Working |
| `/lead-scoring/score-all` | `POST` | Route handler | Working |
| `/lead-scoring/score/:id` | `GET,POST` | Lead scored successfully | Working |
| `/lead-scoring/track/abandonment` | `POST` | Abandonment tracked | Working |
| `/lead-scoring/track/event` | `POST` | Payload conversion-events | Working |
| `/lead-scoring/track/exit-intent` | `POST` | Exit intent recorded | Working |
| `/media/:id/usage` | `GET` | Payload media,posts | Working |
| `/media/audit/unused` | `GET` | Payload posts,media | Working |
| `/media/bulk-delete` | `POST` | Payload media | Working |
| `/performance/cache/clear` | `POST` | Cache cleared | Working |
| `/performance/cache/stats` | `GET` | Route handler | Working |
| `/performance/database/stats` | `GET` | Route handler | Working |
| `/performance/metrics` | `GET` | Route handler | Working |
| `/posts/:id/autosave` | `PATCH` | Autosaved | Working |
| `/posts/:id/publish` | `PATCH` | Published | Working |
| `/posts/slug/:slug` | `GET` | Payload posts | Working |
| `/queue/worker` | `POST` | SEO BullMQ worker started | Working |
| `/search-optimization/analysis/:id` | `GET` | Payload seo-analyses | Working |
| `/search-optimization/analyze-all` | `GET,POST` | Analysis queued. Jobs are running in the background. | Working |
| `/search-optimization/analyze-draft` | `POST` | Draft analyzed | Working |
| `/search-optimization/analyze/:id` | `POST` | Analysis complete | Working |
| `/search-optimization/keywords` | `GET` | Payload keywords | Working |
| `/search-optimization/keywords/:keyword/history` | `GET` | Payload keywords | Working |
| `/search-optimization/keywords/track` | `POST` | Keyword tracked | Stubbed |
| `/search-optimization/links` | `POST` | Internal link created | Working |
| `/search-optimization/links/suggestions/:id` | `GET` | Payload posts | Stubbed |
| `/search-optimization/overview` | `GET` | Payload posts,seo-analyses | Working |
| `/search-optimization/schema/:id` | `POST` | Payload posts | Stubbed |
| `/security/block-ip` | `POST` | IP blocked | Working |
| `/security/blocked-ips` | `GET` | Route handler | Working |
| `/security/dashboard` | `GET` | Route handler | Working |
| `/security/logs/security` | `GET` | Route handler | Working |
| `/security/unblock-ip` | `POST` | IP unblocked | Working |
| `/tracking/campaigns` | `GET` | Route handler | Working |
| `/tracking/click` | `POST` | Session already tracked | Working |
| `/tracking/clicks/:id` | `GET` | Route handler | Working |
| `/tracking/conversion` | `POST` | Conversion tracked successfully | Working |
| `/tracking/performance` | `GET` | Route handler | Working |
| `/users` | `POST` | Payload users | Working |
| `/users/login` | `POST` | Route handler | Working |
| `/users/me` | `GET` | User fetched | Working |
| `/webhooks` | `GET,POST` | Payload webhooks | Working |
| `/webhooks/:id` | `GET,DELETE,PUT` | Webhook deleted | Working |
| `/webhooks/:id/logs` | `GET` | Payload webhooks,webhook-logs | Working |
| `/webhooks/:id/test` | `POST` | Route handler | Working |
| `/webhooks/events` | `GET` | Route handler | Working |
| `/webhooks/logs/:id/retry` | `POST` | Retry initiated | Working |
| `/webhooks/presets` | `GET` | Route handler | Working |
