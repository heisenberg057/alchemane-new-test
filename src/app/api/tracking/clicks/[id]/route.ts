import { NextResponse } from "next/server";
import { NotFoundError } from "@/lib/api/errors";
import { jsonSuccess } from "@/lib/api/response";
import { getAdClickById } from "@/lib/api/trackingAggregates";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handleGET(request: Request, context: { params: Promise<{ id: string }> }) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN", "EDITOR"]);
  const { id } = await context.params;
  const doc = await getAdClickById(id);
  if (!doc) {
    throw new NotFoundError("Ad click not found");
  }
  return NextResponse.json(jsonSuccess(doc));
}

export const GET = withErrorHandling(handleGET);
