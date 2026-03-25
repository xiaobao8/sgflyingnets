'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import type { AboutSection as AboutType } from '@/lib/content'
import { useTranslations } from '@/lib/i18n/useTranslations'

export function AboutSection({
  about,
  config,
}: {
  about: AboutType[]
  config: Record<string, string>
}) {
  const t = useTranslations()
  const section = about[0]
  if (!section) return null
  const stats = t.pages?.contact?.aboutStats ?? [
    { label: '行业经验', value: '15+', unit: '年' },
    { label: '亚太办公室', value: '7', unit: '个' },
    { label: '专业团队', value: '130+', unit: '人' },
    { label: '服务网络', value: '覆盖', unit: '亚太' },
  ]

  return (
    <section id="about" className="py-24 md:py-32 bg-cream">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-start">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl"
        >
          <span className="text-gold-600 text-sm tracking-[0.2em] uppercase font-display">
            {t.common?.companyOverview ?? 'Company Overview'}
          </span>
          <h2 className="font-serif text-4xl md:text-6xl font-bold text-ink-900 mt-4 mb-8">
            {section.title}
          </h2>
          <div className="text-ink-600 text-lg md:text-xl leading-relaxed font-sans space-y-6">
            {section.content.split('\n\n').map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </motion.div>

        {section.image_url && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-lg overflow-hidden aspect-video"
          >
            <img src={section.image_url} alt="" className="w-full h-full object-cover" />
          </motion.div>
        )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {stats.map((item, i) => (
            <div key={i} className="border-l-2 border-gold-500/50 pl-6">
              <div className="font-serif text-3xl font-bold text-ink-900">
                {item.value}{item.unit}
              </div>
              <div className="text-ink-500 text-sm mt-1">{item.label}</div>
            </div>
          ))}
        </motion.div>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-12">
          <Link href="/about" className="inline-flex items-center gap-2 text-gold-600 hover:text-gold-700 font-medium">
            {t.home.learnMore} <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
