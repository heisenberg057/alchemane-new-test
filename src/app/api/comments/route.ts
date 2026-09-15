import { NextResponse } from "next/server";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { jsonError, jsonSuccess } from "@/lib/api/response";
import { withErrorHandling } from "@/lib/api/withErrorHandling";
import { sanitizeString } from "@/lib/security/sanitize";
import { assertNoSqlInjectionInValue } from "@/lib/security/sqlPatternGuard";
import { commentCreateSchema } from "@/lib/security/validation";
import {
  clientIpFromRequest,
  verifyTurnstileToken,
} from "@/lib/security/turnstile";

async function handleGET(request: Request) {
  const { searchParams } = new URL(request.url);
  const postId = searchParams.get("postId");
  if (!postId || !/^\d+$/.test(postId)) {
    return NextResponse.json(jsonError("postId is required"), { status: 400 });
  }

  const payload = await getPayloadSingleton();
  const result = await payload.find({
    collection: "form-submissions",
    where: {
      and: [
        { type: { equals: "comment" } },
        { subject: { equals: `comment:${postId}` } },
      ],
    },
    sort: "-createdAt",
    limit: 50,
    overrideAccess: true,
  });

  // Return only safe public fields — no email, no sourceUrl
  const comments = result.docs.map((doc) => ({
    id: doc.id,
    name: doc.name ?? "Anonymous",
    message: doc.message ?? "",
    createdAt: doc.createdAt,
  }));

  return NextResponse.json(jsonSuccess(comments));
}

export const GET = withErrorHandling(handleGET);

async function handlePOST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(jsonError("Invalid JSON"), { status: 400 });
  }

  const parsed = commentCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      jsonError("Validation failed", parsed.error.flatten()),
      { status: 400 }
    );
  }

  try {
    assertNoSqlInjectionInValue(parsed.data, new Set());
  } catch {
    return NextResponse.json(jsonError("Invalid input"), { status: 400 });
  }

  const ip = clientIpFromRequest(request);
  const turnstileOk = await verifyTurnstileToken(parsed.data.turnstileToken, ip);
  if (!turnstileOk) {
    console.warn("[comments] Turnstile verification failed");
    return NextResponse.json(
      jsonError("Bot verification failed. Please try again."),
      { status: 400 }
    );
  }

  const {
    postId,
    authorName,
    authorEmail,
    authorUrl,
    content,
  } = parsed.data;

  const payload = await getPayloadSingleton();
  const comment = await payload.create({
    collection: "form-submissions",
    data: {
      type: "comment",
      name: sanitizeString(authorName),
      email: sanitizeString(authorEmail),
      subject: `comment:${String(postId)}`,
      message: sanitizeString(content),
      sourceUrl: authorUrl ? sanitizeString(authorUrl) : undefined,
    },
    overrideAccess: true,
  });

  return NextResponse.json(
    jsonSuccess(
      {
        id: comment.id,
        name: comment.name ?? "Anonymous",
        message: comment.message ?? "",
        createdAt: comment.createdAt,
      },
      "Comment created"
    ),
    { status: 201 }
  );
}

export const POST = withErrorHandling(handlePOST);
