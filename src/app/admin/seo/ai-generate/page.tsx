"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { apiClient } from "@/lib/api/client";
import { postsService } from "@/lib/api/posts.service";
import { usePages } from "@/lib/hooks/usePages";
import type { Block } from "@/lib/store/useEditorStore";
import {
  blocksToPlainText,
  stripHtmlToText,
} from "@/lib/utils/blocksToPlainText";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

type RowKind = "post" | "page";

type TableRow = {
  kind: RowKind;
  id: string;
  title: string;
  missing: string;
};

function extractContentFromBlocksData(blocksData: unknown): string {
  if (blocksData == null) return "";
  try {
    const parsed =
      typeof blocksData === "string" ? JSON.parse(blocksData) : blocksData;
    const arr = Array.isArray(parsed)
      ? parsed
      : (parsed as { blocks?: unknown })?.blocks;
    if (Array.isArray(arr)) {
      return blocksToPlainText(arr as Block[]);
    }
  } catch {
    /* ignore */
  }
  return "";
}

function postContentForAi(post: Record<string, unknown>): string {
  const fromBlocks = extractContentFromBlocksData(post.blocksData);
  if (fromBlocks.trim()) return fromBlocks;
  return stripHtmlToText(String(post.content ?? ""));
}

function pageContentForAi(doc: Record<string, unknown>): string {
  return extractContentFromBlocksData(doc.blocksData);
}

export default function AiMetaGeneratorPage() {
  const { toast } = useToast();
  const [tab, setTab] = useState<"posts" | "pages">("posts");
  const [skipped, setSkipped] = useState<Set<string>>(() => new Set());
  const [generated, setGenerated] = useState<
    Record<string, { title: string; desc: string }>
  >({});
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [bulkProgress, setBulkProgress] = useState<{
    current: number;
    total: number;
  } | null>(null);

  const postsQuery = useQuery({
    queryKey: ["ai-meta-generator", "posts"],
    queryFn: async () => {
      const res = await postsService.getPosts({
        page: 1,
        limit: 500,
        status: "published",
      });
      if (!res.success) {
        throw new Error(res.message || "Failed to load posts");
      }
      return res.data.posts;
    },
  });

  const pagesQuery = usePages({ page: 1, limit: 500, status: "PUBLISHED" });

  const postRows: TableRow[] = useMemo(() => {
    const posts = postsQuery.data;
    if (!posts) return [];
    const out: TableRow[] = [];
    for (const p of posts) {
      const rec = p as Record<string, unknown>;
      const id = String(rec.id ?? "");
      const key = `post-${id}`;
      if (skipped.has(key)) continue;
      const mt = String(rec.metaTitle ?? "").trim();
      const md = String(rec.metaDescription ?? "").trim();
      if (mt && md) continue;
      const missing: string[] = [];
      if (!mt) missing.push("Meta title");
      if (!md) missing.push("Meta description");
      out.push({
        kind: "post",
        id,
        title: String(rec.title ?? ""),
        missing: missing.join(", "),
      });
    }
    return out;
  }, [postsQuery.data, skipped]);

  const pageRows: TableRow[] = useMemo(() => {
    const pages = pagesQuery.data?.pages;
    if (!pages) return [];
    const out: TableRow[] = [];
    for (const p of pages) {
      const rec = p as Record<string, unknown>;
      const id = String(rec.id ?? "");
      const key = `page-${id}`;
      if (skipped.has(key)) continue;
      const st = String(rec.seoTitle ?? "").trim();
      const md = String(rec.metaDescription ?? "").trim();
      if (st && md) continue;
      const missing: string[] = [];
      if (!st) missing.push("SEO title");
      if (!md) missing.push("Meta description");
      out.push({
        kind: "page",
        id,
        title: String(rec.title ?? ""),
        missing: missing.join(", "),
      });
    }
    return out;
  }, [pagesQuery.data?.pages, skipped]);

  const genKey = (kind: RowKind, id: string) =>
    kind === "post" ? `post-${id}` : `page-${id}`;

  const callBothApis = useCallback(
    async (kind: RowKind, id: string, title: string, content: string) => {
      const body = {
        postId: kind === "post" ? id : undefined,
        pageId: kind === "page" ? id : undefined,
        title,
        content,
      };
      const [titleRes, descRes] = await Promise.all([
        apiClient.post<{
          success?: boolean;
          data?: { title?: string };
          message?: string;
        }>("/ai-seo/generate/seo-title", body),
        apiClient.post<{
          success?: boolean;
          data?: { metaDescription?: string };
          message?: string;
        }>("/ai-seo/generate/meta-description", body),
      ]);
      const tData = titleRes.data;
      const dData = descRes.data;
      if (tData?.success === false) {
        throw new Error(tData.message || "SEO title generation failed");
      }
      if (dData?.success === false) {
        throw new Error(dData.message || "Meta description generation failed");
      }
      const gt = tData?.data?.title?.trim() ?? "";
      const gd = dData?.data?.metaDescription?.trim() ?? "";
      if (!gt || !gd) {
        throw new Error("Incomplete AI response");
      }
      return { title: gt, desc: gd };
    },
    []
  );

  const handleGenerateOne = async (
    row: TableRow,
    options?: { quiet?: boolean }
  ) => {
    const key = genKey(row.kind, row.id);
    setLoadingId(key);
    try {
      if (row.kind === "post") {
        const res = await postsService.getPost(row.id);
        if (!res.success || !res.data) {
          throw new Error(res.message || "Could not load post");
        }
        const post = res.data as unknown as Record<string, unknown>;
        const content = postContentForAi(post);
        const title = String(post.title ?? row.title);
        const pair = await callBothApis("post", row.id, title, content);
        setGenerated((g) => ({ ...g, [key]: pair }));
      } else {
        const { data } = await apiClient.get<Record<string, unknown>>(
          `/pages/${row.id}`,
          { params: { depth: 2 } }
        );
        const doc =
          data && typeof data === "object" && "doc" in data
            ? (data as { doc: Record<string, unknown> }).doc
            : (data as Record<string, unknown>);
        const content = pageContentForAi(doc);
        const title = String(doc.title ?? row.title);
        const pair = await callBothApis("page", row.id, title, content);
        setGenerated((g) => ({ ...g, [key]: pair }));
      }
      if (!options?.quiet) {
        toast({ title: "Generated", description: row.title });
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Generation failed";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setLoadingId(null);
    }
  };

  const handleSave = async (row: TableRow) => {
    const key = genKey(row.kind, row.id);
    const g = generated[key];
    if (!g) return;
    setSavingId(key);
    try {
      if (row.kind === "post") {
        const existing = await postsService.getPost(row.id);
        if (!existing.success || !existing.data) {
          throw new Error(existing.message || "Could not load post");
        }
        const doc = existing.data as unknown as Record<string, unknown>;
        const prevMeta = (doc.meta as Record<string, unknown>) || {};
        await apiClient.patch(`/posts/${row.id}`, {
          meta: {
            ...prevMeta,
            title: g.title,
            description: g.desc,
          },
        });
      } else {
        await apiClient.patch(`/pages/${row.id}`, {
          seoTitle: g.title,
          metaDescription: g.desc,
        });
      }
      toast({ title: "Saved", description: row.title });
      setSkipped((s) => new Set([...Array.from(s), key]));
      setGenerated((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Save failed";
      toast({ title: "Error", description: msg, variant: "destructive" });
    } finally {
      setSavingId(null);
    }
  };

  const handleSkip = (row: TableRow) => {
    const key = genKey(row.kind, row.id);
    setSkipped((s) => new Set([...Array.from(s), key]));
    setGenerated((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const handleGenerateAll = async (rows: TableRow[]) => {
    if (rows.length === 0) return;
    setBulkProgress({ current: 0, total: rows.length });
    try {
      for (let i = 0; i < rows.length; i++) {
        setBulkProgress({ current: i + 1, total: rows.length });
        await handleGenerateOne(rows[i], { quiet: true });
        await delay(100);
      }
      toast({
        title: "Batch complete",
        description: `Processed ${rows.length} item(s).`,
      });
    } finally {
      setBulkProgress(null);
    }
  };

  const renderTable = (rows: TableRow[]) => (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="secondary"
          disabled={
            rows.length === 0 || !!bulkProgress || loadingId !== null
          }
          onClick={() => void handleGenerateAll(rows)}
        >
          Generate All
        </Button>
        {bulkProgress && (
          <span className="text-sm text-muted-foreground">
            Processing {bulkProgress.current}/{bulkProgress.total}…
          </span>
        )}
      </div>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Missing fields</TableHead>
              <TableHead>Generated title</TableHead>
              <TableHead>Generated description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-muted-foreground">
                  No items missing meta title or description.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => {
                const key = genKey(row.kind, row.id);
                const g = generated[key];
                const isLoading = loadingId === key;
                const isSaving = savingId === key;
                return (
                  <TableRow key={key}>
                    <TableCell className="font-medium max-w-[200px] truncate">
                      {row.title}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                      {row.missing}
                    </TableCell>
                    <TableCell className="max-w-[220px] text-sm">
                      {g?.title ?? "—"}
                    </TableCell>
                    <TableCell className="max-w-[280px] text-sm">
                      <span className="line-clamp-3">{g?.desc ?? "—"}</span>
                    </TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      <div className="flex flex-wrap justify-end gap-1">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          disabled={isLoading || !!bulkProgress}
                          onClick={() => void handleGenerateOne(row)}
                        >
                          {isLoading ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            "Generate"
                          )}
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          disabled={!g || isSaving}
                          onClick={() => void handleSave(row)}
                        >
                          {isSaving ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            "Save"
                          )}
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => handleSkip(row)}
                        >
                          Skip
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 p-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/seo" aria-label="Back to SEO">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              AI Meta Generator
            </h1>
            <p className="text-sm text-muted-foreground">
              Generate SEO titles and meta descriptions; review before saving.
            </p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
        <CardTitle>Missing custom meta data</CardTitle>
        <CardDescription>
            Published posts and pages that lack a saved custom meta title, SEO
            title, or custom meta description.
        </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={tab}
            onValueChange={(v) => setTab(v as "posts" | "pages")}
          >
            <TabsList>
              <TabsTrigger value="posts">Posts</TabsTrigger>
              <TabsTrigger value="pages">Pages</TabsTrigger>
            </TabsList>
            <TabsContent value="posts" className="mt-6">
              {postsQuery.isLoading ? (
                <p className="text-sm text-muted-foreground">Loading posts…</p>
              ) : postsQuery.isError ? (
                <p className="text-sm text-destructive">
                  {postsQuery.error instanceof Error
                    ? postsQuery.error.message
                    : "Failed to load posts"}
                </p>
              ) : (
                renderTable(postRows)
              )}
            </TabsContent>
            <TabsContent value="pages" className="mt-6">
              {pagesQuery.isLoading ? (
                <p className="text-sm text-muted-foreground">Loading pages…</p>
              ) : pagesQuery.isError ? (
                <p className="text-sm text-destructive">Failed to load pages</p>
              ) : (
                renderTable(pageRows)
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
