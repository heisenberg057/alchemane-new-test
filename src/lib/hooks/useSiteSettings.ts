/**
 * Lightweight hook for frontend components (Footer, Navbar, ContactForm) to read
 * site settings without requiring auth. Uses the same /api/settings endpoint but
 * caches aggressively — one fetch per page load.
 */
import { useQuery } from "@tanstack/react-query";
import {
  DEFAULT_SETTINGS,
  parseSettingsFromPayload,
  type Settings,
} from "@/lib/settings/parseSettingsPayload";

export type { Settings };

async function fetchPublicSettings(): Promise<Settings> {
  try {
    const res = await fetch("/api/settings?limit=100", { cache: "no-store" });
    if (!res.ok) return DEFAULT_SETTINGS;
    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) return DEFAULT_SETTINGS;
    const data = await res.json();
    return parseSettingsFromPayload(data);
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function useSiteSettings() {
  return useQuery({
    queryKey: ["site-settings-public"],
    queryFn: fetchPublicSettings,
    placeholderData: DEFAULT_SETTINGS,
    staleTime: 5 * 60 * 1000, // 5 min — fresh enough, avoids re-fetch on every navigation
  });
}
