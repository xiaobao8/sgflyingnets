'use client'

import { motion } from 'framer-motion'
import { ContactForm } from './ContactForm'
import { SafeImage } from './SafeImage'
import { Phone, Mail, Globe, MapPin, Building2 } from 'lucide-react'
import { useTranslations } from '@/lib/i18n/useTranslations'
import { useLocalizedContent } from '@/lib/i18n/useLocalizedContent'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  phone: Phone,
  email: Mail,
  website: Globe,
}

export function ContactContent({
  about,
  offices,
  contactInfo,
  products,
}: {
  about: { title: string; content: string; image_url?: string } | undefined
  offices: { id: number; city: string; country: string; is_24_7: number }[]
  contactInfo: { id: number; type: string; label: string; value: string }[]
  products: { id: number; name: string; sort_order: number }[]
}) {
  const t = useTranslations()
  const { content } = useLocalizedContent()
  const aboutData = content ? { ...about, title: content.about.title, content: content.about.content } : about
  const officesData = content ? offices.map((o, i) => ({ ...o, ...content.offices[i] })) : offices
  const contactInfoData = content ? contactInfo.map((c, i) => ({ ...c, label: content.contact_info[i]?.label ?? c.label })) : contactInfo
  const stats = [
    { label: t.pages.contact.stats.years, value: '15+', unit: t.pages.contact.units.year },
    { label: t.pages.contact.stats.offices, value: '7', unit: t.pages.contact.units.count },
    { label: t.pages.contact.stats.team, value: '130+', unit: t.pages.contact.units.people },
    { label: t.pages.contact.stats.clients, value: '500+', unit: t.pages.contact.units.company },
  ]

  return (
    <section className="py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-6">
        <div id="about" className="grid md:grid-cols-2 gap-16 items-center mb-24">
          <div>
            <h2 className="font-serif text-3xl font-bold text-ink-900 mb-8">{aboutData?.title}</h2>
            <div className="space-y-6 text-ink-600 text-lg leading-relaxed">
              {(aboutData?.content || '').split('\n\n').map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((item, i) => (
                <div key={i} className="border-l-2 border-gold-500/50 pl-4">
                  <div className="font-serif text-2xl font-bold text-ink-900">{item.value}{item.unit}</div>
                  <div className="text-ink-500 text-sm mt-1">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
          {about?.image_url && (
            <div className="rounded-2xl overflow-hidden shadow-lg aspect-[4/3]">
              <SafeImage src={about.image_url} alt="" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        <div id="contact" className="grid md:grid-cols-2 gap-16">
          <div>
            <h3 className="font-serif text-2xl font-bold text-ink-900 mb-8">{t.pages.contact.contactInfo}</h3>
            <div className="space-y-8">
              {contactInfoData.map((c) => {
                const Icon = iconMap[c.type] || Globe
                return (
                  <div key={c.id} className="flex items-start gap-4">
                    <Icon className="w-8 h-8 text-gold-600 mt-1" />
                    <div>
                      <p className="text-ink-500 text-sm">{c.label}</p>
                      <a
                        href={c.type === 'email' ? `mailto:${c.value}` : c.type === 'phone' ? `tel:${c.value}` : `https://${c.value}`}
                        className="text-xl font-medium text-ink-900 hover:text-gold-600 transition-colors"
                      >
                        {c.value}
                      </a>
                    </div>
                  </div>
                )
              })}
            </div>
            <h3 className="font-serif text-xl font-bold text-ink-900 mt-12 mb-6 flex items-center gap-2">
              <MapPin size={24} className="text-gold-600" />
              {t.pages.contact.globalOffices}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {officesData.map((o, i) => {
                const isHQ = String(o.city).toLowerCase() === 'singapore'
                return (
                  <motion.div
                    key={o.id}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className={`group relative overflow-hidden rounded-2xl border shadow-sm hover:shadow-lg transition-all duration-300 min-h-[100px] flex flex-col ${
                      isHQ
                        ? 'bg-gold-50/80 border-gold-300/60 hover:border-gold-400/80'
                        : 'bg-white border-ink-200/80 hover:border-gold-500/40'
                    }`}
                  >
                    {isHQ && (
                      <div className="absolute top-0 right-0 bg-gold-500/20 text-gold-700 text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-bl-lg">
                        HQ
                      </div>
                    )}
                    <div className="p-6 flex items-start gap-4 flex-1 min-w-0">
                      <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-ink-100 text-gold-600 flex items-center justify-center group-hover:bg-gold-500/15 transition-colors">
                        <Building2 size={22} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-ink-900 text-base break-words">{o.city}</p>
                        <p className="text-ink-500 text-sm mt-0.5 break-words">{o.country}</p>
                        {o.is_24_7 ? (
                          <span className="inline-flex items-center mt-2 text-xs font-medium text-gold-600 bg-gold-500/10 px-2 py-0.5 rounded-full">
                            {t.common.op24}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>

          <ContactForm products={products} />
        </div>
      </div>
    </section>
  )
}
