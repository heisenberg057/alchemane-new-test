import { apiClient } from './client';
import { useAuthStore } from '@/lib/store/authStore';

type PayloadList<T> = {
  docs?: T[];
  totalDocs?: number;
  totalPages?: number;
  page?: number;
  limit?: number;
};

export type MediaDoc = {
  id: number;
  url: string;
  filename: string;
  mimeType: string;
  filesize: number;
  width?: number;
  height?: number;
  altText: string;
  title: string;
  caption: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type UsagePost = { id: string | number; title: string; slug: string; field: string };
export type UsageProduct = { id: string | number; name: string; slug: string };
export type UsagePage = { id: string | number; title: string; slug: string; field: string };
export type MediaUsage = { posts: UsagePost[]; products: UsageProduct[]; pages: UsagePage[]; totalCount: number };

function mapMediaDoc(doc: Record<string, unknown>): MediaDoc {
  const url = typeof doc.url === 'string' ? doc.url : '';
  const alt = doc.alt;
  return {
    id: doc.id as number,
    url,
    filename: String(doc.filename ?? ''),
    mimeType: String(doc.mimeType ?? ''),
    filesize: Number(doc.filesize ?? 0),
    width: doc.width != null ? Number(doc.width) : undefined,
    height: doc.height != null ? Number(doc.height) : undefined,
    altText: typeof alt === 'string' ? alt : '',
    title: String(doc.title ?? ''),
    caption: String(doc.caption ?? ''),
    description: String(doc.description ?? ''),
    createdAt: String(doc.createdAt ?? ''),
    updatedAt: String(doc.updatedAt ?? ''),
  };
}

export const mediaService = {
  /** Payload upload: POST /api/media (multipart `file` + required `alt`). */
  uploadFile: async (file: File, altText?: string) => {
    try {
      const formData = new FormData();
      const baseName = file.name.replace(/\.[^.]+$/, "").trim();

      const payloadData: Record<string, string> = {
        alt: altText?.trim() || baseName || 'Image',
      };
      if (baseName) {
        payloadData.title = baseName;
      }

      formData.append('_payload', JSON.stringify(payloadData));
      formData.append('file', file);

      const { accessToken } = useAuthStore.getState();
      const uploadHeaders: HeadersInit = {};
      if (accessToken) uploadHeaders['Authorization'] = `Bearer ${accessToken}`;

      const res = await fetch('/api/media', {
        method: 'POST',
        headers: uploadHeaders,
        body: formData,
        credentials: 'include',
      });

      const body = (await res.json().catch(() => ({}))) as Record<string, unknown>;
      if (!res.ok) {
        const firstError = Array.isArray(body.errors) && body.errors.length > 0
          ? body.errors[0]
          : null;
        const top =
          typeof body.message === "string"
            ? body.message
            : typeof body.error === "string"
              ? body.error
              : "Upload failed";
        const detail =
          firstError &&
          typeof firstError === "object" &&
          "message" in firstError &&
          typeof (firstError as { message?: unknown }).message === "string"
            ? String((firstError as { message: string }).message)
            : firstError &&
                typeof firstError === "object" &&
                "data" in firstError &&
                Array.isArray((firstError as { data?: unknown }).data) &&
                (firstError as { data: Array<Record<string, unknown>> }).data.length > 0 &&
                typeof (firstError as { data: Array<Record<string, unknown>> }).data[0]?.message === "string"
              ? String((firstError as { data: Array<Record<string, unknown>> }).data[0].message)
            : "";
        return {
          success: false as const,
          message: detail ? `${top}: ${detail}` : top,
        };
      }
      const doc = (body.doc ?? body) as Record<string, unknown>;
      const mapped = mapMediaDoc(doc);
      return {
        success: true as const,
        data: { url: mapped.url, media: [mapped] },
      };
    } catch (e: unknown) {
      const msg = e && typeof e === 'object' && 'message' in e ? String((e as { message: string }).message) : 'Upload failed';
      return { success: false as const, message: msg };
    }
  },

  getMedia: async ({ page = 1, limit = 20 }: { page?: number; limit?: number } = {}) => {
    const { data } = await apiClient.get<PayloadList<Record<string, unknown>>>('/media', {
      params: { page, limit, sort: '-createdAt', depth: 1 },
    });
    const docs = (data.docs ?? []).map(mapMediaDoc);
    return {
      success: true as const,
      data: {
        media: docs,
        meta: {
          total: data.totalDocs ?? 0,
          page: data.page ?? page,
          limit: data.limit ?? limit,
          pages: data.totalPages ?? 1,
        },
      },
    };
  },

  deleteMedia: async (id: number) => {
    const { data } = await apiClient.delete(`/media/${id}`);
    return { success: true as const, data };
  },

  updateMedia: async (id: number, data: Record<string, unknown>) => {
    const payload: Record<string, unknown> = { ...data };
    if ('altText' in payload) {
      payload.alt = payload.altText;
      delete payload.altText;
    }
    const { data: updated } = await apiClient.patch(`/media/${id}`, payload);
    return { success: true as const, data: updated };
  },

  /** GET /api/media/:id/usage — returns structured { posts, products, pages, totalCount } */
  getMediaUsage: async (id: number): Promise<{ success: true; data: MediaUsage } | { success: false; error: string }> => {
    try {
      const { data: body } = await apiClient.get<{ data?: MediaUsage }>(`/media/${id}/usage`);
      const usage = body?.data ?? { posts: [], products: [], pages: [], totalCount: 0 };
      return {
        success: true as const,
        data: {
          posts: Array.isArray(usage.posts) ? usage.posts : [],
          products: Array.isArray(usage.products) ? usage.products : [],
          pages: Array.isArray(usage.pages) ? usage.pages : [],
          totalCount: typeof usage.totalCount === 'number' ? usage.totalCount : 0,
        },
      };
    } catch (e: unknown) {
      const msg = e && typeof e === 'object' && 'message' in e ? String((e as { message: string }).message) : 'Failed to load usage';
      return { success: false as const, error: msg };
    }
  },

  /** GET /api/media/audit/unused */
  getUnusedMedia: async () => {
    const { data: body } = await apiClient.get("/media/audit/unused");
    const payload = body as {
      data?: {
        media?: Record<string, unknown>[];
        meta?: Record<string, unknown>;
        scannedFields?: string[];
        note?: string;
      };
    };
    const inner = payload.data;
    const raw = inner?.media ?? [];
    const media = Array.isArray(raw) ? raw.map(mapMediaDoc) : [];
    const rawMeta = inner?.meta as Record<string, unknown> | undefined;
    const meta = {
      total: typeof rawMeta?.total === 'number' ? rawMeta.total : media.length,
      page: typeof rawMeta?.page === 'number' ? rawMeta.page : 1,
      limit: typeof rawMeta?.limit === 'number' ? rawMeta.limit : media.length,
      pages: typeof rawMeta?.pages === 'number' ? rawMeta.pages : 1,
    };
    return {
      success: true as const,
      data: {
        media,
        meta,
        scannedFields: Array.isArray(inner?.scannedFields) ? inner.scannedFields : [],
        note: typeof inner?.note === 'string' ? inner.note : '',
      },
    };
  },

  deleteBulkMedia: async (ids: number[]) => {
    const { data: body } = await apiClient.post("/media/bulk-delete", { ids });
    const payload = body as {
      data?: {
        deletedCount?: number;
        failedIds?: (string | number)[];
        blockedIds?: { id: string | number; reason: string }[];
      };
    };
    return {
      success: true as const,
      data: {
        deletedCount: payload?.data?.deletedCount ?? 0,
        failedIds: payload?.data?.failedIds ?? [],
        blockedIds: payload?.data?.blockedIds ?? [],
      },
    };
  },
};
