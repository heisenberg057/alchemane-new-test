import { api } from "@/lib/api/endpoints";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export const metadata = {
  title: "Products | American Hairline",
  description: "Browse our premium hair replacement systems and products.",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams?: { page?: string; search?: string; category?: string };
}) {
  const params = searchParams ?? {};
  const page = Number(params.page) || 1;
  const search = params.search || "";
  
  const data = await api.getProducts({ page, limit: 12, search });
  const products = data?.products ?? [];
  const pagination = data?.pagination ?? { pages: 1 };

  return (
    <div className="container py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Our Products</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover our range of high-quality hair systems designed for natural look and comfort.
        </p>
      </div>

      <div className="flex justify-between items-center mb-8">
        <form className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            name="search"
            placeholder="Search products..."
            className="pl-8"
            defaultValue={search}
          />
        </form>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <Card key={product.id} className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative aspect-square w-full bg-muted">
                <Image
                  src={product.featuredImage || "/placeholder-blog.jpg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
                {product.salePrice && (
                  <div className="absolute top-2 right-2 bg-destructive text-white text-xs font-bold px-2 py-1 rounded">
                    SALE
                  </div>
                )}
              </div>
              <CardHeader className="pb-2">
                <h3 className="text-lg font-bold line-clamp-1">
                  <Link href={`/products/${product.slug}`} className="hover:text-primary transition-colors">
                    {product.name}
                  </Link>
                </h3>
                <div className="flex items-baseline gap-2">
                  {product.salePrice ? (
                    <>
                      <span className="text-lg font-bold text-primary">
                        ${product.salePrice}
                      </span>
                      <span className="text-sm text-muted-foreground line-through">
                        ${product.price}
                      </span>
                    </>
                  ) : (
                    <span className="text-lg font-bold text-primary">
                      ${product.price}
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {product.shortDescription}
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link href={`/products/${product.slug}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-muted/30 rounded-lg">
          <h3 className="text-2xl font-medium mb-2">No products found</h3>
          <p className="text-muted-foreground">Try adjusting your search criteria.</p>
        </div>
      )}

      {/* Pagination */}
      {(pagination?.pages ?? 1) > 1 && (
        <div className="mt-12 flex justify-center gap-2">
          {page > 1 && (
            <Button variant="outline" asChild>
              <Link href={{ query: { ...params, page: page - 1 } }}>Previous</Link>
            </Button>
          )}
          <span className="flex items-center px-4 font-medium">
            Page {page} of {pagination?.pages ?? 1}
          </span>
          {page < (pagination?.pages ?? 1) && (
            <Button variant="outline" asChild>
              <Link href={{ query: { ...params, page: page + 1 } }}>Next</Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
