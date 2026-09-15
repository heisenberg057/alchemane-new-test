import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { POST_CATEGORY_LABEL } from '@/config/postCategoryOptions';

const POSTS_PER_PAGE = 12;

function getResolvedApiBase() {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || '/api';
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl && process.env.NODE_ENV === 'production') {
    throw new Error('[Tag] NEXT_PUBLIC_APP_URL is not set');
  }
  return apiBase.startsWith('http')
    ? apiBase
    : `${(appUrl || 'http://localhost:3000').replace(/\/$/, '')}${apiBase}`;
}

async function getTagAndPosts(slug: string, page: number) {
  try {
    const base = getResolvedApiBase();

    // Fetch the tag by slug
    const tagRes = await fetch(
      `${base}/tags?where[slug][equals]=${encodeURIComponent(slug)}&limit=1`,
      { next: { revalidate: 300 } }
    );
    if (!tagRes.ok) return null;
    const tagJson = await tagRes.json();
    const tag = (tagJson.docs ?? [])[0];
    if (!tag) return null;

    // Fetch posts that have this tag
    const postsRes = await fetch(
      `${base}/posts?where[_status][equals]=published&where[tags][in]=${tag.id}&sort=-publishedDate&limit=${POSTS_PER_PAGE}&page=${page}&depth=1`,
      { next: { revalidate: 60 } }
    );
    if (!postsRes.ok) return { tag, docs: [], totalPages: 1, currentPage: page };
    const postsJson = await postsRes.json();
    const docs = postsJson.docs ?? [];
    const totalDocs: number = postsJson.totalDocs ?? docs.length;
    const totalPages: number = postsJson.totalPages ?? Math.ceil(totalDocs / POSTS_PER_PAGE);

    return { tag, docs, totalPages, currentPage: postsJson.page ?? page };
  } catch {
    return null;
  }
}

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = await getTagAndPosts(slug, 1);
  if (!result) return { title: 'Tag Not Found' };
  const title = `${result.tag.name} | American Hairline Blog`;
  return {
    title: { absolute: title },
    description: `Browse all posts tagged "${result.tag.name}" on the American Hairline blog.`,
    alternates: { canonical: `/tag/${slug}` },
    openGraph: {
      title,
      description: `Browse all posts tagged "${result.tag.name}" on the American Hairline blog.`,
      type: 'website',
    },
  };
}

export default async function TagPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const resolvedSearch = await searchParams;
  const page = Math.max(1, parseInt(resolvedSearch.page || '1', 10));

  const result = await getTagAndPosts(slug, page);
  if (!result) notFound();

  const { tag, docs: posts, totalPages, currentPage } = result;
  const pageNumbers = getPageNumbers(currentPage, totalPages);

  return (
    <div className="container mx-auto py-16 px-4 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col items-center justify-center text-center mb-16">
        <Link href="/blog" className="text-sm text-gray-500 hover:text-[#e31c58] mb-4 flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" /> Back to Blog
        </Link>
        <p className="text-sm font-semibold text-[#e31c58] uppercase tracking-wider mb-2">Tag</p>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">{tag.name}</h1>
        <p className="text-gray-500 mt-4">{posts.length === 0 ? 'No posts yet.' : `${posts.length} post${posts.length !== 1 ? 's' : ''}`}</p>
      </div>

      {/* Grid */}
      {posts.length === 0 ? (
        <div className="text-center text-muted-foreground py-12">
          No published posts found for this tag.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {posts.map((post: {
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
            }) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group block focus:outline-none focus:ring-2 focus:ring-[#e31c58] rounded-lg"
              >
                <div className="relative aspect-[4/3] w-full bg-gray-200 mb-6 overflow-hidden">
                  {post.featuredImage || post.heroImage?.url ? (
                    <Image
                      src={post.featuredImage || post.heroImage?.url || ''}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                        <circle cx="9" cy="9" r="2" />
                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="flex flex-col space-y-3">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {POST_CATEGORY_LABEL[post.category ?? ''] ?? ''}
                  </span>
                  <h2 className="text-xl font-bold leading-tight group-hover:text-black text-gray-900 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {post.meta?.description || ''}
                  </p>
                  <div className="flex items-center gap-3 pt-3">
                    <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden relative flex-shrink-0 flex items-center justify-center">
                      {post.author?.avatar ? (
                        <Image src={post.author.avatar} alt="Author avatar" fill className="object-cover" />
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
                          ? format(new Date(post.publishedDate || post.createdAt || ''), 'dd MMM yyyy')
                          : ''}
                        {post.metrics?.readingTime ? ` · ${post.metrics.readingTime} min read` : ''}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav aria-label="Tag pagination" className="flex items-center justify-center gap-1 mt-16">
              <Link
                href={currentPage > 1 ? `/tag/${slug}?page=${currentPage - 1}` : '#'}
                aria-label="Previous page"
                aria-disabled={currentPage <= 1}
                className={`flex items-center justify-center w-9 h-9 rounded-md border text-sm font-medium transition-colors ${
                  currentPage <= 1
                    ? 'border-gray-200 text-gray-300 pointer-events-none'
                    : 'border-gray-300 text-gray-700 hover:border-[#e31c58] hover:text-[#e31c58]'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </Link>

              {pageNumbers.map((p, i) =>
                p === '…' ? (
                  <span key={`ellipsis-${i}`} className="flex items-center justify-center w-9 h-9 text-sm text-gray-400 select-none">…</span>
                ) : (
                  <Link
                    key={p}
                    href={`/tag/${slug}?page=${p}`}
                    aria-label={`Page ${p}`}
                    aria-current={p === currentPage ? 'page' : undefined}
                    className={`flex items-center justify-center w-9 h-9 rounded-md border text-sm font-medium transition-colors ${
                      p === currentPage
                        ? 'border-[#e31c58] bg-[#e31c58] text-white'
                        : 'border-gray-300 text-gray-700 hover:border-[#e31c58] hover:text-[#e31c58]'
                    }`}
                  >
                    {p}
                  </Link>
                )
              )}

              <Link
                href={currentPage < totalPages ? `/tag/${slug}?page=${currentPage + 1}` : '#'}
                aria-label="Next page"
                aria-disabled={currentPage >= totalPages}
                className={`flex items-center justify-center w-9 h-9 rounded-md border text-sm font-medium transition-colors ${
                  currentPage >= totalPages
                    ? 'border-gray-200 text-gray-300 pointer-events-none'
                    : 'border-gray-300 text-gray-700 hover:border-[#e31c58] hover:text-[#e31c58]'
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
