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
    key: "clip-on-hero-desktop",
    filePath: path.join(
      ASSET_ROOT,
      "WEBSITE",
      "DETAILS CLIP ON PAGE",
      "DESKTOP",
      "Clip-On Hair System Hero section image",
      "CLIP ON HAIR SYSTEM.png",
    ),
    title: "Clip-On Hero Desktop",
    alt: "Clip-on hair system before and after result — natural hairline coverage without shaving (desktop)",
    description: "Clip-on hair system page hero section image (desktop, 1920×1080). Text baked in.",
  },
  {
    key: "clip-on-hero-mobile",
    filePath: path.join(
      ASSET_ROOT,
      "WEBSITE",
      "DETAILS CLIP ON PAGE",
      "MOBILE",
      "Clip-On Hair System Hero section image",
      "CLIP ON HAIR SYSTEM 4X5.png",
    ),
    title: "Clip-On Hero Mobile",
    alt: "Clip-on hair system before and after result — natural hairline coverage without shaving (mobile)",
    description: "Clip-on hair system page hero section image (mobile, 1080×1350). Text baked in.",
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
      data: {
        alt: target.alt,
        title: target.title,
        description: target.description,
      },
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

main().catch((error) => {
  console.error("Clip-on hero upload failed:", error);
  process.exit(1);
});
