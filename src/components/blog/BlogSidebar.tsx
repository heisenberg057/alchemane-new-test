import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";
import { ChevronRight } from "lucide-react";
import { POST_CATEGORY_OPTIONS } from "@/config/postCategoryOptions";

function getResolvedApiBase() {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "/api";
  return apiBase.startsWith("http")
    ? apiBase
    : `${(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "")}${apiBase}`;
}

export async function BlogSidebar() {
  const apiBase = getResolvedApiBase();

  let recentPosts: any[] = [];

  try {
    const postsRes = await fetch(
      `${apiBase}/posts?where[_status][equals]=published&sort=-publishedDate&limit=4&depth=1`,
      { next: { revalidate: 60 } }
    );

    const postsJson = postsRes.ok ? await postsRes.json() : null;

    const postDocs = Array.isArray(postsJson?.docs)
      ? postsJson.docs
      : Array.isArray(postsJson?.data?.docs)
        ? postsJson.data.docs
        : [];
    recentPosts = postDocs.map((p: any) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      publishedAt: p.publishedDate || p.createdAt,
      featuredImage: p.heroImage?.url || p.featuredImage || null,
    }));
  } catch {
    recentPosts = [];
  }

  return (
    <div className="space-y-10">
      {/* Search Widget */}
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
        <h3 className="text-lg font-bold mb-4 uppercase tracking-wider text-gray-900 text-sm">Search Blog</h3>
        <form action="/blog" method="get" className="relative">
          <input 
            type="text" 
            name="search"
            placeholder="Search articles..." 
            className="w-full pl-4 pr-10 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#e31c58]"
          />
          <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </button>
        </form>
      </div>

      {/* Categories Widget */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold mb-4 uppercase tracking-wider text-gray-900 border-b pb-2">Categories</h3>
        <ul className="space-y-3">
          {POST_CATEGORY_OPTIONS.map((category) => (
            <li key={category.value}>
              <Link href={`/blog?category=${category.value}`} className="flex items-center justify-between text-gray-600 hover:text-[#e31c58] transition-colors">
                <span>{category.label}</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Browse All Widget */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold mb-4 uppercase tracking-wider text-gray-900 border-b pb-2">Browse All</h3>
        <ul className="space-y-3">
          <li>
            <Link href="/blog" className="text-gray-600 hover:text-[#e31c58] transition-colors text-sm flex items-center gap-2">
              <ChevronRight className="w-3 h-3" /> All Articles
            </Link>
          </li>
          <li>
            <Link href="/blog?category=hair-systems" className="text-gray-600 hover:text-[#e31c58] transition-colors text-sm flex items-center gap-2">
              <ChevronRight className="w-3 h-3" /> Hair Systems
            </Link>
          </li>
          <li>
            <Link href="/blog?category=hair-transplant" className="text-gray-600 hover:text-[#e31c58] transition-colors text-sm flex items-center gap-2">
              <ChevronRight className="w-3 h-3" /> Hair Transplant
            </Link>
          </li>
          <li>
            <Link href="/blog?category=general-care" className="text-gray-600 hover:text-[#e31c58] transition-colors text-sm flex items-center gap-2">
              <ChevronRight className="w-3 h-3" /> General Care
            </Link>
          </li>
        </ul>
      </div>

      {/* Recent Posts Widget */}
      <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold mb-6 uppercase tracking-wider text-gray-900 border-b pb-2">Recent Posts</h3>
        <div className="space-y-6">
          {recentPosts.length > 0 ? recentPosts.map((rPost: any) => (
            <Link key={rPost.id} href={`/blog/${rPost.slug}`} className="flex gap-4 group">
              <div className="w-20 h-20 rounded-md bg-gray-200 overflow-hidden relative flex-shrink-0">
                {rPost.featuredImage ? (
                  <Image src={rPost.featuredImage} alt={rPost.title} fill className="object-cover group-hover:scale-110 transition-transform" />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-xs text-gray-400">IMG</div>
                )}
              </div>
              <div className="flex flex-col justify-center">
                <h4 className="font-bold text-sm text-gray-900 group-hover:text-[#e31c58] transition-colors line-clamp-2 leading-tight mb-1">{rPost.title}</h4>
                <span className="text-xs text-gray-500">{format(new Date(rPost.publishedAt || new Date()), 'MMM d, yyyy')}</span>
              </div>
            </Link>
          )) : (
            <p className="text-gray-500 text-sm italic">No recent posts found</p>
          )}
        </div>
      </div>

      {/* CTA Widget */}
      <div className="bg-[#002f5b] text-white p-8 rounded-xl text-center shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-2xl"></div>
        <h3 className="text-2xl font-bold mb-4 relative z-10">Need Expert Advice?</h3>
        <p className="text-indigo-100 text-sm mb-6 relative z-10">Schedule a free, private consultation with our hair replacement specialists.</p>
        <Link href="/contact-us" className="inline-block bg-[#e31c58] text-white px-6 py-3 rounded-md font-bold hover:bg-[#c11448] transition-colors shadow-md relative z-10 w-full text-center">
          Book Free Consultation
        </Link>
      </div>
    </div>
  );
}
