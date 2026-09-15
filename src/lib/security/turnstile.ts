/**
 * Cloudflare Turnstile server-side verification.
 * Fails closed when the secret is missing or the request errors.
 */
export async function verifyTurnstileToken(
  token: string,
  ip: string
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.error("[turnstile] TURNSTILE_SECRET_KEY is not set");
    return false;
  }
  if (!token?.trim()) return false;

  const body = new URLSearchParams({
    secret,
    response: token,
    remoteip: ip,
  });

  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body }
    );
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (err) {
    console.error("[turnstile] verification request failed:", err);
    return false;
  }
}

export function clientIpFromRequest(request: Request): string {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}
