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
const desktopFolder = path.join(
  assetRoot,
  "WEBSITE",
  "HOMEPAGE",
  "DESKTOP",
  "Our Trusted Methods for a Natural Look section images (1 image for each method) - Homepage 13th section (Desktop version)",
);
const mobileFolder = path.join(
  assetRoot,
  "WEBSITE",
  "HOMEPAGE",
  "MOBILE",
  "Our Trusted Methods for a Natural Look section images (1 image for each method) - Homepage 13th section (Mobile version)",
);

const TARGETS: UploadTarget[] = [
  {
    key: "stick-on-desktop",
    filePath: path.join(desktopFolder, "stick on hair system changes.png"),
    title: "Homepage Trusted Method Stick On Desktop",
    alt: "Stick-on hair system method preview",
    description: "Desktop image for homepage trusted methods stick-on hair systems.",
  },
  {
    key: "stick-on-mobile",
    filePath: path.join(mobileFolder, "STICK  ON.png"),
    title: "Homepage Trusted Method Stick On Mobile",
    alt: "Stick-on hair system method preview",
    description: "Mobile image for homepage trusted methods stick-on hair systems.",
  },
  {
    key: "clip-on-desktop",
    filePath: path.join(desktopFolder, "clip3 on hair system changes.png"),
    title: "Homepage Trusted Method Clip On Desktop",
    alt: "Clip-on hair system method preview",
    description: "Desktop image for homepage trusted methods clip-on hair systems.",
  },
  {
    key: "clip-on-mobile",
    filePath: path.join(mobileFolder, "CLIP ON.png"),
    title: "Homepage Trusted Method Clip On Mobile",
    alt: "Clip-on hair system method preview",
    description: "Mobile image for homepage trusted methods clip-on hair systems.",
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
  console.error("Homepage trusted methods upload failed:", error);
  process.exit(1);
});
