import type { Where } from "payload";

export type OverviewDoc = {
  pageUrl?: string | null;
  referrer?: string | null;
  ipAddress?: string | null;
  createdAt?: string;
};

export function buildAnalyticsOverviewWhere(
  startDate: string | null,
  endDate: string | null
): Where {
  const and: Where[] = [{ pageUrl: { not_like: "/admin%" } }];

  if (startDate && endDate) {
    and.push({ createdAt: { greater_than_equal: startDate } });
    and.push({ createdAt: { less_than_equal: endDate } });
  }

  return { and };
}

export function aggregateAnalyticsOverview(docs: OverviewDoc[]): {
  totalViews: number;
  uniqueVisitors: number;
  avgTimeOnSite: number;
  bounceRate: number;
  pageViews: { date: string; views: number }[];
  trafficSources: { source: string; users: number }[];
  topPages: { path: string; views: number }[];
} {
  const pageViewsMap: Record<string, number> = {};
  const trafficSourcesMap: Record<string, number> = {};
  const pathCounts: Record<string, number> = {};
  const ipSet = new Set<string>();

  for (const row of docs) {
    if (row.ipAddress) {
      ipSet.add(row.ipAddress);
    }
    const path = row.pageUrl ?? "";
    pathCounts[path] = (pathCounts[path] ?? 0) + 1;

    const created = row.createdAt ? new Date(row.createdAt).toISOString() : "";
    const dateStr = created ? created.split("T")[0] : "";
    if (dateStr) {
      pageViewsMap[dateStr] = (pageViewsMap[dateStr] ?? 0) + 1;
    }

    const ref = row.referrer;
    let source = "Direct";
    if (ref && ref !== "direct") {
      try {
        const url = new URL(ref);
        if (url.hostname.includes("google")) source = "Google";
        else if (
          url.hostname.includes("facebook") ||
          url.hostname.includes("t.co") ||
          url.hostname.includes("instagram")
        ) {
          source = "Social";
        } else {
          source = "Referral";
        }
      } catch {
        source = "Referral";
      }
    }
    trafficSourcesMap[source] = (trafficSourcesMap[source] ?? 0) + 1;
  }

  const pageViews = Object.entries(pageViewsMap)
    .map(([date, views]) => ({ date, views }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const trafficSources = Object.entries(trafficSourcesMap)
    .map(([src, users]) => ({ source: src, users }))
    .sort((a, b) => b.users - a.users);

  const topPages = Object.entries(pathCounts)
    .map(([path, views]) => ({ path, views }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  return {
    totalViews: docs.length,
    uniqueVisitors: ipSet.size,
    avgTimeOnSite: 0,
    bounceRate: 0,
    pageViews,
    trafficSources,
    topPages,
  };
}
