import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { BadRequestError } from "@/lib/api/errors";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { jsonSuccess } from "@/lib/api/response";
import { withErrorHandling } from "@/lib/api/withErrorHandling";
import { withValidation } from "@/lib/api/withValidation";
import { getClientIpFromHeaders } from "@/lib/security/rateLimit";
import { adClickSchema } from "@/lib/security/validation";
import {
  getGeoLocation,
  parseUserAgent,
} from "@/lib/services/tracking.service";

async function handlePOST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new BadRequestError("Invalid JSON");
  }

  const parsed = withValidation(adClickSchema, body);
  const finalParams = {
    campaignName: parsed.campaignName,
    adSetName: parsed.adSetName,
    adName: parsed.adName,
    campaignSource: parsed.campaignSource,
    placement: parsed.placement,
    utmSource: parsed.utmSource,
    utmMedium: parsed.utmMedium,
    utmCampaign: parsed.utmCampaign,
    utmTerm: parsed.utmTerm,
    utmContent: parsed.utmContent,
  };

  const userAgent = request.headers.get("user-agent");
  const { device, browser } = parseUserAgent(userAgent);
  const ipRaw = getClientIpFromHeaders(request.headers);

  let country: string | undefined;
  let city: string | undefined;
  try {
    const geo = await getGeoLocation(ipRaw);
    if (geo) {
      country = geo.country;
      city = geo.city;
    }
  } catch {
    /* never break tracking */
  }

  const landingPage =
    parsed.landingPage ??
    request.headers.get("referer") ??
    "unknown";
  const referrer = parsed.referrer ?? request.headers.get("referer") ?? undefined;

  const finalSessionId = parsed.sessionId?.trim() || randomUUID();

  const payload = await getPayloadSingleton();

  const existing = await payload.find({
    collection: "ad-clicks",
    where: { sessionId: { equals: finalSessionId } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });

  if (existing.docs.length > 0) {
    return NextResponse.json(
      jsonSuccess({ sessionId: finalSessionId }, "Session already tracked")
    );
  }

  await payload.create({
    collection: "ad-clicks",
    data: {
      sessionId: finalSessionId,
      ...finalParams,
      landingPage,
      referrer,
      ipAddress: ipRaw,
      userAgent: userAgent ?? undefined,
      device: device ?? undefined,
      browser: browser ?? undefined,
      country: country ?? undefined,
      city: city ?? undefined,
    },
    overrideAccess: true,
  });

  return NextResponse.json(
    jsonSuccess({ sessionId: finalSessionId }, "Ad click captured")
  );
}

export const POST = withErrorHandling(handlePOST);
