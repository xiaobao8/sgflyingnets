'use client'

import Link from 'next/link'
import { SafeImage } from './SafeImage'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import type { Product } from '@/lib/content'
import { useTranslations } from '@/lib/i18n/useTranslations'
import { useLocalizedContent } from '@/lib/i18n/useLocalizedContent'

const PRODUCT_SLUGS = ['all-soc', 'synergy-ai', 'assa']

export function HomeProductsSection({ products }: { products: Product[] }) {
  const t = useTranslations()
  const { content } = useLocalizedContent()
  const list = content ? content.products : products
  return (
    <section className="py-24 md:py-32 bg-ink-50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-gold-600/80 text-xs tracking-[0.3em] uppercase">{t.home.productsSub}</span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-ink-900 mt-4 tracking-tight">
            {t.home.productsTitle}
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
          {list.slice(0, 3).map((p, i) => {
            const rawProduct = products[i]
            const imgUrl = rawProduct?.image_url || (p as { image_url?: string }).image_url
            return (
            <motion.div
              key={rawProduct?.id ?? i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                href={`/products/${PRODUCT_SLUGS[i] || 'products'}`}
                className="group block bg-white rounded-2xl overflow-hidden border border-ink-100 hover:border-gold-500/30 hover:shadow-xl transition-all duration-300"
              >
                {imgUrl && (
                  <div className="aspect-[4/3] bg-white flex items-center justify-center p-8 min-h-[160px]">
                    <SafeImage src={imgUrl} alt={p.name} className="w-full h-full max-h-[140px] md:max-h-[180px] object-contain" />
                  </div>
                )}
                <div className="p-8">
                  <span className="text-ink-400 text-xs">0{i + 1}</span>
                  <h3 className="font-serif text-xl font-semibold text-ink-900 mt-2 mb-2">{p.name}</h3>
                  <p className="text-ink-500 text-sm mb-6">{p.tagline}</p>
                  <span className="inline-flex items-center gap-1 text-gold-600 text-sm font-medium group-hover:gap-2 transition-all">
                    {t.home.learnMore} <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            </motion.div>
          )})}
        </div>
      </div>
    </section>
  )
}
