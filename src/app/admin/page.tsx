"use client";

import React, { useMemo } from "react";
import { usePosts } from "@/lib/hooks/usePosts";
import { useProducts } from "@/lib/hooks/useProducts";
import { useGetSubmissions } from "@/lib/hooks/useForms";
import { useGetAnalytics } from "@/lib/hooks/useAnalytics";
import { StatsCard } from "@/components/admin/shared/StatsCard";
import { StatusBadge } from "@/components/admin/shared/StatusBadge";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import {
  FileText,
  ShoppingBag,
  MessageSquare,
  Users,
  Plus,
  ArrowRight,
  BarChart3,
  TrendingUp,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DashboardPage() {
  const { data: postsData, isLoading: postsLoading } = usePosts({ limit: 5 });
  const { data: productsData, isLoading: productsLoading } = useProducts({ limit: 1 });
  const { data: submissionsData, isLoading: submissionsLoading } = useGetSubmissions({ limit: 5 });

  // Memoized so date objects don't re-create on every render
  const analyticsDateRange = useMemo(() => {
    const from = new Date();
    from.setDate(from.getDate() - 30);
    return { from, to: new Date() };
  }, []);
  const { data: analyticsData } = useGetAnalytics(analyticsDateRange);

  const isLoading = postsLoading && productsLoading && submissionsLoading;

  // Real counts from Payload responses
  const totalPosts = postsData?.pagination?.total ?? 0;
  const totalProducts = productsData?.meta?.total ?? 0;
  const totalSubmissions = submissionsData?.meta?.total ?? 0;
  // Lead count = all submissions (every form submission is a potential lead)
  const totalLeads = totalSubmissions;

  const stats = [
    {
      title: "Total Posts",
      value: totalPosts,
      icon: FileText,
      description: "Published & drafts",
    },
    {
      title: "Total Products",
      value: totalProducts,
      icon: ShoppingBag,
      description: "In catalogue",
    },
    {
      title: "Form Submissions",
      value: totalSubmissions,
      icon: MessageSquare,
      description: "All time",
    },
    {
      title: "Active Leads",
      value: analyticsData?.hotLeads ?? 0,
      icon: Zap,
      description: "High priority (Score > 80)",
      className: "border-orange-200 bg-orange-50/30",
    },
    {
      title: "Total Leads",
      value: totalSubmissions,
      icon: Users,
      description: "From form submissions",
    },
  ];

  // Build a simple page-views chart from analytics data (last 30 days)
  const pageViewsData = useMemo(() => {
    if (!analyticsData?.pageViews?.length) return [];
    return analyticsData.pageViews.slice(-14).map((d) => ({
      date: format(new Date(d.date), "MMM d"),
      views: d.views,
    }));
  }, [analyticsData]);

  // Top traffic sources
  const trafficSources = useMemo(() => {
    if (!analyticsData?.trafficSources?.length) return [];
    return analyticsData.trafficSources.slice(0, 5);
  }, [analyticsData]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-slate-200 rounded animate-pulse" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-white rounded-xl border shadow-sm animate-pulse" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4 h-[320px] bg-white rounded-xl border shadow-sm animate-pulse" />
          <div className="col-span-3 h-[320px] bg-white rounded-xl border shadow-sm animate-pulse" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="h-64 bg-white rounded-xl border shadow-sm animate-pulse" />
          <div className="h-64 bg-white rounded-xl border shadow-sm animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your content and business performance."
        actions={
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/admin/posts/new">
                <Plus className="mr-2 h-4 w-4" /> New Post
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/products/new">
                <Plus className="mr-2 h-4 w-4" /> New Product
              </Link>
            </Button>
          </div>
        }
      />

      {/* Stats Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <StatsCard key={i} {...stat} />
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Page Views Chart */}
        <Card className="col-span-4">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold">Page Views (Last 14 Days)</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/analytics" className="text-xs">
                Full Report <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {pageViewsData.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={pageViewsData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    width={32}
                  />
                  <Tooltip
                    contentStyle={{ fontSize: 12, borderRadius: 8 }}
                    cursor={{ fill: "#f1f5f9" }}
                  />
                  <Bar dataKey="views" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-[240px] text-center gap-3">
                <BarChart3 className="h-10 w-10 text-slate-300" />
                <div>
                  <p className="text-sm font-medium text-slate-600">No page view data yet</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Analytics will populate as visitors arrive.
                  </p>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/admin/analytics">View Analytics</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card className="col-span-3">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base font-semibold">Traffic Sources</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/analytics" className="text-xs">
                Details <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {trafficSources.length > 0 ? (
              <div className="space-y-3 pt-1">
                {trafficSources.map((src, i) => {
                  const max = trafficSources[0]?.users || 1;
                  const pct = Math.round((src.users / max) * 100);
                  return (
                    <div key={i} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium capitalize">{src.source}</span>
                        <span className="text-muted-foreground">{src.users.toLocaleString()} users</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-500 rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[240px] text-center gap-3">
                <TrendingUp className="h-10 w-10 text-slate-300" />
                <div>
                  <p className="text-sm font-medium text-slate-600">No traffic data yet</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Sources appear once visitors are tracked.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Posts */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-semibold">Recent Posts</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/posts" className="text-xs">
                View All <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="pt-0">
            {postsData?.posts?.length ? (
              <div className="space-y-3">
                {postsData.posts.map((post: any) => (
                  <div
                    key={post.id}
                    className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-9 w-9 rounded bg-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                        {post.featuredImage ? (
                          <div className="relative h-full w-full">
                            <Image
                              src={post.featuredImage}
                              alt=""
                              fill
                              sizes="36px"
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                        ) : (
                          <FileText className="h-4 w-4 text-slate-400" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{post.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {post.createdAt
                            ? format(new Date(post.createdAt), "MMM d, yyyy")
                            : "—"}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={post.status} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center gap-2">
                <FileText className="h-8 w-8 text-slate-300" />
                <p className="text-sm text-muted-foreground">No posts yet.</p>
                <Button size="sm" asChild>
                  <Link href="/admin/posts/new">Create your first post</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Submissions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-semibold">Recent Submissions</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/forms" className="text-xs">
                View All <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="pt-0">
            {submissionsData?.submissions?.length ? (
              <div className="space-y-3">
                {submissionsData.submissions.map((sub: any) => {
                  const name = sub.data?.name || sub.name || "Unknown";
                  const email = sub.data?.email || sub.email || "";
                  const initial = name[0]?.toUpperCase() ?? "U";
                  return (
                    <div
                      key={sub.id}
                      className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="h-9 w-9 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-semibold text-sm shrink-0">
                          {initial}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{name}</p>
                          <p className="text-xs text-muted-foreground truncate">{email}</p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground shrink-0 ml-2">
                        {sub.createdAt
                          ? format(new Date(sub.createdAt), "MMM d")
                          : "—"}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center gap-2">
                <MessageSquare className="h-8 w-8 text-slate-300" />
                <p className="text-sm text-muted-foreground">No submissions yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
