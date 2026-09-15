import { UAParser } from "ua-parser-js";
import { logger } from "@/lib/logger";

export type GeoData = {
  country: string;
  city: string;
  region: string;
};

export type DeviceInfo = {
  browser: string;
  device: string;
  os: string;
};

const GEO_TIMEOUT_MS = 3000;

export function parseUserAgent(userAgent: string | null | undefined): DeviceInfo {
  if (!userAgent) {
    return { browser: "Unknown", device: "Unknown", os: "Unknown" };
  }
  const parser = new UAParser(userAgent);
  const result = parser.getResult();
  const deviceType = result.device.type || "desktop";
  return {
    browser: result.browser.name || "Unknown",
    device: deviceType,
    os: result.os.name || "Unknown",
  };
}

export async function getGeoLocation(ip: string): Promise<GeoData | null> {
  if (
    !ip ||
    ip === "::1" ||
    ip === "127.0.0.1" ||
    ip === "unknown" ||
    ip.startsWith("192.168.") ||
    ip.startsWith("10.")
  ) {
    return { country: "Local", city: "Local", region: "Local" };
  }

  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), GEO_TIMEOUT_MS);
    const res = await fetch(`https://ip-api.com/json/${encodeURIComponent(ip)}?fields=status,country,city,regionName`, {
      signal: ctrl.signal,
    });
    clearTimeout(timer);

    if (!res.ok) {
      return null;
    }
    const data = (await res.json()) as {
      status?: string;
      country?: string;
      city?: string;
      regionName?: string;
    };
    if (data.status === "success") {
      return {
        country: data.country || "Unknown",
        city: data.city || "Unknown",
        region: data.regionName || "Unknown",
      };
    }
  } catch (e) {
    logger.warn("Geo lookup failed", {
      error: e instanceof Error ? e.message : String(e),
    });
  }

  return null;
}
