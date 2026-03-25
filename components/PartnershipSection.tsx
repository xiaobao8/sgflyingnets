'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Handshake, ArrowRight } from 'lucide-react'
import type { Partnership } from '@/lib/content'

export function PartnershipSection({ partnerships }: { partnerships: Partnership[] }) {
  return (
    <section id="partnership" className="py-24 md:py-32 bg-ink-950 text-cream">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-gold-400/80 text-sm tracking-[0.2em] uppercase">
            Partnership Invitation
          </span>
          <h2 className="font-serif text-4xl md:text-6xl font-bold mt-4">
            合作邀请
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {partnerships.map((p, i) => {
            const support = Array.isArray(p.support) ? p.support : (p.support ? [p.support] : [])
            const options = Array.isArray(p.options) ? p.options : []
            return (
              <motion.article
                key={p.id ?? i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="border border-ink-700/50 p-8 hover:border-gold-500/30 transition-colors"
              >
                <Handshake className="w-12 h-12 text-gold-400 mb-6" />
                <h3 className="font-serif text-2xl font-bold mb-4">{p.title}</h3>
                <p className="text-ink-400 text-sm mb-4">{p.partner_profile}</p>
                {p.cooperation_content && (
                  <p className="text-ink-300 text-sm mb-4">{p.cooperation_content}</p>
                )}
                {options.length > 0 && (
                  <div className="space-y-2 mb-4">
                    {options.map((o, j) => (
                      <div key={j} className="text-ink-400 text-sm">
                        <span className="text-gold-400 font-medium">{o.name}</span>
                        <span className="ml-2">{o.desc}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  {support.map((s, j) => (
                    <span
                      key={j}
                      className="px-3 py-1 text-xs bg-ink-800/50 text-ink-400 border border-ink-700/50"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </motion.article>
            )
          })}
        </div>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-12 text-center">
          <Link href="/partnership" className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 font-medium">
            了解更多 <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
