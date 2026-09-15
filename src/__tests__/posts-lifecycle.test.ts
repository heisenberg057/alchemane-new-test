/**
 * Post lifecycle tests — publish/unpublish routes
 *
 * These are unit tests that mock Payload CMS and auth so no DB is needed.
 * They verify the route handler contract, not the underlying DB layer.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Mocks (must be hoisted) ──────────────────────────────────────────────────

vi.mock('@/lib/api/getPayload', () => ({
  getPayloadSingleton: vi.fn(),
}));

vi.mock('@/lib/api/withAuth', () => ({
  withAuth: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/lib/api/withErrorHandling', () => ({
  withErrorHandling: vi.fn((fn: Function) => fn),
}));

vi.mock('@/lib/api/response', () => ({
  jsonSuccess: vi.fn((data: unknown, msg?: string) => ({ ok: true, data, message: msg })),
  jsonError: vi.fn((msg: string) => ({ ok: false, message: msg })),
}));

// ── Helpers ──────────────────────────────────────────────────────────────────

function makeRequest(method = 'PATCH'): Request {
  return new Request('http://localhost/api/posts/42/publish', { method });
}

function makeParams(id: string) {
  return { params: Promise.resolve({ id }) };
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe('POST publish route', () => {
  let payloadUpdate: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    payloadUpdate = vi.fn().mockResolvedValue({
      id: 42,
      title: 'Test Post',
      _status: 'published',
    });

    const { getPayloadSingleton } = await import('@/lib/api/getPayload');
    (getPayloadSingleton as ReturnType<typeof vi.fn>).mockResolvedValue({
      update: payloadUpdate,
    });
  });

  it('sets _status to published and sets publishedDate', async () => {
    const { PATCH } = await import('@/app/api/posts/[id]/publish/route');
    const res = await PATCH(makeRequest(), makeParams('42'));
    const body = await res.json();

    expect(body.ok).toBe(true);
    expect(payloadUpdate).toHaveBeenCalledOnce();

    const callArgs = payloadUpdate.mock.calls[0][0];
    expect(callArgs.id).toBe('42');
    expect(callArgs.data._status).toBe('published');
    expect(typeof callArgs.data.publishedDate).toBe('string');
    expect(callArgs.overrideAccess).toBe(true);
  });

  it('calls withAuth with ADMIN and SUPER_ADMIN only (no EDITOR)', async () => {
    const { withAuth } = await import('@/lib/api/withAuth');
    const { PATCH } = await import('@/app/api/posts/[id]/publish/route');
    await PATCH(makeRequest(), makeParams('42'));

    expect(withAuth).toHaveBeenCalledWith(
      expect.any(Request),
      expect.arrayContaining(['ADMIN', 'SUPER_ADMIN'])
    );
    const roles: string[] = (withAuth as ReturnType<typeof vi.fn>).mock.calls[0][1];
    expect(roles).not.toContain('EDITOR');
  });
});
