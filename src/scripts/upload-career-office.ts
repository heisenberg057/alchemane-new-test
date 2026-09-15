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

const officeRoot = path.join(assetRoot, "WEBSITE", "TEAM PAGE", "PS Check Out Our Office");

const TARGETS: UploadTarget[] = [
  {
    key: "slide1",
    filePath: path.join(officeRoot, "image1.jpg"),
    title: "Career Office Slide 1",
    alt: "American Hairline office workspace and team area.",
    description: "Office carousel image 1 for the career page P.S. - Check Out Our Office section.",
  },
  {
    key: "slide2",
    filePath: path.join(officeRoot, "image2.jpg"),
    title: "Career Office Slide 2",
    alt: "American Hairline office interior view.",
    description: "Office carousel image 2 for the career page P.S. - Check Out Our Office section.",
  },
  {
    key: "slide3",
    filePath: path.join(officeRoot, "image3.jpg"),
    title: "Career Office Slide 3",
    alt: "American Hairline office consultation space.",
    description: "Office carousel image 3 for the career page P.S. - Check Out Our Office section.",
  },
  {
    key: "slide4",
    filePath: path.join(officeRoot, "image4.jpg"),
    title: "Career Office Slide 4",
    alt: "American Hairline office portrait view.",
    description: "Office carousel image 4 for the career page P.S. - Check Out Our Office section.",
  },
  {
    key: "slide5",
    filePath: path.join(officeRoot, "lastimage.png"),
    title: "Career Office Slide 5",
    alt: "American Hairline office final carousel view.",
    description: "Office carousel image 5 for the career page P.S. - Check Out Our Office section.",
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
  console.error("Career office upload failed:", error);
  process.exit(1);
});
