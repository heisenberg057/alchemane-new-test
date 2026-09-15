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

const ASSET_ROOT = path.resolve(projectRoot, "..");
const DESKTOP_DIR = path.join(ASSET_ROOT, "WEBSITE", "DETAILS CLIP ON PAGE", "DESKTOP", "A hair system gives you three things every man wants section images");
const MOBILE_DIR = path.join(ASSET_ROOT, "WEBSITE", "DETAILS CLIP ON PAGE", "MOBILE", "A hair system gives you three things every man wants section images");

const TARGETS: UploadTarget[] = [
  {
    key: "clip-on-three-invisible-desktop",
    filePath: path.join(DESKTOP_DIR, "Invisible.png"),
    title: "Clip-On Three Things Invisible Desktop",
    alt: "Ultra-thin breathable base clip-on hair system — Invisible benefit (desktop)",
    description: "Clip-on page — Three Things section, Invisible card image (desktop, 1408×1392).",
  },
  {
    key: "clip-on-three-safe-desktop",
    filePath: path.join(DESKTOP_DIR, "safe.png"),
    title: "Clip-On Three Things Safe Desktop",
    alt: "Anti-bacterial clip-on hair system base — Safe benefit (desktop)",
    description: "Clip-on page — Three Things section, Safe card image (desktop, 1408×1640).",
  },
  {
    key: "clip-on-three-secure-desktop",
    filePath: path.join(DESKTOP_DIR, "Secure.png"),
    title: "Clip-On Three Things Secure Desktop",
    alt: "Medical-grade silicon clips — Secure benefit (desktop)",
    description: "Clip-on page — Three Things section, Secure card image (desktop, 1408×1732).",
  },
  {
    key: "clip-on-three-invisible-mobile",
    filePath: path.join(MOBILE_DIR, "invisible.png"),
    title: "Clip-On Three Things Invisible Mobile",
    alt: "Ultra-thin breathable base clip-on hair system — Invisible benefit (mobile)",
    description: "Clip-on page — Three Things section, Invisible card image (mobile, 1040×1052).",
  },
  {
    key: "clip-on-three-safe-mobile",
    filePath: path.join(MOBILE_DIR, "safe.png"),
    title: "Clip-On Three Things Safe Mobile",
    alt: "Anti-bacterial clip-on hair system base — Safe benefit (mobile)",
    description: "Clip-on page — Three Things section, Safe card image (mobile, 1040×1044).",
  },
  {
    key: "clip-on-three-secure-mobile",
    filePath: path.join(MOBILE_DIR, "secure.png"),
    title: "Clip-On Three Things Secure Mobile",
    alt: "Medical-grade silicon clips — Secure benefit (mobile)",
    description: "Clip-on page — Three Things section, Secure card image (mobile, 1040×1424).",
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
  console.error("Clip-on three things upload failed:", error);
  process.exit(1);
});
