'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { useTranslations } from '@/lib/i18n/useTranslations'

export function BlogPostView() {
  const t = useTranslations()
  const searchParams = useSearchParams()
  const url = searchParams.get('url')
  const title = searchParams.get('title') || ''

  if (!url) {
    return (
      <section className="py-20 bg-cream">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-ink-500 mb-6">{t.home.blogLoadingError}</p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-gold-600 hover:text-gold-700 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.blog.backToBlog}
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="py-8 md:py-12 bg-cream">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-ink-600 hover:text-gold-600 transition-colors text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.blog.backToBlog}
          </Link>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-gold-600 hover:text-gold-700 text-sm font-medium"
          >
            {t.blog.openInNote}
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <div className="rounded-2xl overflow-hidden border border-ink-200 bg-white shadow-lg">
          {title && (
            <div className="px-6 py-4 bg-ink-50 border-b border-ink-200">
              <h1 className="font-serif text-xl md:text-2xl font-semibold text-ink-900 line-clamp-2">
                {decodeURIComponent(title)}
              </h1>
            </div>
          )}
          <iframe
            src={url}
            title={title ? decodeURIComponent(title) : 'Note 文章'}
            className="w-full border-0 block"
            style={{ height: 'calc(100vh - 280px)', minHeight: '600px' }}
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          />
          <div className="px-6 py-3 text-ink-500 text-xs text-center border-t border-ink-100">
            {t.home.blogPageFallback}{' '}
            <a href={url} target="_blank" rel="noopener noreferrer" className="text-gold-600 hover:underline">
              {t.home.blogPageFallbackLink}
            </a>{' '}
            {t.home.blogPageFallbackEnd}
          </div>
        </div>
      </div>
    </section>
  )
}
