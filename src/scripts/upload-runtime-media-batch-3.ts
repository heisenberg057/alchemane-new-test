/**
 * Runtime media batch 3 — remaining heavy public/assets images
 *
 * Uploads to R2 (skips if already present) then prints a JSON map of
 * key → public URL so component asset files can be updated.
 *
 * Run:
 *   npx tsx src/scripts/upload-runtime-media-batch-3.ts
 */

import path from "path";
import { fileURLToPath } from "url";
import { config as loadDotEnv } from "dotenv";
import { readFile } from "fs/promises";
import { access, constants as fsConstants } from "fs/promises";
import { HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "../..");

loadDotEnv({ path: path.join(projectRoot, ".env.local") });

type UploadTarget = {
  key: string;
  sourceName: string;
  filename: string;
  contentType: string;
};

const sourceRoot = path.join(projectRoot, "public", "assets");

const TARGETS: UploadTarget[] = [
  // Methods.tsx hero image (4.7 MB)
  {
    key: "methods-hero-man",
    sourceName: "mkxm0e6d-eftu7xt.png",
    filename: "runtime-methods-hero-man.png",
    contentType: "image/png",
  },
  // stick-on-hair-system-page.tsx achievement card (3.3 MB)
  {
    key: "stick-on-actor-achievement",
    sourceName: "transplant-actor-bg.png",
    filename: "runtime-stick-on-actor-achievement.png",
    contentType: "image/png",
  },
  // clip-on-system-lifespan gallery slides (1.3 MB – 562 KB)
  {
    key: "gallery-slide-1",
    sourceName: "gallery-slide-1.png",
    filename: "runtime-gallery-slide-1.png",
    contentType: "image/png",
  },
  {
    key: "gallery-slide-2",
    sourceName: "gallery-slide-2.png",
    filename: "runtime-gallery-slide-2.png",
    contentType: "image/png",
  },
  {
    key: "gallery-slide-3",
    sourceName: "gallery-slide-3.png",
    filename: "runtime-gallery-slide-3.png",
    contentType: "image/png",
  },
  {
    key: "gallery-slide-4",
    sourceName: "gallery-slide-4.png",
    filename: "runtime-gallery-slide-4.png",
    contentType: "image/png",
  },
  {
    key: "gallery-slide-5",
    sourceName: "gallery-slide-5.png",
    filename: "runtime-gallery-slide-5.png",
    contentType: "image/png",
  },
  // stick-on-system-lifespan video card images
  {
    key: "stick-on-guy",
    sourceName: "stick-on-guy.png",
    filename: "runtime-stick-on-guy.png",
    contentType: "image/png",
  },
  {
    key: "transplant-benefit-natural",
    sourceName: "transplant-benefit-natural.png",
    filename: "runtime-transplant-benefit-natural.png",
    contentType: "image/png",
  },
  {
    key: "transplant-benefit-real",
    sourceName: "transplant-benefit-real.png",
    filename: "runtime-transplant-benefit-real.png",
    contentType: "image/png",
  },
  // HeroSlider images (850 KB – 1 MB each)
  {
    key: "hero-slider-1",
    sourceName: "mkxm0e6c-0ztoeby.png",
    filename: "runtime-hero-slider-1.png",
    contentType: "image/png",
  },
  {
    key: "hero-slider-2",
    sourceName: "mkxm0e6c-a2hnol2.png",
    filename: "runtime-hero-slider-2.png",
    contentType: "image/png",
  },
  {
    key: "hero-slider-3",
    sourceName: "mkxm0e6c-yzy71x0.png",
    filename: "runtime-hero-slider-3.png",
    contentType: "image/png",
  },
  {
    key: "hero-slider-4",
    sourceName: "mkxm0e6c-dguq4d7.png",
    filename: "runtime-hero-slider-4.png",
    contentType: "image/png",
  },
  {
    key: "hero-slider-5",
    sourceName: "mkxm0e6c-x7hrcuy.png",
    filename: "runtime-hero-slider-5.png",
    contentType: "image/png",
  },
];

const publicBase = process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.replace(/\/$/, "");
const bucket = process.env.R2_BUCKET_NAME;
const endpoint = process.env.R2_ENDPOINT;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

if (!publicBase || !bucket || !endpoint || !accessKeyId || !secretAccessKey) {
  throw new Error("Missing one or more required R2 environment variables.");
}

const client = new S3Client({
  region: "auto",
  endpoint,
  forcePathStyle: true,
  credentials: { accessKeyId, secretAccessKey },
});

function getObjectKey(filename: string) {
  return `media/${filename}`;
}

function getPublicUrl(filename: string) {
  return `${publicBase}/media/${filename}`;
}

async function objectExists(key: string): Promise<boolean> {
  try {
    await client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    return true;
  } catch (error) {
    const status =
      typeof error === "object" && error && "$metadata" in error
        ? (error as { $metadata?: { httpStatusCode?: number } }).$metadata?.httpStatusCode
        : undefined;
    if (status === 404) return false;
    throw error;
  }
}

async function main() {
  const output: Array<Record<string, unknown>> = [];

  for (const target of TARGETS) {
    const objectKey = getObjectKey(target.filename);

    if (await objectExists(objectKey)) {
      output.push({ key: target.key, status: "reused", url: getPublicUrl(target.filename) });
      continue;
    }

    const sourcePath = path.join(sourceRoot, target.sourceName);
    try {
      await access(sourcePath, fsConstants.R_OK);
    } catch {
      output.push({ key: target.key, status: "skipped — source not found", sourceName: target.sourceName });
      continue;
    }

    const body = await readFile(sourcePath);
    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: objectKey,
        Body: body,
        ContentType: target.contentType,
        CacheControl: "public, max-age=31536000, immutable",
      }),
    );

    output.push({
      key: target.key,
      status: "created",
      sourceName: target.sourceName,
      filename: target.filename,
      objectKey,
      url: getPublicUrl(target.filename),
    });
  }

  console.log(JSON.stringify(output, null, 2));
}

main().catch((error) => {
  console.error("Batch 3 upload failed:", error);
  process.exit(1);
});
