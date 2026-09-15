import { NextResponse } from "next/server";
import { jsonSuccess } from "@/lib/api/response";
import { cacheFlush } from "@/lib/services/cache.service";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handlePOST(request: Request) {
  await withAuth(request, ["SUPER_ADMIN"]);
  await cacheFlush();
  return NextResponse.json(jsonSuccess(null, "Cache cleared"));
}

export const POST = withErrorHandling(handlePOST);
