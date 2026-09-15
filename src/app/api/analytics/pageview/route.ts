import { NextResponse } from "next/server";
import { tryGetPayloadSingleton } from "@/lib/api/getPayload";
import { jsonSuccess } from "@/lib/api/response";
import { withErrorHandling } from "@/lib/api/withErrorHandling";
import { withValidation } from "@/lib/api/withValidation";
import { BadRequestError } from "@/lib/api/errors";
import { getClientIpFromHeaders } from "@/lib/security/rateLimit";
import { pageviewSchema } from "@/lib/security/validation";

async function handlePOST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new BadRequestError("Invalid JSON");
  }

  const parsed = withValidation(pageviewSchema, body);
  const payload = await tryGetPayloadSingleton();
  if (!payload) {
    // Non-critical analytics — degrade quietly when CMS is down.
    return NextResponse.json(jsonSuccess({ recorded: false }));
  }

  const ip = getClientIpFromHeaders(request.headers);
  const userAgent =
    parsed.userAgent ?? request.headers.get("user-agent") ?? "unknown";

  try {
    const doc = await payload.create({
      collection: "analytics",
      data: {
        pageUrl: parsed.path,
        referrer: parsed.referrer ?? "direct",
        userAgent,
        ipAddress: ip,
      },
      overrideAccess: true,
    });
    return NextResponse.json(jsonSuccess({ recorded: true, id: doc.id }));
  } catch (e) {
    console.error("[analytics/pageview]", e);
    return NextResponse.json(jsonSuccess({ recorded: false }));
  }
}

export const POST = withErrorHandling(handlePOST);
