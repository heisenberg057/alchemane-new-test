import { NextResponse } from "next/server";
import { BadRequestError, HttpError, NotFoundError, UnauthorizedError } from "./errors";
import { jsonError } from "./response";

type RouteHandler = (
  request: Request,
  // Next.js dynamic segment param shape varies by folder; callers use `context: any` in route modules.
  context?: any
) => Promise<Response>;

function statusFromError(e: unknown): { status: number; body: ReturnType<typeof jsonError> } {
  if (e instanceof UnauthorizedError) {
    return { status: 401, body: jsonError(e.message) };
  }
  if (e instanceof NotFoundError) {
    return { status: 404, body: jsonError(e.message) };
  }
  if (e instanceof BadRequestError) {
    return {
      status: 400,
      body: jsonError(e.message, e.errors),
    };
  }
  if (e instanceof HttpError) {
    return { status: e.status, body: jsonError(e.message, e.errors) };
  }
  console.error("[api]", e);
  return {
    status: 500,
    body: jsonError("Internal server error"),
  };
}

/**
 * Wraps a route handler and returns consistent JSON errors.
 */
export function withErrorHandling(handler: RouteHandler): RouteHandler {
  return async (request, context) => {
    try {
      return await handler(request, context);
    } catch (e) {
      const { status, body } = statusFromError(e);
      return NextResponse.json(body, { status });
    }
  };
}
