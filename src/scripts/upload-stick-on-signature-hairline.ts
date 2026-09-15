import path from "path";
import { fileURLToPath } from "url";
import { config as loadDotEnv } from "dotenv";
import type { Payload } from "payload";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "../..");
const assetRoot = path.resolve(projectRoot, "..");

loadDotEnv({ path: path.join(projectRoot, ".env.local") });

type UploadTarget = {
  key: string;
  filePath: string;
  title: string;
  alt: string;
  description: string;
};

const TARGETS: UploadTarget[] = [
  {
    key: "desktop",
    filePath: path.join(
      assetRoot,
      "WEBSITE",
      "DETAILS STICK ON PAGES",
      "DESKTOP",
      "Our Ultra-Signature Natural Hairline, Just for You section image",
      "Our Ultra-Signature Natural Hairline.png",
    ),
    title: "Stick On Detail Ultra Signature Natural Hairline Desktop",
    alt: "Before and after stick-on hair system transformation showing an ultra-signature natural hairline.",
    description: "Desktop image for the Our Ultra-Signature Natural Hairline section on the stick-on detail page.",
  },
  {
    key: "mobile",
    filePath: path.join(
      assetRoot,
      "WEBSITE",
      "DETAILS STICK ON PAGES",
      "MOBILE",
      "Our Ultra-Signature Natural Hairline, Just for You section image",
      "Our Ultra-Signature Natural Hairline_.png",
    ),
    title: "Stick On Detail Ultra Signature Natural Hairline Mobile",
    alt: "Mobile before and after stick-on hair system transformation showing an ultra-signature natural hairline.",
    description: "Mobile image for the Our Ultra-Signature Natural Hairline section on the stick-on detail page.",
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
  process.exit(0);
}

main().catch((error) => {
  console.error("Stick-on signature hairline upload failed:", error);
  process.exit(1);
});
