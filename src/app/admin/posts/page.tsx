"use client";

import { usePosts, useDeletePost, usePublishPost, useUnpublishPost } from "@/lib/hooks/usePosts";
import Image from "next/image";
import { DataTable } from "@/components/admin/shared/DataTable";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import { StatusBadge } from "@/components/admin/shared/StatusBadge";
import { ConfirmDialog } from "@/components/admin/shared/ConfirmDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, MoreHorizontal, Pencil, Trash, Eye, Globe, FileX, AlertCircle, RefreshCw } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { useToast } from "@/components/ui/use-toast";

interface PostRow {
  id: number;
  title: string;
  slug: string;
  status: string;
  featuredImage?: string;
  author?: { name?: string; email?: string };
  createdAt?: string;
}

export default function PostsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [status, setStatus] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [pendingId, setPendingId] = useState<number | null>(null);

  const { data, isLoading, error, refetch } = usePosts({
    search: debouncedSearch,
    status: status === "ALL" ? undefined : status,
    page,
    limit: 10,
  });

  const deletePostMutation = useDeletePost();
  const publishMutation = usePublishPost();
  const unpublishMutation = useUnpublishPost();

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deletePostMutation.mutateAsync(deleteId);
      setDeleteId(null);
      toast({ title: "Post deleted" });
    } catch (err: unknown) {
      toast({
        title: "Failed to delete post",
        description: (err instanceof Error ? err.message : null) || "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePublish = async (id: number, title: string) => {
    setPendingId(id);
    try {
      await publishMutation.mutateAsync(id);
      toast({ title: "Published", description: `"${title}" is now live.` });
    } catch {
      toast({ title: "Failed to publish", variant: "destructive" });
    } finally {
      setPendingId(null);
    }
  };

  const handleUnpublish = async (id: number, title: string) => {
    setPendingId(id);
    try {
      await unpublishMutation.mutateAsync(id);
      toast({ title: "Unpublished", description: `"${title}" moved to draft.` });
    } catch {
      toast({ title: "Failed to unpublish", variant: "destructive" });
    } finally {
      setPendingId(null);
    }
  };

  const columns = [
    {
      header: "Title",
      className: "w-[45%]",
      cell: (post: PostRow) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded bg-slate-100 flex-shrink-0 overflow-hidden relative">
            {post.featuredImage ? (
              <Image src={post.featuredImage} alt="" fill className="object-cover" sizes="40px" />
            ) : (
              <div className="h-full w-full bg-slate-200" />
            )}
          </div>
          <div className="min-w-0">
            <p className="font-medium truncate max-w-[280px]">{post.title}</p>
            <p className="text-xs text-muted-foreground truncate max-w-[280px]">/{post.slug}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Status",
      cell: (post: PostRow) => <StatusBadge status={post.status} />,
    },
    {
      header: "Author",
      cell: (post: PostRow) => (
        <span className="text-sm text-muted-foreground">
          {post.author?.name || "—"}
        </span>
      ),
    },
    {
      header: "Date",
      cell: (post: PostRow) => (
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {post.createdAt ? format(new Date(post.createdAt), "MMM d, yyyy") : "—"}
        </span>
      ),
    },
    {
      header: "",
      className: "w-[50px]",
      cell: (post: PostRow) => {
        const isPublished = post.status === "PUBLISHED";
        const isThisRowPending = pendingId === post.id;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0" disabled={isThisRowPending}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => router.push(`/admin/posts/${post.id}/edit`)}>
                <Pencil className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  const isDraft = post.status !== "PUBLISHED";
                  window.open(`/blog/${post.slug}${isDraft ? "?draft=1" : ""}`, "_blank");
                }}
              >
                <Eye className="mr-2 h-4 w-4" /> Preview
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {isPublished ? (
                <DropdownMenuItem onClick={() => handleUnpublish(post.id, post.title)}>
                  <FileX className="mr-2 h-4 w-4" /> Unpublish
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem onClick={() => handlePublish(post.id, post.title)}>
                  <Globe className="mr-2 h-4 w-4 text-green-600" />
                  <span className="text-green-600">Publish</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => setDeleteId(post.id)}
              >
                <Trash className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Posts"
        subtitle={`${data?.pagination?.total ?? 0} posts total`}
        actions={
          <Button asChild>
            <Link href="/admin/posts/new">
              <Plus className="mr-2 h-4 w-4" /> New Post
            </Link>
          </Button>
        }
      />

      <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-lg border shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title or slug..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Status</SelectItem>
            <SelectItem value="PUBLISHED">Published</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error && (
        <div className="flex items-center justify-between rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{(error instanceof Error ? error.message : null) || "Failed to load posts."}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => refetch()}
          >
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Retry
          </Button>
        </div>
      )}

      <DataTable
        columns={columns}
        data={(data?.posts || []) as PostRow[]}
        isLoading={isLoading}
        pagination={{
          page,
          limit: 10,
          total: data?.pagination?.total || 0,
          pages: data?.pagination?.pages || 1,
        }}
        onPageChange={setPage}
        emptyTitle="No posts found"
        emptyDescription={
          search || status !== "ALL"
            ? "No posts match your current filters."
            : "Get started by creating your first blog post."
        }
        emptyAction={
          !search && status === "ALL" ? (
            <Button asChild variant="outline">
              <Link href="/admin/posts/new">Create Post</Link>
            </Button>
          ) : undefined
        }
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Post"
        description="Are you sure you want to delete this post? This cannot be undone."
        onConfirm={handleDelete}
        isLoading={deletePostMutation.isPending}
        variant="destructive"
        confirmText="Delete"
      />
    </div>
  );
}
