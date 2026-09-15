import { createHmac, timingSafeEqual } from "crypto";

export type GdprTokenPayload = {
  id: string;
  email: string;
  kind: "export" | "delete";
  exp: number;
};

export function signGdprToken(
  payload: GdprTokenPayload,
  secret: string
): string {
  const body = Buffer.from(JSON.stringify(payload), "utf8").toString(
    "base64url"
  );
  const sig = createHmac("sha256", secret).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function verifyGdprToken(
  token: string,
  secret: string
): GdprTokenPayload | null {
  const lastDot = token.lastIndexOf(".");
  if (lastDot <= 0) return null;
  const body = token.slice(0, lastDot);
  const sig = token.slice(lastDot + 1);
  const expected = createHmac("sha256", secret).update(body).digest("base64url");
  const sigBuf = Buffer.from(sig, "utf8");
  const expBuf = Buffer.from(expected, "utf8");
  if (sigBuf.length !== expBuf.length) return null;
  try {
    if (!timingSafeEqual(sigBuf, expBuf)) return null;
  } catch {
    return null;
  }
  let parsed: GdprTokenPayload;
  try {
    parsed = JSON.parse(
      Buffer.from(body, "base64url").toString("utf8")
    ) as GdprTokenPayload;
  } catch {
    return null;
  }
  if (
    !parsed ||
    typeof parsed.exp !== "number" ||
    typeof parsed.id !== "string" ||
    typeof parsed.email !== "string" ||
    (parsed.kind !== "export" && parsed.kind !== "delete")
  ) {
    return null;
  }
  if (Date.now() / 1000 > parsed.exp) return null;
  return parsed;
}

export function getGdprTokenSecret(): string {
  const s =
    process.env.GDPR_TOKEN_SECRET ||
    process.env.PAYLOAD_SECRET ||
    "";
  if (!s || s === "YOUR_SECRET_KEY_HERE") {
    throw new Error("GDPR_TOKEN_SECRET or PAYLOAD_SECRET must be set for GDPR tokens");
  }
  return s;
}
