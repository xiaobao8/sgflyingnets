'use client'

import Link from 'next/link'
import { SafeImage } from './SafeImage'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle2, BarChart3, Users, Layers, ArrowRight } from 'lucide-react'
import { useTranslations } from '@/lib/i18n/useTranslations'
import { useLocalizedContent } from '@/lib/i18n/useLocalizedContent'

const SLUG_TO_IDX: Record<string, number> = { cloud: 0, security: 1, ai: 2, microsoft: 3 }

export function ServiceDetailContent({
  service,
  slug,
}: {
  service: {
    title: string
    subtitle: string
    description: string
    features: string[]
    image_url?: string
    detail_sections?: { title: string; content: string }[]
  }
  slug: string
}) {
  const t = useTranslations()
  const { content } = useLocalizedContent()
  const idx = SLUG_TO_IDX[slug] ?? 0
  const localized = content?.services[idx]
  const s = localized
    ? { ...service, title: localized.title, subtitle: localized.subtitle, description: localized.description, features: localized.features, detail_sections: localized.detail_sections }
    : service
  const features = Array.isArray(s.features) ? s.features : []
  const stats = t.serviceDetail.stats[slug as 'cloud' | 'security' | 'ai' | 'microsoft'] || []
  const cases = t.serviceDetail.cases[slug as 'cloud' | 'security' | 'ai' | 'microsoft'] || []
  const detailSections = s.detail_sections || []

  return (
    <section className="py-16 md:py-24 bg-cream">
      <div className="max-w-6xl mx-auto px-6">
        <Link href="/services" className="inline-flex items-center gap-2 text-ink-600 hover:text-gold-600 mb-12 font-medium transition-colors">
          <ArrowLeft size={18} /> {t.common.backServices}
        </Link>

        {/* Hero */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 mb-20">
          {s.image_url && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-2xl overflow-hidden shadow-xl aspect-[4/3] min-h-[280px] bg-ink-50"
            >
              <SafeImage src={s.image_url} alt={s.title} className="w-full h-full object-cover" />
            </motion.div>
          )}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-ink-900 mb-3">{s.title}</h1>
            <p className="text-gold-600 font-semibold text-lg mb-6">{s.subtitle}</p>
            <p className="text-lg text-ink-600 leading-relaxed">{s.description}</p>
          </motion.div>
        </div>

        {/* Stats */}
        {stats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6 mb-20"
          >
            {stats.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 border border-ink-100 shadow-sm text-center hover:border-gold-500/30 hover:shadow-md transition-all">
                <BarChart3 className="w-10 h-10 text-gold-600 mx-auto mb-4" />
                <div className="font-serif text-3xl font-bold text-ink-900 mb-2">{s.value}</div>
                <div className="text-ink-600 font-medium">{s.label}</div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Detail sections */}
        {detailSections.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <h2 className="font-serif text-2xl font-bold text-ink-900 mb-10 flex items-center gap-2">
              <Layers className="w-7 h-7 text-gold-600" />
              {t.common.serviceDetailTitle}
            </h2>
            <div className="space-y-12">
              {detailSections.map((sec, i) => {
                const secWithImage = sec as { title: string; content: string; image_url?: string }
                const hasImage = !!secWithImage.image_url
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className={`bg-white rounded-2xl border border-ink-100 shadow-sm hover:shadow-lg hover:border-gold-500/20 transition-all duration-300 overflow-hidden ${hasImage ? '' : 'p-8 md:p-10'}`}
                  >
                    {hasImage ? (
                      <div className="grid md:grid-cols-2 gap-0">
                        <div className={`relative aspect-[4/3] md:aspect-auto md:min-h-[280px] bg-ink-50 flex items-center justify-center p-8 ${i % 2 === 1 ? 'md:order-2' : 'md:order-1'}`}>
                          <SafeImage
                            src={secWithImage.image_url!}
                            alt={secWithImage.title}
                            className="w-full h-full object-contain max-h-[200px] md:max-h-[240px]"
                          />
                        </div>
                        <div className={`p-8 md:p-10 flex flex-col justify-center ${i % 2 === 1 ? 'md:order-1' : 'md:order-2'}`}>
                          <h3 className="font-serif text-xl font-semibold text-ink-900 mb-4">{secWithImage.title}</h3>
                          <p className="text-ink-600 leading-relaxed">{secWithImage.content}</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="font-serif text-xl font-semibold text-ink-900 mb-4">{secWithImage.title}</h3>
                        <p className="text-ink-600 leading-relaxed">{secWithImage.content}</p>
                      </>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        )}

        {/* Core capabilities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="font-serif text-2xl font-bold text-ink-900 mb-8">{t.common.coreCapabilities}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="flex items-start gap-4 bg-white rounded-xl p-6 border border-ink-100 hover:border-gold-500/30 transition-colors">
                <CheckCircle2 className="w-6 h-6 text-gold-600 flex-shrink-0 mt-0.5" />
                <span className="text-ink-700 font-medium">{f}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Typical clients */}
        {cases.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <h2 className="font-serif text-2xl font-bold text-ink-900 mb-8">{t.common.typicalClients}</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {cases.map((c, i) => (
                <div key={i} className="bg-white rounded-2xl p-8 border border-ink-100 shadow-sm hover:border-gold-500/30 transition-colors">
                  <Users className="w-10 h-10 text-gold-500/60 mb-4" />
                  <h4 className="font-serif text-xl font-bold text-ink-900 mb-2">{c.title}</h4>
                  <p className="text-ink-600 mb-4">{c.desc}</p>
                  <span className="inline-block px-4 py-2 bg-gold-500/10 text-gold-700 font-medium rounded-lg">{c.result}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* CTA */}
        <div className="flex flex-wrap gap-4">
          <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-ink-900 text-cream rounded-xl hover:bg-ink-800 font-medium transition-colors">
            {t.common.consultCoop} <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/products" className="inline-flex items-center gap-2 px-8 py-4 border border-ink-300 rounded-xl hover:border-gold-500 text-ink-700 font-medium transition-colors">
            {t.common.learnProducts}
          </Link>
        </div>
      </div>
    </section>
  )
}
