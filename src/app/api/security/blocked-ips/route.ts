import { NextResponse } from "next/server";
import { jsonSuccess } from "@/lib/api/response";
import { listBlockedIpsForAdmin } from "@/lib/api/securityAdmin";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handleGET(request: Request) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  const rows = await listBlockedIpsForAdmin();
  return NextResponse.json(jsonSuccess(rows));
}

export const GET = withErrorHandling(handleGET);
