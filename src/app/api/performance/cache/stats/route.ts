import { NextResponse } from "next/server";
import { jsonSuccess } from "@/lib/api/response";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handleGET(request: Request) {
  await withAuth(request, ["SUPER_ADMIN"]);
  const hasRedis = Boolean(process.env.REDIS_URL?.trim());
  return NextResponse.json(
    jsonSuccess({
      backend: hasRedis ? "redis" : "memory",
      redisConfigured: hasRedis,
    })
  );
}

export const GET = withErrorHandling(handleGET);
