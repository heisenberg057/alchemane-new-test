import { apiClient } from "./client";

type PayloadList<T> = {
  docs?: T[];
  totalDocs?: number;
  totalPages?: number;
  page?: number;
  limit?: number;
};

const handleError = (err: { message?: string; errors?: unknown }) => ({
  success: false as const,
  message: err.message || "Operation failed",
  errors: err.errors || [],
});

export const productsService = {
  getProducts: async ({
    page = 1,
    limit = 10,
    category = "",
    search = "",
    status = "",
  }: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    status?: string;
  } = {}) => {
    try {
      const params: Record<string, string | number> = {
        page,
        limit,
        sort: "-createdAt",
        depth: 1,
      };
      if (search) params["where[name][contains]"] = search;
      if (category) params["where[category][equals]"] = category;
      if (status && status !== "ALL") {
        params["where[status][equals]"] = status;
      }

      const { data } = await apiClient.get<PayloadList<Record<string, unknown>>>(
        "/products",
        { params }
      );
      const docs = data.docs ?? [];
      return {
        success: true as const,
        data: {
          products: docs,
          meta: {
            total: data.totalDocs ?? 0,
            page: data.page ?? page,
            limit: data.limit ?? limit,
            pages: data.totalPages ?? 1,
          },
        },
      };
    } catch (e: unknown) {
      return handleError(e as { message?: string; errors?: unknown });
    }
  },

  getProduct: async (id: number | string) => {
    try {
      const { data } = await apiClient.get(`/products/${id}`, {
        params: { depth: 2 },
      });
      return { success: true as const, data };
    } catch (e: unknown) {
      return handleError(e as { message?: string; errors?: unknown });
    }
  },

  createProduct: async (data: Record<string, unknown>) => {
    try {
      const { data: created } = await apiClient.post("/products", data);
      return { success: true as const, data: created };
    } catch (e: unknown) {
      return handleError(e as { message?: string; errors?: unknown });
    }
  },

  updateProduct: async (id: number | string, data: Record<string, unknown>) => {
    try {
      const { data: updated } = await apiClient.patch(`/products/${id}`, data);
      return { success: true as const, data: updated };
    } catch (e: unknown) {
      return handleError(e as { message?: string; errors?: unknown });
    }
  },

  deleteProduct: async (id: number | string) => {
    try {
      const { data } = await apiClient.delete(`/products/${id}`);
      return { success: true as const, data };
    } catch (e: unknown) {
      return handleError(e as { message?: string; errors?: unknown });
    }
  },
};
