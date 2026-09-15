import { NextResponse } from 'next/server'
import { getPayloadSingleton } from '@/lib/api/getPayload'
import { withErrorHandling } from '@/lib/api/withErrorHandling'
import { jsonSuccess, jsonError } from '@/lib/api/response'

async function handleGET(request: Request, context: any) {
  const { slug } = await context.params
  const url = new URL(request.url)
  const isDraftPreview = url.searchParams.get('draft') === '1'

  const payload = await getPayloadSingleton()

  // Only allow draft access for authenticated users.
  // If unauthenticated, silently fall back to published — never expose drafts.
  let effectiveDraft = false
  if (isDraftPreview) {
    const { user } = await payload.auth({ headers: request.headers })
    effectiveDraft = !!user
  }

  const whereClause: Record<string, any> = effectiveDraft
    ? { slug: { equals: slug } }
    : { slug: { equals: slug }, _status: { equals: 'published' } }

  const result = await payload.find({
    collection: 'posts',
    where: whereClause,
    limit: 1,
    depth: 2,
    overrideAccess: effectiveDraft,
  })

  if (!result.docs.length) {
    return NextResponse.json(jsonError('Post not found'), { status: 404 })
  }

  const post = result.docs[0] as any

  const related = await payload.find({
    collection: 'posts',
    where: {
      slug: { not_equals: slug },
      _status: { equals: 'published' },
    },
    limit: 3,
    depth: 1,
  })

  const response = NextResponse.json(jsonSuccess({
    post: {
      ...post,
      wordpressHtml: post.wordpressHtml,
      blocksData: post.blocksData,
      featuredImage: post.heroImage?.url || null,
      // Basic SEO
      metaTitle: post.meta?.title,
      metaDescription: post.meta?.description,
      metaKeywords: post.meta?.keywords,
      twitterTitle: post.meta?.twitterTitle,
      twitterDescription: post.meta?.twitterDescription,
      canonicalUrl: post.canonicalUrl,
      // OG image
      ogImageUrl: post.meta?.image?.url || null,
      // Schema
      schemaType: post.structuredData?.schemaType || 'BlogPosting',
      customSchema: post.structuredData?.customSchema || null,
      // SEO Analysis
      focusKeyword: post.seoAnalysis?.focusKeyword,
      seoScore: post.seoAnalysis?.seoScore,
      seoFeedback: post.seoAnalysis?.seoFeedback,
      // Metrics
      metrics: post.metrics,
      // AI optimisation
      aiOptimization: post.aiOptimization,
    },
    relatedPosts: related.docs.map((p: any) => ({
      ...p,
      featuredImage: p.heroImage?.url || null,
    }))
  }, 'Post fetched'))

  // Don't cache authenticated draft previews
  if (effectiveDraft) {
    response.headers.set('Cache-Control', 'no-store')
  }

  return response
}

export const GET = withErrorHandling(handleGET)
