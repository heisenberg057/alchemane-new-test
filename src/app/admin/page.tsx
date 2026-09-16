"use client";

import dynamic from "next/dynamic";

// Rendered client-only: recharts throws during server-side prerendering in
// some build environments (Turbopack), so it must never execute during
// `next build` or on the server. See CampaignAnalyticsClient.tsx for the
// same pattern applied to sibling analytics dashboards.
const DashboardClient = dynamic(() => import("./DashboardClient"), {
  ssr: false,
  loading: () => (
    <div className="space-y-6">
      <div className="h-8 w-48 bg-slate-200 rounded animate-pulse" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-white rounded-xl border shadow-sm animate-pulse" />
        ))}
      </div>
    </div>
  ),
});

export default function DashboardPage() {
  return <DashboardClient />;
}
