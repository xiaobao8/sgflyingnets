'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useTranslations } from '@/lib/i18n/useTranslations'

export function HomeContactSection({ config }: { config: Record<string, string> }) {
  const t = useTranslations()
  return (
    <section className="py-24 md:py-32 bg-ink-950">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-cream tracking-tight mb-6">
            {t.home.contactTitle}
          </h2>
          <p className="text-ink-400/90 text-base md:text-lg max-w-2xl mx-auto mb-12">
            {config.tagline || 'AI · Security · Global'} — {t.home.contactSub}
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-10 py-4 border border-gold-500/70 text-gold-400 hover:bg-gold-500/15 hover:border-gold-400/80 transition-all duration-300 font-medium tracking-wide"
          >
            {t.home.contactUs} <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 pt-10 border-t border-ink-800/50 text-center"
        >
          <p className="text-ink-500 text-sm">
            {config.copyright || '© 2026 Flyingnets'}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
