"use client";

import { useQuery } from "@tanstack/react-query";
import { 
  Bot, 
  AlertCircle, 
  TrendingUp,
  BrainCircuit,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { api } from "@/lib/api/endpoints";
import { Skeleton } from "@/components/ui/skeleton";
import type {
  AiDashboardData,
  AiDashboardStatistics,
  AiOptimizationScoreDistribution,
  CitationStats,
} from "@/types/seo";

const EMPTY_AI_DIST: AiOptimizationScoreDistribution = {
  excellent: 0,
  good: 0,
  fair: 0,
  poor: 0,
  notOptimized: 0,
};

function normalizeAiDashboard(raw: unknown): AiDashboardData {
  const emptyStats: AiDashboardStatistics = {
    totalPosts: 0,
    optimizedPosts: 0,
    avgScore: 0,
    scoreDistribution: { ...EMPTY_AI_DIST },
  };
  const emptyCitation: CitationStats = {
    totalTests: 0,
    cited: 0,
    citationRate: 0,
    byModel: {},
  };

  if (raw == null || typeof raw !== "object") {
    return {
      statistics: emptyStats,
      needsOptimization: [],
      citationStats: emptyCitation,
    };
  }

  const r = raw as Record<string, unknown>;

  // Stub from GET /api/ai-seo/dashboard (counts + visibilityScore)
  if ("visibilityScore" in r && !("statistics" in r)) {
    const totalTests = Number(r.totalCitationTests) || 0;
    const cited = Number(r.citedCount) || 0;
    const totalPosts = Number(r.totalPosts) || 0;
    const vis = Number(r.visibilityScore) || 0;
    const rate =
      totalTests > 0 ? Math.round((cited / totalTests) * 1000) / 10 : 0;
    return {
      statistics: {
        ...emptyStats,
        totalPosts,
        optimizedPosts: cited,
        avgScore: vis,
        scoreDistribution: { ...EMPTY_AI_DIST },
      },
      needsOptimization: [],
      citationStats: {
        totalTests,
        cited,
        citationRate: rate,
        byModel: {},
      },
    };
  }

  const stats =
    r.statistics && typeof r.statistics === "object"
      ? (r.statistics as Partial<AiDashboardStatistics>)
      : {};
  const cit =
    r.citationStats && typeof r.citationStats === "object"
      ? (r.citationStats as Partial<CitationStats>)
      : {};

  return {
    statistics: {
      ...emptyStats,
      ...stats,
      avgScore: typeof stats.avgScore === "number" ? stats.avgScore : 0,
      scoreDistribution: {
        ...EMPTY_AI_DIST,
        ...stats.scoreDistribution,
      },
    },
    needsOptimization: Array.isArray(r.needsOptimization)
      ? r.needsOptimization
      : [],
    citationStats: {
      ...emptyCitation,
      ...cit,
      byModel:
        cit.byModel && typeof cit.byModel === "object"
          ? cit.byModel
          : {},
    },
  };
}

export default function CitationDashboard() {
  const { data, isLoading, error, refetch, isRefetching } = useQuery<AiDashboardData>({
    queryKey: ["ai-dashboard"],
    queryFn: async () => {
      const response = await api.getAiDashboard();
      return normalizeAiDashboard(response);
    },
    // Keep previous data while refetching to prevent UI flickering
    placeholderData: (previousData) => previousData,
  });

  if (isLoading) {
    return (
      <div className="space-y-6 p-8">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-9 w-64 mb-2" />
            <Skeleton className="h-5 w-96" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-2 w-full mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
             <CardHeader>
               <Skeleton className="h-6 w-48 mb-2" />
               <Skeleton className="h-4 w-64" />
             </CardHeader>
             <CardContent>
               <div className="space-y-4">
                 {[1, 2, 3, 4, 5].map((i) => (
                   <Skeleton key={i} className="h-12 w-full" />
                 ))}
               </div>
             </CardContent>
          </Card>
          <Card className="col-span-3">
             <CardHeader>
               <Skeleton className="h-6 w-48 mb-2" />
               <Skeleton className="h-4 w-64" />
             </CardHeader>
             <CardContent>
               <div className="space-y-4">
                 {[1, 2, 3].map((i) => (
                   <Skeleton key={i} className="h-12 w-full" />
                 ))}
               </div>
             </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h2 className="text-xl font-semibold">Failed to load dashboard data</h2>
        <p className="text-muted-foreground">
          {error instanceof Error ? error.message : "An unexpected error occurred"}
        </p>
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>
    );
  }

  const { statistics, needsOptimization, citationStats } = data;
  const avgScore = statistics?.avgScore ?? 0;
  const citationRate = citationStats?.citationRate ?? 0;

  // Find top performing model
  let topModelName = "-";
  if (citationStats.byModel && Object.keys(citationStats.byModel).length > 0) {
    const sortedModels = Object.entries(citationStats.byModel).sort(
      ([, a], [, b]) => parseFloat(b.rate) - parseFloat(a.rate)
    );
    if (sortedModels.length > 0) {
      topModelName = sortedModels[0][0];
    }
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Citation Dashboard</h1>
          <p className="text-muted-foreground">Monitor how AI assistants perceive and cite your content.</p>
        </div>
        <Button 
          onClick={() => refetch()} 
          disabled={isRefetching}
          className="gap-2"
        >
          {isRefetching && <Loader2 className="h-4 w-4 animate-spin" />}
          {isRefetching ? "Refreshing..." : "Refresh Data"}
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Optimization Score</CardTitle>
            <BrainCircuit className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgScore}</div>
            <Progress value={avgScore} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Across {statistics?.optimizedPosts ?? 0} optimized posts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Citation Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{citationRate}%</div>
            <p className="text-xs text-muted-foreground mt-2">
              Based on {citationStats?.totalTests ?? 0} tests in last 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top AI Model</CardTitle>
            <Bot className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {topModelName}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Highest citation frequency
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Needs Optimization</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{needsOptimization?.length ?? 0}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Posts with low AI scores
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Needs Attention Table */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Optimization Opportunities</CardTitle>
            <CardDescription>
              Posts that need better structure for AI discovery.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>AI Score</TableHead>
                  <TableHead>Conv. Score</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(needsOptimization ?? []).map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>
                      <Badge variant={(post.aiOptimizationScore || 0) < 50 ? "destructive" : "secondary"}>
                        {post.aiOptimizationScore !== null ? post.aiOptimizationScore : "N/A"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {post.conversationalScore ? Math.round(post.conversationalScore * 100) + "%" : "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <a href={`/admin/posts/${post.id}/edit`}>Optimize</a>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {(needsOptimization ?? []).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">All posts are optimized!</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* AI Model Breakdown */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Model Performance</CardTitle>
            <CardDescription>
              Citation rates by AI provider.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(citationStats.byModel || {}).map(([model, stats]) => (
                <div key={model} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="capitalize font-medium">{model}</span>
                    <span className="text-muted-foreground">{stats.rate}% ({stats.cited}/{stats.total})</span>
                  </div>
                  <Progress value={parseFloat(stats.rate)} className="h-2" />
                </div>
              ))}
              {Object.keys(citationStats.byModel || {}).length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  No citation tests run yet.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
