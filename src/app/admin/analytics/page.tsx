"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

// Rendered client-only: recharts throws during server-side prerendering in
// some build environments (Turbopack), so it must never execute during
// `next build` or on the server. See CampaignAnalyticsClient.tsx for the
// same pattern applied to the sibling campaigns dashboard.
const AnalyticsClient = dynamic(() => import("./AnalyticsClient"), {
  ssr: false,
  loading: () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-10 w-[300px]" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    </div>
  ),
});

export default function AnalyticsPage() {
  return <AnalyticsClient />;
}
