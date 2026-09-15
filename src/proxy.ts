import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isIpBlockedForRequest } from "@/lib/security/ipBlock";
import { checkRateLimit } from "@/lib/security/rateLimit";

const CANONICAL_HOST = "americanhairline.com";

export async function proxy(req: NextRequest) {
  const host = (req.headers.get("host") || "").split(":")[0].toLowerCase();

  // Canonical host: www + legacy staging → apex (nginx also redirects; belt + suspenders)
  if (host === "www.americanhairline.com" || host === "new.americanhairline.com") {
    const url = req.nextUrl.clone();
    url.protocol = "https:";
    url.host = CANONICAL_HOST;
    return NextResponse.redirect(url, 308);
  }

  const pathname = req.nextUrl.pathname;
  const isNextAuthInternal =
    pathname.startsWith("/api/auth/") && pathname !== "/api/auth/refresh-token";

  // Skip proxy logic for non-API routes that are not admin
  if (!pathname.startsWith("/api/") && !pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // NextAuth's internal endpoints are called frequently by the client session
  // manager and should not be throttled by app API limits.
  if (isNextAuthInternal) {
    return NextResponse.next();
  }

  // Admin UI routes — server-enforce authentication before rendering
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") return NextResponse.next();
    const { getToken } = await import("next-auth/jwt");
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const loginUrl = new URL("/admin/login", req.url);
    const cb = pathname + (req.nextUrl.search || "");
    loginUrl.searchParams.set("callbackUrl", cb);

    if (!token) {
      return NextResponse.redirect(loginUrl);
    }

    // Enforce admin role — a valid token without an admin role must not access /admin/*
    const role = typeof token.role === "string" ? token.role.toUpperCase() : "";
    if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
      return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
  }

  // Step 0 — Blocked IPs (Redis or BLOCKED_IPS env; see BlockedIPs collection)
  if (pathname.startsWith("/api/")) {
    const blocked = await isIpBlockedForRequest(req);
    if (blocked) {
      return NextResponse.json(
        { success: false, message: "IP blocked" },
        { status: 403 }
      );
    }
  }

  // Always rate-limit sensitive and public-write paths — never skip based on headers.
  // (A fake `Authorization: Bearer x` must not bypass throttling.)
  const alwaysRateLimit =
    pathname === "/api/users/login" ||
    pathname === "/api/admin/bootstrap-session" ||
    pathname.startsWith("/api/auth/refresh-token") ||
    pathname.startsWith("/api/forms/") ||
    pathname.startsWith("/api/gdpr/") ||
    pathname.startsWith("/api/comments") ||
    pathname.startsWith("/api/analytics/pageview") ||
    pathname.startsWith("/api/tracking/") ||
    pathname.startsWith("/api/calculator/") ||
    pathname.startsWith("/api/lead-scoring/track/") ||
    pathname.startsWith("/api/lead-optimization/track/");

  // Step 1 — Rate limiting for all /api/ routes
  if (pathname.startsWith("/api/")) {
    // Optional: skip throttling only for non-sensitive routes when a Bearer/JWT
    // header is present. Header presence is NOT proof of a valid session.
    if (
      !alwaysRateLimit &&
      (req.headers.get("authorization")?.startsWith("Bearer ") ||
        req.headers.get("authorization")?.startsWith("JWT "))
    ) {
      return NextResponse.next();
    }

    const rate = await checkRateLimit(req);

    if (!rate.ok) {
      const response = NextResponse.json(
        {
          success: false,
          message: "Too many requests",
          retryAfter: rate.retryAfter,
        },
        { status: 429 }
      );
      response.headers.set("Retry-After", String(rate.retryAfter));
      response.headers.set("X-RateLimit-Limit", String(rate.limit));
      response.headers.set("X-RateLimit-Remaining", String(rate.remaining));
      response.headers.set(
        "X-RateLimit-Reset",
        String(Math.floor(rate.resetAt / 1000))
      );
      return response;
    }

    const response = NextResponse.next();
    response.headers.set("X-RateLimit-Limit", String(rate.limit));
    response.headers.set("X-RateLimit-Remaining", String(rate.remaining));
    response.headers.set(
      "X-RateLimit-Reset",
      String(Math.floor(rate.resetAt / 1000))
    );
    return response;
  }

  return NextResponse.next();
}

export const config = {
  // Include public pages so host canonicalization runs; API/admin keep security logic.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml)$).*)",
  ],
};
