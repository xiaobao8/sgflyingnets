'use client'

import { SafeImage } from './SafeImage'
import { useTranslations } from '@/lib/i18n/useTranslations'
import { useLocalizedContent } from '@/lib/i18n/useLocalizedContent'
import { Award, Shield, Building2 } from 'lucide-react'

export function CertificationsContent({
  certs,
}: {
  certs: { id: number; name: string; description: string; badge_text?: string; image_url?: string; logo_url?: string }[]
}) {
  const t = useTranslations()
  const { content } = useLocalizedContent()
  const list = content ? certs.map((c, i) => ({ ...c, name: content.certifications[i]?.name ?? c.name, description: content.certifications[i]?.description ?? c.description })) : certs
  const getBadgeText = (c: { id?: number }) =>
    c.id === 1 || c.id === 2 ? t.cert.badgeChina3 : c.id === 3 ? t.cert.badgeMSPWA : t.cert.badgeChina2

  return (
    <section className="py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <p className="text-lg text-ink-600 leading-relaxed">
            {t.pages.cert.brandIntro}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {list.map((c) => (
            <article
              key={c.id}
              className="group border border-ink-200 rounded-2xl overflow-hidden bg-white hover:border-gold-500/40 hover:shadow-xl transition-all duration-300"
            >
              {(c.image_url || c.logo_url) ? (
                <div className={`overflow-hidden bg-white flex items-center justify-center px-6 py-6 ${
                  c.id === 2 || c.name?.includes('AWS') ? 'min-h-[100px] md:min-h-[120px]' : 'h-24 md:h-28'
                }`}>
                  <SafeImage
                    src={c.image_url || c.logo_url || ''}
                    alt={c.name}
                    className={`object-contain group-hover:scale-105 transition-transform duration-500 ${
                      c.id === 2 || c.name?.includes('AWS')
                        ? 'max-h-16 md:max-h-20 max-w-[140px] w-full h-full'
                        : 'max-h-20 md:max-h-24 max-w-full w-full'
                    }`}
                  />
                </div>
              ) : (
                <div className="h-24 md:h-28 bg-ink-50 flex items-center justify-center">
                  <Award className="w-16 h-16 text-gold-500/60" />
                </div>
              )}
              <div className="p-8">
                {c.badge_text && (
                  <span className="inline-block px-4 py-1.5 text-sm bg-gold-500/20 text-gold-700 border border-gold-500/30 rounded-full mb-4 font-medium">
                    {getBadgeText(c)}
                  </span>
                )}
                <h3 className="font-serif text-xl font-bold text-ink-900 mb-3">{c.name}</h3>
                <p className="text-ink-600 leading-relaxed text-sm">{c.description}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mb-12 p-10 bg-white rounded-2xl border border-ink-200 shadow-sm">
          <h3 className="font-serif text-2xl font-bold text-ink-900 mb-6 flex items-center gap-2">
            <Shield className="w-8 h-8 text-gold-500" />
            {t.pages.cert.managementSystem}
          </h3>
          <p className="text-ink-600 mb-4">{t.pages.cert.managementDesc}</p>
          <div className="flex flex-wrap gap-4">
            <span className="px-6 py-3 bg-ink-50 border border-ink-200 rounded-xl font-medium text-ink-800">{t.pages.cert.iso20000}</span>
            <span className="px-6 py-3 bg-ink-50 border border-ink-200 rounded-xl font-medium text-ink-800">{t.pages.cert.iso27001}</span>
          </div>
        </div>

        <div className="mb-20 p-10 bg-white rounded-2xl border border-ink-200 shadow-sm">
          <h3 className="font-serif text-2xl font-bold text-ink-900 mb-6 flex items-center gap-2">
            <Building2 className="w-8 h-8 text-gold-500" />
            {t.pages.cert.companyStrengths}
          </h3>
          <p className="text-ink-600 mb-6">{t.pages.cert.companyStrengthsDesc}</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...(t.pages.cert.strengthItems ?? [])].map((item, i) => (
              <span key={i} className="px-5 py-3 bg-ink-50 border border-ink-200 rounded-xl font-medium text-ink-800 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-500 flex-shrink-0" />
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="p-12 bg-gradient-to-br from-ink-900 to-ink-800 rounded-2xl text-center text-cream">
          <h3 className="font-serif text-2xl font-bold mb-4">{t.pages.cert.qualityPromise}</h3>
          <p className="text-ink-300 max-w-2xl mx-auto">
            {t.pages.cert.qualityDesc}
          </p>
        </div>
      </div>
    </section>
  )
}
