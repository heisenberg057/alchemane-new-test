import type { TypedUser } from "payload";
import { ForbiddenError, UnauthorizedError } from "./errors";
import { getPayloadSingleton } from "./getPayload";

/**
 * Resolves the current user from Payload JWT (Bearer / JWT header or auth cookie).
 * Throws {@link UnauthorizedError} when not authenticated.
 */
export async function withAuth(
  request: Request,
  requiredRoles?: string[]
): Promise<TypedUser> {
  const payload = await getPayloadSingleton();
  const { user } = await payload.auth({
    headers: request.headers,
  });
  if (!user) {
    throw new UnauthorizedError();
  }
  if (requiredRoles && requiredRoles.length > 0) {
    const rawRole = (user as { role?: unknown }).role;
    if (typeof rawRole !== "string" || !rawRole.trim()) {
      throw new ForbiddenError("Insufficient role");
    }
    const role = rawRole.toUpperCase();
    const allowed = requiredRoles.map((r) => r.toUpperCase());
    if (!allowed.includes(role)) {
      throw new ForbiddenError("Insufficient role");
    }
  }
  return user;
}
