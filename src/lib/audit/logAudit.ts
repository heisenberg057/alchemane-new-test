import type {
  CollectionAfterOperationHook,
  Payload,
  PayloadRequest,
} from "payload";

export type LogAuditInput = {
  action: string;
  entity: string;
  entityId?: string;
  actorId?: string | number;
  ip?: string;
  userAgent?: string;
  diffSummary?: string;
};

export async function logAudit(
  payload: Payload,
  input: LogAuditInput,
  req?: PayloadRequest
): Promise<void> {
  await payload.create({
    collection: "audit-logs",
    data: {
      action: input.action,
      entity: input.entity,
      entityId: input.entityId,
      ...(input.actorId != null ? { actor: input.actorId } : {}),
      ip: input.ip,
      userAgent: input.userAgent,
      diffSummary: input.diffSummary,
      timestamp: new Date().toISOString(),
    },
    ...(req ? { req } : {}),
    context: { skipAudit: true },
    overrideAccess: true,
  });
}

const AUDIT_OPS = new Set([
  "create",
  "update",
  "updateByID",
  "delete",
  "deleteByID",
]);

function headerIp(req: PayloadRequest): string | undefined {
  const h = req.headers;
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || undefined;
  }
  return h.get("x-real-ip") || undefined;
}

export function sensitiveCollectionAuditHook(
  entitySlug: string
): CollectionAfterOperationHook {
  return async (arg) => {
    const { operation, req, args, result } = arg;
    if ((req.context as { skipAudit?: boolean } | undefined)?.skipAudit) {
      return result;
    }
    if (!AUDIT_OPS.has(operation)) {
      return result;
    }

    const ip = headerIp(req);
    const userAgent = req.headers?.get("user-agent") || undefined;
    const actorId = req.user?.id;

    let entityId: string | undefined;
    let diffSummary: string | undefined;

    switch (operation) {
      case "create": {
        if (result && typeof result === "object" && "id" in result) {
          entityId = String((result as { id: unknown }).id);
        }
        diffSummary = "created";
        break;
      }
      case "updateByID":
      case "update": {
        const a = args as {
          id?: string | number;
          data?: Record<string, unknown>;
        };
        if (a.id != null) entityId = String(a.id);
        else if (
          result &&
          typeof result === "object" &&
          result !== null &&
          "id" in result
        ) {
          entityId = String((result as { id: unknown }).id);
        }
        const keys =
          a.data && typeof a.data === "object"
            ? Object.keys(a.data).filter(
                (k) =>
                  !["password", "salt", "hash", "resetPasswordToken"].includes(
                    k
                  )
              )
            : [];
        diffSummary = `updated fields: ${keys.slice(0, 48).join(", ")}`;
        break;
      }
      case "deleteByID": {
        const a = args as { id?: string | number };
        if (a.id != null) entityId = String(a.id);
        diffSummary = "deleted";
        break;
      }
      case "delete": {
        diffSummary = "bulk delete";
        break;
      }
      default:
        return result;
    }

    await logAudit(
      req.payload,
      {
        action: operation,
        entity: entitySlug,
        entityId,
        actorId,
        ip,
        userAgent,
        diffSummary,
      },
      req
    );

    return result;
  };
}
