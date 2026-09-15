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

const ASSET_ROOT = path.resolve(
  projectRoot,
  "../WEBSITE/SMP PAGE DESKTOP V1"
);

const TARGETS: UploadTarget[] = [
  {
    key: "smp-process-step1-desktop",
    filePath: path.join(ASSET_ROOT, "DESKTOP", "THE STEP BY STEP", "IMAGE  1.png"),
    title: "SMP Process Step 1 Desktop",
    alt: "Hairline Design & Consultation — SMP step 1 process image (desktop)",
    description: "SMP page Process section step 1 image (desktop). Source: 1080×1977.",
  },
  {
    key: "smp-process-step2-desktop",
    filePath: path.join(ASSET_ROOT, "DESKTOP", "THE STEP BY STEP", "IMAGE 2.png"),
    title: "SMP Process Step 2 Desktop",
    alt: "SMP Session — SMP step 2 process image (desktop)",
    description: "SMP page Process section step 2 image (desktop). Source: 1080×1977.",
  },
  {
    key: "smp-process-step3-desktop",
    filePath: path.join(ASSET_ROOT, "DESKTOP", "THE STEP BY STEP", "IMAGE  3.png"),
    title: "SMP Process Step 3 Desktop",
    alt: "Build Gradually — SMP step 3 process image (desktop)",
    description: "SMP page Process section step 3 image (desktop). Source: 1080×1977.",
  },
  {
    key: "smp-process-step4-desktop",
    filePath: path.join(ASSET_ROOT, "DESKTOP", "THE STEP BY STEP", "IMAGE  4.png"),
    title: "SMP Process Step 4 Desktop",
    alt: "Final Look & Touch-Up — SMP step 4 process image (desktop)",
    description: "SMP page Process section step 4 image (desktop). Source: 1080×1977.",
  },
  {
    key: "smp-process-step1-mobile",
    filePath: path.join(ASSET_ROOT, "MOBILE", "THE STEP BY STEP PROCESS", "STEP 1.png"),
    title: "SMP Process Step 1 Mobile",
    alt: "Hairline Design & Consultation — SMP step 1 process image (mobile)",
    description: "SMP page Process section step 1 image (mobile). Source: 1040×1920.",
  },
  {
    key: "smp-process-step2-mobile",
    filePath: path.join(ASSET_ROOT, "MOBILE", "THE STEP BY STEP PROCESS", "STEP 2.png"),
    title: "SMP Process Step 2 Mobile",
    alt: "SMP Session — SMP step 2 process image (mobile)",
    description: "SMP page Process section step 2 image (mobile). Source: 1040×1920.",
  },
  {
    key: "smp-process-step3-mobile",
    filePath: path.join(ASSET_ROOT, "MOBILE", "THE STEP BY STEP PROCESS", "STEP 3.png"),
    title: "SMP Process Step 3 Mobile",
    alt: "Build Gradually — SMP step 3 process image (mobile)",
    description: "SMP page Process section step 3 image (mobile). Source: 1040×1920.",
  },
  {
    key: "smp-process-step4-mobile",
    filePath: path.join(ASSET_ROOT, "MOBILE", "THE STEP BY STEP PROCESS", "STEP 4.png"),
    title: "SMP Process Step 4 Mobile",
    alt: "Final Look & Touch-Up — SMP step 4 process image (mobile)",
    description: "SMP page Process section step 4 image (mobile). Source: 1040×1920.",
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
      data: { alt: target.alt, title: target.title, description: target.description },
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

main().catch((err) => {
  console.error("SMP process upload failed:", err);
  process.exit(1);
});
