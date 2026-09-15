import { NextResponse } from "next/server";
import { NotFoundError } from "@/lib/api/errors";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { jsonSuccess } from "@/lib/api/response";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handleGET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  const { id } = await context.params;
  const url = new URL(request.url);
  const limit = Math.min(Number(url.searchParams.get("limit")) || 50, 200);
  const page = Math.max(Number(url.searchParams.get("page")) || 1, 1);

  const payload = await getPayloadSingleton();

  let wh: { id?: string | number };
  try {
    wh = (await payload.findByID({
      collection: "webhooks",
      id,
      depth: 0,
      overrideAccess: true,
    })) as { id?: string | number };
  } catch {
    throw new NotFoundError("Webhook not found");
  }

  if (!wh?.id) {
    throw new NotFoundError("Webhook not found");
  }

  const res = await payload.find({
    collection: "webhook-logs",
    where: { webhook: { equals: id } },
    sort: "-createdAt",
    limit,
    page,
    depth: 0,
    overrideAccess: true,
  });

  const logs = res.docs.map((d) => ({
    id: String(d.id),
    event: d.event,
    status: d.status,
    statusCode: d.statusCode,
    attempts: d.attempts,
    duration: d.duration,
    errorMessage: d.errorMessage,
    payload: d.payload ?? null,
    response: d.response ?? null,
    createdAt: d.createdAt,
  }));

  return NextResponse.json(
    jsonSuccess({
      logs,
      totalDocs: res.totalDocs,
      page: res.page,
      totalPages: res.totalPages,
    })
  );
}

export const GET = withErrorHandling(handleGET);
