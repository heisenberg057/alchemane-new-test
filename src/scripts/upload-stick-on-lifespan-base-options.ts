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
    key: "thinDesktopCard",
    filePath: path.join(
      assetRoot,
      "WEBSITE",
      "HOW LONG WILL IT LAST (STICK-ON)",
      "DESKTOP",
      "Two Base Options for Your Stick-On Hair System section inside card image",
      "Thin base card.png",
    ),
    title: "Stick On Lifespan Thin Base Card Desktop",
    alt: "Thin base low density stick-on hair system card image for desktop.",
    description: "Desktop card image for the Thin Base option on the stick-on lifespan page.",
  },
  {
    key: "thickDesktopCard",
    filePath: path.join(
      assetRoot,
      "WEBSITE",
      "HOW LONG WILL IT LAST (STICK-ON)",
      "DESKTOP",
      "Two Base Options for Your Stick-On Hair System section inside card image",
      "Thick base card.png",
    ),
    title: "Stick On Lifespan Thick Base Card Desktop",
    alt: "Thick base high density stick-on hair system card image for desktop.",
    description: "Desktop card image for the Thick Base option on the stick-on lifespan page.",
  },
  {
    key: "thinMobileCard",
    filePath: path.join(
      assetRoot,
      "WEBSITE",
      "HOW LONG WILL IT LAST (STICK-ON)",
      "MOBILE",
      "Two Base Options for Your Stick-On Hair System section inside card image",
      "Thin base card.png",
    ),
    title: "Stick On Lifespan Thin Base Card Mobile",
    alt: "Thin base low density stick-on hair system card image for mobile.",
    description: "Mobile card image for the Thin Base option on the stick-on lifespan page.",
  },
  {
    key: "thickMobileCard",
    filePath: path.join(
      assetRoot,
      "WEBSITE",
      "HOW LONG WILL IT LAST (STICK-ON)",
      "MOBILE",
      "Two Base Options for Your Stick-On Hair System section inside card image",
      "Thick base card.png",
    ),
    title: "Stick On Lifespan Thick Base Card Mobile",
    alt: "Thick base high density stick-on hair system card image for mobile.",
    description: "Mobile card image for the Thick Base option on the stick-on lifespan page.",
  },
  {
    key: "thinDesktopModal",
    filePath: path.join(
      assetRoot,
      "WEBSITE",
      "HOW LONG WILL IT LAST (STICK-ON)",
      "DESKTOP",
      "Overlay of Two Base Options for Your Stick-On Hair System section image",
      "Thin base overlay card.png",
    ),
    title: "Stick On Lifespan Thin Base Overlay Desktop",
    alt: "Thin base low density stick-on hair system overlay image for desktop.",
    description: "Desktop overlay image for the Thin Base modal on the stick-on lifespan page.",
  },
  {
    key: "thickDesktopModal",
    filePath: path.join(
      assetRoot,
      "WEBSITE",
      "HOW LONG WILL IT LAST (STICK-ON)",
      "DESKTOP",
      "Overlay of Two Base Options for Your Stick-On Hair System section image",
      "Thick base overlay card.png",
    ),
    title: "Stick On Lifespan Thick Base Overlay Desktop",
    alt: "Thick base high density stick-on hair system overlay image for desktop.",
    description: "Desktop overlay image for the Thick Base modal on the stick-on lifespan page.",
  },
  {
    key: "thinMobileModal",
    filePath: path.join(
      assetRoot,
      "WEBSITE",
      "HOW LONG WILL IT LAST (STICK-ON)",
      "MOBILE",
      "Overlay of Two Base Options for Your Stick-On Hair System section image",
      "Thin base overlay card.png",
    ),
    title: "Stick On Lifespan Thin Base Overlay Mobile",
    alt: "Thin base low density stick-on hair system overlay image for mobile.",
    description: "Mobile overlay image for the Thin Base modal on the stick-on lifespan page.",
  },
  {
    key: "thickMobileModal",
    filePath: path.join(
      assetRoot,
      "WEBSITE",
      "HOW LONG WILL IT LAST (STICK-ON)",
      "MOBILE",
      "Overlay of Two Base Options for Your Stick-On Hair System section image",
      "Thick base overlay card.png",
    ),
    title: "Stick On Lifespan Thick Base Overlay Mobile",
    alt: "Thick base high density stick-on hair system overlay image for mobile.",
    description: "Mobile overlay image for the Thick Base modal on the stick-on lifespan page.",
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
  console.error("Stick-on lifespan base options upload failed:", error);
  process.exit(1);
});
