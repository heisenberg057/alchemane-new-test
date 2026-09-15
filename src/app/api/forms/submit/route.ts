import { NextResponse } from "next/server";
import { BadRequestError, HttpError } from "@/lib/api/errors";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { contactFormSchema } from "@/lib/api/phase3Schemas";
import { jsonError, jsonSuccess } from "@/lib/api/response";
import { withErrorHandling } from "@/lib/api/withErrorHandling";
import { withValidation } from "@/lib/api/withValidation";
import { sendContactFormNotification } from "@/lib/services/email.service";
import {
  clientIpFromRequest,
  verifyTurnstileToken,
} from "@/lib/security/turnstile";

function logFormsSubmitError(err: unknown) {
  console.error("[forms/submit] error:", err);
  if (err instanceof Error) {
    console.error("[forms/submit] stack:", err.stack);
  }
  if (err instanceof HttpError && err.errors != null) {
    console.error(
      "[forms/submit] http error details:",
      JSON.stringify(err.errors)
    );
  }
}

async function handlePOST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      throw new BadRequestError("Invalid JSON");
    }

    const parsed = withValidation(contactFormSchema, body);
    const submissionType = parsed.formType ?? "contact";

    if (parsed.honeypot) {
      return NextResponse.json(
        jsonSuccess(undefined, "Form submitted successfully")
      );
    }

    const ip = clientIpFromRequest(request);
    const turnstileOk = await verifyTurnstileToken(parsed.turnstileToken, ip);
    if (!turnstileOk) {
      console.warn("[forms/submit] Turnstile verification failed");
      return NextResponse.json(
        jsonError("Bot verification failed. Please try again."),
        { status: 400 }
      );
    }

    const payload = await getPayloadSingleton();

    let sessionId: string | undefined =
      typeof parsed.sessionId === "string" ? parsed.sessionId : undefined;

    if (sessionId) {
      try {
        const found = await payload.find({
          collection: "ad-clicks",
          where: { sessionId: { equals: sessionId } },
          limit: 1,
          depth: 0,
          overrideAccess: true,
        });
        const click = found.docs[0];
        if (click) {
          await payload.update({
            collection: "ad-clicks",
            id: click.id,
            data: {
              converted: true,
              conversionType: "form_submission",
            },
            overrideAccess: true,
          });
          await payload.create({
            collection: "ad-conversions",
            data: {
              adClick: click.id,
              conversionType: "form_submission",
            },
            overrideAccess: true,
          });
        }
      } catch (e) {
        console.error("[forms/submit] tracking link error", e);
      }
    }

    const ipAddress =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";
    const userAgent = request.headers.get("user-agent") || "Local/Unknown";

    await payload.create({
      collection: "form-submissions",
      data: {
        type: submissionType,
        name: parsed.name,
        email: parsed.email,
        phone: parsed.phone || undefined,
        subject: parsed.subject,
        message: parsed.message,
        city: parsed.city,
        confirmPhone: parsed.confirmPhone,
        preferredTime: parsed.preferredTime,
        consultationMode: parsed.consultationMode,
        funnelSlug: parsed.funnelSlug,
        sourceUrl: request.headers.get("referer") ?? undefined,
        utmSource: parsed.utmSource,
        utmMedium: parsed.utmMedium,
        utmCampaign: parsed.utmCampaign,
        utmContent: parsed.utmContent,
        utmTerm: parsed.utmTerm,
        campaignName: parsed.campaignName,
        adSetName: parsed.adSetName,
        adName: parsed.adName,
        campaignSource: parsed.campaignSource,
        placement: parsed.placement,
        gclid: parsed.gclid,
        fbclid: parsed.fbclid,
        msclkid: parsed.msclkid,
        ttclid: parsed.ttclid,
        liFatId: parsed.li_fat_id,
        ipAddress,
        userAgent,
        timeOnSite: parsed.timeOnSite,
        pagesBefore: parsed.pagesBefore,
        scrollDepth: parsed.scrollDepth,
        status: "NEW", // Explicitly setting status since we deprecated leadStatus
      },
      overrideAccess: true,
    });

    void sendContactFormNotification({
      name: parsed.name,
      email: parsed.email || "Phone Inquiry Only",
      phone: parsed.phone || undefined,
      subject: parsed.subject,
      message: parsed.message,
      city: parsed.city,
      confirmPhone: parsed.confirmPhone,
      preferredTime: parsed.preferredTime,
      consultationMode: parsed.consultationMode,
      funnelSlug: parsed.funnelSlug,
    }).catch((err) => console.error("[forms/submit] admin notification failed", err));

    return NextResponse.json(
      jsonSuccess(undefined, "Form submitted successfully")
    );
  } catch (err) {
    logFormsSubmitError(err);
    throw err;
  }
}

export const POST = withErrorHandling(handlePOST);
