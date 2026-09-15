# Backend Production Readiness Plan (End-to-End)

This plan is the end-to-end work needed to make the backend production-ready in a repeatable, safe way (local → staging → production), with clear acceptance checks.

## 0) Goals and Scope

### Goals
- Deploy backend reliably with zero manual steps besides providing secrets and running deploy.
- Ensure security posture is sane by default (auth, cookies, headers, rate limiting, validation).
- Ensure runtime correctness across restarts and scale-out (DB, migrations, Redis, background jobs).
- Ensure observability for troubleshooting (logs, request IDs, health, metrics hooks).
- Ensure CI gates catch regressions (tests, schema validation, migrations).

### Out of scope (unless requested)
- Re-architecting the domain model and rewriting business logic.
- Multi-region active-active architecture.
- Full SOC2-level controls.

## 1) Environment & Secrets Standardization

### Work
- Define a single authoritative env contract (what is required in prod vs optional in dev/test).
- Ensure all modules use validated env values instead of ad-hoc `process.env.*`.
- Classify env vars into:
  - Required in production
  - Optional with safe defaults
  - Feature flags (explicit on/off)
- Ensure no secrets are committed:
  - Remove any tracked exports/backups/logs/dev DB files from repo history going forward.
  - Add `.gitignore` coverage for generated artifacts.

### Acceptance criteria
- Backend fails fast on startup when a production-required env var is missing (clear error).
- `.env.example` is complete and matches runtime usage.
- A grep for `process.env.` usage shows either:
  - It references the env module, or
  - It is in an explicitly approved place (very small exceptions).

## 2) Database: Postgres, Migrations, and Safe Startup

### Work
- Confirm Prisma datasource and migration workflow is production-safe:
  - `prisma migrate deploy` used in production startup.
  - No `db push --accept-data-loss` in production paths.
- Ensure Prisma client engine compatibility for the target runtime environment(s).
- Make schema changes follow:
  - Migration file generated in dev
  - Applied in staging
  - Promoted to production
- Define a “fresh deploy” story:
  - Empty DB → migrate deploy → service starts successfully.

### Acceptance criteria
- Production container can start against:
  - Fresh Postgres (no schema) and existing Postgres (schema already migrated).
- All migrations apply without manual intervention.
- Prisma generate/validate runs in CI.

## 3) Redis: Caching + Rate Limiting in a Scaled Setup

### Work
- Treat Redis as required for production scale-out, or document single-instance limitations.
- Ensure rate limiting uses Redis store in production; fallback memory store only in local/dev.
- Ensure cache service handles disconnect/reconnect and shutdown cleanly.
- Ensure job queues / cron jobs do not execute concurrently across multiple instances unless intended:
  - Either implement leader-election (Redis-based) or disable cron in multi-instance mode.

### Acceptance criteria
- With multiple backend instances, rate limits are consistent across instances.
- Cache and rate limiter do not crash the process when Redis is briefly unavailable.
- There is a documented approach for cron execution (single instance vs leader lock).

## 4) Authentication, Cookies, and Session Safety

### Work
- Confirm cookie settings are deploy-topology safe:
  - `SameSite`, `Secure`, `Domain`, `Path` are configurable via env.
  - Enforce secure combination rules (e.g. `SameSite=None` requires `Secure=true`).
- Confirm refresh-token flow correctness:
  - Rotation works, revoked tokens fail, expiration enforced.
  - Clear-cookie uses the same cookie attributes used to set-cookie.
- Decide and enforce signup policy:
  - If public signup is not desired in production, gate `/register` (disable or admin-only).
- Ensure admin-only routes verify role and return consistent errors.

### Acceptance criteria
- Local dev (http) works with lax cookies.
- Production (https) works with intended cookie policy and CORS credentials.
- Refresh flow works with cookie-only requests.
- Admin access cannot be achieved without proper role.

## 5) API Security Hardening

### Work
- Validate and sanitize input without breaking normal content:
  - HTML sanitization policy clearly documented (what tags/attrs allowed).
  - Reduce false positives in injection detection; prefer schema validation and parameterized DB access.
- Security headers:
  - Keep Helmet baseline.
  - Tighten CSP for production (or make it environment-configurable with strict defaults).
- Rate limiting policies:
  - Separate policies for auth endpoints, public content endpoints, admin endpoints.
- File uploads:
  - Validate size, mime type, and storage destination.
  - Prevent path traversal, ensure safe public URLs, avoid logging user content.

### Acceptance criteria
- Security tests cover injection and basic XSS expectations.
- Headers present on all routes.
- Rate limiting is enforced and observable (logs/metrics).

## 6) Email & External Integrations

### Work
- Ensure email provider config is correct in production (SMTP/API provider).
- Ensure that in production we do not silently “simulate” email unless explicitly configured.
- Ensure that admin notification emails (like contact form) require `ADMIN_EMAIL` (or fallback behavior is explicit).
- Add resilience:
  - Retries, timeouts, and logging around external calls (OpenRouter, Cloudinary, analytics APIs).

### Acceptance criteria
- Missing email config in production causes a clear warning or a startup failure depending on feature flag.
- Email send failures do not crash the request (but are logged and traceable by request ID).

## 7) Backups and Data Protection

### Work
- Decide backup strategy:
  - Prefer managed Postgres backups (recommended) OR run `pg_dump` from a dedicated job image.
- If app-level backups remain:
  - Ensure `pg_dump` tooling exists in runtime.
  - Write to durable storage (S3/volume), not container filesystem.
  - Encrypt backups at rest, keep retention policy, and log backup events.
- Ensure encryption keys are stable across restarts:
  - Require `ENCRYPTION_KEY` in production.

### Acceptance criteria
- There is an explicit documented backup method and recovery test steps.
- Backups do not run unexpectedly (feature flag required).

## 8) Observability: Logging, Tracing, Health, and Alerts

### Work
- Logging:
  - Console logs as default for containers.
  - Optional file logging behind a flag.
  - Avoid logging secrets; redact known sensitive fields.
- Health endpoints:
  - Basic health returns 200 quickly.
  - Deep health checks DB/Redis and requires auth (or internal-only protection).
- Add request correlation:
  - Ensure request-id is propagated and included in logs.
- Monitoring hooks:
  - Response-time, error-rate, and DB connectivity checks.

### Acceptance criteria
- You can diagnose a failed request end-to-end using request ID in logs.
- Liveness and readiness are distinguishable and reliable.

## 9) Docker/Compose and Production Deployment Topology

### Work
- Define production runbook:
  - Container build, env injection, secrets management.
  - Migration deploy step.
  - Rolling deployment strategy (avoid downtime).
- Ensure docker-compose is “local production-like” only:
  - Uses env_file for local.
  - Does not hardcode secrets for real production.
- Confirm port mappings and reverse proxy compatibility.

### Acceptance criteria
- One command can bring up local production-like stack (API + Postgres + Redis).
- Production deployment does not depend on dev defaults or committed .env files.

## 10) Test Strategy and CI Gates (Mandatory)

### Work
- Test tiers:
  - Smoke tests (no DB required)
  - Integration tests (Postgres + Redis)
  - Security tests (auth/rate-limit/injection/basic XSS expectations)
  - Optional load test (non-blocking, reports only)
- CI tasks:
  - `prisma validate`
  - `prisma generate`
  - run smoke tests always
  - run integration tests on demand or on main branch merges
  - coverage reporting (non-blocking or enforced threshold based on team decision)

### Acceptance criteria
- CI fails on schema invalidity and failing tests.
- Tests are deterministic (no flakiness from rate limits/timers).

## 11) Documentation and Operational Runbooks

### Work
- Update backend README with:
  - local dev setup (DB/Redis)
  - env variables table (required/optional)
  - production deployment steps
  - how to rotate secrets (JWT, encryption, email)
  - how to create or reset admin accounts safely
- Add a “production checklist” document that maps to the acceptance criteria.

### Acceptance criteria
- A new developer can run backend locally and understand deployment requirements from docs alone.

## 12) Final Production Readiness Verification (Go/No-Go)

### Staging verification (must pass)
- Deploy to staging with production-like env vars.
- Validate:
  - migrations applied
  - login + refresh flow
  - admin-only endpoints protected
  - CORS + cookies work from staging frontend domain
  - email sends (or disabled explicitly)
  - rate limiting enforced and stored in Redis
  - health endpoints reflect DB/Redis status

### Production verification (must pass)
- Deploy with rolling strategy.
- Confirm:
  - error rate normal
  - health ready
  - logs show request IDs and no secrets
  - post-deploy smoke checks pass

