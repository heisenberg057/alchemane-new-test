"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateProductInput, Product } from "@/lib/types/api.types";
import { AttributeManager } from "./AttributeManager";
import { ImageGallery } from "./ImageGallery";
import { RichTextEditor } from "./RichTextEditor";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().optional(),
  sku: z.string().optional(),
  description: z.string().optional(),
  shortDescription: z.string().max(500).optional(),
  price: z.any(), // z.coerce.number().min(0, "Price must be positive"),
  salePrice: z.any().optional(), // z.coerce.number().min(0).optional(),
  currency: z.string().default("USD"),
  stockQuantity: z.any(), // z.coerce.number().int().min(0),
  stockStatus: z.enum(["IN_STOCK", "OUT_OF_STOCK", "ON_BACKORDER"]),
  status: z.enum(["ACTIVE", "INACTIVE", "ARCHIVED", "DRAFT"]), 
  metaTitle: z.string().max(70).optional(),
  metaDescription: z.string().max(160).optional(),
  // Categories will be handled separately for now or added to schema if needed
  categories: z.array(z.string()).optional(), 
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  initialData?: Product;
  onSubmit: (data: CreateProductInput) => Promise<void>;
  isLoading?: boolean;
}

export function ProductForm({ initialData, onSubmit, isLoading }: ProductFormProps) {
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [featuredImage, setFeaturedImage] = useState<string>("");
  const [attributes, setAttributes] = useState<Record<string, string>>({});

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      name: initialData?.name || "",
      slug: initialData?.slug || "",
      sku: initialData?.sku || "",
      description: initialData?.description || "",
      shortDescription: initialData?.shortDescription || "",
      price: Number(initialData?.price) || 0,
      salePrice: initialData?.salePrice ? Number(initialData?.salePrice) : undefined,
      currency: initialData?.currency || "USD",
      stockQuantity: initialData?.stockQuantity || 0,
      stockStatus: (initialData?.stockStatus as any) || "IN_STOCK",
      status: (initialData?.status as any) || "ACTIVE",
      metaTitle: initialData?.metaTitle || "",
      metaDescription: initialData?.metaDescription || "",
    },
  });

  useEffect(() => {
    if (initialData) {
      setFeaturedImage(initialData.featuredImage || "");
      try {
        const images = JSON.parse(initialData.galleryImages || "[]");
        setGalleryImages(Array.isArray(images) ? images : []);
      } catch (e) {
        setGalleryImages([]);
      }
      try {
        const attrs = JSON.parse(initialData.attributes || "{}");
        setAttributes(attrs);
      } catch (e) {
        setAttributes({});
      }
    }
  }, [initialData]);

  const handleSubmit = async (values: ProductFormValues) => {
    const submissionData: any = {
      ...values,
      featuredImage,
      galleryImages,
      attributes,
    };
    await onSubmit(submissionData);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input id="name" {...form.register("name")} placeholder="e.g. Men's Hair System" />
              {form.formState.errors.name && (
                <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="shortDescription">Short Description</Label>
              <Textarea 
                id="shortDescription" 
                {...form.register("shortDescription")} 
                placeholder="Brief summary..." 
                className="h-20"
              />
            </div>

            <div className="space-y-2">
              <Label>Full Description</Label>
              <RichTextEditor
                value={form.watch("description") || ""}
                onChange={(val) => form.setValue("description", val)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
          </CardHeader>
          <CardContent>
            <ImageGallery
              images={galleryImages}
              featuredImage={featuredImage}
              onChange={setGalleryImages}
              onFeaturedChange={setFeaturedImage}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attributes</CardTitle>
          </CardHeader>
          <CardContent>
            <AttributeManager value={attributes} onChange={setAttributes} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Search Engine Optimization</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="metaTitle">Meta Title</Label>
              <Input id="metaTitle" {...form.register("metaTitle")} />
              <p className="text-xs text-muted-foreground text-right">
                {form.watch("metaTitle")?.length || 0}/70
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="metaDescription">Meta Description</Label>
              <Textarea id="metaDescription" {...form.register("metaDescription")} />
              <p className="text-xs text-muted-foreground text-right">
                {form.watch("metaDescription")?.length || 0}/160
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Publishing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                onValueChange={(val) => form.setValue("status", val as any)}
                defaultValue={form.watch("status")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {initialData ? "Update Product" : "Create Product"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pricing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input type="number" step="0.01" id="price" {...form.register("price")} />
              {form.formState.errors.price && (
                <p className="text-sm text-destructive">{form.formState.errors.price.message as string}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="salePrice">Sale Price ($)</Label>
              <Input type="number" step="0.01" id="salePrice" {...form.register("salePrice")} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventory</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input id="sku" {...form.register("sku")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stockQuantity">Stock Quantity</Label>
              <Input type="number" id="stockQuantity" {...form.register("stockQuantity")} />
            </div>
            <div className="space-y-2">
              <Label>Stock Status</Label>
              <Select
                onValueChange={(val) => form.setValue("stockStatus", val as any)}
                defaultValue={form.watch("stockStatus")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IN_STOCK">In Stock</SelectItem>
                  <SelectItem value="OUT_OF_STOCK">Out of Stock</SelectItem>
                  <SelectItem value="ON_BACKORDER">On Backorder</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
