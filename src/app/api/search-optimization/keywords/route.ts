import { NextResponse } from "next/server";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { jsonSuccess } from "@/lib/api/response";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handleGET(request: Request) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  const url = new URL(request.url);
  const limit = Math.min(Number(url.searchParams.get("limit")) || 100, 300);

  const payload = await getPayloadSingleton();
  const res = await payload.find({
    collection: "keywords",
    sort: "keyword",
    limit,
    depth: 0,
    overrideAccess: true,
  });

  return NextResponse.json(jsonSuccess(res.docs));
}

export const GET = withErrorHandling(handleGET);
