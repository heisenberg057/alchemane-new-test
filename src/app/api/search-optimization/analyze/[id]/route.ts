import { NextResponse } from "next/server";
import { BadRequestError } from "@/lib/api/errors";
import { jsonSuccess } from "@/lib/api/response";
import { analyzePost } from "@/lib/services/seoAnalysis.service";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handlePOST(request: Request, context: any) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  const { id } = await context.params;
  if (id == null || id === "") {
    throw new BadRequestError("Invalid post id");
  }

  try {
    const doc = await analyzePost(String(id));
    return NextResponse.json(jsonSuccess(doc, "Analysis complete"));
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new BadRequestError(msg);
  }
}

export const POST = withErrorHandling(handlePOST);
