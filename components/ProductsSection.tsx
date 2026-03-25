'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import type { Product } from '@/lib/content'

export function ProductsSection({ products }: { products: Product[] }) {
  return (
    <section id="products" className="py-24 md:py-32 bg-cream">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-gold-600 text-sm tracking-[0.2em] uppercase">
            Core Products
          </span>
          <h2 className="font-serif text-4xl md:text-6xl font-bold text-ink-900 mt-4">
            核心产品矩阵
          </h2>
        </motion.div>

        <div className="space-y-24">
          {products.map((p, i) => {
            const features = Array.isArray(p.features) ? p.features : (p.features ? [p.features] : [])
            const highlights = Array.isArray(p.highlights) ? p.highlights : (p.highlights ? [p.highlights] : [])
            const isEven = i % 2 === 0
            return (
              <motion.article
                key={p.id ?? i}
                initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} gap-12 md:gap-20 items-center`}
              >
                <div className="flex-1">
                  <span className="text-ink-400 text-sm">0{i + 1}</span>
                  <h3 className="font-serif text-3xl md:text-4xl font-bold text-ink-900 mt-2 mb-4">
                    {p.name}
                  </h3>
                  <p className="text-gold-600 font-medium mb-4">{p.tagline}</p>
                  <p className="text-ink-600 leading-relaxed mb-6">{p.description}</p>
                  <div className="space-y-3">
                    {features.map((f, j) => (
                      <div key={j} className="flex items-center gap-2 text-ink-600">
                        <span className="w-1.5 h-1.5 bg-gold-500 rounded-full" />
                        {f}
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {highlights.map((h, j) => (
                      <span
                        key={j}
                        className="px-4 py-2 bg-ink-100 text-ink-700 text-sm rounded"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
                <div className={`flex-1 w-full ${isEven ? 'md:pl-8' : 'md:pr-8'}`}>
                  {p.image_url ? (
                    <div className="aspect-video rounded overflow-hidden">
                      <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-ink-200 to-ink-300 rounded flex items-center justify-center text-ink-500 font-serif text-6xl">
                      {p.name.charAt(0)}
                    </div>
                  )}
                </div>
              </motion.article>
            )
          })}
        </div>
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-12 text-center">
          <Link href="/products" className="inline-flex items-center gap-2 text-gold-600 hover:text-gold-700 font-medium">
            了解更多 <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
