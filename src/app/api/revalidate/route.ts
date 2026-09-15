import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(request: Request) {
  const secret = request.headers.get('x-revalidate-secret')

  if (!process.env.REVALIDATION_SECRET || secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
  }

  let body: { slug?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid JSON body' }, { status: 400 })
  }
  const { slug } = body

  revalidatePath('/blog', 'page')
  if (slug) {
    revalidatePath(`/blog/${slug}`, 'page')
  }

  return NextResponse.json({ success: true, revalidated: true, slug: slug ?? null })
}
