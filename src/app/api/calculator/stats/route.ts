import { NextResponse } from "next/server";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { jsonSuccess } from "@/lib/api/response";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handleGET(request: Request) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  const url = new URL(request.url);
  const days = Math.min(Number(url.searchParams.get("days")) || 30, 366);
  const type = url.searchParams.get("type");

  const dateFrom = new Date();
  dateFrom.setDate(dateFrom.getDate() - days);

  const payload = await getPayloadSingleton();

  const whereBase: Record<string, unknown> = {
    createdAt: { greater_than_equal: dateFrom.toISOString() },
  };
  if (type) {
    whereBase.type = { equals: type };
  }

  const totalRes = await payload.find({
    collection: "calculators",
    where: whereBase as never,
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });

  const convertedRes = await payload.find({
    collection: "calculators",
    where: {
      and: [
        whereBase as never,
        { leadCaptured: { equals: true } },
      ],
    },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });

  const total = totalRes.totalDocs;
  const converted = convertedRes.totalDocs;
  const conversionRate =
    total > 0 ? parseFloat(((converted / total) * 100).toFixed(1)) : 0;

  return NextResponse.json(
    jsonSuccess({ total, converted, conversionRate }, "Calculator stats retrieved")
  );
}

export const GET = withErrorHandling(handleGET);
