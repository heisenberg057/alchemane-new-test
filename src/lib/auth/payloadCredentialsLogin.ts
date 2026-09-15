import { getPayloadSingleton } from "@/lib/api/getPayload";

export type SafePayloadUser = {
  id: string;
  email: string;
  name: string;
  role: string;
};

export type PayloadCredentialsLoginResult = {
  user: SafePayloadUser;
  token: string;
  refreshToken?: string;
  exp?: number;
};

/**
 * Shared login used by POST /api/users/login and NextAuth credentials (no HTTP hop).
 * Avoids nested requests to the same server that can deadlock or time out in dev.
 */
export async function loginWithPayloadCredentials(
  email: string,
  password: string
): Promise<PayloadCredentialsLoginResult | null> {
  const trimmed = email.trim();
  if (!trimmed || !password) {
    return null;
  }

  const payload = await getPayloadSingleton();

  try {
    const result = await payload.login({
      collection: "users",
      data: { email: trimmed, password },
    });

    const raw = result.user as Record<string, unknown>;
    const user: SafePayloadUser = {
      id: raw.id != null ? String(raw.id) : "",
      email: typeof raw.email === "string" ? raw.email : trimmed,
      name:
        typeof raw.name === "string"
          ? raw.name
          : typeof raw.email === "string"
            ? raw.email
            : "",
      role:
        typeof raw.role === "string" ? raw.role.toUpperCase() : "",
    };

    if (!user.role) {
      console.error("[payloadCredentialsLogin] User has no role — denying login");
      return null;
    }

    const token = result.token;
    if (!token || typeof token !== "string") {
      console.error("[payloadCredentialsLogin] Missing token after payload.login");
      return null;
    }

    const refreshToken =
      "refreshToken" in result &&
      typeof (result as { refreshToken?: unknown }).refreshToken === "string"
        ? (result as { refreshToken: string }).refreshToken
        : undefined;

    return {
      user,
      token,
      refreshToken,
      exp: result.exp,
    };
  } catch (e) {
    console.error("[payloadCredentialsLogin]", e);
    return null;
  }
}
