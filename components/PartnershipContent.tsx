'use client'

import { PartnershipForm } from './PartnershipForm'
import { SafeImage } from './SafeImage'
import { Globe, Package, Shield, Zap } from 'lucide-react'
import { useTranslations } from '@/lib/i18n/useTranslations'
import { useLocalizedContent } from '@/lib/i18n/useLocalizedContent'

export function PartnershipContent({
  products,
}: {
  products: { id: number; name: string; tagline: string; description: string; image_url?: string; sort_order?: number }[]
}) {
  const t = useTranslations()
  const { content } = useLocalizedContent()
  const productsList = content ? products.map((p, i) => ({ ...p, ...content.products[i] })) : products

  return (
    <section className="py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="font-serif text-3xl font-bold text-ink-900 mb-6">{t.pages.partnership.recruitTitle}</h2>
          <p className="text-lg text-ink-600 leading-relaxed">
            {t.pages.partnership.recruitDesc}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {productsList.map((p) => (
            <article
              key={p.id}
              className="border border-ink-200 rounded-2xl overflow-hidden bg-white hover:border-gold-500/40 hover:shadow-xl transition-all"
            >
              {p.image_url && (
                <div className="aspect-video overflow-hidden">
                  <SafeImage src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-8">
                <Package className="w-10 h-10 text-gold-600 mb-4" />
                <h3 className="font-serif text-xl font-bold text-ink-900 mb-2">{p.name}</h3>
                <p className="text-gold-600 font-medium text-sm mb-4">{p.tagline}</p>
                <p className="text-ink-600 text-sm line-clamp-3">{p.description}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          <div className="p-8 bg-white border border-ink-200 rounded-2xl">
            <Globe className="w-12 h-12 text-gold-600 mb-6" />
            <h3 className="font-serif text-xl font-bold text-ink-900 mb-4">{t.pages.partnership.distributor}</h3>
            <p className="text-ink-600 mb-4">{t.pages.partnership.distributorDesc}</p>
            <ul className="text-ink-600 text-sm space-y-2">
              {t.pages.partnership.distributorItems.map((item, i) => (
                <li key={i}>• {item}</li>
              ))}
            </ul>
          </div>
          <div className="p-8 bg-white border border-ink-200 rounded-2xl">
            <Shield className="w-12 h-12 text-gold-600 mb-6" />
            <h3 className="font-serif text-xl font-bold text-ink-900 mb-4">{t.pages.partnership.msp}</h3>
            <p className="text-ink-600 mb-4">{t.pages.partnership.mspDesc}</p>
            <ul className="text-ink-600 text-sm space-y-2">
              {t.pages.partnership.mspItems.map((item, i) => (
                <li key={i}>• {item}</li>
              ))}
            </ul>
          </div>
          <div className="p-8 bg-white border border-ink-200 rounded-2xl">
            <Zap className="w-12 h-12 text-gold-600 mb-6" />
            <h3 className="font-serif text-xl font-bold text-ink-900 mb-4">{t.pages.partnership.oem}</h3>
            <p className="text-ink-600 mb-4">{t.pages.partnership.oemDesc}</p>
            <ul className="text-ink-600 text-sm space-y-2">
              {t.pages.partnership.oemItems.map((item, i) => (
                <li key={i}>• {item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-ink-50 rounded-2xl p-10 md:p-16 border border-ink-200">
          <h2 className="font-serif text-3xl font-bold text-ink-900 text-center mb-4">{t.pages.partnership.formTitle}</h2>
          <p className="text-center text-ink-600 mb-12 max-w-2xl mx-auto">
            {t.pages.partnership.formDesc}
          </p>
          <PartnershipForm products={productsList} />
        </div>
      </div>
    </section>
  )
}
