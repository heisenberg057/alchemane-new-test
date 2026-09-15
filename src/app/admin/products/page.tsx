"use client";

import { useProducts, useDeleteProduct } from "@/lib/hooks/useProducts";
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
        <div className="h-10 w-10 rounded bg-slate-100 overflow-hidden border relative">
          {product.featuredImage ? (
            <Image src={product.featuredImage} alt="" fill className="object-cover" sizes="40px" />
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
