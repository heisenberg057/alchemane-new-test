import path from "path";
import { fileURLToPath } from "url";
import { config as loadDotEnv } from "dotenv";
import { readFile } from "fs/promises";
import { HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "../..");

loadDotEnv({ path: path.join(projectRoot, ".env.local") });

type UploadTarget = {
  key: string;
  filePath: string;
  filename: string;
  contentType: string;
};

const assetRoot = path.join(projectRoot, "scripts", "asset-sources", "legacy-shared-media");

const TARGETS: UploadTarget[] = [
  {
    key: "results-story-sameer-before",
    filePath: path.join(assetRoot, "results-story-sameer-bg.png"),
    filename: "legacy-results-story-sameer-before.png",
    contentType: "image/png",
  },
  {
    key: "results-story-generic-before",
    filePath: path.join(assetRoot, "results-story-bg.png"),
    filename: "legacy-results-story-generic-before.png",
    contentType: "image/png",
  },
  {
    key: "results-story-sameer-after",
    filePath: path.join(assetRoot, "results-story-sameer.png"),
    filename: "legacy-results-story-sameer-after.png",
    contentType: "image/png",
  },
  {
    key: "results-story-amit-after",
    filePath: path.join(assetRoot, "results-story-amit.png"),
    filename: "legacy-results-story-amit-after.png",
    contentType: "image/png",
  },
  {
    key: "results-story-rahul-after",
    filePath: path.join(assetRoot, "results-story-rahul.png"),
    filename: "legacy-results-story-rahul-after.png",
    contentType: "image/png",
  },
  {
    key: "natural-hairline-client-hrithik",
    filePath: path.join(assetRoot, "hair-patch-client-hrithik.png"),
    filename: "legacy-natural-hairline-client-hrithik.png",
    contentType: "image/png",
  },
  {
    key: "natural-hairline-client-arnav",
    filePath: path.join(assetRoot, "hair-patch-client-arnav.png"),
    filename: "legacy-natural-hairline-client-arnav.png",
    contentType: "image/png",
  },
  {
    key: "natural-hairline-client-aryan",
    filePath: path.join(assetRoot, "hair-patch-client-aryan.png"),
    filename: "legacy-natural-hairline-client-aryan.png",
    contentType: "image/png",
  },
  {
    key: "natural-hairline-doctor-design",
    filePath: path.join(assetRoot, "natural-design-doctor.png"),
    filename: "legacy-natural-hairline-doctor-design.png",
    contentType: "image/png",
  },
  {
    key: "legacy-smp-step-1",
    filePath: path.join(assetRoot, "smp-step-1.png"),
    filename: "legacy-smp-step-1.png",
    contentType: "image/png",
  },
  {
    key: "legacy-smp-step-2",
    filePath: path.join(assetRoot, "smp-step-2.png"),
    filename: "legacy-smp-step-2.png",
    contentType: "image/png",
  },
  {
    key: "legacy-smp-step-3",
    filePath: path.join(assetRoot, "smp-step-3.png"),
    filename: "legacy-smp-step-3.png",
    contentType: "image/png",
  },
  {
    key: "legacy-smp-step-4",
    filePath: path.join(assetRoot, "smp-step-4.png"),
    filename: "legacy-smp-step-4.png",
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
        filename: target.filename,
        objectKey,
        url: getPublicUrl(target.filename),
      });
      continue;
    }

    const body = await readFile(target.filePath);
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
      filename: target.filename,
      objectKey,
      url: getPublicUrl(target.filename),
    });
  }

  console.log(JSON.stringify(output, null, 2));
}

main().catch((error) => {
  console.error("Legacy shared media upload failed:", error);
  process.exit(1);
});
