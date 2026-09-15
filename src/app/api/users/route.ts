import { NextResponse } from "next/server";
import { BadRequestError } from "@/lib/api/errors";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { jsonSuccess } from "@/lib/api/response";
import { withErrorHandling } from "@/lib/api/withErrorHandling";
import { withAuth } from "@/lib/api/withAuth";

async function handlePOST(request: Request) {
  await withAuth(request, ["SUPER_ADMIN"]);
  let body: { email?: string; password?: string; role?: string };
  try {
    body = (await request.json()) as {
      email?: string;
      password?: string;
      role?: string;
    };
  } catch {
    throw new BadRequestError("Invalid JSON body");
  }

  const email = body.email?.trim();
  const password = body.password;
  const role = (body.role || "EDITOR").toUpperCase();
  const allowedRoles = new Set(["SUPER_ADMIN", "ADMIN", "EDITOR", "USER"]);

  if (!email || !password) {
    throw new BadRequestError("Email and password are required");
  }
  if (!allowedRoles.has(role)) {
    throw new BadRequestError("Invalid role");
  }

  const payload = await getPayloadSingleton();
  const created = await payload.create({
    collection: "users",
    data: { email, password, role },
  });

  return NextResponse.json(
    jsonSuccess(
      {
        id: created.id,
        email: created.email,
        role: (created as { role?: string }).role || role,
      },
      "User created"
    ),
    { status: 201 }
  );
}

export const POST = withErrorHandling(handlePOST);
