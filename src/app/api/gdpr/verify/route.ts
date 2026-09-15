import { NextResponse } from "next/server";
import { verifyAndProcessGdprToken } from "@/lib/services/gdpr.service";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  if (!token) {
    return NextResponse.json(
      { success: false, message: "Missing token" },
      { status: 400 }
    );
  }

  const result = await verifyAndProcessGdprToken(token);
  if (!result.ok) {
    return NextResponse.json(
      { success: false, message: result.message },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true, message: result.message });
}
