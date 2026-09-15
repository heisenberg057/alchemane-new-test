"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  Search,
  Activity,
  AlertCircle,
  FileWarning,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Wifi,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api/endpoints";
import { apiClient } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import type { SeoHealthStatus } from "@/app/api/search-optimization/health/route";
import type { ContentScope } from "@/app/api/search-optimization/overview/route";

/** Maximum wall-clock time to poll for queue progress (15 minutes) */
const MAX_POLL_MS = 15 * 60 * 1000;

export interface SeoOverviewData {
  scope: ContentScope;
  publishedPosts: number;
  publishedPostsBreakdown: {
    posts: number;
    pages: number;
  };
  analyzedPosts: number;
  averageScore: number;
  postsNeedingAttention: {
    id: string;
    title: string;
    slug: string;
    score: number;
    analyzedAt: string | null;
  }[];
  recentAnalyses: {
    id: string;
    postTitle: string;
    postSlug: string;
    score: number;
    analyzedAt: string | null;
  }[];
  missingMetaTitle: number;
  missingMetaDescription: number;
}

function asRecord(v: unknown): Record<string, unknown> | null {
  if (v == null || typeof v !== "object" || Array.isArray(v)) return null;
  return v as Record<string, unknown>;
}

function num(v: unknown, fallback = 0): number {
  return typeof v === "number" && !Number.isNaN(v) ? v : fallback;
}

function emptyOverview(scope: ContentScope = "posts"): SeoOverviewData {
  return {
    scope,
    publishedPosts: 0,
    publishedPostsBreakdown: {
      posts: 0,
      pages: 0,
    },
    analyzedPosts: 0,
    averageScore: 0,
    postsNeedingAttention: [],
    recentAnalyses: [],
    missingMetaTitle: 0,
    missingMetaDescription: 0,
  };
}

function normalizePostsNeedingAttention(
  raw: unknown
): SeoOverviewData["postsNeedingAttention"] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const o = asRecord(item) ?? {};
    const at = o.analyzedAt;
    let analyzedAt: string | null = null;
    if (typeof at === "string") analyzedAt = at;
    else if (at instanceof Date) analyzedAt = at.toISOString();
    return {
      id: String(o.id ?? ""),
      title: typeof o.title === "string" ? o.title : String(o.title ?? ""),
      slug: typeof o.slug === "string" ? o.slug : String(o.slug ?? ""),
      score: num(o.score, 0),
      analyzedAt,
    };
  });
}

function normalizeRecentAnalyses(
  raw: unknown
): SeoOverviewData["recentAnalyses"] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const o = asRecord(item) ?? {};
    const at = o.analyzedAt;
    let analyzedAt: string | null = null;
    if (typeof at === "string") analyzedAt = at;
    else if (at instanceof Date) analyzedAt = at.toISOString();
    return {
      id: String(o.id ?? ""),
      postTitle:
        typeof o.postTitle === "string"
          ? o.postTitle
          : String(o.postTitle ?? ""),
      postSlug:
        typeof o.postSlug === "string"
          ? o.postSlug
          : String(o.postSlug ?? ""),
      score: num(o.score, 0),
      analyzedAt,
    };
  });
}

/** Maps `/api/search-optimization/overview` payload (optionally wrapped in `{ data }`). */
function normalizeSeoOverview(raw: unknown): SeoOverviewData {
  if (raw == null) return emptyOverview();

  let r = asRecord(raw);
  if (!r) return emptyOverview();

  const inner = asRecord(r.data);
  if (
    inner &&
    typeof inner.publishedPosts === "number" &&
    typeof inner.analyzedPosts === "number"
  ) {
    r = inner;
  }

  const rawScope = r.scope;
  const scope: ContentScope =
    rawScope === "pages" ? "pages" : rawScope === "all" ? "all" : "posts";

  return {
    scope,
    publishedPosts: num(r.publishedPosts, 0),
    publishedPostsBreakdown: {
      posts: num(asRecord(r.publishedPostsBreakdown)?.posts, 0),
      pages: num(asRecord(r.publishedPostsBreakdown)?.pages, 0),
    },
    analyzedPosts: num(r.analyzedPosts, 0),
    averageScore: num(r.averageScore, 0),
    postsNeedingAttention: normalizePostsNeedingAttention(
      r.postsNeedingAttention
    ),
    recentAnalyses: normalizeRecentAnalyses(r.recentAnalyses),
    missingMetaTitle: num(r.missingMetaTitle, 0),
    missingMetaDescription: num(r.missingMetaDescription, 0),
  };
}

function ScoreBadge({ score }: { score: number }) {
  if (score < 30) {
    return <Badge variant="destructive">{score}</Badge>;
  }
  if (score <= 50) {
    return (
      <Badge
        className={cn(
          "border-transparent bg-amber-500 text-white hover:bg-amber-600"
        )}
      >
        {score}
      </Badge>
    );
  }
  return (
    <Badge
      className={cn(
        "border-transparent bg-green-600 text-white hover:bg-green-700"
      )}
    >
      {score}
    </Badge>
  );
}

function formatAnalyzedAt(analyzedAt: string | null): string {
  if (analyzedAt == null || analyzedAt === "") return "—";
  const d = new Date(analyzedAt);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}

function HealthDot({ status }: { status: "ok" | "error" | "not_configured" | "missing" | "running" | "stopped" | "unknown" }) {
  if (status === "ok" || status === "running") {
    return <CheckCircle2 className="h-4 w-4 text-green-600 inline-block mr-1" />;
  }
  if (status === "error" || status === "stopped") {
    return <XCircle className="h-4 w-4 text-destructive inline-block mr-1" />;
  }
  // not_configured / missing / unknown
  return <AlertTriangle className="h-4 w-4 text-amber-500 inline-block mr-1" />;
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const SCOPE_LABELS: Record<ContentScope, string> = {
  posts: "Posts",
  pages: "Pages",
  all: "All Content",
};

export default function SeoDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<SeoOverviewData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const [scope, setScope] = useState<ContentScope>("posts");
  const { toast } = useToast();

  const [health, setHealth] = useState<SeoHealthStatus | null>(null);
  const [healthLoading, setHealthLoading] = useState(true);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState<{
    queued: number;
    processing: number;
    completed: number;
    failed: number;
    thisRunCompleted: number;
    totalTarget: number;
  } | null>(null);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [analysisSummary, setAnalysisSummary] = useState<{
    analyzed: number;
    failed: number;
  } | null>(null);

  // AbortController ref for the poll loop — cancelled on unmount or new run
  const pollAbortRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async (overrideScope?: ContentScope) => {
    setLoading(true);
    setError(null);
    try {
      const overview = await api.getSeoOverview(overrideScope ?? scope);
      setData(normalizeSeoOverview(overview));
      setLastRefreshed(new Date());
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string }; status?: number }; status?: number; message?: string };
      let errorMessage = e?.response?.data?.message ?? e?.message ?? "Failed to fetch SEO data";
      const status = e?.status ?? e?.response?.status;
      if (status === 401) {
        errorMessage = "Session expired. Please log in again.";
      } else if (errorMessage === "Network Error") {
        errorMessage = "Network error. Check your connection or disable ad blockers (uBlock Origin often blocks '/seo' URLs).";
      }
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast, scope]);

  const fetchHealth = useCallback(async () => {
    setHealthLoading(true);
    try {
      const h = await api.getSeoHealth();
      setHealth(h);
    } catch {
      // Non-fatal — health check failing should not block the dashboard
      setHealth(null);
    } finally {
      setHealthLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    fetchHealth();
  }, [fetchData, fetchHealth]);

  // Cleanup poll on unmount
  useEffect(() => {
    return () => {
      pollAbortRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    if (!analysisComplete) return;
    const id = window.setTimeout(() => {
      setAnalysisProgress(null);
      setAnalysisComplete(false);
    }, 10_000);
    return () => window.clearTimeout(id);
  }, [analysisComplete]);

  const refreshDashboardDataSilently = async () => {
    try {
      const overview = await api.getSeoOverview(scope);
      setData(normalizeSeoOverview(overview));
      setLastRefreshed(new Date());
    } catch (err: unknown) {
      const e = err as { response?: { data?: unknown }; message?: string };
      console.error("Failed to refresh SEO data:", e?.response?.data ?? e?.message);
    }
  };

  const pollAnalyzeAll = async (
    totalTarget: number,
    completedBaseline: number,
    failedBaseline: number,
    signal: AbortSignal
  ) => {
    const deadline = Date.now() + MAX_POLL_MS;
    let timedOut = false;

    while (!signal.aborted) {
      if (Date.now() > deadline) {
        timedOut = true;
        break;
      }

      try {
        const res = await apiClient.get("/search-optimization/analyze-all", {
          params: {},
        });
        const inner = res.data?.data ?? res.data;
        const waiting = Number(inner?.waiting ?? 0);
        const active = Number(inner?.active ?? 0);
        const completed = Number(inner?.completed ?? 0);
        const failed = Number(inner?.failed ?? 0);
        const thisRunCompleted = Math.max(0, completed - completedBaseline);
        // Use per-run delta so the summary never shows failures from previous runs
        const thisRunFailed = Math.max(0, failed - failedBaseline);

        setAnalysisProgress({
          queued: waiting,
          processing: active,
          completed,
          failed: thisRunFailed,
          thisRunCompleted,
          totalTarget,
        });

        if (waiting + active === 0) {
          setAnalysisSummary({ analyzed: thisRunCompleted, failed: thisRunFailed });
          break;
        }
      } catch (err: unknown) {
        // Network blip during polling — log and retry
        const e = err as { message?: string };
        console.warn("Poll error:", e?.message);
      }

      await delay(3000);
    }

    if (signal.aborted) return;

    setIsAnalyzing(false);

    if (timedOut) {
      // Do NOT set analysisComplete — show a distinct timed-out state instead
      setAnalysisProgress(null);
      toast({
        title: "Analysis still running",
        description:
          "The job is taking longer than 15 minutes. It continues in the background — refresh the dashboard later to see updated scores.",
        variant: "destructive",
      });
    } else {
      setAnalysisComplete(true);
      await refreshDashboardDataSilently();
    }
  };

  const handleConfirmRunAnalysis = async () => {
    setConfirmOpen(false);
    setAnalysisComplete(false);
    setAnalysisProgress(null);
    setAnalysisSummary(null);
    setIsAnalyzing(true);

    // Cancel any previous poll
    pollAbortRef.current?.abort();
    const controller = new AbortController();
    pollAbortRef.current = controller;

    try {
      const postTotal = data?.publishedPostsBreakdown.posts ?? data?.publishedPosts ?? 0;
      await api.runBulkSeoAnalysis();

      const baselineRes = await apiClient.get(
        "/search-optimization/analyze-all",
        { params: {} }
      );
      const baselineInner = baselineRes.data?.data ?? baselineRes.data;
      const completedBaseline = Number(baselineInner?.completed ?? 0);
      const failedBaseline = Number(baselineInner?.failed ?? 0);

      toast({
        title: "Analysis started",
        description:
          "Bulk SEO analysis is running in the background. Progress is shown below.",
      });

      await pollAnalyzeAll(postTotal, completedBaseline, failedBaseline, controller.signal);
    } catch (err: unknown) {
      setIsAnalyzing(false);
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      const msg =
        e?.response?.data?.message ??
        e?.message ??
        "Failed to start analysis. Check that the queue service is running.";
      toast({
        title: "Failed to start analysis",
        description: msg,
        variant: "destructive",
      });
    }
  };

  // Block bulk analysis if: health check failed (null) OR Redis is not ok
  const redisBlocking = health === null || health.redis !== "ok";

  if (loading) {
    return (
      <div className="space-y-6 p-8">
        <div className="flex items-center justify-between">
          <Skeleton className="h-9 w-48" />
          <div className="space-x-2 flex">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-[280px] rounded-xl" />
        <Skeleton className="h-[280px] rounded-xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-8">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
          <h2 className="text-xl font-semibold">Failed to load SEO Dashboard</h2>
          <p className="text-muted-foreground max-w-md mx-auto">{error}</p>
          <div className="flex gap-4 justify-center">
            <Button onClick={() => fetchData()}>Try Again</Button>
            {(error.includes("401") || error.includes("auth") || error.includes("Session")) ? (
              <Button variant="outline" asChild>
                <Link href="/admin/login">Log In</Link>
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-8">
        <p className="text-muted-foreground">No SEO data yet</p>
        <Button className="mt-4" onClick={() => fetchData()}>
          Refresh
        </Button>
      </div>
    );
  }

  const {
    publishedPosts,
    publishedPostsBreakdown,
    analyzedPosts,
    averageScore,
    postsNeedingAttention,
    recentAnalyses,
    missingMetaTitle,
    missingMetaDescription,
  } = data;

  const progressBarComplete =
    analysisProgress != null &&
    analysisProgress.queued + analysisProgress.processing === 0;
  const analysisScopeActive = scope === "posts";
  const publishedPostCount = publishedPostsBreakdown.posts;

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">SEO Dashboard</h1>
          {lastRefreshed && (
            <p className="text-xs text-muted-foreground mt-1">
              Last updated: {lastRefreshed.toLocaleTimeString()}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/seo/keywords">Keyword Log</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/seo/ai-generate">✨ AI Fill Missing</Link>
          </Button>
          <Button
            variant="secondary"
            onClick={() => setConfirmOpen(true)}
            disabled={
              isAnalyzing ||
              !data ||
              publishedPostCount === 0 ||
              !!redisBlocking ||
              !analysisScopeActive
            }
            title={
              !analysisScopeActive
                ? "Bulk analysis is available in Posts scope only"
                : redisBlocking
                ? "Queue unavailable — Redis is not connected"
                : undefined
            }
          >
            {isAnalyzing ? "Analysis running..." : "Run Full Analysis"}
          </Button>
          <Button onClick={() => { fetchData(); fetchHealth(); }}>
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Scope toggle */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Scope:</span>
        {(["posts", "pages", "all"] as ContentScope[]).map((s) => (
          <Button
            key={s}
            size="sm"
            variant={scope === s ? "default" : "outline"}
            onClick={() => {
              setScope(s);
              fetchData(s);
            }}
            disabled={loading}
          >
            {SCOPE_LABELS[s]}
          </Button>
        ))}
      </div>

      {/* Scope notice */}
      <div className="flex items-start gap-2 rounded-md border bg-muted/40 px-4 py-2.5 text-sm text-muted-foreground">
        <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
        <span>
          {scope === "posts" && <>Showing <strong>published posts</strong> only. Use the scope toggle above to include pages.</>}
          {scope === "pages" && <>Showing <strong>published pages</strong> only. This view is metadata-only. Switch to <strong>Posts</strong> for detailed analysis and bulk runs.</>}
          {scope === "all" && <>Showing <strong>all published content</strong> (posts + pages). This combined view is metadata-only. Switch to <strong>Posts</strong> for detailed analysis and bulk runs.</>}
        </span>
      </div>

      {/* System Health Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Wifi className="h-4 w-4 text-muted-foreground" />
            System Health
          </CardTitle>
        </CardHeader>
        <CardContent>
          {healthLoading ? (
            <div className="flex flex-wrap gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} className="h-5 w-28" />)}
            </div>
          ) : health ? (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
                <span>
                  <HealthDot status={health.redis} />
                  Redis:{" "}
                  <span className="font-medium capitalize">{health.redis.replace("_", " ")}</span>
                </span>
                <span>
                  <HealthDot status={health.worker} />
                  Worker:{" "}
                  <span className="font-medium capitalize">{health.worker}</span>
                  {health.worker === "running" && health.workerLastSeenSecs !== null && (
                    <span className="ml-1 text-muted-foreground font-normal">
                      (heartbeat {health.workerLastSeenSecs}s ago)
                    </span>
                  )}
                  {health.worker === "stopped" && health.workerLastSeenSecs !== null && (
                    <span className="ml-1 text-muted-foreground font-normal">
                      (last seen {health.workerLastSeenSecs}s ago)
                    </span>
                  )}
                </span>
                <span>
                  <HealthDot status={health.pageSpeed} />
                  PageSpeed API:{" "}
                  <span className="font-medium capitalize">{health.pageSpeed}</span>
                  {health.pageSpeed === "error" && (
                    <span className="ml-1 text-xs text-destructive">(key invalid or unreachable)</span>
                  )}
                </span>
                <span>
                  <HealthDot status={health.openRouter} />
                  OpenRouter:{" "}
                  <span className="font-medium capitalize">{health.openRouter}</span>
                  {health.openRouter === "error" && (
                    <span className="ml-1 text-xs text-destructive">(key invalid or unreachable)</span>
                  )}
                </span>
              </div>
              {health.redis === "ok" && (
                <div className="flex flex-wrap gap-x-8 gap-y-1 text-sm text-muted-foreground border-t pt-2">
                  <span>
                    Queue depth:{" "}
                    <span className={cn("font-medium", health.queueDepth !== null && health.queueDepth > 50 ? "text-amber-600" : "")}>
                      {health.queueDepth ?? "—"}
                    </span>
                  </span>
                  {health.oldestWaitingJobAgeSecs !== null && (
                    <span>
                      Oldest waiting:{" "}
                      <span className={cn("font-medium", health.oldestWaitingJobAgeSecs > 300 ? "text-amber-600" : "")}>
                        {health.oldestWaitingJobAgeSecs}s
                      </span>
                      {health.oldestWaitingJobAgeSecs > 300 && (
                        <span className="ml-1 text-amber-600">(stalled?)</span>
                      )}
                    </span>
                  )}
                  {health.failedCount !== null && health.failedCount > 0 && (
                    <span>
                      Failed jobs in queue:{" "}
                      <span className="font-medium text-destructive">{health.failedCount}</span>
                    </span>
                  )}
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-destructive">
              Health check failed — queue status unknown. Bulk analysis is disabled.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Queue unavailable / health unknown warning */}
      {redisBlocking && (
        <div className="flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-700 p-4 text-sm text-amber-800 dark:text-amber-300">
          <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
          <span>
            {health === null ? (
              <>
                <strong>Health check unavailable.</strong> Queue status cannot be confirmed. Bulk analysis is disabled until system health is verified.
              </>
            ) : (
              <>
                <strong>Queue unavailable.</strong> Bulk analysis is disabled until Redis is connected.
                Redis status: <strong>{health.redis.replace("_", " ")}</strong>.
              </>
            )}
          </span>
        </div>
      )}

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Run Full Analysis?</AlertDialogTitle>
            <AlertDialogDescription>
              This will queue SEO analysis for all {publishedPostCount} published posts.
              Pages and other content types are not included.
              The job runs in the background and may take several minutes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isAnalyzing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmRunAnalysis}
              disabled={isAnalyzing}
            >
              Run Analysis
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Analysis progress */}
      {analysisProgress ? (
        <div className="space-y-3">
          <div className="text-sm text-muted-foreground">
            Analyzing posts... {analysisProgress.thisRunCompleted} /{" "}
            {analysisProgress.totalTarget} done
            {analysisProgress.failed > 0 && (
              <span className="ml-3 text-destructive font-medium">
                {analysisProgress.failed} failed
              </span>
            )}
          </div>
          <Progress
            className={cn(
              progressBarComplete &&
                "[&>div]:bg-green-600 dark:[&>div]:bg-green-500"
            )}
            value={Math.min(
              100,
              analysisProgress.totalTarget > 0
                ? Math.round(
                    (analysisProgress.thisRunCompleted /
                      analysisProgress.totalTarget) *
                      100
                  )
                : 0
            )}
          />
        </div>
      ) : null}

      {/* Analysis complete summary */}
      {analysisComplete && analysisSummary ? (
        <div className="rounded-lg border border-green-300 bg-green-50 dark:bg-green-950/30 dark:border-green-700 p-4 text-sm">
          <p className="font-semibold text-green-700 dark:text-green-400">Analysis complete</p>
          <p className="text-green-600 dark:text-green-500 mt-1">
            ✓ {analysisSummary.analyzed} posts analyzed
            {analysisSummary.failed > 0 && (
              <span className="ml-3 text-destructive">✗ {analysisSummary.failed} failed</span>
            )}
          </p>
        </div>
      ) : analysisComplete ? (
        <p className="text-sm font-semibold text-green-600 dark:text-green-500">
          Analysis complete!
        </p>
      ) : null}

      {/* Summary cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published {SCOPE_LABELS[scope]}</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{publishedPosts}</div>
            <p className="text-xs text-muted-foreground mt-2">
              {scope === "all"
                ? `${publishedPostsBreakdown.posts} posts + ${publishedPostsBreakdown.pages} pages in the CMS`
                : `Published ${SCOPE_LABELS[scope].toLowerCase()} in the CMS`}
            </p>
          </CardContent>
        </Card>

        {analysisScopeActive ? (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Posts Analyzed</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{analyzedPosts}</div>
                <p className="text-xs text-muted-foreground mt-2">
                  Posts with at least one SEO analysis record
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average SEO Score</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {averageScore}
                  <span className="text-lg font-normal text-muted-foreground"> / 100</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Mean score across all post analysis records
                </p>
              </CardContent>
            </Card>
          </>
        ) : null}

        <Card
          className={cn(
            missingMetaTitle > 0 &&
              "border-destructive/40 bg-destructive/[0.06] dark:bg-destructive/10"
          )}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Missing Effective Meta Title</CardTitle>
            <FileWarning
              className={cn(
                "h-4 w-4",
                missingMetaTitle > 0 ? "text-destructive" : "text-muted-foreground"
              )}
            />
          </CardHeader>
          <CardContent>
            <div
              className={cn(
                "text-2xl font-bold",
                missingMetaTitle > 0 && "text-destructive"
              )}
            >
              {missingMetaTitle}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {scope === "posts"
                ? "Published posts without an effective title tag"
                : scope === "pages"
                ? "Published pages without an effective SEO title"
                : "Published posts + pages without an effective title tag"}
            </p>
          </CardContent>
        </Card>

        <Card
          className={cn(
            missingMetaDescription > 0 &&
              "border-destructive/40 bg-destructive/[0.06] dark:bg-destructive/10"
          )}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Missing Effective Meta Description</CardTitle>
            <FileWarning
              className={cn(
                "h-4 w-4",
                missingMetaDescription > 0 ? "text-destructive" : "text-muted-foreground"
              )}
            />
          </CardHeader>
          <CardContent>
            <div
              className={cn(
                "text-2xl font-bold",
                missingMetaDescription > 0 && "text-destructive"
              )}
            >
              {missingMetaDescription}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {scope === "posts"
                ? "Published posts without an effective meta description"
                : scope === "pages"
                ? "Published pages without an effective meta description"
                : "Published posts + pages without an effective meta description"}
            </p>
          </CardContent>
        </Card>
      </div>

      {analysisScopeActive ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Needs Attention</CardTitle>
              <CardDescription>
                Posts with SEO scores below 50 (worst first).
              </CardDescription>
            </CardHeader>
            <CardContent>
              {postsNeedingAttention.length === 0 ? (
                <p className="text-sm font-medium text-green-600 dark:text-green-500 py-4 text-center">
                  All posts are above the score threshold
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Post Title</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Last Analyzed</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {postsNeedingAttention.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell className="font-medium max-w-[280px] truncate" title={post.title}>
                          {post.title}
                        </TableCell>
                        <TableCell>
                          <ScoreBadge score={post.score} />
                        </TableCell>
                        <TableCell className="text-muted-foreground whitespace-nowrap">
                          {formatAnalyzedAt(post.analyzedAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/posts/${post.id}/edit`}>Edit</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Analyses</CardTitle>
              <CardDescription>
                Latest SEO analysis runs (newest first).
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentAnalyses.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No analyses run yet — click Run Full Analysis to start
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Post Title</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Date Analyzed</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentAnalyses.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="font-medium max-w-[320px] truncate" title={row.postTitle}>
                          {row.postTitle}
                        </TableCell>
                        <TableCell>
                          <ScoreBadge score={row.score} />
                        </TableCell>
                        <TableCell className="text-muted-foreground whitespace-nowrap">
                          {formatAnalyzedAt(row.analyzedAt)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Post Analysis</CardTitle>
            <CardDescription>
              Detailed SEO scoring, attention queues, and recent analysis history are currently available for posts only.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Use the <strong>Posts</strong> scope to review analyzed content and run bulk analysis. The current scope shows metadata coverage only.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
