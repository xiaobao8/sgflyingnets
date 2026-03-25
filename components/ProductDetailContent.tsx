'use client'

import Link from 'next/link'
import { SafeImage } from './SafeImage'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle2, Zap, Shield, Layers, ArrowRight } from 'lucide-react'
import { useTranslations } from '@/lib/i18n/useTranslations'
import { useLocalizedContent } from '@/lib/i18n/useLocalizedContent'

const SLUG_ORDER = ['all-soc', 'synergy-ai', 'assa']

export function ProductDetailContent({
  product,
  imgUrl,
  slug,
}: {
  product: {
    name: string
    tagline: string
    description: string
    features: string[]
    highlights: string[]
    detail_sections?: { title: string; content: string }[]
  }
  imgUrl: string
  slug?: string
}) {
  const t = useTranslations()
  const { content } = useLocalizedContent()
  const idx = slug ? SLUG_ORDER.indexOf(slug) : (product.name.includes('ALL-SOC') ? 0 : product.name.includes('Synergy') ? 1 : 2)
  const localized = content?.products[idx]
  const p = localized
    ? { ...product, name: localized.name, tagline: localized.tagline, description: localized.description, features: localized.features, highlights: localized.highlights, detail_sections: localized.detail_sections }
    : product
  const features = Array.isArray(p.features) ? p.features : []
  const highlights = Array.isArray(p.highlights) ? p.highlights : []
  const detailSections = p.detail_sections || []

  const scenarioText =
    p.name === 'ALL-SOC Platform' || idx === 0
      ? t.productDetail.scenarioAllSoc
      : p.name === 'Synergy AI Platform' || idx === 1
        ? t.productDetail.scenarioSynergy
        : t.productDetail.scenarioAssa

  return (
    <section className="py-16 md:py-24 bg-cream">
      <div className="max-w-6xl mx-auto px-6">
        <Link href="/products" className="inline-flex items-center gap-2 text-ink-600 hover:text-gold-600 mb-12 font-medium transition-colors">
          <ArrowLeft size={18} /> {t.common.backProducts}
        </Link>

        {/* Hero */}
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 mb-20">
          {imgUrl && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-2xl overflow-hidden shadow-xl aspect-[4/3] min-h-[280px] bg-white flex items-center justify-center p-8 border border-ink-100"
            >
              <SafeImage src={imgUrl} alt={p.name} className="w-full h-full max-h-[220px] md:max-h-[280px] max-w-full object-contain" />
            </motion.div>
          )}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-ink-900 mb-3">{p.name}</h1>
            <p className="text-gold-600 font-semibold text-lg mb-6">{p.tagline}</p>
            <p className="text-lg text-ink-600 leading-relaxed">{p.description}</p>
          </motion.div>
        </div>

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
              {t.common.productDetailTitle}
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
                        <div className={`relative aspect-video md:aspect-auto md:min-h-[280px] bg-ink-100 flex items-center justify-center overflow-hidden ${i % 2 === 1 ? 'md:order-2' : 'md:order-1'}`}>
                          <SafeImage
                            src={secWithImage.image_url!}
                            alt={secWithImage.title}
                            className="w-full h-full object-cover"
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
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <div key={i} className="flex items-start gap-4 bg-white rounded-xl p-6 border border-ink-100 hover:border-gold-500/30 transition-colors">
                <CheckCircle2 className="w-6 h-6 text-gold-600 flex-shrink-0 mt-0.5" />
                <span className="text-ink-700 font-medium">{f}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* AI highlights */}
        {highlights.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <h2 className="font-serif text-2xl font-bold text-ink-900 mb-8 flex items-center gap-2">
              <Zap className="w-8 h-8 text-gold-500" />
              {t.common.aiHighlights}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {highlights.map((h, i) => (
                <div key={i} className="px-6 py-5 bg-gold-500/10 border border-gold-500/20 rounded-xl hover:border-gold-500/40 transition-colors">
                  <span className="text-gold-800 font-semibold">{h}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Applicable scenarios */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20 p-10 bg-white rounded-2xl border border-ink-100 shadow-sm"
        >
          <h2 className="font-serif text-2xl font-bold text-ink-900 mb-8 flex items-center gap-2">
            <Shield className="w-8 h-8 text-gold-500" />
            {t.common.applicableScenarios}
          </h2>
          <p className="text-ink-600 leading-relaxed text-lg">{scenarioText}</p>
        </motion.div>

        {/* CTA */}
        <div className="flex flex-wrap gap-4">
          <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-ink-900 text-cream rounded-xl hover:bg-ink-800 font-medium transition-colors">
            {t.common.consultCoop} <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/partnership" className="inline-flex items-center gap-2 px-8 py-4 border border-gold-500 text-gold-600 rounded-xl hover:bg-gold-500/10 font-medium transition-colors">
            {t.common.becomePartner}
          </Link>
        </div>
      </div>
    </section>
  )
}
