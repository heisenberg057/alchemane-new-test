import { NextResponse } from "next/server";
import { jsonSuccess } from "@/lib/api/response";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";
import { startSeoWorker } from "@/lib/queue/seoWorker";

async function handlePOST(req: Request) {
  await withAuth(req, ["ADMIN", "SUPER_ADMIN"]);
  startSeoWorker();
  return NextResponse.json(
    jsonSuccess({ started: true }, "SEO BullMQ worker started")
  );
}

export const POST = withErrorHandling(handlePOST);
