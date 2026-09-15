import { NextResponse } from "next/server";
import { NotFoundError } from "@/lib/api/errors";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { jsonSuccess } from "@/lib/api/response";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handleGET(
  request: Request,
  context: any
) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  const { keyword: raw } = await context.params;
  const keyword = decodeURIComponent(raw);

  const payload = await getPayloadSingleton();
  const res = await payload.find({
    collection: "keywords",
    where: { keyword: { equals: keyword } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });

  if (!res.docs[0]) {
    throw new NotFoundError("Keyword not tracked");
  }

  const history = res.docs[0].positionHistory ?? [];

  return NextResponse.json(
    jsonSuccess({ keyword, history })
  );
}

export const GET = withErrorHandling(handleGET);
