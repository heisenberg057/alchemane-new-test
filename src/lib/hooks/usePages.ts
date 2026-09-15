import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';

type PagesListResponse = {
  pages: Record<string, unknown>[];
  pagination: { total: number; pages: number; page?: number; limit?: number };
};

function mapPayloadList(data: Record<string, unknown>): PagesListResponse {
  const docs = (data.docs as Record<string, unknown>[]) ?? [];
  return {
    pages: docs,
    pagination: {
      total: (data.totalDocs as number) ?? 0,
      pages: (data.totalPages as number) ?? 1,
      page: data.page as number | undefined,
      limit: data.limit as number | undefined,
    },
  };
}

/** Payload REST returns `{ docs, totalDocs }` at the root; some proxies wrap as `{ data: { docs } }`. */
function normalizeListPayload(body: unknown): Record<string, unknown> {
  if (body && typeof body === "object") {
    const o = body as Record<string, unknown>;
    if ("docs" in o) return o;
    const inner = o.data;
    if (inner && typeof inner === "object" && "docs" in (inner as object)) {
      return inner as Record<string, unknown>;
    }
  }
  return {};
}

const fetchPages = async (filters: Record<string, unknown> = {}) => {
  const page = typeof filters.page === 'number' ? filters.page : Number(filters.page) || 1;
  const limit = typeof filters.limit === 'number' ? filters.limit : Number(filters.limit) || 10;
  const search = typeof filters.search === 'string' ? filters.search : '';
  const status = typeof filters.status === 'string' ? filters.status : '';

  const params: Record<string, string | number> = {
    page,
    limit,
    sort: '-updatedAt',
    depth: 1,
  };
  if (search) params['where[title][contains]'] = search;
  if (status && status !== 'ALL') {
    params['where[status][equals]'] = status;
  }

  const { data } = await api.get<unknown>('/pages', { params });
  const normalized = normalizeListPayload(data);
  if (normalized.docs && Array.isArray(normalized.docs)) {
    return mapPayloadList(normalized as Record<string, unknown>);
  }
  return { pages: [], pagination: { total: 0, pages: 1 } };
};

const fetchPage = async (id: string | number) => {
  const { data } = await api.get<Record<string, unknown>>(`/pages/${id}`, {
    params: { depth: 1 },
  });
  if (data && typeof data === "object" && "doc" in data && (data as { doc?: unknown }).doc) {
    return (data as { doc: Record<string, unknown> }).doc;
  }
  return data;
};

export function usePages(params: Record<string, unknown> = {}) {
  return useQuery({
    queryKey: ['pages', params],
    queryFn: () => fetchPages(params),
  });
}

export function usePage(id: string | number) {
  return useQuery({
    queryKey: ['page', id],
    queryFn: () => fetchPage(id),
    enabled: id !== '' && id !== null && id !== undefined,
  });
}

export function useCreatePage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await api.post('/pages', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
    },
  });
}

export function useUpdatePage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string | number; data: Record<string, unknown> }) => {
      const res = await api.patch(`/pages/${id}`, data);
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
      queryClient.invalidateQueries({ queryKey: ['page', variables.id] });
    },
  });
}

export function useDeletePage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string | number) => {
      const res = await api.delete(`/pages/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
    },
  });
}
