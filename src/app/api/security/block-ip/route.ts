import { NextResponse } from "next/server";
import { BadRequestError } from "@/lib/api/errors";
import { jsonSuccess } from "@/lib/api/response";
import { createBlockedIp } from "@/lib/api/securityAdmin";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handlePOST(request: Request) {
  const user = await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  let body: { ip?: string; reason?: string; durationMinutes?: number };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    throw new BadRequestError("Invalid JSON");
  }

  const ip = body.ip?.trim();
  const reason = body.reason?.trim();
  const durationMinutes = Number(body.durationMinutes);

  if (!ip || !reason) {
    throw new BadRequestError("IP and reason are required");
  }

  await createBlockedIp({
    ip,
    reason,
    durationMinutes: Number.isFinite(durationMinutes) ? durationMinutes : 60,
    userId: user.id,
  });

  return NextResponse.json(jsonSuccess(null, "IP blocked"));
}

export const POST = withErrorHandling(handlePOST);
