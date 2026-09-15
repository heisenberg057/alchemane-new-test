# Application Connections & Integrations

Last updated: 2026-03-31

This document reflects the final **single backend** architecture after Express removal.

## 1) Internal Connections (single app backend)

### Frontend to API

- Frontend and API are served from the same Next.js application.
- Base API URL is same-origin: `NEXT_PUBLIC_API_URL=/api`.
- Client transport is `axios` via `src/lib/api/client.ts`.
- Route handlers live under `src/app/api/**/route.ts`.

### API to Data Layer

- API handlers call Payload local API/services for data reads and writes.
- Collections are registered in `src/payload.config.ts`.
- No separate Express server, no cross-service CORS hop.

## 2) Database Connection

- Primary runtime DB is configured through Payload adapters.
- Current config uses Payload SQLite adapter (`payload-db.sqlite`) for local runtime.
- `DATABASE_URL` remains available for tooling and environment consistency.

## 3) External Integrations

### Authentication

- App auth is handled through NextAuth + Payload user endpoints.
- Refresh is bridged through `POST /api/auth/refresh-token`.
- Required secrets: `NEXTAUTH_SECRET`, `PAYLOAD_SECRET`.

### Email

- Provider: Resend when `RESEND_API_KEY` is configured.
- Fallback behavior is safe logging/stub flow when key is absent.
- Used by form notifications and GDPR verification workflow.

### AI SEO

- Provider: OpenRouter via `OPENROUTER_API_KEY`.
- Used by AI SEO optimization and citation test endpoints.

### Caching/Rate-limit Store

- Redis is used when `REDIS_URL` is set.
- Falls back to in-memory behavior when Redis is absent.

### Performance/SEO APIs

- Optional Google PageSpeed integration via `GOOGLE_PAGESPEED_API_KEY`.

## 4) Environment and Runtime

- Local API host: `http://localhost:3000/api`
- App host: `http://localhost:3000`
- Admin host: `http://localhost:3000/admin`

## 5) Production Checklist

1. [ ] Set required env vars (`PAYLOAD_SECRET`, `NEXTAUTH_SECRET`, `NEXT_PUBLIC_API_URL=/api`).
2. [ ] Configure optional integration keys (`RESEND_API_KEY`, `OPENROUTER_API_KEY`, `REDIS_URL`) as needed.
3. [ ] Run `npm run build` and `npm run start`.
4. [ ] Verify `/api/health` and protected admin flows.
5. [ ] Verify webhook test, form submit, and dashboard APIs.