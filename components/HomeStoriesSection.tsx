'use client'

import Link from 'next/link'
import { SafeImage } from './SafeImage'
import { motion } from 'framer-motion'
import { ArrowRight, Quote } from 'lucide-react'
import type { SuccessStory } from '@/lib/content'
import { useTranslations } from '@/lib/i18n/useTranslations'
import { useLocalizedContent } from '@/lib/i18n/useLocalizedContent'

export function HomeStoriesSection({ stories }: { stories: SuccessStory[] }) {
  const t = useTranslations()
  const { content } = useLocalizedContent()
  const rawFeatured = stories[0]
  const featured = content
    ? { ...rawFeatured, ...content.success_stories[0], image_url: rawFeatured?.image_url }
    : rawFeatured
  if (!featured) return null

  const results = Array.isArray(featured.results) ? featured.results : (featured.results ? [featured.results] : [])

  return (
    <section className="py-24 md:py-32 bg-cream">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-gold-600/80 text-xs tracking-[0.3em] uppercase">{t.home.storiesSub}</span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-ink-900 mt-4 tracking-tight">
            {t.home.storiesTitle}
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl overflow-hidden border border-ink-100 shadow-lg"
        >
          <div className="flex flex-col lg:flex-row">
            {featured.image_url && (
              <div className="lg:w-2/5 shrink-0">
                <div className="relative aspect-[4/3] lg:aspect-auto lg:h-full min-h-[240px]">
                  <SafeImage src={featured.image_url} alt={featured.client_name} className="w-full h-full object-cover" />
                </div>
              </div>
            )}
            <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
              <Quote className="w-10 h-10 text-gold-500/30 mb-6" />
              <p className="text-ink-700 text-lg md:text-xl leading-relaxed mb-6 font-light">
                「{featured.solution}」
              </p>
              <div className="flex flex-wrap gap-3 mb-6">
                {results.map((r, j) => (
                  <span key={j} className="px-4 py-1.5 bg-gold-500/10 text-gold-700 text-sm font-medium rounded-full">
                    {r}
                  </span>
                ))}
              </div>
              <p className="text-ink-500 text-sm">
                — {featured.client_name} · {featured.service_type}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <Link href="/cases" className="inline-flex items-center gap-2 text-gold-600 hover:text-gold-700 text-sm font-medium tracking-wide transition-colors">
            {t.home.moreCases} <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
