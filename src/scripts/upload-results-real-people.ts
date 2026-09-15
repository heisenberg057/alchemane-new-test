import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { config as loadDotEnv } from "dotenv";
import type { Payload } from "payload";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "../..");

loadDotEnv({ path: path.join(projectRoot, ".env.local") });

type Variant = "stick-on" | "clip-on";
type FilterKey = "lowDensity" | "highDensity" | "shortHair" | "mediumHair" | "longHair";

type ItemDefinition = {
  key: string;
  name: string;
  variant: Variant;
  quote: string;
};

type FilterDefinition = {
  label: string;
  desktopFolder: string;
  mobileFolder: string;
  items: ItemDefinition[];
};

type UploadTarget = {
  key: string;
  filePath: string;
  title: string;
  alt: string;
  description: string;
};

const assetRoot = path.resolve(projectRoot, "..");

const FILTERS: Record<FilterKey, FilterDefinition> = {
  lowDensity: {
    label: "Low Density",
    desktopFolder: path.join(
      assetRoot,
      "WEBSITE",
      "REAL MEN REAL VIDEO",
      "DESKSTOP",
      "See How real people",
      "low density",
    ),
    mobileFolder: path.join(
      assetRoot,
      "WEBSITE",
      "REAL MEN REAL VIDEO",
      "MOBILE",
      "See How real people",
      "low dencity",
    ),
    items: [
      {
        key: "rahil",
        name: "RAHIL KHAN",
        variant: "clip-on",
        quote: "The transformation is amazing. It feels light, comfortable, and completely natural.",
      },
      {
        key: "azhar",
        name: "AZHAR SHAIKH",
        variant: "stick-on",
        quote: "No one could tell I’ve done anything. That’s how seamless it looks.",
      },
      {
        key: "fuzail",
        name: "FUZAIL KHAN",
        variant: "clip-on",
        quote: "It blends seamlessly with my natural hair. I feel like myself again, but better!",
      },
      {
        key: "saurabh",
        name: "SAURABH MISHRA",
        variant: "stick-on",
        quote: "Exactly the kind of natural look I was hoping for. Loved the result.",
      },
      {
        key: "sahil",
        name: "SAHIL KHAN",
        variant: "clip-on",
        quote: "It feels so light and looks completely natural. I’m very satisfied.",
      },
      {
        key: "rohit",
        name: "ROHIT CHOUDHARY",
        variant: "stick-on",
        quote: "I was looking for something subtle, and this is perfect. It adds volume without looking too heavy.",
      },
    ],
  },
  highDensity: {
    label: "High Density",
    desktopFolder: path.join(
      assetRoot,
      "WEBSITE",
      "REAL MEN REAL VIDEO",
      "DESKSTOP",
      "See How real people",
      "high density",
    ),
    mobileFolder: path.join(
      assetRoot,
      "WEBSITE",
      "REAL MEN REAL VIDEO",
      "MOBILE",
      "See How real people",
      "high density",
    ),
    items: [
      {
        key: "advik",
        name: "ADVIK SHARMA",
        variant: "clip-on",
        quote: "My hair finally looks fuller without looking fake. That’s the best part.",
      },
      {
        key: "rylan",
        name: "RYLAN RODRIGUES",
        variant: "clip-on",
        quote: "The volume looks so natural, not overdone at all. Exactly what I wanted.",
      },
      {
        key: "chandan",
        name: "CHANDAN SINGH",
        variant: "stick-on",
        quote: "I didn’t expect it to look this real. It blends perfectly with my natural hair.",
      },
      {
        key: "varun",
        name: "VARUN DESAI",
        variant: "clip-on",
        quote: "The transformation is unbelievable. It looks and feels so natural, I forget I’m wearing it.",
      },
      {
        key: "daljit",
        name: "DALJIT SINGH",
        variant: "stick-on",
        quote: "The finish is so smooth and natural. I’m really happy with the result.",
      },
    ],
  },
  shortHair: {
    label: "Short Hair",
    desktopFolder: path.join(
      assetRoot,
      "WEBSITE",
      "REAL MEN REAL VIDEO",
      "DESKSTOP",
      "See How real people",
      "short hair",
    ),
    mobileFolder: path.join(
      assetRoot,
      "WEBSITE",
      "REAL MEN REAL VIDEO",
      "MOBILE",
      "See How real people",
      "short hair",
    ),
    items: [
      {
        key: "azhar",
        name: "AZHAR SHAIKH",
        variant: "stick-on",
        quote: "No one could tell I’ve done anything. That’s how seamless it looks.",
      },
      {
        key: "fuzail",
        name: "FUZAIL KHAN",
        variant: "clip-on",
        quote: "It blends seamlessly with my natural hair. I feel like myself again, but better!",
      },
      {
        key: "daljit",
        name: "DALJIT SINGH",
        variant: "stick-on",
        quote: "The finish is so smooth and natural. I’m really happy with the result.",
      },
      {
        key: "saurabh",
        name: "SAURABH MISHRA",
        variant: "stick-on",
        quote: "Exactly the kind of natural look I was hoping for. Loved the result.",
      },
      {
        key: "rohit",
        name: "ROHIT CHOUDHARY",
        variant: "stick-on",
        quote: "I was looking for something subtle, and this is perfect. It adds volume without looking too heavy.",
      },
    ],
  },
  mediumHair: {
    label: "Medium Hair",
    desktopFolder: path.join(
      assetRoot,
      "WEBSITE",
      "REAL MEN REAL VIDEO",
      "DESKSTOP",
      "See How real people",
      "medium hair",
    ),
    mobileFolder: path.join(
      assetRoot,
      "WEBSITE",
      "REAL MEN REAL VIDEO",
      "MOBILE",
      "See How real people",
      "medium hair",
    ),
    items: [
      {
        key: "advik",
        name: "ADVIK SHARMA",
        variant: "clip-on",
        quote: "My hair finally looks fuller without looking fake. That’s the best part.",
      },
      {
        key: "rylan",
        name: "RYLAN RODRIGUES",
        variant: "clip-on",
        quote: "The volume looks so natural, not overdone at all. Exactly what I wanted.",
      },
      {
        key: "manish",
        name: "MANISH YADAV",
        variant: "stick-on",
        quote: "The texture and finish are flawless. It’s exactly what I needed for a more confident look.",
      },
      {
        key: "nikhil",
        name: "NIKHIL PAWAR",
        variant: "stick-on",
        quote: "The result is even better than I expected. It’s comfortable, looks natural, and feels great.",
      },
      {
        key: "rahil",
        name: "RAHIL KHAN",
        variant: "clip-on",
        quote: "The transformation is amazing. It feels light, comfortable, and completely natural.",
      },
      {
        key: "pankaj",
        name: "PANKAJ BHATIA",
        variant: "clip-on",
        quote: "The hair looks fuller without being too bulky. It’s exactly the natural look I wanted.",
      },
      {
        key: "sahil",
        name: "SAHIL KHAN",
        variant: "clip-on",
        quote: "It feels so light and looks completely natural. I’m very satisfied.",
      },
    ],
  },
  longHair: {
    label: "Long Hair",
    desktopFolder: path.join(
      assetRoot,
      "WEBSITE",
      "REAL MEN REAL VIDEO",
      "DESKSTOP",
      "See How real people",
      "long hair",
    ),
    mobileFolder: path.join(
      assetRoot,
      "WEBSITE",
      "REAL MEN REAL VIDEO",
      "MOBILE",
      "See How real people",
      "long hair",
    ),
    items: [
      {
        key: "chandan",
        name: "CHANDAN SINGH",
        variant: "stick-on",
        quote: "I didn’t expect it to look this real. It blends perfectly with my natural hair.",
      },
      {
        key: "sanjay",
        name: "SANJAY KUMAR",
        variant: "stick-on",
        quote: "I was worried it would look obvious, but it blends seamlessly. The comfort is unmatched.",
      },
    ],
  },
};

function findMatchingFile(folder: string, name: string, device: "desktop" | "mobile") {
  const files = fs
    .readdirSync(folder)
    .filter((file: string) => file.toLowerCase().endsWith(".png"));
  const match = files.find((file: string) => file.toLowerCase().includes(name.toLowerCase()));

  if (!match) {
    throw new Error(`No ${device} file found for ${name} in ${folder}`);
  }

  return path.join(folder, match);
}

function buildTargets() {
  const targets: UploadTarget[] = [];

  for (const [filterKey, filter] of Object.entries(FILTERS) as [FilterKey, FilterDefinition][]) {
    for (const item of filter.items) {
      const desktopFile = findMatchingFile(filter.desktopFolder, item.name, "desktop");
      const mobileFile = findMatchingFile(filter.mobileFolder, item.name, "mobile");
      const descriptor = item.variant === "stick-on" ? "stick-on" : "clip-on";

      targets.push(
        {
          key: `${filterKey}-${item.key}-desktop`,
          filePath: desktopFile,
          title: `Results Real People ${filter.label} ${item.name} Desktop`,
          alt: `Before and after ${descriptor} hair system result for ${item.name} in the ${filter.label.toLowerCase()} category.`,
          description: `Desktop ${filter.label} results image for ${item.name}.`,
        },
        {
          key: `${filterKey}-${item.key}-mobile`,
          filePath: mobileFile,
          title: `Results Real People ${filter.label} ${item.name} Mobile`,
          alt: `Before and after ${descriptor} hair system result for ${item.name} in the ${filter.label.toLowerCase()} category.`,
          description: `Mobile ${filter.label} results image for ${item.name}.`,
        },
      );
    }
  }

  return targets;
}

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

  for (const target of buildTargets()) {
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
  console.error("Results real people upload failed:", error);
  process.exit(1);
});
