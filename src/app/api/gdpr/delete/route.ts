import { NextResponse } from "next/server";
import { startGdprRequest } from "@/lib/services/gdpr.service";
import { gdprEmailBodySchema } from "@/lib/security/validation";
import {
  clientIpFromRequest,
  verifyTurnstileToken,
} from "@/lib/security/turnstile";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid JSON" },
      { status: 400 }
    );
  }

  const parsed = gdprEmailBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Invalid request", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const ip = clientIpFromRequest(req);
  const turnstileOk = await verifyTurnstileToken(parsed.data.turnstileToken, ip);
  if (!turnstileOk) {
    return NextResponse.json(
      { success: false, message: "Bot verification failed. Please try again." },
      { status: 400 }
    );
  }

  try {
    await startGdprRequest(parsed.data.email, "delete");
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Request failed";
    return NextResponse.json({ success: false, message: msg }, { status: 503 });
  }

  return NextResponse.json({
    success: true,
    message: "Verification email sent",
  });
}
