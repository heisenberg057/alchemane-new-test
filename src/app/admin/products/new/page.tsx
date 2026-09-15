"use client";

import { ProductForm } from "@/components/admin/ProductForm";
import { useCreateProduct } from "@/lib/hooks/useProducts";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

export default function CreateProductPage() {
  const router = useRouter();
  const createProductMutation = useCreateProduct();
  const { toast } = useToast();

  const handleSubmit = async (data: any) => {
    try {
      await createProductMutation.mutateAsync(data);
      toast({
        title: "Success",
        description: "Product created successfully",
      });
      router.push("/admin/products");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create product",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Create New Product</h2>
      </div>
      <ProductForm
        onSubmit={handleSubmit}
        isLoading={createProductMutation.isPending}
      />
    </div>
  );
}
