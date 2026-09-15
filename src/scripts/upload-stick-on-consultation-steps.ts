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

const desktopRoot = path.join(
  assetRoot,
  "WEBSITE",
  "DETAILS STICK ON PAGES",
  "DESKTOP",
  "At American Hairline, we don’t do one-size-fits-all section images",
);

const mobileRoot = path.join(
  assetRoot,
  "WEBSITE",
  "DETAILS STICK ON PAGES",
  "MOBILE",
  "At American Hairline, we don’t do one-size-fits-all section images",
);

const TARGETS: UploadTarget[] = [
  {
    key: "checkScalpDesktop",
    filePath: path.join(desktopRoot, "1. We Check Your Scalp.png"),
    title: "Stick On Detail Consultation Check Scalp Desktop",
    alt: "Consultation step showing a specialist checking the client's scalp condition.",
    description: "Desktop card image for the We Check Your Scalp consultation step.",
  },
  {
    key: "checkScalpMobile",
    filePath: path.join(mobileRoot, "1. We Check Your Scalp.png"),
    title: "Stick On Detail Consultation Check Scalp Mobile",
    alt: "Mobile consultation step showing a specialist checking the client's scalp condition.",
    description: "Mobile card image for the We Check Your Scalp consultation step.",
  },
  {
    key: "showOptionsDesktop",
    filePath: path.join(desktopRoot, "We Show You Options.png"),
    title: "Stick On Detail Consultation Show Options Desktop",
    alt: "Consultation step showing a specialist explaining hair system options to a client.",
    description: "Desktop card image for the We Show You Options consultation step.",
  },
  {
    key: "showOptionsMobile",
    filePath: path.join(mobileRoot, "We Show You Options.png"),
    title: "Stick On Detail Consultation Show Options Mobile",
    alt: "Mobile consultation step showing a specialist explaining hair system options to a client.",
    description: "Mobile card image for the We Show You Options consultation step.",
  },
  {
    key: "recommendDesktop",
    filePath: path.join(desktopRoot, "we recommend.png"),
    title: "Stick On Detail Consultation Recommend Desktop",
    alt: "Consultation step showing a specialist recommending the best-fitting hair system.",
    description: "Desktop card image for the We Recommend What Fits You consultation step.",
  },
  {
    key: "recommendMobile",
    filePath: path.join(mobileRoot, "we recommend.png"),
    title: "Stick On Detail Consultation Recommend Mobile",
    alt: "Mobile consultation step showing a specialist recommending the best-fitting hair system.",
    description: "Mobile card image for the We Recommend What Fits You consultation step.",
  },
  {
    key: "designDesktop",
    filePath: path.join(desktopRoot, "We Design It Just for You.png"),
    title: "Stick On Detail Consultation Design Desktop",
    alt: "Consultation step showing a specialist designing a custom stick-on hair system.",
    description: "Desktop card image for the We Design It For You consultation step.",
  },
  {
    key: "designMobile",
    filePath: path.join(mobileRoot, "We Design It Just for You.png"),
    title: "Stick On Detail Consultation Design Mobile",
    alt: "Mobile consultation step showing a specialist designing a custom stick-on hair system.",
    description: "Mobile card image for the We Design It For You consultation step.",
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
  console.error("Stick-on consultation steps upload failed:", error);
  process.exit(1);
});
