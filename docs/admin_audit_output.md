# Admin Panel Audit

## Specific Files requested:
### src/app/admin/page.tsx
```
"use client";

import { usePosts } from "@/lib/hooks/usePosts";
import React, { useMemo } from "react";
import { useProducts } from "@/lib/hooks/useProducts";
import { useGetSubmissions } from "@/lib/hooks/useForms";
import { useGetAnalytics } from "@/lib/hooks/useAnalytics";
import { useLeads } from "@/lib/hooks/useLeads";
import { StatsCard } from "@/components/admin/shared/StatsCard";
import { StatusBadge } from "@/components/admin/shared/StatusBadge";
import { 
  FileText, 
  ShoppingBag, 
  MessageSquare, 
  Users,
  Plus,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { PageHeader } from "@/components/admin/shared/PageHeader";

export default function DashboardPage() {
  // Fetch real data using hooks
  const { data: postsData } = usePosts({ limit: 5 });
  const { data: productsData } = useProducts({ limit: 1 });
  const { data: submissionsData } = useGetSubmissions({ limit: 5 });
  const { data: leadsData } = useLeads({ limit: 1 });
  // Analytics hook might need adjustment based on actual implementation, using placeholder for now if it fails
  // Fix infinite refetch loop by memoizing the date range
  const defaultDateRange = useMemo(() => {
    const from = new Date();
    from.setDate(from.getDate() - 30);
    return { from, to: new Date() };
  }, []);
  useGetAnalytics(defaultDateRange);

  const stats = [
    {
      title: "Total Posts",
      value: postsData?.pagination?.total ?? 0,
      icon: FileText,
      description: "—",
    },
    {
      title: "Total Products",
      value: productsData?.meta?.total ?? 0,
      icon: ShoppingBag,
      description: "—",
    },
    {
      title: "Form Submissions",
      value: submissionsData?.meta?.total ?? 0,
      icon: MessageSquare,
      description: "—",
    },
    {
      title: "Active Leads",
      value: Number(leadsData?.meta?.total ?? 0),
      icon: Users,
      description: "—",
    },
  ];

  if (!postsData && !productsData && !submissionsData) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-slate-200 rounded animate-pulse" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-white rounded-xl border shadow-sm animate-pulse" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <div className="col-span-4 h-[400px] bg-white rounded-xl border shadow-sm animate-pulse" />
          <div className="col-span-3 h-[400px] bg-white rounded-xl border shadow-sm animate-pulse" />
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
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Form Submissions (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <p className="text-sm text-muted-foreground py-12 text-center">
              No time-series data available — connect analytics to chart submissions over time.
            </p>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Lead Score Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground py-12 text-center">
              No lead scoring data yet — this will show real distribution when connected.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Posts</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/posts" className="text-xs">View All <ArrowRight className="ml-1 h-3 w-3" /></Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {postsData?.posts?.map((post: any) => (
                <div key={post.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded bg-slate-100 flex items-center justify-center overflow-hidden">
                      {post.featuredImage ? (
                        <img src={post.featuredImage} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <FileText className="h-5 w-5 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm line-clamp-1">{post.title}</p>
                      <p className="text-xs text-muted-foreground">{format(new Date(post.createdAt), 'MMM d, yyyy')}</p>
                    </div>
                  </div>
                  <StatusBadge status={post.status} />
                </div>
              ))}
              {!postsData?.posts?.length && (
                <p className="text-sm text-muted-foreground text-center py-4">No posts found.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Submissions</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/admin/forms" className="text-xs">View All <ArrowRight className="ml-1 h-3 w-3" /></Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {submissionsData?.submissions?.map((sub: any) => {
                // Parse data safely
                const formData = typeof sub.data === 'string' ? JSON.parse(sub.data) : sub.data || {};
                return (
                  <div key={sub.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-semibold">
                        {(formData.name?.[0] || 'U').toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{formData.name || 'Unknown'}</p>
                        <p className="text-xs text-muted-foreground">{formData.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                       <span className="text-xs text-muted-foreground block">
                         {format(new Date(sub.createdAt), 'MMM d')}
                       </span>
                    </div>
                  </div>
                );
              })}
              {!submissionsData?.submissions?.length && (
                <p className="text-sm text-muted-foreground text-center py-4">No submissions yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

### src/app/admin/posts/page.tsx
```
"use client";

import { usePosts, useDeletePost } from "@/lib/hooks/usePosts";
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
import { Plus, Search, MoreHorizontal, Pencil, Trash, Eye } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/lib/hooks/useDebounce"; // Ensure this hook exists or implement it inline if not

export default function PostsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300); // Simple debounce
  const [status, setStatus] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data, isLoading, refetch } = usePosts({
    search: debouncedSearch,
    status: status === "ALL" ? undefined : status,
    page,
    limit: 10,
  });

  const deletePostMutation = useDeletePost();

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status]);

  const handleDelete = async () => {
    if (deleteId) {
      await deletePostMutation.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  const columns = [
    {
      header: "Title",
      className: "w-[40%]",
      cell: (post: any) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded bg-slate-100 flex-shrink-0 overflow-hidden">
            {post.featuredImage ? (
              <img src={post.featuredImage} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full bg-slate-200" />
            )}
          </div>
          <div>
            <p className="font-medium line-clamp-1">{post.title}</p>
            <p className="text-xs text-muted-foreground truncate max-w-[200px]">/{post.slug}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Status",
      cell: (post: any) => <StatusBadge status={post.status} />,
    },
    {
      header: "Author",
      cell: (post: any) => post.author?.name || "Unknown",
    },
    {
      header: "Date",
      cell: (post: any) => (
        <span className="text-sm text-muted-foreground">
          {format(new Date(post.createdAt), "MMM d, yyyy")}
        </span>
      ),
    },
    {
      header: "Actions",
      className: "w-[50px]",
      cell: (post: any) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push(`/admin/posts/${post.id}/edit`)}>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => window.open(`/blog/${post.slug}`, '_blank')}>
              <Eye className="mr-2 h-4 w-4" /> View
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => setDeleteId(post.id)}
            >
              <Trash className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Posts"
        subtitle="Manage your blog posts and articles."
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
            placeholder="Search posts..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="PUBLISHED">Published</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="ARCHIVED">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data?.posts || []}
        isLoading={isLoading}
        pagination={{
          page,
          limit: 10,
          // Backend returns: { posts, pagination: { total, pages, ... } }
          total: data?.pagination?.total || 0,
          pages: data?.pagination?.pages || 1,
        }}
        onPageChange={setPage}
        emptyTitle="No posts found"
        emptyDescription="Get started by creating your first blog post."
        emptyAction={
          <Button asChild variant="outline">
            <Link href="/admin/posts/new">Create Post</Link>
          </Button>
        }
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Post"
        description="Are you sure you want to delete this post? This action cannot be undone."
        onConfirm={handleDelete}
        isLoading={deletePostMutation.isPending}
        variant="destructive"
        confirmText="Delete"
      />
    </div>
  );
}
```

### src/app/admin/pages/page.tsx
```
"use client";

import { usePages, useDeletePage } from "@/lib/hooks/usePages";
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
import { Plus, Search, MoreHorizontal, Pencil, Trash, Eye, Globe } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/lib/hooks/useDebounce";

export default function PagesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [status, setStatus] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data, isLoading, refetch, isError, error, isFetching } = usePages({
    search: debouncedSearch,
    status: status === "ALL" ? undefined : status,
    page,
    limit: 10,
  });

  const deletePageMutation = useDeletePage();

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status]);

  const handleDelete = async () => {
    if (deleteId) {
      await deletePageMutation.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  const columns = [
    {
      header: "Page Title",
      className: "w-[40%]",
      cell: (pageObj: any) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded bg-slate-100 flex-shrink-0 border flex items-center justify-center overflow-hidden">
            {pageObj.featuredImage ? (
              <img src={pageObj.featuredImage} alt="" className="h-full w-full object-cover" />
            ) : (
              <Globe className="h-5 w-5 text-gray-400" />
            )}
          </div>
          <div>
            <p className="font-medium line-clamp-1">{pageObj.title}</p>
            <p className="text-xs text-muted-foreground truncate max-w-[200px]">/{pageObj.slug}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Status",
      cell: (pageObj: any) => <StatusBadge status={pageObj.status} />,
    },
    {
      header: "SEO Health",
      cell: (pageObj: any) => (
        <div className="flex gap-1">
           {pageObj.seoTitle ? <span className="w-2 h-2 rounded-full bg-green-500" title="SEO Title Optimized"></span> : <span className="w-2 h-2 rounded-full bg-red-400" title="Missing SEO Title"></span> }
           {pageObj.metaDescription ? <span className="w-2 h-2 rounded-full bg-green-500" title="Meta Description Present"></span> : <span className="w-2 h-2 rounded-full bg-red-400" title="Missing Meta Description"></span> }
           {!pageObj.isIndexable ? <span className="w-2 h-2 bg-yellow-500 rounded-sm" title="No-Index Active"></span> : null}
        </div>
      ),
    },
    {
      header: "Date",
      cell: (pageObj: any) => (
        <span className="text-sm text-muted-foreground">
          {format(new Date(pageObj.updatedAt), "MMM d, yyyy")}
        </span>
      ),
    },
    {
      header: "Actions",
      className: "w-[50px]",
      cell: (pageObj: any) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push(`/admin/pages/${pageObj.id}/edit`)}>
              <Pencil className="mr-2 h-4 w-4" /> Edit SEO & Content
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => window.open(`/${pageObj.slug}`, '_blank')}>
              <Eye className="mr-2 h-4 w-4" /> View Live Page
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => setDeleteId(pageObj.id)}
            >
              <Trash className="mr-2 h-4 w-4" /> Delete Page
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Pages & SEO"
        subtitle="Manage standalone site pages, layout settings, and search engine metadata."
        actions={
          <Button asChild>
            <Link href="/admin/pages/new">
              <Plus className="mr-2 h-4 w-4" /> Add New Page
            </Link>
          </Button>
        }
      />

      <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-lg border shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search pages by title or slug..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="PUBLISHED">Published</SelectItem>
              <SelectItem value="DRAFT">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isError && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm">
          <p className="font-medium text-destructive">Could not load pages</p>
          <p className="mt-1 text-destructive/90">
            {error instanceof Error ? error.message : "Request failed. Check that you are logged in and the API is reachable."}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            {isFetching ? "Retrying…" : (
              <button type="button" className="underline" onClick={() => refetch()}>
                Try again
              </button>
            )}
          </p>
        </div>
      )}

      <DataTable
        columns={columns}
        data={data?.pages || []}
        isLoading={isLoading}
        pagination={{
          page,
          limit: 10,
          total: data?.pagination?.total || 0,
          pages: data?.pagination?.pages || 1,
        }}
        onPageChange={setPage}
        emptyTitle="No entries in Pages (yet)"
        emptyDescription="This list only shows documents saved in the Pages collection in the database. Your public site pages (about-us, contact-us, city pages, products, etc.) are mostly rendered from code in the app—those URLs do not appear here unless you create a matching Page record for CMS editing or SEO overrides."
        emptyAction={
          <Button asChild variant="outline">
            <Link href="/admin/pages/new">Create Page</Link>
          </Button>
        }
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Page"
        description="Are you sure you want to delete this page? This will break any existing URLs routing to it."
        onConfirm={handleDelete}
        isLoading={deletePageMutation.isPending}
        variant="destructive"
        confirmText="Delete"
      />
    </div>
  );
}
```

### src/app/admin/media/page.tsx
```
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { mediaService } from "@/lib/api/media.service";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Upload, Trash, X, Copy, Image as ImageIcon, FileText } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { format } from "date-fns";
import { ConfirmDialog } from "@/components/admin/shared/ConfirmDialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info, ExternalLink } from "lucide-react";

const getOptimizedUrl = (url: string, width?: number) => {
  if (!url || !url.includes('cloudinary.com')) return url;
  
  // Add f_auto, q_auto and optional width
  const parts = url.split('/upload/');
  if (parts.length !== 2) return url;
  
  const transformations = ['f_auto', 'q_auto'];
  if (width) transformations.push(`w_${width},c_limit`);
  
  return `${parts[0]}/upload/${transformations.join(',')}/${parts[1]}`;
};

export default function MediaLibraryPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState<any | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [editData, setEditData] = useState({
    title: "",
    altText: "",
    caption: "",
    description: "",
  });
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [showUnusedOnly, setShowUnusedOnly] = useState(false);
  const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);
  const [usageData, setUsageData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("edit");

  // Fetch Media
  const { data, isLoading } = useQuery({
    queryKey: ["media", page, showUnusedOnly],
    queryFn: () => showUnusedOnly ? mediaService.getUnusedMedia() : mediaService.getMedia({ page, limit: 20 }),
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: mediaService.deleteMedia,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
      setSelectedImage(null);
      toast({ title: "File deleted" });
    },
    onError: () => toast({ title: "Delete failed", variant: "destructive" }),
  });

  // Bulk Delete Mutation
  const bulkDeleteMutation = useMutation({
    mutationFn: mediaService.deleteBulkMedia,
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
      setSelectedItems([]);
      setIsSelectionMode(false);
      toast({ title: `${res.data.deletedCount} items deleted` });
    },
    onError: () => toast({ title: "Bulk delete failed", variant: "destructive" }),
  });

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => mediaService.updateMedia(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media"] });
      toast({ title: "Media updated" });
    },
    onError: () => toast({ title: "Update failed", variant: "destructive" }),
  });

  const handleDelete = async () => {
    if (deleteId) {
      await deleteMutation.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  const handleUpdate = async () => {
    if (selectedImage) {
      await updateMutation.mutateAsync({ id: selectedImage.id, data: editData });
    }
  };

  const onSelectImage = async (item: any) => {
    setSelectedImage(item);
    setEditData({
      title: item.title || "",
      altText: item.altText || "",
      caption: item.caption || "",
      description: item.description || "",
    });
    setUsageData(null);
    setActiveTab("edit");
    
    // Fetch usage in background
    try {
      const usage = await mediaService.getMediaUsage(item.id);
      setUsageData(usage.data.usage);
    } catch (err) {
      console.error("Failed to fetch usage", err);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    let successCount = 0;
    
    // Upload files sequentially or in parallel
    for (let i = 0; i < files.length; i++) {
      try {
        const res = await mediaService.uploadFile(files[i]);
        if (res.success) {
          successCount++;
        } else {
          toast({
            title: `Upload failed: ${files[i].name}`,
            description: res.message || "Server rejected this file.",
            variant: "destructive",
          });
        }
      } catch (err) {
        const msg =
          err && typeof err === "object" && "message" in err
            ? String((err as { message: string }).message)
            : "Unexpected upload error";
        toast({
          title: `Upload failed: ${files[i].name}`,
          description: msg,
          variant: "destructive",
        });
      }
    }

    setIsUploading(false);
    queryClient.invalidateQueries({ queryKey: ["media"] });
    toast({
      title: successCount > 0 ? "Upload complete" : "Upload failed",
      description: `Successfully uploaded ${successCount} of ${files.length} files.`,
      variant: successCount > 0 ? "default" : "destructive",
    });
    
    // Reset input
    e.target.value = "";
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({ title: "URL copied to clipboard" });
  };

  const toggleSelection = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const startSelectionMode = () => {
    setIsSelectionMode(true);
  };

  const cancelSelection = () => {
    setIsSelectionMode(false);
    setSelectedItems([]);
  };

  const handleBulkDelete = async () => {
    await bulkDeleteMutation.mutateAsync(selectedItems);
    setIsBulkDeleteDialogOpen(false);
  };

  const mediaItems = Array.isArray(data?.data?.media) ? data.data.media : []; 
  const meta = data?.data?.meta || { total: 0, pages: 1 };
  const totalPages = Number(
    (meta as { pages?: unknown }).pages ?? 1
  ) || 1;

  // Adjust fetch to handle 'unused' if needed
  // (In a real app, I'd update the useQuery key to include showUnusedOnly)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Media Library"
        subtitle={showUnusedOnly ? "Showing unused media assets." : "Manage images and files."}
        actions={
          <div className="flex gap-2">
             <Button 
                variant={showUnusedOnly ? "secondary" : "outline"} 
                onClick={() => setShowUnusedOnly(!showUnusedOnly)}
             >
                <Info className="mr-2 h-4 w-4" /> 
                {showUnusedOnly ? "Show All" : "Audit Unused"}
             </Button>
             {isSelectionMode ? (
               <>
                 <span className="flex items-center text-sm font-medium mr-2">
                   {selectedItems.length} selected
                 </span>
                 <Button variant="outline" onClick={cancelSelection}>Cancel</Button>
                  <Button variant="destructive" disabled={selectedItems.length === 0 || bulkDeleteMutation.isPending} onClick={() => setIsBulkDeleteDialogOpen(true)}>
                   {bulkDeleteMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash className="mr-2 h-4 w-4" />}
                   Delete Selected
                 </Button>
               </>
             ) : (
               <Button variant="outline" onClick={startSelectionMode}>
                 Select Multiple
               </Button>
             )}
             <Input 
                type="file" 
                multiple 
                className="hidden" 
                id="media-upload"
                onChange={handleUpload}
                disabled={isUploading}
                accept="image/*"
             />
             <Button onClick={() => document.getElementById("media-upload")?.click()} disabled={isUploading}>
               {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
               Upload Files
             </Button>
          </div>
        }
      />

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : mediaItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-lg bg-slate-50">
          <ImageIcon className="h-12 w-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900">No media files yet</h3>
          <p className="text-slate-500 mb-6">Upload images to get started</p>
          <Button variant="outline" onClick={() => document.getElementById("media-upload")?.click()}>
            Upload Files
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {mediaItems.map((item: any) => (
              <Card 
                key={item.id} 
                className="overflow-hidden cursor-pointer group hover:ring-2 hover:ring-indigo-500 transition-all"
                onClick={() => onSelectImage(item)}
              >
                <div className="aspect-square bg-slate-100 relative">
                  {item.mimeType?.startsWith('image/') ? (
                    <img 
                      src={getOptimizedUrl(item.url, 400)} 
                      alt={item.filename} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileText className="h-10 w-10 text-slate-400" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  
                  {(isSelectionMode || selectedItems.includes(item.id)) && (
                    <div className="absolute top-2 left-2" onClick={e => e.stopPropagation()}>
                       <Checkbox 
                        checked={selectedItems.includes(item.id)} 
                        onCheckedChange={() => toggleSelection({ stopPropagation: () => {} } as any, item.id)}
                        className="bg-white border-slate-300"
                       />
                    </div>
                  )}
                </div>
                <div className="p-2">
                  <p className="text-xs font-medium truncate text-slate-700" title={item.filename}>
                    {item.filename}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    {format(new Date(item.createdAt), 'MMM d, yyyy')}
                  </p>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination (Simple Prev/Next) */}
          <div className="flex justify-between items-center pt-4">
             <p className="text-sm text-slate-500">
               Page {page} of {totalPages}
             </p>
             <div className="flex gap-2">
               <Button 
                 variant="outline" 
                 size="sm" 
                 onClick={() => setPage(p => Math.max(1, p - 1))}
                 disabled={page === 1}
               >
                 Previous
               </Button>
               <Button 
                 variant="outline" 
                 size="sm" 
                 onClick={() => setPage(p => p + 1)}
                 disabled={page >= totalPages}
               >
                 Next
               </Button>
             </div>
          </div>
        </>
      )}

      {/* Preview Modal */}
      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle className="truncate pr-8">{selectedImage?.filename}</DialogTitle>
          </DialogHeader>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="bg-slate-100 rounded-lg flex items-center justify-center p-4 min-h-[350px]">
                {selectedImage?.mimeType?.startsWith('image/') ? (
                   <img 
                    src={getOptimizedUrl(selectedImage?.url, 800)} 
                    alt="Preview" 
                    className="max-h-[500px] w-auto object-contain" 
                  />
                ) : (
                  <FileText className="h-20 w-20 text-slate-300" />
                )}
              </div>
              
              <div className="space-y-2 text-sm bg-slate-50 p-4 rounded-lg">
                {/* Basic info remains here */}
                <div className="grid grid-cols-3 gap-2 py-1">
                  <span className="text-slate-500">Type</span>
                  <span className="col-span-2 font-medium">{selectedImage?.mimeType}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 py-1">
                  <span className="text-slate-500">Size</span>
                  <span className="col-span-2 font-medium">
                    {selectedImage?.filesize ? (selectedImage.filesize / 1024).toFixed(1) : 0} KB
                  </span>
                </div>
                {selectedImage?.width && (
                   <div className="grid grid-cols-3 gap-2 py-1">
                    <span className="text-slate-500">Dimensions</span>
                    <span className="col-span-2 font-medium">{selectedImage.width}x{selectedImage.height}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Input readOnly value={selectedImage?.url || ''} className="text-xs font-mono bg-white" />
                <Button size="icon" variant="outline" onClick={() => copyToClipboard(selectedImage?.url)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>

              <Button 
                variant="destructive" 
                className="w-full"
                onClick={() => {
                  setDeleteId(selectedImage?.id);
                  setSelectedImage(null);
                }}
              >
                <Trash className="mr-2 h-4 w-4" /> Delete Permanently
              </Button>
            </div>

            <div>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="edit">Metadata</TabsTrigger>
                  <TabsTrigger value="usage">Usage</TabsTrigger>
                  <TabsTrigger value="seo">SEO Schema</TabsTrigger>
                </TabsList>

                <TabsContent value="edit" className="space-y-4">
                  <h3 className="font-medium text-lg">Edit Details</h3>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label htmlFor="media-title">Title</Label>
                      <Input id="media-title" value={editData.title} onChange={e => setEditData({...editData, title: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="media-alt">Alt Text</Label>
                      <Input id="media-alt" value={editData.altText} onChange={e => setEditData({...editData, altText: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="media-caption">Caption</Label>
                      <Textarea id="media-caption" rows={2} value={editData.caption} onChange={e => setEditData({...editData, caption: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="media-desc">Description</Label>
                      <Textarea id="media-desc" rows={3} value={editData.description} onChange={e => setEditData({...editData, description: e.target.value})} />
                    </div>
                    <Button className="w-full" onClick={handleUpdate} disabled={updateMutation.isPending}>
                      {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Save Changes
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="usage" className="space-y-4">
                  <h3 className="font-medium text-lg">Usage Analysis</h3>
                  {usageData === null ? (
                    <div className="flex justify-center py-10">
                      <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
                    </div>
                  ) : usageData.totalCount === 0 ? (
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                      <h4 className="text-amber-800 font-medium flex items-center gap-2">
                        <Info className="h-4 w-4" /> Unused Media
                      </h4>
                      <p className="text-amber-700 text-sm mt-1">
                        This asset is not currently linked to any published posts or products. It may be safe to delete.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {(usageData.posts?.length || 0) > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2 border-b pb-1">Posts ({usageData.posts?.length})</h4>
                          <ul className="text-sm space-y-1">
                            {(usageData.posts || []).map((p: any) => (
                              <li key={p.id} className="flex items-center justify-between text-slate-600 bg-slate-50 p-2 rounded">
                                {p.title}
                                <a href={`/blog/${p.slug}`} target="_blank" className="text-indigo-600 hover:underline"><ExternalLink className="h-3 w-3" /></a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {(usageData.products?.length || 0) > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2 border-b pb-1">Products ({usageData.products?.length})</h4>
                          <ul className="text-sm space-y-1">
                            {(usageData.products || []).map((p: any) => (
                              <li key={p.id} className="flex items-center justify-between text-slate-600 bg-slate-50 p-2 rounded">
                                {p.name}
                                <a href={`/product/${p.slug}`} target="_blank" className="text-indigo-600 hover:underline"><ExternalLink className="h-3 w-3" /></a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="seo" className="space-y-4">
                  <h3 className="font-medium text-lg">JSON-LD Schema</h3>
                  <p className="text-xs text-slate-500">Standard structured data for Google Image search.</p>
                  <pre className="text-[10px] bg-slate-900 text-slate-100 p-4 rounded-lg overflow-auto max-h-[300px] font-mono">
                    {JSON.stringify({
                      "@context": "https://schema.org/",
                      "@type": "ImageObject",
                      "contentUrl": selectedImage?.url,
                      "description": selectedImage?.description || selectedImage?.altText,
                      "name": selectedImage?.title || selectedImage?.filename,
                      "creator": { "@type": "Organization", "name": "American Hairline" }
                    }, null, 2)}
                  </pre>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete File"
        description="Are you sure you want to delete this file? This action cannot be undone."
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
        variant="destructive"
        confirmText="Delete"
      />

      <ConfirmDialog
        open={isBulkDeleteDialogOpen}
        onOpenChange={setIsBulkDeleteDialogOpen}
        title="Bulk Delete"
        description={`Are you sure you want to delete ${selectedItems.length} items? This action cannot be undone.`}
        onConfirm={handleBulkDelete}
        isLoading={bulkDeleteMutation.isPending}
        variant="destructive"
        confirmText="Delete All"
      />
    </div>
  );
}
```

### src/app/admin/products/page.tsx
```
"use client";

import { useProducts, useDeleteProduct } from "@/lib/hooks/useProducts";
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
import { Plus, Search, MoreHorizontal, Pencil, Trash, Package } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/lib/hooks/useDebounce";

export default function ProductsPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [status, setStatus] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data, isLoading } = useProducts({
    search: debouncedSearch,
    status: status === "ALL" ? undefined : status,
    page,
    limit: 10,
  });

  const deleteProductMutation = useDeleteProduct();

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status]);

  const handleDelete = async () => {
    if (deleteId) {
      await deleteProductMutation.mutateAsync(deleteId);
      setDeleteId(null);
    }
  };

  const columns = [
    {
      header: "Image",
      className: "w-[80px]",
      cell: (product: any) => (
        <div className="h-10 w-10 rounded bg-slate-100 overflow-hidden border">
          {product.featuredImage ? (
            <img src={product.featuredImage} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Package className="h-4 w-4 text-slate-400" />
            </div>
          )}
        </div>
      ),
    },
    {
      header: "Name",
      className: "w-[30%]",
      cell: (product: any) => (
        <div>
          <p className="font-medium">{product.name}</p>
          <p className="text-xs text-muted-foreground">{product.sku}</p>
        </div>
      ),
    },
    {
      header: "Category",
      accessorKey: "category",
    },
    {
      header: "Price",
      cell: (product: any) => (
        <span className="font-medium">
          {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(product.price)}
        </span>
      ),
    },
    {
      header: "Stock Status",
      cell: (product: any) => <StatusBadge status={product.stockStatus} />,
    },
    {
      header: "Actions",
      className: "w-[50px]",
      cell: (product: any) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push(`/admin/products/${product.id}/edit`)}>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => setDeleteId(product.id)}
            >
              <Trash className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        subtitle="Manage your inventory and product listings."
        actions={
          <Button asChild>
            <Link href="/admin/products/new">
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Link>
          </Button>
        }
      />

      <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-lg border shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Stock Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="IN_STOCK">In Stock</SelectItem>
              <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
              <SelectItem value="ON_BACKORDER">Backorder</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data?.products || []}
        isLoading={isLoading}
        pagination={{
          page,
          limit: 10,
          total: data?.meta?.total || 0,
          pages: data?.meta?.pages || 1,
        }}
        onPageChange={setPage}
        emptyTitle="No products found"
        emptyDescription="Start adding products to your inventory."
        emptyAction={
          <Button asChild variant="outline">
            <Link href="/admin/products/new">Add Product</Link>
          </Button>
        }
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
        onConfirm={handleDelete}
        isLoading={deleteProductMutation.isPending}
        variant="destructive"
        confirmText="Delete"
      />
    </div>
  );
}
```

### src/app/admin/forms/page.tsx
```
"use client";

import { useGetSubmissions, useDeleteSubmission, useUpdateSubmission } from "@/lib/hooks/useForms";
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
import { Search, Eye, Trash, Download, Mail, Phone, Calendar } from "lucide-react";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { useDebounce } from "@/lib/hooks/useDebounce";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export default function FormsPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [status, setStatus] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<any | null>(null);

  const { data, isLoading } = useGetSubmissions({
    search: debouncedSearch,
    status: status === "ALL" ? undefined : status,
    page,
    limit: 10,
  });

  const deleteMutation = useDeleteSubmission();
  const updateMutation = useUpdateSubmission();

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status]);

  const handleDelete = async () => {
    if (deleteId) {
      await deleteMutation.mutateAsync(deleteId);
      setDeleteId(null);
      if (selectedSubmission?.id === deleteId) {
        setSelectedSubmission(null);
      }
    }
  };

  const handleView = (submission: any) => {
    setSelectedSubmission(submission);
    // Mark as read if new
    if (submission.status === 'NEW') {
      updateMutation.mutate({ id: submission.id, status: 'READ' });
    }
  };

  const columns = [
    {
      header: "Status",
      className: "w-[100px]",
      cell: (sub: any) => <StatusBadge status={sub.status} />,
    },
    {
      header: "Name",
      cell: (sub: any) => {
        const formData = typeof sub.data === 'string' ? JSON.parse(sub.data) : sub.data || {};
        return <span className="font-medium">{formData.name || "Unknown"}</span>;
      },
    },
    {
      header: "Email",
      cell: (sub: any) => {
        const formData = typeof sub.data === 'string' ? JSON.parse(sub.data) : sub.data || {};
        return <span className="text-muted-foreground">{formData.email || "-"}</span>;
      },
    },
    {
      header: "Date",
      cell: (sub: any) => (
        <span className="text-sm text-muted-foreground">
          {format(new Date(sub.createdAt), "MMM d, HH:mm")}
        </span>
      ),
    },
    {
      header: "Score",
      cell: (sub: any) => {
         // Placeholder logic for score badge
         const score = sub.leadScore?.score || 0;
         let color = "bg-gray-100 text-gray-800";
         if (score > 70) color = "bg-green-100 text-green-800";
         else if (score > 40) color = "bg-yellow-100 text-yellow-800";
         
         return (
           <Badge variant="outline" className={color}>
             {score}
           </Badge>
         );
      }
    },
    {
      header: "Actions",
      className: "w-[100px]",
      cell: (sub: any) => (
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => handleView(sub)}>
            <Eye className="h-4 w-4 text-blue-600" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setDeleteId(sub.id)}>
            <Trash className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      ),
    },
  ];

  const getSubmissionDetails = (sub: any) => {
    if (!sub) return null;
    const formData = typeof sub.data === 'string' ? JSON.parse(sub.data) : sub.data || {};
    
    return (
      <div className="space-y-6">
        {/* Contact Info */}
        <div className="bg-slate-50 p-4 rounded-lg space-y-3">
          <h3 className="font-semibold text-sm uppercase tracking-wide text-slate-500">Contact Details</h3>
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                {(formData.name?.[0] || 'U').toUpperCase()}
              </div>
              <span className="font-medium text-lg">{formData.name}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-slate-400" />
              <a href={`mailto:${formData.email}`} className="text-blue-600 hover:underline">{formData.email}</a>
            </div>
            {formData.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-slate-400" />
                <a href={`tel:${formData.phone}`} className="text-slate-700">{formData.phone}</a>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span className="text-slate-500">{format(new Date(sub.createdAt), "PPpp")}</span>
            </div>
          </div>
        </div>

        {/* Message */}
        {formData.message && (
          <div className="space-y-2">
            <h3 className="font-semibold text-sm uppercase tracking-wide text-slate-500">Message</h3>
            <div className="p-4 border rounded-md bg-white text-sm leading-relaxed">
              {formData.message}
            </div>
          </div>
        )}

        {/* Technical Details */}
        <div className="space-y-2">
          <h3 className="font-semibold text-sm uppercase tracking-wide text-slate-500">Technical Info</h3>
          <div className="text-xs text-slate-500 space-y-1 bg-slate-50 p-3 rounded border">
            <p>IP Address: {sub.ipAddress}</p>
            <p>User Agent: {sub.userAgent}</p>
            <p>Source: {sub.campaignSource || 'Direct'}</p>
          </div>
        </div>
        
        {/* Actions */}
        <div className="pt-4 flex gap-3">
          <Button 
            className="w-full" 
            variant={sub.status === 'COMPLETED' ? 'outline' : 'default'}
            onClick={() => updateMutation.mutate({ id: sub.id, status: 'COMPLETED' })}
            disabled={sub.status === 'COMPLETED'}
          >
            {sub.status === 'COMPLETED' ? 'Marked as Complete' : 'Mark as Complete'}
          </Button>
          <Button 
            variant="destructive" 
            className="w-full"
            onClick={() => setDeleteId(sub.id)}
          >
            Delete
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Form Submissions"
        subtitle="View and manage customer inquiries."
        actions={
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
        }
      />

      <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-lg border shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search name, email..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="NEW">New</SelectItem>
              <SelectItem value="READ">Read</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data?.submissions || []}
        isLoading={isLoading}
        pagination={{
          page,
          limit: 10,
          total: data?.meta?.total || 0,
          pages: data?.meta?.pages || 1,
        }}
        onPageChange={setPage}
        emptyTitle="No submissions found"
        emptyDescription="When customers fill out forms, they will appear here."
      />

      <Sheet open={!!selectedSubmission} onOpenChange={(open) => !open && setSelectedSubmission(null)}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader className="mb-6">
            <SheetTitle>Submission Details</SheetTitle>
            <SheetDescription>
              Review the full details of this inquiry.
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-120px)] pr-4">
            {getSubmissionDetails(selectedSubmission)}
          </ScrollArea>
        </SheetContent>
      </Sheet>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete Submission"
        description="Are you sure you want to delete this submission record? This cannot be undone."
        onConfirm={handleDelete}
        isLoading={deleteMutation.isPending}
        variant="destructive"
        confirmText="Delete"
      />
    </div>
  );
}
```

### src/app/admin/leads/page.tsx
```
"use client";

import { useLeads, useUpdateLeadStatus } from "@/lib/hooks/useLeads";
import { DataTable } from "@/components/admin/shared/DataTable";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import { StatsCard } from "@/components/admin/shared/StatsCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Eye, Users, TrendingUp, Calendar, Download } from "lucide-react";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { useDebounce } from "@/lib/hooks/useDebounce";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function LeadsPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [status, setStatus] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const [selectedLead, setSelectedLead] = useState<any | null>(null);

  const { data, isLoading } = useLeads({
    search: debouncedSearch,
    status: status === "ALL" ? undefined : status,
    page,
    limit: 20,
  });

  const updateStatusMutation = useUpdateLeadStatus();

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, status]);

  const handleStatusUpdate = async (id: number, newStatus: string) => {
    await updateStatusMutation.mutateAsync({ id, status: newStatus });
    if (selectedLead && selectedLead.id === id) {
      setSelectedLead({ ...selectedLead, status: newStatus });
    }
  };

  const columns = [
    {
      header: "Score",
      cell: (lead: any) => {
        let color = "bg-slate-100 text-slate-800";
        if (lead.score >= 70) color = "bg-green-100 text-green-800";
        else if (lead.score >= 40) color = "bg-yellow-100 text-yellow-800";
        
        return (
          <Badge variant="outline" className={color}>
            {lead.score}
          </Badge>
        );
      }
    },
    {
      header: "Name",
      cell: (lead: any) => {
        const name = lead.user?.name || (lead.metaData as any)?.name || "Unknown";
        return <span className="font-medium">{name}</span>;
      },
    },
    {
      header: "Email",
      cell: (lead: any) => {
        const email = lead.user?.email || (lead.metaData as any)?.email || "-";
        return <span className="text-muted-foreground">{email}</span>;
      },
    },
    {
      header: "Status",
      cell: (lead: any) => (
        <Badge variant="outline" className="capitalize">
          {lead.status?.toLowerCase().replace('_', ' ') || 'New'}
        </Badge>
      ),
    },
    {
      header: "Last Active",
      cell: (lead: any) => (
        <span className="text-sm text-muted-foreground">
          {format(new Date(lead.updatedAt || lead.createdAt), "MMM d, HH:mm")}
        </span>
      ),
    },
    {
      header: "Actions",
      className: "w-[100px]",
      cell: (lead: any) => (
        <Button variant="ghost" size="sm" onClick={() => setSelectedLead(lead)}>
          View Details
        </Button>
      ),
    },
  ];

  const getLeadDetails = (lead: any) => {
    if (!lead) return null;
    const meta = lead.metaData || {};
    const name = lead.user?.name || meta.name || "Unknown";
    const email = lead.user?.email || meta.email || "-";
    
    return (
      <div className="space-y-6">
        <div className="bg-slate-50 p-4 rounded-lg border">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-bold">{name}</h3>
              <p className="text-sm text-muted-foreground">{email}</p>
            </div>
            <Badge className={lead.score >= 70 ? "bg-green-600" : "bg-yellow-600"}>
              Score: {lead.score}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground uppercase">Phone</p>
              <p>{meta.phone || "-"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase">Source</p>
              <p>{meta.source || "Direct"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase">Location</p>
              <p>{meta.location || "-"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase">First Seen</p>
              <p>{format(new Date(lead.createdAt), "MMM d, yyyy")}</p>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Status</h4>
          <Select 
            value={lead.status || "NEW"} 
            onValueChange={(val) => handleStatusUpdate(lead.id, val)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="NEW">New</SelectItem>
              <SelectItem value="CONTACTED">Contacted</SelectItem>
              <SelectItem value="QUALIFIED">Qualified</SelectItem>
              <SelectItem value="CONVERTED">Converted</SelectItem>
              <SelectItem value="LOST">Lost</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Score Factors</h4>
          <div className="space-y-2">
            {lead.scoreBreakdown?.map((factor: any, i: number) => (
              <div key={i} className="flex justify-between text-sm p-2 bg-white border rounded">
                <span>{factor.reason}</span>
                <span className={factor.points > 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                  {factor.points > 0 ? "+" : ""}{factor.points}
                </span>
              </div>
            ))}
            {(!lead.scoreBreakdown || lead.scoreBreakdown.length === 0) && (
              <p className="text-sm text-muted-foreground">No detailed breakdown available.</p>
            )}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Activity Timeline</h4>
          <div className="border-l-2 border-slate-200 ml-2 space-y-4 pl-4 py-2">
            <div className="relative">
              <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-slate-300"></div>
              <p className="text-sm font-medium">Last Updated</p>
              <p className="text-xs text-muted-foreground">{format(new Date(lead.updatedAt), "PPpp")}</p>
            </div>
            <div className="relative">
              <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full bg-slate-300"></div>
              <p className="text-sm font-medium">Lead Created</p>
              <p className="text-xs text-muted-foreground">{format(new Date(lead.createdAt), "PPpp")}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const leadsList = data?.leads || [];
  const meta = data?.meta || { total: 0, pages: 1 };
  const totalLeads = Number(meta.total ?? 0);
  const totalPages = Number(meta.pages ?? 1);
  
  // Calculate simple stats from current page data (ideally should come from API stats endpoint)
  const highPriorityCount = leadsList.filter((l: any) => l.score >= 70).length;
  const newLeadsCount = leadsList.filter((l: any) => l.status === 'NEW').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Lead Scoring"
        subtitle="Track and manage potential high-value customers."
        actions={
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export CSV
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard
          title="Total Leads"
          value={totalLeads}
          icon={Users}
          trend={{ value: 12, label: "vs last month", isPositive: true }}
        />
        <StatsCard
          title="High Priority"
          value={highPriorityCount} // This is just for demo, should be real stat
          icon={TrendingUp}
          description="Score > 70"
          className="border-green-200 bg-green-50/30"
        />
        <StatsCard
          title="New Leads"
          value={newLeadsCount}
          icon={Calendar}
          description="Status: New"
        />
      </div>

      <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-lg border shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search leads..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="NEW">New</SelectItem>
              <SelectItem value="CONTACTED">Contacted</SelectItem>
              <SelectItem value="QUALIFIED">Qualified</SelectItem>
              <SelectItem value="CONVERTED">Converted</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={leadsList}
        isLoading={isLoading}
        pagination={{
          page,
          limit: 20,
          total: totalLeads,
          pages: totalPages,
        }}
        onPageChange={setPage}
        emptyTitle="No leads found"
        emptyDescription="Leads will appear here as users interact with your site."
      />

      <Sheet open={!!selectedLead} onOpenChange={(open) => !open && setSelectedLead(null)}>
        <SheetContent className="w-[400px] sm:w-[540px]">
          <SheetHeader className="mb-6">
            <SheetTitle>Lead Profile</SheetTitle>
            <SheetDescription>
              Detailed score analysis and activity log.
            </SheetDescription>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-120px)] pr-4">
            {getLeadDetails(selectedLead)}
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  );
}
```

### src/app/admin/leads/dashboard/page.tsx
```
'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api/endpoints';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Users, MousePointerClick, Calculator, MailWarning, Zap } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? value : [];
}

export default function OptimizationDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.getOptimizationDashboard(30);
        setData(response);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!data) return null;

  const triggers = asArray<{
    triggerType: string;
    actionType: string;
    conversionRate: number;
  }>(data.triggers);

  const abandonmentPoints = asArray(data.abandonment?.abandonmentPoints);
  const exitByPopup = asArray(data.exitIntent?.byPopupType);

  const conversion = data.conversion ?? {};
  const abandonment = data.abandonment ?? {};
  const exitIntent = data.exitIntent ?? {};
  const calculator = data.calculator ?? {};

  const formSubmitted = conversion.formSubmitted ?? conversion.totalEvents ?? 0;
  const formViewed = conversion.formViewed ?? 0;
  const conversionRatePct =
    conversion.conversionRate != null
      ? Number(conversion.conversionRate)
      : formViewed > 0
        ? (Number(formSubmitted) / Number(formViewed)) * 100
        : 0;

  const abandonmentRecoveryRate =
    abandonment.recoveryRate != null
      ? Number(abandonment.recoveryRate)
      : abandonment.emailsSent
        ? ((Number(abandonment.recovered) || 0) /
            Number(abandonment.emailsSent)) *
          100
        : 0;

  const exitConversionRate =
    exitIntent.conversionRate != null
      ? Number(exitIntent.conversionRate)
      : exitIntent.total
        ? ((Number(exitIntent.converted) || 0) / Number(exitIntent.total)) * 100
        : 0;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Optimization Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of lead optimization performance for the last 30 days.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Number.isFinite(conversionRatePct)
                ? conversionRatePct.toFixed(1)
                : "0"}
              %
            </div>
            <p className="text-xs text-muted-foreground">
              {formSubmitted} submissions from {formViewed} views
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Abandonment Recovery</CardTitle>
            <MailWarning className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Number.isFinite(abandonmentRecoveryRate)
                ? abandonmentRecoveryRate.toFixed(1)
                : "0"}
              %
            </div>
            <p className="text-xs text-muted-foreground">
              {abandonment.recovered ?? 0} recovered from{" "}
              {abandonment.emailsSent ?? 0} emails
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exit Intent Saved</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Number.isFinite(exitConversionRate)
                ? exitConversionRate.toFixed(1)
                : "0"}
              %
            </div>
            <p className="text-xs text-muted-foreground">
              {exitIntent.converted ?? 0} saved / {exitIntent.total ?? 0} shown
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hot Leads</CardTitle>
            <Zap className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.hotLeads ?? 0}</div>
            <p className="text-xs text-muted-foreground">
              High priority for follow-up
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="abandonment" className="space-y-4">
        <TabsList>
          <TabsTrigger value="abandonment">Form Abandonment</TabsTrigger>
          <TabsTrigger value="exit-intent">Exit Intent</TabsTrigger>
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="triggers">Behavioral Triggers</TabsTrigger>
        </TabsList>

        <TabsContent value="abandonment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Abandonment Statistics</CardTitle>
              <CardDescription>
                Analysis of where users drop off and recovery effectiveness.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="p-4 border rounded-lg">
                   <div className="text-sm font-medium text-muted-foreground">Total Abandoned</div>
                   <div className="text-2xl font-bold">{abandonment.total ?? 0}</div>
                </div>
                <div className="p-4 border rounded-lg">
                   <div className="text-sm font-medium text-muted-foreground">Emails Sent</div>
                   <div className="text-2xl font-bold">{abandonment.emailsSent ?? 0}</div>
                </div>
                <div className="p-4 border rounded-lg bg-green-50 border-green-100">
                   <div className="text-sm font-medium text-green-700">Recovered</div>
                   <div className="text-2xl font-bold text-green-800">
                    {abandonment.recovered ?? 0}
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Top Drop-off Points</h4>
                <div className="space-y-2">
                  {abandonmentPoints.map((point: any, i: number) => (
                    <div key={i} className="flex justify-between items-center p-2 bg-muted rounded">
                      <span className="text-sm">Step {point.currentStep} ({point.formType})</span>
                      <span className="font-bold">{point._count} drop-offs</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="exit-intent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Exit Intent Performance</CardTitle>
              <CardDescription>
                Effectiveness of exit intent popups by type.
              </CardDescription>
            </CardHeader>
            <CardContent>
               <div className="space-y-4">
                  {exitByPopup.map((item: any, i: number) => (
                    <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0">
                      <div>
                        <div className="font-medium capitalize">{item.popupType}</div>
                        <div className="text-xs text-muted-foreground">Popup Variant</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{item._count}</div>
                        <div className="text-xs text-muted-foreground">Impressions</div>
                      </div>
                    </div>
                  ))}
               </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calculator" className="space-y-4">
           <Card>
             <CardHeader>
               <CardTitle>Calculator Usage</CardTitle>
               <CardDescription>
                 Engagement with cost and graft calculators.
               </CardDescription>
             </CardHeader>
             <CardContent>
               <div className="grid gap-4 md:grid-cols-3">
                 <div className="p-4 border rounded-lg">
                    <div className="text-sm font-medium text-muted-foreground">Total Usage</div>
                    <div className="text-2xl font-bold">{calculator.total ?? 0}</div>
                 </div>
                 <div className="p-4 border rounded-lg bg-green-50 border-green-100">
                    <div className="text-sm font-medium text-green-700">Converted to Lead</div>
                    <div className="text-2xl font-bold text-green-800">
                      {calculator.converted ?? 0}
                    </div>
                 </div>
                 <div className="p-4 border rounded-lg">
                    <div className="text-sm font-medium text-muted-foreground">Conversion Rate</div>
                    <div className="text-2xl font-bold">
                      {calculator.conversionRate ?? 0}%
                    </div>
                 </div>
               </div>
             </CardContent>
           </Card>
        </TabsContent>

        <TabsContent value="triggers" className="space-y-4">
           <Card>
             <CardHeader>
               <CardTitle>Behavioral Triggers</CardTitle>
               <CardDescription>
                 Impact of automated behavioral interventions.
               </CardDescription>
             </CardHeader>
             <CardContent>
               <div className="space-y-4">
                  {triggers.map((item: any, i: number) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium capitalize flex items-center gap-2">
                           <Zap className="w-4 h-4 text-yellow-500" />
                           {String(item.triggerType ?? "unknown").replace(/_/g, ' ')}
                        </div>
                        <div className="text-xs text-muted-foreground">Action: {item.actionType ?? "—"}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">{item.conversionRate ?? 0}%</div>
                        <div className="text-xs text-muted-foreground">Conversion Rate</div>
                      </div>
                    </div>
                  ))}
                  {triggers.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No trigger data available yet.
                    </div>
                  )}
               </div>
             </CardContent>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
```

### src/app/admin/leads/scoring/page.tsx
```
"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api/endpoints";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, RefreshCw, Flame, ThermometerSun, Snowflake, ArrowUpRight } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

interface LeadScore {
  id: string;
  totalScore: number;
  category: "hot" | "warm" | "cold";
  behaviorScore: number;
  intentScore: number;
  qualityScore: number;
  sourceScore: number;
  factors: any[];
}

interface FormSubmission {
  id: number;
  type: string;
  data: string; // JSON string
  status: string;
  createdAt: string;
  leadScore: number | null;
  leadCategory: string | null;
  leadScores?: LeadScore[];
}

export default function LeadScoringPage() {
  const [loading, setLoading] = useState(true);
  const [scoring, setScoring] = useState(false);
  const [leads, setLeads] = useState<FormSubmission[]>([]);
  const { toast } = useToast();

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const data = await api.getHotLeads(50); // Get top 50 hot leads (array from API helper)
      setLeads(Array.isArray(data) ? (data as FormSubmission[]) : []);
    } catch (error) {
      console.error("Failed to fetch leads", error);
      toast({
        title: "Error",
        description: "Failed to fetch hot leads",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleBulkScore = async () => {
    setScoring(true);
    try {
      await api.bulkScoreLeads();
      
      toast({
        title: "Scoring Complete",
        description: "All unscored leads have been processed.",
      });
      
      fetchLeads();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to score leads",
        variant: "destructive",
      });
    } finally {
      setScoring(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "hot":
        return <Flame className="h-4 w-4 text-orange-500" />;
      case "warm":
        return <ThermometerSun className="h-4 w-4 text-yellow-500" />;
      case "cold":
        return <Snowflake className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "hot":
        return <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200">Hot Lead</Badge>;
      case "warm":
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200">Warm Lead</Badge>;
      case "cold":
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200">Cold Lead</Badge>;
      default:
        return <Badge variant="outline">Unscored</Badge>;
    }
  };

  const parseFormData = (json: string) => {
    try {
      return JSON.parse(json);
    } catch (e) {
      return {};
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Lead Scoring</h1>
          <p className="text-muted-foreground">
            AI-powered lead qualification and prioritization engine.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchLeads} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button onClick={handleBulkScore} disabled={scoring}>
            {scoring ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Flame className="mr-2 h-4 w-4" />}
            Score All Leads
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hot Leads</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leads.filter(l => l.leadCategory === 'hot').length}</div>
            <p className="text-xs text-muted-foreground">Ready for immediate follow-up</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Lead Score</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {leads.length > 0 
                ? Math.round(leads.reduce((acc, curr) => acc + (curr.leadScore || 0), 0) / leads.length)
                : 0}
            </div>
            <p className="text-xs text-muted-foreground">Across top 50 leads</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warm Leads</CardTitle>
            <ThermometerSun className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leads.filter(l => l.leadCategory === 'warm').length}</div>
            <p className="text-xs text-muted-foreground">Nurture required</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Leads</CardTitle>
          <CardDescription>
            High-priority leads sorted by qualification score.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Score</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : leads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No scored leads found. Try running the scoring engine.
                  </TableCell>
                </TableRow>
              ) : (
                leads.map((lead) => {
                  const data = parseFormData(lead.data);
                  return (
                    <TableRow key={lead.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={`font-bold text-lg ${
                            (lead.leadScore || 0) >= 80 ? 'text-orange-600' : 
                            (lead.leadScore || 0) >= 50 ? 'text-yellow-600' : 'text-blue-600'
                          }`}>
                            {lead.leadScore || 0}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{data.name || 'Unknown'}</TableCell>
                      <TableCell>{data.email || 'No email'}</TableCell>
                      <TableCell>
                        {getCategoryBadge(lead.leadCategory || 'cold')}
                      </TableCell>
                      <TableCell>
                        {format(new Date(lead.createdAt), 'MMM d, h:mm a')}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
```

### src/app/admin/seo/page.tsx
```
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Activity, AlertCircle, CheckCircle } from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api/endpoints";

interface SeoStatistics {
  totalPosts: number;
  analyzedPosts: number;
  avgScore: number;
  scoreDistribution: {
    excellent: number;
    good: number;
    fair: number;
    poor: number;
    notAnalyzed: number;
  };
}

interface SeoPost {
  id: number;
  title: string;
  slug: string;
  seoScore: number | null;
  wordCount: number;
  readabilityScore: number | null;
  lastSeoCheck: string | null;
}

interface RecentAnalysis {
  id: number;
  analyzedAt: string;
  score: number;
  post: {
    id: number;
    title: string;
    slug: string;
  };
}

interface SeoOverviewData {
  statistics: SeoStatistics;
  needsAttention: SeoPost[];
  recentAnalyses: RecentAnalysis[];
}

const EMPTY_SCORE_DIST: SeoStatistics["scoreDistribution"] = {
  excellent: 0,
  good: 0,
  fair: 0,
  poor: 0,
  notAnalyzed: 0,
};

const EMPTY_STATISTICS: SeoStatistics = {
  totalPosts: 0,
  analyzedPosts: 0,
  avgScore: 0,
  scoreDistribution: { ...EMPTY_SCORE_DIST },
};

function asRecord(v: unknown): Record<string, unknown> | null {
  if (v == null || typeof v !== "object" || Array.isArray(v)) return null;
  return v as Record<string, unknown>;
}

function num(v: unknown, fallback = 0): number {
  return typeof v === "number" && !Number.isNaN(v) ? v : fallback;
}

function emptyOverview(): SeoOverviewData {
  return {
    statistics: { ...EMPTY_STATISTICS, scoreDistribution: { ...EMPTY_SCORE_DIST } },
    needsAttention: [],
    recentAnalyses: [],
  };
}

/**
 * API may return counts-only stub, jsonSuccess `{ data }`, nested `overview`, or partial `statistics`.
 */
function normalizeSeoOverview(raw: unknown): SeoOverviewData {
  if (raw == null) return emptyOverview();

  let r = asRecord(raw);
  if (!r) return emptyOverview();

  // Unwrap jsonSuccess / axios: { data: { ...actual } }
  const inner = asRecord(r.data);
  if (inner && Object.keys(inner).length > 0) {
    r = { ...r, ...inner };
  }

  const overview = asRecord(r.overview);

  const s = asRecord(r.statistics);

  const distFromStats = (stats: Record<string, unknown>) => {
    const d = asRecord(stats.scoreDistribution);
    return {
      excellent: num(d?.excellent, 0),
      good: num(d?.good, 0),
      fair: num(d?.fair, 0),
      poor: num(d?.poor, 0),
      notAnalyzed: num(d?.notAnalyzed, 0),
    };
  };

  const pickAvg = () =>
    (typeof s?.avgScore === "number" && !Number.isNaN(s.avgScore) ? s.avgScore : undefined) ??
    (typeof r.avgScore === "number" ? r.avgScore : undefined) ??
    (overview && typeof overview.avgScore === "number" ? overview.avgScore : undefined) ??
    (() => {
      const nested = asRecord(r.data);
      return typeof nested?.avgScore === "number" ? nested.avgScore : undefined;
    })() ??
    0;

  if (s) {
    return {
      statistics: {
        ...EMPTY_STATISTICS,
        avgScore: pickAvg(),
        totalPosts: num(s.totalPosts, 0),
        analyzedPosts: num(s.analyzedPosts, 0),
        scoreDistribution: { ...EMPTY_SCORE_DIST, ...distFromStats(s) },
      },
      needsAttention: Array.isArray(r.needsAttention) ? (r.needsAttention as SeoPost[]) : [],
      recentAnalyses: Array.isArray(r.recentAnalyses)
        ? (r.recentAnalyses as RecentAnalysis[])
        : [],
    };
  }

  // Stub: { publishedPosts, seoAnalyses, ... }
  if ("publishedPosts" in r || "seoAnalyses" in r) {
    const total = num(r.publishedPosts, 0);
    const analyzed = num(r.seoAnalyses, 0);
    return {
      statistics: {
        ...EMPTY_STATISTICS,
        avgScore: overview ? num(overview.avgScore, 0) : pickAvg(),
        totalPosts: total,
        analyzedPosts: analyzed,
        scoreDistribution: { ...EMPTY_SCORE_DIST },
      },
      needsAttention: [],
      recentAnalyses: [],
    };
  }

  return {
    statistics: {
      ...EMPTY_STATISTICS,
      avgScore: overview ? num(overview.avgScore, 0) : num(r.avgScore, 0),
      totalPosts: num(r.totalPosts, 0),
      analyzedPosts: num(r.analyzedPosts, 0),
      scoreDistribution: { ...EMPTY_SCORE_DIST },
    },
    needsAttention: Array.isArray(r.needsAttention) ? (r.needsAttention as SeoPost[]) : [],
    recentAnalyses: Array.isArray(r.recentAnalyses) ? (r.recentAnalyses as RecentAnalysis[]) : [],
  };
}

export default function SeoDashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<SeoOverviewData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const overview = await api.getSeoOverview();
      setData(normalizeSeoOverview(overview));
    } catch (err: any) {
      console.error("Failed to fetch SEO data:", err.response?.data || err);
      let errorMessage = err?.response?.data?.message || err?.message || "Failed to fetch SEO data";
      if (err?.status === 401 || err?.response?.status === 401) {
        errorMessage = "Session expired. Please log in again.";
      } else if (errorMessage === "Network Error") {
        errorMessage = "Network Error. Check your connection or disable ad blockers (uBlock Origin often blocks '/seo' URLs).";
      }
      setError(errorMessage);
      toast({ 
        title: "Error", 
        description: errorMessage, 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      await api.runBulkSeoAnalysis();
      toast({
        title: "Analysis Started",
        description: "Bulk SEO analysis is running in the background. Refresh in a few moments.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start analysis",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

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
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Skeleton className="col-span-4 h-[400px] rounded-xl" />
          <Skeleton className="col-span-3 h-[400px] rounded-xl" />
        </div>
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
             <Button onClick={fetchData}>Try Again</Button>
             {error.includes("401") || error.includes("auth") ? (
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

  const { statistics, needsAttention, recentAnalyses } = data;
  const avgScore = statistics?.avgScore ?? 0;
  const totalPosts = statistics?.totalPosts ?? 0;
  const analyzedPosts = statistics?.analyzedPosts ?? 0;
  const dist = statistics?.scoreDistribution ?? EMPTY_SCORE_DIST;
  const hasNoSeoWork =
    analyzedPosts === 0 &&
    (needsAttention?.length ?? 0) === 0 &&
    (recentAnalyses?.length ?? 0) === 0;

  return (
    <div className="space-y-6 p-8">
      {hasNoSeoWork ? (
        <div className="rounded-lg border border-dashed p-6 text-center text-muted-foreground">
          No SEO data yet. Run analysis or add published posts to see metrics here.
        </div>
      ) : null}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">SEO Dashboard</h1>
        <div className="space-x-2">
          <Button variant="outline" asChild>
            <Link href="/admin/seo/keywords">Keyword Tracker</Link>
          </Button>
          <Button variant="secondary" onClick={handleRunAnalysis} disabled={isAnalyzing}>
            {isAnalyzing ? "Starting..." : "Run Full Analysis"}
          </Button>
          <Button onClick={() => fetchData()}>
            Refresh Data
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average SEO Score</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgScore}</div>
            <Progress value={avgScore} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Across {analyzedPosts} analyzed posts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Analyzed Posts</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyzedPosts} / {totalPosts}</div>
            <p className="text-xs text-muted-foreground">
              {totalPosts > 0 
                ? Math.round((analyzedPosts / totalPosts) * 100) 
                : 0}% coverage
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Excellent Scores</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dist.excellent}</div>
            <p className="text-xs text-muted-foreground">
              Posts with score 90+
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Needs Attention</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(dist.poor ?? 0) + (dist.fair ?? 0)}</div>
            <p className="text-xs text-muted-foreground">
              Posts with score &lt; 70
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Needs Attention Table */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Needs Attention</CardTitle>
            <CardDescription>
              Posts with low SEO scores that need optimization.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Readability</TableHead>
                  <TableHead>Word Count</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(needsAttention ?? []).map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>
                      <Badge variant={post.seoScore && post.seoScore < 50 ? "destructive" : "secondary"}>
                        {post.seoScore || "N/A"}
                      </Badge>
                    </TableCell>
                    <TableCell>{post.readabilityScore ? Math.round(post.readabilityScore) : "N/A"}</TableCell>
                    <TableCell>{post.wordCount}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/posts/${post.id}/edit`}>Edit</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {(needsAttention ?? []).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">No posts need immediate attention!</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Analyses */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Analyses</CardTitle>
            <CardDescription>
              Latest SEO checks performed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {(recentAnalyses ?? []).map((analysis) => (
                <div key={analysis.id} className="flex items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {analysis.post?.title ?? "—"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(analysis.analyzedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="ml-auto font-medium">
                    <Badge variant="outline">{analysis.score}</Badge>
                  </div>
                </div>
              ))}
              {(recentAnalyses ?? []).length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No recent analyses found.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

### src/app/admin/seo/keywords/page.tsx
```
"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Search, TrendingUp, TrendingDown, Minus } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api/endpoints";

interface Keyword {
  id: number;
  keyword: string;
  url: string;
  position: number;
  searchVolume: number;
  difficulty: number;
  lastChecked: string;
  positionHistory: { position: number; date: string }[];
}

export default function KeywordTracker() {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newKeyword, setNewKeyword] = useState({ keyword: "", url: "" });
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const data = await api.getTrackedKeywords();
      setKeywords(data);
    } catch (error) {
      console.error("Failed to fetch keywords:", error);
      toast({ 
        title: "Error", 
        description: "Failed to fetch keywords", 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTrack = async () => {
    if (!newKeyword.keyword || !newKeyword.url) {
      toast({ title: "Validation Error", description: "Please fill in all fields", variant: "destructive" });
      return;
    }
    
    setIsSubmitting(true);
    try {
      await api.trackKeyword(newKeyword);
      toast({ title: "Success", description: "Keyword added to tracker" });
      setIsDialogOpen(false);
      setNewKeyword({ keyword: "", url: "" });
      fetchData();
    } catch (error) {
      toast({ title: "Error", description: "Failed to track keyword", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTrendIcon = (history: { position: number }[]) => {
    if (!history || history.length < 2) return <Minus className="h-4 w-4 text-muted-foreground" />;
    
    const current = history[history.length - 1].position;
    const previous = history[history.length - 2].position;
    
    if (current < previous) return <TrendingUp className="h-4 w-4 text-green-500" />; // Lower rank is better
    if (current > previous) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  if (loading) {
    return (
      <div className="space-y-6 p-8">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32 mb-2" />
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
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Keyword Tracker</h1>
          <p className="text-muted-foreground">Monitor your search engine rankings.</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Track Keyword
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Rankings</CardTitle>
          <CardDescription>
            Daily updated positions from Google Search (US).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Keyword</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Current Rank</TableHead>
                <TableHead>Volume</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Trend</TableHead>
                <TableHead className="text-right">Last Checked</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {keywords.map((k) => (
                <TableRow key={k.id}>
                  <TableCell className="font-medium">{k.keyword}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-muted-foreground text-xs">
                    {k.url}
                  </TableCell>
                  <TableCell>
                    <Badge variant={k.position <= 10 ? "default" : "secondary"}>
                      {k.position || "-"}
                    </Badge>
                  </TableCell>
                  <TableCell>{k.searchVolume || "-"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-16 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${k.difficulty > 70 ? 'bg-red-500' : k.difficulty > 40 ? 'bg-yellow-500' : 'bg-green-500'}`}
                          style={{ width: `${k.difficulty || 0}%` }} 
                        />
                      </div>
                      <span className="text-xs">{k.difficulty}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getTrendIcon(k.positionHistory)}</TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground">
                    {k.lastChecked ? new Date(k.lastChecked).toLocaleDateString() : 'Pending'}
                  </TableCell>
                </TableRow>
              ))}
              {keywords.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No keywords tracked yet. Add one to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Track New Keyword</DialogTitle>
            <DialogDescription>
              Enter a keyword and the URL you want to rank for.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="keyword">Keyword</Label>
              <Input
                id="keyword"
                value={newKeyword.keyword}
                onChange={(e) => setNewKeyword({ ...newKeyword, keyword: e.target.value })}
                placeholder="e.g. hair transplant cost"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="url">Target URL</Label>
              <Input
                id="url"
                value={newKeyword.url}
                onChange={(e) => setNewKeyword({ ...newKeyword, url: e.target.value })}
                placeholder="https://americanhairline.com/..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>Cancel</Button>
            <Button onClick={handleTrack} disabled={isSubmitting}>
              {isSubmitting ? "Tracking..." : "Start Tracking"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
```

### src/app/admin/seo/citations/page.tsx
```
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
```

### src/app/admin/analytics/page.tsx
```
"use client";

import { useGetAnalytics } from "@/lib/hooks/useAnalytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DateRange } from "react-day-picker";
import { useState, useMemo } from "react";
import { Calendar as CalendarIcon, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function AnalyticsPage() {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });

  // Memoize fallback dates to prevent infinite loops when date is undefined
  const defaultFallbackDates = useMemo(() => ({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date()
  }), []);

  const { data: analytics, isLoading, error, refetch } = useGetAnalytics({
    from: date?.from || defaultFallbackDates.from,
    to: date?.to || defaultFallbackDates.to,
  });

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-10 w-[300px]" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[350px] w-full" />
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[350px] w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-4">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h2 className="text-xl font-semibold">Failed to load analytics</h2>
        <p className="text-muted-foreground">
          {error instanceof Error ? error.message : "An unexpected error occurred"}
        </p>
        <Button onClick={() => refetch()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              id="date"
              variant={"outline"}
              className={cn(
                "w-[300px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.totalViews?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">Based on selected period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.uniqueVisitors?.toLocaleString() || 0}</div>
            <p className="text-xs text-muted-foreground">Distinct users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Time on Site</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.avgTimeOnSite || 0}s</div>
            <p className="text-xs text-muted-foreground">Average session duration</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.bounceRate || 0}%</div>
            <p className="text-xs text-muted-foreground">Single page sessions</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={analytics?.pageViews || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(val) => format(new Date(val), "MMM d")}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(val) => format(new Date(val), "MMM d, yyyy")}
                />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="#8884d8"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={analytics?.trafficSources || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="users"
                >
                  {(analytics?.trafficSources || []).map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 flex justify-center gap-4 flex-wrap">
              {(analytics?.trafficSources || []).map((source, index) => (
                <div key={source.source} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {source.source}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Pages</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Page Path</TableHead>
                <TableHead className="text-right">Views</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(analytics?.topPages || []).map((page) => (
                <TableRow key={page.path}>
                  <TableCell className="font-medium">{page.path}</TableCell>
                  <TableCell className="text-right">{page.views}</TableCell>
                </TableRow>
              ))}
              {(analytics?.topPages || []).length === 0 && (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-muted-foreground">
                    No data available for this period
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
```

### src/app/admin/analytics/campaigns/page.tsx
```
"use client";

import { useState } from "react";
import { useGetCampaignPerformance, useGetCampaignList } from "@/lib/hooks/useTracking";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Download, Loader2, TrendingUp, MousePointerClick, Target, DollarSign } from "lucide-react";
import { addDays, format, subDays } from "date-fns";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

export default function CampaignAnalyticsPage() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [selectedCampaign, setSelectedCampaign] = useState<string>("all");

  const { data: performanceData, isLoading } = useGetCampaignPerformance(dateRange, {
    campaignName: selectedCampaign === "all" ? undefined : selectedCampaign,
  });

  const { data: campaignList } = useGetCampaignList();

  // Aggregate Overview Data
  const totalClicks = performanceData?.reduce((acc: number, curr: any) => acc + curr.clicks, 0) || 0;
  const totalConversions = performanceData?.reduce((acc: number, curr: any) => acc + curr.conversions, 0) || 0;
  const overallConversionRate = totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(2) : "0";

  // Chart Data Preparation
  const chartData = performanceData?.map((item: any) => ({
    name: item.adName || item.campaignName,
    clicks: item.clicks,
    conversions: item.conversions,
  })) || [];

  const handleExport = () => {
    if (!performanceData) return;
    
    const headers = ["Campaign", "Ad Set", "Ad", "Clicks", "Conversions", "Rate"];
    const csvContent = [
      headers.join(","),
      ...performanceData.map((row: any) => 
        [row.campaignName, row.adSetName, row.adName, row.clicks, row.conversions, row.conversionRate].join(",")
      )
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `campaign-report-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campaign Analytics</h1>
          <p className="text-muted-foreground">
            Track performance across Facebook and other channels
          </p>
        </div>
        <div className="flex items-center gap-2">
          <DateRangePicker date={dateRange} setDate={setDateRange} />
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClicks.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              --
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conversions</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalConversions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              --
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallConversionRate}%</div>
            <p className="text-xs text-muted-foreground">
              --
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Est. Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">
              Revenue data unavailable
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
          <SelectTrigger className="w-[280px]">
            <SelectValue placeholder="Select Campaign" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Campaigns</SelectItem>
            {campaignList?.map((c: any) => (
              <SelectItem key={c.name} value={c.name}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Bar yAxisId="left" dataKey="clicks" fill="#8884d8" name="Clicks" />
                <Bar yAxisId="right" dataKey="conversions" fill="#82ca9d" name="Conversions" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Conversions by Campaign</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(props: any) => `${props.name} ${((props.percent || 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="conversions"
                >
                  {chartData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Report</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Ad Set</TableHead>
                <TableHead>Ad Name</TableHead>
                <TableHead className="text-right">Clicks</TableHead>
                <TableHead className="text-right">Conversions</TableHead>
                <TableHead className="text-right">Rate</TableHead>
                <TableHead className="text-right">Est. Rev</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {performanceData?.map((row: any, i: number) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{row.campaignName}</TableCell>
                  <TableCell>{row.adSetName || '-'}</TableCell>
                  <TableCell>{row.adName || '-'}</TableCell>
                  <TableCell className="text-right">{row.clicks}</TableCell>
                  <TableCell className="text-right">{row.conversions}</TableCell>
                  <TableCell className="text-right">{row.conversionRate}</TableCell>
                  <TableCell className="text-right">--</TableCell>
                </TableRow>
              ))}
              {performanceData?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No data found for the selected period
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
```

### src/app/admin/integrations/page.tsx
```
"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, Play, Activity, CheckCircle, XCircle } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { api } from "@/lib/api/endpoints";

export default function IntegrationsPage() {
  const [webhooks, setWebhooks] = useState<any[]>([]);
  const [presets, setPresets] = useState<any>({});
  const [availableEvents, setAvailableEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const { toast } = useToast();

  // Create/Edit State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    events: [] as string[],
    headers: "",
    payload: ""
  });

  // Logs State
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [selectedWebhookLogs, setSelectedWebhookLogs] = useState<any[]>([]);
  const [selectedWebhookId, setSelectedWebhookId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoadError(null);
    try {
      const [webhooksData, presetsData, eventsData] = await Promise.all([
        api.getWebhooks(),
        api.getIntegrationPresets(),
        api.getWebhookEvents()
      ]);
      setWebhooks(webhooksData.webhooks);
      setPresets(presetsData);
      setAvailableEvents(eventsData);
    } catch (error) {
      setWebhooks([]);
      setPresets({});
      setAvailableEvents([]);
      setLoadError("Failed to fetch integrations data.");
      toast({
        title: "Error",
        description: "Failed to fetch integrations data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        name: formData.name,
        url: formData.url,
        events: formData.events,
        headers: formData.headers ? JSON.parse(formData.headers) : null,
        payload: formData.payload ? JSON.parse(formData.payload) : null
      };

      if (editingWebhook) {
        await api.updateWebhook(editingWebhook.id, payload);
        toast({ title: "Success", description: "Webhook updated successfully" });
      } else {
        await api.createWebhook(payload);
        toast({ title: "Success", description: "Webhook created successfully" });
      }
      
      setIsDialogOpen(false);
      fetchData();
    } catch (error) {
      toast({ title: "Error", description: "Failed to save webhook. Check JSON format.", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this webhook?")) return;
    try {
      await api.deleteWebhook(id);
      toast({ title: "Success", description: "Webhook deleted successfully" });
      fetchData();
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete webhook", variant: "destructive" });
    }
  };

  const handleTest = async (id: string) => {
    try {
      const res = await api.testWebhook(id);
      if (res.success) {
        toast({ title: "Success", description: "Test webhook sent successfully" });
      } else {
        toast({ title: "Failed", description: res.error, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to test webhook", variant: "destructive" });
    }
  };

  const handleViewLogs = async (id: string) => {
    setSelectedWebhookId(id);
    try {
      const data = await api.getWebhookLogs(id);
      setSelectedWebhookLogs(data.logs);
      setIsLogsOpen(true);
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch logs", variant: "destructive" });
    }
  };

  const loadPreset = (key: string) => {
    const preset = presets[key];
    setFormData({
      name: preset.name,
      url: "",
      events: preset.events,
      headers: JSON.stringify(preset.headers, null, 2),
      payload: preset.payload ? JSON.stringify(preset.payload, null, 2) : ""
    });
    setEditingWebhook(null);
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingWebhook(null);
    setFormData({
      name: "",
      url: "",
      events: [],
      headers: "",
      payload: ""
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (webhook: any) => {
    setEditingWebhook(webhook);
    setFormData({
      name: webhook.name,
      url: webhook.url,
      events: webhook.events,
      headers: webhook.headers ? JSON.stringify(webhook.headers, null, 2) : "",
      payload: webhook.payload ? JSON.stringify(webhook.payload, null, 2) : ""
    });
    setIsDialogOpen(true);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Integrations & Webhooks</h1>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" /> Add Webhook
        </Button>
      </div>

      {loadError ? (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {loadError}
        </div>
      ) : null}

      {/* Integration Presets */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Object.keys(presets).map((key) => (
          <Card key={key} className="cursor-pointer hover:border-primary" onClick={() => loadPreset(key)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{presets[key].name}</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">Click to configure</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Webhooks List */}
      <Card>
        <CardHeader>
          <CardTitle>Active Webhooks</CardTitle>
          <CardDescription>Manage your external integrations and event listeners.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>Events</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {webhooks.map((webhook) => (
                <TableRow key={webhook.id}>
                  <TableCell className="font-medium">{webhook.name}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-muted-foreground">{webhook.url}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {webhook.events.map((e: string) => (
                        <Badge key={e} variant="secondary" className="text-xs">{e}</Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={webhook.isActive ? "default" : "destructive"}>
                      {webhook.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleTest(webhook.id)}>
                      <Play className="h-4 w-4 text-blue-500" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleViewLogs(webhook.id)}>
                      <Activity className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(webhook)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(webhook.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {webhooks.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No webhooks configured yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingWebhook ? "Edit Webhook" : "Create New Webhook"}</DialogTitle>
            <DialogDescription>
              Configure where events should be sent.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. n8n Form Handler"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="url">Webhook URL</Label>
              <Input
                id="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://..."
              />
            </div>
            
            <div className="grid gap-2">
              <Label>Events to Trigger</Label>
              <div className="grid grid-cols-2 gap-2 border p-4 rounded-md">
                {availableEvents.map((event) => (
                  <div key={event.name} className="flex items-center space-x-2">
                    <Checkbox 
                      id={event.name} 
                      checked={formData.events.includes(event.name)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setFormData({ ...formData, events: [...formData.events, event.name] });
                        } else {
                          setFormData({ ...formData, events: formData.events.filter(e => e !== event.name) });
                        }
                      }}
                    />
                    <Label htmlFor={event.name} className="cursor-pointer">{event.name}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="headers">Custom Headers (JSON)</Label>
              <Textarea
                id="headers"
                value={formData.headers}
                onChange={(e) => setFormData({ ...formData, headers: e.target.value })}
                placeholder='{ "Authorization": "Bearer token" }'
                className="font-mono text-xs"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="payload">Custom Payload Template (JSON) - Optional</Label>
              <Textarea
                id="payload"
                value={formData.payload}
                onChange={(e) => setFormData({ ...formData, payload: e.target.value })}
                placeholder='{ "email": "{{email}}" }'
                className="font-mono text-xs"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit}>Save Webhook</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Logs Dialog */}
      <Dialog open={isLogsOpen} onOpenChange={setIsLogsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Delivery Logs</DialogTitle>
          </DialogHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Message</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selectedWebhookLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-xs">{new Date(log.createdAt).toLocaleString()}</TableCell>
                  <TableCell>
                    {log.status === "success" ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                  </TableCell>
                  <TableCell>{log.statusCode}</TableCell>
                  <TableCell>{log.duration}ms</TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">
                    {log.errorMessage || "Success"}
                  </TableCell>
                </TableRow>
              ))}
              {selectedWebhookLogs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">No logs found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    </div>
  );
}
```

### src/app/admin/settings/page.tsx
```
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetSettings, useUpdateSettings, Settings } from "@/lib/hooks/useSettings";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const settingsSchema = z.object({
  siteName: z.string().min(1, "Site name is required"),
  siteDescription: z.string().optional(),
  adminEmail: z.string().email("Invalid email address"),
  smtpHost: z.string().optional(),
  smtpPort: z.any().optional(),
  emailFromName: z.string().optional(),
  webhookUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  defaultMetaTitle: z.string().optional(),
  defaultMetaDescription: z.string().optional(),
  googleAnalyticsId: z.string().optional(),
  ai_test_models: z.array(z.string()).optional(),
  ai_seo_model: z.string().optional(),
  ai_calculator_model: z.string().optional(),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

const CITATION_TEST_MODELS = [
  { id: 'perplexity-deep', label: 'Perplexity Sonar Deep (Deep Research)' },
  { id: 'qwen-free', label: 'Qwen 3 (Free)' },
  { id: 'perplexity-sonar', label: 'Perplexity Sonar (Standard)' },
];

const SEO_CONTENT_MODELS = [
  { id: 'gemini-flash', label: 'Google Gemini 1.5 Flash' },
  { id: 'grok-fast', label: 'xAI Grok Fast' },
  { id: 'deepseek', label: 'DeepSeek V3' },
  { id: 'qwen-max', label: 'Qwen Max' },
];

const CALCULATOR_MODELS = [
  { id: 'gemini-pro', label: 'Google Gemini 1.5 Pro' },
  { id: 'qwen-max', label: 'Qwen Max' },
  { id: 'gpt-4o', label: 'GPT-5.1 (Preview/4o)' },
  { id: 'moonshot', label: 'Moonshot Kimi k2.5' },
];

export default function SettingsPage() {
  const { toast } = useToast();
  const { data: settings, isLoading } = useGetSettings();
  const updateSettingsMutation = useUpdateSettings();

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      siteName: "",
      siteDescription: "",
      adminEmail: "",
      smtpHost: "",
      smtpPort: 587,
      emailFromName: "",
      webhookUrl: "",
      defaultMetaTitle: "",
      defaultMetaDescription: "",
      googleAnalyticsId: "",
      ai_test_models: ['perplexity-deep', 'qwen-free', 'perplexity-sonar'],
      ai_seo_model: 'gemini-flash',
      ai_calculator_model: 'gemini-pro',
    },
  });

  useEffect(() => {
    if (settings) {
      form.reset({
        siteName: settings.siteName || "",
        siteDescription: settings.siteDescription || "",
        adminEmail: settings.adminEmail || "",
        smtpHost: settings.smtpHost || "",
        smtpPort: settings.smtpPort || 587,
        emailFromName: settings.emailFromName || "",
        webhookUrl: settings.webhookUrl || "",
        defaultMetaTitle: settings.defaultMetaTitle || "",
        defaultMetaDescription: settings.defaultMetaDescription || "",
        googleAnalyticsId: settings.googleAnalyticsId || "",
        ai_test_models: settings.ai_test_models || ['perplexity-deep', 'qwen-free', 'perplexity-sonar'],
        ai_seo_model: settings.ai_seo_model || 'gemini-flash',
        ai_calculator_model: settings.ai_calculator_model || 'gemini-pro',
      });
    }
  }, [settings, form]);

  const handleSubmit = async (values: SettingsFormValues) => {
    try {
      await updateSettingsMutation.mutateAsync(values as Settings);
      toast({
        title: "Success",
        description: "Settings updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      </div>

      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="siteName">Site Name</Label>
                <Input id="siteName" {...form.register("siteName")} />
                {form.formState.errors.siteName && (
                  <p className="text-sm text-destructive">{form.formState.errors.siteName.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="adminEmail">Admin Email</Label>
                <Input id="adminEmail" {...form.register("adminEmail")} />
                {form.formState.errors.adminEmail && (
                  <p className="text-sm text-destructive">{form.formState.errors.adminEmail.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="siteDescription">Site Description</Label>
              <Textarea id="siteDescription" {...form.register("siteDescription")} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Email Configuration (SMTP)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="smtpHost">SMTP Host</Label>
                <Input id="smtpHost" {...form.register("smtpHost")} placeholder="smtp.example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtpPort">SMTP Port</Label>
                <Input type="number" id="smtpPort" {...form.register("smtpPort")} placeholder="587" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emailFromName">From Name</Label>
                <Input id="emailFromName" {...form.register("emailFromName")} placeholder="Support Team" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Integrations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="webhookUrl">Pabbly Webhook URL</Label>
              <Input id="webhookUrl" {...form.register("webhookUrl")} placeholder="https://connect.pabbly.com/..." />
              <p className="text-xs text-muted-foreground">URL to send form submissions to.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
              <Input id="googleAnalyticsId" {...form.register("googleAnalyticsId")} placeholder="G-XXXXXXXXXX" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>AI Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {/* SEO Model Selection */}
            <div className="space-y-2">
              <Label htmlFor="ai_seo_model">SEO & Content Optimization Model</Label>
              <Select 
                onValueChange={(value) => form.setValue("ai_seo_model", value)}
                defaultValue={form.watch("ai_seo_model")}
                value={form.watch("ai_seo_model")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  {SEO_CONTENT_MODELS.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Used for generating FAQs, direct answers, and optimizing content.
              </p>
            </div>

            {/* Calculator Model Selection */}
            <div className="space-y-2">
              <Label htmlFor="ai_calculator_model">Hair Transplant Calculator Model</Label>
              <Select 
                onValueChange={(value) => form.setValue("ai_calculator_model", value)}
                defaultValue={form.watch("ai_calculator_model")}
                value={form.watch("ai_calculator_model")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  {CALCULATOR_MODELS.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Used for analyzing patient descriptions and estimating graft counts.
              </p>
            </div>

            {/* Citation Testing Models */}
            <div className="space-y-2">
              <Label>Citation Testing Models (Multi-select)</Label>
              <div className="grid gap-4 md:grid-cols-2 border p-4 rounded-md">
                {CITATION_TEST_MODELS.map((model) => (
                  <div key={model.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`model-${model.id}`}
                      checked={form.watch("ai_test_models")?.includes(model.id)}
                      onCheckedChange={(checked) => {
                        const current = form.getValues("ai_test_models") || [];
                        if (checked) {
                          form.setValue("ai_test_models", [...current, model.id]);
                        } else {
                          form.setValue(
                            "ai_test_models",
                            current.filter((id) => id !== model.id)
                          );
                        }
                      }}
                    />
                    <Label htmlFor={`model-${model.id}`}>{model.label}</Label>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Selected models will be used to test if your content is being cited in AI answers.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Default SEO</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="defaultMetaTitle">Default Meta Title</Label>
              <Input id="defaultMetaTitle" {...form.register("defaultMetaTitle")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="defaultMetaDescription">Default Meta Description</Label>
              <Textarea id="defaultMetaDescription" {...form.register("defaultMetaDescription")} />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" disabled={updateSettingsMutation.isPending}>
            {updateSettingsMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
```

### src/app/admin/security/page.tsx
```
"use client";

import { useSecurityLogs, useSecurityStats, useBlockedIPs, useBlockIP, useUnblockIP } from "@/lib/hooks/useSecurity";
import { DataTable } from "@/components/admin/shared/DataTable";
import { PageHeader } from "@/components/admin/shared/PageHeader";
import { StatsCard } from "@/components/admin/shared/StatsCard";
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
import {
  ShieldAlert,
  ShieldCheck,
  Ban,
  AlertTriangle,
  Activity,
  Search,
  RefreshCw,
  Unlock,
  Plus
} from "lucide-react";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function SecurityPage() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const [severity, setSeverity] = useState<string>("ALL");
  const [page, setPage] = useState(1);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  
  // Block IP Form State
  const [blockIP, setBlockIP] = useState("");
  const [blockReason, setBlockReason] = useState("");
  const [blockDuration, setBlockDuration] = useState("60"); // minutes

  const { data: logsData, isLoading: logsLoading, refetch: refetchLogs, dataUpdatedAt } = useSecurityLogs({
    search: debouncedSearch,
    severity: severity === "ALL" ? undefined : severity,
    page,
    limit: 20,
  });

  const { data: statsData } = useSecurityStats();
  const { data: blockedIPsData, refetch: refetchBlocked } = useBlockedIPs();
  
  const blockMutation = useBlockIP();
  const unblockMutation = useUnblockIP();

  const handleBlockSubmit = async () => {
    if (!blockIP || !blockReason) {
      toast({ title: "Validation Error", description: "IP and Reason are required", variant: "destructive" });
      return;
    }
    
    try {
      await blockMutation.mutateAsync({
        ip: blockIP,
        reason: blockReason,
        duration: parseInt(blockDuration),
      });
      toast({ title: "IP Blocked", description: `${blockIP} has been blocked.` });
      setBlockDialogOpen(false);
      setBlockIP("");
      setBlockReason("");
    } catch (err) {
      toast({ title: "Error", description: "Failed to block IP", variant: "destructive" });
    }
  };

  const handleUnblock = async (ip: string) => {
    try {
      await unblockMutation.mutateAsync({ ip });
      toast({ title: "IP Unblocked", description: `${ip} access restored.` });
    } catch (err) {
      toast({ title: "Error", description: "Failed to unblock IP", variant: "destructive" });
    }
  };

  const columns = [
    {
      header: "Timestamp",
      cell: (log: any) => (
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {format(new Date(log.createdAt), "MMM d, HH:mm:ss")}
        </span>
      ),
    },
    {
      header: "Event Type",
      cell: (log: any) => (
        <span className="font-mono text-xs font-medium">{log.eventType}</span>
      ),
    },
    {
      header: "Severity",
      cell: (log: any) => {
        let variant: "default" | "secondary" | "destructive" | "outline" = "outline";
        if (log.severity === 'CRITICAL' || log.severity === 'HIGH') variant = 'destructive';
        else if (log.severity === 'WARNING') variant = 'secondary';
        
        return (
          <Badge variant={variant} className="text-[10px]">
            {log.severity}
          </Badge>
        );
      }
    },
    {
      header: "IP Address",
      cell: (log: any) => (
        <span className="font-mono text-xs">{log.ipAddress}</span>
      ),
    },
    {
      header: "Details",
      cell: (log: any) => (
        <span className="text-sm truncate max-w-[300px] block" title={log.description}>
          {log.description}
        </span>
      ),
    },
    {
      header: "User",
      cell: (log: any) => (
        <span className="text-xs text-muted-foreground">
          {log.user?.email || (log.userId ? `ID: ${log.userId}` : 'Anonymous')}
        </span>
      ),
    },
  ];

  const blockedColumns = [
    { header: "IP Address", accessorKey: "ip" as const, className: "font-mono" },
    { header: "Reason", accessorKey: "reason" as const },
    { 
      header: "Blocked At", 
      cell: (item: any) => format(new Date(item.createdAt), "MMM d, HH:mm") 
    },
    { 
      header: "Expires At", 
      cell: (item: any) => item.expiresAt ? format(new Date(item.expiresAt), "MMM d, HH:mm") : "Permanent" 
    },
    {
      header: "Actions",
      cell: (item: any) => (
        <Button variant="ghost" size="sm" onClick={() => handleUnblock(item.ip)}>
          <Unlock className="mr-2 h-3 w-3" /> Unblock
        </Button>
      )
    }
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Security & Logs"
        subtitle="Monitor system activity and manage access control."
        actions={
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <RefreshCw className="h-3 w-3 animate-spin" style={{ animationDuration: '3s' }} />
            Updated: {dataUpdatedAt ? format(new Date(dataUpdatedAt), "HH:mm:ss") : "Never"}
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-4">
        <StatsCard
          title="Failed Logins (24h)"
          value={statsData?.failedLogins || 0}
          icon={AlertTriangle}
          className="border-red-200 bg-red-50/30"
        />
        <StatsCard
          title="Rate Limit Hits"
          value={statsData?.rateLimitHits || 0}
          icon={Activity}
        />
        <StatsCard
          title="Active Sessions"
          value={statsData?.activeSessions || 0}
          icon={ShieldCheck}
          className="border-green-200 bg-green-50/30"
        />
        <StatsCard
          title="Blocked IPs"
          value={blockedIPsData?.length || 0}
          icon={Ban}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Security Logs</h2>
          <div className="flex gap-2">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                className="pl-8 h-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={severity} onValueChange={setSeverity}>
              <SelectTrigger className="w-[150px] h-9">
                <SelectValue placeholder="Severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Levels</SelectItem>
                <SelectItem value="CRITICAL">Critical</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="WARNING">Warning</SelectItem>
                <SelectItem value="INFO">Info</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={logsData?.logs || []}
          isLoading={logsLoading}
          pagination={{
            page,
            limit: 20,
            total: logsData?.meta?.total || 0,
            pages: logsData?.meta?.pages || 1,
          }}
          onPageChange={setPage}
          emptyTitle="No logs found"
          emptyDescription="Security events will appear here in real-time."
        />
      </div>

      <div className="space-y-4 pt-8 border-t">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-red-600 flex items-center gap-2">
            <Ban className="h-5 w-5" /> Blocked IP Addresses
          </h2>
          <Dialog open={blockDialogOpen} onOpenChange={setBlockDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Plus className="mr-2 h-4 w-4" /> Block IP
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Block IP Address</DialogTitle>
                <DialogDescription>
                  Prevent an IP address from accessing the API.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="ip">IP Address</Label>
                  <Input id="ip" value={blockIP} onChange={(e) => setBlockIP(e.target.value)} placeholder="192.168.1.1" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="reason">Reason</Label>
                  <Input id="reason" value={blockReason} onChange={(e) => setBlockReason(e.target.value)} placeholder="Suspicious activity" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Select value={blockDuration} onValueChange={setBlockDuration}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="60">1 Hour</SelectItem>
                      <SelectItem value="1440">24 Hours</SelectItem>
                      <SelectItem value="10080">7 Days</SelectItem>
                      <SelectItem value="525600">Permanent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setBlockDialogOpen(false)}>Cancel</Button>
                <Button variant="destructive" onClick={handleBlockSubmit} disabled={blockMutation.isPending}>Block IP</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <DataTable
          columns={blockedColumns}
          data={blockedIPsData || []}
          isLoading={false} // Assume fast load or use query state
          emptyTitle="No blocked IPs"
          emptyDescription="There are no actively blocked IP addresses."
        />
      </div>
    </div>
  );
}
```

### src/app/admin/layout.tsx
```
"use client";

import { Sidebar } from "@/components/admin/Sidebar";
import { Header } from "@/components/admin/Header";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getSession, useSession } from "next-auth/react";
import { useAuthStore } from "@/lib/store/authStore";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { status, data } = useSession();
  const { login, logout, initialize } = useAuthStore();
  const [adminReady, setAdminReady] = useState(false);

  const isLoginRoute = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginRoute) return;
    if (status === "unauthenticated") {
      logout();
      router.replace("/admin/login");
    }
  }, [isLoginRoute, logout, router, status]);

  // Hydrate Zustand with Payload JWT before admin children fetch APIs (accessToken is not persisted)
  useEffect(() => {
    if (isLoginRoute) {
      setAdminReady(true);
      return;
    }

    if (status === "loading") return;

    let cancelled = false;

    async function hydrateAuth() {
      if (status === "unauthenticated") {
        if (!cancelled) setAdminReady(true);
        return;
      }

      try {
        const session = await getSession();
        if (cancelled) return;

        if (session?.user?.accessToken) {
          login(session.user.accessToken, {
            id: String(session.user.id ?? ""),
            name: session.user.name || "Admin",
            email: session.user.email || "",
            role: (session.user.role || "ADMIN") as
              | "SUPER_ADMIN"
              | "ADMIN"
              | "EDITOR"
              | "USER",
            avatar: session.user.image || undefined,
          });
          if (!cancelled) setAdminReady(true);
          return;
        }

        if (typeof window !== "undefined") {
          const stored = localStorage.getItem("admin_token");
          if (stored) {
            useAuthStore.getState().setAccessToken(stored);
            await initialize();
            if (!cancelled) setAdminReady(true);
            return;
          }
        }

        await initialize();
      } finally {
        if (!cancelled) setAdminReady(true);
      }
    }

    hydrateAuth();
    return () => {
      cancelled = true;
    };
  }, [isLoginRoute, status, login, initialize]);

  // Legacy: keep store in sync when useSession updates (e.g. token refresh)
  useEffect(() => {
    if (status !== "authenticated" || !data?.user?.accessToken) return;
    login(data.user.accessToken, {
      id: data.user.id,
      name: data.user.name || "Admin",
      email: data.user.email || "",
      role: data.user.role as
        | "SUPER_ADMIN"
        | "ADMIN"
        | "EDITOR"
        | "USER",
      avatar: data.user.image || undefined,
    });
  }, [data?.user, login, status]);

  if (isLoginRoute) {
    return <>{children}</>;
  }

  if (status === "loading" || !adminReady) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-slate-50/50">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-sm">Loading admin…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full bg-slate-50/50">
      <div className="hidden md:block fixed inset-y-0 left-0 z-10 flex w-[260px] flex-col">
        <Sidebar className="h-full w-[260px] min-h-0" />
      </div>
      <div className="flex flex-col md:pl-[260px] w-full min-h-screen">
        <Header />
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
```

### src/components/admin/Sidebar.tsx
```
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  FileText,
  Image as ImageIcon,
  ShoppingBag,
  MessageSquare,
  Users,
  Search,
  Settings,
  ShieldAlert,
  BarChart3,
  Menu,
  LogOut,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useState } from "react";
import { signOut, useSession } from "next-auth/react";

const sidebarNavItems = [
  {
    title: "Content",
    items: [
      {
        title: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
      },
      {
        title: "Posts",
        href: "/admin/posts",
        icon: FileText,
      },
      {
        title: "Pages",
        href: "/admin/pages",
        icon: Globe,
      },
      {
        title: "Media",
        href: "/admin/media",
        icon: ImageIcon,
      },
    ],
  },
  {
    title: "Business",
    items: [
      {
        title: "Products",
        href: "/admin/products",
        icon: ShoppingBag,
      },
      {
        title: "Form Submissions",
        href: "/admin/forms",
        icon: MessageSquare,
      },
      {
        title: "Leads",
        href: "/admin/leads",
        icon: Users,
      },
      {
        title: "Lead optimization",
        href: "/admin/leads/dashboard",
        icon: Users,
      },
      {
        title: "Bulk scoring",
        href: "/admin/leads/scoring",
        icon: Users,
      },
    ],
  },
  {
    title: "Optimization",
    items: [
      {
        title: "SEO",
        href: "/admin/seo",
        icon: Search,
      },
      {
        title: "SEO Keywords",
        href: "/admin/seo/keywords",
        icon: Search,
      },
      {
        title: "AI Citations",
        href: "/admin/seo/citations",
        icon: Search,
      },
      {
        title: "Analytics",
        href: "/admin/analytics",
        icon: BarChart3,
      },
      {
        title: "Campaigns",
        href: "/admin/analytics/campaigns",
        icon: BarChart3,
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        title: "Integrations",
        href: "/admin/integrations",
        icon: Globe,
      },
      {
        title: "Settings",
        href: "/admin/settings",
        icon: Settings,
      },
      {
        title: "Security",
        href: "/admin/security",
        icon: ShieldAlert,
      },
    ],
  },
];

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { data } = useSession();
  const user = data?.user;

  const displayEmail = user?.email ?? "";
  const displayName = user?.name ?? "";
  const initial =
    (displayEmail[0] || displayName[0] || "A").toUpperCase();

  return (
    <div
      className={cn(
        "flex h-full min-h-0 flex-col bg-slate-900 text-slate-100 border-r border-slate-800",
        className
      )}
    >
      <div className="shrink-0 px-4 pt-4 pb-3">
        <h2 className="px-2 text-lg font-semibold tracking-tight text-white flex items-center gap-2">
          <span className="h-6 w-6 shrink-0 rounded-md bg-indigo-500" />
          AHL Admin
        </h2>
      </div>

      <nav
        className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-3 pb-2"
        aria-label="Admin navigation"
      >
        <div className="space-y-6 pt-2">
          {sidebarNavItems.map((group, i) => (
            <div key={i}>
              <h3 className="mb-2 px-4 text-xs font-semibold uppercase text-slate-400 tracking-wider">
                {group.title}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <Button
                    key={item.href}
                    variant={pathname === item.href ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      pathname === item.href
                        ? "bg-indigo-600 text-white hover:bg-indigo-700"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    )}
                    asChild
                  >
                    <Link href={item.href}>
                      <item.icon className="mr-2 h-4 w-4 shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>

      <div className="shrink-0 border-t border-slate-800 bg-slate-900 px-4 pt-3 pb-4 space-y-3">
        <div className="flex gap-3 min-w-0">
          <div className="h-9 w-9 shrink-0 rounded-full bg-slate-700 flex items-center justify-center text-sm font-medium text-white">
            {initial}
          </div>
          <div className="min-w-0 flex-1 space-y-0.5">
            {displayEmail ? (
              <p
                className="text-sm font-medium text-white leading-snug break-all line-clamp-2"
                title={displayEmail}
              >
                {displayEmail}
              </p>
            ) : (
              <p className="text-sm font-medium text-white truncate">
                {displayName || "Admin"}
              </p>
            )}
            {displayName && displayEmail && displayName !== displayEmail && (
              <p className="text-xs text-slate-400 truncate" title={displayName}>
                {displayName}
              </p>
            )}
            <p className="text-xs text-slate-400 truncate">
              {(user?.role ?? "ADMIN").toLowerCase().replace(/_/g, " ")}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-center sm:justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
        >
          <LogOut className="mr-2 h-4 w-4 shrink-0" />
          Log out
        </Button>
      </div>
    </div>
  );
}

export function MobileSidebar() {
  const [open, setOpen] = useState(false);
  
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="md:hidden">
          <Menu />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="flex w-[280px] flex-col p-0 bg-slate-900 border-r-slate-800"
      >
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <Sidebar className="h-full min-h-0 w-full" />
      </SheetContent>
    </Sheet>
  );
}
```

### src/lib/api/endpoints.ts
```
import { apiClient } from "./client";

export interface PostFilters {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
  search?: string;
  sort?: string;
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  // Tracking
  sessionId?: string;
  campaignName?: string;
  adSetName?: string;
  adName?: string;
  campaignSource?: string;
  placement?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

export const api = {
  // Posts
  getPosts: async (filters: PostFilters = {}) => {
    const { data } = await apiClient.get("/posts", { params: filters });
    return data.data;
  },

  getPostBySlug: async (slug: string) => {
    const { data } = await apiClient.get(`/posts/slug/${slug}`);
    return data.data.post;
  },

  getPostById: async (id: number) => {
    const { data } = await apiClient.get(`/posts/${id}`);
    return data.data.post;
  },

  getRelatedPosts: async (slug: string) => {
    const { data } = await apiClient.get(`/posts/${slug}/related`);
    return data.data.posts;
  },

  createPost: async (payload: any) => {
    const { data } = await apiClient.post("/posts", payload);
    return data.data;
  },

  updatePost: async (id: number, payload: any) => {
    const { data } = await apiClient.put(`/posts/${id}`, payload);
    return data.data;
  },

  deletePost: async (id: number) => {
    const { data } = await apiClient.delete(`/posts/${id}`);
    return data.data;
  },

  // Products
  getProducts: async (filters: ProductFilters = {}) => {
    const { data } = await apiClient.get("/products", { params: filters });
    return data.data;
  },

  getProductBySlug: async (slug: string) => {
    const { data } = await apiClient.get("/products", { params: { slug, limit: 1 } });
    if (data.data.products.length > 0) return data.data.products[0];
    throw new Error("Product not found");
  },

  getProductById: async (id: number) => {
    const { data } = await apiClient.get(`/products/${id}`);
    return data.data.product;
  },

  // Forms
  submitContactForm: async (formData: ContactFormData) => {
    // Correcting the endpoint to match backend definition: /api/forms/submit
    const { data } = await apiClient.post("/forms/submit", formData);
    return data;
  },

  subscribeNewsletter: async (email: string) => {
    const { data } = await apiClient.post("/forms/newsletter", { email });
    return data;
  },

  // Analytics
  getAnalytics: async (params: { from: Date; to: Date }) => {
    const { data } = await apiClient.get("/analytics/overview", {
      params: {
        startDate: params.from.toISOString(),
        endDate: params.to.toISOString(),
      },
    });
    return data.data;
  },

  trackPageView: async (path: string) => {
    apiClient.post("/analytics/pageview", { path }).catch(() => { });
  },

  trackAdClick: async (payload: any) => {
    const { data } = await apiClient.post("/tracking/click", payload);
    return data;
  },

  trackConversion: async (payload: any) => {
    const { data } = await apiClient.post("/tracking/conversion", payload);
    return data;
  },

  // Webhooks
  getWebhooks: async () => {
    const { data } = await apiClient.get("/webhooks");
    return data.data;
  },

  getWebhook: async (id: string) => {
    const { data } = await apiClient.get(`/webhooks/${id}`);
    return data.data;
  },

  createWebhook: async (payload: any) => {
    const { data } = await apiClient.post("/webhooks", payload);
    return data.data;
  },

  updateWebhook: async (id: string, payload: any) => {
    const { data } = await apiClient.put(`/webhooks/${id}`, payload);
    return data.data;
  },

  deleteWebhook: async (id: string) => {
    const { data } = await apiClient.delete(`/webhooks/${id}`);
    return data;
  },

  testWebhook: async (id: string) => {
    const { data } = await apiClient.post(`/webhooks/${id}/test`);
    return data;
  },

  getWebhookLogs: async (id: string) => {
    const { data } = await apiClient.get(`/webhooks/${id}/logs`);
    return data.data;
  },

  getWebhookEvents: async () => {
    const { data } = await apiClient.get("/webhooks/events");
    return data.data;
  },

  getIntegrationPresets: async () => {
    const { data } = await apiClient.get("/webhooks/presets");
    return data.data;
  },

  // SEO
  getSeoOverview: async () => {
    const { data } = await apiClient.get("/search-optimization/overview");
    return data.data;
  },

  runBulkSeoAnalysis: async () => {
    const { data } = await apiClient.post("/search-optimization/analyze-all");
    return data.data;
  },

  analyzePost: async (id: number) => {
    const { data } = await apiClient.post(`/search-optimization/analyze/${id}`);
    return data.data;
  },

  getSeoAnalysis: async (id: number) => {
    const { data } = await apiClient.get(`/search-optimization/analysis/${id}`);
    return data.data;
  },

  generateSchema: async (id: number) => {
    const { data } = await apiClient.post(`/search-optimization/schema/${id}`);
    return data.data;
  },

  getLinkSuggestions: async (id: number) => {
    const { data } = await apiClient.get(`/search-optimization/links/suggestions/${id}`);
    return data.data;
  },

  createInternalLink: async (payload: any) => {
    const { data } = await apiClient.post("/search-optimization/links", payload);
    return data.data;
  },

  trackKeyword: async (payload: any) => {
    const { data } = await apiClient.post("/search-optimization/keywords/track", payload);
    return data.data;
  },

  getTrackedKeywords: async () => {
    const { data } = await apiClient.get("/search-optimization/keywords");
    return data.data;
  },

  getKeywordHistory: async (keyword: string) => {
    const { data } = await apiClient.get(`/search-optimization/keywords/${keyword}/history`);
    return data.data;
  },

  // AI SEO
  optimizePostForAi: async (id: number) => {
    const { data } = await apiClient.post(`/ai-seo/optimize/${id}`);
    return data.data;
  },

  testAiCitation: async (id: number, queries?: string[]) => {
    const { data } = await apiClient.post(`/ai-seo/test-citation/${id}`, { queries });
    return data.data;
  },

  getAiDashboard: async () => {
    const { data } = await apiClient.get("/ai-seo/dashboard");
    return data.data;
  },

  getCitationHistory: async (id: number) => {
    const { data } = await apiClient.get(`/ai-seo/citation-history/${id}`);
    return data.data;
  },

  analyzeDraft: async (payload: any) => {
    // Keep using general SEO controller for this if needed, or move to AI SEO
    const { data } = await apiClient.post("/search-optimization/analyze-draft", payload);
    return data.data;
  },

  autosavePost: async (id: number, payload: { blocksData?: string; content?: string }) => {
    const { data } = await apiClient.patch(`/posts/${id}/autosave`, payload);
    return data.data;
  },

  // Lead Scoring
  getHotLeads: async (limit: number = 10) => {
    const { data } = await apiClient.get("/lead-scoring/hot-leads", { params: { limit } });
    const body = data.data as { leads?: unknown[] } | unknown[] | undefined;
    if (Array.isArray(body)) {
      return body;
    }
    if (body && typeof body === "object" && Array.isArray((body as { leads?: unknown[] }).leads)) {
      return (body as { leads: unknown[] }).leads;
    }
    return [];
  },

  getLeadScore: async (formSubmissionId: number) => {
    const { data } = await apiClient.get(`/lead-scoring/score/${formSubmissionId}`);
    return data.data;
  },

  scoreLead: async (formSubmissionId: number) => {
    const { data } = await apiClient.post(`/lead-scoring/score/${formSubmissionId}`);
    return data.data;
  },

  bulkScoreLeads: async () => {
    const { data } = await apiClient.post("/lead-scoring/score-all");
    return data.data;
  },

  trackEvent: async (payload: any) => {
    const { data } = await apiClient.post("/lead-scoring/track/event", payload);
    return data.data;
  },

  recordExitIntent: async (data: any) => {
    return apiClient.post("/lead-scoring/track/exit-intent", data);
  },

  trackAbandonment: async (payload: any) => {
    const { data } = await apiClient.post("/lead-scoring/track/abandonment", payload);
    return data.data;
  },

  // Calculator
  calculateCost: async (payload: any) => {
    const { data } = await apiClient.post("/calculator/cost", payload);
    return data.data;
  },

  estimateGraftsWithAi: async (description: string) => {
    const { data } = await apiClient.post("/calculator/estimate-grafts", { description });
    return data.data;
  },

  saveCalculatorUsage: async (payload: any) => {
    const { data } = await apiClient.post("/calculator/save", payload);
    return data.data;
  },

  // Behavioral & Conversion
  trackBehavioralTrigger: async (payload: any) => {
    const { data } = await apiClient.post("/lead-optimization/track/trigger", payload);
    return data.data;
  },

  getTriggerRules: async (page: string, behavior: any) => {
    try {
      const { data } = await apiClient.post("/lead-optimization/triggers/rules", behavior, { params: { page } });
      return data.data;
    } catch (err: any) {
      // Gracefully handle network errors so they don't break admin pages
      console.warn("getTriggerRules network error:", err?.message || err);
      return { rules: [] };
    }
  },

  trackConversionEvent: async (payload: any) => {
    const { data } = await apiClient.post("/lead-optimization/track/conversion", payload);
    return data.data;
  },

  getOptimizationDashboard: async (days: number = 30) => {
    const { data } = await apiClient.get("/lead-optimization/dashboard", { params: { days } });
    return data.data;
  },

  getExitIntentContent: async (page: string, device: string) => {
    const { data } = await apiClient.get("/lead-optimization/exit-intent/content", { params: { page, device } });
    return data.data;
  },
};
```

### src/lib/api/leads.service.ts
```
import { apiClient } from './client';

const handleResponse = (promise: Promise<any>) => {
  return promise
    .then(res => res.data)
    .catch(err => ({
      success: false,
      message: err.message || 'Operation failed',
      errors: err.errors || []
    }));
};

export const leadsService = {
  getLeads: async ({ page = 1, limit = 20, search = '', status = '' }) => {
    return handleResponse(
      apiClient.get('/lead-scoring/hot-leads', {
        params: { page, limit, search, status, threshold: 70 },
      })
    );
  },

  getLead: async (id: number) => {
    return handleResponse(apiClient.get(`/lead-scoring/score/${id}`));
  },

  updateLeadStatus: async (id: number | string, status: string) => {
    return handleResponse(
      apiClient.patch(`/form-submissions/${id}`, { leadStatus: status })
    );
  },

  trackEvent: async (eventData: any) => {
    return handleResponse(apiClient.post('/lead-scoring/track/event', eventData));
  },
  
  trackExitIntent: async (data: any) => {
    return handleResponse(apiClient.post('/lead-scoring/track/exit-intent', data));
  }
};
```

### src/lib/api/posts.service.ts
```
import { apiClient } from "./client";

type PayloadList<T> = {
  docs?: T[];
  totalDocs?: number;
  totalPages?: number;
  page?: number;
  limit?: number;
};

function mapPostForAdmin(doc: Record<string, unknown>) {
  const heroImage = doc.heroImage as
    | { url?: string; sizes?: { thumbnail?: { url?: string } } }
    | { id?: number | string; url?: string; sizes?: { thumbnail?: { url?: string } } }
    | string
    | null
    | undefined;
  let featuredImage: string | undefined;
  let heroImageId: number | string | undefined;
  if (typeof heroImage === "string") {
    featuredImage = heroImage;
  } else if (heroImage && typeof heroImage === "object") {
    featuredImage =
      heroImage.url ||
      heroImage.sizes?.thumbnail?.url ||
      undefined;
    heroImageId =
      "id" in heroImage &&
      (typeof heroImage.id === "number" || typeof heroImage.id === "string")
        ? heroImage.id
        : undefined;
  }

  const author = doc.author as { name?: string; email?: string } | number | null;

  const rawStatus =
    (doc._status as string) || (doc.status as string) || "draft";

  return {
    ...doc,
    id: doc.id,
    title: typeof doc.title === "string" ? doc.title : String(doc.title ?? ""),
    slug: typeof doc.slug === "string" ? doc.slug : String(doc.slug ?? ""),
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
    content: doc.content,
    status: rawStatus.toUpperCase(),
    _status: doc._status,
    featuredImage,
    heroImageId,
    metaTitle: doc.metaTitle,
    metaDescription: doc.metaDescription,
    focusKeyword: doc.focusKeyword,
    tags: doc.tags,
    author:
      typeof author === "object" && author !== null
        ? { name: author.name, email: author.email }
        : author,
  };
}

function mapPayloadPostsList(raw: PayloadList<Record<string, unknown>>) {
  const docs = raw.docs ?? [];
  return {
    success: true as const,
    data: {
      posts: docs.map((d) => mapPostForAdmin(d)),
      pagination: {
        total: raw.totalDocs ?? 0,
        pages: raw.totalPages ?? 1,
        page: raw.page ?? 1,
        limit: raw.limit ?? docs.length,
      },
    },
  };
}

const handleError = (err: { message?: string; errors?: unknown }) => ({
  success: false as const,
  message: err.message || "Operation failed",
  errors: err.errors || [],
});

export const postsService = {
  getPosts: async ({
    page = 1,
    limit = 10,
    search = "",
    sortBy = "createdAt",
    order = "desc",
    status = "",
    categorySlug = "",
    tagSlug = "",
  }: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    order?: string;
    status?: string;
    categorySlug?: string;
    tagSlug?: string;
  } = {}) => {
    try {
      const sortField = sortBy || "createdAt";
      const sortParam = order === "asc" ? sortField : `-${sortField}`;
      const params: Record<string, string | number> = {
        page,
        limit,
        sort: sortParam,
        depth: 1,
      };
      if (search) {
        params["where[or][0][title][like]"] = search;
        params["where[or][1][slug][like]"] = search;
      }
      if (status && status !== "ALL") {
        const s = status.toLowerCase();
        if (s === "published" || s === "draft" || s === "archived") {
          params["where[_status][equals]"] = s;
        }
      }
      if (categorySlug) params["where[category][equals]"] = categorySlug;
      if (tagSlug) params["where[tags][contains]"] = tagSlug;

      const { data } = await apiClient.get<PayloadList<Record<string, unknown>>>(
        "/posts",
        { params }
      );
      return mapPayloadPostsList(data);
    } catch (e: unknown) {
      return handleError(e as { message?: string; errors?: unknown });
    }
  },

  getPost: async (slug: string) => {
    try {
      const isNumericId = /^\d+$/.test(String(slug));
      if (isNumericId) {
        const { data } = await apiClient.get<Record<string, unknown>>(
          `/posts/${slug}`,
          { params: { depth: 2 } }
        );
        return {
          success: true as const,
          data: mapPostForAdmin(data as Record<string, unknown>),
        };
      }
      const { data } = await apiClient.get<PayloadList<Record<string, unknown>>>(
        "/posts",
        {
          params: {
            "where[slug][equals]": slug,
            limit: 1,
            depth: 2,
          },
        }
      );
      const doc = data.docs?.[0];
      if (!doc) {
        return { success: false as const, message: "Post not found" };
      }
      return {
        success: true as const,
        data: mapPostForAdmin(doc),
      };
    } catch (e: unknown) {
      return handleError(e as { message?: string; errors?: unknown });
    }
  },

  createPost: async (data: Record<string, unknown>) => {
    try {
      const { data: created } = await apiClient.post("/posts", data);
      return { success: true as const, data: created };
    } catch (e: unknown) {
      return handleError(e as { message?: string; errors?: unknown });
    }
  },

  updatePost: async (id: number, data: Record<string, unknown>) => {
    try {
      const { data: updated } = await apiClient.patch(`/posts/${id}`, data);
      return { success: true as const, data: updated };
    } catch (e: unknown) {
      return handleError(e as { message?: string; errors?: unknown });
    }
  },

  deletePost: async (id: number) => {
    try {
      const { data } = await apiClient.delete(`/posts/${id}`);
      return { success: true as const, data };
    } catch (e: unknown) {
      return handleError(e as { message?: string; errors?: unknown });
    }
  },

  uploadPostImage: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await apiClient.post("/media", formData);
      return { success: true as const, data };
    } catch (e: unknown) {
      return handleError(e as { message?: string; errors?: unknown });
    }
  },
};
```

### src/lib/api/media.service.ts
```
import { apiClient } from './client';

type PayloadList<T> = {
  docs?: T[];
  totalDocs?: number;
  totalPages?: number;
  page?: number;
  limit?: number;
};

function mapMediaDoc(doc: Record<string, unknown>) {
  const url = typeof doc.url === 'string' ? doc.url : '';
  const alt = doc.alt;
  return {
    ...doc,
    id: doc.id,
    url,
    /** Admin UI field name */
    altText: typeof alt === 'string' ? alt : '',
    title: doc.title ?? '',
    caption: doc.caption ?? '',
    description: doc.description ?? '',
  };
}

export const mediaService = {
  /** Payload upload: POST /api/media (multipart `file` + required `alt`). */
  uploadFile: async (file: File, _folder = 'general') => {
    try {
      const formData = new FormData();
      const baseName = file.name.replace(/\.[^.]+$/, "").trim();
      
      const payloadData: Record<string, string> = {
        alt: 'Uploaded image'
      };
      if (baseName) {
        payloadData.title = baseName;
      }
      
      // Payload CMS 3.x parses complex or standard document fields for uploads from `_payload`.
      formData.append('_payload', JSON.stringify(payloadData));
      
      formData.append('file', file);
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("admin_token")
          : null;
      const res = await fetch('/api/media', {
        method: 'POST',
        body: formData,
        credentials: 'include',
        headers: token ? { Authorization: `JWT ${token}` } : undefined,
      });
      const body = (await res.json().catch(() => ({}))) as Record<string, unknown>;
      console.log('UPLOAD ERROR BODY (JSON):', JSON.stringify(body, null, 2));
      if (!res.ok) {
        const firstError = Array.isArray(body.errors) && body.errors.length > 0
          ? body.errors[0]
          : null;
        const top =
          typeof body.message === "string"
            ? body.message
            : typeof body.error === "string"
              ? body.error
              : "Upload failed";
        const detail =
          firstError &&
          typeof firstError === "object" &&
          "message" in firstError &&
          typeof (firstError as { message?: unknown }).message === "string"
            ? String((firstError as { message: string }).message)
            : firstError &&
                typeof firstError === "object" &&
                "data" in firstError &&
                Array.isArray((firstError as { data?: unknown }).data) &&
                (firstError as { data: Array<Record<string, unknown>> }).data.length > 0 &&
                typeof (firstError as { data: Array<Record<string, unknown>> }).data[0]?.message === "string"
              ? String((firstError as { data: Array<Record<string, unknown>> }).data[0].message)
            : "";
        return {
          success: false as const,
          message: detail ? `${top}: ${detail}` : top,
        };
      }
      const data = body;
      const mapped = mapMediaDoc(data);
      return {
        success: true as const,
        data: {
          url: mapped.url,
          media: [mapped],
        },
      };
    } catch (e: unknown) {
      const msg = e && typeof e === 'object' && 'message' in e ? String((e as { message: string }).message) : 'Upload failed';
      return { success: false as const, message: msg };
    }
  },

  getMedia: async ({ page = 1, limit = 20 }: { page?: number; limit?: number; folder?: string } = {}) => {
    const { data } = await apiClient.get<PayloadList<Record<string, unknown>>>('/media', {
      params: {
        page,
        limit,
        sort: '-createdAt',
        depth: 1,
      },
    });
    const docs = (data.docs ?? []).map((d) => mapMediaDoc(d));
    return {
      success: true as const,
      data: {
        media: docs,
        meta: {
          total: data.totalDocs ?? 0,
          page: data.page ?? page,
          limit: data.limit ?? limit,
          pages: data.totalPages ?? 1,
        },
      },
    };
  },

  deleteMedia: async (id: number) => {
    const { data } = await apiClient.delete(`/media/${id}`);
    return { success: true as const, data };
  },

  /** Maps admin `altText` → Payload `alt`. */
  updateMedia: async (id: number, data: Record<string, unknown>) => {
    const payload: Record<string, unknown> = { ...data };
    if ('altText' in payload) {
      payload.alt = payload.altText;
      delete payload.altText;
    }
    const { data: updated } = await apiClient.patch(`/media/${id}`, payload);
    return { success: true as const, data: updated };
  },

  /** Server route: GET /api/media/:id/usage */
  getMediaUsage: async (id: number) => {
    try {
      const { data: body } = await apiClient.get<{ data?: { usage?: unknown[] } }>(
        `/media/${id}/usage`
      );
      const usage = body?.data?.usage ?? (body as { usage?: unknown[] })?.usage ?? [];
      return {
        success: true as const,
        data: { usage: Array.isArray(usage) ? usage : [] },
      };
    } catch {
      return {
        success: true as const,
        data: { usage: [] as unknown[] },
      };
    }
  },

  /** Server route: GET /api/media/audit/unused */
  getUnusedMedia: async () => {
    const { data: body } = await apiClient.get("/media/audit/unused");
    const payload = body as {
      success?: boolean;
      data?: { media?: Record<string, unknown>[]; meta?: Record<string, unknown> };
    };
    const inner = payload.data;
    const raw = inner?.media ?? [];
    const media = Array.isArray(raw) ? raw.map((d) => mapMediaDoc(d)) : [];
    const meta = inner?.meta ?? {
      total: media.length,
      page: 1,
      limit: media.length,
      pages: 1,
    };
    return {
      success: true as const,
      data: { media, meta },
    };
  },

  deleteBulkMedia: async (ids: number[]) => {
    const { data: body } = await apiClient.post("/media/bulk-delete", { ids });
    const payload = body as { data?: { deletedCount?: number } };
    const n = payload?.data?.deletedCount ?? 0;
    return { success: true as const, data: { deletedCount: n } };
  },
};
```

### src/lib/api/security.service.ts
```
import { apiClient } from './client';

const handleResponse = (promise: Promise<any>) => {
  return promise
    .then(res => res.data)
    .catch(err => ({
      success: false,
      message: err.message || 'Operation failed',
      errors: err.errors || []
    }));
};

export const securityService = {
  getSecurityLogs: async ({ page = 1, limit = 20, severity = '', eventType = '', startDate = '', endDate = '', search = '' }) => {
    const params: Record<string, string | number> = { page, limit };
    if (eventType) params.eventType = eventType;
    if (severity) params.eventLevel = severity;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (search) params.search = search;
    return handleResponse(apiClient.get('/security/logs/security', { params }));
  },

  getBlockedIPs: async () => {
    return handleResponse(apiClient.get('/security/blocked-ips'));
  },

  blockIP: async (ip: string, reason: string, durationMinutes: number) => {
    return handleResponse(apiClient.post('/security/block-ip', { ip, reason, durationMinutes }));
  },

  unblockIP: async (ip: string) => {
    return handleResponse(apiClient.post('/security/unblock-ip', { ip }));
  },
  
  getStats: async () => {
    return handleResponse(apiClient.get('/security/dashboard'));
  }
};
```

### src/lib/hooks/useLeads.ts
```
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadsService } from '../api/leads.service';

export const useLeads = (filters: any = {}) => {
  return useQuery({
    queryKey: ['leads', filters],
    queryFn: async () => {
      const res = (await leadsService.getLeads(filters)) as {
        success?: boolean;
        message?: string;
        data?: { leads?: unknown[]; meta?: Record<string, unknown> };
      };
      if (res?.success === false) {
        throw new Error(res.message || 'Failed to fetch leads');
      }
      const payload = res?.data;
      if (payload?.leads && payload.meta) {
        return { leads: payload.leads, meta: payload.meta };
      }
      return { leads: [], meta: { total: 0, pages: 1, page: 1, limit: 20 } };
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useLead = (id: number) => {
  return useQuery({
    queryKey: ['lead', id],
    queryFn: async () => {
      const res = await leadsService.getLead(id);
      if (res.success === false) {
        throw new Error(res.message || 'Failed to fetch lead');
      }
      return res.data;
    },
    enabled: !!id,
  });
};

export const useUpdateLeadStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => 
      leadsService.updateLeadStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    }
  });
};
```

### src/lib/hooks/usePosts.ts
```
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { postsService } from '../api/posts.service';
import { parseApiError } from '../utils/errorHandler';

export const usePosts = (filters: any = {}) => {
  return useQuery({
    queryKey: ['posts', filters],
    queryFn: async () => {
      const res = await postsService.getPosts(filters);
      if (res.success === false) {
        throw new Error(res.message || 'Failed to fetch posts');
      }
      return res.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const usePost = (slug: string) => {
  return useQuery({
    queryKey: ['post', slug],
    queryFn: async () => {
      const res = await postsService.getPost(slug);
      if (res.success === false) {
        throw new Error(res.message || 'Failed to fetch post');
      }
      return res.data;
    },
    enabled: !!slug,
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: postsService.createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (err) => {
      console.error(parseApiError(err));
    }
  });
};

export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => postsService.updatePost(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post', variables.id] });
    }
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postsService.deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    }
  });
};
```

### src/lib/hooks/usePages.ts
```
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api';

type PagesListResponse = {
  pages: Record<string, unknown>[];
  pagination: { total: number; pages: number; page?: number; limit?: number };
};

function mapPayloadList(data: Record<string, unknown>): PagesListResponse {
  const docs = (data.docs as Record<string, unknown>[]) ?? [];
  return {
    pages: docs,
    pagination: {
      total: (data.totalDocs as number) ?? 0,
      pages: (data.totalPages as number) ?? 1,
      page: data.page as number | undefined,
      limit: data.limit as number | undefined,
    },
  };
}

/** Payload REST returns `{ docs, totalDocs }` at the root; some proxies wrap as `{ data: { docs } }`. */
function normalizeListPayload(body: unknown): Record<string, unknown> {
  if (body && typeof body === "object") {
    const o = body as Record<string, unknown>;
    if ("docs" in o) return o;
    const inner = o.data;
    if (inner && typeof inner === "object" && "docs" in (inner as object)) {
      return inner as Record<string, unknown>;
    }
  }
  return {};
}

const fetchPages = async (filters: Record<string, unknown> = {}) => {
  const page = typeof filters.page === 'number' ? filters.page : Number(filters.page) || 1;
  const limit = typeof filters.limit === 'number' ? filters.limit : Number(filters.limit) || 10;
  const search = typeof filters.search === 'string' ? filters.search : '';
  const status = typeof filters.status === 'string' ? filters.status : '';

  const params: Record<string, string | number> = {
    page,
    limit,
    sort: '-updatedAt',
    depth: 1,
  };
  if (search) params['where[title][contains]'] = search;
  if (status && status !== 'ALL') {
    params['where[status][equals]'] = status;
  }

  const { data } = await api.get<unknown>('/pages', { params });
  const normalized = normalizeListPayload(data);
  if (normalized.docs && Array.isArray(normalized.docs)) {
    return mapPayloadList(normalized as Record<string, unknown>);
  }
  return { pages: [], pagination: { total: 0, pages: 1 } };
};

const fetchPage = async (id: string | number) => {
  const { data } = await api.get<Record<string, unknown>>(`/pages/${id}`, {
    params: { depth: 1 },
  });
  if (data && typeof data === "object" && "doc" in data && (data as { doc?: unknown }).doc) {
    return (data as { doc: Record<string, unknown> }).doc;
  }
  return data;
};

export function usePages(params: Record<string, unknown> = {}) {
  return useQuery({
    queryKey: ['pages', params],
    queryFn: () => fetchPages(params),
  });
}

export function usePage(id: string | number) {
  return useQuery({
    queryKey: ['page', id],
    queryFn: () => fetchPage(id),
    enabled: id !== '' && id !== null && id !== undefined,
  });
}

export function useCreatePage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await api.post('/pages', data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
    },
  });
}

export function useUpdatePage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string | number; data: Record<string, unknown> }) => {
      const res = await api.patch(`/pages/${id}`, data);
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
      queryClient.invalidateQueries({ queryKey: ['page', variables.id] });
    },
  });
}

export function useDeletePage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string | number) => {
      const res = await api.delete(`/pages/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pages'] });
    },
  });
}
```

### src/lib/hooks/useProducts.ts
```
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsService } from '../api/products.service';

export const useProducts = (filters: any = {}) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: async () => {
      const res = await productsService.getProducts(filters);
      if (res.success === false) {
        throw new Error(res.message || 'Failed to fetch products');
      }
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useProduct = (id: number | string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const res = await productsService.getProduct(id);
      if (res.success === false) {
        throw new Error(res.message || 'Failed to fetch product');
      }
      return res.data;
    },
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: productsService.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: any }) => productsService.updateProduct(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', variables.id] });
    }
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productsService.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    }
  });
};
```

### src/lib/hooks/useForms.ts
```
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { formsService } from '../api/forms.service';

export const useSubmitForm = (formType: 'contact' | 'calculator' = 'contact') => {
  return useMutation({
    mutationFn: (data: any) => {
      if (formType === 'calculator') {
        return formsService.submitCalculatorForm(data);
      }
      return formsService.submitContactForm(data);
    }
  });
};

export const useGetSubmissions = (filters: any = {}) => {
  return useQuery({
    queryKey: ['submissions', filters],
    queryFn: async () => {
      const res = await formsService.getFormSubmissions(filters);
      if (res.success === false) {
        throw new Error(res.message || 'Failed to fetch submissions');
      }
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useDeleteSubmission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: formsService.deleteSubmission,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
    }
  });
};

export const useUpdateSubmission = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => 
      formsService.updateSubmission(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
    }
  });
};
```

### src/lib/hooks/useTracking.ts
```
import { apiClient } from "../api/client";
import { useQuery } from "@tanstack/react-query";

// Types
export interface CampaignPerformance {
  campaignName: string;
  adSetName: string | null;
  adName: string | null;
  clicks: number;
  conversions: number;
  conversionRate: string;
}

export interface CampaignDetails extends CampaignPerformance {
  firstClick: string;
  lastClick: string;
}

export interface AttributionReport {
  campaignName: string;
  firstTouch: number;
  lastTouch: number;
  multiTouch: number;
}

// API Functions
export const trackingApi = {
  getCampaignPerformance: async (params?: Record<string, unknown>) => {
    try {
      const { data } = await apiClient.get("/tracking/performance", { params });
      const rows = data?.data;
      return Array.isArray(rows) ? rows : [];
    } catch {
      return [];
    }
  },

  getCampaignList: async () => {
    try {
      const { data } = await apiClient.get("/tracking/campaigns");
      return data.data || [];
    } catch (e) { return []; }
  },

  getAdClickDetails: async (id: number) => {
    try {
      const { data } = await apiClient.get(`/tracking/clicks/${id}`);
      return data.data || null;
    } catch (e) { return null; }
  }
};

// Hooks
export const useGetCampaignPerformance = (dateRange?: { from: Date; to: Date }, filters?: any) => {
  return useQuery({
    queryKey: ["campaign-performance", dateRange, filters],
    queryFn: async () => {
      const params = {
        startDate: dateRange?.from?.toISOString(),
        endDate: dateRange?.to?.toISOString(),
        ...filters
      };
      return trackingApi.getCampaignPerformance(params);
    },
    refetchInterval: 30000, // Real-time update every 30s
  });
};

export const useGetCampaignList = () => {
  return useQuery({
    queryKey: ["campaign-list"],
    queryFn: trackingApi.getCampaignList,
  });
};

export const useGetAdClickDetails = (id: number) => {
  return useQuery({
    queryKey: ["ad-click", id],
    queryFn: () => trackingApi.getAdClickDetails(id),
    enabled: !!id,
  });
};
```

### src/lib/auth.ts
```
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginWithPayloadCredentials } from "@/lib/auth/payloadCredentialsLogin";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const result = await loginWithPayloadCredentials(
          credentials.email,
          credentials.password
        );

        if (!result) {
          return null;
        }

        const { user, token, refreshToken } = result;
        return {
          id: String(user.id),
          email: user.email,
          name: user.name || user.email,
          role: user.role || "ADMIN",
          accessToken: token,
          refreshToken,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.sub as string) || session.user.email || "";
        session.user.role = token.role as string;
        session.user.accessToken = token.accessToken as string;
        session.user.refreshToken = token.refreshToken as string | undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  // Removed custom cookie config to let NextAuth handle defaults
  secret: process.env.NEXTAUTH_SECRET,
};
```

### src/middleware.ts
```
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isIpBlockedForRequest } from "@/lib/security/ipBlock";
import { checkRateLimit } from "@/lib/security/rateLimit";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const isNextAuthInternal =
    pathname.startsWith("/api/auth/") && pathname !== "/api/auth/refresh-token";

  // Skip middleware for non-API routes that are not admin
  if (!pathname.startsWith("/api/") && !pathname.startsWith("/admin/")) {
    return NextResponse.next();
  }

  // NextAuth's internal endpoints are called frequently by the client session
  // manager and should not be throttled by app API limits.
  if (isNextAuthInternal) {
    return NextResponse.next();
  }

  // Admin UI routes — no API rate limits (internal tool)
  if (pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Step 0 — Blocked IPs (Redis or BLOCKED_IPS env; see BlockedIPs collection)
  if (pathname.startsWith("/api/")) {
    const blocked = await isIpBlockedForRequest(req);
    if (blocked) {
      return NextResponse.json(
        { success: false, message: "IP blocked" },
        { status: 403 }
      );
    }
  }

  // Authenticated API calls (e.g. admin panel + Bearer JWT) — exempt from throttling
  const authz = req.headers.get("authorization");
  if (authz?.startsWith("Bearer ") || authz?.startsWith("JWT ")) {
    return NextResponse.next();
  }

  // Step 1 — Rate limiting for all /api/ routes
  if (pathname.startsWith("/api/")) {
    const rate = await checkRateLimit(req);

    if (!rate.ok) {
      const response = NextResponse.json(
        {
          success: false,
          message: "Too many requests",
          retryAfter: rate.retryAfter,
        },
        { status: 429 }
      );
      response.headers.set("Retry-After", String(rate.retryAfter));
      response.headers.set("X-RateLimit-Limit", String(rate.limit));
      response.headers.set("X-RateLimit-Remaining", String(rate.remaining));
      response.headers.set(
        "X-RateLimit-Reset",
        String(Math.floor(rate.resetAt / 1000))
      );
      return response;
    }

    const response = NextResponse.next();
    response.headers.set("X-RateLimit-Limit", String(rate.limit));
    response.headers.set("X-RateLimit-Remaining", String(rate.remaining));
    response.headers.set(
      "X-RateLimit-Reset",
      String(Math.floor(rate.resetAt / 1000))
    );
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/admin/:path*"],
};
```

### src/payload.config.ts
```
import { validateEnvAtStartup } from './lib/env'
import { buildConfig } from 'payload'

validateEnvAtStartup()
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import sharp from 'sharp'

import { AbTests } from './collections/AbTests'
import { AdClicks } from './collections/AdClicks'
import { AdConversions } from './collections/AdConversions'
import { AiCitationTests } from './collections/AiCitationTests'
import { Analytics } from './collections/Analytics'
import { AuditLogs } from './collections/AuditLogs'
import { Backups } from './collections/Backups'
import { BehavioralTriggers } from './collections/BehavioralTriggers'
import { BlockedIPs } from './collections/BlockedIPs'
import { Calculators } from './collections/Calculators'
import { Categories } from './collections/Categories'
import { ConversionEvents } from './collections/ConversionEvents'
import { DataExportRequests } from './collections/DataExportRequests'
import { ExitIntents } from './collections/ExitIntents'
import { FormAbandonments } from './collections/FormAbandonments'
import { InternalLinks } from './collections/InternalLinks'
import { Keywords } from './collections/Keywords'
import { LeadScores } from './collections/LeadScores'
import { SecurityLogs } from './collections/SecurityLogs'
import { SeoAnalyses } from './collections/SeoAnalyses'
import { Settings } from './collections/Settings'
import { Users } from './collections/Users'
import { WebhookLogs } from './collections/WebhookLogs'
import { Webhooks } from './collections/Webhooks'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { FormSubmissions } from './collections/FormSubmissions'
import { SystemEvents } from './collections/SystemEvents'
import { Products } from './collections/Products'
import { Tags } from './collections/Tags'
import { Pages } from './collections/Pages'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '- American Hairline Admin',
      icons: [
        {
          rel: 'icon',
          type: 'image/svg+xml',
          url: '/assets/icon-natural-hairline.svg',
        },
      ],
      openGraph: {
        images: ['/assets/mkxm0e5x-jjniexs.png'],
        siteName: 'American Hairline Admin',
      },
    },
    components: {
      graphics: {
        Logo: '/components/payload/Logo#Logo',
        Icon: '/components/payload/Icon#Icon',
      },
      views: {
        dashboard: {
          Component: '/components/payload/CustomDashboard#CustomDashboard',
        },
      },
    },
  },
  collections: [
    {
      ...Posts,
      admin: {
        ...Posts.admin,
        group: 'Website Content',
      },
    },
    {
      ...Pages,
      admin: {
        ...Pages.admin,
        group: 'Website Content',
      },
    },
    {
      ...Media,
      admin: {
        ...Media.admin,
        group: 'Website Content',
      },
    },
    {
      ...FormSubmissions,
      admin: {
        ...FormSubmissions.admin,
        group: 'Inbox',
      },
    },
    {
      ...Products,
      admin: {
        ...Products.admin,
        group: 'Website Content',
      },
    },
    {
      ...Tags,
      admin: {
        ...Tags.admin,
        group: 'Website Content',
      },
    },
    {
      ...Users,
      admin: {
        ...Users.admin,
        group: 'System',
      },
    },
    {
      ...SystemEvents,
      admin: {
        ...SystemEvents.admin,
        group: 'System',
      },
    },
    {
      ...BlockedIPs,
      admin: {
        ...BlockedIPs.admin,
        group: 'Security',
      },
    },
    {
      ...AuditLogs,
      admin: {
        ...AuditLogs.admin,
        group: 'Security',
      },
    },
    {
      ...DataExportRequests,
      admin: {
        ...DataExportRequests.admin,
        group: 'Security',
      },
    },
    Analytics,
    AdClicks,
    AdConversions,
    Webhooks,
    WebhookLogs,
    Settings,
    Categories,
    SecurityLogs,
    LeadScores,
    FormAbandonments,
    ExitIntents,
    BehavioralTriggers,
    Calculators,
    SeoAnalyses,
    Keywords,
    InternalLinks,
    AiCitationTests,
    AbTests,
    ConversionEvents,
    Backups,
  ],
  editor: lexicalEditor({}),
  secret: process.env.PAYLOAD_SECRET || 'YOUR_SECRET_KEY_HERE',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  sharp,
  db: sqliteAdapter({
    client: {
      url: pathToFileURL(
        path.resolve(dirname, '../payload-db.sqlite'),
      ).href,
    },
  }),
})
```

## src/app/api/ route.ts files:
### src/app/api/[[...slug]]/route.ts
```
import configPromise from '@payload-config'
import {
  REST_DELETE,
  REST_GET,
  REST_OPTIONS,
  REST_PATCH,
  REST_POST,
  REST_PUT,
} from '@payloadcms/next/routes'

/** Payload collection REST (`/api/posts`, `/api/media`, …). More specific `app/api/.../route.ts` files take precedence. */
export const GET = REST_GET(configPromise)
export const POST = REST_POST(configPromise)
export const DELETE = REST_DELETE(configPromise)
export const PATCH = REST_PATCH(configPromise)
export const PUT = REST_PUT(configPromise)
export const OPTIONS = REST_OPTIONS(configPromise)
```

### src/app/api/admin/bootstrap-session/route.ts
```
import { NextResponse } from "next/server";
import { encode } from "next-auth/jwt";
import type { JWT } from "next-auth/jwt";
import { loginWithPayloadCredentials } from "@/lib/auth/payloadCredentialsLogin";
import { BadRequestError } from "@/lib/api/errors";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

/** Match next-auth/core/lib/cookie chunking */
const ALLOWED_COOKIE_SIZE = 4096;
const ESTIMATED_EMPTY_COOKIE_SIZE = 163;
const CHUNK_SIZE = ALLOWED_COOKIE_SIZE - ESTIMATED_EMPTY_COOKIE_SIZE;

const SESSION_MAX_AGE_SEC = 30 * 24 * 60 * 60;

function sessionCookieName(): string {
  const useSecure =
    process.env.NEXTAUTH_URL?.startsWith("https://") ?? !!process.env.VERCEL;
  const prefix = useSecure ? "__Secure-" : "";
  return `${prefix}next-auth.session-token`;
}

async function handlePOST(request: Request) {
  const secret = process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET;
  if (!secret) {
    return NextResponse.json(
      { success: false, message: "Server missing NEXTAUTH_SECRET" },
      { status: 500 }
    );
  }

  let body: { email?: string; password?: string };
  try {
    body = (await request.json()) as { email?: string; password?: string };
  } catch {
    throw new BadRequestError("Invalid JSON body");
  }

  const email = body.email?.trim();
  const password = body.password;
  if (!email || !password) {
    throw new BadRequestError("Email and password are required");
  }

  const result = await loginWithPayloadCredentials(email, password);
  if (!result) {
    return NextResponse.json(
      { success: false, message: "Invalid credentials" },
      { status: 401 }
    );
  }

  const { user, token, refreshToken } = result;

  const merged = {
    name: user.name || user.email,
    email: user.email,
    sub: String(user.id),
    role: user.role,
    accessToken: token,
    ...(refreshToken ? { refreshToken } : {}),
  } satisfies JWT;

  const jwt = await encode({
    token: merged,
    secret,
    maxAge: SESSION_MAX_AGE_SEC,
  });

  const useSecure =
    process.env.NEXTAUTH_URL?.startsWith("https://") ?? !!process.env.VERCEL;
  const cookieName = sessionCookieName();
  const baseOpts = {
    httpOnly: true,
    path: "/",
    sameSite: "lax" as const,
    secure: useSecure,
    maxAge: SESSION_MAX_AGE_SEC,
  };

  const res = NextResponse.json({
    success: true,
    data: { email: user.email, role: user.role },
  });

  // Clear previous session cookies (single or chunked) before setting new ones
  res.cookies.set(cookieName, "", { ...baseOpts, maxAge: 0 });
  for (let i = 0; i < 16; i++) {
    res.cookies.set(`${cookieName}.${i}`, "", { ...baseOpts, maxAge: 0 });
  }

  if (jwt.length <= CHUNK_SIZE) {
    res.cookies.set(cookieName, jwt, baseOpts);
  } else {
    const chunkCount = Math.ceil(jwt.length / CHUNK_SIZE);
    for (let i = 0; i < chunkCount; i++) {
      const part = jwt.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
      res.cookies.set(`${cookieName}.${i}`, part, baseOpts);
    }
  }

  return res;
}

export const POST = withErrorHandling(handlePOST);
```

### src/app/api/ai-seo/citation-history/[id]/route.ts
```
import { NextResponse } from "next/server";
import { BadRequestError } from "@/lib/api/errors";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { jsonSuccess } from "@/lib/api/response";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handleGET(
  request: Request,
  context: any
) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  const { id } = await context.params;
  const postId = Number(id);
  if (!Number.isFinite(postId)) {
    throw new BadRequestError("Invalid post id");
  }

  const payload = await getPayloadSingleton();
  const res = await payload.find({
    collection: "ai-citation-tests",
    where: { post: { equals: postId } },
    sort: "-testedAt",
    limit: 100,
    depth: 0,
    overrideAccess: true,
  });

  return NextResponse.json(jsonSuccess(res.docs));
}

export const GET = withErrorHandling(handleGET);
```

### src/app/api/ai-seo/dashboard/route.ts
```
import { NextResponse } from "next/server";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { jsonSuccess } from "@/lib/api/response";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handleGET(request: Request) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  const payload = await getPayloadSingleton();

  const [tests, posts] = await Promise.all([
    payload.find({
      collection: "ai-citation-tests",
      limit: 1,
      overrideAccess: true,
    }),
    payload.find({
      collection: "posts",
      limit: 1,
      overrideAccess: true,
    }),
  ]);

  const cited = await payload.find({
    collection: "ai-citation-tests",
    where: { cited: { equals: true } },
    limit: 1,
    overrideAccess: true,
  });

  return NextResponse.json(
    jsonSuccess(
      {
        totalCitationTests: tests.totalDocs,
        citedCount: cited.totalDocs,
        totalPosts: posts.totalDocs,
        visibilityScore: tests.totalDocs
          ? Math.min(
              100,
              Math.round((cited.totalDocs / tests.totalDocs) * 100)
            )
          : 0,
        note: "In-memory style aggregates from Payload counts (stub visibility score).",
      },
      "AI SEO dashboard"
    )
  );
}

export const GET = withErrorHandling(handleGET);
```

### src/app/api/ai-seo/faqs/[id]/route.ts
```
import { NextResponse } from "next/server";
import { BadRequestError } from "@/lib/api/errors";
import { jsonSuccess } from "@/lib/api/response";
import { optimizePostWithAI } from "@/lib/services/aiSeo.service";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

/** Generates FAQs via full AI optimization pipeline (same as optimize/:id). */
async function handlePOST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN", "EDITOR"]);
  const { id } = await context.params;
  const result = await optimizePostWithAI(String(id));
  if (!result.success) {
    throw new BadRequestError(result.error || "FAQ generation failed");
  }
  return NextResponse.json(jsonSuccess({ faqs: result.faqs }, "FAQs generated"));
}

export const POST = withErrorHandling(handlePOST);
```

### src/app/api/ai-seo/generate/meta-description/route.ts
```
import { NextResponse } from "next/server";
import { BadRequestError } from "@/lib/api/errors";
import { jsonSuccess } from "@/lib/api/response";
import { generateMetaDescription } from "@/lib/services/aiSeo.service";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handlePOST(request: Request) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN", "EDITOR"]);
  let body: { content?: string };
  try {
    body = (await request.json()) as { content?: string };
  } catch {
    throw new BadRequestError("Invalid JSON");
  }
  if (!body.content?.trim()) {
    throw new BadRequestError("content is required");
  }
  const text = await generateMetaDescription(body.content);
  return NextResponse.json(jsonSuccess({ metaDescription: text }));
}

export const POST = withErrorHandling(handlePOST);
```

### src/app/api/ai-seo/generate/seo-title/route.ts
```
import { NextResponse } from "next/server";
import { BadRequestError } from "@/lib/api/errors";
import { jsonSuccess } from "@/lib/api/response";
import { generateSeoTitle } from "@/lib/services/aiSeo.service";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handlePOST(request: Request) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN", "EDITOR"]);
  let body: { content?: string; keyword?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    throw new BadRequestError("Invalid JSON");
  }
  if (!body.content?.trim()) {
    throw new BadRequestError("content is required");
  }
  const keyword = body.keyword?.trim() || "hair";
  const title = await generateSeoTitle(body.content, keyword);
  return NextResponse.json(jsonSuccess({ title }));
}

export const POST = withErrorHandling(handlePOST);
```

### src/app/api/ai-seo/optimize-all/route.ts
```
import { NextResponse } from "next/server";
import { jsonSuccess } from "@/lib/api/response";
import { optimizeAllPublishedPosts } from "@/lib/services/aiSeo.service";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handlePOST(request: Request) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  const result = await optimizeAllPublishedPosts();
  return NextResponse.json(jsonSuccess(result, "Batch optimization finished"));
}

export const POST = withErrorHandling(handlePOST);
```

### src/app/api/ai-seo/optimize/[id]/route.ts
```
import { NextResponse } from "next/server";
import { BadRequestError } from "@/lib/api/errors";
import { aiOptimizeBodySchema } from "@/lib/api/phase3Schemas";
import { jsonSuccess } from "@/lib/api/response";
import { optimizePostWithAI } from "@/lib/services/aiSeo.service";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";
import { withValidation } from "@/lib/api/withValidation";

async function handlePOST(request: Request, context: any) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  const { id } = await context.params;
  if (id == null || id === "") {
    throw new BadRequestError("Invalid post id");
  }

  let body: unknown = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }
  withValidation(aiOptimizeBodySchema, body);

  const result = await optimizePostWithAI(String(id));
  if (!result.success) {
    throw new BadRequestError(result.error || "Optimization failed");
  }

  return NextResponse.json(
    jsonSuccess(
      {
        score: result.score,
        faqs: result.faqs,
        directAnswers: result.directAnswers,
        takeaways: result.takeaways,
        conversational: result.conversational,
      },
      "AI optimization completed"
    )
  );
}

export const POST = withErrorHandling(handlePOST);
```

### src/app/api/ai-seo/status/[id]/route.ts
```
import { NextResponse } from "next/server";
import { NotFoundError } from "@/lib/api/errors";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { jsonSuccess } from "@/lib/api/response";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handleGET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN", "EDITOR"]);
  const { id } = await context.params;
  const payload = await getPayloadSingleton();
  const post = (await payload.findByID({
    collection: "posts",
    id,
    depth: 0,
    overrideAccess: true,
  })) as Record<string, unknown> | null;

  if (!post?.id) {
    throw new NotFoundError("Post not found");
  }

  const ai = post.aiOptimization as Record<string, unknown> | undefined;
  return NextResponse.json(
    jsonSuccess({
      postId: post.id,
      lastOptimizedAt: ai?.lastOptimizedAt,
      score: ai?.score,
      hasFaqs: Boolean(ai?.faqs),
    })
  );
}

export const GET = withErrorHandling(handleGET);
```

### src/app/api/ai-seo/suggestions/[id]/route.ts
```
import { NextResponse } from "next/server";
import { NotFoundError } from "@/lib/api/errors";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { jsonSuccess } from "@/lib/api/response";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handleGET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN", "EDITOR"]);
  const { id } = await context.params;
  const payload = await getPayloadSingleton();
  const post = (await payload.findByID({
    collection: "posts",
    id,
    depth: 0,
    overrideAccess: true,
  })) as Record<string, unknown> | null;

  if (!post?.id) {
    throw new NotFoundError("Post not found");
  }

  const ai = post.aiOptimization as
    | {
        conversationalAnalysis?: { suggestions?: unknown };
        keyTakeaways?: unknown;
      }
    | undefined;

  return NextResponse.json(
    jsonSuccess({
      suggestions: ai?.conversationalAnalysis?.suggestions ?? [],
      takeaways: ai?.keyTakeaways ?? [],
    })
  );
}

export const GET = withErrorHandling(handleGET);
```

### src/app/api/ai-seo/test-citation/[id]/route.ts
```
import { NextResponse } from "next/server";
import { BadRequestError, NotFoundError } from "@/lib/api/errors";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { jsonSuccess } from "@/lib/api/response";
import { testAiCitation } from "@/lib/services/aiSeo.service";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

type CitationBody = {
  queries?: string[];
  query?: string;
};

async function handlePOST(request: Request, context: any) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  const { id } = await context.params;
  const postId = Number(id);
  if (!Number.isFinite(postId)) {
    throw new BadRequestError("Invalid post id");
  }

  let body: CitationBody = {};
  try {
    body = (await request.json()) as CitationBody;
  } catch {
    body = {};
  }

  const queries: string[] =
    Array.isArray(body.queries) && body.queries.length > 0
      ? body.queries.map(String).slice(0, 8)
      : body.query
        ? [String(body.query)]
        : [
            "What is non-surgical hair replacement?",
            "How long is FUE recovery?",
          ];

  const payload = await getPayloadSingleton();
  try {
    await payload.findByID({
      collection: "posts",
      id: postId,
      depth: 0,
      overrideAccess: true,
    });
  } catch {
    throw new NotFoundError("Post not found");
  }

  const results: unknown[] = [];
  for (const q of queries) {
    try {
      const r = await testAiCitation(String(postId), q);
      results.push({ query: q, ...r });
    } catch (e) {
      results.push({
        query: q,
        error: e instanceof Error ? e.message : String(e),
      });
    }
  }

  return NextResponse.json(
    jsonSuccess({ results }, "Citation tests completed")
  );
}

export const POST = withErrorHandling(handlePOST);
```

### src/app/api/analytics/overview/route.ts
```
import { NextResponse } from "next/server";
import {
  aggregateAnalyticsOverview,
  buildAnalyticsOverviewWhere,
  type OverviewDoc,
} from "@/lib/api/analyticsOverview";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { jsonSuccess } from "@/lib/api/response";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";
import { cacheGet, cacheSet } from "@/lib/services/cache.service";

const OVERVIEW_FETCH_LIMIT = 50_000;
const CACHE_TTL_SEC = 60;

async function handleGET(request: Request) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);

  const url = new URL(request.url);
  const startDate = url.searchParams.get("startDate");
  const endDate = url.searchParams.get("endDate");

  const cacheKey = `analytics:overview:${startDate ?? "null"}:${endDate ?? "null"}`;
  const cached = await cacheGet<ReturnType<typeof aggregateAnalyticsOverview>>(
    cacheKey
  );
  if (cached) {
    return NextResponse.json(jsonSuccess(cached, "Success"));
  }

  const payload = await getPayloadSingleton();
  const where = buildAnalyticsOverviewWhere(startDate, endDate);

  const { docs } = await payload.find({
    collection: "analytics",
    where,
    limit: OVERVIEW_FETCH_LIMIT,
    depth: 0,
    overrideAccess: true,
  });

  const rows: OverviewDoc[] = docs.map((d) => ({
    pageUrl: typeof d.pageUrl === "string" ? d.pageUrl : null,
    referrer: typeof d.referrer === "string" ? d.referrer : null,
    ipAddress: typeof d.ipAddress === "string" ? d.ipAddress : null,
    createdAt:
      typeof d.createdAt === "string" ? d.createdAt : undefined,
  }));

  const overview = aggregateAnalyticsOverview(rows);
  await cacheSet(cacheKey, overview, CACHE_TTL_SEC);

  return NextResponse.json(
    jsonSuccess(overview, "Success")
  );
}

export const GET = withErrorHandling(handleGET);
```

### src/app/api/analytics/pageview/route.ts
```
import { NextResponse } from "next/server";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { jsonSuccess } from "@/lib/api/response";
import { withErrorHandling } from "@/lib/api/withErrorHandling";
import { withValidation } from "@/lib/api/withValidation";
import { BadRequestError } from "@/lib/api/errors";
import { getClientIpFromHeaders } from "@/lib/security/rateLimit";
import { pageviewSchema } from "@/lib/security/validation";

async function handlePOST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new BadRequestError("Invalid JSON");
  }

  const parsed = withValidation(pageviewSchema, body);
  const payload = await getPayloadSingleton();
  const ip = getClientIpFromHeaders(request.headers);
  const userAgent =
    parsed.userAgent ?? request.headers.get("user-agent") ?? "unknown";

  try {
    await payload.create({
      collection: "analytics",
      data: {
        pageUrl: parsed.path,
        referrer: parsed.referrer ?? "direct",
        userAgent,
        ipAddress: ip,
      },
      overrideAccess: true,
    });
  } catch (e) {
    console.error("[analytics/pageview]", e);
  }

  return NextResponse.json(jsonSuccess());
}

export const POST = withErrorHandling(handlePOST);
```

### src/app/api/analytics/posts/route.ts
```
import type { Where } from "payload";
import { NextResponse } from "next/server";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { jsonSuccess } from "@/lib/api/response";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handleGET(request: Request) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN", "EDITOR"]);
  const url = new URL(request.url);
  const startDate = url.searchParams.get("startDate");
  const endDate = url.searchParams.get("endDate");

  const payload = await getPayloadSingleton();
  const and: Where[] = [{ pageUrl: { contains: "/blog" } }];
  if (startDate && endDate) {
    and.push({ createdAt: { greater_than_equal: startDate } });
    and.push({ createdAt: { less_than_equal: endDate } });
  }

  const res = await payload.find({
    collection: "analytics",
    where: { and } as Where,
    limit: 50_000,
    depth: 0,
    overrideAccess: true,
  });

  const byPath: Record<string, number> = {};
  for (const row of res.docs) {
    const p = (row as { pageUrl?: string }).pageUrl || "";
    if (!p) continue;
    byPath[p] = (byPath[p] ?? 0) + 1;
  }

  const posts = Object.entries(byPath)
    .map(([path, views]) => {
      const slug = path.split("/").filter(Boolean).pop() || path;
      return {
        path,
        slug,
        views,
        title: slug,
      };
    })
    .sort((a, b) => b.views - a.views);

  return NextResponse.json(jsonSuccess({ posts }));
}

export const GET = withErrorHandling(handleGET);
```

### src/app/api/auth/[...nextauth]/route.ts
```
import { authOptions } from "@/lib/auth"
import NextAuth from "next-auth"

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
```

### src/app/api/auth/refresh-token/route.ts
```
import { NextResponse } from "next/server";
import { UnauthorizedError } from "@/lib/api/errors";
import { jsonSuccess } from "@/lib/api/response";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handlePOST(request: Request) {
  const url = new URL(request.url);
  const refreshUrl = `${url.origin}/api/users/refresh-token`;

  const res = await fetch(refreshUrl, {
    method: "POST",
    headers: {
      cookie: request.headers.get("cookie") ?? "",
      authorization: request.headers.get("authorization") ?? "",
      "content-type": "application/json",
    },
  });

  if (!res.ok) {
    throw new UnauthorizedError("Invalid or expired token");
  }

  const data = (await res.json()) as {
    token?: string;
    accessToken?: string;
    exp?: number;
    user?: unknown;
  };
  const accessToken = data.token || data.accessToken;
  if (!accessToken) {
    throw new UnauthorizedError("Invalid or expired token");
  }

  return NextResponse.json(
    jsonSuccess(
      {
        accessToken,
        exp: data.exp,
        user: data.user,
      },
      "Token refreshed"
    )
  );
}

export const POST = withErrorHandling(handlePOST);
```

### src/app/api/calculator/cost/route.ts
```
import { NextResponse } from "next/server";
import { BadRequestError } from "@/lib/api/errors";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { calculatorCostSchema } from "@/lib/api/phase3Schemas";
import { jsonSuccess } from "@/lib/api/response";
import { withErrorHandling } from "@/lib/api/withErrorHandling";
import { withValidation } from "@/lib/api/withValidation";
import { calculateHairCost } from "@/lib/services/calculatorLogic";

function mapHairLossToSeverity(
  hairLossType?: string,
  stage?: string
): string | undefined {
  const s = `${hairLossType ?? ""} ${stage ?? ""}`.toLowerCase();
  if (s.includes("severe") || s.includes("norwood 6") || s.includes("nw6")) {
    return "severe";
  }
  if (s.includes("moderate") || s.includes("norwood 4") || s.includes("nw4")) {
    return "moderate";
  }
  if (s.includes("mild") || s.includes("early") || s.includes("nw2")) {
    return "mild";
  }
  return undefined;
}

async function handlePOST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new BadRequestError("Invalid JSON");
  }

  const parsed = withValidation(calculatorCostSchema, body);
  const severity =
    parsed.severity ??
    mapHairLossToSeverity(parsed.hairLossType, parsed.coverageArea);

  const result = calculateHairCost({
    graftsNeeded: parsed.graftsNeeded,
    severity,
    technique: parsed.technique ?? parsed.systemType,
    location: parsed.location,
  });

  if (!result.success) {
    throw new BadRequestError(result.error);
  }

  const sessionId =
    typeof parsed.sessionId === "string" ? parsed.sessionId : undefined;
  if (sessionId) {
    const payload = await getPayloadSingleton();
    payload
      .create({
        collection: "calculators",
        data: {
          sessionId,
          type: "cost",
          inputs: {
            ...parsed,
            severityResolved: severity,
          },
          results: result.results,
          leadCaptured: false,
        },
        overrideAccess: true,
      })
      .catch((e) => console.error("[calculator/cost] background save", e));
  }

  return NextResponse.json(
    jsonSuccess(result.results, "Calculation successful")
  );
}

export const POST = withErrorHandling(handlePOST);
```

### src/app/api/calculator/estimate-grafts/route.ts
```
import { NextResponse } from "next/server";
import { BadRequestError } from "@/lib/api/errors";
import { jsonSuccess } from "@/lib/api/response";
import { withErrorHandling } from "@/lib/api/withErrorHandling";
import { withValidation } from "@/lib/api/withValidation";
import { estimateGraftsRequestSchema } from "@/lib/api/phase3Schemas";

/**
 * Stub: replaces OpenRouter AI graft estimation. Returns deterministic fallback.
 */
function stubEstimate(input: {
  description?: string;
  hairLossStage?: string;
  area?: string;
}): Record<string, unknown> {
  const text = `${input.description ?? ""} ${input.hairLossStage ?? ""} ${
    input.area ?? ""
  }`.toLowerCase();
  let norwood = "4";
  let grafts = 2500;
  if (text.includes("severe") || text.includes("nw6") || text.includes("vertex")) {
    norwood = "6";
    grafts = 4000;
  } else if (text.includes("mild") || text.includes("receding") || text.includes("nw2")) {
    norwood = "3";
    grafts = 1800;
  }
  const min = Math.round(grafts * 0.85);
  const max = Math.round(grafts * 1.15);
  return {
    estimatedGrafts: grafts,
    range: { min, max },
    norwood,
    confidence: 0.45,
    recommendation:
      "Stub estimate — connect AI (Phase 5+) for model-based graft analysis.",
    inputsEcho: {
      hasDescription: Boolean(input.description?.length),
      hairLossStage: input.hairLossStage,
      area: input.area,
    },
  };
}

async function handlePOST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new BadRequestError("Invalid JSON");
  }

  const parsed = withValidation(estimateGraftsRequestSchema, body);
  const estimate = stubEstimate({
    description: parsed.description,
    hairLossStage: parsed.hairLossStage,
    area: parsed.area,
  });

  return NextResponse.json(jsonSuccess(estimate, "Estimation successful"));
}

export const POST = withErrorHandling(handlePOST);
```

### src/app/api/calculator/save/route.ts
```
import { NextResponse } from "next/server";
import { BadRequestError } from "@/lib/api/errors";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { calculatorSaveSchema } from "@/lib/api/phase3Schemas";
import { jsonSuccess } from "@/lib/api/response";
import { withErrorHandling } from "@/lib/api/withErrorHandling";
import { withValidation } from "@/lib/api/withValidation";

async function handlePOST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new BadRequestError("Invalid JSON");
  }

  const parsed = withValidation(calculatorSaveSchema, body);
  const payload = await getPayloadSingleton();

  const doc = await payload.create({
    collection: "calculators",
    data: {
      sessionId: parsed.sessionId,
      type: parsed.type,
      inputs: parsed.inputs,
      results: parsed.results,
      leadCaptured: parsed.leadCaptured ?? false,
    },
    overrideAccess: true,
  });

  return NextResponse.json(
    jsonSuccess(
      { id: doc.id, saved: true },
      "Calculator usage saved successfully"
    )
  );
}

export const POST = withErrorHandling(handlePOST);
```

### src/app/api/calculator/stats/route.ts
```
import { NextResponse } from "next/server";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { jsonSuccess } from "@/lib/api/response";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handleGET(request: Request) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  const url = new URL(request.url);
  const days = Math.min(Number(url.searchParams.get("days")) || 30, 366);
  const type = url.searchParams.get("type");

  const dateFrom = new Date();
  dateFrom.setDate(dateFrom.getDate() - days);

  const payload = await getPayloadSingleton();

  const whereBase: Record<string, unknown> = {
    createdAt: { greater_than_equal: dateFrom.toISOString() },
  };
  if (type) {
    whereBase.type = { equals: type };
  }

  const totalRes = await payload.find({
    collection: "calculators",
    where: whereBase as never,
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });

  const convertedRes = await payload.find({
    collection: "calculators",
    where: {
      and: [
        whereBase as never,
        { leadCaptured: { equals: true } },
      ],
    },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });

  const total = totalRes.totalDocs;
  const converted = convertedRes.totalDocs;
  const conversionRate =
    total > 0 ? parseFloat(((converted / total) * 100).toFixed(1)) : 0;

  return NextResponse.json(
    jsonSuccess({ total, converted, conversionRate }, "Calculator stats retrieved")
  );
}

export const GET = withErrorHandling(handleGET);
```

### src/app/api/comments/route.ts
```
import { NextResponse } from "next/server";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { jsonError, jsonSuccess } from "@/lib/api/response";
import { withErrorHandling } from "@/lib/api/withErrorHandling";
import { sanitizeString } from "@/lib/security/sanitize";
import { assertNoSqlInjectionInValue } from "@/lib/security/sqlPatternGuard";
import { commentCreateSchema } from "@/lib/security/validation";

async function handlePOST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(jsonError("Invalid JSON"), { status: 400 });
  }

  const parsed = commentCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      jsonError("Validation failed", parsed.error.flatten()),
      { status: 400 }
    );
  }

  try {
    assertNoSqlInjectionInValue(parsed.data, new Set());
  } catch {
    return NextResponse.json(jsonError("Invalid input"), { status: 400 });
  }

  const {
    postId,
    authorName,
    authorEmail,
    authorUrl,
    content,
  } = parsed.data;

  const payload = await getPayloadSingleton();
  const comment = await payload.create({
    collection: "form-submissions",
    data: {
      type: "comment",
      name: sanitizeString(authorName),
      email: sanitizeString(authorEmail),
      subject: `comment:${String(postId)}`,
      message: sanitizeString(content),
      sourceUrl: authorUrl ? sanitizeString(authorUrl) : undefined,
    },
    overrideAccess: true,
  });

  return NextResponse.json(
    jsonSuccess(comment, "Comment created"),
    { status: 201 }
  );
}

export const POST = withErrorHandling(handlePOST);
```

### src/app/api/forms/newsletter/route.ts
```
import { NextResponse } from "next/server";
import { BadRequestError } from "@/lib/api/errors";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { newsletterFormSchema } from "@/lib/api/phase3Schemas";
import { jsonSuccess } from "@/lib/api/response";
import { withErrorHandling } from "@/lib/api/withErrorHandling";
import { withValidation } from "@/lib/api/withValidation";
import { sendNewsletterConfirmation } from "@/lib/services/email.service";

async function handlePOST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new BadRequestError("Invalid JSON");
  }

  const parsed = withValidation(newsletterFormSchema, body);

  if (parsed.honeypot) {
    return NextResponse.json(
      jsonSuccess(undefined, "Subscribed successfully")
    );
  }

  const payload = await getPayloadSingleton();
  await payload.create({
    collection: "form-submissions",
    data: {
      type: "newsletter",
      email: parsed.email,
      message: "Newsletter signup",
      sourceUrl: request.headers.get("referer") ?? undefined,
    },
    overrideAccess: true,
  });

  void sendNewsletterConfirmation(parsed.email).catch((err) =>
    console.error("[forms/newsletter] confirmation email failed", err)
  );

  return NextResponse.json(
    jsonSuccess(undefined, "Subscribed successfully")
  );
}

export const POST = withErrorHandling(handlePOST);
```

### src/app/api/forms/submit/route.ts
```
import { NextResponse } from "next/server";
import { BadRequestError } from "@/lib/api/errors";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { contactFormSchema } from "@/lib/api/phase3Schemas";
import { jsonSuccess } from "@/lib/api/response";
import { withErrorHandling } from "@/lib/api/withErrorHandling";
import { withValidation } from "@/lib/api/withValidation";
import { sendContactFormNotification } from "@/lib/services/email.service";

async function handlePOST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new BadRequestError("Invalid JSON");
  }

  const parsed = withValidation(contactFormSchema, body);

  if (parsed.honeypot) {
    console.warn("[forms/submit] honeypot tripped");
    return NextResponse.json(
      jsonSuccess(undefined, "Form submitted successfully")
    );
  }

  const payload = await getPayloadSingleton();

  let sessionId: string | undefined =
    typeof parsed.sessionId === "string" ? parsed.sessionId : undefined;

  if (sessionId) {
    try {
      const found = await payload.find({
        collection: "ad-clicks",
        where: { sessionId: { equals: sessionId } },
        limit: 1,
        depth: 0,
        overrideAccess: true,
      });
      const click = found.docs[0];
      if (click) {
        await payload.update({
          collection: "ad-clicks",
          id: click.id,
          data: {
            converted: true,
            conversionType: "form_submission",
          },
          overrideAccess: true,
        });
        await payload.create({
          collection: "ad-conversions",
          data: {
            adClick: click.id,
            conversionType: "form_submission",
          },
          overrideAccess: true,
        });
      }
    } catch (e) {
      console.error("[forms/submit] tracking link error", e);
    }
  }

  await payload.create({
    collection: "form-submissions",
    data: {
      type: "contact",
      name: parsed.name,
      email: parsed.email,
      phone: parsed.phone || undefined,
      subject: parsed.subject,
      message: parsed.message,
      sourceUrl: request.headers.get("referer") ?? undefined,
      utmSource: parsed.utm_source,
      utmMedium: parsed.utm_medium,
      utmCampaign: parsed.utm_campaign,
    },
    overrideAccess: true,
  });

  void sendContactFormNotification({
    name: parsed.name,
    email: parsed.email,
    phone: parsed.phone || undefined,
    subject: parsed.subject,
    message: parsed.message,
  }).catch((err) => console.error("[forms/submit] admin notification failed", err));

  return NextResponse.json(
    jsonSuccess(undefined, "Form submitted successfully")
  );
}

export const POST = withErrorHandling(handlePOST);
```

### src/app/api/gdpr/delete/route.ts
```
import { NextResponse } from "next/server";
import { startGdprRequest } from "@/lib/services/gdpr.service";
import { gdprEmailBodySchema } from "@/lib/security/validation";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid JSON" },
      { status: 400 }
    );
  }

  const parsed = gdprEmailBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Invalid email", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    await startGdprRequest(parsed.data.email, "delete");
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Request failed";
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    message: "Verification email sent",
  });
}
```

### src/app/api/gdpr/export/route.ts
```
import { NextResponse } from "next/server";
import { startGdprRequest } from "@/lib/services/gdpr.service";
import { gdprEmailBodySchema } from "@/lib/security/validation";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid JSON" },
      { status: 400 }
    );
  }

  const parsed = gdprEmailBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Invalid email", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    await startGdprRequest(parsed.data.email, "export");
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Request failed";
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    message: "Verification email sent",
  });
}
```

### src/app/api/gdpr/verify/route.ts
```
import { NextResponse } from "next/server";
import { verifyAndProcessGdprToken } from "@/lib/services/gdpr.service";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  if (!token) {
    return NextResponse.json(
      { success: false, message: "Missing token" },
      { status: 400 }
    );
  }

  const result = await verifyAndProcessGdprToken(token);
  if (!result.ok) {
    return NextResponse.json(
      { success: false, message: result.message },
      { status: 400 }
    );
  }

  return NextResponse.json({ success: true, message: result.message });
}
```

### src/app/api/health/deep/route.ts
```
import { NextResponse } from "next/server";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { jsonSuccess } from "@/lib/api/response";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handleGET(request: Request) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  const payload = await getPayloadSingleton();
  let postsCount = 0;
  try {
    const r = await payload.find({
      collection: "posts",
      limit: 1,
      overrideAccess: true,
    });
    postsCount = r.totalDocs;
  } catch (e) {
    return NextResponse.json(
      {
        success: false,
        message: "Payload connectivity check failed",
        error: e instanceof Error ? e.message : String(e),
      },
      { status: 503 }
    );
  }

  let redisOk: boolean | "skipped" = "skipped";
  if (process.env.REDIS_URL) {
    try {
      const { default: Redis } = await import("ioredis");
      const client = new Redis(process.env.REDIS_URL, {
        maxRetriesPerRequest: 1,
        connectTimeout: 2000,
        lazyConnect: false,
      });
      const pong = await client.ping();
      redisOk = pong === "PONG";
      client.disconnect();
    } catch {
      redisOk = false;
    }
  }

  return NextResponse.json(
    jsonSuccess({
      payload: "ok",
      postsVisible: postsCount,
      redis: redisOk,
      timestamp: new Date().toISOString(),
    })
  );
}

export const GET = withErrorHandling(handleGET);
```

### src/app/api/health/route.ts
```
import { NextResponse } from "next/server";
import { jsonSuccess } from "@/lib/api/response";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handleGET() {
  return NextResponse.json(
    jsonSuccess({
      status: "ok",
      timestamp: new Date().toISOString(),
    })
  );
}

export const GET = withErrorHandling(handleGET);
```

### src/app/api/lead-optimization/dashboard/route.ts
```
import { NextResponse } from "next/server";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { jsonSuccess } from "@/lib/api/response";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handleGET(request: Request) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  const url = new URL(request.url);
  const days = Math.min(Number(url.searchParams.get("days")) || 30, 366);

  const dateFrom = new Date();
  dateFrom.setDate(dateFrom.getDate() - days);
  const since = dateFrom.toISOString();
  const dateWhere = { createdAt: { greater_than_equal: since } };

  const payload = await getPayloadSingleton();

  const [
    abandonmentAgg,
    abandonmentWithEmail,
    exitIntentAgg,
    conversionAgg,
    calcTotal,
    calcConverted,
    triggersAgg,
    hotLeadsAgg,
  ] = await Promise.all([
    payload.find({
      collection: "form-abandonments",
      where: dateWhere as never,
      limit: 1,
      overrideAccess: true,
    }),
    payload.find({
      collection: "form-abandonments",
      where: {
        and: [
          dateWhere as never,
          { email: { exists: true } },
        ],
      },
      limit: 1,
      overrideAccess: true,
    }),
    payload.find({
      collection: "exit-intents",
      where: dateWhere as never,
      limit: 1,
      overrideAccess: true,
    }),
    payload.find({
      collection: "conversion-events",
      where: dateWhere as never,
      limit: 1,
      overrideAccess: true,
    }),
    payload.find({
      collection: "calculators",
      where: dateWhere as never,
      limit: 1,
      overrideAccess: true,
    }),
    payload.find({
      collection: "calculators",
      where: {
        and: [
          dateWhere as never,
          { leadCaptured: { equals: true } },
        ],
      },
      limit: 1,
      overrideAccess: true,
    }),
    payload.find({
      collection: "behavioral-triggers",
      where: dateWhere as never,
      limit: 1,
      overrideAccess: true,
    }),
    payload.find({
      collection: "lead-scores",
      where: { category: { equals: "hot" } },
      limit: 1,
      overrideAccess: true,
    }),
  ]);

  const totalCalculations = calcTotal.totalDocs;
  const convertedCalculations = calcConverted.totalDocs;
  const conversionRate =
    totalCalculations > 0
      ? parseFloat(
          ((convertedCalculations / totalCalculations) * 100).toFixed(1)
        )
      : 0;

  return NextResponse.json(
    jsonSuccess(
      {
        period: `Last ${days} days`,
        abandonment: {
          total: abandonmentAgg.totalDocs,
          withEmail: abandonmentWithEmail.totalDocs,
          recovered: 0,
          emailsSent: 0,
          recoveryRate: 0,
          abandonmentPoints: [] as unknown[],
        },
        exitIntent: {
          total: exitIntentAgg.totalDocs,
          emailsCaptured: 0,
          converted: 0,
          conversionRate: 0,
          byPopupType: [] as unknown[],
        },
        conversion: {
          totalEvents: conversionAgg.totalDocs,
          conversionRate: 0,
          formSubmitted: conversionAgg.totalDocs,
          formViewed: 0,
        },
        calculator: {
          total: totalCalculations,
          converted: convertedCalculations,
          conversionRate,
        },
        /** Row-level stats when available; empty until we aggregate behavioral-triggers */
        triggers: [] as unknown[],
        triggersTotal: triggersAgg.totalDocs,
        hotLeads: hotLeadsAgg.totalDocs,
      },
      "Dashboard stats retrieved"
    )
  );
}

export const GET = withErrorHandling(handleGET);
```

### src/app/api/lead-optimization/exit-intent/content/route.ts
```
import { NextResponse } from "next/server";
import { BadRequestError } from "@/lib/api/errors";
import { getExitIntentPopupContent } from "@/lib/api/exitIntentContent";
import { jsonSuccess } from "@/lib/api/response";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handleGET(request: Request) {
  const url = new URL(request.url);
  const page = url.searchParams.get("page");
  const device = url.searchParams.get("device") ?? "desktop";
  if (!page) {
    throw new BadRequestError("Missing page query parameter");
  }

  const content = getExitIntentPopupContent(page, device);
  return NextResponse.json(
    jsonSuccess(content, "Exit intent content retrieved")
  );
}

export const GET = withErrorHandling(handleGET);
```

### src/app/api/lead-optimization/track/conversion/route.ts
```
import { NextResponse } from "next/server";
import { BadRequestError } from "@/lib/api/errors";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { leadOptConversionEventSchema } from "@/lib/api/phase3Schemas";
import { jsonSuccess } from "@/lib/api/response";
import { withErrorHandling } from "@/lib/api/withErrorHandling";
import { withValidation } from "@/lib/api/withValidation";

async function handlePOST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new BadRequestError("Invalid JSON");
  }

  const parsed = withValidation(leadOptConversionEventSchema, body);
  const payload = await getPayloadSingleton();

  const doc = await payload.create({
    collection: "conversion-events",
    data: {
      sessionId: parsed.sessionId,
      eventType: parsed.eventType,
      eventData: parsed.eventData ?? undefined,
      page: parsed.page,
      formType: parsed.formType,
      abTestVariant: parsed.abTestVariant,
      occurredAt: new Date().toISOString(),
    },
    overrideAccess: true,
  });

  return NextResponse.json(
    jsonSuccess(doc, "Conversion event tracked"),
    { status: 201 }
  );
}

export const POST = withErrorHandling(handlePOST);
```

### src/app/api/lead-optimization/track/trigger/route.ts
```
import { NextResponse } from "next/server";
import { BadRequestError } from "@/lib/api/errors";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { behavioralTriggerSchema } from "@/lib/api/phase3Schemas";
import { jsonSuccess } from "@/lib/api/response";
import { withErrorHandling } from "@/lib/api/withErrorHandling";
import { withValidation } from "@/lib/api/withValidation";

async function handlePOST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new BadRequestError("Invalid JSON");
  }

  const parsed = withValidation(behavioralTriggerSchema, body);
  const payload = await getPayloadSingleton();

  const doc = await payload.create({
    collection: "behavioral-triggers",
    data: {
      sessionId: parsed.sessionId,
      triggerType: parsed.triggerType,
      triggerValue: parsed.triggerValue,
      actionType: parsed.actionType,
      actionContent: parsed.actionContent,
      converted: parsed.converted ?? false,
      page: parsed.page,
      device: parsed.device,
    },
    overrideAccess: true,
  });

  return NextResponse.json(jsonSuccess(doc, "Trigger tracked"), { status: 201 });
}

export const POST = withErrorHandling(handlePOST);
```

### src/app/api/lead-optimization/triggers/rules/route.ts
```
import { NextResponse } from "next/server";
import { BadRequestError } from "@/lib/api/errors";
import { jsonSuccess } from "@/lib/api/response";
import { triggerRulesBodySchema } from "@/lib/api/phase3Schemas";
import { getTriggerRulesForBehavior } from "@/lib/api/triggerRules";
import { withErrorHandling } from "@/lib/api/withErrorHandling";
import { withValidation } from "@/lib/api/withValidation";

async function handlePOST(request: Request) {
  const url = new URL(request.url);
  const page = url.searchParams.get("page") ?? "/";
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new BadRequestError("Invalid JSON");
  }

  const behavior = withValidation(triggerRulesBodySchema, body);
  const rules = getTriggerRulesForBehavior(page, behavior);

  return NextResponse.json(
    jsonSuccess(rules, "Trigger rules retrieved")
  );
}

export const POST = withErrorHandling(handlePOST);
```

### src/app/api/lead-scoring/hot-leads/route.ts
```
import { NextResponse } from "next/server";
import { jsonSuccess } from "@/lib/api/response";
import { getHotLeadsForAdmin } from "@/lib/services/leadScoring.service";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handleGET(request: Request) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  const url = new URL(request.url);
  const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
  const limit = Math.min(100, Number(url.searchParams.get("limit")) || 20);
  const search = url.searchParams.get("search") || "";
  const status = url.searchParams.get("status") || "";

  const { leads, meta } = await getHotLeadsForAdmin({
    threshold: Number(url.searchParams.get("threshold")) || 70,
    page,
    limit,
    search,
    status,
  });

  return NextResponse.json(
    jsonSuccess({ leads, meta }, "Hot leads retrieved successfully")
  );
}

export const GET = withErrorHandling(handleGET);
```

### src/app/api/lead-scoring/score-all/route.ts
```
import { NextResponse } from "next/server";
import { jsonSuccess } from "@/lib/api/response";
import { bulkScoreAllLeads } from "@/lib/services/leadScoring.service";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handlePOST(request: Request) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  const { scored, failed } = await bulkScoreAllLeads();

  return NextResponse.json(
    jsonSuccess({ scored, failed }, "Bulk scoring complete")
  );
}

export const POST = withErrorHandling(handlePOST);
```

### src/app/api/lead-scoring/score/[id]/route.ts
```
import { NextResponse } from "next/server";
import { BadRequestError, NotFoundError } from "@/lib/api/errors";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { jsonSuccess } from "@/lib/api/response";
import { scoreLeadFromSubmission } from "@/lib/services/leadScoring.service";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handleGET(request: Request, context: any) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  const { id } = await context.params;

  const payload = await getPayloadSingleton();
  const found = await payload.find({
    collection: "lead-scores",
    where: { formSubmission: { equals: id } },
    limit: 1,
    depth: 1,
    overrideAccess: true,
  });

  if (!found.docs[0]) {
    throw new NotFoundError("Lead score not found for this submission");
  }

  return NextResponse.json(jsonSuccess(found.docs[0]));
}

async function handlePOST(request: Request, context: any) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  const { id } = await context.params;
  if (id == null || id === "") {
    throw new BadRequestError("Invalid form submission id");
  }

  try {
    const score = await scoreLeadFromSubmission(String(id));
    return NextResponse.json(
      jsonSuccess(score, "Lead scored successfully")
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes("not found")) {
      throw new NotFoundError(msg);
    }
    throw new BadRequestError(msg);
  }
}

export const GET = withErrorHandling(handleGET);
export const POST = withErrorHandling(handlePOST);
```

### src/app/api/lead-scoring/track/abandonment/route.ts
```
import { NextResponse } from "next/server";
import { BadRequestError } from "@/lib/api/errors";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { formAbandonmentSchema } from "@/lib/api/phase3Schemas";
import { jsonSuccess } from "@/lib/api/response";
import { withErrorHandling } from "@/lib/api/withErrorHandling";
import { withValidation } from "@/lib/api/withValidation";

async function handlePOST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new BadRequestError("Invalid JSON");
  }

  const parsed = withValidation(formAbandonmentSchema, body);
  const payload = await getPayloadSingleton();

  const existing = await payload.find({
    collection: "form-abandonments",
    where: { sessionId: { equals: parsed.sessionId } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });

  const data = {
    sessionId: parsed.sessionId,
    formType: parsed.formType,
    currentStep: parsed.currentStep,
    completedSteps: parsed.completedSteps,
    email: parsed.email,
    name: parsed.name,
    phone: parsed.phone,
    lastField: parsed.lastField,
    timeSpent: parsed.timeSpent,
    device: parsed.device,
    browser: parsed.browser,
    country: parsed.country,
    city: parsed.city,
    campaignName: parsed.campaignName,
    adSetName: parsed.adSetName,
    utmSource: parsed.utmSource,
    utmMedium: parsed.utmMedium,
  };

  if (existing.docs[0]) {
    await payload.update({
      collection: "form-abandonments",
      id: existing.docs[0].id,
      data,
      overrideAccess: true,
    });
  } else {
    await payload.create({
      collection: "form-abandonments",
      data,
      overrideAccess: true,
    });
  }

  return NextResponse.json(jsonSuccess(undefined, "Abandonment tracked"));
}

export const POST = withErrorHandling(handlePOST);
```

### src/app/api/lead-scoring/track/event/route.ts
```
import { NextResponse } from "next/server";
import { BadRequestError } from "@/lib/api/errors";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { conversionTrackEventSchema } from "@/lib/api/phase3Schemas";
import { jsonSuccess } from "@/lib/api/response";
import { withErrorHandling } from "@/lib/api/withErrorHandling";
import { withValidation } from "@/lib/api/withValidation";

async function handlePOST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new BadRequestError("Invalid JSON");
  }

  const parsed = withValidation(conversionTrackEventSchema, body);
  const payload = await getPayloadSingleton();

  const doc = await payload.create({
    collection: "conversion-events",
    data: {
      sessionId: parsed.sessionId,
      eventType: parsed.eventType,
      eventData: parsed.eventData ?? undefined,
      page: parsed.page ?? "/",
      formType: parsed.formType,
      abTestVariant: parsed.abTestVariant,
      occurredAt: new Date().toISOString(),
    },
    overrideAccess: true,
  });

  return NextResponse.json(
    jsonSuccess(
      { id: doc.id, sessionId: parsed.sessionId, eventType: parsed.eventType },
      "Event tracked"
    ),
    { status: 201 }
  );
}

export const POST = withErrorHandling(handlePOST);
```

### src/app/api/lead-scoring/track/exit-intent/route.ts
```
import { NextResponse } from "next/server";
import { BadRequestError } from "@/lib/api/errors";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { exitIntentTrackSchema } from "@/lib/api/phase3Schemas";
import { jsonSuccess } from "@/lib/api/response";
import { withErrorHandling } from "@/lib/api/withErrorHandling";
import { withValidation } from "@/lib/api/withValidation";

async function handlePOST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new BadRequestError("Invalid JSON");
  }

  const parsed = withValidation(exitIntentTrackSchema, body);
  const payload = await getPayloadSingleton();

  const doc = await payload.create({
    collection: "exit-intents",
    data: {
      sessionId: parsed.sessionId,
      page: parsed.page,
      timeOnPage: parsed.timeOnPage,
      scrollDepth: parsed.scrollDepth,
      popupType: parsed.popupType,
      popupContent: parsed.popupContent,
      action: parsed.action,
      emailCaptured: parsed.emailCaptured,
      device: parsed.device,
      referrer: parsed.referrer,
    },
    overrideAccess: true,
  });

  return NextResponse.json(
    jsonSuccess(doc, "Exit intent recorded"),
    { status: 201 }
  );
}

export const POST = withErrorHandling(handlePOST);
```

### src/app/api/media/[id]/usage/route.ts
```
import { NextResponse } from "next/server";
import { NotFoundError } from "@/lib/api/errors";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { jsonSuccess } from "@/lib/api/response";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handleGET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN", "EDITOR"]);
  const { id } = await context.params;
  const payload = await getPayloadSingleton();

  const found = await payload.findByID({
    collection: "media",
    id,
    depth: 0,
    overrideAccess: true,
  });
  if (!found) {
    throw new NotFoundError("Media not found");
  }

  const usage: { type: string; id: string | number; title?: string }[] = [];

  const posts = await payload.find({
    collection: "posts",
    where: { heroImage: { equals: id } },
    limit: 100,
    depth: 0,
    overrideAccess: true,
  });
  for (const p of posts.docs) {
    usage.push({
      type: "post",
      id: p.id,
      title: String((p as { title?: string }).title || ""),
    });
  }

  return NextResponse.json(jsonSuccess({ usage }));
}

export const GET = withErrorHandling(handleGET);
```

### src/app/api/media/audit/unused/route.ts
```
import { NextResponse } from "next/server";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { jsonSuccess } from "@/lib/api/response";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

/** Media not referenced as a post `heroImage` (best-effort; does not scan rich text). */
async function handleGET(request: Request) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN", "EDITOR"]);
  const payload = await getPayloadSingleton();

  const posts = await payload.find({
    collection: "posts",
    limit: 10_000,
    depth: 0,
    overrideAccess: true,
  });

  const used = new Set<string>();
  for (const p of posts.docs) {
    const h = (p as { heroImage?: unknown }).heroImage;
    if (h == null) continue;
    if (typeof h === "object" && h !== null && "id" in h) {
      used.add(String((h as { id: string | number }).id));
    } else {
      used.add(String(h));
    }
  }

  const media = await payload.find({
    collection: "media",
    limit: 10_000,
    sort: "-createdAt",
    depth: 0,
    overrideAccess: true,
  });

  const unused = media.docs.filter((m) => !used.has(String(m.id)));

  return NextResponse.json(
    jsonSuccess({
      media: unused,
      meta: {
        total: unused.length,
        page: 1,
        limit: unused.length,
        pages: 1,
      },
    })
  );
}

export const GET = withErrorHandling(handleGET);
```

### src/app/api/media/bulk-delete/route.ts
```
import { NextResponse } from "next/server";
import { BadRequestError } from "@/lib/api/errors";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { jsonSuccess } from "@/lib/api/response";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handlePOST(request: Request) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN", "EDITOR"]);
  let body: { ids?: (string | number)[] };
  try {
    body = (await request.json()) as { ids?: (string | number)[] };
  } catch {
    throw new BadRequestError("Invalid JSON");
  }
  const ids = Array.isArray(body.ids) ? body.ids : [];
  if (ids.length === 0) {
    throw new BadRequestError("ids array required");
  }

  const payload = await getPayloadSingleton();
  let deletedCount = 0;
  for (const id of ids) {
    try {
      await payload.delete({
        collection: "media",
        id,
        overrideAccess: true,
      });
      deletedCount++;
    } catch {
      /* continue */
    }
  }

  return NextResponse.json(jsonSuccess({ deletedCount }));
}

export const POST = withErrorHandling(handlePOST);
```

### src/app/api/performance/cache/clear/route.ts
```
import { NextResponse } from "next/server";
import { jsonSuccess } from "@/lib/api/response";
import { cacheFlush } from "@/lib/services/cache.service";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handlePOST(request: Request) {
  await withAuth(request, ["SUPER_ADMIN"]);
  await cacheFlush();
  return NextResponse.json(jsonSuccess(null, "Cache cleared"));
}

export const POST = withErrorHandling(handlePOST);
```

### src/app/api/performance/cache/stats/route.ts
```
import { NextResponse } from "next/server";
import { jsonSuccess } from "@/lib/api/response";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handleGET(request: Request) {
  await withAuth(request, ["SUPER_ADMIN"]);
  const hasRedis = Boolean(process.env.REDIS_URL?.trim());
  return NextResponse.json(
    jsonSuccess({
      backend: hasRedis ? "redis" : "memory",
      redisConfigured: hasRedis,
    })
  );
}

export const GET = withErrorHandling(handleGET);
```

### src/app/api/performance/database/stats/route.ts
```
import { NextResponse } from "next/server";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { jsonSuccess } from "@/lib/api/response";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handleGET(request: Request) {
  await withAuth(request, ["SUPER_ADMIN"]);
  const payload = await getPayloadSingleton();
  const collections = [
    "posts",
    "pages",
    "media",
    "form-submissions",
    "users",
  ] as const;
  const counts: Record<string, number> = {};
  for (const slug of collections) {
    try {
      const r = await payload.find({
        collection: slug,
        where: {},
        limit: 0,
        depth: 0,
        overrideAccess: true,
      });
      counts[slug] = r.totalDocs;
    } catch {
      counts[slug] = -1;
    }
  }
  return NextResponse.json(jsonSuccess({ collectionCounts: counts }));
}

export const GET = withErrorHandling(handleGET);
```

### src/app/api/performance/metrics/route.ts
```
import { NextResponse } from "next/server";
import { jsonSuccess } from "@/lib/api/response";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";
import os from "os";

async function handleGET(request: Request) {
  await withAuth(request, ["SUPER_ADMIN"]);
  const mem = process.memoryUsage();
  return NextResponse.json(
    jsonSuccess({
      uptime: process.uptime(),
      memory: {
        rss: mem.rss,
        heapUsed: mem.heapUsed,
        heapTotal: mem.heapTotal,
      },
      loadavg: os.loadavg(),
      cpus: os.cpus().length,
    })
  );
}

export const GET = withErrorHandling(handleGET);
```

### src/app/api/posts/[id]/autosave/route.ts
```
import { NextResponse } from "next/server";
import { BadRequestError } from "@/lib/api/errors";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { jsonSuccess } from "@/lib/api/response";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handlePATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN", "EDITOR"]);
  const { id } = await context.params;
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    throw new BadRequestError("Invalid JSON");
  }

  const payload = await getPayloadSingleton();

  const allowed = [
    "content",
    "wordpressHtml",
    "title",
    "meta",
    "metrics",
    "seoAnalysis",
  ] as const;
  const data: Record<string, unknown> = {};
  for (const k of allowed) {
    if (k in body) data[k] = body[k];
  }

  if (Object.keys(data).length === 0) {
    throw new BadRequestError("No allowed fields to autosave");
  }

  const updated = await payload.update({
    collection: "posts",
    id,
    data,
    overrideAccess: true,
  });

  return NextResponse.json(jsonSuccess(updated, "Autosaved"));
}

export const PATCH = withErrorHandling(handlePATCH);
```

### src/app/api/posts/[id]/publish/route.ts
```
import { NextResponse } from "next/server";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { jsonSuccess } from "@/lib/api/response";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handlePATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN", "EDITOR"]);
  const { id } = await context.params;

  const payload = await getPayloadSingleton();
  const now = new Date().toISOString();

  const updated = await payload.update({
    collection: "posts",
    id,
    data: {
      _status: "published",
      publishedDate: now,
    },
    overrideAccess: true,
  });

  return NextResponse.json(jsonSuccess(updated, "Published"));
}

export const PATCH = withErrorHandling(handlePATCH);
```

### src/app/api/posts/slug/[slug]/route.ts
```
import { NextResponse } from 'next/server'
import { getPayloadSingleton } from '@/lib/api/getPayload'
import { withErrorHandling } from '@/lib/api/withErrorHandling'
import { jsonSuccess, jsonError } from '@/lib/api/response'

async function handleGET(request: Request, context: any) {
  const { slug } = await context.params
  const payload = await getPayloadSingleton()

  const result = await payload.find({
    collection: 'posts',
    where: { slug: { equals: slug }, _status: { equals: 'published' } },
    limit: 1,
    depth: 2,
  })

  if (!result.docs.length) {
    return NextResponse.json(jsonError('Post not found'), { status: 404 })
  }

  const post = result.docs[0] as any

  const related = await payload.find({
    collection: 'posts',
    where: {
      slug: { not_equals: slug },
      _status: { equals: 'published' },
    },
    limit: 3,
    depth: 1,
  })

  return NextResponse.json(jsonSuccess({
    post: {
      ...post,
      wordpressHtml: post.wordpressHtml,
      metaTitle: post.meta?.title,
      metaDescription: post.meta?.description,
      featuredImage: post.heroImage?.url || null,
    },
    relatedPosts: related.docs.map((p: any) => ({
      ...p,
      featuredImage: p.heroImage?.url || null,
    }))
  }, 'Post fetched'))
}

export const GET = withErrorHandling(handleGET)
```

### src/app/api/search-optimization/analysis/[id]/route.ts
```
import { NextResponse } from "next/server";
import { BadRequestError, NotFoundError } from "@/lib/api/errors";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { jsonSuccess } from "@/lib/api/response";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handleGET(
  request: Request,
  context: any
) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  const { id } = await context.params;
  const postId = Number(id);
  if (!Number.isFinite(postId)) {
    throw new BadRequestError("Invalid post id");
  }

  const payload = await getPayloadSingleton();
  const res = await payload.find({
    collection: "seo-analyses",
    where: { post: { equals: postId } },
    sort: "-analyzedAt",
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });

  if (!res.docs[0]) {
    throw new NotFoundError("No SEO analysis for this post");
  }

  return NextResponse.json(jsonSuccess(res.docs[0]));
}

export const GET = withErrorHandling(handleGET);
```

### src/app/api/search-optimization/analyze-all/route.ts
```
import { NextResponse } from "next/server";
import { jsonSuccess } from "@/lib/api/response";
import { analyzeAllPosts } from "@/lib/services/seoAnalysis.service";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handlePOST(request: Request) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  const { analyzed, failed } = await analyzeAllPosts();

  return NextResponse.json(
    jsonSuccess({ analyzed, failed }, "Bulk SEO analysis finished")
  );
}

export const POST = withErrorHandling(handlePOST);
```

### src/app/api/search-optimization/analyze-draft/route.ts
```
import { NextResponse } from "next/server";
import { BadRequestError } from "@/lib/api/errors";
import { analyzeDraftSchema } from "@/lib/api/phase3Schemas";
import { jsonSuccess } from "@/lib/api/response";
import { analyzeDraft } from "@/lib/services/seoAnalysis.service";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";
import { withValidation } from "@/lib/api/withValidation";

async function handlePOST(request: Request) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new BadRequestError("Invalid JSON");
  }

  const parsed = withValidation(analyzeDraftSchema, body) as Record<
    string,
    unknown
  >;
  const content = String(
    parsed.content ?? parsed.html ?? parsed.body ?? ""
  );
  const title = String(
    parsed.title ?? parsed.seoTitle ?? "Draft"
  );
  const focusKeyword = String(
    parsed.keywords ?? parsed.focusKeyword ?? ""
  );

  const draft = await analyzeDraft(content, title, focusKeyword);

  return NextResponse.json(jsonSuccess(draft, "Draft analyzed"));
}

export const POST = withErrorHandling(handlePOST);
```

### src/app/api/search-optimization/analyze/[id]/route.ts
```
import { NextResponse } from "next/server";
import { BadRequestError } from "@/lib/api/errors";
import { jsonSuccess } from "@/lib/api/response";
import { analyzePost } from "@/lib/services/seoAnalysis.service";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handlePOST(request: Request, context: any) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  const { id } = await context.params;
  if (id == null || id === "") {
    throw new BadRequestError("Invalid post id");
  }

  try {
    const doc = await analyzePost(String(id));
    return NextResponse.json(jsonSuccess(doc, "Analysis complete"));
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    throw new BadRequestError(msg);
  }
}

export const POST = withErrorHandling(handlePOST);
```

### src/app/api/search-optimization/keywords/[keyword]/history/route.ts
```
import { NextResponse } from "next/server";
import { NotFoundError } from "@/lib/api/errors";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { jsonSuccess } from "@/lib/api/response";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handleGET(
  request: Request,
  context: any
) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  const { keyword: raw } = await context.params;
  const keyword = decodeURIComponent(raw);

  const payload = await getPayloadSingleton();
  const res = await payload.find({
    collection: "keywords",
    where: { keyword: { equals: keyword } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });

  if (!res.docs[0]) {
    throw new NotFoundError("Keyword not tracked");
  }

  const history = res.docs[0].positionHistory ?? [];

  return NextResponse.json(
    jsonSuccess({ keyword, history })
  );
}

export const GET = withErrorHandling(handleGET);
```

### src/app/api/search-optimization/keywords/route.ts
```
import { NextResponse } from "next/server";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { jsonSuccess } from "@/lib/api/response";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handleGET(request: Request) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  const url = new URL(request.url);
  const limit = Math.min(Number(url.searchParams.get("limit")) || 100, 300);

  const payload = await getPayloadSingleton();
  const res = await payload.find({
    collection: "keywords",
    sort: "keyword",
    limit,
    depth: 0,
    overrideAccess: true,
  });

  return NextResponse.json(jsonSuccess(res.docs));
}

export const GET = withErrorHandling(handleGET);
```

### src/app/api/search-optimization/keywords/track/route.ts
```
import { NextResponse } from "next/server";
import { BadRequestError } from "@/lib/api/errors";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { keywordTrackSchema } from "@/lib/api/phase3Schemas";
import { jsonSuccess } from "@/lib/api/response";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";
import { withValidation } from "@/lib/api/withValidation";

async function handlePOST(request: Request) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new BadRequestError("Invalid JSON");
  }

  const parsed = withValidation(keywordTrackSchema, body);
  const rec = parsed as Record<string, unknown>;
  const keyword = String(rec.keyword ?? rec.term ?? "");
  if (!keyword.length) {
    throw new BadRequestError("keyword is required");
  }

  const position =
    typeof rec.position === "number"
      ? rec.position
      : rec.position != null
        ? Number(rec.position)
        : 50;
  const now = new Date().toISOString();
  const entry = {
    date: now,
    position: Number.isFinite(position) ? position : 50,
    note: "stub rank — connect rank tracker API",
  };

  const payload = await getPayloadSingleton();
  const existing = await payload.find({
    collection: "keywords",
    where: { keyword: { equals: keyword } },
    limit: 1,
    overrideAccess: true,
  });

  let doc: unknown;
  if (existing.docs[0]) {
    const prev = (existing.docs[0].positionHistory as unknown[]) ?? [];
    doc = await payload.update({
      collection: "keywords",
      id: existing.docs[0].id,
      data: {
        position: entry.position,
        lastChecked: now,
        positionHistory: [...prev, entry],
        url: rec.url != null ? String(rec.url) : existing.docs[0].url,
      },
      overrideAccess: true,
    });
  } else {
    doc = await payload.create({
      collection: "keywords",
      data: {
        keyword,
        position: entry.position,
        searchVolume: rec.searchVolume != null ? Number(rec.searchVolume) : undefined,
        difficulty: rec.difficulty != null ? Number(rec.difficulty) : undefined,
        url: rec.url != null ? String(rec.url) : undefined,
        trackedSince: now,
        lastChecked: now,
        positionHistory: [entry],
      },
      overrideAccess: true,
    });
  }

  return NextResponse.json(jsonSuccess(doc, "Keyword tracked"));
}

export const POST = withErrorHandling(handlePOST);
```

### src/app/api/search-optimization/links/route.ts
```
import { NextResponse } from "next/server";
import { BadRequestError } from "@/lib/api/errors";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { internalLinkCreateSchema } from "@/lib/api/phase3Schemas";
import { jsonSuccess } from "@/lib/api/response";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";
import { withValidation } from "@/lib/api/withValidation";

async function handlePOST(request: Request) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new BadRequestError("Invalid JSON");
  }

  const parsed = withValidation(internalLinkCreateSchema, body);
  const payload = await getPayloadSingleton();

  const doc = await payload.create({
    collection: "internal-links",
    data: {
      fromPost: parsed.fromPost,
      toPost: parsed.toPost,
      anchorText: parsed.anchorText,
      position: parsed.position,
      relevanceScore: parsed.relevanceScore,
    },
    overrideAccess: true,
  });

  return NextResponse.json(
    jsonSuccess(doc, "Internal link created"),
    { status: 201 }
  );
}

export const POST = withErrorHandling(handlePOST);
```

### src/app/api/search-optimization/links/suggestions/[id]/route.ts
```
import { NextResponse } from "next/server";
import { BadRequestError, NotFoundError } from "@/lib/api/errors";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { jsonSuccess } from "@/lib/api/response";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handleGET(
  request: Request,
  context: any
) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  const { id } = await context.params;
  const postId = Number(id);
  if (!Number.isFinite(postId)) {
    throw new BadRequestError("Invalid post id");
  }

  const payload = await getPayloadSingleton();
  try {
    await payload.findByID({
      collection: "posts",
      id: postId,
      depth: 0,
      overrideAccess: true,
    });
  } catch {
    throw new NotFoundError("Post not found");
  }

  const others = await payload.find({
    collection: "posts",
    limit: 24,
    depth: 0,
    overrideAccess: true,
  });

  const filtered = others.docs.filter((p) => Number(p.id) !== postId).slice(0, 8);

  const suggestions = filtered.map((p) => ({
    postId: p.id,
    slug: (p as { slug?: string }).slug,
    title: (p as { title?: string }).title,
    relevanceScore: 0.42,
    note: "Heuristic stub — replace with embeddings / topic model",
  }));

  return NextResponse.json(jsonSuccess({ suggestions }));
}

export const GET = withErrorHandling(handleGET);
```

### src/app/api/search-optimization/overview/route.ts
```
import { NextResponse } from "next/server";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { jsonSuccess } from "@/lib/api/response";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handleGET(request: Request) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  const payload = await getPayloadSingleton();

  const [posts, analyses, keywords, links] = await Promise.all([
    payload.find({
      collection: "posts",
      where: { _status: { equals: "published" } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    }),
    payload.find({
      collection: "seo-analyses",
      limit: 1,
      depth: 0,
      overrideAccess: true,
    }),
    payload.find({
      collection: "keywords",
      limit: 1,
      depth: 0,
      overrideAccess: true,
    }),
    payload.find({
      collection: "internal-links",
      limit: 1,
      depth: 0,
      overrideAccess: true,
    }),
  ]);

  return NextResponse.json(
    jsonSuccess(
      {
        publishedPosts: posts.totalDocs,
        seoAnalyses: analyses.totalDocs,
        trackedKeywords: keywords.totalDocs,
        internalLinks: links.totalDocs,
        note: "High-level counts only — detailed scoring is stubbed until external SEO tools are wired.",
      },
      "SEO overview"
    )
  );
}

export const GET = withErrorHandling(handleGET);
```

### src/app/api/search-optimization/schema/[id]/route.ts
```
import { NextResponse } from "next/server";
import { BadRequestError, NotFoundError } from "@/lib/api/errors";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { buildArticleJsonLd } from "@/lib/api/seoHelpers";
import { jsonSuccess } from "@/lib/api/response";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handlePOST(
  request: Request,
  context: any
) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  const { id } = await context.params;
  const postId = Number(id);
  if (!Number.isFinite(postId)) {
    throw new BadRequestError("Invalid post id");
  }

  const payload = await getPayloadSingleton();
  let post: {
    id: string | number;
    slug?: string;
    title?: string;
    meta?: { description?: string };
  };
  try {
    post = (await payload.findByID({
      collection: "posts",
      id: postId,
      depth: 0,
      overrideAccess: true,
    })) as typeof post;
  } catch {
    throw new NotFoundError("Post not found");
  }

  if (!post?.id) {
    throw new NotFoundError("Post not found");
  }

  const schema = buildArticleJsonLd({
    slug: String(post.slug ?? postId),
    title: post.title,
    description: post.meta?.description,
  });

  await payload.update({
    collection: "posts",
    id: postId,
    data: {
      structuredData: {
        schemaType: "Custom" as const,
        customSchema: schema,
      },
    },
    overrideAccess: true,
  });

  return NextResponse.json(
    jsonSuccess({ schema, savedToPost: true }, "Schema generated (stub Article)")
  );
}

export const POST = withErrorHandling(handlePOST);
```

### src/app/api/security/block-ip/route.ts
```
import { NextResponse } from "next/server";
import { BadRequestError } from "@/lib/api/errors";
import { jsonSuccess } from "@/lib/api/response";
import { createBlockedIp } from "@/lib/api/securityAdmin";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handlePOST(request: Request) {
  const user = await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  let body: { ip?: string; reason?: string; durationMinutes?: number };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    throw new BadRequestError("Invalid JSON");
  }

  const ip = body.ip?.trim();
  const reason = body.reason?.trim();
  const durationMinutes = Number(body.durationMinutes);

  if (!ip || !reason) {
    throw new BadRequestError("IP and reason are required");
  }

  await createBlockedIp({
    ip,
    reason,
    durationMinutes: Number.isFinite(durationMinutes) ? durationMinutes : 60,
    userId: user.id,
  });

  return NextResponse.json(jsonSuccess(null, "IP blocked"));
}

export const POST = withErrorHandling(handlePOST);
```

### src/app/api/security/blocked-ips/route.ts
```
import { NextResponse } from "next/server";
import { jsonSuccess } from "@/lib/api/response";
import { listBlockedIpsForAdmin } from "@/lib/api/securityAdmin";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handleGET(request: Request) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  const rows = await listBlockedIpsForAdmin();
  return NextResponse.json(jsonSuccess(rows));
}

export const GET = withErrorHandling(handleGET);
```

### src/app/api/security/dashboard/route.ts
```
import { NextResponse } from "next/server";
import { jsonSuccess } from "@/lib/api/response";
import { getSecurityDashboardStats } from "@/lib/api/securityAdmin";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handleGET(request: Request) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  const url = new URL(request.url);
  const days = Math.min(90, Math.max(1, Number(url.searchParams.get("days")) || 7));

  const stats = await getSecurityDashboardStats(days);
  return NextResponse.json(jsonSuccess(stats));
}

export const GET = withErrorHandling(handleGET);
```

### src/app/api/security/logs/security/route.ts
```
import { NextResponse } from "next/server";
import { jsonSuccess } from "@/lib/api/response";
import { listSecurityLogsForAdmin } from "@/lib/api/securityAdmin";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handleGET(request: Request) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  const url = new URL(request.url);
  const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
  const limit = Math.min(100, Number(url.searchParams.get("limit")) || 20);
  const eventType = url.searchParams.get("eventType") || undefined;
  const eventLevel =
    url.searchParams.get("eventLevel") || url.searchParams.get("severity") || undefined;
  const search = url.searchParams.get("search") || undefined;

  const data = await listSecurityLogsForAdmin({
    page,
    limit,
    eventType,
    eventLevel,
    search,
  });

  return NextResponse.json(jsonSuccess(data));
}

export const GET = withErrorHandling(handleGET);
```

### src/app/api/security/unblock-ip/route.ts
```
import { NextResponse } from "next/server";
import { BadRequestError } from "@/lib/api/errors";
import { jsonSuccess } from "@/lib/api/response";
import { removeBlockedIpByAddress } from "@/lib/api/securityAdmin";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handlePOST(request: Request) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  let body: { ip?: string };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    throw new BadRequestError("Invalid JSON");
  }

  const ip = body.ip?.trim();
  if (!ip) {
    throw new BadRequestError("IP is required");
  }

  await removeBlockedIpByAddress(ip);
  return NextResponse.json(jsonSuccess(null, "IP unblocked"));
}

export const POST = withErrorHandling(handlePOST);
```

### src/app/api/tracking/campaigns/route.ts
```
import { NextResponse } from "next/server";
import { jsonSuccess } from "@/lib/api/response";
import { aggregateCampaignList } from "@/lib/api/trackingAggregates";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handleGET(request: Request) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN", "EDITOR"]);
  const data = await aggregateCampaignList();
  return NextResponse.json(jsonSuccess(data));
}

export const GET = withErrorHandling(handleGET);
```

### src/app/api/tracking/click/route.ts
```
import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { BadRequestError } from "@/lib/api/errors";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { jsonSuccess } from "@/lib/api/response";
import { withErrorHandling } from "@/lib/api/withErrorHandling";
import { withValidation } from "@/lib/api/withValidation";
import { getClientIpFromHeaders } from "@/lib/security/rateLimit";
import { adClickSchema } from "@/lib/security/validation";
import {
  getGeoLocation,
  parseUserAgent,
} from "@/lib/services/tracking.service";

async function handlePOST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new BadRequestError("Invalid JSON");
  }

  const parsed = withValidation(adClickSchema, body);
  const finalParams = {
    campaignName: parsed.CampaignName,
    adSetName: parsed.AdSetName,
    adName: parsed.AdName,
    campaignSource: parsed.CampaignSource,
    placement: parsed.Placement,
    utmSource: parsed.utm_source,
    utmMedium: parsed.utm_medium,
    utmCampaign: parsed.utm_campaign,
    utmTerm: parsed.utm_term,
    utmContent: parsed.utm_content,
  };

  const userAgent = request.headers.get("user-agent");
  const { device, browser } = parseUserAgent(userAgent);
  const ipRaw = getClientIpFromHeaders(request.headers);

  let country: string | undefined;
  let city: string | undefined;
  try {
    const geo = await getGeoLocation(ipRaw);
    if (geo) {
      country = geo.country;
      city = geo.city;
    }
  } catch {
    /* never break tracking */
  }

  const landingPage =
    parsed.landingPage ??
    request.headers.get("referer") ??
    "unknown";
  const referrer = parsed.referrer ?? request.headers.get("referer") ?? undefined;

  const finalSessionId = parsed.sessionId?.trim() || randomUUID();

  const payload = await getPayloadSingleton();

  const existing = await payload.find({
    collection: "ad-clicks",
    where: { sessionId: { equals: finalSessionId } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });

  if (existing.docs.length > 0) {
    return NextResponse.json(
      jsonSuccess({ sessionId: finalSessionId }, "Session already tracked")
    );
  }

  await payload.create({
    collection: "ad-clicks",
    data: {
      sessionId: finalSessionId,
      ...finalParams,
      landingPage,
      referrer,
      ipAddress: ipRaw,
      userAgent: userAgent ?? undefined,
      device: device ?? undefined,
      browser: browser ?? undefined,
      country: country ?? undefined,
      city: city ?? undefined,
    },
    overrideAccess: true,
  });

  return NextResponse.json(
    jsonSuccess({ sessionId: finalSessionId }, "Ad click captured")
  );
}

export const POST = withErrorHandling(handlePOST);
```

### src/app/api/tracking/clicks/[id]/route.ts
```
import { NextResponse } from "next/server";
import { NotFoundError } from "@/lib/api/errors";
import { jsonSuccess } from "@/lib/api/response";
import { getAdClickById } from "@/lib/api/trackingAggregates";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handleGET(request: Request, context: { params: Promise<{ id: string }> }) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN", "EDITOR"]);
  const { id } = await context.params;
  const doc = await getAdClickById(id);
  if (!doc) {
    throw new NotFoundError("Ad click not found");
  }
  return NextResponse.json(jsonSuccess(doc));
}

export const GET = withErrorHandling(handleGET);
```

### src/app/api/tracking/conversion/route.ts
```
import { NextResponse } from "next/server";
import {
  BadRequestError,
  NotFoundError,
} from "@/lib/api/errors";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { jsonSuccess } from "@/lib/api/response";
import { withErrorHandling } from "@/lib/api/withErrorHandling";
import { withValidation } from "@/lib/api/withValidation";
import { conversionSchema } from "@/lib/security/validation";

async function handlePOST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new BadRequestError("Invalid JSON");
  }

  const parsed = withValidation(conversionSchema, body);
  const payload = await getPayloadSingleton();

  const found = await payload.find({
    collection: "ad-clicks",
    where: { sessionId: { equals: parsed.sessionId } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  });

  const adClickDoc = found.docs[0];
  if (!adClickDoc) {
    throw new NotFoundError("Ad click session not found");
  }

  const conversionValue = parsed.conversionValue ?? 0;

  await payload.update({
    collection: "ad-clicks",
    id: adClickDoc.id,
    data: {
      converted: true,
      conversionType: parsed.conversionType,
      conversionValue,
    },
    overrideAccess: true,
  });

  await payload.create({
    collection: "ad-conversions",
    data: {
      adClick: adClickDoc.id,
      conversionType: parsed.conversionType,
      conversionValue,
    },
    overrideAccess: true,
  });

  return NextResponse.json(
    jsonSuccess(undefined, "Conversion tracked successfully")
  );
}

export const POST = withErrorHandling(handlePOST);
```

### src/app/api/tracking/performance/route.ts
```
import { NextResponse } from "next/server";
import { jsonSuccess } from "@/lib/api/response";
import {
  aggregateAdPerformance,
} from "@/lib/api/trackingAggregates";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handleGET(request: Request) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN", "EDITOR"]);
  const url = new URL(request.url);
  const startDate = url.searchParams.get("startDate");
  const endDate = url.searchParams.get("endDate");
  const campaignName = url.searchParams.get("campaignName");

  const rows = await aggregateAdPerformance({
    startDate,
    endDate,
    campaignName: campaignName || null,
  });

  return NextResponse.json(jsonSuccess(rows));
}

export const GET = withErrorHandling(handleGET);
```

### src/app/api/users/login/route.ts
```
import { NextResponse } from "next/server";
import { BadRequestError, UnauthorizedError } from "@/lib/api/errors";
import { loginWithPayloadCredentials } from "@/lib/auth/payloadCredentialsLogin";
import { jsonSuccess } from "@/lib/api/response";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handlePOST(request: Request) {
  let body: { email?: string; password?: string };
  try {
    body = (await request.json()) as { email?: string; password?: string };
  } catch {
    throw new BadRequestError("Invalid JSON body");
  }

  const email = body.email?.trim();
  const password = body.password;

  if (!email || !password) {
    throw new BadRequestError("Email and password are required");
  }

  const result = await loginWithPayloadCredentials(email, password);
  if (!result) {
    throw new UnauthorizedError("Invalid credentials");
  }

  const { user: safeUser, token, refreshToken, exp } = result;

  return NextResponse.json(
    jsonSuccess(
      {
        user: safeUser,
        token,
        accessToken: token,
        ...(exp !== undefined ? { exp } : {}),
        ...(refreshToken !== undefined ? { refreshToken } : {}),
      },
      "Login successful"
    )
  );
}

export const POST = withErrorHandling(handlePOST);
```

### src/app/api/users/me/route.ts
```
import { NextResponse } from "next/server";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";
import { jsonSuccess } from "@/lib/api/response";

async function handleGET(request: Request) {
  const user = await withAuth(request);
  const raw = user as Record<string, unknown>;
  const safeUser = {
    id: raw.id != null ? String(raw.id) : "",
    email: typeof raw.email === "string" ? raw.email : "",
    name:
      typeof raw.name === "string"
        ? raw.name
        : typeof raw.email === "string"
          ? raw.email
          : "",
    role:
      typeof raw.role === "string" ? raw.role.toUpperCase() : "ADMIN",
  };

  return NextResponse.json(jsonSuccess({ user: safeUser }, "User fetched"));
}

export const GET = withErrorHandling(handleGET);
```

### src/app/api/users/route.ts
```
import { NextResponse } from "next/server";
import { BadRequestError } from "@/lib/api/errors";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { jsonSuccess } from "@/lib/api/response";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handlePOST(request: Request) {
  let body: { email?: string; password?: string; role?: string };
  try {
    body = (await request.json()) as {
      email?: string;
      password?: string;
      role?: string;
    };
  } catch {
    throw new BadRequestError("Invalid JSON body");
  }

  const email = body.email?.trim();
  const password = body.password;
  const role = (body.role || "ADMIN").toUpperCase();
  const allowedRoles = new Set(["SUPER_ADMIN", "ADMIN", "EDITOR", "USER"]);

  if (!email || !password) {
    throw new BadRequestError("Email and password are required");
  }
  if (!allowedRoles.has(role)) {
    throw new BadRequestError("Invalid role");
  }

  const payload = await getPayloadSingleton();
  const created = await payload.create({
    collection: "users",
    data: { email, password, role },
  });

  return NextResponse.json(
    jsonSuccess(
      {
        id: created.id,
        email: created.email,
        role: (created as { role?: string }).role || role,
      },
      "User created"
    ),
    { status: 201 }
  );
}

export const POST = withErrorHandling(handlePOST);
```

### src/app/api/webhooks/[id]/logs/route.ts
```
import { NextResponse } from "next/server";
import { NotFoundError } from "@/lib/api/errors";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { jsonSuccess } from "@/lib/api/response";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handleGET(
  request: Request,
  context: any
) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  const { id } = await context.params;
  const url = new URL(request.url);
  const limit = Math.min(Number(url.searchParams.get("limit")) || 50, 200);
  const page = Math.max(Number(url.searchParams.get("page")) || 1, 1);

  const payload = await getPayloadSingleton();

  let wh: { id?: string | number };
  try {
    wh = (await payload.findByID({
      collection: "webhooks",
      id,
      depth: 0,
      overrideAccess: true,
    })) as { id?: string | number };
  } catch {
    throw new NotFoundError("Webhook not found");
  }

  if (!wh?.id) {
    throw new NotFoundError("Webhook not found");
  }

  const res = await payload.find({
    collection: "webhook-logs",
    where: { webhook: { equals: id } },
    sort: "-createdAt",
    limit,
    page,
    depth: 0,
    overrideAccess: true,
  });

  const logs = res.docs.map((d) => ({
    id: String(d.id),
    event: d.event,
    status: d.status,
    statusCode: d.statusCode,
    attempts: d.attempts,
    duration: d.duration,
    errorMessage: d.errorMessage,
    createdAt: d.createdAt,
  }));

  return NextResponse.json(
    jsonSuccess({
      logs,
      totalDocs: res.totalDocs,
      page: res.page,
      totalPages: res.totalPages,
    })
  );
}

export const GET = withErrorHandling(handleGET);
```

### src/app/api/webhooks/[id]/route.ts
```
import { NextResponse } from "next/server";
import { BadRequestError, NotFoundError } from "@/lib/api/errors";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { webhookUpdateSchema } from "@/lib/api/phase3Schemas";
import { jsonSuccess } from "@/lib/api/response";
import {
  normalizeWebhookEvents,
  serializeWebhook,
} from "@/lib/api/webhooksHelpers";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";
import { withValidation } from "@/lib/api/withValidation";

async function handleGET(
  request: Request,
  context: any
) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  const { id } = await context.params;
  const payload = await getPayloadSingleton();

  let doc: Record<string, unknown>;
  try {
    doc = (await payload.findByID({
      collection: "webhooks",
      id,
      depth: 0,
      overrideAccess: true,
    })) as Record<string, unknown>;
  } catch {
    throw new NotFoundError("Webhook not found");
  }

  if (!doc?.id) {
    throw new NotFoundError("Webhook not found");
  }

  return NextResponse.json(jsonSuccess(serializeWebhook(doc)));
}

async function handlePUT(
  request: Request,
  context: any
) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  const { id } = await context.params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new BadRequestError("Invalid JSON");
  }

  const parsed = withValidation(webhookUpdateSchema, body);
  const payload = await getPayloadSingleton();

  let existing: Record<string, unknown>;
  try {
    existing = (await payload.findByID({
      collection: "webhooks",
      id,
      depth: 0,
      overrideAccess: true,
    })) as Record<string, unknown>;
  } catch {
    throw new NotFoundError("Webhook not found");
  }

  if (!existing?.id) {
    throw new NotFoundError("Webhook not found");
  }

  const data: Record<string, unknown> = {};
  if (parsed.name !== undefined) data.name = parsed.name;
  if (parsed.url !== undefined) data.url = parsed.url;
  if (parsed.method !== undefined) data.method = parsed.method;
  if (parsed.events !== undefined) {
    data.events = normalizeWebhookEvents(parsed.events);
  }
  if (parsed.headers !== undefined) data.headers = parsed.headers;
  if (parsed.payload !== undefined) data.payload = parsed.payload;
  if (parsed.isActive !== undefined) data.isActive = parsed.isActive;
  if (parsed.retryAttempts !== undefined) data.retryAttempts = parsed.retryAttempts;
  if (parsed.retryDelay !== undefined) data.retryDelay = parsed.retryDelay;
  if (parsed.timeout !== undefined) data.timeout = parsed.timeout;

  const updated = await payload.update({
    collection: "webhooks",
    id,
    data,
    overrideAccess: true,
  });

  return NextResponse.json(
    jsonSuccess(serializeWebhook(updated as Record<string, unknown>), "Webhook updated")
  );
}

async function handleDELETE(
  request: Request,
  context: any
) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  const { id } = await context.params;
  const payload = await getPayloadSingleton();

  try {
    await payload.delete({
      collection: "webhooks",
      id,
      overrideAccess: true,
    });
  } catch {
    throw new NotFoundError("Webhook not found");
  }

  return NextResponse.json(jsonSuccess(undefined, "Webhook deleted"));
}

export const GET = withErrorHandling(handleGET);
export const PUT = withErrorHandling(handlePUT);
export const DELETE = withErrorHandling(handleDELETE);
```

### src/app/api/webhooks/[id]/test/route.ts
```
import { NextResponse } from "next/server";
import { withAuth } from "@/lib/api/withAuth";
import { jsonSuccess } from "@/lib/api/response";
import { withErrorHandling } from "@/lib/api/withErrorHandling";
import { testWebhook } from "@/lib/services/webhook.service";

async function handlePOST(request: Request, context: any) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  const { id } = await context.params;
  const result = await testWebhook(String(id));

  return NextResponse.json(
    jsonSuccess(
      {
        ok: result.success,
        statusCode: result.statusCode,
        durationMs: result.durationMs,
        error: result.error,
      },
      result.success ? "Test delivery succeeded" : "Test delivery failed"
    )
  );
}

export const POST = withErrorHandling(handlePOST);
```

### src/app/api/webhooks/events/route.ts
```
import { NextResponse } from "next/server";
import { WEBHOOK_EVENT_CATALOG } from "@/lib/api/webhookConstants";
import { jsonSuccess } from "@/lib/api/response";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handleGET(request: Request) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  return NextResponse.json(jsonSuccess(WEBHOOK_EVENT_CATALOG));
}

export const GET = withErrorHandling(handleGET);
```

### src/app/api/webhooks/logs/[id]/retry/route.ts
```
import { NextResponse } from "next/server";
import { jsonSuccess } from "@/lib/api/response";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";
import { retryWebhook } from "@/lib/services/webhook.service";

async function handlePOST(request: Request, context: any) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  const { id } = await context.params;
  await retryWebhook(String(id));
  return NextResponse.json(jsonSuccess(undefined, "Retry initiated"));
}

export const POST = withErrorHandling(handlePOST);
```

### src/app/api/webhooks/presets/route.ts
```
import { NextResponse } from "next/server";
import { INTEGRATION_PRESETS } from "@/lib/api/webhookConstants";
import { jsonSuccess } from "@/lib/api/response";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";

async function handleGET(request: Request) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  return NextResponse.json(jsonSuccess(INTEGRATION_PRESETS));
}

export const GET = withErrorHandling(handleGET);
```

### src/app/api/webhooks/route.ts
```
import { NextResponse } from "next/server";
import { BadRequestError } from "@/lib/api/errors";
import { getPayloadSingleton } from "@/lib/api/getPayload";
import { webhookCreateSchema } from "@/lib/api/phase3Schemas";
import { jsonSuccess } from "@/lib/api/response";
import { normalizeWebhookEvents, serializeWebhook } from "@/lib/api/webhooksHelpers";
import { withAuth } from "@/lib/api/withAuth";
import { withErrorHandling } from "@/lib/api/withErrorHandling";
import { withValidation } from "@/lib/api/withValidation";

async function handleGET(request: Request) {
  await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  const url = new URL(request.url);
  const limit = Math.min(Number(url.searchParams.get("limit")) || 50, 200);
  const page = Math.max(Number(url.searchParams.get("page")) || 1, 1);

  const payload = await getPayloadSingleton();
  const res = await payload.find({
    collection: "webhooks",
    limit,
    page,
    sort: "-updatedAt",
    depth: 0,
    overrideAccess: true,
  });

  const webhooks = res.docs.map((d) => serializeWebhook(d as Record<string, unknown>));

  return NextResponse.json(
    jsonSuccess({
      webhooks,
      totalDocs: res.totalDocs,
      page: res.page,
      totalPages: res.totalPages,
    })
  );
}

async function handlePOST(request: Request) {
  const user = await withAuth(request, ["ADMIN", "SUPER_ADMIN"]);
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    throw new BadRequestError("Invalid JSON");
  }

  const parsed = withValidation(webhookCreateSchema, body);
  const events = normalizeWebhookEvents(parsed.events);

  const payload = await getPayloadSingleton();
  const doc = await payload.create({
    collection: "webhooks",
    data: {
      name: parsed.name,
      url: parsed.url,
      method: parsed.method ?? "POST",
      events,
      headers: parsed.headers ?? {},
      payload: parsed.payload ?? undefined,
      isActive: parsed.isActive ?? true,
      retryAttempts: parsed.retryAttempts ?? 3,
      retryDelay: parsed.retryDelay ?? 5000,
      timeout: parsed.timeout ?? 30000,
      createdBy: user.id,
    },
    overrideAccess: true,
  });

  return NextResponse.json(
    jsonSuccess(serializeWebhook(doc as Record<string, unknown>), "Webhook created"),
    { status: 201 }
  );
}

export const GET = withErrorHandling(handleGET);
export const POST = withErrorHandling(handlePOST);
```

## src/collections/ .ts files:
### src/collections/AbTests.ts
```
import type { CollectionConfig } from "payload";
import { sensitiveCollectionAuditHook } from "@/lib/audit/logAudit";
import { sanitizeHook } from "@/lib/security/sanitize";
import { adminOnlyAccess } from "./access/phase2Access";

export const AbTests: CollectionConfig = {
  slug: "ab-tests",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "element", "status", "updatedAt"],
    group: "Experiments",
  },
  access: adminOnlyAccess,
  fields: [
    { name: "name", type: "text", required: true, unique: true },
    { name: "element", type: "text", required: true },
    { name: "status", type: "text", required: true },
    {
      name: "variants",
      type: "json",
      required: true,
    },
    {
      name: "trafficSplit",
      type: "json",
      required: true,
    },
    { name: "impressions", type: "json" },
    { name: "conversions", type: "json" },
    { name: "conversionRates", type: "json" },
    { name: "winner", type: "text" },
    { name: "confidence", type: "number" },
    { name: "startDate", type: "date" },
    { name: "endDate", type: "date" },
  ],
  hooks: {
    beforeOperation: [sanitizeHook],
    afterOperation: [sensitiveCollectionAuditHook("ab-tests")],
  },
};
```

### src/collections/AdClicks.ts
```
import type { CollectionConfig } from "payload";
import { sanitizeHook } from "@/lib/security/sanitize";
import { trackingCollectionAccess } from "./access/phase2Access";

export const AdClicks: CollectionConfig = {
  slug: "ad-clicks",
  admin: {
    useAsTitle: "sessionId",
    defaultColumns: ["sessionId", "utmSource", "converted", "createdAt"],
    group: "Analytics & Tracking",
  },
  access: trackingCollectionAccess,
  fields: [
    { name: "sessionId", type: "text", required: true, unique: true },
    { name: "campaignName", type: "text" },
    { name: "adSetName", type: "text" },
    { name: "adName", type: "text" },
    { name: "campaignSource", type: "text" },
    { name: "placement", type: "text" },
    { name: "utmSource", type: "text" },
    { name: "utmMedium", type: "text" },
    { name: "utmCampaign", type: "text" },
    { name: "utmTerm", type: "text" },
    { name: "utmContent", type: "text" },
    { name: "landingPage", type: "text", required: true },
    { name: "referrer", type: "text" },
    { name: "ipAddress", type: "text" },
    { name: "userAgent", type: "textarea" },
    { name: "device", type: "text" },
    { name: "browser", type: "text" },
    { name: "country", type: "text" },
    { name: "city", type: "text" },
    {
      name: "converted",
      type: "checkbox",
      defaultValue: false,
    },
    { name: "conversionType", type: "text" },
    { name: "conversionValue", type: "number" },
  ],
  hooks: {
    beforeOperation: [sanitizeHook],
  },
};
```

### src/collections/AdConversions.ts
```
import type { CollectionConfig } from "payload";
import { sanitizeHook } from "@/lib/security/sanitize";
import { trackingCollectionAccess } from "./access/phase2Access";

export const AdConversions: CollectionConfig = {
  slug: "ad-conversions",
  admin: {
    useAsTitle: "conversionType",
    defaultColumns: ["conversionType", "adClick", "createdAt"],
    group: "Analytics & Tracking",
  },
  access: trackingCollectionAccess,
  fields: [
    {
      name: "adClick",
      type: "relationship",
      relationTo: "ad-clicks",
      required: true,
    },
    { name: "conversionType", type: "text", required: true },
    { name: "conversionValue", type: "number" },
    {
      name: "formSubmission",
      type: "relationship",
      relationTo: "form-submissions",
    },
  ],
  hooks: {
    beforeOperation: [sanitizeHook],
  },
};
```

### src/collections/AiCitationTests.ts
```
import type { CollectionConfig } from "payload";
import { sensitiveCollectionAuditHook } from "@/lib/audit/logAudit";
import { sanitizeHook } from "@/lib/security/sanitize";
import { adminOnlyAccess } from "./access/phase2Access";

export const AiCitationTests: CollectionConfig = {
  slug: "ai-citation-tests",
  admin: {
    useAsTitle: "query",
    defaultColumns: ["query", "post", "cited", "testedAt"],
    group: "SEO",
  },
  access: adminOnlyAccess,
  fields: [
    {
      name: "post",
      type: "relationship",
      relationTo: "posts",
      required: true,
    },
    { name: "query", type: "text", required: true },
    { name: "aiModel", type: "text", required: true },
    { name: "cited", type: "checkbox", required: true },
    { name: "position", type: "number" },
    { name: "context", type: "textarea" },
    { name: "response", type: "textarea", required: true },
    { name: "testedAt", type: "date" },
  ],
  hooks: {
    beforeOperation: [sanitizeHook],
    afterOperation: [sensitiveCollectionAuditHook("ai-citation-tests")],
  },
};
```

### src/collections/Analytics.ts
```
import type { CollectionConfig } from "payload";
import { sanitizeHook } from "@/lib/security/sanitize";
import { trackingCollectionAccess } from "./access/phase2Access";

export const Analytics: CollectionConfig = {
  slug: "analytics",
  admin: {
    useAsTitle: "pageUrl",
    defaultColumns: ["pageUrl", "ipAddress", "createdAt"],
    group: "Analytics & Tracking",
  },
  access: trackingCollectionAccess,
  fields: [
    { name: "pageUrl", type: "text", required: true },
    { name: "referrer", type: "text" },
    { name: "userAgent", type: "textarea" },
    { name: "ipAddress", type: "text" },
  ],
  hooks: {
    beforeOperation: [sanitizeHook],
  },
};
```

### src/collections/AuditLogs.ts
```
import type { CollectionConfig } from "payload";
import { sanitizeHook } from "@/lib/security/sanitize";

export const AuditLogs: CollectionConfig = {
  slug: "audit-logs",
  admin: {
    useAsTitle: "action",
    defaultColumns: ["action", "entity", "entityId", "createdAt"],
    description: "Immutable trail of sensitive changes (no secrets in diff summaries).",
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: () => false,
    update: () => false,
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: "action",
      type: "text",
      required: true,
    },
    {
      name: "entity",
      type: "text",
      required: true,
    },
    {
      name: "entityId",
      type: "text",
    },
    {
      name: "actor",
      type: "relationship",
      relationTo: "users",
    },
    {
      name: "ip",
      type: "text",
    },
    {
      name: "userAgent",
      type: "text",
    },
    {
      name: "diffSummary",
      type: "textarea",
    },
    {
      name: "timestamp",
      type: "date",
      required: true,
    },
  ],
  hooks: {
    beforeOperation: [sanitizeHook],
  },
};
```

### src/collections/Backups.ts
```
import type { CollectionConfig } from "payload";
import { sensitiveCollectionAuditHook } from "@/lib/audit/logAudit";
import { sanitizeHook } from "@/lib/security/sanitize";
import { adminOnlyAccess } from "./access/phase2Access";

export const Backups: CollectionConfig = {
  slug: "backups",
  admin: {
    useAsTitle: "fileName",
    defaultColumns: ["type", "status", "startedAt", "verified"],
    group: "System",
  },
  access: adminOnlyAccess,
  fields: [
    { name: "type", type: "text", required: true },
    { name: "status", type: "text", required: true },
    { name: "fileName", type: "text", required: true },
    { name: "fileSize", type: "number" },
    { name: "location", type: "text", required: true },
    { name: "recordCount", type: "number" },
    {
      name: "tables",
      type: "json",
      required: true,
      admin: { description: "JSON array of table names included" },
    },
    { name: "startedAt", type: "date" },
    { name: "completedAt", type: "date" },
    { name: "duration", type: "number" },
    {
      name: "verified",
      type: "checkbox",
      defaultValue: false,
    },
    { name: "verifiedAt", type: "date" },
    { name: "checksum", type: "text" },
  ],
  hooks: {
    beforeOperation: [sanitizeHook],
    afterOperation: [sensitiveCollectionAuditHook("backups")],
  },
};
```

### src/collections/BehavioralTriggers.ts
```
import type { CollectionConfig } from "payload";
import { sanitizeHook } from "@/lib/security/sanitize";
import { trackingCollectionAccess } from "./access/phase2Access";

export const BehavioralTriggers: CollectionConfig = {
  slug: "behavioral-triggers",
  admin: {
    useAsTitle: "triggerType",
    defaultColumns: ["triggerType", "actionType", "converted", "createdAt"],
    group: "Lead Engine",
  },
  access: trackingCollectionAccess,
  fields: [
    { name: "sessionId", type: "text", required: true },
    { name: "triggerType", type: "text", required: true },
    { name: "triggerValue", type: "number", required: true },
    { name: "actionType", type: "text", required: true },
    { name: "actionContent", type: "text" },
    {
      name: "converted",
      type: "checkbox",
      defaultValue: false,
    },
    { name: "page", type: "text", required: true },
    { name: "device", type: "text" },
  ],
  hooks: {
    beforeOperation: [sanitizeHook],
  },
};
```

### src/collections/BlockedIPs.ts
```
import type { CollectionConfig } from "payload";
import { sensitiveCollectionAuditHook } from "@/lib/audit/logAudit";
import {
  persistIpBlockInRedis,
  removeIpBlockFromRedis,
} from "@/lib/security/ipBlock";
import { sanitizeHook } from "@/lib/security/sanitize";

export const BlockedIPs: CollectionConfig = {
  slug: "blocked-ips",
  admin: {
    useAsTitle: "ip",
    defaultColumns: ["ip", "blockedUntil", "updatedAt"],
    description:
      "Blocked addresses are enforced on /api/* when REDIS_URL is set (synced from this collection) or via BLOCKED_IPS env.",
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: "ip",
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: "reason",
      type: "textarea",
    },
    {
      name: "blockedUntil",
      type: "date",
      admin: {
        description: "Leave empty for a permanent block. After this time, the Redis key expires (if using Redis).",
      },
    },
    {
      name: "createdBy",
      type: "relationship",
      relationTo: "users",
      admin: {
        position: "sidebar",
      },
    },
  ],
  hooks: {
    beforeOperation: [sanitizeHook],
    afterOperation: [sensitiveCollectionAuditHook("blocked-ips")],
    afterChange: [
      async ({ doc, operation }) => {
        if (operation === "create" || operation === "update") {
          await persistIpBlockInRedis(doc.ip, doc.blockedUntil as string | null | undefined);
        }
      },
    ],
    afterDelete: [
      async ({ doc }) => {
        const ip = doc?.ip;
        if (typeof ip === "string") await removeIpBlockFromRedis(ip);
      },
    ],
  },
};
```

### src/collections/Calculators.ts
```
import type { CollectionConfig } from "payload";
import { sanitizeHook } from "@/lib/security/sanitize";
import { trackingCollectionAccess } from "./access/phase2Access";

export const Calculators: CollectionConfig = {
  slug: "calculators",
  admin: {
    useAsTitle: "sessionId",
    defaultColumns: ["type", "leadCaptured", "createdAt"],
    group: "Lead Engine",
  },
  access: trackingCollectionAccess,
  fields: [
    { name: "sessionId", type: "text", required: true },
    { name: "type", type: "text", required: true },
    {
      name: "inputs",
      type: "json",
      required: true,
      admin: { description: "User inputs (JSON)" },
    },
    {
      name: "results",
      type: "json",
      required: true,
      admin: { description: "Calculated results (JSON)" },
    },
    {
      name: "leadCaptured",
      type: "checkbox",
      defaultValue: false,
    },
    {
      name: "formSubmission",
      type: "relationship",
      relationTo: "form-submissions",
    },
    { name: "device", type: "text" },
    { name: "referrer", type: "text" },
  ],
  hooks: {
    beforeOperation: [sanitizeHook],
  },
};
```

### src/collections/Categories.ts
```
import type { CollectionConfig } from "payload";
import { sensitiveCollectionAuditHook } from "@/lib/audit/logAudit";
import { sanitizeHook } from "@/lib/security/sanitize";
import { publicReadAdminWriteAccess } from "./access/phase2Access";

export const Categories: CollectionConfig = {
  slug: "categories",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "slug", "parent", "updatedAt"],
    group: "Website Content",
  },
  access: publicReadAdminWriteAccess,
  fields: [
    { name: "name", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true },
    { name: "description", type: "textarea" },
    { name: "icon", type: "text", admin: { description: "URL to icon/image" } },
    { name: "metaTitle", type: "text" },
    { name: "metaDescription", type: "textarea" },
    {
      name: "parent",
      type: "relationship",
      relationTo: "categories",
      admin: { position: "sidebar" },
    },
  ],
  hooks: {
    beforeOperation: [sanitizeHook],
    afterOperation: [sensitiveCollectionAuditHook("categories")],
  },
};
```

### src/collections/ConversionEvents.ts
```
import type { CollectionConfig } from "payload";
import { sanitizeHook } from "@/lib/security/sanitize";
import { trackingCollectionAccess } from "./access/phase2Access";

export const ConversionEvents: CollectionConfig = {
  slug: "conversion-events",
  admin: {
    useAsTitle: "eventType",
    defaultColumns: ["eventType", "sessionId", "page", "occurredAt"],
    group: "Lead Engine",
  },
  access: trackingCollectionAccess,
  fields: [
    { name: "sessionId", type: "text", required: true },
    { name: "eventType", type: "text", required: true },
    { name: "eventData", type: "json" },
    { name: "page", type: "text", required: true },
    { name: "formType", type: "text" },
    { name: "abTestVariant", type: "text" },
    { name: "occurredAt", type: "date" },
  ],
  hooks: {
    beforeOperation: [sanitizeHook],
  },
};
```

### src/collections/DataExportRequests.ts
```
import type { CollectionConfig } from "payload";
import { sanitizeHook } from "@/lib/security/sanitize";

export const DataExportRequests: CollectionConfig = {
  slug: "data-export-requests",
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "kind", "status", "updatedAt"],
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    create: () => false,
    update: () => false,
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: "email",
      type: "email",
      required: true,
    },
    {
      name: "kind",
      type: "select",
      required: true,
      options: [
        { label: "Export", value: "export" },
        { label: "Delete", value: "delete" },
      ],
    },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "pending_verification",
      options: [
        { label: "Pending verification", value: "pending_verification" },
        { label: "Verified", value: "verified" },
        { label: "Processing", value: "processing" },
        { label: "Completed", value: "completed" },
        { label: "Failed", value: "failed" },
      ],
    },
    {
      name: "lastError",
      type: "textarea",
    },
    {
      name: "verifiedAt",
      type: "date",
      admin: { readOnly: true },
    },
    {
      name: "completedAt",
      type: "date",
      admin: { readOnly: true },
    },
  ],
  hooks: {
    beforeOperation: [sanitizeHook],
  },
};
```

### src/collections/ExitIntents.ts
```
import type { CollectionConfig } from "payload";
import { sanitizeHook } from "@/lib/security/sanitize";
import { trackingCollectionAccess } from "./access/phase2Access";

export const ExitIntents: CollectionConfig = {
  slug: "exit-intents",
  admin: {
    useAsTitle: "page",
    defaultColumns: ["page", "action", "popupType", "createdAt"],
    group: "Lead Engine",
  },
  access: trackingCollectionAccess,
  fields: [
    { name: "sessionId", type: "text", required: true },
    { name: "page", type: "text", required: true },
    { name: "timeOnPage", type: "number", required: true },
    { name: "scrollDepth", type: "number", required: true },
    { name: "popupType", type: "text", required: true },
    { name: "popupContent", type: "text" },
    { name: "action", type: "text", required: true },
    { name: "emailCaptured", type: "text" },
    { name: "device", type: "text" },
    { name: "referrer", type: "text" },
  ],
  hooks: {
    beforeOperation: [sanitizeHook],
  },
};
```

### src/collections/FormAbandonments.ts
```
import type { CollectionConfig } from "payload";
import { sanitizeHook } from "@/lib/security/sanitize";
import { trackingCollectionAccess } from "./access/phase2Access";

export const FormAbandonments: CollectionConfig = {
  slug: "form-abandonments",
  admin: {
    useAsTitle: "sessionId",
    defaultColumns: ["formType", "email", "recovered", "createdAt"],
    group: "Lead Engine",
  },
  access: trackingCollectionAccess,
  fields: [
    { name: "sessionId", type: "text", required: true, unique: true },
    { name: "formType", type: "text", required: true },
    { name: "currentStep", type: "number" },
    { name: "completedSteps", type: "number" },
    { name: "email", type: "email" },
    { name: "name", type: "text" },
    { name: "phone", type: "text" },
    { name: "lastField", type: "text" },
    { name: "timeSpent", type: "number" },
    { name: "device", type: "text" },
    { name: "browser", type: "text" },
    { name: "country", type: "text" },
    { name: "city", type: "text" },
    { name: "campaignName", type: "text" },
    { name: "adSetName", type: "text" },
    { name: "utmSource", type: "text" },
    { name: "utmMedium", type: "text" },
    {
      name: "recoveryEmailSent",
      type: "checkbox",
      defaultValue: false,
    },
    {
      name: "recovered",
      type: "checkbox",
      defaultValue: false,
    },
    { name: "recoveredAt", type: "date" },
  ],
  hooks: {
    beforeOperation: [sanitizeHook],
  },
};
```

### src/collections/FormSubmissions.ts
```
import { CollectionConfig } from 'payload'
import { sensitiveCollectionAuditHook } from '@/lib/audit/logAudit'
import { sanitizeHook } from '@/lib/security/sanitize'

export const FormSubmissions: CollectionConfig = {
  slug: 'form-submissions',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'type', 'createdAt'],
  },
  access: {
    read: ({ req: { user } }) => Boolean(user),
    /** Custom routes (e.g. /api/forms/submit) use overrideAccess to create without a user session */
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Contact Form', value: 'contact' },
        { label: 'Consultation Booking', value: 'consultation' },
        { label: 'Callback Request', value: 'callback' },
        { label: 'Newsletter', value: 'newsletter' },
      ],
      required: true,
    },
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'email',
      type: 'email',
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'subject',
      type: 'text',
    },
    {
      name: 'message',
      type: 'textarea',
    },
    {
      name: 'sourceUrl',
      type: 'text',
      label: 'Submission Source URL',
    },
    {
      name: 'utmSource',
      type: 'text',
      label: 'UTM Source',
    },
    {
      name: 'utmMedium',
      type: 'text',
      label: 'UTM Medium',
    },
    {
      name: 'utmCampaign',
      type: 'text',
      label: 'UTM Campaign',
    },
    {
      name: 'leadStatus',
      type: 'select',
      label: 'Lead status',
      defaultValue: 'NEW',
      options: [
        { label: 'New', value: 'NEW' },
        { label: 'Contacted', value: 'CONTACTED' },
        { label: 'Qualified', value: 'QUALIFIED' },
        { label: 'Converted', value: 'CONVERTED' },
        { label: 'Lost', value: 'LOST' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    beforeOperation: [sanitizeHook],
    afterOperation: [sensitiveCollectionAuditHook('form-submissions')],
    afterChange: [
      async ({ doc, operation }) => {
        if (operation === 'create') {
          const { scheduleScoreLeadFromSubmission, scheduleDispatchFormSubmitted } =
            await import('@/lib/services/leadScoring.service')
          scheduleScoreLeadFromSubmission(doc.id)
          scheduleDispatchFormSubmitted(doc as Record<string, unknown>)
        }
      },
    ],
  },
}
```

### src/collections/InternalLinks.ts
```
import type { CollectionConfig } from "payload";
import { sensitiveCollectionAuditHook } from "@/lib/audit/logAudit";
import { sanitizeHook } from "@/lib/security/sanitize";
import { adminOnlyAccess } from "./access/phase2Access";

export const InternalLinks: CollectionConfig = {
  slug: "internal-links",
  admin: {
    useAsTitle: "anchorText",
    defaultColumns: ["fromPost", "toPost", "relevanceScore", "createdAt"],
    group: "SEO",
  },
  access: adminOnlyAccess,
  fields: [
    {
      name: "fromPost",
      type: "relationship",
      relationTo: "posts",
      required: true,
    },
    {
      name: "toPost",
      type: "relationship",
      relationTo: "posts",
      required: true,
    },
    { name: "anchorText", type: "text", required: true },
    { name: "position", type: "number" },
    { name: "relevanceScore", type: "number" },
  ],
  hooks: {
    beforeOperation: [sanitizeHook],
    afterOperation: [sensitiveCollectionAuditHook("internal-links")],
  },
};
```

### src/collections/Keywords.ts
```
import type { CollectionConfig } from "payload";
import { sensitiveCollectionAuditHook } from "@/lib/audit/logAudit";
import { sanitizeHook } from "@/lib/security/sanitize";
import { adminOnlyAccess } from "./access/phase2Access";

export const Keywords: CollectionConfig = {
  slug: "keywords",
  admin: {
    useAsTitle: "keyword",
    defaultColumns: ["keyword", "position", "searchVolume", "updatedAt"],
    group: "SEO",
  },
  access: adminOnlyAccess,
  fields: [
    { name: "keyword", type: "text", required: true, unique: true },
    { name: "searchVolume", type: "number" },
    { name: "difficulty", type: "number" },
    { name: "position", type: "number" },
    { name: "url", type: "text" },
    { name: "trackedSince", type: "date" },
    { name: "lastChecked", type: "date" },
    { name: "positionHistory", type: "json" },
  ],
  hooks: {
    beforeOperation: [sanitizeHook],
    afterOperation: [sensitiveCollectionAuditHook("keywords")],
  },
};
```

### src/collections/LeadScores.ts
```
import type { CollectionConfig } from "payload";
import { sanitizeHook } from "@/lib/security/sanitize";
import { trackingCollectionAccess } from "./access/phase2Access";

export const LeadScores: CollectionConfig = {
  slug: "lead-scores",
  admin: {
    useAsTitle: "category",
    defaultColumns: ["category", "totalScore", "priority", "updatedAt"],
    group: "Lead Engine",
  },
  access: trackingCollectionAccess,
  fields: [
    {
      name: "formSubmission",
      type: "relationship",
      relationTo: "form-submissions",
      required: true,
      unique: true,
    },
    { name: "behaviorScore", type: "number", required: true },
    { name: "intentScore", type: "number", required: true },
    { name: "qualityScore", type: "number", required: true },
    { name: "sourceScore", type: "number", required: true },
    { name: "totalScore", type: "number", required: true },
    { name: "category", type: "text", required: true },
    {
      name: "factors",
      type: "json",
      admin: { description: "Detailed breakdown (JSON)" },
    },
    { name: "priority", type: "number", required: true },
    { name: "calculatedAt", type: "date" },
  ],
  hooks: {
    beforeOperation: [sanitizeHook],
  },
};
```

### src/collections/Media.ts
```
import { CollectionConfig } from 'payload'
import { sensitiveCollectionAuditHook } from '@/lib/audit/logAudit'
import { sanitizeHook } from '@/lib/security/sanitize'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  hooks: {
    beforeOperation: [sanitizeHook],
    afterOperation: [sensitiveCollectionAuditHook('media')],
  },
  upload: {
    staticDir: 'public/media',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        position: 'center',
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        position: 'center',
      },
      {
        name: 'tablet',
        width: 1024,
        height: undefined,
        position: 'center',
      },
    ],
    adminThumbnail: 'thumbnail',
    mimeTypes: ['image/*'],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      label: 'Alt Text (SEO)',
      admin: {
        description: 'Crucial for SEO and accessibility. Describe the image content clearly.',
      },
    },
    {
      name: 'title',
      type: 'text',
      label: 'Image Title',
      admin: {
        description: 'Displayed on hover. Keep it short and descriptive.',
      },
    },
    {
      name: 'caption',
      type: 'textarea',
      label: 'Caption',
      admin: {
        description: 'Visible text displayed below the image (optional).',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Long Description',
      admin: {
        description: 'For attachment pages or detailed context (not usually visible on post).',
      },
    },
  ],
}
```

### src/collections/Pages.ts
```
import { CollectionConfig } from 'payload'
import { sensitiveCollectionAuditHook } from '@/lib/audit/logAudit'
import { sanitizeHook } from '@/lib/security/sanitize'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status', 'updatedAt'],
    group: 'Website Content',
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return { status: { equals: 'PUBLISHED' } }
      return true
    },
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  hooks: {
    beforeOperation: [sanitizeHook],
    afterOperation: [sensitiveCollectionAuditHook('pages')],
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'DRAFT',
      options: [
        { label: 'Draft', value: 'DRAFT' },
        { label: 'Published', value: 'PUBLISHED' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'featuredImage', type: 'text', admin: { description: 'URL from media library' } },
    {
      name: 'content',
      type: 'textarea',
      admin: { description: 'HTML when not using the visual block builder' },
    },
    {
      name: 'blocksData',
      type: 'textarea',
      admin: { description: 'JSON string of block editor output' },
    },
    { name: 'focusKeyword', type: 'text' },
    { name: 'seoTitle', type: 'text' },
    { name: 'metaDescription', type: 'textarea' },
    { name: 'canonicalUrl', type: 'text' },
    { name: 'ogTitle', type: 'text' },
    { name: 'ogDescription', type: 'textarea' },
    { name: 'ogImage', type: 'text' },
    { name: 'twitterTitle', type: 'text' },
    { name: 'twitterDescription', type: 'textarea' },
    { name: 'twitterImage', type: 'text' },
    { name: 'isIndexable', type: 'checkbox', defaultValue: true },
    { name: 'isFollowable', type: 'checkbox', defaultValue: true },
    { name: 'advancedRobots', type: 'text' },
    { name: 'enableSchema', type: 'checkbox', defaultValue: true },
    { name: 'customSchema', type: 'textarea' },
    {
      name: 'headerStyle',
      type: 'select',
      defaultValue: 'default',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Hidden', value: 'hidden' },
        { label: 'Transparent', value: 'transparent' },
      ],
    },
    {
      name: 'footerStyle',
      type: 'select',
      defaultValue: 'default',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Hidden', value: 'hidden' },
      ],
    },
    { name: 'showSidebar', type: 'checkbox', defaultValue: false },
    { name: 'customHeadScripts', type: 'textarea' },
    { name: 'customFooterScripts', type: 'textarea' },
  ],
}
```

### src/collections/Posts.ts
```
import { CollectionConfig } from 'payload'
import { sensitiveCollectionAuditHook } from '@/lib/audit/logAudit'
import { sanitizeHook } from '@/lib/security/sanitize'

export const Posts: CollectionConfig = {
  slug: 'posts',
  access: {
    read: ({ req: { user } }) => {
      if (!user) return { _status: { equals: 'published' } }
      return true
    },
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (value || !data?.title) return value
            return data.title
              .toLowerCase()
              .replace(/ /g, '-')
              .replace(/[^\w-]+/g, '')
          },
        ],
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedDate',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Hair Transplant', value: 'hair-transplant' },
        { label: 'Hair Systems', value: 'hair-systems' },
        { label: 'General Care', value: 'general-care' },
        { label: 'Success Stories', value: 'success-stories' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'wordpressHtml',
      type: 'textarea',
      label: 'WordPress HTML (import)',
      admin: {
        description:
          'Raw HTML from WordPress. Used for display when present; Lexical `content` remains for admin/editor metrics.',
        position: 'sidebar',
      },
    },
    // SEO Fields
    {
      name: 'meta',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Meta Title',
          minLength: 40,
          maxLength: 60,
          admin: {
            description: 'Optimal length: 50-60 characters.',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Meta Description',
          minLength: 140,
          maxLength: 160,
          admin: {
            description: 'Optimal length: 150-160 characters.',
          },
        },
        {
          name: 'keywords',
          type: 'text',
          label: 'Keywords',
          admin: {
            description: 'Comma-separated list of focus keywords.',
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Open Graph Image',
        },
        {
          name: 'preview',
          type: 'ui',
          admin: {
            components: {
              Field: '/components/payload/SocialPreview#SocialPreview',
            },
          },
        },
      ],
    },
    // Advanced SEO & Schema
    {
      name: 'structuredData',
      type: 'group',
      label: 'Schema & Structured Data',
      admin: {
        position: 'sidebar',
      },
      fields: [
        {
          name: 'schemaType',
          type: 'select',
          label: 'Schema Type',
          defaultValue: 'Article',
          options: [
            { label: 'Article', value: 'Article' },
            { label: 'Blog Posting', value: 'BlogPosting' },
            { label: 'How-To', value: 'HowTo' },
            { label: 'FAQ Page', value: 'FAQPage' },
            { label: 'Medical Web Page', value: 'MedicalWebPage' },
            { label: 'Product', value: 'Product' },
            { label: 'Custom (Advanced)', value: 'Custom' },
          ],
        },
        {
          name: 'customSchema',
          type: 'json',
          label: 'Custom JSON-LD',
          admin: {
            description: 'Paste valid JSON-LD here. Overrides auto-generated schema.',
            condition: (data) => data?.structuredData?.schemaType === 'Custom',
          },
        },
      ],
    },
    // Advanced SEO & Metrics
    {
      name: 'metrics',
      type: 'group',
      label: 'Content Metrics',
      admin: {
        position: 'sidebar',
        readOnly: true,
      },
      fields: [
        {
          name: 'readingTime',
          type: 'number',
          label: 'Reading Time (min)',
        },
        {
          name: 'wordCount',
          type: 'number',
          label: 'Word Count',
        },
      ],
    },
    {
      name: 'aiOptimization',
      type: 'group',
      label: 'AI SEO',
      admin: {
        position: 'sidebar',
      },
      fields: [
        {
          name: 'score',
          type: 'number',
          label: 'AI optimization score',
        },
        { name: 'faqs', type: 'json' },
        { name: 'directAnswers', type: 'json' },
        { name: 'keyTakeaways', type: 'json' },
        { name: 'conversationalAnalysis', type: 'json' },
        { name: 'faqSchema', type: 'json', label: 'FAQ JSON-LD' },
        { name: 'lastOptimizedAt', type: 'date' },
      ],
    },
    {
      name: 'seoAnalysis',
      type: 'group',
      label: 'SEO Analysis',
      admin: {
        position: 'sidebar',
      },
      fields: [
        {
          name: 'focusKeyword',
          type: 'text',
          label: 'Focus Keyword',
        },
        {
          name: 'seoScore',
          type: 'number',
          label: 'SEO Score (0-100)',
          admin: {
            readOnly: true,
          },
        },
        {
          name: 'seoFeedback',
          type: 'textarea',
          label: 'Analysis Feedback',
          admin: {
            readOnly: true,
          },
        },
      ],
    },
  ],
  hooks: {
    beforeOperation: [sanitizeHook],
    afterOperation: [sensitiveCollectionAuditHook('posts')],
    beforeChange: [
      async ({ data, req }) => {
        // Calculate reading time and word count from content
        if (data.content) {
          try {
            // Very basic text extraction from Lexical JSON
            // In production, we'd use a more robust parser
            const contentStr = JSON.stringify(data.content);
            // Count alphanumeric words
            const words = contentStr.match(/\w+/g) || [];
            const wordCount = words.length;
            const readingTime = Math.ceil(wordCount / 200); // 200 wpm

            data.metrics = {
              wordCount,
              readingTime,
            };

            // Simple SEO check
            if (data.seoAnalysis?.focusKeyword && data.metrics) {
              const keyword = data.seoAnalysis.focusKeyword.toLowerCase();
              const lowerContent = contentStr.toLowerCase();
              const keywordCount = (lowerContent.match(new RegExp(keyword, 'g')) || []).length;
              
              let score = 50;
              let feedback = '';

              if (keywordCount > 0) {
                score += 20;
                feedback += `Keyword found ${keywordCount} times. `;
              } else {
                feedback += `Keyword not found in content. `;
              }

              if (data.title?.toLowerCase().includes(keyword)) {
                score += 30;
                feedback += `Keyword found in title. `;
              }

              data.seoAnalysis.seoScore = Math.min(score, 100);
              data.seoAnalysis.seoFeedback = feedback;
            }
          } catch (e) {
            console.error('Error calculating metrics:', e);
          }
        }
        // Handle publishedDate
        if (data._status === 'published' && !data.publishedDate) {
          data.publishedDate = new Date().toISOString();
        }

        return data;
      },
    ],
    afterChange: [
      async ({ doc, req, previousDoc, operation }) => {
        if (operation === 'update' || operation === 'create') {
          if (doc._status === 'published' || previousDoc?._status === 'published') {
            const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
            console.log(`[Cache Revalidation] Triggering revalidation for post: ${doc.slug}`);
            
            // In a real production setup, we would call:
            // try {
            //   await fetch(`${baseUrl}/api/revalidate?path=/blog/${doc.slug}&secret=${process.env.REVALIDATION_SECRET}`);
            //   await fetch(`${baseUrl}/api/revalidate?path=/blog&secret=${process.env.REVALIDATION_SECRET}`);
            // } catch (err) {
            //   console.error('Revalidation failed', err);
            // }
          }
        }
      },
    ],
  },
  versions: {
    drafts: true,
  },
}
```

### src/collections/Products.ts
```
import { CollectionConfig } from 'payload'
import { sensitiveCollectionAuditHook } from '@/lib/audit/logAudit'
import { sanitizeHook } from '@/lib/security/sanitize'

export const Products: CollectionConfig = {
  slug: 'products',
  hooks: {
    beforeOperation: [sanitizeHook],
    afterOperation: [sensitiveCollectionAuditHook('products')],
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'price', 'status', 'updatedAt'],
    group: 'Website Content',
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return { status: { equals: 'active' } }
      return true
    },
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (value || !data?.name) return value
            return data.name
              .toLowerCase()
              .replace(/ /g, '-')
              .replace(/[^\w-]+/g, '')
          },
        ],
      },
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'price',
      type: 'number',
      required: true,
    },
    {
      name: 'images',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Out of Stock', value: 'out-of-stock' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Featured Product',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Hair Care', value: 'hair-care' },
        { label: 'Accessories', value: 'accessories' },
        { label: 'Treatments', value: 'treatments' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'tags',
      hasMany: true,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
```

### src/collections/SecurityLogs.ts
```
import type { CollectionConfig } from "payload";
import { sensitiveCollectionAuditHook } from "@/lib/audit/logAudit";
import { sanitizeHook } from "@/lib/security/sanitize";
import { adminOnlyAccess } from "./access/phase2Access";

export const SecurityLogs: CollectionConfig = {
  slug: "security-logs",
  admin: {
    useAsTitle: "eventType",
    defaultColumns: ["eventType", "eventLevel", "ipAddress", "createdAt"],
    group: "Security",
  },
  access: adminOnlyAccess,
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      admin: { position: "sidebar" },
    },
    { name: "eventType", type: "text", required: true },
    { name: "eventLevel", type: "text", required: true },
    { name: "description", type: "textarea", required: true },
    { name: "ipAddress", type: "text", required: true },
    { name: "userAgent", type: "textarea" },
    { name: "endpoint", type: "text" },
    { name: "method", type: "text" },
    { name: "requestData", type: "json" },
    { name: "statusCode", type: "number" },
    { name: "errorMessage", type: "textarea" },
  ],
  hooks: {
    beforeOperation: [sanitizeHook],
    afterOperation: [sensitiveCollectionAuditHook("security-logs")],
  },
};
```

### src/collections/SeoAnalyses.ts
```
import type { CollectionConfig } from "payload";
import { sensitiveCollectionAuditHook } from "@/lib/audit/logAudit";
import { sanitizeHook } from "@/lib/security/sanitize";
import { adminOnlyAccess } from "./access/phase2Access";

export const SeoAnalyses: CollectionConfig = {
  slug: "seo-analyses",
  admin: {
    useAsTitle: "url",
    defaultColumns: ["url", "post", "score", "analyzedAt"],
    group: "SEO",
  },
  access: adminOnlyAccess,
  fields: [
    {
      name: "post",
      type: "relationship",
      relationTo: "posts",
      required: true,
    },
    { name: "url", type: "text", required: true },
    { name: "screpyReportId", type: "text" },
    { name: "screpyScore", type: "number" },
    { name: "screpyData", type: "json" },
    { name: "score", type: "number", required: true },
    { name: "issues", type: "json", required: true },
    { name: "recommendations", type: "json", required: true },
    { name: "pageSpeed", type: "number" },
    { name: "mobileScore", type: "number" },
    { name: "sslEnabled", type: "checkbox" },
    { name: "robotsTxt", type: "checkbox" },
    { name: "sitemap", type: "checkbox" },
    { name: "titleTag", type: "json" },
    { name: "metaDescription", type: "json" },
    { name: "headings", type: "json" },
    { name: "images", type: "json" },
    { name: "internalLinks", type: "number" },
    { name: "externalLinks", type: "number" },
    { name: "wordCount", type: "number" },
    { name: "readability", type: "number" },
    { name: "keywordUsage", type: "json" },
    { name: "schemaTypes", type: "json" },
    { name: "schemaValid", type: "checkbox" },
    { name: "analyzedAt", type: "date" },
  ],
  hooks: {
    beforeOperation: [sanitizeHook],
    afterOperation: [sensitiveCollectionAuditHook("seo-analyses")],
  },
};
```

### src/collections/Settings.ts
```
import type { CollectionConfig } from "payload";
import { sensitiveCollectionAuditHook } from "@/lib/audit/logAudit";
import { sanitizeHook } from "@/lib/security/sanitize";
import { adminOnlyAccess } from "./access/phase2Access";

export const Settings: CollectionConfig = {
  slug: "settings",
  admin: {
    useAsTitle: "key",
    defaultColumns: ["key", "type", "group", "updatedAt"],
    group: "System",
  },
  access: adminOnlyAccess,
  fields: [
    { name: "key", type: "text", required: true, unique: true },
    { name: "value", type: "textarea", required: true },
    { name: "type", type: "text", defaultValue: "STRING" },
    { name: "group", type: "text", defaultValue: "general" },
  ],
  hooks: {
    beforeOperation: [sanitizeHook],
    afterOperation: [sensitiveCollectionAuditHook("settings")],
  },
};
```

### src/collections/SystemEvents.ts
```
import { CollectionConfig } from 'payload'
import { sanitizeHook } from '@/lib/security/sanitize'

export const SystemEvents: CollectionConfig = {
  slug: 'system-events',
  admin: {
    useAsTitle: 'event',
    defaultColumns: ['event', 'user', 'createdAt'],
  },
  access: {
    create: () => true, // Allow system/API to log events
    read: ({ req: { user } }) => Boolean(user),
    update: () => false,
    delete: () => false, // Immutable logs
  },
  fields: [
    {
      name: 'event',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'metadata',
      type: 'json',
    },
    {
      name: 'ip',
      type: 'text',
    },
  ],
  hooks: {
    beforeOperation: [sanitizeHook],
  },
}
```

### src/collections/Tags.ts
```
import { CollectionConfig } from 'payload'
import { sensitiveCollectionAuditHook } from '@/lib/audit/logAudit'
import { sanitizeHook } from '@/lib/security/sanitize'

export const Tags: CollectionConfig = {
  slug: 'tags',
  hooks: {
    beforeOperation: [sanitizeHook],
    afterOperation: [sensitiveCollectionAuditHook('tags')],
  },
  admin: {
    useAsTitle: 'name',
    group: 'Website Content',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (value || !data?.name) return value
            return data.name
              .toLowerCase()
              .replace(/ /g, '-')
              .replace(/[^\w-]+/g, '')
          },
        ],
      },
    },
  ],
}
```

### src/collections/Users.ts
```
import { CollectionConfig } from 'payload'
import { sensitiveCollectionAuditHook } from '@/lib/audit/logAudit'
import { sanitizeHook } from '@/lib/security/sanitize'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  hooks: {
    beforeOperation: [sanitizeHook],
    afterOperation: [sensitiveCollectionAuditHook('users')],
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'ADMIN',
      options: [
        { label: 'Super Admin', value: 'SUPER_ADMIN' },
        { label: 'Admin', value: 'ADMIN' },
        { label: 'Editor', value: 'EDITOR' },
        { label: 'User', value: 'USER' },
      ],
    },
  ],
}
```

### src/collections/WebhookLogs.ts
```
import type { CollectionConfig } from "payload";
import { sensitiveCollectionAuditHook } from "@/lib/audit/logAudit";
import { sanitizeHook } from "@/lib/security/sanitize";
import { adminOnlyAccess } from "./access/phase2Access";

export const WebhookLogs: CollectionConfig = {
  slug: "webhook-logs",
  admin: {
    useAsTitle: "event",
    defaultColumns: ["event", "webhook", "status", "statusCode", "createdAt"],
    group: "Integrations",
  },
  access: adminOnlyAccess,
  fields: [
    {
      name: "webhook",
      type: "relationship",
      relationTo: "webhooks",
      required: true,
    },
    { name: "event", type: "text", required: true },
    { name: "payload", type: "json", required: true },
    { name: "response", type: "json" },
    { name: "statusCode", type: "number" },
    { name: "status", type: "text", required: true },
    { name: "attempts", type: "number", defaultValue: 1 },
    { name: "errorMessage", type: "textarea" },
    { name: "duration", type: "number" },
  ],
  hooks: {
    beforeOperation: [sanitizeHook],
    afterOperation: [sensitiveCollectionAuditHook("webhook-logs")],
  },
};
```

### src/collections/Webhooks.ts
```
import type { CollectionConfig } from "payload";
import { sensitiveCollectionAuditHook } from "@/lib/audit/logAudit";
import { sanitizeHook } from "@/lib/security/sanitize";
import { adminOnlyAccess } from "./access/phase2Access";

export const Webhooks: CollectionConfig = {
  slug: "webhooks",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "url", "isActive", "updatedAt"],
    group: "Integrations",
  },
  access: adminOnlyAccess,
  fields: [
    { name: "name", type: "text", required: true },
    { name: "url", type: "text", required: true },
    { name: "method", type: "text", defaultValue: "POST" },
    {
      name: "events",
      type: "json",
      required: true,
      admin: { description: "Events to listen (JSON, e.g. list of event names)" },
    },
    { name: "headers", type: "json", admin: { description: "Custom headers object" } },
    { name: "payload", type: "json", admin: { description: "Custom payload template" } },
    { name: "isActive", type: "checkbox", defaultValue: true },
    { name: "retryAttempts", type: "number", defaultValue: 3 },
    { name: "retryDelay", type: "number", defaultValue: 5000 },
    { name: "timeout", type: "number", defaultValue: 30000 },
    { name: "lastSuccess", type: "date" },
    { name: "lastFailure", type: "date" },
    { name: "successCount", type: "number", defaultValue: 0 },
    { name: "failureCount", type: "number", defaultValue: 0 },
    {
      name: "createdBy",
      type: "relationship",
      relationTo: "users",
      admin: { position: "sidebar" },
    },
  ],
  hooks: {
    beforeOperation: [sanitizeHook],
    afterOperation: [sensitiveCollectionAuditHook("webhooks")],
  },
};
```

### src/collections/access/phase2Access.ts
```
import type { CollectionConfig } from "payload";

type CollectionAccess = NonNullable<CollectionConfig["access"]>;

/** Public tracking create; admin read/update/delete */
export const trackingCollectionAccess: CollectionAccess = {
  create: () => true,
  read: ({ req: { user } }) => Boolean(user),
  update: ({ req: { user } }) => Boolean(user),
  delete: ({ req: { user } }) => Boolean(user),
};

/** Authenticated admin only */
export const adminOnlyAccess: CollectionAccess = {
  read: ({ req: { user } }) => Boolean(user),
  create: ({ req: { user } }) => Boolean(user),
  update: ({ req: { user } }) => Boolean(user),
  delete: ({ req: { user } }) => Boolean(user),
};

/** Public read; admin write */
export const publicReadAdminWriteAccess: CollectionAccess = {
  read: () => true,
  create: ({ req: { user } }) => Boolean(user),
  update: ({ req: { user } }) => Boolean(user),
  delete: ({ req: { user } }) => Boolean(user),
};
```

## find src/app/admin -name "*.tsx" -o -name "*.ts" | sort:
```
src/app/admin/analytics/campaigns/page.tsx
src/app/admin/analytics/page.tsx
src/app/admin/forms/page.tsx
src/app/admin/integrations/page.tsx
src/app/admin/layout.tsx
src/app/admin/leads/dashboard/page.tsx
src/app/admin/leads/page.tsx
src/app/admin/leads/scoring/page.tsx
src/app/admin/login/page.tsx
src/app/admin/media/page.tsx
src/app/admin/page.tsx
src/app/admin/pages/[id]/edit/page.tsx
src/app/admin/pages/new/page.tsx
src/app/admin/pages/page.tsx
src/app/admin/posts/[id]/edit/page.tsx
src/app/admin/posts/new/page.tsx
src/app/admin/posts/page.tsx
src/app/admin/products/[id]/edit/page.tsx
src/app/admin/products/new/page.tsx
src/app/admin/products/page.tsx
src/app/admin/security/page.tsx
src/app/admin/seo/citations/page.tsx
src/app/admin/seo/keywords/page.tsx
src/app/admin/seo/page.tsx
src/app/admin/settings/page.tsx
```
## find src/app/api -name "route.ts" | sort:
```
src/app/api/[[...slug]]/route.ts
src/app/api/admin/bootstrap-session/route.ts
src/app/api/ai-seo/citation-history/[id]/route.ts
src/app/api/ai-seo/dashboard/route.ts
src/app/api/ai-seo/faqs/[id]/route.ts
src/app/api/ai-seo/generate/meta-description/route.ts
src/app/api/ai-seo/generate/seo-title/route.ts
src/app/api/ai-seo/optimize-all/route.ts
src/app/api/ai-seo/optimize/[id]/route.ts
src/app/api/ai-seo/status/[id]/route.ts
src/app/api/ai-seo/suggestions/[id]/route.ts
src/app/api/ai-seo/test-citation/[id]/route.ts
src/app/api/analytics/overview/route.ts
src/app/api/analytics/pageview/route.ts
src/app/api/analytics/posts/route.ts
src/app/api/auth/[...nextauth]/route.ts
src/app/api/auth/refresh-token/route.ts
src/app/api/calculator/cost/route.ts
src/app/api/calculator/estimate-grafts/route.ts
src/app/api/calculator/save/route.ts
src/app/api/calculator/stats/route.ts
src/app/api/comments/route.ts
src/app/api/forms/newsletter/route.ts
src/app/api/forms/submit/route.ts
src/app/api/gdpr/delete/route.ts
src/app/api/gdpr/export/route.ts
src/app/api/gdpr/verify/route.ts
src/app/api/health/deep/route.ts
src/app/api/health/route.ts
src/app/api/lead-optimization/dashboard/route.ts
src/app/api/lead-optimization/exit-intent/content/route.ts
src/app/api/lead-optimization/track/conversion/route.ts
src/app/api/lead-optimization/track/trigger/route.ts
src/app/api/lead-optimization/triggers/rules/route.ts
src/app/api/lead-scoring/hot-leads/route.ts
src/app/api/lead-scoring/score-all/route.ts
src/app/api/lead-scoring/score/[id]/route.ts
src/app/api/lead-scoring/track/abandonment/route.ts
src/app/api/lead-scoring/track/event/route.ts
src/app/api/lead-scoring/track/exit-intent/route.ts
src/app/api/media/[id]/usage/route.ts
src/app/api/media/audit/unused/route.ts
src/app/api/media/bulk-delete/route.ts
src/app/api/performance/cache/clear/route.ts
src/app/api/performance/cache/stats/route.ts
src/app/api/performance/database/stats/route.ts
src/app/api/performance/metrics/route.ts
src/app/api/posts/[id]/autosave/route.ts
src/app/api/posts/[id]/publish/route.ts
src/app/api/posts/slug/[slug]/route.ts
src/app/api/search-optimization/analysis/[id]/route.ts
src/app/api/search-optimization/analyze-all/route.ts
src/app/api/search-optimization/analyze-draft/route.ts
src/app/api/search-optimization/analyze/[id]/route.ts
src/app/api/search-optimization/keywords/[keyword]/history/route.ts
src/app/api/search-optimization/keywords/route.ts
src/app/api/search-optimization/keywords/track/route.ts
src/app/api/search-optimization/links/route.ts
src/app/api/search-optimization/links/suggestions/[id]/route.ts
src/app/api/search-optimization/overview/route.ts
src/app/api/search-optimization/schema/[id]/route.ts
src/app/api/security/block-ip/route.ts
src/app/api/security/blocked-ips/route.ts
src/app/api/security/dashboard/route.ts
src/app/api/security/logs/security/route.ts
src/app/api/security/unblock-ip/route.ts
src/app/api/tracking/campaigns/route.ts
src/app/api/tracking/click/route.ts
src/app/api/tracking/clicks/[id]/route.ts
src/app/api/tracking/conversion/route.ts
src/app/api/tracking/performance/route.ts
src/app/api/users/login/route.ts
src/app/api/users/me/route.ts
src/app/api/users/route.ts
src/app/api/webhooks/[id]/logs/route.ts
src/app/api/webhooks/[id]/route.ts
src/app/api/webhooks/[id]/test/route.ts
src/app/api/webhooks/events/route.ts
src/app/api/webhooks/logs/[id]/retry/route.ts
src/app/api/webhooks/presets/route.ts
src/app/api/webhooks/route.ts
```
