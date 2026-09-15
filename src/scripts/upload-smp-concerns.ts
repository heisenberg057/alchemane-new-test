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
  // ── DESKTOP (1600×1200, 4/3) ──
  {
    key: "smp-concerns-alopecia-desktop",
    filePath: path.join(ASSET_ROOT, "DESKTOP", "Find the SMP treatment for your concern", "ALOPESIA.png"),
    title: "SMP Concerns Alopecia Desktop",
    alt: "SMP treatment for alopecia — scalp micropigmentation result (desktop)",
    description: "SMP Concerns section — Alopecia tab image (desktop). Source: 1600×1200.",
  },
  {
    key: "smp-concerns-front-hairline-desktop",
    filePath: path.join(ASSET_ROOT, "DESKTOP", "Find the SMP treatment for your concern", "FRONT HAIRLINE.png"),
    title: "SMP Concerns Front Hairline Desktop",
    alt: "SMP treatment for front hairline — scalp micropigmentation result (desktop)",
    description: "SMP Concerns section — Front Hairline tab image (desktop). Source: 1600×1200.",
  },
  {
    key: "smp-concerns-full-head-desktop",
    filePath: path.join(ASSET_ROOT, "DESKTOP", "Find the SMP treatment for your concern", "FULL HEAD.png"),
    title: "SMP Concerns Full Head Desktop",
    alt: "SMP treatment for full head baldness — scalp micropigmentation result (desktop)",
    description: "SMP Concerns section — Full Head tab image (desktop). Source: 1600×1200.",
  },
  {
    key: "smp-concerns-scar-desktop",
    filePath: path.join(ASSET_ROOT, "DESKTOP", "Find the SMP treatment for your concern", "SCAR.png"),
    title: "SMP Concerns Scar Desktop",
    alt: "SMP treatment for scar camouflage — scalp micropigmentation result (desktop)",
    description: "SMP Concerns section — Scar Treatment tab image (desktop). Source: 1600×1200.",
  },
  {
    key: "smp-concerns-crown-desktop",
    filePath: path.join(ASSET_ROOT, "DESKTOP", "Find the SMP treatment for your concern", "crown area.png"),
    title: "SMP Concerns Crown Area Desktop",
    alt: "SMP treatment for crown area thinning — scalp micropigmentation result (desktop)",
    description: "SMP Concerns section — Crown Area tab image (desktop). Source: 1600×1200.",
  },
  // ── MOBILE (1920×1200, 16/10) ──
  {
    key: "smp-concerns-alopecia-mobile",
    filePath: path.join(ASSET_ROOT, "MOBILE", "FIND THE SMP TREATMENT", "ALOPESIA.png"),
    title: "SMP Concerns Alopecia Mobile",
    alt: "SMP treatment for alopecia — scalp micropigmentation result (mobile)",
    description: "SMP Concerns section — Alopecia tab image (mobile). Source: 1920×1200.",
  },
  {
    key: "smp-concerns-front-hairline-mobile",
    filePath: path.join(ASSET_ROOT, "MOBILE", "FIND THE SMP TREATMENT", "FRONT HAIRLINE.png"),
    title: "SMP Concerns Front Hairline Mobile",
    alt: "SMP treatment for front hairline — scalp micropigmentation result (mobile)",
    description: "SMP Concerns section — Front Hairline tab image (mobile). Source: 1920×1200.",
  },
  {
    key: "smp-concerns-full-head-mobile",
    filePath: path.join(ASSET_ROOT, "MOBILE", "FIND THE SMP TREATMENT", "FULL HEAD.png"),
    title: "SMP Concerns Full Head Mobile",
    alt: "SMP treatment for full head baldness — scalp micropigmentation result (mobile)",
    description: "SMP Concerns section — Full Head tab image (mobile). Source: 1920×1200.",
  },
  {
    key: "smp-concerns-scar-mobile",
    filePath: path.join(ASSET_ROOT, "MOBILE", "FIND THE SMP TREATMENT", "SCAR.png"),
    title: "SMP Concerns Scar Mobile",
    alt: "SMP treatment for scar camouflage — scalp micropigmentation result (mobile)",
    description: "SMP Concerns section — Scar Treatment tab image (mobile). Source: 1920×1200.",
  },
  {
    key: "smp-concerns-crown-mobile",
    filePath: path.join(ASSET_ROOT, "MOBILE", "FIND THE SMP TREATMENT", "crown area.png"),
    title: "SMP Concerns Crown Area Mobile",
    alt: "SMP treatment for crown area thinning — scalp micropigmentation result (mobile)",
    description: "SMP Concerns section — Crown Area tab image (mobile). Source: 1920×1200.",
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
  console.error("SMP concerns upload failed:", err);
  process.exit(1);
});
