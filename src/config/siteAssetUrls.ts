import { getMediaUrl } from "@/lib/media/cdn";

const APP_URL = (process.env.NEXT_PUBLIC_APP_URL || "https://americanhairline.com").replace(/\/$/, "");

export const SITE_ASSET_URLS = {
  logo: `${APP_URL}/assets/mkxm0e5x-jjniexs.png`,
  defaultSocialImage: getMediaUrl("media/runtime-default-social-results-hero.png"),
} as const;
