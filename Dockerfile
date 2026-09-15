# ── Stage 1: Install all dependencies ────────────────────────────────────────
FROM node:22-alpine AS deps
WORKDIR /app

COPY package*.json ./
RUN npm ci --legacy-peer-deps

# ── Stage 2: Build the application ───────────────────────────────────────────
FROM node:22-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
# Skip strict secret validation during image build; runtime env is authoritative.
ENV SKIP_ENV_VALIDATION=1

# Build-time env vars (NEXT_PUBLIC_* are baked into the client bundle).
# Secrets must NOT be passed as build args — they live only in runtime env.
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_R2_PUBLIC_URL
ARG NEXT_PUBLIC_TURNSTILE_SITE_KEY
ARG NEXT_PUBLIC_GTM_ID
ARG NEXT_PUBLIC_GA_ID
ARG NEXT_PUBLIC_FB_PIXEL_ID

ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_R2_PUBLIC_URL=$NEXT_PUBLIC_R2_PUBLIC_URL
ENV NEXT_PUBLIC_TURNSTILE_SITE_KEY=$NEXT_PUBLIC_TURNSTILE_SITE_KEY
ENV NEXT_PUBLIC_GTM_ID=$NEXT_PUBLIC_GTM_ID
ENV NEXT_PUBLIC_GA_ID=$NEXT_PUBLIC_GA_ID
ENV NEXT_PUBLIC_FB_PIXEL_ID=$NEXT_PUBLIC_FB_PIXEL_ID
# Inert placeholders so Payload/Next config can import during build without
# real credentials ending up in image layers from host ARGs.
ENV PAYLOAD_SECRET=build-placeholder-not-used-at-runtime
ENV DATABASE_URL=postgresql://build:build@127.0.0.1:5432/build
ENV NEXTAUTH_SECRET=build-placeholder-not-used-at-runtime
ENV NEXTAUTH_URL=http://127.0.0.1:3000
ENV REVALIDATION_SECRET=build-placeholder-not-used-at-runtime

RUN npm run build

# ── Stage 3: Production runtime ──────────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# wget for Docker healthchecks; libc6-compat for sharp on Alpine
RUN apk add --no-cache wget libc6-compat && \
    addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy only what the runtime needs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# Needed for Payload CLI migrations in production
COPY --from=builder --chown=nextjs:nodejs /app/tsconfig.json ./tsconfig.json
COPY --from=builder --chown=nextjs:nodejs /app/src ./src
COPY --from=builder --chown=nextjs:nodejs /app/scripts ./scripts
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
RUN mkdir -p /app/reports /app/tmp && chown -R nextjs:nodejs /app/reports /app/tmp

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
