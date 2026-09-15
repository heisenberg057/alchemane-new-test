import path from "path";
import { fileURLToPath } from "url";
import { config as loadDotEnv } from "dotenv";
import type { Payload } from "payload";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "../..");

loadDotEnv({ path: path.join(projectRoot, ".env.local") });

const ASSET_ROOT = path.resolve(projectRoot, "..");
const DESKTOP_CARD_DIR = path.join(ASSET_ROOT, "WEBSITE", "DETAILS CLIP ON PAGE", "DESKTOP", "Zycon Range \u2022 Pro Series section inside card image");
const DESKTOP_POPUP_DIR = path.join(ASSET_ROOT, "WEBSITE", "DETAILS CLIP ON PAGE", "DESKTOP", "Overlay of Zycon Range \u2022 Pro Series section image");
const MOBILE_CARD_DIR = path.join(ASSET_ROOT, "WEBSITE", "DETAILS CLIP ON PAGE", "MOBILE", "Zycon Range \u2022 Pro Series section inside card image");
const MOBILE_POPUP_DIR = path.join(ASSET_ROOT, "WEBSITE", "DETAILS CLIP ON PAGE", "MOBILE", "Overlay of Zycon Range \u2022 Pro Series section image");

const TARGETS = [
  {
    key: "zycon-card-desktop",
    filePath: path.join(DESKTOP_CARD_DIR, "MEN PNG WHITE 1.png"),
    title: "Zycon Range Card Desktop",
    alt: "Zycon Range Pro Series man with hair system — card image (desktop)",
    description: "Zycon Range section card image — desktop, 598×1064.",
  },
  {
    key: "zycon-popup-desktop",
    filePath: path.join(DESKTOP_POPUP_DIR, "final MEN PNG GRADIENT 1 (1) 1 (2).png"),
    title: "Zycon Range Popup Desktop",
    alt: "Zycon Range Pro Series man with gradient hair glow — popup image (desktop)",
    description: "Zycon Range section popup/overlay image — desktop, 770×834.",
  },
  {
    key: "zycon-card-mobile",
    filePath: path.join(MOBILE_CARD_DIR, "MEN PNG WHITE 1.png"),
    title: "Zycon Range Card Mobile",
    alt: "Zycon Range Pro Series man with hair system — card image (mobile)",
    description: "Zycon Range section card image — mobile, 479×852.",
  },
  {
    key: "zycon-popup-mobile",
    filePath: path.join(MOBILE_POPUP_DIR, "final MEN PNG GRADIENT 1 (1) 1 (2).png"),
    title: "Zycon Range Popup Mobile",
    alt: "Zycon Range Pro Series man with gradient hair glow — popup image (mobile)",
    description: "Zycon Range section popup/overlay image — mobile, 508×551.",
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
      output.push({ key: target.key, status: "reused", id: existing.id, title: existing.title, filename: existing.filename, url: getPublicUrl(existing as Record<string, unknown>) });
      continue;
    }
    const created = await payload.create({
      collection: "media",
      data: { alt: target.alt, title: target.title, description: target.description },
      filePath: target.filePath,
      overrideAccess: true,
      depth: 0,
    });
    output.push({ key: target.key, status: "created", id: created.id, title: created.title, filename: created.filename, url: getPublicUrl(created as Record<string, unknown>) });
  }

  console.log(JSON.stringify(output, null, 2));
}

main().catch((error) => {
  console.error("Zycon section upload failed:", error);
  process.exit(1);
});
