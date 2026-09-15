import type { z } from "zod";
import { BadRequestError } from "./errors";

export function withValidation<Schema extends z.ZodTypeAny>(
  schema: Schema,
  body: unknown
): z.infer<Schema> {
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    throw new BadRequestError("Validation failed", parsed.error.flatten());
  }
  return parsed.data;
}
