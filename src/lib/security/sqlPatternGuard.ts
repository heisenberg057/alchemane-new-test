/**
 * Obvious SQL-injection-style fragments in untrusted strings (public / form input).
 * Uses word boundaries where helpful to limit false positives.
 */
const SQL_PATTERNS: RegExp[] = [
  /\bUNION\s+ALL\s+SELECT\b/i,
  /\bUNION\s+SELECT\b/i,
  /\bSELECT\s+[\s\S]+\s+FROM\b/i,
  /\bINSERT\s+INTO\b/i,
  /\bDELETE\s+FROM\b/i,
  /\bDROP\s+TABLE\b/i,
  /\bDROP\s+DATABASE\b/i,
  /\bTRUNCATE\s+TABLE\b/i,
  /\bOR\s+['"]?\d+['"]?\s*=\s*['"]?\d+/i,
  /\bOR\s+1\s*=\s*1\b/i,
  /--\s*$/m,
  /;\s*(SELECT|INSERT|UPDATE|DELETE|DROP)\b/i,
  /\bEXEC(\s+|\()\s*\w+/i,
  /\bEXECUTE\s*\(/i,
  /\bxp_\w+/i,
  /\bWAITFOR\s+DELAY\b/i,
];

const MAX_SCAN_DEPTH = 28;

export function stringLooksLikeSqlInjection(value: string): boolean {
  const s = value.slice(0, 50_000);
  return SQL_PATTERNS.some((re) => re.test(s));
}

/** Throws Error if any scanned string matches SQL-injection heuristics */
export function assertNoSqlInjectionInValue(
  value: unknown,
  skipKeys: Set<string>,
  depth = 0
): void {
  if (depth > MAX_SCAN_DEPTH) return;
  if (typeof value === "string") {
    if (stringLooksLikeSqlInjection(value)) {
      throw new Error("Potential SQL injection pattern");
    }
    return;
  }
  if (value === null || typeof value !== "object") return;
  if (Array.isArray(value)) {
    for (const item of value) {
      assertNoSqlInjectionInValue(item, skipKeys, depth + 1);
    }
    return;
  }
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    if (skipKeys.has(k)) continue;
    assertNoSqlInjectionInValue(v, skipKeys, depth + 1);
  }
}
