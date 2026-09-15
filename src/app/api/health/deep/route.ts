import { NextResponse } from "next/server";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { jsonSuccess } from "@/lib/api/response";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handleGET(request: Request) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  const payload = await getPayloadSingleton();
  let postsCount = 0;
  try {
    const r = await payload.find({
      collection: "posts",
      limit: 1,
      overrideAccess: true,
    });
    postsCount = r.totalDocs;
  } catch (e) {
    return NextResponse.json(
      {
        success: false,
        message: "Payload connectivity check failed",
        error: e instanceof Error ? e.message : String(e),
      },
      { status: 503 }
    );
  }

  let redisOk: boolean | "skipped" = "skipped";
  if (process.env.REDIS_URL) {
    try {
      const { default: Redis } = await import("ioredis");
      const client = new Redis(process.env.REDIS_URL, {
        maxRetriesPerRequest: 1,
        connectTimeout: 2000,
        lazyConnect: false,
      });
      const pong = await client.ping();
      redisOk = pong === "PONG";
      client.disconnect();
    } catch {
      redisOk = false;
    }
  }

  return NextResponse.json(
    jsonSuccess({
      payload: "ok",
      postsVisible: postsCount,
      redis: redisOk,
      timestamp: new Date().toISOString(),
    })
  );
}

export const GET = withErrorHandling(handleGET);
