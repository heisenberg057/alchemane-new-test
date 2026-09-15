/**
 * Revalidation route tests — /api/revalidate
 *
 * Verifies auth guard, slug-specific revalidation, and always revalidates /blog.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Mocks ────────────────────────────────────────────────────────────────────

const mockRevalidatePath = vi.fn();

vi.mock('next/cache', () => ({
  revalidatePath: mockRevalidatePath,
}));

// ── Helpers ──────────────────────────────────────────────────────────────────

function makeRequest(secret: string | null, body: Record<string, unknown>): Request {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (secret !== null) headers['x-revalidate-secret'] = secret;
  return new Request('http://localhost/api/revalidate', {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
}

const VALID_SECRET = 'test-secret';

// ── Tests ────────────────────────────────────────────────────────────────────

describe('POST /api/revalidate', () => {
  beforeEach(() => {
    mockRevalidatePath.mockClear();
    process.env.REVALIDATION_SECRET = VALID_SECRET;
  });

  it('returns 401 when secret is missing', async () => {
    const { POST } = await import('@/app/api/revalidate/route');
    const res = await POST(makeRequest(null, {}));
    expect(res.status).toBe(401);
    expect(mockRevalidatePath).not.toHaveBeenCalled();
  });

  it('returns 401 when secret is wrong', async () => {
    const { POST } = await import('@/app/api/revalidate/route');
    const res = await POST(makeRequest('wrong-secret', {}));
    expect(res.status).toBe(401);
    expect(mockRevalidatePath).not.toHaveBeenCalled();
  });

  it('always revalidates /blog listing when authorized', async () => {
    const { POST } = await import('@/app/api/revalidate/route');
    await POST(makeRequest(VALID_SECRET, {}));
    expect(mockRevalidatePath).toHaveBeenCalledWith('/blog', 'page');
  });

  it('also revalidates specific slug when provided', async () => {
    const { POST } = await import('@/app/api/revalidate/route');
    await POST(makeRequest(VALID_SECRET, { slug: 'my-post' }));

    expect(mockRevalidatePath).toHaveBeenCalledWith('/blog', 'page');
    expect(mockRevalidatePath).toHaveBeenCalledWith('/blog/my-post', 'page');
    expect(mockRevalidatePath).toHaveBeenCalledTimes(2);
  });

  it('skips slug revalidation when slug is omitted', async () => {
    const { POST } = await import('@/app/api/revalidate/route');
    await POST(makeRequest(VALID_SECRET, {}));
    expect(mockRevalidatePath).toHaveBeenCalledTimes(1);
    expect(mockRevalidatePath).toHaveBeenCalledWith('/blog', 'page');
  });

  it('returns success payload with slug in response', async () => {
    const { POST } = await import('@/app/api/revalidate/route');
    const res = await POST(makeRequest(VALID_SECRET, { slug: 'test-slug' }));
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.revalidated).toBe(true);
    expect(body.slug).toBe('test-slug');
  });
});
