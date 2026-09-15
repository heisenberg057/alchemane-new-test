/**
 * Comments API tests — GET and POST contract verification
 *
 * Mocks Payload CMS so no DB is needed.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Mocks ────────────────────────────────────────────────────────────────────

vi.mock('@/lib/api/getPayload', () => ({
  getPayloadSingleton: vi.fn(),
}));

vi.mock('@/lib/api/withErrorHandling', () => ({
  withErrorHandling: vi.fn((fn: Function) => fn),
}));

vi.mock('@/lib/api/response', () => ({
  jsonSuccess: vi.fn((data: unknown) => ({ ok: true, data })),
  jsonError: vi.fn((msg: string, detail?: unknown) => ({ ok: false, message: msg, detail })),
}));

vi.mock('@/lib/security/sanitize', () => ({
  sanitizeString: vi.fn((s: string) => s),
}));

vi.mock('@/lib/security/sqlPatternGuard', () => ({
  assertNoSqlInjectionInValue: vi.fn(),
}));

vi.mock('@/lib/security/validation', () => ({
  commentCreateSchema: {
    safeParse: vi.fn((body: unknown) => ({
      success: true,
      data: body,
    })),
  },
}));

// ── Helpers ──────────────────────────────────────────────────────────────────

function makeGetRequest(postId?: string): Request {
  const url = postId
    ? `http://localhost/api/comments?postId=${postId}`
    : 'http://localhost/api/comments';
  return new Request(url, { method: 'GET' });
}

// ── GET tests ────────────────────────────────────────────────────────────────

describe('GET /api/comments', () => {
  let payloadFind: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    payloadFind = vi.fn().mockResolvedValue({
      docs: [
        {
          id: 1,
          name: 'Alice',
          message: 'Great post!',
          email: 'alice@example.com', // should be stripped from response
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ],
    });

    const { getPayloadSingleton } = await import('@/lib/api/getPayload');
    (getPayloadSingleton as ReturnType<typeof vi.fn>).mockResolvedValue({
      find: payloadFind,
    });
  });

  it('returns 400 when postId is missing', async () => {
    const { GET } = await import('@/app/api/comments/route');
    const res = await GET(makeGetRequest());
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.ok).toBe(false);
  });

  it('returns 400 when postId is not numeric', async () => {
    const { GET } = await import('@/app/api/comments/route');
    const res = await GET(makeGetRequest('abc'));
    expect(res.status).toBe(400);
  });

  it('queries with exact subject match (not like) to prevent prefix collisions', async () => {
    const { GET } = await import('@/app/api/comments/route');
    await GET(makeGetRequest('10'));

    const callArgs = payloadFind.mock.calls[0][0];
    const subjectCondition = callArgs.where.and.find(
      (c: Record<string, unknown>) => 'subject' in c
    );

    // Must use `equals`, not `like`
    expect(subjectCondition.subject.equals).toBe('comment:10');
    expect(subjectCondition.subject.like).toBeUndefined();
  });

  it('strips email from public response', async () => {
    const { GET } = await import('@/app/api/comments/route');
    const res = await GET(makeGetRequest('1'));
    const body = await res.json();

    const comment = body.data[0];
    expect(comment.name).toBe('Alice');
    expect(comment.message).toBe('Great post!');
    expect(comment.email).toBeUndefined();
  });

  it('only fetches form-submissions with type=comment', async () => {
    const { GET } = await import('@/app/api/comments/route');
    await GET(makeGetRequest('5'));

    const callArgs = payloadFind.mock.calls[0][0];
    expect(callArgs.collection).toBe('form-submissions');
    const typeCondition = callArgs.where.and.find(
      (c: Record<string, unknown>) => 'type' in c
    );
    expect(typeCondition.type.equals).toBe('comment');
  });
});
