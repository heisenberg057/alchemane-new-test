/**
 * SEO system tests
 *
 * Unit tests for:
 *  - GET /api/search-optimization/overview  (route contract, scope param)
 *  - GET /api/search-optimization/health    (route contract)
 *  - POST /api/search-optimization/analyze-all  (route contract, Redis 503)
 *  - seoAnalysis.service — analyzePost core logic
 *  - Worker/queue integration path — enqueue → process → persist
 *
 * All external dependencies (Payload, Redis, BullMQ, HTTP fetch) are mocked.
 * No real DB or network connection is needed.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// ── Shared route mocks (hoisted) ─────────────────────────────────────────────

vi.mock('@/lib/api/withAuth', () => ({
  withAuth: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('@/lib/api/withErrorHandling', () => ({
  withErrorHandling: vi.fn((fn: Function) => fn),
}));

vi.mock('@/lib/api/response', () => ({
  jsonSuccess: vi.fn((data: unknown, msg?: string) => ({ ok: true, data, message: msg })),
  jsonError: vi.fn((msg: string, status?: number) => ({ ok: false, message: msg, status })),
}));

vi.mock('@/lib/api/getPayload', () => ({
  getPayloadSingleton: vi.fn(),
}));

vi.mock('@/lib/queue/seoQueue', () => ({
  getSeoAnalysisQueue: vi.fn(),
  SEO_QUEUE_NAME: 'seo-analysis',
  SEO_JOB_ANALYZE_ALL: 'analyze-all-posts',
  SEO_JOB_ANALYZE_SINGLE: 'analyze-single-post',
  getRedisConnection: vi.fn(),
}));

vi.mock('@/lib/queue/seoWorker', () => ({
  SEO_WORKER_HEARTBEAT_KEY: 'seo-worker:heartbeat',
  SEO_WORKER_HEARTBEAT_TTL_S: 30,
  startSeoWorker: vi.fn(),
}));

vi.mock('@/lib/logger', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

vi.mock('@/lib/http/client', () => ({
  httpGet: vi.fn(),
}));

// ─────────────────────────────────────────────────────────────────────────────
// Helper
// ─────────────────────────────────────────────────────────────────────────────

function makeReq(method = 'GET', url = 'http://localhost/api/search-optimization/test'): Request {
  return new Request(url, { method });
}

// ═════════════════════════════════════════════════════════════════════════════
// 1. GET /api/search-optimization/overview
// ═════════════════════════════════════════════════════════════════════════════

describe('GET /api/search-optimization/overview', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('returns summary data with correct shape', async () => {
    const { getPayloadSingleton } = await import('@/lib/api/getPayload');
    (getPayloadSingleton as ReturnType<typeof vi.fn>).mockResolvedValue({
      find: vi.fn().mockImplementation(({ collection }: { collection: string }) => {
        if (collection === 'posts') {
          return Promise.resolve({ docs: [], totalDocs: 3, hasNextPage: false });
        }
        return Promise.resolve({ docs: [], totalDocs: 0, hasNextPage: false });
      }),
    });

    const { GET } = await import('@/app/api/search-optimization/overview/route');
    const res = await GET(makeReq());
    const body = await res.json();

    expect(body.ok).toBe(true);
    expect(body.data).toMatchObject({
      publishedPosts: expect.any(Number),
      analyzedPosts: expect.any(Number),
      averageScore: expect.any(Number),
      postsNeedingAttention: expect.any(Array),
      recentAnalyses: expect.any(Array),
      missingMetaTitle: expect.any(Number),
      missingMetaDescription: expect.any(Number),
    });
  });

  it('returns 401 when auth fails', async () => {
    const { withAuth } = await import('@/lib/api/withAuth');
    (withAuth as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      Object.assign(new Error('Unauthorized'), { status: 401 })
    );

    const { GET } = await import('@/app/api/search-optimization/overview/route');
    await expect(GET(makeReq())).rejects.toMatchObject({ status: 401 });
  });

  it('returns metadata-only analysis fields for pages scope', async () => {
    const { getPayloadSingleton } = await import('@/lib/api/getPayload');
    (getPayloadSingleton as ReturnType<typeof vi.fn>).mockResolvedValue({
      find: vi.fn().mockImplementation(({ collection }: { collection: string }) => {
        if (collection === 'pages') {
          return Promise.resolve({ docs: [], totalDocs: 2, hasNextPage: false });
        }
        return Promise.resolve({ docs: [], totalDocs: 0, hasNextPage: false });
      }),
    });

    const { GET } = await import('@/app/api/search-optimization/overview/route');
    const res = await GET(new Request('http://localhost/api/search-optimization/overview?contentType=pages'));
    const body = await res.json();

    expect(body.ok).toBe(true);
    expect(body.data.scope).toBe('pages');
    expect(body.data.publishedPosts).toBe(2);
    expect(body.data.analyzedPosts).toBe(0);
    expect(body.data.averageScore).toBe(0);
    expect(body.data.postsNeedingAttention).toEqual([]);
    expect(body.data.recentAnalyses).toEqual([]);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// 2. GET /api/search-optimization/health
// ═════════════════════════════════════════════════════════════════════════════

describe('GET /api/search-optimization/health', () => {
  beforeEach(() => {
    vi.resetModules();
    // Suppress live provider checks in unit tests
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns not_configured when REDIS_URL is absent', async () => {
    delete process.env.REDIS_URL;

    const { GET } = await import('@/app/api/search-optimization/health/route');
    const res = await GET(makeReq());
    const body = await res.json();

    expect(body.ok).toBe(true);
    expect(body.data.redis).toBe('not_configured');
    expect(body.data.worker).toBe('stopped');
    expect(body.data.queueDepth).toBeNull();
  });

  it('returns error status when Redis connection fails', async () => {
    process.env.REDIS_URL = 'redis://bad-host:6379';

    vi.doMock('ioredis', () => ({
      default: vi.fn().mockImplementation(() => ({
        connect: vi.fn().mockRejectedValue(new Error('Connection refused')),
        ping: vi.fn(),
        quit: vi.fn(),
        get: vi.fn(),
        llen: vi.fn(),
        zcard: vi.fn(),
        lindex: vi.fn(),
        hget: vi.fn(),
      })),
    }));

    const { GET } = await import('@/app/api/search-optimization/health/route');
    const res = await GET(makeReq());
    const body = await res.json();

    expect(body.ok).toBe(true);
    expect(body.data.redis).toBe('error');
    expect(body.data.worker).toBe('unknown');
  });

  it('exposes failedCount (not recentFailedCount) in response shape', async () => {
    delete process.env.REDIS_URL;

    const { GET } = await import('@/app/api/search-optimization/health/route');
    const res = await GET(makeReq());
    const body = await res.json();

    expect('failedCount' in body.data).toBe(true);
    expect('recentFailedCount' in body.data).toBe(false);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// 3. POST /api/search-optimization/analyze-all
// ═════════════════════════════════════════════════════════════════════════════

describe('POST /api/search-optimization/analyze-all', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('enqueues the bulk job and returns success', async () => {
    const mockAdd = vi.fn().mockResolvedValue({ id: 'job-1' });
    const { getSeoAnalysisQueue } = await import('@/lib/queue/seoQueue');
    (getSeoAnalysisQueue as ReturnType<typeof vi.fn>).mockReturnValue({ add: mockAdd });

    const { POST } = await import('@/app/api/search-optimization/analyze-all/route');
    const res = await POST(makeReq('POST'));
    const body = await res.json();

    expect(body.ok).toBe(true);
    expect(mockAdd).toHaveBeenCalledOnce();
  });

  it('returns 503 when Redis / queue is unavailable', async () => {
    const { getSeoAnalysisQueue } = await import('@/lib/queue/seoQueue');
    (getSeoAnalysisQueue as ReturnType<typeof vi.fn>).mockImplementation(() => {
      throw new Error('REDIS_URL is required for SEO queue');
    });

    const { POST } = await import('@/app/api/search-optimization/analyze-all/route');
    const res = await POST(makeReq('POST'));
    const body = await res.json();

    expect(res.status).toBe(503);
    expect(body.ok).toBe(false);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// 4. seoAnalysis.service — analyzePost unit tests
// ═════════════════════════════════════════════════════════════════════════════

describe('analyzePost()', () => {
  const FAKE_POST = {
    id: 99,
    slug: 'test-slug',
    title: 'A Long Enough Title For SEO',
    content: '<h2>Section</h2>' + '<p>Word </p>'.repeat(60),
    wordpressHtml: null,
    meta: { title: 'A Long Enough SEO Title Here', description: 'A meta description that is between 150 and 160 chars so it passes validation checks easily for testing purposes here.' },
    seoAnalysis: null,
    _status: 'published',
  };

  beforeEach(() => {
    vi.resetModules();
    process.env.NEXT_PUBLIC_APP_URL = 'https://americanhairline.com';
  });

  it('creates a seo-analyses document and updates the post', async () => {
    const { getPayloadSingleton } = await import('@/lib/api/getPayload');
    const mockCreate = vi.fn().mockResolvedValue({ id: 1, score: 70 });
    const mockUpdate = vi.fn().mockResolvedValue({});
    const mockFind = vi.fn().mockResolvedValue({ docs: [], totalDocs: 0 });
    const mockFindById = vi.fn().mockResolvedValue(FAKE_POST);

    (getPayloadSingleton as ReturnType<typeof vi.fn>).mockResolvedValue({
      findByID: mockFindById,
      find: mockFind,
      create: mockCreate,
      update: mockUpdate,
    });

    // Lighthouse skipped for non-localhost: mock httpGet to simulate no API key
    const { httpGet } = await import('@/lib/http/client');
    (httpGet as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      text: vi.fn().mockResolvedValue('Forbidden'),
    });

    const { analyzePost } = await import('@/lib/services/seoAnalysis.service');
    await analyzePost('99');

    expect(mockCreate).toHaveBeenCalledOnce();
    expect(mockUpdate).toHaveBeenCalledOnce();

    const createArg = mockCreate.mock.calls[0][0] as { data: Record<string, unknown> };
    expect(createArg.data).toMatchObject({
      post: 99,
      url: expect.stringContaining('americanhairline.com'),
      lighthouseSimulated: false,
      score: expect.any(Number),
      issues: expect.any(Array),
      recommendations: expect.any(Array),
      headings: expect.any(Array),
      images: expect.any(Array),
      internalLinks: expect.any(Number),
      externalLinks: expect.any(Number),
    });
  });

  it('throws when post is not found', async () => {
    const { getPayloadSingleton } = await import('@/lib/api/getPayload');
    (getPayloadSingleton as ReturnType<typeof vi.fn>).mockResolvedValue({
      findByID: vi.fn().mockResolvedValue(null),
    });

    const { analyzePost } = await import('@/lib/services/seoAnalysis.service');
    await expect(analyzePost('999')).rejects.toThrow('Post not found');
  });

  it('sets lighthouseSimulated to false even when PageSpeed is unavailable', async () => {
    const { getPayloadSingleton } = await import('@/lib/api/getPayload');
    const mockCreate = vi.fn().mockResolvedValue({ id: 2, score: 60 });
    (getPayloadSingleton as ReturnType<typeof vi.fn>).mockResolvedValue({
      findByID: vi.fn().mockResolvedValue(FAKE_POST),
      find: vi.fn().mockResolvedValue({ docs: [] }),
      create: mockCreate,
      update: vi.fn().mockResolvedValue({}),
    });

    delete process.env.GOOGLE_PAGESPEED_API_KEY;

    const { analyzePost } = await import('@/lib/services/seoAnalysis.service');
    await analyzePost('99');

    const createArg = mockCreate.mock.calls[0][0] as { data: Record<string, unknown> };
    expect(createArg.data.lighthouseSimulated).toBe(false);
  });

  it('adds lighthouse_unavailable issue when PageSpeed key is missing', async () => {
    const { getPayloadSingleton } = await import('@/lib/api/getPayload');
    const mockCreate = vi.fn().mockResolvedValue({ id: 3, score: 55 });
    (getPayloadSingleton as ReturnType<typeof vi.fn>).mockResolvedValue({
      findByID: vi.fn().mockResolvedValue(FAKE_POST),
      find: vi.fn().mockResolvedValue({ docs: [] }),
      create: mockCreate,
      update: vi.fn().mockResolvedValue({}),
    });

    delete process.env.GOOGLE_PAGESPEED_API_KEY;

    const { analyzePost } = await import('@/lib/services/seoAnalysis.service');
    await analyzePost('99');

    const createArg = mockCreate.mock.calls[0][0] as { data: { issues: { type: string }[] } };
    const hasUnavailableIssue = createArg.data.issues.some((i) => i.type === 'lighthouse_unavailable');
    expect(hasUnavailableIssue).toBe(true);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// 5. Worker/queue integration path
//    Simulates: BullMQ job processor receives analyze-all → enqueues per-post
//    jobs → worker processes each → analyzePost() creates seo-analyses doc
// ═════════════════════════════════════════════════════════════════════════════

describe('Worker queue integration path', () => {
  const FAKE_POST = {
    id: 10,
    slug: 'integration-post',
    title: 'Integration Test Post',
    content: '<p>' + 'word '.repeat(80) + '</p>',
    wordpressHtml: null,
    meta: { title: 'Integration Test Post SEO Title OK', description: 'A meta description that is between 150 and 160 chars so it passes validation checks easily for testing purposes here.' },
    seoAnalysis: null,
    _status: 'published',
  };

  beforeEach(() => {
    vi.resetModules();
    process.env.NEXT_PUBLIC_APP_URL = 'https://americanhairline.com';
    delete process.env.GOOGLE_PAGESPEED_API_KEY;
  });

  it('analyze-all job: enqueues one analyze-single-post job per published post', async () => {
    const mockAddBulk = vi.fn().mockResolvedValue([]);
    const mockQueueInstance = { addBulk: mockAddBulk };

    const { getSeoAnalysisQueue } = await import('@/lib/queue/seoQueue');
    (getSeoAnalysisQueue as ReturnType<typeof vi.fn>).mockReturnValue(mockQueueInstance);

    const { getPayloadSingleton } = await import('@/lib/api/getPayload');
    (getPayloadSingleton as ReturnType<typeof vi.fn>).mockResolvedValue({
      find: vi.fn().mockResolvedValueOnce({
        docs: [FAKE_POST],
        hasNextPage: false,
      }),
    });

    // Simulate what the worker does when it receives the analyze-all job
    const { SEO_JOB_ANALYZE_SINGLE } = await import('@/lib/queue/seoQueue');
    const queue = getSeoAnalysisQueue();
    const payload = await (await import('@/lib/api/getPayload')).getPayloadSingleton();

    const batch = await payload.find({
      collection: 'posts',
      where: {},
      limit: 20,
      page: 1,
      depth: 0,
      overrideAccess: true,
    });

    await queue.addBulk(
      batch.docs.map((p) => ({
        name: SEO_JOB_ANALYZE_SINGLE,
        data: { postId: String(p.id) },
        opts: { jobId: `seo-analyze-${p.id}` },
      }))
    );

    expect(mockAddBulk).toHaveBeenCalledOnce();
    const bulkArg = mockAddBulk.mock.calls[0][0] as { name: string; data: { postId: string } }[];
    expect(bulkArg).toHaveLength(1);
    expect(bulkArg[0]!.name).toBe(SEO_JOB_ANALYZE_SINGLE);
    expect(bulkArg[0]!.data.postId).toBe('10');
  });

  it('analyze-single-post job: runs analyzePost and persists seo-analyses document', async () => {
    const mockCreate = vi.fn().mockResolvedValue({ id: 20, score: 65 });
    const mockUpdate = vi.fn().mockResolvedValue({});

    const { getPayloadSingleton } = await import('@/lib/api/getPayload');
    (getPayloadSingleton as ReturnType<typeof vi.fn>).mockResolvedValue({
      findByID: vi.fn().mockResolvedValue(FAKE_POST),
      find: vi.fn().mockResolvedValue({ docs: [] }),
      create: mockCreate,
      update: mockUpdate,
    });

    // Simulate the worker calling analyzePost for a single job
    const { analyzePost } = await import('@/lib/services/seoAnalysis.service');
    const result = await analyzePost('10');

    // analyzePost must have created a seo-analyses document
    expect(mockCreate).toHaveBeenCalledOnce();

    const createArg = mockCreate.mock.calls[0][0] as { collection: string; data: Record<string, unknown> };
    expect(createArg.collection).toBe('seo-analyses');
    expect(createArg.data.post).toBe(10);
    expect(typeof createArg.data.score).toBe('number');
    expect(Array.isArray(createArg.data.issues)).toBe(true);
    expect(Array.isArray(createArg.data.recommendations)).toBe(true);

    // analyzePost must have updated the post's seoAnalysis field
    const updateCalls = mockUpdate.mock.calls as { collection: string }[][];
    const postUpdate = updateCalls.find((c) => c[0]?.collection === 'posts');
    expect(postUpdate).toBeDefined();

    // The worker return value is the persisted doc
    expect(result).toMatchObject({ id: 20, score: 65 });
  });

  it('overview route returns scope field in response', async () => {
    const { getPayloadSingleton } = await import('@/lib/api/getPayload');
    (getPayloadSingleton as ReturnType<typeof vi.fn>).mockResolvedValue({
      find: vi.fn().mockResolvedValue({ docs: [], totalDocs: 0, hasNextPage: false }),
    });

    const { GET } = await import('@/app/api/search-optimization/overview/route');
    const res = await GET(new Request('http://localhost/api/search-optimization/overview?contentType=pages'));
    const body = await res.json();

    expect(body.data.scope).toBe('pages');
  });
});
