import path from "path";
import { fileURLToPath } from "url";
import { config as loadDotEnv } from "dotenv";
import { readFile } from "fs/promises";
import { access } from "fs/promises";
import { constants as fsConstants } from "fs";
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

const sourceRoots = [
  path.join(projectRoot, "scripts", "asset-sources", "runtime-media-batch-2"),
  path.join(projectRoot, "public", "assets"),
];

const TARGETS: UploadTarget[] = [
  {
    key: "hair-patch-vs-system-hrithik",
    sourceName: "mkxm0e6c-6ex5nn6.png",
    filename: "runtime-hair-patch-vs-system-hrithik.png",
    contentType: "image/png",
  },
  {
    key: "hair-patch-vs-system-arnav",
    sourceName: "mkxm0e6c-42n33es.png",
    filename: "runtime-hair-patch-vs-system-arnav.png",
    contentType: "image/png",
  },
  {
    key: "hair-patch-vs-system-aryan",
    sourceName: "mkxm0e6c-olhgxb8.png",
    filename: "runtime-hair-patch-vs-system-aryan.png",
    contentType: "image/png",
  },
  {
    key: "premium-salon-showcase",
    sourceName: "mkxm0e6c-gck5lob.png",
    filename: "runtime-premium-salon-showcase.png",
    contentType: "image/png",
  },
  {
    key: "default-social-results-hero",
    sourceName: "results-hero-bg.png",
    filename: "runtime-default-social-results-hero.png",
    contentType: "image/png",
  },
];

const publicBase = process.env.NEXT_PUBLIC_R2_PUBLIC_URL?.replace(/\/$/, "");
const bucket = process.env.R2_BUCKET_NAME;
const endpoint = process.env.R2_ENDPOINT;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

if (!publicBase || !bucket || !endpoint || !accessKeyId || !secretAccessKey) {
  throw new Error("Missing one or more required R2 environment variables for upload.");
}

const client = new S3Client({
  region: "auto",
  endpoint,
  forcePathStyle: true,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

function getObjectKey(filename: string) {
  return `media/${filename}`;
}

function getPublicUrl(filename: string) {
  return `${publicBase}/media/${filename}`;
}

async function resolveSourcePath(sourceName: string) {
  for (const root of sourceRoots) {
    const candidate = path.join(root, sourceName);
    try {
      await access(candidate, fsConstants.R_OK);
      return candidate;
    } catch {
      continue;
    }
  }

  throw new Error(`Unable to resolve upload source for ${sourceName}`);
}

async function objectExists(key: string) {
  try {
    await client.send(
      new HeadObjectCommand({
        Bucket: bucket,
        Key: key,
      }),
    );
    return true;
  } catch (error) {
    const status = typeof error === "object" && error && "$metadata" in error
      ? (error as { $metadata?: { httpStatusCode?: number } }).$metadata?.httpStatusCode
      : undefined;
    if (status === 404) {
      return false;
    }
    throw error;
  }
}

async function main() {
  const output: Array<Record<string, unknown>> = [];

  for (const target of TARGETS) {
    const objectKey = getObjectKey(target.filename);
    const exists = await objectExists(objectKey);

    if (exists) {
      output.push({
        key: target.key,
        status: "reused",
        sourceName: target.sourceName,
        filename: target.filename,
        objectKey,
        url: getPublicUrl(target.filename),
      });
      continue;
    }

    const sourcePath = await resolveSourcePath(target.sourceName);
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
  console.error("Runtime media batch 2 upload failed:", error);
  process.exit(1);
});
