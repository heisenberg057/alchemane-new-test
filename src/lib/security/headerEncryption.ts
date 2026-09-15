/**
 * AES-256-GCM encryption for webhook header secrets stored in the database.
 *
 * Why AES-256-GCM:
 *   - Authenticated encryption: ciphertext integrity is verified on decrypt,
 *     so tampered DB values are rejected rather than silently decrypted wrong.
 *   - 256-bit key derived from PAYLOAD_SECRET via SHA-256, so no new env var is needed.
 *   - Random 12-byte IV per encryption, so identical secrets produce different ciphertexts.
 *
 * Storage format (stored in `headers` JSON field):
 *   { "__encrypted": true, "data": "<base64(iv:authTag:ciphertext)>" }
 *
 * On read, the delivery engine calls `decryptHeaders()` to get back the real object.
 * On write, `encryptHeaders()` is called in the Payload `beforeChange` hook.
 */

import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_BYTES = 12;
const AUTH_TAG_BYTES = 16;

function deriveKey(): Buffer {
  const secret = process.env.PAYLOAD_SECRET;
  if (!secret) throw new Error("PAYLOAD_SECRET is not set — cannot encrypt webhook headers");
  // SHA-256 of the secret gives us a deterministic 32-byte key
  return crypto.createHash("sha256").update(secret).digest();
}

/**
 * Encrypts a headers object. Returns the encrypted envelope or the original
 * object unchanged if headers is empty / not an object (nothing to encrypt).
 */
export function encryptHeaders(
  headers: unknown
): Record<string, unknown> {
  if (!headers || typeof headers !== "object" || Array.isArray(headers)) {
    return (headers ?? {}) as Record<string, unknown>;
  }

  const entries = Object.entries(headers as Record<string, unknown>);
  if (entries.length === 0) return {};

  // Already encrypted — pass through to avoid double-encrypting
  const h = headers as Record<string, unknown>;
  if (h.__encrypted === true) return h;

  const key = deriveKey();
  const iv = crypto.randomBytes(IV_BYTES);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const plaintext = JSON.stringify(headers);
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();

  // Pack iv + authTag + ciphertext into a single base64 string
  const packed = Buffer.concat([iv, authTag, encrypted]).toString("base64");

  return { __encrypted: true, data: packed };
}

/**
 * Decrypts an encrypted headers envelope back to the original object.
 * If the value is not encrypted (plain object), returns it as-is so the
 * system degrades gracefully for webhooks created before encryption was added.
 */
export function decryptHeaders(
  stored: unknown
): Record<string, string> {
  if (!stored || typeof stored !== "object" || Array.isArray(stored)) {
    return {};
  }

  const h = stored as Record<string, unknown>;

  // Not an encrypted envelope — plain headers (legacy or no secrets set)
  if (h.__encrypted !== true || typeof h.data !== "string") {
    return h as Record<string, string>;
  }

  try {
    const key = deriveKey();
    const packed = Buffer.from(h.data, "base64");

    const iv = packed.subarray(0, IV_BYTES);
    const authTag = packed.subarray(IV_BYTES, IV_BYTES + AUTH_TAG_BYTES);
    const ciphertext = packed.subarray(IV_BYTES + AUTH_TAG_BYTES);

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString("utf8");
    return JSON.parse(decrypted) as Record<string, string>;
  } catch {
    // Decryption failure (wrong key, tampered data) — return empty to avoid
    // leaking partial data and to surface a delivery failure rather than a silent breach
    return {};
  }
}
