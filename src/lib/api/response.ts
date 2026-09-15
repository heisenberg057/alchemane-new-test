export type ApiJsonBody<T = unknown> = {
  success: boolean;
  data?: T;
  message?: string;
  errors?: unknown;
};

export function jsonSuccess<T>(
  data?: T,
  message?: string
): ApiJsonBody<T> {
  const body: ApiJsonBody<T> = { success: true };
  if (data !== undefined) body.data = data;
  if (message !== undefined) body.message = message;
  return body;
}

export function jsonError(
  message: string,
  errors?: unknown
): ApiJsonBody {
  const body: ApiJsonBody = { success: false, message };
  if (errors !== undefined) body.errors = errors;
  return body;
}
