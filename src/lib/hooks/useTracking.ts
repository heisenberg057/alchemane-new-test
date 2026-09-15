import { apiClient } from "../api/client";
import { useQuery } from "@tanstack/react-query";

// Types
export interface CampaignPerformance {
  campaignName: string;
  adSetName: string | null;
  adName: string | null;
  clicks: number;
  conversions: number;
  conversionRate: string;
}

export interface CampaignDetails extends CampaignPerformance {
  firstClick: string;
  lastClick: string;
}

export interface AttributionReport {
  campaignName: string;
  firstTouch: number;
  lastTouch: number;
  multiTouch: number;
}

// API Functions
export const trackingApi = {
  getCampaignPerformance: async (params?: Record<string, unknown>) => {
    try {
      const { data } = await apiClient.get("/tracking/performance", { params });
      const rows = data?.data;
      return Array.isArray(rows) ? rows : [];
    } catch {
      return [];
    }
  },

  getCampaignList: async () => {
    try {
      const { data } = await apiClient.get("/tracking/campaigns");
      return data.data || [];
    } catch (e) { return []; }
  },

  getAdClickDetails: async (id: number) => {
    try {
      const { data } = await apiClient.get(`/tracking/clicks/${id}`);
      return data.data || null;
    } catch (e) { return null; }
  }
};

// Hooks
export const useGetCampaignPerformance = (dateRange?: { from: Date; to: Date }, filters?: any) => {
  return useQuery({
    queryKey: ["campaign-performance", dateRange, filters],
    queryFn: async () => {
      const params = {
        startDate: dateRange?.from?.toISOString(),
        endDate: dateRange?.to?.toISOString(),
        ...filters
      };
      return trackingApi.getCampaignPerformance(params);
    },
    refetchInterval: 30000, // Real-time update every 30s
  });
};

export const useGetCampaignList = () => {
  return useQuery({
    queryKey: ["campaign-list"],
    queryFn: trackingApi.getCampaignList,
  });
};

export const useGetAdClickDetails = (id: number) => {
  return useQuery({
    queryKey: ["ad-click", id],
    queryFn: () => trackingApi.getAdClickDetails(id),
    enabled: !!id,
  });
};
