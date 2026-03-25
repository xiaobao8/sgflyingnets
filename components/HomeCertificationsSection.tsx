'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import type { Certification } from '@/lib/content'
import { useTranslations } from '@/lib/i18n/useTranslations'
import { useLocalizedContent } from '@/lib/i18n/useLocalizedContent'
import { SafeImage } from './SafeImage'

export function HomeCertificationsSection({ certifications }: { certifications: Certification[] }) {
  const t = useTranslations()
  const { content } = useLocalizedContent()
  const list = content
    ? certifications.map((c, i) => ({ ...c, name: content.certifications[i]?.name ?? c.name }))
    : certifications
  return (
    <section className="py-24 md:py-32 bg-ink-950">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-gold-400/80 text-xs tracking-[0.3em] uppercase">{t.home.certSub}</span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-cream mt-4 tracking-tight">
            {t.home.certTitle}
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8"
        >
          {list.map((c, i) => (
            <motion.div
              key={c.id ?? i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="text-center py-8 px-6 rounded-2xl border border-ink-700/40 hover:border-gold-500/40 transition-all duration-300 bg-ink-900/40 hover:bg-ink-900/60"
            >
              {c.image_url && (
                <div className={`flex items-center justify-center mb-5 px-5 py-4 bg-white/95 rounded-xl ${
                  c.id === 2 || c.name?.includes('AWS') ? 'min-h-[72px]' : 'h-16'
                }`}>
                  <SafeImage
                    src={c.image_url}
                    alt={c.name}
                    className={`object-contain ${
                      c.id === 2 || c.name?.includes('AWS')
                        ? 'max-h-12 max-w-[110px] w-full h-full'
                        : 'max-h-11 max-w-[130px] w-full'
                    }`}
                  />
                </div>
              )}
              <h3 className="font-serif text-base font-medium text-cream">{c.name}</h3>
              {c.badge_text && (
                <span className="inline-block mt-2 text-xs text-gold-400/90">
                  {c.id === 1 || c.id === 2 ? t.cert.badgeChina3 : c.id === 3 ? t.cert.badgeMSPWA : t.cert.badgeChina2}
                </span>
              )}
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <Link href="/certifications" className="inline-flex items-center gap-2 text-gold-400/90 hover:text-gold-400 text-sm font-medium tracking-wide transition-colors">
            {t.home.viewAll} <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
