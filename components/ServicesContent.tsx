'use client'

import Link from 'next/link'
import { SafeImage } from './SafeImage'
import { Cloud, Shield, Bot, Building2, ArrowRight } from 'lucide-react'
import { useTranslations } from '@/lib/i18n/useTranslations'
import { useLocalizedContent } from '@/lib/i18n/useLocalizedContent'

const SLUG_MAP: Record<string, string> = {
  '云服务': 'cloud',
  '安全服务': 'security',
  '企业AI化服务': 'ai',
  '企业 AI 化服务': 'ai',
  'Cloud Service': 'cloud',
  'Cloud Services': 'cloud',
  'Security Service': 'security',
  'Security Services': 'security',
  'Enterprise AI': 'ai',
  'Enterprise AI Services': 'ai',
  'Microsoft Services': 'microsoft',
  'Microsoft服务': 'microsoft',
  'クラウドサービス': 'cloud',
  'セキュリティサービス': 'security',
  '企業AIサービス': 'ai',
  'Microsoftサービス': 'microsoft',
}

const icons: Record<string, typeof Cloud> = {
  cloud: Cloud,
  shield: Shield,
  settings: Bot,
  building2: Building2,
}

export function ServicesContent({
  services,
}: {
  services: {
    id: number
    title: string
    subtitle: string
    description: string
    features: string[]
    icon: string
    image_url?: string
  }[]
}) {
  const t = useTranslations()
  const { content } = useLocalizedContent()
  const merged = services.map((s, i) => ({ ...s, ...(content?.services[i] || {}) }))
  const list = merged.filter((s) => (s as { visible?: boolean }).visible !== false)

  return (
    <section className="py-20 md:py-28 bg-cream">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12">
          {list.map((s) => {
            const slug = SLUG_MAP[s.title] || 'cloud'
            const Icon = icons[s.icon || 'cloud'] || Cloud
            const features = Array.isArray(s.features) ? s.features : []
            return (
              <article
                key={s.id}
                className="group border border-ink-100 rounded-2xl overflow-hidden hover:border-gold-500/30 hover:shadow-xl transition-all duration-300 bg-white"
              >
                {s.image_url && (
                  <div className="aspect-[4/3] overflow-hidden flex items-center justify-center bg-ink-50">
                    <SafeImage
                      src={s.image_url}
                      alt={s.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-8">
                  <Icon className="w-14 h-14 text-gold-600 mb-6" />
                  <h3 className="font-serif text-2xl font-bold text-ink-900 mb-2">{s.title}</h3>
                  <p className="text-gold-600 font-medium mb-4">{s.subtitle}</p>
                  <p className="text-ink-600 leading-relaxed mb-6">{s.description}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {features.slice(0, 5).map((f, j) => (
                      <span key={j} className="px-3 py-1 text-xs bg-ink-100 text-ink-700 rounded">
                        {f}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/services/${slug}`}
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
