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

const assetRoot = path.resolve(projectRoot, "..");

const TARGETS: UploadTarget[] = [
  {
    key: "desktopCard",
    filePath: path.join(
      assetRoot,
      "WEBSITE",
      "HAIR PATCH VS HAIR SYSTEM",
      "DESKTOP",
      "Hair System Benefits  section inside card image",
      "hair system benefits.png",
    ),
    title: "Hair Patch Benefits Desktop Card",
    alt: "Man with a natural-looking hair system and a close-up detail of the front hairline.",
    description: "Desktop card image for the Hair System Benefits section on the Hair Patch vs Hair System page.",
  },
  {
    key: "mobileCard",
    filePath: path.join(
      assetRoot,
      "WEBSITE",
      "HAIR PATCH VS HAIR SYSTEM",
      "MOBILE",
      "Hair System Benefits  section inside card image",
      "Benefits of natural looking.png",
    ),
    title: "Hair Patch Benefits Mobile Card",
    alt: "Man showing the natural look and density of a hair system.",
    description: "Mobile card image for the Hair System Benefits section on the Hair Patch vs Hair System page.",
  },
  {
    key: "desktopModal",
    filePath: path.join(
      assetRoot,
      "WEBSITE",
      "HAIR PATCH VS HAIR SYSTEM",
      "DESKTOP",
      "Overlay of Hair System Benefits  section image",
      "overlay of hair benefits.png",
    ),
    title: "Hair Patch Benefits Desktop Modal",
    alt: "Man wearing a natural-looking hair system for the benefits guide overlay.",
    description: "Desktop modal image for the Hair System Benefits section on the Hair Patch vs Hair System page.",
  },
];

async function findExistingMediaByTitle(payload: Payload, title: string) {
  const existing = await payload.find({
    collection: "media",
    where: {
      title: {
        equals: title,
      },
    },
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

  if (directUrl) {
    return directUrl;
  }

  if (publicBase && filename) {
    return `${publicBase}/media/${filename}`;
  }

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
  console.error("Hair patch benefits upload failed:", error);
  process.exit(1);
});
