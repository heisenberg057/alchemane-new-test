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

function mapSubmission(doc: Record<string, unknown>) {
  return doc; // Flat model passthrough to let UI read fields natively
}

export const formsService = {
  submitContactForm: async (data: Record<string, unknown>) => {
    try {
      const { data: res } = await apiClient.post("/forms/submit", data);
      return { success: true as const, data: res };
    } catch (e: unknown) {
      return handleError(e as { message?: string; errors?: unknown });
    }
  },

  submitCalculatorForm: async (data: Record<string, unknown>) => {
    try {
      const { data: res } = await apiClient.post("/calculator/cost", data);
      return { success: true as const, data: res };
    } catch (e: unknown) {
      return handleError(e as { message?: string; errors?: unknown });
    }
  },

  getFormSubmissions: async ({
    page = 1,
    limit = 20,
    type = "",
    status = "",
    search = "",
  }: {
    page?: number;
    limit?: number;
    type?: string;
    status?: string;
    search?: string;
  } = {}) => {
    try {
      const params: Record<string, string | number> = {
        page,
        limit,
        sort: "-createdAt",
        depth: 0,
      };
      if (type) params["where[type][equals]"] = type;
      if (status) params["where[status][equals]"] = status;
      if (search) {
        params["where[or][0][email][like]"] = search;
        params["where[or][1][name][like]"] = search;
      }

      const { data } = await apiClient.get<PayloadList<Record<string, unknown>>>(
        "/form-submissions",
        { params }
      );
      const docs = data.docs ?? [];
      return {
        success: true as const,
        data: {
          submissions: docs.map((d) => mapSubmission(d)),
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

  deleteSubmission: async (id: number) => {
    try {
      const { data } = await apiClient.delete(`/form-submissions/${id}`);
      return { success: true as const, data };
    } catch (e: unknown) {
      return handleError(e as { message?: string; errors?: unknown });
    }
  },

  updateSubmission: async (id: number, data: Record<string, unknown>) => {
    try {
      const { data: updated } = await apiClient.patch(
        `/form-submissions/${id}`,
        data
      );
      return { success: true as const, data: updated };
    } catch (e: unknown) {
      return handleError(e as { message?: string; errors?: unknown });
    }
  },
};
