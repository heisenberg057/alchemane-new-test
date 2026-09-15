export function buildThankYouUrl({
  name,
  phone,
}: {
  name?: string | null;
  phone?: string | null;
}) {
  const params = new URLSearchParams();

  const normalizedName = name?.trim();
  const normalizedPhone = phone?.replace(/\s+/g, "").trim();

  if (normalizedName) {
    params.set("fname", normalizedName);
  }

  if (normalizedPhone) {
    params.set("tel", normalizedPhone);
  }

  const qs = params.toString();
  return qs ? `/thank-you/?${qs}` : "/thank-you";
}

export function sanitizeThankYouText(value?: string | null) {
  if (!value) return "";
  return value.replace(/[<>]/g, "").trim().slice(0, 120);
}
