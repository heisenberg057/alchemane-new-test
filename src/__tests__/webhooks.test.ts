/**
 * Webhook security tests
 *
 * Covers:
 *   - SSRF allow/deny (hostname patterns + DNS-resolved private IPs)
 *   - Header encryption / decryption round-trip
 *   - Decrypt-graceful-degradation for legacy plaintext headers
 *   - Tampered ciphertext rejected cleanly
 *   - Masked-sentinel preservation on update (mergeHeaders)
 *   - serializeWebhook masks secret values in API response
 *   - normalizeWebhookEvents handles all input shapes
 *
 * No real DB or network — all external deps are mocked.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// ── DNS mock (must be before ssrf import) ─────────────────────────────────────

vi.mock("dns/promises", () => ({
  default: {
    lookup: vi.fn(),
  },
}));

import dns from "dns/promises";

// ── env mock (required by headerEncryption) ───────────────────────────────────

process.env.PAYLOAD_SECRET = "test-payload-secret-at-least-32-chars-long!!";

// ── Imports under test ────────────────────────────────────────────────────────

import {
  validateWebhookUrl,
  validateWebhookUrlAsync,
} from "@/lib/security/ssrf";

import {
  encryptHeaders,
  decryptHeaders,
} from "@/lib/security/headerEncryption";

import {
  normalizeWebhookEvents,
  serializeWebhook,
} from "@/lib/api/webhooksHelpers";

// ─────────────────────────────────────────────────────────────────────────────
// 1. SSRF — synchronous fast check
// ─────────────────────────────────────────────────────────────────────────────

describe("validateWebhookUrl (fast / sync)", () => {
  it("allows a valid public https URL", () => {
    expect(validateWebhookUrl("https://connect.pabbly.com/workflow/abc123")).toBeNull();
  });

  it("allows n8n domain URL", () => {
    expect(validateWebhookUrl("https://n8n.amankhan.space/webhook/test-id")).toBeNull();
  });

  it("blocks localhost", () => {
    expect(validateWebhookUrl("http://localhost:3000/hook")).not.toBeNull();
  });

  it("blocks 127.0.0.1 loopback", () => {
    expect(validateWebhookUrl("http://127.0.0.1:5678/webhook")).not.toBeNull();
  });

  it("blocks 10.x.x.x RFC1918", () => {
    expect(validateWebhookUrl("https://10.0.0.1/api")).not.toBeNull();
  });

  it("blocks 192.168.x.x RFC1918", () => {
    expect(validateWebhookUrl("http://192.168.1.100/hook")).not.toBeNull();
  });

  it("blocks 172.16.x.x RFC1918", () => {
    expect(validateWebhookUrl("https://172.16.0.1/hook")).not.toBeNull();
  });

  it("blocks 172.31.255.255 (upper end of RFC1918 /12)", () => {
    expect(validateWebhookUrl("https://172.31.255.255/hook")).not.toBeNull();
  });

  it("allows 172.32.0.0 (just outside the RFC1918 /12 block)", () => {
    expect(validateWebhookUrl("https://172.32.0.0/hook")).toBeNull();
  });

  it("blocks 169.254.169.254 (AWS metadata endpoint)", () => {
    expect(validateWebhookUrl("http://169.254.169.254/latest/meta-data/")).not.toBeNull();
  });

  it("blocks IPv6 loopback ::1", () => {
    expect(validateWebhookUrl("http://[::1]/hook")).not.toBeNull();
  });

  it("blocks non-http/https protocols", () => {
    expect(validateWebhookUrl("ftp://example.com/hook")).not.toBeNull();
    expect(validateWebhookUrl("file:///etc/passwd")).not.toBeNull();
  });

  it("rejects unparseable URLs", () => {
    expect(validateWebhookUrl("not-a-url")).not.toBeNull();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. SSRF — async DNS-resolved check
// ─────────────────────────────────────────────────────────────────────────────

describe("validateWebhookUrlAsync (DNS-resolved)", () => {
  const mockLookup = dns.lookup as ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockLookup.mockReset();
  });

  it("passes a public hostname that resolves to a public IP", async () => {
    mockLookup.mockResolvedValue([{ address: "104.21.45.67", family: 4 }]);
    const result = await validateWebhookUrlAsync("https://connect.pabbly.com/webhook/abc");
    expect(result).toBeNull();
  });

  it("blocks a public hostname that resolves to RFC1918 10.x (DNS rebinding)", async () => {
    mockLookup.mockResolvedValue([{ address: "10.0.0.1", family: 4 }]);
    const result = await validateWebhookUrlAsync("https://evil.example.com/hook");
    expect(result).not.toBeNull();
    expect(result).toContain("10.0.0.1");
  });

  it("blocks a hostname resolving to 192.168.x.x", async () => {
    mockLookup.mockResolvedValue([{ address: "192.168.0.254", family: 4 }]);
    const result = await validateWebhookUrlAsync("https://internal.example.com/hook");
    expect(result).not.toBeNull();
  });

  it("blocks a hostname resolving to 127.0.0.1", async () => {
    mockLookup.mockResolvedValue([{ address: "127.0.0.1", family: 4 }]);
    const result = await validateWebhookUrlAsync("https://loop.example.com/hook");
    expect(result).not.toBeNull();
  });

  it("blocks a hostname resolving to IPv6 ULA fc::", async () => {
    mockLookup.mockResolvedValue([{ address: "fc00::1", family: 6 }]);
    const result = await validateWebhookUrlAsync("https://ipv6-internal.example.com/hook");
    expect(result).not.toBeNull();
  });

  it("blocks when DNS resolution fails (treat as unsafe)", async () => {
    mockLookup.mockRejectedValue(new Error("ENOTFOUND"));
    const result = await validateWebhookUrlAsync("https://nonexistent-domain-xyz.invalid/hook");
    expect(result).not.toBeNull();
  });

  it("still blocks bare private IPs without DNS lookup (fast path)", async () => {
    // fast check handles bare IPs — DNS mock should not be called
    const result = await validateWebhookUrlAsync("https://10.1.2.3/hook");
    expect(result).not.toBeNull();
    expect(mockLookup).not.toHaveBeenCalled();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. Header encryption / decryption
// ─────────────────────────────────────────────────────────────────────────────

describe("encryptHeaders / decryptHeaders", () => {
  it("round-trips a headers object correctly", () => {
    const original = { Authorization: "Bearer secret-api-key", "X-Custom": "value" };
    const encrypted = encryptHeaders(original);
    expect(encrypted.__encrypted).toBe(true);
    expect(typeof encrypted.data).toBe("string");

    const decrypted = decryptHeaders(encrypted);
    expect(decrypted).toEqual(original);
  });

  it("produces different ciphertexts for the same input (random IV)", () => {
    const headers = { Authorization: "Bearer same-key" };
    const enc1 = encryptHeaders(headers) as { data: string };
    const enc2 = encryptHeaders(headers) as { data: string };
    expect(enc1.data).not.toBe(enc2.data);
  });

  it("returns empty object for empty headers input", () => {
    expect(encryptHeaders({})).toEqual({});
    expect(encryptHeaders(null)).toEqual({});
    expect(encryptHeaders(undefined)).toEqual({});
  });

  it("does not double-encrypt an already-encrypted envelope", () => {
    const headers = { Authorization: "Bearer key" };
    const once = encryptHeaders(headers);
    const twice = encryptHeaders(once);
    // Should be the same object (not double-wrapped)
    expect(twice.__encrypted).toBe(true);
    expect(typeof (twice as { data: string }).data).toBe("string");
    // Decrypting the twice result should still yield original
    const decrypted = decryptHeaders(twice);
    expect(decrypted).toEqual(headers);
  });

  it("decrypts legacy plain headers without error (backward compat)", () => {
    const plain = { Authorization: "Bearer old-key", "Content-Type": "application/json" };
    const result = decryptHeaders(plain);
    expect(result).toEqual(plain);
  });

  it("returns empty object for null/undefined stored value", () => {
    expect(decryptHeaders(null)).toEqual({});
    expect(decryptHeaders(undefined)).toEqual({});
  });

  it("returns empty object when ciphertext is tampered", () => {
    const headers = { Authorization: "Bearer secret" };
    const encrypted = encryptHeaders(headers) as { __encrypted: boolean; data: string };
    // Corrupt the base64 payload
    const tampered = { __encrypted: true, data: encrypted.data.slice(0, -4) + "XXXX" };
    const result = decryptHeaders(tampered);
    expect(result).toEqual({});
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. Masked-sentinel preservation (mergeHeaders logic)
// ─────────────────────────────────────────────────────────────────────────────

describe("mask sentinel preservation on update", () => {
  const MASK = "••••••••••••••••";

  /**
   * Inline implementation of the mergeHeaders logic from the PUT route.
   * This tests the behaviour in isolation without needing to spin up the route.
   */
  function mergeHeaders(
    existingRaw: unknown,
    incoming: Record<string, unknown>
  ): Record<string, unknown> {
    const existingPlain = decryptHeaders(existingRaw);
    const merged: Record<string, unknown> = { ...incoming };
    for (const [key, value] of Object.entries(incoming)) {
      if (value === MASK) {
        if (key in existingPlain) {
          merged[key] = existingPlain[key];
        } else {
          delete merged[key];
        }
      }
    }
    return merged;
  }

  it("restores real value when incoming value is the mask sentinel", () => {
    const realHeaders = { Authorization: "Bearer REAL_SECRET_KEY", "Content-Type": "application/json" };
    const encrypted = encryptHeaders(realHeaders);
    const incoming = { Authorization: MASK, "Content-Type": "application/json" };
    const merged = mergeHeaders(encrypted, incoming);
    expect(merged.Authorization).toBe("Bearer REAL_SECRET_KEY");
    expect(merged["Content-Type"]).toBe("application/json");
  });

  it("updates key when incoming value is NOT the mask sentinel", () => {
    const realHeaders = { Authorization: "Bearer OLD_KEY" };
    const encrypted = encryptHeaders(realHeaders);
    const incoming = { Authorization: "Bearer NEW_KEY" };
    const merged = mergeHeaders(encrypted, incoming);
    expect(merged.Authorization).toBe("Bearer NEW_KEY");
  });

  it("adds a new key that was not in the original headers", () => {
    const realHeaders = { Authorization: "Bearer KEY" };
    const encrypted = encryptHeaders(realHeaders);
    const incoming = { Authorization: MASK, "X-New-Header": "new-value" };
    const merged = mergeHeaders(encrypted, incoming);
    expect(merged.Authorization).toBe("Bearer KEY");
    expect(merged["X-New-Header"]).toBe("new-value");
  });

  it("removes a masked key that does not exist in DB (defensive)", () => {
    const realHeaders = { Authorization: "Bearer KEY" };
    const encrypted = encryptHeaders(realHeaders);
    // Client sends a sentinel for a key that doesn't exist in DB — should be dropped
    const incoming = { Authorization: MASK, "X-Ghost": MASK };
    const merged = mergeHeaders(encrypted, incoming);
    expect(merged.Authorization).toBe("Bearer KEY");
    expect("X-Ghost" in merged).toBe(false);
  });

  it("handles plain (legacy/unencrypted) existing headers gracefully", () => {
    const plain = { Authorization: "Bearer LEGACY_KEY" };
    const incoming = { Authorization: MASK };
    const merged = mergeHeaders(plain, incoming);
    expect(merged.Authorization).toBe("Bearer LEGACY_KEY");
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. serializeWebhook — API response secret masking
// ─────────────────────────────────────────────────────────────────────────────

describe("serializeWebhook — header masking in API response", () => {
  const MASK = "••••••••••••••••";

  function makeDoc(headers: unknown): Record<string, unknown> {
    return {
      id: "wh-1",
      name: "Test",
      url: "https://connect.pabbly.com/webhook/abc",
      method: "POST",
      events: ["form.submitted"],
      headers,
      payload: null,
      isActive: true,
      retryAttempts: 3,
      retryDelay: 5000,
      timeout: 30000,
      lastSuccess: null,
      lastFailure: null,
      successCount: 0,
      failureCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  it("masks Authorization header value in API response", () => {
    const doc = makeDoc({ Authorization: "Bearer super-secret-key-12345" });
    const result = serializeWebhook(doc);
    const h = result.headers as Record<string, string>;
    expect(h.Authorization).toBe(MASK);
  });

  it("does not mask Content-Type (safe header)", () => {
    const doc = makeDoc({ "Content-Type": "application/json" });
    const result = serializeWebhook(doc);
    const h = result.headers as Record<string, string>;
    expect(h["Content-Type"]).toBe("application/json");
  });

  it("does not mask short values (8 chars or fewer)", () => {
    const doc = makeDoc({ "X-Short": "abc1234" }); // exactly 7 chars
    const result = serializeWebhook(doc);
    const h = result.headers as Record<string, string>;
    expect(h["X-Short"]).toBe("abc1234");
  });

  it("masks values longer than 8 chars that are not safe keys", () => {
    const doc = makeDoc({ "X-Api-Key": "a-long-api-key-value" });
    const result = serializeWebhook(doc);
    const h = result.headers as Record<string, string>;
    expect(h["X-Api-Key"]).toBe(MASK);
  });

  it("returns empty headers object when headers is null/undefined", () => {
    const doc = makeDoc(null);
    const result = serializeWebhook(doc);
    expect(result.headers).toEqual({});
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. normalizeWebhookEvents
// ─────────────────────────────────────────────────────────────────────────────

describe("normalizeWebhookEvents", () => {
  it("returns array as-is", () => {
    expect(normalizeWebhookEvents(["form.submitted"])).toEqual(["form.submitted"]);
  });

  it("wraps a single string in an array", () => {
    expect(normalizeWebhookEvents("form.submitted")).toEqual(["form.submitted"]);
  });

  it("extracts keys from an object", () => {
    expect(normalizeWebhookEvents({ "form.submitted": true })).toEqual(["form.submitted"]);
  });

  it("returns default event for null/undefined", () => {
    expect(normalizeWebhookEvents(null)).toEqual(["form.submitted"]);
    expect(normalizeWebhookEvents(undefined)).toEqual(["form.submitted"]);
  });
});
