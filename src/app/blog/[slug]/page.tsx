import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { headers as nextHeaders } from 'next/headers';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';

const ShareButtons = dynamic(() =>
  import('@/components/blog/ShareButtons').then((m) => ({ default: m.ShareButtons }))
);
const CommentForm = dynamic(() =>
  import('@/components/blog/CommentForm').then((m) => ({ default: m.CommentForm }))
);
import { parseWordPressHtmlToBlocks } from '@/lib/utils/parseWordPressHtml';
import { ensureUniqueBlockIds } from '@/lib/editor/blockUtils';
import {
  getEffectivePostMetaDescription,
  getEffectivePostMetaTitle,
} from '@/lib/seo/effectiveMeta';
import { absoluteUrl, resolvePageTitle } from '@/lib/seo/buildPageMetadata';
import { MessageSquare, ChevronRight, User, Calendar } from 'lucide-react';
import { POST_CATEGORY_LABEL } from '@/config/postCategoryOptions';
import { SITE_ASSET_URLS } from '@/config/siteAssetUrls';

interface PostBlock {
  id: string;
  type: string;
  props?: { text?: string; level?: number; [key: string]: unknown };
  children?: PostBlock[];
}

interface RelatedPost {
  id: string | number;
  slug: string;
  title: string;
  category?: string;
  featuredImage?: string;
  metaDescription?: string;
  meta?: { description?: string };
  publishedDate?: string;
  createdAt?: string;
}

interface PostTag {
  id: string | number;
  slug: string;
  name: string;
}
/** Safely serialise an object for inline JSON-LD — prevents </script> tag injection. */
function safeJsonLd(data: unknown): string {
  return JSON.stringify(data)
    .replace(/<\//g, "<\\/")
    .replace(/<!--/g, "<\\!--");
}

function getResolvedApiBase() {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "/api";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl && process.env.NODE_ENV === "production") {
    throw new Error("[Blog] NEXT_PUBLIC_APP_URL is not set — cannot construct absolute URL in production");
  }
  return apiBase.startsWith("http")
    ? apiBase
    : `${(appUrl || "http://localhost:3000").replace(/\/$/, "")}${apiBase}`;
}

async function getPostData(slug: string, isDraftPreview = false) {
  try {
    const resolvedApiBase = getResolvedApiBase();
    const url = `${resolvedApiBase}/posts/slug/${slug}${isDraftPreview ? '?draft=1' : ''}`;

    // For draft previews, forward the incoming Cookie header so payload.auth()
    // can authenticate the server-to-server request and serve the draft.
    const fetchOptions: RequestInit = isDraftPreview
      ? { cache: 'no-store' }
      : { next: { revalidate: 60 } };

    if (isDraftPreview) {
      const incomingHeaders = await nextHeaders();
      const cookie = incomingHeaders.get('cookie');
      if (cookie) {
        fetchOptions.headers = { cookie };
      }
    }

    const res = await fetch(url, fetchOptions);

    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (error) {
    console.error('Error fetching post:', error);
    return null;
  }
}

export async function generateMetadata({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ draft?: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;
  const data = await getPostData(resolvedParams.slug, resolvedSearch.draft === '1');
  const post = data?.post;

  if (!post) return { title: 'Post Not Found' };

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://americanhairline.com';
  const postUrl = `${appUrl.replace(/\/$/, '')}/blog/${post.slug}`;
  const baseTitle = getEffectivePostMetaTitle(post);
  const metaTitle = /american hairline/i.test(baseTitle)
    ? baseTitle
    : `${baseTitle} | American Hairline`;
  const metaDescription = getEffectivePostMetaDescription(post);
  const ogImage =
    typeof post.ogImageUrl === 'string' && post.ogImageUrl.trim() !== ''
      ? post.ogImageUrl
      : post.featuredImage || SITE_ASSET_URLS.defaultSocialImage;

  return {
    title: resolvePageTitle(metaTitle, metaTitle),
    description: metaDescription,
    keywords: post.metaKeywords || undefined,
    robots: { index: true, follow: true },
    alternates: {
      canonical: absoluteUrl(post.canonicalUrl || postUrl),
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: postUrl,
      type: 'article',
      publishedTime: post.publishedDate || post.createdAt,
      modifiedTime: post.updatedAt,
      authors: post.author?.name ? [post.author.name] : ['American Hairline'],
      images: [{ url: absoluteUrl(ogImage), width: 1200, height: 630, alt: metaTitle }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.twitterTitle || metaTitle,
      description: post.twitterDescription || metaDescription,
      images: [absoluteUrl(ogImage)],
    },
  };
}

export default async function BlogPostPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ draft?: string }> }) {
  const resolvedParams = await params;
  const resolvedSearch = await searchParams;
  const isDraftPreview = resolvedSearch.draft === '1';
  const data = await getPostData(resolvedParams.slug, isDraftPreview);

  if (!data || !data.post) {
    notFound();
  }

  const { post, relatedPosts } = data;
  const resolvedApiBase = getResolvedApiBase();

  const commentsRes = await fetch(
    `${resolvedApiBase}/comments?postId=${post.id}`,
    { next: { revalidate: 60 } }
  );
  const commentsData = commentsRes.ok ? await commentsRes.json() : { data: [] };
  const comments: { id: number | string; name: string; message: string; createdAt: string }[] = commentsData.data || [];

  // Parse blocks: prefer blocksData (Visual Builder), fall back to parsing wordpressHtml
  let blocks: PostBlock[] = [];
  if (post.blocksData) {
    try {
      const parsed = JSON.parse(post.blocksData as string);
      blocks = Array.isArray(parsed) ? parsed : (parsed.blocks || []);
    } catch { /* ignore */ }
  }
  if (blocks.length === 0 && typeof post.wordpressHtml === 'string') {
    blocks = parseWordPressHtmlToBlocks(post.wordpressHtml) as PostBlock[];
  }
  blocks = ensureUniqueBlockIds(blocks) as PostBlock[];

  // Auto-generate TOC from heading blocks (strip HTML tags for display text)
  const headings = blocks.filter(b => b.type === 'heading').map(b => ({
    text: (b.props?.text || 'Section').replace(/<[^>]+>/g, ''),
    level: b.props?.level || 2,
    id: b.id,
  }));

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://americanhairline.com';
  const publishDate = post.publishedDate || post.createdAt;
  const postUrl = post.canonicalUrl || `${appUrl}/blog/${post.slug}`;

  // Use custom JSON-LD if provided, else FAQ schema if available, else auto-generate
  const jsonLd = post.customSchema ||
    post.aiOptimization?.faqSchema ||
    {
      "@context": "https://schema.org",
      "@type": post.schemaType || post.structuredData?.schemaType || "BlogPosting",
      "headline": post.title,
      "description": getEffectivePostMetaDescription(post),
      "image": post.featuredImage ? [post.featuredImage] : undefined,
      "author": {
        "@type": "Person",
        "name": post.author?.name || "American Hairline",
      },
      "publisher": {
        "@type": "Organization",
        "name": "American Hairline",
        "logo": { "@type": "ImageObject", "url": SITE_ASSET_URLS.logo },
      },
      "datePublished": publishDate,
      "dateModified": post.updatedAt || publishDate,
      "mainEntityOfPage": { "@type": "WebPage", "@id": postUrl },
      "url": postUrl,
      "keywords": post.metaKeywords || undefined,
      "wordCount": post.metrics?.wordCount || undefined,
    };

  return (
    <div className="bg-white min-h-screen pb-20">
      
      {/* 2. Post Header & Hero Section */}
      <div className="bg-gray-50 pt-16 pb-12 border-b border-gray-200">
        <div className="container mx-auto px-4 max-w-7xl">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center text-sm text-gray-500 mb-8 w-full max-w-4xl mx-auto">
            <Link href="/" className="hover:text-[#4686fe] transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4 mx-2" />
            <Link href="/blog" className="hover:text-[#4686fe] transition-colors">Blog</Link>
            {post.category && (
              <>
                <ChevronRight className="w-4 h-4 mx-2" />
                <span>{POST_CATEGORY_LABEL[post.category] ?? post.category}</span>
              </>
            )}
            <ChevronRight className="w-4 h-4 mx-2" />
            <span className="text-gray-900 font-medium truncate">{post.title}</span>
          </nav>

          <div className="max-w-4xl mx-auto">
            {/* Category Tag */}
            {post.category && (
              <div className="mb-4">
                <span className="bg-[#4686fe] text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded">
                  {POST_CATEGORY_LABEL[post.category] ?? post.category}
                </span>
              </div>
            )}

            {/* H1 Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              {post.title}
            </h1>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-8">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden relative">
                   {post.author?.avatar ? (
                     <Image src={post.author.avatar} alt={post.author.name} fill className="object-cover" />
                   ) : (
                     <User className="w-5 h-5 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400" />
                   )}
                </div>
                <span className="font-medium text-gray-900">{post.author?.name || 'Admin'}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{format(publishDate, 'MMMM d, yyyy')}</span>
              </div>

              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                <span>{comments.length} Comments</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-7xl mt-12">
          <article className="max-w-4xl mx-auto w-full">
            
            {/* Hero Image */}
            <div className="relative mb-12 aspect-[16/10] w-full overflow-hidden rounded-[28px] border border-[#dbe6ff] bg-gradient-to-br from-[#f6f9ff] via-white to-[#eef5ff] shadow-[0_24px_70px_rgba(15,23,42,0.08)]">
              {post.featuredImage ? (
                <Image 
                  src={post.featuredImage} 
                  alt={post.title} 
                  fill 
                  sizes="(min-width: 1280px) 896px, 100vw"
                  className="object-contain object-center"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-full w-full text-gray-300">
                   <span className="text-2xl font-bold uppercase tracking-widest opacity-30">Featured Image</span>
                </div>
              )}
            </div>

            {/* Table of Contents */}
            {headings.length > 0 && (
              <div className="bg-gray-50 border border-gray-100 rounded-xl p-6 mb-12 text-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4 tracking-tight">Table of Contents</h3>
                <ul className="space-y-3">
                  {headings.map((heading, idx) => (
                    <li key={idx} className={heading.level > 2 ? 'ml-4' : ''}>
                      <a href={`#${heading.id}`} className="text-[#4686fe] hover:underline flex items-start gap-2">
                        <ChevronRight className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
                        <span>{heading.text}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 3. Main Content Rendering */}
            <BlockRenderer blocks={blocks} defaultImageFit="contain" />

            {/* 4. Call-To-Action & Post Footer */}
            <div className="mt-16 bg-[#002f5b]/5 border-l-4 border-[#002f5b] p-8 rounded-r-xl">
              <h3 className="text-2xl font-bold text-[#002f5b] mb-4">Ready to regain your confidence?</h3>
              <p className="text-gray-700 mb-6">American Hairline provides premium, non-surgical hair replacement systems designed specifically for you. Don't wait to change how you feel.</p>
              <div className="flex flex-wrap gap-4">
                <a href="tel:9222666111" className="bg-[#4686fe] text-white px-6 py-3 rounded-md font-bold hover:bg-[#2f6fe6] transition-colors">
                  Call Now: 9222666111
                </a>
                <Link href="/contact-us" className="border-2 border-[#002f5b] text-[#002f5b] px-6 py-3 rounded-md font-bold hover:bg-[#002f5b] hover:text-white transition-colors">
                  Book Consultation
                </Link>
              </div>
            </div>

            {/* Post Tags & Social Share */}
            <div className="flex flex-col md:flex-row items-center justify-between border-y border-gray-200 py-6 mt-12 gap-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-sm text-gray-900 mr-2">Tags:</span>
                {(post.tags as PostTag[] | undefined)?.map((tag) => (
                  <Link key={tag.id} href={`/tag/${tag.slug}`} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs hover:bg-[#4686fe] hover:text-white transition-colors">
                    {tag.name}
                  </Link>
                ))}
              </div>
              <ShareButtons url={postUrl} title={post.title} />
            </div>

            {/* Post Navigation */}
            <div className="flex justify-between items-center py-8">
              <Link href="/blog" className="text-[#4686fe] font-semibold hover:underline flex items-center gap-2">
                &larr; Back to List
              </Link>
            </div>

            {/* 6. Interactive Section: Comments */}
            <div className="mt-8 border-t border-gray-200 pt-12">
              <h3 className="text-3xl font-bold mb-8">{comments.length} Comments</h3>
              
              <div className="space-y-8 mb-12">
                {comments.length === 0 ? (
                  <p className="text-gray-500 italic">No comments yet. Be the first to share your thoughts!</p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4 p-6 bg-white border border-gray-100 rounded-xl shadow-sm">
                      <div className="w-12 h-12 rounded-full bg-indigo-100 flex-shrink-0 flex items-center justify-center font-bold text-indigo-800 text-lg">
                        {comment.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-2">
                          <h4 className="font-bold text-gray-900">{comment.name}</h4>
                          <span className="text-xs text-gray-500">{format(new Date(comment.createdAt), 'MMM d, yyyy')}</span>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">{comment.message}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Comment Form */}
              <CommentForm postId={post.id} />
            </div>

          </article>
      </div>

      {/* 5. Related Content Block (Bottom Full Width) */}
      {relatedPosts && relatedPosts.length > 0 && (
        <div className="bg-gray-50 mt-16 py-16 border-t border-gray-200">
          <div className="container mx-auto px-4 max-w-7xl">
            <h2 className="text-3xl font-bold mb-10 text-center">Related Articles</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {(relatedPosts as RelatedPost[]).slice(0, 3).map((rPost) => (
                <Link key={rPost.id} href={`/blog/${rPost.slug}`} className="group block overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-[#4686fe]">
                  <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-[#e6eefc] bg-gradient-to-br from-[#f6f9ff] via-white to-[#eef5ff]">
                    {rPost.featuredImage ? (
                      <Image
                        src={rPost.featuredImage}
                        alt={rPost.title}
                        fill
                        sizes="(min-width: 1280px) 320px, (min-width: 768px) 50vw, 100vw"
                        className="object-contain object-center transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                         <span className="text-xs uppercase tracking-widest opacity-40">No image</span>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <span className="text-xs font-semibold text-[#4686fe] uppercase tracking-wide mb-2 block">
                      {rPost.category ? POST_CATEGORY_LABEL[rPost.category] ?? 'Article' : 'Article'}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#4686fe] transition-colors leading-tight mb-3">
                      {rPost.title}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                      {rPost.metaDescription || rPost.meta?.description || ''}
                    </p>
                    <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
                      <span className="text-xs text-gray-500 font-medium">Continue Reading &rarr;</span>
                      <span className="text-xs text-gray-400">{rPost.publishedDate || rPost.createdAt ? format(new Date((rPost.publishedDate || rPost.createdAt) as string), 'MMM d, yyyy') : ''}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd) }}
      />
      
    </div>
  );
}
