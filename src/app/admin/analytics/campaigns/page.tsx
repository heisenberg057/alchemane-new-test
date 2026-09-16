"use client";

import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

// Rendered client-only: this dashboard's module graph throws during
// server-side prerendering in some build environments (Turbopack), so it
// must never execute during `next build` or on the server.
const CampaignAnalyticsClient = dynamic(() => import("./CampaignAnalyticsClient"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen">
      <Loader2 className="w-8 h-8 animate-spin" />
    </div>
  ),
});

export default function CampaignAnalyticsPage() {
  return <CampaignAnalyticsClient />;
}
