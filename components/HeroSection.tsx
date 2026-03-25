'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import type { HeroSection as HeroType } from '@/lib/content'
import { useLocalizedContent } from '@/lib/i18n/useLocalizedContent'

export function HeroSection({
  hero,
  stats,
  config,
}: {
  hero: HeroType | null
  stats: { id?: number; label: string; value: string; suffix?: string }[]
  config: Record<string, string>
}) {
  const { content } = useLocalizedContent()
  const raw = hero || {
    title: 'FLYINGNETS',
    subtitle: 'Singapore · Global',
    tagline: '以 AI 提升企业效能，以安全保护企业信息',
    cta_text: '探索我们的能力',
    cta_link: '/services',
  }
  const h = content
    ? { ...raw, tagline: content.hero.tagline, cta_text: content.hero.cta_text }
    : raw

  const bgImage = hero?.background_image

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      <div className="absolute inset-0 bg-ink-950" />
      {bgImage && (
        <div className="absolute inset-0">
          <img src={bgImage} alt="" className="w-full h-full object-cover object-center scale-105" />
          <div className="absolute inset-0 bg-ink-950/75" />
          <div className="absolute inset-0 bg-gradient-to-b from-ink-950/90 via-ink-950/50 to-ink-950/95" />
        </div>
      )}

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-28 md:py-36 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-gold-400/95 text-[11px] md:text-xs tracking-[0.35em] uppercase mb-6 font-medium"
        >
          {config.tagline || 'AI · Security · Global'}
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold text-cream tracking-tight mb-2"
        >
          {h.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-serif text-lg md:text-xl lg:text-2xl text-ink-400/90 tracking-wide mb-10"
        >
          {h.subtitle}
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="text-ink-400/85 text-base md:text-lg max-w-2xl mx-auto mb-14 font-light leading-relaxed"
        >
          {h.tagline}
        </motion.p>

        {h.cta_text && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
          >
            <Link
              href={h.cta_link || '/services'}
              className="inline-flex items-center gap-2 px-8 py-3.5 border border-gold-500/70 text-gold-400 hover:bg-gold-500/15 hover:border-gold-400/80 transition-all duration-300 font-medium tracking-wide text-sm"
            >
              {h.cta_text}
              <span className="opacity-70">→</span>
            </Link>
          </motion.div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <Link href="#trust" className="block text-ink-500/60 hover:text-gold-400/80 transition-colors">
          <span className="block w-px h-10 mx-auto bg-gradient-to-b from-ink-500/60 to-transparent" />
        </Link>
      </motion.div>
    </section>
  )
}
