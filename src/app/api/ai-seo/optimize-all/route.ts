import { NextResponse } from "next/server";
import { jsonSuccess } from "@/lib/api/response";
import { optimizeAllPublishedPosts } from "@/lib/services/aiSeo.service";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handlePOST(request: Request) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  const result = await optimizeAllPublishedPosts();
  return NextResponse.json(jsonSuccess(result, "Batch optimization finished"));
}

export const POST = withErrorHandling(handlePOST);
