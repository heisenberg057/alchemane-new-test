/**
 * Lightweight UA hints (Express backend used a fuller parser).
 */
export function parseUserAgentHints(userAgent: string | null): {
  device: string | null;
  browser: string | null;
} {
  if (!userAgent) {
    return { device: null, browser: null };
  }
  const ua = userAgent.toLowerCase();
  let device: string | null = "desktop";
  if (ua.includes("tablet")) device = "tablet";
  else if (ua.includes("mobile") || ua.includes("android")) device = "mobile";

  let browser: string | null = "unknown";
  if (ua.includes("edg/")) browser = "edge";
  else if (ua.includes("chrome")) browser = "chrome";
  else if (ua.includes("firefox")) browser = "firefox";
  else if (ua.includes("safari") && !ua.includes("chrome")) browser = "safari";

  return { device, browser };
}
