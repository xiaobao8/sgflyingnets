import type { Metadata } from 'next'
import { readStore } from '@/lib/store'
import { PageLayout } from '@/components/PageLayout'
import { BlogPageContent } from '@/components/BlogPageContent'

export const metadata: Metadata = {
  alternates: { canonical: '/blog' },
}

export default function BlogPage() {
  const store = readStore()
  const config = store.site_config
  const rssUrl = config.note_rss_url || 'https://note.com/flyingnets/rss'
  const noteBaseUrl = rssUrl.replace(/\/rss\/?$/, '') || 'https://note.com/flyingnets'

  return (
    <PageLayout config={config} pageId="blog">
      <BlogPageContent rssUrl={rssUrl} noteBaseUrl={noteBaseUrl} />
    </PageLayout>
  )
}
