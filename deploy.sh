#!/usr/bin/env bash
set -euo pipefail

# ── American Hairline VPS Deploy Script ──────────────────────────────────────
# Usage: ./deploy.sh
# Requires: docker, docker compose v2, production `.env` in this directory

COMPOSE="docker compose"
APP_SERVICE="web"
HEALTH_URL="http://127.0.0.1:3000/api/health?deep=1"
HEALTH_RETRIES=30
HEALTH_WAIT=5

require_env() {
  local key="$1"
  if [[ -z "${!key:-}" ]]; then
    echo "ERROR: Missing required env var: $key"
    echo "       Set it in .env before deploying."
    exit 1
  fi
}

if [[ ! -f .env ]]; then
  echo "ERROR: .env not found. Copy .env.example → .env and fill production values."
  exit 1
fi

# shellcheck disable=SC1091
set -a
source .env
set +a

echo "==> Preflight: required production env"
require_env DATABASE_URL
require_env NEXT_PUBLIC_APP_URL
require_env NEXTAUTH_URL
require_env PAYLOAD_SECRET
require_env NEXTAUTH_SECRET
require_env REVALIDATION_SECRET
require_env POSTGRES_USER
require_env POSTGRES_PASSWORD
require_env POSTGRES_DB
require_env R2_ACCESS_KEY_ID
require_env R2_SECRET_ACCESS_KEY
require_env R2_BUCKET_NAME
require_env R2_ENDPOINT
require_env NEXT_PUBLIC_R2_PUBLIC_URL
require_env TURNSTILE_SECRET_KEY
require_env NEXT_PUBLIC_TURNSTILE_SITE_KEY
require_env RESEND_API_KEY
require_env RESEND_FROM_EMAIL
require_env ADMIN_EMAIL
require_env GDPR_TOKEN_SECRET

if [[ "$DATABASE_URL" != *"@postgres:"* && "$DATABASE_URL" != *"@ah_postgres:"* ]]; then
  echo "WARNING: DATABASE_URL host should be 'postgres' inside Docker Compose."
  echo "         Current: $DATABASE_URL"
fi

if [[ "$NEXT_PUBLIC_APP_URL" != "https://americanhairline.com" ]]; then
  echo "WARNING: NEXT_PUBLIC_APP_URL is '$NEXT_PUBLIC_APP_URL'"
  echo "         Expected https://americanhairline.com for production cutover."
fi

if [[ "$NEXTAUTH_URL" != "https://americanhairline.com" ]]; then
  echo "WARNING: NEXTAUTH_URL is '$NEXTAUTH_URL'"
  echo "         Expected https://americanhairline.com for production cutover."
fi

echo "==> Pulling latest code..."
git pull

echo "==> Building application image..."
$COMPOSE build $APP_SERVICE

echo "==> Starting services..."
$COMPOSE up -d

echo "==> Running database migrations..."
if ! $COMPOSE exec -T $APP_SERVICE npm run payload:migrate; then
  echo "ERROR: Migrations failed. Check logs before continuing."
  $COMPOSE logs --tail=80 $APP_SERVICE
  exit 1
fi

echo "==> Waiting for app to become healthy..."
for i in $(seq 1 $HEALTH_RETRIES); do
  if $COMPOSE exec -T $APP_SERVICE wget -qO- "$HEALTH_URL" > /dev/null 2>&1; then
    echo "==> App is healthy."
    break
  fi
  if [ "$i" -eq "$HEALTH_RETRIES" ]; then
    echo "ERROR: App did not become healthy after $((HEALTH_RETRIES * HEALTH_WAIT))s"
    echo "==> Recent logs:"
    $COMPOSE logs --tail=80 $APP_SERVICE
    exit 1
  fi
  echo "    Waiting... ($i/$HEALTH_RETRIES)"
  sleep $HEALTH_WAIT
done

echo "==> Smoke checks"
$COMPOSE exec -T $APP_SERVICE wget -qO- "http://127.0.0.1:3000/robots.txt" | head -20 || true
$COMPOSE exec -T $APP_SERVICE wget -qO- "http://127.0.0.1:3000/api/health" || true

echo ""
echo "==> Deploy complete."
echo "    Confirm DNS A/AAAA for americanhairline.com (+ www) point at this VPS."
echo "    Confirm TLS: certbot cert for americanhairline.com (include www)."
echo "    Run '$COMPOSE logs -f $APP_SERVICE' to follow logs."
