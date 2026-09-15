import configPromise from "@payload-config";
import type { Payload } from "payload";
import { getPayload } from "payload";
import {
  getGdprTokenSecret,
  signGdprToken,
  verifyGdprToken,
} from "@/lib/security/gdprTokens";
import {
  sendGdprVerification,
  sendGdprExportArchive,
} from "@/lib/services/email.service";

const VERIFY_TTL_SEC = 15 * 60;

function getPublicBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }
  const v = process.env.VERCEL_URL;
  if (v) {
    const withProto = v.startsWith("http") ? v : `https://${v}`;
    return withProto.replace(/\/$/, "");
  }
  return "http://localhost:3000";
}

async function getPayloadInstance(): Promise<Payload> {
  return getPayload({ config: configPromise });
}

const DELETED_PLACEHOLDER = "[deleted]";

/** Collect all data for an email across relevant collections and email it to the user. */
async function processGdprExport(payload: Payload, email: string): Promise<void> {
  const [formSubmissions, analytics, adClicks, leadScores] = await Promise.all([
    payload.find({
      collection: "form-submissions",
      where: { email: { equals: email } },
      limit: 1000,
      depth: 0,
      overrideAccess: true,
    }),
    payload.find({
      collection: "analytics",
      where: { email: { equals: email } },
      limit: 1000,
      depth: 0,
      overrideAccess: true,
    }),
    payload.find({
      collection: "ad-clicks",
      where: { email: { equals: email } },
      limit: 1000,
      depth: 0,
      overrideAccess: true,
    }),
    payload.find({
      collection: "lead-scores",
      where: { email: { equals: email } },
      limit: 1000,
      depth: 0,
      overrideAccess: true,
    }),
  ]);

  const archive = {
    exportedAt: new Date().toISOString(),
    email,
    formSubmissions: formSubmissions.docs,
    analytics: analytics.docs,
    adClicks: adClicks.docs,
    leadScores: leadScores.docs,
  };

  await sendGdprExportArchive(email, JSON.stringify(archive, null, 2));
}

/** Anonymize personal fields across collections for the given email. Does not hard-delete rows. */
async function processGdprDelete(payload: Payload, email: string): Promise<void> {
  const anonSubmission = {
    name: DELETED_PLACEHOLDER,
    email: DELETED_PLACEHOLDER,
    phone: DELETED_PLACEHOLDER,
    confirmPhone: DELETED_PLACEHOLDER,
    subject: DELETED_PLACEHOLDER,
    message: DELETED_PLACEHOLDER,
    city: DELETED_PLACEHOLDER,
    preferredTime: DELETED_PLACEHOLDER,
    consultationMode: DELETED_PLACEHOLDER,
    funnelSlug: DELETED_PLACEHOLDER,
    sourceUrl: DELETED_PLACEHOLDER,
    utmSource: DELETED_PLACEHOLDER,
    utmMedium: DELETED_PLACEHOLDER,
    utmCampaign: DELETED_PLACEHOLDER,
    utmContent: DELETED_PLACEHOLDER,
    utmTerm: DELETED_PLACEHOLDER,
    campaignName: DELETED_PLACEHOLDER,
    adSetName: DELETED_PLACEHOLDER,
    adName: DELETED_PLACEHOLDER,
    campaignSource: DELETED_PLACEHOLDER,
    placement: DELETED_PLACEHOLDER,
    gclid: DELETED_PLACEHOLDER,
    fbclid: DELETED_PLACEHOLDER,
    msclkid: DELETED_PLACEHOLDER,
    ttclid: DELETED_PLACEHOLDER,
    liFatId: DELETED_PLACEHOLDER,
    ipAddress: DELETED_PLACEHOLDER,
    userAgent: DELETED_PLACEHOLDER,
  };

  const submissions = await payload.find({
    collection: "form-submissions",
    where: { email: { equals: email } },
    limit: 1000,
    depth: 0,
    overrideAccess: true,
  });
  for (const doc of submissions.docs) {
    await payload.update({
      collection: "form-submissions",
      id: doc.id,
      data: anonSubmission,
      overrideAccess: true,
    });
  }

  const clicks = await payload.find({
    collection: "ad-clicks",
    where: { email: { equals: email } },
    limit: 1000,
    depth: 0,
    overrideAccess: true,
  });
  for (const doc of clicks.docs) {
    await payload.update({
      collection: "ad-clicks",
      id: doc.id,
      data: {
        email: DELETED_PLACEHOLDER,
        ipAddress: DELETED_PLACEHOLDER,
        userAgent: DELETED_PLACEHOLDER,
      },
      overrideAccess: true,
    });
  }

  const scores = await payload.find({
    collection: "lead-scores",
    where: { email: { equals: email } },
    limit: 1000,
    depth: 0,
    overrideAccess: true,
  });
  for (const doc of scores.docs) {
    await payload.update({
      collection: "lead-scores",
      id: doc.id,
      data: { email: DELETED_PLACEHOLDER },
      overrideAccess: true,
    });
  }

  // Analytics rows are typically keyed by IP/path, not email — clear any
  // accidental email matches and leave a clear audit placeholder.
  try {
    const analytics = await payload.find({
      collection: "analytics",
      where: { email: { equals: email } },
      limit: 1000,
      depth: 0,
      overrideAccess: true,
    });
    for (const doc of analytics.docs) {
      await payload.update({
        collection: "analytics",
        id: doc.id,
        data: {
          email: DELETED_PLACEHOLDER,
          ipAddress: DELETED_PLACEHOLDER,
          userAgent: DELETED_PLACEHOLDER,
        },
        overrideAccess: true,
      });
    }
  } catch {
    // Analytics schema may not include email — ignore field mismatch.
  }
}

export async function startGdprRequest(
  email: string,
  kind: "export" | "delete"
): Promise<{ requestId: string }> {
  const payload = await getPayloadInstance();
  const normalized = email.trim().toLowerCase();
  const doc = await payload.create({
    collection: "data-export-requests",
    data: {
      email: normalized,
      kind,
      status: "pending_verification",
    },
    overrideAccess: true,
  });

  const id = String(doc.id);
  const secret = getGdprTokenSecret();
  const exp = Math.floor(Date.now() / 1000) + VERIFY_TTL_SEC;
  const token = signGdprToken(
    { id, email: normalized, kind, exp },
    secret
  );

  const baseUrl = getPublicBaseUrl();
  const verifyUrl = `${baseUrl}/api/gdpr/verify?token=${encodeURIComponent(token)}`;

  try {
    await sendGdprVerification(normalized, verifyUrl);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Verification email failed";
    await payload.update({
      collection: "data-export-requests",
      id,
      data: {
        status: "failed",
        lastError: msg,
      },
      overrideAccess: true,
    });
    if (process.env.NODE_ENV !== "production") {
      console.info("[GDPR] Email failed; verification link (dev only):", verifyUrl);
    }
    throw new Error("Unable to send verification email. Please try again later.");
  }

  return { requestId: id };
}

export async function verifyAndProcessGdprToken(
  token: string
): Promise<{ ok: true; message: string } | { ok: false; message: string }> {
  let secret: string;
  try {
    secret = getGdprTokenSecret();
  } catch {
    return { ok: false, message: "Server misconfiguration" };
  }
  const parsed = verifyGdprToken(token, secret);
  if (!parsed) {
    return { ok: false, message: "Invalid or expired token" };
  }

  const payload = await getPayloadInstance();
  let existing;
  try {
    existing = await payload.findByID({
      collection: "data-export-requests",
      id: parsed.id,
      overrideAccess: true,
    });
  } catch {
    return { ok: false, message: "Request not found" };
  }

  if (!existing) {
    return { ok: false, message: "Request not found" };
  }

  const existingEmail = String(existing.email).trim().toLowerCase();
  if (existingEmail !== parsed.email || existing.kind !== parsed.kind) {
    return { ok: false, message: "Invalid token" };
  }

  if (existing.status !== "pending_verification") {
    return { ok: false, message: "Request already processed" };
  }

  const now = new Date().toISOString();

  await payload.update({
    collection: "data-export-requests",
    id: parsed.id,
    data: {
      status: "verified",
      verifiedAt: now,
    },
    overrideAccess: true,
  });

  await payload.update({
    collection: "data-export-requests",
    id: parsed.id,
    data: {
      status: "processing",
    },
    overrideAccess: true,
  });

  try {
    if (parsed.kind === "export") {
      await processGdprExport(payload, parsed.email);
    } else {
      await processGdprDelete(payload, parsed.email);
    }

    await payload.update({
      collection: "data-export-requests",
      id: parsed.id,
      data: {
        status: "completed",
        completedAt: new Date().toISOString(),
      },
      overrideAccess: true,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Processing failed";
    await payload.update({
      collection: "data-export-requests",
      id: parsed.id,
      data: {
        status: "failed",
        lastError: msg,
      },
      overrideAccess: true,
    });
    return { ok: false, message: msg };
  }

  return {
    ok: true,
    message:
      parsed.kind === "export"
        ? "Your data export has been sent to your email address."
        : "Your personal data has been anonymized from our systems.",
  };
}
