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

const TARGETS: UploadTarget[] = [
  {
    key: "smp-about-card-desktop",
    filePath: path.join(
      ASSET_ROOT,
      "WEBSITE",
      "SMP PAGE DESKTOP V1",
      "DESKTOP",
      "About Scalp Micropigmentation section inside card image",
      "image 1.png",
    ),
    title: "SMP About Card Desktop",
    alt: "About Scalp Micropigmentation — SMP procedure card image (desktop)",
    description: "SMP page About section card image (desktop). Display: 1034×582.",
  },
  {
    key: "smp-about-card-mobile",
    filePath: path.join(
      ASSET_ROOT,
      "WEBSITE",
      "SMP PAGE DESKTOP V1",
      "MOBILE",
      "About Scalp Micropigmentation section inside card image",
      "image 1.png",
    ),
    title: "SMP About Card Mobile",
    alt: "About Scalp Micropigmentation — SMP procedure card image (mobile)",
    description: "SMP page About section card image (mobile). Display: 408×665.",
  },
  {
    key: "smp-about-overlay-desktop",
    filePath: path.join(
      ASSET_ROOT,
      "WEBSITE",
      "SMP PAGE DESKTOP V1",
      "DESKTOP",
      "Overlay of About Scalp Micropigmentation section image - 3rd section",
      "image 1.png",
    ),
    title: "SMP About Overlay Desktop",
    alt: "About Scalp Micropigmentation — popup overlay image (desktop)",
    description: "SMP page About section popup right-panel image (desktop). Display: 1464×824.",
  },
  {
    key: "smp-about-overlay-mobile",
    filePath: path.join(
      ASSET_ROOT,
      "WEBSITE",
      "SMP PAGE DESKTOP V1",
      "MOBILE",
      "Overlay of About Scalp Micropigmentation section image - 3rd section",
      "image 1.png",
    ),
    title: "SMP About Overlay Mobile",
    alt: "About Scalp Micropigmentation — popup overlay image (mobile)",
    description: "SMP page About section popup bottom image (mobile). Display: 537×875.",
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
  console.error("SMP about upload failed:", err);
  process.exit(1);
});
