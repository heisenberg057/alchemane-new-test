import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/endpoints";

export interface AnalyticsData {
  pageViews: { date: string; views: number }[];
  uniqueVisitors: number;
  totalViews: number;
  avgTimeOnSite: number; // in seconds
  bounceRate: number; // percentage
  topPages: { path: string; views: number }[];
  trafficSources: { source: string; users: number }[];
  hotLeads?: number;
}

export const useGetAnalytics = (dateRange: { from: Date; to: Date }) => {
  return useQuery({
    queryKey: ["analytics", dateRange.from.toISOString(), dateRange.to.toISOString()],
    queryFn: async () => {
      const data = await api.getAnalytics(dateRange);
      if (!data) throw new Error("No analytics data returned");
      return data as AnalyticsData;
    },
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
};
