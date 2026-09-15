"use client";

import { usePages, useDeletePage } from "@/lib/hooks/usePages";
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
import { useToast } from "@/components/ui/use-toast";

export default function PagesPage() {
  const router = useRouter();
  const { toast } = useToast();
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
      try {
        await deletePageMutation.mutateAsync(deleteId);
        toast({ title: "Page deleted" });
      } catch {
        toast({ title: "Delete failed", description: "Could not delete the page. Please try again.", variant: "destructive" });
      } finally {
        setDeleteId(null);
      }
    }
  };

  const columns = [
    {
      header: "Page Title",
      className: "w-[40%]",
      cell: (pageObj: any) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded bg-slate-100 flex-shrink-0 border flex items-center justify-center overflow-hidden relative">
            {pageObj.featuredImage ? (
              <Image src={pageObj.featuredImage} alt="" fill className="object-cover" sizes="40px" />
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
            <DropdownMenuItem onClick={() => window.open(pageObj.slug === 'home' ? '/' : `/${pageObj.slug}`, '_blank')}>
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
            placeholder="Search pages by title..."
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
