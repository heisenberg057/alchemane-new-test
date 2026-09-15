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
    key: "shark-tank-desktop",
    filePath: path.join(
      assetRoot,
      "WEBSITE",
      "HOMEPAGE",
      "DESKTOP",
      "Our Big Achievements",
      "Shark tank.png",
    ),
    title: "Homepage Achievement Shark Tank Desktop",
    alt: "American Hairline offered a deal on Shark Tank India",
    description: "Desktop achievement card for Shark Tank India.",
  },
  {
    key: "shark-tank-mobile",
    filePath: path.join(
      assetRoot,
      "WEBSITE",
      "HOMEPAGE",
      "MOBILE",
      "Our Big Achievements",
      "Shark tank.png",
    ),
    title: "Homepage Achievement Shark Tank Mobile",
    alt: "American Hairline offered a deal on Shark Tank India",
    description: "Mobile achievement card for Shark Tank India.",
  },
  {
    key: "bharat-award-desktop",
    filePath: path.join(
      assetRoot,
      "WEBSITE",
      "HOMEPAGE",
      "DESKTOP",
      "Our Big Achievements",
      "Bharat Innovators Award.png",
    ),
    title: "Homepage Achievement Bharat Award Desktop",
    alt: "American Hairline winning the Bharat Innovators Award",
    description: "Desktop achievement card for Bharat Innovators Award.",
  },
  {
    key: "bharat-award-mobile",
    filePath: path.join(
      assetRoot,
      "WEBSITE",
      "HOMEPAGE",
      "MOBILE",
      "Our Big Achievements",
      "Bharat Innovators Award.png",
    ),
    title: "Homepage Achievement Bharat Award Mobile",
    alt: "American Hairline winning the Bharat Innovators Award",
    description: "Mobile achievement card for Bharat Innovators Award.",
  },
  {
    key: "bollywood-desktop",
    filePath: path.join(
      assetRoot,
      "WEBSITE",
      "HOMEPAGE",
      "DESKTOP",
      "Our Big Achievements",
      "Bollywood Celebrities.png",
    ),
    title: "Homepage Achievement Bollywood Desktop",
    alt: "American Hairline designing for Bollywood celebrities",
    description: "Desktop achievement card for Bollywood celebrities.",
  },
  {
    key: "bollywood-mobile",
    filePath: path.join(
      assetRoot,
      "WEBSITE",
      "HOMEPAGE",
      "MOBILE",
      "Our Big Achievements",
      "Bollywood Celebrities.png",
    ),
    title: "Homepage Achievement Bollywood Mobile",
    alt: "American Hairline designing for Bollywood celebrities",
    description: "Mobile achievement card for Bollywood celebrities.",
  },
  {
    key: "scan-tech-desktop",
    filePath: path.join(
      assetRoot,
      "WEBSITE",
      "HOMEPAGE",
      "DESKTOP",
      "Our Big Achievements",
      "3D Scan Technology.png",
    ),
    title: "Homepage Achievement 3D Scan Desktop",
    alt: "American Hairline using advanced 3D scan technology",
    description: "Desktop achievement card for 3D scan technology.",
  },
  {
    key: "scan-tech-mobile",
    filePath: path.join(
      assetRoot,
      "WEBSITE",
      "HOMEPAGE",
      "MOBILE",
      "Our Big Achievements",
      "3D Scan Technology.png",
    ),
    title: "Homepage Achievement 3D Scan Mobile",
    alt: "American Hairline using advanced 3D scan technology",
    description: "Mobile achievement card for 3D scan technology.",
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
  console.error("Homepage achievements upload failed:", error);
  process.exit(1);
});
