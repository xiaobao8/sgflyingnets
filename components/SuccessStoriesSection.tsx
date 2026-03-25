'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Quote, ArrowRight } from 'lucide-react'
import type { SuccessStory } from '@/lib/content'

export function SuccessStoriesSection({ stories }: { stories: SuccessStory[] }) {
  return (
    <section id="stories" className="py-24 md:py-32 bg-cream">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-gold-600 text-sm tracking-[0.2em] uppercase">
            Success Stories
          </span>
          <h2 className="font-serif text-4xl md:text-6xl font-bold text-ink-900 mt-4">
            客户成功案例
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {stories.map((s, i) => {
            const results = Array.isArray(s.results) ? s.results : (s.results ? [s.results] : [])
            return (
              <motion.article
                key={s.id ?? i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative bg-ink-50 border border-ink-200 p-8 hover:border-gold-500/30 transition-colors"
              >
                <Quote className="absolute top-6 right-6 w-12 h-12 text-gold-400/20" />
                <span className="text-gold-600 text-sm font-medium">{s.service_type}</span>
                <h3 className="font-serif text-2xl font-bold text-ink-900 mt-2 mb-4">
                  {s.client_name}
                </h3>
                <p className="text-ink-600 text-sm mb-4">{s.industry}</p>
                <p className="text-ink-600 text-sm mb-4">{s.requirements}</p>
                <p className="text-ink-700 text-sm mb-6">{s.solution}</p>
                <div className="flex flex-wrap gap-2">
                  {results.map((r, j) => (
                    <span
                      key={j}
                      className="px-4 py-2 bg-gold-500/10 text-gold-700 font-medium text-sm"
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </motion.article>
            )
          })}
        </div>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-12 text-center">
          <Link href="/cases" className="inline-flex items-center gap-2 text-gold-600 hover:text-gold-700 font-medium">
            了解更多 <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
