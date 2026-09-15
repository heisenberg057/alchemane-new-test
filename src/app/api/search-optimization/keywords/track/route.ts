import { NextResponse } from "next/server";
import { BadRequestError } from "@/lib/api/errors";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { keywordTrackSchema } from "@/lib/api/phase3Schemas";
import { jsonSuccess } from "@/lib/api/response";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";
import { withValidation } from "@/lib/api/withValidation";

async function handlePOST(request: Request) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new BadRequestError("Invalid JSON");
  }

  const parsed = withValidation(keywordTrackSchema, body);
  const rec = parsed as Record<string, unknown>;
  const keyword = String(rec.keyword ?? rec.term ?? "");
  if (!keyword.length) {
    throw new BadRequestError("keyword is required");
  }

  const position =
    typeof rec.position === "number"
      ? rec.position
      : rec.position != null
        ? Number(rec.position)
        : 50;
  const now = new Date().toISOString();
  const entry = {
    date: now,
    position: Number.isFinite(position) ? position : 50,
  };

  const payload = await getPayloadSingleton();
  const existing = await payload.find({
    collection: "keywords",
    where: { keyword: { equals: keyword } },
    limit: 1,
    overrideAccess: true,
  });

  let doc: unknown;
  if (existing.docs[0]) {
    const prev = (existing.docs[0].positionHistory as unknown[]) ?? [];
    doc = await payload.update({
      collection: "keywords",
      id: existing.docs[0].id,
      data: {
        position: entry.position,
        lastChecked: now,
        positionHistory: [...prev, entry],
        url: rec.url != null ? String(rec.url) : existing.docs[0].url,
      },
      overrideAccess: true,
    });
  } else {
    doc = await payload.create({
      collection: "keywords",
      data: {
        keyword,
        position: entry.position,
        searchVolume: rec.searchVolume != null ? Number(rec.searchVolume) : undefined,
        difficulty: rec.difficulty != null ? Number(rec.difficulty) : undefined,
        url: rec.url != null ? String(rec.url) : undefined,
        trackedSince: now,
        lastChecked: now,
        positionHistory: [entry],
      },
      overrideAccess: true,
    });
  }

  return NextResponse.json(jsonSuccess(doc, "Keyword tracked"));
}

export const POST = withErrorHandling(handlePOST);
