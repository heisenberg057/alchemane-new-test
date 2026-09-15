import type { Where } from "payload";
import { getPayloadSingleton } from "@/lib/api/getPayload";

/** Map UI severity (CRITICAL, HIGH, …) to stored eventLevel text. */
function severityToEventLevel(severity: string): string {
  const u = severity.toUpperCase();
  if (u === "CRITICAL") return "critical";
  if (u === "HIGH") return "high";
  if (u === "WARNING") return "warning";
  if (u === "INFO") return "info";
  return severity.toLowerCase();
}

export async function listSecurityLogsForAdmin(params: {
  page: number;
  limit: number;
  eventType?: string;
  eventLevel?: string;
  search?: string;
}) {
  const payload = await getPayloadSingleton();
  const { page, limit, eventType, eventLevel, search } = params;
  const and: Where[] = [];

  if (eventType) {
    and.push({ eventType: { contains: eventType } });
  }
  if (eventLevel) {
    const el = severityToEventLevel(eventLevel);
    and.push({
      or: [
        { eventLevel: { equals: el } },
        { eventLevel: { equals: eventLevel } },
        { eventLevel: { equals: eventLevel.toLowerCase() } },
        { eventLevel: { equals: eventLevel.toUpperCase() } },
      ],
    });
  }
  if (search?.trim()) {
    const q = search.trim();
    and.push({
      or: [
        { description: { contains: q } },
        { ipAddress: { contains: q } },
        { eventType: { contains: q } },
      ],
    });
  }

  const where: Where = and.length > 0 ? ({ and } as Where) : ({} as Where);

  const res = await payload.find({
    collection: "security-logs",
    where,
    page,
    limit,
    sort: "-createdAt",
    depth: 1,
    overrideAccess: true,
  });

  const logs = res.docs.map((doc) => {
    const d = doc as Record<string, unknown>;
    const eventLevel = String(d.eventLevel ?? "");
    const user = d.user as { email?: string; id?: string | number } | undefined;
    return {
      ...d,
      severity: eventLevel.toUpperCase(),
      user: user
        ? { email: user.email, id: user.id }
        : undefined,
    };
  });

  return {
    logs,
    meta: {
      total: res.totalDocs,
      pages: res.totalPages,
      page: res.page,
      limit: res.limit,
    },
  };
}

export async function listBlockedIpsForAdmin() {
  const payload = await getPayloadSingleton();
  const res = await payload.find({
    collection: "blocked-ips",
    limit: 500,
    sort: "-updatedAt",
    depth: 0,
    overrideAccess: true,
  });

  return res.docs.map((doc) => {
    const d = doc as Record<string, unknown>;
    const ip = String(d.ip ?? "");
    const blockedUntil = d.blockedUntil as string | null | undefined;
    return {
      ip,
      reason: typeof d.reason === "string" ? d.reason : "",
      createdAt: d.createdAt,
      expiresAt: blockedUntil ?? null,
      id: d.id,
    };
  });
}

export async function createBlockedIp(input: {
  ip: string;
  reason: string;
  durationMinutes: number;
  userId?: string | number;
}) {
  const payload = await getPayloadSingleton();
  const { ip, reason, durationMinutes, userId } = input;
  const permanent =
    !Number.isFinite(durationMinutes) || durationMinutes >= 525000;
  let blockedUntil: string | null = null;
  if (!permanent && durationMinutes > 0) {
    blockedUntil = new Date(
      Date.now() + durationMinutes * 60 * 1000
    ).toISOString();
  }

  const existing = await payload.find({
    collection: "blocked-ips",
    where: { ip: { equals: ip.trim() } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });

  const data: Record<string, unknown> = {
    ip: ip.trim(),
    reason,
    blockedUntil,
  };
  if (userId != null) {
    data.createdBy = userId;
  }

  if (existing.docs[0]) {
    await payload.update({
      collection: "blocked-ips",
      id: existing.docs[0].id,
      data,
      overrideAccess: true,
    });
  } else {
    await payload.create({
      collection: "blocked-ips",
      data,
      overrideAccess: true,
    });
  }
}

export async function removeBlockedIpByAddress(ip: string) {
  const payload = await getPayloadSingleton();
  const res = await payload.find({
    collection: "blocked-ips",
    where: { ip: { equals: ip.trim() } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });
  const doc = res.docs[0];
  if (doc) {
    await payload.delete({
      collection: "blocked-ips",
      id: doc.id,
      overrideAccess: true,
    });
  }
}

export async function getSecurityDashboardStats(days: number) {
  const payload = await getPayloadSingleton();
  const from = new Date();
  from.setDate(from.getDate() - Math.max(1, Math.min(days, 90)));

  const logs = await payload.find({
    collection: "security-logs",
    where: {
      createdAt: { greater_than_equal: from.toISOString() },
    },
    limit: 5000,
    depth: 0,
    overrideAccess: true,
  });

  let failedLogins = 0;
  let rateLimitHits = 0;
  for (const doc of logs.docs) {
    const d = doc as { eventType?: string; eventLevel?: string };
    const et = (d.eventType || "").toLowerCase();
    if (et.includes("login") && et.includes("fail")) failedLogins++;
    if (et.includes("rate") || (d.eventLevel || "").toLowerCase() === "warning")
      rateLimitHits++;
  }

  const blocked = await payload.find({
    collection: "blocked-ips",
    limit: 200,
    depth: 0,
    overrideAccess: true,
  });

  let activeSessions = 0;
  try {
    const sessionRes = await payload.find({
      collection: "users",
      limit: 0,
      depth: 0,
      overrideAccess: true,
    });
    // users_sessions is an internal Payload table; approximate via active user count
    activeSessions = sessionRes.totalDocs ?? 0;
  } catch {
    activeSessions = 0;
  }

  return {
    failedLogins,
    rateLimitHits,
    activeSessions,
    blockedIpCount: blocked.totalDocs,
  };
}
