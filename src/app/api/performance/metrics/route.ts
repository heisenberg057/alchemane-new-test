import { NextResponse } from "next/server";
import { jsonSuccess } from "@/lib/api/response";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";
import os from "os";

async function handleGET(request: Request) {
  await withAuth(request, ["SUPER_ADMIN"]);
  const mem = process.memoryUsage();
  return NextResponse.json(
    jsonSuccess({
      uptime: process.uptime(),
      memory: {
        rss: mem.rss,
        heapUsed: mem.heapUsed,
        heapTotal: mem.heapTotal,
      },
      loadavg: os.loadavg(),
      cpus: os.cpus().length,
    })
  );
}

export const GET = withErrorHandling(handleGET);
