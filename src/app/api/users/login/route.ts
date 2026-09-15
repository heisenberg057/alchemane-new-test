import { NextResponse } from "next/server";
import { BadRequestError, UnauthorizedError } from "@/lib/api/errors";
import { loginWithPayloadCredentials } from "@/lib/auth/payloadCredentialsLogin";
import { jsonSuccess } from "@/lib/api/response";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handlePOST(request: Request) {
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
    throw new UnauthorizedError("Invalid credentials");
  }

  const allowedRoles = new Set(["ADMIN", "SUPER_ADMIN"]);
  if (!allowedRoles.has(result.user.role)) {
    throw new UnauthorizedError("Insufficient permissions");
  }

  const { user: safeUser, token, refreshToken, exp } = result;

  return NextResponse.json(
    jsonSuccess(
      {
        user: safeUser,
        token,
        accessToken: token,
        ...(exp !== undefined ? { exp } : {}),
        ...(refreshToken !== undefined ? { refreshToken } : {}),
      },
      "Login successful"
    )
  );
}

export const POST = withErrorHandling(handlePOST);
