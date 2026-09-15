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
    key: "about-story-card-desktop",
    filePath: path.join(
      ASSET_ROOT,
      "WEBSITE",
      "ABOUT US PAGE",
      "DESKSTOP",
      "Our Story section inside card image- 3rd section",
      "Our story.png",
    ),
    title: "About Story Card Desktop",
    alt: "The Journey of American Hairline — Our Story (desktop)",
    description: "About Us page Our Story section card background image (desktop) with baked-in text.",
  },
  {
    key: "about-story-card-mobile",
    filePath: path.join(
      ASSET_ROOT,
      "WEBSITE",
      "ABOUT US PAGE",
      "MOBILE",
      "Our Story section inside card image- 3rd section (Mobile version)",
      "Our story.png",
    ),
    title: "About Story Card Mobile",
    alt: "The Journey of American Hairline — Our Story (mobile)",
    description: "About Us page Our Story section card background image (mobile) with baked-in text.",
  },
  {
    key: "about-story-modal-multiple-desktop",
    filePath: path.join(
      ASSET_ROOT,
      "WEBSITE",
      "ABOUT US PAGE",
      "DESKSTOP",
      "Overlay of Our Story section (The Journey of American Hairline) 5 images- 3rd section  As per figma image size",
      "multiple images.png",
    ),
    title: "About Story Modal Multiple Images Desktop",
    alt: "American Hairline journey — team and client collage (desktop)",
    description: "About Us page Our Story modal — multiple images collage (desktop).",
  },
  {
    key: "about-story-modal-multiple-mobile",
    filePath: path.join(
      ASSET_ROOT,
      "WEBSITE",
      "ABOUT US PAGE",
      "MOBILE",
      "Overlay of Our Story section (The Journey of American Hairline) 5 images- 3rd section  As per figma image size",
      "multiple images.png",
    ),
    title: "About Story Modal Multiple Images Mobile",
    alt: "American Hairline journey — team and client collage (mobile)",
    description: "About Us page Our Story modal — multiple images collage (mobile).",
  },
  {
    key: "about-story-modal-big-desktop",
    filePath: path.join(
      ASSET_ROOT,
      "WEBSITE",
      "ABOUT US PAGE",
      "DESKSTOP",
      "Overlay of Our Story section (The Journey of American Hairline) 5 images- 3rd section  As per figma image size",
      "big image.png",
    ),
    title: "About Story Modal Big Image Desktop",
    alt: "American Hairline team — full team photo (desktop)",
    description: "About Us page Our Story modal — large team photo (desktop).",
  },
  {
    key: "about-story-modal-big-mobile",
    filePath: path.join(
      ASSET_ROOT,
      "WEBSITE",
      "ABOUT US PAGE",
      "MOBILE",
      "Overlay of Our Story section (The Journey of American Hairline) 5 images- 3rd section  As per figma image size",
      "big image.png",
    ),
    title: "About Story Modal Big Image Mobile",
    alt: "American Hairline team — full team photo (mobile)",
    description: "About Us page Our Story modal — large team photo (mobile).",
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
  console.error("About story upload failed:", error);
  process.exit(1);
});
