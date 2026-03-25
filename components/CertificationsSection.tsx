'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Award, ArrowRight } from 'lucide-react'
import type { Certification } from '@/lib/content'

export function CertificationsSection({ certifications }: { certifications: Certification[] }) {
  return (
    <section id="certifications" className="py-24 md:py-32 bg-ink-950 text-cream">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-gold-400/80 text-sm tracking-[0.2em] uppercase">
            Industry Certifications
          </span>
          <h2 className="font-serif text-4xl md:text-6xl font-bold mt-4">
            权威资质与战略合作
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {certifications.map((c, i) => (
            <motion.div
              key={c.id ?? i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group relative border border-ink-700/50 hover:border-gold-500/30 p-6 transition-all duration-300"
            >
              {c.logo_url ? (
                <div className="w-16 h-16 mb-4 rounded overflow-hidden flex">
                  <img src={c.logo_url} alt={c.name} className="w-full h-full object-contain" />
                </div>
              ) : (
                <Award className="w-10 h-10 text-gold-400/80 mb-4" />
              )}
              <h3 className="font-serif text-xl font-bold mb-2">{c.name}</h3>
              {c.badge_text && (
                <span className="inline-block px-3 py-1 text-xs bg-gold-500/20 text-gold-400 border border-gold-500/30 mb-3">
                  {c.badge_text}
                </span>
              )}
              <p className="text-ink-400 text-sm leading-relaxed">{c.description}</p>
            </motion.div>
          ))}
        </div>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-12 text-center">
          <Link href="/certifications" className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 font-medium">
            了解更多 <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
