'use client'

import { SafeImage } from './SafeImage'
import { Quote, TrendingUp } from 'lucide-react'
import { useTranslations } from '@/lib/i18n/useTranslations'
import { useLocalizedContent } from '@/lib/i18n/useLocalizedContent'

export function CasesContent({
  stories,
}: {
  stories: {
    id: number
    client_name: string
    industry: string
    service_type: string
    requirements: string
    solution: string
    results: string[] | string
    image_url?: string
  }[]
}) {
  const t = useTranslations()
  const { content } = useLocalizedContent()
  const list = content ? stories.map((s, i) => ({ ...s, ...content.success_stories[i], image_url: s.image_url })) : stories

  return (
    <section className="py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-lg text-ink-600">
            {t.pages.cases.intro}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {list.map((s, i) => {
            const results: string[] = Array.isArray(s.results) ? s.results : (typeof s.results === 'string' ? [s.results] : [])
            return (
              <article
                key={s.id ?? i}
                className="group border border-ink-200 rounded-2xl overflow-hidden bg-white hover:border-gold-500/40 hover:shadow-xl transition-all duration-300"
              >
                {s.image_url && (
                  <div className="aspect-video overflow-hidden">
                    <SafeImage
                      src={s.image_url}
                      alt={s.client_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-8">
                  <Quote className="w-10 h-10 text-gold-400/60 mb-4" />
                  <span className="text-gold-600 text-sm font-medium">{s.service_type}</span>
                  <h3 className="font-serif text-xl font-bold text-ink-900 mt-2 mb-2">{s.client_name}</h3>
                  <p className="text-ink-500 text-sm mb-4">{s.industry}</p>
                  <p className="text-ink-600 text-sm mb-4 line-clamp-2">{s.requirements}</p>
                  <p className="text-ink-700 text-sm mb-6 line-clamp-2">{s.solution}</p>
                  <div className="flex flex-wrap gap-2">
                    {results.map((r, j) => (
                      <span key={j} className="inline-flex items-center gap-1 px-4 py-2 bg-gold-500/10 text-gold-700 font-medium text-sm rounded-lg">
                        <TrendingUp size={14} />
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
