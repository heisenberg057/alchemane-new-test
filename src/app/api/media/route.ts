import configPromise from "@payload-config";
import { REST_GET, REST_POST } from "@payloadcms/next/routes";
import { NextResponse } from "next/server";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

/**
 * Authenticated wrapper around the Payload media REST handlers.
 *
 * GET  /api/media  — list media (admin-only; prevents public asset enumeration)
 * POST /api/media  — upload media (authenticated users only)
 *
 * The catch-all at `[[...slug]]/route.ts` honours the Media collection's
 * `read: () => true` policy, which would allow unauthenticated enumeration of
 * all media metadata. This route intercepts at a more specific path and gates
 * both methods behind `withAuth` before delegating to the Payload REST handler.
 */

const payloadGET = REST_GET(configPromise);
const payloadPOST = REST_POST(configPromise);

async function handleGET(request: Request): Promise<Response> {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN", "EDITOR"]);
  return payloadGET(request, { params: Promise.resolve({ slug: ["media"] }) });
}

async function handlePOST(request: Request): Promise<Response> {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN", "EDITOR"]);
  return payloadPOST(request, { params: Promise.resolve({ slug: ["media"] }) });
}

export const GET = withErrorHandling(handleGET);
export const POST = withErrorHandling(handlePOST);

export async function OPTIONS(): Promise<Response> {
  return new NextResponse(null, {
    status: 204,
    headers: { Allow: "GET, POST, OPTIONS" },
  });
}
