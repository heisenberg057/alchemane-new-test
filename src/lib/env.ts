import { z } from "zod";

const emptyToUndef = (v: unknown) =>
  v === "" || v === undefined ? undefined : v;

const isProd = process.env.NODE_ENV === "production";
const isBuildPhase =
  process.env.NEXT_PHASE === "phase-production-build" ||
  process.env.SKIP_ENV_VALIDATION === "1";

// In dev, R2 and Turnstile are optional so the app works without those credentials locally.
// In production they are required and the app will refuse to start without them.
const requiredInProd = (msg: string) =>
  isProd && !isBuildPhase
    ? z.string().min(1, msg)
    : z.preprocess(emptyToUndef, z.string().optional());

const schema = z.object({
  // Note: NEXT_PUBLIC_R2_PUBLIC_URL conditional requirement enforced via .superRefine() below
  PAYLOAD_SECRET: z.string().min(1, "PAYLOAD_SECRET is required"),
  DATABASE_URL: z.preprocess(
    (v) => (typeof v === "string" ? v.trim() : ""),
    z.string().min(1, "DATABASE_URL is required")
  ),
  REDIS_URL: z.preprocess(emptyToUndef, z.string().optional()),
  RESEND_API_KEY: requiredInProd("RESEND_API_KEY is required in production"),
  RESEND_FROM_EMAIL: requiredInProd("RESEND_FROM_EMAIL is required in production"),
  OPENROUTER_API_KEY: z.preprocess(emptyToUndef, z.string().optional()),
  GDPR_TOKEN_SECRET: requiredInProd("GDPR_TOKEN_SECRET is required in production"),
  NEXT_PUBLIC_APP_URL: requiredInProd("NEXT_PUBLIC_APP_URL is required in production"),
  NODE_ENV: z.enum(["development", "production", "test"]).optional(),
  ADMIN_EMAIL: isProd && !isBuildPhase
    ? z.string().email("ADMIN_EMAIL must be a valid email")
    : z.preprocess(emptyToUndef, z.string().email().optional()),
  GOOGLE_PAGESPEED_API_KEY: z.preprocess(emptyToUndef, z.string().optional()),
  VERCEL_URL: z.preprocess(emptyToUndef, z.string().optional()),
  // Cloudflare R2 — required in production, optional in dev
  R2_ACCESS_KEY_ID: requiredInProd("R2_ACCESS_KEY_ID is required"),
  R2_SECRET_ACCESS_KEY: requiredInProd("R2_SECRET_ACCESS_KEY is required"),
  R2_BUCKET_NAME: requiredInProd("R2_BUCKET_NAME is required"),
  R2_ENDPOINT: isProd && !isBuildPhase
    ? z.string().url("R2_ENDPOINT must be a valid URL")
    : z.preprocess(emptyToUndef, z.string().url().optional()),
  NEXT_PUBLIC_R2_PUBLIC_URL: z.preprocess(emptyToUndef, z.string().url().optional()),
  // Cloudflare Turnstile — required in production, optional in dev
  TURNSTILE_SECRET_KEY: requiredInProd("TURNSTILE_SECRET_KEY is required"),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: requiredInProd("NEXT_PUBLIC_TURNSTILE_SITE_KEY is required"),
  // On-demand ISR revalidation secret — required in production
  REVALIDATION_SECRET: requiredInProd("REVALIDATION_SECRET is required"),
  // NextAuth — required in production
  NEXTAUTH_SECRET: requiredInProd("NEXTAUTH_SECRET is required"),
  NEXTAUTH_URL: requiredInProd("NEXTAUTH_URL is required"),
}).superRefine((data, ctx) => {
  if (isBuildPhase) return;

  if (
    data.NODE_ENV === "production" &&
    data.R2_ACCESS_KEY_ID &&
    !data.NEXT_PUBLIC_R2_PUBLIC_URL
  ) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message:
        "NEXT_PUBLIC_R2_PUBLIC_URL is required in production when R2 storage is enabled",
      path: ["NEXT_PUBLIC_R2_PUBLIC_URL"],
    });
  }

  if (data.NODE_ENV === "production" && data.NEXT_PUBLIC_APP_URL) {
    const appUrl = data.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
    if (/localhost|127\.0\.0\.1/i.test(appUrl)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "NEXT_PUBLIC_APP_URL must be the public production domain (not localhost)",
        path: ["NEXT_PUBLIC_APP_URL"],
      });
    }
    if (!/^https:\/\//i.test(appUrl)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "NEXT_PUBLIC_APP_URL must use https:// in production",
        path: ["NEXT_PUBLIC_APP_URL"],
      });
    }
  }

  if (data.NODE_ENV === "production" && data.NEXTAUTH_URL) {
    if (/localhost|127\.0\.0\.1/i.test(data.NEXTAUTH_URL)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "NEXTAUTH_URL must be the public production URL (not localhost)",
        path: ["NEXTAUTH_URL"],
      });
    }
  }
});

export type AppEnv = z.infer<typeof schema>;

let cached: AppEnv | null = null;

function readProcessEnv(): Record<string, string | undefined> {
  return {
    PAYLOAD_SECRET: process.env.PAYLOAD_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    REDIS_URL: process.env.REDIS_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL,
    OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
    GDPR_TOKEN_SECRET: process.env.GDPR_TOKEN_SECRET,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NODE_ENV: process.env.NODE_ENV as AppEnv["NODE_ENV"],
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    GOOGLE_PAGESPEED_API_KEY: process.env.GOOGLE_PAGESPEED_API_KEY,
    VERCEL_URL: process.env.VERCEL_URL,
    R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
    R2_BUCKET_NAME: process.env.R2_BUCKET_NAME,
    R2_ENDPOINT: process.env.R2_ENDPOINT,
    NEXT_PUBLIC_R2_PUBLIC_URL: process.env.NEXT_PUBLIC_R2_PUBLIC_URL,
    TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
    REVALIDATION_SECRET: process.env.REVALIDATION_SECRET,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  };
}

/**
 * Validated environment. Throws on first access if required vars are missing.
 */
export function getEnv(): AppEnv {
  if (!cached) {
    const parsed = schema.safeParse(readProcessEnv());
    if (!parsed.success) {
      const msg = parsed.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("; ");
      throw new Error(`Invalid environment: ${msg}`);
    }
    cached = parsed.data;
  }
  return cached;
}

/** Call from `payload.config.ts` so misconfiguration fails at startup. */
export function validateEnvAtStartup(): void {
  // `next build` only has public env; secrets are injected at container runtime.
  if (isBuildPhase) return;
  getEnv();
}
