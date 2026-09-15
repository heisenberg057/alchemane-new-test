import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export interface Media {
  id: number;
  originalName: string;
  storedName: string;
  fileType: string;
  fileSize: number;
  url: string;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
  altText?: string;
  caption?: string;
  title?: string;
  description?: string;
  folder?: string;
  createdAt: string;
  updatedAt: string;
  uploadedById?: number;
}

interface GetMediaParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
}

interface MediaListResponse {
  media: Media[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

function toMedia(raw: Record<string, unknown>): Media {
  return {
    id: Number(raw.id ?? 0),
    originalName: String(raw.originalName ?? raw.filename ?? raw.title ?? ""),
    storedName: String(raw.storedName ?? raw.filename ?? ""),
    fileType: String(raw.fileType ?? raw.mimeType ?? ""),
    fileSize: Number(raw.fileSize ?? raw.filesize ?? 0),
    url: String(raw.url ?? ""),
    thumbnailUrl: typeof raw.thumbnailUrl === "string" ? raw.thumbnailUrl : undefined,
    width: raw.width != null ? Number(raw.width) : undefined,
    height: raw.height != null ? Number(raw.height) : undefined,
    altText: typeof raw.altText === "string" ? raw.altText : typeof raw.alt === "string" ? raw.alt : undefined,
    caption: typeof raw.caption === "string" ? raw.caption : undefined,
    title: typeof raw.title === "string" ? raw.title : undefined,
    description: typeof raw.description === "string" ? raw.description : undefined,
    folder: typeof raw.folder === "string" ? raw.folder : undefined,
    createdAt: String(raw.createdAt ?? ""),
    updatedAt: String(raw.updatedAt ?? ""),
    uploadedById: raw.uploadedById != null ? Number(raw.uploadedById) : undefined,
  };
}

function normalizeMediaListResponse(body: unknown, params: GetMediaParams): MediaListResponse {
  const source = body && typeof body === "object" ? (body as Record<string, unknown>) : {};
  const nestedData =
    source.data && typeof source.data === "object"
      ? (source.data as Record<string, unknown>)
      : source;

  const docs = Array.isArray(source.docs)
    ? source.docs
    : Array.isArray(nestedData.docs)
      ? nestedData.docs
      : Array.isArray(nestedData.media)
        ? nestedData.media
        : Array.isArray(source.media)
          ? source.media
          : [];

  const media = docs
    .filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object")
    .map(toMedia);

  const rawPagination =
    nestedData.pagination && typeof nestedData.pagination === "object"
      ? (nestedData.pagination as Record<string, unknown>)
      : {};

  const page = Number(rawPagination.page ?? nestedData.page ?? source.page ?? params.page ?? 1);
  const limit = Number(rawPagination.limit ?? nestedData.limit ?? source.limit ?? params.limit ?? 50);
  const total = Number(rawPagination.total ?? nestedData.totalDocs ?? source.totalDocs ?? media.length);
  const pages = Number(rawPagination.pages ?? nestedData.totalPages ?? source.totalPages ?? 1);

  return {
    media,
    pagination: {
      page: Number.isFinite(page) ? page : 1,
      limit: Number.isFinite(limit) ? limit : 50,
      total: Number.isFinite(total) ? total : media.length,
      pages: Number.isFinite(pages) ? pages : 1,
    },
  };
}

export const useGetMedia = (params: GetMediaParams = {}) => {
  return useQuery({
    queryKey: ["media", params],
    queryFn: async () => {
      const { data } = await api.get("/media", { params });
      return normalizeMediaListResponse(data, params);
    },
  });
};

export const useUploadMedia = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (files: File[]) => {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });

      const { data } = await api.post("/media/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return data.data.media;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
    },
  });
};

export const useUpdateMedia = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { id: number; altText?: string; caption?: string; title?: string; description?: string }) => {
      const { id, ...data } = input;
      const res = await api.put(`/media/${id}`, data);
      return res.data.data.media;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
    },
  });
};

export const useDeleteMedia = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/media/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
    },
  });
};
