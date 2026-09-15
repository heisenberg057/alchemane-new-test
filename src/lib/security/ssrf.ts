/**
 * SSRF protection for outbound webhook URLs.
 *
 * Two-layer defence:
 *   1. Fast hostname/pattern check (catches obvious cases without a DNS round-trip).
 *   2. DNS resolution — resolves the hostname to an IP address and checks that
 *      resolved IP against private/internal ranges.  This blocks DNS-rebinding
 *      attacks where a public hostname resolves to an internal IP (e.g. 10.x,
 *      192.168.x, 169.254.x, ::1, etc.).
 *
 * Returns null if the URL is safe, or an error string describing the problem.
 */

import dns from "dns/promises";
import type { LookupAddress } from "dns";

// ── IPv4 private / reserved ranges ─────────────────────────────────────────

const BLOCKED_IPV4_CIDRS: Array<{ base: number; mask: number; label: string }> =
  [
    // 127.0.0.0/8  — loopback
    { base: ipToNum("127.0.0.0"), mask: cidrMask(8), label: "loopback" },
    // 10.0.0.0/8   — RFC1918 private
    { base: ipToNum("10.0.0.0"), mask: cidrMask(8), label: "private (RFC1918)" },
    // 172.16.0.0/12 — RFC1918 private
    { base: ipToNum("172.16.0.0"), mask: cidrMask(12), label: "private (RFC1918)" },
    // 192.168.0.0/16 — RFC1918 private
    { base: ipToNum("192.168.0.0"), mask: cidrMask(16), label: "private (RFC1918)" },
    // 169.254.0.0/16 — link-local / AWS metadata (169.254.169.254)
    { base: ipToNum("169.254.0.0"), mask: cidrMask(16), label: "link-local" },
    // 100.64.0.0/10  — CGNAT shared address space
    { base: ipToNum("100.64.0.0"), mask: cidrMask(10), label: "shared address space" },
    // 0.0.0.0/8     — "this" network
    { base: ipToNum("0.0.0.0"), mask: cidrMask(8), label: "reserved" },
    // 198.51.100.0/24 — TEST-NET-2 (documentation)
    { base: ipToNum("198.51.100.0"), mask: cidrMask(24), label: "reserved (TEST-NET)" },
    // 203.0.113.0/24 — TEST-NET-3 (documentation)
    { base: ipToNum("203.0.113.0"), mask: cidrMask(24), label: "reserved (TEST-NET)" },
    // 240.0.0.0/4   — reserved (class E)
    { base: ipToNum("240.0.0.0"), mask: cidrMask(4), label: "reserved (class E)" },
    // 255.255.255.255/32 — broadcast
    { base: ipToNum("255.255.255.255"), mask: cidrMask(32), label: "broadcast" },
  ];

// ── Blocked exact hostnames ─────────────────────────────────────────────────

const BLOCKED_HOSTNAMES = new Set([
  "localhost",
  "ip6-localhost",
  "ip6-loopback",
  "broadcasthost",
]);

// ── IPv6 blocked prefixes (string-prefix check after normalisation) ─────────
// We cannot do full IPv6 CIDR math here without a lib, so we block the most
// dangerous prefixes by string match on the normalised address.
const BLOCKED_IPV6_PREFIXES = [
  "::1",          // loopback
  "::ffff:",      // IPv4-mapped — catches ::ffff:10.x, ::ffff:192.168.x etc.
  "fc",           // fc00::/7 ULA (unique local)
  "fd",           // fd00::/8 ULA
  "fe80",         // fe80::/10 link-local
  "fe90",
  "fea0",
  "feb0",
  "2002:0a",      // 6to4 wrapping 10.x
  "2002:c0a8",    // 6to4 wrapping 192.168.x
  "2002:a9fe",    // 6to4 wrapping 169.254.x
  "64:ff9b::",    // NAT64 prefix (may resolve to private IPv4)
];

// ── Helpers ─────────────────────────────────────────────────────────────────

function ipToNum(ip: string): number {
  return ip
    .split(".")
    .reduce((acc, octet) => (acc << 8) + parseInt(octet, 10), 0) >>> 0;
}

function cidrMask(bits: number): number {
  return (0xffffffff << (32 - bits)) >>> 0;
}

function isBlockedIPv4(ip: string): string | null {
  let num: number;
  try {
    num = ipToNum(ip);
  } catch {
    return null; // not parseable as IPv4 — leave to other checks
  }
  for (const cidr of BLOCKED_IPV4_CIDRS) {
    if ((num & cidr.mask) === (cidr.base & cidr.mask)) {
      return `IP ${ip} is in a blocked range (${cidr.label})`;
    }
  }
  return null;
}

function isBlockedIPv6(ip: string): string | null {
  // Normalise: strip brackets, lowercase
  const normalised = ip.replace(/^\[|\]$/g, "").toLowerCase();
  if (normalised === "::1") return "IPv6 loopback address is blocked";
  for (const prefix of BLOCKED_IPV6_PREFIXES) {
    if (normalised.startsWith(prefix)) {
      return `IPv6 address ${ip} is in a blocked range`;
    }
  }
  return null;
}

// ── Layer 1: fast hostname-string check ─────────────────────────────────────

function fastCheck(hostname: string): string | null {
  if (BLOCKED_HOSTNAMES.has(hostname)) {
    return `Hostname "${hostname}" is not allowed`;
  }

  // Looks like a bare IPv4 address?
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)) {
    return isBlockedIPv4(hostname);
  }

  // Looks like a bare IPv6 address (with or without brackets)?
  const v6 = hostname.replace(/^\[|\]$/g, "");
  if (v6.includes(":")) {
    return isBlockedIPv6(v6);
  }

  return null;
}

// ── Layer 2: DNS-resolved IP check ──────────────────────────────────────────

async function resolvedIpCheck(hostname: string): Promise<string | null> {
  // Skip resolution for bare IPs — fastCheck already handled them.
  if (
    /^\d{1,3}(\.\d{1,3}){3}$/.test(hostname) ||
    hostname.replace(/^\[|\]$/g, "").includes(":")
  ) {
    return null;
  }

  let addresses: LookupAddress[];
  try {
    // Resolve all address families so we catch both A and AAAA records.
    addresses = await dns.lookup(hostname, { all: true });
  } catch {
    // DNS resolution failed — treat as unsafe to prevent error-hiding.
    return `Could not resolve hostname "${hostname}" — URL is not allowed`;
  }

  for (const { address, family } of addresses) {
    if (family === 4) {
      const err = isBlockedIPv4(address);
      if (err) return `Hostname "${hostname}" resolves to a blocked IP: ${err}`;
    } else if (family === 6) {
      const err = isBlockedIPv6(address);
      if (err) return `Hostname "${hostname}" resolves to a blocked IPv6: ${err}`;
    }
  }

  return null;
}

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Synchronous fast check — use this for immediate client-side-style validation
 * before the async DNS check when you need a quick result.
 */
export function validateWebhookUrl(rawUrl: string): string | null {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return "Invalid URL format";
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    return "Only http and https URLs are allowed";
  }

  return fastCheck(parsed.hostname.toLowerCase());
}

/**
 * Full async validation — runs the fast check first, then DNS-resolves the
 * hostname and validates the resolved IP(s).  Always call this server-side
 * before saving a webhook URL or making an outbound delivery.
 */
export async function validateWebhookUrlAsync(rawUrl: string): Promise<string | null> {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return "Invalid URL format";
  }

  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    return "Only http and https URLs are allowed";
  }

  const hostname = parsed.hostname.toLowerCase();

  // Layer 1 — fast
  const fast = fastCheck(hostname);
  if (fast) return fast;

  // Layer 2 — DNS-resolved
  return resolvedIpCheck(hostname);
}
