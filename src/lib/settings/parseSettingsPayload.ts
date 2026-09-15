/** Flat site settings stored as JSON in a Settings row with `key: "site"`. */
export interface Settings {
  siteName: string;
  siteUrl?: string;
  siteDescription: string;
  adminEmail: string;
  // Contact & Social
  phone: string;
  whatsapp: string;
  contactEmail: string;
  socialFacebook: string;
  socialInstagram: string;
  socialYoutube: string;
  socialX: string;
  // AI
  ai_seo_model: string;
  // Site Behaviour
  formCities: string; // comma-separated
  maintenanceMode: boolean;
  blogCommentsEnabled: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  siteName: "American Hairline",
  siteUrl: "https://americanhairline.com",
  siteDescription: "",
  adminEmail: "admin@americanhairline.com",
  phone: "9222666111",
  whatsapp: "7208329070",
  contactEmail: "info@americanhairline.com",
  socialFacebook: "https://facebook.com/americanhairline",
  socialInstagram: "https://instagram.com/americanhairline",
  socialYoutube: "https://youtube.com/@americanhairline",
  socialX: "https://x.com/americanhairline",
  ai_seo_model: "gemini-flash",
  formCities: "Mumbai,Delhi,Bangalore,Other",
  maintenanceMode: false,
  blogCommentsEnabled: true,
};

/**
 * Payload GET /api/settings returns `{ docs: [...] }`. Site config is one doc with
 * `key: "site"` and `value` as JSON string of flat fields.
 */
export function parseSettingsFromPayload(apiResponse: unknown): Settings {
  const defaults = { ...DEFAULT_SETTINGS };
  const body = apiResponse as { docs?: Array<{ key?: string; value?: string }> } | null;
  const docs = body?.docs;
  if (!Array.isArray(docs) || docs.length === 0) return defaults;

  const siteDoc = docs.find((d) => d.key === "site");
  if (!siteDoc?.value) return defaults;

  try {
    const parsed =
      typeof siteDoc.value === "string" ? JSON.parse(siteDoc.value) : siteDoc.value;
    if (parsed && typeof parsed === "object") {
      return { ...defaults, ...parsed };
    }
  } catch {
    // ignore invalid JSON
  }
  return defaults;
}
