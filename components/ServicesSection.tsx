'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Cloud, Shield, Settings, Building2, ArrowRight } from 'lucide-react'
import type { Service } from '@/lib/content'

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  cloud: Cloud,
  shield: Shield,
  settings: Settings,
  building2: Building2,
}

export function ServicesSection({ services }: { services: Service[] }) {
  return (
    <section id="services" className="py-24 md:py-32 bg-ink-950 text-cream">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-gold-400/80 text-sm tracking-[0.2em] uppercase">
            Core Services
          </span>
          <h2 className="font-serif text-4xl md:text-6xl font-bold mt-4">
            一站式 AI 赋能 IT 解决方案
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((s, i) => {
            const Icon = icons[s.icon || 'cloud'] || Cloud
            const features = Array.isArray(s.features) ? s.features : (s.features ? [s.features] : [])
            return (
              <motion.article
                key={s.id ?? i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative border border-ink-700/50 hover:border-gold-500/30 p-8 transition-all duration-300 hover:bg-ink-900/50"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/5 rounded-full blur-2xl group-hover:bg-gold-500/10 transition-colors" />
                <Icon className="w-12 h-12 text-gold-400 mb-6" />
                <h3 className="font-serif text-2xl font-bold mb-2">{s.title}</h3>
                <p className="text-gold-400/80 text-sm mb-4">{s.subtitle}</p>
                <p className="text-ink-300 text-sm leading-relaxed mb-6">{s.description}</p>
                <div className="flex flex-wrap gap-2">
                  {features.map((f, j) => (
                    <span
                      key={j}
                      className="px-3 py-1 text-xs bg-ink-800/50 text-ink-400 border border-ink-700/50"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </motion.article>
            )
          })}
        </div>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-12 text-center">
          <Link href="/services" className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 font-medium">
            了解更多 <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
