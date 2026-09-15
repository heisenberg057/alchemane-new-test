# Deployment Guide — Docker VPS (americanhairline.com)

This app deploys as **Nginx + Next.js (Payload) + Postgres + Redis** via Docker Compose.

## 0. After a clean OS reinstall (security first)

Do this **before** deploying the site:

```bash
# 1) Change root password immediately (never reuse chat/ticket passwords)
passwd

# 2) Install baseline packages
apt update && apt upgrade -y
apt install -y git curl ufw fail2ban

# 3) Firewall — only SSH + HTTP/HTTPS
ufw default deny incoming
ufw default allow outgoing
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# 4) Install Docker
curl -fsSL https://get.docker.com | sh
systemctl enable --now docker

# 5) Prefer SSH keys; disable password login once keys work
#    (add your pubkey to ~/.ssh/authorized_keys first)
# sed -i 's/^#\?PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config
# systemctl reload ssh
```

## 1. Server prerequisites

- Ubuntu 22.04+ / 24.04 (clean image)
- Docker + Docker Compose v2
- DNS for `americanhairline.com` and `www` pointing at this VPS
- Ports **80** and **443** open (and **22** for SSH)
- UFW enabled (see §0)

## 2. Clone + env

```bash
git clone https://github.com/ahl-official/ahl-new-website.git /opt/ahl
cd /opt/ahl/AmericanHairline-Unified
cp .env.example .env
nano .env   # fill ALL required secrets
```

**Required in production `.env`:**

| Variable | Notes |
|----------|--------|
| `NEXT_PUBLIC_APP_URL` | `https://americanhairline.com` |
| `NEXTAUTH_URL` | same as APP_URL |
| `DATABASE_URL` | host must be `postgres` inside Compose |
| `POSTGRES_USER` / `PASSWORD` / `DB` | Compose DB |
| `PAYLOAD_SECRET` / `NEXTAUTH_SECRET` / `REVALIDATION_SECRET` / `GDPR_TOKEN_SECRET` | long random |
| `R2_*` + `NEXT_PUBLIC_R2_PUBLIC_URL` | media |
| `TURNSTILE_*` | forms |
| `RESEND_API_KEY` / `RESEND_FROM_EMAIL` / `ADMIN_EMAIL` | email |

Never commit real `.env`. Rotate any secret that was pasted in chat.

## 3. TLS certificates (before HTTPS nginx will work)

```bash
sudo mkdir -p /var/www/certbot
# Temporarily comment the HTTPS server block in nginx.conf OR start with HTTP-only
# bootstrap, then:
sudo certbot certonly --webroot -w /var/www/certbot \
  -d americanhairline.com -d www.americanhairline.com
```

Cert paths expected by `nginx.conf`:

- `/etc/letsencrypt/live/americanhairline.com/fullchain.pem`
- `/etc/letsencrypt/live/americanhairline.com/privkey.pem`

## 4. Deploy

```bash
chmod +x deploy.sh
./deploy.sh
```

This builds the image (baking `NEXT_PUBLIC_*` only — secrets stay runtime), starts services, runs Payload migrations, and health-checks `/api/health?deep=1`.

## 5. Post-deploy smoke checklist

```bash
curl -I https://americanhairline.com
curl -I https://www.americanhairline.com          # → 301 to apex
curl https://americanhairline.com/robots.txt      # Sitemap host = americanhairline.com
curl https://americanhairline.com/sitemap.xml | head
curl https://americanhairline.com/api/health
curl https://americanhairline.com/api/health?deep=1
curl -I https://americanhairline.com/media/<any-homepage-asset>
```

Also verify:

- Homepage hero media loads (R2 rewrite)
- `/admin` login works
- Contact form submits (Turnstile)
- No `localhost` in view-source canonical / OG / sitemap

## 6. DNS cutover

1. Lower TTL on old DNS a day ahead
2. Point A/AAAA for apex + www to new VPS
3. Keep old host briefly; `new.americanhairline.com` HTTP redirects to apex
4. Search Console → submit `https://americanhairline.com/sitemap.xml`

## 7. Database migration from old server

```bash
# On old server
docker exec ah_postgres pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" > ahl.dump.sql

# On new server (after first compose up creates empty volume)
docker exec -i ah_postgres psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" < ahl.dump.sql
./deploy.sh   # or: docker compose restart web && docker compose exec web npm run payload:migrate
```

## 8. Important notes

- Homepage media uses **absolute R2/CDN URLs** + prebuilt `.w{400|800|1200}.webp` (see `src/lib/media/cdn.ts`). Browsers should not pull multi‑MB PNGs through the VPS.
- Generate/upload WebP variants: `npm run optimize:homepage-media` (needs R2 credentials in `.env.local`).
- After DNS: set `NEXT_PUBLIC_MEDIA_CDN_URL=https://media.americanhairline.com` and `NEXT_PUBLIC_MEDIA_IMAGE_RESIZE=1`, then rebuild.
- Heavy homepage videos (process / decide / client stories) are poster-only until Gumlet IDs are pasted in the section `content.ts` files.
- `public/media` is **gitignored**; production serves leftovers via rewrite to `NEXT_PUBLIC_R2_PUBLIC_URL` for legacy paths only.
- Rebuild the web image whenever `NEXT_PUBLIC_*` values change (they are compile-time).
- Do **not** set `NEXT_PUBLIC_APP_URL` / `NEXTAUTH_URL` to localhost in production — startup validation will reject it.
- Rotate any secrets that were shared in chat before go-live.
- If the VPS was previously compromised, **always reinstall OS** before production cutover.
- Until TLS is ready, keep `docker-compose.override.yml` + `nginx.bootstrap.conf` (HTTP-only).
