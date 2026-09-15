import path from "path";
import { fileURLToPath } from "url";
import { config as loadDotEnv } from "dotenv";
import type { Payload } from "payload";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "../..");

loadDotEnv({ path: path.join(projectRoot, ".env.local") });

type UploadTarget = {
  key: string;
  filePath: string;
  title: string;
  alt: string;
  description: string;
};

const ASSET_ROOT = path.resolve(
  projectRoot,
  "../WEBSITE/HAIR TRANSPLANT PAGE"
);

const TARGETS: UploadTarget[] = [
  // ── Benefits (Why Combination Method) — Desktop 1056×1932 ──
  {
    key: "ht-benefits-natural-hairline-desktop",
    filePath: path.join(ASSET_ROOT, "DESKTOP", "Why Combination Method is the best solution  section images", "Natural Hairline changes.png"),
    title: "HT Benefits Natural Hairline Desktop",
    alt: "Natural hairline result from front hairline transplant and hair system combination method (desktop)",
    description: "Hair Transplant page Benefits section — Natural Hairline card image (desktop). Source: 1056×1932.",
  },
  {
    key: "ht-benefits-full-density-desktop",
    filePath: path.join(ASSET_ROOT, "DESKTOP", "Why Combination Method is the best solution  section images", "Full Density changes.png"),
    title: "HT Benefits Full Density Desktop",
    alt: "Full density result from front hairline transplant and hair system combination method (desktop)",
    description: "Hair Transplant page Benefits section — Full Density card image (desktop). Source: 1056×1932.",
  },
  {
    key: "ht-benefits-360-look-desktop",
    filePath: path.join(ASSET_ROOT, "DESKTOP", "Why Combination Method is the best solution  section images", "360 LOOK changes.png"),
    title: "HT Benefits 360 Look Desktop",
    alt: "360 degree real look result from front hairline transplant and hair system combination method (desktop)",
    description: "Hair Transplant page Benefits section — 360° Real Look card image (desktop). Source: 1056×1932.",
  },
  // ── Benefits — Mobile 1040×1520 ──
  {
    key: "ht-benefits-natural-hairline-mobile",
    filePath: path.join(ASSET_ROOT, "MOBILE", "Why Combination Method is the best solution  section images", "Natural Hairline changes.png"),
    title: "HT Benefits Natural Hairline Mobile",
    alt: "Natural hairline result from front hairline transplant and hair system combination method (mobile)",
    description: "Hair Transplant page Benefits section — Natural Hairline card image (mobile). Source: 1040×1520.",
  },
  {
    key: "ht-benefits-full-density-mobile",
    filePath: path.join(ASSET_ROOT, "MOBILE", "Why Combination Method is the best solution  section images", "Full Density changes.png"),
    title: "HT Benefits Full Density Mobile",
    alt: "Full density result from front hairline transplant and hair system combination method (mobile)",
    description: "Hair Transplant page Benefits section — Full Density card image (mobile). Source: 1040×1520.",
  },
  {
    key: "ht-benefits-360-look-mobile",
    filePath: path.join(ASSET_ROOT, "MOBILE", "Why Combination Method is the best solution  section images", "360 look changes.png"),
    title: "HT Benefits 360 Look Mobile",
    alt: "360 degree real look result from front hairline transplant and hair system combination method (mobile)",
    description: "Hair Transplant page Benefits section — 360° Real Look card image (mobile). Source: 1040×1520.",
  },
  // ── Secret (Bollywood) — Desktop 1632×1224 (4/3), Mobile 1080×1350 (4/5) ──
  {
    key: "ht-secret-bollywood-desktop",
    filePath: path.join(ASSET_ROOT, "DESKTOP", "The Secret Behind Most Bollywood Actors hair", "The Secret Behind Most Bollywood Actors 4x3.png"),
    title: "HT Secret Bollywood Desktop",
    alt: "The secret behind most Bollywood actors' hair — front hairline transplant and hair system combination method (desktop)",
    description: "Hair Transplant page Secret section — Bollywood actor image (desktop). Source: 1632×1224 (4/3).",
  },
  {
    key: "ht-secret-bollywood-mobile",
    filePath: path.join(ASSET_ROOT, "MOBILE", "The Secret Behind Most Bollywood Actors hair", "The Secret Behind Most Bollywood Actors hair 4x5.png"),
    title: "HT Secret Bollywood Mobile",
    alt: "The secret behind most Bollywood actors' hair — front hairline transplant and hair system combination method (mobile)",
    description: "Hair Transplant page Secret section — Bollywood actor image (mobile). Source: 1080×1350 (4/5).",
  },
  // ── Team surgeons — Desktop ──
  {
    key: "ht-team-ashutosh-desktop",
    filePath: path.join(ASSET_ROOT, "DESKTOP", "Meet Our Expert Team of Transplant Surgeons section image", "Dr. Ashutosh Mishra.png"),
    title: "HT Team Dr Ashutosh Desktop",
    alt: "Dr. Ashutosh Mishra — Plastic & Cosmetic Surgeon MCH, American Hairline hair transplant expert",
    description: "Hair Transplant page Team section — Dr. Ashutosh Mishra portrait (desktop). Source: 544×445.",
  },
  {
    key: "ht-team-vinod-desktop",
    filePath: path.join(ASSET_ROOT, "DESKTOP", "Meet Our Expert Team of Transplant Surgeons section image", "Dr. vinod sonavne.png"),
    title: "HT Team Dr Vinod Desktop",
    alt: "Dr. Vinod Sonawane — MD Hair Transplant Surgeon, American Hairline hair transplant expert",
    description: "Hair Transplant page Team section — Dr. Vinod Sonawane portrait (desktop). Source: 1632×1335.",
  },
  // ── Team surgeons — Mobile ──
  {
    key: "ht-team-ashutosh-mobile",
    filePath: path.join(ASSET_ROOT, "MOBILE", "Meet Our Expert Team of Transplant Surgeons section image", "Dr. Ashutosh Mishra.png"),
    title: "HT Team Dr Ashutosh Mobile",
    alt: "Dr. Ashutosh Mishra — Plastic & Cosmetic Surgeon MCH, American Hairline hair transplant expert",
    description: "Hair Transplant page Team section — Dr. Ashutosh Mishra portrait (mobile). Source: 1002×1254.",
  },
  {
    key: "ht-team-vinod-mobile",
    filePath: path.join(ASSET_ROOT, "MOBILE", "Meet Our Expert Team of Transplant Surgeons section image", "Dr. vinod sonavne.png"),
    title: "HT Team Dr Vinod Mobile",
    alt: "Dr. Vinod Sonawane — MD Hair Transplant Surgeon, American Hairline hair transplant expert",
    description: "Hair Transplant page Team section — Dr. Vinod Sonawane portrait (mobile). Source: 1002×1254.",
  },
];

async function findExistingMediaByTitle(payload: Payload, title: string) {
  const existing = await payload.find({
    collection: "media",
    where: { title: { equals: title } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });
  return existing.docs[0] ?? null;
}

function getPublicUrl(doc: Record<string, unknown>) {
  const filename = typeof doc.filename === "string" ? doc.filename : null;
  const directUrl = typeof doc.url === "string" ? doc.url : null;
  const publicBase = process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
  if (directUrl) return directUrl;
  if (publicBase && filename) return `${publicBase}/media/${filename}`;
  return null;
}

async function main() {
  const [{ getPayload }, { default: configPromise }] = await Promise.all([
    import("payload"),
    import("../payload.config"),
  ]);
  const payload = await getPayload({ config: configPromise });
  const output: Array<Record<string, unknown>> = [];

  for (const target of TARGETS) {
    const existing = await findExistingMediaByTitle(payload, target.title);
    if (existing) {
      output.push({
        key: target.key,
        status: "reused",
        id: existing.id,
        title: existing.title,
        filename: existing.filename,
        url: getPublicUrl(existing as Record<string, unknown>),
      });
      continue;
    }

    const created = await payload.create({
      collection: "media",
      data: { alt: target.alt, title: target.title, description: target.description },
      filePath: target.filePath,
      overrideAccess: true,
      depth: 0,
    });

    output.push({
      key: target.key,
      status: "created",
      id: created.id,
      title: created.title,
      filename: created.filename,
      url: getPublicUrl(created as Record<string, unknown>),
    });
  }

  console.log(JSON.stringify(output, null, 2));
}

main().catch((err) => {
  console.error("Hair transplant upload failed:", err);
  process.exit(1);
});
