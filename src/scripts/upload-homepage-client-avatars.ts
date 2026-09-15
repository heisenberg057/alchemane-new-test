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
loadDotEnv({ path: path.join(projectRoot, ".env"), override: false });

type UploadTarget = {
  key: string;
  sourceName: string;
  filename: string;
  contentType: string;
};

const sourceRoot = path.join(projectRoot, "..", "WEBSITE", "HERO SECTION CLIENT SMALL IMAGES");

const TARGETS: UploadTarget[] = [
  {
    key: "homepage-client-avatar-1",
    sourceName: "V1 IMAGE.png",
    filename: "runtime-homepage-client-avatar-1.png",
    contentType: "image/png",
  },
  {
    key: "homepage-client-avatar-2",
    sourceName: "V2 IMAGE.png",
    filename: "runtime-homepage-client-avatar-2.png",
    contentType: "image/png",
  },
  {
    key: "homepage-client-avatar-3",
    sourceName: "V3 IMAGE.png",
    filename: "runtime-homepage-client-avatar-3.png",
    contentType: "image/png",
  },
  {
    key: "homepage-client-avatar-4",
    sourceName: "V4 IMAGE.png",
    filename: "runtime-homepage-client-avatar-4.png",
    contentType: "image/png",
  },
  {
    key: "homepage-client-avatar-5",
    sourceName: "V5 IMAGE.png",
    filename: "runtime-homepage-client-avatar-5.png",
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
    await access(sourcePath, fsConstants.R_OK);

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
  console.error("Homepage client avatars upload failed:", error);
  process.exit(1);
});
