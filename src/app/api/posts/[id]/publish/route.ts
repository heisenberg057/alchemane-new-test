import { NextResponse } from "next/server";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { jsonSuccess } from "@/lib/api/response";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handlePATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  const { id } = await context.params;

  const payload = await getPayloadSingleton();
  const now = new Date().toISOString();

  const updated = await payload.update({
    collection: "posts",
    id,
    data: {
      _status: "published",
      publishedDate: now,
    },
    overrideAccess: true,
  });

  return NextResponse.json(jsonSuccess(updated, "Published"));
}

export const PATCH = withErrorHandling(handlePATCH);
