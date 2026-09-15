import { NextResponse } from "next/server";
import { BadRequestError } from "@/lib/api/errors";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { newsletterFormSchema } from "@/lib/api/phase3Schemas";
import { jsonError, jsonSuccess } from "@/lib/api/response";
import { withErrorHandling } from "@/lib/api/withErrorHandling";
import { withValidation } from "@/lib/api/withValidation";
import { sendNewsletterConfirmation } from "@/lib/services/email.service";
import {
  clientIpFromRequest,
  verifyTurnstileToken,
} from "@/lib/security/turnstile";

async function handlePOST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new BadRequestError("Invalid JSON");
  }

  const parsed = withValidation(newsletterFormSchema, body);

  if (parsed.honeypot) {
    return NextResponse.json(
      jsonSuccess(undefined, "Subscribed successfully")
    );
  }

  const ip = clientIpFromRequest(request);
  const turnstileOk = await verifyTurnstileToken(parsed.turnstileToken, ip);
  if (!turnstileOk) {
    return NextResponse.json(
      jsonError("Bot verification failed. Please try again."),
      { status: 400 }
    );
  }

  const payload = await getPayloadSingleton();
  await payload.create({
    collection: "form-submissions",
    data: {
      type: "newsletter",
      email: parsed.email,
      message: "Newsletter signup",
      sourceUrl: request.headers.get("referer") ?? undefined,
    },
    overrideAccess: true,
  });

  void sendNewsletterConfirmation(parsed.email).catch((err) =>
    console.error("[forms/newsletter] confirmation email failed", err)
  );

  return NextResponse.json(
    jsonSuccess(undefined, "Subscribed successfully")
  );
}

export const POST = withErrorHandling(handlePOST);
