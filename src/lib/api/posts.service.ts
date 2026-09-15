import { apiClient } from "./client";

type PayloadList<T> = {
  docs?: T[];
  totalDocs?: number;
  totalPages?: number;
  page?: number;
  limit?: number;
};

function mapPostForAdmin(doc: Record<string, unknown>) {
  const heroImage = doc.heroImage as
    | { url?: string; sizes?: { thumbnail?: { url?: string } } }
    | { id?: number | string; url?: string; sizes?: { thumbnail?: { url?: string } } }
    | string
    | null
    | undefined;
  let featuredImage: string | undefined;
  let heroImageId: number | string | undefined;
  if (typeof heroImage === "string") {
    featuredImage = heroImage;
  } else if (heroImage && typeof heroImage === "object") {
    featuredImage =
      heroImage.url ||
      heroImage.sizes?.thumbnail?.url ||
      undefined;
    heroImageId =
      "id" in heroImage &&
      (typeof heroImage.id === "number" || typeof heroImage.id === "string")
        ? heroImage.id
        : undefined;
  }

  const author = doc.author as { name?: string; email?: string } | number | null;

  const rawStatus =
    (doc._status as string) || (doc.status as string) || "draft";

  const meta = doc.meta as Record<string, unknown> | undefined;
  const structuredData = doc.structuredData as Record<string, unknown> | undefined;
  const seoAnalysis = doc.seoAnalysis as Record<string, unknown> | undefined;
  const metrics = doc.metrics as Record<string, unknown> | undefined;
  const aiOptimization = doc.aiOptimization as Record<string, unknown> | undefined;

  const ogImage = meta?.image as { url?: string; id?: number | string } | null | undefined;

  // Validate blocksData: must be a string that parses to { version, blocks[] }.
  // Return a safe fallback rather than null/garbage so the editor never receives
  // an unparseable value.
  const EMPTY_BLOCKS_DATA = JSON.stringify({ version: 1, blocks: [] });
  let safeBlocksData: string = EMPTY_BLOCKS_DATA;
  const rawBlocksData = doc.blocksData;
  if (typeof rawBlocksData === "string" && rawBlocksData.trim()) {
    try {
      let parsed = JSON.parse(rawBlocksData);
      // Unwrap double-stringified values
      if (typeof parsed === "string") parsed = JSON.parse(parsed);
      if (parsed && typeof parsed === "object" && Array.isArray(parsed.blocks)) {
        safeBlocksData = rawBlocksData;
      } else if (Array.isArray(parsed)) {
        // Legacy bare-array format — re-wrap into canonical shape
        safeBlocksData = JSON.stringify({ version: 1, blocks: parsed });
      } else {
        console.warn("[posts.service] blocksData has unexpected shape for doc id", doc.id);
      }
    } catch {
      console.error("[posts.service] blocksData is not valid JSON for doc id", doc.id);
    }
  }

  return {
    ...doc,
    id: doc.id,
    title: typeof doc.title === "string" ? doc.title : String(doc.title ?? ""),
    slug: typeof doc.slug === "string" ? doc.slug : String(doc.slug ?? ""),
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    content: doc.content,
    status: rawStatus.toUpperCase(),
    _status: doc._status,
    featuredImage,
    heroImageId,
    // Basic SEO
    metaTitle: meta?.title ?? doc.metaTitle,
    metaDescription: meta?.description ?? doc.metaDescription,
    metaKeywords: meta?.keywords ?? doc.metaKeywords,
    ogImageUrl: typeof ogImage === "object" && ogImage !== null ? ogImage.url : undefined,
    ogImageId: typeof ogImage === "object" && ogImage !== null ? ogImage.id : undefined,
    twitterTitle: meta?.twitterTitle as string | undefined,
    twitterDescription: meta?.twitterDescription as string | undefined,
    canonicalUrl: (doc.canonicalUrl as string | undefined),
    // Schema / Structured Data
    schemaType: structuredData?.schemaType ?? "BlogPosting",
    customSchema: structuredData?.customSchema,
    // SEO Analysis
    focusKeyword: seoAnalysis?.focusKeyword ?? doc.focusKeyword,
    seoScore: seoAnalysis?.seoScore as number | undefined,
    seoFeedback: seoAnalysis?.seoFeedback as string | undefined,
    // Metrics (read-only)
    readingTime: metrics?.readingTime as number | undefined,
    wordCount: metrics?.wordCount as number | undefined,
    // AI
    aiOptimizationScore: aiOptimization?.score as number | undefined,
    blocksData: safeBlocksData,
    // Tags
    tags: doc.tags,
    author:
      typeof author === "object" && author !== null
        ? { name: author.name, email: author.email }
        : author,
  };
}

function mapPayloadPostsList(raw: PayloadList<Record<string, unknown>>) {
  const docs = raw.docs ?? [];
  return {
    success: true as const,
    data: {
      posts: docs.map((d) => mapPostForAdmin(d)),
      pagination: {
        total: raw.totalDocs ?? 0,
        pages: raw.totalPages ?? 1,
        page: raw.page ?? 1,
        limit: raw.limit ?? docs.length,
      },
    },
  };
}

const handleError = (err: { message?: string; errors?: unknown }) => ({
  success: false as const,
  message: err.message || "Operation failed",
  errors: err.errors || [],
});

export const postsService = {
  getPosts: async ({
    page = 1,
    limit = 10,
    search = "",
    sortBy = "createdAt",
    order = "desc",
    status = "",
    categorySlug = "",
    tagSlug = "",
  }: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    order?: string;
    status?: string;
    categorySlug?: string;
    tagSlug?: string;
  } = {}) => {
    try {
      const sortField = sortBy || "createdAt";
      const sortParam = order === "asc" ? sortField : `-${sortField}`;
      const params: Record<string, string | number> = {
        page,
        limit,
        sort: sortParam,
        depth: 1,
      };
      if (search) {
        params["where[or][0][title][like]"] = search;
        params["where[or][1][slug][like]"] = search;
      }
      if (status && status !== "ALL") {
        const s = status.toLowerCase();
        if (s === "published" || s === "draft") {
          params["where[_status][equals]"] = s;
        }
      }
      if (categorySlug) params["where[category][equals]"] = categorySlug;
      if (tagSlug) params["where[tags][contains]"] = tagSlug;

      const { data } = await apiClient.get<PayloadList<Record<string, unknown>>>(
        "/posts",
        { params }
      );
      return mapPayloadPostsList(data);
    } catch (e: unknown) {
      return handleError(e as { message?: string; errors?: unknown });
    }
  },

  getPost: async (slug: string) => {
    try {
      const isNumericId = /^\d+$/.test(String(slug));
      if (isNumericId) {
        const { data } = await apiClient.get<Record<string, unknown>>(
          `/posts/${slug}`,
          { params: { depth: 2, draft: true } }
        );
        console.log("[posts.service] getPost blocksData:", typeof (data as Record<string, unknown>).blocksData, (data as Record<string, unknown>).blocksData ? "present" : "null/empty");
        return {
          success: true as const,
          data: mapPostForAdmin(data as Record<string, unknown>),
        };
      }
      const { data } = await apiClient.get<PayloadList<Record<string, unknown>>>(
        "/posts",
        {
          params: {
            "where[slug][equals]": slug,
            limit: 1,
            depth: 2,
            draft: true,
          },
        }
      );
      const doc = data.docs?.[0];
      if (!doc) {
        return { success: false as const, message: "Post not found" };
      }
      console.log("[posts.service] getPost blocksData:", typeof doc.blocksData, doc.blocksData ? "present" : "null/empty");
      return {
        success: true as const,
        data: mapPostForAdmin(doc),
      };
    } catch (e: unknown) {
      return handleError(e as { message?: string; errors?: unknown });
    }
  },

  createPost: async (data: Record<string, unknown>) => {
    try {
      const { data: created } = await apiClient.post("/posts", data);
      return { success: true as const, data: created };
    } catch (e: unknown) {
      return handleError(e as { message?: string; errors?: unknown });
    }
  },

  updatePost: async (id: number, data: Record<string, unknown>) => {
    try {
      const { data: updated } = await apiClient.patch(`/posts/${id}`, data);
      return { success: true as const, data: updated };
    } catch (e: unknown) {
      return handleError(e as { message?: string; errors?: unknown });
    }
  },

  autosaveBlocks: async (id: number, blocksData: string) => {
    try {
      const { data } = await apiClient.patch(`/posts/${id}/autosave`, { blocksData });
      return { success: true as const, data };
    } catch (e: unknown) {
      return handleError(e as { message?: string; errors?: unknown });
    }
  },

  deletePost: async (id: number) => {
    try {
      const { data } = await apiClient.delete(`/posts/${id}`);
      return { success: true as const, data };
    } catch (e: unknown) {
      return handleError(e as { message?: string; errors?: unknown });
    }
  },

  publishPost: async (id: number) => {
    try {
      const { data } = await apiClient.patch(`/posts/${id}/publish`, {});
      return { success: true as const, data };
    } catch (e: unknown) {
      return handleError(e as { message?: string; errors?: unknown });
    }
  },

  unpublishPost: async (id: number) => {
    try {
      const { data } = await apiClient.patch(`/posts/${id}`, { _status: 'draft' });
      return { success: true as const, data };
    } catch (e: unknown) {
      return handleError(e as { message?: string; errors?: unknown });
    }
  },

  uploadPostImage: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await apiClient.post("/media", formData);
      return { success: true as const, data };
    } catch (e: unknown) {
      return handleError(e as { message?: string; errors?: unknown });
    }
  },

  getTags: async () => {
    try {
      const { data } = await apiClient.get<PayloadList<Record<string, unknown>>>(
        "/tags",
        { params: { limit: 200, sort: "name" } }
      );
      const docs = (data.docs ?? []) as { id: number | string; name: string; slug: string }[];
      return { success: true as const, data: docs };
    } catch (e: unknown) {
      return handleError(e as { message?: string; errors?: unknown });
    }
  },

  resolveTagIds: async (names: string[]): Promise<{ ids: (number | string)[]; failedNames: string[] }> => {
    if (!names.length) return { ids: [], failedNames: [] };

    const ids: (number | string)[] = [];
    const failedNames: string[] = [];
    // In-session cache: if the caller provides duplicate tag names, avoid
    // creating the same tag twice within the same submit.
    const sessionCache = new Map<string, number | string>();

    for (const name of names) {
      const trimmed = name.trim();
      if (!trimmed) continue;

      const slug = trimmed
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      // Return from session cache if already resolved in this loop
      const cached = sessionCache.get(slug);
      if (cached !== undefined) {
        ids.push(cached);
        continue;
      }

      try {
        // Query by slug directly — no pagination limit dependency
        const { data } = await apiClient.get<PayloadList<Record<string, unknown>>>(
          "/tags",
          { params: { "where[slug][equals]": slug, limit: 1 } }
        );
        const existing = ((data.docs ?? []) as { id: number | string }[])[0];

        if (existing?.id !== undefined) {
          sessionCache.set(slug, existing.id);
          ids.push(existing.id);
        } else {
          // Tag doesn't exist — create it
          const { data: created } = await apiClient.post<Record<string, unknown>>(
            "/tags",
            { name: trimmed, slug }
          );
          const newTag = (created as Record<string, unknown>)?.doc ?? created;
          const newId = (newTag as Record<string, unknown>)?.id as number | string | undefined;
          if (newId !== undefined) {
            sessionCache.set(slug, newId);
            ids.push(newId);
          } else {
            failedNames.push(trimmed);
          }
        }
      } catch {
        failedNames.push(trimmed);
      }
    }

    return { ids, failedNames };
  },
};
