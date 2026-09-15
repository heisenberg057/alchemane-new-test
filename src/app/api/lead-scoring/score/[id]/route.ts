import { NextResponse } from "next/server";
import { BadRequestError, NotFoundError } from "@/lib/api/errors";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { jsonSuccess } from "@/lib/api/response";
import { scoreLeadFromSubmission } from "@/lib/services/leadScoring.service";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handleGET(request: Request, context: any) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  const { id } = await context.params;

  const payload = await getPayloadSingleton();
  const found = await payload.find({
    collection: "lead-scores",
    where: { formSubmission: { equals: id } },
    limit: 1,
    depth: 1,
    overrideAccess: true,
  });

  if (!found.docs[0]) {
    throw new NotFoundError("Lead score not found for this submission");
  }

  return NextResponse.json(jsonSuccess(found.docs[0]));
}

async function handlePOST(request: Request, context: any) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  const { id } = await context.params;
  if (id == null || id === "") {
    throw new BadRequestError("Invalid form submission id");
  }

  try {
    const score = await scoreLeadFromSubmission(String(id));
    return NextResponse.json(
      jsonSuccess(score, "Lead scored successfully")
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("not found")) {
      throw new NotFoundError(msg);
    }
    throw new BadRequestError(msg);
  }
}

export const GET = withErrorHandling(handleGET);
export const POST = withErrorHandling(handlePOST);
