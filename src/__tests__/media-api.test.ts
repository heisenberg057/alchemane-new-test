/**
 * Media API tests — usage route, unused audit, delete guards
 *
 * Unit tests that mock Payload CMS and auth — no DB required.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Mocks (hoisted) ──────────────────────────────────────────────────────────

vi.mock("@/lib/api/getPayload", () => ({
  getPayloadSingleton: vi.fn(),
}));

vi.mock("@/lib/api/withAuth", () => ({
  withAuth: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/lib/api/withErrorHandling", () => ({
  withErrorHandling: vi.fn((fn: Function) => fn),
}));

vi.mock("@/lib/api/response", () => ({
  jsonSuccess: vi.fn((data: unknown) => ({ ok: true, data })),
  jsonError: vi.fn((msg: string) => ({ ok: false, message: msg })),
}));

// ── Helpers ──────────────────────────────────────────────────────────────────

function makeRequest(method = "GET", body?: unknown): Request {
  return new Request("http://localhost/api/media/1", {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: body ? { "Content-Type": "application/json" } : undefined,
  });
}

function makeParams(id: string) {
  return { params: Promise.resolve({ id }) };
}

/** Minimal payload mock with controllable find/findByID/delete */
function makePayload(overrides: Record<string, unknown> = {}) {
  return {
    findByID: vi.fn(),
    find: vi.fn(),
    delete: vi.fn().mockResolvedValue({}),
    ...overrides,
  };
}

// ── payloadUtils unit tests ────────────────────────────────────────────────

describe("payloadUtils helpers", () => {
  it("normalizeMediaUrl strips absolute origin to pathname", async () => {
    const { normalizeMediaUrl } = await import("@/lib/api/payloadUtils");
    expect(normalizeMediaUrl("https://cdn.example.com/media/hero.jpg")).toBe("/media/hero.jpg");
    expect(normalizeMediaUrl("/media/hero.jpg")).toBe("/media/hero.jpg");
    expect(normalizeMediaUrl("")).toBe("");
  });

  it("mediaUrlVariants returns relative, APP_URL, and R2 absolute forms", async () => {
    const { mediaUrlVariants } = await import("@/lib/api/payloadUtils");
    const variants = mediaUrlVariants(
      "/media/hero.jpg",
      "https://example.com",
      "https://pub-abc.r2.dev"
    );
    expect(variants).toContain("/media/hero.jpg");
    expect(variants).toContain("https://example.com/media/hero.jpg");
    expect(variants).toContain("https://pub-abc.r2.dev/media/hero.jpg");
  });

  it("postFreeText concatenates blocksData, wordpressHtml, and content", async () => {
    const { postFreeText } = await import("@/lib/api/payloadUtils");
    const post = {
      blocksData: '{"type":"image","src":"/media/a.jpg"}',
      wordpressHtml: '<img src="/media/b.jpg">',
      content: { root: { children: [{ src: "/media/c.jpg" }] } },
    };
    const text = postFreeText(post);
    expect(text).toContain("/media/a.jpg");
    expect(text).toContain("/media/b.jpg");
    expect(text).toContain("/media/c.jpg");
  });

  it("pageFreeText includes blocksData, content, customHeadScripts, and customFooterScripts", async () => {
    const { pageFreeText } = await import("@/lib/api/payloadUtils");
    const page = {
      blocksData: '{"src":"/media/block.jpg"}',
      content: '<img src="/media/content.jpg">',
      customHeadScripts: '<link rel="preload" href="/media/head.jpg">',
      customFooterScripts: '<script>var bg="/media/footer.jpg"</script>',
    };
    const text = pageFreeText(page);
    expect(text).toContain("/media/block.jpg");
    expect(text).toContain("/media/content.jpg");
    expect(text).toContain("/media/head.jpg");
    expect(text).toContain("/media/footer.jpg");
  });

  it("textContainsMediaUrl detects URL in HTML string", async () => {
    const { textContainsMediaUrl } = await import("@/lib/api/payloadUtils");
    const html = '<img src="/media/hero.jpg" alt="test">';
    expect(textContainsMediaUrl(html, ["/media/hero.jpg"])).toBe(true);
    expect(textContainsMediaUrl(html, ["/media/other.jpg"])).toBe(false);
    expect(textContainsMediaUrl("", ["/media/hero.jpg"])).toBe(false);
  });
});

// ── Usage Route ──────────────────────────────────────────────────────────────

describe("GET /api/media/[id]/usage", () => {
  let payload: ReturnType<typeof makePayload>;

  beforeEach(async () => {
    vi.resetModules();
    payload = makePayload();
    const { getPayloadSingleton } = await import("@/lib/api/getPayload");
    (getPayloadSingleton as ReturnType<typeof vi.fn>).mockResolvedValue(payload);
  });

  it("returns posts, products, pages (URL field) and correct totalCount", async () => {
    payload.findByID.mockResolvedValue({ id: 1, url: "/media/hero.jpg" });

    payload.find.mockImplementation(
      (args: { collection: string; where?: Record<string, unknown> }) => {
        if (args.collection === "posts" && args.where?.heroImage) {
          return Promise.resolve({
            docs: [{ id: 10, title: "Post A", slug: "post-a" }],
            hasNextPage: false,
          });
        }
        if (args.collection === "posts" && args.where?.["meta.image"]) {
          return Promise.resolve({ docs: [], hasNextPage: false });
        }
        if (args.collection === "products") {
          return Promise.resolve({
            docs: [{ id: 20, name: "Product X", slug: "product-x", images: [{ image: { id: 1 } }] }],
            hasNextPage: false,
          });
        }
        if (args.collection === "pages") {
          return Promise.resolve({
            docs: [
              {
                id: 30,
                title: "Home",
                slug: "",
                featuredImage: "/media/hero.jpg",
                ogImage: null,
                twitterImage: null,
                blocksData: null,
                content: null,
              },
            ],
            hasNextPage: false,
          });
        }
        return Promise.resolve({ docs: [], hasNextPage: false });
      }
    );

    const { GET } = await import("@/app/api/media/[id]/usage/route");
    const res = await GET(makeRequest(), makeParams("1"));
    const body = await res.json();

    expect(body.data.posts).toHaveLength(1);
    expect(body.data.posts[0].field).toBe("heroImage");
    expect(body.data.products).toHaveLength(1);
    expect(body.data.pages).toHaveLength(1);
    expect(body.data.pages[0].field).toContain("featuredImage");
    expect(body.data.totalCount).toBe(3);
  });

  it("detects image URL referenced inside page blocksData JSON", async () => {
    payload.findByID.mockResolvedValue({ id: 5, url: "/media/block-img.jpg" });

    payload.find.mockImplementation(
      (args: { collection: string; where?: Record<string, unknown> }) => {
        if (args.collection === "posts") return Promise.resolve({ docs: [], hasNextPage: false });
        if (args.collection === "products") return Promise.resolve({ docs: [], hasNextPage: false });
        if (args.collection === "pages") {
          return Promise.resolve({
            docs: [
              {
                id: 40,
                title: "Services",
                slug: "services",
                featuredImage: null,
                ogImage: null,
                twitterImage: null,
                blocksData: JSON.stringify({ blocks: [{ type: "image", src: "/media/block-img.jpg" }] }),
                content: null,
              },
            ],
            hasNextPage: false,
          });
        }
        return Promise.resolve({ docs: [], hasNextPage: false });
      }
    );

    const { GET } = await import("@/app/api/media/[id]/usage/route");
    const res = await GET(makeRequest(), makeParams("5"));
    const body = await res.json();

    expect(body.data.pages).toHaveLength(1);
    expect(body.data.pages[0].field).toContain("blocksData");
    expect(body.data.totalCount).toBe(1);
  });

  it("detects image URL inside page content HTML", async () => {
    payload.findByID.mockResolvedValue({ id: 7, url: "/media/content-img.jpg" });

    payload.find.mockImplementation(
      (args: { collection: string; where?: Record<string, unknown> }) => {
        if (args.collection === "posts") return Promise.resolve({ docs: [], hasNextPage: false });
        if (args.collection === "products") return Promise.resolve({ docs: [], hasNextPage: false });
        if (args.collection === "pages") {
          return Promise.resolve({
            docs: [
              {
                id: 50,
                title: "About",
                slug: "about",
                featuredImage: null,
                ogImage: null,
                twitterImage: null,
                blocksData: null,
                content: '<section><img src="/media/content-img.jpg" /></section>',
              },
            ],
            hasNextPage: false,
          });
        }
        return Promise.resolve({ docs: [], hasNextPage: false });
      }
    );

    const { GET } = await import("@/app/api/media/[id]/usage/route");
    const res = await GET(makeRequest(), makeParams("7"));
    const body = await res.json();

    expect(body.data.pages).toHaveLength(1);
    expect(body.data.pages[0].field).toContain("content");
    expect(body.data.totalCount).toBe(1);
  });

  it("normalizes absolute URL stored in page field to match relative media URL", async () => {
    payload.findByID.mockResolvedValue({ id: 8, url: "/media/abs-test.jpg" });

    payload.find.mockImplementation(
      (args: { collection: string; where?: Record<string, unknown> }) => {
        if (args.collection === "posts") return Promise.resolve({ docs: [], hasNextPage: false });
        if (args.collection === "products") return Promise.resolve({ docs: [], hasNextPage: false });
        if (args.collection === "pages") {
          return Promise.resolve({
            docs: [
              {
                id: 60,
                title: "Contact",
                slug: "contact",
                // Stored as absolute URL — should still match
                featuredImage: "https://site.example.com/media/abs-test.jpg",
                ogImage: null,
                twitterImage: null,
                blocksData: null,
                content: null,
              },
            ],
            hasNextPage: false,
          });
        }
        return Promise.resolve({ docs: [], hasNextPage: false });
      }
    );

    const { GET } = await import("@/app/api/media/[id]/usage/route");
    const res = await GET(makeRequest(), makeParams("8"));
    const body = await res.json();

    expect(body.data.pages).toHaveLength(1);
    expect(body.data.pages[0].field).toContain("featuredImage");
  });

  it("detects image URL referenced inside post blocksData", async () => {
    payload.findByID.mockResolvedValue({ id: 9, url: "/media/post-block.jpg" });

    payload.find.mockImplementation(
      (args: { collection: string; where?: Record<string, unknown> }) => {
        // Relationship fields return empty
        if (args.collection === "posts" && args.where?.heroImage) {
          return Promise.resolve({ docs: [], hasNextPage: false });
        }
        if (args.collection === "posts" && args.where?.["meta.image"]) {
          return Promise.resolve({ docs: [], hasNextPage: false });
        }
        // Full scan returns a post with the URL in blocksData
        if (args.collection === "posts") {
          return Promise.resolve({
            docs: [
              {
                id: 11,
                title: "Post with block",
                slug: "post-with-block",
                blocksData: '{"src":"/media/post-block.jpg"}',
                wordpressHtml: null,
                content: null,
              },
            ],
            hasNextPage: false,
          });
        }
        return Promise.resolve({ docs: [], hasNextPage: false });
      }
    );

    const { GET } = await import("@/app/api/media/[id]/usage/route");
    const res = await GET(makeRequest(), makeParams("9"));
    const body = await res.json();

    expect(body.data.posts).toHaveLength(1);
    expect(body.data.posts[0].field).toContain("blocksData");
    expect(body.data.totalCount).toBe(1);
  });

  it("detects image URL referenced inside post wordpressHtml", async () => {
    payload.findByID.mockResolvedValue({ id: 11, url: "/media/wp-img.jpg" });

    payload.find.mockImplementation(
      (args: { collection: string; where?: Record<string, unknown> }) => {
        if (args.collection === "posts" && (args.where?.heroImage || args.where?.["meta.image"])) {
          return Promise.resolve({ docs: [], hasNextPage: false });
        }
        if (args.collection === "posts") {
          return Promise.resolve({
            docs: [
              {
                id: 12,
                title: "WP Post",
                slug: "wp-post",
                blocksData: null,
                wordpressHtml: '<img src="/media/wp-img.jpg" />',
                content: null,
              },
            ],
            hasNextPage: false,
          });
        }
        return Promise.resolve({ docs: [], hasNextPage: false });
      }
    );

    const { GET } = await import("@/app/api/media/[id]/usage/route");
    const res = await GET(makeRequest(), makeParams("11"));
    const body = await res.json();

    expect(body.data.posts).toHaveLength(1);
    expect(body.data.posts[0].field).toContain("wordpressHtml");
    expect(body.data.totalCount).toBe(1);
  });

  it("detects image URL in page customHeadScripts", async () => {
    payload.findByID.mockResolvedValue({ id: 13, url: "/media/head-script.jpg" });

    payload.find.mockImplementation(
      (args: { collection: string; where?: Record<string, unknown> }) => {
        if (args.collection === "posts") return Promise.resolve({ docs: [], hasNextPage: false });
        if (args.collection === "products") return Promise.resolve({ docs: [], hasNextPage: false });
        if (args.collection === "pages") {
          return Promise.resolve({
            docs: [
              {
                id: 70,
                title: "Landing",
                slug: "landing",
                featuredImage: null,
                ogImage: null,
                twitterImage: null,
                blocksData: null,
                content: null,
                customHeadScripts: '<link rel="preload" href="/media/head-script.jpg" as="image">',
                customFooterScripts: null,
              },
            ],
            hasNextPage: false,
          });
        }
        return Promise.resolve({ docs: [], hasNextPage: false });
      }
    );

    const { GET } = await import("@/app/api/media/[id]/usage/route");
    const res = await GET(makeRequest(), makeParams("13"));
    const body = await res.json();

    expect(body.data.pages).toHaveLength(1);
    expect(body.data.pages[0].field).toContain("customHeadScripts");
    expect(body.data.totalCount).toBe(1);
  });

  it("detects image URL in page customFooterScripts", async () => {
    payload.findByID.mockResolvedValue({ id: 14, url: "/media/footer-script.jpg" });

    payload.find.mockImplementation(
      (args: { collection: string; where?: Record<string, unknown> }) => {
        if (args.collection === "posts") return Promise.resolve({ docs: [], hasNextPage: false });
        if (args.collection === "products") return Promise.resolve({ docs: [], hasNextPage: false });
        if (args.collection === "pages") {
          return Promise.resolve({
            docs: [
              {
                id: 71,
                title: "Promo",
                slug: "promo",
                featuredImage: null,
                ogImage: null,
                twitterImage: null,
                blocksData: null,
                content: null,
                customHeadScripts: null,
                customFooterScripts: '<script>var img="/media/footer-script.jpg"</script>',
              },
            ],
            hasNextPage: false,
          });
        }
        return Promise.resolve({ docs: [], hasNextPage: false });
      }
    );

    const { GET } = await import("@/app/api/media/[id]/usage/route");
    const res = await GET(makeRequest(), makeParams("14"));
    const body = await res.json();

    expect(body.data.pages).toHaveLength(1);
    expect(body.data.pages[0].field).toContain("customFooterScripts");
    expect(body.data.totalCount).toBe(1);
  });

  it("returns empty usage for an orphaned media item", async () => {
    payload.findByID.mockResolvedValue({ id: 99, url: "/media/orphan.jpg" });
    payload.find.mockResolvedValue({ docs: [], hasNextPage: false });

    const { GET } = await import("@/app/api/media/[id]/usage/route");
    const res = await GET(makeRequest(), makeParams("99"));
    const body = await res.json();

    expect(body.data.posts).toHaveLength(0);
    expect(body.data.products).toHaveLength(0);
    expect(body.data.pages).toHaveLength(0);
    expect(body.data.totalCount).toBe(0);
  });
});

// ── Unused Audit Route ───────────────────────────────────────────────────────

describe("GET /api/media/audit/unused", () => {
  let payload: ReturnType<typeof makePayload>;

  beforeEach(async () => {
    vi.resetModules();
    payload = makePayload();
    const { getPayloadSingleton } = await import("@/lib/api/getPayload");
    (getPayloadSingleton as ReturnType<typeof vi.fn>).mockResolvedValue(payload);
  });

  it("excludes media referenced in posts, products, page URL fields, and blocksData", async () => {
    payload.find.mockImplementation(
      (args: { collection: string; where?: unknown; page?: number; limit?: number }) => {
        if (args.collection === "posts") {
          return Promise.resolve({
            docs: [{ heroImage: { id: 1 }, meta: null }],
            hasNextPage: false,
          });
        }
        if (args.collection === "products") {
          return Promise.resolve({
            docs: [{ images: [{ image: { id: 2 } }] }],
            hasNextPage: false,
          });
        }
        if (args.collection === "pages") {
          return Promise.resolve({
            docs: [
              {
                featuredImage: null,
                ogImage: null,
                twitterImage: null,
                blocksData: JSON.stringify({ src: "/media/block-img.jpg" }),
                content: null,
              },
            ],
            hasNextPage: false,
          });
        }
        if (args.collection === "media") {
          return Promise.resolve({
            docs: [
              { id: 1, url: "/media/used-hero.jpg" },
              { id: 2, url: "/media/used-product.jpg" },
              { id: 3, url: "/media/block-img.jpg" },   // in blocksData
              { id: 4, url: "/media/truly-unused.jpg" },
            ],
            totalDocs: 4,
            hasNextPage: false,
          });
        }
        return Promise.resolve({ docs: [], hasNextPage: false, totalDocs: 0 });
      }
    );

    const { GET } = await import("@/app/api/media/audit/unused/route");
    const res = await GET(makeRequest());
    const body = await res.json();

    expect(body.data.media).toHaveLength(1);
    expect(body.data.media[0].id).toBe(4);
    expect(body.data.scannedFields).toContain("pages.blocksData (text scan)");
    expect(body.data.truncated).toBe(false);
  });

  it("excludes media whose URL appears in post blocksData or wordpressHtml", async () => {
    payload.find.mockImplementation(
      (args: { collection: string; page?: number; limit?: number }) => {
        if (args.collection === "posts") {
          return Promise.resolve({
            docs: [
              {
                id: 1,
                heroImage: null,
                meta: null,
                blocksData: '{"src":"/media/in-post-blocks.jpg"}',
                wordpressHtml: '<img src="/media/in-wp-html.jpg">',
                content: null,
              },
            ],
            hasNextPage: false,
          });
        }
        if (args.collection === "products") {
          return Promise.resolve({ docs: [], hasNextPage: false });
        }
        if (args.collection === "pages") {
          return Promise.resolve({ docs: [], hasNextPage: false });
        }
        if (args.collection === "media") {
          return Promise.resolve({
            docs: [
              { id: 10, url: "/media/in-post-blocks.jpg" },
              { id: 11, url: "/media/in-wp-html.jpg" },
              { id: 12, url: "/media/truly-unused.jpg" },
            ],
            totalDocs: 3,
            hasNextPage: false,
          });
        }
        return Promise.resolve({ docs: [], hasNextPage: false, totalDocs: 0 });
      }
    );

    const { GET } = await import("@/app/api/media/audit/unused/route");
    const res = await GET(makeRequest());
    const body = await res.json();

    // Only id=12 should be returned as unused
    expect(body.data.media).toHaveLength(1);
    expect(body.data.media[0].id).toBe(12);
    expect(body.data.scannedFields).toContain("posts.blocksData (text scan)");
    expect(body.data.scannedFields).toContain("posts.wordpressHtml (text scan)");
  });

  it("excludes media whose URL appears in page customHeadScripts or customFooterScripts", async () => {
    payload.find.mockImplementation(
      (args: { collection: string; page?: number; limit?: number }) => {
        if (args.collection === "posts") {
          return Promise.resolve({ docs: [], hasNextPage: false });
        }
        if (args.collection === "products") {
          return Promise.resolve({ docs: [], hasNextPage: false });
        }
        if (args.collection === "pages") {
          return Promise.resolve({
            docs: [
              {
                id: 1,
                featuredImage: null,
                ogImage: null,
                twitterImage: null,
                blocksData: null,
                content: null,
                customHeadScripts: '<link rel="preload" href="/media/in-head.jpg">',
                customFooterScripts: '<script>var x="/media/in-footer.jpg"</script>',
              },
            ],
            hasNextPage: false,
          });
        }
        if (args.collection === "media") {
          return Promise.resolve({
            docs: [
              { id: 20, url: "/media/in-head.jpg" },
              { id: 21, url: "/media/in-footer.jpg" },
              { id: 22, url: "/media/truly-unused.jpg" },
            ],
            totalDocs: 3,
            hasNextPage: false,
          });
        }
        return Promise.resolve({ docs: [], hasNextPage: false, totalDocs: 0 });
      }
    );

    const { GET } = await import("@/app/api/media/audit/unused/route");
    const res = await GET(makeRequest());
    const body = await res.json();

    expect(body.data.media).toHaveLength(1);
    expect(body.data.media[0].id).toBe(22);
    expect(body.data.scannedFields).toContain("pages.customHeadScripts (text scan)");
    expect(body.data.scannedFields).toContain("pages.customFooterScripts (text scan)");
  });
});

// ── Single Delete Guard ──────────────────────────────────────────────────────

describe("DELETE /api/media/[id]", () => {
  let payload: ReturnType<typeof makePayload>;

  beforeEach(async () => {
    vi.resetModules();
    payload = makePayload();
    const { getPayloadSingleton } = await import("@/lib/api/getPayload");
    (getPayloadSingleton as ReturnType<typeof vi.fn>).mockResolvedValue(payload);
  });

  it("returns 409 when the image is used in a post heroImage", async () => {
    payload.findByID.mockResolvedValue({ id: 1, url: "/media/hero.jpg" });
    payload.find.mockImplementation(
      (args: { collection: string; where?: Record<string, unknown> }) => {
        if (args.collection === "posts" && args.where?.heroImage) {
          return Promise.resolve({ docs: [{ id: 10 }], hasNextPage: false });
        }
        return Promise.resolve({ docs: [], hasNextPage: false });
      }
    );

    const { DELETE } = await import("@/app/api/media/[id]/route");
    const res = await DELETE(
      new Request("http://localhost/api/media/1", { method: "DELETE" }),
      makeParams("1")
    );

    expect(res.status).toBe(409);
    const body = await res.json();
    expect(body.error).toBe("Image is in use");
    expect(payload.delete).not.toHaveBeenCalled();
  });

  it("returns 409 when the image URL appears in page blocksData", async () => {
    payload.findByID.mockResolvedValue({ id: 3, url: "/media/block-img.jpg" });
    payload.find.mockImplementation(
      (args: { collection: string; where?: Record<string, unknown> }) => {
        if (args.collection === "posts") return Promise.resolve({ docs: [], hasNextPage: false });
        if (args.collection === "products") return Promise.resolve({ docs: [], hasNextPage: false });
        if (args.collection === "pages") {
          return Promise.resolve({
            docs: [
              {
                id: 30,
                featuredImage: null,
                ogImage: null,
                twitterImage: null,
                blocksData: '{"src":"/media/block-img.jpg"}',
                content: null,
              },
            ],
            hasNextPage: false,
          });
        }
        return Promise.resolve({ docs: [], hasNextPage: false });
      }
    );

    const { DELETE } = await import("@/app/api/media/[id]/route");
    const res = await DELETE(
      new Request("http://localhost/api/media/3", { method: "DELETE" }),
      makeParams("3")
    );

    expect(res.status).toBe(409);
    expect(payload.delete).not.toHaveBeenCalled();
  });

  it("succeeds and calls payload.delete when the image is completely unused", async () => {
    payload.findByID.mockResolvedValue({ id: 5, url: "/media/unused.jpg" });
    payload.find.mockResolvedValue({ docs: [], hasNextPage: false });

    const { DELETE } = await import("@/app/api/media/[id]/route");
    const res = await DELETE(
      new Request("http://localhost/api/media/5", { method: "DELETE" }),
      makeParams("5")
    );

    expect(res.status).toBe(200);
    expect(payload.delete).toHaveBeenCalledWith(
      expect.objectContaining({ collection: "media", id: "5" })
    );
  });
});

// ── Bulk Delete Guard ─────────────────────────────────────────────────────────

describe("POST /api/media/bulk-delete", () => {
  let payload: ReturnType<typeof makePayload>;

  beforeEach(async () => {
    vi.resetModules();
    payload = makePayload();
    const { getPayloadSingleton } = await import("@/lib/api/getPayload");
    (getPayloadSingleton as ReturnType<typeof vi.fn>).mockResolvedValue(payload);
  });

  it("blocks in-use images and only deletes unused ones", async () => {
    payload.findByID.mockImplementation((args: { id: string | number }) => {
      if (String(args.id) === "1") return Promise.resolve({ id: 1, url: "/media/in-use.jpg" });
      if (String(args.id) === "2") return Promise.resolve({ id: 2, url: "/media/unused.jpg" });
      return Promise.resolve(null);
    });

    payload.find.mockImplementation(
      (args: { collection: string; where?: Record<string, unknown> }) => {
        // id 1 is used as heroImage in a post
        if (args.collection === "posts" && args.where?.heroImage) {
          const inClause = (args.where.heroImage as { in?: unknown }).in;
          if (Array.isArray(inClause) && inClause.map(String).includes("1")) {
            return Promise.resolve({ docs: [{ id: 10, heroImage: { id: 1 } }], hasNextPage: false });
          }
        }
        return Promise.resolve({ docs: [], hasNextPage: false });
      }
    );

    const { POST } = await import("@/app/api/media/bulk-delete/route");
    const req = new Request("http://localhost/api/media/bulk-delete", {
      method: "POST",
      body: JSON.stringify({ ids: [1, 2] }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await POST(req);
    const body = await res.json();

    expect(body.data.deletedCount).toBe(1);
    expect(body.data.blockedIds).toHaveLength(1);
    expect(String(body.data.blockedIds[0].id)).toBe("1");
    expect(body.data.failedIds).toHaveLength(0);
    expect(payload.delete).toHaveBeenCalledTimes(1);
  });

  it("rejects requests exceeding MAX_BATCH_SIZE with 400", async () => {
    const ids = Array.from({ length: 101 }, (_, i) => i + 1);
    const { POST } = await import("@/app/api/media/bulk-delete/route");
    const req = new Request("http://localhost/api/media/bulk-delete", {
      method: "POST",
      body: JSON.stringify({ ids }),
      headers: { "Content-Type": "application/json" },
    });

    // withErrorHandling is mocked to pass through, BadRequestError should propagate
    await expect(POST(req)).rejects.toThrow();
  });
});
