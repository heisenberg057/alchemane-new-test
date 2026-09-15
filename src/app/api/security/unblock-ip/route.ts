import { NextResponse } from "next/server";
import { BadRequestError } from "@/lib/api/errors";
import { jsonSuccess } from "@/lib/api/response";
import { removeBlockedIpByAddress } from "@/lib/api/securityAdmin";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handlePOST(request: Request) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  let body: { ip?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    throw new BadRequestError("Invalid JSON");
  }

  const ip = body.ip?.trim();
  if (!ip) {
    throw new BadRequestError("IP is required");
  }

  await removeBlockedIpByAddress(ip);
  return NextResponse.json(jsonSuccess(null, "IP unblocked"));
}

export const POST = withErrorHandling(handlePOST);
