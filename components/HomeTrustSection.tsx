'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { SafeImage } from './SafeImage'
import { useTranslations } from '@/lib/i18n/useTranslations'
import { useLocalizedContent } from '@/lib/i18n/useLocalizedContent'
import { Award, Users, Globe, ArrowRight } from 'lucide-react'

const TRUST_IMAGE = '/images/about-us.png'

export function HomeTrustSection({
  stats,
  about,
}: {
  stats: { label: string; value: string; suffix?: string }[]
  about?: { id?: number; title: string; content: string; image_url?: string }[]
}) {
  const t = useTranslations()
  const { content } = useLocalizedContent()
  const aboutFromData = about?.[0]
  const aboutItem = content
    ? { ...aboutFromData, title: content.about.title, content: content.about.content, image_url: aboutFromData?.image_url }
    : aboutFromData
  const statIcons = [Award, Users, Globe]

  return (
    <section id="trust" className="py-24 md:py-32 bg-ink-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-20 items-center">
          {/* 左侧：图片 + 数据 */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 space-y-6"
          >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-ink-700/40">
              <SafeImage src={aboutItem?.image_url || TRUST_IMAGE} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/60 via-transparent to-transparent" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              {stats.map((s, i) => {
                const Icon = statIcons[i] || Award
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="text-center py-4 px-3 bg-ink-900/60 rounded-xl border border-ink-700/30"
                  >
                    <Icon className="w-6 h-6 text-gold-400/80 mx-auto mb-2" />
                    <div className="font-serif text-2xl md:text-3xl font-light text-cream tracking-tight">
                      {s.value}{s.suffix}
                    </div>
                    <div className="text-ink-500 text-xs mt-1">{t.home[i === 0 ? 'statYears' : i === 1 ? 'statClients' : 'statOffices']}</div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* 右侧：关于我们内容 */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7"
          >
            <span className="text-gold-400/80 text-xs tracking-[0.3em] uppercase">{t.nav.about}</span>
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-light text-cream mt-4 mb-8 tracking-tight">
              {aboutItem?.title || t.nav.about}
            </h2>
            <div className="text-ink-400/90 text-base md:text-lg leading-relaxed space-y-6">
              {(aboutItem?.content || '').split('\n\n').map((para, i) => (
                <p key={i} className="font-light">
                  {para}
                </p>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-10"
            >
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-gold-400/90 hover:text-gold-400 text-sm font-medium tracking-wide transition-colors group"
              >
                {t.home.learnFlyingnets}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
