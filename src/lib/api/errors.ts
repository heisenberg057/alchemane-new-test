/** Structured HTTP error for API layer */
export class HttpError extends Error {
  readonly status: number;
  readonly errors: unknown | undefined;

  constructor(message: string, status: number, errors?: unknown) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.errors = errors;
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

export class ForbiddenError extends HttpError {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}

export class BadRequestError extends HttpError {
  constructor(message: string, errors?: unknown) {
    super(message, 400, errors);
  }
}

export class NotFoundError extends HttpError {
  constructor(message = "Not found") {
    super(message, 404);
  }
}
