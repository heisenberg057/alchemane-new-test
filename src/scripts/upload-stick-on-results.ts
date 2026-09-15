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
    key: "chandan-desktop",
    filePath: path.join(assetRoot, "WEBSITE", "STICK ON OR CLIP ON PAGE", "DESKTOP", "Real results that showcase true transformations section images", "stick on", "final", "chandan CHANGE.png"),
    title: "Stick On Results Chandan Desktop",
    alt: "Before and after stick-on hair system result for Chandan Singh.",
    description: "Desktop real results image for Chandan Singh.",
  },
  {
    key: "chandan-mobile",
    filePath: path.join(assetRoot, "WEBSITE", "STICK ON OR CLIP ON PAGE", "MOBILE", "Real results that showcase true transformations section images", "stick on mobile", "chandan mobile.png"),
    title: "Stick On Results Chandan Mobile",
    alt: "Before and after stick-on hair system result for Chandan Singh.",
    description: "Mobile real results image for Chandan Singh.",
  },
  {
    key: "rahil-desktop",
    filePath: path.join(assetRoot, "WEBSITE", "STICK ON OR CLIP ON PAGE", "DESKTOP", "Real results that showcase true transformations section images", "clip on", "Final", "RAHIL.png"),
    title: "Stick On Results Rahil Desktop",
    alt: "Before and after clip-on hair system result for Rahil Khan.",
    description: "Desktop real results image for Rahil Khan.",
  },
  {
    key: "rahil-mobile",
    filePath: path.join(assetRoot, "WEBSITE", "STICK ON OR CLIP ON PAGE", "MOBILE", "Real results that showcase true transformations section images", "clip on mobile", "RAHIL mobile.png"),
    title: "Stick On Results Rahil Mobile",
    alt: "Before and after clip-on hair system result for Rahil Khan.",
    description: "Mobile real results image for Rahil Khan.",
  },
  {
    key: "azhar-desktop",
    filePath: path.join(assetRoot, "WEBSITE", "STICK ON OR CLIP ON PAGE", "DESKTOP", "Real results that showcase true transformations section images", "stick on", "final", "azhar CHANGE.png"),
    title: "Stick On Results Azhar Desktop",
    alt: "Before and after stick-on hair system result for Azhar Shaikh.",
    description: "Desktop real results image for Azhar Shaikh.",
  },
  {
    key: "azhar-mobile",
    filePath: path.join(assetRoot, "WEBSITE", "STICK ON OR CLIP ON PAGE", "MOBILE", "Real results that showcase true transformations section images", "stick on mobile", "azhar mobile.png"),
    title: "Stick On Results Azhar Mobile",
    alt: "Before and after stick-on hair system result for Azhar Shaikh.",
    description: "Mobile real results image for Azhar Shaikh.",
  },
  {
    key: "rylan-desktop",
    filePath: path.join(assetRoot, "WEBSITE", "STICK ON OR CLIP ON PAGE", "DESKTOP", "Real results that showcase true transformations section images", "clip on", "Final", "RYLAN.png"),
    title: "Stick On Results Rylan Desktop",
    alt: "Before and after clip-on hair system result for Rylan Rodrigues.",
    description: "Desktop real results image for Rylan Rodrigues.",
  },
  {
    key: "rylan-mobile",
    filePath: path.join(assetRoot, "WEBSITE", "STICK ON OR CLIP ON PAGE", "MOBILE", "Real results that showcase true transformations section images", "clip on mobile", "RYLAN mobile.png"),
    title: "Stick On Results Rylan Mobile",
    alt: "Before and after clip-on hair system result for Rylan Rodrigues.",
    description: "Mobile real results image for Rylan Rodrigues.",
  },
  {
    key: "daljit-desktop",
    filePath: path.join(assetRoot, "WEBSITE", "STICK ON OR CLIP ON PAGE", "DESKTOP", "Real results that showcase true transformations section images", "stick on", "final", "daljit CHANGE.png"),
    title: "Stick On Results Daljit Desktop",
    alt: "Before and after stick-on hair system result for Daljit Singh.",
    description: "Desktop real results image for Daljit Singh.",
  },
  {
    key: "daljit-mobile",
    filePath: path.join(assetRoot, "WEBSITE", "STICK ON OR CLIP ON PAGE", "MOBILE", "Real results that showcase true transformations section images", "stick on mobile", "daljit mobile.png"),
    title: "Stick On Results Daljit Mobile",
    alt: "Before and after stick-on hair system result for Daljit Singh.",
    description: "Mobile real results image for Daljit Singh.",
  },
  {
    key: "advit-desktop",
    filePath: path.join(assetRoot, "WEBSITE", "STICK ON OR CLIP ON PAGE", "DESKTOP", "Real results that showcase true transformations section images", "clip on", "Final", "ADVIT.png"),
    title: "Stick On Results Advit Desktop",
    alt: "Before and after clip-on hair system result for Advit Sharma.",
    description: "Desktop real results image for Advit Sharma.",
  },
  {
    key: "advit-mobile",
    filePath: path.join(assetRoot, "WEBSITE", "STICK ON OR CLIP ON PAGE", "MOBILE", "Real results that showcase true transformations section images", "clip on mobile", "ADVIT mobile.png"),
    title: "Stick On Results Advit Mobile",
    alt: "Before and after clip-on hair system result for Advit Sharma.",
    description: "Mobile real results image for Advit Sharma.",
  },
  {
    key: "saurabh-desktop",
    filePath: path.join(assetRoot, "WEBSITE", "STICK ON OR CLIP ON PAGE", "DESKTOP", "Real results that showcase true transformations section images", "stick on", "final", "1 CHANGE.png"),
    title: "Stick On Results Saurabh Desktop",
    alt: "Before and after stick-on hair system result for Saurabh Mishra.",
    description: "Desktop real results image for Saurabh Mishra.",
  },
  {
    key: "saurabh-mobile",
    filePath: path.join(assetRoot, "WEBSITE", "STICK ON OR CLIP ON PAGE", "MOBILE", "Real results that showcase true transformations section images", "stick on mobile", "new image.png"),
    title: "Stick On Results Saurabh Mobile",
    alt: "Before and after stick-on hair system result for Saurabh Mishra.",
    description: "Mobile real results image for Saurabh Mishra.",
  },
  {
    key: "sahil-desktop",
    filePath: path.join(assetRoot, "WEBSITE", "STICK ON OR CLIP ON PAGE", "DESKTOP", "Real results that showcase true transformations section images", "clip on", "Final", "sahil CHANGE.png"),
    title: "Stick On Results Sahil Desktop",
    alt: "Before and after clip-on hair system result for Sahil Khan.",
    description: "Desktop real results image for Sahil Khan.",
  },
  {
    key: "sahil-mobile",
    filePath: path.join(assetRoot, "WEBSITE", "STICK ON OR CLIP ON PAGE", "MOBILE", "Real results that showcase true transformations section images", "clip on mobile", "sahil mobile.png"),
    title: "Stick On Results Sahil Mobile",
    alt: "Before and after clip-on hair system result for Sahil Khan.",
    description: "Mobile real results image for Sahil Khan.",
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
  console.error("Stick-on results upload failed:", error);
  process.exit(1);
});
