'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FileText, ExternalLink, Loader2, ArrowRight } from 'lucide-react'
import { useTranslations } from '@/lib/i18n/useTranslations'
import { useLocale } from '@/components/LocaleProvider'

type BlogPost = {
  title: string
  link: string
  pubDate: string
  contentSnippet?: string
  creator?: string
}

export function HomeBlogSection({ rssUrl }: { rssUrl?: string }) {
  const t = useTranslations()
  const { locale } = useLocale()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!rssUrl) {
      setLoading(false)
      return
    }
    fetch(`/api/blog?url=${encodeURIComponent(rssUrl)}`)
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

  const blogBaseUrl = rssUrl ? rssUrl.replace(/\/rss\/?$/, '') : 'https://note.com/flyingnets'

  return (
    <section id="blog" className="py-24 md:py-32 bg-white scroll-mt-20">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-gold-600/80 text-xs tracking-[0.3em] uppercase">{t.home.blogSub}</span>
          <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-light text-ink-900 mt-4 mb-4 tracking-tight">
            {t.home.blogTitle}
          </h2>
          <p className="text-ink-500 text-base max-w-xl mx-auto">{t.home.blogDesc}</p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
          </div>
        ) : error || posts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 px-6 bg-ink-50 rounded-2xl border border-ink-100"
          >
            <FileText className="w-12 h-12 text-ink-300 mx-auto mb-4" />
            <p className="text-ink-500 text-sm">{error ? t.home.blogLoadingError : t.home.blogEmpty}</p>
            {rssUrl && (
              <a
                href={blogBaseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 text-gold-600 hover:text-gold-700 text-sm font-medium"
              >
                {t.home.viewBlog} <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <motion.div
                key={post.link || i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={`/blog/post?url=${encodeURIComponent(post.link)}&title=${encodeURIComponent(post.title)}`}
                  title={t.home.readMore}
                  className="group block p-6 rounded-xl border border-ink-100 bg-ink-50/50 hover:border-gold-300 hover:bg-gold-500/5 transition-all duration-300"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="font-medium text-ink-900 group-hover:text-gold-600 line-clamp-2 transition-colors">
                      {post.title}
                    </h3>
                    <ArrowRight className="w-4 h-4 text-ink-400 group-hover:text-gold-500 shrink-0 mt-0.5" />
                  </div>
                  {post.contentSnippet && (
                    <p className="text-ink-500 text-sm line-clamp-2 mb-3">{post.contentSnippet}</p>
                  )}
                  <span className="text-xs text-ink-400">{formatDate(post.pubDate)}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {rssUrl && posts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-8 py-3.5 border border-ink-300 text-ink-700 hover:border-gold-500 hover:text-gold-600 hover:bg-gold-500/5 transition-all duration-300 text-sm font-medium rounded-lg"
            >
              {t.home.viewBlog} <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  )
}
