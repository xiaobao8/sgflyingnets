import type { Metadata } from 'next'
import { Suspense } from 'react'
import { readStore } from '@/lib/store'
import { PageLayout } from '@/components/PageLayout'
import { BlogPostView } from '@/components/BlogPostView'
import { Loader2 } from 'lucide-react'

function blogPostCanonical(searchParams: {
  url?: string | string[]
  title?: string | string[]
}): string {
  const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)
  const url = one(searchParams.url)
  const title = one(searchParams.title)
  if (!url) return '/blog/post'
  const qs = new URLSearchParams()
  qs.set('url', url)
  if (title) qs.set('title', title)
  return `/blog/post?${qs.toString()}`
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { url?: string | string[]; title?: string | string[] }
}): Promise<Metadata> {
  return { alternates: { canonical: blogPostCanonical(searchParams) } }
}

export default function BlogPostPage() {
  const store = readStore()
  const config = store.site_config

  return (
    <PageLayout config={config} pageId="blog">
      <Suspense
        fallback={
          <div className="flex justify-center py-24">
            <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
          </div>
        }
      >
        <BlogPostView />
      </Suspense>
    </PageLayout>
  )
}
