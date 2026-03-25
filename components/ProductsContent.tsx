'use client'

import Link from 'next/link'
import { SafeImage } from './SafeImage'
import { ArrowRight } from 'lucide-react'
import { useTranslations } from '@/lib/i18n/useTranslations'
import { useLocalizedContent } from '@/lib/i18n/useLocalizedContent'

const PRODUCT_SLUGS = [
  { slug: 'all-soc', name: 'ALL-SOC' },
  { slug: 'synergy-ai', name: 'Synergy AI' },
  { slug: 'assa', name: 'ASSA' },
]

export function ProductsContent({
  products,
}: {
  products: {
    id: number
    name: string
    tagline: string
    description: string
    features: string[]
    image_url?: string
  }[]
}) {
  const t = useTranslations()
  const { content } = useLocalizedContent()
  const list = content ? products.map((p, i) => ({ ...p, ...content.products[i] })) : products

  return (
    <section className="py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          {PRODUCT_SLUGS.map(({ slug }, i) => {
            const p = list[i]
            if (!p) return null
            const features = Array.isArray(p.features) ? p.features : []
            return (
              <article
                key={slug}
                className="border border-ink-200 rounded-lg overflow-hidden hover:border-gold-500/30 hover:shadow-lg transition-all"
              >
                {p.image_url && (
                  <div className="aspect-[4/3] bg-white flex items-center justify-center p-6 min-h-[180px] border-b border-ink-100">
                    <SafeImage src={p.image_url} alt={p.name} className="w-full h-full max-h-[160px] md:max-h-[200px] max-w-full object-contain" />
                  </div>
                )}
                <div className="p-8">
                  <span className="text-ink-400 text-sm">0{i + 1}</span>
                  <h3 className="font-serif text-2xl font-bold text-ink-900 mt-2 mb-4">{p.name}</h3>
                  <p className="text-gold-600 font-medium mb-4">{p.tagline}</p>
                  <p className="text-ink-600 leading-relaxed mb-6 line-clamp-3">{p.description}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {features.slice(0, 4).map((f, j) => (
                      <span key={j} className="px-3 py-1 text-xs bg-ink-100 text-ink-700 rounded">
                        {f}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/products/${slug}`}
                    className="inline-flex items-center gap-2 text-gold-600 hover:text-gold-700 font-medium"
                  >
                    {t.common.learnMoreDetail} <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
