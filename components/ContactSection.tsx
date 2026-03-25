'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Phone, Mail, Globe, MapPin, ArrowRight } from 'lucide-react'
import type { Office, ContactInfo } from '@/lib/content'

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  phone: Phone,
  email: Mail,
  website: Globe,
}

export function ContactSection({
  offices,
  contactInfo,
  config,
}: {
  offices: Office[]
  contactInfo: ContactInfo[]
  config: Record<string, string>
}) {
  return (
    <section id="contact" className="py-24 md:py-32 bg-cream border-t border-ink-200">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-gold-600 text-sm tracking-[0.2em] uppercase">
            Contact Us
          </span>
          <h2 className="font-serif text-4xl md:text-6xl font-bold text-ink-900 mt-4">
            安全运营，选择Flyingnets
          </h2>
          <p className="text-ink-600 mt-4 text-lg">
            AI · Security · Cloud — 您的可信赖伙伴
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
            {contactInfo.map((c) => {
              const Icon = icons[c.type] || Globe
              return (
                <div key={c.id} className="flex items-start gap-4">
                  <Icon className="w-6 h-6 text-gold-600 mt-1" />
                  <div>
                    <p className="text-ink-500 text-sm">{c.label}</p>
                    <a
                      href={c.type === 'email' ? `mailto:${c.value}` : c.type === 'phone' ? `tel:${c.value}` : `https://${c.value}`}
                      className="text-ink-900 font-medium hover:text-gold-600 transition-colors"
                    >
                      {c.value}
                    </a>
                  </div>
                </div>
              )
            })}
          </div>

          <div>
            <h3 className="font-serif text-xl font-bold text-ink-900 mb-6 flex items-center gap-2">
              <MapPin size={20} className="text-gold-600" />
              全球办公室
            </h3>
            <div className="flex flex-wrap gap-3">
              {offices.map((o) => (
                <span
                  key={o.id}
                  className="px-4 py-2 bg-ink-100 text-ink-700 rounded-full text-sm flex items-center gap-2"
                >
                  {o.city}
                  {o.is_24_7 ? (
                    <span className="text-xs text-gold-600 font-medium">7×24</span>
                  ) : null}
                </span>
              ))}
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center pt-8 border-t border-ink-200"
        >
          <Link href="/contact" className="inline-flex items-center gap-2 text-gold-600 hover:text-gold-700 font-medium mb-4">
            更多联系信息 <ArrowRight size={18} />
          </Link>
          <p className="text-ink-500 text-sm">
            {config.copyright || '© 2026 Flyingnets Technology Co., Ltd.'}
          </p>
        </motion.div>
      </div>
    </section>
  )
}
