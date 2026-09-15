import { NextResponse } from "next/server";
import { encode } from "next-auth/jwt";
import type { JWT } from "next-auth/jwt";
import { loginWithPayloadCredentials } from "@/lib/auth/payloadCredentialsLogin";
import { BadRequestError } from "@/lib/api/errors";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

/** Match next-auth/core/lib/cookie chunking */
const ALLOWED_COOKIE_SIZE = 4096;
const ESTIMATED_EMPTY_COOKIE_SIZE = 163;
const CHUNK_SIZE = ALLOWED_COOKIE_SIZE - ESTIMATED_EMPTY_COOKIE_SIZE;

const SESSION_MAX_AGE_SEC = 30 * 24 * 60 * 60;

function sessionCookieName(): string {
  const useSecure =
    process.env.NEXTAUTH_URL?.startsWith("https://") ?? !!process.env.VERCEL;
  const prefix = useSecure ? "__Secure-" : "";
  return `${prefix}next-auth.session-token`;
}

async function handlePOST(request: Request) {
  const secret = process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET;
  if (!secret) {
    return NextResponse.json(
      { success: false, message: "Server missing NEXTAUTH_SECRET" },
      { status: 500 }
    );
  }

  let body: { email?: string; password?: string };
  try {
    body = (await request.json()) as { email?: string; password?: string };
  } catch {
    throw new BadRequestError("Invalid JSON body");
  }

  const email = body.email?.trim();
  const password = body.password;
  if (!email || !password) {
    throw new BadRequestError("Email and password are required");
  }

  const result = await loginWithPayloadCredentials(email, password);
  if (!result) {
    return NextResponse.json(
      { success: false, message: "Invalid credentials" },
      { status: 401 }
    );
  }

  const { user, token, refreshToken } = result;

  const allowedAdminRoles = new Set(["ADMIN", "SUPER_ADMIN"]);
  if (!allowedAdminRoles.has(user.role)) {
    return NextResponse.json(
      { success: false, message: "Insufficient permissions" },
      { status: 403 }
    );
  }

  const merged = {
    name: user.name || user.email,
    email: user.email,
    sub: String(user.id),
    role: user.role,
    accessToken: token,
    ...(refreshToken ? { refreshToken } : {}),
  } satisfies JWT;

  const jwt = await encode({
    token: merged,
    secret,
    maxAge: SESSION_MAX_AGE_SEC,
  });

  const useSecure =
    process.env.NEXTAUTH_URL?.startsWith("https://") ?? !!process.env.VERCEL;
  const cookieName = sessionCookieName();
  const baseOpts = {
    httpOnly: true,
    path: "/",
    sameSite: "lax" as const,
    secure: useSecure,
    maxAge: SESSION_MAX_AGE_SEC,
  };

  const res = NextResponse.json({
    success: true,
    data: { email: user.email, role: user.role },
  });

  // Clear previous session cookies (single or chunked) before setting new ones
  res.cookies.set(cookieName, "", { ...baseOpts, maxAge: 0 });
  for (let i = 0; i < 16; i++) {
    res.cookies.set(`${cookieName}.${i}`, "", { ...baseOpts, maxAge: 0 });
  }

  if (jwt.length <= CHUNK_SIZE) {
    res.cookies.set(cookieName, jwt, baseOpts);
  } else {
    const chunkCount = Math.ceil(jwt.length / CHUNK_SIZE);
    for (let i = 0; i < chunkCount; i++) {
      const part = jwt.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
      res.cookies.set(`${cookieName}.${i}`, part, baseOpts);
    }
  }

  return res;
}

export const POST = withErrorHandling(handlePOST);
