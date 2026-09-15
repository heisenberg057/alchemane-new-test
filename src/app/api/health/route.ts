import { NextResponse } from "next/server";
import { jsonSuccess } from "@/lib/api/response";
import { withErrorHandling } from "@/lib/api/withErrorHandling";
import { isPostgresReachable } from "@/lib/api/postgresReachable";

async function checkDatabase(): Promise<"ok" | "skip" | "error"> {
  try {
    if (process.env.PAYLOAD_SKIP_DB === "1") return "skip";
    // TCP probe only — do not query user/PII collections from the public health endpoint.
    const reachable = await isPostgresReachable(true);
    return reachable ? "ok" : "error";
  } catch {
    return "error";
  }
}

async function handleGET(request: Request) {
  const url = new URL(request.url);
  const deep = url.searchParams.get("deep") === "1";

  const body: {
    status: "ok" | "degraded";
    timestamp: string;
    database?: "ok" | "skip" | "error";
  } = {
    status: "ok",
    timestamp: new Date().toISOString(),
  };

  if (deep) {
    body.database = await checkDatabase();
    if (body.database === "error") {
      body.status = "degraded";
      return NextResponse.json(jsonSuccess(body), { status: 503 });
    }
  }

  return NextResponse.json(jsonSuccess(body));
}

export const GET = withErrorHandling(handleGET);
