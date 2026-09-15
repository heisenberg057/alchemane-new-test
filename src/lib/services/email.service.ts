/**
 * Email delivery via Resend when RESEND_API_KEY is set; otherwise console stub.
 * Templates mirror the legacy email config (contact, newsletter, password reset).
 */

export type ContactFormData = {
  name: string;
  email: string;
  phone?: string;
  confirmPhone?: string;
  city?: string;
  preferredTime?: string;
  consultationMode?: string;
  funnelSlug?: string;
  subject?: string;
  message: string;
};

const RESEND_API = "https://api.resend.com/emails";

function escapeHtml(raw: string): string {
  return raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function maskEmail(email: string): string {
  const [user, domain] = email.toLowerCase().split("@");
  if (!domain) return "***";
  return `${user?.[0] ?? "*"}***@${domain}`;
}

function defaultFrom(): string {
  return (
    process.env.RESEND_FROM_EMAIL?.trim() ||
    '"American Hairline" <onboarding@resend.dev>'
  );
}

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

async function deliver(
  to: string,
  subject: string,
  html: string,
  attachments?: Array<{ filename: string; content: string }>
): Promise<void> {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("RESEND_API_KEY is not configured");
    }
    console.info(
      "[email stub] would send",
      JSON.stringify({
        to: maskEmail(to),
        subject,
        htmlChars: html.length,
        attachments: attachments?.map((a) => a.filename),
      })
    );
    return;
  }

  const payload: Record<string, unknown> = {
    from: defaultFrom(),
    to: [to],
    subject,
    html,
  };
  if (attachments?.length) {
    payload.attachments = attachments;
  }

  const res = await fetch(RESEND_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`Resend ${res.status}: ${detail}`);
  }
}

/** Notify site admin of a new contact submission (legacy: ADMIN_EMAIL + contact template). */
export async function sendContactFormNotification(
  data: ContactFormData
): Promise<void> {
  const admin = process.env.ADMIN_EMAIL?.trim();
  if (!admin) {
    console.info(
      "[email] ADMIN_EMAIL not set; skipping contact notification",
      JSON.stringify({ submitter: maskEmail(data.email) })
    );
    return;
  }

  const subjectLine =
    (data.subject?.trim() && `New Contact: ${data.subject.trim()}`) ||
    "New Contact Form Submission";

  const html = `
        <h1>New Contact Form Submission</h1>
        <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(data.phone || "N/A")}</p>
        ${data.confirmPhone?.trim() ? `<p><strong>Confirm Phone:</strong> ${escapeHtml(data.confirmPhone.trim())}</p>` : ""}
        ${data.city?.trim() ? `<p><strong>City:</strong> ${escapeHtml(data.city.trim())}</p>` : ""}
        ${data.preferredTime?.trim() ? `<p><strong>Preferred Call Time:</strong> ${escapeHtml(data.preferredTime.trim())}</p>` : ""}
        ${data.consultationMode?.trim() ? `<p><strong>Consultation Mode:</strong> ${escapeHtml(data.consultationMode.trim())}</p>` : ""}
        ${data.funnelSlug?.trim() ? `<p><strong>Funnel:</strong> ${escapeHtml(data.funnelSlug.trim())}</p>` : ""}
        ${data.subject?.trim() ? `<p><strong>Subject:</strong> ${escapeHtml(data.subject.trim())}</p>` : ""}
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(data.message).replace(/\n/g, "<br/>")}</p>
      `;

  await deliver(admin, subjectLine, html);
}

export async function sendNewsletterConfirmation(email: string): Promise<void> {
  const html = `
        <h1>Welcome to Our Newsletter!</h1>
        <p>Hi there,</p>
        <p>Thank you for subscribing to the American Hairline newsletter (${escapeHtml(email)}). You'll be the first to know about our latest updates and offers.</p>
        <p>Best regards,<br>The American Hairline Team</p>
      `;

  await deliver(
    email,
    "Welcome to American Hairline Newsletter",
    html
  );
}

export async function sendPasswordReset(
  email: string,
  token: string
): Promise<void> {
  const base = getPublicBaseUrl();
  const resetUrl = `${base}/reset-password?token=${encodeURIComponent(token)}`;

  const html = `
        <h1>Password Reset Request</h1>
        <p>Hi,</p>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <p><a href="${resetUrl.replace(/"/g, "&quot;")}">Reset Password</a></p>
        <p>If you didn't request this, please ignore this email.</p>
      `;

  await deliver(email, "Reset Your Password", html);
}

export async function sendGdprVerification(
  email: string,
  verifyUrl: string
): Promise<void> {
  const html = `
        <h1>Confirm your data request</h1>
        <p>We received a request regarding your personal data.</p>
        <p><a href="${escapeHtml(verifyUrl)}">Verify and continue</a></p>
        <p>This link expires shortly. If you did not request this, you can ignore this email.</p>
      `;

  await deliver(email, "Confirm your American Hairline data request", html);
}

export async function sendGdprExportArchive(
  email: string,
  archiveJson: string
): Promise<void> {
  const html = `
        <h1>Your data export from American Hairline</h1>
        <p>Hi,</p>
        <p>As requested, your personal data export is attached as a JSON file.</p>
        <p>This file contains all data we hold for the email address <strong>${escapeHtml(email)}</strong>.</p>
        <p>If you did not request this export, please contact us immediately.</p>
        <p>— American Hairline Team</p>
      `;

  const content = Buffer.from(archiveJson, "utf-8").toString("base64");
  await deliver(email, "Your American Hairline data export", html, [
    { filename: "ahl-data-export.json", content },
  ]);
}
