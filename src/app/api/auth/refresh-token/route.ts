import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { jwtVerify } from "jose";
import { refreshOperation } from "payload";
import { createLocalReq } from "payload";
import { UnauthorizedError } from "@/lib/api/errors";
import { jsonSuccess } from "@/lib/api/response";
import { withErrorHandling } from "@/lib/api/withErrorHandling";
import { getPayloadSingleton } from "@/lib/api/getPayload";

async function handlePOST(request: Request) {
  // Step 1: Verify the NextAuth JWT — this is the session bootstrap-session creates.
  const nextAuthToken = await getToken({
    req: request as Parameters<typeof getToken>[0]["req"],
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!nextAuthToken?.sub || !nextAuthToken?.accessToken) {
    throw new UnauthorizedError("Invalid or expired session");
  }

  // Step 2: Decode the original Payload JWT (stored inside the NextAuth token) to
  // extract the `sid` claim. The token may be expired — we only need the claims.
  const payloadSecret = process.env.PAYLOAD_SECRET!;
  const secretKey = new TextEncoder().encode(payloadSecret);

  let sid: string | undefined;
  try {
    const { payload: decoded } = await jwtVerify(
      nextAuthToken.accessToken as string,
      secretKey
    );
    sid = typeof decoded.sid === "string" ? decoded.sid : undefined;
  } catch {
    // Token is expired — jwtVerify throws. Decode claims without verification.
    try {
      const parts = (nextAuthToken.accessToken as string).split(".");
      if (parts.length === 3) {
        const decoded = JSON.parse(
          Buffer.from(parts[1], "base64url").toString("utf8")
        );
        sid = typeof decoded.sid === "string" ? decoded.sid : undefined;
      }
    } catch {
      sid = undefined;
    }
  }

  if (!sid) {
    throw new UnauthorizedError("Session ID missing — please log in again");
  }

  // Step 3: Load the user, validate role, and confirm the session is still valid.
  const payload = await getPayloadSingleton();

  let user: Record<string, unknown>;
  try {
    user = (await payload.findByID({
      collection: "users",
      id: nextAuthToken.sub,
    })) as Record<string, unknown>;
  } catch {
    throw new UnauthorizedError("User not found");
  }

  const role = typeof user.role === "string" ? user.role.toUpperCase() : "";
  if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
    throw new UnauthorizedError("Insufficient permissions");
  }

  const sessions = Array.isArray(user.sessions)
    ? (user.sessions as Array<{ id: string; expiresAt: string | Date }>)
    : [];
  const session = sessions.find((s) => s.id === sid);
  if (!session || new Date(session.expiresAt) < new Date()) {
    throw new UnauthorizedError("Session expired — please log in again");
  }

  // Step 4: Call Payload's own refreshOperation using createLocalReq.
  // This is the only path guaranteed to produce a token that Payload accepts —
  // it uses payload.secret internally and mirrors the exact login flow.
  // We provide req.user with the fields refreshOperation reads:
  //   req.user.id, req.user._sid, req.user.collection, req.user._strategy
  const localReq = await createLocalReq(
    {
      user: {
        ...user,
        _sid: sid,
        collection: "users",
        _strategy: "local-jwt",
      } as unknown as Parameters<typeof createLocalReq>[0]["user"],
      urlSuffix: "/api/users/refresh-token",
    },
    payload
  );

  const collection = payload.collections["users"];
  const result = await refreshOperation({ collection, req: localReq });

  const accessToken = result.refreshedToken;
  if (!accessToken) {
    throw new UnauthorizedError("Refresh failed — no token returned");
  }

  return NextResponse.json(
    jsonSuccess({ accessToken, exp: result.exp }, "Token refreshed")
  );
}

export const POST = withErrorHandling(handlePOST);
