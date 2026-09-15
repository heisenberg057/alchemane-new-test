"use client";

import * as React from "react";
import { ProductForm } from "@/components/admin/ProductForm";
import { useProduct, useUpdateProduct, useDeleteProduct } from "@/lib/hooks/useProducts";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Trash, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { toast } = useToast();
  
  const resolvedParams = React.use(params);
  const id = parseInt(resolvedParams.id);

  const { data: product, isLoading: isLoadingProduct } = useProduct(id);
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

  const handleSubmit = async (data: any) => {
    try {
      await updateProductMutation.mutateAsync({ id, ...data });
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
      router.push("/admin/products");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProductMutation.mutateAsync(id);
        toast({
          title: "Success",
          description: "Product deleted successfully",
        });
        router.push("/admin/products");
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete product",
          variant: "destructive",
        });
      }
    }
  };

  if (isLoadingProduct) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Edit Product</h2>
        <div className="flex gap-2">
          {product.status === "ACTIVE" && (
            <Button variant="outline" asChild>
              <a
                href={`/products/${product.slug}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Eye className="mr-2 h-4 w-4" /> View Live
              </a>
            </Button>
          )}
          <Button variant="destructive" onClick={handleDelete}>
            <Trash className="mr-2 h-4 w-4" /> Delete Product
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>Created: {format(new Date(product.createdAt), "MMM d, yyyy")}</span>
        <span>
          Last updated: {format(new Date(product.updatedAt), "MMM d, yyyy h:mm a")}
        </span>
      </div>

      <ProductForm
        initialData={product}
        onSubmit={handleSubmit}
        isLoading={updateProductMutation.isPending}
      />
    </div>
  );
}
