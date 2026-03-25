'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Handshake } from 'lucide-react'
import { useTranslations } from '@/lib/i18n/useTranslations'

export function HomePartnershipSection() {
  const t = useTranslations()
  return (
    <section className="py-24 md:py-32 bg-ink-50">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl p-12 md:p-16 border border-ink-100 shadow-sm"
        >
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">
            <div className="w-20 h-20 rounded-2xl bg-gold-500/10 flex items-center justify-center shrink-0">
              <Handshake className="w-10 h-10 text-gold-600" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <span className="text-gold-600/80 text-xs tracking-[0.3em] uppercase">{t.home.partnershipSub}</span>
              <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl font-light text-ink-900 mt-4 mb-6 tracking-tight">
                {t.home.partnershipTitle}
              </h2>
              <p className="text-ink-500 text-base max-w-2xl mb-8 leading-relaxed">
                {t.home.partnershipTags}
              </p>
              <Link
                href="/partnership"
                className="inline-flex items-center gap-2 px-8 py-3.5 border border-ink-300 text-ink-700 hover:border-gold-500 hover:text-gold-600 hover:bg-gold-500/5 transition-all duration-300 text-sm font-medium rounded-lg"
              >
                {t.home.coopMode} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
