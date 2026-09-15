import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import {
  DEFAULT_SETTINGS,
  parseSettingsFromPayload,
  type Settings,
} from "@/lib/settings/parseSettingsPayload";

export type { Settings };

export const useGetSettings = () => {
  return useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const { data } = await api.get("/settings");
      return parseSettingsFromPayload(data);
    },
    placeholderData: DEFAULT_SETTINGS,
  });
};

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (settings: Settings) => {
      const { data: listData } = await api.get("/settings", { params: { limit: 100 } });
      const docs = (listData as { docs?: Array<{ id?: string | number; key?: string }> })
        ?.docs;
      const siteDoc = Array.isArray(docs)
        ? docs.find((d) => d.key === "site")
        : undefined;

      const payload = {
        key: "site",
        value: JSON.stringify(settings),
        type: "json",
        group: "general",
      };

      if (siteDoc?.id != null) {
        await api.patch(`/settings/${siteDoc.id}`, payload);
      } else {
        await api.post("/settings", payload);
      }

      // Also upsert the standalone ai_seo_model row that aiSeo.service.ts reads
      const aiModelDoc = Array.isArray(docs)
        ? docs.find((d) => d.key === "ai_seo_model")
        : undefined;
      const aiModelPayload = {
        key: "ai_seo_model",
        value: settings.ai_seo_model,
        type: "string",
        group: "ai",
      };
      if (aiModelDoc?.id != null) {
        await api.patch(`/settings/${aiModelDoc.id}`, aiModelPayload);
      } else {
        await api.post("/settings", aiModelPayload);
      }

      return settings;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });
};
