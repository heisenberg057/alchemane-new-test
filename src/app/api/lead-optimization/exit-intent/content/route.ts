import { NextResponse } from "next/server";
import { BadRequestError } from "@/lib/api/errors";
import { getExitIntentPopupContent } from "@/lib/api/exitIntentContent";
import { jsonSuccess } from "@/lib/api/response";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handleGET(request: Request) {
  const url = new URL(request.url);
  const page = url.searchParams.get("page");
  const device = url.searchParams.get("device") ?? "desktop";
  if (!page) {
    throw new BadRequestError("Missing page query parameter");
  }

  const content = getExitIntentPopupContent(page, device);
  return NextResponse.json(
    jsonSuccess(content, "Exit intent content retrieved")
  );
}

export const GET = withErrorHandling(handleGET);
