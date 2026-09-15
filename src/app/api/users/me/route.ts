import { NextResponse } from "next/server";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";
import { jsonSuccess } from "@/lib/api/response";

async function handleGET(request: Request) {
  const user = await withAuth(request);
  const raw = user as Record<string, unknown>;
  const safeUser = {
    id: raw.id != null ? String(raw.id) : "",
    email: typeof raw.email === "string" ? raw.email : "",
    name:
      typeof raw.name === "string"
        ? raw.name
        : typeof raw.email === "string"
          ? raw.email
          : "",
    role:
      typeof raw.role === "string" ? raw.role.toUpperCase() : "ADMIN",
  };

  return NextResponse.json(jsonSuccess({ user: safeUser }, "User fetched"));
}

export const GET = withErrorHandling(handleGET);
