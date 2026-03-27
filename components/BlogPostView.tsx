'use client'

import { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { useTranslations } from '@/lib/i18n/useTranslations'

const ALLOWED_IFRAME_HOSTS = ['note.com', 'www.note.com']

function isAllowedUrl(raw: string | null): string | null {
  if (!raw) return null
  try {
    const parsed = new URL(raw)
    if (parsed.protocol !== 'https:') return null
    if (!ALLOWED_IFRAME_HOSTS.some(h => parsed.hostname === h || parsed.hostname.endsWith('.' + h))) return null
    return parsed.href
  } catch {
    return null
  }
}

function safeDecodeTitle(raw: string): string {
  try {
    const decoded = decodeURIComponent(raw)
    const el = typeof document !== 'undefined' ? document.createElement('div') : null
    if (el) {
      el.textContent = decoded
      return el.innerHTML
    }
    return decoded
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
  } catch {
    return ''
  }
}

export function BlogPostView() {
  const t = useTranslations()
  const searchParams = useSearchParams()
  const rawUrl = searchParams.get('url')
  const rawTitle = searchParams.get('title') || ''

  const safeUrl = useMemo(() => isAllowedUrl(rawUrl), [rawUrl])
  const safeTitle = useMemo(() => {
    if (!rawTitle) return ''
    try { return decodeURIComponent(rawTitle) } catch { return '' }
  }, [rawTitle])

  if (!safeUrl) {
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
            href={safeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-gold-600 hover:text-gold-700 text-sm font-medium"
          >
            {t.blog.openInNote}
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <div className="rounded-2xl overflow-hidden border border-ink-200 bg-white shadow-lg">
          {safeTitle && (
            <div className="px-6 py-4 bg-ink-50 border-b border-ink-200">
              <h1 className="font-serif text-xl md:text-2xl font-semibold text-ink-900 line-clamp-2">
                {safeTitle}
              </h1>
            </div>
          )}
          <iframe
            src={safeUrl}
            title={safeTitle || 'Note 文章'}
            className="w-full border-0 block"
            style={{ height: 'calc(100vh - 280px)', minHeight: '600px' }}
            sandbox="allow-scripts allow-same-origin allow-popups"
            referrerPolicy="no-referrer"
          />
          <div className="px-6 py-3 text-ink-500 text-xs text-center border-t border-ink-100">
            {t.home.blogPageFallback}{' '}
            <a href={safeUrl} target="_blank" rel="noopener noreferrer" className="text-gold-600 hover:underline">
              {t.home.blogPageFallbackLink}
            </a>{' '}
            {t.home.blogPageFallbackEnd}
          </div>
        </div>
      </div>
    </section>
  )
}
