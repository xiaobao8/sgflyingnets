'use client'

import Link from 'next/link'
import { SafeImage } from './SafeImage'
import { motion } from 'framer-motion'
import { Cloud, Shield, Bot, Building2, ArrowRight } from 'lucide-react'
import type { Service } from '@/lib/content'
import { useTranslations } from '@/lib/i18n/useTranslations'
import { useLocalizedContent } from '@/lib/i18n/useLocalizedContent'

const SERVICES_IMAGE = 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=900&q=85'

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  cloud: Cloud,
  shield: Shield,
  settings: Bot,
  building2: Building2,
}

export function HomeServicesSection({ services }: { services: Service[] }) {
  const t = useTranslations()
  const { content } = useLocalizedContent()
  const merged = services.map((s, i) => ({ ...s, ...(content?.services[i] || {}), _orig: s }))
  const list = merged.filter((s) => (s as { visible?: boolean }).visible !== false)
  return (
    <section className="py-24 md:py-32 bg-cream">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-gold-600/80 text-xs tracking-[0.3em] uppercase">{t.home.servicesSub}</span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-ink-900 mt-4 tracking-tight">
            {t.home.servicesTitle}
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 max-w-5xl mx-auto">
          {list.map((s, i) => {
            const raw = (s as { _orig?: Service })._orig ?? s
            const Icon = icons[raw?.icon || 'cloud'] || Cloud
            return (
              <motion.div
                key={(s as { id?: number }).id ?? raw?.id ?? i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  href="/services"
                  className="group block h-full bg-white rounded-2xl p-10 border border-ink-100 hover:border-gold-500/20 hover:shadow-2xl transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-xl bg-gold-500/10 flex items-center justify-center mb-6 group-hover:bg-gold-500/20 transition-colors">
                    <Icon className="w-7 h-7 text-gold-600" />
                  </div>
                  <h3 className="font-serif text-xl font-semibold text-ink-900 mb-2">{s.title}</h3>
                  <p className="text-ink-500 text-sm leading-relaxed mb-6">{s.subtitle}</p>
                  <span className="inline-flex items-center gap-1 text-gold-600 text-sm font-medium group-hover:gap-2 transition-all">
                    {t.home.learnMore} <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
