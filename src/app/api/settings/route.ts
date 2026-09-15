import { NextResponse } from "next/server";
import { DEFAULT_SETTINGS } from "@/lib/settings/parseSettingsPayload";

/** Only these Settings keys are safe to expose on the public API. */
const PUBLIC_SETTINGS_KEYS = ["site"] as const;

/** Payload-shaped list response for Footer / Navbar when DB is down or empty. */
function publicSettingsFallback(limit: number) {
  return {
    docs: [
      {
        id: "dev-fallback-site",
        key: "site",
        value: JSON.stringify(DEFAULT_SETTINGS),
        type: "JSON",
        group: "general",
      },
    ],
    totalDocs: 1,
    limit,
    totalPages: 1,
    page: 1,
    pagingCounter: 1,
    hasPrevPage: false,
    hasNextPage: false,
    prevPage: null,
    nextPage: null,
  };
}

/**
 * Public site settings (phone, social, etc.). Overrides Payload catch-all so
 * local dev works without Postgres and unauthenticated reads get defaults.
 * Never dumps the full Settings collection — only whitelisted public keys.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Math.min(Math.max(Number(searchParams.get("limit")) || 100, 1), 100);

  try {
    const { tryGetPayloadSingleton } = await import("@/lib/api/getPayload");
    const payload = await tryGetPayloadSingleton();
    if (!payload) {
      return NextResponse.json(publicSettingsFallback(limit));
    }
    const result = await payload.find({
      collection: "settings",
      where: {
        key: { in: [...PUBLIC_SETTINGS_KEYS] },
      },
      limit,
      depth: 0,
      overrideAccess: true,
    });
    if (!result.docs?.length) {
      return NextResponse.json(publicSettingsFallback(limit));
    }
    // Belt-and-suspenders: never leak non-public keys even if where is bypassed.
    const publicKeySet = new Set<string>(PUBLIC_SETTINGS_KEYS);
    const docs = result.docs.filter((doc) => {
      const key = (doc as { key?: unknown }).key;
      return typeof key === "string" && publicKeySet.has(key);
    });
    if (!docs.length) {
      return NextResponse.json(publicSettingsFallback(limit));
    }
    return NextResponse.json({
      ...result,
      docs,
      totalDocs: docs.length,
    });
  } catch {
    return NextResponse.json(publicSettingsFallback(limit));
  }
}
