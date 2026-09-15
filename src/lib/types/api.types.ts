export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  errors?: ValidationError[];
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  pages: number; // Corrected from totalPages to pages based on backend
}

export interface ValidationError {
  field: string;
  message: string;
  path?: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR' | 'USER';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostInput {
  title: string;
  slug?: string;
  content: string;
  featuredImage?: string;
  heroImage?: number | string | null;
  status: 'DRAFT' | 'PUBLISHED';
  _status?: 'draft' | 'published';
  category?: string;
  metaTitle?: string;
  metaDescription?: string;
  focusKeyword?: string;
  tags?: string[];
  schemaType?: string;
  customSchema?: string;
  blocksData?: string;
}

export interface CreateProductInput {
  name: string;
  slug?: string;
  sku?: string;
  description?: string;
  shortDescription?: string;
  price: number;
  salePrice?: number;
  stockQuantity?: number;
  stockStatus: 'IN_STOCK' | 'OUT_OF_STOCK' | 'ON_BACKORDER';
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED' | 'INACTIVE';
  featuredImage?: string;
  galleryImages?: string[];
  attributes?: Record<string, string>;
  metaTitle?: string;
  metaDescription?: string;
  currency?: string;
}

export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  featuredImage?: string;
  heroImage?: string;
  status: 'DRAFT' | 'PUBLISHED';
  _status: 'draft' | 'published';
  category?: string;
  author: Pick<User, 'id' | 'name' | 'avatar'>;
  createdAt: string;
  updatedAt: string;
  publishedDate?: string;
  tags?: any[];
  wordpressHtml?: string;
  blocksData?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  focusKeyword?: string;
  schemaType?: string;
  customSchema?: string;
  aiOptimizationScore?: number;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  price: number;
  salePrice?: number;
  stockStatus: 'IN_STOCK' | 'OUT_OF_STOCK' | 'ON_BACKORDER';
  category?: string;
  featuredImage?: string;
  sku?: string;
  description?: string;
  shortDescription?: string;
  stockQuantity?: number;
  status?: 'ACTIVE' | 'DRAFT' | 'ARCHIVED' | 'INACTIVE';
  galleryImages?: string;
  attributes?: string;
  currency?: string;
  metaTitle?: string;
  metaDescription?: string;
}
