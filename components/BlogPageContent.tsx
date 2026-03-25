'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ExternalLink, Loader2, FileText, ArrowRight } from 'lucide-react'
import { useTranslations } from '@/lib/i18n/useTranslations'
import { useLocale } from '@/components/LocaleProvider'

type BlogPost = {
  title: string
  link: string
  pubDate: string
  contentSnippet?: string
}

export function BlogPageContent({ rssUrl, noteBaseUrl }: { rssUrl: string; noteBaseUrl: string }) {
  const t = useTranslations()
  const { locale } = useLocale()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/blog?url=${encodeURIComponent(rssUrl)}&limit=25`)
      .then((res) => res.json())
      .then((data) => {
        if (data.posts) setPosts(data.posts)
        if (data.error) setError(data.error)
      })
      .catch(() => setError('error'))
      .finally(() => setLoading(false))
  }, [rssUrl])

  const localeMap = { zh: 'zh-CN', en: 'en-US', ja: 'ja-JP' } as const
  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString(localeMap[locale] || 'en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    } catch {
      return dateStr
    }
  }

  return (
    <section className="py-12 md:py-16 bg-cream">
      <div className="max-w-7xl mx-auto px-6">
        {/* 文章列表 */}
        {!loading && !error && posts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <h2 className="font-serif text-xl font-semibold text-ink-900 mb-6">{t.home.blogTitle}</h2>
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {posts.map((post, i) => (
                <Link
                  key={post.link || i}
                  href={`/blog/post?url=${encodeURIComponent(post.link)}&title=${encodeURIComponent(post.title)}`}
                  className="group block p-5 rounded-xl border border-ink-100 bg-white hover:border-gold-300 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-medium text-ink-900 group-hover:text-gold-600 line-clamp-2">{post.title}</h3>
                    <ArrowRight className="w-4 h-4 text-ink-400 group-hover:text-gold-500 shrink-0 mt-0.5" />
                  </div>
                  {post.contentSnippet && (
                    <p className="text-ink-500 text-sm line-clamp-2 mt-2">{post.contentSnippet}</p>
                  )}
                  <span className="text-xs text-ink-400 mt-3 block">{formatDate(post.pubDate)}</span>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
          </div>
        )}

        {error && posts.length === 0 && (
          <div className="text-center py-12 px-6 bg-ink-50 rounded-2xl border border-ink-100 mb-12">
            <FileText className="w-12 h-12 text-ink-300 mx-auto mb-4" />
            <p className="text-ink-500 text-sm">{t.home.blogLoadingError}</p>
          </div>
        )}

        {/* Note 网站完整嵌入 */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl overflow-hidden border border-ink-200 bg-white shadow-lg"
        >
          <div className="flex items-center justify-between px-6 py-4 bg-ink-50 border-b border-ink-200">
            <span className="text-sm font-medium text-ink-700">note.com — FLYINGNETS株式会社</span>
            <a
              href={noteBaseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-gold-600 hover:text-gold-700 text-sm font-medium"
            >
              {t.home.viewBlog} <ExternalLink className="w-4 h-4" />
            </a>
          </div>
          <iframe
              src={noteBaseUrl}
              title="Flyingnets on note.com"
              className="w-full border-0 block"
              style={{ height: 'calc(100vh - 320px)', minHeight: '600px' }}
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            />
          <div className="px-6 py-3 text-ink-500 text-xs text-center border-t border-ink-100">
            {t.home.blogPageFallback}{' '}
            <a href={noteBaseUrl} target="_blank" rel="noopener noreferrer" className="text-gold-600 hover:underline">
              {t.home.blogPageFallbackLink}
            </a>{' '}
            {t.home.blogPageFallbackEnd}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
