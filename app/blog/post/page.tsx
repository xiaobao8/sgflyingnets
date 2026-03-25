import { Suspense } from 'react'
import { readStore } from '@/lib/store'
import { PageLayout } from '@/components/PageLayout'
import { BlogPostView } from '@/components/BlogPostView'
import { Loader2 } from 'lucide-react'

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
