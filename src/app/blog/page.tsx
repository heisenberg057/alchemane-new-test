import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import type { CSSProperties } from 'react';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import { blogSchema } from '@/config/page-schemas';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { POST_CATEGORY_LABEL, POST_CATEGORY_OPTIONS } from '@/config/postCategoryOptions';
import type { SchemaInput } from '@/components/seo/SchemaMarkup';
import { buildPageMetadata } from '@/lib/seo/buildPageMetadata';

interface BlogListPost {
  id: string | number;
  slug: string;
  title: string;
  category?: string;
  featuredImage?: string;
  heroImage?: { url?: string };
  meta?: { description?: string };
  author?: { name?: string; avatar?: string };
  publishedDate?: string;
  createdAt?: string;
  metrics?: { readingTime?: number };
}

export const metadata: Metadata = buildPageMetadata({
  title: 'Blog | American Hairline',
  description: 'Latest news, tips, and insights about hair replacement and restoration.',
  canonical: '/blog',
  robots: { index: true, follow: true },
  fallbackTitle: 'Blog | American Hairline',
  fallbackDescription:
    'Latest news, tips, and insights about hair replacement and restoration.',
});


const POSTS_PER_PAGE = 12;

function buildBlogPageHref(page: number, category?: string, search?: string) {
  const params = new URLSearchParams();

  if (page > 1) params.set('page', String(page));
  if (category) params.set('category', category);
  if (search) params.set('search', search);

  const query = params.toString();
  return query ? `/blog?${query}` : '/blog';
}

async function getPosts(page: number, category?: string, search?: string) {
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || '/api';
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!appUrl && process.env.NODE_ENV === 'production') {
      throw new Error('[Blog] NEXT_PUBLIC_APP_URL is not set — cannot construct absolute URL in production');
    }
    const resolvedApiBase = apiBase.startsWith('http')
      ? apiBase
      : `${(appUrl || 'http://localhost:3000').replace(/\/$/, '')}${apiBase}`;

    const params = new URLSearchParams({
      'where[_status][equals]': 'published',
      sort: '-publishedDate',
      limit: String(POSTS_PER_PAGE),
      page: String(page),
      depth: '1',
    });

    if (category) {
      params.set('where[category][equals]', category);
    }

    if (search) {
      params.set('where[or][0][title][like]', search);
      params.set('where[or][1][slug][like]', search);
    }

    const url = `${resolvedApiBase}/posts?${params.toString()}`;
    const res = await fetch(url, { next: { revalidate: 60 } });

    if (!res.ok) throw new Error('Failed to fetch posts');

    const json = await res.json();
    // Payload REST returns: { docs, totalDocs, totalPages, page, hasNextPage, hasPrevPage }
    const docs: BlogListPost[] = json.docs || json.data?.posts || json.posts || [];
    const totalDocs: number = json.totalDocs ?? docs.length;
    const totalPages: number = json.totalPages ?? Math.ceil(totalDocs / POSTS_PER_PAGE);

    return { docs, totalDocs, totalPages, currentPage: json.page ?? page };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return { docs: [] as BlogListPost[], totalDocs: 0, totalPages: 1, currentPage: page };
  }
}

// Generate page numbers to show: always show first, last, current ±1, with ellipsis gaps
function getPageNumbers(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | '…')[] = [1];

  if (current > 3) pages.push('…');

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);

  if (current < total - 2) pages.push('…');

  pages.push(total);
  return pages;
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string; search?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page || '1', 10));
  const rawCategory = typeof params.category === 'string' ? params.category : undefined;
  const category = POST_CATEGORY_OPTIONS.some((option) => option.value === rawCategory)
    ? rawCategory
    : undefined;
  const search = typeof params.search === 'string' ? params.search.trim() : '';
  const { docs: posts, totalPages, currentPage } = await getPosts(page, category, search);

  const pageNumbers = getPageNumbers(currentPage, totalPages);
  const activeCategoryLabel = category ? POST_CATEGORY_LABEL[category] : undefined;
  const brandBlue = '#4686fe';

  return (
    <div className="container mx-auto py-16 px-4 max-w-7xl">
      <SchemaMarkup schema={blogSchema as SchemaInput} />

      {/* Header */}
      <div className="flex flex-col items-center justify-center text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">Blog</h1>
        {(activeCategoryLabel || search) && (
          <div className="mt-4 text-sm text-gray-600">
            <span>
              Showing
              {activeCategoryLabel ? ` category: ${activeCategoryLabel}` : ''}
              {activeCategoryLabel && search ? ' | ' : ''}
              {search ? ` search: "${search}"` : ''}
            </span>
            <Link
              href="/blog"
              className="ml-3 font-medium transition-opacity hover:opacity-80"
              style={{ color: brandBlue }}
            >
              Clear filters
            </Link>
          </div>
        )}
      </div>

      {/* Grid */}
      {posts.length === 0 ? (
        <div className="text-center text-muted-foreground py-12">
          No posts found{activeCategoryLabel || search ? ' for the selected filters.' : '.'}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group block rounded-[28px] border border-[#dbe6ff] bg-white p-5 shadow-[0_18px_60px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(70,134,254,0.14)] focus:outline-none focus:ring-2"
                style={{ '--tw-ring-color': brandBlue } as CSSProperties}
              >
                {/* Image */}
                <div className="relative mb-6 aspect-[16/10] w-full overflow-hidden rounded-[22px] border border-[#e6eefc] bg-gradient-to-br from-[#f6f9ff] via-white to-[#eef5ff]">
                  {post.featuredImage || post.heroImage?.url ? (
                    <Image
                      src={(post.featuredImage || post.heroImage?.url) as string}
                      alt={post.title}
                      fill
                      sizes="(min-width: 1280px) 360px, (min-width: 768px) 46vw, 100vw"
                      className="object-contain object-center transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <svg
                        className="w-12 h-12 text-gray-300"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                        <circle cx="9" cy="9" r="2" />
                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-col space-y-3">
                  <span
                    className="text-xs font-semibold uppercase tracking-[0.18em]"
                    style={{ color: brandBlue }}
                  >
                    {post.category ? POST_CATEGORY_LABEL[post.category] ?? '' : ''}
                  </span>
                  <h2 className="text-[1.55rem] font-bold leading-tight text-gray-900 transition-colors group-hover:text-[#4686fe]">
                    {post.title}
                  </h2>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {post.meta?.description || ''}
                  </p>

                  {/* Meta */}
                  <div className="flex items-center gap-3 pt-3">
                    <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden relative flex-shrink-0 flex items-center justify-center">
                      {post.author?.avatar ? (
                        <Image
                          src={post.author.avatar}
                          alt="Author avatar"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <span className="text-xs text-gray-500 font-medium">AH</span>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900 leading-none mb-1">
                        {post.author?.name || 'American Hairline'}
                      </span>
                      <span className="text-xs text-gray-500 leading-none">
                        {post.publishedDate || post.createdAt
                          ? format(
                              new Date((post.publishedDate || post.createdAt) as string),
                              'dd MMM yyyy',
                            )
                          : ''}
                        {post.metrics?.readingTime
                          ? ` · ${post.metrics.readingTime} min read`
                          : ''}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav
              aria-label="Blog pagination"
              className="flex items-center justify-center gap-1 mt-16"
            >
              {/* Prev */}
              <Link
                href={buildBlogPageHref(Math.max(currentPage - 1, 1), category, search)}
                aria-label="Previous page"
                aria-disabled={currentPage <= 1}
                className={`flex items-center justify-center w-9 h-9 rounded-md border text-sm font-medium transition-colors
                  ${currentPage <= 1
                    ? 'border-gray-200 text-gray-300 pointer-events-none'
                    : 'border-gray-300 text-gray-700 hover:border-[#4686fe] hover:text-[#4686fe]'
                  }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </Link>

              {/* Page numbers */}
              {pageNumbers.map((p, i) =>
                p === '…' ? (
                  <span
                    key={`ellipsis-${i}`}
                    className="flex items-center justify-center w-9 h-9 text-sm text-gray-400 select-none"
                  >
                    …
                  </span>
                ) : (
                  <Link
                    key={p}
                    href={buildBlogPageHref(p, category, search)}
                    aria-label={`Page ${p}`}
                    aria-current={p === currentPage ? 'page' : undefined}
                    className={`flex items-center justify-center w-9 h-9 rounded-md border text-sm font-medium transition-colors
                      ${p === currentPage
                        ? 'border-[#4686fe] bg-[#4686fe] text-white'
                        : 'border-gray-300 text-gray-700 hover:border-[#4686fe] hover:text-[#4686fe]'
                      }`}
                  >
                    {p}
                  </Link>
                ),
              )}

              {/* Next */}
              <Link
                href={buildBlogPageHref(Math.min(currentPage + 1, totalPages), category, search)}
                aria-label="Next page"
                aria-disabled={currentPage >= totalPages}
                className={`flex items-center justify-center w-9 h-9 rounded-md border text-sm font-medium transition-colors
                  ${currentPage >= totalPages
                    ? 'border-gray-200 text-gray-300 pointer-events-none'
                    : 'border-gray-300 text-gray-700 hover:border-[#4686fe] hover:text-[#4686fe]'
                  }`}
              >
                <ChevronRight className="w-4 h-4" />
              </Link>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
